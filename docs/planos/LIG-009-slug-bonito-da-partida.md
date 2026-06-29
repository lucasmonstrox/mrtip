# LIG-009 — Slug bonito da partida · dossiê de planejamento (2026-06-29)

Feature: [docs/features/ligas/LIG-009-slug-bonito-da-partida.md](../features/ligas/LIG-009-slug-bonito-da-partida.md)
Base: commit `eec3e64` (2026-06-29) — todo file:line deste doc vale neste commit.

## TL;DR

Dar à partida uma URL legível — `premier-league-2025-2026-chelsea-vs-everton` — em vez do uuid cru,
**espelhando o precedente do time** (`team.slug`, `text().notNull().unique()`, key de `/teams/:slug`).
Decisão central: uma **coluna `match.slug` persistida com índice único**, gerada no sync via `slugify`
(o mesmo já usado pro time), no formato `{liga}-{temporada}-{casa}-vs-{fora}`. O slug é único por
construção (par ordenado casa×fora ocorre 1× por liga+temporada; a volta é `everton-vs-chelsea`) — o
`unique` no banco é a rede de segurança. Motivação é **estética da URL**, não SEO.

## Briefing — o que já foi falado e decidido

- Quer slug "legal que não vai colidir" no formato `premier-league-2025-2026-chelsea-vs-everton`, e
  já intuiu que "precisa de índice" — fonte: dono nesta conversa (2026-06-29).
- Motivação é **beleza da URL, não SEO** — fonte: dono nesta conversa (2026-06-29). Implicação: o slug
  deve aparecer em TODO link de partida (não basta a URL canônica), senão fica inconsistente.
- "Código/dado em inglês, UI em PT" — o slug é dado/URL → inglês, derivado do nome real (slugify).
  Fonte: memória [[codigo-em-ingles-ui-em-pt]]. (Nomes de time vêm da SportMonks em inglês.)
- Série LIG-NNN transforma entidades em perfis ricos com URLs boas — fonte: memória
  [[paginas-de-entidade-perfil-rico]]; o slug da match encaixa nessa série.
- A temporada faz parte do slug e é o que evita colisão entre anos — depende de LIG-008 ter a entidade
  `season` + `match.seasonId`. **Já satisfeito**: LIG-008 P1/P2 = `[x]` (tabela criada, `seasonId`
  backfillado) — fonte: `docs/features/ligas/LIG-008-historico-multi-temporada.md:53-54`.

## Estado do terreno

- **Schema**: `match` (`apps/api/src/db/schemas/leagues.ts:76-104`) tem `leagueCode`, `seasonId`
  (nullable, FK→season — LIG-008), times por FK, mas **nenhuma** coluna `slug`. Precedente a copiar:
  `team.slug` em `leagues.ts:43` (`text("slug").notNull().unique()`). `season.name` é o rótulo
  "2025/2026" (`leagues.ts:29`); `league.name` é "Premier League" (`leagues.ts:10`).
- **slugify**: `apps/api/src/db/sync-sportmonks.ts:145-151` — NFD + lowercase + kebab. **Não exportado**
  (script com `main()` no fim) → para reusar no backfill, extrair pra módulo importável.
- **Geração no sync**: o upsert da match está em `sync-sportmonks.ts:359-388`; nesse escopo há
  `home`/`away` (participants com `.name`, ver `sync-sportmonks.ts:360-361`) e, no `main()`,
  `apiLeague.name`/`apiSeason.name` (`sync-sportmonks.ts:223-225`). Tudo que o slug precisa está à mão.
- **Payload da match (API)**: `serializeMatch` (`shared.ts:470-497`) é a **única** fonte do shape de
  partida pra list/rounds/detail — adicionar `slug` aqui propaga pra rounds e pra página da match.
- **Roteamento API**: `/v1/matches/:id` valida uuid na borda (`matches.routes.ts:17,23`); as sub-rotas
  (`/form`,`/lineup`,`/injuries`,`/absence-impact`,`/goal-timing`,`/scorers`) também são por uuid.
- **Roteamento web**: `app/(app)/matches/[id]/page.tsx:4-10` passa `id` pro `MatchDetail`;
  `MatchDetail({ id })` (`match-detail.tsx:78-80`) repassa o **mesmo** `id` a todos os hooks filhos
  (`useMatchQuery`, `useMatchFormQuery`, e dentro deles lineup/injuries/etc.).
- **Links de partida (web)** — 5 pontos, 2 fontes de payload distintas:
  - via `serializeMatch` (ganham slug de graça): `rounds-list.tsx:69` (`m.id`).
  - via selects custom (precisam do slug no select): `team-detail.tsx:70` ← `loadTeamMatches`
    (`shared.ts:760`); `coach-detail.tsx:29` ← `getCoachDetail` (`shared.ts:943`);
    `player-detail.tsx:209` ← matches do jogador (`shared.ts:923`); `form-guide.tsx:50` ← form service
    (tipo em `shared.ts:169`).

## Mapa de dependências

