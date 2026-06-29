/**
 * Builds the EVIDENCE PROMPT for an expected-goals prognosis of one match, to be fed to a reasoning
 * LLM (DeepSeek-v4-pro, modo reasoning/ultra). It does NOT call the model — it assembles the dossier
 * (goals/game up to the date, with/without each injured player, half splits, a Poisson base rate) so
 * you can read and audit the prompt before sending it.
 *
 * Run:  bun run scripts/prognosis-prompt.ts <matchId>
 * Out:  prints the prompt to stdout AND writes scripts/output/prognosis-<matchId>.md
 *
 * Architecture (decidido com o João): código calcula a BASE RATE (Poisson força ataque×defesa) e a
 * LLM faz só a camada de AJUSTE qualitativo. Anti-vazamento: tudo é cortado em `match.date` (CUTOFF),
 * então o prompt é exatamente o que existiria PRÉ-JOGO.
 */
import { and, eq, inArray, isNotNull } from "drizzle-orm"

import { db } from "../src/db/client"
import { goal, injury, lineup, lineupPlayer, match, player, standing, team, venue } from "../src/db/schema"

const MATCH_ID = process.argv[2] ?? "77a4255a-3e44-4fd9-a133-b13ca0898a91"

// Below this many "com ele"/"sem ele" games, the WITH/WITHOUT scoring rate is noise — flagged, not trusted.
const LOW_SAMPLE = 6
// Haversine distance (km) between two lat/long — feeds the travel/fatigue note when both venues are known.
function haversineKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371
  const dLat = ((bLat - aLat) * Math.PI) / 180
  const dLng = ((bLng - aLng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(s)))
}

const m = await db.query.match.findFirst({ where: eq(match.id, MATCH_ID) })
if (!m) throw new Error(`match ${MATCH_ID} not found`)
const CUTOFF = m.date // tudo estritamente antes disto entra no modelo

const [home] = await db.select().from(team).where(eq(team.id, m.homeTeamId))
const [away] = await db.select().from(team).where(eq(team.id, m.awayTeamId))
if (!home || !away) throw new Error("team not found")
const [matchVenue] = m.venueId ? await db.select().from(venue).where(eq(venue.id, m.venueId)) : []

// Todos os jogos COM resultado da liga, antes do cutoff (sem o próprio jogo → sem vazamento).
const playedAll = await db
  .select()
  .from(match)
  .where(and(eq(match.leagueCode, m.leagueCode), isNotNull(match.ftHome)))
const played = playedAll.filter((p) => p.date < CUTOFF)

type Row = (typeof played)[number]
const teamMatches = (id: string): Row[] =>
  played.filter((p) => p.homeTeamId === id || p.awayTeamId === id).sort((a, b) => a.date.localeCompare(b.date))
const goalsFor = (p: Row, id: string) => (p.homeTeamId === id ? p.ftHome : p.ftAway) ?? 0
const goalsAgainst = (p: Row, id: string) => (p.homeTeamId === id ? p.ftAway : p.ftHome) ?? 0

// Gols marcados/sofridos por jogo num recorte (all/home/away) + os totais absolutos.
function avg(rows: Row[], id: string) {
  if (!rows.length) return { n: 0, gf: 0, ga: 0, totalGf: 0, totalGa: 0 }
  const totalGf = rows.reduce((s, p) => s + goalsFor(p, id), 0)
  const totalGa = rows.reduce((s, p) => s + goalsAgainst(p, id), 0)
  return {
    n: rows.length,
    gf: +(totalGf / rows.length).toFixed(2),
    ga: +(totalGa / rows.length).toFixed(2),
    totalGf,
    totalGa,
  }
}

// Split por tempo (do HT vs FT): gols marcados/sofridos no 1º e no 2º tempo, por jogo.
function halfSplit(rows: Row[], id: string) {
  let f1 = 0, f2 = 0, a1 = 0, a2 = 0
  for (const p of rows) {
    const isHome = p.homeTeamId === id
    const htFor = (isHome ? p.htHome : p.htAway) ?? 0
    const htAg = (isHome ? p.htAway : p.htHome) ?? 0
    f1 += htFor; a1 += htAg
    f2 += goalsFor(p, id) - htFor; a2 += goalsAgainst(p, id) - htAg
  }
  const n = rows.length || 1
  return {
    scored1: +(f1 / n).toFixed(2), scored2: +(f2 / n).toFixed(2),
    conceded1: +(a1 / n).toFixed(2), conceded2: +(a2 / n).toFixed(2),
  }
}

