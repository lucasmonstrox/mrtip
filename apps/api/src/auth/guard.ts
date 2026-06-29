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
 * Dev escape hatch: with no `CLERK_SECRET_KEY` set, the guard lets requests through
 * so local data work runs without an auth setup. In prod the key is always present,
 * so the gate is always on.
 */
export const authGuard = new Elysia({ name: "auth-guard" }).onBeforeHandle(
  { as: "global" },
  async ({ request, headers, status }) => {
    const { pathname } = new URL(request.url)
    if (isPublic(pathname)) return
    if (!env.clerk.secretKey) return // dev sem auth — avisado no boot (index.ts)

    const token = bearer(headers.authorization)
    if (!token) return status(StatusCodes.UNAUTHORIZED, { error: "no_token" })
    try {
      await verifier.verify(token)
    } catch {
      return status(StatusCodes.UNAUTHORIZED, { error: "invalid_token" })
    }
  },
)
