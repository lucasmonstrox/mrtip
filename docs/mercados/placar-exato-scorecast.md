---
mercado: placar-exato-scorecast
titulo: Placar Exato e Scorecast
---

# Placar Exato e Scorecast

> Dossiê neutro e global (sem viés de liga). Foco: como o mercado é definido, liquidado, precificado, e — sobretudo — **o que no jogo move cada placar para cima ou para baixo**. Todos os números citados vêm das fontes listadas ao final; quando uma estatística é de uma liga específica (ex.: Premier League), isso está sinalizado e deve ser tratado como ilustração, não como lei universal.

---

## 0. Mapa da família

Esta família agrupa mercados que apostam na **distribuição conjunta dos gols dos dois times**, não só no total ou no vencedor. Submercados cobertos:

| Submercado | O que você prevê | Nº de resultados típico |
|---|---|---|
| **Placar Exato (Correct Score)** | Gols exatos de cada time no tempo regulamentar (ex.: 2-1) | ~20-30 listados + "Qualquer Outro" |
| **Placar Exato 1º Tempo (HT Correct Score)** | Placar exato ao intervalo | ~10-16 |
| **Scorecast** | Marcador (geralmente 1º a marcar) **E** placar exato final | Centenas (jogador × placar) |
| **Wincast** (primo do Scorecast) | Marcador (a qualquer momento) **E** time vencedor | Dezenas |
| **Timecast** (primo) | Marcador **E** faixa de minuto do gol | Dezenas |
| **Half Time/Full Time** (parente) | Resultado 1X2 ao intervalo **E** no final | 9 |

O motor matemático comum a todos é a **distribuição de Poisson** (e suas correções, como Dixon-Coles), que transforma os gols esperados (λ) de cada time numa matriz de probabilidades de todos os placares.

São **6 submercados** na família (4 centrais — Placar Exato, Placar Exato 1º Tempo, Scorecast e Wincast — mais Timecast e HT/FT como parentes diretos).

---

## 1. Definição e regras de liquidação

