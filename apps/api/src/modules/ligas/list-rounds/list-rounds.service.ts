import { agruparPorRound, getLigaOrThrow, loadPartidas } from "../shared/shared"
import type { ListRoundsQuery } from "./list-rounds.schema"

// GET /v1/ligas/:code/rounds — rounds (rodadas) com seus jogos; ?round=N filtra um.
// 404 quando a liga não existe (getLigaOrThrow).
export async function listRounds(code: string, query: ListRoundsQuery) {
  await getLigaOrThrow(code)
  const rounds = agruparPorRound(await loadPartidas(code))
  return query.round != null ? rounds.filter((r) => r.rodada === query.round) : rounds
}
