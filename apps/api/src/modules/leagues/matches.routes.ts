import { Elysia, t } from "elysia"

import { getAbsenceImpact } from "./get-absence-impact/get-absence-impact.service"
import { matchCommentaries } from "./get-commentaries/get-commentaries.service"
import { formQuery } from "./form/form.schema"
import { form } from "./form/form.service"
import { goalTimingQuery } from "./get-goal-timing/get-goal-timing.schema"
import { matchGoalTiming } from "./get-goal-timing/get-goal-timing.service"
import { matchInjuries } from "./get-injuries/get-injuries.service"
import { matchLineup } from "./get-lineup/get-lineup.service"
import { getMatch } from "./get-match/get-match.service"
import { matchMomentum } from "./get-match-momentum/get-match-momentum.service"
import { getPrognosis } from "./get-prognosis/get-prognosis.service"
import { prognosisAuditQuery } from "./get-prognosis-audit/get-prognosis-audit.schema"
import { getPrognosisAudit } from "./get-prognosis-audit/get-prognosis-audit.service"
import { matchScorers } from "./get-scorers/get-scorers.service"
import { matchStatistics } from "./get-statistics/get-statistics.service"

// `id` is validated as a uuid AT THE EDGE: a malformed id becomes 422 before reaching the service —
// without it, the Postgres `uuid` column would blow up with "invalid input syntax" (→ 500). A
// valid but non-existent uuid passes here and the service resolves it as 404 (row not found).
const paramId = t.Object({ id: t.String({ format: "uuid", error: "invalid_id" }) })

// Canonical detail key: a slug (pretty URL) or a legacy uuid — so NO uuid format gate here (the
// service branches by shape and 404s an unknown key). The param must keep the name `id` because the
// router (memoirist) requires the same param name at the same path position as the sub-routes below.
// @feature LIG-009
const paramKey = t.Object({ id: t.String() })

// Match routes (same feature/data as leagues, own URL namespace for the match page).
// Thin routes: 1 route → 1 service. Sub-routes still take the uuid (the page resolves it from the
// detail payload), only the canonical detail route is keyed by slug.
export const matchesRoutes = new Elysia({ prefix: "/v1/matches" })
  .get("/:id", ({ params }) => getMatch(params.id), {
    params: paramKey,
    detail: { summary: "Detail of a match by slug or uuid (base of the match page)" },
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
  .get("/:id/absence-impact", ({ params }) => getAbsenceImpact(params.id), {
    params: paramId,
    detail: { summary: "Prognosis-grade absence impact per team (share of goals + with/without); null per side when none" },
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
  .get("/:id/statistics", ({ params }) => matchStatistics(params.id), {
    params: paramId,
    detail: { summary: "Team-level match statistics of both teams (ball possession today; more to come)" },
  })
  .get("/:id/momentum", ({ params }) => matchMomentum(params.id), {
    params: paramId,
    detail: { summary: "Attack-momentum seesaw (per-minute home/away pressure) reconstructed from trends" },
  })
  .get("/:id/prognosis", ({ params }) => getPrognosis(params.id), {
    params: paramId,
    detail: { summary: "Latest LLM xG prognosis (per-team + overall); null when none yet" },
  })
  .get("/:id/prognosis/audit", ({ params, query }) => getPrognosisAudit(params.id, query.runId), {
    params: paramId,
    query: prognosisAuditQuery,
    detail: { summary: "Reasoning chain of a prognosis run (audit); null when none. Never exposes the prompt" },
  })
  .get("/:id/commentaries", ({ params }) => matchCommentaries(params.id), {
    params: paramId,
    detail: { summary: "Full play-by-play commentary of the match, chronological (empty when none)" },
  })
