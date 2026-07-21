# SportMonks — inventário completo do que o plano entrega vs o que ingerimos

> Levantado em 2026-07-02 sondando a API de verdade (não a doc): dump dos 1310 `core/types`, fixture encerrado com `statistics` e `lineups.details` **sem filtro**, e teste de cada include nunca usado. **Ampliado em 2026-07-20** para cobrir os níveis de entidade além da partida (time/jogador/treinador/árbitro por season, rollup de liga, stage/round) e a superfície de ~130 endpoints — 5 sondas paralelas contra a API real.

> ⚠️ **Correção 2026-07-20 — este documento subcontava.** A sondagem original usou **1 fixture**, e types **esparsos** só aparecem na resposta quando o lance aconteceu. Refeita a medição sobre **200 jogos da PL 25/26**, a entrega real é de **74 types por jogador** (não 57) e **45 por time** (não 40). Regra que ficou: nunca enumerar a API por amostra única — o que some são justamente os eventos raros, que são os de maior valor pra aposta. Detalhe em [Correção da contagem](#correção-da-contagem-2026-07-20).

> ✅ **Plano confirmado na API em 2026-07-20: o trial VIROU ASSINATURA.** O envelope de toda resposta traz `subscription` — hoje devolve `Starter (Advanced)` + add-on `Match Facts`, próximo ciclo em 2026-08-12, 2000 req/h por entidade. Ou seja: mantivemos exatamente o acesso da sondagem original, e o Match Facts (de onde vêm os 58 stats de jogador) segue ativo. Sonda: `apps/api/scripts/_probe-catalogo.ts`.
>
> ✅ **A coluna "ingerido" foi re-verificada contra o código em 2026-07-20**, cruzando os mapas `STAT` / `TEAM_STAT` / `richInclude` (`apps/api/src/db/sync-ingest.ts`) coluna a coluna com `apps/api/src/db/schemas/leagues.ts`. Nenhum type é buscado e descartado.
>
Legenda: ✅ sincado no banco · ⚠️ temos em outra forma (derivado/nível diferente) · ❌ falta

**Como ler este doc:** a tabela logo abaixo responde "o que está implementado e o que não" pelo **nosso banco**. A seguinte (["por nível de entidade"](#inventário-por-nível-de-entidade-2026-07-20)) responde a mesma pergunta pelo lado da **API** — quais níveis de estatística existem e quantos types cada um entrega. Os `Detalhe N` abaixo abrem cada nível type a type.

⚠️ **Três denominadores diferentes convivem aqui, e cada um é de um escopo:** `28 de 45` (time por PARTIDA), `58 de 74` (jogador por PARTIDA) e `72 de 193` (ids distintos do catálogo `statistic`, com as sobreposições entre níveis já colapsadas). O terceiro **não** é a soma dos dois primeiros.

## Resumo por entidade — o mapa de uma olhada (2026-07-20)

| Entidade | Onde mora | Ingerido | O que falta |
|---|---|---|---|
| **Partida** | `match` | público, escalação confirmada, árbitro principal, placar por período, stage/leg/vencedor de copa | campo neutro (35), cores de uniforme (161/162), extra-time (2838), hashtag (613) |
| **Time por partida** | `match_team_stats` | **28 de 45** types | 17 — destaques: fouls (56), saves (57), offsides (51), injuries (87), pênaltis (47), vermelhos (83/85) |
| **Jogador por partida** | `lineup_player` | **58 de 74** types + titular/grid/papel/capitão | 16 — destaques: gols sofridos em campo (88), GK goals conceded (1535), punches (103), minutos acumulados (117172) |
| **Time por TEMPO (1ºT/2ºT)** | — | **nada** | 42 types × tempo (`periods.statistics`) — **o maior buraco aberto** |
| **Árbitro** | `referee` + `match.referee_id` | identidade do principal (nome, país, foto, nascimento) | **os 7 types do perfil de cartões** — amarelo/vermelho/2ºamarelo/pênalti com **média pronta e split casa-fora**, faltas, VAR moments, jogos. Confirmado acessível (200) |
| **Momentum por minuto** | `match_trend` | 10 types por minuto | os demais types do `trends` |
| **Eventos** | `goal`, `card` | gol (minuto, tipo, assistência) e cartão (minuto, tipo) | — |
| **Clima** | `weather` | completo | — |
| **Desfalques** | `injury` | sidelined por jogo | — |
| **Narração** | `commentary` | lance a lance | — |
| **Transmissão** | `tv_station` + `match_tv_station` | emissoras por jogo e país | — |
| **Classificação** | `standing` | tabela oficial + split casa/fora | — |
| **Estádio** | `venue` | gramado, capacidade, lat/lon | — |
| **Jogador (perfil)** | `player` | pé preferido, físico, nacionalidade | histórico de transferências/clubes |
| **Território** | — | nada | `ballCoordinates` — **1020 pontos** x,y por jogo (medido) |
| **Quant (xG / odds)** | `match_team_stats.xg` reservado, NULL | nada | xG, odds, predictions — **403 confirmado na assinatura atual**, não só no trial |

**Mudou desde o levantamento de 02/07:** entraram transmissão (W-059), árbitro do jogo (SIN-009) e +6 stats de jogador (migration 0039). A contagem do que a API entrega foi corrigida pra cima (74 jogador / 45 time) — ver [Correção da contagem](#correção-da-contagem-2026-07-20).

## Inventário por nível de entidade (2026-07-20)

A SportMonks entrega estatística em **vários níveis**, cada um com seu próprio conjunto de types. Até 2026-07-20 este doc só cobria os dois primeiros — daí a impressão de que o inventário estava completo quando não estava.

| Nível | Endpoint / include | Entrega | Ingerido? |
|---|---|---|---|
| Time por PARTIDA | `fixtures` + `include=statistics` | 45 types (volume do jogo) | ✅ **28** |
| Jogador por PARTIDA | `fixtures` + `include=lineups.details` | 74 types | ✅ **58** |
| Time por TEMPO (1ºT/2ºT) | `include=periods.statistics` | 42 types × tempo | ❌ **0** |
| **Time por SEASON** | `/teams/{id}?include=statistics.details.type&filters=teamStatisticSeasons:{id}` | **45 types**, todos objeto aninhado | ❌ **0** |

> ⚠️ Coincidência que confunde: time-por-**partida** e time-por-**season** entregam **45 types cada**, mas são **conjuntos diferentes**. O de partida é volume do jogo (chutes, passes, duelos); o de season é agregado e frequência (`goal-line`, `btts`, `half-results`, perfil de elenco). Só ~15 ids se repetem entre os dois.
| **Jogador por SEASON** | `/players/{id}?include=statistics.details.type` | **47 observados** (60 na doc) | ⚠️ derivamos do granular — **reconciliado, bate exato** |
| **Treinador por SEASON** | `/coaches/{id}?include=statistics.details.type` | **5 na season corrente** (9 na doc) | ❌ **0** |
| **Árbitro por SEASON** | `/referees/{id}?include=statistics.details.type` | **7 types**, com split casa/fora e média pronta | ❌ **0** — é o mercado de cartões |
| **Season (rollup da liga)** | `/seasons/{id}?include=statistics.type` ⚠️ | **33 types** | ❌ **0** |
| **Stage / Round** | `/statistics/stages/{id}`, `/statistics/rounds/{id}` | 25 / 23 registros | ❌ **0** |
| **Standings details** | `/standings/seasons/{id}?include=details.type` | 22 types | ⚠️ derivamos os splits |
| **Histórico por season** | `/statistics/seasons/teams/{id}` | 12 temporadas | ❌ **0** |

O nível **time-por-season** é o que mais dói faltar: **sondado nos 20 times da PL** (não só lido na doc), entrega types que são *mercado de aposta pronto* — `number-of-goals` (over 0.5→5.5 com contagem e percentual), `goal-results` (GF/GA over X), `half-results` (venceu os dois tempos, viradas), `btts`, `cleansheets`, `failed-to-score`, `scoring-minutes`, `scoring-frequency`, `most-scored-half` — a maioria **com split casa/fora**. Hoje calculamos isso na mão a partir do granular. Detalhe completo no **Detalhe 6**, abaixo.

### Catálogo `core/types` — as "centenas de métricas"

Dump completo em `apps/api/scripts/output/core-types.json` (1310 types). A quebra por `model_type` explica o volume:

| model_type | n | O que é |
|---|---|---|
| `injury_suspension` | 562 | taxonomia de lesão/suspensão (não são métricas) |
| **`statistic`** | **193** | **as métricas de verdade** — 61 offensive, 57 overall, 25 defensive, 50 sem grupo |
| `match_fact` | 167 | add-on Match Facts (que nós assinamos) |
| `standing_rule` | 105 | regras de classificação/zona |
| `metadata` | 49 | campo neutro, uniformes, escalação confirmada… |
| `sub_event` / `event` / `timeline` | 61 | eventos de jogo |
| `prediction` | 36 | previsões da própria SportMonks (bloqueado, e ver ressalva abaixo) |
| `position` / `lineup` | 30 | posições e tipos de escalação |
| `standings` / `standing_correction` | 31 | tabela e punições |
| `score` / `period` | 22 | placar e períodos — **os 14 de `score` são todos F1** |
| `tie_breaker_rule` | 11 | critérios de desempate |
| `participant_season_detail` | 8 | **100% Fórmula 1** (Engine, Chassis, Team Color/Lead/Base) — não é futebol |
| `transfer` / `fee` | 11 | transferências |
| `referee` | 4 | árbitro — 1 ingerido (SIN-009) |
| `lap` / `pitstop` / `stint` | 11 | Fórmula 1 |

**Do catálogo de 193 `statistic`, ingerimos 72** (offensive 30/61, overall 26/57, defensive 15/25). Dos 121 que faltam, o maior balde são os **49 de `stat_group=null`, que são agregados de SEASON** — granularidade diferente do nosso pipeline por partida, então a ausência é esperada, não descuido. Classificação completa em `apps/api/scripts/output/catalogo-classificado.md`.

> ⚠️ **Ruído de outros esportes: 57 types do catálogo são de Fórmula 1**, espalhados por 8 `model_type` — não só `lap`/`pitstop`/`stint`, mas **todo** o `score` (14/14), **todo** o `participant_season_detail` (8/8), e parte de `metadata` (19/49), `position` (3/25) e `stage_type` (2/5). Quem filtrar o catálogo por "model_type que parece de futebol" vai puxar lixo. Além disso, vários ids são **pares duplicados de provedores** dos quais este feed usa só um lado — a [Correção da contagem](#correção-da-contagem-2026-07-20) documenta 6 casos confirmados.

**Nota sobre `match_fact` (167):** 73 dos 167 são repetições "Last N" (5/10/15/25) de um núcleo bem menor — o volume real de conceitos distintos é bem inferior a 167.

**Nota sobre `prediction` (36):** além de bloqueado por plano, usar a previsão pronta da SportMonks conflita com a regra arquitetural do projeto (**quant-first: o número sai do nosso motor, não de um modelo de terceiro**). Se um dia liberar, é decisão deliberada, não adoção automática.

### xG — questão ENCERRADA (3 caminhos testados, todos negativos)

| Caminho | Resultado |
|---|---|
| `include=xGFixture` | **403** — "You do not have access to the 'xgfixture' include" |
| `/expected/fixtures`, `/expected/lineups` (endpoints dedicados) | **403** — add-on xG Basic/Advanced |
| Agregado de season por TIME (20 times varridos) | **ausente** — omissão silenciosa |
| Agregado de season por JOGADOR (3 jogadores, incl. Haaland) | **ausente** |
| `include=statistics` + `filters=fixtureStatisticTypes:5304,9684,9685,9686,9687,7943` | **200, 0 linhas** — o filtro não traz xG (`_probe-xg-filtro.ts`) |

O include `statistics` sem filtro devolve 38 types nessa fixture, **nenhum de xG**. Não há atalho: xG (e npxG 7943, xGA 9687, xGD 9684, xGP 9686) exige upgrade de plano. Ponto final.

### Superfície de endpoints (~130 endpoints em 30 áreas)

Usamos **7**. O que existe e nunca tocamos, com leitura de valor pra este produto:

Status **sondado na API em 2026-07-20**, não inferido:

| Área | Usamos? | Acesso | Nota |
|---|---|---|---|
| Fixtures, Standings, Commentaries, Leagues, Seasons, Schedules, Stages | ✅ | 200 | os 7 em uso |
| **Rivals** | ❌ | **200 grátis** | 🥇 rivais reais por time — **detecção automática de clássico, sem hardcode** |
| **Team of the Week** (beta) | ❌ | **200** | seleção da rodada com rating por jogador |
| **Topscorers** | ❌ | **200** | artilharia oficial pronta |
| **Statistics**: season-by-team, stage, round | ❌ | **200** | níveis de agregação novos; season-by-team dá **histórico por temporada** |
| **Standings**: corrections, live | ❌ | **200** | punição/perda de pontos; tabela ao vivo |
| **Squads, Transfers** | ❌ | **200** | elenco e histórico de clube |
| **Markets + Bookmakers** | ❌ | **200** | catálogo: **196 mercados, 142 casas** (domínio `odds`) |
| **News** (pré/pós-jogo) | ❌ | **403** | add-on News (~€99/mês) |
| **Team Rankings** (beta) | ❌ | **403** | premium separado |
| **Premium Expected Lineups** | ❌ | **403** | add-on Growth+ — é a tese do desfalque |
| **Expected (xG)** | ❌ | **403** | add-on xG Basic/Advanced |
| **Predictions** + **Odds** (pre/inplay/premium) | ❌ | **403** | os dados; o *catálogo* de mercados vem |
| Livescores, States, Types, Venues, TV Stations | ⚠️ parcial | 200 | venue e TV já vêm pelo include da fixture |

## TL;DR — o que existe e ainda não usamos, por valor de aposta

| Prioridade | O quê | Onde | Por quê |
|---|---|---|---|
| 🥇 | **Stats por tempo (1ºT/2ºT)** | `include=periods.statistics` (42 types por time por tempo) | over/under por tempo: SoT, ataques perigosos, corners, posse POR TEMPO — hoje só temos o total e o placar HT |
| 🥇 | **Perfil de cartões do árbitro** | `/referees/{id}?include=statistics.details` — **endpoint nunca chamado** | cartões médios (4.67 amarelos/jogo etc.), pênaltis, faltas, VAR moments, split casa/fora — mercado de cartões inteiro. A *identidade* do árbitro já entrou (SIN-009); falta o perfil |
| 🥈 | **stats de jogador que faltam** | `lineups.details` sem filtro (74 types; ingerimos 58) | 16 restantes — tabela abaixo + [Correção](#correção-da-contagem-2026-07-20) |
| 🥈 | **17 stats de time que já vêm de graça** | `statistics` sem filtro (45 types; ingerimos 28) | tabela completa abaixo |
| 🥉 | **Ball coordinates** | `include=ballCoordinates` (~950 pontos x,y/jogo) | posição da bola ao longo do jogo — territorialidade real |
| ✅ feito 2026-07-02 | metadata do fixture (attendance, lineup confirmed) e do player (pé preferido) | `include=metadata` | W-057 + attendance |
| ✅ feito (W-059) | TV stations | `include=tvStations.tvStation` | emissoras por jogo → `tv_station` + `match_tv_station` |
| ✅ feito (SIN-009) | Árbitro do jogo | `include=referees.referee` | árbitro principal → `referee` + `match.referee_id` |

## Fronteira de acesso — RECONFERIDA na API em 2026-07-20

Sondas: `_probe-season-liga.ts` e `_probe-endpoints-novos.ts`. 27 chamadas, **18 OK / 9 em 403**. Nenhum 403 é erro de path (todos os paths foram confirmados na doc antes) — é falta de add-on.

### ❌ Bloqueado (403, exige add-on pago)

| Endpoint / include | Mensagem | Por que importa |
|---|---|---|
| `xGFixture` | "You do not have access to the 'xgfixture' include" | o insumo quant que falta pro motor (MOD-004 é quant-first) |
| `/expected/fixtures`, `/expected/lineups` | 403 — add-on xG Basic/Advanced | endpoints dedicados de xG, idem |
| `/odds/pre-match/fixtures/{id}` | "You do not have access to this endpoint" | linha de mercado; [[W-020]] depende |
| `/predictions/probabilities/fixtures/{id}` | idem | benchmark do nosso modelo |
| `pressure` (include) | "You do not have access to the 'pressure' include" | já sabíamos: SIN-021 reconstrói dos trends |
| `/news/pre-match`, `/news/post-match` | idem — add-on News (~€99/mês) | narrativa redacional pronta |
| `/team-rankings` | idem — premium separado | ranking tipo Elo |
| `/expected-lineups/teams/{id}` | idem — add-on Growth+ | escalação PROVÁVEL, a tese do desfalque |
| xPTS em `standings.details` | ausente (types 7393 e 7939 testados, nenhum presente) | consistente com o bloqueio de Expected |

**Lista de compras, se subir de plano:** priorizar **xG Basic** e **Expected Lineups** — são os dois que alimentam direto a tese "aposta precisa de evidência" (qualidade de chance + desfalque antecipado). Odds e News vêm depois; News é conteúdo redacional, não dado estruturado.

### ✅ Liberado e NÃO usado (o dinheiro na mesa)

| Endpoint / include | Status | O que veio |
|---|---|---|
| `periods.statistics` | **200** | 36 types no 1ºT, 37 no 2ºT (a diferença é esparsa: trave só no 1º, substituições/lesões só no 2º) |
| `match-facts/{fixture_id}` (beta) | **200 — segue vivo** | 25 facts no jogo sondado, todos `basis=h2h`, categorias `statistics`/`streaks`: H2H total, streak de quem-marca-primeiro-vence, resultados históricos, vitória, derrota, cleansheet, gols sofridos, first-to-score, win streak. Confirma o add-on Match Facts ativo |
| `ballCoordinates` | **200** | **1020 pontos** de rastreamento no jogo |
| `/rivals/teams/{id}` | **200, de graça** | **rivais reais e corretos** — Man Utd↔Arsenal, Liverpool↔Man Utd, Tottenham↔Arsenal/Chelsea/West Ham. Detecção de clássico **sem hardcode** |
| `/seasons/{id}?include=statistics.type` | **200** | 33 rollups de season (⚠️ o include é `statistics.type`; `statistics.details.type` dá 404 — `SeasonStatistic` não tem `details`) |
| `/standings/seasons/{id}?include=details.type` | **200** | 22 types, 440 linhas — splits W/D/L/GF/GA overall/casa/fora + saldo + pontos. Sem xPTS |
| `/topscorers/seasons/{id}` | **200** | 25 linhas prontas (type 83 = gols) |
| `/statistics/seasons/teams/{id}` | **200** | 12 registros = **uma linha por temporada histórica do time** |
| `/statistics/stages/{id}`, `/statistics/rounds/{id}` | **200** | 25 e 23 registros — níveis de agregação novos |
| `/team-of-the-week/...` | **200** | seleção da rodada com `{player_id, fixture_id, rating, formation_position}` |
| `/squads/...`, `/transfers/teams/{id}` | **200** | elenco (34–40 jogadores) e transferências |
| `/standings/corrections/seasons/{id}` | **200** (vazio) | punição/perda de pontos — sem caso na PL 25/26, mas o canal funciona |
| `/standings/live/leagues/{id}` | **200** (vazio) | tabela ao vivo — vazio porque não havia jogo no momento |
| `/odds/markets`, `/odds/bookmakers` | **200** | **196 mercados, 142 casas** (⚠️ domínio é `odds`, não `football`) — catálogo, mesmo sem as odds |

**Rate limit:** 2000 req/h **por entidade** (não global) — Season 1992/2000, Fixture 1996/2000 etc. Folga confortável pra ingestão nova.

## Detalhe 1 — stats de TIME por partida (`include=statistics`, sem filtro)

O fixture devolve **40 types** _(corrigido: 45 em 200 jogos — faltavam 47/83/85)_; o sync grava 28 no `match_team_stats` (filtro `TEAM_STAT` em `sync-ingest.ts`).

| Status | type | Nome | Leitura |
|---|---|---|---|
| ✅ | 34 | Corners | escanteios |
| ✅ | 41 | Shots Off Target | chutes pra fora |
| ✅ | 42 | Shots Total | volume de finalização |
| ✅ | 43 | Attacks | ataques |
| ✅ | 44 | Dangerous Attacks | ataques perigosos (base do momentum) |
| ✅ | 45 | Ball Possession % | posse |
| ❌ | 46 | Ball Safe | posse "segura", controle sem risco |
| ✅ | 49 | Shots Insidebox | chutes dentro da área |
| ✅ | 50 | Shots Outsidebox | chutes de fora |
| ❌ | 51 | Offsides | linha alta do rival / afobação |
| ⚠️ | 52 | Goals | redundante — derivamos da tabela `goal` (com minuto e tipo) |
| ❌ | 53 | Goal Kicks | tiro de meta — proxy de pressão sofrida |
| ✅ | 54 | Goal Attempts | tentativas de gol |
| ✅ | 55 | Free Kicks | faltas cobradas |
| ❌ | 56 | Fouls | faltas cometidas — insumo de cartões + jogo truncado |
| ❌ | 57 | Saves | defesas do goleiro — "quanto o goleiro segurou o over" |
| ✅ | 58 | Shots Blocked | chutes bloqueados |
| ❌ | 59 | Substitutions | trocas usadas |
| ❌ | 60 | Throwins | laterais |
| ✅ | 62 | Long Passes | bolas longas |
| ✅ | 64 | Hit Woodwork | bolas na trave |
| ✅ | 65 | Successful Headers | cabeceios ganhos |
| ✅ | 78 | Tackles | desarmes |
| ⚠️ | 79 | Assists | redundante — derivamos de `goal.assistId` |
| ✅ | 80 | Passes | passes |
| ✅ | 81 | Successful Passes | passes certos |
| ✅ | 82 | Successful Passes % | precisão de passe |
| ⚠️ | 84 | Yellowcards | redundante como total — temos a tabela `card` (com minuto) |
| ✅ | 86 | Shots On Target | chutes no gol |
| ❌ | 87 | Injuries | lesões DENTRO do jogo — dureza da partida ([[W-047]]) |
| ✅ | 98 | Total Crosses | cruzamentos |
| ✅ | 99 | Accurate Crosses | cruzamentos certos |
| ✅ | 100 | Interceptions | interceptações |
| ✅ | 106 | Duels Won | duelos ganhos |
| ✅ | 108 | Dribble Attempts | dribles tentados |
| ✅ | 109 | Successful Dribbles | dribles certos |
| ❌ | 117 | Key Passes | passes-chave do TIME (temos só por jogador) |
| ✅ | 580 | Big Chances Created | grandes chances criadas |
| ✅ | 581 | Big Chances Missed | grandes chances perdidas |
| ✅ | 1605 | Successful Dribbles % | % de drible |
| ❌ | 27264 | Successful Long Passes | bolas longas certas |
| ❌ | 27265 | Successful Long Passes % | % de bola longa |

**Quick wins ❌:** 56 Fouls, 57 Saves, 51 Offsides, 87 Injuries — 1 linha cada no `TEAM_STAT`, zero requests a mais.

## Detalhe 2 — stats de JOGADOR por partida (`lineups.details`, sem filtro)

O fixture devolve **57 types por jogador** _(corrigido: são **74** medindo em 200 jogos — ver [Correção da contagem](#correção-da-contagem-2026-07-20); esta tabela cobre só o que 1 fixture mostrou)_; o sync grava **58** no `lineup_player` (52 em 2026-07-03 + 6 na 0039) — 37 adicionados em 2026-07-03. O filtro `lineupDetailTypes` foi REMOVIDO do fetch (a API limita cada filtro a 50 ids); vêm todos os types e o mapa `STAT` escolhe. Todos os agregados de season estão expostos no perfil via `PlayerDetail.stats` (cards Finalização/Criação/Construção/Defesa/Duelos/Disciplina/Goleiro); a família de chutes/duelos/percentuais está exposta no perfil do jogador via `PlayerDetail.shooting`. Cada linha de `lineups.details` pertence a um jogador identificado — qualquer type abaixo vem com o player id.

| Status | type | Nome | Leitura |
|---|---|---|---|
| ✅ | 40 | Captain | braçadeira no jogo → `lineup_player.captain` boolean (2026-07-03) |
| ✅ | 41 | Shots Off Target | chutes pra fora → `lineup_player.shots_off_target` (2026-07-03) |
| ✅ | 42 | Shots Total | denominador da conversão → `lineup_player.shots_total` (2026-07-03) |
| ✅ | 51 | Offsides | impedimentos → `lineup_player.offsides` (2026-07-03) |
| ⚠️ | 52 | Goals | redundante — derivamos de `goal.playerId` (com minuto e tipo) |
| ✅ | 56 | Fouls | faltas cometidas → `lineup_player.fouls` (2026-07-03) |
| ✅ | 57 | Saves | defesas (goleiro) → `lineup_player.saves` (2026-07-03) |
| ✅ | 58 | Shots Blocked | chutes DELE bloqueados (verificado: SoT+fora+bloqueados ≈ total; o "ele bloqueou" defensivo é o 97) → `lineup_player.shots_blocked` (2026-07-03) |
| ✅ | 78 | Tackles | desarmes |
| ⚠️ | 79 | Assists | redundante — derivamos de `goal.assistId` |
| ✅ | 80 | Passes | passes |
| ⚠️ | 84 | Yellowcards | redundante — temos a tabela `card` por jogador |
| ✅ | 86 | Shots On Target | chutes no gol |
| ❌ | 88 | Goals Conceded | gols sofridos com ele em campo |
| ✅ | 94 | Dispossessed | perdeu a bola pressionado → `lineup_player.dispossessed` (2026-07-03) |
| ✅ | 96 | Fouls Drawn | faltas sofridas (o pênalti "cavado") → `lineup_player.fouls_drawn` (2026-07-03) |
| ✅ | 97 | Blocked Shots | chutes que ELE bloqueou (defensivo; par do 58) → `lineup_player.blocked_shots` (2026-07-03) |
| ✅ | 98 | Total Crosses | cruzamentos |
| ✅ | 99 | Accurate Crosses | cruzamentos certos |
| ✅ | 100 | Interceptions | interceptações |
| ✅ | 101 | Clearances | cortes/afastamentos → `lineup_player.clearances` (2026-07-03) |
| ✅ | 104 | Saves Insidebox | defesas dentro da área → `lineup_player.saves_insidebox` (2026-07-03) |
| ✅ | 105 | Total Duels | duelos totais → `lineup_player.duels_total` (2026-07-03) |
| ✅ | 106 | Duels Won | duelos ganhos |
| ✅ | 107 | Aerials Won | duelos aéreos ganhos → `lineup_player.aerials_won` (2026-07-03) |
| ✅ | 108 | Dribble Attempts | dribles tentados |
| ✅ | 109 | Successful Dribbles | dribles certos |
| ✅ | 110 | Dribbled Past | driblado (sofreu o drible) |
| ✅ | 116 | Accurate Passes | passes certos → `lineup_player.passes_accurate` (2026-07-03) |
| ✅ | 117 | Key Passes | passes-chave |
| ✅ | 118 | Rating | nota |
| ✅ | 119 | Minutes Played | minutos |
| ✅ | 120 | Touches | toques na bola → `lineup_player.touches` (2026-07-03) |
| ✅ | 122 | Long Balls | bolas longas → `lineup_player.long_balls` (2026-07-03) |
| ✅ | 123 | Long Balls Won | bolas longas certas → `lineup_player.long_balls_won` (2026-07-03) |
| ✅ | 580 | Big Chances Created | grandes chances criadas POR JOGADOR → `lineup_player.big_chances_created` (2026-07-03) |
| ✅ | 581 | Big Chances Missed | grandes chances perdidas |
| ✅ | 583 | Last Man Tackle | desarme como último homem → `lineup_player.last_man_tackle` (2026-07-03) |
| ✅ | 584 | Good High Claim | saída pelo alto (goleiro) → `lineup_player.good_high_claim` (2026-07-03) |
| ✅ | 1490 | Man of the Match | MOTM |
| ✅ | 1491 | Duels Lost | duelos perdidos → `lineup_player.duels_lost` (2026-07-03) |
| ✅ | 1533 | Successful Crosses % | % de cruzamento no jogo → `lineup_player.crosses_successful_pct` (2026-07-03) |
| ❌ | 1535 | GK Goals Conceded | gols sofridos (goleiro) |
| ✅ | 1584 | Accurate Passes % | precisão de passe no jogo → `lineup_player.passes_accurate_pct` (2026-07-03) |
| ✅ | 9706 | Chances Created | chances criadas → `lineup_player.chances_created` (2026-07-03) |
| ✅ | 27266 | Aerials Lost | aéreos perdidos → `lineup_player.aerials_lost` (2026-07-03) |
| ✅ | 27267 | Tackles Won | desarmes ganhos → `lineup_player.tackles_won` (2026-07-03) |
| ✅ | 27268 | Tackles Won % | % de desarme → `lineup_player.tackles_won_pct` (2026-07-03) |
| ✅ | 27269 | Passes In Final Third | passes no terço final → `lineup_player.passes_final_third` (2026-07-03) |
| ✅ | 27270 | Long Balls Won % | % de bola longa → `lineup_player.long_balls_won_pct` (2026-07-03) |
| ✅ | 27271 | Ball Recovery | bolas recuperadas → `lineup_player.ball_recoveries` (2026-07-03) |
| ✅ | 27272 | Backward Passes | passes pra trás → `lineup_player.backward_passes` (2026-07-03) |
| ✅ | 27273 | Possession Lost | posses perdidas → `lineup_player.possession_lost` (2026-07-03) |
| ✅ | 27274 | Aerials | duelos aéreos totais → `lineup_player.aerials_total` (2026-07-03) |
| ✅ | 27275 | Aerials Won % | % aéreo → `lineup_player.aerials_won_pct` (2026-07-03) |
| ✅ | 27276 | Duels Won % | % de duelo → `lineup_player.duels_won_pct` (2026-07-03) |
| ✅ | 48997 | Error Lead To Shot | erro que virou finalização (o "frangueiro auditável") → `lineup_player.errors_lead_to_shot` (2026-07-03) |
| ❌ | 117172 | Cumulative Minutes Played | minutos ACUMULADOS na season, pronto — atalho pra [[W-004]]/[[W-016]]/[[W-050]] |

**Custo:** já vêm na MESMA resposta — é só adicionar type_ids ao filtro `lineupDetailTypes` (ou tirar o filtro) e colunas/jsonb no `lineup_player`. Zero requests a mais.

### Cruzamento com a doc oficial (2026-07-20) — e 3 lacunas que ela revelou

A página `definitions/types/statistics/fixture-statistics` lista **43 types** para `lineups.details`. Nossa medição empírica em 200 jogos achou **74**. **A doc SUBCONTA o que a API entrega** — a família 27264–27276, 48997, 9706, 583/584, 117172 e os 6 da 0039 não aparecem lá. Regra que fica: *a sondagem manda, a doc é pista.*

Mas a doc pegou 3 coisas que a nossa medição não destacou — types que ela lista no nível JOGADOR e que só temos no nível TIME (ou não temos):

| type | Nome | Situação |
|---|---|---|
| **1605** | Successful Dribbles % | ✅ temos por TIME (`match_team_stats.dribble_success`), ❌ **falta por JOGADOR** — e o par 108/109 já é ingerido, então é só somar o percentual |
| **64** | Hit Woodwork | ✅ temos por TIME, ❌ **falta por JOGADOR** — "quem carimbou a trave" é azar de finalização que regride |
| **47** | Penalties (cobrados) | ❌ falta — temos 114 (cometidos) e 115 (ganhos), mas não quem **bateu**. É o batedor designado, insumo direto de prop de gol |

Os demais da lista da doc que não ingerimos são ⚠️ redundantes: 52 goals, 79 assists, 83/84/85 cartões — todos derivados das tabelas `goal`/`card`, com minuto, que é granularidade maior. E 88 goals-conceded segue ❌ (já listado acima).

## Detalhe 3 — stats POR TEMPO (`include=periods.statistics`) 🥇 ❌

> **Reconfirmado em 2026-07-20: responde 200.** Numa fixture encerrada vieram **36 types no 1ºT e 37 no 2ºT** — menos que os 42 abaixo porque types esparsos só aparecem quando o lance existiu naquele tempo (trave só no 1º; substituições e lesões só no 2º). A união dos dois levantamentos é a lista completa.

Sondado de verdade em 2026-07-03 (4 fixtures da PL = 8 períodos): o include devolve um array `periods` (type 1 = 1st-half, 2 = 2nd-half) e, dentro de cada um, `statistics` com uma linha por (time, type) — `participant_id` + `data.value`, mesmo shape do `statistics` de jogo inteiro. São **42 types por time por tempo**. Cobertura: a maioria vem nos 2 tempos de todo jogo; os marcados *esparso* só aparecem quando o evento existiu no tempo (ex.: trave, lesão).

| type | Nome | Obs |
|---|---|---|
| 34 | Corners | sempre |
| 41 | Shots Off Target | sempre |
| 42 | Shots Total | sempre |
| 43 | Attacks | sempre |
| 44 | Dangerous Attacks | sempre |
| 45 | Ball Possession % | sempre — a posse POR TEMPO pronta (hoje derivada dos trends no MOD-004) |
| 46 | Ball Safe | quase sempre |
| 49 | Shots Insidebox | sempre |
| 50 | Shots Outsidebox | sempre |
| 51 | Offsides | esparso (só se houve) |
| 52 | Goals | sempre |
| 53 | Goal Kicks | sempre |
| 54 | Goal Attempts | quase sempre |
| 55 | Free Kicks | sempre |
| 56 | Fouls | sempre |
| 57 | Saves | sempre |
| 58 | Shots Blocked | sempre |
| 59 | Substitutions | quase sempre |
| 60 | Throwins | sempre |
| 62 | Long Passes | sempre |
| 64 | Hit Woodwork | esparso |
| 65 | Successful Headers | quase sempre |
| 78 | Tackles | sempre |
| 79 | Assists | esparso |
| 80 | Passes | sempre |
| 81 | Successful Passes | sempre |
| 82 | Successful Passes % | sempre |
| 84 | Yellowcards | quase sempre |
| 86 | Shots On Target | sempre — **o SoT por tempo do over/under por tempo** |
| 87 | Injuries | esparso — lesão naquele tempo |
| 98 | Total Crosses | sempre |
| 99 | Accurate Crosses | sempre |
| 100 | Interceptions | sempre |
| 106 | Duels Won | sempre |
| 108 | Dribble Attempts | sempre |
| 109 | Successful Dribbles | sempre |
| 117 | Key Passes | sempre |
| 580 | Big Chances Created | sempre |
| 581 | Big Chances Missed | quase sempre |
| 1605 | Successful Dribbles % | sempre |
| 27264 | Successful Long Passes | sempre |
| 27265 | Successful Long Passes % | sempre |

**Modelagem sugerida:** tabela `match_period_stats` (matchId, teamId, period 1|2, colunas ≈ as do `match_team_stats`) — o mesmo desenho da tabela de jogo inteiro com uma dimensão a mais. Alimenta: over/under por tempo, "time que desaba no 2ºT" (delta 1ºT→2ºT de SoT/ataques perigosos), ritmo por período no prognóstico. Nota: prorrogação de copa deve vir como período extra (type 3) — tratar no ingest quando copas re-syncarem.

## Detalhe 4 — árbitro (`include=referees` + `/referees/{id}?include=statistics.details`) 🥇 parcial

**Feito em SIN-009:** o include `referees.referee` entrou no `richInclude` e o **árbitro principal** virou entidade — tabela `referee` (nome, common name, país, foto, nascimento) + FK `match.referee_id`, exibido na aba Fatos. **Falta o que dá o mercado:** o endpoint `/referees/{id}?include=statistics.details` **nunca é chamado** (verificado 2026-07-20: os únicos endpoints em uso são fixtures/standings/commentaries/leagues/seasons/schedules/stages). Sem ele não há nenhuma média de cartão por árbitro no banco.

| Status | O quê | Detalhe |
|---|---|---|
| ✅ | Árbitro principal do jogo | type 6 → `referee` + `match.referee_id` (SIN-009) |
| ❌ | Assistentes / quarto árbitro | types 7/8 assistentes, 9 quarto — vêm no mesmo include, **descartados de propósito** no ingest (`sync-ingest.ts`: "ninguém lê, e guardá-los seria 3 linhas mortas por jogo") |
| ❌ | Perfil de cartões por season | os 7 types — **sondados e confirmados 200 em 2026-07-20**; shape completo, armadilhas e split casa/fora no **Detalhe 7b**, abaixo |

Ex. real (T. Robinson, 15 jogos): 4.67 amarelos/jogo, 0.2 pênaltis/jogo, 23 faltas/jogo. É o mercado de cartões inteiro: "árbitro cartoteiro + derby = over cartões" — e agora o `/rivals` fecha a outra metade dessa frase de graça.

## Detalhe 5 — outros includes/endpoints

| Status | Include/endpoint | O quê |
|---|---|---|
| ❌ | `ballCoordinates` | **1020 amostras** (timer, x, y) por jogo, medido em 2026-07-20 — territorialidade; agregar em terços antes de guardar |
| ✅ | `tvStations.tvStation` | emissoras por jogo → `tv_station` + `match_tv_station`, com países agregados (W-059) |
| ⚠️ | `participants.coaches` | técnico por include direto (hoje já vem via lineup; útil pra [[W-053]]) |
| ❌ | `transfers` / squads por season | histórico de clube — mapeado na [[W-002]] |
| ⚠️ | `topscorers` da season | artilheiros oficiais prontos (derivamos de `goal` — serviria de conferência) |
| ❌ | `match-facts/{FIXTURE_ID}` (beta) | **Sondado 2026-07-03: nosso token respondia 200.** ~300 facts/jogo (statistics/streaks/players × h2h/team), muitos com `natural_language` pronto. **Vaza xG POR JOGADOR que o `xGFixture` bloqueia** ("Cole Palmer highest average xG 0.5 last 10"), xGOT, streaks de frequência prontos ("under 3.5 em N/M", "not won 10/12"), desfalque, first-to-score. Path SEM `/fixtures/`. Candidato forte a ingest/injeção no prognóstico — **revalidar acesso, foi visto no trial** |

### Endpoints em uso (verificado no código, 2026-07-20)

| Endpoint | Onde |
|---|---|
| `/fixtures/multi/{ids}` + `richInclude` | `sync-ingest.ts:510` — o carro-chefe: escalação, stats, trends, clima, eventos, desfalque, TV, árbitro |
| `/standings/...` | `sync-sportmonks.ts:373` |
| `/commentaries/fixtures/{id}` | `sync-ingest.ts:486` |
| `/leagues/{id}`, `/seasons/{id}` | metadados da competição |
| `/schedules/seasons/{id}`, `/stages/{id}` | copa (CUP-001) |

**Nunca chamados:** `/referees/{id}`, `/topscorers`, `/transfers`, `/squads`, `/players/{id}`, `match-facts/{id}`, `/predictions`, `/odds`.

### Metadata do fixture (include=metadata)

| Status | type | O quê |
|---|---|---|
| ❌ | 35 | Neutral Venue — campo neutro (final de copa mata a leitura de mando) |
| ❌ | 36 | Kickoff side |
| ⚠️ | 159 | Formations (já temos via include `formations`) |
| ❌ | 161/162 | Cores dos uniformes |
| ✅ | 572 | Lineup Confirmed → `match.lineup_confirmed` (2026-07-02) |
| ✅ | 578 | Attendance → `match.attendance` (2026-07-02) |
| ❌ | 613 | Hashtag do jogo |
| ❌ | 2838 | Extra time flag |
| — | 567 | Pitch — **não é populado na PL** (0/50 jogos sondados) |

### Metadata do player

| Status | type | O quê |
|---|---|---|
| ✅ | 229 | Preferred Foot → `player.preferred_foot` (2026-07-02, W-057). É o ÚNICO metadata de player. |

## Baseline — o que JÁ ingerimos (visão geral)

| ✅ | Onde | O quê |
|---|---|---|
| ✅ | `match_team_stats` | 28 team stats por jogo (tabela do Detalhe 1) + `xg` reservado (NULL) |
| ✅ | `lineup_player` | 58 player stats por jogo (tabela do Detalhe 2 + os 6 da 0039) + starter/grid/role/captain |
| ✅ | `referee` + `match.referee_id` | árbitro principal do jogo, identidade (SIN-009) |
| ✅ | `tv_station` + `match_tv_station` | emissoras por jogo e país (W-059) |
| ✅ | `match_trend` | trends por minuto, 10 types (SIN-021) |
| ✅ | `weather` | clima completo por jogo (SIN-006) |
| ✅ | `goal` / `card` | eventos com jogador, minuto, tipo |
| ✅ | `injury` | sidelined/desfalques por jogo |
| ✅ | `commentary` | narração lance a lance |
| ✅ | `standing` | tabela oficial + split casa/fora |
| ✅ | `venue` | estádio com `surface`, capacidade, lat/lon |
| ✅ | `match` | attendance, lineup_confirmed (2026-07-02) |
| ✅ | `player` | preferred_foot (2026-07-02) |

## Detalhe 6 — stats de TIME por SEASON (`/teams/{id}?include=statistics.details.type`) 🥇 ❌

> Sondado em 2026-07-20 varrendo **os 20 times da PL** (season 25583), não um só — `_probe-team-season.ts` + `_probe-team-season-sweep.ts`. **200 OK**, sem 403. União de **45 type_ids**. Cobertura varia por time (PENALTIES ausente em 2/20, REDCARDS em 3/20, YELLOWRED em 10/20) — parece omissão quando o valor seria zero, não erro.

**Nada disto é ingerido.** É o nível de entidade inteiro que faltava, e é o mais alinhado a mercado de aposta do que existe na API.

⚠️ **Modelagem:** *nenhum* desses 45 vem como número simples — **todo `value` é objeto aninhado**. Ou vira `jsonb`, ou achata-se campo a campo (`count`/`average`) em colunas. Isso é decisão de desenho, não trivial.

### Os que são mercado pronto (o motivo de isto ser 🥇)

| type | Nome | Shape — o que dá de graça |
|---|---|---|
| **191** | Number of Goals | `over_0_5` … `over_5_5`, cada um com `{matches:{count,percentage}, team:{count,percentage}}` — **a linha de over/under inteira, com frequência histórica** |
| **27261** | Goal Results | `gf_over_0_5..gf_over_4_5` + `ga_over_0_5..ga_over_4_5` — over/under **separado por marcados e sofridos** |
| **192** | BTTS | `all`, `home`, `away` com `{count,percentage}` — ambas marcam, com split de mando |
| **194** | Cleansheet | `all`/`home`/`away` |
| **575** | Failed to Score | `all`/`home`/`away` |
| **27256** | Half Results | `won_both_halves`, `scored_both_halves`, `comebacks` |
| **196 / 213** | Scoring / Conceded Minutes | 6 faixas de 15min com `{count,percentage}` — **quando o time marca e quando sofre** |
| **27250** | Most Scored Half | qual tempo o time mais marca + detalhe 1ºT/2ºT |
| **27248** | Scoring Frequency | minutos médios por gol |
| **27260** | Injury Time Goals | gols nos acréscimos |

### Volume, disciplina e elenco

| type | Nome | Shape |
|---|---|---|
| 34/43/44/45/51/56 | Corners, Attacks, Dangerous Attacks, Possession, Offsides, Fouls | `count, average` |
| 47 | Penalties | `scored, missed, conversion_rate` |
| 52 | Goals | `all{count,average,first_goal}`, `home`, `away` com percentual |
| 88 | Goals Conceded | `all{count,average,first}`, `home`, `away` |
| 78 | Tackles | `count, average, tackles_per_foul, tackles_per_card` |
| 83/84/85 | Red / Yellow / Yellowred | `count, average, player_id, player_name, coach, coach_average` — **inclui cartão do TREINADOR** |
| 9683 | Fouls per Card | `fouls_per_card, cards_per_foul` |
| 1677 | Shots | `total, on_target, off_target, inside_box, outside_box, blocked, average, shot_conversion_rate_pct` |
| 27252/27253/27254 | Interception / Pass / Assist stats | médias por jogo, passes por gol, passes por chute, minutos por assistência |
| 124/125 | Through Balls (+ won) | `total` — **não existem no nível partida**, só aqui |
| 118 / 211 | Rating do time / jogador mais bem avaliado | |
| 214/215/216 / 27263 | Win / Draw / Lost / Games Played | `all`, `home`, `away` |
| 9672/9675/9677/9678/9679/27258/27249 | Altura média por setor, pé dos jogadores, mais utilizados, mais substituídos, **mais lesionados**, convocados, minutos totais | perfil de elenco |

### xG por season — **NÃO vem** (hipótese refutada)

Os 5 types de xG (**5304** expected-goals, **9684** xG difference, **9685** shooting performance, **9686** xG prevented, **9687** xG against) estão **ausentes nos 20 times**. O catálogo `core/types` os conhece, mas o feed os omite **silenciosamente** — sem 403, sem placeholder. Ou seja: é bloqueio de **assinatura**, não de include, e a ideia de que o endpoint de Teams "vazaria" o xG que o `xGFixture` nega **não se confirma**.

Este foi um dos 5 caminhos testados; o veredito consolidado está em **"xG — questão ENCERRADA"**, no topo do doc.

## Detalhe 7 — stats de JOGADOR por SEASON (`/players/{id}?include=statistics.details.type`)

> Doc lista **60 types**. Sondado em 2026-07-20 (`_probe-season-entidades.ts`) com Salah (4125), Haaland (154421) e Raya/GK (3130): **200**, 49/48/31 details, **união de 47 types**. A lista varia por posição (o goleiro puxa `SAVES`/`SAVES_INSIDE_BOX` que atacante não tem) — um zagueiro provavelmente somaria mais.

**Status honesto: ⚠️, não ❌.** A maioria nós já **derivamos** somando `lineup_player` por partida (58 stats por jogador por jogo = granularidade MAIOR que o agregado).

**⭐ Reconciliação feita, não assumida:** `KEY_PASSES` (117) do agregado pronto da API para Salah/season 25583 = **50**. Soma manual do nosso `lineup_player.key_passes` pro mesmo jogador+season = **50**. Bate exato (29 linhas de lineup, 5 com null tratado como 0). Ou seja: nossa derivação está **correta**, e o agregado da SportMonks é equivalente — só sem o custo de somar 29+ fixtures por jogador.

**xG por jogador (5304, 9685, 9706): AUSENTE** nos três, inclusive em Haaland (126 chutes, 27 gols na season). Fecha o caso: xG não vem de graça em nível nenhum.

**O que este nível tem e NÃO dá pra derivar do nosso granular:**

| type | Nome | Por que não derivamos |
|---|---|---|
| **5304** | Expected Goals (season) | xG por jogador — não temos em nenhum nível |
| **323** | Bench | quantas vezes começou no banco — temos `starter`, mas só de jogos com escalação ingerida |
| **321 / 322** | Appearances / Lineups | idem — nosso denominador é o que sincamos, o oficial é o da liga |
| **9676** | Average Points per Game | pontos do time nos jogos em que ELE atuou — proxy de impacto |
| **214/215/216** | Win / Draw / Lost | vitórias/empates/derrotas **com ele em campo** |
| **194** | Cleansheets | jogos sem sofrer gol com ele em campo |
| **27259** | Hattricks | |
| **324** | Own Goals | |
| **87** | Injuries | lesões na season |
| **27255** | Crosses Blocked | |

Os types 214/215/216 + 194 + 9676 juntos formam um **"impacto do jogador no resultado"** pronto — exatamente o insumo da tese do desfalque ([[prognostico-ajustado-por-desfalque]]), sem precisar computar na mão.

## Detalhe 7b — ÁRBITRO por season (`/referees/{id}?include=statistics.details.type`) 🥇 ❌

> Sondado em 2026-07-20 com 3 árbitros (Daronco, Paul Tierney, Rodrigo José Pereira de Lima), 9 season-records. **200, sem 403.** É o mercado de cartões inteiro, e é acessível hoje.

**Exatamente 7 types** — bate com a doc, nem um a mais:

| type | Nome | Shape do `value` |
|---|---|---|
| **84** | Yellowcards | `all{count, average, on_bench, for_coach, on_pitch}` + `home{count,average,percentage}` + `away{...}` |
| **83** | Redcards | idem |
| **85** | Yellowred Cards | idem |
| **47** | Penalties | idem |
| **56** | Fouls | `{count, average}` — **sem** split casa/fora |
| **314** | VAR Moments | `{count, average}` — sem split |
| **188** | Matches | `{count}` |

**Três coisas que fazem isso valer:**

1. **A média já vem calculada.** Ex.: Daronco season 26763 → `YELLOWCARDS.all.average = 5.67` cartões/jogo. Não precisa dividir por `MATCHES`.
2. **Split casa/fora existe** — mas **não** no `stat_group` do type (esse é estático: offensive/defensive/overall). Está **dentro do shape do `value`**, nos blocos `home`/`away` com `percentage`. Quem for modelar precisa saber disso.
3. **`on_bench` / `for_coach` / `on_pitch`**: cartão dado a quem está no banco, ao próprio treinador, ou em campo. Separa "árbitro que cartoteia o banco" de "que cartoteia o jogo".

⚠️ **Armadilhas registradas:**
- **Schema evoluiu:** seasons antigas (2020) não têm `on_bench`/`for_coach`/`on_pitch` — tratar como opcionais.
- **`FOULS` não tem `average` pronto** (diferente dos cartões) — é `FOULS.count / MATCHES.count` na mão.
- **`refereeStatisticSeasons` é competição-aware:** filtrar árbitro brasileiro por season da PL devolve vazio (nunca apitou lá) — é filtro real, não no-op. Sem filtro, vem a **carreira inteira multi-competição**.
- **O mesmo `type_id` muda de shape entre modelos:** o 47 (PENALTIES) no árbitro é `{all,home,away}`; no jogador é `{total,won,scored,committed,saved,missed}`. **Não dá pra escrever um decoder por `type_id` sozinho** — precisa saber o modelo de origem.

## Detalhe 7c — TREINADOR por season (`/coaches/{id}?include=statistics.details.type`)

> Sondado com 3 treinadores ativos + carreira inteira do Arteta (6 seasons). **200.**

**Só 5 dos 9 types documentados aparecem na season corrente:** `YELLOWCARDS`(84), `MATCHES`(188), `WIN`(214), `DRAW`(215), `LOST`(216). Shape sempre `{count}` ou `{count, average}` — nunca o `{total}` que o jogador usa pro mesmo conceito.

`SUBSTITUTIONS`(59) aparece em 2 das 6 seasons da carreira, com `{count:23, average:4.6}` — **subs por jogo pronto**. Já `REDCARDS`(83), `YELLOWRED`(85) e `AVERAGE_POINTS_PER_GAME`(9676) não apareceram em nenhuma das 6 — registrar como **"não observado nesta amostra"**, não como "não existe" (a lição da [Correção da contagem](#correção-da-contagem-2026-07-20)).

🚨 **Pegadinha que custa tempo:** `team.coaches[].id` é o id da **relação** time↔treinador, **não** o id do treinador. `/coaches/{id}` espera `team.coaches[].coach_id`. Usar o errado devolve **200** com `"No result(s) found matching your request"` no body — parece 404, mas não é.

## Detalhe 8 — SEASON, STANDINGS, TOPSCORERS e os endpoints de contexto

> Todos sondados em 2026-07-20 (`_probe-season-liga.ts`, `_probe-endpoints-novos.ts`). Todos **200**. Nenhum ingerido.

### Rollups de season — `/seasons/{id}?include=statistics.type` → 33 types

⚠️ **Pegadinha:** o include é `statistics.type`. Usar `statistics.details.type` dá **404** (`"details" does not exist on SeasonStatistic`) — diferente de time/jogador, o SeasonStatistic já vem agregado em `value`, sem sub-array `details`.

Types: Corners(34), Attacks(43), Dangerous Attacks(44), Assists(79), Duels Won(106), Through Balls(124/125), **Season Matches(188)**, Season Teams(189), **Matches Ended In Draw(190)**, **Number Of Goals(191)**, **BTTS(192)**, **Cards(193)**, **Cleansheets(194)**, Goalkeeper Cleansheets(195), **Scoring Minutes(196)**, **Goal Line(197)**, **Win/Defeat/Draw Percentage(201–203)**, Most Scored/Conceded (+per match)(204–207), Goal/Assist/Card Topscorer(208–210), Highest Rated Player/Team(211–212), **Referees(574)**, Failed To Score(575), Shots(1677), Injury Time Goals(27260).

Valores são agregados da liga inteira (ex.: Corners `count=244, avg_per_match=9.98`). Serve de **linha de base da competição** — o denominador contra o qual um time é "acima/abaixo da média". Hoje não temos isso: comparamos time contra time, sem a régua da liga.

### Standings details — `/standings/seasons/{id}?include=details.type` → 22 types, 440 linhas

Splits W/D/L/GF/GA overall/casa/fora + saldo + pontos. **Não tem xPTS** — testados os dois ids que a doc discorda entre si (7393 no tutorial, 7939 na referência de Expected); nenhum dos dois vem. Consistente com o bloqueio do add-on Expected.

Nós já derivamos os splits casa/fora no `standing`, então isto é ⚠️ conferência, não dado novo.

### Endpoints de contexto — o achado narrativo

| Endpoint | O que dá |
|---|---|
| **`/rivals/teams/{id}`** 🥇 | Rivais por time, **de graça e correto** (Man Utd↔Arsenal, Liverpool↔Man Utd, Tottenham↔Arsenal/Chelsea/West Ham). Casa direto com [[projeto-aposta-precisa-de-evidencia]]: "é clássico" é fato forte pra tensão/cartões/over, e hoje seria lista chumbada na mão. Nota: nem todo time tem rival cadastrado (Brighton veio vazio) |
| `/team-of-the-week/...` | Seleção da rodada com rating e posição — forma recente por jogador, pronta |
| `/topscorers/seasons/{id}` | 25 linhas, type 83 = gols. Derivamos de `goal`; serve de **conferência** |
| `/statistics/seasons/teams/{id}` | 12 registros = **uma linha por temporada histórica** do time — atalho pra multi-season sem re-syncar partida a partida |
| `/statistics/stages/{id}`, `/statistics/rounds/{id}` | Agregação por fase e por rodada, shape flat `{model_id, type_id, relation_id, value}` |
| `/standings/corrections/seasons/{id}` | Punição/perda de pontos. Vazio na PL 25/26, mas **muda zona** quando existe — e o Brasileirão usa |
| `/squads/...`, `/transfers/teams/{id}` | Elenco (34–40) e transferências — a [[W-002]] |
| `/odds/markets`, `/odds/bookmakers` | **196 mercados e 142 casas** catalogados. As *odds* dão 403, mas o catálogo vem: é o inventário pra decidir que mercados o produto cobre |

## Correção da contagem (2026-07-20)

Medição sobre **200 jogos** da PL 25/26 (`_probe-def-cobertura.ts`, `_probe-def-pedidos.ts`), não 1 fixture.

**Types de JOGADOR que a sondagem original perdeu** — todos entregues, todos esparsos:

| Status | type | Nome | Cobertura em 200 jogos | Leitura |
|---|---|---|---|---|
| ✅ | 571 | Error Lead To Goal | 71 jogos / 83 lances | erro dele que virou GOL (o par sério do 48997) — ingerido na 0039 |
| ✅ | 114 | Penalties Committed | 43 jogos / 48 | pênalti cometido; 0,24/jogo, bate com a taxa base de mercado — 0039 |
| ✅ | 115 | Penalties Won | 32 jogos / 36 | pênalti ganho (sofreu a falta na área) — 0039 |
| ✅ | 95 | Offsides Provoked | 143 jogos / 457 | impedimentos provocados: quem **arma** a linha alta, por jogador — 0039 |
| ✅ | 121 | Turn Over | 150 jogos / 4.503 | entregou a bola ao adversário (erro ativo; ≠ 94, que é sofrido) — 0039 |
| ✅ | 582 | Clearance Offline | 40 jogos / 51 | corte em cima da linha: gol evitado, contabilizado — 0039 |
| ❌ | 103 | Punches | 150 jogos / 263 | goleiro que soca em vez de segurar; com o 584 separa quem domina a área |
| ❌ | 88 | Goals Conceded | 183 jogos / 3.542 linhas | gols sofridos com ele em campo — comparar defesa com/sem um zagueiro |
| ❌ | 1535 | GK Goals Conceded | 183 jogos / 287 | com o 57 dá o save % sem precisar de xG |
| ❌ | 112 | Penalties Missed | 9 jogos | raro |
| ❌ | 113 | Penalties Saved | 7 jogos | raro — **entrega sim**; a versão anterior deste doc errou ao dar como ausente |
| ❌ | 111 / 124 / 125 | Penalties Scored / Through Balls / Through Balls Won | frequentes | ofensivos |
| ❌ | 64 / 83 / 85 | Hit Woodwork / Redcards / Yellowred | esparsos | temos por evento |

**Types de TIME que faltavam na lista:** 47 Penalties, 83 Redcards, 85 Yellowred Cards.

**Confirmado que NÃO vem** (0 ocorrências em 200 jogos, enquanto o type irmão vem nos 200): 66 Successful Interceptions (irmão do 100), 102 Clearances Won (irmão do 101), 2271 Clearances Offline (irmão do 582), 27252 Interception Stats, 27255 Crosses Blocked, 9683 Fouls Per Card. São **ids duplicados do catálogo global** — a SportMonks cataloga vários provedores/esportes e este feed usa um dos pares. Não é lacuna de dado.

**O que a API não tem, defensivamente:** xG contra (403), PPDA/pressões (nenhum type; `pressure` 403), qualquer métrica por zona do campo (só `ballCoordinates` cru), linha defensiva média.

## Armadilhas de modelagem (aprendidas sondando, 2026-07-20)

Estas custam horas se descobertas na implementação. Todas verificadas empiricamente.

1. **`type_id` NÃO identifica o shape.** O mesmo 47 (PENALTIES) é `{all,home,away}` no árbitro e `{total,won,scored,committed,saved,missed}` no jogador. **Um decoder genérico por `type_id` está errado por construção** — a chave é (modelo, type_id).
2. **No nível season, nenhum `value` é escalar.** Todos são objetos, e o schema varia por type: `{total}`, `{count,average}`, `{all,home,away}`, `{average,highest,lowest}`, e excêntricos como `CROSSES_BLOCKED` → `{crosses_blocked: N}` (chave própria em vez de `total`). Decisão obrigatória: `jsonb` vs achatar caso a caso.
3. **Tipo primitivo inconsistente.** `AVERAGE_POINTS_PER_GAME` (9676) devolve `{"average":"0.21"}` — **string**, onde todo o resto é number. E ele aparece no JOGADOR apesar de ser documentado como stat de treinador.
4. **O schema evolui entre seasons.** Cartões de árbitro ganharam `on_bench`/`for_coach`/`on_pitch` nas seasons recentes; a de 2020 não tem. Campos novos = opcionais no decoder.
5. **Vazio ≠ inexistente.** Types esparsos só aparecem quando o lance ocorreu; um time/jogador/season sem o evento simplesmente omite o `detail`. Foi assim que a sondagem original subcontou (57 vs 74). **Sempre varrer N entidades e unir**, nunca concluir de uma amostra.
6. **Bloqueio de plano tem duas caras.** Include bloqueado dá **403 explícito** (`xGFixture`); dado bloqueado dentro de um include liberado é **omitido silenciosamente** (xG no season aggregate). Ausência silenciosa pode ser plano, não inexistência.
7. **Include de season é `statistics.type`, não `statistics.details.type`.** O segundo dá **404** — `SeasonStatistic` não tem sub-array `details`, já vem agregado.
8. **`team.coaches[].id` ≠ id do treinador.** É o id da relação; use `coach_id`. O id errado devolve **200** com `"No result(s) found"` no body.
9. **Odds moram em outro domínio:** `api.sportmonks.com/v3/**odds**/markets`, não `/v3/football/...`.
10. **Rate limit é por entidade**, não global — 2000/h para Season, outros 2000/h para Fixture etc. Dá muito mais folga do que parece.

## Recomendação de sequência (revista em 2026-07-20)

**Passo 0 está FEITO** — plano e fronteira de acesso reconferidos na API em 2026-07-20 (assinatura ativa, 18/27 endpoints OK). Não há mais incerteza a resolver antes de orçar.

Ordenado por (valor pra aposta) ÷ (custo de implementação):

1. **Ampliar `TEAM_STAT`** — fouls(56), saves(57), offsides(51), injuries(87), pênaltis(47), vermelhos(83/85). **Custo zero de request**: já chegam na mesma resposta e são jogados fora. O item mais barato que existe.
2. **`/rivals/teams/{id}`** 🥇 — 20 requests, uma vez, e nasce a **detecção automática de clássico**. É a peça narrativa de maior razão valor/custo do levantamento inteiro, e alinha com a tese de que aposta sem história não vale.
3. **Perfil de cartões do árbitro** — identidade já está no banco (SIN-009); falta `/referees/{id}?include=statistics.details.type`. **1 request por árbitro** (~20–30 por liga), só **7 types**, com **média já calculada e split casa/fora**. Abre um mercado inteiro com dado oficial e é dos mais baratos da lista.
4. **`periods.statistics`** → tabela `match_period_stats` por (match, team, period). Destrava over/under **por tempo**, e "time que desaba no 2ºT". Maior buraco de dado.
5. **Time por SEASON** (`/teams/{id}?include=statistics.details.type`) — traz `goal-line`, `goal-results`, `btts`, `half-results`, `scoring-minutes` **prontos, com split casa/fora**. 20 requests por season. ⚠️ exige decisão de modelagem (tudo é objeto aninhado → `jsonb` ou achatar).
6. **`match-facts`** — confirmado vivo. Streaks e H2H prontos que hoje a CoVe conta na mão.
7. **Rollup de season** (33 types) — a **régua da liga**: hoje comparamos time contra time sem saber a média da competição.
8. **Ampliar `STAT` do jogador** — nichado: 1605 (drible % por jogador), 64 (trave por jogador), 47 (pênalti cobrado), 88/1535/103 (pacote de goleiro), 117172 (minutos acumulados = fadiga).
9. **Se subir de plano:** **xG Basic** e **Expected Lineups** primeiro — alimentam direto "aposta precisa de evidência". Odds e News depois.
