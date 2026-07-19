# LIG-012 — Ingestão da Série A (Brasileirão) · dossiê de planejamento (2026-07-19)

Feature: [docs/features/ligas/LIG-012-ingestao-serie-a-brasileirao.md](../features/ligas/LIG-012-ingestao-serie-a-brasileirao.md)
Base: commit `840566f` (2026-07-19) — todo file:line deste doc vale neste commit.

> **Árvore suja no momento do planejamento.** `shared.ts` e `get-player.service.ts` têm trabalho do
> LIG-011 **não commitado** (44 linhas em `shared.ts`). As linhas citadas aqui foram tiradas de
> `git show 840566f:<path>`, não do working tree. Consequência real, não formal: o WIP **expande**
> `concurrentSeasonIds` para dentro de `getPlayerDetail` — ver §Blast radius (B1), onde isso muda o
> risco do P6.

## TL;DR

Entram a Série A 2025 (season SportMonks `25184`, encerrada, 380 jogos) como **2ª liga** do produto e as
generalizações que ela exige. A decisão central: **generalizar antes de ingerir** — o sync é mono-liga por
construção e "só trocar as 3 constantes do topo" falha em silêncio (a `WINDOWS` hardcoded no calendário inglês
engoliria a maior parte da temporada brasileira sem erro). A ordem é fuso → parametrização → ingestão →
correções de leitura → UI, e o critério de sucesso tem **duas metades**: a Série A aparece certa **e** a PL sai
byte-a-byte idêntica. Recalibrar o motor para o futebol brasileiro **não** entra aqui (vira MOD-010): esta
feature entrega a *base* de calibração, não a calibração.

## Briefing — o que já foi falado e decidido

> Fonte comum dos 5 itens abaixo: bloco **Decisões do dono (2026-07-19)** do arquivo da feature
> (`docs/features/ligas/LIG-012-ingestao-serie-a-brasileirao.md`) — arquivo **criado nesta sessão, posterior ao
> pino**, por isso citado por seção e não por linha.

- **Alvo é a temporada 2025 (`sportmonksSeasonId` 25184)**, encerrada — dispensa sync incremental, que sai do escopo.
- **Passo 1 de 2, explicitamente**: entrega base de backtest/calibração e páginas históricas; **não** põe jogo ao
  vivo na tela nem gera pick (temporada encerrada não é apostável).
- **Série A 2026 ao vivo é feature futura separada**, a abrir só depois de fechar o marco de MOD-004 em curso —
  trocar o insumo no meio da recalibração destrói a atribuição de causa.
- **`league.code` = `BRA`** — entra no slug de toda partida (LIG-009), caro mudar depois.
- **Fuso primeiro, aceitando o re-sync da PL que ele implica** (muda horários já exibidos).
  Decisão cravada: o fuso é **o da liga**, não o do viewer. Não reabrir no `/i`.
- **Gate do LIG-008 acionado**: _"Se entrar 2ª liga antes do `/i`: PARAR e generalizar"_ — fonte:
  `docs/features/ligas/LIG-008-historico-multi-temporada.md:97`. Este plano é a resposta ao gate.
- **Recomendação da investigação: opção B** (corrigir base → migrar → recalibrar) — fonte: §4 de
  `docs/investigacoes/serie-a-brasileirao-migracao-sportmonks.md` (doc da mesma sessão, posterior ao pino).
  O plano detalha B, não re-decide.
- **Método de regressão herdado do LIG-008/LIG-011**: mudança em símbolo compartilhado se prova com saída da PL
  idêntica ao baseline, nunca só com a liga nova aparecendo na tela — fonte: teste A2 em
  `docs/features/ligas/LIG-008-historico-multi-temporada.md:19` (`IDÊNTICOS ao baseline pré-refactor`).
- **Convenções que este plano herda do CLAUDE.md**: `type` nunca `interface`; datas via `date-fns`/`date-fns-tz`;
  código/dado em inglês, só string de UI em português ([[codigo-em-ingles-ui-em-pt]]).

**Sem `[PENDENTE-DONO]` bloqueante.** As três decisões que pareciam abertas já estão cravadas no bloco de
decisões do dono (alvo 2025, fuso da liga, re-sync da PL aceito). A pergunta em aberto da investigação
(latência de escalação pré-jogo no BR, §7 item 1 da investigação) é gate de **go-live** da feature futura ao
vivo — temporada encerrada não tem escalação pré-jogo a medir.

