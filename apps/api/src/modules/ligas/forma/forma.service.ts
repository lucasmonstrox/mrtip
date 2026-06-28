import { notFound } from "../../../lib/errors"
import { calcularForma, getPartidaRow, loadPartidas, type TimeRef } from "../shared/shared"
import type { FormaQuery } from "./forma.schema"

// GET /v1/partidas/:id/forma — forma (últimos N W/D/L) dos DOIS times da partida, ANCORADA
// na data dela (só jogos anteriores contam) — é o que a página de partida precisa.
// `local` recorta a perspectiva (default "todos" = forma geral). 404 se a partida não existe.
//
// Nota: o recorte casa/fora é aplicado igual aos dois lados. A visão "preditiva" clássica
// (mandante em casa + visitante fora) é uma combinação que o front monta com dois recortes;
// o default já entrega a forma geral, que é o MVP.
export async function forma(id: string, query: FormaQuery) {
  const row = await getPartidaRow(id)
  if (!row) throw notFound("partida_nao_encontrada")

  const partidas = await loadPartidas(row.p.ligaCode)
  const mandante: TimeRef = { id: row.p.mandanteId, nome: row.mandanteNome, slug: row.mandanteSlug }
  const visitante: TimeRef = { id: row.p.visitanteId, nome: row.visitanteNome, slug: row.visitanteSlug }
  const opts = { antesDe: row.p.data, n: query.n, local: query.local }

  return {
    partida: { id: row.p.id, data: row.p.data, mandante, visitante },
    mandante: calcularForma(partidas, mandante, opts),
    visitante: calcularForma(partidas, visitante, opts),
  }
}
