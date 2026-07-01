---
id: LIG-011
titulo: Forma cross-competition (rótulo de competição no popover)
modulo: ligas
status: feito # ideia | investigado | planejado | em-andamento | feito | verificado (falta só a prova visual A3, bloqueada por auth)
prioridade: P2 # P1 | P2 | P3
facetas:
  dados: verificado # innerJoin(league) no baseQuery + concurrentSeasonIds por startYear — provado por script/SQL
  api: verificado # competition no payload + loader cross-comp em getTeam/form — provado por script service direto
  ui: feito # rótulo no popover (form-guide) implementado + typecheck web verde; prova visual em browser BLOQUEADA (Clerk)
testada: parcial # nao | parcial | sim
testes:
  - "Script service direto (2026-07-01): competition {code,name,type,logoUrl} presente em Match e FormResult (A1)"
  - "Forma cross-comp arsenal: set {PL:38,FAC:4,CARA:6}; partida crystal-palace-vs-arsenal mistura PL/FAC/CARA por-time (A2) (2026-07-01)"
  - "concurrentSeasonIds(PL corrente)=3 (PL+CARA+FAC, start_year=2025) via SQL e via service (2026-07-01)"
  - "computeStandings/loadMatches intocados → standings segue só-liga (A4); git diff --stat (2026-07-01)"
  - "bun run typecheck 3/3 workspaces verde + lint 0 errors (2026-07-01)"
  - "PENDENTE A3: prova visual do popover no Chrome bloqueada (Clerk 307 /sign-in + perfil do Chrome travado p/ MCP)"
depende_de: [LIG-008] # modelo season-aware (season.startYear, resolveSeason) é a base do cross-comp
impacta: [LIG-002, DOS-001, LIG-001, MOD-001] # LIG-002 lê a forma do time; DOS-001/LIG-001/MOD-001 consomem a shape de match (serializeMatch aditivo)
ancoras:
  settings: []
  tabelas: [match, league, season]
  tools: []
  funcoes:
    - serializeMatch
    - baseQuery
    - computeForm
    - formResult
    - getTeam
    - form
    - concurrentSeasonIds
    - loadTeamFormMatches
  rotas: [/v1/teams/:slug, /v1/matches/:id/form]
docs:
  - docs/planos/LIG-011-forma-cross-competition.md
verificado_em: null
atualizado: 2026-07-01
---

# Forma cross-competition (rótulo de competição no popover)

## Descrição

Pra quem analisa aposta: hoje a "forma" (últimos 5 V/E/D) é sempre de **uma competição só** (a liga) e o popover do chip **não diz de qual competição** foi cada jogo. Esta feature (1) carrega a competição `{code,name,logoUrl,type}` no payload e mostra no popover, e (2) na **página do time** e na **forma dos detalhes da partida** passa a incluir **todas as competições** da campanha (liga + copas), cada jogo rotulado — tornando visível, por exemplo, o jogo de copa de meio de semana (sinal de fadiga). A **classificação continua só-liga** (a forma da tabela é do campeonato). Escopo cross-comp = "seasons concorrentes" (mesmo `season.startYear`), num loader novo isolado — sem tocar `loadMatches`/`loadTeamMatches`/`computeStandings`.

## Tarefas

- [x] P1 dados+api+ui — competition no payload (`baseQuery` innerJoin league → `Match`/`serializeMatch` → `FormResult`/`formResult`) + rótulo no popover `form-guide.tsx` (backend+dados provado por script; UI typecheck verde)
- [x] P2 api — `concurrentSeasonIds` (por `startYear`) + `loadTeamFormMatches` cross-comp, ligado na **página do time** (`getTeam`)
- [x] P3 api — forma dos **detalhes da partida** cross-comp por-time (`form.service`, ancorada `before` a data)
- [ ] P4 ui — prova visual no Chrome **BLOQUEADA**: Clerk 307-redireciona `/teams/*` → `/sign-in` e o perfil do Chrome está travado p/ o MCP. D5 decidido: **sem** marcador extra no chip (o rótulo no popover atende o pedido). Código+dados verificados; falta só o pixel em browser autenticado.

## Plano (2026-07-01)

Dossiê: [docs/planos/LIG-011-forma-cross-competition.md](../../planos/LIG-011-forma-cross-competition.md)

### Objetivo, aceite e non-goals