## Estado do terreno

### `dados` — o sync é mono-liga por construção

`apps/api/src/db/sync-sportmonks.ts:20-22` fixa `LEAGUE_ID = 8`, `SEASON_ID = 25583` e `CODE = "PL"` como
constantes de módulo, sem CLI nem env. Três armadilhas encadeadas:

- **`WINDOWS` hardcoded** (`sync-sportmonks.ts:378-383`) cobre ago/2025 → jun/2026 (calendário inglês).
  `fixtures/between` tem teto de ~100 dias, então a temporada é varrida em janelas fixas; a Série A 2025 vai de
  **2025-03-29 a 2025-12-07** e o sweep atual a perderia **em silêncio, com exit 0**.
- **`starting_at` gravado cru** (`sync-sportmonks.ts:451-452`): `date` e `time` saem de `slice()` sobre a string
  UTC. Sem `date-fns` no `apps/api` — ver Premissas P-2.
- **`normalizeZone`** (`sync-sportmonks.ts:206-213`) conhece só CHAMPIONS/EUROPA/CONFERENCE/RELEGATION; as 4 zonas
  CONMEBOL caem no `return null`.
- **`imgKey("teams", …)`** não passa sufixo de desambiguação, enquanto venues e players passam. A assinatura é
  `imgKey(folder, name, imagePath, suffix?)` (`sync-sportmonks.ts:218`) e o sufixo usado pelos outros é o id
  SportMonks da entidade (`venues` em `:404`, `players` em `:516`). São **duas** chamadas de `teams` sem sufixo,
  não uma: `sync-sportmonks.ts:320` e `sync-old-season.ts:136`. Ver B3 (a premissa de colisão está **não
  verificada** — a correção é preventiva).

`apps/api/scripts/sync-old-season.ts` é uma **segunda cópia** do pipeline, com suas próprias
`LEAGUE_ID`/`CODE` (`:16-17`), seu `SEASON_ID` já vindo de `process.argv[2]` (`:18`), sua própria `WINDOWS`
(`:20-25`), seu `normalizeZone` (`:59-66`), seu `imgKey` (`:67-71`) e sua gravação de data (`:203`).

### `dados` — quantos pontos de aplicação existem DE VERDADE (corrigido)

Um levantamento anterior deste dossiê dizia "dois pontos de aplicação". **É falso, e a diferença é destrutiva.**
`grep -rn "starting_at.slice" apps/api/src apps/api/scripts` devolve **quatro** sítios que gravam `match.date`/
`match.time`:

| # | Sítio | O que ingere hoje |
|---|---|---|
| 1 | `apps/api/src/db/sync-sportmonks.ts:451-452` | PL 2025/26 (380 partidas) |
| 2 | `apps/api/scripts/sync-old-season.ts:203` | PL 2024/25 (380) |
| 3 | `apps/api/src/db/sync-cup.ts:188-189` — passo "lean" | FA Cup (871) + Carabao (93) |
| 4 | `apps/api/src/db/sync-ingest.ts:250-251` — dentro de `ingestFixtures` | reescreve as mesmas linhas do #3 |

Entrypoints, na ordem da tabela: `bun run db:sync` · `bun run scripts/sync-old-season.ts 23614` ·
`bun run src/db/sync-cup.ts 24 25919 FAC proper` e `bun run src/db/sync-cup.ts 27 25654 CARA` · o #4 não tem
entrypoint próprio — é chamado pelo passo rico do sync de copa.

> **DIVERGÊNCIA MEDIDA (2026-07-19, no `/i`): o entrypoint da FA Cup acima está ERRADO para re-sync.**
> Com o `proper`, o sync cobre só as stages type_id=224 — **123** fixtures das 8 stages "proper", de um
> lote de **871**. As 748 partidas de qualifying nascem só da invocação **sem** `proper` (16 stages).
> Consequência: rodar o comando documentado deixa **709 jogos em BST em UTC cru**, que é precisamente o
> B2/C6 ("base em fuso misto", `loadTeamFormMatches` reordena a forma cross-competition em silêncio).
> Comando correto para o re-sync do P1b: `bun run src/db/sync-cup.ts 24 25919 FAC`.
>
> **A métrica de detecção deste dossiê também falhou** e foi endurecida. "~41% no verão / 0% no inverno;
> nenhum lote com 0% global" não pega este caso: o FAC ficou em **0,8%** (os 7 jogos BST entre os 123
> re-sincados), passando pelo critério "≠ 0%". O critério que pega, agora implementado no
> `_check-kickoff-tz.ts --db`: **todo** jogo em mês seguramente BST (mai–set) tem de andar **exatamente
> +60min**, e **todo** jogo em GMT profundo (dez–fev) tem de andar **0** — com mar/abr/out/nov fora do
> assert por serem meses de virada de DST. Foi esse critério que expôs `1/710` no lote FAC.

