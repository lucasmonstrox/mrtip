# SIN-007 — Sinal de rivalidade · dossiê de planejamento (2026-07-23)

Feature: [docs/features/sinais/SIN-007-rivalidade.md](../features/sinais/SIN-007-rivalidade.md)
Base: commit `b8d47c1` (2026-07-22) — todo file:line deste doc vale neste commit, exceto paths marcados "(posterior ao pino)" (working tree ainda não commitado).

> **Revisão adversária (2026-07-23, Grok 4.5 high):** REPROVOU o plano v0 pro `/i`. BLOQUEIOs incorporados abaixo (prune-on-error, upsert vs `manual`, stub/slug/busca, check `team_id≠rival`). Nits (enum `source`, golden set T2, T8 por conjunto, Don't anti-prompt) também absorvidos. Score/whitelist/tier = fase 2.

## TL;DR

Esta iteração é **só a perna `dados` + leitura `api`**: criar a tabela `team_rival` (aresta dirigida time→rival), ingerir `/rivals/teams/{id}` da SportMonks no sync (com stub higienizado de time quando o rival não está na liga), e expor no `getMatch` um campo aditivo `rivalry` (`isRivalry` + pares). **`isRivalry` = whitelist SM (OR das arestas), não Índice 0–1 calibrado.** Sem UI, sem prompt, sem seed manual, sem auto-espelhar.

## Briefing — o que já foi falado e decidido

- **Pedido do dono nesta conversa (2026-07-23):** "Preciso de criar uma tabela pra guardar os rivais, etc." + `/pl`. Escopo explícito = persistência; o "etc." cobre ingestão e um consumidor de leitura, não o sinal quant completo. Fonte: dono nesta conversa.
- **Investigação já cravou ingerir `/rivals`:** ~20 requests, grátis no plano, cobertura parcial (Brighton/Flamengo vazios). Destrava SIN-007 alimentando λ_cards no futuro. Fonte: `docs/investigacoes/grafo-agentico-prognostico.md` §6.1 (posterior ao pino `b8d47c1`, working tree).
- **Matriz fora×dentro:** rivalidade **não existe no schema hoje**; `rivals` é unlock gratuito não ingerido; "a ingestão torna a relação representável sem tornar o efeito identificável". Fonte: `docs/arquitetura/matriz-cruzamento-fora-dentro.md` §§8–9 (posterior ao pino).
- **Índice de Rivalidade (whitelist + distância + H2H)** continua a regra-alvo em `docs/regras/rivalidade.md:80-87`, mas a **fonte operacional imediata** desta iteração é SportMonks — Wikipedia/derby.ist/footballderbies ficam fora.
- **Assimetria é feature:** Difference Score (`docs/regras/rivalidade.md:147`). Probe 2026-07-23: Flu→Fla / Inter→Grêmio; Fla/Corinthians/Grêmio ∅. **Não auto-espelhar.** `isRivalry` = OR dos dois sentidos — **não** é o score assimétrico; é presença SM.
- **Cobertura medida (2026-07-23):** BRA `25184` → 12/20·17 arestas; PL `25583` → 16/20·31. Rivais fora da liga: América Mineiro, Middlesbrough, Derby County, Walsall, Millwall, Dagenham…
- **Falsos negativos SM-only (adversário):** Botafogo×Fla / Botafogo×Flu / Botafogo×Vasco (Botafogo ∅ outbound e ninguém o lista); derbies com Brighton se o outro lado também não lista. Fla-Flu / Gre-Nal / Timão×Palmeiras **não** são FN (OR pega a aresta do outro lado).
- **Adversário (2026-07-23):** dono pediu revisão Grok 4.5 high → REPROVA até BLOQUEIOs; dono mandou incorporar no plano antes do `/i`.
- **Lei do ex / formato `match` / efeitos quant** — fora desta iteração (`ia: investigado`).

## Estado do terreno

**Schema — rivalidade inexistente.** `apps/api/src/db/schemas/leagues.ts` tem `team` (`:49-64`) com `sportmonksTeamId` unique + `slug` unique (`:53`), mas **nenhuma** tabela `team_rival`. Repo **não** usa `checkConstraints` Drizzle hoje (Grep vazio) — o check `team_id <> rival_team_id` vai na **SQL da migration** (não “ou guard”).

**Sync — times sobem via standings, rivais não.** `apps/api/src/db/sync-sportmonks.ts:372-400` upserta `team` e monta `teamIdBySm`. Slug = `slugify(name)` puro (`:390`); sufixo SM só no logo R2 (`:382-384`) — stubs **não** podem copiar slug puro (colisão).

**Busca varre todo `team`.** `searchTeams` (`apps/api/src/modules/leagues/search/search.service.ts:85-91`) — stubs Millwall/América viram hit se não filtrarmos. `getTeam` devolve 200 com `standing: null` (`get-team.service.ts:19-37`).

**Precedente ingest auxiliar:** `ingestReferees` (`sync-ingest.ts:183-221`). Rivals = endpoint próprio → `sync-rivals.ts` + gancho pós-teams.

**API — `getMatch` composição aditiva.** `get-match.service.ts:34-70` (`referee`/`tvStations`). Callers: `matches.routes.ts`, `_check-referee.ts`.

**Prognóstico:** `prognosis-prompt.ts` tem H2H (MOD-006), **não** rivalidade. Esta fatia **não** mexe nele (prova T9).

## Mapa de dependências

**Features** (`bun run features impact SIN-007`):

| ID | Por quê encosta nesta iteração |
|---|---|
| DOS-001 | `impacta`: dossiê da partida ganha flag `rivalry` (ainda sem card UI) |
| SIN-009 | declara impactar SIN-007 — sem risco agora (só persistência) |
| MOD-001 / SIN-016 | `impacta` declarado; **fora** (sem prompt / sem desconto de mando) — Don't + T9 trava regressão |
| LIG-004 | âncora `venue` — não alterada |

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `leagues.ts` (`teamRival`) | sync + loader | migrate; typecheck |
| `sync-rivals.ts` / gancho em `sync-sportmonks.ts:400` | `db:sync`, `scripts/sync-rivals.ts` | contagens teams/fixtures + rivals |
| `search.service.ts#searchTeams` | rota search | stubs **não** aparecem (T3b) |
| `getMatch#getMatch` | `matches.routes.ts`, `_check-referee.ts` | legado + `rivalry` |
| `prognosis-prompt.ts` | scripts de prognóstico | **byte-a-byte intacto** (T9) |

## Blast radius e cuidados

- **Stub polui catálogo/busca** — Millwall no search / URL fantasma. Mitigação: slug `slugify(name)+"-"+smId`; `searchTeams` exige standing (ou flag) — ver §Ingest / §Busca.
- **Prune-on-error** — fetch falha → `[]` → DELETE wipe SM daquele time. Mitigação: prune **só** após 200 + parse OK; em erro **skip** (sem DELETE).
- **Upsert clobberra `manual`** — `onConflictDoUpdate` set `source='sportmonks'` no mesmo `(team,rival)` apaga curadoria. Mitigação: se row existente é `manual`, **não** update; só insert se ausente / update se já `sportmonks`.
- **Assimetria / OR** — auto-espelhar mentiria Difference Score. `isRivalry` true ≠ clássico calibrado (West Ham→Dagenham é FP de produto sem tier — fase 2).
- **`getMatch` legado** — campo aditivo; typecheck + T6.
- **Representável ≠ identificável** — flag no payload **não** autoriza λ/prompt. Fonte: matriz §8.
- **Custo API** — 1 req/time (~20/liga); não por fixture.

## Evidências

- [doc] `docs/investigacoes/grafo-agentico-prognostico.md` §6.1 (posterior ao pino) — ingerir `/rivals`.
- [doc] `docs/arquitetura/matriz-cruzamento-fora-dentro.md` §9 (posterior ao pino) — sem entidade de rivalidade.
- [doc] `docs/regras/rivalidade.md:147` — assimetria / Difference Score.
- [código] `apps/api/src/db/schemas/leagues.ts:49-64` — molde `team` + `slug` unique.
- [código] `apps/api/src/db/sync-sportmonks.ts:372-400` — gancho pós-teams; slug puro.
- [código] `apps/api/src/modules/leagues/search/search.service.ts:85-91` — busca varre todo `team`.
- [código] `apps/api/src/modules/leagues/get-match/get-match.service.ts:34-70` — payload aditivo.
- [adversário] revisão 2026-07-23 — REPROVA; 4 BLOQUEIOs + nits absorvidos neste doc.
- [probe] 2026-07-23 — BRA 17 / PL 31; assimetria Fla/Flu.

## Detalhes por passo

### §Schema — `team_rival` (expand-only)

Em `apps/api/src/db/schemas/leagues.ts` (junto de `team`), carimbo `// @feature SIN-007` **só** nesta tabela:

```ts
export const teamRival = pgTable(
  "team_rival",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: uuid("team_id").notNull().references(() => team.id),
    rivalTeamId: uuid("rival_team_id").notNull().references(() => team.id),
    // only: sportmonks | manual — enforced by CHECK in migration SQL
    source: text("source").notNull().default("sportmonks"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.teamId, t.rivalTeamId)],
)
export type TeamRival = typeof teamRival.$inferSelect
```

**Na migration SQL (obrigatório, não “ou”):**

```sql
ALTER TABLE team_rival
  ADD CONSTRAINT team_rival_no_self CHECK (team_id <> rival_team_id);
ALTER TABLE team_rival
  ADD CONSTRAINT team_rival_source_check CHECK (source IN ('sportmonks', 'manual'));
```

Sem coluna de score/intensidade nesta iteração. Sem `updated_at` (upsert SM não mexe em timestamp).

### §Ingest — `ingestTeamRivals`

Arquivo preferido: `apps/api/src/db/sync-rivals.ts` + `apps/api/scripts/sync-rivals.ts` (backfill).

Para cada `{ sportmonksTeamId, teamId }`:

1. **Fetch:** `sm(/rivals/teams/{id}?include=rival)`.
2. **Se throw / status≠OK / `data` inválido:** log warn, `errors++`, **`continue` sem DELETE** (BLOQUEIO prune-on-error).
3. **Stubs:** rival SM id ∉ mapa → insert `team` só se ausente:
   - `slug = slugify(name) + "-" + smId` (BLOQUEIO colisão)
   - `logoUrl: null`, `shortCode: null`
   - **Don't** `onConflictDoUpdate` de name/logo/slug de time já completo
4. **Arestas `sportmonks`:** para cada `rival_id` (skip se `== team sm id`):
   - se já existe row `(team,rival)` com `source='manual'` → **skip** (BLOQUEIO; não clobber)
   - senão `INSERT … ON CONFLICT DO UPDATE SET source='sportmonks'` **somente se** a row conflitante já era `sportmonks` (ou usar `WHERE team_rival.source = 'sportmonks'` no DO UPDATE / insert-only + prune)
5. **Prune (só após passo 1 OK):** `DELETE … WHERE team_id=$id AND source='sportmonks' AND rival_team_id NOT IN (keep)`.
6. Gancho: após `teamIdBySm` completo em `sync-sportmonks.ts:400`. Dry-run: não chama. Log: `rivals: N edges (M stubs) · errors=E` onde N = rows SM processadas com sucesso (não confundir com COUNT pós-prune — T2 conta o banco).

### §Busca — stubs fora do search

Em `searchTeams` (`search.service.ts:85-91`): restringir a times que **existem em `standing`** (qualquer season) **ou** equivalente “tem campanha”. Stubs só-rivais somem da busca. Don't: filtrar por `logoUrl IS NOT NULL` (times reais sem logo).

Conflict path standings→mesmo `sportmonksTeamId`: sync de liga já faz `onConflictDoUpdate` e preenche logo/nome — stub vira time real; slug com sufixo SM **permanece** (aceitável; não renomear URL na mesma fatia).

### §API — shape `rivalry` no `getMatch`

```ts
type RivalryEdge = { fromTeamId: string; toTeamId: string; source: string }
type RivalryInfo = { isRivalry: boolean; edges: RivalryEdge[] }
```

Loader `loadMatchRivalry(home, away)`: edges onde par ∈ {(h,a),(a,h)}. `isRivalry = edges.length > 0`.

Comentário no loader (colado): *whitelist SportMonks via OR; NÃO alimentar λ/prompt/Índice nesta fatia — representável ≠ identificável.*

UUIDs nas edges (padrão API); nomes vêm do `serializeMatch` home/away. Sem UI.

### §Testes (API/dados)

Script `apps/api/scripts/_check-rivals.ts` (molde `_check-referee.ts`) — **10 casos**:

| Caso | Assert |
|---|---|
| T1 schema | cols + unique `(team_id,rival_team_id)` + **CHECK** `team_id<>rival_team_id` + **CHECK** `source IN ('sportmonks','manual')` |
| T2 cobertura | `COUNT(*) source=sportmonks` ≥ 25 **e** golden set presente: Flu→Fla, Inter→Grêmio, ≥1 aresta PL (ex. Arsenal→Tottenham ou City→United) |
| T3 stub | ≥1 `team` só como `rival_team_id`, sem `standing`; slug casa `-{smId}` no fim |
| T3b busca | `searchTeams` (via `search()`) com needle do stub **não** retorna o stub |
| T4 assimetria | ≥1 A→B sem B→A |
| T5 prune+clobber | insert `manual` no mesmo par que SM também lista (ou par artificial); re-ingest → row continua `source='manual'`; SM **não** sobrescreveu |
| T5b prune-on-error | simular/forçar skip: time com arestas SM; chamar ingest com fetch que falha (mock ou id inválido isolado) → arestas SM **permanecem** |
| T6 getMatch derby | `isRivalry===true` + ≥1 edge + legado (`referee`,`tvStations`,`standings`,`rest`) |
| T7 getMatch comum | `isRivalry===false`, `edges:[]` |
| T8 idempotência | 2× ingest full standing-teams → **mesmo conjunto** `{(team_id,rival_team_id)}` source=sportmonks (não só COUNT) |
| T9 anti-prompt | `git diff` / hash: `apps/api/scripts/prognosis-prompt.ts` **não** entra no diff desta feature |

Sem chrome-devtools / Playwright nesta iteração.

## Plano executável

Ver seção `## Plano` de [docs/features/sinais/SIN-007-rivalidade.md](../features/sinais/SIN-007-rivalidade.md) — os passos NÃO são duplicados aqui.
