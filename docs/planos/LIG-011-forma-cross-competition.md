# LIG-011 — Forma cross-competition (rótulo de competição) · dossiê de planejamento (2026-07-01)

Feature: [docs/features/ligas/LIG-011-forma-cross-competition.md](../features/ligas/LIG-011-forma-cross-competition.md)
Base: commit `da67b87` (2026-07-01) — todo file:line deste doc vale neste commit.

## TL;DR

Hoje a "forma" (últimos 5 V/E/D) é sempre **single-competition** (só a liga) e o popover **não diz de qual competição** foi cada jogo. Duas frentes: **Parte A** — carregar `competition {code,name,logoUrl,type}` no payload de `Match`/`FormResult` (um `innerJoin(league)` no `baseQuery`) e mostrar no popover; **Parte B** — na **página do time** e na **forma dos detalhes da partida**, a forma passa a incluir **todas as competições** da campanha (liga + copas), com cada jogo rotulado. A classificação **continua só-liga** (é a tabela da liga). O escopo cross-comp usa **"seasons concorrentes" = mesmo `season.startYear`**, num **loader novo isolado**, sem tocar em `loadMatches`/`loadTeamMatches`/`computeStandings`.

## Briefing — o que já foi falado e decidido

- Pedido de origem: "no popover da forma, saber de qual competição foi aquele jogo" — dono nesta conversa (2026-07-01).
- Escopo da forma na **análise da partida** = **todas as competições** (linha única, cada chip rotulado) — dono nesta conversa, via AskUserQuestion (2026-07-01).
- Escopo da forma na **página do time** = **todas as competições** — dono nesta conversa, via AskUserQuestion (2026-07-01).
- **Classificação continua só-liga** — decisão de produto (a forma da tabela é do campeonato; jogo de copa não conta) — dono + convenção (`computeStandings` já é league-only, `shared.ts:1749`).
- Descartadas de propósito (o dono escolheu o modo simples "todas"): "Liga + Geral lado a lado" e "Toggle Liga/Todas" → viram Fora de escopo, não lixo esquecido.
- Tese do projeto que reforça a direção: aposta precisa de narrativa, e **fadiga de meio de semana** (jogo de copa no meio da semana) é evidência — memórias `projeto-aposta-precisa-de-evidencia`, `teoria-ressaca-meio-de-semana`. Tornar o jogo de copa visível na forma serve a isso.

## Estado do terreno

**Motor único.** Toda forma sai de `computeForm(matches, t, opts)` — `shared.ts:1780-1807`. Ele já filtra por time + `score != null` + `before?` e corta em N; **dado o array certo, produz forma cross-comp sem alteração**. A diferença entre as telas é só **qual array entra** e se tem âncora `before`:

- **Classificação** (`computeStandings`, `shared.ts:1749`): recebe o array de `loadMatches(code, seasonId)` (`shared.ts:591-597`) — 1 liga + 1 season; forma "atual" (sem `before`). **Fica como está.**
- **Página do time** (`get-team.service.ts:29`): `computeForm(matches, team)` com `matches = loadTeamMatches(team.id, seasonId)` (`shared.ts:1041-1047`). `loadTeamMatches` filtra por `seasonId` único → **hoje é single-liga** (ver abaixo por quê). `seasonId` vem de `resolveSeason("PL", seasonParam)` (`get-team.service.ts:19`).
- **Detalhes da partida / análise** (`form.service.ts:17,24-25`): `matches = loadMatches(row.m.leagueCode, row.m.seasonId)` — 1 liga; forma **ancorada** `before` a data do jogo. Serve os dois times a partir do MESMO array de 1 liga.

**Por que tudo é single-competition hoje.** `season.leagueCode` amarra cada season a **uma** liga (`schemas/leagues.ts:29`). Logo `seasonId` já é single-liga por definição: mesmo `loadTeamMatches`, que não filtra por `leagueCode`, volta só-PL porque filtra por um `seasonId` que ⇒ PL. As copas têm season própria (outro `seasonId`).

**Contrato que descarta a competição.** `Match` (`shared.ts:125-136`) não tem competição; `FormResult` (`shared.ts:170-182`) idem. `serializeMatch` (`shared.ts:517-545`) — **único definidor da shape de `Match`** — tem `m.leagueCode` em mãos mas não junta `league` nem expõe. `baseQuery` (`shared.ts:497-512`) junta teams + venue, **sem** `league`. `formResult` (`shared.ts:1754-1772`) copia campos do match pro `FormResult`.

