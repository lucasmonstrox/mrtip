---
id: CORE-003
titulo: Autenticação com Clerk (web)
modulo: core
status: investigado
prioridade: P1
facetas:
  ui: investigado # ClerkProvider, middleware, route group protegido, /conta, gate +18
  api: ideia # verificação de sessão na API Elysia (workerd) — adiada até API ter rota protegida
  dados: ideia # sync de usuário Clerk → tabela local (webhook) quando houver persistência por usuário
docs: [docs/investigacoes/autenticacao-clerk.md]
testada: nao
testes: []
depende_de: []
impacta: [COMP-001]
ancoras:
  settings: [clerk_publishable_key, clerk_secret_key, clerk_jwt_key]
  tabelas: []
  tools: []
  funcoes: []
  rotas: [middleware.ts, /conta]
verificado_em: null
atualizado: 2026-06-29
---

# Autenticação com Clerk (web)

## Descrição

Adicionar autenticação de usuário (apostador) via **Clerk** no `apps/web` (Next.js 16, App Router),
deployado por OpenNext na Cloudflare. Cobre login/cadastro, proteção do route group `(app)`,
página `/conta` (perfil) e o ponto de ancoragem do **gate +18** (COMP-001). **Billing fica de fora**
desta feature: Clerk Billing **não suporta o Brasil** (só USD) — assinatura BRL vai por gateway
externo, em feature separada. Auth da **API Elysia** (workerd) e sync de usuário ficam adiados até
existir endpoint protegido / persistência por usuário.

## Tarefas

- [ ] ui — `@clerk/nextjs`: `<ClerkProvider>` no root layout, `middleware.ts` com `clerkMiddleware()`, env vars; proteger `(app)`; `/conta` com `<UserButton>`/`<UserProfile>`.
- [ ] ui — **spike de deploy** (OpenNext 1.19.11 + Next 16.2.6 + clerk 7.5.9) pra de-riscar a detecção do middleware em produção na Cloudflare (issue #524).
- [ ] ui — testing: adotar Playwright + `@clerk/testing` (primeiro runner de teste do repo); token de teste + usuários `+clerk_test`.
- [ ] api — (adiada) verificar sessão com `@clerk/backend` direto quando a API tiver rota protegida.

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
