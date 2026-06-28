import { Elysia, t } from "elysia"

import { getCoach } from "./get-coach/get-coach.service"

const paramId = t.Object({ id: t.String({ format: "uuid", error: "invalid_id" }) })

// Coach routes (same feature/data as leagues, own namespace for the coach page).
export const coachesRoutes = new Elysia({ prefix: "/v1/coaches" }).get(
  "/:id",
  ({ params }) => getCoach(params.id),
  { params: paramId, detail: { summary: "Coach detail: matches managed" } },
)
