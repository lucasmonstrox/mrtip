---
id: CORE-003
titulo: Autenticação com Clerk (web + API)
modulo: core
status: em-andamento
prioridade: P1
facetas:
  ui: em-andamento # ClerkProvider, proxy.ts, route group protegido, /sign-in, /sign-up, /conta
  api: em-andamento # guard global Clerk na API Elysia (@clerk/backend) — /health e /openapi públicos
  dados: ideia # sync de usuário Clerk → tabela local (webhook) quando houver persistência por usuário
docs: [docs/investigacoes/autenticacao-clerk.md]
testada: parcial
testes: ["Web gate (proxy.ts) em dev: curl /, /conta, /jogo → 307 /sign-in?redirect_url=…; /sign-in → 200 (2026-06-29)", "API guard: curl 401 sem token / 200 /health (2026-06-29)", "typecheck verde web+api (2026-06-29)", "Playwright+@clerk/testing scaffold (test:e2e --list 2/2; login precisa de chaves)"]
depende_de: []
impacta: [COMP-001]
ancoras:
  settings: [clerk_publishable_key, clerk_secret_key, clerk_jwt_key, clerk_authorized_parties]
  tabelas: []
  tools: []
  funcoes: [authGuard, verifier, setApiAuthTokenGetter]
  rotas: [proxy.ts, /sign-in, /sign-up, /conta]
verificado_em: null
atualizado: 2026-06-29
---

# Autenticação com Clerk (web)

## Descrição

Autenticação de usuário (apostador) via **Clerk** no `apps/web` (Next.js 16, App Router) **e**
proteção da **API Elysia**. Web: login/cadastro (`/sign-in`, `/sign-up`), `proxy.ts` gateando tudo
exceto as telas de auth, `/conta` (perfil) e ancoragem do **gate +18** (COMP-001). API: **guard
global** (`auth/guard.ts` + `@clerk/backend`) exige token de sessão em toda rota menos `/health` e
`/openapi`; o token é injetado por request pelo `ApiAuthBridge` → fetcher do Eden. **Billing fica de
fora**: Clerk Billing **não suporta o Brasil** (só USD) — assinatura BRL vai por gateway externo, em
feature separada. Sync de usuário Clerk → tabela local (webhook) fica adiado até haver persistência
por usuário.

> Implementação espelhada do padrão Clerk do `grupoceralis/apps/crm` (mesmo stack: Next 16.2.6 +
> `proxy.ts`) e do `grupoceralis/apps/api` (verifier/guard `@clerk/backend`), adaptada pro B2C do
> mrtip: **sem** tabela de operador, papéis, escopo ou fluxo de convite; a API é gateada
> **uniformemente** (guard global) em vez do macro por-rota do CRM.

## Tarefas

- [x] ui — `@clerk/nextjs`: `<ClerkProvider localization={ptBR}>` no root layout, `proxy.ts` com `clerkMiddleware()`; telas `/sign-in` e `/sign-up`; `/conta` com `<UserProfile>`; `user-menu` ligado ao `useUser`/`signOut`.
- [x] api — guard global Clerk (`auth/guard.ts` + `auth/verifier.ts` via `@clerk/backend`, networkless com `jwtKey`); `env.clerk`; `/health` e `/openapi` públicos. Verificado: 401 sem token, 200 no `/health`.
- [x] ui — `ApiAuthBridge` + fetcher do Eden injetam `Authorization: Bearer` em cada request.
- [x] ui — testing: Playwright + `@clerk/testing` (config, `global.setup.ts`, `support/clerk-auth.ts`, `auth.spec.ts`, `e2e/README.md`) — primeiro runner do repo.
- [ ] ui — **spike de deploy** (OpenNext 1.19.11 + Next 16.2.6 + clerk 7.5.9) pra confirmar a detecção do `proxy`/middleware em produção na Cloudflare (issue #524, reportado em versões antigas).
- [ ] ui — **gate +18** (COMP-001): coletar data de nascimento e checar na borda (ainda não feito).
- [ ] ops — criar instância Clerk e setar env: web (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`), API (`CLERK_SECRET_KEY`, `CLERK_JWT_KEY`, `CLERK_AUTHORIZED_PARTIES`).
- [ ] dados — (adiada) tabela `users` + webhook de sync quando houver persistência por usuário.

## Recomendação (investigado, 2026-06-29)

Adotar Clerk **só para autenticação** (web). Gate de risco: rodar um **spike de deploy** antes de
construir em cima — há bug aberto de detecção do `clerkMiddleware()` em produção no OpenNext/Cloudflare
(issue #524, reportado em versões antigas, não confirmado na linha 1.x). **Desacoplar billing**: Clerk
Billing é bloqueado no BR + só USD → assinatura BRL por gateway externo (feature à parte). Auth da API
Elysia adiada (API só serve dado público e o deploy dela está parado). Detalhes:
[docs/investigacoes/autenticacao-clerk.md](../../investigacoes/autenticacao-clerk.md).

## Evidências

- [web] https://github.com/opennextjs/opennextjs-cloudflare/issues/524 — bug ABERTO: `clerkMiddleware()` não detectado em produção no OpenNext/CF (ok em dev/preview); reportado em opennext 0.6.5 / Next 15.2.4, sem fix documentado.
- [web] https://clerk.com/docs/guides/billing/overview — "Clerk Billing is not supported in Brazil…" + "supports only USD" → billing BR fica fora do Clerk.
- [web] https://registry.npmjs.org/@clerk/nextjs/latest — `@clerk/nextjs` 7.5.9 declara peer `next ^16` + react 19 → suporta o stack atual.
- [web] https://clerk.com/docs/guides/development/sdk-development/backend-only — `@clerk/backend` roda em V8 isolates (Workers), networkless com `jwtKey` → caminho da auth da API quando precisar.
- [web] https://clerk.com/docs/guides/development/testing/playwright/overview — `@clerk/testing` + Playwright (`clerkSetup`/`setupClerkTestingToken`, bypass de bot detection).
- [código] apps/web/app/(app)/conta/page.tsx — stub atual ("Autenticação e pagamento entram numa leva futura").
