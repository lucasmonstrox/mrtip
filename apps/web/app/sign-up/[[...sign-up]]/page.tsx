import { SignUp } from "@clerk/nextjs"

/**
 * Tela de cadastro. Catch-all `[[...sign-up]]` porque o Clerk roteia os subpassos
 * (verificação de e-mail, etc.) sob o mesmo path. Fora do shell do app.
 */
export default function SignUpPage() {
  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <SignUp />
    </main>
  )
}
