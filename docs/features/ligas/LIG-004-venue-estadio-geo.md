---
id: LIG-004
titulo: Estádio (venue) com geo na página da partida
modulo: ligas
status: verificado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  dados: verificado # tabela venue + match.venueId + include venue no sync (20 venues, geo 100%)
  api: verificado # leftJoin match→venue + campo venue no serializeMatch (verificado por curl)
  ui: verificado # bloco de estádio na aba Fatos (E2E Chrome 2 venues, console limpo)
testada: sim
testes:
  - "P1 migração 0003 aplicada — \\d venue: latitude/longitude numeric(9,6), match.venue_id FK (2026-06-29)"
  - "P2 db:sync — venues: 20, 380/380 matches com venue_id, 0 sem_geo, sample Anfield 53.43,-2.96 (2026-06-29)"
  - "P3 curl /v1/matches/:id → venue {Stadium of Light, Sunderland, 48707, grass, lat/long, imageUrl}; lista PL 380 matches intacta (2026-06-29)"
  - "P4 E2E Chrome — aba Fatos render OK em 2 venues (Stadium of Light/Sunderland/48.707; Anfield/Liverpool/61.276), foto R2 carrega, sem lat/long, console limpo (2026-06-29)"
  - "typecheck 3/3 + lint match-detail 0 erros (2026-06-29)"
depende_de: []
impacta: [SIN-006, SIN-007, SIN-008, SIN-016, SIN-023] # consomem a tabela de estádio/coordenadas
ancoras:
  settings: []
  tabelas: [venue, match] # cria venue (= âncora "estadios" do INDEX, em inglês); FK em match
  tools: []
  funcoes: [serializeMatch]
  rotas: [/matches/:id]
docs:
  - docs/investigacoes/venue-estadio-geo.md
  - docs/planos/LIG-004-venue-estadio-geo.md
  - docs/arquitetura/modelagem.md
verificado_em: 2026-06-29
atualizado: 2026-06-29
---

# Estádio (venue) com geo na página da partida

## Descrição

Registrar e exibir o estádio de cada partida (nome + cidade + capacidade) na página da partida,
e guardar **latitude/longitude** de cada estádio como insumo de modelo (distância de viagem do
visitante → SIN-008; proximidade territorial → SIN-007). Promovida da wishlist **W-007** (estádio)
+ **W-008** (coordenadas) como uma feature só. A SportMonks entrega o venue completo — `name`,
`city_name`, `latitude`/`longitude` (string), `capacity`, `surface` — como **include direto da
fixture** (`/fixtures/between?...&include=venue`), no mesmo request que o sync já faz: **sem
geocoding externo**. Modela uma **tabela `venue` própria** (inglês; = âncora `estadios` do INDEX)
que `match` referencia via `venueId`. Operacionaliza a decisão `[cravado]` do
`docs/arquitetura/modelagem.md` §3.2. Display é **paridade**; o diferencial é a coordenada
auditável alimentando o sinal de viagem/fadiga.

## Tarefas

- [x] P1 dados — tabela `venue` + `match.venueId` no schema Drizzle; gerar e aplicar migração (expand-only)
- [x] P2 dados — `venue` no include do sync + `SmVenue` type + upsert (imagem→R2) + setar `venueId`; re-sync e checar cobertura de lat/long
- [x] P3 api — venue no `baseQuery` (left join) + `MatchJoin` + `serializeMatch` + tipo `Match`
- [x] P4 ui — bloco de estádio (nome + cidade + capacidade, foto se houver) na aba **Fatos** da página da partida _(E2E Chrome OK em 2 venues, console limpo)_

## Plano

> Dossiê: `docs/planos/LIG-004-venue-estadio-geo.md`. Base: commit `dc71e0e`. Schema é **expand-only** (tabela nova + coluna nullable) — sem contract. Constraints transversais (inglês no código, R2, Eden flui tipo) no CLAUDE.md/memória, não repetidas aqui.

### P1 · dados — schema `venue` + `match.venueId`
Adicionar a tabela `venue` e a coluna `match.venueId` em `apps/api/src/db/schemas/leagues.ts` (shape no dossiê §Modelo de dados; molde `team:21` e `lineup.coachId:164`; somar `numeric` ao import da linha 1). Gerar e aplicar a migração.
- **Prova:** `cd apps/api && bun run db:generate && bun run db:migrate` → exit 0; `psql ... -c "\d venue"` lista `latitude`/`longitude` (numeric) e `\d match` mostra `venue_id`. (Ou `bun run db:reset` se preferir do zero — re-sincroniza no fim.)

### P2 · dados — ingestão do venue no sync
Em `apps/api/src/db/sync-sportmonks.ts`: somar `venue` ao include das fixtures (`:300-301`); declarar `SmVenue` + campo `venue?: SmVenue` em `SmFixture` (`:107`). **Antes** do loop de matches (`:309`), coletar venues distintos das fixtures → upload de `image_path`→R2 via `pool(...)` (molde `:359`/`:381`) → upsert por `sportmonksVenueId` → `Map` `venueIdBySm`. No `values` do match (`:320`), setar `venueId: f.venue ? venueIdBySm.get(f.venue.id) ?? null : null`. Re-sync.
- **Prova:** `cd apps/api && bun run db:sync` → exit 0, loga `venues: N`; `psql -c "select count(*) from venue"` > 0; `select count(*) from match where venue_id is not null` ≈ total de partidas; **cobertura geo:** `select count(*) filter (where latitude is null) as sem_geo, count(*) from venue` — anotar o resultado (alimenta C1; se sem_geo>0, registrar, não bloquear).

