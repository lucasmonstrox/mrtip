---
id: LIG-022
titulo: Faltas na aba Estatísticas da partida
modulo: ligas
status: planejado
prioridade: P2
facetas:
  dados: planejado
  api: planejado
  ui: planejado
testada: nao
testes: []
depende_de: [DOS-002]
impacta: [LIG-019, LIG-020, LIG-021, LIG-023]
ancoras:
  settings: []
  tabelas: [match_team_stats]
  tools: []
  funcoes:
    - "apps/api/src/db/sync-ingest.ts#TEAM_STAT"
    - "apps/api/src/db/sync-sportmonks.ts#TEAM_STAT"
    - "apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts#matchStatistics"
    - "apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats"
    - "apps/web/features/leagues/components/match-detail/statistics.tsx#Statistics"
  rotas:
    - "GET /v1/matches/:id/statistics"
docs:
  - docs/planos/LIG-022-faltas-estatisticas-partida.md
  - docs/investigacoes/sportmonks-inventario-completo.md
  - docs/features/dossie/DOS-002-estatisticas-partida-time.md
verificado_em: null
atualizado: 2026-07-23
---

# Faltas na aba Estatísticas da partida

## Descrição

Na aba **Estatísticas** do match-detail, mostrar **faltas cometidas** dos dois times (casa×fora). Ingerir SportMonks type **56 Fouls** em `match_team_stats.fouls` (coluna nova), expor no `GET /v1/matches/:id/statistics` e renderizar uma `StatRow` "Faltas". **≠** `freeKicks` (type 55) — faltas a favor / cobranças, já ingeridas. Caminho canônico = total oficial de time (não soma de `lineup_player.fouls`).

Origem: wishlist **W-087** (promovida 2026-07-23). Par disciplinar com **LIG-021** (cartões); irmã de dados **W-085** (saves) fora deste ID.

## Tarefas

- [ ] P1 dados — coluna `fouls` em `matchTeamStats` + migração expand-only
- [ ] P2 dados — `TEAM_STAT.fouls: 56` + upsert nos dois syncs + re-sync
- [ ] P3 api — expor `fouls` em `TeamMatchStats` + `matchStatistics`
- [ ] P4 ui — `StatRow` "Faltas" + `hasStats` inclui a métrica

## Plano (2026-07-23)

Dossiê: [docs/planos/LIG-022-faltas-estatisticas-partida.md](../../planos/LIG-022-faltas-estatisticas-partida.md)

### Objetivo, aceite e non-goals

"Pronto" = type 56 persistido em `match_team_stats.fouls`, devolvido em `GET /statistics` como `home|away.fouls` (`number | null`), e a aba Estatísticas mostra a linha **Faltas** casa×fora (null → "—").

Non-goals: `foulsDrawn` / type 96 ("faltas sofridas"); saves (W-085) / offsides / goal kicks; exibir `freeKicks` como se fossem faltas; atalho `SUM(lineup_player.fouls)` como fonte da aba; consumo no `prognosis-prompt` (faceta `ia`); migrar o prompt de soma per-player → coluna oficial.

Aceite:
- A1 [dados] após migrate + re-sync, `count(fouls)` em `match_team_stats` ≈ linhas FT com statistics → coberto por P1+P2
- A2 [api] `GET /v1/matches/:id/statistics` devolve `home.fouls` e `away.fouls` (`number | null`) → coberto por P3
- A3 [ui] aba Estatísticas mostra "Faltas" com os dois valores (ou "—") → coberto por P4
- A4 [ui] não-regressão: posse e StatRows irmãs (LIG-019/020/021 se no branch) intactas; empty state quando nenhuma métrica → coberto por P4

### Premissas

- Include `statistics` e tabela `match_team_stats` já existem (DOS-002 `feito`).
- Type 56 vem no payload de fixture statistics no tier atual (inventário: "sempre"; quick win).
- `TEAM_STAT` existe em **dois** arquivos (`sync-ingest.ts` exportado + cópia local em `sync-sportmonks.ts`) — ambos precisam do map.
- `TeamMatchStats` / `matchStatistics` / `statistics.tsx` podem já ter campos de LIG-019/020/021 no branch — estender, não reescrever.
- Se uma premissa cair no `/i` (ex.: type 56 0 ocorrências pós-sync): PARAR, atualizar este Plano com a divergência datada.

### Decisões

