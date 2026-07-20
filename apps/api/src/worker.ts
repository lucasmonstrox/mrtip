/**
 * Entry de Cloudflare Workers. O Elysia expõe um handler `fetch` compatível com o workerd —
 * este arquivo é só o adaptador. O servidor Bun vive em index.ts; este nunca roda sob Bun.
 *
 * O acesso a dados sai pelo @neondatabase/serverless (db/client detecta o workerd e troca de
 * driver) — o DATABASE_URL vem de `wrangler secret put DATABASE_URL` e aponta pro Neon, no
 * endpoint POOLER. O endpoint direto fica pros scripts de sync e migrações, que rodam sob Bun.
 */

/** Env do workerd: vars (strings) definidas no wrangler.jsonc. */
type WorkerEnv = Record<string, unknown>

let application: { fetch: (req: Request) => Promise<Response> | Response } | undefined

export default {
  async fetch(request: Request, env: WorkerEnv) {
    // workerd entrega as vars via `env`, não via process.env — propaga as strings
    // (ex.: WEB_ORIGIN p/ o CORS) antes do app ser avaliado.
    for (const [k, v] of Object.entries(env)) {
      if (typeof v === "string" && process.env[k] === undefined) process.env[k] = v
    }
    // Import preguiçoso: avaliar os schemas no top-level estoura o limite de CPU
    // de startup do deploy (workerd). Carrega o app na 1ª request, cacheado por isolate.
    application ??= (await import("./app")).app
    return application.fetch(request)
  },
}
