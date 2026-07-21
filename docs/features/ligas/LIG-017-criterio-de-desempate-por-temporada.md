---
id: LIG-017
titulo: Critério de desempate por temporada (ingerido e exibido)
modulo: ligas
status: verificado
prioridade: P2
facetas:
  dados: feito # season.sportmonks_tie_breaker_rule_id (só o id); escrita nos 3 upserts que falam com a API
  api: feito # tiebreakOf(season) com procedência; getLeague publica o critério (campo aditivo)
  ia: feito # as 2 cópias do desempate da PL no prognosis-prompt + a do stakes-rounds
  ui: feito # linha "Em caso de empate: …" na faixa de legenda abaixo da tabela
testada: sim
testes:
  - "apps/api/scripts/_check-standings-order.ts → 14/14 (os 11 do LIG-012 + 3 novos D4/D5)"
  - "apps/api/scripts/_check-endpoints.ts → 11/11 (não-regressão LIG-006/LIG-012)"
  - "apps/api/scripts/_check-tiebreak-column.ts → 0 null; BRA=577, PL 25/26=1526, PL 24/25=171"
  - "browser real (agent-browser, sessão Clerk do dono) → T1..T6"
depende_de: [LIG-012, LIG-008]
impacta: [LIG-006, MOD-004]
ancoras:
  settings: []
  tabelas: [season, standing]
  tools: []
  funcoes: [tiebreakOf, computeStandings, standings]
  rotas: ["GET /v1/leagues/:code/standings"]
docs: [docs/investigacoes/criterio-de-desempate-por-temporada.md, docs/planos/LIG-017-criterio-de-desempate-por-temporada.md]
verificado_em: 2026-07-20
atualizado: 2026-07-20
---

# Critério de desempate por temporada (ingerido e exibido)

## Descrição

O desempate da tabela hoje é um mapa hardcoded por código de liga (`tiebreakOf`, entregue no LIG-012):
`BRA` põe vitórias antes do saldo, todo o resto cai no default da Premier League. Funciona, mas não
sabe dizer **de onde veio a regra**, não acompanha mudança de temporada e não aparece em lugar nenhum
pro usuário — quem olha a tabela não tem como saber o que decidiu um empate de pontos.

Esta feature ingere o critério que a SportMonks já publica por temporada (`season.tie_breaker_rule_id`),
guarda-o na `season` com proveniência, faz o comparador da classificação ser **dirigido por esse dado**
(com a interpretação da regra curada no código, não inferida do nome), e exibe a sequência resultante
abaixo da tabela — no padrão que SofaScore e Wikipedia usam: "Em caso de empate: 1. Vitórias
2. Saldo de gols 3. Gols marcados".

## Tarefas

- [x] P1 dados — coluna `season.sportmonks_tie_breaker_rule_id` (nullable, só o id) + migração gerada pelo drizzle-kit
- [x] P2 dados — escrita nos **3** upserts que falam com a API + backfill; `backfill-season.ts` é ponte local e não preenche
- [x] P3 api — `TIEBREAK_BY_RULE_ID` curado + `tiebreakOf(season)` com procedência + invariante contra lista vazia; arnês atualizado no mesmo passo
- [x] P4 api — `standings` resolve pela temporada e `getLeague` publica o `tiebreak` (campo aditivo, sem envelope)
- [x] P5 ui — linha "Em caso de empate: …" na faixa de legenda, amarrada às colunas V/SG/GP, fora da condição de zonas
- [x] P6 ia — `prognosis-prompt.ts:938` e `:1367` ordenam pela regra da temporada (exige acumular vitórias)
- [x] P7 ia — `stakes-rounds.ts:60` idem

## Plano (2026-07-20)

Dossiê: [docs/planos/LIG-017-criterio-de-desempate-por-temporada.md](../../planos/LIG-017-criterio-de-desempate-por-temporada.md)
`depende_de` (LIG-012, LIG-008) está **feito/verificado** — sem bloqueio, sem P0 de stub.