### 1.1 Placar Exato (Correct Score)
- **Definição:** acerto do número exato de gols de cada lado no **tempo regulamentar (90' + acréscimos)**. Prorrogação e pênaltis **não contam**, salvo regra explícita do mercado.
- **Gols contra CONTAM** no placar exato — a liquidação segue o placar oficial. Um 2-1 é 2-1 mesmo que um dos gols seja contra (fonte: DraftKings Market Rules; BestCasinoHQ). Esta é a diferença crucial em relação ao mercado de marcador (ver 1.3).
- **"Qualquer Outro Placar" (AOS / Any Other Score):** as casas listam ~20-30 placares e agrupam o resto numa única seleção. Goleadas raras (ex.: 6-2) caem aí.
- **Push:** essencialmente **não existe push** no placar exato — ou o placar bate exatamente, ou perde. (Push ocorre em mercados de linha, como handicap/total inteiro, não num mercado de resultado discreto. Fonte: The Betting Professionals.)
- **Void/anulação:** jogo adiado, cancelado, abandonado ou com mudança de sede normalmente **anula** o mercado (devolve o stake). Um placar exato **não** é anulado só por não estar listado no momento da aposta (DraftKings).
- **Abandono (granular):** para correct score **puro** o padrão é **void** (confirma o acima; bet365). Mas a regra fina é: a casa **anula apenas as seleções NÃO determinadas**; seleções **já determinadas** permanecem válidas. Isso quase não afeta o placar exato (ele só fica "determinado" no apito final), mas é decisivo para a perna de marcador de um scorecast — ver 1.3. Paddy Power adiciona janela de remarcação (tipicamente 3h / 3 dias) antes de anular.

### 1.2 Placar Exato do 1º Tempo
- Mesma lógica, restrita aos **primeiros 45' + acréscimos do 1º tempo**.
- Estatisticamente **mais concentrado**: o **0-0 ao intervalo é o resultado isolado mais provável** na maioria dos jogos. O mecanismo real **não** é "a grande maioria dos gols sai no 2º tempo" — o split é modesto (~44% dos gols no 1º tempo vs ~56% no 2º; ver §4.2 e §5.5). A razão verdadeira é que **~35-40% dos jogos chegam ao intervalo em 0-0** (cautela tática no início + menos exposição acumulada de tempo de jogo). Isso torna o leque de placares de 1º tempo curto (raramente passa de 2-2). (Fonte: SportingAZ.)
- Não confundir com **HT/FT** (resultado 1X2 no intervalo + no final, 9 combinações) — é outro mercado.

### 1.3 Scorecast (marcador + placar)
- **Definição:** aposta única que combina **quem marca o 1º gol** com o **placar exato final**. Ambas as pernas têm de acertar (StatsChecker; Oddschecker).
- É tratada como **aposta simples** (single), não múltipla — porque as duas pernas são **contingências relacionadas** (related contingencies); a casa precifica com ajuste de correlação, não pela multiplicação pura das odds (BettingSites.org.uk cita exemplo de "59/1 → 38/1" pelo ajuste).
- **Janela temporal:** confirmado que cast bets valem **só até os 90 minutos** salvo indicação contrária — **prorrogação não conta** (OnlineBetting.org.uk, verbatim). Mesma regra para wincast/timecast.
- **Regras de liquidação (consolidadas de Sky Bet, Paddy Power, bet365, StatsChecker):**
  - **Jogador não joga / entra depois do 1º gol:** a aposta é liquidada como **single só no placar exato**, à odd do placar (proteção padrão).
  - **Gol contra como 1º gol:** o gol contra **não conta** para a perna de marcador; a aposta "rola" para o **próximo marcador** (o próximo jogador a marcar a favor do seu time) + o placar exato.
  - **1-0 cujo único gol é contra:** liquida como **single no placar exato 1-0**.
  - **TODOS os gols da partida são contra (caso multi-own-goal):** se nenhum gol "válido" de jogador for marcado, **todas** as apostas de scorecast/marcador são liquidadas como **single no correct score**, e crucialmente **às odds cotadas NO KICK-OFF** (não à odd ao vivo do momento). Fonte: Sky Bet / Paddy Power goalscorer rules. (O rascunho cobria o caso 1-0-contra; este é o caso geral e a âncora de preço.)
  - **Jogo abandonado após gol:** pela regra de "seleções já determinadas" (1.1), a perna de **marcador** de um scorecast pode **permanecer válida** se já resolvida (ex.: "primeiro marcador" já saiu) mesmo com jogo abandonado <90', enquanto a perna de placar exato (não determinada) é anulada (bet365; Paddy Power). Se **nenhum** gol saiu → **void** total.
  - **Existem variantes:** *First Scorer Scorecast*, *Anytime Scorecast* (marca a qualquer momento) e *Last Scorer Scorecast*. O "anytime" é mais provável e paga menos.

### 1.4 Wincast e Timecast
- **Wincast = marcador (a qualquer momento) + resultado 1X2** (não precisa do placar exato). Mais fácil que o scorecast, paga menos (888sport; SportyTrader; Goal.com).
- **Timecast = marcador + faixa de minuto do gol** (ex.: 21'-45'). Odd fica **entre** wincast e scorecast.
- Em todos: **gol contra não conta** para a perna de marcador; só **tempo regulamentar (até 90 min; prorrogação não conta)** — confirmado verbatim (OnlineBetting.org.uk).

---

## 2. Como a odd/margem se forma (e por que é altíssima)

### 2.1 O mecanismo: muitos resultados escondem muito juice
O placar exato é o mercado de **maior overround do futebol**. Faixas citadas pelas fontes:
- **Overround típico ~130%** (margem ~30%) em casas recreativas (Geniebet, TopBookmakerFootball).
- Faixa geral citada: **margem de 15% a 30%** (Bet.report), com exóticos passando de 20-30%.
- Comparativo: **1X2 ~3-5%**; Handicap Asiático na Pinnacle **~2-2,5%**.

**Por que tão alto?** Com 20-30+ resultados, a casa pode espalhar a margem **finíssima por cada preço** — nenhum preço parece obviamente ruim isoladamente, mas somando todas as probabilidades implícitas dá ~120-130% (Bet.report; Caan Berry). Some-se a isso **menos comparação de preço** pelo apostador (mercado de nicho) e **gestão de risco mais complexa** → a casa cobra mais porque pode (TopBookmakerFootball; MrSuperTips).

### 2.2 Como a casa chega aos preços (Poisson)
O pipeline padrão do trader:
1. Estima **λ (gols esperados)** de cada time (modelo de força de ataque/defesa, hoje calibrado por **xG**).
2. Aplica Poisson: P(k gols) = (λ^k · e^−λ) / k!
3. Multiplica as duas distribuições para a **matriz de placares**.
4. Aplica correção **Dixon-Coles** nos placares baixos (ver §5.2).
5. Converte em odds (odd justa = 1/prob) e **adiciona a margem**.

**Exemplo numérico** (modelo Poisson, fonte BetsForToday):
- Arsenal λ = 2,18; Spurs λ = 1,24.
- P(Arsenal 2 gols) = 0,269; P(Spurs 1 gol) = 0,358.
- **P(2-1) = 0,269 × 0,358 = 9,7%** → odd justa ≈ 10,3. Com margem de 30%, a casa oferece ~7,5-8,0.

### 2.3 Como a odd do Scorecast se forma
Não é FGS × Placar puro. A casa usa um **modelo de correlação** porque marcador e placar são dependentes: se o jogador X marca primeiro, certos placares ficam mais prováveis. O efeito líquido é uma odd **menor** que a multiplicação ingênua (OnlineBetting; gamblingcalc). Para "Resultado + Marcador" típico cita-se **desconto de correlação de 40-55%** sobre o produto das odds.

### 2.4 Como a linha se move
- Placar exato **se move muito menos por dinheiro** que o 1X2 (volume baixo). Move principalmente por **notícia de escalação** (titular faltando muda os λ) e por **clima**.
- Ao vivo, o preço **decai mecanicamente com o relógio** (ver §PLUS): se está 0-0, a odd do 0-0 despenca; se sai gol, todo o leque se reprecifica num instante.

---

## 3. Tips e ângulos de valor (onde mora o EV+)

> Aviso de margem: com 25-30% de overround, **bater a casa no placar exato direto é dificílimo**. O EV+ tende a aparecer (a) em exchanges/Asian books de margem baixa, (b) ao vivo/trading, e (c) em casas recreativas só quando o seu λ diverge muito do consenso.

1. **Compare preços agressivamente.** "A odd de um scorecast varia muito mais, em %, entre casas do que a do resultado" (OnlineBetting). A própria fonte dá um exemplo concreto: **o mesmo scorecast a 20/1 numa casa vs 30/1 noutra** — uma variação de **~50%** no preço (não os 5-8% de um mercado líquido). No placar exato isso é EV de sobra; price-shopping é a alavanca de maior retorno desta família.
2. **Use o modelo Poisson/Dixon-Coles como filtro de preço**, não como verdade. Procure placares onde **sua prob > prob implícita da casa** com folga maior que a margem.
3. **Ataque jogos de λ baixo e variância baixa** (dois times defensivos, sem mando forte): a distribuição se **concentra em poucos placares** (0-0, 1-0, 0-1, 1-1) e fica mais previsível.
4. **Combine placares correlatos** para reduzir variância (ex.: 1-0 + 2-0 + 2-1 cobrindo "vitória magra do mandante"). É a forma prática de "apostar num cluster" em vez de um único número. Algumas casas já vendem isso pré-empacotado como **Correct Score Groups / "Multi Score"** (back de vários placares num clique) — vale checar se o produto existe antes de montar na mão ou na exchange.
5. **Lay (na exchange) dos placares improváveis caros** em vez de back dos prováveis baratos — frequentemente há mais valor em vender 4-0/3-3 superprecificados.
6. **Scorecast só com EV nas duas pernas:** escolha um **marcador em boa fase** (não a estrela óbvia) num **placar realista** que o seu modelo já gosta. Procure **dark horses** (meias chegadores, batedores de falta/pênalti) que a casa subprecifica.
7. **0-0/1-1 ao intervalo** como base: o 1º tempo é o terreno mais previsível (alta fração de jogos 0-0 ao HT) — ver §PLUS.

---

## 4. Correlações com o jogo (o coração do dossiê)

A pergunta central: **que característica do jogo puxa a massa de probabilidade para placares baixos vs altos, e para o lado do mandante vs visitante?**

### 4.1 Estilo de jogo
| Característica | Efeito no placar | Direção |
|---|---|---|
| **Dois times de bloco baixo / defensivos** | Concentra em **0-0, 1-0, 1-1**; jogo lento, poucas chances de alto valor | ↓ gols, placares apertados |
| **Posse alta vs bloco baixo** (favorito x retranca) | Tende a **1-0 / 2-0 / 2-1** para o favorito; o bloco baixo "bunkeriza" e cede até 2/3 do campo | placar magro a favor do dono da posse |
| **Pressão alta mútua (gegenpress vs gegenpress)** | Jogo aberto, transições → cauda mais gorda em **2-2, 3-1, 3-2** | ↑ gols, placares altos |
| **Contra-ataque puro** | Quando o atacante se expõe, o bloco baixo pune nas costas → **placares com gols "tardios" e viradas**; aumenta chance de placares improváveis | variância ↑ |

Princípio: **um confronto entre dois times de xG baixo agrupa nos placares baixos**; um confronto aberto **engorda a cauda** dos placares de muitos gols (TotalFootballAnalysis; SportsBoom).

### 4.2 Ritmo / total de gols
O **λ total (λ_casa + λ_visitante)** é o regulador-mestre. Mais λ total → massa migra de 1-0/0-0 para 2-1/2-2/3-1. Ler o **mercado de Over/Under como âncora**: um jogo precificado em Over 3.5 favorável já diz que os placares baixos estão baratos demais para back.

**Sobre a distribuição temporal:** historicamente sai **um pouco mais da metade (~56%) dos gols no 2º tempo** vs **~44% no 1º** — uma maioria **modesta e variável por temporada**, não uma dominância esmagadora. Casos extremos existem (Premier League 2023/24 teve 60,1% no 2º tempo, uma temporada atipicamente alta; 2018/19 ficou em ~55,6%). Conclusão prática: não superdimensione a expectativa de gol no 2º tempo ao precificar placares de 1º tempo — o efeito real é moderado.

### 4.3 Mando de campo
- O mando **inclina a assimetria** da matriz para o lado do mandante (λ_casa > λ_visitante no mesmo confronto). Por isso **1-0 e 2-1 do mandante** costumam ser os placares mais prováveis, e os placares de vitória visitante valem menos.
- Mando forte + visitante que "se fecha" → puxa para **1-0/2-0 do mandante**.

### 4.4 Árbitro
- Árbitro **que marca muito pênalti / dá muitos cartões** → aumenta chance de **expulsão e pênalti**, ambos eventos que distorcem o placar (gol "extra" e/ou time com 10). Empurra a cauda para placares com mais gols e para viradas.
- Árbitro permissivo → jogo mais truncado, **menos pênaltis**, leve viés a placares baixos.

> **Nota técnica sobre o impacto de uma expulsão (red card).** O número frequentemente citado de **−1,45 gol** (Mark Taylor, 2013) é a **redução no xG do PRÓPRIO time expulso** ao longo do jogo inteiro — **não** o efeito líquido sobre o total de gols da partida. Estimativas mais recentes apontam ~**−1,805** para o time punido. Crucialmente, a **taxa de gols do time NÃO-punido SOBE**. Portanto, o efeito de uma expulsão sobre o **total** de gols (e sobre "engordar a cauda de placares altos") é **ambíguo e depende do minuto e do placar**: muitas vezes o líquido no total fica próximo de neutro ou levemente positivo, com **forte assimetria a favor do time com 11**. A direção segura é: massa migra **para placares a favor de quem tem 11**, não necessariamente "mais gols no total". (Fontes: Springer; databetweenthelines / Taylor 2013.)

### 4.5 Clima e campo
- **Chuva forte / campo pesado / vento** → reduz precisão de passe e finalização → **puxa para placares baixos** (0-0, 1-0) e aumenta peso de **gols de erro/bola parada**. (Regra prática registrada em pesquisas internas de clima → under.)
- Calor extremo → ritmo cai no 2º tempo, **menos gols tardios**.

### 4.6 Calendário / cansaço
- **Time com jogo no meio de semana (especialmente decisão) + jogo fora no fim de semana** → tende a **under / placar baixo** (hipótese de ressaca de meio de semana; consistente com queda de intensidade). Pernas cansadas reduzem λ ofensivo e aumentam erros defensivos, mas o efeito líquido sobre o **total** costuma ser de **menos gols**.
- Rodízio de elenco (rotation) muda os λ — checar escalação.

### 4.7 Motivação e contexto
- **Decisão / mata-mata / "só precisa do empate"** → jogo travado, **0-0 e 1-0 ganham peso**; cresce o valor de placares baixos.
- **Fim de temporada sem objetivo (dead rubber)** → jogo aberto, defesas frouxas → **engorda placares altos** (3-2, 2-2).
- **Clássico/rivalidade** → historicamente **mais travado e faltoso**: viés a placares baixos + maior chance de cartão/expulsão (cauda de virada).
- **Time precisando golear (saldo, classificação)** → empurra λ do favorito para cima → **2-0, 3-0, 3-1**.

### 4.8 Qualidade ofensiva/defensiva
- A leitura final é sempre **xG (ataque) e xGA (defesa concedida)** dos dois lados → definem os λ. Defesa elite vs ataque mediano = massa em 0-0/1-0. Dois ataques elite vs defesas furadas = massa em 2-2/3-2.

---

## 5. Indicadores preditivos e como lê-los

### 5.1 xG / xGA
- **xG e xGA são a fonte primária dos λ.** Use **xG ofensivo do time A** ajustado pelo **xGA defensivo do time B** (e vice-versa) — exatamente o produto força-de-ataque × fraqueza-de-defesa do modelo Poisson.
- Prefira **médias de xG de 6-10 jogos** (sinal mais estável que o placar bruto). Divergência xG vs gols reais aponta **regressão à média** (time marcando acima do xG vai esfriar).

### 5.2 Por que Poisson puro erra — e a correção (Dixon-Coles)
- **Poisson assume independência dos gols** → **subestima sistematicamente os empates baixos (0-0 e 1-1)**.
- **Dixon-Coles** corrige com um parâmetro **ρ (rho)** aplicado via fator **τ (tau)** que ajusta **apenas 4 placares: 0-0, 1-0, 0-1 e 1-1** — nenhum outro placar é tocado.
- Em dados ingleses, Dixon-Coles encontraram **ρ negativo** (tipicamente da ordem de **−0,03 a −0,13**). **ρ negativo AUMENTA P(0-0) e P(1-1)** e **reduz levemente P(1-0) e P(0-1)**. (Atenção a textos que citam "valores entre 0,05 e 0,15" — referem-se à **magnitude |ρ|**, não ao sinal.) Sem essa correção, você **subprecifica 0-0/1-1** — justamente os placares mais comuns. (Fontes: Dixon-Coles; goalmodel docs; Grokipedia.)

### 5.3 Frequências históricas (âncora de sanidade)
Placares mais comuns na Premier League (ilustração — varia por liga; fonte StatsUltra/StatsHub):
| Placar | Frequência |
|---|---|
| 1-1 | ~11,1% |
| 1-0 | ~9,4% |
| 2-1 | ~8,6% |
| 0-0, 2-0, 0-1, 1-2 | faixas seguintes |

Os ~5 placares mais comuns somam **~40% de todos os jogos**. Ligas mais defensivas elevam 0-0/1-0; ligas abertas elevam 2-1/2-2. **Sempre recalibre por liga.**

### 5.4 Contexto de liga (recalibração obrigatória)
A frequência de 0-0 e a **forma inteira da matriz** variam fortemente por liga e não devem ser importadas de uma liga para outra:
- **Âncora global ilustrativa:** ~**8-12%** dos jogos terminam **0-0**.
- **Ligas defensivas** (Itália / França historicamente) **puxam a fração de 0-0/1-0 para cima**.
- **Ligas abertas** (Holanda / Alemanha, e certas fases da Premier League) **puxam para baixo** a fração de 0-0 e engordam 2-1/2-2/3-x.
- Operacionalmente: nunca aplique uma matriz de Poisson "genérica" — calibre λ médio e ρ com dados **da liga e temporada** em questão.

### 5.5 Frequências por tempo (1º vs 2º)
Como detalhado em §4.2: **~44% dos gols no 1º tempo vs ~56% no 2º** — maioria modesta e variável por temporada. Use isso para o placar exato de 1º tempo, lembrando que o motor do "0-0 ao HT mais provável" é a fração de **~35-40% de jogos 0-0 ao intervalo**, não a (modesta) vantagem de gols do 2º tempo.

### 5.6 Forma, H2H, escalação, chutes/posse
- **Escalação (lineup)** é o indicador de maior impacto de curto prazo: artilheiro/zagueiro-chave fora muda os λ e **invalida** muito scorecard. Esperar a escalação confirmada antes de fechar scorecast.
- **H2H** é fraco como preditor de placar exato (amostra pequena, elencos mudam) — use só para ler **viés de estilo** (clássicos travados).
- **Chutes/grandes chances** corroboram o xG; **posse isolada não prediz gols** (posse estéril de quem joga contra bloco baixo).

---

## 6. Armadilhas comuns (traps)

1. **Subestimar 0-0 e 1-1** por usar Poisson puro (sem Dixon-Coles): erro estrutural que beneficia a casa.
2. **Comprar a "narrativa de goleada"** (favorito x lanterna) → o mercado já inflou 3-0/4-0; o EV real costuma estar nos placares **magros** (1-0/2-0), porque bloco baixo + favorito ansioso trava muito jogo.
3. **Ignorar a margem.** Um modelo com 2% de edge é lucrativo no Asian Handicap (margem ~2,5%) e **lixo no placar exato recreativo** (margem ~25%). EV+ tem de superar a margem.
4. **Apostar scorecast na estrela óbvia:** odd esmagada; o valor está no **marcador secundário** subprecificado.
5. **Esquecer que gol contra não conta para o marcador** (mas conta para o placar) — descasamento que surpreende no scorecast.
6. **Tratar H2H como preditivo de placar exato** (amostra ínfima).
7. **Importar frequências de outra liga** sem recalibrar (ver §5.4) — uma matriz da Itália aplicada à Holanda erra feio.
8. **Jogos de fim de temporada sem objetivo:** o mercado assume intensidade normal; muitas vezes vira "amistoso" com placar aberto/imprevisível.
9. **Superdimensionar a expulsão como "mais gols":** o efeito é assimétrico a favor do time com 11, **não** uma garantia de placar alto no total (ver §4.4).

---

## 7. Correlação entre mercados (bet builder / same game multi)

**Eventos do mesmo jogo são dependentes** — a casa aplica **desconto de correlação** e/ou **bloqueia** combinações redundantes.

**Combina (positivamente correlacionado — bom para empilhar, mas a casa desconta):**
- **Placar 0-0 + Under 2.5 + Ambos Não Marcam (BTTS No)** → todos descrevem o mesmo cenário de poucos gols.
- **Placar 2-0 do mandante + Mandante vence + BTTS No + Under 3.5**.
- **Scorecast (X marca 1º, 2-1) + X marca a qualquer momento** (redundante; muitas casas barram).

**Contradiz (não empilhar — perdas garantidas ou odd destruída):**
- **Placar 0-0 + Over 1.5** (impossíveis juntos).
- **Placar 1-0 mandante + BTTS Yes** (contraditórios).
- **Placar exato + Total de gols incompatível**.

**Nota de pricing:** combos como "Resultado + Marcador" levam **40-55% de desconto** sobre o produto das odds (gamblingcalc); a regra de related contingencies pode derrubar, por exemplo, um teórico 59/1 para 38/1 (BettingSites.org.uk). Empilhar muitas pernas positivamente correlatas **não** multiplica EV — a casa já apreçou a dependência; o ganho real está em achar **pernas independentes** subprecificadas, não em redundância.

---

## 8. Fontes de dados para alimentar prognósticos

| Tipo | Fonte | Uso |
|---|---|---|
| **xG / xGA (times e jogadores)** | Understat (Big 5 ligas, modelo próprio) | λ ofensivo/defensivo, forma de xG |
| **xG + dados avançados** | FBref (dados Opta/StatsBomb) | xG, xA, chutes, pressões |
| **xG ao vivo** | SofaScore, StatPair | trading in-play |
| **Frequências de placar** | FootyStats, WinDrawWin, SoccerStats | calibrar matriz por liga |
| **Resultado oficial / liquidação** | Opta (padrão das casas), depois feed da casa, depois site oficial | resolver disputas de marcador |
| **Comparação de odds / overround** | Oddschecker, calculadoras de margem | achar a melhor odd e medir o juice |

Nota de modelagem: o mesmo chute pode valer 0,12 xG (Opta) e 0,22 xG (StatsBomb) — **fixe um provedor** e seja consistente; não misture providers no mesmo λ (Beat the Bookie).

---

## 9. Camada Live (ao vivo)

### Como a leitura muda durante o jogo
- **Decaimento pelo relógio (sem gol):** com o jogo 0-0, o **λ restante encolhe a cada minuto**, então a odd do **0-0 cai rápido** — relatos de trader: 0-0 chega a ~1/2 do preço aos 30' e ~1/3 ao intervalo se seguir 0-0. Isso é a base do **lay 0-0 / back 0-0** como trade.
- **Gol cedo:** reprecifica **toda a matriz** instantaneamente. Um gol aos 10' do mandante migra a massa para **2-0/2-1/3-1** e mata 0-0/0-1. O placar exato corrente (ex.: 1-0) fica caríssimo e **bom para lay**.
- **Expulsão (red card):** evento de maior impacto tático. A massa migra **para placares a favor de quem está com 11**; quanto **mais cedo** a expulsão, maior a distorção. Atenção (ver §4.4): o efeito sobre o **total** de gols é assimétrico, não simplesmente "mais gols" — o time punido perde da ordem de −1,45 a −1,8 de xG próprio, mas o adversário ganha. Modelos de xG **demoram a absorver** a mudança tática → **janela de valor** logo após o cartão, sobretudo para os placares do lado numérico.
- **Momentum / mudança de placar:** sair o 1-1 num jogo travado reabre placares como 2-1/1-2; um 2-0 confortável **trava** o líder (gestão de resultado) e **reforça placares baixos adicionais** (2-0 fica, 3-0 sobe pouco).

### Estratégias live específicas
1. **Lay do placar corrente** após ele se firmar (ex.: lay 1-0 aos 60' num jogo morno) — variância controlada, hedge fácil.
2. **Back 0-0 / Lay a Saída do Gol:** em jogos de λ baixo selecionados (defesas fortes, mando equilibrado), back 0-0 cedo e fechar (cash out parcial) conforme a odd despenca; critérios citados: **0-0 FT back odds ≥ 12** (lucrativo já a ≥ 7), diferença mandante-visitante no 1X2 **≤ 0,5**, lay do empate **≤ 4**.
3. **Lay 0-0 ao intervalo:** apoiado na alta fração de jogos que chegam ao HT em 0-0 e na expectativa de ≥1 gol no 2º tempo; selecionar jogos onde **não** se esperava gol cedo.
4. **Reação à expulsão:** entrar nos placares a favor do time numérico antes do mercado reprecificar por completo.
5. **Scorecast ao vivo após o 1º gol já estar definido:** com o marcador resolvido, "vira" um placar exato puro — apostar/negociar só a perna de placar com o λ residual atualizado.

---

## Notas de confiança
- Frequências de placar (§5.3) são **Premier League** — tratar como ilustração; recalibrar por liga é obrigatório (§5.4).
- Faixas de overround (130% / 15-30%) e o desconto de correlação 40-55% vêm de fontes de mercado/calculadoras, não de auditoria de casa específica — variam por operador, liga e momento.
- O número "−1,45 gol pós-expulsão" é a redução no xG do **próprio** time punido (Taylor 2013), **não** o impacto no total da partida; estimativas recentes vão a ~−1,8. O ρ Dixon-Coles (−0,03 a −0,13) é ordem de grandeza da literatura, com sinal negativo e efeito restrito a 0-0/1-0/0-1/1-1 — não constante universal.
- Split de gols por tempo (~44%/~56%) é maioria modesta e **variável por temporada**; não tratar como dominância do 2º tempo.

---

## Fontes

- DraftKings Sportsbook — Market Rules (correct score, own goals): https://sportsbook.draftkings.com/help/general-betting-rules/market-rules
- Do Own Goals Count in Betting? — BestCasinoHQ: https://www.bestcasinohq.com/blog/do-own-goals-count-in-betting/
- What Is a Push in Sports Betting? — The Betting Professionals: https://www.thebettingprofessionals.com/features/what-is-a-push-in-sports-betting
- Scorecast Betting Explained With Examples — StatsChecker: https://www.statschecker.com/guides/scorecast-betting
- Football Goalscorer Rules — Sky Bet (settlement): https://support.skybet.com/app/answers/detail/football-goalscorer-rules/
- What is a scorecast bet: Tips & Rules — Football Ground Guide: https://footballgroundguide.com/betting-section/scorecast-bet-tips-rules.html
- Scorecast — Oddschecker betting terms: https://www.oddschecker.com/betting-terms/scorecast
- Scorecast, Wincast and Timecast Betting Explained — OnlineBetting.org.uk: https://www.onlinebetting.org.uk/betting-guides/football/scorecast-and-wincast-betting-explained.html
- Scorecasts vs Wincasts — 888sport: https://www.888sport.com/blog/football/scorecasts-vs-wincasts
- What is Wincast Betting? — SportyTrader: https://www.sportytrader.com/en/sports-betting/guide/what-is-wincast-betting/
- Poisson Models for Football Betting (Step-by-Step) — BetsForToday: https://www.betsfortoday.com/guides/poisson-distribution/
- Dixon-Coles Model Explained — football-bet-prediction.com: https://football-bet-prediction.com/articles/dixoncoles-model-explained-improving-poisson/
- Predicting Football Results with Dixon-Coles — dashee87: https://dashee87.github.io/football/python/predicting-football-results-with-statistical-modelling-dixon-coles-and-time-weighting/
- Bookmaker Margins Explained / Overround — Bet.report: https://bet.report/en/blog/bookmaker-margins-explained/
- Overround (Betting Margin) Explained — Geniebet: https://www.geniebet.com/overround-betting-margin-explained/
- Understanding Overround and Bookmaker Margins — TopBookmakerFootball: https://topbookmakerfootball.com/articles/understanding-overround-and-bookmaker-margins-in-football-betting/
- Bet Builder Calculator: Correlation Discount — gamblingcalc: https://gamblingcalc.com/betting/football/bet-builder-calculator/
- The Most Common Scores in the Premier League — StatsUltra: https://statsultra.com/the-most-common-scores-in-the-premier-league/
- Common Football Scorelines — FootyStats: https://footystats.org/stats/common-score
- Lay the Draw and Back 0-0 at Half Time — TheTrader: https://thetrader.bet/sports-trading/betfair-trading-strategies/lay-the-draw-strategy/lay-the-draw-and-back-0-0-at-half-time/
- Holy Grail: Lay 0-0 at Half Time — Soccerwidow: https://www.soccerwidow.com/football-gambling/betting-knowledge/systems/holy-grail-lay-0-0-at-half-time/
- Football Expected Goals Stats for In-Play Trading — Predictology: https://www.predictology.co/blog/football-expected-goals-stats-how-to-use-advanced-metrics-for-in-play-trading/
- Effects of a red card on goal-scoring in World Cup matches — Springer: https://link.springer.com/article/10.1007/s00181-017-1287-5
- Low Block tactical analysis — TotalFootballAnalysis: https://totalfootballanalysis.com/article/tactical-theory-the-low-standard-and-high-block-tactical-analysis-tactics
- What Is Correct Score Betting and How Does It Work — SportsBoom: https://www.sportsboom.co.uk/betting/correct-score-betting-explained
- Comparing predictive power of xG data providers — Beat the Bookie: https://beatthebookie.blog/2024/01/06/comparing-the-predictive-power-of-different-xg-data-providers/
- xG Explained — FBref: https://fbref.com/en/expected-goals-model-explained/
- Understat — xG stats: https://understat.com/
- Bookmaker Margins / Vig Guide — MrSuperTips: https://www.mrsupertips.com/guides/bookmaker-margins-vig-guide
- Goal Scorer Bets: Types and rules — Paddy Power: https://helpcenter.paddypower.com/app/answers/detail/198-goal-scorer-bets-types-and-rules/
- Related Contingencies (scorecast not priced as multiplication; 59/1 → 38/1 example) — BettingSites.org.uk: https://www.bettingsites.org.uk/guides/related-contingencies/
- Dixon-Coles model (rho negative, adjusts only 0-0/1-0/0-1/1-1) — Grokipedia: https://grokipedia.com/page/DixonColes_model
- How Do Red Cards Impact Team Performance (−1.45 Taylor 2013 vs −1.805; opponent rate rises) — Data Between The Lines: https://databetweenthelines.substack.com/p/how-do-red-cards-impact-team-performance
- Liverpool strongest finishers (60.1% 2023/24 second-half goals, atypically high) — Premier League: https://www.premierleague.com/en/news/3871035
- 0-0 Half-time Prediction (~35-40% matches 0-0 at HT; ~44% goals in first half) — SportingAZ: https://sportingaz.com/0-0-half-time-prediction/
- Abandoned Matches Football Rules (void unless outcome already determined) — bet365 Help: https://help.bet365.com/s/en/sportsrules/soccer/abandoned-matches
