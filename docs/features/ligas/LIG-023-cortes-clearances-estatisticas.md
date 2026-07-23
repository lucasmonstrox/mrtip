---
id: LIG-023
titulo: Cortes (clearances) na aba Estatísticas da partida
modulo: ligas
status: verificado
prioridade: P2
facetas:
  dados: verificado
  api: verificado
  ui: verificado
testada: sim
testes:
  - "A1 dados: migração 0043 ADD clearances + 0044 backfill SUM(lp); count(clearances IS NOT NULL)=2988; spot-check mts=sum ok"
  - "A2 dados: sync-sportmonks + sync-ingest acumulam clearancesByMatchTeam no upsert (TEAM_STAT sem 101); P3_PROOF posse/tackles intactos"
  - "A3 api: GET /v1/matches/2584f5c3…/statistics → home.clearances=13 away=38; posse-only → null/null 200; inexistente → match_not_found"
  - "A4 ui agent-browser T3 Bahia×Chape: CORTES 13/38 + GET /statistics 200; T2 Salford CORTES —/—; T1 Garforth Sem estatísticas; typecheck exit 0"
depende_de: [DOS-002]
impacta: [LIG-019, LIG-020, LIG-021, LIG-022]
ancoras:
  settings: []
  tabelas: [match_team_stats, lineup_player]
  tools: []
  funcoes:
    - "apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts#matchStatistics"
    - "apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats"
    - "apps/web/features/leagues/components/match-detail/statistics.tsx#Statistics"
    - "apps/api/src/db/sync-sportmonks.ts"
    - "apps/api/src/db/sync-ingest.ts"
  rotas:
    - "GET /v1/matches/:id/statistics"
docs:
  - docs/planos/LIG-023-cortes-clearances-estatisticas.md
  - docs/investigacoes/sportmonks-inventario-completo.md
  - docs/features/dossie/DOS-002-estatisticas-partida-time.md
  - docs/features/ligas/LIG-019-remates-dentro-da-area-estatisticas.md
  - docs/features/ligas/LIG-020-remates-fora-da-area-estatisticas.md
verificado_em: 2026-07-23
atualizado: 2026-07-23
---

# Cortes (clearances) na aba Estatísticas da partida

## Descrição

Na aba **Estatísticas** do match-detail, mostrar **cortes / afastamentos (clearances)** dos dois times — proxy de pressão sofrida e capacidade de aliviar. Coluna oficial `match_team_stats.clearances`, populada por **soma** de `lineup_player.clearances` (SportMonks type **101**), porque o type **não vem** no include `statistics` de time. UI: label **"Cortes"** — ≠ Desarmes (78) ≠ Interceptações (100).

Origem: wishlist **W-088** (promovida 2026-07-23). Decisão do dono: coluna em `match_team_stats` (não só soma ad-hoc na leitura). ID **LIG-023** (LIG-021 = cartões; LIG-022 = faltas).

## Tarefas

- [x] P1 dados — coluna `clearances` em `match_team_stats` (schema expand)
- [x] P2 dados — migração + backfill `SUM(lineup_player.clearances)`
- [x] P3 dados — sync grava `clearances` derivado (sportmonks + ingest)
- [x] P4 api — expor `clearances` em `TeamMatchStats` + `matchStatistics`
- [x] P5 ui — `StatRow` "Cortes" + `hasStats` inclui a métrica

## Plano (2026-07-23)

Dossiê: [docs/planos/LIG-023-cortes-clearances-estatisticas.md](../../planos/LIG-023-cortes-clearances-estatisticas.md)

### Objetivo, aceite e non-goals

"Pronto" = `match_team_stats` tem `clearances` populado (histórico + sync contínuo), `GET /v1/matches/:id/statistics` devolve `home/away.clearances` (`number | null`), e a aba Estatísticas mostra a linha **"Cortes"** casa×fora.

Non-goals: desarmes/interceptações na aba; consumo no `prognosis-prompt`; adicionar type 101 ao filtro `TEAM_STAT` (não vem no feed de time); MVP só-soma-na-API sem coluna (vetado pelo dono).

Aceite:
- A1 [dados] coluna `match_team_stats.clearances` existe; backfill faz `SUM(lp.clearances) = mts.clearances` num jogo amostra → coberto por P1–P2
- A2 [dados] após sync de uma temporada com lineups, jogos com clearances per-player têm `mts.clearances` não-nulo → coberto por P3
- A3 [api] `GET /statistics` inclui `home.clearances` / `away.clearances` (`number | null`) → coberto por P4
- A4 [ui] aba Estatísticas mostra **"Cortes"** com valores (ou "—"); posse / chutes na área / remates fora intactos → coberto por P5

### Premissas

- Type 101 **não** aparece no include `statistics` de time (inventário Detalhe 1) — preencher via soma per-player.
- `lineup_player.clearances` já é ingerido (`STAT.clearances = 101`).
- DOS-002 (`feito`) — tabela e pipeline `statistics` existem; LIG-023 só expande.
- Working tree pode já ter LIG-019/020 (e LIG-021/022) na superfície — estender, não reverter.
- Se durante o `/i` um probe ao vivo mostrar type 101 no nível time: PARAR, atualizar D2/Plano (preferir valor oficial do feed se existir).

