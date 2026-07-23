---
id: LIG-020
titulo: Remates fora da área na aba Estatísticas da partida
modulo: ligas
status: verificado
prioridade: P2
facetas:
  api: feito
  ui: feito
testada: sim
testes:
  - "A1 api 2026-07-23: GET /v1/matches/7dfc8378-…/statistics → home.shotsOutsidebox=4 away=4 (SQL shots_outsidebox IS NOT NULL); sem row → ambos null HTTP 200; id fake → 404; sem shotsOffTarget (≠ type 41)"
  - "A2/A3 ui 2026-07-23: agent-browser match-detail aba Estatísticas — snapshot com REMATES FORA DA ÁREA (4/4) + POSSE DE BOLA + CHUTES NA ÁREA; console sem error novo; chrome-devtools MCP indisponível nesta sessão"
  - "typecheck 2026-07-23: bun run typecheck exit 0 (api+web)"
depende_de: [DOS-002]
impacta: [LIG-019]
ancoras:
  settings: []
  tabelas: [match_team_stats]
  tools: []
  funcoes: [matchStatistics]
  rotas: ["/v1/matches/:id/statistics"]
docs:
  - docs/investigacoes/estatisticas-partida-posse-chutes-big-chances.md
  - docs/investigacoes/sportmonks-inventario-completo.md
  - docs/features/dossie/DOS-002-estatisticas-partida-time.md
  - docs/features/ligas/LIG-019-remates-dentro-da-area-estatisticas.md
verificado_em: 2026-07-23
atualizado: 2026-07-23
---

# Remates fora da área na aba Estatísticas da partida

## Descrição

Na aba **Estatísticas** do `match-detail`, mostrar **remates / chutes fora da área** (shots outside box) dos dois times — volume de finalização de longe. Completa o par com **LIG-019** / W-092 (dentro da área / `shotsInsidebox`) e lê se o ataque depende de chute de longe vs chegada na área. Dado já ingerido em `match_team_stats.shotsOutsidebox` (SportMonks type 50, DOS-002); o buraco é só superfície API + UI. **≠** remates pra fora / off target (`shotsOffTarget`, type 41 — W-094).

Origem: wishlist W-093 (promovida 2026-07-23). Nota da wishlist: empacotar no mesmo PR que LIG-019 é ok; o escopo deste ID continua só `shotsOutsidebox`.

## Tarefas

- [x] P1 api — expor `shotsOutsidebox` em `TeamMatchStats` + `matchStatistics`
- [x] P2 ui — `StatRow` "Remates fora da área" + `hasStats` na aba Estatísticas

## Plano (2026-07-23)

plano-mini — sem dossiê (esforço P: ≤3 arquivos, zero schema, zero decisão técnica).

### Objetivo, aceite e non-goals

"Pronto" = `GET /v1/matches/:id/statistics` devolve `shotsOutsidebox` casa/fora e a aba Estatísticas renderiza uma `StatRow` "Remates fora da área" com os dois valores (ou "—" se null).

Non-goals: ingestão/migração (já em DOS-002); `shotsInsidebox` (LIG-019 — implementar no mesmo PR se conveniente, mas não conta como aceito deste ID); `shotsOffTarget` (W-094 — fora do *gol*, não da *área*); demais stats da aba (SoT, corners, …); mudar layout/`StatRow`; prognóstico/IA.

Aceite:
- A1 [api] `GET /v1/matches/:id/statistics` num jogo com row em `match_team_stats` → `home.shotsOutsidebox` e `away.shotsOutsidebox` são `number | null` (não omitidos) → coberto por P1
- A2 [ui] aba Estatísticas mostra rótulo **"Remates fora da área"** com valores casa/fora (ou "—") → coberto por P2
- A3 [ui] posse (e, se LIG-019 já estiver no branch, "Chutes na área") continua renderizando; sem regressão de console → coberto por P2 + Verificação

### Passos

**P1 [api] expor `shotsOutsidebox` no contrato** — em `apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats` adicionar `shotsOutsidebox: number | null` (comentário: type 50 Shots Outsidebox); em `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts#matchStatistics` incluir `matchTeamStats.shotsOutsidebox` no `.select` e no mapeamento `side()`. Se LIG-019 já tiver adicionado `shotsInsidebox` no mesmo tipo/select, **estenda** — não remova nem reescreva o campo da irmã. O web reexporta via `@workspace/api` (`apps/web/features/leagues/types/index.ts`) — sem tocar o reexport. Regras: `type`, nunca `interface`; pasta-por-endpoint já existe (`get-statistics/`); `matches.routes.ts` fino — só atualizar o `detail.summary` se quiser; código/campo em inglês. Don't: **não** selecione `shotsOffTarget` / `shotsTotal` neste passo; **não** some `lineup_player` — use a coluna oficial de time (`match_team_stats.shotsOutsidebox`, DOS-002 C3); **não** trate null como `0` no payload (`?? null`, igual posse); **não** invente migração — coluna já existe em `apps/api/src/db/schemas/leagues.ts` (`shots_outsidebox`, type 50) e sync já grava (`TEAM_STAT.shotsOutsidebox = 50`). Prova: com API de pé, `curl -s http://localhost:<porta>/v1/matches/<uuid-com-stats>/statistics | bun -e 'const d=await Bun.stdin.json(); if(!("shotsOutsidebox" in d.home)||!("shotsOutsidebox" in d.away)) process.exit(1); console.log("ok", d.home.shotsOutsidebox, d.away.shotsOutsidebox)'` → `ok` + dois valores `number|null`; partida sem row → ambos `null` (não 404 se o match existe).

