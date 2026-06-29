---
id: LIG-009
titulo: Slug bonito da partida (URL legível por liga/temporada/confronto)
modulo: ligas
status: verificado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P3 # P1 | P2 | P3
facetas:
  dados: verificado # coluna match.slug notNull/unique; gerada no sync via matchSlug; backfill 380/0-null/0-dup
  api: verificado # /v1/matches/:slug (resolução dual uuid|slug); slug em serializeMatch + payloads de partida
  ui: verificado # rota [id]→[slug]; MatchDetail busca por slug e usa match.id nos filhos; 5 links via m.slug
testada: sim
testes:
  - "API curl: /v1/matches/<slug> e /v1/matches/<uuid> resolvem o MESMO match; unknown→404 (2026-06-29)"
  - "DB assert: 380 matches com slug, 0 null, 0 duplicados; slug = premier-league-2025-2026-chelsea-vs-everton (2026-06-29)"
  - "API curl: rounds/time/jogador/forma trazem slug por partida; player 36/36 appearances (2026-06-29)"
  - "typecheck api 3/3 limpo; web limpo nos arquivos tocados (erros restantes são pré-existentes em prognosis.tsx)"
  - "UI golden path confirmado pelo dono no app após restart do dev server (2026-06-29)"
depende_de: [LIG-008] # a temporada faz parte do slug e é o que evita colisão entre anos
impacta: []
ancoras:
  settings: []
  tabelas: [match] # adiciona match.slug (unique)
  tools: []
  funcoes: [slugify, matchSlug, getMatchRow, getMatchRowBySlug, serializeMatch, loadTeamMatches, getCoachDetail]
  rotas: [/v1/matches/:id]
docs:
  - docs/planos/LIG-009-slug-bonito-da-partida.md
verificado_em: 2026-06-29
atualizado: 2026-06-29
---

# Slug bonito da partida (URL legível por liga/temporada/confronto)

## Descrição

Hoje a partida é roteada por uuid cru (`/matches/<uuid>`, tanto na web `app/(app)/matches/[id]`
quanto na API `/v1/matches/:id`). A ideia é uma URL **legível e bonita** — `premier-league-2025-2026-chelsea-vs-everton` —
seguindo o precedente que já existe pro time (`team.slug`, `.notNull().unique()`, key de `/teams/:slug`).
Motivação: **estética da URL** (não SEO). O slug é gerado no sync, persistido numa coluna com índice
único, e vira a key pública da página da partida.

## Tarefas

- [x] P1 dados — coluna `match.slug` nullable + migração (expand)
- [x] P2 dados — helper `matchSlug` + geração no sync + backfill das existentes + contract (notNull/unique)
- [x] P3 api — `slug` em `serializeMatch` + rota canônica `/v1/matches/:slug` com resolução dual uuid|slug
- [x] P4 api — `slug` nos payloads custom de partida (time/treinador/jogador/forma)
- [x] P5 ui — rota `[id]`→`[slug]` + `MatchDetail` busca por slug e usa `match.id` nos filhos
- [x] P6 ui — links de partida (rounds/time/treinador/jogador/forma) passam a usar `m.slug`

## Plano (2026-06-29)

Dossiê: [docs/planos/LIG-009-slug-bonito-da-partida.md](../../planos/LIG-009-slug-bonito-da-partida.md)
Dependência LIG-008: o que o slug precisa (tabela `season` + `match.seasonId` backfillado) já está feito (LIG-008 P1/P2). Coordenação do refactor de sync da LIG-008 (P7) tratada por design (D4).

### Objetivo, aceite e non-goals

"Pronto" = toda partida tem `match.slug` único e indexado no formato `{liga}-{temporada}-{casa}-vs-{fora}`; a página da match abre por slug (`/matches/premier-league-2025-2026-chelsea-vs-everton`) e **todo** link de partida no app usa o slug; URLs antigas por uuid continuam resolvendo.
Non-goals: redirect 301 uuid→slug (resolução dual basta); slugar outras entidades; mudar as sub-rotas da match (`/form`,`/lineup`,…) pra slug — seguem por uuid; SEO/metadata.
Aceite (cada critério aponta a Prova):
- A1 [dados] cada `match` tem `slug` não-nulo e único; `chelsea-vs-everton` ≠ `everton-vs-chelsea` → P2
- A2 [api] `GET /v1/matches/<slug>` devolve a partida (com `id`); `GET /v1/matches/<uuid-antigo>` idem (dual) → P3
- A3 [api] payloads de time/treinador/jogador/forma trazem `slug` em cada partida → P4
- A4 [ui] abrir a match pelo slug e navegar por liga/time/treinador/jogador/forma → todo link é slug, console limpo → P5, P6

### Premissas

- `season` + `match.seasonId` existem e estão backfillados (LIG-008 P1/P2 `[x]`) — `match.seasonId` 100% preenchido.
- Participants do fixture têm `.name`; `apiLeague.name`/`apiSeason.name` no escopo do `main()` do sync (`sync-sportmonks.ts:223-225,360-361`).
- `serializeMatch` (`shared.ts:470`) é a única fonte do shape de partida em list/rounds/detail.
- Se alguma premissa cair no `/i` (ex.: `seasonId` ainda nulo em alguma linha): PARAR e datar a divergência aqui.

