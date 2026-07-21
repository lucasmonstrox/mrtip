# Critério de desempate por temporada — ingerir, modelar e exibir

**Feature:** [LIG-017](../features/ligas/LIG-017-criterio-de-desempate-por-temporada.md) · **As-of:** 2026-07-20
· Todo `arquivo:linha` deste doc foi lido nesta sessão, na árvore de trabalho atual (`main`, WIP não-commitado).

## TL;DR — recomendação cravada

Guardar **uma coluna** `season.tiebreaker_rule_id` (integer, nullable), preenchida no sync a partir do campo
homônimo que a SportMonks publica por temporada. **Não** guardar o nome da regra: o nome que a API devolve é
comprovadamente enganoso (o tipo `171` se chama "Goal Difference, **Matches Played**, Goals Scored", e o
regulamento real da Premier League 24/25 não tem "matches played"). O princípio que organiza tudo:
**a SportMonks fornece o seletor** (qual regra vale nesta temporada), **o código fornece a semântica**
(o que aquela regra significa), num mapa curado `rule_id → lista ordenada de critérios`, cada entrada escrita
à mão contra o regulamento.

`tiebreakOf` deixa de receber `code: string` e passa a receber a temporada resolvida, devolvendo
`{ criteria, source, label }` — com `source` dizendo se a regra veio do dado ingerido, de um override local ou
do default. O critério aplicado é publicado como campo **aditivo** em `GET /v1/leagues/:code` (que já é
season-aware e **já é buscado** pela mesma tela que desenha a tabela), **não** num envelope quebrante em
`/standings`. Na UI, ele entra na faixa de legenda que já existe sob a tabela, no padrão do SofaScore.

O trabalho é **não-regressivo por construção** para todo dado ingerido hoje: os 4 tipos que existem na
assinatura colapsam exatamente nos 2 comparadores que já rodam. O ganho real é (a) matar o hardcode por
liga, (b) proveniência exibível, (c) liga nova entrar por sync em vez de deploy — e (d), de quebra, corrigir
**três** cópias soltas do desempate da Premier League que hoje ordenam o Brasileirão errado, uma delas dentro
do prompt que alimenta a LLM.

---

## Contexto e problema

O pedido do dono: *"quero que feede o banco e organize pra ter o tiebreak aqui... organizar de um jeito mais
bonito que esse número aí que não significa nada... preciso de pôr lá na tabela da classificação"*.

Três coisas, então: **ingerir**, **modelar legível** e **exibir**.

**Requisitos implícitos do repo assumidos nesta investigação** (o pedido não os falou; o projeto exige):
- Todo dado que sustenta leitura de aposta precisa de **proveniência** — a UI tem que poder dizer de onde veio
  a regra, e quando não sabe, dizer que não sabe em vez de inventar um default silencioso.
- Código/dado em inglês, string de UI em português.
- Não re-decidir o que `docs/arquitetura/` já cravou (regra de altitude do `/rs`).

### Reconciliação obrigatória com a decisão D10 do LIG-012

Esta feature parece contradizer uma decisão já cravada, então isso precisa ficar explícito. O LIG-012 decidiu
(`docs/features/ligas/LIG-012-ingestao-serie-a-brasileirao.md:160-163`) que "o desempate por liga mora num
const map em `shared/shared.ts`, chaveado por `league.code`, não numa coluna de `league`", com dois drivers:

1. *"manter o P5 `api` puro (coluna exigiria expand/migrate que o plano não tem)"* — driver de **escopo**,
   local àquele passo, não princípio permanente.
2. *"é regra de negócio, não configuração do dono"* — driver de **princípio**, e era sobre uma hipotética
   coluna `league.tiebreak` que o dono editaria à mão.

**Esta proposta não contradiz o driver 2 — ela o respeita.** O que vai pro banco não é a regra configurável
pelo dono; é o **fato ingerido** de qual regra a fonte diz que vale naquela temporada. A *semântica* continua
sendo regra de negócio e continua morando em código, exatamente onde o D10 a pôs. O driver 1 era escopo do
passo, e uma feature nova não fica presa a ele.

