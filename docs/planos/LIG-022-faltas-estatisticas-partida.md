# LIG-022 — Faltas na aba Estatísticas da partida · dossiê de planejamento (2026-07-23)

Feature: [docs/features/ligas/LIG-022-faltas-estatisticas-partida.md](../features/ligas/LIG-022-faltas-estatisticas-partida.md)
Base: commit `119aa6a` (2026-07-23) — todo file:line deste doc vale neste commit.

## TL;DR

Ingerir SportMonks **type 56 Fouls** (faltas **cometidas**) como coluna tipada `match_team_stats.fouls`, ligar no filtro/`TEAM_STAT` + upsert dos syncs, expor em `GET /v1/matches/:id/statistics` e renderizar uma `StatRow` **"Faltas"** na aba Estatísticas. Caminho canônico = coluna oficial de time (dono rejeitou soma de `lineup_player.fouls` como caminho principal). **≠** `freeKicks` (type 55), que já existe e é faltas a favor / cobranças.

## Briefing — o que já foi falado e decidido

- **Wishlist W-087** — faltas cometidas casa×fora na aba Estatísticas; type 56 ainda ❌ no inventário; quick win (já vem no include `statistics`); atalho per-player existia como opção — fonte: `docs/wishlist.md` (W-087).
- **Dono nesta conversa (2026-07-23):** a ideia **vai para `match_team_stats` também** (não só somar `lineup_player.fouls`). Caminho canônico = ingestão oficial type 56 + API + UI.
- **Veto / non-goal explícito:** `foulsDrawn` (type 96) / "faltas sofridas" fora de escopo salvo o dono pedir.
- **Não confundir com `freeKicks` (55)** — coluna já em `match_team_stats.free_kicks`; é cobranças concedidas, não faltas cometidas — fonte: wishlist + schema (`leagues.ts:467`).
- **Superfície UI** = aba Estatísticas match-detail, mesmo padrão LIG-019 / LIG-020 / LIG-021 (`StatRow`).
- **Verificação UI (dono 2026-07-23):** preferir **agent-browser** (skill `.claude/skills/agent-browser/SKILL.md`); chrome-devtools MCP só como fallback.
- **Família W-082–W-089**; irmã de dados W-085 (saves 57) — empacotar 56+57 numa migração só é **opcional** e **fora deste ID** (só 56).
- **ID:** LIG-021 já é cartões (W-089+W-090); próximo livre = **LIG-022**. Gate `grep W-087` em planos/investigações/features: órfã antes desta promoção.
- **Precedente schema:** DOS-002 + expansão 0018 (`ADD COLUMN` tipadas em `match_team_stats`); inventário quick wins 56/57/51 — fonte: `docs/investigacoes/sportmonks-inventario-completo.md`, `docs/features/dossie/DOS-002-estatisticas-partida-time.md`.
- **Precedente superfície:** LIG-019/LIG-020 (plano-mini api+ui, coluna já existia); este plano **não** é mini — tem faceta `dados`.

## Estado do terreno

### Schema / dados

