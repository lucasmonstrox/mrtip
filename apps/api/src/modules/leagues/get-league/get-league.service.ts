import { groupByRound, getLeagueOrThrow, loadMatches } from "../shared/shared"

// GET /v1/leagues/:code — summary of a league (metadata + count of rounds and matches).
// 404 (league_not_found) when the code doesn't exist.
export async function getLeague(code: string) {
  const league = await getLeagueOrThrow(code)
  const matches = await loadMatches(code)
  return { ...league, rounds: groupByRound(matches).length, matches: matches.length }
}