**Features** (`bun run features impact LIG-009`):
- LIG-008 ← `depende_de`: o slug embute a temporada; precisa de `season`+`match.seasonId` (já prontos).
- Coordenação (não é aresta de grafo): LIG-008 **P7** vai refatorar o sync em `syncSeason(...)`. A
  geração do slug deve ser uma função chamada **no ponto de upsert da match**, pra que o refactor da
  LIG-008 a carregue automaticamente ao ingerir temporadas antigas. Nota adicionada à LIG-008.

**Código**:

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `schemas/leagues.ts#match` (+coluna slug) | drizzle migrations; todo read de match | `db:generate`/`db:migrate` exit 0; `\d match` |
| `shared.ts#serializeMatch` (+slug) | rounds, página da match, list | curl `/v1/leagues/PL/rounds`, `/v1/matches/:slug` |
| `matches.routes.ts` GET `/:id`→`/:slug` | `useMatchQuery`, eden client | curl by slug + by uuid (dual) |
| `shared.ts#loadTeamMatches`,`getCoachDetail`, matches do jogador, form (+slug) | team/coach/player/form pages | curl cada endpoint, slug presente |
| `sync-sportmonks.ts` upsert match (+slug) | dado ingerido | `db:sync` → slugs não-nulos |

## Blast radius e cuidados

- `serializeMatch` é o shape compartilhado de TODA partida — mudança é **aditiva** (campo novo), segura;
  mas se algum consumidor tipar o retorno estritamente, o eden propaga o tipo novo (esperado).
- Troca do param `/:id`→`/:slug` na rota canônica da match: **web tem de virar em lockstep** (rota
  `[slug]` + `MatchDetail` buscando por slug). Sintoma se desalinhar: página da match 404/422; detectar:
  typecheck do eden + golden path Chrome.
- URLs antigas por uuid (`/matches/<uuid>`) quebrariam num corte seco — sintoma: link/bookmark antigo
  404. Mitigado por D3 (resolução dual uuid|slug).
- Janela expand→contract: entre adicionar a coluna nullable e o `notNull`+`unique`, linhas sem slug
  existem; detectar: query de `slug is null` = 0 ANTES do contract (critério de avanço do P2).
- Coordenação LIG-008: se a refatoração do sync (P7) landar e **não** chamar o helper de slug, temporadas
  antigas entram com `slug` null → viola o `notNull`. Detectar: `db:sync` de season antiga falha no insert.

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:43` — `team.slug text().notNull().unique()`: precedente exato a espelhar na match.
- [código] `apps/api/src/db/sync-sportmonks.ts:145-151` — `slugify` (NFD+kebab) reusável; não exportado (extrair).
- [código] `apps/api/src/db/sync-sportmonks.ts:359-388` — upsert da match; `home.name`/`away.name` no escopo; ponto de geração do slug.
- [código] `apps/api/src/db/sync-sportmonks.ts:223-225` — `apiLeague.name`/`apiSeason.name` disponíveis no `main()`.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:470-497` — `serializeMatch`: única fonte do shape de partida.
- [código] `apps/api/src/modules/leagues/matches.routes.ts:17-23` — `/:id` valida uuid; sub-rotas por uuid.
- [código] `apps/web/.../match-detail.tsx:78-80` — `MatchDetail({ id })` repassa o id a todos os filhos → buscar por slug e usar `match.id`.
- [doc] `docs/features/ligas/LIG-008-...:53-54` — P1/P2 (`season`+`seasonId` backfill) já feitos: dependência satisfeita.

## Detalhes por passo (referenciados pelo ## Plano)

### §Slug (helper)
Extrair `slugify` de `sync-sportmonks.ts` pra um módulo importável (ex.: `apps/api/src/db/slug.ts`) e
adicionar:
```ts
export function matchSlug(leagueName: string, seasonName: string, homeName: string, awayName: string): string {
  return [slugify(leagueName), slugify(seasonName), slugify(homeName), "vs", slugify(awayName)].join("-")
}
// "Premier League","2025/2026","Chelsea","Everton" → "premier-league-2025-2026-chelsea-vs-everton"
```
`sync-sportmonks.ts` passa a importar `slugify`/`matchSlug` desse módulo (remove a cópia local).
No upsert (`sync-sportmonks.ts:370-382`) adicionar `slug: matchSlug(apiLeague.name, apiSeason.name, home.name, away.name)` ao `values`.

### §Backfill
Script `apps/api/scripts/backfill-match-slug.ts` (precedente: `apps/api/scripts/backfill-season.ts`):
select de cada `match` join `season`/`league`/team(casa)/team(fora) → `matchSlug(...)` → `update match set slug=...`.
Critério de avanço: `select count(*) from match where slug is null` = 0 ANTES da migração de contract.

### §Resolução dual (rota)
`getMatch` recebe `key: string`; se `key` casa formato uuid → resolve por `match.id` (caminho atual,
`getMatchRow`); senão → resolve por `match.slug` (novo `getMatchRowBySlug`). Param da rota deixa de ser
`format: "uuid"` e passa a `t.String()`; o 404 (`match_not_found`) cobre slug/uuid inexistente.

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-009-slug-bonito-da-partida.md](../features/ligas/LIG-009-slug-bonito-da-partida.md) — os passos NÃO são duplicados aqui.