- Tabela `match_team_stats` em `apps/api/src/db/schemas/leagues.ts:448-492` — colunas tipadas; `freeKicks` em `:467` (type 55); **não há** `fouls` / `fouls_cometidas`.
- Inventário: type **56 Fouls** = ❌ no nível time; type 55 Free Kicks = ✅ — `docs/investigacoes/sportmonks-inventario-completo.md` (Detalhe 1). Type 56 vem "sempre" no include `statistics` (fixture level).
- `TEAM_STAT` canônico em `apps/api/src/db/sync-ingest.ts:28-29` — inclui `freeKicks: 55`, **sem** `fouls`. `TEAM_STAT_IDS` alimenta `richFilterTypes` (`:47`) → `fixtureStatisticTypes:…`.
- Upsert time-stats em `sync-ingest.ts:385-401` (`ingestFixtures`) — mapeia `g(TEAM_STAT.*)` e **não** grava fouls; hoje o type 56 chega no payload (ou seria filtrado fora se o filtro for honrado) e é **descartado**.
- **Cópia duplicada** de `TEAM_STAT` + loop de upsert em `apps/api/src/db/sync-sportmonks.ts:58-59` e `apps/api/src/db/sync-sportmonks.ts:704-736` — o sync de liga PL mantém mapa/upsert próprios (paralelos ao de `sync-ingest.ts`); **os dois mapas precisam do `fouls: 56`**. Copa cobre-se via `ingestFixtures` em `sync-ingest.ts` (importado por `sync-cup.ts`).
- Per-jogador: `STAT.fouls: 56` já em `sync-ingest.ts:23` → `lineup_player.fouls` (LIG-003). `prognosis-prompt.ts` ainda soma per-player pra disciplina (`:98-128` comentário MOD-008: "team-stat 56 não é ingerido") — **fora do escopo** desta feature (faceta `ia` omitida); após LIG-022 o prompt *pode* migrar numa feature futura.
- Migrações recentes: até `0042_condemned_doorman.sql`; expansão precedente `0018_adorable_valeria_richards.sql` = `ALTER TABLE "match_team_stats" ADD COLUMN …`. Próxima = **0043** (nome gerado pelo drizzle-kit).
- Scripts: `cd apps/api && bun run db:generate` / `db:migrate` / `db:sync`.

### API / UI

- `TeamMatchStats` em `apps/api/src/modules/leagues/shared/shared.ts:391-396` — no pino: `possession` + `shotsInsidebox` + `shotsOutsidebox` (LIG-019/020 no type). LIG-021 planeja `yellowCards`/`redCards` no mesmo type.
- `matchStatistics` em `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts:12-27` — no pino o `.select` ainda é só `possession` (LIG-019/020/021 em andamento no branch podem já ter estendido — **/i preserva** campos irmãos).
- Único caller: `matches.routes.ts` (`codebase_impact matchStatistics` → 1 hop).
- UI: `apps/web/features/leagues/components/match-detail/statistics.tsx:68-97` — `hasStats` OR posse; `StatRow` reaproveitável; label PT.
- Hook `useMatchStatisticsQuery` já bate em `/statistics` — sem mudança de path.

### SocratiCode (validação)

- `codebase_symbols` `matchTeamStats` → `leagues.ts:428/453`; `matchStatistics` → `get-statistics.service.ts:12`; `StatRow` → `statistics.tsx:21`.
- `codebase_search` TEAM_STAT / fouls — confirma inventário ❌ 56 e mapa sem fouls.
- `codebase_graph_query` `get-statistics.service.ts` → importado só por `matches.routes.ts`.
- `codebase_impact matchTeamStats` / `TeamMatchStats` → 0 callers (falso negativo típico de type/tabela exportada); confirmado por leitura + grep de consumidores reais (sync, get-statistics, prognosis lê colunas tipadas via select amplo).
- `codebase_context_search` — inventário confirma quick win 56.

## Mapa de dependências

**Features**

- `depende_de: [DOS-002]` — tabela + include `statistics` + padrão TEAM_STAT.
- `impacta` / re-teste de superfície compartilhada: LIG-019, LIG-020, LIG-021 (mesmo `TeamMatchStats` + `statistics.tsx` + rota).
- `bun run features impact DOS-002` já lista LIG-019/020 + âncora `match_team_stats` compartilhada com MOD-004/005/008/014 — LIG-022 entra na âncora após `features build`.
- W-085 (saves) / W-094 (goal kicks) — irmãos de ampliação TEAM_STAT; **não** `depende_de` deste ID.

