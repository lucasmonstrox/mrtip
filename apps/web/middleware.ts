import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Rotas públicas: as telas de auth. Todo o resto exige sessão Clerk.
const isPublic = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

/**
 * Gate de rota por sessão Clerk — defesa server-side antes de qualquer página montar:
 *
 *   • já autenticado tentando ver /sign-in|/sign-up → app ("/");
 *   • rota pública (telas de auth) → passa sem exigir sessão;
 *   • resto sem sessão → /sign-in.
 *
 * USA `middleware.ts` (runtime Edge) em vez do `proxy.ts` do Next 16: o `proxy` roda SEMPRE em
 * Node.js ("Proxy always runs on Node.js runtime" — e ele recusa `runtime: "edge"` no config),
 * e o OpenNext/Cloudflare não suporta Node middleware (patcha o `loadNodeMiddleware` do Next pra
 * não carregar). O clerkMiddleware roda em Edge sem problema. Mesmo padrão do grupoceralis/apps/crm.
 *
 * Retornar nada (undefined) deixa o Clerk seguir o fluxo normal preservando os headers de auth
 * dele — por isso só devolvemos Response nos desvios (redirects).
 */
export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const { pathname } = request.nextUrl

  if (userId && isPublic(request)) {
    return NextResponse.redirect(new URL("/", request.url))
  }
  if (isPublic(request)) return
  if (!userId) {
    const signIn = new URL("/sign-in", request.url)
    signIn.searchParams.set("redirect_url", pathname)
    return NextResponse.redirect(signIn)
  }
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
