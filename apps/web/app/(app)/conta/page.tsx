import { UserProfile } from "@clerk/nextjs"

/**
 * Conta: perfil do usuário (Clerk). A camada de assinatura (gate +18 + billing
 * BRL por gateway externo — Clerk Billing não opera no BR) entra em feature à
 * parte. `routing="hash"` mantém os subpassos do perfil neste mesmo path.
 */
export default function ContaPage() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Conta</h1>
        <p className="text-muted-foreground text-sm">
          Gerencie seu perfil, e-mail e segurança.
        </p>
      </div>
      <UserProfile routing="hash" />
    </div>
  )
}
