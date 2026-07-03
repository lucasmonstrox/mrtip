# Catálogo de cruzamentos — o mapa de expansão do motor de prognóstico

> Documento VIVO (criado 2026-07-03, sessão lote 1 + CoVe). Cada linha é um cruzamento: **capacidade de A × vulnerabilidade espelhada de B × condicionador → mercado**. Sem as 3 peças não é cruzamento, é numerologia — todo fio precisa contar a história de COMO o gol/evento acontece.
>
> Regra de altitude (MOD-004): **o código computa o cruzamento; a LLM o lê e conclui.** Industrializar = mover a linha de 🔶 pra ✅ dentro do `evidence-crossings.ts` (super) e/ou do `prognosis-prompt.ts` (vivo).

**Status:** ✅ industrializado (código já cruza e entrega mastigado) · 🔶 dado ingerido, cruzamento manual (os dois lados estão no briefing, mas quem cruza é a LLM) · ❌ falta dado/agregação (o que falta está anotado)

**O método pra adicionar linha nova — as 4 perguntas de todo sinal:**
1. Qual o **espelho** dele no adversário? (sem espelho é contexto, não previsão)
2. Que **condicionador** liga/desliga o par neste jogo?
3. Em que **mercado** desagua?
4. Que **evento in-game** o religa/desliga (gol, expulsão, substituição)?

---

## 1 · Espelhos diretos — capacidade × vulnerabilidade

| Status | Cruzamento | Dado (real, no banco) | Condicionador | Mercado |
|---|---|---|---|---|
| ✅ | Arquétipo: como A produz contra o ESTILO de B (posse-bucket) | `match_team_stats.possession` → buckets · gols nos jogos-espelho | intenção | xG do time, 1x2 |
| ✅ | Canal de gol: como A GERA × como B SOFRE (escanteio/falta/contra/corrido) | `goal` ⋈ `commentary` (classificado) | — | team_total, marcador |
| ✅ | Setor/corredor: criação de A por corredor × lado defensivo fraco de B (nota+desfalque+forma, blindado/em queda) | `lineup_player.role`/`grid` + KP + cruzamentos + rating | desfalque na vaga | marcador, janela |
| ✅ | Volume × cedido: SoT/90 do jogador × SoT que B concede vs liga | `lineup_player.shots_on_target` · `match_team_stats` | mando, arquétipo | xSoT/xG por jogador |
| 🔶 | SoT criado × **save% do goleiro** que defende | bloco Goleiro (saves, saves_insidebox, gols sofridos nos jogos dele) | goleiro reserva? (identidade CoVe) | over/under, team_total |
| 🔶 | Bola parada de A (% gols de escanteio/falta) × **aéreo defensivo** de B (quem perde o duelo no alto) | `setPieceBlock` + `aerials_won/total/pct` por zagueiro | cobrador desfalcado | team_total, marcador de zagueiro |
| 🔶 | Cavador de faltas de A × time faltoso B | `fouls_drawn` × `fouls` por jogador | árbitro (❌ não ingerido) | pênalti, cartões, bola parada perigosa |
| 🔶 | Pressão alta de A × **erros→chute** da defesa/goleiro de B (chance de graça) | `errors_lead_to_shot`, `dispossessed`, `possession_lost` | intenção (pressiona de verdade?) | team_total, over |
| 🔶 | Driblador da ponta × lateral driblável (o "quem pega quem" — W-062) | `dribbles_successful` × `dribbled_past` por jogador + `role` espelhado | forma últ.5 dos DOIS | marcador, janela, escanteios |
| 🔶 | **Construção × pressão**: passes/precisão de A sob pressão × desarme+interceptação alta de B | `passes`, `passes_accurate_pct`, `backward_passes` × `tackles`/`interceptions` | bloco alto/baixo do rival | ritmo do jogo, under |
| 🔶 | **Passes no 3º final** de A × compactação de B (clearances+blocked_shots) | `passes_final_third` × `clearances`, `blocked_shots` | intenção | big chances, over |
| 🔶 | Bola longa de A (saída direta) × aéreo do meio-campo de B | `long_balls`/`long_balls_won_pct` × `aerials_won_pct` por setor | clima (vento) | estilo do jogo, escanteios |
| ❌ | Chute de fora de A × goleiro que vaza de longe | tem `shots_outsidebox`; falta gol-por-distância (❌ classificar via commentary) | — | marcador, over |