### Decisões

- D1: coluna oficial `match_team_stats.clearances` — driver: dono (2026-07-23); descartado: só agregar na leitura da API sem persistir porque contradiz a correção do dono; pagamos: migração + sync.
- D2: popular por `SUM(lineup_player.clearances)` no backfill e no sync — driver: inventário (101 ausente em types de TIME); descartado: `TEAM_STAT.clearances = 101` + `g(101)` porque o feed de time não entrega 101; pagamos: soma pode divergir levemente de um total "oficial" de provedor (banco/subs) — aceitável e documentado no schema.
- Adiadas pro `/i`: micro-ordem da StatRow entre as linhas existentes; acumular no loop de lineup vs query SUM no upsert (ambos válidos desde que Don'ts do P3).

### Passos

**P1 [dados] expand schema** — em `apps/api/src/db/schemas/leagues.ts#matchTeamStats`, adicionar `clearances: integer("clearances")` nullable no bloco defesa (junto de `tackles`/`interceptions`), com comentário: type 101 derivado de `SUM(lineup_player.clearances)` — não vem no `statistics` de time. Só-expand; sem contract. Regras: dado em inglês (`clearances`); `type` inferido do Drizzle. Don't: **não** renomeie/mova `tackles`/`interceptions`; **não** adicione colunas de faltas/saves neste passo; **não** invente default `0` no schema (nullable). Prova: `rg -n 'clearances: integer\\(\"clearances\"\\)' apps/api/src/db/schemas/leagues.ts` acha a linha em `matchTeamStats` (não só em `lineup_player`); `bun run typecheck` nos arquivos de schema limpo ou só erros pré-existentes irrelevantes.

**P2 [dados] (depende: P1) migrate + backfill** — `cd apps/api && bun run db:generate` → aplicar com `bun run db:migrate`; rodar SQL do dossiê §Backfill. Critério de avanço: backfill verificado antes do P3. Don't: **não** faça contract/drop de cols; **não** backfille com `COALESCE(sum, 0)` apagando null semântico; **não** some `tackles` por engano. Prova: `SELECT count(*) FILTER (WHERE clearances IS NOT NULL) FROM match_team_stats` > 0; spot-check 1 `match_id`: soma per-player = coluna time (query no dossiê §Backfill).

**P3 [dados] (depende: P2) sync contínuo** — em `apps/api/src/db/sync-sportmonks.ts` (bloco team stats ~679+) e `apps/api/src/db/sync-ingest.ts` (§5 ~385+): incluir `clearances` no objeto `ts` do upsert, valor = soma dos `lineup_player.clearances` do `(matchId, teamId)` (detalhe: dossiê §Sync). Regras: código/dado em inglês; espelhar nos **dois** caminhos de sync. Don't: **não** adicione `101` a `TEAM_STAT`/`TEAM_STAT_IDS`; **não** use `g(101)` como se viesse do feed de time; **não** monte `ts` só com `clearances` (apagaria outras cols no `onConflictDoUpdate`); **não** grave `0` quando nenhum jogador tem clearances → `null`. Prova: re-sync (ou ingest) de 1 fixture com lineups → `match_team_stats.clearances` igual à soma; posse/tackles da mesma row inalterados vs pré-sync.

**P4 [api] (depende: P1) expor no contrato** — em `apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats` adicionar `clearances: number | null` (comentário: type 101 / Cortes); em `get-statistics.service.ts#matchStatistics` incluir no `.select` e no `side()`. Estender o que LIG-019/020/021/022 já colocaram — não remover. Routes fino: opcional atualizar summary em `matches.routes.ts`. Regras: pasta-por-endpoint já existe (`get-statistics/`); `type` nunca `interface`; campo inglês; null-safe `?? null`. Don't: **não** some `lineup_player` na API (leia a coluna de time); **não** exponha `tackles`/`interceptions` neste passo; **não** trate null como `0`. Prova: com API de pé, `fetch` `GET /v1/matches/<uuid>/statistics` → JSON tem `home.clearances`/`away.clearances`; partida com backfill → número; sem row/sem dado → `null`; `bun run typecheck` exit 0.

**P5 [ui] (depende: P4) StatRow Cortes** — em `apps/web/features/leagues/components/match-detail/statistics.tsx#Statistics`: (1) OR em `hasStats` com `clearances != null` home/away (**preserve** ORs já existentes); (2) `<StatRow label="Cortes" home={…clearances} away={…clearances} />` sem `suffix`. Regras: folder-by-feature; string UI em português **"Cortes"**; `type` nos props; sem nova query. Don't: **não** rotule "Desarmes" / "Interceptações" / "Afastamentos" (label fixo Cortes); **não** recrie `StatRow`; **não** esconda o card quando só clearances existe; **não** importe de outra feature; **não** apague StatRows irmãs. Prova (**agent-browser**, decisão do dono — não chrome-devtools): roteiro dossiê §Testes T1–T3 — `agent-browser open` match-detail → `find text "Estatísticas" click` → `wait --text "Cortes"` → `snapshot` contém **"Cortes"** + dois números; `network requests` GET `/statistics` 200 com `clearances`; T1 empty state e T2 "—" cobertos no dossiê.

### Verificação final

- `bun run typecheck` limpo (raiz)
- **API/dados:** script/fetch ad-hoc contra `GET /v1/matches/:id/statistics` + asserts no banco (backfill + pós-sync) — casos: happy (ambos números) · um lado null · match sem clearances per-player (ambos null, 200) · match inexistente (404). Sem runner de unidade.
- **Browser real (agent-browser — teste PRIMÁRIO):** roteiro completo no dossiê §Testes T1–T3 (`open` → `wait --load networkidle` → `find text "Estatísticas" click` → `wait --text` → `snapshot` + `network requests`). CLI/login Clerk bloqueado → declarar, não afirmar UI verde.
- **E2E Playwright:** n/a — 1 StatRow em aba existente; agent-browser cobre.
- re-teste: LIG-019/020/021/022 StatRows intactas; `features impact` âncora `match_team_stats`; callers de `matchStatistics` = `matches.routes.ts`
- último: subagent fresco revisa diff contra A1–A4 — paths fora de schema/migrate/sync/shared/get-statistics/statistics.tsx (+ routes summary) = achado

### Pré-mortem e rollback

- C1: upsert `set: ts` incompleto zera outras cols — sintoma: posse some após sync; mitigação: Don't P3 + spot-check pré/pós.
- C2: label/campo confunde com desarmes (78) — sintoma: UI "Desarmes" ou valor de `tackles`; mitigação: label "Cortes" + coluna `clearances` + Prova P5.
- C3: null→0 na API/UI — barra mentirosa; mitigação: Don't P4/P5 + StatRow já trata null como "—".
- C4: type 101 passa a vir no feed de time num dia e a soma diverge do oficial — sintoma: números ≠ SofaScore; mitigação: premissa "PARAR e preferir feed" no Plano.
- Rollback: schema só-expand → drop column; api/ui → `git revert`; sync → reverter commits de sync. Rollback NÃO desfaz: rows já backfilladas (re-rodar SQL ou nullificar a col).

### Fora de escopo

- Desarmes / interceptações na aba Estatísticas → wishlist família W-082–W-087 (IDs próprios quando promover).
- Faltas (56) / saves (57) em `TEAM_STAT` → LIG-022 / W-085.
- Cartões → LIG-021.
- Consumo de `clearances` no `prognosis-prompt` / `TeamStatField` → feature futura `depende_de: [LIG-023]` se o dono pedir.

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts` — `matchTeamStats.clearances` (+ `lineup_player.clearances` type 101)
- [migração] `0043_worthless_ozymandias.sql` — ADD COLUMN; `0044_lig023_clearances_backfill.sql` — SUM backfill
- [código] `sync-sportmonks.ts` / `sync-ingest.ts` — `clearancesByMatchTeam` no upsert; `TEAM_STAT` sem 101
- [código] `TeamMatchStats.clearances` + `matchStatistics` select/side
- [código] `statistics.tsx` — StatRow "Cortes" + `hasStats` OR clearances
- [wishlist] W-088 → LIG-023; dono exige coluna oficial

## Verificação

2026-07-23 (`/i`):

- **dados A1/A2:** migrate 0043+0044; `count(*) WHERE clearances IS NOT NULL` = 2988; spot-check 5 rows `mts_clr = sum_clr`; P3_PROOF re-derive mantém possession/tackles/interceptions; TEAM_STAT sem `clearances:101`.
- **api A3:** in-process `matchStatistics` + HTTP `GET :3001/v1/matches/2584f5c3-f1c5-48cc-93cb-d2ba80857d79/statistics` → `{home:13, away:38}`; FA Cup posse-only → `null`/`null` 200; uuid inexistente → `match_not_found`.
- **ui A4 (agent-browser, sessão Clerk `mrtip-lig021d`):** T3 `brasileirao-2026-bahia-vs-chapecoense` → StaticText `CORTES` + `13`/`38`, network GET `/statistics` 200; T2 Salford → `CORTES` + `—`; T1 Garforth → `Sem estatísticas para esta partida.`; StatRows Posse/Chutes/Remates/Cartões intactas. Artefatos: `apps/api/scripts/output/lig023-ui/`.
- **typecheck:** `bun run typecheck` exit 0 (api+web).
- **revisor fresco:** gap A1 (backfill só ad-hoc) → fechado com migração `0044`; A2–A4 sem gap.
- **re-prova independente (mesma data, sessão dono):** A1 `2988/3072` + `mismatches=0`; A3 Vitória×Cruzeiro HTTP `42`/`62` + empty null + 404; A4 agent-browser T1 Garforth / T2 Wealdstone CORTES —/— / T3 Vitória×Cruzeiro CORTES + irmãs + GET `/statistics` 200.
