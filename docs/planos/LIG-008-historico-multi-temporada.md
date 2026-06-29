# LIG-008 — Histórico multi-temporada (modelo season-aware) · dossiê de planejamento (2026-06-29)

Feature: [docs/features/ligas/LIG-008-historico-multi-temporada.md](../features/ligas/LIG-008-historico-multi-temporada.md)
Base: commit `eec3e64` (2026-06-29) — todo file:line deste doc vale neste commit.

## TL;DR

Hoje o produto é **single-season por liga**: o sync tem `SEASON_ID` hardcoded e todo o read-model
janela stats por `match.leagueCode` (string "PL"), sem temporada. Ingerir uma season antiga com o
sync atual **mistura e sobrescreve**. A solução é **season-aware**: criar a entidade `season`,
adicionar `seasonId` em `match` e `standing`, marcar uma season como corrente, e **escopar as
leituras pela temporada** (corrente por padrão nas telas de liga/time; pela season da própria
partida nas telas de jogo). Aí o sync vira um **laço por season** (lista vinda de
`/leagues/8?include=seasons`) que ingere 5 temporadas anteriores (até 2020/21) com a mesma
profundidade da atual. Decisão central cravada: `leagueCode` continua "PL" (URL intacta); a season
corrente é resolvida via `season.isCurrent` — não se inventa código de liga por ano.

## Briefing — o que já foi falado e decidido

- **Trazer tudo que temos pra season atual, mas das passadas** (partidas, placares, lineups, eventos/gols, cartões, desfalques, venues, standings oficiais) — dono nesta conversa (2026-06-29).
- **O sistema tem que SEPARAR as temporadas e estar bem modelado** (não gambiarra) — dono nesta conversa (2026-06-29). → justifica a entidade `season` própria + discriminador, não um hack no `leagueCode`.
- **5 temporadas para trás, até 2020/21** — dono nesta conversa (2026-06-29). Inclui as seasons COVID (2020/21 sem público) — útil ter, mas distorce média de mando se misturada sem rótulo (relevante pro consumo em SIN-016/MOD-003, não pra esta feature).
- **Objetivo de origem**: habilitar o split casa/fora multi-temporada (lookup que disparou isto) e base histórica pra modelos — dono nesta conversa.
- **Página do jogador E do time: default = última season (corrente), com SELETOR no topo pra trocar de season** — dono nesta conversa (2026-06-29). → ambas viram season-scoped com `?season=` (default corrente) + lista das seasons que a entidade tem dado, alimentando o switcher. **Não** é carreira agregada (rejeitado) nem travado-na-corrente. Mesma mecânica do seletor da página da liga.

## Estado do terreno

**Schema** (`apps/api/src/db/schemas/leagues.ts`, pino `eec3e64`):
- `league` (`:6-15`): PK `code` ("PL"), **um** `sportmonksSeasonId` + `season` (nome). A entidade conflaciona liga+temporada; vira o ponteiro denormalizado da season corrente.
- `match` (`:58-85`): tem `leagueCode` (FK), **nenhuma** coluna de season. `sportmonksFixtureId` único por fixture (acumula entre seasons; mas sem como separar nas queries).
- `standing` (`:90-129`): `unique(leagueCode, teamId)` (`:128`) — **colide** com multi-season (o mesmo time aparece em várias temporadas). Tem de virar `unique(seasonId, teamId)`.
- `goal`/`card`/`lineup`/`injury` penduram em `match` via FK → herdam a season da partida sem coluna própria.

**Read-model** (`apps/api/src/modules/leagues/shared/shared.ts`) — todos janelam por `leagueCode` ou nada:
- `loadMatches(code)` (`:490-495`): `where(eq(match.leagueCode, code))` — base de **standings, rounds, getLeague, form de liga**. Mistura seasons.
- `scorers(code)` service (`scorers/scorers.service.ts:23-83`): 3 queries com `eq(match.leagueCode, code)` — artilharia da liga.
- `loadGoalTiming(home, away, leagueCode, side)` (`:952-1038`): janela por `match.leagueCode`; chamado com `m.leagueCode` (`get-goal-timing/get-goal-timing.service.ts:15`). Deve usar `m.seasonId` (stats da season DAQUELA partida).
- `loadTeamScorers(team, leagueCode, limit)` (`:1044-1080`): idem, match-page; passado `m.leagueCode` no `get-scorers`.
- `loadMatchAbsences` (`:1111-1215`) e `loadAbsenceImpact` (`:1225-1356`): usam `m.leagueCode` pra "gols até a data" → devem usar `m.seasonId` (anti-leak DENTRO da season).
- `loadTeamStanding(teamId)` (`:739-779`): `select … where(eq(standing.teamId, teamId)).limit(1)` — **quebra** com multi-season (retorna uma row arbitrária). Tem de receber `seasonId` (default corrente).
- `loadTeamMatches(id)` (`:783-788`): `where(or(home,away))`, sem liga/season — passa a misturar todas as seasons do clube. Recebe `seasonId` (default corrente).
- `getPlayerDetail(id)` (`:515-718`): sem filtro de liga/season — passa a receber `seasonId` (default corrente) e a filtrar os `goal`/`lineupPlayer` por `match.seasonId`; também devolve a lista de seasons em que o jogador tem aparição (pro switcher).