// Faixas de 15 min. Um gol de 90+x cai na última; 45+x guardado como 46/47 cai em "46-60" (imprecisão aceita).
const BANDS = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90"] as const
const bandOf = (min: number) => (min <= 15 ? 0 : min <= 30 ? 1 : min <= 45 ? 2 : min <= 60 ? 3 : min <= 75 ? 4 : 5)

// Perfil de timing do time na temporada: gols MARCADOS e SOFRIDOS por faixa de 15 min (contagem
// absoluta + por jogo). `goal.teamId` = time beneficiado, então a atribuição marcou/sofreu também
// trata gol contra corretamente. Só conta gols com minuto conhecido.
async function timing(teamId: string) {
  const ids = teamMatches(teamId).map((p) => p.id)
  const n = ids.length || 1
  const rows = ids.length
    ? await db.select({ minute: goal.minute, teamId: goal.teamId }).from(goal).where(inArray(goal.matchId, ids))
    : []
  const scored = [0, 0, 0, 0, 0, 0]
  const conceded = [0, 0, 0, 0, 0, 0]
  for (const g of rows) {
    if (g.minute == null) continue
    const b = bandOf(g.minute)
    if (g.teamId === teamId) scored[b]!++
    else conceded[b]!++
  }
  const perGame = (a: number[]) => a.map((x) => +(x / n).toFixed(2))
  return {
    n,
    scored, conceded,
    scoredPg: perGame(scored), concededPg: perGame(conceded),
    concededFirstHalf: conceded[0]! + conceded[1]! + conceded[2]!,
    scoredFirstHalf: scored[0]! + scored[1]! + scored[2]!,
  }
}

// Conjunto de matchIds em que o jogador REALMENTE jogou (titular OU minutos > 0), pré-cutoff.
async function playedByPlayer(playerId: string, teamId: string): Promise<Set<string>> {
  const rows = await db
    .select({ matchId: lineup.matchId, starter: lineupPlayer.starter, mins: lineupPlayer.minutesPlayed })
    .from(lineupPlayer)
    .innerJoin(lineup, eq(lineupPlayer.lineupId, lineup.id))
    .where(and(eq(lineupPlayer.playerId, playerId), eq(lineup.teamId, teamId)))
  const ids = new Set<string>()
  for (const r of rows) if (r.starter || (r.mins ?? 0) > 0) ids.add(r.matchId)
  return ids
}

type AbsenceLine = {
  name: string; reason: string | null
  goals: number; assists: number // contribuição direta (G+A) na liga até a data
  pctGoals: number // % dos gols do time que ESTE jogador marcou (o que o ataque perde)
  pctInvolve: number // % dos gols do time em que ele participou (gol OU assistência)
  withN: number; withGf: number; withoutN: number; withoutGf: number; dropPct: number
  confound: boolean // sem G+A direta OU amostra pequena → with/without não confiável
}

