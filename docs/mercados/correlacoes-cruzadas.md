---
mercado: correlacoes-cruzadas
titulo: Correlacoes Cruzadas
---

# Correlacoes Cruzadas entre Mercados

> Documento de sintese. Os dossies individuais (`over-under-gols`, `ambas-marcam-btts`, `resultado-1x2`, `handicap-asiatico`, `handicap-europeu`, `derivados-resultado`, `escanteios`, `cartoes`, `parciais-tempo`, `placar-exato-scorecast`, `jogadores-props`, `penalti-expulsao-eventos`, `especiais-betbuilder` e a camada fundacional `contexto-motivacao-fatores`) descrevem cada familia isoladamente. Este arquivo costura tudo: **como os mercados se relacionam entre si**, qual **fator de contexto** empurra cada cluster, e quais **pacotes de mercados** tendem a ter valor em cada arquetipo de jogo.
>
> O fio condutor matematico esta no apendice do dossie de Handicap Asiatico: quase tudo deriva de **dois numeros** — a **supremacia esperada (SG = gols esperados do mandante - gols esperados do visitante)** e o **total esperado (T = soma dos gols esperados)**. SG governa resultado/handicap; T governa over-under/BTTS/placar; e o **estilo + arbitro + contexto** governam escanteios e cartoes, que sao quase ortogonais ao placar. Entender essas tres dimensoes (SG, T, e o eixo "atrito/territorio") e entender toda a malha de correlacoes.

---

## 1. As tres dimensoes que organizam todos os mercados

Antes de mapear par a par, e util enxergar que os ~14 familias se projetam em **tres eixos quase independentes**. Saber em qual eixo cada mercado vive evita o erro classico de tratar como redundante o que e ortogonal (e vice-versa).

| Eixo | O que mede | Mercados que vivem nele | Driver primario |
|---|---|---|---|
| **SG — supremacia** | quem ganha e por quanto | 1X2, Dupla Chance, DNB, Handicap (asiatico e europeu), Empate-HC, Margem de vitoria, Vencer os dois tempos, Virar o jogo | qualidade relativa + mando + motivacao |
| **T — total de gols** | volume de gols | Over/Under, BTTS, Placar exato, Par/Impar, Gols por tempo, 1o gol, Race to X, Marcar nos dois tempos, ATGS/2+ | xG+xGA dos dois lados, estilo, clima |
| **Atrito/Territorio** | faltas e pressao com largura | Cartoes, Escanteios, props de falta/desarme, penalti, vermelho | arbitro, estilo (posse vs pressing), derby, motivacao |

**Insights que decorrem dessa decomposicao:**

- **SG e T sao acoplados, nao independentes.** Para uma mesma SG, um T mais alto torna handicaps grandes (-1.5/-2) mais provaveis (ha mais gols para abrir a margem); um T baixo empurra para Empate-HC, +handicap do zebra e linhas pequenas. Esse e o elo direto entre a familia de handicap e a de over/under.
- **O eixo de atrito/territorio e quase ortogonal ao placar.** Escanteios tem correlacao ~zero com gols; cartoes podem coexistir com under (jogo travado e faltoso). Por isso cartoes/escanteios sao as melhores pernas para "engordar" um bet builder sem redundancia — a casa aplica desconto pequeno (5-20%) justamente porque a correlacao real e baixa.
- **O empate (X) e o resultado de baixa T.** Mais gols esperados -> menos empate; menos gols -> mais empate. Por isso X correlaciona com Under, com Empate-Handicap e com placares baixos (0-0, 1-1).

---

## 2. As cadeias causais centrais (fator de jogo -> pacote de mercados)

O dossie de contexto martela: a casa precifica bem a *qualidade media*, mas mal os *fatores situacionais*. Cada cadeia abaixo e um mecanismo de jogo que propaga por varios mercados na mesma direcao — e e onde o desconto de correlacao da casa tende a subestimar a correlacao real a seu favor.

