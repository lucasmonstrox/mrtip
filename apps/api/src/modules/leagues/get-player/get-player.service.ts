import { getPlayerDetail } from "../shared/shared"

// GET /v1/players/:id — player page: totals (goals/assists/matches out) + list of goals.
// 404 (player_not_found) when the id doesn't exist.
export async function getPlayer(id: string) {
  return getPlayerDetail(id)
}
