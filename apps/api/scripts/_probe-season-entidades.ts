/**
 * Sonda a SportMonks REAL pra enumerar as estatísticas POR TEMPORADA de jogador, treinador
 * e árbitro — nenhuma das três é ingerida hoje. Responde: os agregados de season vêm PRONTOS
 * da API (statistics.details) ou só teríamos que continuar derivando na mão (lineup_player)?
 * E pro árbitro (mercado de cartões): quantos types existem, com split casa/fora?
 *
 * Uso: cd apps/api && bun run scripts/_probe-season-entidades.ts
 */
import { readFileSync } from "node:fs"
import { join } from "node:path"

import { sm } from "../src/lib/sportmonks"

const SEASON_ID = 25583 // Premier League 25/26

type CoreType = {
  id: number
  name: string
  code: string
  developer_name: string
  model_type: string | null
  stat_group: string | null
}

const coreTypes: CoreType[] = JSON.parse(readFileSync(join(import.meta.dir, "output/core-types.json"), "utf8"))
const typeById = new Map(coreTypes.map((t) => [t.id, t]))

function describeType(id: number): string {
  const t = typeById.get(id)
  if (!t) return `type_id=${id} (não encontrado em core-types.json)`
  return `${id} | ${t.developer_name} | "${t.name}" | model_type=${t.model_type ?? "-"} | stat_group=${t.stat_group ?? "-"}`
}

function valueShape(v: unknown): string {
  if (v === null || v === undefined) return String(v)
  if (typeof v !== "object") return `${typeof v} = ${JSON.stringify(v)}`
  return `object = ${JSON.stringify(v)}`
}

function line(char = "=", n = 100) {
  console.log(char.repeat(n))
}

// ---------------------------------------------------------------------------
type StatDetail = { id: number; type_id: number; value: unknown }
type SeasonStatistics = { id: number; season_id: number; details?: StatDetail[] }
type PlayerWithStats = { id: number; display_name?: string; statistics?: SeasonStatistics[] }
type CoachWithStats = { id: number; name?: string; statistics?: SeasonStatistics[] }
type RefereeWithStats = { id: number; name?: string; statistics?: SeasonStatistics[] }
// team.coaches[] é a relação time<->treinador (o campo `id` aqui é o id DA RELAÇÃO, não do
// treinador!). O id real do treinador — o que /coaches/{id} espera — está em `coach_id`.
type TeamWithCoaches = { id: number; name?: string; coaches?: { id: number; coach_id: number; active?: boolean }[] }

async function probeHttpAware<T>(label: string, path: string): Promise<T | undefined> {
  try {
    const data = await sm<T>(path)
    console.log(`[OK] ${label}`)
    return data
  } catch (err) {
    console.log(`[FAIL] ${label} → ${err instanceof Error ? err.message : String(err)}`)
    return undefined
  }
}

function reportStatistics(entityLabel: string, statistics: SeasonStatistics[] | undefined, xgTypeIds: number[] = []) {
  if (!statistics || statistics.length === 0) {
    console.log(`  (statistics vazio ou ausente)`)
    return
  }
  console.log(`  ${statistics.length} season-stat record(s)`)
  for (const stat of statistics) {
    const details = stat.details ?? []
    console.log(`  -- season_id=${stat.season_id} (statistic.id=${stat.id}) | ${details.length} details --`)
    const sorted = [...details].sort((a, b) => a.type_id - b.type_id)
    for (const d of sorted) {
      console.log(`     ${describeType(d.type_id)} => ${valueShape(d.value)}`)
    }
    if (xgTypeIds.length > 0) {
      console.log(`  -- checagem xG (types ${xgTypeIds.join(",")}) --`)
      for (const id of xgTypeIds) {
        const found = details.find((d) => d.type_id === id)
        console.log(`     type ${id}: ${found ? `PRESENTE => ${valueShape(found.value)}` : "AUSENTE"}`)
      }
    }
  }
}

// ---------------------------------------------------------------------------
line()
console.log("1) JOGADOR — /players/{id}?include=statistics.details.type&filters=playerStatisticSeasons:25583")
line()

const PLAYERS: { name: string; id: number }[] = [
  { name: "Mohamed Salah", id: 4125 },
  { name: "Erling Haaland", id: 154421 },
  { name: "David Raya (GK)", id: 3130 },
]
const XG_TYPE_IDS = [5304, 9685, 9706]

for (const p of PLAYERS) {
  line("-")
  console.log(`Jogador: ${p.name} (sportmonks_player_id=${p.id})`)
  const data = await probeHttpAware<PlayerWithStats>(
    `player ${p.id}`,
    `/players/${p.id}?include=statistics.details.type&filters=playerStatisticSeasons:${SEASON_ID}`,
  )
  if (data) reportStatistics("player", data.statistics, XG_TYPE_IDS)
}

// ---------------------------------------------------------------------------
line()
console.log("2) TREINADOR — /coaches/{id}?include=statistics.details.type&filters=coachStatisticSeasons:25583")
line()

// Tabela `coach` local não tem sportmonks_coach_id preenchido (0 linhas). Descobre um coach_id
// real via /teams/{id}?include=coaches (times reais da Premier League no nosso banco).
const TEAMS_FOR_COACH: { name: string; id: number }[] = [
  { name: "Arsenal", id: 19 },
  { name: "Liverpool", id: 8 },
  { name: "Manchester City", id: 9 },
]