### 2.1 Supremacia alta + jogo aberto -> Over + Handicap + Margem
Favorito de posse/pressao alta contra rival que se abre: domina territorio, cria muitas chances, tende a golear quando o placar abre.
- **Puxa:** favorito -1/-1.5, Over 2.5/3.5, Margem 2+, favorito vence + artilheiro marca, Over escanteios do favorito, Vencer/Marcar nos dois tempos.
- **Trava:** Empate-HC, +handicap do zebra, Under, BTTS Nao do favorito (ele goleia a zero).
- **Trap:** favorito que **domina posse mas converte pouco** vence por 1 (Empate-HC), nao goleia. So va a -2/-3 com razao concreta de blowout.

### 2.2 Time obrigado a atacar (perde no agregado / precisa do resultado) -> Escanteios Over + Cartoes do adversario + gols tardios
Time que precisa atacar joga bolas na area "a qualquer custo", gera cluster de escanteios; o adversario que segura defende baixo e comete faltas de contencao.
- **Puxa:** Over escanteios (sobretudo 2o tempo e min 70-90), Over Team Corners do time pressionando, cartoes do time que segura (faltas taticas), Over gols tardios (janela 76-90), Race to X de escanteios.
- **Conexao live:** e o setup classico de "Over live de escanteios com a linha atrasada" e de "mais um cartao no fim".

### 2.3 Jogo travado de decisao (mata-mata, medo de perder) -> Under + BTTS Nao + Empate-HC + mais cartoes + 1o tempo seco
Decisao cautelosa: dois times jogam para nao perder, margem comprimida, atrito alto.
- **Puxa:** Under 2.5, BTTS Nao, Empate-Handicap, +handicap do zebra, 0-0/1-0 no placar exato, Over cartoes (faltas taticas + tensao), Under 1o tempo (times se estudam), X (empate) no 1X2.
- **Atencao:** Over cartoes + Under gols **coexistem** aqui — nao e contradicao (jogo travado e faltoso). E uma das poucas combinacoes "Under + Over algo" que tem logica.

### 2.4 Derby/rivalidade -> Over cartoes + empate + Under 1o tempo / Over 2o tempo
Atmosfera intensa: mais faltas, mais empates, inicio travado que abre depois.
- **Puxa:** Over cartoes (~30%+ acima da media, mas **ja precificado** — buscar o inverso: lados, 1o tempo, faixas), X (empate), Under HT + Over FT (~65% dos grandes derbies passam de 2.5 apesar do inicio travado), vermelho Sim (ao vivo).
- **Trap dupla:** o Over de cartoes "na cara" do classico ja esta na linha; o EV vive nas pernas que o livro exagerou (1o tempo Under, lado do visitante, etc.).

### 2.5 Vento forte / campo pesado -> Under + BTTS Nao + +handicap do zebra
Vento e o fator climatico **dominante** (chuva tem efeito pequeno e contestado): degrada passe longo, cruzamento, bola parada e goleiro; nivela o time tecnico.
- **Puxa:** Under, BTTS Nao, +handicap do zebra (a supremacia tecnica se comprime), Empate-HC, placares baixos, Under de SoT (chutes menos limpos).
- **Calibracao honesta:** a chuva isolada (~"-17% gols") vem de fonte fraca; o vento >25 km/h e o sinal solido. Nao construa edge sobre "vai chover -> BTTS Nao" — o efeito da chuva sobre gols e estatisticamente proximo de nulo (ver dossie BTTS 4.5). Se a casa precifica chuva agressivamente, pode haver valor **a favor** do BTTS Sim.

