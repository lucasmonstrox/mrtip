import { t, type Static } from "elysia"

// Query of GET /v1/leagues/:code/rounds — ?round=N filters one round (optional);
// ?season=<sportmonksSeasonId> picks a season (optional, default current). @feature LIG-008
export const listRoundsQuery = t.Object({
  round: t.Optional(t.Integer({ minimum: 1 })),
  season: t.Optional(t.Integer()),
})
export type ListRoundsQuery = Static<typeof listRoundsQuery>
