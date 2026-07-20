import { Elysia } from "elysia"
import { StatusCodes } from "http-status-codes"

import { env } from "../env"
import { verifier } from "./verifier"

// Public surface: healthcheck + the OpenAPI docs. Everything else requires a valid
// Clerk session (the whole product sits behind login, so the API is gated uniformly
// instead of route-by-route).
const PUBLIC_PREFIXES = ["/health", "/openapi"]

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function bearer(authorization?: string): string | null {
  if (!authorization?.startsWith("Bearer ")) return null
  return authorization.slice("Bearer ".length).trim() || null
}

/**
 * Global auth guard: rejects any request without a valid Clerk session token before
 * it reaches a handler (so unauthenticated calls never touch the DB). `as: "global"`
 * lifts the hook to the whole app, covering every route module mounted after it.
 *
 * Dev escape hatch, FAIL-CLOSED: with no `CLERK_SECRET_KEY`, the guard only lets requests
 * through when running under Bun (local dev). In the deployed Worker a missing key is a
 * misconfiguration, not a shortcut — it answers 503 instead of serving data unauthenticated.
 * Já aconteceu: um deploy sem o secret deixou a API inteira aberta em produção, e o guard
 * não deu um pio. Ausência de configuração tem que falhar barulhento, não abrir a porta.
 */
const isWorkerd = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers"
export const authGuard = new Elysia({ name: "auth-guard" }).onBeforeHandle(
  { as: "global" },
  async ({ request, headers, status }) => {
    const { pathname } = new URL(request.url)
    if (isPublic(pathname)) return
    if (!env.clerk.secretKey) {
      // No workerd (deployado) isso é erro de configuração — recusa em vez de liberar.
      if (isWorkerd) return status(StatusCodes.SERVICE_UNAVAILABLE, { error: "auth_not_configured" })
      return // dev local sob Bun — avisado no boot (index.ts)
    }

    const token = bearer(headers.authorization)
    if (!token) return status(StatusCodes.UNAUTHORIZED, { error: "no_token" })
    try {
      await verifier.verify(token)
    } catch {
      return status(StatusCodes.UNAUTHORIZED, { error: "invalid_token" })
    }
  },
)