- D1: **coluna oficial `fouls` (type 56) em `match_team_stats`** — driver: dono 2026-07-23; descartado: só `SUM(lineup_player.fouls)` porque diverge do padrão DOS-002 C3 (oficial de time) e o inventário já marca 56 como quick win de ingestão; pagamos: migração + re-sync.
- D2: **não empilhar saves(57) neste ID** — driver: escopo W-087 só; descartado: migração 56+57 juntas (wishlist sugeria) para manter 1 feature = 1 entregável; pagamos: possível segunda migração em W-085.
- D3: **label UI "Faltas"** — driver: wishlist; descartado: "Faltas cometidas" (verboso) / reusar copy de free kicks; pagamos: usuário precisa do Don't anti-`freeKicks` nos passos.
- Adiadas pro `/i`: ordem da StatRow vs posse/cartões/chutes (sugestão: bloco físico depois de posse / junto de cartões LIG-021); nome exato do arquivo de migração 0043 gerado pelo drizzle-kit; se `db:sync` full ou subset de fixtures pra prova.

### Passos

**P1 [dados] expand + migrate** — em `apps/api/src/db/schemas/leagues.ts#matchTeamStats`, após `freeKicks`, adicionar `fouls: integer("fouls")` com comentário type 56 ≠ freeKicks/55 (detalhe: dossiê §Schema). Rodar `cd apps/api && bun run db:generate` e `bun run db:migrate`. Só-expand (sem contract). Regras: código/coluna em inglês; carimbo `@feature LIG-022` só se for ponto de posse única da coluna (ok no comentário da coluna). Don't: **não** renomeie/reaproveite `free_kicks`; **não** adicione `fouls_drawn`/`saves`; **não** drop de coluna; **não** default `0` no SQL (nullable). Prova: migração contém `ADD COLUMN "fouls"`; `SELECT fouls FROM match_team_stats LIMIT 1` exit 0 (valores ainda null ok).

**P2 [dados] (depende: P1) TEAM_STAT + upsert + re-sync** — em `apps/api/src/db/sync-ingest.ts#TEAM_STAT` e na cópia `apps/api/src/db/sync-sportmonks.ts#TEAM_STAT`, adicionar `fouls: 56`; nos objetos `ts` dos upserts (`sync-ingest.ts` ~397 e `sync-sportmonks.ts` ~704+) mapear `fouls: g(TEAM_STAT.fouls)`. `TEAM_STAT_IDS` / `richFilterTypes` atualizam via `Object.values`. Rodar `cd apps/api && bun run db:sync` (ou sync suficiente pra popular FT). Detalhe: dossiê §Sync. Don't: **não** some `lineup_player` no upsert; **não** grave type 56 em `freeKicks`; **não** atualize só um dos dois `TEAM_STAT`; **não** reintroduza filtro `lineupDetailTypes`. Prova: SQL do dossiê §Sync → `fouls_nn` > 0 e da ordem de `rows` em jogos FT; sample spot-check 1 fixture vs SportMonks/SofaScore fouls (não free kicks).

**P3 [api] (depende: P1; prova numérica depende: P2)** — em `apps/api/src/modules/leagues/shared/shared.ts#TeamMatchStats` adicionar `fouls: number | null` (type 56). Em `get-statistics.service.ts#matchStatistics`, incluir `matchTeamStats.fouls` no `.select` e no `side()` (`?? null`). **Preserve** campos já presentes no type/select (shotsInsidebox/Outsidebox, yellowCards/redCards se LIG-019/020/021 já no arquivo). Atualizar `detail.summary` em `matches.routes.ts` se ainda listar só possession. Regras: pasta-por-endpoint já existe (`get-statistics/`); routes fino (zero regra de negócio); `type`, nunca `interface`; campo em inglês. Don't: **não** selecione `freeKicks` rotulando como fouls; **não** derive de `lineup_player`; **não** use `0` no lugar de null; **não** remova campos das irmãs. Prova: com API de pé, `fetch` `GET /v1/matches/<uuid-com-fouls>/statistics` → `home.fouls`/`away.fouls` numéricos; match sem row → ambos `null`; `bun run typecheck` exit 0.

