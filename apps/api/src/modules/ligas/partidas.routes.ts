import { Elysia, t } from "elysia"

import { formaQuery } from "./forma/forma.schema"
import { forma } from "./forma/forma.service"
import { desfalquesDaPartida } from "./get-desfalques/get-desfalques.service"
import { escalacaoDaPartida } from "./get-escalacao/get-escalacao.service"
import { getPartida } from "./get-partida/get-partida.service"

// `id` é validado como uuid NA BORDA: um id malformado vira 422 antes de chegar ao service —
// sem isso, a coluna `uuid` do Postgres estouraria "invalid input syntax" (→ 500). Um uuid
// válido mas inexistente passa aqui e o service resolve em 404 (linha não encontrada).
const paramId = t.Object({ id: t.String({ format: "uuid", error: "id_invalido" }) })

// Rotas de partidas (mesma feature/dados das ligas, namespace de URL próprio p/ a página
// de partida). Routes finas: 1 rota → 1 service.
export const partidasRoutes = new Elysia({ prefix: "/v1/partidas" })
  .get("/:id", ({ params }) => getPartida(params.id), {
    params: paramId,
    detail: { summary: "Detalhe de uma partida (base da página de partida)" },
  })
  .get("/:id/forma", ({ params, query }) => forma(params.id, query), {
    params: paramId,
    query: formaQuery,
    detail: { summary: "Forma (últimos N W/D/L) dos dois times, ancorada na data do jogo" },
  })
  .get("/:id/escalacao", ({ params }) => escalacaoDaPartida(params.id), {
    params: paramId,
    detail: { summary: "Escalação (titulares/banco/formação/técnico) dos dois times" },
  })
  .get("/:id/desfalques", ({ params }) => desfalquesDaPartida(params.id), {
    params: paramId,
    detail: { summary: "Desfalques (lesões/suspensões) dos dois times" },
  })
