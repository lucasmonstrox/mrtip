import { calcularClassificacao, getLigaOrThrow, loadPartidas } from "../shared/shared"
import type { ClassificacaoQuery } from "./classificacao.schema"

// GET /v1/ligas/:code/classificacao — tabela calculada; ?ate=N considera só até a rodada N
// (útil pra "classificação na época da partida"). 404 quando a liga não existe.
export async function classificacao(code: string, query: ClassificacaoQuery) {
  await getLigaOrThrow(code)
  let partidas = await loadPartidas(code)
  if (query.ate != null) partidas = partidas.filter((p) => p.rodada <= query.ate!)
  return calcularClassificacao(partidas)
}