**Resolução de season é segura sob 3 `is_current`.** `currentSeasonId`/`resolveSeason` filtram por `season.leagueCode` (`shared.ts:549-573`), então as 3 seasons `is_current` (PL/CARA/FAC) não ambíguam a resolução da PL.

**UI (um só componente).** `FormChips`/`FormGuide` + popover vivem em `apps/web/features/leagues/components/match-detail/form-guide.tsx:33-126`. O popover (`Chip`, `:33-90`) mostra placar + HT + data — **sem competição**. Consumido pelas 3 telas: time (`team-detail.tsx:50`), partida home+away (`match-detail.tsx:124,150`), classificação (`league-detail/standings-table.tsx:131`). Tipos do front são **re-exportados de `@workspace/api`** (`apps/web/features/leagues/types/index.ts:1-37`) → mexer no contrato da API propaga sozinho, sem edição manual de tipo no web.

**`league` tem tudo pro rótulo.** `league {code, name, country, season, type, logoUrl}` (`schemas/leagues.ts:6-18`); `type` ∈ {`league`,`cup`} (carimbo `@feature CUP-001`, `:15`).

## Mapa de dependências

**Features** (`bun run features impact` + grafos):
- **LIG-008** ← alicerce season-aware (`season`, `seasonId`, `startYear`, `resolveSeason`); `concurrentSeasonIds` é construído sobre `season.startYear`. É `depende_de`.
- **LIG-002** (página do time, `verificado`) ← a forma do topo passa a ser cross-comp; re-testar. `impacta`.
- **CUP-001** (ingestão de copa) ← **dependência de DADO** (as copas no banco). Não é feature registrada em `docs/features` (só carimbo em código `schemas/leagues.ts:15`) → não entra em `depende_de` pra não quebrar o `check`; tratada como pré-requisito de runtime (sem copa, cross-comp degrada pra só-liga).
- **DOS-001 / LIG-001 / MOD-001** ← consomem a shape de `match` (via `serializeMatch`); mudança aditiva, re-teste leve. `impacta`.

**Código:**

