import { SignIn } from "@clerk/nextjs"

/**
 * Tela de login. Catch-all `[[...sign-in]]` porque o Clerk roteia os subpassos
 * (verificação, fatores) sob o mesmo path. Centralizada, fora do shell do app.
 */
export default function SignInPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <SignIn />
    </main>
  )
}
