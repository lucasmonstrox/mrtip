---
id: LIG-010
titulo: Narração lance-a-lance (commentaries) da partida
modulo: ligas
status: feito # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas: # só as superfícies que se aplicam; mesma escala do status
  dados: feito # tabela commentary + ingestão por-fixture (37060 linhas, 380/380 fixtures)
  api: feito # sub-rota /matches/:id/commentaries + player.imageUrl (curl 96 itens, regressão 380 intacta)
  ui: feito # aba Narração rica (ícones, foto, hovercard, dedup de gol) — dono confirmou visualmente
testada: parcial # nao | parcial | sim
testes:
  - "P1 migração 0012_naive_celestials aplicada — commentary: sportmonks_commentary_id unique, match_id FK cascade, is_goal/is_important bool, sort_order (2026-06-29)"
  - "P2 db:sync — commentaries: 37060 (380/380 fixtures); 31929 com player; ordem por sort_order OK (2026-06-29)"
  - "P3 curl /v1/matches/:id/commentaries → 96 itens ordenados c/ player.imageUrl; 404 match inexistente; /leagues/PL=380 intacto; /prognosis 200 (2026-06-29)"
  - "P4 aba Narração: ícone por evento + foto/hovercard do jogador + dedup de gol (anúncio vs descritiva, respeita 2 gols/minuto); typecheck web limpo (só prognosis.tsx WIP alheio falha); DONO CONFIRMOU VISUALMENTE no jogo West Ham 3-0 (2026-06-29). E2E automatizado (console/network) PENDENTE — chrome-devtools travado"
depende_de: [] # match/player/lineup já existem (sync atual)
impacta: [] # quem re-testar se isso mudar (IDs)
ancoras: # pontos compartilhados que ESTA feature toca
  settings: []
  tabelas: [commentary, match, player] # cria commentary; FK → match e player
  tools: []
  funcoes: [loadMatchCommentaries]
  rotas: [/matches/:id/commentaries]
docs:
  - docs/planos/LIG-010-commentaries.md
verificado_em: null
atualizado: 2026-06-29
---

# Narração lance-a-lance (commentaries) da partida

## Descrição

Ingerir e exibir a **narração textual lance-a-lance** de cada partida finalizada — o play-by-play
que a SportMonks gera (escanteios, faltas, finalizações, gols, cartões). Vem do endpoint dedicado
**`GET /football/commentaries/fixtures/{fixture_id}`** (incluso no plano, **não** é add-on como as
news), com `include=player;relatedPlayer` ligando cada lance ao jogador envolvido. Decisão de
escopo: **guardar tudo** (≈96 lances/jogo na PL) e usar `is_important`/`is_goal` como filtro de
exibição (timeline enxuta na UI) e de consumo (insumo de narrativa pro prognóstico — liga lance a
`player_id`, casando com a tese de desfalque). Mesmo padrão de ingestão da LIG-004 (venue):
endpoint por-fixture, upsert idempotente por id do lance, FK pra `match` e `player`.

## Tarefas

- [x] P1 dados — tabela `commentary` (FK match cascade + player/relatedPlayer nullable) + migração expand-only
- [x] P2 dados — bloco no sync: 1 request por fixture FT, upsert por `sportmonksCommentaryId`, reusar `ensurePlayer`
- [x] P3 api — sub-rota `/matches/:id/commentaries` + service + `loadMatchCommentaries` no shared (+ `player.imageUrl` no contrato)
- [x] P4 ui — aba "Narração" rica: ícone por tipo de evento, foto+hovercard do jogador, dedup de gol (anúncio vs descritiva, respeita 2 gols/min), tudo num Card branco — dono confirmou visualmente

## Plano (2026-06-29)

Dossiê: [docs/planos/LIG-010-commentaries.md](../../planos/LIG-010-commentaries.md)

### Objetivo, aceite e non-goals

"Pronto" = a página de uma partida finalizada mostra a narração lance-a-lance numa aba "Narração",
servida por `/matches/:id/commentaries`, com os ~96 lances guardados no banco.
Non-goals: **tradução** do texto (fica em inglês, é dado da fonte); narração ao vivo (só pós-jogo);
embutir commentaries no payload do `getMatch`; consumo no prognóstico (feature futura).
Aceite (cada critério aponta a Prova):
- A1 [dados] tabela `commentary` existe com FK match/player → P1
- A2 [dados] re-sync popula `commentary` (>0 linhas, sample com player resolvido) → P2
- A3 [api] `GET /v1/matches/:id/commentaries` devolve array ordenado por `sortOrder` → P3
- A4 [ui] aba "Narração" renderiza a timeline (destaques marcados), empty-state quando vazia, console limpo → P4