**Sync** (`apps/api/src/db/sync-sportmonks.ts`): `LEAGUE_ID=8`/`SEASON_ID=25583`/`CODE="PL"` hardcoded (`:15-17`); `main()` (`:220-587`) faz league→standings→fixtures→players→lineups→goals/cards→sidelined para UMA season. Invariante a preservar: standings são buscadas ANTES das matches (`:242` antes de `:359`), e o loop de matches lança se um time não está nas standings (`:366`) — vale por-season, então rodar o pipeline inteiro por season mantém a invariante.

**Migrações**: Drizzle-kit, padrão expand em `apps/api/src/db/migrations/` (ex. `0003_shiny_jocasta.sql` criou `venue` + `match.venue_id`); gera com `bun run db:generate`, aplica com `bun run db:migrate`. Última = `0006`.

## Mapa de dependências

**Features** (âncoras `match`/`standing` do INDEX.md):
- LIG-002 (página do time) ← consome `loadTeamStanding`/`loadTeamMatches`/`computeForm`/`computeTeamTrends`; quebra sem escopo de season.
- LIG-006 (snapshot classificação na partida) ← `loadTeamStanding` + standings computadas.
- LIG-001 (página do jogador) ← `getPlayerDetail` (semântica carreira vs season).
- LIG-007 (impacto desfalques) ← `loadAbsenceImpact` (janela por season).
- SIN-016 (mando de campo) / MOD-003 (força entre ligas) ← consumidores futuros do histórico (o porquê desta feature ser P1).

**Código** (símbolos alterados → callers):

