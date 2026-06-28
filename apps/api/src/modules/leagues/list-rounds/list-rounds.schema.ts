import { t, type Static } from "elysia"

// Query of GET /v1/leagues/:code/rounds — ?round=N filters one round (optional).
export const listRoundsQuery = t.Object({
  round: t.Optional(t.Integer({ minimum: 1 })),
})
export type ListRoundsQuery = Static<typeof listRoundsQuery>
