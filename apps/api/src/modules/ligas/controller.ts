import { Elysia, t } from "elysia"

import { CATALOGO } from "./consts"
import { agruparPorRound, calcularClassificacao, carregarTemporada } from "./service"

const ParamCode = t.Object({ code: t.String() })

/**
 * Rotas de ligas. Method chaining é obrigatório p/ o type-inference do Eden — que
 * infere os tipos de resposta direto do RETORNO de cada handler (sem `response`
 * schema). Validar a saída seria redundante (dados estáticos do openfootball) e
 * encarece o compile da 1ª request no workerd (cold start). Inputs (params/query)
 * seguem validados.
 */
export const ligas = new Elysia({ prefix: "/v1/ligas" })
  .get("/", () => CATALOGO.map(({ code, nome, pais, temporada }) => ({ code, nome, pais, temporada })), {
    detail: { summary: "Lista as ligas disponíveis" },
  })
  .get(
    "/:code",
    ({ params, status }) => {
      const meta = CATALOGO.find((l) => l.code === params.code)
      if (!meta) return status(404, { erro: `Liga '${params.code}' não encontrada` })
      const { liga, partidas } = carregarTemporada(meta.code)
      return { ...liga, rounds: agruparPorRound(partidas).length, partidas: partidas.length }
    },
    { params: ParamCode, detail: { summary: "Resumo de uma liga" } },
  )
  .get(
    "/:code/rounds",
    ({ params, query, status }) => {
      const meta = CATALOGO.find((l) => l.code === params.code)
      if (!meta) return status(404, { erro: `Liga '${params.code}' não encontrada` })
      const rounds = agruparPorRound(carregarTemporada(meta.code).partidas)
      return query.round != null ? rounds.filter((r) => r.rodada === query.round) : rounds
    },
    {
      params: ParamCode,
      query: t.Object({ round: t.Optional(t.Integer({ minimum: 1 })) }),
      detail: { summary: "Rounds (rodadas) com os jogos; ?round=N filtra um" },
    },
  )
  .get(
    "/:code/classificacao",
    ({ params, query, status }) => {
      const meta = CATALOGO.find((l) => l.code === params.code)
      if (!meta) return status(404, { erro: `Liga '${params.code}' não encontrada` })
      const ate = query.ate
      let { partidas } = carregarTemporada(meta.code)
      if (ate != null) partidas = partidas.filter((p) => p.rodada <= ate)
      return calcularClassificacao(partidas)
    },
    {
      params: ParamCode,
      query: t.Object({ ate: t.Optional(t.Integer({ minimum: 1 })) }),
      detail: { summary: "Tabela de classificação calculada; ?ate=N corta na rodada N" },
    },
  )
