import { openapi } from "@elysiajs/openapi"
import { Elysia } from "elysia"

import { AppError } from "./lib/errors"
import { jogadoresRoutes } from "./modules/ligas/jogadores.routes"
import { ligasRoutes } from "./modules/ligas/ligas.routes"
import { partidasRoutes } from "./modules/ligas/partidas.routes"
import { tecnicosRoutes } from "./modules/ligas/tecnicos.routes"
import { timesRoutes } from "./modules/ligas/times.routes"
import { corsPlugin } from "./shared/plugins/cors"

/**
 * Root app da API do mrtip — dados de futebol (fonte: openfootball, CC0), persistidos em
 * Postgres. Este arquivo é só MONTAGEM: plugins → onError → /health → módulos. Sem lógica.
 * O onError global traduz AppError no contrato { error: code } (erro de domínio nunca vira 500).
 */
export const app = new Elysia()
  .use(corsPlugin)
  .use(openapi())
  .onError(({ error, set }) => {
    if (error instanceof AppError) {
      set.status = error.status
      return { error: error.code }
    }
  })
  .get("/health", () => ({ status: "ok" as const }), { detail: { summary: "Healthcheck" } })
  .use(ligasRoutes)
  .use(partidasRoutes)
  .use(timesRoutes)
  .use(jogadoresRoutes)
  .use(tecnicosRoutes)

export type App = typeof app