// Para cada desfalque do jogo: G+A direta até a data, % do ataque do time que ele representa, e
// gols/jogo do TIME com ele vs sem ele. `teamTotalGoals` = gols do time (sem own goal) até a data.
async function absences(teamId: string, teamTotalGoals: number): Promise<AbsenceLine[]> {
  const inj = await db.select().from(injury).where(and(eq(injury.matchId, MATCH_ID), eq(injury.teamId, teamId)))
  const ms = teamMatches(teamId)
  const out: AbsenceLine[] = []
  for (const i of inj) {
    const [p] = await db.select().from(player).where(eq(player.id, i.playerId))
    // G+A direta até a data, dos jogos pré-cutoff do time.
    const ids = new Set(ms.map((x) => x.id))
    const playerGoals = await db.query.goal.findMany({ where: (g, { eq }) => eq(g.playerId, i.playerId) })
    const playerAssists = await db.query.goal.findMany({ where: (g, { eq }) => eq(g.assistId, i.playerId) })
    const goals = playerGoals.filter((g) => ids.has(g.matchId) && g.type !== "own").length
    const assists = playerAssists.filter((g) => ids.has(g.matchId)).length

    const playedIds = await playedByPlayer(i.playerId, teamId)
    const withRows = ms.filter((x) => playedIds.has(x.id))
    const withoutRows = ms.filter((x) => !playedIds.has(x.id))
    const w = avg(withRows, teamId)
    const wo = avg(withoutRows, teamId)
    const dropPct = w.gf ? Math.round((1 - wo.gf / w.gf) * 100) : 0
    out.push({
      name: (p?.name ?? "?").trim(), reason: i.reason,
      goals, assists,
      pctGoals: teamTotalGoals ? Math.round((goals / teamTotalGoals) * 100) : 0,
      pctInvolve: teamTotalGoals ? Math.round(((goals + assists) / teamTotalGoals) * 100) : 0,
      withN: w.n, withGf: w.gf, withoutN: wo.n, withoutGf: wo.gf, dropPct,
      // Confound guard: zero contribuição direta (Traoré) OU amostra "sem" pequena (Stach 8j) → não confiar no with/without.
      confound: goals + assists === 0 || w.n < LOW_SAMPLE || wo.n < LOW_SAMPLE,
    })
  }
  // ordena por contribuição direta (G+A) desc — o desfalque que mais pesa primeiro
  return out.sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
}

// ---- Base rate Poisson (força ataque × fraqueza defesa, específica por mando) ----
const leagueHomeAvg = +(played.reduce((s, p) => s + (p.ftHome ?? 0), 0) / played.length).toFixed(3)
const leagueAwayAvg = +(played.reduce((s, p) => s + (p.ftAway ?? 0), 0) / played.length).toFixed(3)
const homeHome = avg(teamMatches(home.id).filter((p) => p.homeTeamId === home.id), home.id)
const awayAway = avg(teamMatches(away.id).filter((p) => p.awayTeamId === away.id), away.id)
// λ_home = ataque(casa) do mandante × (defesa(fora) do visitante / média de gols de mandante na liga)
const lambdaHome = +(homeHome.gf * (awayAway.ga / leagueHomeAvg)).toFixed(2)
const lambdaAway = +(awayAway.gf * (homeHome.ga / leagueAwayAvg)).toFixed(2)

// Rest days (in-league): dias desde o último jogo de cada lado antes deste.
function restDays(teamId: string): number | null {
  const prev = teamMatches(teamId).at(-1)
  if (!prev) return null
  return Math.round((Date.parse(CUTOFF) - Date.parse(prev.date)) / 86_400_000)
}

const homeAll = avg(teamMatches(home.id), home.id)
const awayAll = avg(teamMatches(away.id), away.id)
const homeAbs = await absences(home.id, homeAll.totalGf)
const awayAbs = await absences(away.id, awayAll.totalGf)
const homeHalf = halfSplit(teamMatches(home.id), home.id)
const awayHalf = halfSplit(teamMatches(away.id), away.id)
const homeTiming = await timing(home.id)
const awayTiming = await timing(away.id)

// Distância de viagem do visitante (se ambos os estádios têm geo) — proxy de fadiga.
let travelKm: number | null = null
if (matchVenue?.latitude && matchVenue.longitude) {
  const awayHomeMatch = teamMatches(away.id).filter((p) => p.homeTeamId === away.id).at(-1)
  if (awayHomeMatch?.venueId) {
    const [av] = await db.select().from(venue).where(eq(venue.id, awayHomeMatch.venueId))
    if (av?.latitude && av.longitude)
      travelKm = haversineKm(+matchVenue.latitude, +matchVenue.longitude, +av.latitude, +av.longitude)
  }
}

