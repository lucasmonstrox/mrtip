import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

// Rotas públicas: as telas de auth. Todo o resto exige sessão Clerk.
const isPublic = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

/**
 * Proxy (convenção Next 16, substitui `middleware.ts`) — gate de rota por sessão
 * Clerk. Defesa server-side antes de qualquer página montar:
 *
 *   • já autenticado tentando ver /sign-in|/sign-up → app ("/");
 *   • rota pública (telas de auth) → passa sem exigir sessão;
 *   • resto sem sessão → /sign-in.
 *
 * `clerkMiddleware` devolve um NextMiddleware; o Next 16 aceita exportá-lo como
 * `proxy` (named export). Retornar nada (undefined) deixa o Clerk seguir o fluxo
 * normal preservando os headers de auth dele — por isso só devolvemos Response nos
 * desvios (redirects).
 */
export const proxy = clerkMiddleware(async (auth, request) => {
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