### Premissas

- `sm<T>` serve `/commentaries/fixtures/:id?include=…` (array, sem paginação) — `lib/sportmonks.ts:32`.
- `ensurePlayer` resolve uuid de jogador fora das lineups — `sync-sportmonks.ts:528`.
- Sub-rota dedicada keyed por uuid é o padrão (injuries/scorers) — `matches.routes.ts:42`.
- PL coberta por commentaries (sondagem fixture 19427458 → 96 lances). Se cair durante o /i: PARAR e datar a divergência.

### Decisões

- D1: API = **sub-rota dedicada** `/matches/:id/commentaries`; driver: 96 lances/jogo não cabem no payload base; descartado: embutir no `serializeMatch` porque incharia toda lista de partidas; pagamos: +1 request no front pra abrir a aba (lazy, aceitável).
- D2: **Guardar tudo**; driver: dono; `is_important`/`is_goal` filtram só na exibição/consumo.
- D3: UI = **aba "Narração" nova** (não reusar "Eventos", que é gols+cartões); pagamos: +1 aba.
- D4: coluna `sort_order` (não `order`, reservada) guarda o `order` da SportMonks como `integer`.
- Adiadas pro /i (não é esquecimento): default de exibição (timeline completa com destaques realçados vs só-destaques com toggle — começar pela completa, toggle é podável); micro-copy da aba; ícone de gol/cartão na linha.

### Passos

**P1 [dados] schema `commentary` (expand-only)** — `apps/api/src/db/schemas/leagues.ts` após `card` (`:313`): criar a tabela (shape em dossiê §Schema; molde `goal`/`card`; somar `boolean` ao import se faltar; coluna `sort_order`). Gerar e aplicar migração. Prova: `cd apps/api && bun run db:generate && bun run db:migrate` → exit 0; `psql "$DATABASE_URL" -c "\d commentary"` lista `sportmonks_commentary_id` unique, `match_id` FK, `is_goal`/`is_important` bool, `sort_order`.

**P2 [dados] ingestão no sync (depende: P1)** — `apps/api/src/db/sync-sportmonks.ts`: declarar `SmCommentary` (id, comment, minute, extra_minute, is_goal, is_important, order, `player?`, `relatedplayer?`); bloco novo após cards (`:574`) iterando fixtures **FT**, `sm<SmCommentary[]>('/commentaries/fixtures/'+f.id+'?include=player;relatedPlayer')` em try/catch, `ensurePlayer` p/ `player`/`relatedplayer`, upsert por `sportmonksCommentaryId`. Detalhe + gotcha `relatedplayer` minúsculo: dossiê §Ingestão/§Shape. Prova: `bun run db:sync` → exit 0, loga `commentaries: N` (N>0); `psql -c "select count(*) from commentary"` > 0 e `select count(*) from commentary where player_id is not null` > 0; sample `select comment,minute,is_goal from commentary order by sort_order limit 3`.

**P3 [api] sub-rota + service + loader (depende: P2)** — `loadMatchCommentaries(matchId)` no `shared.ts` (molde `loadMatchGoals:1031`, join player/relatedPlayer left, `orderBy(asc(commentary.sortOrder))`); `get-commentaries/get-commentaries.service.ts` (molde `get-injuries.service.ts:6`); registrar `.get("/:id/commentaries", …, { params: paramId })` em `matches.routes.ts` (`:55`). `getMatch` NÃO muda. Prova: `bun run typecheck` (raiz) exit 0; API no ar, `curl -s localhost:3001/v1/matches/<uuid>/commentaries | jq 'length'` > 0 e `jq '.[0]'` tem `comment`/`minute`/`isGoal`/`player`; `curl /v1/leagues/PL | jq '.matches|length'` = 380 (payload base intacto).

**P4 [ui] aba Narração (depende: P3)** — `use-match-commentaries-query.ts` (molde `use-match-injuries-query.ts:6`, `api.v1.matches({id}).commentaries.get()`); componente `match-detail/commentary.tsx` (timeline: minuto + texto, realça `isImportant`/`isGoal`); aba `<TabsTrigger value="narracao">Narração</TabsTrigger>` + `<TabsContent>` em `match-detail.tsx:161`, empty-state via `TabEmpty`. Prova: `bun run typecheck` exit 0; Chrome (chrome-devtools MCP) numa partida finalizada → aba Narração mostra timeline com gol realçado, console limpo; partida sem commentaries → empty-state.

