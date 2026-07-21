# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: rounds-tab.spec.ts >> aba Rodadas — a escolha do usuário persiste >> T2 · a rodada escolhida sobrevive à troca de aba
- Location: e2e\rounds-tab.spec.ts:38:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a[href^="/leagues/"]').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e7]:
          - heading "Entrar" [level=1] [ref=e8]
          - paragraph [ref=e9]: para continuar em mrtip
        - generic [ref=e10]:
          - button "Sign in with Google Continuar com Google" [ref=e13] [cursor=pointer]:
            - generic [ref=e14]:
              - generic "Sign in with Google" [ref=e16]
              - generic [ref=e17]: Continuar com Google
          - paragraph [ref=e20]: ou
          - generic [ref=e22]:
            - generic [ref=e23]:
              - generic [ref=e26]:
                - generic [ref=e28]: Seu e-mail
                - textbox "Seu e-mail" [ref=e29]:
                  - /placeholder: Digite o endereço de e-mail
              - generic:
                - generic:
                  - generic: Senha
                - generic:
                  - textbox:
                    - /placeholder: Digite sua senha
                  - button:
                    - img
            - button "Continuar" [ref=e32] [cursor=pointer]:
              - generic [ref=e33]:
                - text: Continuar
                - img [ref=e34]
      - generic [ref=e36]:
        - generic [ref=e37]:
          - generic [ref=e38]: Não possui uma conta?
          - link "Registre-se" [ref=e39] [cursor=pointer]:
            - /url: http://localhost:3211/sign-up#/?redirect_url=http%3A%2F%2Flocalhost%3A3211%2Fleagues
        - generic [ref=e41]:
          - generic [ref=e43]:
            - paragraph [ref=e44]: Secured by
            - link "Clerk logo" [ref=e45] [cursor=pointer]:
              - /url: https://go.clerk.com/components
              - img [ref=e46]
          - paragraph [ref=e51]: Development mode
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e57] [cursor=pointer]:
    - img [ref=e58]
  - alert [ref=e61]
```

# Test source

```ts
  1  | import { expect, test, type Page } from "@playwright/test"
  2  | 
  3  | import { signIn, testCreds } from "./support/clerk-auth"
  4  | 
  5  | /**
  6  |  * Aba Rodadas: a rodada escolhida mora em `?round=` e por isso sobrevive à troca de aba e ao
  7  |  * refresh (LIG-015, cenários T2 e T3 do dossiê). Toda rota fora de /sign-in|/sign-up é protegida
  8  |  * pelo middleware.ts, então estes testes PRECISAM das chaves Clerk + usuário de teste no .env.e2e —
  9  |  * sem elas dão skip, igual ao auth.spec.
  10 |  */
  11 | 
  12 | /** Número mostrado no título do card ("Rodada 20" → "20"). */
  13 | async function shownRound(page: Page): Promise<string> {
  14 |   const title = await page
  15 |     .getByRole("tabpanel")
  16 |     .getByText(/^Rodada \d+$/)
  17 |     .first()
  18 |     .textContent()
  19 |   return (title ?? "").replace("Rodada", "").trim()
  20 | }
  21 | 
  22 | /** Abre a primeira liga da lista na aba Rodadas; devolve a URL da liga (sem query string). */
  23 | async function openFirstLeagueRounds(page: Page): Promise<string> {
  24 |   await page.goto("/leagues")
> 25 |   await page.locator('a[href^="/leagues/"]').first().click()
     |                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  26 |   await page.getByRole("tab", { name: "Rodadas" }).click()
  27 |   await expect(page.getByRole("tabpanel").getByText(/^Rodada \d+$/).first()).toBeVisible()
  28 |   return new URL(page.url()).pathname
  29 | }
  30 | 
  31 | test.describe("aba Rodadas — a escolha do usuário persiste", () => {
  32 |   test.beforeEach(async ({ page }) => {
  33 |     const creds = testCreds()
  34 |     test.skip(!creds, "defina CLERK_E2E_EMAIL/PASSWORD + chaves Clerk no .env.e2e")
  35 |     await signIn(page, creds!)
  36 |   })
  37 | 
  38 |   test("T2 · a rodada escolhida sobrevive à troca de aba", async ({ page }) => {
  39 |     await openFirstLeagueRounds(page)
  40 |     const initial = await shownRound(page)
  41 | 
  42 |     // Escolhe uma rodada DIFERENTE do default — é a troca que precisa sobreviver.
  43 |     const select = page.getByRole("tabpanel").getByRole("combobox")
  44 |     await select.click()
  45 |     const other = page.getByRole("option").filter({ hasNotText: new RegExp(`^${initial}$`) }).first()
  46 |     const chosen = ((await other.textContent()) ?? "").trim()
  47 |     await other.click()
  48 | 
  49 |     await expect(page).toHaveURL(new RegExp(`[?&]round=${chosen}\\b`))
  50 |     expect(await shownRound(page)).toBe(chosen)
  51 | 
  52 |     // Ida e volta pela aba Classificação: o Radix desmonta o painel, então isto é o teste real.
  53 |     await page.getByRole("tab", { name: "Classificação" }).click()
  54 |     await page.getByRole("tab", { name: "Rodadas" }).click()
  55 | 
  56 |     expect(await shownRound(page)).toBe(chosen)
  57 |   })
  58 | 
  59 |   test("T3 · a rodada escolhida sobrevive ao refresh", async ({ page }) => {
  60 |     const path = await openFirstLeagueRounds(page)
  61 |     const initial = await shownRound(page)
  62 | 
  63 |     const select = page.getByRole("tabpanel").getByRole("combobox")
  64 |     await select.click()
  65 |     const other = page.getByRole("option").filter({ hasNotText: new RegExp(`^${initial}$`) }).first()
  66 |     const chosen = ((await other.textContent()) ?? "").trim()
  67 |     await other.click()
  68 | 
  69 |     // Reabre a URL do zero (com ?round=) — prova que a origem da verdade é a query string.
  70 |     await page.goto(`${path}?round=${chosen}`)
  71 |     await page.getByRole("tab", { name: "Rodadas" }).click()
  72 | 
  73 |     expect(await shownRound(page)).toBe(chosen)
  74 |   })
  75 | })
  76 | 
```