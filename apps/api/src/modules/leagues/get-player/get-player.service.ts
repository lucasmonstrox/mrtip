import { getPlayerDetail, leagueCodeOfPlayer, resolveSeason } from "../shared/shared"

// GET /v1/players/:id — player page for ONE campaign (?season=<sportmonksSeasonId>, default current;
// expanded inside getPlayerDetail to the concurrent cup seasons of the same year, so cups count):
// totals (goals/assists/matches out) + list of goals + the seasons the player has data in.
// 404 (player_not_found / season_not_found). @feature LIG-008
// A liga sai da aparição mais recente do jogador (LIG-012), então quem trocou a PL por um clube
// brasileiro abre na Série A; sem aparição nenhuma cai no default "PL".
export async function getPlayer(id: string, seasonParam?: number) {
  const seasonId = await resolveSeason((await leagueCodeOfPlayer(id)) ?? "PL", seasonParam)
  return getPlayerDetail(id, seasonId)
}
