# Venue / estádio com geo (nome + cidade + lat/long) na página da partida

> **As-of:** 2026-06-29 · **Feature:** LIG-004 · **Tier:** comparação/focado (fonte de dados única já assinada).
> **Origem:** wishlist W-007 (estádio de cada partida) + W-008 (coordenadas lat/lon) — promovidas como **uma feature só**.

## TL;DR + recomendação

**A SportMonks entrega o venue completo por fixture, lat/long inclusos — não precisa de geocoding externo.** A entidade `venue` da SportMonks football v3 expõe `name`, `city_name`, `latitude` (string), `longitude` (string), `capacity` (int), `surface`, `image_path` (verificado por fetch na doc viva), e `venue` é um **include direto da Fixture** (`/fixtures/between?...&include=venue`) — entra **no mesmo request** que o sync já faz, custo de rede zero. O schema **não tem** nenhuma noção de venue hoje (gap confirmado). Recomendação cravada: criar uma **tabela `venue` própria** (entidade, em inglês — não `estadios`), `match.venueId` FK nullable, alargar o include do sync, upsert do venue (imagem→R2 no mesmo padrão de team/player), e exibir nome/cidade/capacidade na página da partida (aba **Fatos**, hoje placeholder). Lat/long ficam guardadas como insumo do **sinal de viagem/fadiga** (SIN-008), não são display. Isto confirma e operacionaliza a decisão **[cravado]** que o `docs/arquitetura/modelagem.md` §3.2 já tinha tomado.

## Contexto e problema

- **Pedido:** registrar e exibir o estádio de cada partida na página da partida (W-007), com latitude/longitude por estádio (W-008), modelado como tabela `venue` própria que `match` referencia.
- **Por que uma feature só:** a coordenada (W-008) é a razão de o venue virar **tabela** em vez de coluna solta em `match` — lat/long são atributos do estádio, não da partida. Já decidido na wishlist.
- **Consumidores reais:** (a) **display** na página da partida (mando real, fator casa, contexto); (b) **insumo de modelo** — distância de viagem do visitante (sinal de fadiga sobre over/under, SIN-008) e rivalidade territorial (SIN-007). Coordenada só vira valor com a fórmula de distância (haversine); o display em si **não** mostra lat/long.
- **Requisitos implícitos do repo:** schema/código **em inglês** (tabela `venue`, coluna `venueId`), só UI em pt-BR ([[codigo-em-ingles-ui-em-pt]]); SportMonks é fonte única (PL league 8, season 25583); imagens no R2 bucket `mrtip`; datas/fuso por `date-fns`/IANA quando entrar fuso.

## Estado real no código

**Gap confirmado — não há venue em lugar nenhum do banco.** `grep -i "venue|stadium|estadio|latitude|longitude"` em `apps/api/src/db` → **zero matches** (busca desta sessão). Em detalhe:

- **Schema** (`apps/api/src/db/schemas/leagues.ts`): a tabela `match` (linha 38) tem `sportmonksFixtureId`, `leagueCode`, `round`, `name`, `date`, `time`, `homeTeamId`, `awayTeamId`, score (4 colunas) e `status` — **sem** `venueId`/`venue`/`stadium`. Não existe tabela `venue`. O molde de "entidade própria deduplicada por id da SportMonks com imagem em R2" é a tabela `team` (linha 21: `id uuid` PK, `sportmonksTeamId` notNull unique, `logoUrl` R2). O molde de FK nullable opcional é `lineup.coachId` (linha 164).
- **Sync** (`apps/api/src/db/sync-sportmonks.ts`): o include das fixtures (linhas 300-301) é `participants;scores;round;state;lineups.player;lineups.position;lineups.details;formations;events.type;sidelined.player;sidelined.type` — **`venue` não está lá**. O tipo `SmFixture` (linha 107) não tem campo `venue`. O loop de matches (linha 309) monta `values` (linha 320) sem venue. ⇒ unlock = adicionar `venue` ao include + tipo `SmVenue` + upsert + setar `match.venueId`.
- **API** (`apps/api/src/modules/leagues/`): `serializeMatch` vive em `shared/shared.ts` (monta o objeto da partida, incl. `score.ht` a partir de `htHome/htAway`); o endpoint da página da partida é `get-match/get-match.service.ts`. Nenhum dos dois conhece venue hoje. ⇒ unlock = join `match→venue` e um campo `venue` no objeto serializado.
- **UI** (`apps/web/features/leagues/components/match-detail/match-detail.tsx`): a aba **"Fatos"** é um placeholder literal — `<TabEmpty>Fatos da partida em breve.</TabEmpty>` (linha 120). É o lar natural do bloco de venue. O header (linhas 37-87) já mostra liga + data + placar + form; venue caberia no header (uma linha "📍 Anfield · Liverpool") ou como primeiro card da aba Fatos.