### 2.6 Altitude (visitante sobe >= 2.000m) -> Casa + Over 2o tempo + handicap do mandante
Visitante de nivel do mar quebra fisicamente apos o min 60 (sprints despencam).
- **Puxa:** 1X2 mandante, handicap do mandante de altitude, Over 2o tempo / proximo gol do mandante, gols tardios.
- **Magnitude:** La Paz (~3.600m) ~+45 p.p. de prob. de vitoria; Quito (~2.800m) ~+29 p.p. (efeito robusto, ao contrario da viagem pura, que hoje e quase morta).

### 2.7 Vermelho (expulsao) -> o maior choque de SG e T do jogo
Eixo cruzado mais brusco. Direcao depende de **quem** e **quando**:
- **Time punido:** gols do adversario **+124%**, do reduzido **-47%**; xG do reduzido **-65%**, do adversario **+54%**. Mando amplifica (casa com 10 sofre ~-1,2 gol; visitante ~-0,58).
- **Timing:** vermelho no **1o tempo** move muito a margem; no **2o tempo** quase nao move (ponto de virada ~intervalo).
- **Janela de gol pos-vermelho:** o time com 10 concede em **~40,7%** dos casos, **~56% em ate 15 min**, **~80% em ate 30 min** — gatilho concreto para "proximo gol"/Over ao vivo.
- **Trap classico:** vermelho no time **forte** contra fraco frequentemente faz o **total CAIR** (forte recua e organiza; fraco nao tem qualidade para furar) — o mercado superreage assumindo goleada do fraco.

### 2.8 Pressao alta dos dois lados -> Over + BTTS Sim + Over cartoes + Over escanteios
PPDA baixo, transicoes, espaco nas costas: chances mutuas, faltas taticas no campo ofensivo, bola para a linha de fundo.
- **Puxa:** Over 2.5, BTTS Sim, Over cartoes (faltas no pressing), Over escanteios, Over SoT dos dois lados, 1o gol mais cedo.
- E a cadeia onde **mais pernas alinham na mesma direcao** — o "jogo aberto" classico.

---

## 3. Matriz de correlacao entre os principais mercados (para bet builder)

Legenda: **++** correlacao positiva forte (combina, mas a casa desconta muito — pouco EV escondido); **+** positiva moderada; **0** quase independente (perna de "engorda" com pouco desconto — onde mais mora EV residual no builder); **-** negativa moderada (raramente vale a odd); **--** negativa forte / quase impossivel (a casa frequentemente bloqueia).

> Como ler: a celula diz se as duas pernas se **reforcam** (correlacao +, a casa ja cortou a odd combinada) ou se **contradizem** (correlacao -, a odd exibida raramente cobre o risco). **O ouro do builder esta nas celulas `0`** — pernas que a sua leitura de jogo liga mas a casa precifica como independentes.

### 3.1 Eixo gols (T)

| Par | Sinal | Observacao operacional |
|---|---|---|
| Over 2.5 + BTTS Sim | **++** | Coincidem ~55-60%; quando Over 2.5 bate, ~80% tem BTTS. Perna de SGM mais natural — e a mais descontada. Risco residual: 1-1 (BTTS mas Under). |
| Over 2.5 + ambos team totals Over 0.5 | **++** | Equivalente logico de BTTS+Over. |
| Over 1.5 2o tempo + Over 2.5 jogo | **+** | O 2o tempo concentra ~56% dos gols. |
| Over 2.5 + ATGS de referencia | **+** | Jogo aberto favorece o finalizador. |
| Over 3.5 + favorito vence | **+** | Goleada puxa total e resultado juntos. |
| Under 2.5 + BTTS Sim | **--** | So cabe 1-1; espaco minusculo, EV ruim disfarcado de odd alta. |
| Over 2.5 + Under 1.5 / 0-0 | **--** | Mutuamente excludentes. |
| Under 2.5 + Clean Sheet (um lado) | **+** | Defesa solida alimenta os dois. |
| Par + Over 4.5 | **-** | Placares altos inclinam impar. |

### 3.2 Eixo resultado/supremacia (SG) cruzado com gols (T)

