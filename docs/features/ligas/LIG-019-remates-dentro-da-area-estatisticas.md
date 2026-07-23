---
id: LIG-019
titulo: Remates dentro da área na aba Estatísticas da partida
modulo: ligas
status: feito
prioridade: P2
facetas:
  api: verificado
  ui: feito
testada: parcial
testes:
  - "typecheck: bun run typecheck → Tasks 3 successful (2026-07-23)"
  - "api-happy: GET /v1/matches/2584f5c3-…/statistics → home.shotsInsidebox=7 away=6 (match com shots_insidebox NOT NULL)"
  - "api-borda: GET /v1/matches/e5ca9d07-…/statistics → shotsInsidebox null/null"
  - "api-404: uuid inexistente → {error:match_not_found} HTTP 404"
  - "ui-browser: chrome-devtools MCP ausente; cursor-ide-browser redirecionou para /sign-in (Clerk) — A2/A3 sem prova E2E nesta sessão"
depende_de: [DOS-002]
impacta: [LIG-020]
ancoras:
  settings: []
  tabelas: [match_team_stats]
  tools: []
  funcoes:
    - "apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts#matchStatistics"
    - "apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats"
    - "apps/web/features/leagues/components/match-detail/statistics.tsx#Statistics"
  rotas:
    - "GET /v1/matches/:id/statistics"
docs: []
verificado_em: null
atualizado: 2026-07-23
---

# Remates dentro da área na aba Estatísticas da partida

## Descrição

Na aba **Estatísticas** do match-detail, exibir **chutes / remates dentro da área** (`shotsInsidebox`, SportMonks type 49) dos dois times — casa×fora, no mesmo padrão de barras da posse. Proxy de qualidade ofensiva sem xG: distingue chute de longe de chegada na área. Dado já ingerido por **DOS-002** em `match_team_stats`; o buraco é só superfície API + UI (hoje só `possession`).

Origem: wishlist **W-092**. Par natural: **LIG-020** (W-093 / `shotsOutsidebox`) — fora deste escopo.

## Tarefas

- [x] P1 api — expor `shotsInsidebox` em `TeamMatchStats` + select de `matchStatistics`
- [x] P2 ui — `StatRow` "Chutes na área" + `hasStats` inclui a nova métrica

## Plano (2026-07-23)

Dossiê: n/a (plano-mini — ≤3 arquivos, zero schema, sem decisão técnica aberta).

### Objetivo, aceite e non-goals

"Pronto" = a aba Estatísticas mostra, além da posse, uma linha **Chutes na área** com os valores casa×fora vindos de `match_team_stats.shotsInsidebox`, null-safe como a posse.

Non-goals: W-093 (`shotsOutsidebox`); SoT / big chances / bloqueados / demais da família W-082–W-094; ingestão/migração; mudança no `prognosis-prompt` (já consome a coluna).

Aceite:
- A1 [api] `GET /v1/matches/:id/statistics` devolve `home.shotsInsidebox` e `away.shotsInsidebox` (`number | null`) → coberto por P1
- A2 [ui] numa partida com stats ingeridas, a aba Estatísticas mostra a linha "Chutes na área" com os dois números (ou "—" se null) → coberto por P2
- A3 [ui] não-regressão: posse continua na aba; partida sem nenhuma métrica ainda mostra "Sem estatísticas…" → coberto por P2

### Passos

**P1 [api]** — em `apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats`, adicionar `shotsInsidebox: number | null` (type 49); em `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts#matchStatistics`, incluir `matchTeamStats.shotsInsidebox` no `.select` e no `side()`. Atualizar o comentário/summary da rota em `matches.routes.ts` (ainda só documenta possession). Regras: pasta-por-endpoint já existe (`get-statistics/`); routes fino (zero regra de negócio); `type`, nunca `interface`; campo em inglês, null quando a linha/stat faltar. Don't: **não** derive de `lineup_player` nem some SoT — use a coluna oficial de time (`match_team_stats.shotsInsidebox`); **não** adicione `shotsOutsidebox` / SoT / outras colunas neste passo (W-093 e família ficam fora); **não** invente default `0` quando a coluna for null → espelhe o padrão da posse (`?? null`); **não** altere sync/schema. Prova: com API de pé, `fetch` em `GET /v1/matches/<uuid>/statistics` onde `match_team_stats.shots_insidebox` é não-nulo no banco → JSON tem `home.shotsInsidebox`/`away.shotsInsidebox` numéricos; partida sem row → ambos `null`; `bun run typecheck` exit 0.

