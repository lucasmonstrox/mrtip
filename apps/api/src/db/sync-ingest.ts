import { db } from "./client"
import { card, commentary, goal, injury, lineup, lineupPlayer, match, matchTeamStats, matchTrend, nationality, player, venue, weather } from "./schema"
import { slugify } from "./slug"
import { env } from "../env"
import { uploadImagem } from "../lib/r2"
import { sm } from "../lib/sportmonks"
import { extractScore, type SportmonksScore } from "../lib/sportmonks-scores"

// Ingestão RICA de partidas (compartilhada por liga e copa): dado o array de fixtures da SportMonks (com
// os includes ricos) + o mapa de times, popula venue, escalação (+stats por jogador), stats de time,
// trends (momentum), clima, gols, cartões, desfalques e narração. O que é ESPECÍFICO da competição — as
// colunas do próprio `match` (round vs stage/leg/winner, slug) — entra via callback `matchFields`, então
// o mesmo pipeline serve PL e FA Cup/Carabao. Idempotente (upsert por id da SportMonks). @feature CUP-001

// SportMonks lineup type_ids: titular vs banco.
export const LINEUP_STARTER = 11
export const LINEUP_BENCH = 12

// lineups.details stat type_ids (Match Facts) — por jogador por partida.
export const STAT = { rating: 118, minutes: 119, motm: 1490, keyPasses: 117, shotsOnTarget: 86,
  tackles: 78, interceptions: 100, duelsWon: 106, passes: 80, crossesTotal: 98, crossesAccurate: 99, dribbleAttempts: 108, dribblesSuccessful: 109, bigChancesMissed: 581 } as const
export const STAT_IDS = Object.values(STAT).join(",")
// fixture-statistics type_ids por time por partida (include=statistics).
export const TEAM_STAT = { possession: 45, shotsTotal: 42, shotsInsidebox: 49, shotsOutsidebox: 50, shotsOnTarget: 86, shotsOffTarget: 41, shotsBlocked: 58, bigChancesCreated: 580, dangerousAttacks: 44, corners: 34, freeKicks: 55,
  tackles: 78, interceptions: 100, duelsWon: 106, successfulHeaders: 65, attacks: 43, passes: 80, passesAccurate: 81, passAccuracy: 82, longPasses: 62, crossesTotal: 98, crossesAccurate: 99, dribbleAttempts: 108, dribblesSuccessful: 109, dribbleSuccess: 1605, bigChancesMissed: 581, hitWoodwork: 64, goalAttempts: 54 } as const
export const TEAM_STAT_IDS = Object.values(TEAM_STAT).join(",")
// per-minute trend type_ids (include=trends) pro attack momentum (SIN-021).
export const TREND_TYPES = [86, 580, 44, 42, 43, 49, 34, 78, 100, 45] as const
const TREND_TYPE_SET = new Set<number>(TREND_TYPES)

// Includes ricos compartilhados. `stage` só faz sentido em copa (traz stage_id/sort_order/type_id).
export function richInclude(withStage: boolean): string {
  return (
    "participants;scores;round;state;lineups.player;lineups.position;lineups.details;formations;" +
    "events.type;sidelined.player;sidelined.type;venue;statistics;trends;weatherReport" +
    (withStage ? ";stage" : "")
  )
}
// Filtros de tipos (pra limitar o volume dos includes de detalhe).
export const richFilterTypes = `lineupDetailTypes:${STAT_IDS};fixtureStatisticTypes:${TEAM_STAT_IDS};trendTypes:${TREND_TYPES.join(",")}`

const GOAL_TYPE: Record<string, "normal" | "penalty" | "own"> = { GOAL: "normal", PENALTY: "penalty", OWNGOAL: "own" }
const CARD_TYPE: Record<string, "yellow" | "red" | "yellowred"> = { YELLOWCARD: "yellow", REDCARD: "red", YELLOWREDCARD: "yellowred" }

