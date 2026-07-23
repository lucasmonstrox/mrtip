---
id: LIG-025
titulo: Abas da página da liga como páginas (URL por aba)
modulo: ligas
status: verificado
prioridade: P2
facetas:
  ui: verificado # /leagues/[code]/[tab]; nav por Link; redirect sem aba → /classificacao
testada: sim
testes:
  - "T1 redirect: /leagues/BRA → /classificacao; aba Classificação selected (agent-browser 2026-07-23)"
  - "T2 click Rodadas → URL /rodadas + tabpanel Rodadas; Marcadores → /marcadores (agent-browser 2026-07-23)"
  - "T3 reload mantém /marcadores (agent-browser 2026-07-23)"
  - "T4 aba inválida → 404 (agent-browser 2026-07-23)"
  - "T5 ?round=10 sobrevive Classificação↔Rodadas (agent-browser 2026-07-23)"
  - "typecheck apps/web limpo (2026-07-23)"
depende_de: [LIG-024]
impacta: [LIG-015]
ancoras:
  settings: []
  tabelas: []
  tools: []
  funcoes: [LEAGUE_PAGE_TAB_VALUES, isLeaguePageTabValue, LeagueDetail]
  rotas: []
docs: []
verificado_em: 2026-07-23
atualizado: 2026-07-23
---

# Abas da página da liga como páginas (URL por aba)

## Descrição

As abas da página da liga (Classificação · Rodadas · Marcadores; em copa: Chaveamento · Marcadores) deixam de ser só estado React e passam a ser **rotas** `/leagues/[code]/[tab]`. Refresh e link compartilhado abrem a aba certa; `/leagues/[code]` redireciona pra `/classificacao` (copa corrige no client pra `/chaveamento`). Irmão da LIG-024 (dossiê da partida). Query `?season=` / `?round=` (LIG-008 / LIG-015) sobrevive à troca de aba.

## Tarefas

- [x] ui — extrair `LEAGUE_PAGE_TAB_VALUES` / `isLeaguePageTabValue` pra validação server+client
- [x] ui — redirect `/leagues/[code]` → `/leagues/[code]/classificacao` (preserva query)
- [x] ui — page `/leagues/[code]/[tab]` com `notFound` pra aba inválida
- [x] ui — `LeagueDetail` controlado por `tab` + Links na barra (preserva `?season=`/`?round=`)
- [x] ui — prova browser (deep-link, refresh, redirect, 404, query na troca de aba)

## Verificação

agent-browser sessão `mrtip-lig025` (auth Clerk), artefatos em `apps/api/scripts/output/lig025-ui/`:

1. `/leagues/BRA` → `/leagues/BRA/classificacao`, tab Classificação selected + tabela
2. click Rodadas → `/rodadas`; click Marcadores → `/marcadores`
3. reload em `/marcadores` mantém aba
4. `/leagues/BRA/xyz-invalida` → 404 Next
5. `/rodadas?round=10` → Classificação (`?round=10`) → Rodadas (`?round=10`)
6. `bun run typecheck` em apps/web exit 0; console errors vazio