const coachIds: { teamName: string; coachId: number; active?: boolean }[] = []
for (const t of TEAMS_FOR_COACH) {
  const data = await probeHttpAware<TeamWithCoaches>(`team ${t.id} (${t.name}) include=coaches`, `/teams/${t.id}?include=coaches`)
  const coaches = data?.coaches ?? []
  console.log(`  ${t.name}: ${coaches.length} coach(es) => ${coaches.map((c) => `coach_id=${c.coach_id} (relation_id=${c.id}, active=${c.active})`).join(", ") || "(nenhum)"}`)
  for (const c of coaches) coachIds.push({ teamName: t.name, coachId: c.coach_id, active: c.active })
}

const EXPECTED_COACH_TYPES = [59, 83, 84, 85, 214, 215, 216, 188, 9676]
// Só os treinadores ATIVOS no time (evita ids de coach interino/histórico sem stats na season atual)
const activeCoaches = coachIds.filter((c) => c.active !== false)
for (const c of activeCoaches) {
  line("-")
  console.log(`Treinador: coach_id=${c.coachId} (time=${c.teamName})`)

  const coachData = await probeHttpAware<{ display_name?: string; name?: string }>(`coach ${c.coachId} (sem include)`, `/coaches/${c.coachId}`)
  console.log(`  nome: ${coachData?.display_name ?? coachData?.name ?? "?"}`)

  console.log(`  [2a] COM filters=coachStatisticSeasons:${SEASON_ID}`)
  const dataSeason = await probeHttpAware<CoachWithStats>(
    `coach ${c.coachId} season ${SEASON_ID}`,
    `/coaches/${c.coachId}?include=statistics.details.type&filters=coachStatisticSeasons:${SEASON_ID}`,
  )
  if (dataSeason) reportStatistics("coach (season filtrada)", dataSeason.statistics)

  console.log(`  [2b] SEM filtro de season (carreira toda, só pra ver o teto de types)`)
  const dataAll = await probeHttpAware<CoachWithStats>(`coach ${c.coachId} sem season`, `/coaches/${c.coachId}?include=statistics.details.type`)
  if (dataAll) {
    console.log(`  ${dataAll.statistics?.length ?? 0} season-stat record(s) na carreira toda (não expandido, só contagem)`)
  }

  const allTypeIds = new Set(
    [...(dataSeason?.statistics ?? []), ...(dataAll?.statistics ?? [])].flatMap((s) => (s.details ?? []).map((d) => d.type_id)),
  )
  const missing = EXPECTED_COACH_TYPES.filter((id) => !allTypeIds.has(id))
  const extra = [...allTypeIds].filter((id) => !EXPECTED_COACH_TYPES.includes(id))
  console.log(`  doc esperava [${EXPECTED_COACH_TYPES.join(",")}] | faltando=[${missing.join(",")}] | extra=[${extra.join(",")}]`)
}

// ---------------------------------------------------------------------------
line()
console.log("3) ÁRBITRO — /referees/{id}?include=statistics.details.type  (o mercado de cartões)")
line()

const REFEREES: { name: string; id: number }[] = [
  { name: "Anderson Daronco", id: 13631 },
  { name: "Paul Tierney", id: 15294 },
  { name: "Rodrigo José Pereira de Lima", id: 51585 },
]

for (const r of REFEREES) {
  line("-")
  console.log(`Árbitro: ${r.name} (sportmonks_referee_id=${r.id})`)

  console.log(`  [3a] SEM filtro de season (carreira toda)`)
  const dataAll = await probeHttpAware<RefereeWithStats>(
    `referee ${r.id} sem season`,
    `/referees/${r.id}?include=statistics.details.type`,
  )
  if (dataAll) reportStatistics("referee (all seasons)", dataAll.statistics)

  console.log(`  [3b] COM filters=refereeStatisticSeasons:${SEASON_ID}`)
  const dataSeason = await probeHttpAware<RefereeWithStats>(
    `referee ${r.id} season ${SEASON_ID}`,
    `/referees/${r.id}?include=statistics.details.type&filters=refereeStatisticSeasons:${SEASON_ID}`,
  )
  if (dataSeason) reportStatistics("referee (season filtrada)", dataSeason.statistics)

  // stat_group (home/away) — reune todos os type_ids vistos nesse árbitro e mostra o stat_group
  // de cada um via core-types.json, pra responder se existe split casa/fora.
  const allDetails = [...(dataAll?.statistics ?? []), ...(dataSeason?.statistics ?? [])].flatMap((s) => s.details ?? [])
  const uniqueTypeIds = [...new Set(allDetails.map((d) => d.type_id))].sort((a, b) => a - b)
  console.log(`  type_ids únicos observados (${uniqueTypeIds.length}): ${uniqueTypeIds.join(", ")}`)
  const withStatGroup = uniqueTypeIds.filter((id) => typeById.get(id)?.stat_group)
  console.log(
    `  types com stat_group preenchido: ${withStatGroup.length ? withStatGroup.map((id) => `${id}(${typeById.get(id)?.stat_group})`).join(", ") : "NENHUM"}`,
  )
}

line()
console.log("FIM DA SONDAGEM")
line()

process.exit(0)