### Objetivo, aceite e non-goals

Pronto = a ordem da tabela é decidida pela regra que a **temporada** declara (não pelo código da liga), e o
usuário lê sob a tabela qual foi essa regra — com a mesma regra valendo no prompt do prognóstico.
Non-goals: confronto direto / cartões / sorteio (nenhum tipo H2H existe na assinatura — dossiê §Briefing) e
exibi-los apagados sob a tabela (D6); tabela de referência `tiebreaker_rule` (descartada pelo dono — D2);
mudar `resolveSeason`; contract de schema.
**Sem pendências abertas** — as duas foram respondidas pelo dono em 2026-07-20 (dossiê §Pendências).
Aceite:
- A1 [dados] toda season ingerida **por caminho que fala com a API** tem `sportmonks_tie_breaker_rule_id` não-null → P2
- A2 [api] `_check-standings-order.ts` continua **11/11**, agora com a regra vinda da temporada → P3
- A3 [api] `GET /v1/leagues/BRA` devolve `tiebreak` com `criteria`, `source` e `label` **curado** (o mapa é
  `id → { criteria, label }`; `label` é procedência, não a lista — dossiê §Semântica) → P4
- A4 [ui] `/leagues/BRA` e `/leagues/PL` mostram textos de desempate **diferentes** → P5
- A5 [ia] a tabela pré-jogo do prompt ordena um par empatado do Brasileirão por vitórias → P6

### Premissas

- `resolveSeason` devolve `Promise<string>` (uuid), **não** a linha da season (`shared.ts:686`) — por isso
  `tiebreakOf` recebe um objeto literal e quem chama lê o id à parte.
- `_check-standings-order.ts:59-60` roda com dado **sintético, sem banco** — `tiebreakOf` tem de continuar pura.
- `use-league-query.ts:8-12` e `use-standings-query.ts` partilham `useSeasonParam()` → mesma season nas duas.
- Os 4 tipos vistos (`171`, `1526`, `577`, `573`) colapsam nos 2 comparadores atuais → mudança não-regressiva.
- Se uma premissa cair durante o `/i`: **PARAR**, anotar a divergência datada aqui, não forçar o passo.

### Decisões

- D1: `tiebreakOf(season)` recebe `{ code, sportmonksTieBreakerRuleId }` e **`resolveSeason` não muda** — driver: 7
  serviços chamam `resolveSeason`, e o arnês precisa de `tiebreakOf` sem banco; descartado: fazer
  `resolveSeason` devolver a linha, porque espalha blast radius por 7 callers sem ganho; pagamos: uma leitura
  extra do id em `standings.service` e `get-league.service`.
