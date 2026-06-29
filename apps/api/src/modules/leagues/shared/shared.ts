import { and, asc, count, desc, eq, inArray, isNotNull, lt, lte, ne, or } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { db } from "../../../db/client"
import {
  card,
  coach,
  commentary,
  goal,
  injury,
  league,
  lineup,
  lineupPlayer,
  match,
  nationality,
  player,
  season,
  standing,
  team,
  venue,
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

// One season of a league for the switcher: the public id (`sportmonksSeasonId`, stable across
// re-seeds, unlike the uuid), label, ordering year and whether it's the current (default) one.
// @feature LIG-008
export type SeasonSummary = {
  sportmonksSeasonId: number
  name: string
  startYear: number
  isCurrent: boolean
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

// Venue of a match (null when not synced). lat/long are strings (numeric column) and feed the
// travel/fatigue signal — not displayed; the UI shows name/cityName/capacity (+ photo).
export type MatchVenue = {
  name: string
  cityName: string | null
  capacity: number | null
  surface: string | null
  latitude: string | null
  longitude: string | null
  imageUrl: string | null
}

export type Match = {
  id: string
  slug: string // pretty URL key, e.g. "premier-league-2025-2026-chelsea-vs-everton" (LIG-009)
  round: number
  name: string // "Matchday 12"
  date: string // yyyy-MM-dd
  time: string | null
  home: TeamRef
  away: TeamRef
  score: Score | null // null = match without a result yet
  venue: MatchVenue | null
}

// Rest of one side before a match: its previous PLAYED match in-league + days until this one.
// null when the team has no earlier match in the dataset (season debut). @feature LIG-005
export type TeamRest = { lastMatchDate: string; restDays: number } | null

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
  slug: string // pretty URL key of the match, for the link (LIG-009)
  date: string // yyyy-MM-dd of the match — for the popover's date + "há N dias"
  opponent: TeamRef
  goalsFor: number
  goalsAgainst: number
  // Half-time goals from the team's perspective; null when the source has no HT for this match.
  htGoalsFor: number | null
  htGoalsAgainst: number | null
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
  keyPasses: number | null
  shotsOnTarget: number | null
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

// Prognosis-grade impact of one absent player (anti-leak, cut at the match date): how much the
// team's attack leans on him. `pctGoals`/`pctInvolve` = his share of the team's real goals; with/
// without = the team's goals/game WITH him available vs WITHOUT (the directional "quanto o time
// perde sem ele"). `confound` flags when that with/without is noise (no direct G+A, or thin sample).
export type AbsencePlayerImpact = {
  player: { id: string; name: string }
  didNotPlay: boolean
  reason: string | null
  goals: number
  assists: number
  pctGoals: number // % of the team's real goals this player scored
  pctInvolve: number // % of the team's real goals he scored OR assisted (can exceed pctGoals)
  withN: number
  withGf: number // team goals/game in matches he played
  withoutN: number
  withoutGf: number // team goals/game in matches he missed
  dropPct: number // how much the team's g/j drops without him (negative = scores more without him)
  confound: boolean // with/without not trustworthy (no direct G+A or small sample) → show with ⚠️
}

// A team's absence impact for a match: the absent players + a TOTAL that does NOT lie. `sumPctGoals`
// is additive-safe (each real goal has a single scorer) → "% dos gols do time que saíram de quem está
// fora". The aggregate with/without (`fullSquadGf` = g/j with ALL these players available vs
// `depletedGf` = g/j in matches missing ≥1) is the visceral read, gated on sample; individual drops do
// NOT sum, hence the UI caveat.
export type TeamAbsenceImpact = {
  team: TeamRef
  teamTotalGoals: number
  players: AbsencePlayerImpact[]
  total: {
    sumPctGoals: number
    sumPctInvolve: number
    fullSquadN: number
    fullSquadGf: number | null
    depletedN: number
    depletedGf: number | null
    dropPct: number | null
  }
}

// Absence impact of a match, per side. `null` when a side has no absence record.
export type MatchAbsenceImpact = { home: TeamAbsenceImpact | null; away: TeamAbsenceImpact | null }

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

// One line of the play-by-play narration of a match (SportMonks commentary). `isGoal`/`isImportant`
// flag the highlights; `player`/`relatedPlayer` are the involved players (null on framing lines).
// `minute` is null on pre-kickoff lines. @feature LIG-010
export type CommentaryRef = { id: string; name: string; imageUrl: string | null }
export type CommentaryItem = {
  minute: number | null
  extraMinute: number | null
  comment: string
  isGoal: boolean
  isImportant: boolean
  player: CommentaryRef | null
  relatedPlayer: CommentaryRef | null
}

// One 15-minute band of a team's goal-timing profile: goals scored and conceded within the band, each
// as a share of that team's (minute-known) scored / conceded totals.
export type GoalTimingBucket = {
  label: string // "0-15" … "76-90"
  scored: number
  conceded: number
  scoredPct: number // fraction [0,1] of scored goals with a known minute
  concededPct: number // fraction [0,1] of conceded goals with a known minute
}

// A team's goal-timing profile over the season: WHEN it scores and WHEN it gets breached, in 15-min
// bands. `matches` is the honest denominator (and low-sample gate); totals count imported goal events
// (may trail the official tallies if some matches' events aren't backfilled yet).
export type TeamGoalTiming = {
  team: TeamRef
  matches: number
  totalScored: number
  totalConceded: number
  scoredWithMinute: number // scored goals with a known minute — base of the scored bands
  concededWithMinute: number // conceded goals with a known minute — base of the conceded bands
  buckets: GoalTimingBucket[] // the 6 bands, in order
  lowSample: boolean
}

// Both sides of the match. Payload of GET /:id/goal-timing.
export type MatchGoalTiming = { home: TeamGoalTiming; away: TeamGoalTiming }

// One scorer in a team's top-scorers list on the match page: season goals + assists (own goals
// excluded from the goal tally). Leaner than the league `Scorer` — no per-row club, since the list
// is already grouped under its team.
export type MatchScorer = {
  id: string
  name: string
  imageUrl: string | null
  goals: number
  assists: number
}

// One team's top scorers (marcadores) for the match-page "who can score" preview: the team + its
// top-N goleadores by goals.
export type TeamScorers = {
  team: TeamRef
  scorers: MatchScorer[]
}

// Both sides of the match. Payload of GET /:id/scorers.
export type MatchScorers = { home: TeamScorers; away: TeamScorers }

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
  slug: string // pretty URL key of the match, for the link (LIG-009)
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
  // Seasons the player has data in (for the page's season switcher). @feature LIG-008
  seasons: SeasonSummary[]
}

// Minutes floor before per-90 rates are shown (≈6 full matches) — below this the rate is noise.
const PER90_MIN_MINUTES = 540

// A match managed by a coach (for their page).
export type CoachMatch = {
  matchId: string
  slug: string // pretty URL key of the match, for the link (LIG-009)
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

// Row the read-model produces: the raw match + denormalized name/slug of both teams + venue (null
// via the left join when the match has no venue).
type MatchJoin = {
  m: MatchRow
  homeName: string
  homeSlug: string
  homeLogo: string | null
  awayName: string
  awaySlug: string
  awayLogo: string | null
  v: typeof venue.$inferSelect | null
}

// BASE read-model: match + name/slug of both teams via join (inner — the ids are notNull with FK,
// so they always match) + venue (LEFT join — venueId is nullable, so a match without venue is kept).
// Factory (`() =>`) because each caller chains its own where/orderBy.
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
      v: venue,
    })
    .from(match)
    .innerJoin(teamHome, eq(teamHome.id, match.homeTeamId))
    .innerJoin(teamAway, eq(teamAway.id, match.awayTeamId))
    .leftJoin(venue, eq(venue.id, match.venueId))