// ---- Tabela pré-jogo + motivação de zona (anti-vazamento) ----
// A tabela oficial `standing` é a foto FINAL da season → usá-la aqui vazaria o futuro. Recomputo a
// classificação só com `played` (jogos estritamente antes da data) = a foto real pré-jogo. Da tabela
// oficial leio SÓ o nº de vagas de cada zona (regra da competição, estável o ano todo) pra saber ONDE
// ficam as linhas de rebaixamento/Champions — nunca a posição real de ninguém, então não há vazamento.
type Line = { teamId: string; points: number; gd: number; gf: number }
function preMatchTable(): Line[] {
  const acc = new Map<string, Line>()
  const at = (id: string) => {
    let l = acc.get(id)
    if (!l) {
      l = { teamId: id, points: 0, gd: 0, gf: 0 }
      acc.set(id, l)
    }
    return l
  }
  for (const p of played) {
    const h = at(p.homeTeamId)
    const a = at(p.awayTeamId)
    const hg = p.ftHome ?? 0
    const ag = p.ftAway ?? 0
    h.gf += hg
    a.gf += ag
    h.gd += hg - ag
    a.gd += ag - hg
    if (hg > ag) h.points += 3
    else if (hg < ag) a.points += 3
    else {
      h.points++
      a.points++
    }
  }
  // Desempate PL: pontos → saldo → gols pró (nome omitido — não muda a linha de zona na prática).
  return [...acc.values()].sort((x, y) => y.points - x.points || y.gd - x.gd || y.gf - x.gf)
}
const table = preMatchTable()
const posOf = (id: string) => {
  const i = table.findIndex((l) => l.teamId === id)
  return i < 0 ? null : i + 1
}
const lineOf = (id: string) => table.find((l) => l.teamId === id) ?? null

// Nº de vagas por zona, lido da tabela oficial (só a CONTAGEM — é regra, não resultado).
const zoneRows = await db
  .select({ zone: standing.zone })
  .from(standing)
  .where(eq(standing.leagueCode, m.leagueCode))
const totalTeams = zoneRows.length
const relegationCount = zoneRows.filter((z) => z.zone === "relegation").length
const championsCount = zoneRows.filter((z) => z.zone === "champions").length
// Vagas europeias = Champions + Europa + Conference (qualquer competição continental).
const europeanCount =
  championsCount +
  zoneRows.filter((z) => z.zone === "europa").length +
  zoneRows.filter((z) => z.zone === "conference").length
// Pontos das linhas na foto pré-jogo: 1ª vaga segura, última de Champions, última europeia.
const safetyLinePts = totalTeams && relegationCount ? (table[totalTeams - relegationCount - 1]?.points ?? null) : null
const championsLinePts = championsCount ? (table[championsCount - 1]?.points ?? null) : null
const europeanLinePts = europeanCount ? (table[europeanCount - 1]?.points ?? null) : null

// Jogos restantes (INCLUINDO este) de cada time — base do alcance matemático. Conta fixtures (com ou
// sem resultado) na data deste jogo ou depois. Sem o filtro isNotNull: jogos futuros entram aqui.
const allFixtures = await db
  .select({ h: match.homeTeamId, a: match.awayTeamId, date: match.date })
  .from(match)
  .where(eq(match.leagueCode, m.leagueCode))
const gamesRemaining = (id: string) => allFixtures.filter((f) => (f.h === id || f.a === id) && f.date >= CUTOFF).length

// Limites finais de pontos de cada time: mínimo (perde tudo que falta = pontos atuais) e máximo (vence tudo).
type Bound = { teamId: string; pts: number; maxPts: number }
const bounds: Bound[] = table.map((l) => ({ teamId: l.teamId, pts: l.points, maxPts: l.points + 3 * gamesRemaining(l.teamId) }))
const boundOf = (id: string) => bounds.find((b) => b.teamId === id)
// Quantos times AINDA PODEM terminar acima de `id` (eles vencem tudo, ele para nos pontos atuais).
const canFinishAbove = (id: string) => {
  const b = boundOf(id)
  return b ? bounds.filter((o) => o.teamId !== id && o.maxPts > b.pts).length : totalTeams
}
// Quantos times `id` JÁ NÃO ALCANÇA (mesmo vencendo tudo, eles já estão acima do seu máximo).
const guaranteedAbove = (id: string) => {
  const b = boundOf(id)
  return b ? bounds.filter((o) => o.teamId !== id && o.pts > b.maxPts).length : totalTeams
}