| Par | Sinal | Observacao |
|---|---|---|
| Favorito -1/-1.5 + Over 2.5/3.5 | **++** | Vencer por 2+ quase exige >=3 gols quando o zebra tambem marca. |
| Favorito -2/-3 + Under 2.5 | **--** | Vencer por 3+ e quase impossivel com <3 gols — a casa frequentemente bloqueia. |
| Zebra +1/+1.5 + Under 2.5 / BTTS Nao | **++** | Jogo travado e de poucos gols e o cenario do +handicap segurar. |
| Empate-HC (-1) + Under 3.5 / Correct Score 1-0/2-1 | **++** | Empate-HC **e** o conjunto de vitorias por exatamente 1 gol (~38% dos jogos). |
| Empate-HC (-1) + Over 3.5 | **--** | Vitoria por 1 e placar aberto raramente convivem. |
| 1 (casa vence) + Over 1.5 | **+** | Favorito que vence costuma marcar. |
| X (empate) + Under 2.5 | **+** | Empates de baixo placar (0-0, 1-1) sao os mais comuns. |
| DNB favorito + favorito ATGS | **+** | Se o atacante marca, o time tende a nao perder. |
| 1X (DC casa) + Under 2.5 | **+** | Azarao mandante segura + poucos gols. |
| Vencer os dois tempos + Under 2.5 | **--** | Vencer cada tempo tende a exigir >=2 gols. |
| Virar o jogo + Clean Sheet do mesmo time | **--** | Virar exige conceder primeiro — contradicao direta. |

### 3.3 Eixo atrito/territorio cruzado com placar (as celulas `0`/`+` valiosas)

| Par | Sinal | Observacao |
|---|---|---|
| Resultado + Cartoes | **0** | Quase independentes; desconto tipico 5-20%. Perna de engorda. |
| Resultado + Escanteios | **0** | Idem; cantos correlacionam mais com supremacia territorial que com placar. |
| Over gols + Over escanteios | **+** | Jogo aberto produz os dois (mas correlacao modesta). |
| BTTS Sim + Over escanteios | **+** | Mesma pressao ofensiva alimenta gols e cantos. |
| Mandante vence + Over Team Corners do mandante | **+** | Dominio territorial casa os dois (favorito vence cantos ~63,6% vs vitoria 55,6% — cantos mais previsiveis). |
| Pressao alta dos dois + Over cartoes | **+** | Faltas taticas no pressing. |
| Over cartoes + vermelho Sim | **+** | Mecanicamente alinhados. |
| Over cartoes + jogador faltoso a ser cartonado | **+** | A perna do jogador e subconjunto do total. |
| Under gols + Over cartoes | **0/+** | **Coexistem** em jogo travado e faltoso (derby, gramado pesado, decisao) — nao e contradicao. |
| Under gols + Over escanteios | **0** | Possivel (muitos cantos sem conversao; cantos~gols ~zero), mas tensiona a tese de jogo fechado. |
| Favorito goleia confortavel + Over cartoes altissimo | **-** | Jogo unilateral confortavel -> favorito faz **menos** faltas. |
| Posse extrema de um time + Over cartoes desse time | **-** | Quem tem a bola comete **menos** faltas (o lado com menos posse falta mais). |
| Time A vence + Time B Over 5.5 cantos | **-** | Se B acumula cantos, esta pressionando A -> reduz prob. de A vencer. |

### 3.4 Eixo tempo, placar exato e props

