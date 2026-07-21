import { and, eq, ne } from "drizzle-orm"

import { db } from "./client"
import { league, match, season, team } from "./schema"
import { matchSlug, slugify } from "./slug"
import { fetchRichByIds, ingestFixtures } from "./sync-ingest"
import { kickoffInTimeZone } from "../lib/kickoff"
import { sm } from "../lib/sportmonks"
import { extractScore, type SportmonksScore } from "../lib/sportmonks-scores"

// Sync de COPA (mata-mata) da SportMonks pro Postgres — FA Cup (24/25919), Carabao (27/25654). Roda no Bun:
//   bun run src/db/sync-cup.ts <leagueId> <seasonId> <code> [proper]
//   ex.: bun run src/db/sync-cup.ts 27 25654 CARA        (Carabao 25/26, tudo)
//        bun run src/db/sync-cup.ts 24 25919 FAC proper  (FA Cup 25/26, só stages "proper" type_id=224)
//
// Diferente da liga (sync-sportmonks.ts): copa NÃO tem tabela, então os times nascem dos `participants`
// do confronto (não das standings), e a "rodada" é a STAGE ("Quarter-finals") ordenada por `sort_order`.
// Fonte única: GET /schedules/seasons/:id → stages (sort_order/type_id) + fixtures (participants+scores+winner).
// Idempotente (upsert por sportmonksFixtureId/sportmonksTeamId). Enxuto: time+logo(CDN)+match com os campos
// de bracket (stage/leg/aggregate/resultInfo/winner/placeholder) — sem lineup/trend/commentary (não precisam).
// Logo do time = URL do CDN da SportMonks (evita centenas de uploads R2 de clubes não-liga); times JÁ
// existentes (da PL) preservam o logo R2 deles (o on-conflict NÃO toca em logoUrl).

const LEAGUE_ID = Number(process.argv[2] ?? 27)
const SEASON_ID = Number(process.argv[3] ?? 25654)
const CODE = (process.argv[4] ?? "CARA").toUpperCase()
const PROPER_ONLY = process.argv[5] === "proper" // só stages type_id=224 (descarta qualifying 225)
const TIMEZONE = "Europe/London" // FA Cup/Carabao são inglesas; o passo lean e o rico têm de concordar @feature LIG-012

const STAGE_PROPER = 224 // "Round 3", "Quarter-finals"… (onde entram os clubes da liga)

type SmLeague = { id: number; name: string; image_path: string; country?: { name: string } }
type SmSeason = { id: number; name: string; tie_breaker_rule_id: number | null }
type SmParticipant = {
  id: number
  name: string
  short_code?: string
  image_path?: string
  meta: { location: "home" | "away"; winner: boolean | null; position?: number }
}
type SmCupFixture = {
  id: number
  name: string
  starting_at: string
  stage_id: number
  aggregate_id: number | null
  leg?: string | null
  result_info?: string | null
  placeholder?: boolean
  state_id?: number
  participants?: SmParticipant[]
  scores?: SportmonksScore[]
}
type SmStage = {
  id: number
  type_id: number
  name: string
  sort_order: number
  rounds?: { fixtures?: SmCupFixture[] }[]
  fixtures?: SmCupFixture[]
}