| Alvo (path#símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `shared.ts#serializeMatch` | 25 arquivos (blast do `codebase_impact`): todos os services de match/team/player/standings/rounds/bracket + routes | mudança **aditiva** (campo `competition`) → regressão dos endpoints de match (shape cresce, não muda) |
| `shared.ts#baseQuery` | tudo que serializa match (via `serializeMatch`) | `+innerJoin(league)`: `league.code` é `notNull` FK em `match` → inner é seguro (nunca dropa linha) |
| `shared.ts#computeForm` | `computeStandings` (`:1749`), `getTeam` (`get-team.service.ts:29`), `form` (`form.service.ts:24-25`) | `computeStandings` **não muda**; `getTeam` e `form` passam a receber array cross-comp |
| `shared.ts#formResult` | `computeForm` (único) | +campo `competition` |
| `get-team.service.ts#getTeam` | rota `/v1/teams/:slug` (`teams.routes.ts`) | forma agora mista; página do time (LIG-002) |
| `form.service.ts#form` | rota `/v1/matches/:id/form` (`matches.routes.ts`) | forma agora mista, por-time |

## Blast radius e cuidados

- **`serializeMatch` toca 25 arquivos** — mas o campo `competition` é **aditivo**. Sintoma se quebrar: algum consumidor com assert estrito de shape (o LIG-008 fez regressão byte-a-byte de match). Detecção: `typecheck` + re-rodar os curls de regressão dos endpoints de match; atualizar baseline se comparar shape.
- **`FormChips` é compartilhado** → o rótulo de competição aparece nas 3 telas. Na **classificação** (league-only) o rótulo será sempre "Premier League" — correto, porém redundante. Decisão de UI (D5): mostrar sempre (simples, honesto) vs. só quando a forma é mista. Sintoma se ignorar: ruído visual na tabela.
- **`type`-error pré-existente no working tree**: `shared.ts:618` (`getLeagueOrThrow` retorna sem `type` — WIP de copas CUP-001, ver `<new-diagnostics>`). O `typecheck` **já está sujo** antes desta feature. Cuidado: a Prova "typecheck limpo" pressupõe esse WIP resolvido/commitado — senão mascara erro novo.
- **`start_year` como chave de concorrência**: se entrar uma liga de ano-calendário (jan–dez) cujo `startYear` não alinhe com a PL (ago–mai), `concurrentSeasonIds` juntaria seasons erradas. Hoje PL/CARA/FAC = 2025 alinham (`[banco]`). Detecção: assert no banco de que `concurrentSeasonIds(PL 2025)` = 3 ids das ligas esperadas.
- **Season 2024/25 não tem copa concorrente** (só PL 2024 no banco) → no switcher pra 2024/25 a forma cross-comp = só-PL. Não é bug: degrada certo.

## Evidências

- [código] `apps/api/src/modules/leagues/shared/shared.ts:1780-1807` — `computeForm`: filtra time+score+before, corta em N; **agnóstico ao array** → cross-comp é questão de o que entra.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:517-545,497-512` — `serializeMatch` (único definidor de `Match`) + `baseQuery` (sem `league`): tem `m.leagueCode`, descarta a competição.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:170-182,1754-1772` — `FormResult` + `formResult`: nenhum campo de competição.
- [código] `apps/api/src/db/schemas/leagues.ts:29,33` — `season.leagueCode` (season ⇒ 1 liga, por isso tudo é single-comp) + `season.startYear` (chave da concorrência).
- [código] `apps/api/src/db/schemas/leagues.ts:6-18` — `league {code,name,country,type,logoUrl}`: monta `competition` inteiro; `type` ∈ league|cup.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:549-573` — `currentSeasonId`/`resolveSeason` filtram por `leagueCode` → 3 `is_current` não quebram a PL.
- [código] `apps/web/features/leagues/types/index.ts:1-37` — tipos do front re-exportados de `@workspace/api`: contrato cresce sozinho no web.
- [código] `apps/web/.../match-detail/form-guide.tsx:33-90` — popover (`Chip`) mostra placar/HT/data, sem competição; ponto de inserção do rótulo.
- [banco] query 2026-07-01 (`SELECT ... FROM season JOIN league`): PL/CARA/FAC todas `start_year=2025` e `is_current=t`; PL 2024 `start_year=2024`. **Concorrência por `startYear` validada.**
- [banco] query 2026-07-01: `match` por liga → CARA 93 (93 c/ placar), FAC 871 (870), PL 760 (760), todos com `season_id`. Copa tem placar+season → forma pega.
- [banco] query 2026-07-01: Arsenal tem **10 jogos CARA+FAC na campanha 2025** intercalados com a PL (todos com placar) → caso de teste concreto.

## Detalhes por passo (referenciados pelo ## Plano)

### §CrossComp — `concurrentSeasonIds` + `loadTeamFormMatches`

`concurrentSeasonIds(anchorSeasonId): Promise<string[]>` — todas as `season.id` que compartilham o `startYear` da season âncora:
```sql
SELECT s2.id FROM season s1 JOIN season s2 ON s2.start_year = s1.start_year WHERE s1.id = $anchor
```
(2025 → {PL 25/26, CARA, FAC}; NÃO usa `isCurrent`, imune às 3 flags current).

`loadTeamFormMatches(teamId, { seasonId, before? }): Promise<Match[]>` — reusa `baseQuery()`, filtra `(home==teamId OR away==teamId) AND score NOT NULL AND match.seasonId IN concurrentSeasonIds(seasonId) [AND date < before]`, `orderBy(desc(date))`. Bounded por time (≤~50 jogos/campanha) → devolve tudo e deixa `computeForm` cortar em N. **Não substitui** `loadMatches`/`loadTeamMatches`.

### §Wire — ligação nas telas

- `get-team.service.ts:29`: `form: computeForm(await loadTeamFormMatches(team.id, { seasonId }), team)` (sem `before` = forma atual, bounded pela season do switcher).
- `form.service.ts:24-25`: trocar o array único por **um load por time** — `computeForm(await loadTeamFormMatches(home.id, { seasonId: row.m.seasonId, before: row.m.date }), home, opts)` e idem `away`. O `n`/`side` de `opts` seguem.

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-011-forma-cross-competition.md](../features/ligas/LIG-011-forma-cross-competition.md) — os passos NÃO são duplicados aqui.