| Par | Sinal | Observacao |
|---|---|---|
| Over 1.5 1o tempo + BTTS Sim | **+** | Mesma tese de jogo rapido. |
| Over 1o tempo + 1o gol em banda cedo (0-15) | **+** | Mesma tese. |
| 0-0 + Under 2.5 + BTTS Nao | **++** | Todos descrevem o mesmo cenario de poucos gols. |
| 0-0 + Over 1.5 | **--** | Impossiveis juntos. |
| Placar 2-0 mandante + Mandante vence + BTTS Nao + Under 3.5 | **++** | Mesmo cenario (vitoria magra a zero). |
| Scorecast (X marca 1o, 2-1) + X marca a qualquer momento | **--** | Redundante; a casa barra. |
| Penalti Sim + Over gols / BTTS | **+** | Penalti adiciona gol e abre o jogo. |
| Penalti Sim + artilheiro = cobrador titular | **+** | Penalti -> quem bate marca. |
| Under gols + Penalti Sim | **-** | Penalti tende a abrir o placar. |
| Jogador 2+ gols + Under 2.5 jogo | **--** | Quase contraditorio. |
| Posse dominante do time A + Over desarmes de jogador do time A | **-** | Quem tem a bola desarma menos. |
| Gol de fora da area + Under chutes / bloco baixo passivo | **--** | Quase nao chuta de longe. |

---

## 4. Conexao da camada de contexto/motivacao a cada cluster

A camada `contexto-motivacao-fatores` e a "variavel explicativa" por tras de todos os eixos. A tabela abaixo amarra cada **fator de contexto** ao **cluster de mercados** que ele move e a **direcao**.

| Fator de contexto | Eixo dominante | Cluster de mercados puxado | Direcao | Solidez |
|---|---|---|---|---|
| **Desespero / decisao (precisa do resultado)** | SG + T + atrito | gols Over, BTTS Sim, escanteios Over, cartoes Over, handicap do motivado | ↑ | mecanismo forte, magnitude variavel |
| **Decisao unilateral (favorito desligado x desesperado)** | SG | Empate/+handicap do lutador, Under, X | a favor do motivado | armadilha de publico (so olha reputacao) |
| **"Nada em jogo" (ja salvo, sem objetivo)** | T + atrito | Under, escanteios Under, cartoes Under | ↓ | **bimodal**: pode virar festa de gols se elenco joga solto |
| **Pressao alta x bloco baixo** | T + atrito | Over (~2,4 gols), escanteios medio-alto, cartoes do pressor | ↑ | forte |
| **Dois blocos defensivos** | T + SG | Under, BTTS Nao, X, Empate-HC, placares baixos | ↓ gols, ↑ empate | forte |
| **Posse + largura** | territorio | escanteios Over (Over Team Corners), passes do volante | ↑↑ cantos | forte (driver direto) |
| **Contra-ataque** | territorio | escanteios Under, mas SoT por chute do ponta pode subir | ↓ cantos | forte |
| **Arbitro rigido + dois times faltosos** | atrito | cartoes Over, booking points Over | ↑↑ | forte (range de arbitro e real e domina a lambda) |
| **Vento forte (>~25 km/h)** | T + SG | Under, BTTS Nao, +handicap do zebra, Under SoT | ↑ Under | **forte** (fator climatico dominante) |
| **Chuva forte** | T | Under (leve) | ↓ gols leve | **fraco/contestado** — nao usar como edge |
| **Gramado pesado** | T + atrito | Under gols + Over cartoes (coexistem) | ↓ gols, ↑ cartoes | moderado |
| **Altitude (visitante sobe)** | SG + T(2o tempo) | mandante 1X2, handicap mandante, Over 2o tempo, gols tardios | ↑↑ mandante | forte |
| **Mando de campo** | SG + territorio | 1X2 mandante, escanteios mandante, leve Over | ↑ mandante (parte e torcida/arbitragem) | real mas **encolhendo** |
| **Calendario / pos-meio-de-semana** | T | Under (recorte estreito: time mediano + viagem + fora + sem rodizio) | ↑ Under | **mecanismo plausivel, edge NAO comprovado** para elite |
| **Derby/rivalidade** | atrito + T | Over cartoes (ja precificado), X, Under HT + Over FT, vermelho Sim live | ↑ cartoes/empate | direcao forte; Over "na cara" ja na linha |
| **Reverse line movement (RLM)** | qualquer | lado que a linha favorece (vs publico) | siga a linha | gatilho de atencao, nao certeza |
| **VAR ativo** | atrito | penalti Sim, vermelho/cartoes, viradas (penalti destrava placar) | ↑ | forte (La Liga +32,7% penaltis concedidos) |
| **Motivacao de golear (saldo decisivo)** | SG | -2/-3 do favorito, Margem 3+ | ↑ margem | situacional |

