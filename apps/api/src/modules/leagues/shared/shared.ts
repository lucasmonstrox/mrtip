import { and, asc, count, desc, eq, inArray, lt, lte, ne, or } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { db } from "../../../db/client"
import {
  coach,
  goal,
  injury,
  league,
  lineup,
  lineupPlayer,
  match,
  player,
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

// Player page: data + totals (derived from goal/injury) + the list of goals.
export type PlayerDetail = {
  id: string
  name: string
  goals: number
  assists: number
  matchesOut: number
  goalsList: PlayerGoal[]
}

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
  const [p] = await db.select({ id: player.id, name: player.name }).from(player).where(eq(player.id, id)).limit(1)
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

  return {
    id: p.id,
    name: p.name,
    goals: Number(g!.n),
    assists: Number(a!.n),
    matchesOut: Number(out!.n),
    goalsList: goalRows.map((r) => ({
      matchId: r.matchId,
      date: r.date,
      minute: r.minute,
      type: r.type as PlayerGoal["type"],
      home: r.home,
      away: r.away,
      score: r.ftH != null && r.ftA != null ? [r.ftH, r.ftA] : null,
    })),
  }
}

// Team by SLUG (key of the /teams/:slug URLs) or domain 404.
export async function getTeamBySlug(slug: string): Promise<TeamRef> {
  const [row] = await db
    .select({ id: team.id, name: team.name, slug: team.slug, logoUrl: team.logoUrl })
    .from(team)
    .where(eq(team.slug, slug))
    .limit(1)
  if (!row) throw notFound("team_not_found")
  return row
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
