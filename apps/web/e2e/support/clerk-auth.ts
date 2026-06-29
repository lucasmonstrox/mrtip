import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright"
import type { Page } from "@playwright/test"

/**
 * Autenticação dos e2e via @clerk/testing. Single-tenant B2C: UM usuário de teste
 * (apostador) basta — não há papéis. Precisa de CLERK_E2E_EMAIL/PASSWORD + as chaves
 * Clerk no `.env.e2e`.
 */
type Creds = { identifier: string; password: string }

/** Credenciais do usuário de teste, ou null se não configuradas (→ specs dão skip). */
export function testCreds(): Creds | null {
  const identifier = process.env.CLERK_E2E_EMAIL
  const password = process.env.CLERK_E2E_PASSWORD
  if (!identifier || !password) return null
  return { identifier, password }
}

/**
 * Autentica o browser no Clerk como o usuário de teste. Navega pro /sign-in (rota
 * pública que carrega o ClerkJS) ANTES de assinar — chamar signIn no meio do
 * redirect de uma rota protegida deixa a sessão sem "pegar". Use no beforeEach.
 */
export async function signIn(page: Page, creds: Creds): Promise<void> {
  await setupClerkTestingToken({ page })
  await page.goto("/sign-in")
  await clerk.loaded({ page })
  await clerk.signIn({
    page,
    signInParams: { strategy: "password", identifier: creds.identifier, password: creds.password },
  })
}

export async function signOut(page: Page): Promise<void> {
  await clerk.signOut({ page })
}
