import { groupByRound, getLeagueOrThrow, loadMatches } from "../shared/shared"
import type { ListRoundsQuery } from "./list-rounds.schema"

// GET /v1/leagues/:code/rounds — rounds with their matches; ?round=N filters one.
// 404 when the league doesn't exist (getLeagueOrThrow).
export async function listRounds(code: string, query: ListRoundsQuery) {
  await getLeagueOrThrow(code)
  const rounds = groupByRound(await loadMatches(code))
  return query.round != null ? rounds.filter((r) => r.round === query.round) : rounds
}