### Decisões

- D1: **coluna persistida + índice único** (espelha `team.slug`), não slug computado — driver: precedente + indexável + estável; descartado: computar on-the-fly porque obriga decompor a string pra buscar (frágil); pagamos: backfill + janela expand→contract.
- D2: shape `{liga}-{temporada}-{casa}-vs-{fora}` via `slugify` por-parte, **sem sufixo numérico** — driver: par ordenado é único por liga+temporada; a temporada desambigua entre anos; o `unique` é a rede de segurança; descartado: hash/`-2` (poluição visual desnecessária).
- D3: rota canônica resolve **dual (uuid|slug)** — driver: não quebrar URLs antigas e robustez; descartado: slug-only (quebra bookmark e o uuid continua circulando internamente nas sub-rotas mesmo assim); pagamos: um branch de resolução no service.
- D4: geração via helper `matchSlug` chamado **no ponto de upsert** do sync — driver: o refactor `syncSeason` da LIG-008 (P7) carrega o slug automaticamente p/ temporadas antigas; nota adicionada à LIG-008.
- D5: slug em **todos** os payloads de link de partida (5 fontes), não só na URL canônica — driver: "beleza" pedida vale pra todo link; descartado: só canônico (links secundários ficariam uuid feio).
- Adiadas pro /i: nome exato do módulo do helper (`db/slug.ts` proposto), micro-forma do backfill (script vs SQL), e a regex exata de detecção de uuid na resolução dual.

### Passos

**P1 [dados] expand** — `apps/api/src/db/schemas/leagues.ts#match`: adicionar `slug: text("slug")` **nullable** (sem `notNull`/`unique` ainda). Gerar e aplicar migração (expand puro). Prova: `cd apps/api && bun run db:generate && bun run db:migrate` → exit 0; `psql -c "\d match"` lista a coluna `slug`.
**P2 [dados] (depende: P1) helper + geração + backfill + contract** — extrair `slugify` p/ módulo importável + `matchSlug` (detalhe: dossiê §Slug); `sync-sportmonks.ts` importa e seta `slug` no upsert da match; script de backfill das partidas existentes (detalhe: dossiê §Backfill); SÓ depois, migração de contract (`slug` `notNull` + `unique`). Critério de avanço: `slug is null` = 0 ANTES do contract. Falha provável: `slugify` importado de um script que roda `main()` no import → por isso extrair p/ módulo limpo. Prova: `psql -c "select count(*) from match where slug is null"` → 0; `\d match` mostra o unique de `slug`; `psql -c "select slug from match where ... "` p/ um Chelsea×Everton → `premier-league-2025-2026-chelsea-vs-everton`.
**P3 [api] (depende: P2) canônico** — `shared.ts#serializeMatch` inclui `slug: m.slug`; novo `getMatchRowBySlug`; `get-match.service.ts#getMatch` resolve dual uuid|slug (detalhe: dossiê §Resolução dual); `matches.routes.ts` rota canônica vira `/:slug` com `t.String()` (sub-rotas inalteradas). Prova: API no ar — `curl -s localhost:3001/v1/matches/<slug> | jq .id` → uuid; `curl -s localhost:3001/v1/matches/<uuid-antigo> | jq .slug` → o slug (dual ok); `curl .../v1/leagues/PL/rounds | jq '.[0].matches[0].slug'` → string.
**P4 [api] (depende: P2) payloads secundários** — adicionar `slug` (do `match`) aos selects de: `shared.ts#loadTeamMatches`, `shared.ts#getCoachDetail`, matches do jogador (`shared.ts:923`), e o form service (tipo `shared.ts:169`). Prova: `curl /v1/teams/<slug> | jq '.matches[0].slug'`, `/v1/coaches/<id>`, `/v1/players/<id>`, `/v1/matches/<slug>/form` → todos trazem `slug` por partida.
**P5 [ui] (depende: P3) página por slug** — `app/(app)/matches/[id]/page.tsx` → `[slug]` (renomear pasta + param); `MatchDetail` recebe `slug`, busca via `useMatchQuery(slug)` e passa `match.id` aos hooks filhos (lineup/form/injuries/etc.). Prova: `bun run typecheck` exit 0; Chrome (chrome-devtools MCP) — abrir `/matches/<slug>` renderiza a partida, console limpo.
**P6 [ui] (depende: P4, P5) links** — trocar o `href` dos 5 pontos pra `m.slug`: `rounds-list.tsx:69`, `team-detail.tsx:70`, `coach-detail.tsx:29`, `player-detail.tsx:209`, `form-guide.tsx:50`. Prova: `bun run typecheck` exit 0; Chrome golden path — em `/leagues/PL` clicar uma partida abre URL-slug; navegar time/treinador/jogador/forma → todo link de match é slug, console limpo.