| Alvo (path#símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `shared.ts#loadMatches` | standings, list-rounds, get-league, form services | classificação/rounds idênticas com 1 season |
| `shared.ts#loadTeamStanding` | get-team, get-match (LIG-006) | standing do time = season corrente |
| `shared.ts#loadTeamMatches` | get-team | matches/trends/form do time = season corrente |
| `shared.ts#loadGoalTiming` | get-goal-timing | timing usa season da partida |
| `shared.ts#loadTeamScorers` | get-scorers (match page) | scorers da season da partida |
| `shared.ts#loadAbsenceImpact`,`#loadMatchAbsences` | get-absence-impact, get-injuries | desfalques anti-leak dentro da season |
| `scorers.service.ts#scorers` | leagues.routes `/scorers` | artilharia da liga = season corrente |
| `standing` unique | sync upsert (`sync-sportmonks.ts:295-298`) | upsert por (seasonId, teamId) |

## Blast radius e cuidados

- **`standing.unique(leagueCode, teamId)` → `(seasonId, teamId)`** — sintoma se errar: o upsert do sync sobrescreve standings entre seasons (só sobra a última ingerida); detectar: `select season_id, count(*) from standing group by 1` deve dar ~20 por season.
- **`loadTeamStanding` LIMIT 1 sem season** — sintoma: página do time/LIG-006 mostram standing de uma season aleatória; detectar: abrir um time e conferir pontos vs season corrente.
- **Funções match-level passando `leagueCode`** — sintoma: goal-timing/scorers/desfalques de uma partida de 2025/26 misturam números de 2021; detectar: regressão (endpoint idêntico ao pré-mudança com 1 season só) em P3/P4.
- **Janela de transição do schema**: `seasonId` nasce nullable; enquanto não backfillado, queries escopadas por season retornam vazio. Por isso backfill (P2) vem antes de escopar leituras (P3/P4) e antes de qualquer season antiga (P6).
- **Custo/cobertura SportMonks (risco externo)**: 5×~380 fixtures com includes pesados (lineups.details, events, sidelined, venue) = muitas chamadas; o plano da SportMonks pode ter cobertura PARCIAL de lineups/eventos em seasons antigas. Mitigação: P6 ingere **UMA** season antiga e mede cobertura antes de P7 puxar as 5.
- **Times rebaixados de seasons antigas** entram em `team` (dedup por `sportmonksTeamId`, ok) mas não estão na PL corrente → página deles (escopada à corrente) fica vazia. Aceito (não são PL hoje).

## Evidências

- [código] `apps/api/src/db/sync-sportmonks.ts:15-17` — `SEASON_ID` hardcoded: o sync conhece uma season só; ponto a parametrizar.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:490` — `loadMatches` filtra só por `leagueCode`: onde a mistura de seasons vaza para standings/rounds/form.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:739-740` — `loadTeamStanding` faz `where(teamId).limit(1)`: quebra determinístico com multi-season.
- [código] `apps/api/src/db/schemas/leagues.ts:128` — `unique(leagueCode, teamId)` em `standing`: colisão multi-season, precisa virar `(seasonId, teamId)`.
- [código] `apps/api/src/modules/leagues/get-goal-timing/get-goal-timing.service.ts:15` — passa `m.leagueCode` pro window; vira `m.seasonId`. Mesmo padrão em get-scorers/get-absence-impact.
- [código] `apps/api/src/db/migrations/0003_shiny_jocasta.sql` — molde do expand (tabela nova + coluna FK nullable em `match`).
- [banco] 2026-06-29 (`select`): PL 2025/26 = 380 partidas FT, 20 standings — baseline a preservar no backfill e na regressão.

## Detalhes por passo (referenciados pelo ## Plano)

### §Schema (P1) — entidade `season` + discriminadores (expand, nullable)
Em `apps/api/src/db/schemas/leagues.ts`:
- Nova tabela `season`: `id uuid pk`, `sportmonksSeasonId integer notNull unique`, `leagueCode text notNull → league.code`, `name text notNull` ("2024/2025"), `startYear integer notNull` (ordenação/rótulo), `isCurrent boolean notNull default false`. Molde: `team:21`/`venue:40`.
- `match.seasonId uuid → season.id` **nullable** (molde `match.venueId:75`).
- `standing.seasonId uuid → season.id` **nullable** (por enquanto; unique trocado no P2).
- `bun run db:generate` → revisar o SQL (expand puro: 1 CREATE + 2 ADD COLUMN, nenhum DROP) → `bun run db:migrate`.

### §Backfill (P2) — popular a season corrente + trocar unique
- Inserir a season corrente a partir da `league` atual: `season` row com `sportmonksSeasonId = league.sportmonksSeasonId`, `name = league.season`, `isCurrent = true`, `startYear` derivado do nome.
- `update match set season_id = <corrente>` (todas, são 1 season) e `update standing set season_id = <corrente>`.
- Migração de constraint: `drop` do `unique(leagueCode, teamId)` em `standing`, `add unique(seasonId, teamId)`. **Critério de avanço:** `select count(*) from match where season_id is null` = 0 e idem standing ANTES de criar o unique novo.

### §Resolver de season (P3) — ponto único, default corrente
Helpers em `shared.ts`:
- `currentSeasonId(code): Promise<string>` — `select id from season where leagueCode=code and isCurrent`.
- `resolveSeason(code, sportmonksSeasonId?): Promise<string>` — se veio o param (da query `?season=`), resolve a `season.id` por `sportmonksSeasonId`; senão cai no `currentSeasonId(code)`. Param inválido → 404 (`season_not_found`).
Toda leitura escopada por season passa a receber o `seasonId` resolvido e filtrar `match.seasonId`/`standing.seasonId`:
- **Liga** (`loadMatches`, `scorers`, rounds, getLeague) — `resolveSeason(code, query.season)`.
- **Time** (`loadTeamStanding`, `loadTeamMatches`) — recebem só teamId hoje; passam a receber `seasonId`. Liga do time = PL única → `resolveSeason("PL", query.season)`; `// TODO multi-liga` quando houver 2ª.
- **Jogador** (`getPlayerDetail`) — recebe `seasonId`; filtra `goal`/`lineupPlayer` por `match.seasonId`.
- **Lista pro switcher**: `seasonsOf(code)` (todas as seasons da liga, desc) e, nas páginas de time/jogador, as seasons em que a entidade tem dado (distinct `seasonId` via match/lineup) — alimenta o seletor sem oferecer season vazia.

### §Sync por season (P5)
Extrair o corpo de `main()` (`sync-sportmonks.ts:220-587`) para `syncSeason(leagueId, code, sportmonksSeasonId)`; `main()` busca `/leagues/${LEAGUE_ID}?include=seasons`, ordena por data desc, pega as N alvo, e chama `syncSeason` em laço. Cada `syncSeason` faz upsert da `season` row (isCurrent só na mais recente) e seta `seasonId` no upsert de `match` (`:370-382`) e `standing` (`:269-294`). Idempotente por `sportmonksFixtureId`/(seasonId,teamId). `league.sportmonksSeasonId`/`season` continuam = season corrente.

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-008-historico-multi-temporada.md](../features/ligas/LIG-008-historico-multi-temporada.md) — os passos NÃO são duplicados aqui.
