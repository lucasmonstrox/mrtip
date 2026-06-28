import { t, type Static } from "elysia"

// Query of GET /v1/leagues/:code/standings — ?upTo=N cuts the table at round N (optional).
export const standingsQuery = t.Object({
  upTo: t.Optional(t.Integer({ minimum: 1 })),
})
export type StandingsQuery = Static<typeof standingsQuery>
