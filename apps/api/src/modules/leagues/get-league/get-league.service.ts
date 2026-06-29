import { groupByRound, getLeagueOrThrow, loadMatches, resolveSeason } from "../shared/shared"

// GET /v1/leagues/:code — summary of a league (metadata + count of rounds and matches) for ONE
// season (?season=<sportmonksSeasonId>, default current). 404 when the league/season doesn't exist.
export async function getLeague(code: string, seasonParam?: number) {
  const league = await getLeagueOrThrow(code)
  const seasonId = await resolveSeason(code, seasonParam)
  const matches = await loadMatches(code, seasonId)
  return { ...league, rounds: groupByRound(matches).length, matches: matches.length }
}