// Motivação de tabela com ALCANCE MATEMÁTICO. Garantido top-K ⇔ canFinishAbove < K; eliminado do top-K
// ⇔ guaranteedAbove ≥ K. Daí saem: seguro/ameaçado de rebaixamento, ainda-pode/já-era p/ campeão,
// Champions e vaga europeia. A `intensity` orienta a direção do xG: "alta" = precisa de pontos (ataca),
// "baixa" = nada em jogo (afrouxa).
function stakesFor(teamId: string, teamName: string): { intensity: "alta" | "media" | "baixa"; verdict: string; lines: string[] } {
  const b = boundOf(teamId)
  const pos = posOf(teamId)
  if (!b || pos == null) return { intensity: "media", verdict: "sem foto de tabela", lines: [] } // sem jogos pré-cutoff
  const gr = gamesRemaining(teamId)
  const N = totalTeams, R = relegationCount, C = championsCount, Q = europeanCount
  const above = canFinishAbove(teamId) // podem passar
  const lost = guaranteedAbove(teamId) // já não alcança

  const relegationSafe = R ? above < N - R : true // garante terminar fora do Z
  const relegationDoomed = R ? lost >= N - R : false // já no fundo, matematicamente caído
  const titleClinched = above === 0
  const titlePossible = !titleClinched && lost === 0
  const championsClinched = C ? above < C : false
  const canChampions = C ? lost < C : false
  const europeanClinched = Q ? above < Q : false
  const canEuropean = Q ? lost < Q : false

  const lines: string[] = [`${teamName}: ${pos}º, ${b.pts} pts, ${gr} jogo(s) restante(s) (máx possível ${b.maxPts} pts)`]
  if (relegationDoomed) lines.push("já REBAIXADO matematicamente — sem objetivo de tabela.")
  else if (!relegationSafe) lines.push("AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.")
  else lines.push("já SEGURO do rebaixamento.")
  if (titleClinched) lines.push("título já garantido.")
  else if (titlePossible) lines.push("ainda pode ser CAMPEÃO — precisa vencer.")
  if (championsClinched) lines.push("vaga de Champions já garantida.")
  else if (canChampions) lines.push("pode ENTRAR no G-Champions — motivado a vencer.")
  else if (europeanClinched) lines.push("vaga europeia já garantida.")
  else if (canEuropean) lines.push("ainda briga por vaga europeia — motivado.")
  else if (relegationSafe && !titlePossible) lines.push("sem alvo continental alcançável.")

  const fightingDown = !relegationSafe && !relegationDoomed
  const chasingUp = titlePossible || (canChampions && !championsClinched) || (canEuropean && !europeanClinched)
  const intensity: "alta" | "media" | "baixa" =
    relegationDoomed ? "baixa" : fightingDown || chasingUp ? "alta" : relegationSafe ? "baixa" : "media"

  // Motivo dominante (o que ele luta / por que não luta) → vira o veredito explícito.
  const reason =
    fightingDown ? "luta contra o rebaixamento"
    : titlePossible ? "briga pelo título"
    : canChampions && !championsClinched ? "briga por vaga de Champions"
    : canEuropean && !europeanClinched ? "briga por vaga europeia"
    : relegationDoomed ? "já rebaixado"
    : titleClinched ? "título já garantido"
    : championsClinched ? "Champions já garantida"
    : europeanClinched ? "vaga europeia já garantida"
    : "já seguro e sem alvo alcançável"
  const verdict =
    intensity === "alta" ? `PRECISA LUTAR — ${reason}`
    : intensity === "baixa" ? `NÃO precisa lutar — ${reason}`
    : reason
  lines.push(`→ motivação: **${intensity}** — ${verdict}`)
  return { intensity, verdict, lines }
}

type Timing = Awaited<ReturnType<typeof timing>>

// Linha de timing de um time: marca/sofre por faixa de 15 min (por jogo) + subtotal do 1ºT.
function timingLines(t: Timing): string {
  const fmt = (a: number[]) => BANDS.map((b, i) => `${b}: ${a[i]}`).join(" · ")
  return [
    `- Marca por faixa (/j): ${fmt(t.scoredPg)}`,
    `- Sofre por faixa (/j): ${fmt(t.concededPg)}`,
    `- 1ºT: marca ${t.scoredFirstHalf} / sofre ${t.concededFirstHalf} (totais na temporada)`,
  ].join("\n")
}

