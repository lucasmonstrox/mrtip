import { expect, test, type Page } from "@playwright/test"

import { signIn, testCreds } from "./support/clerk-auth"

/**
 * Aba Rodadas: a rodada escolhida mora em `?round=` e por isso sobrevive à troca de aba e ao
 * refresh (LIG-015, cenários T2 e T3 do dossiê). Toda rota fora de /sign-in|/sign-up é protegida
 * pelo proxy.ts, então estes testes PRECISAM das chaves Clerk + usuário de teste no .env.e2e —
 * sem elas dão skip, igual ao auth.spec.
 */

/** Número mostrado no título do card ("Rodada 20" → "20"). */
async function shownRound(page: Page): Promise<string> {
  const title = await page
    .getByRole("tabpanel")
    .getByText(/^Rodada \d+$/)
    .first()
    .textContent()
  return (title ?? "").replace("Rodada", "").trim()
}

/** Abre a primeira liga da lista na aba Rodadas; devolve a URL da liga (sem query string). */
async function openFirstLeagueRounds(page: Page): Promise<string> {
  await page.goto("/leagues")
  await page.locator('a[href^="/leagues/"]').first().click()
  await page.getByRole("tab", { name: "Rodadas" }).click()
  await expect(page.getByRole("tabpanel").getByText(/^Rodada \d+$/).first()).toBeVisible()
  return new URL(page.url()).pathname
}

test.describe("aba Rodadas — a escolha do usuário persiste", () => {
  test.beforeEach(async ({ page }) => {
    const creds = testCreds()
    test.skip(!creds, "defina CLERK_E2E_EMAIL/PASSWORD + chaves Clerk no .env.e2e")
    await signIn(page, creds!)
  })

  test("T2 · a rodada escolhida sobrevive à troca de aba", async ({ page }) => {
    await openFirstLeagueRounds(page)
    const initial = await shownRound(page)

    // Escolhe uma rodada DIFERENTE do default — é a troca que precisa sobreviver.
    const select = page.getByRole("tabpanel").getByRole("combobox")
    await select.click()
    const other = page.getByRole("option").filter({ hasNotText: new RegExp(`^${initial}$`) }).first()
    const chosen = ((await other.textContent()) ?? "").trim()
    await other.click()

    await expect(page).toHaveURL(new RegExp(`[?&]round=${chosen}\\b`))
    expect(await shownRound(page)).toBe(chosen)

    // Ida e volta pela aba Classificação: o Radix desmonta o painel, então isto é o teste real.
    await page.getByRole("tab", { name: "Classificação" }).click()
    await page.getByRole("tab", { name: "Rodadas" }).click()

    expect(await shownRound(page)).toBe(chosen)
  })

  test("T3 · a rodada escolhida sobrevive ao refresh", async ({ page }) => {
    const path = await openFirstLeagueRounds(page)
    const initial = await shownRound(page)

    const select = page.getByRole("tabpanel").getByRole("combobox")
    await select.click()
    const other = page.getByRole("option").filter({ hasNotText: new RegExp(`^${initial}$`) }).first()
    const chosen = ((await other.textContent()) ?? "").trim()
    await other.click()

    // Reabre a URL do zero (com ?round=) — prova que a origem da verdade é a query string.
    await page.goto(`${path}?round=${chosen}`)
    await page.getByRole("tab", { name: "Rodadas" }).click()

    expect(await shownRound(page)).toBe(chosen)
  })
})
