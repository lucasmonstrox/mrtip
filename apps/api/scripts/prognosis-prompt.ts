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
import { and, eq, inArray, isNotNull, sql } from "drizzle-orm"

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

// SoT + key passes por (matchId, teamId): soma dos jogadores do time naquele jogo (lineup_player),
// indexado em memória pra usar como goalsFor/goalsAgainst. Só a season atual tem esses stats; jogos
// sem lineup ingerido simplesmente não entram (hasSot guarda contra contar 0 como ausência de dado).
const statRows = await db
  .select({
    matchId: lineup.matchId,
    teamId: lineup.teamId,
    sot: sql<number>`coalesce(sum(${lineupPlayer.shotsOnTarget}), 0)::int`,
    kp: sql<number>`coalesce(sum(${lineupPlayer.keyPasses}), 0)::int`,
  })
  .from(lineup)
  .leftJoin(lineupPlayer, eq(lineupPlayer.lineupId, lineup.id))
  .groupBy(lineup.matchId, lineup.teamId)
const statByMatchTeam = new Map<string, Map<string, { sot: number; kp: number }>>()
for (const r of statRows) {
  let mm = statByMatchTeam.get(r.matchId)
  if (!mm) {
    mm = new Map()
    statByMatchTeam.set(r.matchId, mm)
  }
  mm.set(r.teamId, { sot: r.sot, kp: r.kp })
}
const oppOf = (p: Row, id: string) => (p.homeTeamId === id ? p.awayTeamId : p.homeTeamId)
const sotFor = (p: Row, id: string) => statByMatchTeam.get(p.id)?.get(id)?.sot ?? 0
const sotAgainst = (p: Row, id: string) => statByMatchTeam.get(p.id)?.get(oppOf(p, id))?.sot ?? 0
const kpFor = (p: Row, id: string) => statByMatchTeam.get(p.id)?.get(id)?.kp ?? 0
const hasSot = (p: Row, id: string) => statByMatchTeam.get(p.id)?.has(id) ?? false

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

// SoT marcado/sofrido por jogo num recorte — só jogos do time COM lineup ingerido (hasSot), pra não
// diluir a média com jogos sem dado. Espelha `avg`, mas em chutes no alvo (3× mais denso que gols).
function sotAvg(rows: Row[], id: string) {
  const ws = rows.filter((p) => hasSot(p, id))
  if (!ws.length) return { n: 0, sf: 0, sa: 0, totalSf: 0, totalSa: 0 }
  const totalSf = ws.reduce((s, p) => s + sotFor(p, id), 0)
  const totalSa = ws.reduce((s, p) => s + sotAgainst(p, id), 0)
  return { n: ws.length, sf: +(totalSf / ws.length).toFixed(2), sa: +(totalSa / ws.length).toFixed(2), totalSf, totalSa }
}
// Key passes/jogo do time (criação) — mesma base de jogos com lineup.
function kpPerGame(rows: Row[], id: string): number {
  const ws = rows.filter((p) => hasSot(p, id))
  return ws.length ? +(ws.reduce((s, p) => s + kpFor(p, id), 0) / ws.length).toFixed(2) : 0
}
// Conversão = gols / SoT em % (eficiência de finalização); null sem amostra de SoT.
const convPct = (goals: number, sot: number): number | null => (sot ? Math.round((goals / sot) * 100) : null)

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
  sotPerGame: number | null // SoT/jogo do próprio jogador (o volume direto que sai com ele)
  withSot: number; withoutSot: number // SoT/jogo do TIME com ele vs sem ele
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
    // SoT do próprio jogador (pré-cutoff, jogos que jogou) + SoT/jogo do TIME com ele vs sem ele.
    const psRows = await db
      .select({ matchId: lineup.matchId, sot: lineupPlayer.shotsOnTarget, mins: lineupPlayer.minutesPlayed })
      .from(lineupPlayer)
      .innerJoin(lineup, eq(lineupPlayer.lineupId, lineup.id))
      .where(and(eq(lineupPlayer.playerId, i.playerId), eq(lineup.teamId, teamId)))
    const psPlayed = psRows.filter((r) => ids.has(r.matchId) && (r.mins ?? 0) > 0)
    const sotPerGame = psPlayed.length
      ? +(psPlayed.reduce((s, r) => s + (r.sot ?? 0), 0) / psPlayed.length).toFixed(2)
      : null
    const wS = sotAvg(withRows, teamId)
    const woS = sotAvg(withoutRows, teamId)
    out.push({
      name: (p?.name ?? "?").trim(), reason: i.reason,
      goals, assists,
      pctGoals: teamTotalGoals ? Math.round((goals / teamTotalGoals) * 100) : 0,
      pctInvolve: teamTotalGoals ? Math.round(((goals + assists) / teamTotalGoals) * 100) : 0,
      withN: w.n, withGf: w.gf, withoutN: wo.n, withoutGf: wo.gf, dropPct,
      sotPerGame, withSot: wS.sf, withoutSot: woS.sf,
      // Confound guard: zero contribuição direta (Traoré) OU amostra "sem" pequena (Stach 8j) → não confiar no with/without.
      confound: goals + assists === 0 || w.n < LOW_SAMPLE || wo.n < LOW_SAMPLE,
    })
  }
  // ordena por contribuição direta (G+A) desc — o desfalque que mais pesa primeiro
  return out.sort((a, b) => b.goals + b.assists - (a.goals + a.assists))
}

