# SIN-021 — Attack momentum / pressão da partida · dossiê de planejamento (2026-06-30)

Feature: [docs/features/sinais/SIN-021-attack-momentum-pressao-da-partida.md](../features/sinais/SIN-021-attack-momentum-pressao-da-partida.md)
Base: commit `c19e081` (2026-06-29) — todo file:line deste doc vale neste commit.

## TL;DR

Ingerir os `trends` por minuto da SportMonks (grátis no plano; o índice pronto `pressure` é add-on €9–29/mês e soma-zero — descartado) numa tabela nova `match_trend` (grão por-minuto, valores ACUMULADOS), **derivar o momentum em leitura** numa rota própria `GET /v1/matches/:id/momentum` (delta por período + pesos de perigo + EMA), e renderizar a gangorra casa◄—+—►fora com ECharts numa aba "Momentum" do dossiê da partida. É dado in-play/pós-jogo: **não toca o prognóstico pré-jogo**. Vender como descritivo de fluxo, não probabilidade de gol.

## Briefing — o que já foi falado e decidido

- **Reconstruir dos `trends`, não comprar o add-on `pressure`** — fonte: dono nesta conversa (2026-06-30, AskUserQuestion "Reconstruir dos trends") + [docs/investigacoes/attack-momentum-pressao-da-partida.md](../investigacoes/attack-momentum-pressao-da-partida.md) §Opções (add-on €9–29/mês e soma-zero, verificado-fetch).
- **Registrar como feature nova e seguir /rs→/pl→/i passo a passo** — fonte: dono nesta conversa (2026-06-30, "vai de rs, pl e dps i").
- **Momentum é EXPLICATIVO, in-play/pós-jogo** — não entra no motor quant nem no prognóstico (corte em `match.date`, pré-jogo) — fonte: investigação §Estado real + `apps/api/scripts/prognosis-prompt.ts:1`.
- **Pesos numéricos = decisão de produto calibrável** (nenhuma fonte pública os dá; hierarquia SoT>chute>dangerous attack>attack>posse é defensável via xT) — fonte: investigação §Perguntas abertas. v1 = pesos da POC, refinar por face-validity.
- **Não vender como preditivo de gol** (Lei 14.790, sem promessa de ganho; literatura não sustenta a ponte pra futebol) — fonte: investigação §Refutado.
- `[PENDENTE-DONO]` **Onde o gráfico vive**: aba dedicada "Momentum" (default do plano) vs card na aba Fatos vs dentro da aba Eventos (fluxo). Default escolhido pra não bloquear o /i; ver Decisão D3.

## Estado do terreno

**dados — ingestão (FALTA trends):** o sync busca fixtures com include em `apps/api/src/db/sync-sportmonks.ts:369` (`…lineups.details;…;venue;statistics;weatherReport`) — **sem `trends`**. O padrão de upsert de stats por time vive em `sync-sportmonks.ts:567-611` (loop sobre `fixtures`, `matchIdByFixture.get(f.id)` → uuid do match, `teamIdBySm.get(participant_id)` → uuid do time, agrupa por team, `await db.insert(...).onConflictDoUpdate(...)` **por linha**). Constantes de type_id em `sync-sportmonks.ts:24-31` (`STAT`, `TEAM_STAT`). Helpers `sm<T>()`/`smAll<T>()` em `apps/api/src/lib/sportmonks.ts`.

**dados — schema (FALTA match_trend):** `apps/api/src/db/schemas/leagues.ts` tem `matchTeamStats` (`:254-280`, 1 linha por `(matchId, teamId)`, `unique().on(t.matchId, t.teamId)` em `:277`) como molde de estilo — mas o grão do momentum é por-minuto (muitas linhas/jogo). `match` em `:76`, `team` em `:39`. Import de tipos drizzle em `:1` (`integer, pgTable, unique, uuid` já presentes).

**api — rota do dossiê:** `apps/api/src/modules/leagues/get-match/get-match.service.ts:34-61` (`getMatch`) devolve `{...serializeMatch, league, goals, cards, rest, standings}` — **não computa momentum**. Sub-recursos do dossiê são rotas/serviços PRÓPRIOS, carregados sob demanda por uuid (ex.: scorers, goal-timing, form) — molde pra `get-match-momentum`.

**ui — dossiê:** `apps/web/features/leagues/components/match-detail/match-detail.tsx:154-164` define 8 abas (`<Tabs defaultValue="fatos">`); sub-recursos são componentes self-fetching por id (`<Scorers id={id}/>` `:189`, `<GoalTiming id={id}/>` `:190`, `<Lineup id={id}/>` `:180`) — molde pra `<MatchMomentum id={id}/>`. Charting é **ECharts**: molde em `apps/web/features/leagues/components/player-detail/rating-chart.tsx:19-102` (`echarts.init(ref)`, `setOption`, `useEffect`+resize+dispose, `<div ref className="h-64 w-full"/>`).

**POC pronta:** `apps/api/scripts/_momentum.ts:11` carrega a lógica de derivação (pesos `W={86:5,580:6,44:3,42:2,43:1,49:2,34:1}`, delta por minuto, EMA α=0.3) validada no fixture 19427245 — porta-se pra um util da api no P3.

## Mapa de dependências