O que a evidência nova **de fato** derruba do D10 é o *chaveamento por liga*: a regra varia entre temporadas da
mesma liga, e um `Record<string, …>` por `league.code` não consegue expressar isso.

---

## Estado real no código

### O que já existe e funciona (não é greenfield)

O desempate por liga **já foi implementado** no LIG-012. Quem chegar aqui achando que vai construir do zero
vai duplicar trabalho.

| Onde | O quê | Status |
|---|---|---|
| `apps/api/src/modules/leagues/shared/shared.ts:2064` | `type TiebreakCriterion = "points" \| "wins" \| "goalDifference" \| "goalsFor"` | real |
| `shared.ts:2069-2074` | `TIEBREAK_VALUE` — um extrator escalar por critério | real |
| `shared.ts:2078` | `PREMIER_LEAGUE_TIEBREAK` = `["points", "goalDifference", "goalsFor"]` | real |
| `shared.ts:2083-2085` | `TIEBREAK_BY_LEAGUE` — mapa por `league.code`, **uma** entrada (`BRA`) | real |
| `shared.ts:2088-2090` | `tiebreakOf(code)` → liga não listada cai no default da PL | real |
| `shared.ts:2096` | `computeStandings(matches, tiebreak)` — recebe a lista, não a deduz | real |
| `shared.ts:2140-2147` | o sort: itera os critérios, empate total cai em `localeCompare` do nome | real |
| `apps/api/scripts/_check-standings-order.ts` | arnês de prova do desempate, **11/11 verde** (rodado nesta sessão) | real |

Ou seja: **a "lista ordenada de critérios" que eu ia propor como modelo já é o modelo em produção.** A
decisão de modelagem que sobra não é "enum vs lista" — é *de onde vem a seleção da lista*.

### O que está quebrado ou faltando

**1. O chaveamento é por liga, e a regra é por temporada.** `standings.service.ts:14` já resolve a temporada
(`resolveSeason`), e a linha seguinte joga essa informação fora, chamando `tiebreakOf(code)` com o código da
liga (`standings.service.ts:17`). A informação certa já está em escopo, uma linha acima. Virar season-aware é
troca de argumento, não refatoração.

**2. Três cópias soltas do desempate da PL, fora do `computeStandings`.** Esta é a descoberta mais séria da
investigação, porque duas delas alimentam o **prognóstico**, não a tela:

| Sítio | O que ordena | Impacto |
|---|---|---|
| `apps/api/scripts/prognosis-prompt.ts:938` | tabela pré-jogo (`preMatchTable`), usada pra contar vagas de zona | Brasileirão mal-ordenado no prompt da LLM |
| `apps/api/scripts/prognosis-prompt.ts:1358-1367` | `standingsAsOf` — rotula "REBAIX."/"salvo"/"briga-Z" e detecta adversário top-6 | idem, e estruturalmente mais usada que a de cima |
| `apps/api/scripts/stakes-rounds.ts:60` | tabela pré-rodada do script de stakes | idem |

O detalhe que fecha o argumento: `prognosis-prompt.ts:1372-1373` mostra que o autor **já enfrentou esse exato
problema** para o número de vagas — *"hardcodar a regra da PL rotulava time brasileiro na briga como
decidido"* — e corrigiu as vagas por liga. Mas a **ordenação** logo acima, na `:1367`, ficou PL-only. Meio
bug corrigido.

**3. A `season` não tem onde guardar.** `apps/api/src/db/schemas/leagues.ts:29-39`: `id`,
`sportmonksSeasonId`, `leagueCode`, `name`, `startYear`, `isCurrent`, `createdAt`. Nada de desempate.

**4. A UI não mostra nada.** `standings-table.tsx:143-152` tem a faixa de legenda (só zonas de
classificação); `:59-70` define os cabeçalhos `J V E D GP GC SG Pts`. Não há nenhum texto de regra.
Bônus de dívida: `use-standings-query.ts:6` ainda documenta a rota como *"Computed standings of a league
(official PL rule)"* — comentário defasado desde o LIG-012.

