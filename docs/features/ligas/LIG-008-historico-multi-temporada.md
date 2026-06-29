---
id: LIG-008
titulo: Histórico multi-temporada (modelo season-aware)
modulo: ligas
status: verificado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P1 # P1 | P2 | P3
facetas:
  dados: feito # schema season + backfill + sync season-aware + 2024/25 ingerida (100% cobertura); 5-seasons inviável (plano SportMonks só tem 3) — máximo viável (2 seasons) entregue
  api: feito # leituras escopadas pela season (liga/time/jogador default corrente + ?season=; partida pela season do jogo) — regressão byte-a-byte verde
  ui: feito # P10: seletor de temporada (default última) em liga/time/jogador, ?season= na URL, substitui o badge — E2E Chrome OK
testada: sim
testes:
  - "P1 migração 0007 aplicada — \\d season (7 cols), match.season_id + standing.season_id nullable (2026-06-29)"
  - "P2 backfill — 380 match + 20 standing taggados (0 null); migração 0008 troca standing.unique p/ (season_id, team_id) (2026-06-29)"
  - "P3 regressão — curl /standings /scorers /rounds /:code idênticos ao baseline pré-refactor; ?season=corrente igual; /seasons ok; season inválida → 404 (2026-06-29)"
  - "P4 regressão — /teams/:slug pré-existente idêntico (del .seasons); campo aditivo seasons presente; get-match (LIG-006/005) intacto (2026-06-29)"
  - "P5 regressão — /players/:id idêntico (del .seasons); seasons aditivo; Haaland 27g/36apps sane (2026-06-29)"
  - "P6 regressão — /matches/:id/{goal-timing,scorers,absence-impact} idênticos byte-a-byte; form válido (2026-06-29)"
  - "A2 final — removendo slug (LIG-009 concorrente) e o campo aditivo seasons, standings/team/player IDÊNTICOS ao baseline pré-refactor: season-scoping transparente (2026-06-29)"
  - "revisor contexto fresco — 1 bug real (currentSeasonId não-determinístico c/ múltiplas isCurrent) CORRIGIDO: orderBy(desc(startYear)) + sync demota outras seasons; demais categorias limpas (2026-06-29)"
  - "typecheck apps/api limpo + lint 0 erros após cada passo P1–P7 (2026-06-29)"
  - "P10 E2E Chrome (chrome-devtools MCP) — /leagues/PL: select 'Temporada' no header (substitui o badge); trocar escreve ?season= e a página refetcha escopada, console limpo; /teams/arsenal mostra o select. typecheck/lint dos arquivos web 0 erros (2026-06-29)"
  - "P8 ingestão 2024/25 (id 23614) via scripts/sync-old-season.ts — 380 jogos (0 sem resultado), 760 lineups, 1115 gols, 1597 cartões, 3365 desfalques; cobertura 100% lineup/eventos/desfalque; 137s (2026-06-29)"
  - "separação no banco — 2 seasons (25/26 corrente, 24/25 não), 380 match cada, 0 season_id null, 40 standings; 0 slugs duplicados (slug do LIG-009 inclui a season) (2026-06-29)"
  - "API por season — /standings default Arsenal 85pts (corrente intacta); ?season=23614 → Liverpool 84pts campeão, Southampton lanterna, Salah 29 gols (dado histórico correto) (2026-06-29)"
  - "P8 E2E Chrome — /leagues/PL?season=23614 renderiza a tabela 2024/25 real (Liverpool 1º, rebaixados Leicester/Ipswich/Southampton), slugs premier-league-2024-2025-*, console 0 erros (2026-06-29)"
  - "split casa/fora multi-temporada (objetivo de origem) — 2024/25: 51.6% casa (575/540); 2025/26: 55.5% casa (580/465) (2026-06-29)"