### Verificação final

- `bun run typecheck` limpo (raiz, 3/3) + `eslint` nos arquivos tocados 0 erros.
- `bun run db:sync` → `commentaries: N`; asserts no banco: `count(commentary)>0`, `count(player_id not null)>0`, sample por `sort_order`.
- `curl /v1/matches/<uuid>/commentaries` → array ordenado com player; `curl /v1/leagues/PL | jq '.matches|length'` = 380 (regressão do payload base).
- E2E Chrome: 1. abrir `/matches/<slug>` de jogo finalizado · 2. clicar aba "Narração" · 3. ver timeline com lance de gol realçado, console sem erro novo · 4. abrir jogo sem commentaries → empty-state.
- re-teste do `bun run features impact LIG-010` (sem arestas hoje) + nada fora dos paths do plano.
- último passo: subagent em contexto fresco revisa o diff contra A1..A4 — reporta só gap de requisito; diff fora destes paths = achado.

### Pré-mortem e rollback

- C1: **cobertura SportMonks** — alguns jogos vêm com 0 lances (fora das major leagues / pré-jogo). Sintoma: aba Narração vazia em parte dos jogos. Mitigação: empty-state (P4) + log de fixtures com 0 (P2); não bloquear.
- C2: **rate-limit/runtime do sync** — +~380 requests. Sintoma: sync lento / 429. Mitigação: `pool(…,5)` + log `rate_limit`; bucket Commentary é separado (2000/h).
- C3: **`sort_order` int4** — `order` cresce ao longo das temporadas; hoje ~16M ≪ 2.1B. Sintoma (improvável): overflow no insert. Mitigação: trocar pra `bigint` numa migração futura se aproximar do teto.
- C4: **`relatedplayer` minúsculo** — mapear `relatedPlayer` deixa a relação sempre null. Mitigação: explícito no P2/dossiê §Shape.
- C5: **re-seed** zera `commentary` — re-sync repopula (idempotente). Sem perda permanente.
Rollback por classe: ui/api → `git revert` basta; schema → expand reverte com `drop table commentary` (nada depende dele); sync → remover o bloco. O rollback NÃO desfaz dado já sincronizado em prod (mas é re-derivável da fonte).

### Fora de escopo

- Consumir `commentary` como narrativa no prognóstico → futura feature (depende_de: LIG-010).
- Tradução pt-BR do texto da narração → futura feature, se o dono quiser.

## Evidências

- [web] https://docs.sportmonks.com/v3/endpoints-and-entities/endpoints/commentaries/get-commentaries-by-fixture-id — endpoint `GET /football/commentaries/fixtures/{ID}`, **sem paginação**, include depth 1 (`fixture`, `player`, `relatedPlayer`); sem filtros estáticos/dinâmicos.
- [web] https://docs.sportmonks.com/v3/endpoints-and-entities/entities/other#commentary — entidade `Commentary`: `id`, `fixture_id`, `comment`, `minute`, `extra_minute`, `is_goal`, `is_important`, `order`. Commentaries só pras "major leagues" (PL coberta).
- [sondagem] `commentaries/fixtures/19427458` (Nottingham Forest×Brentford, FT) → HTTP 200, **96 lances**, `is_goal=4`, `is_important=8`, `player` preenchido em 80/96. rate_limit entidade `Commentary` = 2000/h.
- [gotcha] `order` **não é 1,2,3** — na resposta real são ints gigantes crescentes (`16067242`…`16067500`); é a chave de ordenação canônica, guardar como inteiro e ordenar por ele (não reindexar).
- [gotcha] pedindo `include=player;relatedPlayer`, a chave no JSON volta **`relatedplayer`** (minúsculo) — mapear com esse nome senão fica sempre null.
- [código] `apps/api/src/db/sync-sportmonks.ts:528` — `ensurePlayer(smId, name)` já cria stub de jogador fora das lineups (reusar pro autor do lance); `:122` `SmFixture`/`SmPlayer` é o molde do tipo do `player` do commentary.
- [código] `apps/api/src/db/schemas/leagues.ts:76` — tabela `match` (FK alvo); `goal`/`card` (upsert por `sportmonksEventId`) são o molde da tabela de evento por-partida idempotente.
- [feature] `docs/features/ligas/LIG-004-venue-estadio-geo.md` — molde do mesmo fluxo (ingestão por-fixture → tabela nova → API → UI no match-detail).

