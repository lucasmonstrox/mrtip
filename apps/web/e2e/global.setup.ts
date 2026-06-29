import { clerkSetup } from "@clerk/testing/playwright"

/**
 * Global setup do Clerk testing: busca um Testing Token via Backend API
 * (CLERK_SECRET_KEY) e injeta no ambiente pros testes bypassarem a proteção
 * anti-bot do Clerk em headless.
 *
 * Sem as chaves no `.env.e2e`, apenas avisa e segue — assim `playwright test --list`
 * e a edição dos specs funcionam sem segredos. Os specs que dependem de login dão
 * skip quando faltam credenciais (ver e2e/support/clerk-auth.ts).
 */
export default async function globalSetup() {
  const publishableKey =
    process.env.CLERK_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY
  if (!publishableKey || !secretKey) {
    console.warn(
      "[global.setup] CLERK_PUBLISHABLE_KEY/CLERK_SECRET_KEY ausentes — pulando clerkSetup(). " +
        "O login Clerk real precisa das chaves + usuário de teste no .env.e2e.",
    )
    return
  }
  await clerkSetup({ publishableKey, secretKey })
}