**5. Quatro sítios fazem upsert de `season`** — `sync-sportmonks.ts:355`, `sync-cup.ts:89`,
`scripts/sync-old-season.ts:118`, `scripts/backfill-season.ts:18`. Coluna nova escrita em menos de quatro =
temporada nasce nula dependendo do caminho de ingestão. (É a mesma lição que o LIG-012 aprendeu com
`match.date`, onde "dois pontos de aplicação" acabou sendo quatro.)

**6. `apps/api/scripts/**` não é typechecked.** `apps/api/tsconfig.json` tem
`"include": ["src/**/*.ts", "drizzle.config.ts"]` — scripts fora. E não existe `.github/workflows`. Logo,
qualquer promessa de "mudança quebrante porém tipada" vale só pro `apps/web`; nos scripts a quebra é
silenciosa e só aparece quando alguém roda o script à mão. Isso condiciona o desenho da API (ver §Opções).

### Arqueologia — o que o git e a arquitetura já dizem

- `docs/arquitetura/modelagem.md:168` traz um **`[cravado]`** que é precedente quase literal do meu caso:
  *"cobertura é por (competição, temporada), não por competição"*. Atributo que vem da API e varia por
  temporada mora na temporada. Esta proposta segue esse precedente em vez de abrir um novo.
- `modelagem.md:176` declara que o `estagio` é *"onde mora o formato"* — o que seria um argumento pra pôr o
  desempate no estágio. **A medição derruba isso na prática** (ver §Estado da arte): o campo equivalente da
  SportMonks vem `null` em 30/30 estágios, e não existe tabela `stage` no schema real (as tabelas são
  `league, season, team, venue, match, nationality, player, coach, tv_station, referee, goal, card,
  commentary`). Não há informação a perder modelando na `season`.
- O caso real que prova que o desempate importa está registrado em
  `docs/features/ligas/LIG-012-ingestao-serie-a-brasileirao.md:465` (Atlético Mineiro com 7V acima do
  Corinthians com 6V, ambos 24 pts e saldo −1) e a contraprova inglesa em `:468` (Chelsea 52pts/14V acima do
  Fulham 52pts/15V — se vitórias vazassem pra PL, o Fulham subiria). Reproduzi ambos nesta sessão rodando
  `_check-standings-order.ts` → **11/11**.

---

## Estado da arte

### A API — o que é contrato e o que é só empírico