// Forma recente: os últimos N jogos do time (pré-cutoff, sequência mais recente primeiro). Gols e SoT
// feito/sofrido por jogo + pontos + V/E/D. O delta vs a média da season é o "momento" (em alta/baixa).
function recentForm(teamId: string, n: number) {
  const ms = teamMatches(teamId).slice(-n)
  if (!ms.length) return null
  let gf = 0, ga = 0, pts = 0
  const seq: string[] = []
  for (const p of ms) {
    const f = goalsFor(p, teamId)
    const a = goalsAgainst(p, teamId)
    gf += f
    ga += a
    if (f > a) { pts += 3; seq.push("V") } else if (f < a) seq.push("D")
    else { pts += 1; seq.push("E") }
  }
  const sot = sotAvg(ms, teamId)
  const k = ms.length
  return { n: k, seq: seq.reverse().join(""), pts, gf: +(gf / k).toFixed(2), ga: +(ga / k).toFixed(2), sf: sot.sf, sa: sot.sa }
}

// Poisson independente (home/away) → probabilidades de mercado. ÂNCORA determinística: o modelo deve
// PARTIR daqui em vez de chutar over/BTTS/1x2 — a maior fonte da "compressão" pra ~40% em tudo.
function poissonPmf(k: number, lambda: number): number {
  let p = Math.exp(-lambda)
  for (let i = 1; i <= k; i++) p *= lambda / i
  return p
}
function marketProbs(lh: number, la: number) {
  const MAX = 10
  const ph = Array.from({ length: MAX + 1 }, (_, k) => poissonPmf(k, lh))
  const pa = Array.from({ length: MAX + 1 }, (_, k) => poissonPmf(k, la))
  let home = 0, draw = 0, away = 0, over15 = 0, over25 = 0, over35 = 0
  for (let h = 0; h <= MAX; h++) {
    for (let a = 0; a <= MAX; a++) {
      const p = ph[h]! * pa[a]!
      if (h > a) home += p
      else if (h === a) draw += p
      else away += p
      if (h + a >= 2) over15 += p
      if (h + a >= 3) over25 += p
      if (h + a >= 4) over35 += p
    }
  }
  const pc = (x: number) => Math.round(x * 100)
  return { home: pc(home), draw: pc(draw), away: pc(away), over15: pc(over15), over25: pc(over25), over35: pc(over35), btts: pc((1 - ph[0]!) * (1 - pa[0]!)) }
}

