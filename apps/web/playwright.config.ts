import { defineConfig, devices } from "@playwright/test"

/**
 * E2E do apps/web — autenticação via Clerk (@clerk/testing).
 *
 *  • Chrome headless; o `next dev` sobe em porta dedicada (3211) pra não colidir
 *    com o dev manual (3000).
 *  • global.setup.ts chama clerkSetup() (busca o Testing Token p/ bypassar a
 *    proteção anti-bot do Clerk em headless).
 *  • clerk-auth.ts (signIn) precisa das chaves Clerk + um usuário de teste no
 *    `.env.e2e` pra rodar de verdade — sem isso, os specs de login dão skip.
 *
 * Primeiro runner de testes do repo. Carregue o env antes de rodar, ex.:
 *   `set -a; . ./.env.e2e; set +a; bun run test:e2e`
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"]],
  globalSetup: "./e2e/global.setup.ts",
  use: {
    baseURL: "http://localhost:3211",
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "bunx next dev --port 3211",
    url: "http://localhost:3211",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
