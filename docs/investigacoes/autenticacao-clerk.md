# Autenticação com Clerk (Clerk + Clerk testing) — adicionar auth na aplicação

> Investigação — **não implementa**. Feature: [CORE-003](../features/core/CORE-003-autenticacao-clerk.md). Tier: tema amplo (integração focada). As-of: 2026-06-29.

## TL;DR + recomendação cravada

Adotar **Clerk para autenticação** no `apps/web` (Next.js 16, App Router) — o `@clerk/nextjs` 7.5.9 declara suporte a `next ^16` + React 19 ([npm](https://registry.npmjs.org/@clerk/nextjs/latest)), e o setup canônico (`<ClerkProvider>` + `middleware.ts` com `clerkMiddleware()` + env vars) é o caminho oficial. **Antes de construir em cima, rodar um spike de deploy**: existe um bug ABERTO de `clerkMiddleware()` não detectado **em produção** no OpenNext/Cloudflare ([issue #524](https://github.com/opennextjs/opennextjs-cloudflare/issues/524)) — funciona em `dev` e `preview`, quebra no deploy; foi reportado em versões antigas (OpenNext 0.6.5 / Next 15.2.4) e **não há confirmação de que persista ou esteja resolvido na linha 1.x** que o repo usa. **Billing fica FORA do Clerk**: Clerk Billing **não é suportado no Brasil** e **só fatura em USD** ([docs](https://clerk.com/docs/guides/billing/overview), verificado por fetch) — a assinatura BRL do mrtip precisa de gateway externo (PIX/boleto), em feature separada. A **auth da API Elysia** (workerd) deve ficar **adiada**: a API só serve dado público e o deploy dela está parado; quando precisar, usar `@clerk/backend` direto (compatível com Workers, networkless com `jwtKey`), não o plugin não-oficial `elysia-clerk`. Para **testes E2E**, `@clerk/testing` 2.1.7 + Playwright — o que também estabelece o primeiro test runner do repo.

## Contexto e problema

Pedido: "preciso de pôr autenticação com a Clerk; usar Clerk + Clerk testing". A decisão de **provider já está tomada** (Clerk) — logo isto **não é** comparação de providers, e sim investigação de *como integrar Clerk neste stack específico*.

**Brief — o que conta como respondido:** (1) `@clerk/nextjs` roda em Next 16 + OpenNext/Cloudflare? (2) como verificar sessão na API Elysia/workerd? (3) Clerk testing num repo sem test runner? (4) limites de free tier + billing? (5) requisitos implícitos do repo.

**Requisitos implícitos do repo (assumidos):** código/dados em inglês, UI em PT ([[codigo-em-ingles-ui-em-pt]]); dinheiro em centavos via porta única (CORE-001) — relevante quando billing entrar; fuso `America/Sao_Paulo`; gate **+18** e jogo responsável da Lei 14.790 (COMP-001); separação web×api do monorepo; "todo pick mostra o porquê + fontes" (não toca auth diretamente).

## Estado real no código

Auth é **greenfield** e era **decisão em aberto** — esta investigação a resolve para o eixo autenticação:

| Item | Estado | Âncora |
|---|---|---|
| Decisão de auth/pagamento | **em aberto** ("[A confirmar]") | `docs/visao-geral.md:133`, `:175` |
| Página de conta | **stub** ("Autenticação e pagamento entram numa leva futura") | `apps/web/app/(app)/conta/page.tsx` |
| Auth na API | **inexistente** — dados públicos, sem auth | `apps/api/src/env.ts:18`; `apps/api/src/app.ts` (só CORS+openapi+rotas de futebol) |
| Deploy da API | **PARADO** — workerd não roda Bun.SQL/Postgres; reativar exige D1/Hyperdrive | `apps/api/src/worker.ts:5-7` |
| Providers do web | sem `ClerkProvider` (Theme → ReactQuery → Tooltip → Toaster) | `apps/web/shared/providers.tsx` |
| `middleware.ts` | **não existe** | `apps/web/` (ausente) |
| Route group | `(app)` agrupa todas as telas logáveis (`/`, `/conta`, `/historico`, `/jogo`, `/alertas`) | `apps/web/app/(app)/layout.tsx` |
| Test runner | **inexistente** (CLAUDE.md: "ainda não há runner de testes") | `CLAUDE.md` |
| Gate +18 | exigido, ainda não implementado; auth é o ponto natural de ancoragem | `docs/features/conformidade/COMP-001-conformidade-jogo-responsavel.md` |

**Stack confirmado:** `next 16.2.6` + `react 19.2.4`, deploy via `@opennextjs/cloudflare ^1.19.11` (`apps/web/package.json`); `apps/web/wrangler.jsonc` com `nodejs_compat` + `global_fetch_strictly_public`, `compatibility_date 2026-06-18`. API: `elysia ^1.4.29` (`apps/api/package.json`), TypeBox (não zod) e `aot:false` por restrição do workerd ([[elysia-cloudflare-workers]]). Client Eden Treaty em `apps/web/shared/api/eden.ts`.

**Decisão de produto já cravada (não re-decidir):** modelo de negócio = **assinatura mensal BRL** + freemium leve (`docs/visao-geral.md:149-150`). Isso é o que colide com Clerk Billing (abaixo).

## Estado da arte / integração — claims atômicos

### Frente A — Clerk no web (Next 16 + OpenNext/Cloudflare)

- `@clerk/nextjs` atual **7.5.9**; peer `next ^15.2.8 || ^16.0.10 || ^16.1.0-0`, react 19 → **suporta Next 16**. `verificado-fetch`, as-of 2026-06-29. https://registry.npmjs.org/@clerk/nextjs/latest
- Setup canônico App Router: `<ClerkProvider>` no root layout, `middleware.ts` com `clerkMiddleware()`, env `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY`. `snippet`. https://clerk.com/docs/nextjs/getting-started/quickstart
- **RISCO LOAD-BEARING:** `clerkMiddleware()` não detectado **em produção** no OpenNext/Cloudflare → erro `auth() was called but Clerk can't detect usage of clerkMiddleware()`; ok em `dev` e `opennextjs-cloudflare preview`, quebra no deploy. Issue **ABERTA, sem fix documentado**. **Mas:** reportada em OpenNext **0.6.5** / Next **15.2.4** — o repo usa **1.19.11** (rewrite major). Não achei confirmação de que persista **nem** de que esteja corrigido na 1.x. `verificado-fetch` (estado da issue), as-of 2026-06-29. https://github.com/opennextjs/opennextjs-cloudflare/issues/524
- Troubleshooting oficial do OpenNext **não menciona** Clerk nem middleware → sem caminho de fix publicado. `verificado-fetch`. https://opennext.js.org/cloudflare/troubleshooting
- Requisito de runtime já satisfeito no repo: `nodejs_compat` + `compatibility_date` recente são obrigatórios pro `@opennextjs/cloudflare` e já estão no `wrangler.jsonc`. `lido-no-código` + https://opennext.js.org/cloudflare/get-started
- Env vars em produção na Cloudflare: chaves entram como secrets/vars do Worker (`wrangler secret put`), não só `.env`. `snippet`. https://clerk.com/docs/guides/development/deployment/production

### Frente B — Clerk na API Elysia (workerd)

- **Não há SDK oficial Clerk pra Elysia.** Caminho oficial: `@clerk/backend` (`createClerkClient().authenticateRequest()` ou `verifyToken()`). `verificado-fetch`. https://clerk.com/docs/guides/development/sdk-development/backend-only
- `@clerk/backend` (atual **3.8.4**) roda em **V8 isolates / Cloudflare Workers** via Web Crypto; `authenticateRequest()` aceita um `Request` Web-API padrão. `verificado-fetch`. https://clerk.com/docs/reference/backend/authenticate-request
- **Networkless** se passar `jwtKey` (PEM público do Dashboard) — sem ele, faz round-trip ao JWKS. Setar `CLERK_JWT_KEY` + `authorizedParties` (allowlist). `snippet`. https://clerk.com/docs/reference/backend/verify-token
- Plugin comunitário `elysia-clerk` (não-oficial, wobsoriano, npm 1.0.1, abr/2026) é **wrapper fino** sobre `@clerk/backend`; alvo primário é **Bun**, sem confirmação de testes em workerd; lê chaves de `process.env`. `verificado-fetch`. https://github.com/wobsoriano/elysia-clerk
- **Implicação:** auth da API não é necessária pro MVP (API serve só dado público e está com deploy parado). Quando precisar, usar `@clerk/backend` direto lendo chaves do `env` binding do Worker; evitar o plugin não-oficial na edge.

### Frente C — Clerk testing (repo sem test runner)

- `@clerk/testing` atual **2.1.7** (estável, 2026-06-25). Suporta Playwright e Cypress. `verificado-fetch` (npm). https://www.npmjs.com/package/@clerk/testing
- `clerkSetup()` (global setup, 1x) obtém o **Testing Token**; `setupClerkTestingToken({ page })` (por teste) injeta o token pra **bypassar bot detection/CAPTCHA** do Clerk em headless. `verificado-fetch`. https://clerk.com/docs/guides/development/testing/playwright/overview
- Usuários de teste: emails `+clerk_test` (ex: `jane+clerk_test@example.com`), phones `+1 (XXX) 555-01xx`, **código fixo `424242`** (sem OTP real). `verificado-fetch`. https://clerk.com/docs/guides/development/testing/test-emails-and-phones
- Pegadinhas: usar **setup project** do Playwright (não `globalSetup` function) pra env propagar aos workers; não usar `--disable-web-security` (remove `Origin` e quebra config do Clerk); instância **de desenvolvimento** com chaves `pk_test_*`/`sk_test_*`. `verificado-fetch`. (mesmas URLs)
- Token de sessão programático dura **~60s** — renovar por teste. `snippet`. https://clerk.com/docs/guides/development/testing/overview

### Frente D — Pricing + Billing

- **Free (Hobby): 50.000 MRU/app, $0**, sem cartão. Cobrança por **MRU** (Monthly Retained User — só conta quem volta 24h+ após signup), não MAU clássico. `verificado-fetch`, as-of 2026-06-29. https://clerk.com/pricing
- **Pro: $25/mo**; MFA, passkeys, remoção do branding "Secured by Clerk" e custom session só no Pro. Overage $0,02/MRU. `verificado-fetch`. https://clerk.com/pricing
- **BLOQUEADOR BR (verificado por fetch):** "Clerk Billing **is not supported in Brazil**, India, Malaysia, Mexico, Singapore, and Thailand" + "**supports only USD** as the billing currency" + "only uses **Stripe**". https://clerk.com/docs/guides/billing/overview
- `<PricingTable />` e gating por `has({ plan })`/`has({ feature })` existem (GA), mas dependem do Billing → **inúteis pro caso BRL**. `verificado-fetch`. https://clerk.com/docs/nextjs/guides/billing/for-b2c

## Opções e trade-offs

**Escopo do que adotar do Clerk:**

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| **Clerk só auth (web), billing externo** | desbloqueia login/cadastro já; free tier sobra (50k MRU); desacopla do bloqueio BR | precisa de 2º sistema pra cobrança + sync de entitlement | **RECOMENDADO** |
| Clerk auth + Clerk Billing | um fornecedor só, `has()` pronto | **inviável**: BR não suportado, só USD — não fatura BRL | **descartado** (ver Refutado) |
| Auth web + auth API agora | "completo" | esforço sem payoff: API serve dado público e está com deploy parado | adiar API |
| Construir auth próprio | zero vendor | reinventa MFA, sessões, segurança; contra a escolha do dono | fora de escopo |

**Recomendação:** Clerk = **camada de identidade** (auth) do web. Billing desacoplado (gateway BR, feature separada), com o **entitlement** (plano ativo) sincronizado de volta — via `publicMetadata`/`unsafeMetadata` no usuário Clerk ou tabela local alimentada por webhook do gateway. O gate `has()` do Clerk Billing **não** será a fonte de verdade do plano; quem manda é o gateway BR.

**O que o counter-review levantou** (verificação adversarial dos 2 claims que sustentam a recomendação): ambos confirmados na fonte viva — (1) issue #524 segue ABERTA e sem workaround no corpo da issue; (2) o bloqueio BR + USD-only do Billing está textual na doc oficial. O ponto que **sobrou em aberto** é se #524 ainda afeta a linha 1.x — vira risco declarado (spike), não bloqueio.

## Modelo de dados proposto

MVP de auth **não exige tabela local**: Clerk guarda o usuário. Quando entrar persistência por usuário (histórico de picks, assinatura), criar `users` local com `clerk_user_id` (string, unique) como chave de ligação, populada por **webhook** `user.created`/`user.updated` do Clerk ([[sportmonks-assinatura]] mostra o padrão de schema em inglês). Entitlement de plano vem do **gateway BR**, não do Clerk. Schema atual (`apps/api/src/db/schema.ts`) não tem nada de usuário — é migração nova, fora do MVP de auth.

## Plano por faceta

- **ui (MVP):** `bun add @clerk/nextjs` no `apps/web`; `<ClerkProvider>` no root layout (`apps/web/app/layout.tsx`, acima dos Providers); `middleware.ts` com `clerkMiddleware()` + matcher protegendo `(app)`; telas `/sign-in` e `/sign-up` (componentes Clerk); `/conta` troca o stub por `<UserButton>`/`<UserProfile>`; UI em PT (locale pt-BR). **Gate +18** (COMP-001): coletar data de nascimento (custom field) e checar na borda.
- **ui (de-risk, ANTES de tudo):** spike — subir um `clerkMiddleware()` mínimo via `opennextjs-cloudflare deploy` real (não só preview) nas versões do repo, e confirmar se #524 reproduz. Se reproduzir, abrir/seguir a issue e avaliar workaround (matcher, posição do middleware) antes de investir.
- **testing:** Playwright + `@clerk/testing` 2.1.7; setup project com `clerkSetup()`; `setupClerkTestingToken()` por teste; usuários `+clerk_test` + código `424242`; chaves `pk_test_*`/`sk_test_*` no CI. Primeiro runner do repo.
- **api (adiada):** quando a API ganhar rota protegida (e o deploy for desbloqueado p/ D1/Hyperdrive), `@clerk/backend` direto com `jwtKey` + `authorizedParties`, lendo chaves do `env` binding.
- **dados (adiada):** tabela `users` + webhook de sync quando houver persistência por usuário.

## Riscos e gotchas

- **#524 (alto):** `clerkMiddleware()` pode não ser detectado em produção no OpenNext/CF. Mitigar com spike de deploy antes de construir. Sem fix oficial publicado.
- **Billing BR (alto, de produto):** Clerk não fatura BRL nem opera no BR → arquitetura precisa de gateway externo desde o desenho; o `/conta` atual junta "autenticação **e** pagamento" — separar.
- **Free tier muda:** já mudou de 10k MAU → 50k MRU; reconferir limites antes de lançar.
- **Branding/MFA só no Pro:** "Secured by Clerk" e MFA exigem $25/mo — decisão de custo no go-live.
- **Edge/workerd:** `cookies()`/APIs Node-only em middleware podem não rodar em Workers; manter o middleware no padrão Clerk e não customizar com APIs Node.
- **Token programático de teste expira em ~60s:** renovar; preferir `storageState` do Playwright.

## Refutado

- ❌ **"Clerk faz auth + billing num fornecedor só pro mrtip."** Clerk Billing **não suporta o Brasil** e **só fatura USD** — verificado por fetch em https://clerk.com/docs/guides/billing/overview (as-of 2026-06-29). Para assinatura BRL, billing é necessariamente externo.
- ❌ **"`elysia-clerk` resolve a auth da API na edge."** É plugin não-oficial, alvo primário Bun, sem confirmação de testes em workerd, lê `process.env`. Caminho seguro = `@clerk/backend` direto. https://github.com/wobsoriano/elysia-clerk

## Perguntas abertas / lacunas

1. **#524 afeta OpenNext 1.19.11 + Next 16.2.6?** NEI — reportado só em 0.6.5/15.2.4; só um deploy real responde. (Gate da recomendação.)
2. **Gateway de billing BR** (Pagar.me / Asaas / Stripe-BR com PIX/boleto) — fora do escopo desta investigação; vira feature própria (sugiro `/rs billing-br`).
3. **Tiers/preços** da assinatura (`docs/visao-geral.md:220`, decisão do dono) — independe do Clerk.
4. **Organizações Clerk** pro lado tipster (Fase 2/3) — não investigado; reabrir quando o marketplace entrar no roadmap.
5. **Onde mora o gate +18** (signup Clerk vs. tela própria) — decisão de UX/COMP-001, não técnica de Clerk.

---

### Auditoria de citações

- [x] URLs vieram de tool result desta sessão (WebFetch/WebSearch/npm registry).
- [x] Spot-check: #524 (estado ABERTO) e bloqueio BR+USD do Billing reabertos por fetch direto.
- [x] Claims load-bearing (#524, billing BR, suporte Next 16) vieram de fetch, não de snippet.
- [x] Escopo: respeitei "provider já decidido" — sem comparação de providers.
- [x] Recuperado e não usado: memórias [[elysia-cloudflare-workers]], [[codigo-em-ingles-ui-em-pt]], [[sportmonks-assinatura]] citadas onde pertinentes.
- [x] Refutado + lacunas preenchidos.
- [x] Achados internos com âncora `path:linha` de leitura desta sessão.
- [x] Spot-check interno: `conta/page.tsx`, `env.ts:18`, `worker.ts:5-7` reabertos e batem.
- [x] Brief do §0 respondido (5/5 perguntas).