- D2: coluna guarda **só o id cru**, com nome que declara a origem (`sportmonks_tie_breaker_rule_id`, seguindo
  a convenção `sportmonks_*_id` do schema); a semântica mora em `TIEBREAK_BY_RULE_ID` e sai na API —
  **confirmado pelo dono em 2026-07-20** ("id interno, que não sai na api; na api sairia uma semântica
  bonita"); descartado: persistir o `name` da SportMonks (enganoso — "Matches Played") e a tabela de
  referência `tiebreaker_rule` (normalização de 11 linhas estáticas, sem ganho); pagamos: a linha do banco
  segue precisando do mapa em código pra ser lida.
- D6: **não** exibir a cauda não aplicada (confronto direto/cartões/sorteio) — driver: o modelo não computa
  esses critérios, então exibi-los descreveria uma ordenação que o código não executa; descartado: o padrão
  Wikipédia de mostrar o regulamento inteiro apagado; pagamos: a UI mostra menos que o regulamento oficial —
  aceito, porque mostra exatamente o que **foi aplicado**.
- D3: critério publicado como campo **aditivo** em `GET /v1/leagues/:code` — descartado: envelope em
  `/standings`, que quebraria em silêncio os scripts não-typechecked; pagamos: dois símbolos leem a regra.
- D4: `573 "None"` → default explícito, **nunca** `[]`, + invariante em `computeStandings` — driver: lista
  vazia degrada para ordem alfabética ignorando pontos (`shared.ts:2123`).
- D5: `TIEBREAK_BY_LEAGUE` (entrada `BRA`) **permanece** como override, e passa a apontar pra
  `TIEBREAK_BY_RULE_ID[577]` para carregar **também o `label`** — driver: se o id vier null, o Brasileirão
  cairia no default inglês e ordenaria errado **em silêncio**; sem o label, esse mesmo caso ordenaria certo
  porém **sem procedência**, derrotando metade do propósito; custo: uma linha de mapa.
- Adiadas de propósito pro `/i`: nome exato do helper que lê o id e a copy final da linha de desempate. (A
  micro-estrutura do `label` **não** é adiada — está cravada no dossiê §Semântica.)

### Passos

**P1 [dados] expand — coluna** — `apps/api/src/db/schemas/leagues.ts#season`: adicionar
`sportmonksTieBreakerRuleId: integer("sportmonks_tie_breaker_rule_id")` (nullable) + migração via `drizzle-kit`. Detalhe: dossiê
§Schema. Regras: código/dado em **inglês** (coluna `sportmonks_tie_breaker_rule_id`, campo `sportmonksTieBreakerRuleId`); carimbo
`// @feature LIG-017` na coluna (ponto de posse única). Don't: **não** hardcodar o número da migração como
`0038` — a árvore tem `0037` não-commitado do SIN-009, deixe o `drizzle-kit` gerar. **Não** criar tabela
`tiebreaker_rule` (descartada pelo dono — D2). **Não** encurtar o nome pra `tiebreaker_rule_id`: o prefixo
`sportmonks_` é o que declara "id externo da fonte" e foi pedido explicitamente. **Não** pôr
`notNull`/`default` — a ponte local não preenche.
**Não** remover `TIEBREAK_BY_LEAGUE` neste passo nem em nenhum outro (D5). Prova (nesta ordem):
`cd apps/api && bun run db:generate` → gera o `.sql`; `bun run db:migrate` → exit 0; então
`bun run scripts/_check-tiebreak-column.ts` (criado neste passo) → imprime `OK sportmonks_tie_breaker_rule_id integer`.
**`psql` não existe nesta máquina** — toda consulta de prova importa `db` de `src/db/client` e `sql` de
`drizzle-orm`, como fazem os `scripts/_probe-tiebreaker*.ts`.

**P2 [dados] fill (depende: P1)** — escrever a coluna nos **3** upserts que falam com a API:
`sync-sportmonks.ts:357` (via `seasonValues` `:348`), `sync-cup.ts:91` (via `:82`),
`scripts/sync-old-season.ts:120` (via `apiSeason` `:114`); ler o campo `tie_breaker_rule_id` da season da
SportMonks. Don't: **não** tentar escrever em `scripts/backfill-season.ts:28` — é ponte **local**, não faz
request; forçar ali só produz um valor inventado. **Não** derivar o valor do `name` do tipo. **Não** deixar o
campo fora do `set` do `onConflictDoUpdate` (senão só linha nova recebe, e re-sync nunca corrige).
**Backfill das 6 temporadas já ingeridas**: não é re-rodar os syncs inteiros (caro e mexe em tudo) — é um
script `scripts/_backfill-tiebreaker.ts` que, para cada `season.sportmonksSeasonId`, faz
`GET /v3/football/seasons/{id}`, lê `tie_breaker_rule_id` e faz `update` só dessa coluna. Os probes
`scripts/_probe-tiebreaker*.ts` já têm o cliente HTTP pra copiar.
Critério de avanço: backfill verificado **antes** do P3 confiar no dado. Prova:
`cd apps/api && bun run scripts/_backfill-tiebreaker.ts` → `6 seasons atualizadas, 0 sem regra`; depois
`bun run scripts/_check-tiebreak-column.ts` → `BRA=577`, `PL 25/26=1526`, `0 null`.

**P3 [api] semântica + arnês (depende: P2)** — `apps/api/src/modules/leagues/shared/shared.ts`: criar
`TIEBREAK_BY_RULE_ID` (dossiê §Semântica), trocar `tiebreakOf(code: string)` (`:2065`) por
`tiebreakOf(season: { code, sportmonksTieBreakerRuleId })` devolvendo `{ criteria, source, label }`, e adicionar em
`computeStandings` (`:2073`) a invariante que **rejeita `criteria` vazio**. Atualizar
`scripts/_check-standings-order.ts:59-60` no **mesmo passo**. Regras: `type`, nunca `interface`
(`interface Tiebreak {}` → `type Tiebreak = {}`); comentário de 1-2 frases com termo de domínio acima de cada
símbolo novo. Don't: `tiebreakOf` **não** acessa o banco — recebe objeto literal e nada mais (senão o arnês
sintético quebra, e sem typecheck a quebra é muda). **Não** mapear `171` incluindo "matches played". **Não**
codificar `573` como `[]`. **Não** deixar `label` com o `name` cru da SportMonks — `null` quando não souber
nomear. **Não** adiar a atualização do arnês pra um passo depois. Prova:
`cd apps/api && bun run scripts/_check-standings-order.ts` → **11/11 OK**, zero FAIL.