## 2 · Condicionadores — o interruptor dos espelhos

| Status | Condicionador | Dado | O que liga/desliga |
|---|---|---|---|
| ✅ | Intenção de tabela (precisa/administra/solto) + "empate basta" | tabela recomputada pré-jogo + alcance matemático | TODOS os espelhos ofensivos do lado satisfeito; o filtro que mais separou acerto/erro |
| ✅ | Descanso/congestionamento (dias desde o último jogo, cruzando copa) | `match.date` liga+copa | intensidade geral, reta final |
| ✅ | Mando (split casa/fora embutido nos λ) | splits por venue | tamanho de todos os espelhos |
| ✅ | Clima (SEM correlação com total nesta liga — contexto, não fator) | tabela `weather` | ~nada (provado); W-054 quer o per-player |
| 🔶 | **Fadiga POR JOGADOR** (quem acumulou minutos vs quem foi poupado — W-050) | `minutes_played` acumulado por atleta, liga+copa | espelhos individuais na reta final; rodízio ≠ time cansado |
| 🔶 | **Onde o time cansa** (janela em que desaba) | timing de gols sofridos por faixa + momentum bands 61-90 | janelas 76-90, over tardio |
| ❌ | **Cansaço por TEMPO com volume** (SoT/ataques perigosos 1ºT vs 2ºT — "desaba no 2ºT" com dado de volume, não de gol) | ❌ `periods.statistics` (🥇 do inventário, não ingerido) | split 1ºT/2ºT, under/over por tempo |
| ❌ | Dureza dos jogos anteriores (fadiga qualitativa — W-047) | ❌ agregação de duelos/faltas/lesões-em-jogo dos últimos jogos | mesma coisa que descanso, refinado |
| ❌ | Árbitro (cartoteiro? caseiro?) | ❌ `referees` + stats (inventário 🥇) | mercado de cartões inteiro |

## 3 · Cadeias — quem ajuda quem (o dano viaja pela corrente)

| Status | Cadeia | Dado | Leitura |
|---|---|---|---|
| ✅ | Garçom → marcador (duplas de gol) | `goal.assist_id` → `player_id`, pares 2+ | desfalque numa ponta SECA a outra — mesmo saudável. 🔶 upgrade W-063: virar **% de dependência na ótica do marcador** ("71% dos gols dele vêm do Y") |
| ✅ | Candidatos a marcador computados (XI por P(marca) + ⚑estrutural + 🔁banco) | expectativa por jogador + `starter`/minutos | Passo 4c parte daqui |
| 🔶 | Cavador → cobrador → alvo aéreo (a cadeia da bola parada) | `fouls_drawn` → cobrador (❌ quem cobra: derivável de commentary/gols de falta) → `aerials_won` | gol de falta/escanteio como CORRENTE, não evento |
| 🔶 | Recuperador → transição → velocista (a cadeia do contra-ataque) | `ball_recoveries`/`interceptions` do volante → gols "counter" do canal | team_total do time que cede posse |
| 🔶 | Criador de 3º final → finalizador de área | `passes_final_third`/`key_passes`/`big_chances_created` → `shots_insidebox` do camisa 9 | quem abastece quem; desfalque do criador derruba o 9 |
| ❌ | Quem cobra escanteio/falta (o nó único da cadeia aérea) | ❌ derivar cobrador de `commentary` (padrões "corner taken by X") | desfalque do cobrador desliga TODO o jogo aéreo |

## 4 · Deltas de substituição — quem melhora/piora o quê