> **Regra do alinhamento (do dossie de contexto):** nenhum fator isolado decide. O Over de cartoes so e valor quando **os dois times E o arbitro** alinham; dois times agressivos com arbitro caseiro podem dar **zero cartao**. Sempre cruze fatores antes de empilhar pernas que "deveriam" correlacionar.

---

## 5. Cenarios de jogo arquetipicos e o pacote de mercados com valor

Doze arquetipos. Para cada um: a leitura de contexto, o **pacote** que tende a ter valor (pre-jogo), o que **evitar**, e o gatilho **live**.

### Cenario 1 — Favorito de posse atropelando bloco baixo aberto
*Contexto:* favorito tecnico, mando, adversario sem motivacao defensiva ou com defesa vazada; clima bom.
- **Pacote:** Favorito -1, Over 2.5, Over Team Corners do favorito, Margem 2+, ATGS da referencia, Vencer/Marcar nos dois tempos.
- **Evitar:** -2/-3 sem razao de blowout (modal e vitoria por 1-2), BTTS Sim (o fraco pode colapsar a zero).
- **Live:** se favorito faz cedo e **administra**, migra para Empate-HC e Under do restante.

### Cenario 2 — Favorito que domina posse mas converte pouco (trap do -1)
*Contexto:* favorito de posse esteril contra defesa de bloco baixo organizada (xGA do zebra <1,0/jogo).
- **Pacote:** **Empate-Handicap (-1)**, +1 do zebra, Under 3.5, Correct Score 1-0/2-1, DC do azarao defensivo.
- **Evitar:** o -1 "obvio" que o publico empilha (vitoria por 1 = Empate-HC = -1 perde).
- **Live:** lay do -1 caro apos 1-0 do gestor que recua.

### Cenario 3 — Jogo equilibrado de poucos gols (dois blocos / dois times parelhos)
*Contexto:* duas defesas solidas, ataques medianos, sem mando dominante.
- **Pacote:** Under 2.5, BTTS Nao, X (empate, ciente da margem inflada), Empate-HC, +handicap, placar 0-0/1-0/1-1, Par.
- **Evitar:** Over, BTTS Sim, -1 de qualquer lado, viradas HT/FT.
- **Live:** back 0-0 cedo / lay a saida do gol; lay 0-0 ao HT (74-75% de gol no 2o tempo).

### Cenario 4 — Decisao / mata-mata cauteloso (medo de perder)
*Contexto:* jogo de gestao de risco, ida de eliminatoria, "so precisa do empate".
- **Pacote:** Under, BTTS Nao, Empate-HC/+handicap, Under 1o tempo, Over cartoes (faltas taticas + tensao — checar arbitro), 0-0/1-0.
- **Coexistencia chave:** **Under gols + Over cartoes** — valida, nao contraditoria.
- **Evitar:** Over 1o tempo (times se estudam), Margem grande, Vencer os dois tempos.
- **Live:** vermelho Sim e cartao tardio em jogo apertado; ir aos penaltis (Sim) se prorrogacao 0-0 entre forcas equilibradas.

### Cenario 5 — Derby / classico
*Contexto:* atmosfera intensa, mais faltas, inicio travado que abre depois.
- **Pacote:** **Under HT + Over FT** (builder ideal, nao Over linear — ~65% dos grandes derbies passam de 2.5 apesar do inicio lento), X, cartoes nas **pernas que o livro nao inflou** (1o tempo Under, lado do visitante, faixas), vermelho Sim live.
- **Evitar:** Over cartoes "na cara" (ja precificado), tratar derby como Over de gols automatico.
- **Live:** apos os ~20 min o jogo destrava -> Over do restante; temperatura subindo -> 2o vermelho.