// Flattens the join row (score in 4 columns + names from the join) into the output contract (score
// and teams nested). The ONLY place that defines the shape of a match — list/rounds/detail all go
// through here, so the payload never diverges between endpoints.
export function serializeMatch(row: MatchJoin): Match {
  const { m } = row
  const { ftHome: fh, ftAway: fa, htHome: hh, htAway: ha } = m
  const score: Score | null =
    fh == null || fa == null ? null : { ft: [fh, fa], ht: hh != null && ha != null ? [hh, ha] : null }
  const v = row.v
  return {
    id: m.id,
    slug: m.slug,
    round: m.round,
    name: m.name,
    date: m.date,
    time: m.time,
    home: { id: m.homeTeamId, name: row.homeName, slug: row.homeSlug, logoUrl: row.homeLogo },
    away: { id: m.awayTeamId, name: row.awayName, slug: row.awaySlug, logoUrl: row.awayLogo },
    score,
    venue: v
      ? {
          name: v.name,
          cityName: v.cityName,
          capacity: v.capacity,
          surface: v.surface,
          latitude: v.latitude,
          longitude: v.longitude,
          imageUrl: v.imageUrl,
        }
      : null,
  }
}

// The current (live) season id of a league — the default scope of every league/team/player read.
// 404 when the league has no current season. @feature LIG-008
export async function currentSeasonId(code: string): Promise<string> {
  const [row] = await db
    .select({ id: season.id })
    .from(season)
    .where(and(eq(season.leagueCode, code), eq(season.isCurrent, true)))
    // Deterministic guard: if more than one row is ever flagged current, the most recent wins.
    .orderBy(desc(season.startYear))
    .limit(1)
  if (!row) throw notFound("season_not_found")
  return row.id
}