**P4 [api] publicar (depende: P3)** — `standings/standings.service.ts:17` passa a resolver o desempate pela
temporada já resolvida em `:14`; `get-league/get-league.service.ts:19` acrescenta `tiebreak` ao retorno.
Regras: pasta-por-endpoint preservada (nada de regra de negócio em `leagues.routes.ts`, que fica fino); Elysia
no Workers = **TypeBox, não zod**, **sem response schema**, `aot: false`; `type`, nunca `interface`. Don't:
**não** transformar o retorno de `standings()` em envelope `{ rows, tiebreak }` — `_check-endpoints.ts:59-60`
trata como array e não é typechecked (D3). **Não** criar rota nova `/standings/rule`. **Não** chamar
`resolveSeason` uma segunda vez dentro do mesmo serviço — reuse o `seasonId` já em escopo, senão as duas
resoluções podem divergir. Prova (API de pé com `cd apps/api && bun run dev` — a porta é **3001**,
`env.ts:13` = `process.env.PORT ?? 3001`; **não** é a 3211, que é a do web):
`curl -s localhost:3001/v1/leagues/BRA | jq .tiebreak` →
`{"criteria":["points","wins","goalDifference","goalsFor"],"source":"sportmonks","label":"Regulamento da CBF"}`;
e `curl -s localhost:3001/v1/leagues/PL | jq '.tiebreak.criteria'` → **sem** `"wins"`.

**P5 [ui] linha de desempate (depende: P4)** — `apps/web/features/leagues/components/league-detail/standings-table.tsx`:
segunda linha na faixa de legenda (`:143-152`), amarrando cada critério à **coluna** que o usuário vê
(`:55-73`) e **exibindo a procedência quando houver**:
*"Em caso de empate (Regulamento da CBF): 1. Vitórias (V) 2. Saldo de gols (SG) 3. Gols marcados (GP)"* —
com `label` entre parênteses, omitido inteiro quando `label` for `null`. A lista vem de `criteria`; o
parêntese vem de `label`. Consumir `useLeagueQuery` (mesma feature, permitido). De quebra, corrigir o
comentário defasado em
`use-standings-query.ts:6` ("official PL rule"). Regras: folder-by-feature em
`apps/web/features/leagues/` — formatação da lista vira função **pura** em `utils/` (sem hook, sem JSX);
`services/` é o único lugar com fetch; kebab-case sem sufixo redundante; **proibido importar de outra
feature**; string de UI em **português**, dado em inglês. Don't: **não** pendurar a linha na condição
`present.length` de `:143` — ela some quando a liga não tem zona (cenário T5). **Não** renderizar a linha
quando `league.type === "cup"` (não há tabela). **Não** inventar rótulo quando `label` for `null` nem afirmar
regra oficial quando `source === "default"` — omita o parêntese e deixe só os critérios. **Não** exibir a
"cauda não aplicada" (confronto direto/cartões/sorteio): o código não a executa, e mostrá-la faria a UI
descrever uma ordenação falsa (PENDENTE-DONO-2, resolvido). **Não** montar a lista a partir do `label` — ele é
procedência, a lista vem de `criteria`. **Não** criar request novo: o dado vem da query que
`league-detail.tsx:18` já faz. Prova: roteiro no dossiê §Testes, cenários **T1..T6** (chrome-devtools MCP),
com `list_console_messages` e `list_network_requests` limpos.

