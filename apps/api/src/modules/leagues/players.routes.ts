import { Elysia, t } from "elysia"

import { getPlayer } from "./get-player/get-player.service"

const paramId = t.Object({ id: t.String({ format: "uuid", error: "invalid_id" }) })

// Player routes (same feature/data as leagues, own namespace for the player page).
export const playersRoutes = new Elysia({ prefix: "/v1/players" }).get(
  "/:id",
  ({ params, query }) => getPlayer(params.id, query.season),
  {
    params: paramId,
    query: t.Object({ season: t.Optional(t.Integer()) }), // @feature LIG-008 default current
    detail: { summary: "Player detail: totals + goals; ?season=<id> picks a season" },
  },
)