// Resolves the season uuid to scope a read by: the one matching `sportmonksSeasonId` (the public
// `?season=` value) or, when omitted, the current season. 404 when the requested season doesn't
// exist in this league. @feature LIG-008
export async function resolveSeason(code: string, sportmonksSeasonId?: number): Promise<string> {
  if (sportmonksSeasonId == null) return currentSeasonId(code)
  const [row] = await db
    .select({ id: season.id })
    .from(season)
    .where(and(eq(season.leagueCode, code), eq(season.sportmonksSeasonId, sportmonksSeasonId)))
    .limit(1)
  if (!row) throw notFound("season_not_found")
  return row.id
}

// All seasons of a league for the switcher, most recent first. @feature LIG-008
export async function seasonsOf(code: string): Promise<SeasonSummary[]> {
  return db
    .select({
      sportmonksSeasonId: season.sportmonksSeasonId,
      name: season.name,
      startYear: season.startYear,
      isCurrent: season.isCurrent,
    })
    .from(season)
    .where(eq(season.leagueCode, code))
    .orderBy(desc(season.startYear))
}

// All matches of a league IN ONE SEASON (default: the current one), ordered by round and date —
// base of rounds, standings and form. Returns already serialized (domain contract). @feature LIG-008
export async function loadMatches(code: string, seasonId?: string): Promise<Match[]> {
  const sid = seasonId ?? (await currentSeasonId(code))
  const rows = await baseQuery()
    .where(and(eq(match.leagueCode, code), eq(match.seasonId, sid)))
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

// Row of a match by its pretty slug (key of /matches/:slug) — null when it doesn't exist. The route
// passes either a uuid or a slug; the service picks this when the key isn't a uuid. @feature LIG-009
export async function getMatchRowBySlug(slug: string): Promise<MatchJoin | null> {
  const [row] = await baseQuery().where(eq(match.slug, slug)).limit(1)
  return row ?? null
}

// League by code or domain 404 (mapped by the global onError).
export async function getLeagueOrThrow(code: string): Promise<League> {
  const [row] = await db.select().from(league).where(eq(league.code, code)).limit(1)
  if (!row) throw notFound("league_not_found")
  return row
}

// Player page for ONE season: totals (real goals, assists, matches out) + list of goals, all scoped
// to `seasonId` via `match.seasonId` (so the page is the chosen season, not the player's career).
// Derived from `goal`/`injury` (not a snapshot). 404 if the id doesn't exist. @feature LIG-008
export async function getPlayerDetail(id: string, seasonId: string): Promise<PlayerDetail> {
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

  // Season-scoped totals: each aggregate joins `match` to filter by `match.seasonId`. @feature LIG-008
  const [g] = await db
    .select({ n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(goal.playerId, id), ne(goal.type, "own"), eq(match.seasonId, seasonId)))
  const [a] = await db
    .select({ n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(goal.assistId, id), eq(match.seasonId, seasonId)))
  const [out] = await db
    .select({ n: count() })
    .from(injury)
    .innerJoin(match, eq(match.id, injury.matchId))
    .where(and(eq(injury.playerId, id), eq(injury.type, "Missing Fixture"), eq(match.seasonId, seasonId)))

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
    .where(and(eq(goal.playerId, id), ne(goal.type, "own"), eq(match.seasonId, seasonId)))
    .orderBy(asc(match.date))

  // Per-match appearances (the player's lineup rows): rating/minutes/role + opponent/score. The spine
  // the page aggregates over. starter/minutes/motm come straight from lineup_player.
  const appRows = await db
    .select({
      matchId: match.id,
      slug: match.slug,
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
    .where(and(eq(lineupPlayer.playerId, id), eq(match.seasonId, seasonId)))
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
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(goal.assistId, id), eq(match.seasonId, seasonId)))
    .groupBy(goal.matchId)
  const assistsByMatch = new Map(assistRows.map((r) => [r.matchId, Number(r.n)]))

  const cardRows = await db
    .select({ matchId: card.matchId, type: card.type })
    .from(card)
    .innerJoin(match, eq(match.id, card.matchId))
    .where(and(eq(card.playerId, id), eq(match.seasonId, seasonId)))
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
      slug: r.slug,
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

  // Seasons the player has appearances in (for the switcher). @feature LIG-008
  const seasons = await seasonsOfPlayer(id)

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
    seasons,
  }
}

