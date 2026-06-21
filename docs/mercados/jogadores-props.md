---
mercado: jogadores-props
titulo: Props de Jogadores
---

# Props de Jogadores

> Documento de referência neutro e global (sem viés de liga). Cobre os submercados de props individuais de jogador no futebol masculino: marcador (a qualquer momento / 1º / último), 2+ gols / hat-trick, chutes e chutes ao gol O/U, assistências, desarmes, faltas, passes, cartões e booking points. Foco máximo nas correlações com o jogo e em como xG/xA individuais e papel tático predizem cada linha.

---

## 0. Mapa da família

Props de jogador são apostas sobre o desempenho **individual** de um atleta, independentemente (na maioria dos casos) do resultado do jogo. Dividem-se em duas grandes naturezas estatísticas, e essa distinção governa tudo o que vem depois:

| Natureza | Submercados | O que importa | Previsibilidade |
|---|---|---|---|
| **Evento binário/raro** (acontece ou não, baixa frequência) | Marcador a qualquer momento, 1º marcador, último marcador, 2+ gols, hat-trick, assistência | Finalização, sorte, posição na hierarquia ofensiva | Baixa (alta variância) |
| **Volume/contagem** (acumula durante 90 min) | Chutes O/U, chutes ao gol O/U, desarmes O/U, faltas O/U, passes O/U, cartões/booking points | Estilo de jogo, papel tático, minutos em campo, fluxo de posse, árbitro | Alta (variância menor) |

**Princípio central:** mercados de **volume** são mais previsíveis e mais ligados ao *contexto tático* do jogo (estilo, posse, mando), enquanto mercados de **gol** são dominados por *finishing variance* e hierarquia (quem bate pênalti, quem é o referência). O EV+ tende a viver mais nos mercados de volume e nas situações de *role-change* (mudança de função) nos mercados de gol.

---

## 1. Definição e regras de liquidação (settlement) por submercado

As regras abaixo refletem o padrão de mercado (Opta como árbitro de dados na maioria das casas: bet365, Betfair, Sky Bet, Paddy Power, DraftKings). Sempre confirme o regulamento da casa específica — há divergências, principalmente na regra de "void se não jogar".

### 1.1 Marcador a qualquer momento (Anytime Goalscorer — ATGS)

- **Regra:** o jogador precisa marcar em qualquer momento do **tempo regulamentar (90 min + acréscimos)**. Prorrogação e pênaltis **não** contam, salvo mercado específico de "incluindo prorrogação".
- **Gol contra NÃO conta.** Você está apostando que o jogador marca *para o seu time*. Um gol contra é ignorado para fins de liquidação.
- **Void se não participar:** se o jogador **não entra em campo**, a aposta é anulada (void / stake devolvido). Critério-chave: para ATGS e último marcador, o jogador é considerado participante se entrar **a qualquer momento** dentro dos 90 min + acréscimos (inclusive como substituto no último minuto). Isso é uma fonte de "valor de borda" — ver §3.
- **Caso de borda — só houve gols contra:** se o(s) único(s) gol(s) do jogo for(em) contra, mercados de "próximo a marcar" são liquidados pelo próximo gol válido; havendo apenas gols contra, algumas casas liquidam pela odd de placar exato no kick-off.

### 1.2 Primeiro marcador (First Goalscorer — FGS)

- **Regra:** o jogador deve marcar o **primeiro gol válido** da partida.
- **Gols contra são ignorados** na contagem de "primeiro": se o 1º gol do jogo é contra, ele não conta e o **próximo gol regular** define o primeiro marcador.
- **Regra de devolução clássica (push parcial):** se o jogador **entra antes** do primeiro gol ser marcado, a aposta segue válida; se ele **só entra depois** de o primeiro gol já ter sido marcado, muitas casas **anulam** (void) a aposta de FGS — você não pode ser primeiro marcador num gol que aconteceu antes de você entrar.
- **Promo "Substitute Guarantee / Sub On, Play On" (bet365 e similares):** quando o jogador entra **depois** do 1º gol e você fez um FGS *each-way*, alguns livros **devolvem a parte "place"** do each-way em créditos de aposta em vez de simplesmente anular. Esse mecanismo altera o EV prático de FGS each-way e merece atenção: muda o que parece um void puro num retorno parcial. Confirmar sempre se a promo está ativa para o mercado/jogo. (aceodds; bet365)
- **Odds maiores que ATGS:** por construção é mais raro marcar o *primeiro* do que marcar *a qualquer momento*.

### 1.3 Último marcador (Last Goalscorer — LGS)

