import { Elysia } from "elysia"
import { z } from "zod"

import { CATALOGO } from "./consts"
import { ErroNaoEncontrado, Liga, LigaResumo, LinhaClassificacao, Round } from "./model"
import { agruparPorRound, calcularClassificacao, carregarTemporada } from "./service"

const ParamCode = z.object({ code: z.string() })

/** Rotas de ligas. Method chaining é obrigatório p/ o type-inference do Eden. */
export const ligas = new Elysia({ prefix: "/v1/ligas" })
  .get("/", () => CATALOGO.map(({ code, nome, pais, temporada }) => ({ code, nome, pais, temporada })), {
    response: z.array(Liga),
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
    {
      params: ParamCode,
      response: { 200: LigaResumo, 404: ErroNaoEncontrado },
      detail: { summary: "Resumo de uma liga" },
    },
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
      query: z.object({ round: z.coerce.number().int().positive().optional() }),
      response: { 200: z.array(Round), 404: ErroNaoEncontrado },
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
      query: z.object({ ate: z.coerce.number().int().positive().optional() }),
      response: { 200: z.array(LinhaClassificacao), 404: ErroNaoEncontrado },
      detail: { summary: "Tabela de classificação calculada; ?ate=N corta na rodada N" },
    },
  )
