import { and, asc, count, desc, eq, inArray, lt, lte, ne, or } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { db } from "../../../db/client"
import {
  card,
  coach,
  goal,
  injury,
  league,
  lineup,
  lineupPlayer,
  match,
  nationality,
  player,
  standing,
  team,
  type Match as MatchRow,
} from "../../../db/schema"
import { notFound } from "../../../lib/errors"

/* ---------- Domain contract (what the API exposes; reused by apps/web) ---------- */

export type League = {
  code: string
  name: string
  country: string
  season: string
  logoUrl: string | null
}

// Reference to a team: stable id + name + slug (the latter for /teams/:slug URLs) + logo.
export type TeamRef = {
  id: string
  name: string
  slug: string
  logoUrl: string | null
}

// W-D-L + goals for one venue (home or away). null on the standing when the official split hasn't
// been ingested for that row yet.
export type VenueRecord = {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
}

// Official season standing of a team (the `standing` row minus the storage keys) — what the team
// page header shows: position, points, W-D-L, goals, zone and the official home/away split.
export type TeamStanding = {
  position: number
  points: number
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  zone: string | null
  home: VenueRecord | null
  away: VenueRecord | null
}

// A proportion with its sample size and a Wilson 95% confidence band (fractions [0,1]). `lowSample`
// flags an n too small to trust the point estimate — the UI shows the band, never a bare %.
export type Proportion = {
  pct: number
  n: number
  lo: number
  hi: number
  lowSample: boolean
}

// Betting trends of a team for one venue split (all / home / away).
export type TeamTrendSplit = {
  n: number
  over25: Proportion
  btts: Proportion
  cleanSheet: Proportion
  goalsForAvg: number
  goalsAgainstAvg: number
}

export type TeamTrends = {
  all: TeamTrendSplit
  home: TeamTrendSplit
  away: TeamTrendSplit
}

export type Score = {
  ft: [number, number] // full time [home, away]
  ht: [number, number] | null // half time (null when the source doesn't provide it)
}

export type Match = {
  id: string
  round: number
  name: string // "Matchday 12"
  date: string // yyyy-MM-dd
  time: string | null
  home: TeamRef
  away: TeamRef
  score: Score | null // null = match without a result yet
}

export type Round = {
  round: number
  name: string
  matches: Match[]
}

export type StandingRow = {
  position: number
  team: TeamRef
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  // Qualification/relegation zone (official, from SportMonks): "champions" | "europa" |
  // "conference" | "relegation" | null. Only set for the full table (null in a ?upTo snapshot).
  zone: string | null
  form: FormResult[] // last 5 [mostRecent, ...] with context (score/opponent/match)
}

export type Result = "W" | "D" | "L"

// A form result with context: against whom, what the score was and which match — so the front
// can show a tooltip (score) and link to the match. `goalsFor/goalsAgainst` are from the team's
// perspective.
export type FormResult = {
  result: Result
  matchId: string
  opponent: TeamRef
  goalsFor: number
  goalsAgainst: number
  side: "home" | "away"
}

export type Form = {
  team: TeamRef
  recent: FormResult[] // [mostRecent, ...] up to N
  summary: { w: number; d: number; l: number }
}

// A player within a lineup.
export type LineupPlayer = {
  id: string
  name: string
  imageUrl: string | null
  number: number | null
  position: string | null
  starter: boolean
  grid: string | null
  rating: number | null
  minutesPlayed: number | null
  manOfMatch: boolean
}

// Lineup of a team in a match: formation + coach + starters/bench.
export type TeamLineup = {
  team: TeamRef
  formation: string | null
  coach: string | null
  coachId: string | null
  starters: LineupPlayer[]
  bench: LineupPlayer[]
}

// An absence: player out (or doubtful) + reason + their weight (goals/assists in the league UP TO
// the date of this match). `didNotPlay` = type "Missing Fixture". The numbers come from `goal`
// (derived, anchored to the date), not a snapshot — so they answer "up to this match, how was he
// performing".
export type Absence = {
  player: { id: string; name: string }
  didNotPlay: boolean
  reason: string | null
  goals: number
  assists: number
  consecutiveOut: number // consecutive matches out ending in this one (from injury, complete)
  totalOut: number // total matches out in the league up to this one (inclusive)
}

// Absences of a team in a match.
export type TeamAbsences = {
  team: TeamRef
  absences: Absence[]
}

// A goal of the match: minute, type, scoring team, scorer and assist.
export type GoalItem = {
  minute: number | null
  type: "normal" | "penalty" | "own"
  team: TeamRef
  scorer: { id: string; name: string }
  assist: { id: string; name: string } | null
}

export type CardItem = {
  minute: number | null
  type: "yellow" | "red" | "yellowred" // yellowred = second yellow → sent off
  team: TeamRef
  player: { id: string; name: string }
}