**P6 [ia] prognóstico (depende: P3)** — `apps/api/scripts/prognosis-prompt.ts`: as duas cópias
(`:938` `preMatchTable` e `:1367` `standingsAsOf`) passam a ordenar pela regra da temporada. **Cada uma exige
acrescentar contagem de vitórias ao acumulador** — hoje `{points,gd,gf}` e `{pts,gd,gf,pl}` não têm o campo,
então o critério `wins` seria inaplicável. **Mecanismo de obtenção da regra** (não é adiado): o script já roda
escopado a UMA partida/temporada, então lê `season.sportmonksTieBreakerRuleId` **uma vez** para a season daquela
partida, chama `tiebreakOf({ code, sportmonksTieBreakerRuleId })` e reusa o `criteria` resultante nos dois sorts — não é
leitura por linha nem por jogo. Don't: **não** trocar só o comparador sem adicionar o acumulador de vitórias —
o sort silenciosamente ignoraria `wins` e o Brasileirão continuaria errado, agora **parecendo** corrigido.
**Não** mexer na contagem de vagas de `:1372-1375`, que já está certa por liga. **Não** duplicar
`TIEBREAK_BY_RULE_ID` no script — importe de `shared.ts`. **Não** consultar o banco dentro do laço de
ordenação. Prova: `cd apps/api && bun run scripts/prognosis-prompt.ts <matchId de jogo do Brasileirão com par
empatado em pontos e saldo>` → na tabela pré-jogo do prompt gerado, o time com mais vitórias aparece acima
(o par Atlético-MG × Corinthians registrado em `LIG-012:465`). Inspeção manual do texto gerado — declare como
tal, não como assert automático.

**P7 [ia] stakes (depende: P3)** — `apps/api/scripts/stakes-rounds.ts:60`: mesma troca, mesmo acréscimo de
vitórias ao acumulador (`type Line` na `:43`), mesmo mecanismo de obtenção da regra do P6 (uma leitura por
temporada, não por linha). Don't: os mesmos do P6. Prova: `cd apps/api && bun run scripts/stakes-rounds.ts <N>`
— o script recebe **números de rodada** posicionais (`stakes-rounds.ts:14`, `process.argv.slice(2).map(Number)`),
não um match id como o P6 → a ordem da tabela pré-rodada bate com a do P6 para o mesmo par empatado.
Inspeção manual, como o P6.

### Verificação final

- `bun run typecheck` limpo (raiz) — lembrando que ele **não cobre** `apps/api/scripts/**`
- **API/dados** (não existe runner de unidade no repo — tudo é script bun ad-hoc):
  `cd apps/api && bun run scripts/_check-standings-order.ts` → **11/11** (baseline capturado antes da
  mudança); `bun run scripts/_check-endpoints.ts` → sem regressão; `bun run scripts/_check-tiebreak-column.ts`
  (criado no P1) → `0 null`, `BRA=577`, `PL 25/26=1526`. Casos cobertos: happy (BRA com regra própria), borda
  (temporada antiga `171` vs `1526` — mesma semântica), erro (regra desconhecida → `source: "default"`,
  `label: null`, **nunca** lista vazia)