### Cenario 6 — Time obrigado a atacar (perde no agregado / precisa vencer)
*Contexto:* time empurrando a partir de certo momento; adversario segura.
- **Pacote:** Over escanteios (2o tempo, min 70-90), Over Team Corners do time que ataca, cartoes do time que segura, Over gols tardios (76-90), Race to X de escanteios, BTTS Sim (o que segura tende a se expor).
- **Evitar:** Under escanteios, apostar contra o cluster de pressao tardia.
- **Live:** "Over live de escanteios com linha atrasada" entre min 70-75; "mais um cartao" no fim.

### Cenario 7 — Vento forte / campo pesado
*Contexto:* vento >25 km/h (dominante) ou gramado encharcado; time tecnico perde vantagem.
- **Pacote:** Under, BTTS Nao, +handicap do zebra, Empate-HC, Under SoT, placares baixos; se gramado pesado, **+ Over cartoes** (jogo fisico).
- **Evitar:** -1/-2 do favorito tecnico, Over, edge construido sobre **chuva** isolada (efeito ~nulo).
- **Live:** confirmar com os olhos antes de pressupor Under so pela previsao.

### Cenario 8 — Mandante de altitude (visitante de nivel do mar)
*Contexto:* Quito/La Paz e similares; visitante quebra apos o min 60.
- **Pacote:** 1X2 mandante, handicap do mandante, Over 2o tempo / proximo gol do mandante, gols tardios, Margem do mandante.
- **Evitar:** subestimar o efeito (real e robusto, +29 a +45 p.p.); superestimar **viagem pura** (quase morta hoje).
- **Live:** apos o min 60, Over 2o tempo / proximo gol do mandante e a jogada-rei.

### Cenario 9 — Pressao alta dos dois lados (jogo aberto de elite)
*Contexto:* dois times de PPDA baixo, transicoes, espaco nas costas.
- **Pacote:** Over 2.5/3.5, BTTS Sim, Over escanteios, Over cartoes (faltas no pressing), Over SoT dos dois lados, 1o gol cedo, Race to 2 rapido.
- **Evitar:** Under, +handicap conservador, Empate-HC.
- **Live:** big chances desperdicadas + 1.0 DA por minuto = gol iminente -> Over.

### Cenario 10 — Mismatch obvio (top x lanterna) com risco de nao-blowout
*Contexto:* favorito enorme, mas adversario profissional que limita a derrota, ou favorito sem motivacao/rodando elenco.
- **Pacote:** **+1/+1.25 do zebra** (frequentemente generoso), Empate-HC, Under do que o publico espera; se ha razao de blowout (saldo decisivo, defesa em frangalhos), entao -1.5/-2 e Margem 3+.
- **Evitar:** -1.5/-2.0 "dinheiro facil" ancorado em xG inflado; ATGS na estrela obvia (odd esmagada — buscar marcador secundario).
- **Live:** se favorito abre cedo e administra, +handicap do zebra inflado tem valor.

### Cenario 11 — Pos-meio-de-semana / congestao (a "teoria da ressaca" do Joao)
*Contexto:* time importante na quarta + jogo fora no fim de semana. **Atencao a calibracao:** para times de **elite** a literatura **refuta** o fade de performance (Kitman 20 anos, PMC7846542). O angulo so sobrevive em **recorte estreito**: time **mediano**, viagem longa, fora de casa, **sem rodizio**.
- **Pacote (so no recorte estreito):** Under, +handicap/DNB do time descansado, Margem pequena, X2/1X defensivo, Under de SoT/passes do time cansado.
- **Evitar:** tratar como edge geral (e folclore para grandes clubes); comprar o "European hangover" automatico.
- **Live:** so apostar Under se o pressing **sumiu visivelmente** em campo — confirmar com os olhos, nao pelo calendario.