| Claim | Confiança | Fonte |
|---|---|---|
| `tie_breaker_rule_id` é campo **documentado** da Season: *"Refers to the type of tie-breaker rule used to determine the season winner"* | verificado-fetch | [docs SportMonks — Season](https://docs.sportmonks.com/v3/endpoints-and-entities/entities/league-season-schedule-stage-and-round) (as-of 2026-07-20) |
| Nenhum include resolve esse id — a lista fechada de includes da Season é `sport league teams stages currentStage fixtures groups statistics topscorers` | verificado-fetch (a lista) / inferência (a não-existência) | idem |
| Confirmado ao vivo: `?include=tieBreakerRule` e `tiebreakerrule` → 404 *"The requested include does not exist"* | verificado-api | `GET /v3/football/seasons/25583` (2026-07-20) |
| Resolve em `GET /v3/core/types/{id}`, `model_type: "tie_breaker_rule"` — 11 tipos no catálogo | verificado-api | `/v3/core/types` varrido nesta sessão |
| **A doc erra**: o tutorial "Season standings" rotula `standing_rule_id` como *"The tiebreaker rule applied at this position"* | verificado-fetch | [tutorial](https://docs.sportmonks.com/v3/tutorials-and-guides/tutorials/standings/season-standings) |
| …mas a **referência formal** é neutra e correta: *"Refers to the standing rule related to the standing"* | verificado-fetch | [entidade Standing](https://docs.sportmonks.com/v3/endpoints-and-entities/entities/standing-and-topscorer) |
| São famílias disjuntas: `standing_rule` é **zona** (`PROMOTION`, `RELEGATION`, `CONMEBOL LIBERTADORES`…) | verificado-fetch | [types/standings](https://docs.sportmonks.com/v3/definitions/types/standings) |
| A SportMonks recomenda usar a `position` pronta, não recomputar | verificado-fetch | tutorial acima |

> **A armadilha, em uma frase:** `standing_rule_id` no standings **não é** desempate — é a zona de
> classificação. Quem seguir o tutorial da SportMonks implementa a coisa errada. O desempate mora na
> **season**, num campo de nome parecido e endpoint diferente.
>
> Nota: recomputar em vez de usar a `position` já é decisão cravada do LIG-012 e **continua certa** — o
> ramo `?upTo=N` (`standings.service.ts:19-24`) recomputa por definição e não tem `position` oficial.

### Medições próprias (verificado-api, 2026-07-20, probes em `apps/api/scripts/_probe-tiebreaker*.ts`)

- **Cobertura: 15/15 temporadas visíveis na assinatura têm o campo preenchido — zero null.** Isso é o que
  autoriza o campo a *dirigir* o comparador em vez de ser enfeite.
- **Só 4 dos 11 tipos aparecem**: `171` (6 seasons), `1526` (4), `577` (3), `573` (2).
- **Varia dentro da mesma liga**: Premier League 24/25 = `171`, 25/26 e 26/27 = `1526`; Championship idem;
  Carabao 24/25 = `171` e depois `573`.
- **Estágio é sempre null**: 30/30 estágios de todas as 6 temporadas ingeridas.

| Tipo | Nome na API | Onde aparece |
|---|---|---|
| `171` | Goal Difference, Matches Played, Goals Scored | PL 24/25, Championship 24/25, Carabao 24/25, FA Cup (todas) |
| `1526` | Goal Difference, Goals Scored | PL 25/26 e 26/27, Championship 25/26 e 26/27 |
| `577` | Points Wins Balance Scored | Brasileirão 2024, 2025, 2026 |
| `573` | None | Carabao 25/26 e 26/27 |

### O nome do tipo não é mapeável literalmente (a evidência que decide a modelagem)

O tipo `171` cita **"Matches Played"** como critério. O regulamento real da Premier League 2024/25 é
*"1) Points; 2) Goal difference; 3) Goals scored; 4) …head-to-head…"* — **sem matches played**
([Wikipedia PL 24/25](https://en.wikipedia.org/wiki/2024%E2%80%9325_Premier_League), verificado-fetch por
subagente, as-of 2026-07-20; o SofaScore da PL diz o mesmo: *"1. Goal difference 2. Goals scored 3. H2H"*).

Pior: "matches played" como critério "quanto maior melhor" — a única forma que `TIEBREAK_VALUE`
(`shared.ts:2069-2074`) sabe expressar — é semanticamente absurdo (premiaria quem jogou mais). Mapear o nome
ao pé da letra **introduziria um bug** onde hoje não há.

Do lado brasileiro, a regra da CBF é **pontos → vitórias → saldo → gols marcados** (depois confronto direto,
cartões e sorteio), triangulada por três proveniências independentes: SofaScore, Wikipédia pt
([Brasileirão 2025](https://pt.wikipedia.org/wiki/Campeonato_Brasileiro_de_Futebol_de_2025_-_S%C3%A9rie_A),
verificado-fetch por subagente) e o próprio nome do tipo `577`. Bate exatamente com o override que já roda.

### As 6 regras de confronto direto — e por que elas não entram no escopo agora

Investigadas a fundo porque eram a pergunta central do brief. Conclusão que **corrige** minha premissa
inicial: confronto direto **é** implementável — a "mini-tabela entre os empatados" está em texto literal de
FIFA (*"criteria a) to c) above are applied to the matches between the remaining teams only"*, Art. 13 do
[regulamento da Copa 2026](https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf),
verificado-fetch) e de UEFA. O resíduo genuinamente não-computável é sempre só o **último** critério da
cascata (coeficiente UEFA, ranking FIFA, sorteio).

Achado contra-intuitivo: **`33094` "Uefa League Method" não tem confronto direto nenhum** — no formato de liga
única desde 2024/25, dois times empatados podem nunca ter se enfrentado, e a UEFA trocou H2H por força de
calendário. Seria a mais fácil das seis, não a mais difícil. (Art. 18,
[regulamento UCL 2025/26](https://rankinguefa.pl/wp-content/uploads/2025/06/20250301_Regulations_UCL_2025_EN.pdf)
— espelho de terceiro reproduzindo o texto oficial; `documents.uefa.com` não é fetchável por render JS. Marcado
como **single-origin**.)

**Mesmo assim, ficam fora do escopo** — e o motivo é dado, não preguiça: **nenhum dos 6 tipos H2H aparece em
nenhuma das 15 temporadas da assinatura.** Implementar comparação pareada agora seria construir para dado que
não existe. O que a modelagem precisa fazer é **não fechar a porta** e **não mentir** (ver Risco R3).

### Mercado — como os outros exibem

| Site | Mostra? | Onde | Por competição? |
|---|---|---|---|
| **SofaScore** | sim | seção "Rules and legend", na própria tela da tabela | sim |
| **Wikipedia** | sim | nota de rodapé sob a tabela + seção de prosa | sim |
| **ESPN** | não | tem glossário de colunas e zonas, mas nada de desempate | — |
| **FotMob / Flashscore / Google** | não-consegui-verificar | SPA client-side / muro de consentimento | — |

Texto literal do SofaScore no Brasileirão: *"In the event that two (or more) teams have an equal number of
points, the following rules break the tie: 1. Number of victories 2. Goal difference 3. Goals scored"* — e na
PL, *"1. Goal difference 2. Goals scored 3. H2H"*. (verificado-fetch por subagente, as-of 2026-07-20.)

**Padrão dominante:** texto estático (nunca tooltip), por competição, junto da legenda de zonas.
**O que ninguém faz:** indicar **na linha** qual critério decidiu aquele par específico. Gap real de mercado —
registrado aqui como oportunidade, fora do escopo desta feature.

---

## Opções e trade-offs

### Decisão 1 — onde persistir

| Opção | Veredito |
|---|---|
| `league.tiebreak` (coluna na liga) | **Rejeitada.** É o que o D10 vetou, e a medição prova que erra: PL muda de `171` pra `1526` entre temporadas |
| `stage.tiebreaker_rule_id` | **Rejeitada.** Não existe tabela `stage`, e o campo vem null em 30/30 estágios |
| **`season.tiebreaker_rule_id`** | **Escolhida.** Fiel à fonte, precedente cravado em `modelagem.md:168`, e a `season` já é resolvida em todo caminho de leitura |

### Decisão 2 — guardar o quê

| Opção | Veredito |
|---|---|
| Só o `type_id` cru + mapa curado no código | **Escolhida** |
| Id + **nome** da regra | **Rejeitada pelo counter-review, e ele tem razão.** Criaria duas fontes de rótulo pra mesma linha — o `label` curado (correto) e o nome cru (comprovadamente enganoso: "Matches Played"). O caminho preguiçoso — `select` direto da coluna — seria o errado, e nada no desenho impediria. Se o id for desconhecido, a UI diz "critério não disponível", que é honesto; mostrar "Goal Difference, Matches Played, Goals Scored" não é |
| Lista de critérios derivada, persistida | **Rejeitada.** Consertar um erro de interpretação viraria backfill em vez de deploy |
| Tabela de referência `tiebreaker_rule` | **Rejeitada por ora.** 11 linhas estáticas cujo conteúdo é constante de código; normalização sem ganho |

### Decisão 3 — forma da API

| Opção | Veredito |
|---|---|
| Envelope `{ rows, tiebreak }` em `/standings` | **Rejeitada** (era minha proposta inicial). Quebra `_check-standings-order.ts` e `_check-endpoints.ts`, que consomem `standings()` direto e tratam como array — e **`apps/api/scripts/**` não é typechecked** (`apps/api/tsconfig.json`), sem CI. A quebra seria silenciosa exatamente no arnês que prova esta feature |
| Endpoint novo `/standings/rule` | **Rejeitada.** Request a mais e duas resoluções de season que podem divergir |
| **Campo aditivo em `GET /v1/leagues/:code`** | **Escolhida.** `get-league.service.ts:11` já chama o mesmo `resolveSeason`, o retorno já é objeto (`:19`), e `league-detail.tsx:18` **já busca essa query** no mesmo componente que renderiza `<StandingsTable>`. Zero quebra, zero request novo |

**Verificação da premissa "mesma season"** — era o ponto frágil desta decisão. Se as duas queries resolvessem
temporadas diferentes, a tabela sairia recomputada por uma regra e rotulada por outra, e isso seria
**invisível no dado de hoje** (`171` e `1526` renderizam texto idêntico; o BRA é sempre `577`).
`use-league-query.ts:8` usa o mesmo `useSeasonParam()` de `use-standings-query.ts`, passa `?season=` na `:12`
e carrega a season na `queryKey` (`:10`); ambas caem no mesmo `resolveSeason` do lado da API. Premissa
**confirmada** — mas registrada aqui como **invariante a preservar**, não como acidente feliz: se uma das duas
deixar de ser season-aware, o rótulo do desempate passa a mentir em silêncio.

---

## Modelo de dados proposto

**Schema** — uma coluna, nullable, escrita nos **quatro** sítios de upsert de `season`:

```ts
// Regra de desempate que a SportMonks declara pra esta temporada (`season.tie_breaker_rule_id`).
// É o SELETOR da regra, não a regra: a semântica de cada id mora em TIEBREAK_BY_RULE_ID (shared.ts).
// Nullable porque temporada ingerida antes desta coluna não tem o dado. @feature LIG-017
tiebreakerRuleId: integer("tiebreaker_rule_id"),
```

**Semântica, em código** — mapa curado, cada entrada citando o regulamento:

```ts
// SportMonks fornece o seletor; aqui mora a semântica. NUNCA derivar do `name` do tipo: o 171 se chama
// "...Matches Played..." e o regulamento real da PL não tem esse critério. @feature LIG-017
const TIEBREAK_BY_RULE_ID: Record<number, TiebreakCriterion[]> = {
  171:  ["points", "goalDifference", "goalsFor"],           // PL/Championship até 24/25; FA Cup
  1526: ["points", "goalDifference", "goalsFor"],           // PL/Championship 25/26+
  577:  ["points", "wins", "goalDifference", "goalsFor"],   // CBF — vitórias antes do saldo
  573:  PREMIER_LEAGUE_TIEBREAK,                            // "None" (copa): NUNCA [] — ver R1
}
```

**Resolução** — `tiebreakOf(season)` devolve procedência junto, para a UI poder ser honesta:

```ts
type Tiebreak = {
  criteria: TiebreakCriterion[]      // nunca vazio — invariante
  source: "sportmonks" | "league-override" | "default"
  label: string | null               // null = não sabemos nomear; UI não inventa
}
```

Ordem: `tiebreakerRuleId` no mapa curado → override por liga → default da PL.

**O override mantém a entrada `BRA`** (o `TIEBREAK_BY_LEAGUE` atual, `shared.ts:2083-2085`). O counter-review
chamou isso de código morto, já que o `577` curado atende o Brasileirão pelo primeiro nível — e o argumento
tem lógica, mas perde do caso nulo: se `tiebreaker_rule_id` vier null (janela entre migração e backfill, ou um
**quinto** sítio de upsert que apareça e esqueça a coluna — o padrão "eram 2, na verdade eram 4" já mordeu
este repo uma vez), o Brasileirão cai direto no default da Premier League e **ordena errado em silêncio**,
numa tabela que alimenta decisão de aposta. Manter a entrada torna o caso nulo **correto**, não apenas
detectado depois pela asserção do R4. Custo: uma linha de mapa. É seguro barato.

---

## Plano por faceta

**dados** — coluna + migração; escrita nos 4 upserts (`sync-sportmonks.ts:355`, `sync-cup.ts:89`,
`sync-old-season.ts:118`, `backfill-season.ts:18`); backfill das 6 temporadas já ingeridas.
*Prova:* `select league_code, name, tiebreaker_rule_id from season` → 6 linhas, zero null, BRA=577.

**api** — `TIEBREAK_BY_RULE_ID` + `tiebreakOf(season)` com procedência; guarda de invariante em
`computeStandings` contra `criteria` vazio; `getLeague` devolve o `tiebreak`; **atualizar
`_check-standings-order.ts` e `_check-endpoints.ts` no mesmo passo** (não são pegos pelo typecheck).
*Prova:* `_check-standings-order.ts` continua **11/11**, agora com a regra vindo do banco.

**ia** — as três cópias soltas (`prognosis-prompt.ts:938`, `:1367`, `stakes-rounds.ts:60`) passam a usar o
desempate da temporada. A `:1367` é a que mais importa: rotula "REBAIX."/"salvo" e detecta top-6.
*Prova:* prompt gerado pra jogo do Brasileirão com par empatado mostra a ordem correta.

**ui** — segunda linha na faixa de `standings-table.tsx:143-152`: *"Em caso de empate: 1. Vitórias (V)
2. Saldo de gols (SG) 3. Gols marcados (GP)"*, amarrando cada critério à **coluna** que o usuário está
vendo (`:59-70`). `source: "default"` → texto neutro, sem afirmar regra oficial. De quebra, corrigir o
comentário defasado em `use-standings-query.ts:6`.
*Prova:* Chrome real em `/leagues/BRA` e `/leagues/PL` com textos diferentes.

---

## Riscos e gotchas

**R1 — `573 "None"` degradaria a tabela pra ordem alfabética.** `computeStandings` (`shared.ts:2140-2147`)
itera os critérios e, se a lista vier vazia, cai direto no `localeCompare` do nome — **ignorando pontos**.
"None" codificado como `[]` é a leitura literal óbvia e está errada. Hoje nenhum consumidor bate nesse caminho
(copa renderiza bracket, `league-detail.tsx:25`), mas `/standings` é rota pública sem guarda de `league.type`.
*Mitigação:* `573` → default explícito, **nunca** `[]`, mais uma invariante em `computeStandings` que rejeita
lista vazia em vez de degradar em silêncio.

**R2 — quebra silenciosa em `apps/api/scripts/**`.** Fora do `include` do `apps/api/tsconfig.json`, sem CI.
Mudar a assinatura de `tiebreakOf` não gera erro de compilação lá. *Mitigação:* os dois scripts consumidores
entram no mesmo passo; a escolha do campo aditivo (Decisão 3) já elimina a maior parte da exposição.

**R3 — a curadoria só é fiel até onde o modelo alcança.** `TiebreakCriterion` é escalar por time; confronto
direto compara pares e **não é representável**. Hoje isso não morde (PL e BRA nunca chegam ao 4º critério na
prática, e nenhuma regra H2H existe na assinatura), mas La Liga, Serie A e Bundesliga põem confronto direto
**antes** do saldo — ingerir qualquer uma delas exigiria estender `computeStandings` para comparação pareada.
*Mitigação:* declarar a limitação em código e na UI (a lista exibida é a **aplicada**, não a regra completa do
regulamento) em vez de vender fidelidade total. A pesquisa desta investigação já deixa o desenho da extensão
mapeado.

**R4 — temporada nova nasce nula se um dos 4 upserts for esquecido.** *Mitigação em duas camadas:* (a) a
entrada `BRA` fica no override, então o caso nulo continua **ordenando certo** em vez de cair no default
inglês; (b) asserção no script de prova de que nenhuma season ingerida tem `tiebreaker_rule_id` null. A
camada (a) é o que evita erro silencioso; a (b) é o que avisa que o sync regrediu.

---

## Refutado

- **"O desempate por liga precisa ser construído"** — falso. Existe e roda desde o LIG-012
  (`shared.ts:2083-2090`), com arnês de prova verde. Esta feature *substitui a fonte* da regra, não a cria.
- **"`standing_rule_id` / `include=rule` dá o desempate"** — falso, apesar de o tutorial da SportMonks dizer
  isso. Devolve zona de classificação. Medido ao vivo: só zonas (Libertadores, rebaixamento, UCL).
- **"Guardar o nome da regra ajuda a UI"** — refutado pelo counter-review. O nome cru é enganoso e vira a
  fonte errada mais fácil de puxar.
- **"Envelope em `/standings` é seguro porque o Eden tipa tudo"** — refutado. Só tipa `apps/web`;
  `apps/api/scripts` não é typechecked e não há CI.
- **"Confronto direto não é implementável a partir da lista de jogos"** — refutado por texto literal de FIFA
  e UEFA. É implementável com recursão; o resíduo externo é só o último critério de cada cascata. (Fica fora
  do escopo por ausência de dado, não por impossibilidade.)
- **"O formato mora no estágio, então o desempate também deveria"** (leitura de `modelagem.md:176`) —
  refutado empiricamente: 30/30 estágios com o campo null e nenhuma tabela `stage` no schema.

## Perguntas abertas / lacunas

1. **Decisão do dono — a linha do banco continua guardando um `577` cru.** O pedido de origem foi *"organizar
   de um jeito mais bonito que esse número aí que não significa nada"*, e a modelagem escolhida atende isso
   na **API e na UI**, não na linha: `season.tiebreaker_rule_id` segue sendo um int opaco. Foi decisão
   técnica deliberada — persistir o `name` da SportMonks seria persistir algo comprovadamente errado (ver
   Decisão 2) —, mas é a única escolha desta investigação que **diverge da leitura literal do pedido**.
   A alternativa que o satisfaria ao pé da letra é a tabela de referência `tiebreaker_rule`
   (`id → nome curado → critérios`), com FK da season: a linha vira auto-descritiva num join e o rótulo
   exibível fica no banco em vez de só no código. Descartada por ora (11 linhas estáticas cujo conteúdo é
   constante de código, mais um passo de seed no sync), **mas é veto do dono, não meu** — e é barato trocar
   antes do `/pl`.
2. **Decisão do dono:** exibir também a "cauda não aplicada" da regra (confronto direto, cartões, sorteio) em
   estilo apagado, como a Wikipédia faz? Mais completo e mais honesto, porém mais texto sob a tabela.
3. **Artigo do regulamento da CBF: NEI.** O comentário em `shared.ts:2080-2082` cita "REC da CBF, Art. 15" e
   eu **não consegui verificar** o número. O PDF oficial da CBF não renderizou (falta `poppler` nesta máquina)
   e — **snippet, não verificado-fetch** — um resultado de busca indica que a CBF
   [substituiu o RGC por um "Manual de Competições"](https://www.cbf.com.br/a-cbf/noticias/informes-cbf/a/cbf-divulga-manual-de-competicoes-documento-que-substituira-o-regulamento-geral-das-competicoes)
   (título do resultado; a página não foi aberta nesta sessão e o verificador de citações também não
   conseguiu resolvê-la). Se procede, a citação do código aponta pra documento renomeado. A **ordem** dos
   critérios está triangulada por três fontes; só o número do artigo fica sem confirmação.
4. **A que liga o tipo `141624` ("Points Halving H2H") pertence** — Bélgica e Romênia são candidatas; só a
   romena bate com o nome. Irrelevante hoje (fora da assinatura).
5. **Regras UEFA são single-origin.** `documents.uefa.com` não é fetchável (render JS); todas as citações
   UEFA vêm de espelhos que reproduzem o texto verbatim. Suficiente pra escopo futuro, insuficiente pra
   implementar sem reconfirmar.
6. **FotMob, Flashscore e o painel do Google não foram verificáveis** (SPA client-side e muro de
   consentimento). O "ninguém destaca o critério na linha" vale só pra SofaScore, ESPN e Wikipedia.
7. **`stage.tie_breaker_rule_id` pode ser populado noutras ligas** fora da assinatura. Se um dia for, a
   `season` deixa de ser granularidade suficiente. Escape declarado: coluna equivalente no estágio, quando
   houver tabela `stage`.