// A goal from the player's perspective (for their page): the match + minute + type.
export type PlayerGoal = {
  matchId: string
  date: string
  minute: number | null
  type: "normal" | "penalty"
  home: string
  away: string
  score: [number, number] | null
}

// One match the player appeared in (their lineup row): rating/minutes/role + their goals/assists/
// cards in that match. The spine of the player page — season aggregates, form and per-90 derive from
// this list (no extra queries). `home` = the player's team was the home side; `score` is [home, away].
export type PlayerAppearance = {
  matchId: string
  date: string
  round: number
  opponent: string
  opponentLogo: string | null
  home: boolean
  score: [number, number] | null
  rating: number | null
  minutes: number | null
  starter: boolean
  motm: boolean
  goals: number
  penaltyGoals: number
  assists: number
  yellow: number
  red: number // straight red OR second yellow (sent off)
}

// Player page: bio (photo/birth/height/nationality/position) + totals (derived from goal/injury) +
// the list of goals + per-match appearances. `position` is the most-played one (G/D/M/F).
export type PlayerDetail = {
  id: string
  name: string
  imageUrl: string | null
  dateOfBirth: string | null
  height: number | null
  weight: number | null
  position: string | null
  currentTeam: { name: string; slug: string; logoUrl: string | null } | null
  nationality: { name: string; flagUrl: string | null } | null
  goals: number
  assists: number
  matchesOut: number
  // Season aggregates derived from the appearances spine (no extra queries).
  season: {
    appearances: number
    starts: number
    minutes: number
    avgRating: number | null
    goals: number
    penaltyGoals: number
    assists: number
    yellow: number
    red: number
    motm: number
  }
  // Per-90 production. `sufficient` gates display on a minutes floor (small-sample guard).
  per90: { sufficient: boolean; goals: number; assists: number; ga: number }
  // Goal breakdowns: by venue (home/away) and by half (from goal minutes).
  goalSplits: { home: number; away: number; firstHalf: number; secondHalf: number }
  goalsList: PlayerGoal[]
  appearances: PlayerAppearance[]
}

// Minutes floor before per-90 rates are shown (≈6 full matches) — below this the rate is noise.
const PER90_MIN_MINUTES = 540

// A match managed by a coach (for their page).
export type CoachMatch = {
  matchId: string
  date: string
  team: string // team he managed in this match
  home: string
  away: string
  score: [number, number] | null
}

// Coach page: name + matches managed.
export type CoachDetail = {
  id: string
  name: string
  matches: CoachMatch[]
}

/* ---------- Read-model: the bridge db → domain contract ---------- */

// `team` enters the join TWICE (home and away) → needs an alias for each.
const teamHome = alias(team, "team_home")
const teamAway = alias(team, "team_away")

// Row the read-model produces: the raw match + denormalized name/slug of both teams.
type MatchJoin = {
  m: MatchRow
  homeName: string
  homeSlug: string
  homeLogo: string | null
  awayName: string
  awaySlug: string
  awayLogo: string | null
}

// BASE read-model: match + name/slug of both teams via join (inner — the ids are notNull with FK,
// so they always match). Factory (`() =>`) because each caller chains its own where/orderBy.
const baseQuery = () =>
  db
    .select({
      m: match,
      homeName: teamHome.name,
      homeSlug: teamHome.slug,
      homeLogo: teamHome.logoUrl,
      awayName: teamAway.name,
      awaySlug: teamAway.slug,
      awayLogo: teamAway.logoUrl,
    })
    .from(match)
    .innerJoin(teamHome, eq(teamHome.id, match.homeTeamId))
    .innerJoin(teamAway, eq(teamAway.id, match.awayTeamId))

// Flattens the join row (score in 4 columns + names from the join) into the output contract (score
// and teams nested). The ONLY place that defines the shape of a match — list/rounds/detail all go
// through here, so the payload never diverges between endpoints.
export function serializeMatch(row: MatchJoin): Match {
  const { m } = row
  const { ftHome: fh, ftAway: fa, htHome: hh, htAway: ha } = m
  const score: Score | null =
    fh == null || fa == null ? null : { ft: [fh, fa], ht: hh != null && ha != null ? [hh, ha] : null }
  return {
    id: m.id,
    round: m.round,
    name: m.name,
    date: m.date,
    time: m.time,
    home: { id: m.homeTeamId, name: row.homeName, slug: row.homeSlug, logoUrl: row.homeLogo },
    away: { id: m.awayTeamId, name: row.awayName, slug: row.awaySlug, logoUrl: row.awayLogo },
    score,
  }
}

// All matches of a league, ordered by round and date — base of rounds, standings and form.
// Returns already serialized (domain contract), never the raw row.
export async function loadMatches(code: string): Promise<Match[]> {
  const rows = await baseQuery()
    .where(eq(match.leagueCode, code))
    .orderBy(asc(match.round), asc(match.date))
  return rows.map(serializeMatch)
}

