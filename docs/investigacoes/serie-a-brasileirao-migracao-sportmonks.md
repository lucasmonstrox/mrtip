# Série A (Brasileirão) na SportMonks — o que existe e o que quebra ao migrar

> Investigação `/rs` de 2026-07-19 (LIG-012). Método: **sondagem ao vivo da API** (5 scripts de probe, não a doc),
> arqueologia do código com âncora `arquivo:linha` lida nesta sessão, regulamento oficial da CBF em PDF,
> e um counter-review adversarial cujos achados foram re-verificados um a um.

## TL;DR — recomendação

**Migrar a Série A é viável e o risco de DADO é praticamente zero: a cobertura da SportMonks para o Brasileirão
é paridade com a Premier League**, medida ao vivo em 12 fixtures encerradas por temporada, nas 3 temporadas de
cada liga (`statistics` ~44 types, `lineups.details` ~67, `trends` ~45, mais `periods.statistics`, `weatherReport`,
`referees`, `sidelined`, `commentaries`, `ballCoordinates`). Os mesmos 4 includes dão 403 nas duas ligas
(`xGFixture`, `odds`, `predictions`, `pressure`) — é trava de plano, não de liga. Há **3 temporadas** (2024, 2025,
2026 em curso), com standings completas.

**A única lacuna de dado que importa não é de campo, é de competição:** Libertadores, Copa do Brasil,
Sul-Americana e Série B **não estão no plano** (teto de 5 ligas, hoje zerado pela própria Série A). Na PL as
copas domésticas estão ingeridas e alimentam a forma cross-competition (LIG-011); **a Série A nasce sem esse
pedaço**, num calendário com 33,7% de jogos de meio de semana — justo onde rotação e fadiga se explicam.

**Fora isso, o custo não está no dado — está em três coisas que o código assume sobre "liga = Premier League":**

1. **Fuso** — o sync grava `starting_at` UTC cru. Na Série A isso põe **47,6% dos jogos de 2026 na data errada**.
   E não é problema novo: **a PL já está errada hoje em 41,1% dos jogos** (hora 1h adiantada, BST nunca aplicado).
2. **Desempate da tabela** — `computeStandings` usa a regra da PL (saldo antes de vitórias); o REC da CBF põe
   **vitórias em 2º**, antes do saldo. A tabela da Série A sai fora de ordem, silenciosamente.
3. **Calibração do motor** — Série A tem menos gols (2,52 vs 2,75), muito mais cartão (+24% amarelos, +87%
   vermelhos) e mando de campo bem mais forte (50% vs 43% de vitórias em casa). Há constantes de futebol
   europeu escritas à mão no prompt (`DC_RHO = -0.13`, baseline "~44%/56%").

**Recomendação de sequência:** o item 1 é **bug de produção que já existe** e deve ser corrigido *antes e
independentemente* da Série A. Os itens 2 e 3 são pré-requisito da migração. E há um argumento forte de
*timing*: o motor está no meio de uma recalibração ativa (MOD-004/008/009 em andamento, HEAD `840566f` é ajuste
de calibração) e todo o backtest filtra `leagueCode = "PL"` — trocar o insumo agora custa a capacidade de
atribuir causa aos próximos resultados. **Migrar sim; codar depois de fechar o marco de MOD-004 em curso.**

Esta feature aciona o gate que o próprio dono deixou escrito em
`docs/features/ligas/LIG-008-historico-multi-temporada.md:97`: _"Se entrar 2ª liga antes do `/i`: PARAR e generalizar."_

---

## Contexto e brief

**Pedido:** migrar a Série A na SportMonks, entendendo antes quais dados existem sobre ela.

**Perguntas do brief:** (a) a Série A está no plano? (b) que dados vêm, e com que profundidade comparada à PL?
(c) tem histórico de temporadas passadas? (d) o que no código quebra ao entrar a 2ª liga? (e) o que muda para
o motor de prognóstico?