**Decisão de arquitetura já cravada (não re-decidir, só reconciliar nome):** `docs/arquitetura/modelagem.md` §3.2 (linhas 95-114) já especificou a tabela com `[cravado]`: `nome, apelido, capacidade, superficie, latitude numeric(9,6), longitude numeric(9,6), fuso, imagem_url`, e afirma "**Sportmonks** (`latitude`/`longitude`, `capacity`, `surface`)" + "Sportmonks devolve como string; converter" (linhas 97, 110). A linha 37 da mesma tabela comparativa: Sportmonks `venues` "(com `surface`, lat/long)". **Reconciliação obrigatória:** o `modelagem.md` usa nomes em português (`estadio`, `pais`, `cidade`); o schema real é inglês ⇒ a tabela será **`venue`** e a coluna **`venueId`**. O `docs/features/INDEX.md` lista a âncora como `estadios` (compartilhada por SIN-006/007/008/016) — é o mesmo conceito; a feature LIG-004 **cria e possui** a tabela, e esses sinais viram dependentes dela.

## Estado da arte / fonte de dados (claims atômicos)

Todos os claims abaixo são `verificado-fetch` na doc viva da SportMonks v3 (football), as-of 2026-06-29:

- **A entidade `venue` (football) tem coordenadas.** Campos: `id` (int), `country_id` (int), `name` (string), `address` (string), `zipcode` (string), `state` (string/null), **`latitude` (string)**, **`longitude` (string)**, **`capacity` (int)**, `image_path` (string/null), **`city_name` (string)**, **`surface` (string)**, `national_team` (bool). — SUPPORTED · https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/venues/get-venue-by-id
- **`venue` é include direto da Fixture.** A lista de includes da Fixture entity inclui `... season venue state weatherReport lineups events ...` ⇒ `/fixtures/between/{from}/{to}?...&include=venue` traz o objeto venue inline por partida. — SUPPORTED · https://docs.sportmonks.com/v3/endpoints-and-entities/entities/fixture
- **Cada team também carrega um `venue_id` (estádio-casa).** Visível no objeto participant do exemplo de scores (`"venue_id": 134` para o Napoli). Existe ainda o nested `participants.venue`. — SUPPORTED · https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/includes/participants
- **Coordenadas vêm como string** — "Parse to float before passing to a mapping library" (nota da doc; idêntico ao "converter" do modelagem.md). — SUPPORTED · https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/venues/get-venue-by-id

**Classificação de mercado:** mostrar o estádio do jogo é **paridade** (qualquer preview/súmula tem). O **diferencial defensável** não é o display — é usar lat/long como insumo auditável do sinal de viagem/fadiga (conversa com a tese: o número que justifica o pick aparece na tela). Por isso a coordenada entra agora (de brinde no mesmo objeto), mesmo sem consumidor de UI imediato.

## Modelo de dados proposto (inglês, alinhado ao `modelagem.md` §3.2)

Tabela nova `venue` (entidade própria, molde `team`):

```ts
export const venue = pgTable("venue", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksVenueId: integer("sportmonks_venue_id").notNull().unique(), // dedup key
  name: text("name").notNull(),
  cityName: text("city_name"),          // denormalizado (display); SportMonks city_name
  capacity: integer("capacity"),
  surface: text("surface"),             // "grass" | "artificial" | null
  latitude: numeric("latitude", { precision: 9, scale: 6 }),   // SportMonks devolve string
  longitude: numeric("longitude", { precision: 9, scale: 6 }),
  imageUrl: text("image_url"),          // foto do estádio em R2 (bucket mrtip), origem image_path
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})
```

E em `match`: `venueId: uuid("venue_id").references(() => venue.id)` (nullable — molde `lineup.coachId`).

**Decisões de modelagem (3 conscientes, valem o aval no `/pl`):**
1. **`cityName` denormalizado** (text na própria `venue`) em vez das tabelas normalizadas `pais`/`cidade` que o `modelagem.md` §3.1 previa. Rationale: o MVP só **exibe** a cidade; normalizar país/cidade é trabalho de quando um sinal precisar agrupar por cidade/país. Simplificação, não contradição — anotar pro `/pl`.
2. **`latitude`/`longitude` como `numeric(9,6)`** (segue o `[cravado]`; ~0.1 m de resolução). Drizzle devolve `numeric` como **string** — o consumidor (haversine) faz `Number(...)`. Alternativa `doublePrecision` evita o parse mas perde o alinhamento com o cravado; fico com `numeric`.
3. **Usar `fixture.venue` (venue real do jogo), não o `venue_id` do time da casa.** Em jogo de campo neutro (final de copa, jogo realocado) o venue real diverge do estádio-casa; `fixture.venue` reflete onde **de fato** se jogou. Para a PL 25/26 quase sempre coincidem, mas a regra correta é a da fixture. `fuso`/`apelido`/`address` do `modelagem.md` ficam de fora do MVP (sem consumidor) — fáceis de somar depois, mesma fonte.

