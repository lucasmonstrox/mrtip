# E2E (apps/web) — Clerk + Playwright

Primeiro runner de testes do repo. Autenticação via [`@clerk/testing`](https://clerk.com/docs/guides/development/testing/playwright/overview).

## Rodar

```bash
# 1) chaves Clerk + usuário de teste num .env.e2e (NÃO commitar):
#    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
#    CLERK_PUBLISHABLE_KEY=pk_test_...
#    CLERK_SECRET_KEY=sk_test_...
#    CLERK_E2E_EMAIL=voce+clerk_test@example.com   # subaddress +clerk_test
#    CLERK_E2E_PASSWORD=...                          # código fixo de verificação: 424242

# 2) carregar o env e rodar
set -a; . ./.env.e2e; set +a
bun run test:e2e
```

Sem chaves: `bun run test:e2e:list` e o teste de "visitante → /sign-in" rodam; o teste de
login autenticado dá **skip** (ver `support/clerk-auth.ts`).

## Notas

- Use **chaves de instância de desenvolvimento** (`pk_test_*` / `sk_test_*`).
- Usuários de teste: e-mail com subaddress `+clerk_test`; código de verificação fixo `424242`
  (sem OTP real). Limites de mensagens do Clerk não se aplicam a esses.
- `global.setup.ts` chama `clerkSetup()` (Testing Token, bypass de bot detection).
- Não usar `--disable-web-security` no Chrome (remove o `Origin` e quebra a config do Clerk).