// Row (with name join) of a match by id — used by the detail and form, which need to anchor on the
// league/date. null when it doesn't exist. The uuid format of the id is guaranteed AT THE EDGE
// (matches.routes.ts), so only a valid uuid reaches here — a non-existent one simply doesn't match.
export async function getMatchRow(id: string): Promise<MatchJoin | null> {
  const [row] = await baseQuery().where(eq(match.id, id)).limit(1)
  return row ?? null
}

// League by code or domain 404 (mapped by the global onError).
export async function getLeagueOrThrow(code: string): Promise<League> {
  const [row] = await db.select().from(league).where(eq(league.code, code)).limit(1)
  if (!row) throw notFound("league_not_found")
  return row
}

// Player page: totals (real goals, assists, matches out) + list of goals. All derived from
// `goal`/`injury` (not a snapshot). 404 if the id doesn't exist. Goals/assists depend on the goal
// backfill.
export async function getPlayerDetail(id: string): Promise<PlayerDetail> {
  const [p] = await db
    .select({
      id: player.id,
      name: player.name,
      imageUrl: player.imageUrl,
      dateOfBirth: player.dateOfBirth,
      height: player.height,
      weight: player.weight,
      nationalityName: nationality.name,
      nationalityFlag: nationality.flagUrl,
    })
    .from(player)
    .leftJoin(nationality, eq(nationality.id, player.nationalityId))
    .where(eq(player.id, id))
    .limit(1)
  if (!p) throw notFound("player_not_found")

  const [g] = await db.select({ n: count() }).from(goal).where(and(eq(goal.playerId, id), ne(goal.type, "own")))
  const [a] = await db.select({ n: count() }).from(goal).where(eq(goal.assistId, id))
  const [out] = await db
    .select({ n: count() })
    .from(injury)
    .where(and(eq(injury.playerId, id), eq(injury.type, "Missing Fixture")))

  const goalRows = await db
    .select({
      matchId: match.id,
      date: match.date,
      minute: goal.minute,
      type: goal.type,
      home: teamHome.name,
      away: teamAway.name,
      ftH: match.ftHome,
      ftA: match.ftAway,
    })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .innerJoin(teamHome, eq(teamHome.id, match.homeTeamId))
    .innerJoin(teamAway, eq(teamAway.id, match.awayTeamId))
    .where(and(eq(goal.playerId, id), ne(goal.type, "own")))
    .orderBy(asc(match.date))

  // Per-match appearances (the player's lineup rows): rating/minutes/role + opponent/score. The spine
  // the page aggregates over. starter/minutes/motm come straight from lineup_player.
  const appRows = await db
    .select({
      matchId: match.id,
      date: match.date,
      round: match.round,
      homeTeamId: match.homeTeamId,
      lineupTeamId: lineup.teamId,
      homeName: teamHome.name,
      homeSlug: teamHome.slug,
      homeLogo: teamHome.logoUrl,
      awayName: teamAway.name,
      awaySlug: teamAway.slug,
      awayLogo: teamAway.logoUrl,
      ftH: match.ftHome,
      ftA: match.ftAway,
      rating: lineupPlayer.rating,
      minutes: lineupPlayer.minutesPlayed,
      starter: lineupPlayer.starter,
      motm: lineupPlayer.manOfMatch,
      position: lineupPlayer.position,
    })
    .from(lineupPlayer)
    .innerJoin(lineup, eq(lineup.id, lineupPlayer.lineupId))
    .innerJoin(match, eq(match.id, lineup.matchId))
    .innerJoin(teamHome, eq(teamHome.id, match.homeTeamId))
    .innerJoin(teamAway, eq(teamAway.id, match.awayTeamId))
    .where(eq(lineupPlayer.playerId, id))
    .orderBy(asc(match.date))

  // The player's goals (reusing goalRows: own goals already excluded) + assists + cards, keyed by
  // matchId to fold into each appearance.
  const goalsByMatch = new Map<string, { goals: number; penaltyGoals: number }>()
  for (const r of goalRows) {
    const e = goalsByMatch.get(r.matchId) ?? { goals: 0, penaltyGoals: 0 }
    e.goals += 1
    if (r.type === "penalty") e.penaltyGoals += 1
    goalsByMatch.set(r.matchId, e)
  }

  const assistRows = await db
    .select({ matchId: goal.matchId, n: count() })
    .from(goal)
    .where(eq(goal.assistId, id))
    .groupBy(goal.matchId)
  const assistsByMatch = new Map(assistRows.map((r) => [r.matchId, Number(r.n)]))

  const cardRows = await db
    .select({ matchId: card.matchId, type: card.type })
    .from(card)
    .where(eq(card.playerId, id))
  const cardsByMatch = new Map<string, { yellow: number; red: number }>()
  for (const r of cardRows) {
    const e = cardsByMatch.get(r.matchId) ?? { yellow: 0, red: 0 }
    if (r.type === "yellow") e.yellow += 1
    else e.red += 1 // red | yellowred → sent off
    cardsByMatch.set(r.matchId, e)
  }

  const appearances: PlayerAppearance[] = appRows.map((r) => {
    const home = r.lineupTeamId === r.homeTeamId
    const gm = goalsByMatch.get(r.matchId) ?? { goals: 0, penaltyGoals: 0 }
    const cm = cardsByMatch.get(r.matchId) ?? { yellow: 0, red: 0 }
    return {
      matchId: r.matchId,
      date: r.date,
      round: r.round,
      opponent: home ? r.awayName : r.homeName,
      opponentLogo: home ? r.awayLogo : r.homeLogo,
      home,
      score: r.ftH != null && r.ftA != null ? [r.ftH, r.ftA] : null,
      rating: r.rating,
      minutes: r.minutes,
      starter: r.starter,
      motm: r.motm,
      goals: gm.goals,
      penaltyGoals: gm.penaltyGoals,
      assists: assistsByMatch.get(r.matchId) ?? 0,
      yellow: cm.yellow,
      red: cm.red,
    }
  })

  // Most-played position (G/D/M/F) across the appearances — the player's primary role.
  const posCounts = new Map<string, number>()
  for (const r of appRows) if (r.position) posCounts.set(r.position, (posCounts.get(r.position) ?? 0) + 1)
  const position = [...posCounts.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? null

  // Season aggregates over the appearances spine.
  const ratedValues = appearances.filter((x) => x.rating != null).map((x) => x.rating as number)
  const minutesTotal = appearances.reduce((s, x) => s + (x.minutes ?? 0), 0)
  const totalGoals = Number(g!.n)
  const totalAssists = Number(a!.n)
  const season = {
    appearances: appearances.length,
    starts: appearances.filter((x) => x.starter).length,
    minutes: minutesTotal,
    avgRating: ratedValues.length ? ratedValues.reduce((s, v) => s + v, 0) / ratedValues.length : null,
    goals: totalGoals,
    penaltyGoals: appearances.reduce((s, x) => s + x.penaltyGoals, 0),
    assists: totalAssists,
    yellow: appearances.reduce((s, x) => s + x.yellow, 0),
    red: appearances.reduce((s, x) => s + x.red, 0),
    motm: appearances.filter((x) => x.motm).length,
  }

  // Per-90 rates (denominator = total minutes, not games); gated on a minutes floor.
  const den = minutesTotal > 0 ? minutesTotal / 90 : 0
  const per90 = {
    sufficient: minutesTotal >= PER90_MIN_MINUTES,
    goals: den ? totalGoals / den : 0,
    assists: den ? totalAssists / den : 0,
    ga: den ? (totalGoals + totalAssists) / den : 0,
  }

  // Goal breakdowns: venue from each appearance's `home`, half from each goal's minute.
  const goalSplits = { home: 0, away: 0, firstHalf: 0, secondHalf: 0 }
  for (const x of appearances) goalSplits[x.home ? "home" : "away"] += x.goals
  for (const gr of goalRows) {
    if (gr.minute == null) continue
    if (gr.minute <= 45) goalSplits.firstHalf += 1
    else goalSplits.secondHalf += 1
  }

  // Current club = the team of the most recent appearance (appRows is ascending by date).
  const last = appRows[appRows.length - 1]
  const currentTeam = last
    ? last.lineupTeamId === last.homeTeamId
      ? { name: last.homeName, slug: last.homeSlug, logoUrl: last.homeLogo }
      : { name: last.awayName, slug: last.awaySlug, logoUrl: last.awayLogo }
    : null

  return {
    id: p.id,
    name: p.name,
    imageUrl: p.imageUrl,
    dateOfBirth: p.dateOfBirth,
    height: p.height,
    weight: p.weight,
    position,
    currentTeam,
    nationality: p.nationalityName ? { name: p.nationalityName, flagUrl: p.nationalityFlag } : null,
    goals: totalGoals,
    assists: totalAssists,
    matchesOut: Number(out!.n),
    season,
    per90,
    goalSplits,
    goalsList: goalRows.map((r) => ({
      matchId: r.matchId,
      date: r.date,
      minute: r.minute,
      type: r.type as PlayerGoal["type"],
      home: r.home,
      away: r.away,
      score: r.ftH != null && r.ftA != null ? [r.ftH, r.ftA] : null,
    })),
    appearances,
  }
}

// Team by SLUG (key of the /teams/:slug URLs) or domain 404.
export async function getTeamBySlug(slug: string): Promise<TeamRef & { shortCode: string | null }> {
  const [row] = await db
    .select({
      id: team.id,
      name: team.name,
      slug: team.slug,
      logoUrl: team.logoUrl,
      shortCode: team.shortCode,
    })
    .from(team)
    .where(eq(team.slug, slug))
    .limit(1)
  if (!row) throw notFound("team_not_found")
  return row
}

// Official SportMonks standing row of a team (position/points/W-D-L/goals/zone) — the authoritative
// season aggregate, already ingested in `standing`. null when the team has no standing row yet.
export async function loadTeamStanding(teamId: string): Promise<TeamStanding | null> {
  const [row] = await db.select().from(standing).where(eq(standing.teamId, teamId)).limit(1)
  if (!row) return null
  // The 12 home/away columns are populated together on re-sync; gate on one being present.
  const home: VenueRecord | null =
    row.homePlayed == null
      ? null
      : {
          played: row.homePlayed,
          won: row.homeWon ?? 0,
          drawn: row.homeDrawn ?? 0,
          lost: row.homeLost ?? 0,
          goalsFor: row.homeGoalsFor ?? 0,
          goalsAgainst: row.homeGoalsAgainst ?? 0,
        }
  const away: VenueRecord | null =
    row.awayPlayed == null
      ? null
      : {
          played: row.awayPlayed,
          won: row.awayWon ?? 0,
          drawn: row.awayDrawn ?? 0,
          lost: row.awayLost ?? 0,
          goalsFor: row.awayGoalsFor ?? 0,
          goalsAgainst: row.awayGoalsAgainst ?? 0,
        }
  return {
    position: row.position,
    points: row.points,
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    goalDifference: row.goalDifference,
    zone: row.zone,
    home,
    away,
  }
}

// All matches of a team (as home OR away), most recent first — base of the team page. Serialized
// in the domain contract (with the names of both sides).
export async function loadTeamMatches(id: string): Promise<Match[]> {
  const rows = await baseQuery()
    .where(or(eq(match.homeTeamId, id), eq(match.awayTeamId, id)))
    .orderBy(desc(match.date))
  return rows.map(serializeMatch)
}

// Lineups of a match (one item per team that has a lineup). Empty when there's no lineup yet (the
// backfill is incremental). Sorts starters and bench by jersey number.
export async function loadMatchLineups(matchId: string): Promise<TeamLineup[]> {
  const lineups = await db
    .select({
      id: lineup.id,
      formation: lineup.formation,
      coach: lineup.coachName,
      coachId: lineup.coachId,
      teamId: team.id,
      teamName: team.name,
      teamSlug: team.slug,
      teamLogo: team.logoUrl,
    })
    .from(lineup)
    .innerJoin(team, eq(team.id, lineup.teamId))
    .where(eq(lineup.matchId, matchId))
  if (!lineups.length) return []

  const players = await db
    .select({
      lineupId: lineupPlayer.lineupId,
      number: lineupPlayer.number,
      position: lineupPlayer.position,
      starter: lineupPlayer.starter,
      grid: lineupPlayer.grid,
      rating: lineupPlayer.rating,
      minutesPlayed: lineupPlayer.minutesPlayed,
      manOfMatch: lineupPlayer.manOfMatch,
      playerId: player.id,
      playerName: player.name,
      playerImage: player.imageUrl,
    })
    .from(lineupPlayer)
    .innerJoin(player, eq(player.id, lineupPlayer.playerId))
    .where(inArray(lineupPlayer.lineupId, lineups.map((e) => e.id)))

  const byNumber = (a: LineupPlayer, b: LineupPlayer) => (a.number ?? 99) - (b.number ?? 99)
  return lineups.map((e) => {
    const mine: LineupPlayer[] = players
      .filter((p) => p.lineupId === e.id)
      .map((p) => ({
        id: p.playerId,
        name: p.playerName,
        imageUrl: p.playerImage,
        number: p.number,
        position: p.position,
        starter: p.starter,
        grid: p.grid,
        rating: p.rating,
        minutesPlayed: p.minutesPlayed,
        manOfMatch: p.manOfMatch,
      }))
    return {
      team: { id: e.teamId, name: e.teamName, slug: e.teamSlug, logoUrl: e.teamLogo },
      formation: e.formation,
      coach: e.coach,
      coachId: e.coachId,
      starters: mine.filter((m) => m.starter).sort(byNumber),
      bench: mine.filter((m) => !m.starter).sort(byNumber),
    }
  })
}

// `player` enters the goals join 2x (scorer and assist) → alias for each.
const playerScorer = alias(player, "player_scorer")
const playerAssist = alias(player, "player_assist")
// `team` managed by the coach in the match (3rd alias, besides home/away).
const teamManaged = alias(team, "team_managed")

// Coach page: name + matches he managed (with the team he led in each one). 404 if it doesn't exist.
export async function getCoachDetail(id: string): Promise<CoachDetail> {
  const [c] = await db.select({ id: coach.id, name: coach.name }).from(coach).where(eq(coach.id, id)).limit(1)
  if (!c) throw notFound("coach_not_found")

  const matches = await db
    .select({
      matchId: match.id,
      date: match.date,
      team: teamManaged.name,
      home: teamHome.name,
      away: teamAway.name,
      ftH: match.ftHome,
      ftA: match.ftAway,
    })
    .from(lineup)
    .innerJoin(match, eq(match.id, lineup.matchId))
    .innerJoin(teamManaged, eq(teamManaged.id, lineup.teamId))
    .innerJoin(teamHome, eq(teamHome.id, match.homeTeamId))
    .innerJoin(teamAway, eq(teamAway.id, match.awayTeamId))
    .where(eq(lineup.coachId, id))
    .orderBy(asc(match.date))

  return {
    id: c.id,
    name: c.name,
    matches: matches.map((m) => ({
      matchId: m.matchId,
      date: m.date,
      team: m.team,
      home: m.home,
      away: m.away,
      score: m.ftH != null && m.ftA != null ? [m.ftH, m.ftA] : null,
    })),
  }
}

// Goals of a match, in chronological order (minute). Empty when the events haven't been imported
// yet (incremental backfill) or the match ended 0-0.
export async function loadMatchGoals(matchId: string): Promise<GoalItem[]> {
  const rows = await db
    .select({
      minute: goal.minute,
      type: goal.type,
      teamId: team.id,
      teamName: team.name,
      teamSlug: team.slug,
      teamLogo: team.logoUrl,
      scorerId: playerScorer.id,
      scorerName: playerScorer.name,
      assistId: playerAssist.id,
      assistName: playerAssist.name,
    })
    .from(goal)
    .innerJoin(team, eq(team.id, goal.teamId))
    .innerJoin(playerScorer, eq(playerScorer.id, goal.playerId))
    .leftJoin(playerAssist, eq(playerAssist.id, goal.assistId))
    .where(eq(goal.matchId, matchId))
    .orderBy(asc(goal.minute))

  return rows.map((r) => ({
    minute: r.minute,
    type: r.type as GoalItem["type"],
    team: { id: r.teamId, name: r.teamName, slug: r.teamSlug, logoUrl: r.teamLogo },
    scorer: { id: r.scorerId, name: r.scorerName },
    assist: r.assistId && r.assistName ? { id: r.assistId, name: r.assistName } : null,
  }))
}

// Cards of a match, in chronological order (minute). Empty when no cards / events not imported.
export async function loadMatchCards(matchId: string): Promise<CardItem[]> {
  const rows = await db
    .select({
      minute: card.minute,
      type: card.type,
      teamId: team.id,
      teamName: team.name,
      teamSlug: team.slug,
      teamLogo: team.logoUrl,
      playerId: player.id,
      playerName: player.name,
    })
    .from(card)
    .innerJoin(team, eq(team.id, card.teamId))
    .innerJoin(player, eq(player.id, card.playerId))
    .where(eq(card.matchId, matchId))
    .orderBy(asc(card.minute))

  return rows.map((r) => ({
    minute: r.minute,
    type: r.type as CardItem["type"],
    team: { id: r.teamId, name: r.teamName, slug: r.teamSlug, logoUrl: r.teamLogo },
    player: { id: r.playerId, name: r.playerName },
  }))
}

// Absences of a match, grouped by team. "Did not play" (Missing Fixture) first, then doubts; each
// group by name. Empty when there's no absence record for the match.
export async function loadMatchAbsences(matchId: string): Promise<TeamAbsences[]> {
  const rows = await db
    .select({
      type: injury.type,
      reason: injury.reason,
      teamId: team.id,
      teamName: team.name,
      teamSlug: team.slug,
      teamLogo: team.logoUrl,
      playerId: player.id,
      playerName: player.name,
      date: match.date,
      leagueCode: match.leagueCode,
    })
    .from(injury)
    .innerJoin(team, eq(team.id, injury.teamId))
    .innerJoin(player, eq(player.id, injury.playerId))
    .innerJoin(match, eq(match.id, injury.matchId))
    .where(eq(injury.matchId, matchId))
  if (!rows.length) return []

  // Weight of the absentee: goals (real, no own goals) and assists in the SAME league UP TO the
  // date of the match. Derived from `goal` (not a snapshot) — depends on the goal backfill to be
  // complete.
  const { date: before, leagueCode } = rows[0]!
  const pids = [...new Set(rows.map((r) => r.playerId))]
  const goalsUpTo = await db
    .select({ pid: goal.playerId, n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(match.leagueCode, leagueCode), lt(match.date, before), ne(goal.type, "own"), inArray(goal.playerId, pids)))
    .groupBy(goal.playerId)
  const assistsUpTo = await db
    .select({ pid: goal.assistId, n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(match.leagueCode, leagueCode), lt(match.date, before), inArray(goal.assistId, pids)))
    .groupBy(goal.assistId)
  const goalsOf = new Map(goalsUpTo.map((r) => [r.pid, Number(r.n)]))
  const assistsOf = new Map(assistsUpTo.filter((r) => r.pid).map((r) => [r.pid!, Number(r.n)]))

  // Availability: sequence of each team's matches up to this date (desc) + absences (Missing
  // Fixture) of each player. From `injury`, which is complete → a reliable "matches out" count.
  const teamIds = [...new Set(rows.map((r) => r.teamId))]
  const teamSequence = new Map<string, string[]>() // teamId → [matchId] desc (most recent first)
  for (const tId of teamIds) {
    const fx = await db
      .select({ id: match.id })
      .from(match)
      .where(
        and(
          eq(match.leagueCode, leagueCode),
          lte(match.date, before),
          or(eq(match.homeTeamId, tId), eq(match.awayTeamId, tId)),
        ),
      )
      .orderBy(desc(match.date))
    teamSequence.set(tId, fx.map((f) => f.id))
  }
  const absences = await db
    .select({ pid: injury.playerId, mid: injury.matchId })
    .from(injury)
    .where(and(eq(injury.type, "Missing Fixture"), inArray(injury.playerId, pids)))
  const outOf = new Map<string, Set<string>>() // playerId → set of matchIds he was out of
  for (const a of absences) {
    let s = outOf.get(a.pid)
    if (!s) outOf.set(a.pid, (s = new Set()))
    s.add(a.mid)
  }

  const byTeam = new Map<string, TeamAbsences>()
  for (const r of rows) {
    let g = byTeam.get(r.teamId)
    if (!g) {
      g = { team: { id: r.teamId, name: r.teamName, slug: r.teamSlug, logoUrl: r.teamLogo }, absences: [] }
      byTeam.set(r.teamId, g)
    }
    const seq = teamSequence.get(r.teamId) ?? []
    const out = outOf.get(r.playerId) ?? new Set<string>()
    let consecutive = 0
    for (const mid of seq) {
      if (out.has(mid)) consecutive++
      else break
    }
    g.absences.push({
      player: { id: r.playerId, name: r.playerName },
      didNotPlay: r.type === "Missing Fixture",
      reason: r.reason,
      goals: goalsOf.get(r.playerId) ?? 0,
      assists: assistsOf.get(r.playerId) ?? 0,
      consecutiveOut: consecutive,
      totalOut: seq.filter((mid) => out.has(mid)).length,
    })
  }
  // sort: most goals first, then who didn't play, then name.
  for (const g of byTeam.values()) {
    g.absences.sort(
      (a, b) =>
        b.goals - a.goals ||
        Number(b.didNotPlay) - Number(a.didNotPlay) ||
        a.player.name.localeCompare(b.player.name),
    )
  }
  return [...byTeam.values()]
}

/* ---------- Pure computations (over the domain contract, keyed by team.id) ---------- */

/** Groups matches by round, in ascending order. */
export function groupByRound(matches: Match[]): Round[] {
  const byRound = new Map<number, Round>()
  for (const m of matches) {
    let round = byRound.get(m.round)
    if (!round) {
      round = { round: m.round, name: `Round ${m.round}`, matches: [] }
      byRound.set(m.round, round)
    }
    round.matches.push(m)
  }
  return [...byRound.values()].sort((a, b) => a.round - b.round)
}

/**
 * Standings by the official Premier League rule:
 * points (W=3, D=1, L=0) → goal difference → goals for → name (A→Z).
 * Keyed by team.id (stable); matches without a score are ignored.
 */
export function computeStandings(matches: Match[]): StandingRow[] {
  type Acc = Omit<StandingRow, "position" | "goalDifference" | "form" | "zone">
  const table = new Map<string, Acc>()

  const row = (t: TeamRef): Acc => {
    let l = table.get(t.id)
    if (!l) {
      l = { team: t, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 }
      table.set(t.id, l)
    }
    return l
  }

  for (const m of matches) {
    if (!m.score) continue
    const [homeGoals, awayGoals] = m.score.ft
    const home = row(m.home)
    const away = row(m.away)

    home.played++
    away.played++
    home.goalsFor += homeGoals
    home.goalsAgainst += awayGoals
    away.goalsFor += awayGoals
    away.goalsAgainst += homeGoals

    if (homeGoals > awayGoals) {
      home.won++
      home.points += 3
      away.lost++
    } else if (homeGoals < awayGoals) {
      away.won++
      away.points += 3
      home.lost++
    } else {
      home.drawn++
      away.drawn++
      home.points++
      away.points++
    }
  }

  return [...table.values()]
    .map((l) => ({ ...l, goalDifference: l.goalsFor - l.goalsAgainst }))
    .sort(
      (a, b) =>
        b.points - a.points ||
        b.goalDifference - a.goalDifference ||
        b.goalsFor - a.goalsFor ||
        a.team.name.localeCompare(b.team.name),
    )
    // form = team's last 5 WITHIN the received matches (respects the ?upTo cut). No `before`:
    // here it's the "current" form of the table, not anchored to a specific match.
    .map((l, i) => ({ position: i + 1, ...l, zone: null, form: computeForm(matches, l.team).recent }))
}

/** Result of ONE match from the perspective of `teamId`, with context (opponent/score/match).
 *  Assumes score != null. */
function formResult(m: Match, teamId: string): FormResult {
  const [h, a] = m.score!.ft
  const isHome = m.home.id === teamId
  const goalsFor = isHome ? h : a
  const goalsAgainst = isHome ? a : h
  return {
    result: goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D",
    matchId: m.id,
    opponent: isHome ? m.away : m.home,
    goalsFor,
    goalsAgainst,
    side: isHome ? "home" : "away",
  }
}

/**
 * Form of a team in the last N matches WITH a score. `before` (yyyy-MM-dd) anchors the form to a
 * match (only counts strictly earlier matches) — that's what the match page wants.
 * `side` narrows the perspective: "home" only as home, "away" only as away.
 * Date comparison is lexicographic (yyyy-MM-dd is sortable as a string).
 */
export function computeForm(
  matches: Match[],
  t: TeamRef,
  opts?: { before?: string; n?: number; side?: "all" | "home" | "away" },
): Form {
  const n = opts?.n ?? 5
  const side = opts?.side ?? "all"

  const games = matches
    .filter((m) => m.score != null)
    .filter((m) => m.home.id === t.id || m.away.id === t.id)
    .filter((m) => (opts?.before ? m.date < opts.before : true))
    .filter((m) => {
      if (side === "home") return m.home.id === t.id
      if (side === "away") return m.away.id === t.id
      return true
    })
    .sort((a, b) => b.date.localeCompare(a.date)) // most recent first
    .slice(0, n)

  const recent = games.map((m) => formResult(m, t.id))
  const summary = {
    w: recent.filter((r) => r.result === "W").length,
    d: recent.filter((r) => r.result === "D").length,
    l: recent.filter((r) => r.result === "L").length,
  }
  return { team: t, recent, summary }
}

// Minimum played matches for a trend to be shown without a low-sample warning.
const TREND_MIN_SAMPLE = 10

/** Wilson score interval (95%, z=1.96) for k successes in n trials — an honest band for small
 *  samples (n≈19 per venue here). Point + lower/upper bounds, all fractions [0,1]. */
function wilson(k: number, n: number): { pct: number; lo: number; hi: number } {
  if (n === 0) return { pct: 0, lo: 0, hi: 0 }
  const z = 1.96
  const p = k / n
  const z2 = z * z
  const denom = 1 + z2 / n
  const center = (p + z2 / (2 * n)) / denom
  const margin = (z / denom) * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))
  return { pct: p, lo: Math.max(0, center - margin), hi: Math.min(1, center + margin) }
}