"Pronto" = (A) o popover de qualquer chip de forma mostra a competição do jogo; (B) na página do time e na forma dos detalhes da partida, os últimos N jogos incluem liga + copas, cada um rotulado.
Non-goals: classificação continua **só-liga** (a forma da tabela não muda de escopo); **sem** toggle Liga/Todas e **sem** modo "Liga + Geral lado a lado" (o dono escolheu "todas as competições" simples); sem mudança de schema (só leitura + campo aditivo no payload).
Aceite (cada critério aponta a Prova):
- A1 [api] `GET /v1/matches/:id/form` e `GET /v1/teams/:slug` trazem `competition {code,name,logoUrl,type}` em cada item de forma → coberto por P1
- A2 [api] a forma do time e da partida de um clube com jogos de copa inclui `CARA`/`FAC` intercalados → coberto por P2+P3
- A3 [ui] no popover do chip vejo o nome/logo da competição; na página do time e no match, chips de copa aparecem rotulados → coberto por P1+P4
- A4 [api] a **classificação** segue só-liga (form da tabela sem jogo de copa) → coberto por P2 (Verificação)

### Premissas

- `season.startYear` alinha entre ligas concorrentes: PL/CARA/FAC = 2025 — `[banco]` 2026-07-01 (dossiê §Evidências). Se cair (liga ano-calendário), PARAR e trocar a chave por janela de datas.
- Jogos de copa têm `ft_*` + `season_id` populados — `[banco]` (CARA 93/93, FAC 870/871).
- Tipos do front vêm de `@workspace/api` (`apps/web/features/leagues/types/index.ts:1-37`) → crescer o payload não exige editar tipo no web.
- `league.type` existe e é estável (`schemas/leagues.ts:15`, committed). **Type-error pré-existente** no working tree (`shared.ts:618`, WIP CUP-001) → a Prova de `typecheck` limpo pressupõe esse WIP resolvido; se persistir, reportar e não forçar.
- `season 2024/25` não tem copa concorrente → forma cross-comp nessa season = só-PL (degrada certo, não é bug).

### Decisões

- D1: escopo cross-comp = **seasons concorrentes por `startYear`** (`concurrentSeasonIds`) — driver: reusa o índice de `seasonId`, sem matemática de data, respeita o switcher; descartado: range de datas (min/max de match) porque mais frágil e sem índice; pagamos: depende de `startYear` alinhar entre ligas (validado).
- D2: **loader novo isolado** (`loadTeamFormMatches`), NÃO tocar `loadMatches`/`loadTeamMatches`/`computeStandings` — driver: standings/rounds/lista dependem do escopo single-liga; descartado: parametrizar `loadMatches` com `scope` porque espalha risco nos consumidores atuais; pagamos: uma função a mais.
- D3: `competition` carregada no próprio `Match` (via `serializeMatch`), não só no `FormResult` — driver: `serializeMatch` é o único definidor de `Match` e `m.leagueCode` já está em mãos; serve qualquer consumidor futuro; descartado: injetar só no `formResult` porque perde reuso; pagamos: +1 `innerJoin(league)` em todos os reads de match (aditivo, FK notNull → seguro).
- D4: **classificação continua só-liga** — a forma da tabela é do campeonato; `computeStandings` fica intocado.
- Adiadas de propósito pro /i (não é esquecimento): micro-layout do rótulo no popover; se o chip de copa ganha tint/marcador nas views mistas (D5, ver P4); copy PT dos nomes de competição; se o rótulo aparece também na classificação (sempre "PL") ou só em forma mista.

### Passos

