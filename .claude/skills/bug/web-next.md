# Debugging de Next.js 16 + React 19 + Turbopack (apps/web)

Apoio do `/bug` — carregue só quando a triagem apontar log sumido, cache ou HMR fantasma. Hydration mismatch: ver `devtools.md`.

## Log "sumiu" — dois mundos

Código com `use client` loga no console do BROWSER; Server Component/Action/route handler loga no TERMINAL do `next dev`. Pra unificar durante a caça: `experimental: { browserDebugInfoInTerminal: { showSourceLocation: true } }` em `apps/web/next.config.mjs` (só dev; remova depois).

## Erro com `digest: '...'`

É erro de SERVIDOR ofuscado — o browser NUNCA terá a causa: grep o digest no log do terminal do next dev. Server Action que só devolve digest sem log server-side (vercel/next.js#60684): instrumente `try { ... } catch (e) { console.error('ACTION', e, (e as any).digest); throw e }`.

## Server Action "não dispara" — olhe o Network, não o código

Server Action é um POST com header `Next-Action`. `list_network_requests` filtrando POST e trifurque: POST ausente = bug client-side antes do submit (console do browser); 404/405 = action id stale (HMR/deploy trocou o hash — restart limpa); 200 com erro no body = bug DENTRO da action (terminal/digest).

## Fronteira `use client`

"Functions cannot be passed directly to Client Components" (ou Date/class/Map sumindo de prop): ache a FRONTEIRA — props passando de arquivo sem `use client` pra arquivo com. Suspeito invisível: Server Action inline serializa as variáveis capturadas na CLOSURE; parametrize com `action.bind(null, id)` em vez de arrow que captura.

## Dado velho/stale — enumere os caches

1. `rg '"use cache"' apps/web` no fluxo da rota — comente e re-rode: sumiu = bug de invalidação, não de query.
2. Mutação que não reflete na hora: read-your-writes pede `updateTag(tag)` na Server Action, não `revalidateTag` (que no Next 16 exige 2º arg de profile).
3. Persiste só na navegação client-side = Router Cache: hard reload (Ctrl+Shift+R) diferencia.

Cada camada descartada é uma hipótese refutada de graça.

## `rm -rf .next` resolveu? Não encerre aí

Sintoma impossível (erro aponta código que não existe mais, CSS corrigido segue quebrado) → `Remove-Item -Recurse -Force apps/web/.next`. Resolveu = cache persistente do Turbopack (default no Next 16) segurando estado — confirme com `experimental: { turbopackFileSystemCacheForDev: false }` e classifique como dependência (issues abertas, ex. vercel/next.js#90563 — Tailwind v4 + monorepo, o stack deste repo).

## HMR fantasma ("edito e não muda")

A/B do bundler: 1 rodada de `next dev` SEM `--turbopack` e re-teste (restart entre os testes). Diferente = bug do Turbopack — busque a issue da combinação gatilho (import dinâmico com template string [#91768]; `use cache` + `React.lazy` [#85538]). Igual = bug do app. Em Windows, antes de tudo: exclua o repo do scan do Defender (`Add-MpPreference -ExclusionPath 'C:\Users\joaog\Workspace'` em PS admin) — causa oficial conhecida de Fast Refresh lento; é ambiente, não código.

## Erros/logs do lado servidor por MCP

Next 16 embute `/_next/mcp` no dev server: se o `next-devtools-mcp` estiver registrado na sessão, use as tools pra listar erros de build+runtime, logs e Server Actions registradas — chrome-devtools cobre o browser; este cobre o processo Next. Indisponível → diga e siga pelo terminal.
