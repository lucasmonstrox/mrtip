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
import { and, eq, inArray, isNotNull, or, sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { goal, injury, league, lineup, lineupPlayer, match, matchTeamStats, matchTrend, player, standing, team, venue, weather } from "../src/db/schema"
import { buildMomentum, type MomentumPoint, type TrendInput } from "../src/modules/leagues/get-match-momentum/momentum"

const MATCH_ID = process.argv[2] ?? "77a4255a-3e44-4fd9-a133-b13ca0898a91"

// Abaixo de tantos jogos "com ele"/"sem ele" a taxa de gols do with/without é ruído — gols/jogo só
// estabiliza com ~12+ jogos de cada lado (6 era variância demais). Abaixo disto: flagged, not trusted.
const LOW_SAMPLE = 12
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
// Escopo de SEASON (LIG-008): o banco tem várias temporadas da mesma liga; sem este filtro o cutoff só
// por data varre 24/25 + 25/26 e a tabela/médias/forma saem somadas de 2 anos. Tudo abaixo deriva de
// `played` (ou das queries de zona/fixtures), então scopar por seasonId aqui conserta a cadeia inteira.
const seasonId = m.seasonId
if (!seasonId) throw new Error(`match ${MATCH_ID} sem seasonId — rode o backfill de season (LIG-008) antes`)

const [home] = await db.select().from(team).where(eq(team.id, m.homeTeamId))
const [away] = await db.select().from(team).where(eq(team.id, m.awayTeamId))
if (!home || !away) throw new Error("team not found")
const [matchVenue] = m.venueId ? await db.select().from(venue).where(eq(venue.id, m.venueId)) : []
const [matchWeather] = await db.select().from(weather).where(eq(weather.matchId, MATCH_ID))
// Floats do clima (Postgres `real` = float32) vêm com ruído (27.5699996…); arredonda a 1 casa na exibição.
const w1 = (n: number | null) => (n == null ? "?" : Math.round(n * 10) / 10)

// Nome de QUALQUER time da liga (não só os 2 do jogo) — pra nomear os rivais que disputam a vaga.
const allTeams = await db.select({ id: team.id, name: team.name }).from(team)
const teamNameById = new Map(allTeams.map((t) => [t.id, t.name]))
const nameOf = (id: string) => teamNameById.get(id) ?? "?"

// Todos os jogos COM resultado da liga, antes do cutoff (sem o próprio jogo → sem vazamento).
const playedAll = await db
  .select()
  .from(match)
  .where(and(eq(match.leagueCode, m.leagueCode), eq(match.seasonId, seasonId), isNotNull(match.ftHome)))
const played = playedAll.filter((p) => p.date < CUTOFF)

type Row = (typeof played)[number]
const teamMatches = (id: string): Row[] =>
  played.filter((p) => p.homeTeamId === id || p.awayTeamId === id).sort((a, b) => a.date.localeCompare(b.date))
const goalsFor = (p: Row, id: string) => (p.homeTeamId === id ? p.ftHome : p.ftAway) ?? 0
const goalsAgainst = (p: Row, id: string) => (p.homeTeamId === id ? p.ftAway : p.ftHome) ?? 0

// Jogos de COPA (FA Cup, Carabao, …) dos 2 times NESTE campeonato, pré-cutoff — a matéria-prima do
// congestionamento de calendário (o efeito "ressaca de meio de semana": mata-mata na quarta esvazia as
// pernas pro jogo de liga no fim de semana). Copa vive em OUTRA season (seasonId ≠ liga), então NÃO dá
// pra scopar por seasonId — scopa por time + janela do campeonato atual (≥ 1º jogo de liga da season).
const seasonStart = played.reduce((min, p) => (p.date < min ? p.date : min), CUTOFF)
const cupLeagues = await db.select({ code: league.code, name: league.name }).from(league).where(eq(league.type, "cup"))
const cupNameByCode = new Map(cupLeagues.map((l) => [l.code, l.name]))
const cupCodes = cupLeagues.map((l) => l.code)
const cupPlayed: Row[] = cupCodes.length
  ? (await db.select().from(match).where(and(inArray(match.leagueCode, cupCodes), isNotNull(match.ftHome)))).filter(
      (p) =>
        p.date < CUTOFF &&
        p.date >= seasonStart &&
        (p.homeTeamId === home.id || p.awayTeamId === home.id || p.homeTeamId === away.id || p.awayTeamId === away.id),
    )
  : []
// Jogos de copa de UM time em ordem cronológica (mesmo shape de `Row`), pra medir fadiga/congestionamento.
const cupMatchesOf = (id: string): Row[] =>
  cupPlayed.filter((p) => p.homeTeamId === id || p.awayTeamId === id).sort((a, b) => a.date.localeCompare(b.date))

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

// Notas dos jogadores (rating type 118) dos 2 times, em TODAS as competições (liga + copa) do campeonato
// atual pré-cutoff — o sinal de QUALIDADE INDIVIDUAL ("a camisa") que a média de gols do time não captura.
// Cada nota guarda a data pra separar season × forma (últimos 5). Anti-vazamento: só date < CUTOFF.
const ratingRowsAll = await db
  .select({ matchId: lineup.matchId, teamId: lineup.teamId, playerId: lineupPlayer.playerId, name: player.name, date: match.date, rating: lineupPlayer.rating })
  .from(lineupPlayer)
  .innerJoin(lineup, eq(lineup.id, lineupPlayer.lineupId))
  .innerJoin(match, eq(match.id, lineup.matchId))
  .innerJoin(player, eq(player.id, lineupPlayer.playerId))
  .where(and(or(inArray(match.homeTeamId, [home.id, away.id]), inArray(match.awayTeamId, [home.id, away.id])), isNotNull(lineupPlayer.rating)))
const ratingRows = ratingRowsAll.filter((r) => r.rating != null && r.date < CUTOFF && r.date >= seasonStart)
// MOTM DE VERDADE = a MAIOR nota do JOGO entre os 22 jogadores (dos DOIS times) — por isso a query traz os
// dois lados de cada partida que os times jogaram. O campo nativo 1490 é bogus (vem vazio); MOTM se DERIVA
// da nota (rating 118), que é o método padrão da indústria.
const matchMaxRating = new Map<string, number>()
for (const r of ratingRows) matchMaxRating.set(r.matchId, Math.max(matchMaxRating.get(r.matchId) ?? 0, r.rating!))

// Stats DETALHADAS por jogador (o DOSSIÊ INDIVIDUAL): SoT, key passes, dribles, desarmes, interceptações,
// duelos, cruzamentos e minutos — de TODOS os jogadores dos 2 times, pré-cutoff, só jogos que jogou (min>0).
// É o mesmo dado que o bloco de desfalque usa, mas para os TITULARES — o perfil de criação/finalização/defesa
// que a nota sozinha não entrega, pra o LLM raciocinar por jogador. @feature MOD-004
const playerStatRowsAll = await db
  .select({ playerId: lineupPlayer.playerId, date: match.date, mins: lineupPlayer.minutesPlayed, sot: lineupPlayer.shotsOnTarget, kp: lineupPlayer.keyPasses, tkl: lineupPlayer.tackles, intc: lineupPlayer.interceptions, duel: lineupPlayer.duelsWon, cross: lineupPlayer.crossesAccurate, drib: lineupPlayer.dribblesSuccessful })
  .from(lineupPlayer)
  .innerJoin(lineup, eq(lineup.id, lineupPlayer.lineupId))
  .innerJoin(match, eq(match.id, lineup.matchId))
  .where(inArray(lineup.teamId, [home.id, away.id]))
type PlayerAgg = { g: number; sot: number; kp: number; tkl: number; intc: number; duel: number; cross: number; drib: number; mins: number }
const playerAgg = new Map<string, PlayerAgg>()
for (const r of playerStatRowsAll) {
  if (r.date >= CUTOFF || r.date < seasonStart || (r.mins ?? 0) <= 0) continue
  let e = playerAgg.get(r.playerId)
  if (!e) { e = { g: 0, sot: 0, kp: 0, tkl: 0, intc: 0, duel: 0, cross: 0, drib: 0, mins: 0 }; playerAgg.set(r.playerId, e) }
  e.g += 1
  e.sot += r.sot ?? 0; e.kp += r.kp ?? 0; e.tkl += r.tkl ?? 0; e.intc += r.intc ?? 0
  e.duel += r.duel ?? 0; e.cross += r.cross ?? 0; e.drib += r.drib ?? 0; e.mins += r.mins ?? 0
}
// Contribuição direta G+A por jogador (gols exceto own + assistências), nos jogos pré-cutoff dos 2 times.
const gaMatchIds = [...new Set([...teamMatches(home.id), ...teamMatches(away.id), ...cupMatchesOf(home.id), ...cupMatchesOf(away.id)].map((p) => p.id))]
const gaGoalRows = gaMatchIds.length
  ? await db.select({ playerId: goal.playerId, assistId: goal.assistId, type: goal.type, minute: goal.minute }).from(goal).where(inArray(goal.matchId, gaMatchIds))
  : []
const playerGA = new Map<string, { g: number; a: number }>()
const playerGoalMins = new Map<string, number[]>() // minuto de CADA gol do jogador (o "quando ele faz")
for (const gg of gaGoalRows) {
  if (gg.playerId && gg.type !== "own") {
    const e = playerGA.get(gg.playerId) ?? { g: 0, a: 0 }; e.g += 1; playerGA.set(gg.playerId, e)
    if (gg.minute != null) { const arr = playerGoalMins.get(gg.playerId) ?? []; arr.push(gg.minute); playerGoalMins.set(gg.playerId, arr) }
  }
  if (gg.assistId) { const e = playerGA.get(gg.assistId) ?? { g: 0, a: 0 }; e.a += 1; playerGA.set(gg.assistId, e) }
}
// Linha de perfil estatístico de um jogador (per-jogo) — G+A, criação, finalização, drible, volume defensivo.
function playerStatLine(playerId: string): string {
  const s = playerAgg.get(playerId)
  const ga = playerGA.get(playerId)
  if (!s || s.g === 0) return ""
  const pg = (v: number) => +(v / s.g).toFixed(2)
  const parts: string[] = []
  if (ga && ga.g + ga.a > 0) parts.push(`**${ga.g}G+${ga.a}A**`)
  // O QUANDO ele marca: os minutos de cada gol + resumo (2ºT? tardio?) — perfil temporal do artilheiro.
  const gm = playerGoalMins.get(playerId)
  if (gm && gm.length) {
    const sorted = [...gm].sort((a, b) => a - b)
    const shown = sorted.slice(0, 10).map((m) => `${m}'`).join(",") + (sorted.length > 10 ? "…" : "")
    const sh = sorted.filter((m) => m > 45).length
    const late = sorted.filter((m) => m >= 76).length
    const tags: string[] = []
    if (sh >= Math.ceil(sorted.length * 0.6)) tags.push("mais no 2ºT")
    if (late >= 2 && late >= Math.ceil(sorted.length * 0.3)) tags.push(`${late} tardios (76'+)`)
    parts.push(`gols aos ${shown}${tags.length ? ` — ${tags.join(", ")}` : ""}`)
  }
  parts.push(`${pg(s.kp)} KP/j`, `${pg(s.sot)} SoT/j`, `${pg(s.drib)} dribles/j`)
  parts.push(`def: ${pg(s.tkl)} desarme + ${pg(s.intc)} int + ${pg(s.duel)} duelo/j`)
  if (s.cross > 0) parts.push(`${pg(s.cross)} cruz/j`)
  parts.push(`~${Math.round(s.mins / s.g)} min/j`)
  return `\n    ↳ ${parts.join(" · ")}`
}
// Bloco de QUALIDADE INDIVIDUAL: nota média do time + top jogadores por nota da season, cada um com season ×
// forma (últimos 5, seta ↑/↓ vs season) e "nº MOTM" (maior nota do jogo entre os 22, derivado da nota). Marca ⚠️ quem está
// fora (cruza com desfalques). Inclui copa. É o piso de qualidade / "camisa" pra o modelo não rebaixar um
// elenco forte à média crua de gols.
function ratingsBlock(teamId: string, injured: Set<string>): string {
  const rows = ratingRows.filter((r) => r.teamId === teamId)
  if (rows.length < 5) return "- (sem notas suficientes)"
  const teamAvg = +(rows.reduce((s, r) => s + (r.rating ?? 0), 0) / rows.length).toFixed(2)
  const byPlayer = new Map<string, { playerId: string; name: string; rs: { date: string; rating: number; matchId: string }[] }>()
  for (const r of rows) {
    let e = byPlayer.get(r.playerId)
    if (!e) { e = { playerId: r.playerId, name: r.name, rs: [] }; byPlayer.set(r.playerId, e) }
    e.rs.push({ date: r.date, rating: r.rating!, matchId: r.matchId })
  }
  const arrow = (f: number, s: number) => (f > s + 0.15 ? "↑" : f < s - 0.15 ? "↓" : "=")
  // Régua comum = os últimos 5 JOGOS DO TIME (com nota), por data. Alinhar a trajetória a ela deixa VISÍVEL
  // a AUSÊNCIA: se o jogador faltou a um jogo da janela, marca "–" em vez de pular — a média sozinha escondia
  // que ele nem vinha jogando (desfalque/rotação/lesão). @feature MOD-004
  const teamGames = [...new Map(rows.map((r) => [r.matchId, r.date] as [string, string])).entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .slice(-5)
    .map(([mid]) => mid)
  const players = [...byPlayer.values()]
    .filter((p) => p.rs.length >= 5)
    .map((p) => {
      const sorted = [...p.rs].sort((a, b) => a.date.localeCompare(b.date))
      const season = +(sorted.reduce((s, x) => s + x.rating, 0) / sorted.length).toFixed(2)
      // Trajetória ALINHADA aos jogos do time: nota se jogou, null (=ausente) se faltou.
      const byMatch = new Map(p.rs.map((x) => [x.matchId, x.rating]))
      const cells = teamGames.map((mid) => (byMatch.has(mid) ? +byMatch.get(mid)!.toFixed(1) : null))
      const played = cells.filter((v): v is number => v !== null)
      const absent = cells.length - played.length
      const forma = played.length ? +(played.reduce((s, v) => s + v, 0) / played.length).toFixed(2) : season
      // Tendência só sobre os jogos que ELE DE FATO jogou na janela (recente vs antigo); pouca amostra = flag.
      const h = Math.floor(played.length / 2) || 1
      const older = played.slice(0, h).reduce((s, v) => s + v, 0) / h
      const recent = played.slice(-h).reduce((s, v) => s + v, 0) / h
      const trend =
        played.length < 3 ? "⚠️ poucos jogos na janela"
        : recent > older + 0.2 ? "📈 subindo"
        : recent < older - 0.2 ? "📉 caindo"
        : "➡️ estável"
      const seqStr = cells.map((v) => (v === null ? "–" : v)).join("→")
      const motm = p.rs.filter((x) => x.rating >= (matchMaxRating.get(x.matchId) ?? 99)).length
      return { playerId: p.playerId, name: p.name, season, forma, seqStr, trend, absent, n: sorted.length, motm }
    })
    .sort((a, b) => b.season - a.season)
    .slice(0, 6)
  const lines = players.map((p) => {
    const flag = injured.has(p.name) ? "⚠️(fora) " : ""
    const motmStr = p.motm > 0 ? ` · ${p.motm}× MOTM` : ""
    const absStr = p.absent > 0 ? ` · **faltou ${p.absent}/${teamGames.length}**` : ""
    return `  - ${flag}**${p.name}** nota **${p.season}** (season) · forma ${p.forma}${arrow(p.forma, p.season)} (últ.5 do time: ${p.seqStr} ${p.trend})${absStr}${motmStr} · ${p.n}j${playerStatLine(p.playerId)}`
  })
  return `- **Nota média do time (todas comps): ${teamAvg}**\n${lines.join("\n")}`
}
const oppOf = (p: Row, id: string) => (p.homeTeamId === id ? p.awayTeamId : p.homeTeamId)
const sotFor = (p: Row, id: string) => statByMatchTeam.get(p.id)?.get(id)?.sot ?? 0
const sotAgainst = (p: Row, id: string) => statByMatchTeam.get(p.id)?.get(oppOf(p, id))?.sot ?? 0
const kpFor = (p: Row, id: string) => statByMatchTeam.get(p.id)?.get(id)?.kp ?? 0
const hasSot = (p: Row, id: string) => statByMatchTeam.get(p.id)?.has(id) ?? false

// Estatística de TIME por partida (DOS-002): posse, chutes totais/na-área, big chances criadas — do
// include `statistics` da SportMonks (match_team_stats), o que não existe per-jogador no nosso feed.
const teamStatRows = await db.select().from(matchTeamStats)
const teamStatsByMatch = new Map<string, Map<string, (typeof teamStatRows)[number]>>()
for (const r of teamStatRows) {
  let mm = teamStatsByMatch.get(r.matchId)
  if (!mm) {
    mm = new Map()
    teamStatsByMatch.set(r.matchId, mm)
  }
  mm.set(r.teamId, r)
}
type TeamStatField = "shotsTotal" | "shotsInsidebox" | "shotsOutsidebox" | "shotsOffTarget" | "shotsBlocked" | "bigChancesCreated" | "dangerousAttacks" | "possession" | "tackles" | "interceptions" | "duelsWon" | "crossesAccurate" | "dribblesSuccessful"
// Média de um campo de match_team_stats sobre os jogos do time que têm a linha (null-safe).
function teamStatAvg(rows: Row[], id: string, field: TeamStatField): number | null {
  const vals = rows.map((p) => teamStatsByMatch.get(p.id)?.get(id)?.[field]).filter((v): v is number => v != null)
  return vals.length ? +(vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : null
}
// Mesma média, mas devolve FEITO (do time) e SOFRIDO (do oponente naquele jogo) de uma team-stat — pra ler
// o estilo nos dois sentidos: ataques perigosos criados vs concedidos, chutes bloqueados nossos vs do
// adversário que travamos, chutes de fora nossos vs cedidos. Cada lado conta só jogos com a linha (null-safe).
function teamStatForAgainst(rows: Row[], id: string, field: TeamStatField): { made: number; conceded: number } | null {
  const fr: number[] = []
  const ag: number[] = []
  for (const p of rows) {
    const vf = teamStatsByMatch.get(p.id)?.get(id)?.[field]
    const va = teamStatsByMatch.get(p.id)?.get(oppOf(p, id))?.[field]
    if (vf != null) fr.push(vf)
    if (va != null) ag.push(va)
  }
  if (!fr.length && !ag.length) return null
  const mean = (a: number[]) => (a.length ? +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(1) : 0)
  return { made: mean(fr), conceded: mean(ag) }
}

// Pênaltis convertidos (DOS-002 fix): com o relabel, pênalti tem goal.type="penalty". Tira-se da
// conversão (gols/SoT) — pênalti (~76%) não é finalização de jogada aberta e inflaria a eficiência.
const penaltyGoalRows = await db.query.goal.findMany({ where: (g, { eq }) => eq(g.type, "penalty") })
const penaltiesFor = (rows: Row[], id: string): number => {
  const ids = new Set(rows.map((p) => p.id))
  return penaltyGoalRows.filter((g) => ids.has(g.matchId) && g.teamId === id).length
}
const penaltiesAgainst = (rows: Row[], id: string): number => {
  const ids = new Set(rows.map((p) => p.id))
  return penaltyGoalRows.filter((g) => ids.has(g.matchId) && g.teamId !== id).length
}

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
  pctInvolve: number // % dos gols do time em que ele participou (gol OU assistência) — season inteira
  recentN: number; recentGA: number; recentTeamGoals: number; recentPctInvolve: number // forma recente: últimos N jogos que ELE jogou
  withN: number; withGf: number; withoutN: number; withoutGf: number; dropPct: number
  sotPerGame: number | null // SoT/jogo do próprio jogador (o volume direto que sai com ele)
  withSot: number; withoutSot: number // SoT/jogo do TIME com ele vs sem ele
  // Volume DEFENSIVO/CRIATIVO do jogador por jogo (o que o time perde além de gols): interceptações,
  // desarmes, duelos, cruzamentos certos, dribles certos, key passes. `intShare` = % das interceptações
  // do time que são dele; with/without de interceptações = a defesa piora sem ele?
  pInt: number | null; pTkl: number | null; pDuel: number | null; pCross: number | null; pDrib: number | null; pKp: number | null
  intShare: number | null; withInt: number | null; withoutInt: number | null
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
    // SoT + volume DEFENSIVO/CRIATIVO do próprio jogador (pré-cutoff, jogos que jogou) + médias do TIME.
    const psRows = await db
      .select({
        matchId: lineup.matchId, sot: lineupPlayer.shotsOnTarget, mins: lineupPlayer.minutesPlayed,
        tkl: lineupPlayer.tackles, intc: lineupPlayer.interceptions, duel: lineupPlayer.duelsWon,
        cross: lineupPlayer.crossesAccurate, drib: lineupPlayer.dribblesSuccessful, kp: lineupPlayer.keyPasses,
      })
      .from(lineupPlayer)
      .innerJoin(lineup, eq(lineupPlayer.lineupId, lineup.id))
      .where(and(eq(lineupPlayer.playerId, i.playerId), eq(lineup.teamId, teamId)))
    const psPlayed = psRows.filter((r) => ids.has(r.matchId) && (r.mins ?? 0) > 0)
    const ppg = (sel: (r: (typeof psPlayed)[number]) => number | null): number | null =>
      psPlayed.length ? +(psPlayed.reduce((s, r) => s + (sel(r) ?? 0), 0) / psPlayed.length).toFixed(1) : null
    const sotPerGame = psPlayed.length ? +(psPlayed.reduce((s, r) => s + (r.sot ?? 0), 0) / psPlayed.length).toFixed(2) : null
    const pInt = ppg((r) => r.intc), pTkl = ppg((r) => r.tkl), pDuel = ppg((r) => r.duel)
    const pCross = ppg((r) => r.cross), pDrib = ppg((r) => r.drib), pKp = ppg((r) => r.kp)
    const withInt = teamStatAvg(withRows, teamId, "interceptions")
    const withoutInt = teamStatAvg(withoutRows, teamId, "interceptions")
    const intShare = pInt != null && withInt ? Math.round((pInt / withInt) * 100) : null
    const wS = sotAvg(withRows, teamId)
    const woS = sotAvg(withoutRows, teamId)
    // Forma recente: nos últimos 5 jogos do TIME, % dos gols que tiveram participação dele (G+A) —
    // "o quanto o time dependeu dele agora", em vez da média da season inteira.
    const recentPlayed = ms.slice(-5)
    const recentIds = new Set(recentPlayed.map((x) => x.id))
    const recentTeamGoals = recentPlayed.reduce((s, x) => s + goalsFor(x, teamId), 0)
    const recentGA =
      playerGoals.filter((g) => recentIds.has(g.matchId) && g.type !== "own").length +
      playerAssists.filter((g) => recentIds.has(g.matchId)).length
    const recentPctInvolve = recentTeamGoals ? Math.round((recentGA / recentTeamGoals) * 100) : 0
    out.push({
      name: (p?.name ?? "?").trim(), reason: i.reason,
      goals, assists,
      pctGoals: teamTotalGoals ? Math.round((goals / teamTotalGoals) * 100) : 0,
      pctInvolve: teamTotalGoals ? Math.round(((goals + assists) / teamTotalGoals) * 100) : 0,
      recentN: recentPlayed.length, recentGA, recentTeamGoals, recentPctInvolve,
      withN: w.n, withGf: w.gf, withoutN: wo.n, withoutGf: wo.gf, dropPct,
      sotPerGame, withSot: wS.sf, withoutSot: woS.sf,
      pInt, pTkl, pDuel, pCross, pDrib, pKp, intShare, withInt, withoutInt,
      // Confound guard: zero contribuição direta (Traoré) OU amostra "sem" pequena (Stach 8j) → não confiar no with/without.
      // + sinal IMPLAUSÍVEL: o ataque "melhora" >20% SEM o jogador (dropPct < -20) é confound temporal
      // clássico (ele jogou na fase ruim, lesionou na boa) — Hudson-Odoi: 0.93 com ele vs 2.71 sem = −191%.
      confound: goals + assists === 0 || w.n < LOW_SAMPLE || wo.n < LOW_SAMPLE || dropPct < -20,
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
  return { n: k, seq: seq.reverse().join(""), pts, gf: +(gf / k).toFixed(2), ga: +(ga / k).toFixed(2), gfTotal: gf, gaTotal: ga, sf: sot.sf, sa: sot.sa }
}

// Grid de placar Poisson CORRIGIDO por Dixon-Coles → probabilidades de mercado. ÂNCORA determinística: o
// modelo PARTE daqui em vez de chutar over/BTTS/1x2. TODOS os mercados derivam da MESMA matriz (coerentes
// por construção). @feature MOD-004
function poissonPmf(k: number, lambda: number): number {
  let p = Math.exp(-lambda)
  for (let i = 1; i <= k; i++) p *= lambda / i
  return p
}
// ρ de Dixon-Coles: corrige a correlação dos 4 placares baixos (0-0/1-0/0-1/1-1) que o Poisson independente
// erra — sobe empate e BTTS, reforma o placar exato baixo (quase não mexe no over 2.5 ≈0, provado no backtest). Valor
// PROVISÓRIO da literatura (PL ~−0.13); o número definitivo sai do MLE do backtest (scripts/_backtest-dc.ts,
// MOD-004 P2) conforme a base cresce. @feature MOD-004
const DC_RHO = -0.13
function dcTau(h: number, a: number, lh: number, la: number, rho: number): number {
  if (h === 0 && a === 0) return 1 - lh * la * rho
  if (h === 0 && a === 1) return 1 + lh * rho
  if (h === 1 && a === 0) return 1 + la * rho
  if (h === 1 && a === 1) return 1 - rho
  return 1
}
function marketProbs(lh: number, la: number, rho = DC_RHO) {
  const MAX = 10
  const ph = Array.from({ length: MAX + 1 }, (_, k) => poissonPmf(k, lh))
  const pa = Array.from({ length: MAX + 1 }, (_, k) => poissonPmf(k, la))
  // Grid conjunto P(h,a) com τ de Dixon-Coles + renormalização — a matriz de onde tudo deriva.
  const g: number[][] = []
  let sum = 0
  for (let h = 0; h <= MAX; h++) {
    g[h] = []
    for (let a = 0; a <= MAX; a++) {
      const p = ph[h]! * pa[a]! * dcTau(h, a, lh, la, rho)
      g[h]![a] = p
      sum += p
    }
  }
  let home = 0, draw = 0, away = 0, over15 = 0, over25 = 0, over35 = 0, btts = 0, oddT = 0, mg01 = 0, mg23 = 0, mg4 = 0
  const scores: { score: string; p: number }[] = []
  for (let h = 0; h <= MAX; h++) {
    for (let a = 0; a <= MAX; a++) {
      const p = g[h]![a]! / sum
      const t = h + a
      if (h > a) home += p
      else if (h === a) draw += p
      else away += p
      if (t >= 2) over15 += p
      if (t >= 3) over25 += p
      if (t >= 4) over35 += p
      if (h >= 1 && a >= 1) btts += p
      if (t % 2 === 1) oddT += p
      if (t <= 1) mg01 += p
      else if (t <= 3) mg23 += p
      else mg4 += p
      if (h <= 5 && a <= 5) scores.push({ score: `${h}-${a}`, p })
    }
  }
  const pc = (x: number) => Math.round(x * 100)
  const notDraw = home + away || 1 // guarda contra /0
  const topScores = scores.sort((x, y) => y.p - x.p).slice(0, 4).map((z) => ({ score: z.score, prob: pc(z.p) }))
  const fair = (x: number) => (x > 0.005 ? +(1 / x).toFixed(2) : null)
  return {
    home: pc(home), draw: pc(draw), away: pc(away),
    over15: pc(over15), over25: pc(over25), over35: pc(over35), btts: pc(btts),
    // ---- mercados derivados do MESMO grid corrigido (MOD-004) ----
    dcHomeDraw: pc(home + draw), dcHomeAway: pc(home + away), dcDrawAway: pc(draw + away),
    dnbHome: pc(home / notDraw), dnbAway: pc(away / notDraw),
    oddPct: pc(oddT), evenPct: pc(1 - oddT),
    mg01: pc(mg01), mg23: pc(mg23), mg4: pc(mg4),
    topScores,
    fairHome: fair(home), fairDraw: fair(draw), fairAway: fair(away),
  }
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

// Último jogo REAL do time antes deste, cruzando competições (liga OU copa) — base honesta do descanso.
function lastMatchAnyComp(teamId: string): Row | null {
  const lg = teamMatches(teamId).at(-1) ?? null
  const cup = cupMatchesOf(teamId).at(-1) ?? null
  if (lg && cup) return cup.date > lg.date ? cup : lg
  return lg ?? cup
}
// Rest days cruzando competições: dias desde o último jogo de QUALQUER torneio (a copa de meio de semana
// também cansa as pernas). O cálculo só-liga superestimava o descanso quando havia mata-mata no meio de
// semana — é essa fadiga real que o modelo precisa ver ("ressaca de meio de semana"). @feature LIG-005
function restDays(teamId: string): number | null {
  const prev = lastMatchAnyComp(teamId)
  if (!prev) return null
  return Math.round((Date.parse(CUTOFF) - Date.parse(prev.date)) / 86_400_000)
}
// Diz QUAL foi o último jogo (competição + data) — pra o modelo saber quando o time jogou por último,
// sobretudo quando foi COPA (o que o número só-liga escondia): ex. "(último: FA Cup Final, 2026-05-16)".
function lastMatchNote(teamId: string): string {
  const last = lastMatchAnyComp(teamId)
  if (!last) return ""
  const isCup = cupCodes.includes(last.leagueCode)
  const comp = isCup ? `${cupNameByCode.get(last.leagueCode) ?? last.leagueCode}${last.stageName ? ` ${last.stageName}` : ""}` : "liga"
  return ` (último: ${comp}, ${last.date})`
}

const homeAll = avg(teamMatches(home.id), home.id)
const awayAll = avg(teamMatches(away.id), away.id)
// SoT agregado (geral) + conversão de cada time. conv = % dos PRÓPRIOS SoT que viram gol (finalização);
// convDef = % dos SoT SOFRIDOS que viram gol (qualidade das chances concedidas / solidez defensiva).
const homeSotAll = sotAvg(teamMatches(home.id), home.id)
const awaySotAll = sotAvg(teamMatches(away.id), away.id)
// Conversão de JOGADA ABERTA (DOS-002): exclui pênaltis pra não inflar a finalização real.
const homePens = penaltiesFor(teamMatches(home.id), home.id)
const awayPens = penaltiesFor(teamMatches(away.id), away.id)
// Math.max(0, …): a subtração cruza fontes (placar vs linhas goal type=penalty) — clamp contra gap de ingestão.
const homeConv = convPct(Math.max(0, homeAll.totalGf - homePens), homeSotAll.totalSf)
const awayConv = convPct(Math.max(0, awayAll.totalGf - awayPens), awaySotAll.totalSf)
const homeConvDef = convPct(Math.max(0, homeAll.totalGa - penaltiesAgainst(teamMatches(home.id), home.id)), homeSotAll.totalSa)
const awayConvDef = convPct(Math.max(0, awayAll.totalGa - penaltiesAgainst(teamMatches(away.id), away.id)), awaySotAll.totalSa)
// Gols esperados pela rota SoT: λ_SoT × conversão do time (compara com o λ de gols puro acima).
const xgViaSotHome = homeConv != null ? +(lambdaSotHome * (homeConv / 100)).toFixed(2) : null
const xgViaSotAway = awayConv != null ? +(lambdaSotAway * (awayConv / 100)).toFixed(2) : null
const homeKpPg = kpPerGame(teamMatches(home.id), home.id)
const awayKpPg = kpPerGame(teamMatches(away.id), away.id)
// Forma recente (momento): últimos 5 jogos de cada lado.
const homeF5 = recentForm(home.id, 5)
const awayF5 = recentForm(away.id, 5)
// Probabilidades de mercado por rota (Poisson sobre os λ): gols puro vs SoT×conversão. O modelo
// ancora nesses números calibrados em vez de inventar as porcentagens.
const probsGoals = marketProbs(lambdaHome, lambdaAway)
const probsSot = marketProbs(xgViaSotHome ?? lambdaHome, xgViaSotAway ?? lambdaAway)
const homeAbs = await absences(home.id, homeAll.totalGf)
const awayAbs = await absences(away.id, awayAll.totalGf)
const homeHalf = halfSplit(teamMatches(home.id), home.id)
const awayHalf = halfSplit(teamMatches(away.id), away.id)
// 1x2 por TEMPO (ÂNCORA do one_x_two_1t/2t): distribui o λ da Rota B pela proporção de gols de cada time
// em cada tempo (halfSplit) e roda o mesmo Poisson — assim o modelo NÃO precisa "derivar" sem número.
const lamH = xgViaSotHome ?? lambdaHome
const lamA = xgViaSotAway ?? lambdaAway
// Split 1ºT/2ºT REAL da liga (sobre os jogos jogados, via placar do intervalo) — baseline pro modelo saber
// o que é "normal" (a literatura aponta ~44/56) e fallback honesto do share1 quando um time não tem gols
// registrados (antes era 0.45 chutado). @feature MOD-004
let lgHtGoals = 0, lgFtGoals = 0
for (const p of played) { lgHtGoals += (p.htHome ?? 0) + (p.htAway ?? 0); lgFtGoals += (p.ftHome ?? 0) + (p.ftAway ?? 0) }
const leagueShare1 = lgFtGoals > 0 ? +(lgHtGoals / lgFtGoals).toFixed(3) : 0.45
// Baseline da liga por FAIXA de 15min: % dos gols da liga em cada janela (sobre os jogos jogados) — o
// "normal" contra o qual o modelo julga se o timing de um time é anômalo. @feature MOD-004
const leagueBandCounts = [0, 0, 0, 0, 0, 0]
const playedIds = played.map((p) => p.id)
if (playedIds.length) {
  const lgGoals = await db.select({ minute: goal.minute }).from(goal).where(inArray(goal.matchId, playedIds))
  for (const gg of lgGoals) if (gg.minute != null) leagueBandCounts[bandOf(gg.minute)]!++
}
const leagueBandTotal = leagueBandCounts.reduce((s, x) => s + x, 0) || 1
const leagueBandPct = leagueBandCounts.map((c) => Math.round((c / leagueBandTotal) * 100))
const share1 = (h: ReturnType<typeof halfSplit>) => (h.scored1 + h.scored2 > 0 ? h.scored1 / (h.scored1 + h.scored2) : leagueShare1)
const hShare1 = share1(homeHalf)
const aShare1 = share1(awayHalf)
// Meio-tempo: SEM Dixon-Coles (rho=0) — o τ foi calibrado pra jogo inteiro; aplicá-lo sobre λ de meio-tempo
// (menores) super-corrigiria o placar baixo por tempo. As âncoras 1t/2t ficam em Poisson puro. @feature MOD-004
const probs1t = marketProbs(lamH * hShare1, lamA * aShare1, 0)
const probs2t = marketProbs(lamH * (1 - hShare1), lamA * (1 - aShare1), 0)
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
  .select({ position: standing.position, zone: standing.zone })
  .from(standing)
  .where(and(eq(standing.leagueCode, m.leagueCode), eq(standing.seasonId, seasonId)))
const totalTeams = zoneRows.length
// CONTAGEM CONTÍGUA a partir da borda da tabela (não soma cega): a SportMonks cola a zona na posição do
// time E inclui vaga por TÍTULO (ex.: Crystal Palace 15º marcado UEFA_EUROPA_LEAGUE por ganhar a
// Conference), o que inflava a contagem. As vagas POR POSIÇÃO são as zonas coladas do topo (Europa) /
// do fundo (Z) até o primeiro buraco. Ordena por posição e conta até a sequência quebrar.
const byPos = [...zoneRows].sort((a, b) => a.position - b.position)
const isEuro = (z: string | null) => z === "champions" || z === "europa" || z === "conference"
let championsCount = 0
for (const r of byPos) {
  if (r.zone === "champions") championsCount += 1
  else break
}
let europeanCount = 0
for (const r of byPos) {
  if (isEuro(r.zone)) europeanCount += 1
  else break
}
let relegationCount = 0
for (let i = byPos.length - 1; i >= 0; i--) {
  if (byPos[i]?.zone === "relegation") relegationCount += 1
  else break
}
// Pontos das linhas na foto pré-jogo: 1ª vaga segura, última de Champions, última europeia.
const safetyLinePts = totalTeams && relegationCount ? (table[totalTeams - relegationCount - 1]?.points ?? null) : null
const championsLinePts = championsCount ? (table[championsCount - 1]?.points ?? null) : null
const europeanLinePts = europeanCount ? (table[europeanCount - 1]?.points ?? null) : null

// Jogos restantes (INCLUINDO este) de cada time — base do alcance matemático. Conta fixtures (com ou
// sem resultado) na data deste jogo ou depois. Sem o filtro isNotNull: jogos futuros entram aqui.
const allFixtures = await db
  .select({ h: match.homeTeamId, a: match.awayTeamId, date: match.date })
  .from(match)
  .where(and(eq(match.leagueCode, m.leagueCode), eq(match.seasonId, seasonId)))
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
// Mesma conta SOMANDO `extra` pontos ao time (cenário "se empatar/vencer ESTE jogo"): quantos ainda
// passariam. Base do "empate basta" — o estado de intenção entre "precisa vencer" e "já garantido".
const canFinishAboveWith = (id: string, extra: number) => {
  const b = boundOf(id)
  return b ? bounds.filter((o) => o.teamId !== id && o.maxPts > b.pts + extra).length : totalTeams
}
// Quantos times `id` JÁ NÃO ALCANÇA (mesmo vencendo tudo, eles já estão acima do seu máximo).
const guaranteedAbove = (id: string) => {
  const b = boundOf(id)
  return b ? bounds.filter((o) => o.teamId !== id && o.pts > b.maxPts).length : totalTeams
}

// Quem ainda pode ROUBAR a vaga do time (lado DEFENSIVO, o que faltava): os times ABAIXO na tabela cujo
// máximo de pontos alcança os pontos atuais do time. Pra cada ameaça, diz o que precisa — passar em
// pontos, ou (quando só EMPATA em pontos) virar o saldo, que é o cenário "você perde por muito + ele
// vence por muito". É o anti-binário do "já garantida": a vaga pode estar 99% travada, mas o prompt
// nomeia o concorrente real (ex.: Bournemouth) e o tamanho exato do milagre que ele precisa.
function contestersFor(teamId: string): string[] {
  const myPos = posOf(teamId)
  const myLine = lineOf(teamId)
  if (myPos == null || !myLine) return []
  const sg = (n: number) => (n >= 0 ? `+${n}` : `${n}`)
  const out: string[] = []
  for (let i = myPos; i < table.length; i++) {
    const r = table[i] // posição (i+1) — estritamente abaixo do time
    if (!r) continue
    const rb = boundOf(r.teamId)
    if (!rb || rb.maxPts < myLine.points) continue // nem empatando alcança → não é ameaça
    const head = `${nameOf(r.teamId)} (${i + 1}º, ${r.points} pts, máx ${rb.maxPts})`
    if (rb.maxPts > myLine.points)
      out.push(`${head} pode **passar em pontos** — vencendo, se o ${nameOf(teamId)} tropeçar`)
    else {
      const swing = myLine.gd - r.gd // lead de saldo do time sobre o rival (≥1 ⇒ rival precisa virar)
      out.push(
        `${head} empata em pontos mas está **${sg(-swing)} de saldo** (${sg(r.gd)} vs ${sg(myLine.gd)}) — só passa se o ${nameOf(teamId)} perder por muito E ele vencer por muito (virar ${swing})`,
      )
    }
  }
  return out
}

// Motivação de tabela com ALCANCE MATEMÁTICO. Garantido top-K ⇔ canFinishAbove < K; eliminado do top-K
// ⇔ guaranteedAbove ≥ K. Daí saem: seguro/ameaçado de rebaixamento, ainda-pode/já-era p/ campeão,
// Champions e vaga europeia. A `intensity` orienta a direção do xG: "alta" = precisa de pontos (ataca),
// "baixa" = nada em jogo (afrouxa).
function stakesFor(teamId: string, teamName: string): { intensity: "alta" | "media" | "baixa"; verdict: string; lines: string[]; pushes: boolean } {
  const b = boundOf(teamId)
  const pos = posOf(teamId)
  if (!b || pos == null) return { intensity: "media", verdict: "sem foto de tabela", lines: [], pushes: false } // sem jogos pré-cutoff
  const gr = gamesRemaining(teamId)
  const N = totalTeams, R = relegationCount, C = championsCount, Q = europeanCount
  const above = canFinishAbove(teamId) // podem passar
  const lost = guaranteedAbove(teamId) // já não alcança
  // Rivais que ainda alcançam os pontos do time (só quando ele DEFENDE uma vaga continental). Usado pra
  // qualificar "garantida" → "praticamente garantida" e pra nomear quem pode roubar (responde "e os de baixo?").
  const contesters = europeanCount && pos <= europeanCount ? contestersFor(teamId) : []
  const lockWord = contesters.length ? "praticamente" : "já"

  const relegationSafe = R ? above < N - R : true // garante terminar fora do Z
  const relegationDoomed = R ? lost >= N - R : false // já no fundo, matematicamente caído
  const titleClinched = above === 0
  const titlePossible = !titleClinched && lost === 0
  const championsClinched = C ? above < C : false
  const canChampions = C ? lost < C : false
  const europeanClinched = Q ? above < Q : false
  const canEuropean = Q ? lost < Q : false
  // Intenção fina ANTI-Z: o que o time precisa NESTE jogo pra travar a permanência? Empate basta
  // (contenta-se) vs só vencendo (precisa ir pra cima). canFinishAboveWith soma os pontos do cenário.
  const fightingDownNow = R > 0 && !relegationSafe && !relegationDoomed
  const drawSecuresStay = fightingDownNow && canFinishAboveWith(teamId, 1) < N - R
  const winSecuresStay = fightingDownNow && !drawSecuresStay && canFinishAboveWith(teamId, 3) < N - R
  // "Empate basta" = o time TRAVA o objetivo dele empatando → tende a ADMINISTRAR, não a se lançar (mata o over).
  // Cobre os dois lados: sair do Z (drawSecuresStay) E defender a vaga continental (setado no bloco de
  // concorrência abaixo, quando nenhum rival alcança os pontos-de-empate — ex.: 6º que já garante Europa no X).
  let drawSuffices = drawSecuresStay

  const lines: string[] = [`${teamName}: ${pos}º, ${b.pts} pts, ${gr} jogo(s) restante(s) (máx possível ${b.maxPts} pts)`]
  if (relegationDoomed) lines.push("já REBAIXADO matematicamente — sem objetivo de tabela.")
  else if (drawSecuresStay) lines.push("ainda não salvo, mas **um empate NESTE jogo já garante a permanência** — tende a jogar pra não perder, não a se lançar.")
  else if (winSecuresStay) lines.push("AINDA PODE CAIR — e **só uma vitória** garante a permanência neste jogo; precisa ir pra cima.")
  else if (!relegationSafe) lines.push("AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.")
  else lines.push("já SEGURO do rebaixamento.")
  if (titleClinched) lines.push("título já garantido.")
  else if (titlePossible) lines.push("ainda pode ser CAMPEÃO — precisa vencer.")
  if (championsClinched) lines.push(`vaga de Champions ${lockWord} garantida.`)
  else if (canChampions) lines.push("Champions ainda matematicamente possível.")
  else if (europeanClinched) lines.push(`vaga europeia ${lockWord} garantida.`)
  else if (canEuropean) lines.push("vaga europeia ainda matematicamente possível.")
  else if (relegationSafe && !titlePossible) lines.push("sem alvo continental alcançável.")

  const fightingDown = !relegationSafe && !relegationDoomed
  const chasingUpRaw = titlePossible || (canChampions && !championsClinched) || (canEuropean && !europeanClinched)

  // Distância de SALDO até a linha da zona perseguida. Quando o time só alcança a vaga EMPATANDO em
  // pontos, é o saldo que desempata (regra PL: pts → saldo → gols pró) — e virar muito saldo em poucos
  // jogos (goleada própria + tropeço alheio) é fantasia. "Vivo nos pontos, morto no saldo" ⇒ não se esforça.
  let chaseViable = chasingUpRaw
  if (chasingUpRaw) {
    const targetPos = titlePossible ? 1 : canChampions && !championsClinched ? C : Q
    const occ = table[targetPos - 1] // ocupante da última vaga da zona perseguida
    const mine = lineOf(teamId)
    if (occ && mine && occ.teamId !== teamId && b.maxPts === occ.points) {
      const swing = occ.gd - mine.gd + 1 // saldo a SUPERAR (empate em pontos → desempate por saldo)
      if (swing > 0) {
        chaseViable = swing <= 2 * gr // ~2 de saldo por jogo é o teto plausível; acima é goleada improvável
        const sg = (n: number) => (n >= 0 ? `+${n}` : `${n}`)
        lines.push(
          `distância de saldo p/ a vaga: empata em pontos com o ${posOf(occ.teamId)}º e precisa **virar ${swing} de saldo** (${sg(mine.gd)} vs ${sg(occ.gd)}) em ${gr} jogo(s) — ${chaseViable ? "viável" : "**exigiria goleada; porta praticamente fechada → não deve se matar**"}`,
        )
      }
    }
  }
  const chasingUp = chasingUpRaw && chaseViable
  const intensity: "alta" | "media" | "baixa" =
    relegationDoomed ? "baixa"
    : drawSecuresStay ? "media" // contenta-se com empate: 1 ponto trava a permanência
    : fightingDown || chasingUp ? "alta"
    : relegationSafe || chasingUpRaw ? "baixa"
    : "media"

  // Motivo dominante (o que ele luta / por que não luta) → vira o veredito explícito.
  const reason =
    drawSecuresStay ? "contenta-se com o EMPATE — 1 ponto garante a permanência (joga pra não perder)"
    : fightingDown ? "luta contra o rebaixamento"
    : chasingUp && titlePossible ? "briga pelo título"
    : chasingUp && canChampions && !championsClinched ? "briga por vaga de Champions"
    : chasingUp && canEuropean && !europeanClinched ? "briga por vaga europeia"
    : chasingUpRaw && !chaseViable ? "alvo continental matematicamente vivo mas REMOTO (saldo) — quase nada a jogar"
    : relegationDoomed ? "já rebaixado"
    : titleClinched ? "título já garantido"
    : championsClinched ? `Champions ${lockWord} garantida`
    : europeanClinched ? `vaga europeia ${lockWord} garantida`
    : "já seguro e sem alvo alcançável"
  const verdict =
    intensity === "alta" ? `PRECISA LUTAR — ${reason}`
    : intensity === "baixa" ? `NÃO precisa lutar — ${reason}`
    : reason
  lines.push(`→ motivação: **${intensity}** — ${verdict}`)
  // Concorrência pela vaga (defesa de zona continental): a condição do próprio time (empate basta?) +
  // os rivais nomeados que ainda ultrapassam (passam em pontos) ou encostam (empatam → saldo decide).
  if (europeanCount && pos <= europeanCount) {
    if (!contesters.length) lines.push(`disputa pela vaga (${pos}º): ninguém abaixo alcança ${b.pts} pts → já travado.`)
    else {
      const drawPts = b.pts + gr // se o time empatar tudo que falta
      const stillAfterDraw = table.slice(pos).filter((r) => (boundOf(r.teamId)?.maxPts ?? 0) >= drawPts).length
      if (stillAfterDraw === 0) drawSuffices = true // já trava a vaga empatando → administra (mesmo "alta" a perseguir acima)
      const lock =
        stillAfterDraw === 0
          ? `pro ${nameOf(teamId)} **um empate basta** (vai a ${drawPts}, fora do alcance) — só perde a vaga se PERDER`
          : `o ${nameOf(teamId)} **precisa vencer** pra travar (empate ainda deixa ${stillAfterDraw} rival vivo)`
      lines.push(`disputa pela vaga (${pos}º): ${lock}. Quem ainda ameaça → ${contesters.join("; ")}`)
    }
  }
  // pushes = de fato vai PRA CIMA neste jogo: precisa de pontos (alta) E um empate NÃO trava o objetivo.
  // Time garantido/rebaixado/remoto (baixa/media) ou que "empate basta" (administra) → pushes=false.
  const pushes = intensity === "alta" && !drawSuffices
  return { intensity, verdict, lines, pushes }
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
    const share = `season: **${a.pctGoals}% dos gols** do time (${a.pctInvolve}% com assists)`
    const trend = a.recentPctInvolve > a.pctInvolve + 5 ? "↑ mais decisivo AGORA" : a.recentPctInvolve < a.pctInvolve - 5 ? "↓ menos decisivo / time se adaptou" : "≈ estável"
    const recent = `**últimos ${a.recentN} jogos do time**: participou de ${a.recentGA}/${a.recentTeamGoals} gols = **${a.recentPctInvolve}%** (${trend})`
    const wow = `with/without: com ele ${a.withGf} g/j (${a.withN}j) vs sem ele ${a.withoutGf} g/j (${a.withoutN}j) = ${a.dropPct >= 0 ? "−" : "+"}${Math.abs(a.dropPct)}%`
    const sot = a.sotPerGame != null ? `; finaliza **${a.sotPerGame} SoT/jogo** (time: ${a.withSot} SoT/j com ele vs ${a.withoutSot} sem — volume mais estável que gols)` : ""
    const flag = a.confound ? "  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT" : ""
    const dp: string[] = []
    if (a.pInt != null) dp.push(`**${a.pInt} interceptações/j**${a.intShare != null ? ` (~${a.intShare}% do time)` : ""}`)
    if (a.pTkl != null) dp.push(`${a.pTkl} desarmes/j`)
    if (a.pDuel != null) dp.push(`${a.pDuel} duelos ganhos/j`)
    if (a.pCross != null) dp.push(`${a.pCross} cruz. certos/j`)
    if (a.pDrib != null) dp.push(`${a.pDrib} dribles certos/j`)
    if (a.pKp != null) dp.push(`${a.pKp} key passes/j`)
    const def = dp.length ? `\n  - Defesa/criação (volume PRÓPRIO/jogo — o que sai do time com a ausência dele): ${dp.join(" · ")}` : ""
    return `- **${a.name}** (${a.reason ?? "—"}) — ${ga} até a data; ${share}; ${recent}; ${wow}${sot}${flag}${def}`
  })
  return `### ${label}\n${lines.join("\n")}\n`
}

// Linha de forma recente (momento) pro prompt: últimos 5 (+10) com setas ↑/↓/= vs a média da season.
function formLines(f5: ReturnType<typeof recentForm>, seasonGf: number, seasonGa: number): string {
  if (!f5) return "- Forma recente: sem jogos suficientes"
  const arr = (r: number, s: number) => (r > s * 1.15 ? "↑" : r < s * 0.85 ? "↓" : "=")
  return `- **Forma (momento) — últimos ${f5.n}: ${f5.seq}** (${f5.pts}pts) · **${f5.gfTotal} feitos / ${f5.gaTotal} sofridos** · marca ${f5.gf}${arr(f5.gf, seasonGf)} / sofre ${f5.ga}${arr(f5.ga, seasonGa)} g/j · SoT ${f5.sf} feito / ${f5.sa} sofrido`
}

// Estilo do time num recorte (temporada ou últimos N) em FEITO/SOFRIDO por jogo: ataques perigosos, chutes
// pra fora, chutes bloqueados e chutes de fora da área — lê como o time pressiona e o que concede dos dois lados.
function styleLine(label: string, rows: Row[], id: string): string {
  const fmt = (x: { made: number; conceded: number } | null) => (x ? `${x.made}/${x.conceded}` : "?/?")
  const dang = teamStatForAgainst(rows, id, "dangerousAttacks")
  const off = teamStatForAgainst(rows, id, "shotsOffTarget")
  const blk = teamStatForAgainst(rows, id, "shotsBlocked")
  const out = teamStatForAgainst(rows, id, "shotsOutsidebox")
  return `- **${label}** (feito/sofrido por jogo): ataques perigosos ${fmt(dang)} · chutes pra fora ${fmt(off)} · bloqueados ${fmt(blk)} · de fora da área ${fmt(out)}`
}

const homeStakes = stakesFor(home.id, home.name)
const awayStakes = stakesFor(away.id, away.name)
// Veredito de INTENÇÃO no nível do JOGO (o filtro que mais separou acerto de erro no backtest): "os dois
// vão pra cima" (ninguém se contenta com empate → jogo abre → over/ataque coerentes) vs "intenção
// assimétrica/travada" (≥1 lado administra, está garantido ou rebaixado → quem precisa pode não furar o
// ferrolho → NÃO favoreça over/goleada por inércia estatística).
const bothPush = homeStakes.pushes && awayStakes.pushes
const intentHeadline = bothPush
  ? "🔥 **VEREDITO DE INTENÇÃO: OS DOIS PRECISAM IR PRA CIMA** (nenhum se contenta com empate) → o jogo tende a ABRIR. Over / handicap de quem ataca / team_total GANHAM peso — aposta de gol é COERENTE aqui."
  : "⚠️ **VEREDITO DE INTENÇÃO: ASSIMÉTRICA / JOGO TENDE A TRAVAR** — pelo menos um lado NÃO precisa ir pra cima (já garantido, rebaixado, sem alvo, ou **um empate basta** → ADMINISTRA). O lado que precisa pode NÃO furar o ferrolho, e quem administra segura o jogo. **NÃO** favoreça over / goleada / handicap de mando por inércia estatística — prefira UNDER ou mercado de MENOR variância (team_total over 0.5 do lado que precisa, dupla chance), OU rebaixe a confiança. Foi exatamente neste tipo de jogo que a leitura puramente estatística mais errou no histórico."

// ---- Momentum / fluxo de jogo dos últimos 5 (SIN-021) ----
// Reusa o buildMomentum canônico (delta+pesos+EMA, period-aware): pra cada jogo PASSADO do time, mede o
// DOMÍNIO DE FLUXO — quanto da pressão total da partida foi dele (share %), no jogo todo e nos últimos 15'.
// Lê como o time joga e ADMINISTRA o jogo (pressiona / cresce no fim / apaga). Pré-cutoff, sem vazamento.
const momTrendIds = [...new Set([...teamMatches(home.id).slice(-5), ...teamMatches(away.id).slice(-5)].map((p) => p.id))]
const momTrendRows = momTrendIds.length
  ? await db
      .select({ matchId: matchTrend.matchId, teamId: matchTrend.teamId, typeId: matchTrend.typeId, periodId: matchTrend.periodId, minute: matchTrend.minute, value: matchTrend.value })
      .from(matchTrend)
      .where(inArray(matchTrend.matchId, momTrendIds))
  : []
const trendsByMatch = new Map<string, TrendInput[]>()
for (const r of momTrendRows) {
  let arr = trendsByMatch.get(r.matchId)
  if (!arr) trendsByMatch.set(r.matchId, (arr = []))
  arr.push({ teamId: r.teamId, typeId: r.typeId, periodId: r.periodId, minute: r.minute, value: r.value })
}
// Gols COM MINUTO dos jogos do momentum — pra CRUZAR o minuto do gol com a curva de pressão (quando o time
// "bate de verdade": gol durante surto = pressão produtiva; gol sofrido em queda longa = vulnerável).
const momGoalRows = momTrendIds.length
  ? await db.select({ matchId: goal.matchId, teamId: goal.teamId, minute: goal.minute }).from(goal).where(inArray(goal.matchId, momTrendIds))
  : []
const goalsByMatch = new Map<string, { teamId: string; minute: number | null }[]>()
for (const g of momGoalRows) {
  let arr = goalsByMatch.get(g.matchId)
  if (!arr) goalsByMatch.set(g.matchId, (arr = []))
  arr.push({ teamId: g.teamId, minute: g.minute })
}
// Tabela recomputada AO ENTRAR num jogo (só com jogos ANTES daquela data — anti-leak): posição, pontos e
// jogos disputados de cada time. Base pra qualificar a forma e o stake de cada partida passada.
type AsOf = { pos: number; pts: number; played: number }
const standingsAsOf = (dateStr: string): Map<string, AsOf> => {
  const tbl = new Map<string, { pts: number; gd: number; gf: number; pl: number }>()
  const g = (id: string) => { let v = tbl.get(id); if (!v) tbl.set(id, (v = { pts: 0, gd: 0, gf: 0, pl: 0 })); return v }
  for (const p of played.filter((r) => r.date < dateStr)) {
    const hs = p.ftHome ?? 0, as = p.ftAway ?? 0
    const h = g(p.homeTeamId), a = g(p.awayTeamId)
    h.gf += hs; h.gd += hs - as; h.pl++; a.gf += as; a.gd += as - hs; a.pl++
    if (hs > as) h.pts += 3; else if (hs < as) a.pts += 3; else { h.pts++; a.pts++ }
  }
  const ranked = [...tbl.entries()].sort((p, q) => q[1].pts - p[1].pts || q[1].gd - p[1].gd || q[1].gf - p[1].gf)
  return new Map(ranked.map(([id, v], i) => [id, { pos: i + 1, pts: v.pts, played: v.pl }]))
}
// "Já estava classificado/decidido?" de um time AO ENTRAR num jogo — JUSTIFICA o resultado (quem já está salvo
// e sem alvo afrouxa; quem briga pra não cair se mata). Condições CONSERVADORAS (só rotula o que é claro).
// PL: 3 caem, ~7 pegam Europa, 38 rodadas. maxGain = 3 × jogos restantes do time.
const ROUNDS = 38, RELEG = 3, EUROPE = 7
const statusAsOf = (id: string, dateStr: string): string => {
  const st = standingsAsOf(dateStr)
  const me = st.get(id)
  if (!me) return ""
  const ranked = [...st.values()].sort((a, b) => a.pos - b.pos)
  const N = ranked.length
  const ptsAt = (rank: number) => ranked[Math.min(Math.max(rank, 1), N) - 1]?.pts ?? 0
  const maxGain = 3 * (ROUNDS - me.played)
  if (me.pos <= EUROPE) return me.pts - ptsAt(EUROPE + 1) > maxGain ? " Eur-gar" : " briga-top"
  if (me.pos > N - RELEG && me.pts + maxGain < ptsAt(N - RELEG)) return " REBAIX."
  const safe = me.pts - ptsAt(N - RELEG + 1) > maxGain
  if (!safe && me.pos >= N - RELEG - 2) return " briga-Z"
  if (safe) return me.pts + maxGain < ptsAt(EUROPE) ? " salvo/s-alvo" : " salvo"
  return ""
}
// Média de gols feito/sofrido do time NO MANDO daquele jogo (casa OU fora), só com jogos ANTES da data — a
// "média que ele tinha jogando casa/fora" ao entrar. Contextualiza o placar.
const splitAvgAsOf = (id: string, dateStr: string, isHome: boolean): { gf: number; ga: number } | null => {
  const ms = played.filter((r) => r.date < dateStr && (isHome ? r.homeTeamId === id : r.awayTeamId === id))
  if (!ms.length) return null
  let f = 0, a = 0
  for (const p of ms) { f += goalsFor(p, id); a += goalsAgainst(p, id) }
  return { gf: Math.round((f / ms.length) * 10) / 10, ga: Math.round((a / ms.length) * 10) / 10 }
}
// Bloco LIMPO "últimos 5 em contexto": cada resultado JUSTIFICADO numa linha — adversário + status decidido
// dos dois times (salvo? rebaixado? brigando?) + a média do time no mando daquele jogo. Lê forma sem ser enganado.
function contextoUltimos5(teamId: string): string {
  // Últimos 5 jogos em QUALQUER competição (liga + copa), cronológico — a forma mostra contra quem foi,
  // casa/fora, e marca 🏆 os que foram de copa (FA Cup/Carabao). Jogo de liga mantém o contexto de tabela.
  const ms = [...teamMatches(teamId).map((p) => ({ p, cup: false })), ...cupMatchesOf(teamId).map((p) => ({ p, cup: true }))]
    .sort((a, b) => a.p.date.localeCompare(b.p.date))
    .slice(-5)
  if (!ms.length) return "- (sem jogos)"
  const legend =
    "_Situação de cada time AO ENTRAR no jogo (justifica o resultado): **salvo**=fora do rebaixamento · **salvo/s-alvo**=salvo E sem nada a jogar (tende a afrouxar) · **briga-Z**=lutava p/ não cair (se mata) · **briga-top**/**Eur-gar**=brigava/garantiu Europa · **REBAIX.**=já rebaixado. Sem rótulo = ainda indefinido naquela rodada._"
  const lines = ms
    .map(({ p, cup }) => {
      const isHome = p.homeTeamId === teamId
      const oppId = isHome ? p.awayTeamId : p.homeTeamId
      const tbl = standingsAsOf(p.date)
      const myPos = tbl.get(teamId)?.pos, oppPos = tbl.get(oppId)?.pos
      const split = splitAvgAsOf(teamId, p.date, isHome)
      const gf = goalsFor(p, teamId), ga = goalsAgainst(p, teamId)
      const res = gf > ga ? "V" : gf < ga ? "D" : "E"
      const mando = isHome ? "casa" : "fora"
      const splitStr = split ? ` · seu ${mando} até ali ${split.gf} marca/${split.ga} sofre` : ""
      // "Como foi o jogo": placar do INTERVALO (mostra virada/entregou vantagem/controle) + SoT feito-sofrido
      // (o resultado mereceu ou foi sorte de finalização?). @feature MOD-004
      const htF = (isHome ? p.htHome : p.htAway), htA = (isHome ? p.htAway : p.htHome)
      const htStr = htF != null && htA != null ? `, HT ${htF}-${htA}` : ""
      const sotStr = hasSot(p, teamId) ? `${sotFor(p, teamId)}-${sotAgainst(p, teamId)} SoT · ` : ""
      if (cup) return `- ${isHome ? "vs" : "@"} **${nameOf(oppId)}** (${mando} · **${res} ${gf}-${ga}**${htStr}) — ${sotStr}🏆 ${cupNameByCode.get(p.leagueCode) ?? p.leagueCode}`
      return `- ${isHome ? "vs" : "@"} **${nameOf(oppId)}** (${mando} · **${res} ${gf}-${ga}**${htStr}) — ${sotStr}adv ${oppPos ?? "?"}º${statusAsOf(oppId, p.date)} · você ${myPos ?? "?"}º${statusAsOf(teamId, p.date)}${splitStr}`
    })
    .join("\n")
  return `${legend}\n${lines}`
}
// Consistência de marcar/sofrer na season (pré-cutoff): MARCOU em X de Y (recorte casa/fora), não-marcou, clean
// sheet, BTTS. É o que sustenta "casa marca" como aposta de baixa variância — a MÉDIA esconde, a frequência não.
function consistencyLine(id: string): string {
  const ms = teamMatches(id)
  if (!ms.length) return "- **Consistência:** sem jogos."
  const sc = ms.filter((p) => goalsFor(p, id) >= 1).length
  const cs = ms.filter((p) => goalsAgainst(p, id) === 0).length
  const btts = ms.filter((p) => goalsFor(p, id) >= 1 && goalsAgainst(p, id) >= 1).length
  const home = ms.filter((p) => p.homeTeamId === id)
  const away = ms.filter((p) => p.awayTeamId === id)
  const scH = home.filter((p) => goalsFor(p, id) >= 1).length
  const scA = away.filter((p) => goalsFor(p, id) >= 1).length
  return `- **Consistência: MARCOU em ${sc}/${ms.length}** (casa ${scH}/${home.length} · fora ${scA}/${away.length}) · não-marcou ${ms.length - sc} · clean sheet ${cs} · BTTS ${btts}/${ms.length}`
}

// Momentum MINUTO A MINUTO do time num jogo (SIN-021): a curva COMPLETA do 1º ao último minuto. Reusa o
// buildMomentum canônico e densifica por minuto inteiro (carry-forward nos minutos sem ponto). Devolve o NET
// na ótica do time (momentum dele − do adversário): + = ele pressionando, − = sendo pressionado; magnitude =
// intensidade do domínio. null se o jogo não tem trends ingeridos (cobertura / fixture antigo).
function minuteNet(p: Row, teamId: string): number[] | null {
  const tr = trendsByMatch.get(p.id)
  if (!tr?.length) return null
  const curve = buildMomentum(tr, p.homeTeamId, p.awayTeamId)
  if (!curve.length) return null
  const isHome = teamId === p.homeTeamId
  const maxMin = Math.max(...curve.map((pt: MomentumPoint) => pt.minute))
  const netAt = new Map<number, number>()
  for (const pt of curve) netAt.set(pt.minute, Math.round(isHome ? pt.home - pt.away : pt.away - pt.home))
  const out: number[] = []
  let last = 0
  for (let mm = 1; mm <= maxMin; mm++) {
    const v = netAt.get(mm)
    if (v !== undefined) last = v
    out.push(last)
  }
  return out
}
// Momentum médio por FAIXA de 15 min (agregado dos últimos 5): net médio do time em cada janela. + = ele
// costuma DOMINAR o fluxo ali, − = costuma ser DOMINADO. É a curva minuto-a-minuto digerida em 6 números
// pro cruzamento — o código faz a conta que o LLM não faria (cruzar 90 pontos × 90). @feature MOD-004
function momentumBands(teamId: string): number[] | null {
  const curves = teamMatches(teamId).slice(-5).map((p) => minuteNet(p, teamId)).filter((c): c is number[] => c !== null)
  if (!curves.length) return null
  const sum = [0, 0, 0, 0, 0, 0]
  const cnt = [0, 0, 0, 0, 0, 0]
  for (const net of curves) {
    for (let mm = 0; mm < net.length; mm++) {
      const b = Math.min(5, Math.floor(mm / 15)) // minuto mm (0-based) → faixa; acréscimo cai na última
      sum[b]! += net[mm]!
      cnt[b]! += 1
    }
  }
  return sum.map((s, i) => (cnt[i] ? +(s / cnt[i]!).toFixed(1) : 0))
}
// CRUZAMENTO DE MOMENTUM (a conclusão mastigada): pra cada janela, o quanto o mandante costuma dominar MENOS
// o quanto o visitante costuma dominar. Índice > 0 = janela do mandante (ele pressiona E o outro afunda ali);
// < 0 = janela do visitante. Entrega a JANELA DE GOL provável em vez de despejar as curvas cruas. @feature MOD-004
function momentumCrossBlock(): string {
  const hb = momentumBands(home.id)
  const ab = momentumBands(away.id)
  if (!hb || !ab) return "**Cruzamento de momentum:** sem trends suficientes nos últimos 5 (cobertura)."
  const B6 = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90"]
  const sg = (n: number) => (n > 0 ? `+${n}` : `${n}`)
  const idx = hb.map((h, i) => +(h - ab[i]!).toFixed(1)) // >0 mandante · <0 visitante
  let bh = 0, ba = 0
  idx.forEach((v, i) => { if (v > idx[bh]!) bh = i; if (v < idx[ba]!) ba = i })
  const rows = B6.map((b, i) => `| ${b} | ${sg(hb[i]!)} | ${sg(ab[i]!)} | ${sg(idx[i]!)} ${idx[i]! > 1.5 ? "🏠" : idx[i]! < -1.5 ? "✈️" : "≈"} |`)
  const head =
    `**Janela de gol provável pela curva de momentum** — ${home.name}: **${B6[bh]}** (domínio ${sg(idx[bh]!)}) · ${away.name}: **${B6[ba]}** (domínio ${sg(idx[ba]!)}). ` +
    `Cruze com o timing de gols e com a intenção: se a janela de quem PRECISA do gol coincide com a fraqueza do outro, é ali que o gol tende a sair.`
  return `${head}\n\n| Faixa | ${home.name} domínio/j | ${away.name} domínio/j | cruzamento |\n|---|---|---|---|\n${rows.join("\n")}`
}
// Atividade DEFENSIVA por faixa de 15 min, dos trends por minuto: interceptações (100) + desarmes (78).
// Alta numa faixa = time DEFENDENDO/sob pressão ali. Cruza com a curva ofensiva e os gols sofridos.
const DEF_TYPES = new Set([100, 78])
function defenseBands(matchId: string, teamId: string): number[] | null {
  const tr = (trendsByMatch.get(matchId) ?? []).filter((t) => t.teamId === teamId && DEF_TYPES.has(t.typeId))
  if (!tr.length) return null
  // O `value` é CUMULATIVO no JOGO INTEIRO (períodos continuam), com glitches ocasionais (cai e volta). Por isso
  // NÃO se soma delta ponto-a-ponto (cada queda inflaria); usa-se o MÁXIMO acumulado em cada fronteira de faixa
  // (15/30/45/60/75) e o total da faixa = diferença entre fronteiras. Robusto a glitch. Rank do período = ordem cronológica.
  const bounds = [15, 30, 45, 60, 75, 9999]
  const periodMin = new Map<number, number>()
  for (const t of tr) { const c = periodMin.get(t.periodId); if (c === undefined || t.minute < c) periodMin.set(t.periodId, t.minute) }
  const rank = new Map([...periodMin.entries()].sort((a, b) => a[1] - b[1]).map(([pid], i) => [pid, i]))
  const slot = (pid: number, m: number) => (rank.get(pid) ?? 0) * 1000 + m
  const bands = [0, 0, 0, 0, 0, 0]
  const byType = new Map<number, typeof tr>()
  for (const t of tr) { let s = byType.get(t.typeId); if (!s) byType.set(t.typeId, (s = [])); s.push(t) }
  for (const series of byType.values()) {
    series.sort((a, b) => slot(a.periodId, a.minute) - slot(b.periodId, b.minute))
    const boundVal = [0, 0, 0, 0, 0, 0]
    let mx = 0, bi = 0
    for (const p of series) {
      while (bi < 5 && p.minute > bounds[bi]!) { boundVal[bi] = mx; bi++ }
      mx = Math.max(mx, p.value)
    }
    for (let k = bi; k < 6; k++) boundVal[k] = mx
    let prev = 0
    for (let k = 0; k < 6; k++) { bands[k]! += Math.max(0, boundVal[k]! - prev); prev = boundVal[k]! }
  }
  return bands
}

// Bloco de momentum do time: pra CADA um dos últimos 5, a curva net minuto a minuto (1→fim) — o jogo
// inteiro. Agrupada de 15 em 15 (separador |) só pra orientar a leitura, mas é minuto a minuto. + = o time
// pressionando, − = sendo pressionado. Mostra completo como ele conduz e SOFRE o jogo ao longo dos 90.
function momentumLines(teamId: string): string {
  const rows = teamMatches(teamId)
    .slice(-5)
    .map((p) => ({ p, net: minuteNet(p, teamId) }))
    .filter((x): x is { p: Row; net: number[] } => x.net !== null)
  if (!rows.length) return "- **Momentum minuto a minuto (últimos 5):** sem trends ingeridos para estes jogos."
  // Rótulo de minuto por faixa de 15 + ‖INTERVALO‖ entre o 1º e o 2º tempo; minutos acima de 90 são acréscimo.
  const CHUNK_LABELS = ["1'-15'", "16'-30'", "31'-45'", "46'-60'", "61'-75'", "76'-90'", "91'+"]
  const fmtSeq = (net: number[]) => {
    const parts: string[] = []
    for (let i = 0, c = 0; i < net.length; i += 15, c++) {
      const label = CHUNK_LABELS[c] ?? `${i + 1}'+`
      parts.push(`${label} [${net.slice(i, i + 15).map((v) => (v > 0 ? `+${v}` : `${v}`)).join(" ")}]`)
    }
    if (parts.length > 3) parts.splice(3, 0, "‖INTERVALO‖")
    return parts.join(" · ")
  }
  const per = rows
    .map(({ p, net }) => {
      const isHome = p.homeTeamId === teamId
      const oppId = isHome ? p.awayTeamId : p.homeTeamId
      const gf = goalsFor(p, teamId)
      const ga = goalsAgainst(p, teamId)
      const res = gf > ga ? "V" : gf < ga ? "D" : "E"
      const gls = (goalsByMatch.get(p.id) ?? []).slice().sort((x, y) => (x.minute ?? 0) - (y.minute ?? 0))
      const glsStr = gls.length ? gls.map((g) => `${g.minute ?? "?"}'${g.teamId === teamId ? "✓" : "✗"}`).join(" ") : "—"
      const dfb = defenseBands(p.id, teamId)
      const dfStr = dfb
        ? `${dfb.slice(0, 3).map((v, i) => `${CHUNK_LABELS[i]} **${v}**`).join(" · ")} ‖ ${dfb.slice(3).map((v, i) => `${CHUNK_LABELS[i + 3]} **${v}**`).join(" · ")}`
        : "—"
      return `  - ${isHome ? "vs" : "@"} ${nameOf(oppId)} (${isHome ? "CASA" : "FORA"} · ${res} ${gf}-${ga}) — min 1→${net.length}:\n    📈 pressão (net/min): ${fmtSeq(net)}\n    ⚽ gols: ${glsStr}\n    🛡️ defesa (interceptações+desarmes): ${dfStr}`
    })
    .join("\n")
  return `(NET na ótica do time: + pressiona / - sofre; magnitude = intensidade · minutos por faixa de 15 · **‖INTERVALO‖** = fim do 1ºT · após 90' é acréscimo. A linha **⚽** traz o minuto de cada gol (**✓**=ele marcou / **✗**=sofreu) — CRUZE com a curva: gol durante SURTO de pressão = pressão PRODUTIVA (sabe converter quando bate); gol sofrido numa QUEDA longa = vulnerável sob pressão. A linha **🛡️** é a atividade DEFENSIVA (interceptações+desarmes) por faixa de 15' (alta = o time defendendo/sob pressão ali) — defende MUITO numa faixa E sofre gol nela = **não segura**; defende pouco e não sofre = controla. Cruze também mandante × visitante: a janela onde um pressiona e o outro afunda é onde sai gol.)\n${per}`
}

const prompt = `# Prognóstico de expected goals — ${home.name} x ${away.name}

**IMPORTANTE: raciocine E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno (thinking), deve ser em português do Brasil.

---

**PARTE 1 · COMO RACIOCINAR** — o método abaixo é COMO você pensa. Os dados do jogo vêm na Parte 2.

## Você
O **melhor apostador de futebol do mundo** — um **sharp**, não um palpiteiro. Seu edge é método, frieza e **EVIDÊNCIA** — mas você conhece a verdade que separa o sharp do robô: **estatística é PREVISÃO, não destino.** O Poisson, o xG, o λ são uma *taxa-base* (a melhor hipótese a priori) e são **cegos ao que o jogo VAI virar** — não sabem que um 0-1 obriga o perdedor a se lançar, que um time que precisa de pontos atropela quando o rival afrouxa, que o jogo tem *roteiro*. O número é seu **ponto de partida, nunca o veredito.** Em cima dele entra a sua leitura — o "feeling" do apostador, que aqui **NÃO é achismo**: é ler a intenção, o roteiro provável e a assimetria do confronto, **cada passo amarrado a um dado deste briefing**. Você busca **valor** (não certeza), dimensiona o risco e **crava o melhor mercado** — inclusive handicap e total-do-time quando capturam o cenário melhor que o O/U do jogo —, calibrando a **confiança** à margem real (nunca "passa", nunca regride pro meio por covardia).

## Como raciocinar — em GRAFO, não em linha reta (Graph of Thoughts)
Não despeje uma lista linear; construa um **grafo de raciocínio**:
1. **Nós** — isole os fatores em jogo: base rate, **intenção de cada time**, desfalques, estilo (volume/finalização), forma recente, mando, fadiga, clima.
2. **Arestas — CRUZE (o passo que mais importa)**: número isolado não prevê nada; o que prevê é o **confronto**. Conecte ataque de A × defesa de B (e o inverso); intenção × estilo; desfalque × volume; forma × base rate. Para CADA métrica ofensiva de um time, cruze com a defensiva correspondente do outro.
3. **Peso por evidência** — um nó ou aresta só move o número se tiver evidência **nomeada e quantificada** nos dados abaixo. Sem dado concreto, não mexe na âncora. Diga sempre direção E tamanho.
4. **Síntese** — convirja os nós + o **roteiro do jogo** (você o monta na seção a seguir) num veredito único. O Poisson é o seu prior; o roteiro é o que o ATUALIZA. Quando dois fatores se contradizem, declare qual vence e por quê — e quando o roteiro contraria a média, **siga o roteiro**, com o dado que o sustenta na mão.

## Use TUDO o que está no briefing — dado não-comentado é dado desperdiçado
O briefing abaixo é denso DE PROPÓSITO: **cada bloco existe pra ser USADO no raciocínio**, não pra enfeitar nem "viver no prompt". Percorra TODOS e, de cada um, tire uma **conclusão nomeada** (o que ESTE dado diz sobre o jogo?); depois cruze as conclusões entre si. Regra dura: **não cite um número sem dizer o que ele IMPLICA**, e não pule nenhum bloco.
- **Momentum minuto a minuto (últimos 5):** leia o PADRÃO de cada curva — onde o time pressiona, onde afunda, o que faz depois de MARCAR (administra/mata o jogo?) e depois de SOFRER (desmorona/reage?). Pese **CASA vs FORA** de cada jogo (dominar fluxo em casa vale menos que dominar fora) e ONDE no relógio o surto caiu (largada, pós-‖INTERVALO‖, reta final/acréscimos têm leituras diferentes). Depois **cruze a curva do mandante × a do visitante**: a janela em que um costuma pressionar e o outro costuma afundar é onde o gol tende a sair NESTE jogo.
- **Estilo feito×sofrido, forma recente (QUALIFICADA pela posição do adversário — vencer/empatar com time da ZONA não é forma real; perder pro líder é desculpável), CONSISTÊNCIA (marca/sofre — frequência, não média), timing de gols por faixa, desfalques, intenção de tabela, clima, descanso/viagem:** cada um vira uma frase de conclusão ligada ao confronto — nunca um dado solto largado. Cruze a forma com a qualidade dos adversários enfrentados e com a consistência de marcar/sofrer.
- Só NÃO gaste thinking em conta mecânica (conferir se as bands somam o \`xg\`): o runtime normaliza isso. Gaste o raciocínio em ANÁLISE e SÍNTESE — é aí que está o seu edge.
Suas conclusões precisam APARECER no raciocínio e sustentar o veredito. Se um fator forte do briefing não mexeu em nada, **diga por quê** — senão você o desperdiçou.

## Intenção dos times — leia ANTES dos números (é o que mais move um jogo)
Pela tabela/stakes abaixo, crave o que CADA time quer NESTE jogo específico:
- **Joga pra GANHAR** (precisa de pontos) → ataca e se expõe atrás → **+xG, +over**, menos solidez.
- **Contenta-se com o EMPATE** (1 ponto já garante o objetivo, ou empatar fora já é bom resultado) → controla, joga pra não perder → **−xG, −over**.
- **NÃO está nem aí** (já classificado, já rebaixado, ou sem alvo alcançável) → afrouxa a intensidade → **−xG do jogo todo** e leitura mais ruidosa.
**Stake assimétrico** (um precisa muito, o outro não) é o sinal mais forte do tabuleiro — pese a direção com convicção. Quando a assimetria é forte E o estilo/desfalques confirmam, o jogo costuma ser **UNILATERAL**: o time que precisa pode marcar BEM acima do seu xG médio (uma goleada não é exceção quando o rival afrouxa). **Calibre a magnitude, não só a direção**: não ancore tímido na média — deixe o xG do time dominante fugir da base rate quando os fatores convergem, e não force um under só porque o total "costuma" ser baixo.

## Roteiro do jogo — projete o FILME, não só a foto (é aqui que mora o feeling)
A estatística te dá a foto (médias). O gol nasce do FILME — e o filme tem ramificações. ANTES de cravar números, escreva os **2-3 roteiros mais prováveis** e, em cada um, a **cascata condicional** (o que cada gol DESENCADEIA):
- **Quem provavelmente marca primeiro?** (pela intenção + assimetria ataque×defesa). E então: o que o OUTRO é obrigado a fazer? Time que vai perdendo e precisa de pontos se lança → o jogo escancara → total e handicap SOBEM. Favorito que faz 2-0 cedo pode ADMINISTRAR — mas **CUIDADO: administrar NÃO é sinônimo de jogo morto**. Recuar e comprimir a defesa **AUMENTA o risco de sofrer** (evidência de tracking, sobretudo num 1-0 tardio de azarão que se tranca): o líder é encurralado, cede escanteio/bola parada e o gol pode sair — pra ELE (contra-ataque, o líder marca ~53% dos gols nesse cenário) OU contra. NÃO empurre under automático só porque "o favorito administra"; o over pode se sustentar justamente pela pressão do perseguidor + a fragilidade da vantagem de 1 gol (cai em ~37% dos jogos).
- **Ramifique dos DOIS lados (seja simétrico):** roteiros que ABREM (perseguição, dois times que precisam, defesa que vaza fora) E roteiros que FECHAM (um se contenta com empate e o outro sem fôlego; favorito que mata e poupa; jogo amarrado de poucas chances). Não force over nem under — deixe o roteiro mais provável mandar.
- **O placar muda as taxas, e o Poisson é CEGO a isso** (trata cada time como taxa fixa e independente, os dois eventos descorrelacionados). Você não: se o roteiro provável é de perseguição, o total real fica ACIMA do Poisson; se é de controle/administração, ABAIXO.
- **Cada roteiro AMARRADO a um dado** ("toma 1.8/jogo fora E precisa de pontos → ao sofrer o 1º, se lança → cascata de over / handicap do mandante"). Sem dado que o sustente, é achismo — descarte.
- **Leia o momentum MINUTO A MINUTO dos últimos 5** (bloco de cada time): a curva net (quem pressiona a cada minuto, do 1º ao último) mostra o jogo INTEIRO — se o time começa forte, afunda no meio, surta no fim, segura vantagem ou desmorona ao sofrer gol. É evidência direta de como ele conduz E SOFRE o game-state (surto sustentado no fim = sustenta roteiro de perseguição; queda longa após marcar = tenta administrar — mas isso EXPÕE a defesa à pressão do outro, não garante que o resultado se segura).

## Método numérico
**PARTA da base rate** abaixo (duas rotas: λ de gols puro E λ_SoT × conversão) e das **probabilidades Poisson já calculadas** — esse é o seu **PRIOR**, não o veredito — e **ATUALIZE** pelo roteiro + cada fator, justificando direção e tamanho com evidência nomeada. Regras:
- **Poisson é o PRIOR; o roteiro é a ATUALIZAÇÃO.** Seu \`over25_prob\`, \`btts_prob\` e \`one_x_two\` PARTEM da Rota B, mas **MOVA-OS com convicção** quando o roteiro + a assimetria apontam um lado — cego ao placar, o Poisson regride pra média; você não precisa. Desvio grande exige fator nomeado e quantificado; **mas timidez também é erro** — não devolva a média só porque "o total costuma ser baixo". Só fique colado no prior quando NÃO há fator nem roteiro claro.
- **SoT é o sinal de VOLUME primário** — 3× mais denso que gols, logo menos ruído. Use gols para a CONVERSÃO (gols/SoT) e como checagem. Onde as rotas divergem, confie mais no SoT (a diferença é finalização que regride à conversão do time).
- **Cruze feito × sofrido**: ataque de um time × o que o outro CONCEDE (ex.: ataques perigosos/SoT que A cria × que B permite). O confronto manda, não a média solta.
- O **desconto por desfalque age no VOLUME (SoT/λ_SoT)**, não na conversão. **NÃO double-conte**: desfalque que já estava fora nos últimos jogos já está na média recente. Desfalque **DEFENSIVO** (alto volume PRÓPRIO de interceptações/desarmes e/ou alto **% das interceptações do time** — vide bloco de desfalques) → a defesa do time piora → **+gols do ADVERSÁRIO** (sobe o λ do OUTRO time, não o dele). Use o número **PESSOAL** do jogador; a interceptação AGREGADA do time é ruidosa (sobe quando o time tem menos a bola).
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️ e prefira o de **SoT** (mais estável que o de gols).
- Incerteza: NÃO temos xG real — SoT é o melhor proxy de volume/qualidade; chutes totais, posse e clima entram como contexto.

---

**PARTE 2 · OS DADOS DO JOGO** — analise e tire UMA CONCLUSÃO de CADA seção abaixo (cada \`##\` e cada \`###\`). O que você não comentar, você desperdiçou. É daqui que sai o veredito.

## Contexto
- Data: ${m.date} ${m.time ?? ""} · Rodada ${m.round} · Liga ${m.leagueCode}
- Local: ${matchVenue ? `${matchVenue.name}${matchVenue.cityName ? `, ${matchVenue.cityName}` : ""}` : "—"}${matchVenue?.surface ? ` (${matchVenue.surface})` : ""}
- Clima: ${matchWeather ? `${matchWeather.description ?? "?"} · ${w1(matchWeather.tempDay)}°C (sens. ${w1(matchWeather.feelsLikeDay)}°C) · vento ${w1(matchWeather.windSpeed)} m/s · umidade ${matchWeather.humidity ?? "?"} · nuvens ${matchWeather.clouds ?? "?"}` : "—"} (contexto — NÃO assuma que chuva/vento reduzem gols; nesta liga o tempo ruim NÃO teve correlação com o total: jogos de chuva severa/vento forte deram 2.9 gols/j vs 2.84 da liga)
- Descanso: ${home.name} ${restDays(home.id) ?? "?"} dias${lastMatchNote(home.id)} · ${away.name} ${restDays(away.id) ?? "?"} dias${lastMatchNote(away.id)}${travelKm != null ? `\n- Viagem do visitante: ~${travelKm} km` : ""}
- **Descanso / fadiga** (números acima — a nota "(último: …)" diz de ONDE vem, e COPA no meio de semana pesa mais): poucos dias de folga puxam **rotação, menos intensidade e queda na reta final** (−xG no fim, defesa mais exposta tarde). O sinal é a **ASSIMETRIA**: um lado bem mais descansado que o outro favorece o mais FRESCO, sobretudo no 2º tempo. Cruze com a intenção — cansado que PRECISA vencer ainda se lança (efeito menor); cansado SEM stake real administra/poupa (efeito maior). Só mexa no número com folga REAL de dias; diferença de 1-2 dias é ruído.
- Média da liga (pré-jogo, ${played.length} jogos): mandante ${leagueHomeAvg} gols/jogo · visitante ${leagueAwayAvg} gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +${+(leagueHomeAvg - leagueAwayAvg).toFixed(2)} gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de ${CUTOFF})
- ${home.name}: ${posOf(home.id) ?? "?"}º, ${lineOf(home.id)?.points ?? 0} pts · ${away.name}: ${posOf(away.id) ?? "?"}º, ${lineOf(away.id)?.points ?? 0} pts
- Linhas: segurança (sair do Z) ${safetyLinePts ?? "?"} pts (${totalTeams - relegationCount}º) · Champions ${championsLinePts ?? "?"} pts (${championsCount}º) · última vaga europeia ${europeanLinePts ?? "?"} pts (${europeanCount}º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
${homeStakes.lines.map((s) => `  - ${s}`).join("\n")}
${awayStakes.lines.map((s) => `  - ${s}`).join("\n")}

${intentHeadline}

## ${home.name} (manda) — até ${CUTOFF}

### Gols & finalização (season)
- Total **${homeAll.totalGf} marcados / ${homeAll.totalGa} sofridos** em ${homeAll.n}j · média **${homeAll.gf} marca / ${homeAll.ga} sofre** por jogo
- **Em casa (${homeHome.n}j): marca ${homeHome.gf} / sofre ${homeHome.ga}** (${homeHome.totalGf} gols) · por tempo: 1ºT ${homeHalf.scored1}/${homeHalf.conceded1} · 2ºT ${homeHalf.scored2}/${homeHalf.conceded2}
- **Finalização: ${homeSotAll.totalSf} SoT (${homeSotAll.sf}/j · casa ${homeHomeSot.sf}/j) · conv ${homeConv ?? "?"}%** (aberta, −${homePens} pên) · sofre ${homeSotAll.sa} SoT/j (adv ${homeConvDef ?? "?"}%) · ${homeKpPg} KP/j
- **Volume: ${teamStatAvg(teamMatches(home.id), home.id, "shotsTotal") ?? "?"} chutes/j (${teamStatAvg(teamMatches(home.id), home.id, "shotsInsidebox") ?? "?"} na área) · ${teamStatAvg(teamMatches(home.id), home.id, "bigChancesCreated") ?? "?"} big chances/j** · posse ${teamStatAvg(teamMatches(home.id), home.id, "possession") ?? "?"}%

### Estilo (feito/sofrido por jogo)
${styleLine("Temporada", teamMatches(home.id), home.id)}
${styleLine("Últimos 5", teamMatches(home.id).slice(-5), home.id)}

### Qualidade individual (notas · season vs forma)
${ratingsBlock(home.id, new Set(homeAbs.map((a) => a.name)))}

### Forma & contexto (últimos 5 — cada resultado justificado)
${formLines(homeF5, homeAll.gf, homeAll.ga)}
${consistencyLine(home.id)}
${contextoUltimos5(home.id)}

### Momentum minuto a minuto (últimos 5)
${momentumLines(home.id)}

### Distribuição de gols por faixa (season)
${timingLines(homeTiming)}

${absBlock(`Desfalques de ${home.name} neste jogo`, homeAbs)}
## ${away.name} (visita) — até ${CUTOFF}

### Gols & finalização (season)
- Total **${awayAll.totalGf} marcados / ${awayAll.totalGa} sofridos** em ${awayAll.n}j · média **${awayAll.gf} marca / ${awayAll.ga} sofre** por jogo
- **Fora (${awayAway.n}j): marca ${awayAway.gf} / sofre ${awayAway.ga}** (${awayAway.totalGf} gols) · por tempo: 1ºT ${awayHalf.scored1}/${awayHalf.conceded1} · 2ºT ${awayHalf.scored2}/${awayHalf.conceded2}
- **Finalização: ${awaySotAll.totalSf} SoT (${awaySotAll.sf}/j · fora ${awayAwaySot.sf}/j) · conv ${awayConv ?? "?"}%** (aberta, −${awayPens} pên) · sofre ${awaySotAll.sa} SoT/j (adv ${awayConvDef ?? "?"}%) · ${awayKpPg} KP/j
- **Volume: ${teamStatAvg(teamMatches(away.id), away.id, "shotsTotal") ?? "?"} chutes/j (${teamStatAvg(teamMatches(away.id), away.id, "shotsInsidebox") ?? "?"} na área) · ${teamStatAvg(teamMatches(away.id), away.id, "bigChancesCreated") ?? "?"} big chances/j** · posse ${teamStatAvg(teamMatches(away.id), away.id, "possession") ?? "?"}%

### Estilo (feito/sofrido por jogo)
${styleLine("Temporada", teamMatches(away.id), away.id)}
${styleLine("Últimos 5", teamMatches(away.id).slice(-5), away.id)}

### Qualidade individual (notas · season vs forma)
${ratingsBlock(away.id, new Set(awayAbs.map((a) => a.name)))}

### Forma & contexto (últimos 5 — cada resultado justificado)
${formLines(awayF5, awayAll.gf, awayAll.ga)}
${consistencyLine(away.id)}
${contextoUltimos5(away.id)}

### Momentum minuto a minuto (últimos 5)
${momentumLines(away.id)}

### Distribuição de gols por faixa (season)
${timingLines(awayTiming)}

${absBlock(`Desfalques de ${away.name} neste jogo`, awayAbs)}
## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

${crossTable(home.name, homeTiming, away.name, awayTiming)}

${crossTable(away.name, awayTiming, home.name, homeTiming)}

### Cruzamento de MOMENTUM (fluxo minuto-a-minuto dos últimos 5, já cruzado pra você)
A curva de momentum foi digerida e CRUZADA em código — não precisa cruzar 90 pontos na mão, use a conclusão abaixo (quem domina cada janela) junto com o cruzamento de gols acima.

${momentumCrossBlock()}

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ ${home.name} (casa) = ${lambdaHome} · λ ${away.name} (fora) = ${lambdaAway} · total = ${+(lambdaHome + lambdaAway).toFixed(2)}

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- ${home.name}: λ_SoT ${lambdaSotHome} × conv ${homeConv ?? "?"}% → **${xgViaSotHome ?? "?"} gols**
- ${away.name}: λ_SoT ${lambdaSotAway} × conv ${awayConv ?? "?"}% → **${xgViaSotAway ?? "?"} gols**
- total via SoT = ${xgViaSotHome != null && xgViaSotAway != null ? +(xgViaSotHome + xgViaSotAway).toFixed(2) : "?"}
- **Índice de volume do jogo**: λ_SoT total ${+(lambdaSotHome + lambdaSotAway).toFixed(1)} vs média da liga ${+(leagueHomeSotAvg + leagueAwaySotAvg).toFixed(1)} SoT → ${lambdaSotHome + lambdaSotAway > (leagueHomeSotAvg + leagueAwaySotAvg) * 1.1 ? "**ACIMA** (jogo de volume → pressão de OVER)" : lambdaSotHome + lambdaSotAway < (leagueHomeSotAvg + leagueAwaySotAvg) * 0.9 ? "**ABAIXO** (jogo travado → pressão de UNDER)" : "na média"}
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson corrigido por **Dixon-Coles** sobre os λ — seu PRIOR: parta daqui e ATUALIZE pelo roteiro; não invente do zero, mas não congele na média)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | ${probsGoals.home}/${probsGoals.draw}/${probsGoals.away}% | ${probsSot.home}/${probsSot.draw}/${probsSot.away}% |
| Over 1.5 | ${probsGoals.over15}% | ${probsSot.over15}% |
| Over 2.5 | ${probsGoals.over25}% | ${probsSot.over25}% |
| Over 3.5 | ${probsGoals.over35}% | ${probsSot.over35}% |
| BTTS | ${probsGoals.btts}% | ${probsSot.btts}% |

**Mercados derivados do MESMO grid corrigido** (Rota B — já coerentes entre si; use como prior destes mercados):
- **Dupla chance**: 1X **${probsSot.dcHomeDraw}%** · 12 **${probsSot.dcHomeAway}%** · X2 **${probsSot.dcDrawAway}%** · **Draw No Bet** casa ${probsSot.dnbHome}% / fora ${probsSot.dnbAway}%
- **Placar exato (mais prováveis)**: ${probsSot.topScores.map((s) => `${s.score} ${s.prob}%`).join(" · ")}
- **Odd/Even**: ímpar ${probsSot.oddPct}% / par ${probsSot.evenPct}% · **Multigoals**: 0-1 ${probsSot.mg01}% · 2-3 ${probsSot.mg23}% · 4+ ${probsSot.mg4}%
- **Team totals** (marginais do λ da Rota B — a prob de CADA time marcar; base do \`team_total\`): ${home.name} over 0.5 **${Math.round((1 - poissonPmf(0, lamH)) * 100)}%** / over 1.5 **${Math.round((1 - poissonPmf(0, lamH) - poissonPmf(1, lamH)) * 100)}%** · ${away.name} over 0.5 **${Math.round((1 - poissonPmf(0, lamA)) * 100)}%** / over 1.5 **${Math.round((1 - poissonPmf(0, lamA) - poissonPmf(1, lamA)) * 100)}%**
- **Fair odds no-vig (1x2, calculadas pelo grid — não pelo mercado)**: casa ${probsSot.fairHome ?? "?"} · empate ${probsSot.fairDraw ?? "?"} · fora ${probsSot.fairAway ?? "?"}. São PROBABILIDADE JUSTA, não veredito de valor (sem odds do mercado ingeridas não há EV/CLV — não prometa "aposta certa").
- ⚠️ O grid Dixon-Coles JÁ corrige o empate pra cima (o Poisson independente o subestima). **O empate / dupla chance é pick LEGÍTIMO** quando o prior aqui aponta — NÃO o rebaixe por covardia; num jogo travado de poucos gols o X costuma ser o de MENOR variância com valor.

**Baseline da liga (1ºT/2ºT):** ${Math.round(leagueShare1 * 100)}% dos gols saem no 1º tempo / ${Math.round((1 - leagueShare1) * 100)}% no 2º (sobre ${played.length} jogos jogados). Use como referência pra dizer se um time é ANÔMALO no timing (o padrão da literatura é ~44/56 — 2º tempo mais goleador por fadiga/game-state).
**Baseline por faixa de 15min (% dos gols da liga):** ${BANDS.map((b, i) => `${b}: ${leagueBandPct[i]}%`).join(" · ")}. É a curva NORMAL — compare o timing de cada time (bloco "Distribuição de gols por faixa") contra ela; desvio grande (marca/sofre muito mais que a liga numa janela) é o sinal de onde o gol tende a sair NESTE jogo.

**1x2 por tempo** (λ da Rota B repartido pela proporção de gols de cada tempo — ÂNCORA de \`one_x_two_1t\`/\`one_x_two_2t\`): 1ºT casa/E/fora **${probs1t.home}/${probs1t.draw}/${probs1t.away}%** · 2ºT **${probs2t.home}/${probs2t.draw}/${probs2t.away}%**.
São as probabilidades que o volume IMPLICA — seu **prior**, não a resposta. Seus \`over25_prob\`, \`btts_prob\` e \`one_x_two\` **partem** destes números (Rota B principal) e então você os **MOVE pelo roteiro + fator nomeado** (motivação, desfalque, fadiga, mando, perseguição), dizendo direção e tamanho. Se o roteiro mais provável contraria a média, **siga o roteiro** (com o dado na mão). Sem fator nem roteiro, fique no prior — nunca regrida pro meio por covardia.

---

**PARTE 3 · SUA SAÍDA**

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (\`summary\`, \`analysis\`) em português.
**Por time** — \`home\` (= ${home.name}) e \`away\` (= ${away.name}), cada um com:
- \`xg\` (total), \`xg_1t\`, \`xg_2t\` e **\`xg_bands\`** = o xG nas 6 faixas de 15 min (\`"0-15"\`,\`"16-30"\`,\`"31-45"\`,\`"46-60"\`,\`"61-75"\`,\`"76-90"\`). Dê a distribuição APROXIMADA pelo cruzamento ataque×defesa por faixa — **NÃO gaste raciocínio conferindo a soma**: o runtime normaliza as bands pra somar \`xg\` (e o 1ºT = 3 primeiras).
  - **FORMA da curva (não só o total):** parta do baseline da liga (~44% no 1ºT / 56% no 2ºT, pico em \`"76-90"\`). ${bothPush ? "**Os dois PRECISAM ir pra cima** → concentre MAIS massa nas faixas TARDIAS (\`\"61-75\"\`/\`\"76-90\"\`): fadiga + desespero simultâneos empurram o gol pro fim. Mas o lado que estiver PERSEGUINDO (vai perdendo) converte PIOR no fim (chute apressado) — não infle demais o \`\"76-90\"\` DELE além do baseline." : "Sem os dois empurrando, siga o baseline; um jogo travado/administrado NÃO tem o surto tardio — não force massa no fim."} Mata-mata/decisão/derby REDUZ o 1ºT (share ~35-39%, cautela tática).
- \`summary\` (PT) = leitura CURTA daquele time (1-2 frases): motivação de tabela, desfalque que pesa, mando, e como isso move o xG dele.

**Geral** (\`general\`) — agregados do jogo:
- \`total\`, \`total_1t\`, \`total_2t\`, \`over25_prob\`, \`btts_prob\`.
- **1x2 (home/draw/away)** em 3 recortes: \`one_x_two\` (jogo 90min), \`one_x_two_1t\` (1º tempo), \`one_x_two_2t\` (2º tempo isolado). PARTA dos priors "1x2 por tempo" acima e mova pelo roteiro / fator nomeado.
- \`confidence\` ∈ {low, medium, high} e \`summary\` (PT) = 1 parágrafo do jogo + a maior incerteza.

No topo: \`drivers\` = os 3 fatores (frases em PT) que mais moveram o número.

**\`best_bet\`** — a sua leitura de APOSTADOR (a DECISÃO, em campos SEPARADOS; **não** escreva o nome do time, ele sai de \`selection\`/\`team\`):
- \`market\`: \`"1x2"\` | \`"over_under"\` | \`"btts"\` | \`"handicap"\` | \`"team_total"\` | \`"double_chance"\` | \`"draw_no_bet"\` | \`"odd_even"\` — crave SEMPRE o de **maior valor**, o que o ROTEIRO mais favorece. **\`double_chance\`/\`draw_no_bet\`** são as opções de MENOR variância pra proteger um lado ou bancar o empate/azarão sólido — use os priors de "Mercados derivados" acima (já saem do grid Dixon-Coles corrigido) — **OBRIGATÓRIO escolher um mercado; NUNCA "passar"/"sem aposta". Mesmo no jogo mais imprevisível existe o mercado de MENOR risco; é esse que você crava.** **Em jogo assimétrico, handicap ou total-do-time costumam pagar MAIS que o O/U do jogo**: se o mandante atropela mas o visitante pode marcar de bola parada, "mandante \`handicap\` -1" ou "mandante \`team_total\` over 1.5" captura o cenário sem depender do total exato. NÃO se ancore por default no O/U 2.5. **MENOR variância**: quando o mandante MARCA em casa com alta frequência (vide Consistência) E o visitante está DESENGAJADO (nada em jogo na tabela), \`team_total\` over 0.5/1.5 do mandante ganha sem depender de vitória (que um empate nega) NEM de BTTS (que depende do visitante desinteressado marcar) — costuma ser a leitura mais segura.
- **⛔ ANTI-REFLEXO DE OVER/UNDER (regra dura):** \`over_under\` NÃO é o default. Antes de cravá-lo, PERGUNTE: o mercado de RESULTADO/menor-variância não paga melhor aqui? **Se o empate do grid Dixon-Coles está alto (≥ ~30%) e o jogo é equilibrado/de poucos gols (λ total baixo), o pick de valor costuma ser \`double_chance\` (1X/X2), \`draw_no_bet\`, ou o próprio EMPATE — NÃO o under reflexo.** Um jogo 1-1/0-0 provável é onde a dupla chance e o empate ganham; cravar "under 2.5" ali joga fora o valor do resultado. Só vá de \`over_under\` quando o TOTAL for de fato a leitura de maior valor (roteiro de gols claro), não por hábito.
- **DISCIPLINA DE VARIÂNCIA (regra de escolha — aplique ANTES de cravar):** entre mercados de valor parecido, crave SEMPRE o de MENOR variância. Do mais seguro ao mais arriscado: **(1)** \`team_total\` over 0.5 ("time marca" — ganha com UM gol; a trava quando o time marca com alta frequência no mando, vide Consistência) → **(2)** \`double_chance\` (1X/X2 — ganha em DOIS dos três resultados; a trava pra bancar favorito sólido OU proteger contra o empate num jogo equilibrado) · \`draw_no_bet\` (empate devolve a aposta — risco menor que 1x2) · \`team_total\` over 1.5 ou \`handicap\` de favorito claro (dependem de UM time, não do placar exato) → **(3)** \`over_under\` — **a LINHA é a alavanca de variância; NÃO fique preso no 2.5.** xG 2.3 → "under 3.5" é quase trava (margem enorme), "under 2.5" é apertado; xG 3.2 → "over 2.5" tem folga, "over 1.5" é mais seguro ainda. Escolha a linha (1.5, 2, 2.5, 3, 3.5…) com MARGEM real pro xG; linha colada no xG (margem < 0.3) é cara-ou-coroa → afaste a linha ou troque de mercado → **(4)** \`1x2\` (o empate nega; só com vitória nítida) → **(5)** \`btts\` é o MAIS ARRISCADO (depende dos DOIS marcarem). **NUNCA aposte \`btts\` quando um lado está DESENGAJADO** (já salvo / sem alvo / rebaixado) — ele é o elo fraco que pode não marcar (é assim que se perde BTTS num 1-0; prefira "o lado forte marca" via \`team_total\`). A **anti-timidez é sobre o TAMANHO do xG** (não ancore tímido na média), **NÃO sobre escolher o mercado mais arriscado**: convicção na leitura, DISCIPLINA no mercado.
- **COERÊNCIA com a INTENÇÃO (a aposta NÃO pode contradizer seu próprio roteiro):** se você leu que um time **administra / se contenta com o empate / já está garantido** — mesmo jogando EM CASA —, **NÃO banque o \`team_total\` ALTO dele** (over 1.5+): time satisfeito marca pra se garantir (no MÁXIMO over 0.5), NÃO pra golear. \`team_total\` over 1.5 é só pra time que PRECISA de gols (motivado, indo pra cima). Do mesmo jeito, não banque over agressivo num jogo que você mesmo descreveu como administrado/morno pelos dois lados. Se a aposta brigar com o roteiro, a aposta está errada — não o roteiro.
- **SIGA O "VEREDITO DE INTENÇÃO" (banner no bloco de motivação) — foi o filtro que MAIS separou acerto de erro no backtest:**
  - **🔥 os dois precisam ir pra cima** (nenhum se contenta com empate) → o jogo abre; over / handicap de quem ataca / \`team_total\` over 1.5 ganham peso — é o cenário onde a aposta de gol acerta.
  - **⚠️ assimétrica / trava** (≥1 lado administra, está garantido, rebaixado, sem alvo, ou **"empate basta"**) → **NÃO** crave over alto, goleada, nem handicap de mando por inércia estatística. O lado que PRECISA muitas vezes **não fura o ferrolho** (vira 1-0 / 1-1) e quem administra segura o jogo. Prefira **under** (numa linha com margem) OU o mercado de **MENOR variância**: \`team_total\` over 0.5 do lado que precisa, ou \`1x2\`/dupla-chance do lado motivado JOGANDO EM CASA — **nunca** banque o favorito motivado pra GOLEAR quem só defende (é a perda clássica). Aqui **rebaixe a confiança pra no máximo \`medium\`**.
- \`selection\`: 1x2 → \`"home"\`/\`"draw"\`/\`"away"\` · over_under → \`"over"\`/\`"under"\` · btts → \`"yes"\`/\`"no"\` · **handicap** → o time bancado \`"home"\`/\`"away"\` · **team_total** → \`"over"\`/\`"under"\` · **double_chance** → \`"home_draw"\` (1X) / \`"draw_away"\` (X2) / \`"home_away"\` (12) · **draw_no_bet** → o time bancado \`"home"\`/\`"away"\` · **odd_even** → \`"odd"\`/\`"even"\`.
- \`team\`: SÓ em \`team_total\` — de qual time é o total (\`"home"\`/\`"away"\`); \`null\` nos demais mercados.
- \`line\`: over_under → **a linha que melhor casa com o xG e a variância (1.5, 2, 2.5, 3, 3.5… — NÃO se limite a 2.5)** · handicap → o hcap do time bancado (-1, -1.5, +1) · team_total → linha de gols do time (0.5, 1.5…) · \`null\` em 1x2/btts.
- \`confidence\`: \`"low"\` | \`"medium"\` | \`"high"\` · \`probability\`: sua prob (0-1) do evento.
- \`analysis\` (PT): análise COMPLETA e profissional — não um resumo. Comece pelo **ROTEIRO esperado** (o filme do jogo + a cascata condicional), junte o que sustenta a aposta (mando, motivação, momento/forma, desfalques, volume/conversão) e o que pode virar contra (o risco). **Sempre crave o melhor mercado**; se o edge for fino, escolha mesmo assim com \`confidence\` baixa, explicando a margem. **NUNCA** escreva na análise que é melhor "não apostar", "evitar", "passar" ou "esperar" — a saída tem SEMPRE uma recomendação concreta e acionável.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (o grafo de raciocínio / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
`

// Escreve o arquivo pra leitura/auditoria + imprime no stdout.
const outPath = new URL(`./output/prognosis-${MATCH_ID}.md`, import.meta.url)
await Bun.write(outPath, prompt)
console.log(prompt)
console.error(`\n[ok] prompt salvo em scripts/output/prognosis-${MATCH_ID}.md`)
process.exit(0)