**Requisitos implícitos assumidos** (não pedidos, mas o repo exige): fuso `America/Sao_Paulo` e datas via
`date-fns`/`date-fns-tz` (CLAUDE.md); código/dado em inglês, UI em português ([[codigo-em-ingles-ui-em-pt]]);
todo pick mostra o porquê + fontes; regulação BR de apostas (Lei 14.790) não muda por trocar de liga, mas
um produto que cobre o Brasileirão fica mais exposto ao público BR — conformidade (COMP-001) passa a valer na prática.

---

## 1. Cobertura medida ao vivo — Série A × Premier League

Método: 12 fixtures **encerradas** por temporada, espalhadas pelo calendário (amostra por passo fixo, não as
primeiras). Fixture encerrada é obrigatório — jogo não disputado devolve `statistics`/`lineups.details` vazios
e produziria falso negativo de cobertura.

| Include | SA 2024 | SA 2025 | SA 2026 | PL 25/26 |
|---|---|---|---|---|
| `statistics` | 8/12 (46 types) | 12/12 (45) | 12/12 (44) | 12/12 (44) |
| `lineups.details` | 12/12 (66) | 12/12 (72) | 12/12 (67) | 12/12 (71) |
| `trends` | 12/12 (44) | 11/12 (46) | 12/12 (45) | 12/12 (46) |
| `weatherReport` | 11/12 | 12/12 | 12/12 | 12/12 |
| `referees` | 12/12 | 12/12 | 12/12 | 12/12 |

Numa fixture única também vieram, nas duas ligas: `periods.statistics` (~82 stats por tempo), `sidelined`,
`comments`, `metadata`, `venue`, `formations`, `scores`, `coaches`, `ballCoordinates` (~1000 pontos).
`tvStations` é a **única assimetria real**: SA=1 emissora, PL=623 — sinal de "jogo televisado" fica inútil no BR.

**403 idênticos nas duas ligas:** `xGFixture`, `odds`, `predictions`, `pressure`. Trava de plano, confirmando o
que [[sportmonks-inventario-completo]] já registrava — migrar de liga não destrava nem piora nada aqui.

### O que exatamente falta — diff definitivo

União de type_ids sobre 12 fixtures encerradas de cada liga (Série A 2025 × PL 25/26, as duas temporadas completas):

| | Série A | Premier League | só na PL | só na Série A |
|---|---|---|---|---|
| `statistics` (time) | **45 types** | 44 types | **nenhum** | 85 Yellowred Cards |
| `lineups.details` (jogador) | **72 types** | 71 types | 582 Clearance Offline · 1490 Man of Match | 85 Yellowred Cards · 112 Penalties Missed · 113 Penalties Saved |

**Não falta nada estrutural.** A Série A tem *mais* types que a PL nas duas camadas. Os dois que aparecem "só na
PL" são **esparsos nas duas ligas** — sondando 20 fixtures por temporada: MOTM (1490) sai 1/20 na PL, 2/20 na
SA 2026, 0/20 na SA 2025; Clearance Offline (582) sai 4/20 na PL e 2-4/20 na SA. Não é lacuna brasileira, é
campo raro em geral. (Achado colateral: **MOD-007 depende de MOTM** — `sync-sportmonks.ts:33` ingere `motm: 1490`
— e a base é rala **também na PL**. Vale reexaminar, mas é problema do MOD-007, não da migração.)

**Buracos reais, todos na temporada 2024:** `statistics` em 87% dos jogos (26/30) e **nota do jogador (118) em
só 11/20**. As temporadas 2025 e 2026 vêm 20/20 em rating e 100% em statistics. Conclusão: **2025 é a base limpa
de calibração**; 2024 serve para histórico e forma, não para treinar modelo.

