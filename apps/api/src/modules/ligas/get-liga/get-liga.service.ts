import { agruparPorRound, getLigaOrThrow, loadPartidas } from "../shared/shared"

// GET /v1/ligas/:code — resumo de uma liga (metadados + contagem de rounds e partidas).
// 404 (liga_nao_encontrada) quando o code não existe.
export async function getLiga(code: string) {
  const liga = await getLigaOrThrow(code)
  const partidas = await loadPartidas(code)
  return { ...liga, rounds: agruparPorRound(partidas).length, partidas: partidas.length }
}
