# Dossiê de codificação — LIG-004 · Estádio (venue) com geo na página da partida

Base: commit `dc71e0e` (2026-06-29). Todo `path:linha` deste doc vale nesse commit.

> Ponte `/rs`→`/i`. Investigação: `docs/investigacoes/venue-estadio-geo.md`. Decisão de modelo `[cravado]`: `docs/arquitetura/modelagem.md:95-114`.

## Briefing — o que já está decidido (não re-decidir)

- **Fonte confirmada (fetch /rs):** a SportMonks entrega o venue completo por fixture via `include=venue` — `name`, `city_name`, `latitude`/`longitude` (string), `capacity`, `surface`, `image_path`. **Sem geocoding externo.** (https://docs.sportmonks.com/v3/endpoints-and-entities/entities/fixture)
- **Modelo cravado:** tabela de estádio própria com `latitude/longitude numeric(9,6)` ("Sportmonks devolve como string; converter") — `docs/arquitetura/modelagem.md:97,110`. W-007 (display) + W-008 (coords) = **uma feature só**; coord é a razão de ser tabela, não coluna em `match`.
- **Em inglês (dono, esta conversa + [[codigo-em-ingles-ui-em-pt]]):** a tabela é **`venue`**, a FK **`venueId`** — não `estadios`/`estadio` (nome português do `modelagem.md`/INDEX). Só strings de UI em pt-BR.
- **Coordenada não é display:** lat/long ficam guardadas como insumo do sinal de viagem/fadiga (SIN-008) e proximidade (SIN-007). A UI mostra **nome + cidade + capacidade** (e foto se houver), nunca lat/long.
- **Venue real do jogo:** usar `fixture.venue` (cobre campo neutro), não o `venue_id` do time da casa.
- **Simplificações conscientes (avalizadas no /rs, §Modelo de dados):** `cityName` denormalizado (text na própria `venue`) em vez das tabelas `pais`/`cidade` normalizadas do `modelagem.md` §3.1; `address`/`zipcode`/`fuso`/`apelido` ficam fora do MVP (sem consumidor). Aditivo no futuro, mesma fonte.

## Estado do terreno (real, com âncora)

**Schema** — `apps/api/src/db/schemas/leagues.ts`:
- `match` (`:38`) tem `sportmonksFixtureId`, `leagueCode`, `round`, `name`, `date`, `time`, `homeTeamId`, `awayTeamId`, score (4 col), `status`. **Sem** `venueId`. Não existe tabela `venue` (grep `venue|stadium|latitude` em `apps/api/src/db` = 0).
- **Molde da entidade `venue`:** `team` (`:21`) — `id uuid` PK `defaultRandom`, `sportmonksTeamId` notNull unique (dedup), `logoUrl` (R2), `createdAt`.
- **Molde do FK nullable:** `lineup.coachId` (`:164`) — `uuid(...).references(() => coach.id)`, sem `.notNull()`.

**Sync** — `apps/api/src/db/sync-sportmonks.ts`:
- Include das fixtures (`:300-301`): `participants;scores;round;state;lineups.player;lineups.position;lineups.details;formations;events.type;sidelined.player;sidelined.type` — **`venue` ausente**. `SmFixture` type (`:107`) sem campo `venue`.
- Loop de matches (`:309-338`): monta `values` (`:320`) e faz upsert por `match.sportmonksFixtureId`; **roda ANTES** de qualquer coleta de venue → a coleta+upsert de venues precisa vir antes (entre `:305` e `:309`) pra `venueId` existir no insert do match.
- Padrões reusáveis: `pool(items, 8, fn)` (`:191`) pra upload paralelo; `uploadImagem(image_path, imgKey("folder", name, image_path))` (`:209,234,361,383`) sobe no R2 e devolve URL (ou null); `imgKey` (`:156`) deriva a extensão do `image_path`.

**API read-model** — `apps/api/src/modules/leagues/shared/shared.ts`:
- `baseQuery()` (`:373`) é a **fonte única** do shape: `match` + join home/away (alias `teamHome`/`teamAway` `:357`). Alimenta `loadMatches` (list/rounds), `getMatchRow` (`:420`, detalhe) e a form.
- `MatchJoin` type (`:361`) = row do join; `serializeMatch(row)` (`:391`) achata pro contrato `Match` (`:99`) — "the ONLY place that defines the shape of a match". `TeamRef` (`:33`) é o molde do sub-objeto.
- `getMatch` (`get-match/get-match.service.ts:12`) = `{ ...serializeMatch(row), league, goals, cards }`.
- Rota: `matches.routes.ts:20` — `GET /v1/matches/:id` (param uuid validado na borda).

**Web** — `apps/web/features/leagues/components/match-detail/match-detail.tsx`:
- Aba **"Fatos"** é placeholder literal `<TabEmpty>Fatos da partida em breve.</TabEmpty>` (`:119-121`) — lar do bloco de venue.
- Header (`:37-87`) já mostra liga + data + placar + form. Tipos do match vêm via Eden Treaty (`useMatchQuery`) — adicionar `venue` ao contrato da API **auto-tipa** `match.venue` no web, sem duplicar tipo ([[eden-revive-datas-em-date]]).

**Migrações:** `bun run db:generate` (drizzle-kit gera SQL) → `bun run db:migrate`. `db:reset` derruba+migra+sync do zero. `db:sync` re-roda o sync (idempotente, upsert por id).

## Mapa de dependências

| Alvo alterado | Consumidores diretos | Re-testar |
|---|---|---|
| `serializeMatch`/`baseQuery`/`Match` (`shared.ts`) | `loadMatches` (list+rounds da liga), `getMatchRow`→`getMatch`, form indireta | página da liga (rounds/lista) **e** página da partida — o `venue` aditivo nullable não pode quebrar o render da lista |
| `match` (nova col `venueId`) | todo `select(match)` (Drizzle `select: match` no baseQuery puxa a coluna nova) | typecheck API + smoke do endpoint de lista |
| nova tabela `venue` | LIG-004 só; **SIN-006/007/008/016** consomem no futuro (não implementados) | nenhum agora — `impacta` registrado pro dia que forem feitos |
| contrato `Match` (web via Eden) | `match-detail.tsx` e qualquer consumidor de lista de match no web | `bun run typecheck` no web pega divergência |

`bun run features impact LIG-004` → impacta SIN-006/007/008/016 (âncora `estadios`/`venue`), nenhum em estado que exija re-teste agora.

## Blast radius

- **`baseQuery` ganha left-join de venue:** se o join vier errado (inner em vez de left), partidas sem venue **somem da lista** → sintoma: rounds da liga com menos jogos. Detectar: contar matches na página da liga antes/depois. Mitigação: **left join** (venueId é nullable).
- **`Match` type muda:** web pode quebrar typecheck se algum consumidor desestruturar de forma estrita → `bun run typecheck` no web detecta antes de rodar.
- **Sync re-rodado:** `venueId` só preenche em fixtures re-sincronizadas (mesma natureza das colunas home/away do standing). Sem re-sync, `match.venueId` fica null e a UI cai no empty-state — não quebra.
- **Cobertura de lat/long furada:** não quebra nada (display usa name/city); só o consumidor geo futuro sofre. Verificar no P2.

## Modelo de dados (expand-only, aditivo)

Nova tabela `venue` (em `apps/api/src/db/schemas/leagues.ts`, molde `team`):

```ts
export const venue = pgTable("venue", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksVenueId: integer("sportmonks_venue_id").notNull().unique(),
  name: text("name").notNull(),
  cityName: text("city_name"),
  capacity: integer("capacity"),
  surface: text("surface"),
  latitude: numeric("latitude", { precision: 9, scale: 6 }),   // string no Drizzle; Number() na borda
  longitude: numeric("longitude", { precision: 9, scale: 6 }),
  imageUrl: text("image_url"),                                  // foto no R2 (bucket mrtip)
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
export type Venue = typeof venue.$inferSelect
```

`match` ganha (aditivo, nullable): `venueId: uuid("venue_id").references(() => venue.id)`.
`numeric` precisa entrar no import do drizzle (`apps/api/src/db/schemas/leagues.ts:1`).

Contrato de saída (`Match` em `shared.ts:99`) ganha:
```ts
venue: { name: string; cityName: string | null; capacity: number | null; surface: string | null; latitude: string | null; longitude: string | null; imageUrl: string | null } | null
```

## Riscos e cuidados

- **C1 — cobertura de lat/long (verificar no P2):** a doc confirma o campo, não o preenchimento. Query pós-sync. Não bloqueia display; plano B (geocodar cidade 1x) é feature futura se furar.
- **C2 — ordem no sync:** coletar+upsertar venues **antes** do loop de matches (`:309`), senão `venueId` não existe no insert.
- **C3 — left join, não inner:** preservar todas as partidas.
- **C4 — `numeric` volta como string:** nunca aritmética sobre a string; consumidor geo faz `Number()`.

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:21,38,164` — molde `team` da entidade, `match` sem venue, `coachId` molde do FK nullable.
- [código] `apps/api/src/db/sync-sportmonks.ts:191,300,309,320` — `pool`, include sem venue, loop de matches (coleta precisa vir antes).
- [código] `apps/api/src/modules/leagues/shared/shared.ts:99,373,391,420` — tipo `Match`, `baseQuery`, `serializeMatch`, `getMatchRow`: o único ponto de shape.
- [código] `apps/web/features/leagues/components/match-detail/match-detail.tsx:119` — aba Fatos placeholder.
- [doc] `docs/arquitetura/modelagem.md:95-114` — `[cravado]` do estádio com lat/long numeric(9,6).
- [web] https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/venues/get-venue-by-id — venue traz lat/long/capacity/city_name/surface.
