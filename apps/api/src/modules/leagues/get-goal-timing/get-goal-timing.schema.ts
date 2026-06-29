import { t, type Static } from "elysia"

// Query of GET /v1/matches/:id/goal-timing — the venue cut.
// "all" = full season; "home"/"away" = only each team's home / away matches (applied to both sides equally).
export const goalTimingQuery = t.Object({
  side: t.Optional(t.UnionEnum(["all", "home", "away"])),
})
export type GoalTimingQuery = Static<typeof goalTimingQuery>