**P1 [dados+api+ui] esqueleto — competition no payload + popover** — `apps/api/.../shared/shared.ts`: `baseQuery` (`:497-512`) ganha `.innerJoin(league, eq(league.code, match.leagueCode))` + select `league.name/logoUrl/type`; `MatchJoin` (`:483-492`) e `Match` (`:125-136`) ganham `competition {code,name,logoUrl,type}`; `serializeMatch` (`:517-545`) monta o campo; `FormResult` (`:170-182`) + `formResult` (`:1754-1772`) copiam `m.competition`. UI `form-guide.tsx` (`Chip`, `:33-90`): linha com logo+nome da competição no `HoverCardContent`. Prova: `curl -s localhost:3001/v1/matches/<id>/form | jq '.home.recent[0].competition.code'` → string; `curl .../teams/arsenal | jq '.matches[0].competition.name'` → "Premier League"; `bun run typecheck` limpo; Chrome: popover mostra a competição.
**P2 [api] (depende: P1) time cross-comp** — detalhe: dossiê §CrossComp + §Wire. Novo `concurrentSeasonIds(seasonId)` (seasons com mesmo `startYear`) + `loadTeamFormMatches(teamId,{seasonId,before?})` (reusa `baseQuery`, filtra por time + score + `seasonId IN concurrent`); ligar em `get-team.service.ts:29` (`form` = cross-comp, sem `before`). Falha provável: `startYear` desalinhado → junta season errada; correção: assert no banco de que `concurrentSeasonIds(PL 2025)` = 3 ids. Prova: `curl .../teams/arsenal | jq '[.form.recent[].competition.code] | unique'` → inclui `CARA`/`FAC`.
**P3 [api] (depende: P2) partida cross-comp** — detalhe: dossiê §Wire. `form.service.ts:24-25`: trocar o array único de `loadMatches` por `loadTeamFormMatches` **por time** (home/away), ancorado `before: row.m.date` e `seasonId: row.m.seasonId`; `opts.n/side` seguem. Prova: `curl .../matches/<jogo do Arsenal pós-2026-01>/form | jq '[.home.recent[].competition.code] | unique'` → mistura `PL`/`CARA`/`FAC`.
**P4 [ui] (depende: P3) golden path + marcador** — Chrome (chrome-devtools MCP) em `/teams/arsenal` e num match do Arsenal: confirmar chips intercalados com rótulo de competição no popover; **D5**: decidir se o chip de copa ganha um marcador sutil (ponto/borda) na fileira além do popover — implementar o mínimo que o dono aprovar. Prova: screenshots dos dois popovers (liga + copa) e console limpo.

### Verificação final

- `bun run typecheck` e `bun run lint` limpos (pressupõe WIP CUP-001 do `shared.ts:618` resolvido)
- assert no banco: `concurrentSeasonIds(<PL 2025 uuid>)` retorna 3 ids (PL+CARA+FAC) — via query `SELECT s2.id FROM season s1 JOIN season s2 ON s2.start_year=s1.start_year WHERE s1.sportmonks_season_id=25583`
- curls A1/A2 (jq) verdes; forma da partida do Arsenal mistura competições
- **re-teste `features impact`**: `/v1/leagues/PL/standings` — `row.form` da tabela **inalterado** (segue `computeStandings` league-only); endpoints de match (DOS-001/LIG-001/MOD-001) com shape **aditivo** (regressão de match não quebra, só cresce)
- golden path Chrome: 1. `/teams/arsenal` → hover num chip de copa → popover mostra "Carabao/FA Cup"; 2. `/matches/<arsenal>` → forma home mista rotulada; 3. console 0 erros
- último passo: subagent em contexto fresco revisa o diff contra A1–A4 — reporta só gap de requisito; diff fora dos paths deste plano = achado

### Pré-mortem e rollback

3 semanas depois, quebrou. Causas mais prováveis:
- C1: entra liga de ano-calendário e `startYear` desalinha → `concurrentSeasonIds` junta season errada; sintoma: forma com jogo de competição/ano errado; mitigação: assert no banco (Verificação) + nota pra migrar pra janela de datas se aparecer liga cross-year.
- C2: `serializeMatch` aditivo, mas consumidor com assert estrito de shape (regressão byte-a-byte do LIG-008) falha; sintoma: teste de regressão de match vermelho; mitigação: campo aditivo, atualizar baseline.
- C3: `typecheck` sujo pelo WIP CUP-001 mascara erro novo; sintoma: erro real passa; mitigação: resolver/commitar o WIP antes da Prova.
- C4: `loadTeamFormMatches` sem `limit` puxa muito jogo (FAC = 871 no total); sintoma: query lenta; mitigação: filtro por time (≤~50/campanha) + `computeForm` corta em N.
Rollback por classe: feature é **só leitura + aditivo no payload** → `git revert` basta; sem schema, sem migração. O rollback NÃO desfaz: nada (nenhum dado gravado, nenhum pick).

### Fora de escopo

- Modo "Liga + Geral lado a lado" e "Toggle Liga/Todas" → o dono escolheu "todas as competições" simples; criar `docs/features/ligas/LIG-0NN-forma-toggle-escopo.md` (status: ideia, depende_de: [LIG-011]) se um dia quiser.
- Classificação cross-comp → **non-goal explícito** (a forma da tabela é do campeonato).
- Marcador visual de copa no próprio chip (além do popover) → decidido no P4 (D5); se virar trabalho maior, vira feature de polish.