**P2 [ui] (depende: P1) `StatRow` na aba** — em `apps/web/features/leagues/components/match-detail/statistics.tsx`: (1) alargar `hasStats` com OR de `shotsOutsidebox != null` em home/away (**preserve** ORs já existentes de posse / `shotsInsidebox` da LIG-019 — não substitua por só esta métrica); (2) nova `<StatRow label="Remates fora da área" home={data.home.shotsOutsidebox} away={data.away.shotsOutsidebox} />` (sem `suffix`), depois da Posse (e depois de "Chutes na área" se LIG-019 já estiver no arquivo). Regras: folder-by-feature já respeitada; string de UI em português; `type` nos props existentes; sem nova query — `useMatchStatisticsQuery` já bate em `/statistics`. Don't: **não** rotule "Remates pra fora" / "Não enquadrados" / "fora" sozinho (isso é off target / W-094); **não** invente barra/% nova — reuse `StatRow` como está; **não** esconda a card quando só `shotsOutsidebox` existe; **não** importe de outra feature; **não** apague a `StatRow` da LIG-019 se ela já existir no arquivo. Prova: chrome-devtools — abrir match-detail de jogo com stats → aba Estatísticas → snapshot contém "Remates fora da área"; `list_console_messages` sem erro novo; `list_network_requests` GET `/statistics` 200 com `shotsOutsidebox` no JSON.

### Verificação final

- `bun run typecheck` limpo (raiz)
- **API/dados**: Prova de P1 (fetch/curl + assert de shape) — casos: happy (ambos números) · um lado null · match sem row de stats (ambos null, 200) · match inexistente (404)
- **Browser real (chrome-devtools MCP)** — teste PRIMÁRIO: aba Estatísticas com "Remates fora da área"; golden path por último; `list_console_messages` limpo + `list_network_requests` sem falha. MCP não atacha → declarar, não afirmar que UI funciona
- **E2E Playwright**: n/a — mudança de 1 `StatRow` numa aba já existente; browser MCP cobre; spec dedicada não justifica
- re-teste: posse ainda renderiza; se LIG-019 no mesmo branch, "Chutes na área" intacta; callers de `matchStatistics` = só `matches.routes.ts`
- último passo: subagent em contexto fresco revisa o diff contra A1..A3 — reporta só gap; diff fora de `shared.ts` + `get-statistics.service.ts` + `statistics.tsx` (+ opcional `matches.routes.ts` summary) = achado

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:460` — coluna `shotsOutsidebox` / `shots_outsidebox` (type 50) já no schema DOS-002
- [código] `apps/api/src/db/sync-ingest.ts:28` — `TEAM_STAT.shotsOutsidebox: 50` no filtro de ingestão
- [código] `apps/api/src/db/sync-sportmonks.ts:705` — sync já grava `shotsOutsidebox: g(TEAM_STAT.shotsOutsidebox)`
- [código] `apps/api/src/modules/leagues/shared/shared.ts` — `TeamMatchStats` com `possession` + `shotsInsidebox` (LIG-019) + `shotsOutsidebox` (LIG-020, type 50)
- [código] `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts` — select/mapeamento `shotsOutsidebox` (+ insidebox da irmã)
- [código] `apps/web/features/leagues/components/match-detail/statistics.tsx` — `hasStats` canônico + StatRow "Remates fora da área"
- [doc] `docs/investigacoes/sportmonks-inventario-completo.md` — type 50 Shots Outsidebox ✅ ingerido; type 41 = Off Target (≠ este)
- [feature] `docs/features/ligas/LIG-019-remates-dentro-da-area-estatisticas.md` — irmã (dentro da área); mesmos arquivos-alvo
- [wishlist] W-093 → promovida 2026-07-23 → LIG-020

## Verificação

Provas 2026-07-23 (relançamento `/i` — código já no working tree; só prova + fecho):

**A1 [api]** — API em `http://localhost:3001` (auth local aberta / sem Bearer necessário nesta instância). UUID via SQL `shots_outsidebox IS NOT NULL`: `7dfc8378-4b3d-4261-9464-a3d86d4b1517`.
- Happy: `GET /v1/matches/7dfc8378-…/statistics` → `{ homeOut: 4, awayOut: 4, homeIn: 12, awayIn: 8, poss: 58 }`; chave `shotsOutsidebox` presente; **sem** `shotsOffTarget` (type 41).
- Sem row: `003235e7-…` → `shotsOutsidebox: null` casa/fora, HTTP 200.
- Inexistente: `00000000-…` → `{"error":"match_not_found"}` HTTP 404.
- `bun run typecheck` exit 0.

**A2/A3 [ui]** — `chrome-devtools` MCP **indisponível** nesta sessão; prova via `agent-browser` (sessão Clerk salva) em `http://localhost:3000/matches/fa-cup-2025-2026-round-2-blackpool-vs-carlisle-united-19599107` → aba Estatísticas. Snapshot:
- `REMATES FORA DA ÁREA` com `4` / `4`
- `POSSE DE BOLA` `58%` / `42%` (não-regressão)
- `CHUTES NA ÁREA` `12` / `8` (LIG-019 intacta)
- Console: sem error novo (só HMR/Clerk info/warn de dev).
- Fetch in-page `/statistics` → status 200, `homeOut:4`, `awayOut:4`, `hasOffTarget:false`.

**Revisor A1–A3 (diff no disco):** nenhum gap — `TeamMatchStats`/`matchStatistics` expõem `shotsOutsidebox`; UI tem label fixo e `hasStats` canônico preservando posse/`shotsInsidebox`; sem seleção de off-target.
