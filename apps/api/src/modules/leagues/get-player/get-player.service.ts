import { getPlayerDetail, resolveSeason } from "../shared/shared"

// GET /v1/players/:id — player page for ONE season (?season=<sportmonksSeasonId>, default current):
// totals (goals/assists/matches out) + list of goals + the seasons the player has data in.
// 404 (player_not_found / season_not_found). @feature LIG-008
// TODO multi-liga: the season is resolved against "PL" (the only league today).
export async function getPlayer(id: string, seasonParam?: number) {
  const seasonId = await resolveSeason("PL", seasonParam)
  return getPlayerDetail(id, seasonId)
}