### Verificação final

- `bun run typecheck` limpo (raiz, 3/3)
- asserts no banco: `select count(*) from match where slug is null` → 0; `select count(*)<>count(distinct slug)` → false (unicidade); spot-check de um slug esperado (P2)
- regressão API: `/v1/matches/<slug>` e `/v1/matches/<uuid>` retornam a MESMA partida (P3); 4 payloads secundários com `slug` (P4)
- golden path Chrome: 1. `/leagues/PL` → clicar partida (URL = slug bonito); 2. abrir time → clicar partida; 3. idem treinador, jogador, forma; 4. todo `href` é slug, console/network limpos (P5, P6)
- re-teste `features impact LIG-009` (LIG-008) — sync da temporada corrente segue gerando 380 matches com slug
- último passo: subagent em contexto fresco revisa o diff contra A1..A4 — diff fora dos paths deste plano = achado

### Pré-mortem e rollback

- C1: **linhas sem slug no contract** (backfill incompleto) → `notNull`/`unique` falha; sintoma: migração aborta; mitigação: critério de avanço `slug is null`=0 ANTES do contract (P2).
- C2: **URL antiga por uuid 404** após a troca da rota; sintoma: bookmark/link velho quebra; mitigação: resolução dual uuid|slug (D3/P3) — testada na Verificação.
- C3: **refactor de sync da LIG-008 (P7) não chama `matchSlug`** → temporada antiga entra com slug null e viola `notNull`; sintoma: `db:sync` da antiga falha no insert; mitigação: helper no ponto de upsert (D4) + nota na LIG-008.
- C4: **colisão real de slug** (mesma liga+temporada+casa+fora 2×, ex.: replay) → `unique` recusa o 2º insert; sintoma: sync falha; mitigação: não ocorre em liga (par único/temporada); se um dia entrar copa com replay, sufixo de rodada/data (feature futura).
Rollback por classe: ui/api pura (P3–P6) → `git revert`; schema (P1/P2) → expand reverte com `drop column`; **slugs já gravados** somem junto com a coluna (sem efeito colateral externo). Nada publicado fora do app.

### Fora de escopo

- Redirect 301 `/matches/<uuid>` → `/matches/<slug>` (resolução dual já evita 404) → feature futura se virar requisito de SEO.
- Slug pras sub-rotas da match (`/form`,`/lineup`,…) → seguem por uuid (consumidas só internamente).

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:39-49` — `team` já tem `slug: text().notNull().unique()`; precedente exato a espelhar na `match`.
- [código] `apps/api/src/db/sync-sportmonks.ts:145-151` — `slugify` (NFD + kebab) já existe e é reusável pro slug da partida; zero código novo de normalização.
- [código] `apps/api/src/modules/leagues/matches.routes.ts:17-26` — `/v1/matches/:id` valida uuid na borda; as sub-rotas (form/lineup/injuries/…) também são keyed por uuid.
- [código] `apps/api/src/modules/leagues/teams.routes.ts:7-11` — precedente de roteamento por slug (`/v1/teams/:slug`), resolvido no service.
- [código] `apps/web/features/leagues/components/match-detail/match-detail.tsx:78-80` — `MatchDetail({ id })` repassa o mesmo `id` a todos os hooks filhos → se a URL virar slug, busca o match por slug e usa `match.id` nos filhos.
- [análise] colisão: dentro de uma liga+temporada, o par ordenado (mandante × visitante) ocorre 1×; a volta é `everton-vs-chelsea` (slug distinto) → único por construção. A temporada desambigua entre anos (e é obrigatória com LIG-008). O `unique` no banco é a rede de segurança.

## Verificação

Provado (2026-06-29, API isolada com auth off via escape hatch de dev):

- **dados** — `bun run scripts/backfill-match-slug.ts` → `backfilled slug on 380 matches; remaining null slug: 0; duplicate slugs: 0`. Migração de contract (`0010`) aplicou `SET NOT NULL` + `UNIQUE`. Spot-check: `Chelsea vs Everton` → `premier-league-2025-2026-chelsea-vs-everton`. **A1 ✓**
- **api** — `GET /v1/matches/<slug>` e `GET /v1/matches/<uuid>` retornam o MESMO match (`same match: true`); `GET /v1/matches/nao-existe-xyz` → 404; `/leagues/PL/rounds` traz `slug` por partida. **A2 ✓**
- **api** — `/teams/<slug>`, `/players/<id>` (36/36 appearances), `/matches/<slug>/form` trazem `slug` por partida; coach por typecheck (sem linhas de coach no banco desta season). **A3 ✓**
- **typecheck** — api 3/3 limpo; web limpo nos arquivos tocados (restam só erros pré-existentes de `prognosis.tsx`, fora desta feature).

- **ui (A4)** — golden path confirmado pelo dono no app após restart do dev server (o rename de pasta de rota `[id]→[slug]` exigiu restart porque o Turbopack não recarrega rename de segmento ao vivo): match abre pelo slug e os links (incl. tab rounds) vão como slug. **A4 ✓**