**P2 [ui] (depende: P1)** — em `apps/web/features/leagues/components/match-detail/statistics.tsx#Statistics`, adicionar um `StatRow` com label **"Chutes na área"** (`home`/`away` = `data.*.shotsInsidebox`, sem `suffix`); alargar `hasStats` para `(possession != null || shotsInsidebox != null)` em qualquer lado. Regras: folder-by-feature (`features/leagues/`); tipos via re-export `@workspace/api` (já em `types/index.ts` — sem tipo local duplicado); string de UI em português; `type` nos props locais. Don't: **não** recrie `StatRow` nem mude cores/layout da posse; **não** mostre a linha com `suffix="%"`; **não** esconda o card quando só `shotsInsidebox` existir (bug se `hasStats` continuar só na posse); **não** importe de outra feature. Prova: chrome-devtools — abrir match-detail de partida com stats → aba Estatísticas → snapshot mostra "Chutes na área" + dois valores numéricos (ou "—"); posse ainda presente; `list_console_messages` sem erro novo e `list_network_requests` sem falha em `/statistics`.

### Verificação final

- `bun run typecheck` limpo (raiz)
- **API/dados:** `fetch` contra dev server em `GET /v1/matches/:id/statistics` → shape com `shotsInsidebox` (happy: partida com row; borda: match sem `match_team_stats` → `null`; erro: id inexistente → 404). Sem runner de unidade no repo.
- **Browser real (chrome-devtools MCP):** T1 — partida com stats → linha "Chutes na área" visível com números; T2 — partida sem stats → "Sem estatísticas para esta partida."; fechar com console/network limpos. MCP não atacha → declarar, não afirmar UI verde.
- **E2E Playwright:** n/a neste plano-mini (fluxo de 1 StatRow; chrome-devtools basta).
- re-teste: não-regressão da posse na mesma aba; callers de `matchStatistics` = só `matches.routes.ts` (blast mínimo).
- último: subagent em contexto fresco revisa o diff contra A1..A3.

### Pré-mortem e rollback

- C1: `hasStats` só olha posse → partida com inside-box sem posse (raro) mostra empty state — mitigação: critério em P2.
- C2: UI usa label ambíguo "Remates fora" colidindo com W-093 — mitigação: label fixo **"Chutes na área"** (localização, não off-target).
- C3: alguém adiciona `0` no lugar de null e a barra distorce — mitigação: Don't do P1 + StatRow já trata null como "—"/0 de largura.
- Rollback: `git revert` (api/ui pura; sem schema).

### Fora de escopo

- LIG-020 remates fora da área (W-093) → feature irmã planejada; não empilhar neste ID.
- Família W-082 SoT · W-084 big chances · W-091 bloqueados · W-094 off-target → wishlist, não este PR.

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:459` — `matchTeamStats.shotsInsidebox` (type 49) já no schema DOS-002
- [código] `apps/api/src/modules/leagues/shared/shared.ts:395` — `shotsInsidebox: number | null` (LIG-019); `shotsOutsidebox` preservado (LIG-020)
- [código] `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts:24,50` — select + `?? null` de `shotsInsidebox`
- [código] `apps/web/features/leagues/components/match-detail/statistics.tsx:72-75,91-95` — `hasStats` canônico + StatRow "Chutes na área"
- [código] `apps/api/src/modules/leagues/matches.routes.ts:69` — summary menciona possession + shots inside/outside box
- [doc] `docs/features/dossie/DOS-002-estatisticas-partida-time.md` — ingestão feita; facetas api/ui ficaram de fora de propósito
- [wishlist] W-092 (2026-07-23) — brief promovido para esta feature

## Verificação

Executada em 2026-07-23 no `/i` (relançamento):

1. **typecheck** — `bun run typecheck` → `Tasks: 3 successful, 3 total` (exit 0).
2. **A1 API (happy)** — SQL: `match_team_stats.shots_insidebox IS NOT NULL` → uuid `2584f5c3-f1c5-48cc-93cb-d2ba80857d79` (slug `brasileirao-2026-bahia-vs-chapecoense`).  
   `GET http://localhost:3001/v1/matches/2584f5c3-f1c5-48cc-93cb-d2ba80857d79/statistics` →  
   `home.shotsInsidebox=7`, `away.shotsInsidebox=6` (também `possession` 65/35 e `shotsOutsidebox` 10/4 presentes). Auth: API local sem gate (dev).
3. **A1 API (borda)** — match sem row `e5ca9d07-a00a-4884-8b3b-45a0dff7837a` → `shotsInsidebox: null` nos dois lados.
4. **A1 API (erro)** — uuid inexistente → `{"error":"match_not_found"}` HTTP 404.
5. **A2/A3 UI** — código no disco: StatRow `"Chutes na área"` + posse + empty state; `hasStats` OR posse‖inside‖outside.  
   **chrome-devtools MCP: indisponível** nesta sessão (nenhum server `chrome-devtools`).  
   Tentativa via `cursor-ide-browser`: navigate para `/matches/brasileirao-2026-bahia-vs-chapecoense` → redirect `http://localhost:3000/sign-in?redirect_url=…` (Clerk). **Não afirmar UI verde no browser.**
6. **Revisor fresco** — A1–A3 IMPLEMENTED no código; nenhum gap de requisito; LIG-020 StatRow preservada; working tree também contém LIG-021 (cartões) nos mesmos arquivos da API (não apagado).