## Verificação

Provado por superfície (2026-06-29, base `eec3e64`):

- **dados (P1+P2):** migração `0012_naive_celestials.sql` aplicada; `information_schema` confirma `commentary` com `sportmonks_commentary_id` (unique), `match_id` (FK cascade), `player_id`/`related_player_id` nullable, `is_goal`/`is_important` bool, `sort_order` int. `bun run db:sync` → `commentaries: 37060 (380/380 fixtures)`. No banco: 37060 linhas, **31929 com player**, **1000 gols / 2479 importantes**; sample por `sort_order` ordena moldura (minuto null) → 1º tempo → minuto 5 (gol). `related_player_id` = 0 em tudo — a SportMonks não popula `relatedplayer` na PL (mapeamento correto, chave minúscula confirmada).
- **api (P3):** `curl /v1/matches/<uuid>/commentaries` → **96 itens** ordenados, shape `{minute, extraMinute, comment, isGoal, isImportant, player:{id,name}|null, relatedPlayer}`; linha de gol com `isGoal/isImportant=true`; linha com player resolvido ("Nathan Collins"). Regressão: `/leagues/PL` → `matches: 380` (payload base intacto); `/matches/<uuid>/prognosis` → 200 (outras sub-rotas intactas); match inexistente → 404. **Nota:** a API agora gateia tudo (auth CORE-003, WIP não-commitado) → as provas rodaram contra um server local com `CLERK_SECRET_KEY` vazio (auth off); o server real com auth fica inalterado.
- **ui (P4):** aba "Narração" num **Card branco** com, por linha: badge de **ícone por tipo de evento** (⚽ gol, 🟨/🟥 cartão, troca, pênalti, escanteio, impedimento, defesa, falta, VAR, apito — classificado do texto), **foto do jogador** (avatar → `PlayerHoverCard` com perfil rico + link `/players/:id`) e o texto; gols/destaques realçados, molduras esmaecidas. `tsc --noEmit` no web limpo p/ os arquivos da feature (os 2 erros restantes são em `prognosis.tsx`, WIP alheio pré-existente). **Dono confirmou visualmente** ("deu bom") no jogo West Ham 3-0 após os ajustes. **E2E automatizado (console/network limpos) PENDENTE** — chrome-devtools travado (ver [[chrome-devtools-profile-travado]]); por isso `status: feito`, não `verificado`.
- **achados de UI durante a navegação real (West Ham 3-0):**
  1. **`is_goal` da SportMonks é incompleto** — num 3-0 só 1 dos 3 gols veio flagueado; os outros 2 só no texto. **Fix:** classificar gol por `is_goal` OU verbo `\bscore[sd]\b` (moldura usa "a *score* of" → sem falso positivo).
  2. **Fonte duplica o gol** — emite linha de **anúncio** ("Goal! X scores to make it 1-0", `is_goal=true`) + **descritiva** ("X scores with a header"). **Fix:** rebaixa a descritiva a linha normal só quando há um anúncio "Goal!"/`is_goal` no mesmo minuto → **2 gols reais no mesmo minuto** (cada um com seu "Goal!") permanecem ambos.
  3. **Contador "⚽ N" removido** do topo — leria o flag furado e contradiria o placar.
- **revisor (contexto fresco):** **nenhum bug funcional**; A1–A4 OK. 2 observações menores não-bloqueantes: (1) `?? false` defensivo nos booleans caso a API mande `null` — **aplicado**; (2) `key={i}` na lista de narração — aceitável (lista estática, nunca reordenada).

### Divergências do plano (durante o /i)

- **P3 proof:** a premissa "curl direto na rota" caiu — a API ganhou auth global (CORE-003 WIP). Adaptado: server local sem `CLERK_SECRET_KEY`. Não altera o código da feature.
- **P4 proof:** a premissa "E2E Chrome" caiu — profile do chrome-devtools travado. P4 fica aberto até a prova visual; código e typecheck OK.
- **Operacional:** múltiplos dev-servers zumbis em portas 3000/3001/3009 (de sessões anteriores) serviam código stale e davam 404 falso; resolvido matando por PID via `taskkill`.