**Features** (`bun run features impact SIN-021`): `impacta: [DOS-001, SIN-017]` — vive no dossiê da partida (DOS-001) e complementa game-state/timing (SIN-017, que modela eventos por minuto). Nenhuma `depende_de` abaixo de `feito`: é fonte de dado nova, expand-only, sem bloqueio.

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `sync-sportmonks.ts` (loop novo + include) | `bun run db:sync` | sync roda inteiro; `match_team_stats`/`weather`/`goal` continuam populando (loop aditivo, não mexe nos existentes) |
| `match-detail.tsx#MatchDetail` (aba nova) | página `/leagues/.../matches/[slug]` | as 8 abas atuais continuam renderizando; a 9ª aparece |
| route index da api (registrar `/momentum`) | Eden `App` type no front | typecheck do front (contrato Eden) |
| `match_trend` (tabela nova) | só o serviço de momentum | nada lê hoje — additivo puro |

## Blast radius e cuidados

- **Sync mais pesado** — `trends` adiciona ~1300 linhas/jogo ao payload e ao banco; sintoma se quebrar: `bun run db:sync` lento/estoura memória; detectar: cronometrar o sync + `SELECT count(*) FROM match_trend`. Mitigação no P2 (bulk insert + filtro de tipos). Ver C1.
- **Filtro `trendTypes` pode ser ignorado** (mesmo gotcha que `fixtureStatisticTypes` no DOS-002 — o probe trouxe os 40 apesar do filtro) — sintoma: payload com 40 tipos em vez de ~10; detectar: contar `distinct type_id`; mitigação: filtrar no código antes do insert. Ver C2.
- **Contrato Eden** — a rota nova entra no `App` type; o front consome tipado. Quebra de typecheck no front se o shape divergir; detectar: `bun run typecheck`.
- **Tudo o mais é aditivo** — `match_trend` nova, rota nova, componente/aba novos; nenhum símbolo existente muda de assinatura. Risco fora da feature: baixo.

## Evidências

- [código] `apps/api/src/db/sync-sportmonks.ts:369` — include atual sem `trends` (gap de 1 linha).
- [código] `apps/api/src/db/sync-sportmonks.ts:567-611` — padrão de upsert de stats por time (molde do loop, mas é insert por-linha — trocar por bulk no P2).
- [código] `apps/api/src/db/schemas/leagues.ts:254-280` — `matchTeamStats` como molde de estilo (grão difere: por-minuto).
- [código] `apps/api/src/modules/leagues/get-match/get-match.service.ts:34-61` — dossiê não computa momentum; sub-recursos são rotas próprias.
- [código] `apps/web/.../player-detail/rating-chart.tsx:19-102` — molde ECharts (init/setOption/dispose).
- [código] `apps/web/.../match-detail/match-detail.tsx:154-191` — abas + componentes self-fetching por id (molde de `<MatchMomentum/>`).
- [código] `apps/api/scripts/_momentum.ts:11-47` — lógica de derivação (pesos+delta+EMA) validada, pronta pra portar.
- [doc] `docs/investigacoes/attack-momentum-pressao-da-partida.md` — recomendação cravada (reconstruir; descritivo; pesos calibráveis).

## Detalhes por passo (referenciados pelo ## Plano)

### §Schema (P1) — `match_trend`
```ts
export const matchTrend = pgTable(
  "match_trend",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id").notNull().references(() => match.id, { onDelete: "cascade" }),
    teamId: uuid("team_id").notNull().references(() => team.id),
    typeId: integer("type_id").notNull(),     // 86=SoT, 580=big-chance, 44=dangerous-attack, 42=shots, 43=attack, 49=shots-insidebox, 34=corners…
    periodId: integer("period_id").notNull(), // separa 1ºT/2ºT/prorrogação
    minute: integer("minute").notNull(),      // minute+extra já somados (injury time)
    value: integer("value").notNull(),        // ACUMULADO no período
  },
  (t) => [unique().on(t.matchId, t.teamId, t.typeId, t.periodId, t.minute), index("match_trend_match_idx").on(t.matchId)],
)
```
Expand-only (tabela nova). `index` e `unique` no import de `drizzle-orm/pg-core` (`unique` já importado; somar `index`).

### §Ingestão (P2) — bulk insert
`SmTrend = { type_id; participant_id; period_id; minute; value }` + `trends?: SmTrend[]` no tipo do fixture. Add `trends` ao include (`:369`) + `&filters=trendTypes:86,580,44,42,43,49,34,78,100,45` (espelha o padrão de filtro existente). Loop novo após o de team-stats (`:611`): pra cada fixture, montar `rows: (typeof matchTrend.$inferInsert)[]` (resolver `matchId`/`teamId`, descartar `participant_id` desconhecido), e **um único** `db.insert(matchTrend).values(rows).onConflictDoNothing()` por fixture (NÃO insert por-linha — ver C1). Se o filtro vier ignorado (C2), filtrar `TREND_TYPES.has(t.type_id)` no código antes do insert.

### §Derivação (P3) — `momentum.ts`
Porta de `_momentum.ts:11-47`: pesos `W` (default = POC), `delta = value(min) − value(min−1)` **resetando na virada de period_id** e carregando o último valor visto por (team,type), `score(team,min) = Σ Δ·peso`, `EMA α≈0.3`. Saída: `{ minute, home, away }[]` (home/away já resolvidos por `match.homeTeamId`/`awayTeamId`). Pure function testável isolada.

## Plano executável

Ver seção `## Plano` de [docs/features/sinais/SIN-021-attack-momentum-pressao-da-partida.md](../features/sinais/SIN-021-attack-momentum-pressao-da-partida.md) — os passos NÃO são duplicados aqui.
