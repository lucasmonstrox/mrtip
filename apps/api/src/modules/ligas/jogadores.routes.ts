import { Elysia, t } from "elysia"

import { getJogador } from "./get-jogador/get-jogador.service"

const paramId = t.Object({ id: t.String({ format: "uuid", error: "id_invalido" }) })

// Rotas de jogadores (mesma feature/dados das ligas, namespace próprio p/ a página do jogador).
export const jogadoresRoutes = new Elysia({ prefix: "/v1/jogadores" }).get(
  "/:id",
  ({ params }) => getJogador(params.id),
  { params: paramId, detail: { summary: "Detalhe do jogador: totais + gols" } },
)
