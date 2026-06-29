import { t, type Static } from "elysia"

// Query of GET /v1/leagues/:code/standings — ?upTo=N cuts the table at round N (optional);
// ?season=<sportmonksSeasonId> picks a season (optional, default current). @feature LIG-008
export const standingsQuery = t.Object({
  upTo: t.Optional(t.Integer({ minimum: 1 })),
  season: t.Optional(t.Integer()),
})
export type StandingsQuery = Static<typeof standingsQuery>
