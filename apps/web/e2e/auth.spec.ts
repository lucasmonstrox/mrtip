import { expect, test } from "@playwright/test"

import { signIn, testCreds } from "./support/clerk-auth"

/**
 * Gate de autenticação. O primeiro teste roda sem credenciais (só exercita o
 * proxy.ts); o segundo precisa das chaves Clerk + usuário de teste no .env.e2e e
 * dá skip quando ausentes.
 */
test.describe("auth gate", () => {
  test("visitante sem sessão é redirecionado pro /sign-in", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/sign-in/)
  })

  test("usuário autenticado entra no app", async ({ page }) => {
    const creds = testCreds()
    test.skip(!creds, "defina CLERK_E2E_EMAIL/PASSWORD + chaves Clerk no .env.e2e")

    await signIn(page, creds!)
    await page.goto("/")
    await expect(page).not.toHaveURL(/\/sign-in/)
  })
})
