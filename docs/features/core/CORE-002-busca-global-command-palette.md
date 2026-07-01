---
id: CORE-002
titulo: Busca global (command palette ⌘K)
modulo: core
status: verificado
prioridade: P2
facetas:
  dados: feito # pg_trgm + unaccent + função IMMUTABLE + índices GIN trigram nos nomes (migração 0020)
  api: feito # GET /v1/search — busca fuzzy multi-entidade ranqueada por similaridade, top-N por grupo
  ui: feito # command palette ⌘K: input server-side com debounce, resultados agrupados por entidade
testada: sim
testes:
  - "E2E Chrome (2026-06-29): abre por clique e Ctrl+K, filtro fuzzy 'hist'→Histórico, Enter navega e fecha, console limpo"
  - "smoke do service (2026-06-30): typo 'liverpol'→Liverpool, acento 'guimaraes'→Guimarães e 'konate'→Konaté, confronto 'chelsea everton'→4 jogos diretos no topo, 'zzzznope'→0 (sem falso positivo)"
  - "E2E Chrome (2026-06-30): ⌘K → 'liverpol' (typo) lista Times+Jogos; 'guimaraes' (s/ acento) → Bruno Guimarães · Newcastle; clique navega p/ /players/:id e fecha; GET /v1/search 200 c/ token Clerk; console limpo"
  - "E2E Chrome (2026-06-30): suite completa — estado vazio (Navegação+Ligas), filtro nav 'hist'→Páginas, confronto 'chelsea everton'→4 diretos no topo, substring 'ars'→Arsenal+jogadores, 'zzzznope'→Nenhum resultado, navegação por teclado (↓+Enter)→jogo, clique→time/liga/jogador, Esc limpa o termo"
  - "loading sob Slow 3G (2026-06-30): 1º load → skeleton (10 barras) + spinner no input; refetch → resultado anterior visível com dim opacity-0.5 + spinner (provado via polling no Chrome: spinnerNow/listOpacity)"
depende_de: []
impacta: []
ancoras:
  funcoes: [SidebarSearch, search, useSearch]
  rotas: [/v1/search]
  tabelas: [team, player, match, league, coach]
docs: []
verificado_em: 2026-06-30
atualizado: 2026-06-30
---

# Busca global (command palette ⌘K)

## Descrição

Command palette estilo ⌘K (componente `Command`/`CommandDialog` do shadcn, sobre cmdk),
aberta por um botão "Pesquisar" no `SidebarHeader` ou pelo atalho global ⌘K (Mac) /
Ctrl+K (Windows/Linux). **Vazia**, lista os destinos de navegação (`NAV_SECTIONS`) e as
ligas (`useLeaguesNav`). **Ao digitar (2+ caracteres)**, faz **busca server-side** de
entidades em `GET /v1/search` e mostra os resultados agrupados por tipo — Ligas, Times,
Jogadores (com clube pra desambiguar homônimos), Jogos (confronto) e Técnicos — com
logo/foto; selecionar navega pra página da entidade (`/teams/:slug`, `/players/:id`,
`/matches/:slug`, `/leagues/:code`, `/coaches/:id`) e fecha o dialog.

A busca é **fuzzy e sem acento** (trigram `pg_trgm` + `unaccent`): tolera erro de
digitação ("liverpol"→Liverpool) e acento ("guimaraes"→Guimarães). Como o cmdk faria seu
próprio filtro client-side por cima dos resultados já casados pelo backend (escondendo os
achados por similaridade), o `<Command>` roda com `shouldFilter={false}` e a navegação
estática é filtrada na mão. Jogos casam pelos **nomes dos times** (o `match.name` é
"Matchday 12"), nos dois sentidos do confronto. Hoje a base sincronizada é só a PL; a
tabela `coach` está vazia, então o grupo Técnicos só aparece quando ela for populada.

## Tarefas

- [x] ui — instalar `command` do shadcn em `packages/ui` (+ dep `cmdk` na própria UI)
- [x] ui — `SidebarSearch`: botão na sidebar + `CommandDialog` com navegação e ligas + atalho ⌘K/Ctrl+K
- [x] ui — plugar em `AppSidebar` (header, abaixo do logo)
- [x] dados — migração 0020: `pg_trgm` + `unaccent` + função `immutable_unaccent` + índices GIN trigram em league/team/player/coach (nome)
- [x] api — `search.service.ts` (5 buscas trigram em paralelo, ranqueadas por prefixo→similaridade; clube atual do jogador) + `search.routes.ts` (`GET /v1/search?q&limit`) + tipos no contrato
- [x] ui — evoluir `SidebarSearch` pra busca server-side: `useSearch` (debounce 200ms + React Query), `commandProps={{shouldFilter:false}}`, resultados agrupados; `CommandDialog` passa props ao `<Command>`
- [x] ui — estados de loading: skeleton no 1º load, spinner no input (`CommandInput` ganhou prop `loading`), e dim (`opacity-50`) nos resultados anteriores durante o refetch (keepPreviousData → sem flicker)

## Evidências

- [código] `apps/web/shared/app-shell/sidebar-search.tsx` — botão + dialog + atalho + busca server-side agrupada.
- [código] `apps/web/shared/app-shell/use-search.ts` — `useDebouncedValue` + `useSearch` (React Query, `enabled` em 2+ chars, `keepPreviousData` p/ não piscar).
- [código] `apps/api/src/modules/leagues/search/search.service.ts` — queries trigram (`%` fuzzy ∪ `LIKE` substring), ranking prefixo→similaridade, confronto via nomes dos times nos 2 sentidos.
- [código] `apps/api/src/db/migrations/0020_search_trgm.sql` — extensões + `immutable_unaccent` (wrapper IMMUTABLE do `unaccent`, exigido por índice de expressão) + índices GIN `gin_trgm_ops`.
- [código] `packages/ui/src/components/command.tsx` — `CommandDialog` ganhou `commandProps` p/ repassar `shouldFilter` ao `<Command>` interno (sem isso o cmdk re-filtra os resultados do backend).
- [código] `packages/ui/src/components/command.tsx` — `CommandDialog` da versão do registro vinha sem o provider `<Command>`; corrigido envolvendo `{children}` (senão `CommandInput` quebra com `'subscribe' of undefined`).
- [código] `packages/ui/src/components/sidebar.tsx` — `SidebarMenuSkeleton` usa `Math.random()` na largura → hydration mismatch; adicionado `suppressHydrationWarning` (pré-existente, destravava a verificação).

## Verificação

Smoke do service contra o banco (2026-06-30): "liverpol"→Liverpool + jogos do Liverpool;
"guimaraes"→Bruno Guimarães [Newcastle]; "konate"→Ibrahima Konaté [Liverpool]; "chelsea
everton"→os 4 Chelsea×Everton no topo (similaridade 1.0); "zzzznope"→0.

E2E no Chrome (2026-06-30): a paleta abre pelo botão e por ⌘K; digitar "liverpol" (typo)
lista o grupo Times (Liverpool, com logo) e Jogos (6 confrontos com data em PT); "guimaraes"
(sem acento) lista o grupo Jogadores com "Bruno Guimarães · Newcastle United" (foto + logo);
clicar no resultado navega para `/players/:id` e fecha o dialog; a requisição
`GET /v1/search?q=liverpol` retorna 200 com o Bearer da sessão Clerk; sem erros no console.
