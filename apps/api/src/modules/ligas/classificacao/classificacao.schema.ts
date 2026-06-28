import { t, type Static } from "elysia"

// Query do GET /v1/ligas/:code/classificacao — ?ate=N corta a tabela na rodada N (opcional).
export const classificacaoQuery = t.Object({
  ate: t.Optional(t.Integer({ minimum: 1 })),
})
export type ClassificacaoQuery = Static<typeof classificacaoQuery>