### Cenario 12 — Cegueira de placar (0-0 ao intervalo com xG alto)
*Contexto:* 0-0 ao HT mas xG combinado >1,0; o mercado precifica pelo placar, nao pela pressao.
- **Pacote (live, a jogada-rei da familia temporal):** Over 1.5 do restante / Over 2o tempo entre min 50-60, lay 0-0 ao HT, Over da janela 61-75/76-90, next team to score do lado que pressiona.
- **Base:** 0-0 ao HT -> ~74-75% de gol no 2o tempo **mesmo sem pressao**; com xG alto acumulado, passa de 80%.
- **Evitar:** ler "0-0 ao HT" como "jogo fraco" (e trap para o mercado, EV para voce).

---

## 6. Regras de bolso da malha de correlacoes

- **Combine pernas que o MESMO fator empurra na mesma direcao** (vento -> Under + BTTS Nao; derby -> Over cartoes + Under HT; supremacia -> -1 + Over). A casa subestima a correlacao real -> desconto a seu favor.
- **O EV residual do builder vive nas celulas `0`** (resultado + cartoes/escanteios): correlacao baixa, desconto pequeno (5-20%), pouco redundante. Mas margem composta de 4 pernas esconde **20-30%** — exija edge por perna.
- **Under + Over cartoes / Under + Over escanteios NAO sao contradicao** (jogo travado e faltoso/pressionado). Sao as excecoes uteis a regra "Under contradiz Over".
- **Empate-HC = vitorias por exatamente 1 gol (~38%)**; correlaciona com Under 3.5, +handicap, 1-0/2-1 — e o "lado esquecido" subprecificado em ligas defensivas.
- **+1 (handicap europeu) = X2 (dupla chance) = mesmo desfecho, mesma odd justa** — pegue o lado mais frouxo entre casas, nao assuma que o handicap paga mais.
- **Cartoes e escanteios sao quase ortogonais ao placar** — use-os para diversificar o builder, nao para reforcar a tese de gols.
- **Vermelho redefine SG e T ao mesmo tempo** — e o unico evento que move todos os eixos de uma vez; direcao depende de quem e quando (1o tempo move; 2o tempo quase nao).
- **No bet builder, "cair na linha" do handicap europeu MATA a acca** (vira Empate-HC = lado perdedor); no asiatico apenas anula a perna. Diferenca material em multipla.
- **Correlacao negativa mal precificada rende mais como SIMPLES SEPARADAS** (hedge natural) do que dentro do mesmo builder.
- **Calibracao acima de folclore:** descanso "62%", chuva "-17%", ressaca de meio-de-semana como edge geral — sao mecanismos plausiveis, **nao** edges comprovados. Use-os como filtro de atencao, nao como regra automatica.

---

## Fontes

Esta sintese deriva integralmente dos dossies de mercado deste diretorio (`docs/mercados/`), que carregam suas proprias fontes primarias e secundarias:

- `contexto-motivacao-fatores.md` — camada fundacional (fatores situacionais, RLM, altitude, calendario, derby, vento).
- `over-under-gols.md`, `ambas-marcam-btts.md`, `placar-exato-scorecast.md`, `parciais-tempo.md` — eixo de total (T) e Poisson/Dixon-Coles.
- `resultado-1x2.md`, `derivados-resultado.md`, `handicap-asiatico.md`, `handicap-europeu.md` — eixo de supremacia (SG) e o nucleo SG/T do apendice asiatico.
- `escanteios.md`, `cartoes.md`, `jogadores-props.md`, `penalti-expulsao-eventos.md` — eixo de atrito/territorio e eventos.
- `especiais-betbuilder.md` — mecanica de correlacao, copula gaussiana, desconto por tipo de combo, margem composta.