// CRUZAMENTO ataque×defesa por faixa: em cada janela de 15 min, o quanto o ATACANTE marca (/j) e o
// quanto o DEFENSOR sofre (/j). A soma é um índice de "pressão de gol" daquela janela — janelas onde
// os dois são altos é onde o gol tende a sair.
function crossTable(attackerName: string, atk: Timing, defenderName: string, def: Timing): string {
  const header = `| Faixa | ${attackerName} marca/j | ${defenderName} sofre/j | índice janela |\n|---|---|---|---|`
  const rows = BANDS.map((b, i) => {
    const a = atk.scoredPg[i]!
    const d = def.concededPg[i]!
    return `| ${b} | ${a} | ${d} | ${+(a + d).toFixed(2)} |`
  })
  return `**${attackerName} atacando × ${defenderName} defendendo**\n${header}\n${rows.join("\n")}`
}

function absBlock(label: string, list: AbsenceLine[]): string {
  if (!list.length) return `### ${label}\nSem desfalques registrados.\n`
  const lines = list.map((a) => {
    const ga = `${a.goals} gols + ${a.assists} assists`
    const share = `representa **${a.pctGoals}% dos gols** do time (${a.pctInvolve}% com assists) → o ataque perde isso se ele não jogar`
    const wow = `with/without: com ele ${a.withGf} g/j (${a.withN}j) vs sem ele ${a.withoutGf} g/j (${a.withoutN}j) = ${a.dropPct >= 0 ? "−" : "+"}${Math.abs(a.dropPct)}%`
    const flag = a.confound ? "  ⚠️ with/without NÃO confiável (sem contribuição direta ou amostra pequena)" : ""
    return `- **${a.name}** (${a.reason ?? "—"}) — ${ga} até a data; ${share}; ${wow}${flag}`
  })
  return `### ${label}\n${lines.join("\n")}\n`
}

const homeStakes = stakesFor(home.id, home.name)
const awayStakes = stakesFor(away.id, away.name)

