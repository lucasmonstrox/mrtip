import { Elysia, t } from "elysia"

import { formQuery } from "./form/form.schema"
import { form } from "./form/form.service"
import { goalTimingQuery } from "./get-goal-timing/get-goal-timing.schema"
import { matchGoalTiming } from "./get-goal-timing/get-goal-timing.service"
import { matchInjuries } from "./get-injuries/get-injuries.service"
import { matchLineup } from "./get-lineup/get-lineup.service"
import { getMatch } from "./get-match/get-match.service"
import { matchScorers } from "./get-scorers/get-scorers.service"

// `id` is validated as a uuid AT THE EDGE: a malformed id becomes 422 before reaching the service —
// without it, the Postgres `uuid` column would blow up with "invalid input syntax" (→ 500). A
// valid but non-existent uuid passes here and the service resolves it as 404 (row not found).
const paramId = t.Object({ id: t.String({ format: "uuid", error: "invalid_id" }) })

// Match routes (same feature/data as leagues, own URL namespace for the match page).
// Thin routes: 1 route → 1 service.
export const matchesRoutes = new Elysia({ prefix: "/v1/matches" })
  .get("/:id", ({ params }) => getMatch(params.id), {
    params: paramId,
    detail: { summary: "Detail of a match (base of the match page)" },
  })
  .get("/:id/form", ({ params, query }) => form(params.id, query), {
    params: paramId,
    query: formQuery,
    detail: { summary: "Form (last N W/D/L) of both teams, anchored on the match date" },
  })
  .get("/:id/lineup", ({ params }) => matchLineup(params.id), {
    params: paramId,
    detail: { summary: "Lineup (starters/bench/formation/coach) of both teams" },
  })
  .get("/:id/injuries", ({ params }) => matchInjuries(params.id), {
    params: paramId,
    detail: { summary: "Absences (injuries/suspensions) of both teams" },
  })
  .get("/:id/goal-timing", ({ params, query }) => matchGoalTiming(params.id, query), {
    params: paramId,
    query: goalTimingQuery,
    detail: { summary: "Goal timing (15-min bands) of both teams over the season, by venue cut" },
  })
  .get("/:id/scorers", ({ params }) => matchScorers(params.id), {
    params: paramId,
    detail: { summary: "Top scorers (goals + assists) of each team over the season" },
  })