## Plano por faceta

- **dados** — (1) tabela `venue` + `match.venueId` no schema Drizzle + migração; (2) `SmVenue` type + `venue` no include das fixtures (`sync-sportmonks.ts:300`); (3) coletar venues distintos das fixtures, upload de `image_path`→R2 via `pool(...)` (igual teams/players/flags), upsert por `sportmonksVenueId`, montar `venueIdBySm`; (4) setar `venueId` no `values` do match (`:320`); (5) re-sync e **verificar preenchimento de lat/long** (ver riscos).
- **api** — join `match→venue` no `get-match` + campo `venue: { name, cityName, capacity, surface, latitude, longitude } | null` no `serializeMatch` (`shared/shared.ts`). TypeBox no schema da rota (Elysia/Eden — sem response schema pesado, regra [[elysia-cloudflare-workers]]).
- **ui** — bloco de venue na página da partida: nome + cidade + capacidade (e foto se houver) no header ou no primeiro card da aba **Fatos** (`match-detail.tsx:120`). **Não** exibir lat/long. Strings em pt-BR ("Estádio", "Capacidade").
- **ia** — nenhuma agora. Lat/long é insumo futuro do SIN-008 (distância de viagem) e SIN-007 (proximidade territorial); a feature **entrega o dado**, o sinal consome depois.

## Riscos e gotchas

- **Completude de lat/long (o maior risco — não verificável no /rs).** A doc confirma que o **campo existe**, não que **toda** venue da PL está preenchida; cobertura de coordenada na SportMonks é historicamente irregular. **Mitigação:** o **display (W-007) não depende de coordenada** — nome+cidade bastam; só o **consumidor geo (W-008→SIN-008)** sofre se vier null. Verificar no `/i` com um `count(*) where latitude is null` após o re-sync; se houver buracos, geocodar nome+cidade 1x e cachear é o plano B (não bloqueia o display).
- **Coordenada como string** — `Number(latitude)` na borda; nunca aritmética sobre string.
- **Campo neutro** — usar `fixture.venue` (acima).
- **Só PL 25/26 ingerida** — venue por enquanto cobre só a PL; multi-liga é o mesmo unlock de sempre, sem mudança de modelo.
- **`image_path` pode ser null** — o `imgKey/uploadImagem` já trata null (igual team logo sem imagem); `imageUrl` fica null.
- **Re-sync obrigatório** — `match.venueId` só preenche em fixtures re-sincronizadas (mesma natureza das colunas home/away do standing, `leagues.ts:88`).

## Refutado

- **"Precisa de fonte de geocoding externa para as coordenadas" (premissa em aberto na W-008).** REFUTED — a SportMonks devolve `latitude`/`longitude` na própria entidade `venue`, inclusa no include da fixture (fetch acima). Geocoding externo só vira plano B **se** a cobertura de coordenada vier furada na prática (risco acima), não como dependência de projeto.

## Perguntas abertas / lacunas

- **Cobertura real de lat/long para os ~20 estádios da PL 25/26** — NEI no /rs (exigiria bater na API com o token); resolver no `/i` com query pós-sync. Não bloqueia o display.
- **Onde exibir o venue** — header (linha compacta "📍 Anfield · Liverpool, 53.000") vs primeiro card da aba **Fatos**. Decisão de UI pro `/pl`/`/i` (o João decide no visual).
- **Foto do estádio no R2** — vale o custo de subir a imagem agora ou só nome/cidade? Default: subir (consistente com team/player/league/nationality), mas é podável.
- **Sinergia de brinde não usada agora:** o mesmo include de fixture aceita `weatherReport` e `metadata` (pitch/weather) — insumo direto do **SIN-006 (clima)**; fora do escopo desta feature, anotado para quando o SIN-006 for implementado.

## Auditoria de citações

- [x] URLs todas de tool result desta sessão (SportMonks docs MCP).
- [x] Spot-check: campos `latitude`/`longitude`/`capacity`/`city_name` reabertos contra `GET Venue by ID` e a Fixture entity.
- [x] Load-bearing (venue traz coords + é include de fixture) veio de fetch, não snippet.
- [x] Escopo fiel ao pedido (venue+geo na página da partida, uma feature só).
- [x] Achados internos com âncora `path:linha` de leitura desta sessão (`leagues.ts:38`, `sync-sportmonks.ts:300`, `match-detail.tsx:120`, `modelagem.md:95-114`).
- [x] Refutado preenchido (geocoding externo) + lacunas declaradas (cobertura de coord = NEI honesto).