depende_de: [] # fundacional — não depende de nada
impacta: [LIG-001, LIG-002, LIG-006, LIG-007, MOD-003, SIN-016] # tudo que lê match/standing por leagueCode
ancoras:
  settings: []
  tabelas: [season, match, standing, league] # cria season; adiciona seasonId em match/standing
  tools: []
  funcoes: [loadMatches, loadTeamStanding, loadTeamMatches, loadGoalTiming, loadAbsenceImpact, currentSeasonId, resolveSeason, seasonsOf]
  rotas: [/v1/leagues/:code, /v1/leagues/:code/seasons, /v1/leagues/:code/standings, /v1/leagues/:code/rounds, /v1/leagues/:code/scorers, /v1/teams/:slug, /v1/players/:id]
docs:
  - docs/planos/LIG-008-historico-multi-temporada.md
verificado_em: 2026-06-29
atualizado: 2026-06-29
---

# Histórico multi-temporada (modelo season-aware)

## Descrição

Hoje o sistema é **single-season por liga**: o sync (`sync-sportmonks.ts:16`) tem `SEASON_ID` hardcoded
(25583 = 2025/26) e o produto inteiro lê partidas só por `leagueCode` (`shared.ts:490`,
`loadMatches`), sem nenhum discriminador de temporada. Isso significa que ingerir uma temporada
antiga com o sync atual **não acumula histórico — mistura e sobrescreve**: a tabela computada
(`computeStandings`/`computeForm`), rounds, artilharia e goal-timing passariam a somar 2 temporadas
no mesmo `leagueCode='PL'`, e tanto a linha de `league` (1 por código, 1 `sportmonksSeasonId`) quanto
`standing` (`unique(leagueCode, teamId)`) seriam reescritas pela temporada antiga.

Objetivo: trazer **5 temporadas para trás (até 2020/21)** com **a mesma profundidade da atual**
(partidas, placares, lineups, eventos/gols, cartões, desfalques, venues, standings oficiais) e fazer
o sistema **separar as temporadas** — modelando direito, não gambiarra. Isso exige: (1) uma entidade
`season` própria; (2) um discriminador de temporada em `match` e `standing`; (3) refatorar
`loadMatches` e os consumidores (`computeStandings`, `computeForm`, rounds, scorers, goal-timing) pra
filtrar a **temporada corrente** por padrão, com a opção de pedir uma temporada específica; (4)
parametrizar o sync pra rodar sobre uma **lista de seasons**, mantendo idempotência por `sportmonks_*_id`.

Habilita o split casa/fora multi-temporada e dá base histórica pra modelos (força entre temporadas →
MOD-003, mando de campo → SIN-016). `match` e `standing` são as **âncoras mais compartilhadas** do
INDEX (match = 8 features) → mudança de alto blast radius; segue por `/pl` antes do código.

## Tarefas

- [x] P1 dados — entidade `season` + `match.seasonId`/`standing.seasonId` (nullable, expand) + migração
- [x] P2 dados — backfill da season corrente + troca `standing.unique` para `(seasonId, teamId)`
- [x] P3 api — liga season-aware: `resolveSeason` + `loadMatches`/`scorers`/rounds/getLeague por season + `?season=` + lista de seasons
- [x] P4 api — página do time season-aware: `loadTeamStanding`/`loadTeamMatches` por season + `?season=` + seasons do time
- [x] P5 api — página do jogador season-aware: `getPlayerDetail` por season + `?season=` + seasons do jogador
- [x] P6 api — leituras de partida pela season da própria partida (`loadGoalTiming`, `loadTeamScorers`, desfalques) via `m.seasonId`
- [x] P7 dados — sync season-aware da CORRENTE (cria `season` row, tagga match/standing, corrige target do upsert p/ `(seasonId,teamId)` + demote). Laço multi-season **dispensado**: só existia 1 season antiga real → feito via script standalone (sem colidir com LIG-009)
- [x] P8 dados — ingerida a 2024/25 (id 23614) via `scripts/sync-old-season.ts`: 380 jogos, **cobertura 100%** (lineup/eventos/desfalque), 137s. Banco: 2 seasons separadas, corrente intacta
- [~] P9 dados — **REFUTADO**: o plano SportMonks só expõe **3 seasons** (24/25, 25/26, 26/27). Não há 2023/24→2020/21 — dado histórico inexistente na assinatura. Máximo viável = 2 seasons (feito). 2026/27 é futura (dono dispensou)
- [x] P10 ui — seletor de temporada (default = última) no topo de liga/time/jogador (substitui o badge da season); E2E Chrome OK