const prompt = `# Prognóstico de expected goals — ${home.name} x ${away.name}

**IMPORTANTE: raciocine (pense/chain-of-thought) E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno, deve ser em português do Brasil.

Você é um analista quantitativo de futebol. Produza um prognóstico de **expected goals (xG)** para esta partida.
Use o método: **PARTA da base rate Poisson** abaixo (já calculada) e **AJUSTE multiplicativamente** por fator
(desfalques, fadiga, contexto), justificando cada ajuste. Regras:
- **NÃO double-conte**: se um desfalque já estava fora nos últimos jogos, o efeito dele já está na média recente.
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️ (volante/lateral sem G+A, ou amostra pequena).
- Sinalize incerteza (dados ausentes: NÃO temos xG real, clima, nem chutes/posse — isto é proxy por gols reais).

## Contexto
- Data: ${m.date} ${m.time ?? ""} · Rodada ${m.round} · Liga ${m.leagueCode}
- Local: ${matchVenue ? `${matchVenue.name}${matchVenue.cityName ? `, ${matchVenue.cityName}` : ""}` : "—"}${matchVenue?.surface ? ` (${matchVenue.surface})` : ""}
- Descanso: ${home.name} ${restDays(home.id) ?? "?"} dias · ${away.name} ${restDays(away.id) ?? "?"} dias${travelKm != null ? `\n- Viagem do visitante: ~${travelKm} km` : ""}
- Média da liga (pré-jogo, ${played.length} jogos): mandante ${leagueHomeAvg} gols/jogo · visitante ${leagueAwayAvg} gols/jogo

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de ${CUTOFF})
- ${home.name}: ${posOf(home.id) ?? "?"}º, ${lineOf(home.id)?.points ?? 0} pts · ${away.name}: ${posOf(away.id) ?? "?"}º, ${lineOf(away.id)?.points ?? 0} pts
- Linhas: segurança (sair do Z) ${safetyLinePts ?? "?"} pts (${totalTeams - relegationCount}º) · Champions ${championsLinePts ?? "?"} pts (${championsCount}º) · última vaga europeia ${europeanLinePts ?? "?"} pts (${europeanCount}º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
${homeStakes.lines.map((s) => `  - ${s}`).join("\n")}
${awayStakes.lines.map((s) => `  - ${s}`).join("\n")}

## ${home.name} (manda) — até ${CUTOFF}
- Total na temporada: **${homeAll.totalGf} gols marcados**, ${homeAll.totalGa} sofridos em ${homeAll.n} jogos
- Média geral: marca ${homeAll.gf} / sofre ${homeAll.ga} por jogo
- **Em casa (${homeHome.n}j): marca ${homeHome.gf} / sofre ${homeHome.ga}** (total ${homeHome.totalGf} gols em casa)
- Por tempo (casa+fora): 1ºT marca ${homeHalf.scored1} sofre ${homeHalf.conceded1} · 2ºT marca ${homeHalf.scored2} sofre ${homeHalf.conceded2}
${timingLines(homeTiming)}
${absBlock(`Desfalques de ${home.name} neste jogo`, homeAbs)}
## ${away.name} (visita) — até ${CUTOFF}
- Total na temporada: **${awayAll.totalGf} gols marcados**, ${awayAll.totalGa} sofridos em ${awayAll.n} jogos
- Média geral: marca ${awayAll.gf} / sofre ${awayAll.ga} por jogo
- **Fora (${awayAway.n}j): marca ${awayAway.gf} / sofre ${awayAway.ga}** (total ${awayAway.totalGf} gols fora)
- Por tempo (casa+fora): 1ºT marca ${awayHalf.scored1} sofre ${awayHalf.conceded1} · 2ºT marca ${awayHalf.scored2} sofre ${awayHalf.conceded2}
${timingLines(awayTiming)}
${absBlock(`Desfalques de ${away.name} neste jogo`, awayAbs)}
## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

${crossTable(home.name, homeTiming, away.name, awayTiming)}

${crossTable(away.name, awayTiming, home.name, homeTiming)}

## Base rate (ponto de partida — Poisson força ataque×defesa, por mando)
- λ ${home.name} (casa) = ${lambdaHome}
- λ ${away.name} (fora) = ${lambdaAway}
- Total base = ${+(lambdaHome + lambdaAway).toFixed(2)}

## Saída exigida (objeto tipado — validado pelo runtime). Estrutura: PROGNÓSTICO POR TIME + GERAL.
**Por time** — \`home\` (= ${home.name}) e \`away\` (= ${away.name}), cada um com:
- \`xg\` (total), \`xg_1t\`, \`xg_2t\` e **\`xg_bands\`** = o xG nas 6 faixas de 15 min (\`"0-15"\`,\`"16-30"\`,\`"31-45"\`,\`"46-60"\`,\`"61-75"\`,\`"76-90"\`). Soma das 6 = \`xg\`; 0-15+16-30+31-45 = \`xg_1t\`. Use o cruzamento ataque×defesa por faixa.
- \`resumo\` = leitura CURTA daquele time (1-2 frases): motivação de tabela, desfalque que pesa, mando, e como isso move o xG dele.

**Geral** (\`geral\`) — agregados do jogo:
- \`total\`, \`total_1t\`, \`total_2t\`, \`over25_prob\`, \`btts_prob\`.
- **1x2 (home/draw/away)** em 3 recortes: \`one_x_two\` (jogo 90min), \`one_x_two_1t\` (placar do 1º tempo), \`one_x_two_2t\` (2º tempo isolado). Derive do Poisson com os λ do respectivo tempo.
- \`confianca\` ∈ {baixa, media, alta} e \`resumo\` = 1 parágrafo do jogo + a maior incerteza.

No topo: \`drivers\` = os 3 fatores que mais moveram o número.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (chain-of-thought / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
`

// Escreve o arquivo pra leitura/auditoria + imprime no stdout.
const outPath = new URL(`./output/prognosis-${MATCH_ID}.md`, import.meta.url)
await Bun.write(outPath, prompt)
console.log(prompt)
console.error(`\n[ok] prompt salvo em scripts/output/prognosis-${MATCH_ID}.md`)
process.exit(0)