// ---- Base rate Poisson (força ataque × fraqueza defesa, específica por mando) ----
const leagueHomeAvg = +(played.reduce((s, p) => s + (p.ftHome ?? 0), 0) / played.length).toFixed(3)
const leagueAwayAvg = +(played.reduce((s, p) => s + (p.ftAway ?? 0), 0) / played.length).toFixed(3)
const homeHome = avg(teamMatches(home.id).filter((p) => p.homeTeamId === home.id), home.id)
const awayAway = avg(teamMatches(away.id).filter((p) => p.awayTeamId === away.id), away.id)
// λ_home = ataque(casa) do mandante × (defesa(fora) do visitante / média de gols de mandante na liga)
const lambdaHome = +(homeHome.gf * (awayAway.ga / leagueHomeAvg)).toFixed(2)
const lambdaAway = +(awayAway.gf * (homeHome.ga / leagueAwayAvg)).toFixed(2)

// Mesma base rate, em SoT (volume de finalização, 3× mais denso que gols → menos ruído). A média de
// SoT por mando da liga normaliza; depois multiplica pela conversão do time → gols por uma rota
// independente da contagem de gols. As duas rotas (gols puro vs SoT×conversão) devem convergir.
const homeHomeSot = sotAvg(teamMatches(home.id).filter((p) => p.homeTeamId === home.id), home.id)
const awayAwaySot = sotAvg(teamMatches(away.id).filter((p) => p.awayTeamId === away.id), away.id)
let lgHomeSot = 0, lgAwaySot = 0, lgSotN = 0
for (const p of played) {
  const hs = statByMatchTeam.get(p.id)?.get(p.homeTeamId)?.sot
  const as = statByMatchTeam.get(p.id)?.get(p.awayTeamId)?.sot
  if (hs != null && as != null) {
    lgHomeSot += hs
    lgAwaySot += as
    lgSotN += 1
  }
}
const leagueHomeSotAvg = lgSotN ? +(lgHomeSot / lgSotN).toFixed(2) : 0
const leagueAwaySotAvg = lgSotN ? +(lgAwaySot / lgSotN).toFixed(2) : 0
const lambdaSotHome = leagueHomeSotAvg ? +(homeHomeSot.sf * (awayAwaySot.sa / leagueHomeSotAvg)).toFixed(2) : 0
const lambdaSotAway = leagueAwaySotAvg ? +(awayAwaySot.sf * (homeHomeSot.sa / leagueAwaySotAvg)).toFixed(2) : 0

// Rest days (in-league): dias desde o último jogo de cada lado antes deste.
function restDays(teamId: string): number | null {
  const prev = teamMatches(teamId).at(-1)
  if (!prev) return null
  return Math.round((Date.parse(CUTOFF) - Date.parse(prev.date)) / 86_400_000)
}

const homeAll = avg(teamMatches(home.id), home.id)
const awayAll = avg(teamMatches(away.id), away.id)
// SoT agregado (geral) + conversão de cada time. conv = % dos PRÓPRIOS SoT que viram gol (finalização);
// convDef = % dos SoT SOFRIDOS que viram gol (qualidade das chances concedidas / solidez defensiva).
const homeSotAll = sotAvg(teamMatches(home.id), home.id)
const awaySotAll = sotAvg(teamMatches(away.id), away.id)
const homeConv = convPct(homeAll.totalGf, homeSotAll.totalSf)
const awayConv = convPct(awayAll.totalGf, awaySotAll.totalSf)
const homeConvDef = convPct(homeAll.totalGa, homeSotAll.totalSa)
const awayConvDef = convPct(awayAll.totalGa, awaySotAll.totalSa)
// Gols esperados pela rota SoT: λ_SoT × conversão do time (compara com o λ de gols puro acima).
const xgViaSotHome = homeConv != null ? +(lambdaSotHome * (homeConv / 100)).toFixed(2) : null
const xgViaSotAway = awayConv != null ? +(lambdaSotAway * (awayConv / 100)).toFixed(2) : null
const homeKpPg = kpPerGame(teamMatches(home.id), home.id)
const awayKpPg = kpPerGame(teamMatches(away.id), away.id)
// Forma recente (momento): últimos 5 e 10 jogos de cada lado.
const homeF5 = recentForm(home.id, 5)
const homeF10 = recentForm(home.id, 10)
const awayF5 = recentForm(away.id, 5)
const awayF10 = recentForm(away.id, 10)
// Probabilidades de mercado por rota (Poisson sobre os λ): gols puro vs SoT×conversão. O modelo
// ancora nesses números calibrados em vez de inventar as porcentagens.
const probsGoals = marketProbs(lambdaHome, lambdaAway)
const probsSot = marketProbs(xgViaSotHome ?? lambdaHome, xgViaSotAway ?? lambdaAway)
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
    const sot = a.sotPerGame != null ? `; finaliza **${a.sotPerGame} SoT/jogo** (time: ${a.withSot} SoT/j com ele vs ${a.withoutSot} sem — volume mais estável que gols)` : ""
    const flag = a.confound ? "  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT" : ""
    return `- **${a.name}** (${a.reason ?? "—"}) — ${ga} até a data; ${share}; ${wow}${sot}${flag}`
  })
  return `### ${label}\n${lines.join("\n")}\n`
}

