import { notFound } from "../../../lib/errors"
import {
  getLeagueOrThrow,
  getMatchRow,
  getMatchRowBySlug,
  lastMatchBefore,
  loadMatchCards,
  loadMatchGoals,
  loadMatches,
  loadTeamStanding,
  serializeMatch,
  type Match,
  type TeamRest,
} from "../shared/shared"

// A uuid looks like 8-4-4-4-12 hex; anything else coming on /matches/:key is treated as a slug. Lets
// old uuid URLs keep resolving while new links use the pretty slug. @feature LIG-009
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Rest of a side: days between this match's date and the team's previous PLAYED match in-league.
// Both are pure yyyy-MM-dd dates (UTC midnight), so the diff is exact in CALENDAR days — no
// date-fns (not a dep of apps/api) and no float/timezone error. Do NOT swap for date-fns.
// "In-league" only: midweek cup/international games aren't ingested, so this can overestimate
// rest — the UI labels it accordingly. @feature LIG-005
function restFor(matches: Match[], teamId: string, date: string): TeamRest {
  const last = lastMatchBefore(matches, teamId, date)
  if (!last) return null
  return { lastMatchDate: last.date, restDays: Math.round((Date.parse(date) - Date.parse(last.date)) / 86_400_000) }
}

// GET /v1/matches/:key — detail of a match: match data + league summary + goals
// (scorer/assist/own goal/minute) + cards (yellow/red/second yellow) + rest days + official season
// standing of both teams. `key` is a slug (pretty URL) or a uuid (legacy). 404 (match_not_found).
export async function getMatch(key: string) {
  const row = UUID_RE.test(key) ? await getMatchRow(key) : await getMatchRowBySlug(key)
  if (!row) throw notFound("match_not_found")
  const id = row.m.id
  const league = await getLeagueOrThrow(row.m.leagueCode)
  const goals = await loadMatchGoals(id)
  const cards = await loadMatchCards(id)
  // Scope rest/standing to THIS match's season (LIG-008) — a match always has a season post-backfill.
  const matches = await loadMatches(row.m.leagueCode, row.m.seasonId ?? undefined)
  const rest = {
    home: restFor(matches, row.m.homeTeamId, row.m.date),
    away: restFor(matches, row.m.awayTeamId, row.m.date),
  }
  // Official season standing of each side (position/points/W-D-L/goals/zone) for the Fatos snapshot;
  // null when the team has no standing row yet. @feature LIG-006
  const [homeStanding, awayStanding] = await Promise.all([
    loadTeamStanding(row.m.homeTeamId, row.m.seasonId),
    loadTeamStanding(row.m.awayTeamId, row.m.seasonId),
  ])
  return {
    ...serializeMatch(row),
    league,
    goals,
    cards,
    rest,
    standings: { home: homeStanding, away: awayStanding },
  }
}
