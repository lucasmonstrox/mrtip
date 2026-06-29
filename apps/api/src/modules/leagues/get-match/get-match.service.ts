import { notFound } from "../../../lib/errors"
import {
  getLeagueOrThrow,
  getMatchRow,
  lastMatchBefore,
  loadMatchCards,
  loadMatchGoals,
  loadMatches,
  serializeMatch,
  type Match,
  type TeamRest,
} from "../shared/shared"

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

// GET /v1/matches/:id — detail of a match: match data + league summary + goals
// (scorer/assist/own goal/minute) + cards (yellow/red/second yellow) + rest days of both teams.
// 404 (match_not_found).
export async function getMatch(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const league = await getLeagueOrThrow(row.m.leagueCode)
  const goals = await loadMatchGoals(id)
  const cards = await loadMatchCards(id)
  const matches = await loadMatches(row.m.leagueCode)
  const rest = {
    home: restFor(matches, row.m.homeTeamId, row.m.date),
    away: restFor(matches, row.m.awayTeamId, row.m.date),
  }
  return { ...serializeMatch(row), league, goals, cards, rest }
}