// Linha de forma recente (momento) pro prompt: últimos 5 (+10) com setas ↑/↓/= vs a média da season.
function formLines(f5: ReturnType<typeof recentForm>, f10: ReturnType<typeof recentForm>, seasonGf: number, seasonGa: number): string {
  if (!f5) return "- Forma recente: sem jogos suficientes"
  const arr = (r: number, s: number) => (r > s * 1.15 ? "↑" : r < s * 0.85 ? "↓" : "=")
  const l10 = f10 ? ` · últimos 10: ${f10.seq} (${f10.pts}pts · ${f10.gf}/${f10.ga} g/j · SoT ${f10.sf}/${f10.sa})` : ""
  return `- **Forma (momento) — últimos ${f5.n}: ${f5.seq}** (${f5.pts}pts) · marca ${f5.gf}${arr(f5.gf, seasonGf)} / sofre ${f5.ga}${arr(f5.ga, seasonGa)} g/j · SoT ${f5.sf} feito / ${f5.sa} sofrido${l10}`
}

const homeStakes = stakesFor(home.id, home.name)
const awayStakes = stakesFor(away.id, away.name)

const prompt = `# Prognóstico de expected goals — ${home.name} x ${away.name}

**IMPORTANTE: raciocine (pense/chain-of-thought) E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno, deve ser em português do Brasil.

Você é um analista quantitativo de futebol. Produza um prognóstico de **expected goals (xG)** para esta partida.
Use o método: **PARTA da base rate** abaixo (duas rotas já calculadas: λ de gols puro E λ_SoT × conversão) e
**AJUSTE multiplicativamente** por fator (desfalques, fadiga, contexto), justificando cada ajuste. Regras:
- **ANCORE nas probabilidades Poisson fornecidas** (seção "Probabilidades de mercado"): seu \`over25_prob\`, \`btts_prob\`
  e \`one_x_two\` PARTEM delas (Rota B como principal). Só desvie com fator nomeado e quantificado. **NÃO** devolva tudo
  comprimido perto de ~40% — é exatamente o erro que estamos corrigindo.
- **SoT (chutes no alvo) é o sinal de VOLUME primário** — 3× mais denso que gols, logo menos ruído. Use gols para a
  CONVERSÃO (gols/SoT) e como checagem. Onde as duas rotas de base rate divergem, confie mais no SoT e trate a
  diferença como finalização acima/abaixo da média (tende a regredir à conversão do time).
- O **desconto por desfalque age no VOLUME (SoT/λ_SoT)**, não na conversão (a eficiência do time é mais estável).
- **NÃO double-conte**: se um desfalque já estava fora nos últimos jogos, o efeito dele já está na média recente.
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️. O with/without de **SoT** é mais estável que o de gols — prefira-o.
- Sinalize incerteza: NÃO temos xG real, clima, nem posse/chutes totais — SoT é o melhor proxy de volume/qualidade aqui.

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
- **Finalização: ${homeSotAll.totalSf} SoT total (${homeSotAll.sf}/jogo · em casa ${homeHomeSot.sf}/jogo) · conversão ${homeConv ?? "?"}%** (gols ÷ SoT)
- Sofre ${homeSotAll.sa} SoT/jogo (adversário converte ${homeConvDef ?? "?"}%) · cria ${homeKpPg} key passes/jogo
${formLines(homeF5, homeF10, homeAll.gf, homeAll.ga)}
${timingLines(homeTiming)}
${absBlock(`Desfalques de ${home.name} neste jogo`, homeAbs)}
## ${away.name} (visita) — até ${CUTOFF}
- Total na temporada: **${awayAll.totalGf} gols marcados**, ${awayAll.totalGa} sofridos em ${awayAll.n} jogos
- Média geral: marca ${awayAll.gf} / sofre ${awayAll.ga} por jogo
- **Fora (${awayAway.n}j): marca ${awayAway.gf} / sofre ${awayAway.ga}** (total ${awayAway.totalGf} gols fora)
- Por tempo (casa+fora): 1ºT marca ${awayHalf.scored1} sofre ${awayHalf.conceded1} · 2ºT marca ${awayHalf.scored2} sofre ${awayHalf.conceded2}
- **Finalização: ${awaySotAll.totalSf} SoT total (${awaySotAll.sf}/jogo · fora ${awayAwaySot.sf}/jogo) · conversão ${awayConv ?? "?"}%** (gols ÷ SoT)
- Sofre ${awaySotAll.sa} SoT/jogo (adversário converte ${awayConvDef ?? "?"}%) · cria ${awayKpPg} key passes/jogo
${formLines(awayF5, awayF10, awayAll.gf, awayAll.ga)}
${timingLines(awayTiming)}
${absBlock(`Desfalques de ${away.name} neste jogo`, awayAbs)}
## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

${crossTable(home.name, homeTiming, away.name, awayTiming)}

${crossTable(away.name, awayTiming, home.name, homeTiming)}

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ ${home.name} (casa) = ${lambdaHome} · λ ${away.name} (fora) = ${lambdaAway} · total = ${+(lambdaHome + lambdaAway).toFixed(2)}

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- ${home.name}: λ_SoT ${lambdaSotHome} × conv ${homeConv ?? "?"}% → **${xgViaSotHome ?? "?"} gols**
- ${away.name}: λ_SoT ${lambdaSotAway} × conv ${awayConv ?? "?"}% → **${xgViaSotAway ?? "?"} gols**
- total via SoT = ${xgViaSotHome != null && xgViaSotAway != null ? +(xgViaSotHome + xgViaSotAway).toFixed(2) : "?"}
- **Índice de volume do jogo**: λ_SoT total ${+(lambdaSotHome + lambdaSotAway).toFixed(1)} vs média da liga ${+(leagueHomeSotAvg + leagueAwaySotAvg).toFixed(1)} SoT → ${lambdaSotHome + lambdaSotAway > (leagueHomeSotAvg + leagueAwaySotAvg) * 1.1 ? "**ACIMA** (jogo de volume → pressão de OVER)" : lambdaSotHome + lambdaSotAway < (leagueHomeSotAvg + leagueAwaySotAvg) * 0.9 ? "**ABAIXO** (jogo travado → pressão de UNDER)" : "na média"}
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — ÂNCORA: ajuste A PARTIR daqui, não invente)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | ${probsGoals.home}/${probsGoals.draw}/${probsGoals.away}% | ${probsSot.home}/${probsSot.draw}/${probsSot.away}% |
| Over 1.5 | ${probsGoals.over15}% | ${probsSot.over15}% |
| Over 2.5 | ${probsGoals.over25}% | ${probsSot.over25}% |
| Over 3.5 | ${probsGoals.over35}% | ${probsSot.over35}% |
| BTTS | ${probsGoals.btts}% | ${probsSot.btts}% |
São as probabilidades que o volume IMPLICA. Seus \`over25_prob\`, \`btts_prob\` e \`one_x_two\` devem **partir destes números** (use a Rota B como principal); só desvie com um **fator nomeado** (motivação, desfalque, fadiga) dizendo a direção e o tamanho. **NÃO comprima tudo pra ~40%** — se a âncora diz over 2.5 = 55%, justifique explicitamente para baixá-la.

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