## Plano (2026-06-29)

Dossiê: [docs/planos/LIG-008-historico-multi-temporada.md](../../planos/LIG-008-historico-multi-temporada.md)

### Objetivo, aceite e non-goals

"Pronto" = 6 seasons da PL (2020/21→2025/26) ingeridas com a profundidade da atual; o sistema separa por season; liga, time e jogador têm seletor de temporada (default = última) sem regredir o estado atual.
Non-goals: rótulo "COVID/sem público" (consumido por SIN-016, não aqui); 2ª liga (resolver assume PL com TODO); `seasonId` `notNull` (contract = feature futura); comparativo cross-season na mesma tela.
Aceite (cada critério aponta a Prova):
- A1 [dados] cada `match`/`standing` tem `seasonId`; standings não colidem entre seasons → P2
- A2 [api] com 1 season, todos os endpoints (liga/time/jogador/partida) idênticos ao pré-refactor → P3, P4, P5, P6
- A3 [dados] 6 seasons separadas; `select name, count(*) from match join season` ≈ 380/season; a classificação **corrente** continua só com os 20 times de 2025/26 → P8, P9
- A4 [ui] em liga, time e jogador o default é a última season e o seletor no topo troca pra uma antiga, mostrando os dados daquela season → P10

### Premissas

- `match`/`standing` são as únicas tabelas que precisam de `seasonId` (gol/cartão/lineup/injury herdam via FK de `match`) — confirmado no terreno.
- A invariante "standings antes de matches, time tem de estar nas standings" (`sync-sportmonks.ts:366`) vale por-season → rodar o pipeline inteiro por season a preserva.
- PL é a única liga hoje → `resolveSeason` pode assumir `code="PL"` nas leituras de time/jogador (TODO multi-liga explícito). Se entrar 2ª liga antes do `/i`: PARAR e generalizar.

### Decisões

- D1: season como **entidade própria + `seasonId` em match/standing**, `leagueCode` segue "PL" — driver: dono pediu "bem modelado, separar"; descartado: codificar season no `leagueCode` ("PL-2024") porque quebra URLs e o contrato de domínio; pagamos: um resolver a mais nas leituras.
- D2: season corrente via flag **`season.isCurrent`** (uma true por liga); descartado: 2º ponteiro `league.currentSeasonId` porque duplica fonte de verdade.
- D3: leituras de **partida** janelam por `m.seasonId` (não pela corrente) — a stat "da temporada" de um jogo de 2021 tem de ser de 2021.
- D4: liga/time/jogador são **season-scoped com default na última + `?season=`** (dono nesta conversa) — descartado: carreira agregada (muda significado das telas) e travar-na-corrente (dono quer trocar). Cada um expõe a lista de seasons que tem dado, pro switcher.
- Adiadas pro /i: nomes exatos dos helpers, derivação de `startYear` do nome, lista de season ids (vem da API em runtime), micro-UI do seletor (componente compartilhado vs por-página).

### Passos