## Evidências

- [código] `apps/api/src/modules/leagues/shared/shared.ts:1780-1807` — `computeForm` é agnóstico ao array (filtra time+score+before, corta em N) → cross-comp = questão de o que entra.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:517-545,497-512` — `serializeMatch` (único definidor de `Match`) + `baseQuery` sem `league`: têm `m.leagueCode`, descartam a competição.
- [código] `apps/api/src/db/schemas/leagues.ts:29,33,6-18` — `season.leagueCode` (por que tudo é single-comp) + `season.startYear` (chave da concorrência) + `league {code,name,type,logoUrl}`.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:549-573` — `currentSeasonId`/`resolveSeason` filtram por `leagueCode` → 3 `is_current` (PL/CARA/FAC) não quebram a PL.
- [código] `apps/web/features/leagues/types/index.ts:1-37` — tipos do front re-exportados de `@workspace/api` (contrato cresce sozinho no web).
- [banco] query 2026-07-01 — PL/CARA/FAC todas `start_year=2025`; Arsenal com 10 jogos CARA+FAC na campanha 2025 (todos com placar): concorrência por `startYear` validada + caso de teste.

## Verificação

Provado em 2026-07-01 contra o banco `mrtip_dev` (docker `mrtip_db`) via script de service direto (bypassa o HTTP/auth Clerk) + queries SQL. API sobe em :3001, web em :3000.

- **A1 [api/dados]** ✓ — `competition {code:"PL",name:"Premier League",type:"league",logoUrl:"…/premier-league.png"}` presente em cada `FormResult` E em cada `Match` (`team.form.recent[0].competition` e `team.matches[0].competition`). Vem do `innerJoin(league)` no `baseQuery` → `serializeMatch` → `formResult`.
- **A2 [api]** ✓ — forma cross-comp funcionando: o set do time (arsenal) via `loadTeamFormMatches` = **`{PL:38, FAC:4, CARA:6}`** (48 jogos, 3 competições), intercalados por data (`…PL@2026-04-11, FAC@2026-04-04, CARA@2026-03-22, PL@2026-03-14`). Na partida `crystal-palace-vs-arsenal (2026-05-24)` a forma do Arsenal mistura `…PL:L@04-11, FAC:L@2026-04-04, CARA:L@2026-03-22`, ancorada antes da data e por-time.
- **A4 [api]** ✓ — `computeStandings`/`loadMatches` **intocados** (`git diff --stat` mostra só `shared.ts` +80/-1, `standings.service.ts` sem diff) → forma da classificação segue só-liga.
- **concurrentSeasonIds** ✓ — assert SQL e via service: `concurrentSeasonIds(PL corrente)` = **3** (PL league + CARA cup + FAC cup, todas `start_year=2025`).
- **typecheck** ✓ — `bun run typecheck`: 3/3 workspaces (api, ui, web) verdes. **lint** ✓ — 0 errors (só warnings pré-existentes de `<img>`, padrão do repo).
- **A3 [ui]** ⚠️ **prova visual pendente** — o código do popover (`form-guide.tsx`) lê `r.competition.name/logoUrl`, typecheck do web verde e o dado chega no payload (provado acima), MAS o golden path no Chrome está **bloqueado**: Clerk 307-redireciona `/teams/*` → `/sign-in` (API responde 401 sem auth) e o perfil do Chrome está travado p/ o `chrome-devtools` MCP. Não afirmo o render em pixel — falta rodar num browser autenticado.
- **Revisor em contexto fresco** ✓ — auditou o diff contra A1–A4: todos IMPLEMENTED e corretos, **nenhum bug, nenhum gap**. Confirmou independentemente o linchpin de dado (`startYear` vem de `name.slice(0,4)` em `sync-sportmonks.ts:289` E `sync-cup.ts:83` → PL/FAC/CARA=2025) e a segurança do innerJoin (`match.leagueCode` notNull FK → 0 linhas perdidas, mudança de `Match` é aditiva). Nenhum código fora dos 4 paths declarados. Notas menores (não-bugs, já no dossiê): escopo por `startYear` é forward-looking (uma UCL futura entraria na forma = intenção declarada); filtro `before` redundante (SQL `lt` + `computeForm`, inócuo — o SQL corta linhas).

**Pendente**: só a confirmação visual do popover em browser autenticado (A3). Backend/dados 100% verificados.