**P4 [ui] (depende: P3)** — em `apps/web/features/leagues/components/match-detail/statistics.tsx#Statistics`: alargar `hasStats` com OR `fouls != null` (preserve ORs de posse/shots/cards já no arquivo); `<StatRow label="Faltas" home={data.home.fouls} away={data.away.fouls} />` sem `suffix`. Regras: folder-by-feature (`features/leagues/`); tipos via `@workspace/api`; string de UI em português; `type` nos props. Don't: **não** rotule free kicks / "Faltas sofridas"; **não** recrie `StatRow`; **não** importe de outra feature; **não** faça `hasStats` só com fouls apagando posse; **não** mostre `0` forçado quando null. Prova (**preferir agent-browser**): carregar `agent-browser skills get core`; rodar roteiro dossiê §Testes T1→T3 — `open` match FT com fouls → `wait --load networkidle` → abrir tab Estatísticas (`find text "Estatísticas" click` ou `@eN`) → `wait --text "Faltas"` → snapshot contém **"Faltas"** + dois números; `console`/`errors` limpos; `network requests --filter statistics` → GET 200. **Fallback:** chrome-devtools MCP só se agent-browser indisponível — declarar; não afirmar UI verde sem browser real.

### Verificação final

- `bun run typecheck` limpo (raiz)
- **API/dados:** Provas P1–P3 + script/`fetch` — casos: happy (ambos números); um lado null; match sem row (ambos null, 200); id inexistente 404. Assert SQL `count(fouls)`. Sem runner de unidade no repo.
- **Browser real (preferir agent-browser):** roteiro dossiê §Testes T1..T3 (`open` → `snapshot -i` → tab Estatísticas → asserts de texto + `console`/`errors`/`network requests`). Skill: `.claude/skills/agent-browser/SKILL.md` + `agent-browser skills get core`. **Fallback chrome-devtools MCP** se agent-browser não rodar — declarar explicitamente; nunca afirmar UI verde sem uma das duas.
- **E2E Playwright:** n/a (1 StatRow + ingestão; agent-browser + SQL bastam).
- re-teste: posse + LIG-019/020/021 StatRows se no branch; callers `matchStatistics` = `matches.routes.ts`; sync copa (via ingestFixtures) não ficou pra trás.
- último: subagent em contexto fresco revisa o diff contra A1..A4 — reporta só gap; diff fora de schema/migração/sync-ingest/sync-sportmonks/shared/get-statistics/statistics(+summary routes) = achado.

### Pré-mortem e rollback

- C1: `/i` expõe `freeKicks` com label "Faltas" — sintoma: totais de cobranças; mitigação: D3 + Don't P3/P4 + prova spot-check.
- C2: atualiza só `sync-ingest` e esquece `sync-sportmonks` (ou o inverso) — sintoma: PL ou copa sem fouls; mitigação: P2 Don't + prova por liga.
- C3: `hasStats` não inclui `fouls` e alguém testa só fouls — mitigação: critério P4 (baixa probabilidade com posse sempre presente).
- C4: re-sync não roda após migrate — API sempre null; mitigação: A1 exige `fouls_nn` > 0 antes de fechar.
- C5: merge com LIG-019/020/021 apaga campos irmãos — mitigação: Don't "preserve" + verificação final.
- Rollback: schema expand → `DROP COLUMN fouls` (só se ninguém depender); api/ui → `git revert`. Pós-migrate com dados: drop é seguro (aditivo). O rollback NÃO desfaz: histórico de sync já gravado noutros campos.

### Fora de escopo

- W-085 defesas (type 57 Saves) → wishlist (possível LIG-0xx com mesma forma de migração TEAM_STAT).
- `foulsDrawn` (96) / faltas sofridas → só se dono pedir feature nova.
- Trocar soma per-player no `prognosis-prompt` pela coluna oficial → feature `ia` futura `depende_de: [LIG-022]`.

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:467` — `freeKicks` type 55; ausência de coluna fouls
- [código] `apps/api/src/db/sync-ingest.ts:28-29` — `TEAM_STAT` sem 56
- [código] `apps/api/src/db/sync-sportmonks.ts:58-59` — cópia duplicada de `TEAM_STAT`
- [código] `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts:18-25` — select statistics (baseline possession)
- [código] `apps/web/features/leagues/components/match-detail/statistics.tsx:72-87` — StatRow + hasStats
- [doc] `docs/investigacoes/sportmonks-inventario-completo.md` — type 56 Fouls ❌ quick win
- [doc] `docs/features/dossie/DOS-002-estatisticas-partida-time.md` — casa `match_team_stats`
- [wishlist] W-087 + dono 2026-07-23 — canônico = coluna em `match_team_stats`

## Verificação

_(preencher no `/i` / quando status=verificado)_