**P1 [dados] esqueleto schema** — `apps/api/src/db/schemas/leagues.ts`: criar tabela `season` + `match.seasonId`/`standing.seasonId` nullable (detalhe: dossiê §Schema). Gerar e aplicar migração (expand puro). Prova: `cd apps/api && bun run db:generate && bun run db:migrate` → exit 0; `psql -c "\d season"` lista as colunas e `\d match` mostra `season_id`.
**P2 [dados] (depende: P1) backfill + unique** — script/SQL: inserir a season corrente da `league`, setar `season_id` em todas as `match`/`standing`, trocar `standing.unique(leagueCode,teamId)`→`(seasonId,teamId)` (detalhe: dossiê §Backfill). Critério de avanço: zero `season_id` null ANTES de criar o unique novo. Prova: `psql -c "select count(*) from match where season_id is null"` → 0; idem standing; `\d standing` mostra o unique `(season_id, team_id)`.
**P3 [api] (depende: P2) liga season-aware** — `shared.ts`: helpers `currentSeasonId(code)`/`resolveSeason(code, season?)`/`seasonsOf(code)`; `loadMatches` e `scorers.service.ts#scorers` filtram pela season resolvida; `?season=` (opcional) nas rotas `/standings`,`/rounds`,`/scorers`,`/:code`; rota que lista seasons da liga (detalhe: dossiê §Resolver). Falha provável: esquecer um consumidor → mistura silenciosa; correção: Prova é regressão byte-a-byte. Prova: API no ar, `curl -s localhost:3001/v1/leagues/PL/standings | jq 'length'` → 20; `/standings`,`/scorers`,`/rounds` **idênticos** ao snapshot pré-mudança (diff vazio); `curl '.../standings?season=<corrente>'` igual ao sem param.
**P4 [api] (depende: P3) página do time season-aware** — `shared.ts`: `loadTeamStanding`/`loadTeamMatches` recebem `seasonId`; `get-team.service.ts#getTeam` resolve via `resolveSeason("PL", query.season)` e devolve as seasons do time (distinct `seasonId`). `?season=` na rota `/teams/:slug`. Prova: `curl /v1/teams/<slug>` idêntico ao pré-mudança; `curl '.../teams/<slug>?season=<corrente>'` igual; payload traz a lista de seasons do time.
**P5 [api] (depende: P3) página do jogador season-aware** — `shared.ts#getPlayerDetail` recebe `seasonId` e filtra `goal`/`lineupPlayer` por `match.seasonId`; devolve as seasons em que o jogador tem aparição. `?season=` na rota `/players/:id`. Prova: `curl /v1/players/<id>` idêntico ao pré-mudança (só 1 season hoje); payload traz a lista de seasons do jogador.
**P6 [api] (depende: P2) leituras de partida** — `shared.ts`: `loadGoalTiming`/`loadTeamScorers`/`loadMatchAbsences`/`loadAbsenceImpact` janelam por `m.seasonId` no lugar de `m.leagueCode`; ajustar `get-goal-timing`/`get-scorers`/`get-absence-impact` que passam o argumento. Prova: `curl /v1/matches/<id>/{goal-timing,scorers,absence-impact}` idênticos ao pré-mudança.
**P7 [dados] (depende: P2) sync por season** — `sync-sportmonks.ts`: extrair `syncSeason(leagueId, code, sportmonksSeasonId)`; `main()` busca seasons via `/leagues/8?include=seasons` e itera as N alvo (detalhe: dossiê §Sync por season). Setar `seasonId` nos upserts de match/standing; `isCurrent` só na mais recente. **Coordenação LIG-009**: se `match.slug` já existir, `syncSeason` DEVE chamar `matchSlug(...)` no upsert da match com o nome da season iterada — senão temporada antiga entra com slug null e viola o `notNull`. Prova: `bun run db:sync` (só a corrente) → loga 380 matches; `psql -c "select count(*) from season where is_current"` → 1; matches/standings inalterados.
**P8 [dados] (depende: P7) uma season antiga + cobertura** — rodar `syncSeason` para 2024/25; medir cobertura de lineups/eventos/sidelined (SportMonks pode ter dado parcial). Prova: `psql -c "select s.name, count(*) from match m join season s on s.id=m.season_id group by 1"` → 2 linhas ~380; standings da liga ainda só 2025/26 (20 times); anotar `% matches com lineup` e `% com eventos` da antiga (registrar, não bloquear).
**P9 [dados] (depende: P8) demais seasons** — ingerir 2023/24, 2022/23, 2021/22, 2020/21 (5 antigas no total). Prova: `psql -c "select count(*) from season"` → 6; `select name, count(*) from match join season … group by 1` → 6 linhas ~380.
**P10 [ui] (depende: P4, P5) seletor de temporada** — componente de seletor (default = última season) no topo das páginas de **liga, time e jogador** (`apps/web/features/leagues/...`), ligado ao `?season=` via query da rota; lista vinda do payload de cada página. Prova: `bun run typecheck` exit 0; E2E Chrome (chrome-devtools MCP) — em `/leagues/PL`, time e jogador, trocar pra 2024/25 mostra os dados daquela season (campeão/forma/gols corretos), console limpo.