async function main() {
  // 1) League + season ----------------------------------------------------------
  const apiLeague = await sm<SmLeague>(`/leagues/${LEAGUE_ID}?include=country`)
  const apiSeason = await sm<SmSeason>(`/seasons/${SEASON_ID}`)
  console.log(`copa: ${apiLeague.name} (${apiSeason.name}) · code=${CODE}${PROPER_ONLY ? " · só proper(224)" : " · tudo"}`)

  const leagueValues = {
    code: CODE,
    sportmonksLeagueId: apiLeague.id,
    sportmonksSeasonId: SEASON_ID,
    name: apiLeague.name,
    country: apiLeague.country?.name ?? "—",
    season: apiSeason.name,
    type: "cup", // marca a liga como mata-mata → o front renderiza bracket no lugar da tabela
    logoUrl: apiLeague.image_path, // CDN da SportMonks (não R2 — copa é leitura, logo público serve)
  }
  await db.insert(league).values(leagueValues).onConflictDoUpdate({ target: league.code, set: leagueValues })

  const seasonValues = {
    sportmonksSeasonId: SEASON_ID,
    leagueCode: CODE,
    name: apiSeason.name,
    startYear: Number(apiSeason.name.slice(0, 4)),
    isCurrent: true,
    // Seletor da regra de desempate declarada pela fonte; copa costuma vir 573 ("None"). @feature LIG-017
    sportmonksTieBreakerRuleId: apiSeason.tie_breaker_rule_id ?? null,
  }
  const [seasonRow] = await db
    .insert(season)
    .values(seasonValues)
    .onConflictDoUpdate({ target: season.sportmonksSeasonId, set: seasonValues })
    .returning({ id: season.id })
  const seasonId = seasonRow!.id
  await db
    .update(season)
    .set({ isCurrent: false })
    .where(and(eq(season.leagueCode, CODE), ne(season.sportmonksSeasonId, SEASON_ID)))

  // 2) Schedules → stages + fixtures --------------------------------------------
  // Uma chamada traz toda a estrutura: cada stage com sort_order/type_id e os confrontos já com
  // participants (logo + meta.winner) e scores embutidos. Fixtures podem vir em stage.fixtures OU
  // aninhados em stage.rounds[].fixtures — colher dos dois.
  const stages = await sm<SmStage[]>(`/schedules/seasons/${SEASON_ID}`)
  const used = PROPER_ONLY ? stages.filter((s) => s.type_id === STAGE_PROPER) : stages
  const fixturesByStage: { stage: SmStage; fixture: SmCupFixture }[] = []
  for (const st of used) {
    const fs = [...(st.fixtures ?? []), ...(st.rounds ?? []).flatMap((r) => r.fixtures ?? [])]
    for (const f of fs) fixturesByStage.push({ stage: st, fixture: f })
  }
  console.log(`stages: ${used.length}/${stages.length} · fixtures: ${fixturesByStage.length}`)

  // 2b) Jogos de 2 MÃOS (ida/volta — ex.: semifinal do Carabao) NÃO vêm no /schedules (a stage volta
  // vazia). Busca cada stage "proper" DIRETO (/stages/:id) e mescla os fixtures que faltam — senão a semi
  // fica "sem dados" e o chaveamento pula a fase. Cada perna já traz aggregate_id + meta.winner (agregado).
  const haveFixture = new Set(fixturesByStage.map((x) => x.fixture.id))
  for (const st of used) {
    if (st.type_id !== STAGE_PROPER) continue
    try {
      const full = await sm<{ fixtures?: SmCupFixture[] }>(`/stages/${st.id}?include=fixtures.participants;fixtures.scores`)
      for (const f of full.fixtures ?? [])
        if (!haveFixture.has(f.id)) {
          haveFixture.add(f.id)
          fixturesByStage.push({ stage: st, fixture: f })
        }
    } catch { /* stage sem fixtures extras */ }
  }
  console.log(`após merge de 2 mãos (por stage): ${fixturesByStage.length} fixtures`)

  // 3) Times (dos participants — copa não tem standings) -------------------------
  const teamsById = new Map<number, SmParticipant>()
  for (const { fixture } of fixturesByStage)
    for (const p of fixture.participants ?? []) teamsById.set(p.id, p)
  const teams = [...teamsById.values()]
  // slug de time é UNIQUE; dois clubes distintos podem colidir no slug (muito clube pequeno na FA Cup) →
  // desambígua com o id da SportMonks quando o slug-base já é de OUTRO time.
  const slugSeen = new Map<string, number>() // slugBase → sportmonksTeamId dono
  const teamIdBySm = new Map<number, string>()
  const teamNameBySm = new Map<number, string>()
  for (const p of teams) {
    teamNameBySm.set(p.id, p.name)
    const base = slugify(p.name)
    const owner = slugSeen.get(base)
    const slug = owner == null || owner === p.id ? base : `${base}-${p.id}`
    if (owner == null) slugSeen.set(base, p.id)
    const [r] = await db
      .insert(team)
      .values({
        sportmonksTeamId: p.id,
        name: p.name,
        slug,
        shortCode: p.short_code ?? null,
        logoUrl: p.image_path ?? null, // CDN; on-conflict NÃO sobrescreve (times da PL mantêm o R2 deles)
      })
      .onConflictDoUpdate({ target: team.sportmonksTeamId, set: { name: p.name, shortCode: p.short_code ?? null } })
      .returning({ id: team.id })
    teamIdBySm.set(p.id, r!.id)
  }
  console.log(`times: ${teams.length}`)

  // 4) Matches (com campos de bracket) ------------------------------------------
  let nMatches = 0
  for (const { stage, fixture: f } of fixturesByStage) {
    const home = f.participants?.find((p) => p.meta.location === "home")
    const away = f.participants?.find((p) => p.meta.location === "away")
    if (!home || !away) continue // placeholder / TBD → sem confronto resolvido
    const homeTeamId = teamIdBySm.get(home.id)
    const awayTeamId = teamIdBySm.get(away.id)
    if (!homeTeamId || !awayTeamId) continue
    const winner = f.participants?.find((p) => p.meta.winner === true)
    const winnerTeamId = winner ? teamIdBySm.get(winner.id) ?? null : null
    const score = extractScore(f.scores)
    // slug com STAGE + o fixtureId no fim → único mesmo com clubes de nome repetido / replays (a FA Cup
    // tem centenas de times não-liga; só stage+times colide). @feature LIG-009
    const slug = `${matchSlug(apiLeague.name, `${apiSeason.name} ${stage.name}`, teamNameBySm.get(home.id) ?? "", teamNameBySm.get(away.id) ?? "")}-${f.id}`
    const values = {
      sportmonksFixtureId: f.id,
      leagueCode: CODE,
      round: 0, // copa usa stage, não round numérico
      stageId: stage.id,
      stageName: stage.name,
      stageOrder: stage.sort_order,
      stageTypeId: stage.type_id,
      leg: f.leg ?? null,
      aggregateId: f.aggregate_id ?? null,
      resultInfo: f.result_info ?? null,
      winnerTeamId,
      isPlaceholder: f.placeholder ?? false,
      name: f.name,
      slug,
      ...kickoffInTimeZone(f.starting_at, TIMEZONE),
      homeTeamId,
      awayTeamId,
      seasonId,
      ...score,
      status: score.ftHome != null ? "FT" : null,
    }
    await db.insert(match).values(values).onConflictDoUpdate({ target: match.sportmonksFixtureId, set: values })
    nMatches += 1
  }
  console.log(`matches: ${nMatches}`)

  // --- Passo RICO: enriquece as rodadas "proper" (type 224 — onde jogam os clubes de verdade) com o
  // MESMO dado da PL, via a pipeline compartilhada: venue, escalação (+stats por jogador), stats de time,
  // trends (momentum), clima, gols, cartões, desfalques e narração. As qualifying ficam só no bracket.
  const properIds = fixturesByStage.filter(({ stage }) => stage.type_id === STAGE_PROPER).map(({ fixture }) => fixture.id)
  console.log(`enriquecendo ${properIds.length} jogos proper (venue/escalação/stats/trends/clima/gols/narração)…`)
  const rich = await fetchRichByIds(properIds, true)
  const counts = await ingestFixtures({
    fixtures: rich,
    teamIdBySm,
    seasonId,
    code: CODE,
    timezone: TIMEZONE,
    // Colunas de copa do match. Defensivo: só sobrescreve stage/winner quando o fetch rico trouxe (senão
    // preserva o que o passo lean já gravou — não zera o bracket).
    matchFields: (f, ctx) => {
      const fields: Record<string, unknown> = {
        round: 0,
        name: f.name,
        slug: `${matchSlug(apiLeague.name, `${apiSeason.name} ${f.stage?.name ?? ""}`, teamNameBySm.get(ctx.homeSmId) ?? "", teamNameBySm.get(ctx.awaySmId) ?? "")}-${f.id}`,
        leg: f.leg ?? null,
        aggregateId: f.aggregate_id ?? null,
        resultInfo: f.result_info ?? null,
        isPlaceholder: f.placeholder ?? false,
      }
      if (f.stage) {
        fields.stageId = f.stage.id
        fields.stageName = f.stage.name
        fields.stageOrder = f.stage.sort_order ?? null
        fields.stageTypeId = f.stage.type_id ?? null
      }
      const win = f.participants.find((p) => p.meta.winner === true)
      if (win) fields.winnerTeamId = teamIdBySm.get(win.id) ?? null
      return fields
    },
  })
  console.log(`rico: ${JSON.stringify(counts)}`)
  console.log("✓ sync copa done")
}

main().then(() => process.exit(0))
