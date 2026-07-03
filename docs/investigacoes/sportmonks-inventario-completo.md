# SportMonks — inventário completo do que o plano entrega vs o que ingerimos

> Levantado em 2026-07-02 sondando a API de verdade (não a doc): dump dos 1310 `core/types`, fixture encerrado com `statistics` e `lineups.details` **sem filtro**, e teste de cada include nunca usado. Plano: **Starter (trial até 2026-07-12) + add-on Match Facts**.

Legenda: ✅ sincado no banco · ⚠️ temos em outra forma (derivado/nível diferente) · ❌ falta

## TL;DR — o que existe e ainda não usamos, por valor de aposta

| Prioridade | O quê | Onde | Por quê |
|---|---|---|---|
| 🥇 | **Stats por tempo (1ºT/2ºT)** | `include=periods.statistics` (~80 types/tempo) | over/under por tempo: SoT, ataques perigosos, corners, posse POR TEMPO — hoje só temos o total e o placar HT |
| 🥇 | **Árbitro + perfil de cartões** | `include=referees` (4/jogo) + `/referees/{id}?include=statistics.details` | cartões médios (4.67 amarelos/jogo etc.), pênaltis, faltas, VAR moments, split casa/fora — mercado de cartões inteiro |
| 🥈 | **stats de jogador que faltam** | `lineups.details` sem filtro (57 types; ingerimos 52 após 2026-07-03) | tabela completa abaixo |
| 🥈 | **12 stats de time que já vêm de graça** | `statistics` sem filtro (40 types; ingerimos 28) | tabela completa abaixo |
| 🥉 | **Ball coordinates** | `include=ballCoordinates` (~950 pontos x,y/jogo) | posição da bola ao longo do jogo — territorialidade real |
| 🥉 | **TV stations** | `include=tvStations` (229/jogo) | jogo televisado = proxy de peso/visibilidade |
| ✅ feito 2026-07-02 | metadata do fixture (attendance, lineup confirmed) e do player (pé preferido) | `include=metadata` | W-057 + attendance |

## Bloqueado pelo plano atual (403)

| Include | O quê | Por quê importa |
|---|---|---|
| `xGFixture` | ❌ xG por partida | O insumo quant que falta pro motor (MOD-004 é quant-first) |
| `odds` | ❌ odds pré-jogo | linha de mercado pra comparar com o prognóstico; [[W-020]] depende |
| `predictions` | ❌ previsões da própria SportMonks | benchmark do nosso modelo |
| `pressure` | ❌ pressure index pronto | já sabíamos: SIN-021 reconstrói dos trends |

Se o trial virar assinatura, vale precificar o tier que destrava **xG + odds** — os dois de maior alavancagem.

## Detalhe 1 — stats de TIME por partida (`include=statistics`, sem filtro)

O fixture devolve **40 types**; o sync grava 28 no `match_team_stats` (filtro `TEAM_STAT` em `sync-ingest.ts`).

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

O fixture devolve **57 types por jogador**; o sync grava **52** no `lineup_player` — 37 adicionados em 2026-07-03. O filtro `lineupDetailTypes` foi REMOVIDO do fetch (a API limita cada filtro a 50 ids); vêm todos os types e o mapa `STAT` escolhe. Todos os agregados de season estão expostos no perfil via `PlayerDetail.stats` (cards Finalização/Criação/Construção/Defesa/Duelos/Disciplina/Goleiro); a família de chutes/duelos/percentuais está exposta no perfil do jogador via `PlayerDetail.shooting`. Cada linha de `lineups.details` pertence a um jogador identificado — qualquer type abaixo vem com o player id.

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

## Detalhe 3 — stats POR TEMPO (`include=periods.statistics`) 🥇 ❌

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

## Detalhe 4 — árbitro (`include=referees` + `/referees/{id}?include=statistics.details`) 🥇 ❌

| Status | O quê | Detalhe |
|---|---|---|
| ❌ | Árbitros do jogo | 4 por fixture: type 6 principal, 7/8 assistentes, 9 quarto árbitro |
| ❌ | Yellowcards do árbitro | média/jogo, split casa/fora, on_pitch/bench/coach |
| ❌ | Redcards / Yellowred | idem |
| ❌ | Penalties | média + split casa/fora |
| ❌ | Fouls | faltas/jogo apitadas |
| ❌ | VAR Moments | intervenções de VAR |

Ex. real (T. Robinson, 15 jogos): 4.67 amarelos/jogo, 0.2 pênaltis/jogo, 23 faltas/jogo. É o mercado de cartões inteiro: "árbitro cartoteiro + derby = over cartões". Precisa de tabela `referee` + vínculo no `match` + stats por season.

## Detalhe 5 — outros includes/endpoints

| Status | Include/endpoint | O quê |
|---|---|---|
| ❌ | `ballCoordinates` | ~950 amostras (timer, x, y) por jogo — territorialidade; agregar em terços antes de guardar |
| ❌ | `tvStations` | 229 emissoras no jogo sondado — proxy de visibilidade |
| ⚠️ | `participants.coaches` | técnico por include direto (hoje já vem via lineup; útil pra [[W-053]]) |
| ❌ | `transfers` / squads por season | histórico de clube — mapeado na [[W-002]] |
| ⚠️ | `topscorers` da season | artilheiros oficiais prontos (derivamos de `goal` — serviria de conferência) |

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
| ✅ | `match_team_stats` | 28 team stats por jogo (tabela do Detalhe 1) |
| ✅ | `lineup_player` | 52 player stats por jogo (tabela do Detalhe 2) + starter/grid/role |
| ✅ | `match_trend` | trends por minuto, 10 types (SIN-021) |
| ✅ | `weather` | clima completo por jogo (SIN-006) |
| ✅ | `goal` / `card` | eventos com jogador, minuto, tipo |
| ✅ | `injury` | sidelined/desfalques por jogo |
| ✅ | `commentary` | narração lance a lance |
| ✅ | `standing` | tabela oficial + split casa/fora |
| ✅ | `venue` | estádio com `surface`, capacidade, lat/lon |
| ✅ | `match` | attendance, lineup_confirmed (2026-07-02) |
| ✅ | `player` | preferred_foot (2026-07-02) |

## Recomendação de sequência

1. **periods.statistics** → tabela por (match, team, period) — destrava over/under por tempo de verdade.
2. **Referee + cartões** → mercado novo inteiro com dado oficial.
3. **Ampliar `STAT` do jogador** (aéreo, defensivo fino, touches, fouls drawn, captain — a família de chutes/duelos/percentuais já entrou em 2026-07-03) — custo ~zero, alimenta setores/prognóstico.
4. **Ampliar `TEAM_STAT`** (fouls, saves, offsides, injuries) — custo ~zero.
5. Se assinar tier maior: **xG e odds** primeiro.