- **Browser real (chrome-devtools MCP)** — teste PRIMÁRIO da faceta `ui`: roteiro no dossiê §Testes,
  cenários **T1..T6**; MCP não atacha com o Chrome do dono aberto → **declarar**, não afirmar que funciona
- **E2E Playwright**: não justificado aqui (mudança é texto estático sob a tabela, coberta por T1..T6)
- re-teste do `features impact`: **LIG-006, MOD-004** (consomem a ordem) e **LIG-012** (o arnês é dele)
- último passo SEMPRE: subagent em contexto fresco revisa o diff contra A1..A5 — reporta só gap de
  requisito/correção; diff fora dos paths deste plano = achado

### Pré-mortem e rollback

- **C1: temporada nova nasce com `sportmonks_tie_breaker_rule_id` null** (um 5º sítio de upsert aparece, ou a SportMonks
  para de mandar o campo) — sintoma pro dono: tabela do Brasileirão ordenando como a inglesa; mitigação: o
  override `BRA` (D5) mantém o caso null **correto**, e o assert do banco na Verificação avisa que o sync
  regrediu.
- **C2: rótulo e ordem divergem** (alguém torna `useLeagueQuery` ou `useStandingsQuery` season-agnóstica) —
  sintoma: tabela recomputada por uma regra e rotulada por outra, **invisível no dado de hoje**; mitigação:
  invariante registrada no dossiê §Blast radius; T3 exercita season antiga.
- **C3: `/standings` chamada para copa** com regra `573` — sintoma: ordem alfabética ignorando pontos;
  mitigação: invariante do P3 rejeita lista vazia.
- **C4: script quebrado em silêncio** (`scripts/**` fora do typecheck) — sintoma: erro só quando alguém roda à
  mão; mitigação: P3 atualiza o arnês no mesmo passo; P6/P7 têm prova própria.
- Rollback por classe: `ui`/`api` puros → `git revert` basta; schema → **só expand**, reverte com
  `drop column`; dado ingerido → re-sync reescreve.
- O rollback **não desfaz**: prognósticos já gerados com a tabela mal-ordenada (ficam no histórico como foram
  emitidos).

### Fora de escopo

- Confronto direto (comparação pareada em `computeStandings`) → criar
  `docs/features/ligas/LIG-018-desempate-por-confronto-direto.md` (status: ideia, depende_de: [LIG-017]);
  critério: uma liga com regra H2H (La Liga/Serie A/Bundesliga) entra na assinatura.
- Destacar **na linha** qual critério decidiu aquele par (gap de mercado registrado na investigação) → ideia
  futura, sem ID por ora.

## Evidências

- [código] `apps/api/src/modules/leagues/shared/shared.ts:2060` — `TIEBREAK_BY_LEAGUE` é mapa por
  `league.code` com uma única entrada (`BRA`); prova que o desempate atual não é por temporada.
  (Linhas re-resolvidas contra o commit `3a7fdaf`; a investigação citou a árvore suja, +23 do WIP do SIN-009.)
- [código] `apps/api/src/modules/leagues/shared/shared.ts:686` — `resolveSeason` devolve `Promise<string>`
  (o uuid), não a linha da season; prova que `tiebreakOf` precisa receber objeto literal e ficar pura.
- [código] `apps/api/scripts/backfill-season.ts:28` — monta a season a partir da linha de `league`, sem
  request à API; prova que são **3** upserts preenchíveis, não 4.
- [código] `apps/api/src/modules/leagues/standings/standings.service.ts:17` — `tiebreakOf(code)` recebe o
  código da liga, não a temporada já resolvida na linha acima (`:14`); prova que virar season-aware é
  troca de argumento, não refatoração.
- [código] `apps/api/scripts/prognosis-prompt.ts:938` e `apps/api/scripts/stakes-rounds.ts:60` — duas
  cópias do desempate da PL fora do `computeStandings`; provam que a tabela pré-jogo que alimenta a LLM
  ordena o Brasileirão errado.