**A lacuna que realmente pesa não é de campo, é de competição.** Libertadores, Copa do Brasil, Sul-Americana e
Série B **não estão no plano** (teto de 5 ligas, já ocupado). Um clube brasileiro joga boa parte do calendário
fora da Série A, e esses jogos são invisíveis para nós — a forma, a fadiga e a rotação ficam cegas exatamente
onde os 33,7% de jogos de meio de semana dizem que mais importam. Na PL o equivalente (FA Cup, Carabao) **está**
ingerido, e é justamente o que o LIG-011 usa. **A Série A nasce sem esse pedaço.**

**Assinatura vigente hoje** (envelope da própria API, 2026-07-19): plano **Starter/Advanced + add-on Match Facts**,
próximo ciclo 2026-08-12, rate limit **2000 req/h por entidade** (`remaining: 1996` no momento da sondagem).
São **5 ligas no teto**, e hoje já se usam 4 inglesas (PL 8, Championship 9, FA Cup 24, Carabao 27) — **a Série A
ocupa o 5º e último slot**. Copa do Brasil e Libertadores exigem upgrade.

### Histórico de temporadas

| Série A (648) | id | estado | | Premier League (8) | id |
|---|---|---|---|---|---|
| 2024 | 23265 | encerrada | | 2024/2025 | 23614 |
| 2025 | 25184 | encerrada | | 2025/2026 | 25583 |
| 2026 | 26763 | **em curso** (182/380 FT) | | 2026/2027 | 28083 |

Mesma profundidade das duas. Standings completas nas 3 (Botafogo 79pts em 2024, Flamengo 79pts em 2025,
Palmeiras líder com 41 em 2026 — bate com a realidade, o dado é real). Stage único "Regular Season", 38 rodadas,
20 times. Zonas: `CONMEBOL_LIBERTADORES`, `CONMEBOL_LIBERTADORES_QUALIFIERS`, `CONMEBOL_SUDAMERICANA`, `RELEGATION`.

### O calendário é estruturalmente diferente

| | Série A 2026 | Série A 2025 | PL 25/26 |
|---|---|---|---|
| janela | 28/jan → 02/dez | mar → dez | ago → mai |
| jogos de meio de semana | **33,7%** | 23,4% | **15,0%** |

