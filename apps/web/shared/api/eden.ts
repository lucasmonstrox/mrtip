import { treaty } from "@elysiajs/eden"

import type { App } from "@workspace/api"

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://mrtip-api.joao-galiano-silva.workers.dev"
    : "http://localhost:3001")

/**
 * Getter do token de sessão (Clerk) registrado pelo app host — ver
 * `setApiAuthTokenGetter` (chamado pelo ApiAuthBridge dentro do ClerkProvider).
 * Com ele, todo request sai com `Authorization: Bearer <token>`; sem ele (dev sem
 * auth), nada muda.
 */
let getAuthToken: (() => Promise<string | null>) | null = null

/** Registra como obter o token de sessão Clerk (getToken() do useAuth). */
export function setApiAuthTokenGetter(fn: () => Promise<string | null>) {
  getAuthToken = fn
}

/**
 * Client type-safe da API do mrtip (Eden Treaty). Os tipos vêm direto do
 * `App` exportado em `apps/api` — sem duplicação de contrato. O `fetcher` injeta
 * o Bearer da sessão Clerk em cada request (a API gateia tudo menos /health).
 */
export const api = treaty<App>(baseUrl, {
  // cast: o tipo de `fetcher` pede o fetch do Bun (com .preconnect), ausente no
  // fetch do navegador — em runtime só a chamada importa.
  fetcher: (async (input, init) => {
    const token = getAuthToken ? await getAuthToken().catch(() => null) : null
    if (!token) return fetch(input, init)
    const headers = new Headers(init?.headers)
    headers.set("Authorization", `Bearer ${token}`)
    return fetch(input, { ...init, headers })
  }) as typeof fetch,
})