**Código**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `leagues.ts#matchTeamStats` (+ col `fouls`) | sync-ingest, sync-sportmonks, get-statistics, prognosis (select amplo) | migrate aplica; inserts não quebram; typecheck |
| `sync-ingest.ts#TEAM_STAT` + upsert `:397-399` | sync-cup via `ingestFixtures` | `db:sync` / cup sync; `count(fouls)` > 0 |
| `sync-sportmonks.ts#TEAM_STAT` + upsert `:704+` | `bun run db:sync` (PL) | mesma prova; **não** esquecer a cópia |
| `shared.ts#TeamMatchStats` | get-statistics, tipos `@workspace/api` → web | shape JSON; typecheck web+api |
| `get-statistics.service.ts#matchStatistics` | `matches.routes.ts` | fetch `/statistics` |
| `statistics.tsx#Statistics` | match-detail tab | agent-browser StatRow "Faltas" (fallback: chrome-devtools) |

## Blast radius e cuidados

- **Filtro `fixtureStatisticTypes`:** ao adicionar `fouls: 56` em `TEAM_STAT`, o ID entra no filtro automaticamente. Se o filtro for ignorado pela API (gotcha DOS-002 C1), o map por type_id ainda seleciona — risco baixo.
- **Confusão freeKicks ↔ fouls:** UI/API/copy usando type 55 como "Faltas" — sintoma: números de cobranças; detectar: comparar com SofaScore fouls vs free kicks; Don't nos passos.
- **Upsert parcial:** se só um dos dois `TEAM_STAT` for atualizado, liga OU copa fica sem fouls — sintoma: `fouls` null numa competição; detectar: query por `league_code`.
- **`hasStats`:** se OR não incluir `fouls`, partida só com fouls (raríssimo sem posse) mostra empty — mitigação P4.
- **Concorrência de branch:** LIG-019/020/021 tocam os mesmos 3 arquivos de superfície — merge conflict esperado; regra: **estender**, não reescrever o type/select/hasStats.
- **Janela pós-migrate pré-sync:** coluna existe, valores null até re-sync — API/UI mostram "—" (ok); não tratar null como 0.
- **prognosis-prompt** continua somando `lineup_player.fouls` até feature futura — sem regressão se não tocarmos o script.

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:467` — `freeKicks` type 55 existe; prova que 56 não é a mesma coluna.
- [código] `apps/api/src/db/sync-ingest.ts:28-29` — `TEAM_STAT` sem fouls; filtro deriva de `TEAM_STAT_IDS`.
- [código] `apps/api/src/db/sync-ingest.ts:397-399` — upsert time-stats não mapeia type 56.
- [código] `apps/api/src/db/sync-sportmonks.ts:58-59` — cópia duplicada de `TEAM_STAT` (ambos os syncs).
- [código] `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts:18-25` — select baseline `possession` (irmãs podem já ter estendido).
- [código] `apps/web/features/leagues/components/match-detail/statistics.tsx:72-87` — `StatRow` + `hasStats` posse.
- [doc] `docs/investigacoes/sportmonks-inventario-completo.md` — type 56 ❌ quick win; type 55 ✅ Free Kicks.
- [doc] `docs/features/dossie/DOS-002-estatisticas-partida-time.md` — casa da tabela; expansão 0018 precedente de ADD COLUMN.
- [wishlist] W-087 + decisão dono 2026-07-23 — coluna oficial, não atalho per-player.

## Detalhes por passo

### §Schema

Coluna aditiva (só-expand), nullable integer, comentário alinhado ao de `freeKicks`:

```ts
fouls: integer("fouls"), // type 56 — faltas cometidas (≠ freeKicks/55 cobranças a favor)
```

Posição sugerida: imediatamente após `freeKicks` (pareamento semântico 55/56). SQL esperado (drizzle-kit gera o nome):

```sql
ALTER TABLE "match_team_stats" ADD COLUMN "fouls" integer;
```

Sem backfill SQL manual — valores vêm do re-sync. Sem contract/drop.

### §Sync

Em **ambos** `TEAM_STAT` objects:

```ts
fouls: 56, // faltas cometidas (≠ freeKicks 55)
```

Nos objetos `ts` do upsert: `fouls: g(TEAM_STAT.fouls)`. `TEAM_STAT_IDS` / `richFilterTypes` atualizam sozinhos.

Prova pós-`db:sync` (dev):

```sql
SELECT count(*) AS rows,
       count(fouls) AS fouls_nn,
       round(avg(fouls)::numeric, 1) AS fouls_avg
