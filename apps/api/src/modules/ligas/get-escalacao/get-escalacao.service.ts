import { notFound } from "../../../lib/errors"
import { getPartidaRow, loadEscalacoesDaPartida } from "../shared/shared"

// GET /v1/partidas/:id/escalacao — escalação dos dois times do jogo (titulares/banco/formação/
// técnico). `null` por lado quando ainda não há lineup (o backfill da API-Football é incremental).
// 404 quando a partida não existe.
export async function escalacaoDaPartida(id: string) {
  const row = await getPartidaRow(id)
  if (!row) throw notFound("partida_nao_encontrada")
  const lista = await loadEscalacoesDaPartida(id)
  return {
    mandante: lista.find((e) => e.time.id === row.p.mandanteId) ?? null,
    visitante: lista.find((e) => e.time.id === row.p.visitanteId) ?? null,
  }
}