- **Regra:** o jogador marca o **último gol válido** do jogo. Gol contra ignorado. Participação a qualquer momento qualifica (o jogador só precisa estar em campo a qualquer instante dentro dos 90'+acréscimos).
- É efetivamente o "espelho" do FGS — mesma raridade, odds da mesma ordem.

### 1.4 2+ gols / Hat-trick

- **2+ gols (brace):** jogador marca **dois ou mais** gols válidos (gols contra não contam). Pênaltis em tempo normal contam.
- **Hat-trick:** **três ou mais** gols válidos. Odds longas; mercado de altíssima variância.
- Em algumas casas, "to score 2 or more" inclui pênaltis convertidos; **disputa de pênaltis pós-jogo nunca conta**.

### 1.5 Chutes (Total Shots) O/U

- **Definição (Opta):** tentativa intencional de marcar. Inclui chutes ao gol, chutes para fora, chutes bloqueados e chutes na trave.
- **Linhas típicas:** 0.5, 1.5, 2.5, 3.5 (atacantes/criadores).
- **Push:** com linhas .5 não há push. Em linhas inteiras (raras nesse mercado) o valor exato gera push (stake devolvido).

### 1.6 Chutes ao gol (Shots on Target — SoT) O/U

- **Definição (Opta) — o ponto mais incompreendido:** tentativa clara de marcar que (a) **entraria no gol** se não fosse defendida pelo goleiro, **ou** (b) é parada pelo **último homem** (last-man block) com o goleiro sem chance — e, claro, o próprio gol marcado conta como SoT.
- **NÃO conta como SoT:**
  - **Chute bloqueado** por um jogador que **não é o último homem** (block "normal"). Ainda que o chute fosse na direção do gol, se há cobertura atrás, é "blocked shot", não SoT.
  - **Bola na trave/travessão** (woodwork) que não entra → não é SoT (é "hit woodwork").
  - Chute que ia para fora/por cima.
- **Deflexão:** se o chute é desviado e mesmo assim vai no gol ou é defendido pelo goleiro, **conta como SoT** (e não se credita "block"), desde que a trajetória original/efetiva fosse no alvo. Se o desvio joga para fora uma bola que ia pra dentro, não conta.
- **Gol conta como SoT** sempre (incluindo de pênalti, na maioria das casas — confirmar).
- **Pênalti no mercado de SoT (detalhe de liquidação):** se um pênalti volta da trave/goleiro e é **tocado de novo** (rebote) antes do gol, o pênalti em si conta como "miss" (não SoT) e o rebote é avaliado como chute separado; um pênalti **mandado a repetir** (retaken) **não conta** para a estatística do batedor. Importante ao montar under/over de SoT de um batedor habitual. (Sky Bet match stat markets)
- **Settlement por Opta oficial.** Divergência entre casas: a regra **dominante** para o mercado "anytime/volume" é a de **void apenas se o jogador NÃO participar** — se ele entra como reserva dentro dos 90'+acréscimos, a aposta **vale** (bet365, Betfair, Sportsbet confirmam). **Apenas algumas casas/mercados** exigem titularidade para a aposta valer. Antes de apostar "under" baseado em rotação, verifique de que lado está a casa — mas saiba que o padrão é "vale se pisar em campo", não "void se não for titular".

### 1.7 Assistências O/U (ou "to assist")

- **Definição (Opta):** **último passe/ação** que leva diretamente a um gol. O criador recebe a assistência mesmo que o atacante faça mais de um toque, desde que o gol resulte diretamente da ação.
- **Rebote CRIA assistência:** pela Opta, quando o gol sai **direto de um rebote** do goleiro, da trave ou de um bloqueio defensivo após um chute, o **jogador que chutou antes** ganha a assistência. (theanalyst.com)
- **Deflexão pesada ANULA assistência:** se a bola sofre **deflexão substancial** em adversário antes do gol, a assistência pode ser **anulada** (a bola não chegou "diretamente"). É o caso simétrico do rebote: rebote credita, deflexão pesada cancela.
- **Pênalti/falta sofridos (corrigindo o erro comum):** pela definição Opta, o jogador que **SOFRE** o pênalti ou a falta **GANHA a assistência** se o gol sair direto da cobrança — **desde que ele próprio NÃO seja o batedor**. Se o mesmo jogador sofre e cobra, **não há assistência**. (theanalyst.com; statsperform.com)
- **Liquidez baixa** — mercado mais estreito, margens maiores.

### 1.8 Desarmes (Tackles) O/U

- **Definição (Opta):** um *tackle* é o evento em que o jogador disputa a bola com um oponente na tentativa de tirá-la. **No dado bruto Opta, o evento "tackle" registra tanto o resultado *won* quanto *lost* — ambos contam como tackle.** "Tackles won" é um **subconjunto** (só os bem-sucedidos), não o default. A **casa escolhe** qual variante usa para liquidar (tackles totais vs. apenas tackles won) — sempre confirme no regulamento qual definição está em vigor, porque isso muda a linha. (theanalyst.com)
- Mercado niche, settlement por Opta.

### 1.9 Faltas (Fouls Committed / Fouls Drawn) O/U

- **Faltas cometidas:** infrações marcadas contra o jogador pelo árbitro.
- **Faltas sofridas (drawn):** infrações sofridas pelo jogador.
- Settlement por dados oficiais. Cartão e falta são mercados distintos (um cartão não exige falta — pode ser por reclamação/tempo).

### 1.10 Passes (tentados / completos) O/U

- **Definição (Opta):** a estatística-base é o **passe tentado**; "completude" (pass completion %) é uma **razão derivada** (completos ÷ tentados). Linhas comuns no formato "50+/60+/70+ passes" ou O/U.
- **Confirmar sempre** se a casa liquida por "passes completos" ou "passes tentados" — o primitivo Opta é o **tentado**, mas operadores variam. A distinção muda drasticamente a leitura para volantes em time pressionado (mais passes tentados, porém menos completos sob *high press*).

### 1.11 Cartões de jogador / Booking points

- **Cartão de jogador (contagem):** aposta em o jogador X receber cartão (amarelo/vermelho) no jogo.
- **Regra de TEMPO (crucial e frequentemente ignorada):** o cartão é liquidado pelo **minuto em que o árbitro MOSTRA o cartão**, não quando a falta ocorreu. Em incidente que gera **2+ cartões**, vence/é considerado primeiro o jogador que **recebe o cartão primeiro**. Isso é decisivo para mercados de "tempo do cartão" e "1º jogador a ser cartonado" dentro de SGPs. (bet365 card markets; paddypower)
- **Booking points (submercado correlato):** muitos livros precificam **pontos de cartão** em vez de contagem simples — convenção típica: **10 pontos por amarelo, 25 por vermelho**. A leitura de valor muda: um segundo amarelo que vira vermelho **conta de forma diferente entre casas** (algumas somam 10+25 = 35 no mesmo jogador; outras tratam o vermelho-por-2º-amarelo como 25, ou apenas 10+15). Sempre conferir a tabela de pontos e a regra de "2º amarelo → vermelho" da casa antes de modelar.
- Ligado ao árbitro (ver §4.4): o ambiente de cartões do jogo é o maior driver desse submercado.

---

## 2. Como a odd/margem se forma (pricing, juice, movimento de linha)

### 2.1 Da probabilidade à odd

A base de pricing de gols é a **distribuição de Poisson** aplicada ao **xG individual** esperado do jogador no jogo:

1. Estima-se o **λ (lambda)** = gols esperados do jogador na partida (função do xG/90 histórico, minutos esperados, força defensiva do adversário, mando).
2. Probabilidade de **não marcar** = `P(0) = e^(-λ)`.
3. Probabilidade de **marcar pelo menos 1 (ATGS)** = `1 - e^(-λ)`.
4. Probabilidade de **2+** = `1 - P(0) - P(1)` etc.

**Exemplo numérico (ATGS):**
- Centroavante com λ = 0,55 gol esperado no jogo.
- `P(0) = e^(-0,55) ≈ 0,577` → P(marcar ao menos 1) ≈ **42,3%** → odd justa ≈ **2,36**.
- Com 2+: `P(1) = 0,55·e^(-0,55) ≈ 0,317`; `P(2+) = 1 - 0,577 - 0,317 ≈ 10,6%` → odd justa ≈ **9,4**.

Para mercados de **volume** (chutes, SoT, desarmes, passes, faltas), usa-se Poisson (ou binomial negativa, que modela melhor a dispersão real) sobre a **média esperada da contagem**. Ex.: jogador com média 1,3 SoT/jogo → distribuição em torno de 1,3 → `P(≥2)` define a linha "over 1,5".

**Mercados FGS/LGS** não saem direto de Poisson de time: a casa pondera a probabilidade de marcar pela **fatia de gols do time** que o jogador costuma fazer e pela ordem temporal — por isso FGS/LGS são notoriamente difíceis de modelar e costumam ter **margem altíssima** (ver §2.2).

### 2.2 Margem (overround / juice) típica

| Mercado | Margem típica | Por quê |
|---|---|---|
| Resultado 1X2 / Over-Under gols | ~3–6% | Alto volume, alta competição, bettors sensíveis a preço |
| ATGS (marcador a qualquer momento) | ~6–12% (frequente >100% somando todos os jogadores) | Mercado popular mas derivativo; livro de marcadores soma overround alto |
| **FGS / LGS** | **extremamente alta** — o livro completo pode somar **150–200%+**, com casos documentados **acima de 200%** (ex.: over-round de ~206% num livro de FGS Arsenal/Chelsea numa casa de Reino Unido; guias citam 15–40% **por jogo**) | Difícil de modelar, dezenas de seleções, baixíssima sensibilidade a preço. É **dos mercados mais caros que existem** (football-bookie.com; bet.report) |
| Chutes / SoT / desarmes / faltas / passes (props de volume) | ~7–12%+ | Niche/derivativo, menos pressão competitiva, bettors menos sensíveis |
| Assistências | alta + baixa liquidez | Mercado estreito |
| Cartões de jogador / booking points | ~8–15%+ | Niche, fortemente dependente do árbitro, pouca pressão de preço |

**Regra geral:** a casa aplica **margem baixa nos mercados visíveis e líquidos** e **margem alta nos derivativos/niche**. Props de jogador (especialmente FGS/LGS, assistências, desarmes, faltas, cartões) estão na ponta cara.

### 2.3 Como a linha se move

- **Notícias de escalação** (1h antes): a maior alavanca. Titularidade confirmada, quem bate pênalti, quem cobra escanteios/faltas — tudo reprecifica ATGS, SoT, assistências e passes.
- **Dinheiro "smart"** em props ainda movimenta menos que nos mercados principais (limites menores), então **linhas de prop demoram mais a corrigir** — fonte estrutural de valor.
- **Clima/gramado e contexto** (ver §4) entram no λ e empurram linhas O/U.
- Em mercados de volume, a linha O/U pode se manter e o **preço** (vig em cada lado) se ajustar conforme o fluxo.

---

## 3. Tips e ângulos de valor (onde mora o EV+)

### 3.1 Ângulos estruturais (valem para vários submercados)

1. **Mercados de volume > mercados de gol para consistência.** SoT e chutes medem *volume*, não *finishing*; têm variância menor e a casa precifica com menos dados públicos. "Target shots on target over goals" é o conselho recorrente dos guias profissionais.
2. **Role-change não precificado.** Quando muda quem bate **pênalti**, quem cobra **faltas/escanteios**, ou quem é o **referência ofensiva** (lesão do titular), a linha de ATGS/SoT/assistência frequentemente **não acompanha** rápido. O batedor de pênalti carrega uma probabilidade extra de gol por jogo em qualquer partida onde um pênalti pareça provável.
3. **xG individual vs. gols reais (regressão à média).** Jogador com **alto xG acumulado e poucos gols** (azar) tende a converter — valor em ATGS. O inverso (gols >> xG) tende a esfriar — fade. Use **médias móveis de 5–10 jogos**, não a temporada inteira, e nunca um único jogo (pênalti/expulsão distorcem).
4. **xA individual para assistências.** Criador com **xA alto e poucas assistências** é candidato prime ao mercado de assistências: os companheiros "devem" começar a finalizar as chances que ele cria.
5. **Hit-rate recente > média sazonal.** Use janela de **6–8 jogos** e cheque o split por adversário/local.
6. **Borda de void/participação.** Em ATGS/LGS, como entrar a qualquer momento qualifica o jogador, supersubs e atacantes que sempre entram têm valor "real" maior do que a odd sugere se você ajustar minutos esperados.
7. **Faltas/cartões: alvo nos enforcers e nas vítimas.** Volantes e laterais com alto "Fouls Per 90" (ex.: Casemiro, João Palhinha) para *over de faltas/cartão*; e o **over de faltas sofridas** em pontas driblantes com alto "Fouls Drawn Per 90" (ex.: Grealish, Vinícius Jr., Zaha).
8. **Passes: volante de time de posse contra time de pressão.** Volante criador num time dominante (Rodri, Declan Rice fazem 60–90+ passes/jogo) tende ao *over*; ainda mais se o adversário **pressiona alto** (mais bola precisa ser tocada para furar a pressão — mas atenção: se o mercado liquida por passes *completos*, a pressão alta pode derrubar a completude). Cuidado se a linha já está cara.

### 3.2 Quando o mercado costuma estar mal precificado

- **Props de jogadores de times pequenos** (atacante bom em time ruim): casa subestima o **volume** de chutes/SoT porque ancora no resultado provável de derrota. Atacante isolado num time que se defende ainda chuta de longe e em contra-ataques.
- **Underdogs em mercados de cartão/falta:** o time com menos posse **desarma e falta mais** — over de faltas/cartões do lado do azarão.
- **Jogos sem importância vs. decisões:** a casa nem sempre ajusta intensidade (ver §4).

### 3.3 Tip estrutural anti-SGP

- **Combinar props correlacionadas paga menos que o EV verdadeiro.** O *hold* (vig efetivo) de um Same-Game Parlay chega a **>20%**, contra **~5%** numa aposta simples. Antes de transformar uma leitura em SGP, pergunte se a **correlação positiva real** entre as pernas supera essa taxa — frequentemente o single tem mais EV. Detalhe completo em §7. (wizardofodds.com)

---

## 4. Correlações com o jogo (o coração do dossiê)

Para cada característica do jogo, indicamos **qual submercado ela puxa e em que direção**.

### 4.1 Estilo de jogo (posse vs. contra-ataque vs. pressão alta)

| Característica | Efeito no mercado |
|---|---|
| **Time de posse dominante** | ⬆️ **Passes** do(s) volante(s)/zagueiros (60–90+); ⬆️ **chutes/SoT** dos atacantes (volume de finalização); ⬆️ **assistências** dos criadores. ⬇️ **desarmes** do próprio time (tem a bola) mas ⬆️ desarmes do adversário. |
| **Contra-ataque / bloco baixo** | ⬇️ **passes** e ⬇️ **chutes** dos jogadores defensivos; ⬆️ **desarmes/faltas** (recupera bola defendendo); pode ⬆️ **SoT por chute** do ponta veloz que finaliza transições com qualidade. |
| **Pressão alta (high press)** | ⬆️ **faltas** (faltas táticas ao perder a bola lá na frente) → ⬆️ **cartões/booking points**; ⬆️ **passes tentados** do adversário sob pressão (mas ⬇️ completados); ⬆️ **desarmes** dos pressionadores. |
| **Jogo aberto / ida-e-volta** | ⬆️ **chutes/SoT/ATGS** dos dois lados; ⬆️ probabilidade de **2+ gols** de referências. |

### 4.2 Ritmo (pace) e total de gols esperado

- **Over de gols esperado alto** (linha de gols 3.0+) ⬆️ **ATGS, 2+, SoT** dos atacantes-chave. ATGS de um centroavante é fortemente correlacionado com o total esperado do *seu* time.
- **Jogo fechado/baixo total** (linha 2.0) ⬇️ ATGS, ⬆️ valor relativo nos **unders de chutes/SoT** e nos mercados defensivos (desarmes/faltas).

### 4.3 Mando de campo

- **Mandante** costuma ter ⬆️ posse, ⬆️ chutes/SoT, ⬆️ ATGS dos atacantes; o **visitante** tende a defender mais → ⬆️ desarmes/faltas/cartões dos seus defensores.
- O batedor de pênalti **mandante** tem leve bônus (mais pênaltis tendem a sair a favor de mandantes; tendência estatística, não regra).

### 4.4 Perfil do árbitro

- **Cartões/faltas são fortemente dependentes do árbitro.** Árbitro com média **4,5+ amarelos/jogo** = ambiente de *over* de cartões/booking points; média ~2,8 = *under*. Isso transborda para props de **falta/cartão de jogador**: o mesmo zagueiro recebe amarelo com probabilidade bem maior sob um árbitro rigoroso.
- Árbitro "deixa jogar" ⬇️ faltas marcadas (mesmo com mesmo nível de contato) ⬇️ cartões.

### 4.5 Clima / gramado

- **Chuva/campo pesado/vento** ⬆️ erros e ⬇️ precisão → tende a ⬇️ **SoT** (chutes menos limpos), ⬆️ **faltas/desarmes** (disputa mais física), ⬇️ **passes completos** de times de posse (jogo mais direto). Empurra para **unders** em SoT/passes e **overs** em faltas.

### 4.6 Calendário / cansaço (rotação)

- **Rodízio** → titular pode começar no banco (risco de **void** ou **under** garantido em SoT/passes; lembre que o void de volume só ocorre se o jogador **não participar**, então um titular poupado que entra no 2º tempo costuma **valer** a aposta, em direção ao *under*). "Fade stars in rotation spots" é ângulo clássico — a casa às vezes mantém a linha de uma estrela que vai ser poupada.
- Time **cansado** (jogo no meio de semana + viagem) ⬇️ intensidade de pressão ⬇️ chutes/SoT; pode ⬆️ faltas táticas por não conseguir correr.

### 4.7 Motivação e contexto (decisão, fim de temporada, rivalidade)

- **Derby/clássico/mata-mata:** ⬆️ **faltas e cartões/booking points** (linhas de cartão "infladas" em rivalidades como Man Utd–Liverpool, Arsenal–Spurs); paradoxo do **first-half under de cartões** em derbies (os times "se estudam" no começo). ⬆️ desarmes; jogos mais truncados podem ⬇️ SoT.
- **Jogos sem importância (fim de temporada, vaga decidida):** ⬇️ intensidade ⬇️ cartões/faltas; imprevisível para gols (pode abrir).
- **Briga contra rebaixamento:** ⬆️ cartões/faltas (tensão).

### 4.8 Qualidade defensiva/ofensiva do adversário

- Adversário com **defesa fraca / goleiro reserva** ⬆️ ATGS, SoT, 2+ do atacante. "Se um time está sem o goleiro titular ou um zagueiro-chave, é boa hora de pegar um atacante adversário para marcar."
- Adversário que **pressiona e desarma muito** ⬇️ passes completos do criador adversário; ⬆️ faltas no jogo todo.

---

## 5. Indicadores preditivos e como lê-los

| Indicador | Submercado que prediz | Como ler |
|---|---|---|
| **xG individual / xG per 90** | ATGS, 2+, FGS/LGS | Alto xG + poucos gols = candidato a comprar (azar). Use rolling 5–10 jogos; descarte distorção por pênalti. |
| **xA individual / per 90** | Assistências | Alto xA + poucas assistências = comprar criador. |
| **Shots per 90 / SoT per 90** | Chutes O/U, SoT O/U | Base direta do volume. Cheque % de chutes que viram SoT (precisão). |
| **Key passes / Shot-Creating Actions** | Assistências, SoT (de quem recebe) | Volume de criação do passador. |
| **Tackles per 90 / Fouls per 90 / Fouls drawn per 90** | Desarmes, faltas, cartões/booking points | Identifica enforcer (comete) e vítima (sofre). |
| **Passes per 90 + % posse do time** | Passes O/U | Volante de time de posse = base alta. Ajuste pela pressão do adversário e confirme se a linha é por tentados ou completos. |
| **Forma recente (6–8 jogos)** | Todos | Sobrepõe média sazonal; reflete papel/forma atuais. |
| **H2H e split por adversário** | ATGS, SoT, faltas | Alguns matchups sistematicamente geram mais (estilo do oponente). |
| **Escalação / minutos esperados** | TODOS | O input que mais move a linha. Titular vs. reserva vs. supersub. |
| **% de gols do time feitos pelo jogador** | FGS/LGS, ATGS | Quem é a referência da finalização. |
| **Quem bate pênalti / cobra bola parada** | ATGS, FGS, SoT, assistências | Bônus de probabilidade frequentemente subprecificado. |
| **Perfil do árbitro (amarelos/jogo)** | Cartões/booking points, faltas | 4,5+ amarelos/jogo = ambiente de over; "deixa jogar" = under. |

**Leitura combinada (exemplo prático):** ponta com **3,5 xG nos últimos 5 jogos e 0 gols**, **1,8 SoT/jogo**, **titular confirmado**, contra **defesa que concede muito chute** e **goleiro reserva** → forte para **over 1,5 SoT** e valor relativo em **ATGS** (azar deve regredir).

---

## 6. Armadilhas comuns (traps)

1. **Confundir "shots" com "shots on target".** O bloqueio do não-último-homem e a bola na trave **não** são SoT. Apostadores perdem unders/overs por modelar a definição errada.
2. **Inverter a regra de void/participação.** A regra **dominante** é *void só se não participar* — um titular poupado que entra no 2º tempo geralmente **mantém** a aposta de volume válida (e tende ao *under*). Não assuma que "não foi titular = void"; só algumas casas exigem titularidade. Verifique.
3. **Narrativa do "craque marca sempre".** Mesmo elite marca em ~55–60% dos jogos (Haaland-tier); ou seja, **perde 4 em 10**. ATGS de favorito não é dinheiro fácil; a margem do livro de marcadores é alta.
4. **Gols >> xG = comprar o jogador quente.** Costuma ser o pico antes da regressão. O contrário (azarado de xG) é o valor.
5. **Single match xG/SoT.** Um jogo com pênalti ou expulsão distorce. Sempre janela móvel.
6. **Pênalti não precificado ao contrário.** Apostar *over* de SoT/ATGS sem saber que o batedor habitual está fora (ou foi substituído como cobrador) — você está pagando por uma probabilidade que evaporou.
7. **Subestimar atacante de time ruim.** A casa ancora no placar provável; o volume de chutes do isolado persiste.
8. **Chase com FGS/LGS.** O FGS/LGS tem variância e margem altíssimas (livro pode somar 150–200%+); usar para recuperar perdas acelera a destruição da banca.
9. **Cartão ≠ falta.** Cartão pode vir por reclamação/tempo sem falta; modelar um pelo outro engana. E lembre: o cartão liquida pelo **minuto em que é mostrado**, não pela falta.
10. **Derby first-half over de cartões.** Intuitivo, mas times costumam "se estudar" no início — o *under* de 1º tempo às vezes é o valor.
11. **Ignorar a regra de pontos no booking.** Confundir "cartões (contagem)" com "booking points" — e não checar como a casa pontua um 2º amarelo que vira vermelho — distorce o cálculo de EV no mercado de cartões.

---

## 7. Correlação entre mercados (bet builder / same game multi)

### 7.1 O que combina (correlação positiva)

| Combinação | Lógica | Correlação |
|---|---|---|
| **Time A vence + Atacante A ATGS** | "Gols ganham jogos; artilheiros fazem os gols" | Positiva (direção robusta; **magnitude não publicada** para futebol — ver nota) |
| **Jogador 2+ SoT + mesmo jogador ATGS** | Mais SoT = mais chance de gol (mas a casa geralmente bloqueia o caso trivial "marca + 0,5 SoT" por implicação lógica) | Alta |
| **Over de gols + atacante referência ATGS / 2+** | Jogo aberto favorece o finalizador | Positiva |
| **Time domina (vence) + goleiro adversário over saves** | Posse/pressão geram chutes → saves | Positiva |
| **Underdog + over de cartões/faltas dos seus defensores** | Menos bola = mais desarme/falta | Positiva |
| **High press do time + over de faltas/cartões/booking points** | Faltas táticas | Positiva |

> **Nota sobre magnitude:** a única matriz pública de coeficientes de correlação para SGP (Wizard of Odds) é para a NFL (ex.: Team Win × QB 275yds ≈ 0,35; QB yds × Total ≈ 0,42; Team Win × Total ≈ 0,28) e **declara explicitamente que não fornece números para futebol**. Não existe fonte aberta confiável dando um coeficiente para "vitória + ATGS" no futebol — então tratamos isso como **direção positiva fundamentada** (atacante que marca puxa o resultado do time), sem cravar um número. (wizardofodds.com)

### 7.2 O que se contradiz (correlação negativa — evitar no mesmo bilhete)

| Combinação | Por quê é ruim |
|---|---|
| **Atacante A 2+ gols + Under 2.5 gols no jogo** | Quase contraditório |
| **Time A goleia + volante A under de passes** | Goleada confortável muitas vezes reduz, não aumenta, o jogo de toque defensivo (ou o jogador é poupado) |
| **Posse dominante do time A + over de desarmes de jogador do time A** | Quem tem a bola desarma menos |
| **Jogo fechado/baixo total + ATGS de vários jogadores** | Poucos gols não cabem muitos marcadores |

### 7.3 A "taxa de correlação" (correlation tax) — o custo escondido

- Cada perna do bet builder carrega a **margem por mercado (3–7%)**, e isso **compõe**.
- Além disso, a casa aplica um **ajuste de correlação proprietário** (modelos como Gaussian copula): o preço final fica **abaixo** do justo correlacionado.
- **House edge / hold real de um SGP:** o *hold* de um Same-Game Parlay chega a **>20%**, contra **~5%** numa aposta simples. Em pernas correlacionadas e numerosas, o edge composto comumente fica **10–15% em 2 pernas** e pode passar de **25–30% em 8 pernas**. Exemplo citado: um SGP que pagaria +596 (independente) sai a **+400** — a diferença é a taxa de correlação. (wizardofodds.com)
- **Implicação prática:** bet builders são entre os produtos mais lucrativos para a casa. Use-os quando a **correlação positiva real** entre suas pernas for *maior* do que o desconto que a casa cobra — caso contrário, o single tem mais EV.

---

## 8. Fontes de dados para alimentar prognósticos

| Fonte | O que fornece | Custo |
|---|---|---|
| **FBref (dados Opta/StatsBomb)** | xG, xA, shots, SoT, key passes, tackles, fouls, passes — tudo per-90, splits por competição | Grátis |
| **Understat** | xG/xA (modelo de rede neural) dos top-5 ligas europeias; cross-validação com StatsBomb | Grátis |
| **StatsBomb Open Data** | dataset aberto rico em features (educação/pesquisa) | Grátis |
| **WhoScored** | ratings, estatísticas detalhadas por jogo/jogador | Grátis |
| **Transfermarkt** | lesões, suspensões, escalações prováveis, minutos | Grátis |
| **Football-Data.co.uk** | CSVs históricos para construir modelo próprio | Grátis |
| **FootyMetrics** | hit-rates de props + odds ao vivo | Grátis/freemium |
| **Outlier / PropFinder** | ferramentas dedicadas de props (hit-rate, alertas) | ~US$25–49/mês |
| **Opta (provedor oficial)** | fonte de settlement da maioria das casas — entender as definições Opta é entender como você será pago | (via provedores) |

**Workflow recomendado:** FBref/Understat para os números subjacentes (xG/xA, SoT/90, tackles/90, fouls/90) → Transfermarkt para escalação/lesão/minutos → FootyMetrics/ferramenta de props para hit-rate recente e odds → modelar λ (Poisson/binomial negativa) → comparar com a odd da casa para achar EV+.

---

## PLUS) Camada Live (ao vivo)

A leitura de props muda radicalmente quando o jogo começa, porque os inputs (placar, homem a mais/menos, momentum) reprecificam o **λ restante**.

### Gol cedo
- **A favor do meu atacante:** time pode **recuar** e administrar → ⬇️ chutes/SoT/passes ofensivos dele no resto do jogo. *Cuidado com over de SoT comprado antes.*
- **Contra:** time que sofre cedo tende a **se lançar** → ⬆️ chutes/SoT/ATGS dos seus atacantes no restante (over de SoT live pode ganhar valor). O time que **leva** o gol cedo é o que costuma abrir o jogo.
- **Next team to score** vira o mercado live mais limpo para traduzir o momentum imediato.

### Expulsão (red card)
- **Time com um a menos:** ⬇️ posse → ⬆️ **desarmes/faltas/cartões** dos seus defensores (defende muito mais), ⬇️ **passes** dos seus criadores, ⬇️ chutes/SoT/ATGS dos seus atacantes.
- **Time com um a mais:** ⬆️ posse e ⬆️ chutes/SoT/ATGS dos seus atacantes; ⬆️ passes do(s) volante(s). Se a expulsão é cedo, o "over" de SoT do atacante do time numericamente superior fica atraente ao vivo.

### Mudança de placar / momentum
- Quem **perde no fim** entra em "modo all-out" → ⬆️ chutes/SoT, ⬆️ faltas táticas do adversário que segura. Quem **ganha e administra** → ⬇️ volume ofensivo, ⬆️ desarmes/faltas (cera, gestão).
- **Cartão precoce muda o comportamento do jogador:** um zagueiro amarelado **desarma menos** (medo do 2º amarelo) → ⬇️ futuros desarmes/faltas dele, e o **lado dele do campo abre** → ⬆️ chutes/SoT do ponta adversário que ataca por ali.

### Estratégias live específicas
1. **Esperar a escalação real e os 10–15 min iniciais** para ler intensidade/pressão antes de entrar em over/under de volume — o mercado pré-jogo erra a intensidade real.
2. **Pegar o atacante do time que sofreu gol cedo** para SoT/ATGS live (o jogo vai abrir do lado dele).
3. **Faltas/cartões ao vivo em jogos quentes:** fouls e confrontos precoces sinalizam jogo de muitos cartões antes de a linha live ajustar (lembre que o cartão liquida pelo minuto em que é mostrado).
4. **Após expulsão**, atacar imediatamente os mercados de volume do lado numericamente superior antes do ajuste completo.
5. **Cash-out / hedge** num ATGS pré-jogo: se seu jogador acumula SoT mas não marca e o jogo está acabando, o cash-out protege parte do stake — útil quando a variância de finishing está contra você.
6. **Gestão de banca:** props live de gol (FGS/ATGS) têm variância altíssima; nunca usar para "recuperar" — aumenta a variância exatamente quando você precisa reduzi-la.

---

## Resumo executivo (cola)

- **Volume (SoT/chutes/passes/desarmes/faltas/cartões) > gol** para consistência e valor; gol manda em variância e narrativa.
- **Escalação e role-change (pênalti, bola parada, referência ofensiva)** são as maiores alavancas de valor mal precificado.
- **xG/xA individual em janela de 5–10 jogos** acha o azarado a comprar e o quente a fadear.
- **Estilo do jogo move volume:** posse → passes/SoT/assistências; pressão/contra-ataque → desarmes/faltas/cartões.
- **Árbitro define cartões/faltas** (4,5+ amarelos/jogo = over); booking points exigem checar a tabela de pontos da casa.
- **FGS/LGS são dos mercados mais caros** (livro pode somar 150–200%+) — quase nunca compensam para valor.
- **Void de volume: padrão é "vale se pisar em campo"**, não "void se não for titular" — confirme a casa antes de fadear por rotação.
- **Opta define quem é pago:** rebote credita assistência; quem sofre o pênalti ganha a assistência (se não for o batedor); tackle inclui won e lost no dado bruto; o primitivo de passe é o tentado.
- **SGP/bet builders carregam hold de >20% (vs ~5% no single)** — só valem se a correlação positiva real superar o desconto.
- **Ao vivo:** gol cedo abre o jogo do lado de quem sofreu; expulsão concentra volume no lado numericamente superior; cartão muda o comportamento do jogador amarelado.

---

## Fontes

- Paddy Power — Goal Scorer Bets: Types and rules: https://helpcenter.paddypower.com/app/answers/detail/198-goal-scorer-bets-types-and-rules/
- DraftKings — How are Soccer bets settled?: https://support.draftkings.com/dk/en-us/how-are-soccer-bets-settled?id=kb_article_view&sysparm_article=KB0010834
- bet365 Help — Player Goalscoring Markets rules: https://help.bet365.com/s/en/sportsrules/soccer/player-goalscoring-markets
- bet365 Help — Card Markets (Football): https://help.bet365.com/s/en/sportsrules/soccer/card-markets
- Sky Bet — Football Goalscorer Rules: https://support.skybet.com/app/answers/detail/football-goalscorer-rules/
- Sky Bet — Football Match Stat Markets: https://support.skybet.com/app/answers/detail/football-match-stat-markets
- Sky Bet — Opta Football Statistics Definitions: https://support.skybet.com/app/answers/detail/opta-football-statistics-definitions
- Statschecker — Do Own Goals Count in Betting?: https://www.statschecker.com/guides/do-own-goals-count-in-betting
- FootyMetrics — Football Player Props Betting Guide: https://www.footymetrics.com/blog/football-player-props-betting-guide
- Betfair — Opta Definitions: Shots and Shots on Target: https://betting.betfair.com/betfair-announcements/whats-new-on-betfair/opta-definitions-shots-and-shots-on-target-061020-204.html
- Betfair Support — Football: Players Not Starting: https://support.betfair.com/app/answers/detail/10239-football-players-not-starting/
- Caan Berry — What Counts as a Shot on Target?: https://caanberry.com/shots-on-target-betting/
- Caan Berry — Poisson Distribution to Predict Football Scores: https://caanberry.com/poisson-distribution-to-predict-football-scores/
- Squawka — How to Bet on Shots: shots on target guide: https://www.squawka.com/en/bet/guides/how-to-bet-on-shots-a-beginners-guide-to-shots-on-target-betting/
- BettingMaths — Bookmaker Margin Explained: https://www.bettingmaths.co.uk/guides/bookmaker-margin-explained/
- Smarkets — How to calculate Poisson distribution for football betting: https://help.smarkets.com/hc/en-gb/articles/115001457989-How-to-calculate-Poisson-distribution-for-football-betting
- LiveScore — xG in Premier League Betting Explained: https://www.livescore.com/en-gb/betting-sites/strategy/how-to-use-xg-for-premier-league/
- SoccerTipsters — How to Use Expected Assists (xA) in Player Prop Betting: https://www.soccertipsters.com/blog-detail/409/expected-assists-xa-the-secret-stat-for-winning-player-prop-bets.html
- StatsBench — Yellow Card Betting Strategy: https://blog.statsbench.com/football-yellow-card-betting-strategy/
- Oddspedia — How to Bet on Cards: Booking Markets: https://oddspedia.com/insights/guides/how-to-bet-on-cards
- Statz.ai — Player Passes Betting Tips & Stats: https://statz.ai/betting/player-passes
- BetSmart — Soccer Player Props Betting Guide (2026): https://www.betsmart.co/articles/soccer-player-props-betting-guide
- Predictology — Bet Builders vs Single Bets: Correlation Pricing: https://www.predictology.co/blog/bet-builders-vs-single-bets-the-truth-about-correlation-pricing-and-hidden-ev/
- Wizard of Odds — Same-Game Parlays: The Mathematics of Correlation: https://wizardofodds.com/article/same-game-parlays-the-mathematics-of-correlation/
- SportsBettingOddsCalculator — Same Game Parlay Correlation Strategy: https://www.sportsbettingoddscalculator.com/guides/sgp-correlation
- TopBookmakerFootball — First & Anytime Goalscorer Betting Tips: https://topbookmakerfootball.com/articles/first-goalscorer-and-anytime-goalscorer-betting-tips/
- Sportsdatacampus — 14 free football data websites: https://english-programs.sportsdatacampus.com/free-football-data-websites/
- Opta Analyst — Opta Football Stats Definitions (assist, tackle, pass, shot, SoT): https://theanalyst.com/articles/opta-football-stats-definitions
- RulesofSport — What Happens If You Bet on a Player But They Don't Play: https://www.rulesofsport.com/betting/football/what-happens-if-you-bet-on-a-player-but-they-dont-play-in-the-match/
- FootballBookie — First Goalscorer Betting: Analysis and Value Finding Guide: https://football-bookie.com/articles/first-goalscorer-betting/
- Bobs Betting — Extra-Time Is Not Included For Most Goalscorer Bets: https://www.bobsbetting.com/articles/is-extra-time-included-for-goalscorer-bets/
- Outplayed — First Goalscorer Bet Rules Explained: https://outplayed.com/blog/first-goalscorer-bets
