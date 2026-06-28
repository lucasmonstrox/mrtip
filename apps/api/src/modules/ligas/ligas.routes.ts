import { Elysia, t } from "elysia"

import { classificacaoQuery } from "./classificacao/classificacao.schema"
import { classificacao } from "./classificacao/classificacao.service"
import { getLiga } from "./get-liga/get-liga.service"
import { listLigas } from "./list-ligas/list-ligas.service"
import { listRoundsQuery } from "./list-rounds/list-rounds.schema"
import { listRounds } from "./list-rounds/list-rounds.service"

const paramCode = t.Object({ code: t.String() })

// Rotas de ligas. Method chaining é obrigatório p/ o type-inference do Eden (infere o tipo
// de resposta do RETORNO de cada handler). Routes não têm lógica — só chamam o service.
export const ligasRoutes = new Elysia({ prefix: "/v1/ligas" })
  .get("/", () => listLigas(), { detail: { summary: "Lista as ligas disponíveis" } })
  .get("/:code", ({ params }) => getLiga(params.code), {
    params: paramCode,
    detail: { summary: "Resumo de uma liga" },
  })
  .get("/:code/rounds", ({ params, query }) => listRounds(params.code, query), {
    params: paramCode,
    query: listRoundsQuery,
    detail: { summary: "Rounds (rodadas) com os jogos; ?round=N filtra um" },
  })
  .get("/:code/classificacao", ({ params, query }) => classificacao(params.code, query), {
    params: paramCode,
    query: classificacaoQuery,
    detail: { summary: "Tabela de classificação calculada; ?ate=N corta na rodada N" },
  })