| Status | Delta | Dado | Leitura |
|---|---|---|---|
| ✅ | Desfalque ofensivo (G+A, %involve, with/without de SoT) com confound guard | `injury` × `goal` × `lineup_player` | desconto no VOLUME do próprio time |
| ✅ | Desfalque DEFENSIVO (% das interceptações do time que saem) | `tackles`+`interceptions` do lesionado | sobe o λ do ADVERSÁRIO |
| ✅ | Banco quente / VIVOS fora do XI (rotação recente ≠ indisponível) | minutagem season vs últ.5 | risco de titularidade/sub que marca |
| 🔶 | Goleiro titular → reserva (delta de save%) | bloco Goleiro (os 2 goleiros com save% cada) | mexe na CONVERSÃO defensiva, não no volume |
| 🔶 | Quem entra na VAGA muda o CANAL (lateral reserva defende pior o corredor do driblador rival) | `role` do substituto provável × setor do rival | reabre/fecha espelhos de corredor |
| 🔶 | **Padrão de substituição do técnico** (quando mexe, quantas, efeito) | `lineup_player` starter=false + minutos (temos QUEM entrou e quanto jogou) | janelas 61-90: time que muda o jogo do banco |
| ❌ | Nº de subs usadas por jogo (team stat 59) | ❌ não ingerido (quick win do inventário) | profundidade de elenco usada |
| ❌ | Impacto médio do sub (Δ momentum do time nos 15min pós-substituição) | derivável: `match_trend` × minuto de entrada (`lineup_player`) | "técnico que conserta o jogo" — fio inédito |

## 5 · Temporais — o estado do jogo religa os fios

| Status | Cruzamento | Dado | Mercado |
|---|---|---|---|
| ✅ | Janela onde A pressiona × janela onde B afunda (momentum bands cruzadas) | `match_trend` → net por faixa de 15min | janela de gol, xg_bands |
| ✅ | Timing de gols: A marca por faixa × B sofre por faixa (índice por janela) | `goal.minute` | prob_gol por janela |
| ✅ | Dinâmica pós-gol (Δ momentum 10min após marcar/sofrer — administra? desmorona?) | `match_trend` × `goal.minute` | roteiros, cascata condicional |
| ✅ | Arco HT→FT nomeado (virada, cedeu vantagem) na forma | `ht_*`/`ft_*` | resiliência, 2ºT |
| 🔶 | Fadiga individual × janela final (o lateral de 90min×5 jogos seguidos × o ponta descansado de B) | minutos acumulados por jogador × faixa 76-90 | over tardio, marcador de sub |
| ❌ | Posse/SoT POR TEMPO real (hoje derivada dos trends; a oficial existe) | ❌ `periods.statistics` | over/under por tempo com dado oficial |

---

## 6 · Cobertura do inventário — TODA stat ingerida mapeada pro seu fio

> Regra: stat sem fio é dado desperdiçado. Inventário completo em `docs/investigacoes/sportmonks-inventario-completo.md` (52 por jogador + 28 de time + trends + clima + metadata). Abaixo, cada uma → família do catálogo; as **órfãs** ganham espelho sugerido e viram candidatas a linha nova.

### Por jogador (`lineup_player`) → fio

| Grupo | Stats | Fio |
|---|---|---|
| Finalização | `shots_total`, `shots_on_target`, `shots_off_target`, `shots_blocked` (dele bloqueados), `big_chances_missed` | §1 volume×cedido, SoT×save%; pontaria e perdulário calibram conversão |
| Criação | `key_passes`, `chances_created`, `big_chances_created`, `passes_final_third`, `crosses_total/accurate`, `crosses_successful_pct` | §1 setor/corredor · §3 criador→finalizador |
| Construção | `passes`, `passes_accurate(_pct)`, `long_balls(_won/_won_pct)`, `backward_passes`, `touches` | §1 construção×pressão, bola longa×aéreo; `touches` = participação (queda = apagado, alimenta forma) |
| Drible | `dribble_attempts`, `dribbles_successful`, `dribbled_past` | §1 driblador×driblável (W-062) |
| Duelo/aéreo | `duels_total/won/lost`, `duels_won_pct`, `aerials_total/won/lost/won_pct` | §1 bola parada×aéreo · §5 fadiga×janela (duelo cai no fim) |
| Defesa | `tackles(_won/_won_pct)`, `interceptions`, `clearances`, `blocked_shots` (ele bloqueou), `last_man_tackle`, `ball_recoveries` | §1 pressão×erro · §3 recuperador→contra · §4 desfalque defensivo |
| Erro/risco | `errors_lead_to_shot`, `dispossessed`, `possession_lost` | §1 chance de graça |
| Faltas | `fouls`, `fouls_drawn`, `offsides` | §1 cavador×faltoso; **`offsides` órfã → espelho: linha alta do rival** (ponta impedido × defesa que joga adiantada — ❌ falta proxy de linha alta; derivável de offsides SOFRIDOS do time) |
| Goleiro | `saves`, `saves_insidebox`, `good_high_claim` | §1 SoT×save% · §4 delta goleiro; **`good_high_claim` órfã → espelho: volume de cruzamento/escanteio do rival** (goleiro que sai bem no alto desliga a bola parada aérea) |
| Contexto | `minutes_played`, `rating`, `man_of_match`, `captain`, `starter`, `position`, `role`, `grid` | §2 fadiga por jogador · §4 XI/banco/vaga · qualidade (nota/MOTM = W-035) · `captain` = liderança fora |

