import { notFound } from "../../../lib/errors"
import { getPartidaRow, loadDesfalquesDaPartida } from "../shared/shared"

// GET /v1/partidas/:id/desfalques — desfalques (lesões/suspensões) dos dois times do jogo.
// `null` por lado quando não há registro. 404 quando a partida não existe.
export async function desfalquesDaPartida(id: string) {
  const row = await getPartidaRow(id)
  if (!row) throw notFound("partida_nao_encontrada")
  const lista = await loadDesfalquesDaPartida(id)
  return {
    mandante: lista.find((d) => d.time.id === row.p.mandanteId) ?? null,
    visitante: lista.find((d) => d.time.id === row.p.visitanteId) ?? null,
  }
}