### P3 · api — venue no contrato do match
Em `apps/api/src/modules/leagues/shared/shared.ts`: `leftJoin` de `venue` no `baseQuery` (`:373`, **left** por C3); somar os campos do venue ao `select` e ao `MatchJoin` (`:361`); montar o sub-objeto `venue` (null quando `venueId`/join vazio) no `serializeMatch` (`:391`); estender o tipo `Match` (`:99`) com o shape do dossiê §Modelo de dados. `get-match` e a rota não mudam (passam pelo `serializeMatch`).
- **Prova:** `bun run typecheck` (raiz) exit 0; com API no ar, `curl -s localhost:3000/v1/matches/<id> | jq '.venue'` retorna `{name, cityName, capacity, ...}`; `curl .../v1/leagues/PL | jq '.matches | length'` inalterado (left join não derrubou partidas).

### P4 · ui — bloco de estádio na aba Fatos
Em `apps/web/features/leagues/components/match-detail/match-detail.tsx`, trocar o placeholder da aba **Fatos** (`:119-121`) por um card com nome do estádio + cidade + capacidade (foto `imageUrl` se houver); empty-state quando `match.venue` é null. **Não** exibir lat/long. Strings pt-BR ("Estádio", "Capacidade"). Tipo `match.venue` já flui via Eden.
- **Prova:** `bun run typecheck` exit 0; Chrome (chrome-devtools MCP) numa partida com venue → screenshot mostra nome+cidade+capacidade na aba Fatos, console sem erro novo; numa partida sem venue (se houver) → empty-state, sem quebra.

### Decisões adiadas pro `/i` (baixo risco, defaults escolhidos)
- **Lugar do display:** aba **Fatos** (default). Header é alternativa; trocar é barato.
- **Foto do estádio no R2:** **subir** (consistente com team/player/league). Podável se complicar o P2 — schema já tem a coluna.

## Evidências

- [web] https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/venues/get-venue-by-id — entidade `venue` (football) tem `latitude`/`longitude` (string), `capacity`, `city_name`, `surface`, `image_path`: lat/long vêm da fonte, sem geocoding externo.
- [web] https://docs.sportmonks.com/v3/endpoints-and-entities/entities/fixture — `venue` é include direto da Fixture (`...season venue state weatherReport lineups...`): entra no mesmo request do sync.
- [código] `apps/api/src/db/schemas/leagues.ts:38` — tabela `match` sem `venueId`/venue; `team` (`:21`) é o molde da entidade `venue`; `lineup.coachId` (`:164`) é o molde do FK nullable.
- [código] `apps/api/src/db/sync-sportmonks.ts:300` — include das fixtures não traz `venue`; alargar aqui (mesma chamada).
- [código] `apps/web/features/leagues/components/match-detail/match-detail.tsx:120` — aba **Fatos** é placeholder ("Fatos da partida em breve"): lar natural do bloco de venue.
- [doc] `docs/arquitetura/modelagem.md:95-114` — `[cravado]` da tabela de estádio com `latitude/longitude numeric(9,6)` e "Sportmonks devolve como string; converter".

## Verificação

Provado por superfície (2026-06-29, commit base `dc71e0e`):

- **dados (P1+P2):** migração `0003_shiny_jocasta.sql` aplicada; `\d venue` mostra `latitude`/`longitude` `numeric(9,6)` e `match.venue_id` uuid FK. `bun run db:sync` → `venues: 20`; no banco: `select count(*) from venue` = 20, `count(*) filter (where latitude is null)` = **0** (cobertura geo 100% — C1 resolvido, sem plano B de geocoding), `count(*) from match where venue_id is not null` = **380/380**. Sample real: Old Trafford/Manchester/74879, Anfield/Liverpool/61276/53.43,-2.96.
- **api (P3):** `curl /v1/matches/<id>` → `venue: { name:"Stadium of Light", cityName:"Sunderland", capacity:48707, surface:"grass", latitude:"54.914000", longitude:"-1.388900", imageUrl:"…/venues/stadium-of-light-212.png" }` e `home:"Sunderland"` (estádio-casa correto). Lista da liga PL continua com **380 matches** → left join não derrubou partidas.
- **ui (P4):** `bun run typecheck` 3/3 verde + `eslint match-detail.tsx` 0 erros (3 warnings `<img>` consistentes com o padrão já usado no arquivo). **E2E Chrome (chrome-devtools MCP):** aba Fatos renderiza o card em 2 venues — Sunderland×West Ham "ESTÁDIO · Stadium of Light · Sunderland · 48.707 lugares" e Liverpool×Arsenal "Anfield · Liverpool · 61.276 lugares" — foto do estádio carrega do R2, capacidade formatada pt-BR, **sem lat/long**, console **limpo** (0 erros/warnings).
- **revisor (contexto fresco):** A1–A6 OK, nenhum bug funcional; só cosméticos menores (1 corrigido: subtítulo vazio quando cidade+capacidade ausentes).
