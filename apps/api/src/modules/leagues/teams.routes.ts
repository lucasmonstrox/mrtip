import { Elysia, t } from "elysia"

import { getTeam } from "./get-team/get-team.service"

// Team routes (same feature/data as leagues, own namespace for the team page).
// Routed by SLUG (pretty URL: /v1/teams/liverpool-fc). Non-existent slug → 404 in the service.
export const teamsRoutes = new Elysia({ prefix: "/v1/teams" }).get(
  "/:slug",
  ({ params }) => getTeam(params.slug),
  { params: t.Object({ slug: t.String() }), detail: { summary: "Team detail: matches + form" } },
)