export type SmPlayer = { id: number; display_name?: string; name?: string; date_of_birth?: string; height?: number; weight?: number; image_path?: string; nationality_id?: number }
export type SmLineup = {
  team_id: number
  type_id: number
  jersey_number?: number
  formation_field?: string
  player?: SmPlayer
  position?: { developer_name?: string }
  details?: { type_id: number; data?: { value?: number } }[]
}
type SmFormation = { participant_id: number; formation: string }
type SmEvent = { id: number; type_id: number; type?: { developer_name?: string }; participant_id: number; player_id?: number; player_name?: string; related_player_id?: number; related_player_name?: string; minute?: number }
type SmVenue = { id: number; name: string; city_name?: string | null; capacity?: number | null; surface?: string | null; latitude?: string | null; longitude?: string | null; image_path?: string | null }
type SmWeather = { temperature?: { day?: number } | null; feels_like?: { day?: number } | null; wind?: { speed?: number; direction?: number } | null; humidity?: string | null; clouds?: string | null; pressure?: number | null; description?: string | null; type?: string | null }
type SmStatistic = { type_id: number; participant_id: number; location?: "home" | "away"; data?: { value?: number } }
type SmTrend = { type_id: number; participant_id: number; period_id: number; minute: number; value: number }
type SmSidelined = { participant_id: number; player_id: number; player?: { id: number; name?: string; common_name?: string }; type?: { name: string; developer_name: string } }
type SmCountry = { id: number; name: string; fifa_name?: string; iso2?: string; image_path?: string }
type SmCommentary = { id: number; comment: string; minute?: number | null; extra_minute?: number | null; is_goal: boolean; is_important: boolean; order: number; player?: SmPlayer | null; relatedplayer?: SmPlayer | null }
export type SmParticipant = { id: number; meta: { location: "home" | "away"; winner?: boolean | null } }
export type SmStage = { id: number; name: string; sort_order?: number; type_id?: number }
// Fixture rica: o suficiente pro pipeline. `stage`/participants.meta.winner só vêm em copa (include=stage).
export type SmRichFixture = {
  id: number
  name: string
  starting_at: string
  round?: { name: string }
  stage?: SmStage
  leg?: string | null
  aggregate_id?: number | null
  result_info?: string | null
  placeholder?: boolean
  state?: { developer_name: string }
  participants: SmParticipant[]
  scores?: SportmonksScore[]
  lineups?: SmLineup[]
  formations?: SmFormation[]
  events?: SmEvent[]
  sidelined?: SmSidelined[]
  venue?: SmVenue | null
  statistics?: SmStatistic[]
  trends?: SmTrend[]
  weatherreport?: SmWeather | null
}

function imgKey(folder: string, name: string, imagePath: string, suffix?: number | string): string {
  const ext = imagePath.split("?")[0]!.split(".").pop() ?? "png"
  const base = suffix != null ? `${slugify(name)}-${suffix}` : slugify(name)
  return `${folder}/${base}.${ext}`
}
function shortPosition(dev?: string): string | null {
  if (!dev) return null
  const d = dev.toUpperCase()
  if (d.startsWith("GOAL")) return "G"
  if (d.startsWith("DEF")) return "D"
  if (d.startsWith("MID")) return "M"
  return "F"
}
async function fetchCountries(): Promise<Map<number, SmCountry>> {
  const map = new Map<number, SmCountry>()
  let page = 1
  for (;;) {
    const url = `https://api.sportmonks.com/v3/core/countries?api_token=${env.sportmonksApiKey}&per_page=100&page=${page}`
    const res = await fetch(url)
    const body = (await res.json()) as { data?: SmCountry[]; pagination?: { has_more: boolean } }
    if (!res.ok || !body.data) throw new Error(`countries page ${page} → ${res.status}`)
    for (const c of body.data) map.set(c.id, c)
    if (!body.pagination?.has_more) break
    page += 1
  }
  return map
}
async function pool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length)
  let cursor = 0
  async function worker() {
    for (;;) {
      const i = cursor++
      if (i >= items.length) return
      out[i] = await fn(items[i]!)
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker))
  return out
}

export type IngestOpts = {
  fixtures: SmRichFixture[]
  teamIdBySm: Map<number, string>
  seasonId: string
  code: string
  // Colunas do `match` específicas da competição (round/name/slug e, em copa, stage*/leg/winner). O
  // pipeline preenche as comuns (ids/venue/date/score/status). Recebe os teamIds já resolvidos.
  matchFields: (f: SmRichFixture, ctx: { homeTeamId: string; awayTeamId: string; homeSmId: number; awaySmId: number }) => Record<string, unknown>
}

