import { getJogadorDetalhe } from "../shared/shared"

// GET /v1/jogadores/:id — página do jogador: totais (gols/assists/jogos fora) + lista de gols.
// 404 (jogador_nao_encontrado) quando o id não existe.
export async function getJogador(id: string) {
  return getJogadorDetalhe(id)
}