function proportion(k: number, n: number): Proportion {
  return { ...wilson(k, n), n, lowSample: n < TREND_MIN_SAMPLE }
}

function trendSplit(games: { gf: number; ga: number; total: number }[]): TeamTrendSplit {
  const n = games.length
  return {
    n,
    over25: proportion(games.filter((g) => g.total >= 3).length, n),
    btts: proportion(games.filter((g) => g.gf > 0 && g.ga > 0).length, n),
    cleanSheet: proportion(games.filter((g) => g.ga === 0).length, n),
    goalsForAvg: n ? games.reduce((s, g) => s + g.gf, 0) / n : 0,
    goalsAgainstAvg: n ? games.reduce((s, g) => s + g.ga, 0) / n : 0,
  }
}

/**
 * Betting trends of a team derived ONLY from played match results: over 2.5, both-teams-to-score
 * and clean-sheet rates (each a proportion with a Wilson 95% band + low-sample flag) plus goals
 * for/against per game, split into all / home / away. No external stats — just `match.score`.
 */
export function computeTeamTrends(matches: Match[], teamId: string): TeamTrends {
  const games = matches
    .filter((m) => m.score != null)
    .filter((m) => m.home.id === teamId || m.away.id === teamId)
    .map((m) => {
      const [h, a] = m.score!.ft
      const isHome = m.home.id === teamId
      return { gf: isHome ? h : a, ga: isHome ? a : h, total: h + a, isHome }
    })
  return {
    all: trendSplit(games),
    home: trendSplit(games.filter((g) => g.isHome)),
    away: trendSplit(games.filter((g) => !g.isHome)),
  }
}
