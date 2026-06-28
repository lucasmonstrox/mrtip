import { t, type Static } from "elysia"

// Query of GET /v1/matches/:id/form — N matches (1–10, default 5) and the side filter.
// "all" = overall form; "home"/"away" = only as home/away.
export const formQuery = t.Object({
  n: t.Optional(t.Integer({ minimum: 1, maximum: 10 })),
  side: t.Optional(t.UnionEnum(["all", "home", "away"])),
})
export type FormQuery = Static<typeof formQuery>