FROM match_team_stats;
-- esperado: fouls_nn ≈ rows (FT com statistics); avg tipicamente ~10–15/time (PL)
```

Sanidade vs atalho (não é fonte canônica; só cross-check numa amostra):

```sql
-- opcional: divergência oficial vs SUM lineup_player.fouls (DOS-002 C3: preferir oficial)
```

### §API

`TeamMatchStats` += `fouls: number | null` (comentário type 56). `matchStatistics`: incluir `matchTeamStats.fouls` no `.select` e `fouls: rows.find(...)?.fouls ?? null` no `side()`. **Preserve** campos já no type (shots*, yellow*/red* se LIG-021 mergeado). Campo inglês; UI traduz.

### §Testes (roteiro UI — preferir agent-browser)

**Ferramenta primária:** CLI `agent-browser` (skill `.claude/skills/agent-browser/SKILL.md` → carregar `agent-browser skills get core` antes de rodar). Dono (2026-07-23): preferir agent-browser na verificação de UI.

**Fallback:** chrome-devtools MCP (`navigate_page` / `take_snapshot` / `click` / `list_console_messages` / `list_network_requests`) **só se** `agent-browser` não estiver instalado/`doctor` falhar / Chrome não lançar. Se cair no fallback, declarar explicitamente; nunca afirmar UI verde sem uma das duas ferramentas.

Pré-requisitos: web+api de pé; Auth Clerk se a rota exigir (vault/`state save` do agent-browser ou sessão já logada). Loop canônico: `open` → `snapshot -i` → agir por `@eN` / `find text` → `wait` → re-snapshot.

Escada: empty → bordas → golden.

- **T1 (borda — empty):** `agent-browser open <url-match-NS-ou-sem-stats>` → `wait --load networkidle` → `snapshot -i` → `find text "Estatísticas" click` (ou `@eN` da tab) → `wait --text "Sem estatísticas"` → assert: snapshot/`get text` contém **"Sem estatísticas para esta partida."** e **não** contém linha de valores "Faltas" com números.
- **T2 (borda — fouls null):** partida com posse mas `fouls` null (pré-sync) → abrir aba Estatísticas → `wait --text "Posse"` → assert: aba aberta; se a StatRow "Faltas" renderizar, ambos lados **"—"** (padrão do `StatRow`; não forçar `0`).
- **T3 (golden):** partida FT com `fouls` não-null nos dois lados → aba Estatísticas → `wait --text "Faltas"` → `snapshot` (full ou `-i`) / `find text "Faltas"` → assert observável: label **"Faltas"** + dois valores numéricos casa/fora; posse (e StatRows irmãs se no branch) ainda no snapshot.
- **Fechamento (após T3):** `agent-browser console` sem erro novo de app; `agent-browser errors` vazio (ou só ruído conhecido declarado); `agent-browser network requests --filter statistics` mostra GET `/statistics` **200** (payload com `fouls` já coberto pela Prova P3 — aqui só confirma a rede da UI). `agent-browser close` ao fim.
- Screenshot opcional: `agent-browser screenshot lig022-faltas.png` no golden.

Script API ad-hoc (criar no `/i` se útil): `apps/api/scripts/_probe-lig022-fouls.ts` — pick match com `fouls IS NOT NULL`, `fetch` statistics, assert shape; caso match sem row → ambos null; id inválido → 404.

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-022-faltas-estatisticas-partida.md](../features/ligas/LIG-022-faltas-estatisticas-partida.md) — os passos NÃO são duplicados aqui.