// Seasons a player has appearances (lineup rows) in, most recent first — for the player-page
// switcher. @feature LIG-008
export async function seasonsOfPlayer(playerId: string): Promise<SeasonSummary[]> {
  return db
    .selectDistinct({
      sportmonksSeasonId: season.sportmonksSeasonId,
      name: season.name,
      startYear: season.startYear,
      isCurrent: season.isCurrent,
    })
    .from(season)
    .innerJoin(match, eq(match.seasonId, season.id))
    .innerJoin(lineup, eq(lineup.matchId, match.id))
    .innerJoin(lineupPlayer, and(eq(lineupPlayer.lineupId, lineup.id), eq(lineupPlayer.playerId, playerId)))
    .orderBy(desc(season.startYear))
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

// Official SportMonks standing row of a team IN ONE SEASON (position/points/W-D-L/goals/zone) — the
// authoritative season aggregate from `standing`. null when the team has no standing in that season
// (or no season). Scoped by seasonId so multi-season data doesn't return an arbitrary row. @feature LIG-008
export async function loadTeamStanding(teamId: string, seasonId: string | null): Promise<TeamStanding | null> {
  if (!seasonId) return null
  const [row] = await db
    .select()
    .from(standing)
    .where(and(eq(standing.teamId, teamId), eq(standing.seasonId, seasonId)))
    .limit(1)
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

// All matches of a team (as home OR away) IN ONE SEASON, most recent first — base of the team page.
// Serialized in the domain contract. Empty when no season. @feature LIG-008
export async function loadTeamMatches(id: string, seasonId: string | null): Promise<Match[]> {
  if (!seasonId) return []
  const rows = await baseQuery()
    .where(and(or(eq(match.homeTeamId, id), eq(match.awayTeamId, id)), eq(match.seasonId, seasonId)))
    .orderBy(desc(match.date))
  return rows.map(serializeMatch)
}

// Seasons a team has an official standing in (for the team-page switcher), most recent first. One
// standing row per (season, team) → one row per season. @feature LIG-008
export async function seasonsOfTeam(teamId: string): Promise<SeasonSummary[]> {
  return db
    .selectDistinct({
      sportmonksSeasonId: season.sportmonksSeasonId,
      name: season.name,
      startYear: season.startYear,
      isCurrent: season.isCurrent,
    })
    .from(season)
    .innerJoin(standing, eq(standing.seasonId, season.id))
    .where(eq(standing.teamId, teamId))
    .orderBy(desc(season.startYear))
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
      keyPasses: lineupPlayer.keyPasses,
      shotsOnTarget: lineupPlayer.shotsOnTarget,
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
        keyPasses: p.keyPasses,
        shotsOnTarget: p.shotsOnTarget,
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
// `player` enters the commentary join 2x (author + related) → its own aliases. @feature LIG-010
const playerCommentator = alias(player, "player_commentator")
const playerCommentaryRelated = alias(player, "player_commentary_related")
// `team` managed by the coach in the match (3rd alias, besides home/away).
const teamManaged = alias(team, "team_managed")

// Coach page: name + matches he managed (with the team he led in each one). 404 if it doesn't exist.
export async function getCoachDetail(id: string): Promise<CoachDetail> {
  const [c] = await db.select({ id: coach.id, name: coach.name }).from(coach).where(eq(coach.id, id)).limit(1)
  if (!c) throw notFound("coach_not_found")

  const matches = await db
    .select({
      matchId: match.id,
      slug: match.slug,
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
      slug: m.slug,
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

// Play-by-play narration of a match, ordered chronologically by SportMonks' `sortOrder` (the canonical
// key — minute can be null on framing lines). Joins the author + related player (both left, both
// nullable). Returns the FULL feed; the UI filters highlights by isGoal/isImportant. @feature LIG-010
export async function loadMatchCommentaries(matchId: string): Promise<CommentaryItem[]> {
  const rows = await db
    .select({
      minute: commentary.minute,
      extraMinute: commentary.extraMinute,
      comment: commentary.comment,
      isGoal: commentary.isGoal,
      isImportant: commentary.isImportant,
      playerId: playerCommentator.id,
      playerName: playerCommentator.name,
      playerImage: playerCommentator.imageUrl,
      relatedId: playerCommentaryRelated.id,
      relatedName: playerCommentaryRelated.name,
      relatedImage: playerCommentaryRelated.imageUrl,
    })
    .from(commentary)
    .leftJoin(playerCommentator, eq(playerCommentator.id, commentary.playerId))
    .leftJoin(playerCommentaryRelated, eq(playerCommentaryRelated.id, commentary.relatedPlayerId))
    .where(eq(commentary.matchId, matchId))
    .orderBy(asc(commentary.sortOrder))

  return rows.map((r) => ({
    minute: r.minute,
    extraMinute: r.extraMinute,
    comment: r.comment,
    isGoal: r.isGoal,
    isImportant: r.isImportant,
    player: r.playerId && r.playerName ? { id: r.playerId, name: r.playerName, imageUrl: r.playerImage } : null,
    relatedPlayer: r.relatedId && r.relatedName ? { id: r.relatedId, name: r.relatedName, imageUrl: r.relatedImage } : null,
  }))
}

// The six 15-min bands (fixed labels) and the games floor below which the distribution is too noisy.
const TIMING_BUCKETS = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90"] as const
const TIMING_MIN_MATCHES = 10

// 15-min band of a match minute. Second-half stoppage (90+x) falls in the last band; with no
// `extra_minute` column, a 45+x goal stored as 46/47 lands in "46-60" (accepted imprecision).
function timingBucket(minute: number): number {
  if (minute <= 15) return 0
  if (minute <= 30) return 1
  if (minute <= 45) return 2
  if (minute <= 60) return 3
  if (minute <= 75) return 4
  return 5
}

// Goal-timing profile of both teams of a match: distribution of goals SCORED and CONCEDED per 15-min
// band over the league season. In one of a team's matches, a goal whose `goal.teamId` is the team is
// scored, otherwise conceded — so an own goal by the team counts as conceded and one in its favour as
// scored (the teamId rule handles both, matching the scoreline). Derived live from goal⋈match.
export async function loadGoalTiming(
  home: TeamRef,
  away: TeamRef,
  seasonId: string, // window = THIS match's season (LIG-008), not the whole league
  side: "all" | "home" | "away" = "all",
): Promise<MatchGoalTiming> {
  const ids = [home.id, away.id]

  // Every goal in either team's matches, with the scoring team + both sides, to attribute each goal
  // to whoever scored and whoever conceded it.
  const goalRows = await db
    .select({
      minute: goal.minute,
      scoringTeamId: goal.teamId,
      homeId: match.homeTeamId,
      awayId: match.awayTeamId,
    })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(
      and(eq(match.seasonId, seasonId), or(inArray(match.homeTeamId, ids), inArray(match.awayTeamId, ids))),
    )

  // Each team's PLAYED matches (with a result) — the honest denominator and the low-sample gate.
  const playedRows = await db
    .select({ homeId: match.homeTeamId, awayId: match.awayTeamId })
    .from(match)
    .where(
      and(
        eq(match.seasonId, seasonId),
        isNotNull(match.ftHome),
        or(inArray(match.homeTeamId, ids), inArray(match.awayTeamId, ids)),
      ),
    )

  const build = (team: TeamRef): TeamGoalTiming => {
    // Venue cut: "home"/"away" keep only the matches where THIS team played at home / away (the cut is
    // applied to each side independently); "all" keeps the full season.
    const inCut = (homeId: string, awayId: string) =>
      side === "home"
        ? homeId === team.id
        : side === "away"
          ? awayId === team.id
          : homeId === team.id || awayId === team.id
    const scored = [0, 0, 0, 0, 0, 0]
    const conceded = [0, 0, 0, 0, 0, 0]
    let totalScored = 0
    let totalConceded = 0
    let scoredWithMinute = 0
    let concededWithMinute = 0
    for (const r of goalRows) {
      if (!inCut(r.homeId, r.awayId)) continue // not this team's match (within the venue cut)
      const mine = r.scoringTeamId === team.id
      if (mine) totalScored++
      else totalConceded++
      if (r.minute == null) continue
      const idx = timingBucket(r.minute)
      if (mine) {
        scoredWithMinute++
        scored[idx] = (scored[idx] ?? 0) + 1
      } else {
        concededWithMinute++
        conceded[idx] = (conceded[idx] ?? 0) + 1
      }
    }
    const matches = playedRows.filter((m) => inCut(m.homeId, m.awayId)).length
    const buckets = TIMING_BUCKETS.map((label, i) => ({
      label,
      scored: scored[i] ?? 0,
      conceded: conceded[i] ?? 0,
      scoredPct: scoredWithMinute ? (scored[i] ?? 0) / scoredWithMinute : 0,
      concededPct: concededWithMinute ? (conceded[i] ?? 0) / concededWithMinute : 0,
    }))
    return {
      team,
      matches,
      totalScored,
      totalConceded,
      scoredWithMinute,
      concededWithMinute,
      buckets,
      lowSample: matches < TIMING_MIN_MATCHES,
    }
  }

  return { home: build(home), away: build(away) }
}

// Top scorers (marcadores) of ONE team over the league season: goals + assists per player, ranked by
// goals, capped at `limit`. Own goals are excluded from the tally; scoped by `goal.teamId` (the team
// the goal was scored for). The reusable unit behind the match-page "who can score" preview and the
// team page squad table. Derived live from goal⋈match — no snapshot.
export async function loadTeamScorers(
  team: TeamRef,
  seasonId: string, // window = THIS match's season (LIG-008)
  limit: number,
): Promise<TeamScorers> {
  // Goals per player scored FOR this team (own goals out), most first; name breaks ties.
  const goalRows = await db
    .select({ id: player.id, name: player.name, imageUrl: player.imageUrl, goals: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .innerJoin(player, eq(player.id, goal.playerId))
    .where(and(eq(match.seasonId, seasonId), eq(goal.teamId, team.id), ne(goal.type, "own")))
    .groupBy(player.id, player.name, player.imageUrl)
    .orderBy(desc(count()), asc(player.name))
    .limit(limit)

  // Assists by this team's players on this team's goals (innerJoin on assistId drops the unassisted).
  const assistRows = await db
    .select({ id: player.id, assists: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .innerJoin(player, eq(player.id, goal.assistId))
    .where(and(eq(match.seasonId, seasonId), eq(goal.teamId, team.id)))
    .groupBy(player.id)
  const assistsByPlayer = new Map(assistRows.map((r) => [r.id, Number(r.assists)]))

  return {
    team,
    scorers: goalRows.map((r) => ({
      id: r.id,
      name: r.name,
      imageUrl: r.imageUrl,
      goals: Number(r.goals),
      assists: assistsByPlayer.get(r.id) ?? 0,
    })),
  }
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
      seasonId: match.seasonId,
    })
    .from(injury)
    .innerJoin(team, eq(team.id, injury.teamId))
    .innerJoin(player, eq(player.id, injury.playerId))
    .innerJoin(match, eq(match.id, injury.matchId))
    .where(eq(injury.matchId, matchId))
  if (!rows.length) return []

  // Weight of the absentee: goals (real, no own goals) and assists in the SAME season UP TO the
  // date of the match. Derived from `goal` (not a snapshot) — depends on the goal backfill to be
  // complete. @feature LIG-008
  const { date: before, seasonId } = rows[0]!
  if (!seasonId) return [] // match always has a season post-backfill; null → no scoped data
  const pids = [...new Set(rows.map((r) => r.playerId))]
  const goalsUpTo = await db
    .select({ pid: goal.playerId, n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(match.seasonId, seasonId), lt(match.date, before), ne(goal.type, "own"), inArray(goal.playerId, pids)))
    .groupBy(goal.playerId)
  const assistsUpTo = await db
    .select({ pid: goal.assistId, n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(match.seasonId, seasonId), lt(match.date, before), inArray(goal.assistId, pids)))
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
          eq(match.seasonId, seasonId),
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

// Below this many "com ele"/"sem ele" games, the with/without scoring rate is noise — flagged, not trusted.
const ABSENCE_LOW_SAMPLE = 6

// Prognosis-grade absence impact of a match: for each absent player, how much the team's attack leans
// on him (% of the team's goals + the team's goals/game WITH him vs WITHOUT), plus a per-team TOTAL
// (additive-safe sum of % goals + the aggregate full-squad→depleted goals/game). Everything is cut at
// the match date (anti-leak) and derived from `goal`/`lineup_player` — it mirrors the prognosis prompt's
// own absence block so the read on the tab is auditable. `null` per side when there's no absence record.
export async function loadAbsenceImpact(matchId: string): Promise<MatchAbsenceImpact> {
  const [m] = await db.select().from(match).where(eq(match.id, matchId)).limit(1)
  if (!m) return { home: null, away: null }
  const { date: cutoff, seasonId } = m
  if (!seasonId) return { home: null, away: null } // match always has a season post-backfill

  const inj = await db
    .select({ playerId: injury.playerId, teamId: injury.teamId, type: injury.type, reason: injury.reason, name: player.name })
    .from(injury)
    .innerJoin(player, eq(player.id, injury.playerId))
    .where(eq(injury.matchId, matchId))
  if (!inj.length) return { home: null, away: null }

  // All finished league matches strictly before this one — the pre-match picture, no leakage.
  const playedAll = await db
    .select()
    .from(match)
    .where(and(eq(match.seasonId, seasonId), isNotNull(match.ftHome), lt(match.date, cutoff)))
  const teamMatches = (id: string) => playedAll.filter((p) => p.homeTeamId === id || p.awayTeamId === id)
  const goalsFor = (p: MatchRow, id: string) => (p.homeTeamId === id ? p.ftHome : p.ftAway) ?? 0
  const avgGf = (rows: MatchRow[], id: string) =>
    rows.length ? +(rows.reduce((s, p) => s + goalsFor(p, id), 0) / rows.length).toFixed(2) : 0

  const pids = [...new Set(inj.map((i) => i.playerId))]
  const teamIds = [...new Set(inj.map((i) => i.teamId))]

  // Team's own real goals (no own goals) up to the date — the denominator for each player's share.
  const teamGoalsRows = await db
    .select({ teamId: goal.teamId, n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(match.seasonId, seasonId), lt(match.date, cutoff), ne(goal.type, "own"), inArray(goal.teamId, teamIds)))
    .groupBy(goal.teamId)
  const teamTotalGoals = new Map(teamGoalsRows.map((r) => [r.teamId, Number(r.n)]))

  // Each absent player's real goals + assists in the league up to the date.
  const goalsUpTo = await db
    .select({ pid: goal.playerId, n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(match.seasonId, seasonId), lt(match.date, cutoff), ne(goal.type, "own"), inArray(goal.playerId, pids)))
    .groupBy(goal.playerId)
  const assistsUpTo = await db
    .select({ pid: goal.assistId, n: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .where(and(eq(match.seasonId, seasonId), lt(match.date, cutoff), inArray(goal.assistId, pids)))
    .groupBy(goal.assistId)
  const goalsOf = new Map(goalsUpTo.map((r) => [r.pid, Number(r.n)]))
  const assistsOf = new Map(assistsUpTo.filter((r) => r.pid).map((r) => [r.pid!, Number(r.n)]))

  // Matches each absent player actually played (starter OR minutes > 0) — drives the with/without split.
  const lp = await db
    .select({ matchId: lineup.matchId, playerId: lineupPlayer.playerId, starter: lineupPlayer.starter, mins: lineupPlayer.minutesPlayed })
    .from(lineupPlayer)
    .innerJoin(lineup, eq(lineup.id, lineupPlayer.lineupId))
    .where(inArray(lineupPlayer.playerId, pids))
  const playedByPlayer = new Map<string, Set<string>>()
  for (const r of lp) {
    if (!(r.starter || (r.mins ?? 0) > 0)) continue
    let s = playedByPlayer.get(r.playerId)
    if (!s) playedByPlayer.set(r.playerId, (s = new Set()))
    s.add(r.matchId)
  }

  const teamRows = await db
    .select({ id: team.id, name: team.name, slug: team.slug, logoUrl: team.logoUrl })
    .from(team)
    .where(inArray(team.id, teamIds))
  const teamRef = new Map(teamRows.map((t) => [t.id, t]))

  const byTeam = new Map<string, TeamAbsenceImpact>()
  for (const tId of teamIds) {
    const ms = teamMatches(tId)
    const teamGoals = teamTotalGoals.get(tId) ?? 0
    const teamInj = inj.filter((i) => i.teamId === tId)

    const players: AbsencePlayerImpact[] = teamInj.map((i) => {
      const playedIds = playedByPlayer.get(i.playerId) ?? new Set<string>()
      const withRows = ms.filter((p) => playedIds.has(p.id))
      const withoutRows = ms.filter((p) => !playedIds.has(p.id))
      const withGf = avgGf(withRows, tId)
      const withoutGf = avgGf(withoutRows, tId)
      const goals = goalsOf.get(i.playerId) ?? 0
      const assists = assistsOf.get(i.playerId) ?? 0
      return {
        player: { id: i.playerId, name: i.name.trim() },
        didNotPlay: i.type === "Missing Fixture",
        reason: i.reason,
        goals,
        assists,
        pctGoals: teamGoals ? Math.round((goals / teamGoals) * 100) : 0,
        pctInvolve: teamGoals ? Math.round(((goals + assists) / teamGoals) * 100) : 0,
        withN: withRows.length,
        withGf,
        withoutN: withoutRows.length,
        withoutGf,
        dropPct: withGf ? Math.round((1 - withoutGf / withGf) * 100) : 0,
        // Confound guard: zero direct contribution OR a thin with/without sample → don't trust the drop.
        confound: goals + assists === 0 || withRows.length < ABSENCE_LOW_SAMPLE || withoutRows.length < ABSENCE_LOW_SAMPLE,
      }
    })
    players.sort((a, b) => b.goals + b.assists - (a.goals + a.assists))

    // Aggregate with/without: g/j with ALL these absentees available vs in matches missing ≥1 of them.
    const absentPlayed = teamInj.map((i) => playedByPlayer.get(i.playerId) ?? new Set<string>())
    const fullRows = ms.filter((p) => absentPlayed.every((s) => s.has(p.id)))
    const depletedRows = ms.filter((p) => absentPlayed.some((s) => !s.has(p.id)))
    const fullSquadGf = fullRows.length ? avgGf(fullRows, tId) : null
    const depletedGf = depletedRows.length ? avgGf(depletedRows, tId) : null
    // Sum of % goals is additive-safe (one scorer per real goal); % involve can exceed 100 (a goal
    // both scored and assisted by two absentees counts twice) — the UI labels it accordingly.
    const sumGoals = teamInj.reduce((s, i) => s + (goalsOf.get(i.playerId) ?? 0), 0)
    const sumInvolve = teamInj.reduce((s, i) => s + (goalsOf.get(i.playerId) ?? 0) + (assistsOf.get(i.playerId) ?? 0), 0)

    byTeam.set(tId, {
      team: teamRef.get(tId) ?? { id: tId, name: "?", slug: tId, logoUrl: null },
      teamTotalGoals: teamGoals,
      players,
      total: {
        sumPctGoals: teamGoals ? Math.round((sumGoals / teamGoals) * 100) : 0,
        sumPctInvolve: teamGoals ? Math.round((sumInvolve / teamGoals) * 100) : 0,
        fullSquadN: fullRows.length,
        fullSquadGf,
        depletedN: depletedRows.length,
        depletedGf,
        dropPct: fullSquadGf && depletedGf != null ? Math.round((1 - depletedGf / fullSquadGf) * 100) : null,
      },
    })
  }

  return { home: byTeam.get(m.homeTeamId) ?? null, away: byTeam.get(m.awayTeamId) ?? null }
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
  const ht = m.score!.ht
  return {
    result: goalsFor > goalsAgainst ? "W" : goalsFor < goalsAgainst ? "L" : "D",
    matchId: m.id,
    slug: m.slug,
    date: m.date,
    opponent: isHome ? m.away : m.home,
    goalsFor,
    goalsAgainst,
    htGoalsFor: ht ? (isHome ? ht[0] : ht[1]) : null,
    htGoalsAgainst: ht ? (isHome ? ht[1] : ht[0]) : null,
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

// The team's most recent PLAYED match before `before` (any venue) — the "last game" anchor.
// Same selection as computeForm but returns the Match; shared by LIG-005 (rest days) and the
// future W-021 (last-match scorers). null when the team has no earlier match in the dataset.
// @feature LIG-005
export function lastMatchBefore(matches: Match[], teamId: string, before: string): Match | null {
  return (
    matches
      .filter((m) => m.score != null)
      .filter((m) => m.home.id === teamId || m.away.id === teamId)
      .filter((m) => m.date < before)
      .sort((a, b) => b.date.localeCompare(a.date))[0] ?? null
  )
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
