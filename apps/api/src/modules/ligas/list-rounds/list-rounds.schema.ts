import { t, type Static } from "elysia"

// Query do GET /v1/ligas/:code/rounds — ?round=N filtra uma rodada (opcional).
export const listRoundsQuery = t.Object({
  round: t.Optional(t.Integer({ minimum: 1 })),
})
export type ListRoundsQuery = Static<typeof listRoundsQuery>