// Popula venue + match (comuns + matchFields) + escalação/stats/trends/clima/gols/cartões/desfalques/
// narração pra CADA fixture. Devolve contagens pra log. Reusado por liga e copa.
export async function ingestFixtures(opts: IngestOpts): Promise<Record<string, number>> {
  const { fixtures, teamIdBySm, seasonId, code, matchFields } = opts

  // 1) Venues (estádios) → R2 + upsert por sportmonksVenueId.
  const venuesById = new Map<number, SmVenue>()
  for (const f of fixtures) if (f.venue) venuesById.set(f.venue.id, f.venue)
  const venues = [...venuesById.values()]
  const venueImgById = new Map<number, string | null>()
  await pool(venues, 8, async (v) => {
    venueImgById.set(v.id, v.image_path ? await uploadImagem(v.image_path, imgKey("venues", v.name, v.image_path, v.id)) : null)
  })
  const venueIdBySm = new Map<number, string>()
  for (const v of venues) {
    const vv = { sportmonksVenueId: v.id, name: v.name, cityName: v.city_name ?? null, capacity: v.capacity ?? null, surface: v.surface ?? null, latitude: v.latitude ?? null, longitude: v.longitude ?? null, imageUrl: venueImgById.get(v.id) ?? null }
    const [r] = await db.insert(venue).values(vv).onConflictDoUpdate({ target: venue.sportmonksVenueId, set: vv }).returning({ id: venue.id })
    venueIdBySm.set(v.id, r!.id)
  }

  // 2) Matches (comuns + matchFields). Guarda o uuid por fixture pra ligar o resto.
  const matchIdByFixture = new Map<number, string>()
  for (const f of fixtures) {
    const home = f.participants.find((p) => p.meta.location === "home")
    const away = f.participants.find((p) => p.meta.location === "away")
    if (!home || !away) continue
    const homeTeamId = teamIdBySm.get(home.id)
    const awayTeamId = teamIdBySm.get(away.id)
    if (!homeTeamId || !awayTeamId) continue
    const values = {
      sportmonksFixtureId: f.id,
      leagueCode: code,
      date: f.starting_at.slice(0, 10),
      time: f.starting_at.slice(11, 16),
      homeTeamId,
      awayTeamId,
      venueId: f.venue ? venueIdBySm.get(f.venue.id) ?? null : null,
      seasonId,
      ...extractScore(f.scores),
      status: f.state?.developer_name ?? null,
      ...matchFields(f, { homeTeamId, awayTeamId, homeSmId: home.id, awaySmId: away.id }),
    }
    const [m] = await db.insert(match).values(values as never).onConflictDoUpdate({ target: match.sportmonksFixtureId, set: values as never }).returning({ id: match.id })
    matchIdByFixture.set(f.id, m!.id)
  }

  // 3) Jogadores + nacionalidades (das escalações: titulares 11 + banco 12).
  const lineupOf = (f: SmRichFixture) => (f.lineups ?? []).filter((l) => (l.type_id === LINEUP_STARTER || l.type_id === LINEUP_BENCH) && l.player)
  const playersById = new Map<number, SmPlayer>()
  const natIds = new Set<number>()
  for (const f of fixtures) for (const l of lineupOf(f)) { playersById.set(l.player!.id, l.player!); if (l.player!.nationality_id) natIds.add(l.player!.nationality_id) }

  const countries = await fetchCountries()
  const usedNats = [...natIds].map((id) => countries.get(id)).filter((c): c is SmCountry => !!c)
  const flagByNat = new Map<number, string | null>()
  await pool(usedNats, 8, async (c) => { flagByNat.set(c.id, c.image_path ? await uploadImagem(c.image_path, imgKey("nationalities", c.name, c.image_path)) : null) })
  for (const c of usedNats) {
    const v = { id: c.id, name: c.name, fifaName: c.fifa_name ?? null, iso2: c.iso2 ?? null, flagUrl: flagByNat.get(c.id) ?? null }
    await db.insert(nationality).values(v).onConflictDoUpdate({ target: nationality.id, set: v })
  }

  const playerName = (pl: SmPlayer) => pl.display_name ?? pl.name ?? `player ${pl.id}`
  const players = [...playersById.values()]
  const photoByPlayer = new Map<number, string | null>()
  await pool(players, 8, async (pl) => { photoByPlayer.set(pl.id, pl.image_path ? await uploadImagem(pl.image_path, imgKey("players", playerName(pl), pl.image_path, pl.id)) : null) })
  const playerIdBySm = new Map<number, string>()
  for (const pl of players) {
    const v = { sportmonksPlayerId: pl.id, name: playerName(pl), dateOfBirth: pl.date_of_birth ?? null, height: pl.height ?? null, weight: pl.weight ?? null, imageUrl: photoByPlayer.get(pl.id) ?? null, nationalityId: pl.nationality_id && countries.has(pl.nationality_id) ? pl.nationality_id : null }
    const [j] = await db.insert(player).values(v).onConflictDoUpdate({ target: player.sportmonksPlayerId, set: v }).returning({ id: player.id })
    playerIdBySm.set(pl.id, j!.id)
  }

  // 4) Escalação: 1 por (match, team) com formação; titulares + banco + stats por jogador.
  let nLineups = 0, nPlayers = 0
  for (const f of fixtures) {
    const entries = lineupOf(f)
    const matchId = matchIdByFixture.get(f.id)
    if (!entries.length || !matchId) continue
    const formationByTeam = new Map<number, string>()
    for (const fm of f.formations ?? []) formationByTeam.set(fm.participant_id, fm.formation)
    const byTeam = new Map<number, SmLineup[]>()
    for (const l of entries) byTeam.set(l.team_id, [...(byTeam.get(l.team_id) ?? []), l])
    for (const [teamSmId, players2] of byTeam) {
      const teamId = teamIdBySm.get(teamSmId)
      if (!teamId) continue
      const [lu] = await db.insert(lineup).values({ matchId, teamId, formation: formationByTeam.get(teamSmId) ?? null }).onConflictDoUpdate({ target: [lineup.matchId, lineup.teamId], set: { formation: formationByTeam.get(teamSmId) ?? null } }).returning({ id: lineup.id })
      nLineups += 1
      for (const l of players2) {
        const playerId = playerIdBySm.get(l.player!.id)
        if (!playerId) continue
        const stat = (typeId: number) => l.details?.find((d) => d.type_id === typeId)?.data?.value
        const lp = {
          lineupId: lu!.id, playerId, number: l.jersey_number ?? null, position: shortPosition(l.position?.developer_name), starter: l.type_id === LINEUP_STARTER, grid: l.formation_field ?? null,
          rating: stat(STAT.rating) ?? null, minutesPlayed: stat(STAT.minutes) ?? null, keyPasses: stat(STAT.keyPasses) ?? null, shotsOnTarget: stat(STAT.shotsOnTarget) ?? null,
          tackles: stat(STAT.tackles) ?? null, interceptions: stat(STAT.interceptions) ?? null, duelsWon: stat(STAT.duelsWon) ?? null, passes: stat(STAT.passes) ?? null,
          crossesTotal: stat(STAT.crossesTotal) ?? null, crossesAccurate: stat(STAT.crossesAccurate) ?? null, dribbleAttempts: stat(STAT.dribbleAttempts) ?? null, dribblesSuccessful: stat(STAT.dribblesSuccessful) ?? null,
          bigChancesMissed: stat(STAT.bigChancesMissed) ?? null, manOfMatch: stat(STAT.motm) === 1,
        }
        await db.insert(lineupPlayer).values(lp).onConflictDoUpdate({ target: [lineupPlayer.lineupId, lineupPlayer.playerId], set: lp })
        nPlayers += 1
      }
    }
  }

  // 5) Stats de time por partida (include=statistics).
  let nTeamStats = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId || !f.statistics?.length) continue
    const byTeam = new Map<number, Map<number, number>>()
    for (const s of f.statistics) { const v = s.data?.value; if (v == null) continue; let row = byTeam.get(s.participant_id); if (!row) { row = new Map(); byTeam.set(s.participant_id, row) } row.set(s.type_id, v) }
    for (const [teamSmId, vals] of byTeam) {
      const teamId = teamIdBySm.get(teamSmId)
      if (!teamId) continue
      const g = (id: number) => vals.get(id) ?? null
      const ts = { matchId, teamId,
        possession: g(TEAM_STAT.possession), shotsTotal: g(TEAM_STAT.shotsTotal), shotsInsidebox: g(TEAM_STAT.shotsInsidebox), shotsOutsidebox: g(TEAM_STAT.shotsOutsidebox), shotsOnTarget: g(TEAM_STAT.shotsOnTarget), shotsOffTarget: g(TEAM_STAT.shotsOffTarget), shotsBlocked: g(TEAM_STAT.shotsBlocked), bigChancesCreated: g(TEAM_STAT.bigChancesCreated), dangerousAttacks: g(TEAM_STAT.dangerousAttacks), corners: g(TEAM_STAT.corners), freeKicks: g(TEAM_STAT.freeKicks),
        tackles: g(TEAM_STAT.tackles), interceptions: g(TEAM_STAT.interceptions), duelsWon: g(TEAM_STAT.duelsWon), successfulHeaders: g(TEAM_STAT.successfulHeaders), attacks: g(TEAM_STAT.attacks), passes: g(TEAM_STAT.passes), passesAccurate: g(TEAM_STAT.passesAccurate), passAccuracy: g(TEAM_STAT.passAccuracy), longPasses: g(TEAM_STAT.longPasses), crossesTotal: g(TEAM_STAT.crossesTotal), crossesAccurate: g(TEAM_STAT.crossesAccurate), dribbleAttempts: g(TEAM_STAT.dribbleAttempts), dribblesSuccessful: g(TEAM_STAT.dribblesSuccessful), dribbleSuccess: g(TEAM_STAT.dribbleSuccess), bigChancesMissed: g(TEAM_STAT.bigChancesMissed), hitWoodwork: g(TEAM_STAT.hitWoodwork), goalAttempts: g(TEAM_STAT.goalAttempts) }
      await db.insert(matchTeamStats).values(ts).onConflictDoUpdate({ target: [matchTeamStats.matchId, matchTeamStats.teamId], set: ts })
      nTeamStats += 1
    }
  }

  // 6) Trends por minuto (momentum) — bulk insert por fixture.
  let nTrends = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId || !f.trends?.length) continue
    const rows: (typeof matchTrend.$inferInsert)[] = []
    for (const t of f.trends) { if (!TREND_TYPE_SET.has(t.type_id)) continue; const teamId = teamIdBySm.get(t.participant_id); if (!teamId) continue; rows.push({ matchId, teamId, typeId: t.type_id, periodId: t.period_id, minute: t.minute, value: t.value }) }
    if (!rows.length) continue
    await db.insert(matchTrend).values(rows).onConflictDoNothing()
    nTrends += rows.length
  }

  // 7) Clima (include=weatherReport → chave `weatherreport` lowercase).
  let nWeather = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    const w = f.weatherreport
    if (!matchId || !w) continue
    const wrow = { matchId, description: w.description ?? null, tempDay: w.temperature?.day ?? null, feelsLikeDay: w.feels_like?.day ?? null, windSpeed: w.wind?.speed ?? null, windDirection: w.wind?.direction ?? null, humidity: w.humidity ?? null, clouds: w.clouds ?? null, pressure: w.pressure ?? null, type: w.type ?? null }
    await db.insert(weather).values(wrow).onConflictDoUpdate({ target: [weather.matchId], set: wrow })
    nWeather += 1
  }

  // 8) Gols + cartões (events). Jogador ausente do lineup vira stub via ensurePlayer.
  const ensurePlayer = async (smId: number, name: string): Promise<string> => {
    const known = playerIdBySm.get(smId)
    if (known) return known
    const [j] = await db.insert(player).values({ sportmonksPlayerId: smId, name }).onConflictDoUpdate({ target: player.sportmonksPlayerId, set: { name } }).returning({ id: player.id })
    playerIdBySm.set(smId, j!.id)
    return j!.id
  }
  let nGoals = 0, nCards = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId) continue
    for (const ev of f.events ?? []) {
      if (!ev.player_id) continue
      const teamId = teamIdBySm.get(ev.participant_id)
      if (!teamId) continue
      const dev = ev.type?.developer_name ?? ""
      const minute = ev.minute ?? null
      const goalType = GOAL_TYPE[dev]
      if (goalType) {
        const playerId = await ensurePlayer(ev.player_id, ev.player_name ?? `player ${ev.player_id}`)
        const assistId = ev.related_player_id && goalType !== "own" ? await ensurePlayer(ev.related_player_id, ev.related_player_name ?? `player ${ev.related_player_id}`) : null
        const gv = { sportmonksEventId: ev.id, matchId, teamId, playerId, assistId, minute, type: goalType }
        await db.insert(goal).values(gv).onConflictDoUpdate({ target: goal.sportmonksEventId, set: gv })
        nGoals += 1
        continue
      }
      const cardType = CARD_TYPE[dev]
      if (cardType) {
        const playerId = await ensurePlayer(ev.player_id, ev.player_name ?? `player ${ev.player_id}`)
        const cv = { sportmonksEventId: ev.id, matchId, teamId, playerId, minute, type: cardType }
        await db.insert(card).values(cv).onConflictDoUpdate({ target: card.sportmonksEventId, set: cv })
        nCards += 1
      }
    }
  }

  // 9) Desfalques (sidelined).
  let nInjuries = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId) continue
    for (const s of f.sidelined ?? []) {
      if (!s.player_id) continue
      const teamId = teamIdBySm.get(s.participant_id)
      if (!teamId) continue
      const playerId = await ensurePlayer(s.player_id, s.player?.common_name ?? s.player?.name ?? `player ${s.player_id}`)
      const type = s.type?.developer_name === "DOUBTFUL" ? "Questionable" : "Missing Fixture"
      const v = { matchId, teamId, playerId, type, reason: s.type?.name ?? null }
      await db.insert(injury).values(v).onConflictDoUpdate({ target: [injury.matchId, injury.playerId], set: v })
      nInjuries += 1
    }
  }

  // 10) Narração (commentaries) — chamada por fixture FINALIZADA (state FT).
  let nCommentaries = 0
  const finished = fixtures.filter((f) => f.state?.developer_name === "FT" && matchIdByFixture.has(f.id))
  for (const f of finished) {
    const matchId = matchIdByFixture.get(f.id)!
    let items: SmCommentary[]
    try { items = await sm<SmCommentary[]>(`/commentaries/fixtures/${f.id}?include=player;relatedPlayer`) } catch { continue }
    if (!items.length) continue
    const rows = []
    for (const c of items) {
      const playerId = c.player ? await ensurePlayer(c.player.id, playerName(c.player)) : null
      const relatedPlayerId = c.relatedplayer ? await ensurePlayer(c.relatedplayer.id, playerName(c.relatedplayer)) : null
      rows.push({ sportmonksCommentaryId: c.id, matchId, playerId, relatedPlayerId, comment: c.comment, minute: c.minute ?? null, extraMinute: c.extra_minute ?? null, isGoal: c.is_goal ?? false, isImportant: c.is_important ?? false, sortOrder: c.order })
    }
    await db.insert(commentary).values(rows).onConflictDoNothing({ target: commentary.sportmonksCommentaryId })
    nCommentaries += rows.length
  }

  return { venues: venues.length, matches: matchIdByFixture.size, players: players.length, lineups: nLineups, lineupPlayers: nPlayers, teamStats: nTeamStats, trends: nTrends, weather: nWeather, goals: nGoals, cards: nCards, injuries: nInjuries, commentaries: nCommentaries }
}

// Busca fixtures ricas por LISTA de ids (copa: só os "proper"), em lotes. include=stage traz a stage.
export async function fetchRichByIds(ids: number[], withStage: boolean): Promise<SmRichFixture[]> {
  const out: SmRichFixture[] = []
  const BATCH = 25
  for (let i = 0; i < ids.length; i += BATCH) {
    const chunk = ids.slice(i, i + BATCH)
    const rows = await sm<SmRichFixture[]>(`/fixtures/multi/${chunk.join(",")}?filters=${richFilterTypes}&include=${richInclude(withStage)}`)
    out.push(...rows)
  }
  return out
}