- [api] `GET /v3/football/seasons/{id}` (2026-07-20) — PL 25/26 = 1526, PL 24/25 = 171, BRA 25 e 26 = 577,
  Carabao = 573; prova que a regra é por temporada e varia dentro da mesma liga.
- [arquitetura] `docs/arquitetura/modelagem.md:168` — `[cravado]` "cobertura é por (competição, temporada),
  não por competição"; precedente direto de atributo por temporada vindo da API.
- [web] https://en.wikipedia.org/wiki/2024%E2%80%9325_Premier_League — a PL 24/25 desempata por pontos →
  saldo → gols marcados → confronto direto, SEM "matches played"; prova que o nome do tipo 171 da
  SportMonks ("Goal Difference, Matches Played, Goals Scored") não é mapeável literalmente.
- [web] https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/standings/season-standings — o tutorial
  rotula `standing_rule_id` como "The tiebreaker rule applied at this position"; prova que a doc induz ao
  campo errado (a referência formal, em contraste, é neutra).
- [web] https://pt.wikipedia.org/wiki/Campeonato_Brasileiro_de_Futebol_de_2025_-_S%C3%A9rie_A — ordem oficial
  da CBF (pontos → vitórias → saldo → gols marcados → confronto direto → cartões → sorteio); triangula o
  tipo 577 e o override que já roda.
- [código] `apps/api/tsconfig.json` — `include` cobre só `src/**/*.ts`; prova que mudança de assinatura
  consumida por `apps/api/scripts/**` quebra em silêncio (e não há `.github/workflows`).
- [código] `apps/api/src/modules/leagues/get-league/get-league.service.ts:11` — `getLeague` já chama o mesmo
  `resolveSeason` do standings; prova que publicar o critério ali é aditivo e season-correto.
- [prova] `bun run scripts/_check-standings-order.ts` → **11/11** (2026-07-20) — baseline de não-regressão
  capturado ANTES da mudança, incluindo Atlético-MG (7V) acima do Corinthians (6V) com 24pts e saldo −1.

## Verificação

Executada em 2026-07-20. Escada: variantes/erros primeiro, golden path por último.

**dados (A1)** — `bun run scripts/_check-tiebreak-column.ts` → `OK sportmonks_tie_breaker_rule_id integer (nullable=YES)`
e **`0 null`** nas 6 temporadas: `BRA 2025/2026=577`, `CARA=573`, `FAC=171`, `PL 24/25=171`, `PL 25/26=1526`.
Backfill por `scripts/_backfill-tiebreaker.ts` → `6 seasons atualizadas, 0 sem regra` (alvo `localhost:5434/mrtip_dev`,
conferido antes de escrever). Migração `0038_massive_beast.sql` = um `ADD COLUMN` aditivo, nada varrido junto.

**api (A2)** — `bun run scripts/_check-standings-order.ts` → **14/14**, zero FAIL: os **11 do LIG-012 preservados
intactos** (baseline capturado antes da mudança, também 11/11) + **3 novos** cobrindo decisões que estavam sem
teste: D5 (`BRA` com id null → override, com vitórias E procedência), D4 (regra desconhecida → default explícito,
nunca lista vazia) e a invariante de `computeStandings` contra `criteria` vazio.
`bun run scripts/_check-endpoints.ts` → **11/11**, sem regressão (é o re-teste de LIG-006/LIG-012).

**api (A3)** — HTTP real. O `curl` do plano previa a porta 3001, mas ela estava disputada por 3 processos;
rodei numa porta livre com a escape hatch de dev do guard (`CLERK_SECRET_KEY` ausente sob Bun — fail-closed
só no Worker). `GET /v1/leagues/BRA` →
`{"criteria":["points","wins","goalDifference","goalsFor"],"source":"sportmonks","label":"Regulamento da CBF"}`;
`/v1/leagues/PL` → **sem** `"wins"`; `/v1/leagues/PL?season=23614` → semântica da PL (regra 171);
`/v1/leagues/CARA` → `label: null` (573 "None", sem regulamento a nomear).
`GET /v1/leagues/BRA/standings` segue **array** de 20 (D3 respeitado, sem envelope).

