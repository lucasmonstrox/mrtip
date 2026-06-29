import { openapi } from "@elysiajs/openapi"
import { Elysia } from "elysia"

import { authGuard } from "./auth/guard"
import { AppError } from "./lib/errors"
import { coachesRoutes } from "./modules/leagues/coaches.routes"
import { leaguesRoutes } from "./modules/leagues/leagues.routes"
import { matchesRoutes } from "./modules/leagues/matches.routes"
import { playersRoutes } from "./modules/leagues/players.routes"
import { teamsRoutes } from "./modules/leagues/teams.routes"
import { corsPlugin } from "./shared/plugins/cors"

/**
 * Root app of the mrtip API — football data (source: openfootball, CC0), persisted in
 * Postgres. This file is just ASSEMBLY: plugins → auth guard → onError → /health → modules.
 * No logic. `authGuard` (global) gates every route except /health and /openapi behind a
 * valid Clerk session. The global onError translates AppError into the contract
 * { error: code } (a domain error never becomes a 500).
 */
export const app = new Elysia()
  .use(corsPlugin)
  .use(openapi())
  .use(authGuard)
  .onError(({ error, set }) => {
    if (error instanceof AppError) {
      set.status = error.status
      return { error: error.code }
    }
  })
  .get("/health", () => ({ status: "ok" as const }), { detail: { summary: "Healthcheck" } })
  .use(leaguesRoutes)
  .use(matchesRoutes)
  .use(teamsRoutes)
  .use(playersRoutes)
  .use(coachesRoutes)

export type App = typeof app
