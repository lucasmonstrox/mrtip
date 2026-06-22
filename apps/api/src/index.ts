import { cors } from "@elysiajs/cors"
import { openapi } from "@elysiajs/openapi"
import { Elysia } from "elysia"

import { ligas } from "./modules/ligas/controller"

/** API do mrtip — dados de futebol (fonte: openfootball, CC0). */
const app = new Elysia()
  .use(cors())
  .use(openapi())
  .get("/health", () => ({ status: "ok" as const }), {
    detail: { summary: "Healthcheck" },
  })
  .use(ligas)
  .listen(3001)

const port = app.server?.port
// eslint-disable-next-line no-console
console.log(`🦊 mrtip API em http://localhost:${port} — doc em /openapi`)

export type App = typeof app

// Tipos de domínio reaproveitados pelo apps/web (contrato único, sem duplicação).
export type { Liga, LinhaClassificacao, Partida, Round } from "./modules/ligas/model"