**ui (A4)** — browser real via `agent-browser` com a sessão Clerk do dono (o `chrome-devtools` atachava, mas
num perfil limpo sem login; o app é fail-closed sem bypass em dev). Cenários:
- **T1** `/leagues/BRA` → *"Em caso de empate (Regulamento da CBF): 1. Vitórias (V) 2. Saldo de gols (SG) 3. Gols marcados (GP)"*
- **T2** `/leagues/PL` → *"…(Regulamento da Premier League): 1. Saldo de gols (SG) 2. Gols marcados (GP)"* — **sem** "Vitórias", texto DIFERENTE do T1
- **T3** `/leagues/PL?season=23614` → renderiza, texto igual ao T2 (esperado: 171 e 1526 têm a mesma semântica)
- **T4** `/leagues/FAC` → aba "Chaveamento", **zero** ocorrências de "empate", sem tabela
- **T5** — **não exercitável pelo dado** (nenhuma temporada tem tabela com zero zonas). Provado por ESTRUTURA no
  DOM vivo: a faixa tem dois filhos irmãos `[DIV, P]` e `linhaDentroDeZonas=false` — zona nenhuma não pode apagar a linha
- **T6 (golden path)** `/leagues/BRA?season=25184` → Bragantino 10º (48pts, **14V**, SG −12) ACIMA de Atlético
  Mineiro 11º (48pts, 12V, SG **−1**): a ordem executa a regra que a própria página exibe (sob a regra inglesa
  seria o inverso)
- Fechamento: console sem erro novo (só avisos pré-existentes de chave de dev do Clerk), zero page errors,
  e **nenhum request adicional** — o `tiebreak` vem no `GET /v1/leagues/BRA` que já existia

**ia (A5)** — `bun run scripts/prognosis-prompt.ts 8243a710-…` (Fluminense × Bahia, BRA 2025, rodada 38): o prompt
gerado ordena **Bahia 6º · Botafogo 7º**. A virada foi conferida **no dado**, não na prosa: sob a regra da
temporada Bahia (17V, SG 6) fica acima de Botafogo (16V, SG 18); sob a regra da PL a ordem **inverte**. Era
exatamente esse par que o prompt vinha entregando errado pra LLM.
`scripts/stakes-rounds.ts 38` roda; ordem idêntica ao comparador antigo (não-regressão, 20 times).

### Ressalvas declaradas (não são silêncio)

1. **`bun run typecheck` limpo** nos 3 pacotes (api/ui/web). Durante a sessão houve 6 erros `TS2339` em
   `sync-sportmonks.ts:648-653` (`STAT.errorLeadToGoal` e cia.), vindos do WIP paralelo do dono em estatísticas
   defensivas — não desta feature (zero erro em arquivo tocado aqui). Ele fechou as chaves do `STAT` antes do
   fim da sessão e o gate ficou verde. Registrado porque explica a janela em que a verificação rodou vermelha.
2. **`stakes-rounds.ts` hardcoda a season 25583 (PL)** na `:18`, então o critério `wins` fica **latente** ali: o
   passo está correto, mas só exercita a regra inglesa até o script ser parametrizado por temporada.
3. **`super-prognosis.ts` não foi alterado** — inspecionado a pedido do dono ("são 2 geradores"): ele **não
   computa tabela**, reusa a Parte 2 (dados) do prompt já persistido em `match_prognosis`. Herda a correção do
   `prognosis-prompt.ts`, mas **só para prompts regerados** — os já persistidos seguem com a tabela antiga.
4. **`573 "None"` recebeu `label: null`**, não a string `"Sem regra declarada"` que o dossiê esboçou. A copy final
   era item adiado pro `/i`, e `null` é o que obedece ao Don't do passo ("null quando não souber nomear") e ao do
   P5 ("não inventar rótulo"): a UI omite o parêntese em vez de anunciar um regulamento inexistente.
