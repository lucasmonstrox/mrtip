import { expect, test } from "@playwright/test"

import { signIn, testCreds } from "./support/clerk-auth"

/**
 * Link do X no header da página do time (SIN-022): tem que abrir o perfil do clube em aba externa,
 * e tem que SUMIR pra time sem handle — o caso null é o que quebraria o header se fosse mal tratado.
 * Precisa das chaves Clerk + usuário de teste no .env.e2e, igual aos outros specs; sem isso dá skip.
 */
test.describe("página do time — link do X", () => {
  test.beforeEach(async ({ page }) => {
    const creds = testCreds()
    test.skip(!creds, "defina CLERK_E2E_EMAIL/PASSWORD + chaves Clerk no .env.e2e")
    await signIn(page, creds!)
  })

  test("clube do Brasileirão mostra o handle e aponta pro x.com em aba nova", async ({ page }) => {
    await page.goto("/teams/flamengo")

    const link = page.getByRole("link", { name: /@Flamengo/ })
    await expect(link).toBeVisible()
    await expect(link).toHaveAttribute("href", "https://x.com/Flamengo")
    await expect(link).toHaveAttribute("target", "_blank")
    // Sem noopener a aba aberta ganha window.opener e pode navegar a nossa por trás.
    await expect(link).toHaveAttribute("rel", /noopener/)

    await page.screenshot({ path: "e2e-out/team-twitter-flamengo.png" })
  })

  test("Bragantino usa o handle do rebrand Red Bull, não a conta órfã", async ({ page }) => {
    await page.goto("/teams/bragantino")
    await expect(page.getByRole("link", { name: /@RedBullBraga/ })).toHaveAttribute(
      "href",
      "https://x.com/RedBullBraga",
    )
  })

  test("time sem handle não renderiza link nenhum pro x.com", async ({ page }) => {
    await page.goto("/teams/arsenal")
    await expect(page.getByRole("heading", { name: "Arsenal" })).toBeVisible()
    await expect(page.locator('a[href*="x.com"]')).toHaveCount(0)
  })
})
