import { env } from "../env"

// Identity seam: the API depends on this contract, not on Clerk directly — so the
// verification backend can be swapped later without touching the guard/handlers.
export type TokenVerifier = {
  verify(token: string): Promise<{ userId: string }>
}

// Verifies a real Clerk session token. Networkless when `jwtKey` (the instance PEM
// public key) is set; otherwise `@clerk/backend` fetches the JWKS once. Lazy import
// keeps the module out of the workerd startup-CPU budget (same trick as worker.ts).
const clerkVerifier: TokenVerifier = {
  async verify(token) {
    const { verifyToken } = await import("@clerk/backend")
    const res = await verifyToken(token, {
      secretKey: env.clerk.secretKey,
      jwtKey: env.clerk.jwtKey,
      authorizedParties: env.clerk.authorizedParties,
    })
    if (!res.sub) throw new Error("token without sub")
    return { userId: res.sub }
  },
}

export const verifier: TokenVerifier = clerkVerifier
