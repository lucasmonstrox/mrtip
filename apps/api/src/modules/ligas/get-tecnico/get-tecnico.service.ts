import { getTecnicoDetalhe } from "../shared/shared"

// GET /v1/tecnicos/:id — página do técnico: nome + jogos dirigidos.
// 404 (tecnico_nao_encontrado) quando o id não existe.
export async function getTecnico(id: string) {
  return getTecnicoDetalhe(id)
}
