import { notFound } from "../../../lib/errors"
import { getLigaOrThrow, getPartidaRow, loadGolsDaPartida, serializePartida } from "../shared/shared"

// GET /v1/partidas/:id — detalhe de uma partida: dados do jogo + resumo da liga + os gols
// (autor/assist/autogolo/minuto). 404 (partida_nao_encontrada) quando o id não existe.
export async function getPartida(id: string) {
  const row = await getPartidaRow(id)
  if (!row) throw notFound("partida_nao_encontrada")
  const liga = await getLigaOrThrow(row.p.ligaCode)
  const gols = await loadGolsDaPartida(id)
  return { ...serializePartida(row), liga, gols }
}