### Verificação final

- `bun run typecheck` limpo (raiz, 3/3)
- regressão pré/pós-refactor (1 season): snapshots `curl` de `/standings`,`/scorers`,`/rounds`,`/teams/<slug>`,`/players/<id>`,`/matches/<id>/{goal-timing,scorers,absence-impact}` → diff vazio (P3–P6)
- asserts no banco: `season`=6, `match.season_id` 100% preenchido, standings ~20/season (P2/P8/P9)
- golden path Chrome: 1. abrir `/leagues/PL` (default última); 2. trocar a season no seletor; 3. repetir em uma página de time e de jogador; 4. observar dados daquela season (P10)
- re-teste da lista `features impact LIG-008`: LIG-001 (jogador), LIG-002 (time), LIG-006 (snapshot classificação), LIG-007 (desfalques) no Chrome sem regressão
- último passo: subagent em contexto fresco revisa o diff contra A1..A4 — diff fora dos paths deste plano = achado

### Pré-mortem e rollback

- C1: **cobertura SportMonks parcial** em seasons antigas (lineups/eventos faltando) — sintoma: páginas de partida antigas sem escalação/timeline; mitigação: P8 mede antes de P9 e o dado faltante degrada gracioso (read-model já trata vazio, ex. `loadMatchLineups` retorna []).
- C2: **rate limit / custo** ao puxar 5 seasons com includes pesados — sintoma: sync 429/timeout; mitigação: P8 valida uma; P9 roda por season, idempotente (re-roda de onde parou).
- C3: **consumidor de leitura esquecido** sem escopo de season — sintoma: número de uma tela "infla" depois do P8; mitigação: regressão byte-a-byte em P3–P6 trava isso ANTES de qualquer dado antigo entrar.
- C4: **resolver assume PL** — sintoma: 2ª liga mostra season errada; mitigação: `// TODO multi-liga` explícito + premissa de PARAR se entrar 2ª liga.
Rollback por classe: api/ui pura (P3–P6, P10) → `git revert`; schema (P1/P2) → expand reverte com drop das colunas/unique; **dados ingeridos (P8/P9) não se desfazem por revert** — exigem `delete from match/standing where season_id in (antigas)` + re-sync da corrente.
O rollback NÃO desfaz: imagens já subidas no R2 (venues/players de seasons antigas) — ficam órfãs, custo desprezível.

### Fora de escopo

- Comparativo cross-season na mesma tela (ex.: sobrepor forma de 2 anos) → feature futura (depende_de: [LIG-008]).
- `seasonId` `notNull` (contract) → checkbox futuro, depois de 100% backfillado e estável.
- Rótulo "COVID / sem público" nas seasons 2020/21 → consumido por SIN-016, não aqui.

## Evidências

