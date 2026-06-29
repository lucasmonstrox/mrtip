# LIG-010 — Narração lance-a-lance (commentaries) da partida · dossiê de planejamento (2026-06-29)

Feature: [docs/features/ligas/LIG-010-commentaries.md](../features/ligas/LIG-010-commentaries.md)
Base: commit `eec3e64` (2026-06-29) — todo file:line deste doc vale neste commit.

## TL;DR

Ingerir a narração lance-a-lance da SportMonks (`GET /football/commentaries/fixtures/{id}`, incluso
no plano) pra cada partida finalizada, **guardando tudo** (~96 lances/jogo na PL) numa tabela
`commentary` nova, e exibir como **timeline numa aba "Narração"** na página da partida. Mesmo fluxo
da LIG-004 (venue): ingestão por-fixture no sync, upsert idempotente, FK pra `match`/`player`. A API
é uma **sub-rota dedicada** `/matches/:id/commentaries` (não embute no `getMatch`), porque o volume
por jogo não cabe no payload base.

## Briefing — o que já foi falado e decidido

- **Escopo = caminho completo** (sync + tabela + API + UI) — dono nesta conversa (2026-06-29).
- **Guardar TUDO** (não só destaques); `is_important`/`is_goal` são filtro de exibição/consumo, não de ingestão — dono nesta conversa (2026-06-29).
- **Sync = endpoint por-fixture, pós-jogo** (1 request por jogo finalizado) — dono nesta conversa (2026-06-29).
- **Registro formal antes de codar**: criar feature + `/pl` antes do `/i` — dono nesta conversa (2026-06-29).
- Texto da narração fica **em inglês** (é dado da fonte, não chrome de UI) — memória [[codigo-em-ingles-ui-em-pt]]; tradução é **non-goal**.
- Commentaries cobre só "major leagues"; PL coberta (confirmado por sondagem) — doc SportMonks.

## Estado do terreno

**dados** — `apps/api/src/db/schemas/leagues.ts:275` (`goal`) e `:297` (`card`) são o molde da tabela
de evento por-partida idempotente: `sportmonksEventId integer unique` (dedup), `matchId` FK com
`onDelete: "cascade"`, `playerId` FK. `player` (`:176`) é deduplicado por `sportmonksPlayerId`. O
sync (`apps/api/src/db/sync-sportmonks.ts:528`) já tem `ensurePlayer(smId, name)` que cria stub de
jogador fora das lineups — reusável pro autor do lance. O loop de eventos por fixture
(`sync-sportmonks.ts:542-573`, goals/cards) é o molde do bloco de ingestão; usa `matchIdByFixture`
(`:369`) e `teamIdBySm` (`:253`). O client `sm<T>(path)` (`apps/api/src/lib/sportmonks.ts:32`)
desembrulha `data`, aceita query na própria path (`?include=…`) e serve endpoint-array sem
paginação — exatamente o caso de commentaries.

**api** — sub-rotas de partida são finas, 1 rota → 1 service, keyed por uuid: `matches.routes.ts:38`
(`/lineup`), `:42` (`/injuries`), `:55` (`/scorers`). O service espelha
`get-injuries/get-injuries.service.ts:6`: `getMatchRow(id)` → 404 se não existe → loader do
`shared`. Loaders no `shared.ts`: `loadMatchGoals` (`:1031`) é o molde de loader por-match com join e
`orderBy`. `getMatch` (`get-match.service.ts:34`) **não** muda (sub-rota separada), então `baseQuery`/
`serializeMatch`/tipo `Match` ficam intactos.