Junho de 2026 vem **vazio**: a rodada 18 foi em 30-31/05 e a 19 só em 22/07 — ~7,5 semanas de hiato
([Tabela Básica CBF](https://stcbfsiteprdimgbrs.blob.core.windows.net/img-site/cdn/Tabela_BA_sica_Brasileiro_SA_rie_A_2026_d64996b4d8.pdf), as-of 2025-12-15).
O PDF da CBF **não declara o motivo**; a atribuição à Copa do Mundo 2026 vem de fonte secundária (Wikipédia) —
registro como provável, não como fato. 2026 é portanto um calendário comprimido e atípico: começou em janeiro
para compensar, e a densidade de meio de semana (2,2× a da PL) é maior que a da própria Série A 2025.

Isso é insumo direto, não trivialidade: alimenta [[teoria-ressaca-meio-de-semana]] (SIN-008) e a densidade de
calendário (MOD-009) — sinais que na PL têm pouca amostra e na Série A passam a ter muita.

### Regras oficiais (fonte primária: REC da CBF)

Do [Regulamento Específico da Competição, Série A 2026](https://stcbfsiteprdimgbrs.blob.core.windows.net/img-site/cdn/REC_Brasileiro_SA_rie_A_2026_v15_12_2025_final_02692c1077.pdf) (as-of 2025-12-15):

- **Desempate (Art. 15):** vitórias → saldo → gols pró → confronto direto → menos vermelhos → menos amarelos → sorteio.
  Com 3+ clubes empatados, o confronto direto não entra (§2º).
- **Formato (Art. 3/14):** 20 clubes, turno e returno, 38 rodadas, 380 jogos.
- **Vagas (Art. 6/7/8):** 4 rebaixados; Libertadores 1º-4º na fase de grupos e 5º na preliminar; Sul-Americana
  para os 6 seguintes. Casa exatamente com as 4 zonas que a API devolve.

### Diferenças estatísticas que atingem o motor

| Métrica | Série A | Premier League | Δ |
|---|---|---|---|
| Gols/jogo | 2,52 (2025) | 2,75 (25/26) | −8% |
| Vitórias do mandante | **50%** (2025) | 43% (25/26) | +7 p.p. |
| Amarelos/jogo | 5,40 (2023) | 4,37 (23/24) | +24% |
| Vermelhos/jogo | 0,28 (2023) | 0,15 (23/24) | +87% |

Gols e mando: [ogol Série A 2025](https://www.ogol.com.br/edicao/brasileirao-serie-a-2025/194851/estatisticas) e
[ogol PL 2025/26](https://www.ogol.com.br/edicao/premier-league-2025-26/202015/estatisticas) (as-of 2026-07-19,
`verificado-fetch`, mesma janela nos dois lados). Cartões: [Placar](https://placar.com.br/brasileirao/brasileirao-tem-media-de-cartoes-superior-as-ligas-europeias/)
(as-of 2024-07-22) — **temporadas de referência diferentes (2023 vs 2023/24) e fonte secundária**; direção é
confiável, magnitude é `snippet`, não `verificado-fetch`.

---

## 2. Estado real no código — o que quebra

Todas as linhas abaixo foram lidas **nesta sessão**. Classificação: **QUEBRA** = produz dado/tela errada;
**RISCO** = degrada em silêncio; **OK** = já agnóstico.

### QUEBRA — fuso horário (o mais grave, e já ativo em produção)

| Onde | O quê |
|---|---|
| `apps/api/src/db/sync-sportmonks.ts:451-452` | `date: f.starting_at.slice(0, 10)` e a linha seguinte de `time` gravam a string **UTC crua**, sem conversão |
| `apps/web/features/leagues/utils/format.ts:11-14` | `formatDate` faz `parse(day,"yyyy-MM-dd")` local e concatena `time` verbatim — propaga sem corrigir |

Medido ao vivo:

- **Série A 2026: 181 de 380 jogos (47,6%) entrariam com a DATA errada.** `São Paulo vs Flamengo` gravaria
  `2026-01-29 00:30` quando o jogo é 28/jan 21:30 BRT. Série A 2025: 17,6%.
- **Premier League 25/26: 156 de 380 jogos (41,1%) já estão com a HORA errada hoje** — BST nunca aplicado.
  `Brighton vs Fulham` grava `14:00`, o jogo foi 15:00 de Londres.

Ou seja, **isto não é um custo da migração** — é bug existente que a Série A escala de "hora errada" (discreto,
ninguém notou) para "data errada" (quase metade da temporada no dia errado). Quebra em cascata tudo ancorado em
data: rest days (LIG-005), densidade de calendário (MOD-009), ressaca de meio de semana (SIN-008), agrupamento
por rodada. O CLAUDE.md já obriga `date-fns-tz` com fuso da loja — a regra existe, o sync não a aplica.
Corrigir implica **decidir conscientemente re-sincar a PL**, porque muda horários já exibidos.

### QUEBRA — classificação

| Onde | O quê |
|---|---|
| `apps/api/src/modules/leagues/shared/shared.ts:2049-2055` | a ordenação é pontos, depois `b.goalDifference - a.goalDifference`, depois gols pró, depois nome — **falta vitórias**. O comentário na linha 2001 diz literalmente "official Premier League rule" |
| `apps/api/src/modules/leagues/standings/standings.service.ts:21` | a tabela principal é a **recomputada**; a linha oficial da SportMonks só fornece o campo `zone` (`:22-27`) |
| `apps/api/src/db/sync-sportmonks.ts:206-213` | `normalizeZone` só conhece CHAMPIONS/EUROPA/CONFERENCE/RELEGATION → zonas CONMEBOL caem no `return null` |
| `apps/api/scripts/sync-old-season.ts:59-64` | cópia idêntica de `normalizeZone` — mesmo `null` ao ingerir 2024/2025 |
| `apps/web/.../standings-table.tsx:20-24`, `team-standing.tsx:6-10`, `match-detail.tsx:51-55` | três mapas `ZONE*` hardcoded com as 4 chaves europeias; zona CONMEBOL renderiza sem cor e sem legenda |

Ponto importante que o counter-review afinou: **usar a posição oficial da SportMonks não resolve sozinho**.
Existem dois caminhos — `loadTeamStanding` (`shared.ts:1278-1282`) devolve a posição oficial (usada em
`get-team.service.ts:22` e `get-match.service.ts:55-56`), enquanto `standings()` recomputa. E a visão
"classificação no momento da partida" (`?upTo=N`) **não pode** vir da posição corrente armazenada — ela tem
que ser recomputada. Logo `computeStandings` **precisa** aprender o desempate da Série A; não é opcional.

`CONMEBOL` nunca apareceu em nenhum `.ts`/`.tsx` na história do repo (`git log -S "CONMEBOL" -- "*.ts" "*.tsx"`
volta vazio) — não houve tentativa anterior de 2ª liga.

### QUEBRA — o sync é mono-liga por construção

| Onde | O quê |
|---|---|
| `apps/api/src/db/sync-sportmonks.ts:20-22` | `LEAGUE_ID = 8`, `SEASON_ID = 25583`, `CODE = "PL"` como constantes de módulo — sem CLI/env |
| `apps/api/src/db/sync-sportmonks.ts:378-383` | **`WINDOWS` hardcoded ago/2025 → jun/2026** — o calendário inglês |
| `apps/api/src/modules/leagues/get-team/get-team.service.ts:20` | `resolveSeason("PL", …)` fixo (TODO explícito em `:16-17`) |
| `apps/api/src/modules/leagues/get-player/get-player.service.ts:9` | idem (`:7`) |

O `WINDOWS` é a armadilha: `fixtures/between` tem teto de ~100 dias, então a temporada é varrida em janelas
fixas. Trocando só as 3 constantes do topo, **o sweep perde a maior parte dos jogos da Série A e "passa" sem
erro**, com base incompleta. (Eu mesmo caí nessa: o probe 3 devolveu 0 jogos por usar janela anual.)

### RISCO — degradação silenciosa

- `shared.ts:712-719` — `concurrentSeasonIds` cruza temporadas **só por `startYear`**, sem filtro de liga/país.
  **Com o alvo escolhido (Série A 2025) isso deixa de ser hipótese e vira certeza no dia 1:** o banco hoje já
  tem PL 2025/2026, FA Cup 2025/2026 e Carabao 2025/2026, todas com `start_year = 2025` — a Série A 2025 entra
  na mesma "campanha" que as três competições inglesas. Para os totais agregados é inofensivo (time brasileiro
  não tem jogo na FA Cup), mas **quebra em transferência**: jogador que atuou na PL e migrou para clube
  brasileiro no mesmo ano soma as duas ligas na mesma campanha. Promovido de RISCO a **pré-requisito da Fase 1**.
- `shared.ts:709-711` + `sync-sportmonks.ts:294` — `startYear = Number(name.slice(0,4))` funciona nos dois
  formatos ("2026"→2026, "2025/2026"→2025), mas as escalas ficam **incomparáveis**: a Série A 2026 é
  contemporânea da PL 2025/26 (`startYear` 2025), não da 2026/27.
- `standings.service.ts:18` — `?upTo=N` filtra `m.round <= N` tratando número de rodada como cronologia.
- `shared.ts:1339-1356` — a forma do time é definida só por `concurrentSeasonIds`; **Libertadores e Copa do
  Brasil não existem no plano**, então somem da forma **sem sinal de "faltando"**. Em uma liga com 33,7% de
  jogos de meio de semana, é justamente o jogo que explica a rotação que fica invisível.
- `sync-sportmonks.ts:320` — `imgKey("teams", t.name, …)` **sem sufixo de desambiguação**, enquanto venues
  (`:404`) e players (`:516`) usam. O namespace `teams/<slug>.png` é plano e global às 5 ligas, e `slugify`
  remove acentos (`slug.ts:6-7`) → Atlético/Athletico colidem e o upload posterior **sobrescreve** o anterior.
- `apps/api/src/lib/sportmonks.ts:35` — `if (!res.ok || body.data === undefined) {` lança em qualquer não-2xx,
  **sem retry, backoff ou retomada** (o mesmo vale para `smAll` em `:53`); o envelope expõe `rate_limit` e ninguém lê.
- `apps/web/features/round-hub/consts.ts:3-4` — `LEAGUE_NAME = "Premier League"`, `SEASON = "2025/26"`; o hub
  da rodada é mock de rodada fixa.
- `apps/api/src/modules/leagues/consts.ts:15-24` — `CATALOG` com `leagueId: 39` (**API-Football, não SportMonks**)
  e season "2024/25". Sem nenhum importador: é **catálogo fantasma**, mas é o lugar "óbvio" para adicionar liga
  e induz erro.

### OK — já agnóstico (não precisa de trabalho)

- `apps/api/src/db/schemas/leagues.ts:29` — `leagueCode: text("league_code")` como FK da season para a league,
  somado a `code` PK e `startYear`: o schema **já é multi-liga**. `league.type` ("league"|"cup") veio do CUP-001.
- `apps/api/src/db/slug.ts:15-17` — `matchSlug` usa `slugify(seasonName)` sem parsear barra; "2026" gera slug válido.
- `list-leagues.service.ts:5-7` — `GET /v1/leagues` sem filtro, devolve N ligas.
- `apps/web/shared/app-shell/use-leagues-nav.ts:7-16` + `app-sidebar.tsx:117` — a navegação já itera o catálogo
  da API e monta `/leagues/${code}`: **suporta 2+ ligas sem código novo**.
- `shared.ts:684-693` — `resolveSeason` casa por `(leagueCode, sportmonksSeasonId)`; o problema é só quem passa `"PL"` fixo.
- `season-switcher.tsx:44-48` — exibe `s.name` cru, não reconstrói "YYYY/YYYY".

---

## 3. Impacto no motor de prognóstico

O motor foi calibrado em futebol inglês e tem **constantes europeias escritas à mão**, ao lado de valores que
se autoajustariam ao banco:

- `apps/api/scripts/prognosis-prompt.ts:720` — `const DC_RHO = -0.13`. ρ de Dixon-Coles é parâmetro **ajustado
  por dataset**: corrige a dependência nos placares baixos (0-0, 1-0, 0-1, 1-1) e por construção empurra empate
  e BTTS. Um ρ inglês na Série A enviesa exatamente os mercados que o produto crava.
- `apps/api/scripts/prognosis-prompt.ts:1895` — a instrução manda "partir do baseline da liga (~44% no 1ºT /
  56% no 2ºT)". Esse split é documentado no próprio repo como estrutural das **top-5 ligas europeias**. Pior,
  é incoerência interna: `leagueShare1`/`leagueBandPct` (`:872-880`) **são** computados do banco e se
  ajustariam sozinhos — o LLM recebe a curva brasileira computada e, ao lado, a âncora europeia hardcoded
  chamada de "o baseline da liga". Dois baselines contraditórios na mesma instrução.
- `apps/api/scripts/_backtest-math-vs-naive.ts:33` — o backtest filtra `eq(match.leagueCode, "PL")` no SQL.
  **Não existe baseline BR** contra o qual comparar.

Somado às diferenças medidas (menos gols, mais cartão, mando mais forte), o motor não erra "um pouco em tudo":
ele erra **direcionalmente** — subestima under, subestima cartões, subestima o mandante.

---

## 4. Opções e recomendação

| Opção | O que é | Prós | Contras |
|---|---|---|---|
| **A. Migrar já, mínimo** | trocar constantes + zonas CONMEBOL | rápido | `WINDOWS` engole metade da temporada em silêncio; tabela fora de ordem; datas erradas; motor descalibrado. **Falha silenciosa em 4 frentes** |
| **B. Corrigir base, depois migrar** | fuso + desempate + parametrização do sync como pré-requisito; migrar em seguida; recalibrar o motor com a Série A já ingerida | corrige bug que já afeta a PL hoje; a Série A entra em base sã; ordem respeita o gate do LIG-008 | mais passos antes do primeiro jogo brasileiro na tela |
| **C. Adiar tudo** | fechar MOD-004 primeiro, migrar depois | não perturba a calibração em voo | deixa 41% da PL com hora errada por mais tempo — e isso não depende da Série A |

**Recomendo B, com uma ressalva de sequência:** a correção de fuso (Fase 0) é **independente da Série A** e deve
sair já, porque é bug de produção ativo. A ingestão em si (Fases 1-2) vale esperar o marco de MOD-004 em curso,
porque trocar o insumo no meio de uma recalibração destrói a atribuição de causa — se a acurácia mudar, não se
saberá se foi o piso de 0.55 (`840566f`), a janela de dureza (MOD-008/009) ou a liga nova.

**O que o counter-review derrubou da minha recomendação inicial** (eu havia escrito "barato, baixo risco, fazer
agora"): "só trocar as constantes" era **falso** (`WINDOWS`); "usar a posição oficial" **não** dispensa corrigir
o desempate (o caminho `?upTo` obriga a recomputar); "paridade de includes" **não é a métrica certa** para um
produto pré-jogo; e "agora" é o pior momento pela calibração em voo. Tudo isso está incorporado acima.

**O que o counter-review afirmou e eu refutei:** que a medição estaria comprometida porque o trial venceu em
2026-07-12. O envelope da API hoje mostra assinatura **paga e vigente** (Starter/Advanced + Match Facts,
próximo ciclo 2026-08-12) e todas as sondagens rodaram em 2026-07-19, sob esse tier. O que sobrevive do
argumento é o teto de **5 ligas**, hoje zerado pela Série A.

---

## 5. Plano por faceta

**Fase 0 — independente da Série A (fazer já)**
- `dados` — converter `starting_at` UTC → fuso da liga antes de gravar (`date-fns-tz`), com o fuso vindo da
  `league` (nova coluna `timezone`). Re-sync da PL é consequência assumida, não regressão surpresa.
- `ui` — `formatDate` deixa de concatenar `time` cru.

**Fase 1 — generalizar (pré-requisito da migração)**
- `dados` — `syncSeason(leagueId, code, seasonId)` parametrizado, com `WINDOWS` **derivada** de
  `season.starting_at/ending_at`, não hardcoded.
- `dados` — `normalizeZone` com zonas CONMEBOL (as duas cópias: sync e `sync-old-season.ts`).
- `dados` — sufixo de desambiguação em `imgKey("teams", …)`.
- `api` — desempate por liga em `computeStandings` (vitórias antes do saldo na Série A); posição oficial para
  a tabela corrente, recompute corrigido para as visões históricas/`?upTo`.
- `api` — remover `resolveSeason("PL", …)` de `get-team`/`get-player`.
- `api` — `concurrentSeasonIds` filtrar por liga/país.
- `ui` — zonas CONMEBOL nos 3 mapas `ZONE*`.

**Fase 2 — ingerir**
- `dados` — resiliência no cliente antes do sweep pesado: backoff em 429, leitura do `rate_limit` do envelope,
  retomada. 3 seasons × 380 jogos × ~12 includes + uploads no R2 não cabem em "roda e torce".
- `dados` — ingerir 2025 (base limpa, 100% de `statistics`), depois 2024 (87%), depois 2026 em modo **incremental**
  — a temporada está viva, o sync da PL foi one-shot de temporada encerrada.

**Fase 3 — recalibrar (`ia`)**
- refitar `DC_RHO` para a Série A; trocar o baseline 44/56 hardcoded pela curva já computada do banco;
  generalizar o backtest para além de `leagueCode = "PL"` e criar baseline BR.

---

## 6. Refutado

- **"Série A tem mais jogo atrasado que a PL."** Falso na frequência: SA 2026 tem **1,1%** dos jogos fora da
  ordem de rodada; PL 25/26 tem **8,2%**. O que a Série A tem é **magnitude** — achei uma rodada 4 disputada em
  17/07/2026 com a rodada 19 já jogada (deslocamento de ~15 rodadas, contra ~1 na PL). A consequência para
  `?upTo=N` (`standings.service.ts:18`) **permanece viva** e é pior no BR: uma "tabela no momento do jogo" da
  rodada 19 incluiria uma partida que cronologicamente não tinha acontecido. Frequência refutada, risco não.
- **"A temporada 2024 tem cobertura degradada."** Era artefato de amostra pequena (4 fixtures). Com 12 espalhadas
  vem completa em `lineups.details`/`trends`/`referees`. Sobrevive só o buraco de `statistics` em 13% dos jogos.
- **"O diff de type_ids revela lacuna de cobertura no BR."** Numa fixture o diff parecia sistemático (9 types só
  na PL); sobre 4 fixtures ele encolheu e **inverteu** (a SA passou a ter `Penalties` e `Redcards` que a PL não
  tinha). São types **contingentes ao evento** — vermelho só aparece se houve vermelho. Não há lacuna.
- **"A medição saiu sob um trial expirado."** Refutado pelo envelope da API: assinatura paga e vigente.
- **"Falta MOTM na Série A (quebraria o MOD-007)."** O diff de 12 fixtures sugeriu isso, mas a sondagem de 20
  fixtures por temporada mostrou MOTM esparso **nas duas ligas** (PL 1/20, SA 2026 2/20). Não é lacuna
  brasileira — é campo raro, e o MOD-007 já vive dessa escassez na PL.

## 7. Perguntas abertas / lacunas

1. **Latência de escalação pré-jogo no BR — não medido, e é gate declarado.** Toda a cobertura foi medida em
   jogos **encerrados**; `lineups` de jogo FT sempre existe. O que decide a aposta é a escalação sair ~1h antes
   do apito, e `docs/investigacoes/dossie-por-partida-fontes-de-dados.md:101` já exige _"validar em teste real a
   acurácia de escalação do Brasileirão antes do go-live"_ (números publicados só para a Europa). **Medir na
   próxima rodada** (21-23/07/2026) antes de qualquer go-live.
2. ~~Estado atual do banco não verificado.~~ **Resolvido** (dono subiu o container, consulta em `mrtip_dev`):
   3 ligas ingeridas — PL (2024/2025 e 2025/2026, 380 partidas cada), FA Cup 2025/2026 (871) e Carabao 2025/2026
   (93). Totais: 1.724 partidas, 745 times, 3.508 jogadores, 40 linhas de `standing` (2 seasons × 20, só PL —
   copa não tem tabela). **O Championship (league 9) está no plano SportMonks mas nunca foi ingerido.** Nota de
   método: a primeira consulta devolveu tudo vazio por erro meu (o driver postgres.js retorna o array direto,
   não `{ rows }`) — "banco vazio" chegou a parecer achado e não era.
3. **Motivo do hiato de 7,5 semanas** não está no PDF da CBF; Copa do Mundo é inferência de fonte secundária.
4. **Homônimos e acentuação** entre 5 ligas (jogadores e clubes) não foram sondados além do caso de colisão de
   logo já identificado.
5. **Decisão do dono:** aceitar o re-sync da PL que a correção de fuso implica? E confirmar o sequenciamento
   (Fase 0 já, Fases 1-3 depois do marco de MOD-004).
6. **Buscas que voltaram vazias:** `git log -S "CONMEBOL"` em `.ts`/`.tsx` — zero resultados em toda a história
   (é achado, não lacuna: nunca houve 2ª liga). Não encontrei fonte primária da CBF declarando o motivo da parada.