- [código] `apps/api/src/db/sync-sportmonks.ts:15-17` — `LEAGUE_ID`/`SEASON_ID`/`CODE` hardcoded; o sync conhece **uma** temporada só. Ponto a parametrizar.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:487-492` — `loadMatches(code)` filtra **só** por `match.leagueCode`, sem temporada; é a base de standings, rounds e form → onde a mistura de temporadas vaza.
- [código] `apps/api/src/modules/leagues/standings/standings.service.ts:14` — `computeStandings(loadMatches(code))`: a classificação é derivada de TODAS as partidas do `leagueCode` → somaria temporadas.
- [código] `apps/api/src/db/schemas/leagues.ts:6-15` — `league` tem PK `code` e **um** `sportmonksSeasonId`: a entidade conflaciona liga+temporada; sync de season antiga sobrescreve o header.
- [código] `apps/api/src/db/schemas/leagues.ts:128` — `standing` é `unique(leagueCode, teamId)`: uma classificação por time por liga → re-sync de outra temporada substitui a tabela oficial atual.
- [código] `apps/api/src/db/schemas/leagues.ts:58-85` — `match` tem `leagueCode` mas **nenhuma** coluna de temporada; `sportmonksFixtureId` é único por fixture (acumula entre temporadas, mas sem como separar).
- [banco] 2026-06-29 (`select`): PL 2025/26 = 380 partidas, todas `FT` (1 temporada completa) — baseline a preservar no backfill.

## Verificação

Estado em 2026-06-29 (em-andamento — P1–P6 feitos+verificados, P7 parcial, P8–P10 pendentes):

- **dados (P1/P2):** migração `0007` (tabela `season` + `match.season_id`/`standing.season_id` nullable) e `0008` (troca `standing.unique` → `(season_id, team_id)`) aplicadas. Backfill (`scripts/backfill-season.ts`): 380 match + 20 standing taggados, **0 null**; `season` com 1 linha `is_current`.
- **api (P3–P6):** todas as leituras escopadas por season. **Regressão byte-a-byte** contra snapshots pré-refactor (`scripts/.lig008-baseline/`): com 1 season, `/standings`,`/scorers`,`/rounds`,`/leagues/PL`,`/teams/:slug`,`/players/:id`,`/matches/:id/{goal-timing,scorers,absence-impact}` **idênticos** (após remover o `slug` do LIG-009 concorrente e o campo aditivo `seasons`). `?season=<corrente>` = sem param; season inválida → **404**; `/leagues/PL/seasons` lista a season. Smoke: 12 endpoints → 200. typecheck limpo, lint 0 erros.
- **P7 (parcial):** sync passa a criar a `season` row (isCurrent, demovendo as outras), tagga `match`/`standing` com `seasonId` e corrige o target do upsert de standing p/ `(seasonId,teamId)`. Verificado por typecheck; **re-sync completo (`db:sync`) ainda não rodado** (quota SportMonks + colisão com LIG-009 ao vivo no `main()`). Laço multi-season pendente.
- **ui (P10):** seletor de temporada (componente `SeasonSwitcher` + hook `useSeasonParam` lendo/escrevendo `?season=`) no topo de liga/time/jogador, **substituindo o badge da season** (pedido do dono). E2E Chrome: o select aparece no header da liga e do time mostrando "2025/2026"; com uma 2ª season temporária, trocar escreve `?season=` e a página refetcha escopada (classificação vazia p/ a season sem jogos); console limpo. Os 6 hooks de query passaram a threadar `season`.
- **revisor (contexto fresco):** 1 achado real (currentSeasonId não-determinístico se houver 2+ `isCurrent`) **corrigido**; categorias 1–6 restantes limpas.
- **dados antigos (P8):** `scripts/sync-old-season.ts` ingeriu a **2024/25 (id 23614)** — 380 jogos, **cobertura 100%** (lineup/eventos/desfalque), 137s. Banco: 2 seasons separadas (corrente intacta, Arsenal 85pts; antiga Liverpool 84pts/Salah 29g). E2E Chrome: `/leagues/PL?season=23614` mostra a tabela real 2024/25 com os rebaixados (Leicester/Ipswich/Southampton). Split casa/fora agora multi-temporada (24/25=51.6% / 25/26=55.5%).

## Refutado

- **"5 seasons até 2020/21" é inviável** — `GET /leagues/8?include=seasons` (2026-06-29) retorna **só 3 seasons** no plano SportMonks da conta: 2024/25 (23614), 2025/26 (25583), 2026/27 (28083). Não há 2023/24, 2022/23, 2021/22 nem 2020/21 — dado histórico **não existe na assinatura**, não é questão de ingerir. Máximo viável de histórico = **2 temporadas** (24/25 + 25/26), entregue. A premissa do plano (A3 "6 seasons / 2020/21") caiu na execução; o aceite real virou "todas as seasons disponíveis". 2026/27 é futura (sem resultados ainda) e o dono dispensou.