**ui** — `apps/web/features/leagues/components/match-detail/match-detail.tsx:153` tem `<Tabs>` com
abas Fatos/Escalação/H2H/Gols/Notícias/Prognóstico/**Eventos** (`:161`, gols+cartões). Sub-recursos
são buscados por hook keyed pelo uuid (`:80`); molde `use-match-injuries-query.ts:6` →
`api.v1.matches({ id }).injuries.get()` (Eden deriva da rota). Narração entra como **aba nova**,
distinta de Eventos.

## Mapa de dependências

**Features** (`bun run features impact LIG-010` → sem arestas registradas hoje):
- Nenhuma feature `depende_de`/`impacta` LIG-010 ainda. Âncoras `match`/`player` são compartilhadas
  (LIG-004/005/006/008 leem), mas LIG-010 **só adiciona** tabela+rota+aba — não altera essas âncoras.
- Futuro: o prognóstico (prognostico-deepseek) pode consumir `commentary.playerId` como narrativa
  ([[prognostico-ajustado-por-desfalque]]) — fora de escopo aqui.

**Código** (nada ALTERADO em símbolo compartilhado — tudo aditivo):

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `sync-sportmonks.ts` (bloco novo) | só o próprio script | `bun run db:sync` exit 0, contagem `commentary` |
| `matches.routes.ts` (rota nova) | Eden client (web) | typecheck raiz + curl da rota |
| `shared.ts` `loadMatchCommentaries` (novo) | get-commentaries service | curl da rota |
| `match-detail.tsx` (aba nova) | página da partida | E2E Chrome aba Narração |

## Blast radius e cuidados

- **`getMatch` / `serializeMatch` / `baseQuery` intactos** — decisão de sub-rota dedicada isola o
  payload base; sintoma se violado: lista da liga/página da partida fica lenta ou quebra; detectar:
  `curl /v1/leagues/PL | jq '.matches|length'` inalterado (380).
- **`ensurePlayer` cria stubs** de jogadores que só aparecem na narração (não nas lineups) — igual já
  acontece com goals/cards/sidelined; sintoma: `player` cresce com nomes sem foto/nacionalidade;
  detectar: esperado, não é regressão.
- **Runtime/rate-limit do sync**: +1 request por fixture finalizada (~380/temporada PL); entidade
  `Commentary` tem bucket próprio de 2000/h (confirmado na sondagem: `remaining:1999`). Sintoma:
  sync demora mais / 429; detectar: log `commentaries: N` + `rate_limit`.
- **Re-seed (`db:reset`)** zera `commentary` → re-sync repopula (idempotente por `sportmonksCommentaryId`).

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:275-313` — `goal`/`card`: molde exato da tabela de evento por-fixture (sportmonksEventId unique, matchId cascade, playerId FK).
- [código] `apps/api/src/db/sync-sportmonks.ts:528-538` — `ensurePlayer` reusável pro autor do lance; `:542` loop de eventos é o molde do bloco.
- [código] `apps/api/src/lib/sportmonks.ts:32` — `sm<T>` desembrulha `data`, aceita `?include=` na path, serve array sem paginação.
- [código] `apps/api/src/modules/leagues/get-injuries/get-injuries.service.ts:6` — molde do service de sub-rota (getMatchRow → 404 → loader).
- [código] `apps/api/src/modules/leagues/shared/shared.ts:1031` — `loadMatchGoals`: molde de loader por-match com join + orderBy.
- [código] `apps/web/.../match-detail.tsx:161` + `use-match-injuries-query.ts:6` — aba Eventos e molde do hook Eden de sub-recurso.
- [sondagem] `commentaries/fixtures/19427458` (2026-06-29): HTTP 200, 96 lances, is_goal=4, is_important=8, player em 80/96, `relatedplayer` (minúsculo) e `order` ints gigantes (16067242…). — ver §Shape da resposta.
- [feature] `docs/features/ligas/LIG-004-venue-estadio-geo.md` — fluxo idêntico verificado (ingestão por-fixture → tabela → API → UI).

## Detalhes por passo (referenciados pelo ## Plano)

### §Schema (P1) — tabela `commentary` (expand-only, sem contract)

Em `apps/api/src/db/schemas/leagues.ts`, após `card` (`:313`). Shape (molde `goal`/`card`):

```ts
export const commentary = pgTable("commentary", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksCommentaryId: integer("sportmonks_commentary_id").notNull().unique(), // dedup → idempotente
  matchId: uuid("match_id").notNull().references(() => match.id, { onDelete: "cascade" }),
  playerId: uuid("player_id").references(() => player.id),        // autor do lance (nullable)
  relatedPlayerId: uuid("related_player_id").references(() => player.id), // 2º jogador (nullable)
  comment: text("comment").notNull(),
  minute: integer("minute"),         // null em eventos de moldura ("times escalados")
  extraMinute: integer("extra_minute"),
  isGoal: boolean("is_goal").notNull().default(false),
  isImportant: boolean("is_important").notNull().default(false),
  sortOrder: integer("sort_order").notNull(), // SportMonks `order` (int grande, crescente) → chave de ordenação
})
export type Commentary = typeof commentary.$inferSelect
```

Notas: `boolean` já está importado? conferir o import de `drizzle-orm/pg-core` na linha 1 e somar
`boolean` se faltar. `order` é palavra reservada → coluna `sort_order` (campo `sortOrder`). `integer`
para `sortOrder` é seguro (valores ~16M ≪ 2.1B do int4) — ver C3.

### §Shape da resposta (P2) — item de commentary cru (com includes)

```json
{ "id": 9363745, "fixture_id": 19427458,
  "comment": "Goal! Nottingham Forest leads 2-0 against Brentford. Dan Ndoye scores with a header...",
  "minute": 42, "extra_minute": null, "is_goal": true, "is_important": true, "order": 16067500,
  "player": { "id": 19978623, "display_name": "Dan Ndoye", ... }, "relatedplayer": null }
```

**Gotcha**: pedindo `include=player;relatedPlayer`, a chave no JSON volta **`relatedplayer`**
(minúsculo). Mapear `s.player?.id` e `s.relatedplayer?.id` (não `relatedPlayer`). Reusar
`ensurePlayer(p.id, p.display_name ?? p.name ?? "player N")` pra resolver os uuids antes do upsert.

### §Ingestão (P2) — onde e como

No `sync-sportmonks.ts`, bloco novo **depois** dos goals/cards (`:574`), iterando `fixtures` com
`matchIdByFixture`. Só fixtures com `f.state?.developer_name === "FT"` (finalizadas). Por fixture:
`const items = await sm<SmCommentary[]>('/commentaries/fixtures/' + f.id + '?include=player;relatedPlayer')`
(envolver em try/catch — fixture sem cobertura pode 404/vir vazio; logar e seguir, não abortar).
Upsert cada item por `sportmonksCommentaryId` (`onConflictDoUpdate`). Throttle: `pool(finished, 5, …)`
(molde `:198`) ou sequencial — bucket Commentary 2000/h folga. Logar `commentaries: N` + fixtures com 0.

## Notas de execução (/i, 2026-06-29)

- Realidade da sondagem confirmada no sync real: **37060 commentaries em 380/380 fixtures** da PL; 31929 com player; `related_player_id` = 0 em tudo (a fonte não popula `relatedplayer` na PL — coluna fica pronta).
- **Auth global (CORE-003 WIP)**: a API passou a gatear todas as rotas. Provas de P3 rodaram contra server local com `CLERK_SECRET_KEY` vazio (auth off). Sem mudança no código da feature.
- **P4 visual bloqueado**: chrome-devtools com profile travado → E2E da aba "Narração" PENDENTE. Código + typecheck OK; SSR 200 sem crash. Feature fica `em-andamento` até a prova visual.
- Gotcha operacional: dev-servers zumbis (3000/3001/3009) de sessões antigas serviam código stale (404 falso em `/prognosis` e `/commentaries`) — resolvido com `taskkill` por PID.

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-010-commentaries.md](../features/ligas/LIG-010-commentaries.md) — os passos NÃO são duplicados aqui.