### Por time (`match_team_stats`) → fio

| Grupo | Stats | Fio |
|---|---|---|
| Volume | `shots_total/insidebox/outsidebox/on_target/off_target/blocked`, `goal_attempts`, `big_chances_created/missed` | §1 volume×cedido; base rate Rota B |
| Território | `possession`, `attacks`, `dangerous_attacks`, `corners` | arquétipo (§1) · momentum (§5) · escanteios como mercado próprio |
| Construção | `passes`, `passes_accurate`, `pass_accuracy`, `long_passes`, `crosses_total/accurate` | §1 construção×pressão |
| Defesa/físico | `tackles`, `interceptions`, `duels_won`, `successful_headers` | §1 aéreo team-level · §4 desfalque defensivo |
| Bola parada | `free_kicks` | 🔶 **subusada → volume de bola parada a favor** (cruza com cavador §1 e cadeia §3) |
| Azar/regressão | `hit_woodwork` | 🔶 **órfã → fio de REGRESSÃO**: trave = xG não pago; time com muitas traves recentes tende a "voltar a marcar" (anti-narrativa de seca) |
| Dribles | `dribble_attempts/successful`, `dribble_success` | §1 W-062 agregado |

### Outras fontes → fio

| Fonte | Fio |
|---|---|
| `match_trend` (10 types por minuto) | §5 inteiro (momentum, pós-gol, Δ-sub) + posse por tempo derivada |
| `goal` (minuto, tipo, autor, assist) + `commentary` | §1 canal · §3 duplas/cobrador · §5 timing |
| `card` | ❌ mercado de cartões (espera árbitro); 🔶 já cruza com faltas/derby |
| `injury` | §4 inteiro |
| `weather` | §2 (provado ~neutro no total; W-054 = versão per-player) |
| `standing`/tabela recomputada | §2 intenção — o condicionador-mestre |
| `venue` (geo, surface) + viagem | §2 fadiga/mando |
| `match.attendance` | 🔶 **órfã → caldeirão**: público vs média = peso do mando naquele jogo específico |
| `player.preferred_foot` (W-057) | 🔶 **órfã → espelho de corredor**: ponta invertida (canhoto na direita) × lateral que defende corte pra dentro; cruza com W-062 |
| `match.lineup_confirmed` | gate operacional: prognóstico ANTES da escalação = XI provável; DEPOIS = trocar por XI real |

**Órfãs priorizadas** (stat pronta esperando fio): `hit_woodwork` (regressão), `attendance` (caldeirão), `preferred_foot` (corte pra dentro), `good_high_claim` (goleiro×bola aérea), `offsides` (linha alta), `free_kicks` team (volume de bola parada).

---

## Fila de industrialização (ordenada por retorno ÷ esforço)

1. **SoT × save% do goleiro** e **bola parada × aéreo** — os dois lados já estão no briefing (lote 1); falta só o código parear e emitir o veredito pronto no digest (mesmo molde do `matchupLines` de canal).
2. **W-062 — jogador × jogador por canal** (driblador × driblável, com forma dos dois): o `role`/grid já pareia os corredores; é a folha de todo o catálogo.
3. **Quem cobra escanteio/falta** via commentary → destrava a cadeia da bola parada inteira (cavador→cobrador→alvo).
4. **Fadiga por jogador (W-050)** + padrão de substituição do técnico — minutos acumulados já ingeridos; o Δ-momentum pós-sub é fio inédito e barato (`match_trend` × minuto de entrada).
5. **`periods.statistics`** (ingest novo, 🥇 do inventário) → cansaço por tempo com volume oficial, over/under por tempo.
6. **Árbitro** (ingest novo) → mercado de cartões: cartoteiro × derby × time faltoso × cavador.

_Cada linha industrializada deve responder as 4 perguntas do método e entrar no digest como veredito pronto (código cruza, LLM conclui) — e ganhar o teste do backtest antes de virar peso no número._
