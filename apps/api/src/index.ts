import { cors } from "@elysiajs/cors"
import { openapi } from "@elysiajs/openapi"
import { Elysia } from "elysia"
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker"

import { ligas } from "./modules/ligas/controller"

// No workerd usa o adapter oficial (Elysia ≥1.4.7) com aot:false (modo dinâmico).
// (aot:true quebrou todas as rotas com 500 no workerd.) Os schemas de RESPONSE
// foram tirados das rotas pra o compile da 1ª request ser trivial — sem isso, o
// modo dinâmico compilava validators pesados na 1ª request do isolate frio e
// estourava o CPU (erro 1101 de cold start). No Bun, adapter padrão.
const isWorkerd = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers"

// CORS: se WEB_ORIGIN estiver definido (produção, via wrangler vars), restringe a ele;
// senão libera (dev local). Dados são públicos (openfootball), sem auth.
const webOrigin = process.env.WEB_ORIGIN

/** Root app da API do mrtip — dados de futebol (fonte: openfootball, CC0). */
export const app = new Elysia(isWorkerd ? { adapter: CloudflareAdapter, aot: false } : {})
  .use(cors(webOrigin ? { origin: webOrigin } : {}))
  .use(openapi())
  .get("/health", () => ({ status: "ok" as const }), {
    detail: { summary: "Healthcheck" },
  })
  .use(ligas)

// Só sobe o servidor Bun quando executado direto (não ao ser importado pelo worker/Eden).
if (import.meta.main) {
  app.listen(Number(process.env.PORT ?? 3001))
  console.log(`🦊 mrtip API em http://localhost:${app.server?.port} — doc em /openapi`)
}

export type App = typeof app

// Tipos de domínio reaproveitados pelo apps/web (contrato único, sem duplicação).
export type { Liga, LinhaClassificacao, Partida, Round } from "./modules/ligas/model"
