import { notFound } from "../../../lib/errors"
import { getLeagueOrThrow, getMatchRow, loadMatchGoals, serializeMatch } from "../shared/shared"

// GET /v1/matches/:id — detail of a match: match data + league summary + the goals
// (scorer/assist/own goal/minute). 404 (match_not_found) when the id doesn't exist.
export async function getMatch(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const league = await getLeagueOrThrow(row.m.leagueCode)
  const goals = await loadMatchGoals(id)
  return { ...serializeMatch(row), league, goals }
}
