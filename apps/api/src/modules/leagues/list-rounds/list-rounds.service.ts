import { groupByRound, getLeagueOrThrow, loadMatches, resolveSeason } from "../shared/shared"
import type { ListRoundsQuery } from "./list-rounds.schema"

// GET /v1/leagues/:code/rounds — rounds with their matches for ONE season
// (?season=<sportmonksSeasonId>, default current); ?round=N filters one round.
// 404 when the league/season doesn't exist.
export async function listRounds(code: string, query: ListRoundsQuery) {
  await getLeagueOrThrow(code)
  const seasonId = await resolveSeason(code, query.season)
  const rounds = groupByRound(await loadMatches(code, seasonId))
  return query.round != null ? rounds.filter((r) => r.round === query.round) : rounds
}