`sync-cup.ts` grava a partida **duas vezes**: o passo lean (#3) e depois o passo rico via `ingestFixtures` (#4).
`sync-old-season.ts` **não** delega pro `ingestFixtures` — grava direto. Logo o fuso tem de ser parametrizado em
`IngestOpts` (`sync-ingest.ts:208-216`, que hoje carrega `seasonId`/`code` e nenhum fuso) **e** aplicado nos
outros três sítios.

**Consequência de ordem, não só de contagem:** corrigir só os sítios 1 e 2 deixa as 964 partidas de copa em UTC
cru enquanto a PL passa a hora de parede de Londres. O LIG-011 mistura PL + FA Cup + Carabao numa **única lista
ordenada por `match.date`** (`shared.ts#loadTeamFormMatches`, `:1335`) — base incoerente reordena a forma
cross-competition em silêncio. Ver B2.

### `dados` — armadilha: o catálogo fantasma

`apps/api/src/modules/leagues/consts.ts:15-24` exporta `CATALOG` com `leagueId: 39` (**API-Football, não
SportMonks**) e season "2024/25". **Zero importadores** (`grep -rn "leagues/consts" apps/api/src` volta vazio) —
é código morto. Mas o docstring dele (`:1-5`) diz literalmente _"Adding a league/season = adding an entry here
(leagueId + season) and running the seed"_. É o lugar mais óbvio do repo para "adicionar uma liga", e a instrução
que ele dá está errada em ambos os eixos (fonte e método). Ver B7.

### `dados` — o que já é agnóstico (não precisa de trabalho)

- `apps/api/src/db/schemas/leagues.ts:29` — a season referencia a liga por `leagueCode: text("league_code")`:
  o schema **já é multi-liga**, nenhuma mudança estrutural é necessária para a 2ª liga.
- **O demote de `isCurrent` é escopado por liga** (`sync-sportmonks.ts:305-308`; o filtro está na **:308**,
  `.where(and(eq(season.leagueCode, CODE), ne(season.sportmonksSeasonId, SEASON_ID)))`).
  Parece o risco óbvio ("sincar BRA derruba a season corrente da PL → `currentSeasonId` 404") e **não é** — uma vez
  que `CODE` vire parâmetro, o demote só atinge seasons da própria liga. Verificado por leitura direta.
- `apps/api/src/db/slug.ts:15-17` — `matchSlug` usa `slugify(seasonName)` sem parsear barra; o nome "2025" gera slug válido.

### `api` — leituras que assumem PL

- `computeStandings` (`shared.ts:1997`) ordena pontos → saldo → gols pró → nome (`shared.ts:2044`), **sem vitórias**;
  o comentário em `shared.ts:1993` diz literalmente que é a regra da Premier League. O REC da CBF põe vitórias em 2º.
  A assinatura é `(matches: Match[])` — **não recebe liga**, então ensinar o desempate exige mudar a assinatura.
  Só **2 callers**, ambos em `standings/standings.service.ts:18` e `:21`. Blast radius contido.
- Não dá pra fugir usando a posição oficial da SportMonks: `standings.service.ts:18` recomputa no caminho
  `?upTo=N` ("classificação no momento da partida"), que por definição não pode vir da posição corrente armazenada.
- `concurrentSeasonIds` (`shared.ts:712`) junta seasons **só por `startYear`**, sem filtro de liga/país.
- `resolveSeason("PL", …)` fixo em `get-team/get-team.service.ts:20` e `get-player/get-player.service.ts:8`, os dois
  com TODO explícito (`get-team.service.ts:16-17`, `get-player.service.ts:6`).

### `ui` — 3 mapas de zona hardcoded + 1 mock

`standings-table.tsx:20`, `team-standing.tsx:6` e `match-detail.tsx:51` declaram mapas de zona com as 4 chaves
europeias; zona CONMEBOL renderiza sem cor e sem legenda. A navegação **já é multi-liga** e não precisa de código
novo (`use-leagues-nav.ts` itera o catálogo da API). `features/round-hub/consts.ts:3-4` fixa
`LEAGUE_NAME = "Premier League"` — é a **home** (`app/(app)/page.tsx`), mas é mock: fora de escopo (§Fora de escopo).

### Estado do banco (dev, 2026-07-19)

3 ligas ingeridas, todas `country = "England"`: PL (league), FAC e CARA (cup). 4 seasons; PL/FAC/CARA 2025/2026
todas `is_current = true` (uma por liga) e PL 2024/2025 `false`. **Nenhuma linha brasileira** — ingestão é 100% aditiva.

## Mapa de dependências

**Features** (de `bun run features impact LIG-012`):

- **LIG-008** (`verificado`) e **LIG-011** (`feito`) — pré-requisitos, ambos **fechados**: gate liberado, sem P0 de stub.
- **LIG-011** ← aresta mais quente: é dono de `concurrentSeasonIds`, alterado no P6. Cruzar competições da MESMA
  campanha é feature dele, não bug.
- **LIG-006 / LIG-005 / MOD-009 / SIN-008** ← todos ancorados em `match.date`, reescrita no P1.
- **LIG-009** ← `matchSlug` consome o nome da season; slug de toda partida BRA nasce no P4.
- **LIG-001 / LIG-002** ← páginas de jogador/time, destravadas do `"PL"` no P7.
- **MOD-003 / MOD-004 / MOD-001** ← consomem o banco de partidas; ganham liga nova como insumo (calibração = MOD-010).

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `sync-sportmonks.ts#main` | nenhum (entrypoint `bun run db:sync`) | re-sync PL completo; contagens iguais ao baseline |
| `sync-ingest.ts#ingestFixtures` + `#IngestOpts` | `sync-cup.ts:207` (único importador) | re-rodar FA Cup e Carabao; 871+93 partidas, horários convertidos |
| `sync-cup.ts#main` | nenhum (entrypoint `bun run src/db/sync-cup.ts <lg> <ssn> <code>`) | FA Cup 871 + Carabao 93 preservadas, bracket intacto |
| `sync-old-season.ts#main` | nenhum (entrypoint `bun run scripts/sync-old-season.ts 23614`) | PL 2024/25 com 380 partidas e horários convertidos |
| `shared.ts#computeStandings` | `standings.service.ts:18`, `:21` (só 2) | `/leagues/PL/standings` byte-a-byte; `?upTo=N`; `/leagues/BRA/standings` |
| `shared.ts#concurrentSeasonIds` | `shared.ts:1335` (forma), `getPlayerDetail` (WIP LIG-011 não commitado) | LIG-011: `concurrentSeasonIds(PL)` = **3**; BRA = 1 |
| `shared.ts#resolveSeason` | `get-team.service.ts:20`, `get-player.service.ts:8`, `standings.service.ts` | `/teams/:slug`, `/players/:id` PL idênticos; equivalentes BRA 200 |
| `sync-sportmonks.ts#normalizeZone` | interno + cópia em `sync-old-season.ts:59-64` | 4 zonas CONMEBOL não-null; zonas PL inalteradas |
| `league` (tabela) | todo o `apps/api` + nav do web | migração aditiva aplica; PL segue respondendo |

## Blast radius e cuidados

- **B1 — `concurrentSeasonIds` filtrado pelo critério ERRADO quebra o LIG-011.** Filtrar por `leagueCode` é o
  reflexo óbvio e **está errado**: separaria a Série A corretamente, mas também separaria a PL das próprias
  FA Cup/Carabao, que é exatamente a feature do LIG-011. O critério certo é **`league.country`** — confirmado
  viável no banco: PL/FAC/CARA têm `country = "England"`, a Série A entra como `Brazil`.
  *Sintoma se quebrar:* forma cross-competition do time perde os jogos de copa (volta a mostrar só PL);
  totais de jogador encolhem. *Como detectar:* teste do LIG-011 — `concurrentSeasonIds(PL corrente)` = 3.
  **Agravante:** o WIP não commitado leva `concurrentSeasonIds` para dentro de `getPlayerDetail`, então o
  raio hoje é maior que o do commit pinado — a página do jogador passa a depender disso.
- **B2 — o P1 só reescreve `match.date`/`match.time` das partidas cujo sync for RE-RODADO.** É mudança de dado,
  não de código: corrigir os 4 sítios não mexe em nenhuma linha já gravada. A base tem 1.724 partidas em 4 lotes
  com **entrypoints diferentes** (tabela em §Estado do terreno) — `bun run db:sync` sozinho reescreve **só** as 380
  da PL 2025/26. *Sintoma se parar aí:* **base em fuso misto** — PL 25/26 em hora de parede de Londres, PL 24/25 +
  FA Cup + Carabao (1.344 partidas) ainda em UTC cru. O LIG-011 ordena PL+copas por `match.date` numa lista só
  (`shared.ts:1335`), então a forma cross-competition reordena errado **sem erro nenhum**. *Como detectar:* depois
  de re-rodar os 4 syncs, a fração de partidas cujo `time` mudou fica em ~41% na PL (BST) e ~0% nos jogos de
  inverno; 100% = conversão dupla, 0% = conversão não aplicada. Um lote com 0% enquanto outro tem 41% = sync
  esquecido.
  *Quantas partidas de cada lote não mudam:* jogo de dez/jan/fev (GMT) é idêntico por construção — a métrica é
  por-lote, nunca global.
- **B3 — colisão de logo no R2 seria destrutiva e silenciosa; a correção é PREVENTIVA, não a cura de um bug medido.**
  `teams/<slug>.png` é namespace plano e global às ligas, e `slugify` (`apps/api/src/db/slug.ts:4-11`) faz NFD +
  remove diacrítico + kebab-case, sem nenhuma garantia de unicidade. Se dois clubes quaisquer das 5 ligas
  normalizarem para o mesmo slug, o upload posterior **sobrescreve** o anterior.
  **Correção de uma afirmação anterior deste dossiê:** o exemplo "Atlético-MG / Athletico-PR / Atlético-GO
  colapsam na mesma chave" **não foi verificado e provavelmente é falso** — os nomes canônicos da SportMonks
  ("Atlético Mineiro", "Athletico Paranaense", "Atlético Goianiense") produzem `atletico-mineiro`,
  `athletico-paranaense` e `atletico-goianiense`, que são **distintos**. Verificar exige a lista real de
  `participant.name` da season 25184, que precisa de rede + `SPORTMONKS_API_KEY` — **não verificado nesta sessão**.
  Portanto: o P3 aplica o sufixo como *hardening* (paridade com venues/players, custo ~1 linha × 2 sítios) e a
  Prova assere **ausência de colisão** (chaves distintas = clubes distintos), **nunca** um "erro atual" numérico.
  *Sintoma se colidir:* escudo errado na tabela. *Como detectar:* `count(distinct logo_url) = count(*)` nos times da season.
  *Custo aceito do sufixo (D8):* a chave de TODO time cujo logo mora no R2 muda (`arsenal.png` → `arsenal-19.png`).
  Só os times vindos de **standings** têm logo no R2 — os de copa usam a URL do CDN da SportMonks
  (`sync-cup.ts:20-21`), então o re-key atinge ~20-25 clubes da PL, não os 745 da tabela `team`. Os objetos
  antigos ficam órfãos no bucket; limpeza não entra neste escopo.
- **B4 — scripts de prognóstico leem o MESMO banco.** `_backtest-math-vs-naive.ts:33` filtra `leagueCode = "PL"`, então
  o backtest **ignora** a Série A por construção (não quebra, fica cego). Superfície web × scripts de prognóstico ×
  ingestão compartilham as mesmas linhas de `match`.
- **B5 — a home continua dizendo "Premier League"** com 2 ligas no ar (`round-hub/consts.ts:3-4`). Inconsistência
  cosmética conhecida e aceita neste escopo; vira feature própria.
- **B7 — o catálogo fantasma convida ao erro.** `apps/api/src/modules/leagues/consts.ts:15-24` é o lugar mais
  óbvio para "adicionar uma liga" e manda fazer exatamente a coisa errada (id de API-Football, seed inexistente).
  *Sintoma:* uma entrada `BRA` some sem efeito — a liga real nasce do `league` upsert do sync, e `GET /v1/leagues`
  lê o banco (`list-leagues.service.ts:5-7`). *Como detectar:* diff do P4 tocando `consts.ts` = achado.
- **B8 — `?upTo=N` piora na Série A e não é consertado aqui.** `standings.service.ts:18` trata número de rodada
  como cronologia (`m.round <= N`). A investigação mediu que a Série A tem menos jogos fora de ordem que a PL
  (1,1% vs 8,2%) mas com **magnitude muito maior** (uma rodada 4 disputada depois da rodada 19, ~15 rodadas de
  deslocamento, contra ~1 na PL). *Sintoma:* "classificação no momento da partida" da Série A inclui jogo que
  cronologicamente ainda não tinha acontecido. *Como detectar:* comparar `?upTo=N` com um corte por data.
  **Fora de escopo declarado** desta feature (§Fora de escopo do Plano): o P5 preserva o comportamento atual, não
  o conserta — mas o `/i` não deve "consertar de brinde" trocando `round` por `date`, porque isso muda a saída da
  PL e quebra a metade "PL byte-a-byte" do aceite.
- **B6 — teto de 5 ligas do plano SportMonks fica zerado.** A Série A ocupa o 5º slot; Libertadores/Copa do Brasil
  exigiriam upgrade. Consequência de produto: a forma do time brasileiro nasce **cega** aos jogos continentais,
  sem sinal de "faltando", num calendário com 33,7% de jogos de meio de semana.

## Evidências

- [código] `apps/api/src/db/sync-sportmonks.ts:378-383` — `WINDOWS` no calendário inglês; prova que "trocar as 3
  constantes" perde jogos da Série A em silêncio (a armadilha central do plano).
- [código] `apps/api/src/db/sync-sportmonks.ts:451-452` — grava `starting_at` UTC cru em `date`/`time`.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:1993` — comentário declara a ordenação como regra da
  Premier League; prova que o desempate é PL-específico por design, não por acidente.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:712` — `concurrentSeasonIds` sem filtro de liga/país.
- [código] `apps/api/src/db/sync-sportmonks.ts:305-308` — demote de `isCurrent` **já escopado por liga** (o filtro
  está na `:308`); prova que
  o risco "sincar BRA derruba a season corrente da PL" **não existe**.
- [api] `GET /seasons/25184` (2026-07-19) → `starting_at: "2025-03-29"`, `ending_at: "2025-12-07"`, `finished: true`
  — prova que a `WINDOWS` derivada tem fonte real na API (o `type SmSeason` local, `sync-sportmonks.ts:85`, declara
  só `{id, name}`, mas o payload traz as datas).
- [banco] query dev 2026-07-19 (`select code, country from league`) — PL/FAC/CARA todas `England`; prova que
  agrupar por `country` preserva o LIG-011 e isola o Brasil. Re-seed gira uuids, não os códigos.
- [código] `apps/api/src/db/sync-ingest.ts:250-251` + `apps/api/src/db/sync-cup.ts:188-189` — os **outros dois**
  sítios que gravam `date`/`time` de `starting_at` cru, além do sync principal e do `sync-old-season.ts:203`.
  Prova que "dois pontos de aplicação" era falso e que o P1 tem 4 sítios + `IngestOpts` (`sync-ingest.ts:208-216`).
- [código] `apps/api/src/modules/leagues/shared/shared.ts:41-46` — `SeasonSummary` **não** tem `leagueCode`;
  prova que `seasonsOfTeam` (`shared.ts:1352-1364`) não identifica a liga do time e que o P7 precisa de helper novo.
- [código] `apps/api/src/modules/leagues/consts.ts:15-24` — `CATALOG` de API-Football, sem importador, com
  docstring mandando "adicionar a liga aqui": armadilha ativa para o `/i` (B7).
- [código] `apps/api/src/db/sync-cup.ts:23-26` — copa já é parametrizada por `process.argv` posicional; é o
  **precedente** de CLI que o P2 decide (D7) não seguir, e o registro de por quê.
- [doc] investigação do `/rs`, §4 "Opções e recomendação" (arquivo ainda não commitado, posterior ao pino) —
  opção B (corrigir base → migrar) é a recomendação cravada que este plano detalha.

## Detalhes por passo

### §Schema — expand de `league.timezone` (P1)

Aditivo puro, sem contract nesta feature. Coluna `timezone text not null default 'Europe/London'` em `league`:
o default cobre as 3 ligas inglesas já existentes sem backfill, e a linha `BRA` nasce com `America/Sao_Paulo`.
`bun run db:generate` (drizzle-kit) gera em `apps/api/src/db/migrations/` (próximo: `0036_*`), `bun run db:migrate` aplica.

Critério de avanço: `\d league` mostra a coluna e `select code, timezone from league` devolve 3 linhas `Europe/London`
**antes** de qualquer escrita de fuso.

### §Fuso — a conversão (P1)

`starting_at` chega como `"2026-01-28 21:30:00"` **em UTC**, sem sufixo `Z` — daí `slice(0,10)`/`slice(11,16)` terem
funcionado até hoje. Converter exige tratar a string como UTC explicitamente antes de mudar de fuso; concatenar `"Z"`
numa string com **espaço** no lugar do `T` produz `Invalid Date` silencioso em alguns runtimes — normalize o separador.
Alvo: `formatInTimeZone` do `date-fns-tz`, um helper único consumido pelos dois syncs.

**Duas camadas de prova, e elas NÃO podem ser a mesma** (defeito corrigido: a versão anterior asseverava o caso
BRT no P1, mas no P1 **não existe nenhuma partida brasileira no banco** — a Série A só é ingerida no P4):

*Camada 1 — função pura, provável no P1, sem banco e sem rede.* Alimente o helper com as 3 strings fixas abaixo,
no formato exato em que a SportMonks entrega (`"YYYY-MM-DD HH:mm:ss"`, UTC, **espaço** no lugar do `T`, **sem** `Z`):

| entrada (UTC cru) | fuso | `date` esperado | `time` esperado | o que o caso pega |
|---|---|---|---|---|
| `2026-01-29 00:30:00` | `America/Sao_Paulo` | `2026-01-28` | `21:30` | vira **o dia** (BRT = UTC−3, sem DST desde 2019) |
| `2025-08-16 14:00:00` | `Europe/London` | `2025-08-16` | `15:00` | BST aplicado (hoje grava `14:00` — é o bug vivo) |
| `2025-12-27 15:00:00` | `Europe/London` | `2025-12-27` | `15:00` | GMT: **inalterado**. Se mudar, é conversão dupla |

*Camada 2 — efeito no banco, provável só depois do sync correspondente rodar.* O caso BST/GMT vale para a PL
depois do re-sync do P1; o caso BRT só vale **no P4**, quando a Série A existir. Ver as Provas do P1 e do P4.

Nomes de jogo reais servem de exemplo humano, não de assert: `São Paulo vs Flamengo` (BRT) e `Brighton vs Fulham`
(BST) foram medidos na investigação, mas o `/i` não deve depender de um fixture específico estar no banco — asserte
por consulta (`select` filtrando mês/liga), não por nome de partida.

### §Display — por que `formatDate` NÃO entra

A Fase 0 da investigação pede que `formatDate` (`apps/web/features/leagues/utils/format.ts:11-14`) "deixe de
concatenar `time` cru". Com a decisão cravada de gravar no **fuso da liga**, isso está **superado**: a string
armazenada já é hora de parede local, e concatená-la verbatim passa a ser o comportamento *correto*. Nenhum passo
de `ui` para isso — e nenhuma pendência.

Consequência assumida, registrada para não virar "bug" depois: o usuário brasileiro vê o jogo da PL no **horário de
Londres**. É o preço da decisão do dono, coerente com agrupar partida por data local do estádio.

### §Testes — roteiro de browser real (chrome-devtools MCP), P8

Escada: erro/validação → variantes/bordas → golden path por último.

- **T1 (borda — liga sem zona configurada):** `navigate_page` → `/leagues/PL` · `take_snapshot`.
  Assert: legenda de zonas segue mostrando as 4 chaves europeias com cor; **nenhuma** rótulo CONMEBOL vazou pra PL.
- **T2 (erro — zona desconhecida não quebra):** `navigate_page` → `/leagues/BRA` · `take_snapshot`.
  Assert: nenhuma linha da tabela renderiza sem posição; ausência de `undefined`/`NaN` no texto (o acesso a mapa de
  zona é indexado por string e `noUncheckedIndexedAccess` está ligado).
- **T3 (variante — página do time):** `click` num clube em zona de Libertadores → `/teams/<slug>`.
  Assert: o bloco de classificação mostra o rótulo CONMEBOL correspondente, não um espaço em branco.
- **T4 (variante — página da partida):** abrir uma partida da Série A. Assert: o número da posição aparece colorido
  pela zona (não na cor default).
- **T5 (golden path):** `/leagues/BRA` com a tabela completa. Assert: 20 clubes; as 4 zonas CONMEBOL + rebaixamento
  com cor e legenda; a ordem bate com a §Desempate.
- **Fechamento obrigatório:** `list_console_messages` sem erro novo + `list_network_requests` sem falha.
- **Bloqueio conhecido:** o MCP não atacha com o Chrome do dono aberto ([[chrome-devtools-profile-travado]]) e o
  app exige Clerk (o LIG-011 ficou com prova visual pendente por isso). Se não atachar: **declarar explicitamente**,
  nunca afirmar que a UI funciona.

### §Desempate — a regra da Série A (P5)

REC da CBF, Art. 15: **vitórias → saldo → gols pró → confronto direto → menos vermelhos → menos amarelos → sorteio**.
Com 3+ clubes empatados o confronto direto não entra (§2º).

Escopo deste passo: **os 3 primeiros critérios** (vitórias, saldo, gols pró), que é o que os dados agregados da tabela
sustentam. Confronto direto e disciplina exigem cruzar partidas/cartões e ficam **declaradamente de fora** — o
desempate cai no nome do clube como hoje, comportamento idêntico ao atual a partir do 4º critério.

Forma: a regra vira dado por liga (a Série A ordena vitórias antes do saldo; a PL não), não um `if (code === "BRA")`
espalhado. A PL **precisa** continuar com a ordenação atual byte-a-byte.

### §Derivação — de que liga é este time / este jogador? (P7)

Correção de uma afirmação anterior deste dossiê e do P7: _"`seasonsOfTeam` já entrega isso de graça"_ é **falso**.
`seasonsOfTeam` (`shared.ts:1352-1364`) de fato faz `innerJoin(standing, …)` e ordena por `startYear` desc — mas o
que ele **projeta** é `SeasonSummary` (`shared.ts:41-46`), que é exatamente:

```ts
export type SeasonSummary = { sportmonksSeasonId: number; name: string; startYear: number; isCurrent: boolean }
```

**Não há `leagueCode` nenhum na saída.** A primeira linha não diz de que liga é. Nem `team` nem `player` carregam
`leagueCode` — a coluna só existe em `season`, `match` e `standing` (`schemas/leagues.ts:29`, `:82`, `:143`).

Contrato da derivação, para o `/i` não re-decidir:

- **Time** — `leagueCodeOfTeam(teamId): Promise<string | null>`. Fonte: `standing` → `season`, ordenado por
  `season.startYear` desc, primeira linha, devolve `season.leagueCode`. Justificativa de por que só isso basta:
  **copa não gera linha de `standing`** — o `sync-cup.ts` monta os times a partir de `participants`, não de
  standings (docstring `sync-cup.ts:15-17`), e o banco confirma (40 linhas de `standing` = 2 seasons × 20, só PL).
  Logo o filtro por `league.type` é redundante neste caminho; **não** o adicione "por segurança" — ele custaria um
  join a mais sem mudar resultado.
  *Alternativa descartada:* ampliar `SeasonSummary` com `leagueCode` para reaproveitar `seasonsOfTeam`. É campo
  aditivo num tipo **serializado no contrato da resposta** de `GET /v1/teams/:slug` (`get-team.service.ts:24` →
  `seasons`), então mudaria a resposta da PL e violaria a metade "byte-a-byte" do aceite. Helper separado é mais barato.
- **Jogador** — `leagueCodeOfPlayer(playerId): Promise<string | null>`. Fonte: `lineup_player` → `lineup` →
  `match` → `league`, filtrando `league.type = 'league'`, ordenado por `match.date` desc, primeira linha, devolve
  `match.leagueCode`. Aqui o filtro por `type` **é obrigatório**: escalação de copa existe (FA Cup/Carabao estão
  ingeridas com lineup no passo "rico" do `sync-cup.ts`), então sem o filtro um jogador do Arsenal pode resolver
  para `FAC`. Usar `match.date` (e não `startYear`) porque é o único critério que responde "onde ele joga HOJE" (D6).
- **Fallback**: derivação `null` (time/jogador sem nenhuma aparição) → manter o comportamento atual, `"PL"`, e
  **não** lançar. Trocar um 200 por um 404 aqui regride a PL.
- Os dois helpers moram em `shared/shared.ts` (transversais a 2+ operações, regra do CLAUDE.md), não duplicados
  nos services.

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-012-ingestao-serie-a-brasileirao.md](../features/ligas/LIG-012-ingestao-serie-a-brasileirao.md) — os passos NÃO são duplicados aqui.
