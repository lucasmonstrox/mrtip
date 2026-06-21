---
mercado: parciais-tempo
titulo: Mercados Parciais e de Tempo
---

# Mercados Parciais e de Tempo

> Família de mercados de apostas de futebol focada em **recortes temporais do jogo**: 1º tempo, 2º tempo, janelas de 15 minutos, momento do 1º gol, qual metade tem mais gols, e gol antes de X minutos. O fio condutor de toda esta família é a **distribuição temporal dos gols** — entender quando, por que e sob que condições os gols acontecem dentro dos 90+ minutos.

---

## 0. O alicerce: distribuição temporal de gols no futebol

Nenhum mercado desta família faz sentido sem a curva de distribuição de gols ao longo do jogo. É o "preço justo" implícito de tudo.

### Split macro: 1º tempo vs 2º tempo

| Métrica | 1º tempo | 2º tempo |
|---|---|---|
| Share de todos os gols | ~44–45% | ~55–56% |
| Média de gols por jogo (em jogo ~2.5) | ~1.0 | ~1.5 |
| Probabilidade de "se há um gol, ser no 1º tempo" (modelos de Copa do Mundo) | ~44% | ~56% |

O split ~44/56 é **estrutural e replicável** entre as top-5 ligas europeias (confirmado time a time em levantamentos das 96 equipes das principais ligas). As causas (detalhadas na Seção 4):
- **Fadiga** — após ~70 min, defensores perdem nitidez, a linha perde coesão, surgem espaços que não existiam.
- **Substituições** — treinadores colocam atacantes frescos por volta do minuto 60–80 contra defesas cansadas; o saldo líquido das trocas favorece o ataque.
- **Chasing the game** — times perdendo no placar empurram jogadores pra frente, abrindo o jogo (gols para os dois lados).

### Curva por janela: cuidado com a escala (15 min vs 10 min)

Os dados de distribuição vêm em **duas escalas diferentes** e misturá-las gera erro. Apresentamos as duas separadamente.

**Escala de 15 minutos** (números arredondados grosseiros, agregados de grandes ligas — fonte Play The Percentage):

| Janela | Share de gols (aprox., arredondado) | Leitura |
|---|---|---|
| 0–15 | ~10% | **Mais baixa do jogo.** Fase de estudo, jogo "cagey", times se medindo. |
| 16–30 | ~15% | Jogo abre, primeiras chances reais. |
| 31–45(+) | ~20% | Pico do 1º tempo; gols logo antes do intervalo (40–45) e os acréscimos (45+X) engordam esta janela. |
| 46–60 | ~15% | Reinício do 2º tempo. |
| 61–75 | ~20% | Substituições começam a fazer efeito. |
| 76–90(+) | ~20% | Fadiga + acréscimos + desespero; acréscimos (90+X) caem aqui. |

> **Atenção:** nesta escala arredondada de 15 min, os blocos 31–45, 61–75 e 76–90 **empatam em ~20%** — não há um "pico único" claro. Afirmar "76–90 é a maior fatia única (~18–19%)" mistura escalas e está incorreto.

**Escala de 10 minutos / decis** (agregação StatsUltra / Scoreroom), onde sim aparece um bloco campeão:

| Bloco de 10 min | Share (aprox.) |
|---|---|
| 81–90(+) | **~18,8%** — o bloco de 10 min **mais cheio** do jogo |
| 0–10 | o mais seco |

> **Regra mental de ouro (corrigida):** a curva de gols **cresce de forma não-linear rumo ao fim de cada metade**, com aceleração maior nos minutos finais. O bloco final de 10 min (81–90) é o mais cheio em agregações por decil (~18–19%). Os primeiros minutos de cada metade são, sistematicamente, os mais secos.

### A curva é um processo NÃO-estacionário (fonte primária)

O paper *Temporal dynamics of goal scoring in soccer* (arXiv 2501.18606, 2025) é a referência metodológica e corrige três mitos comuns:

1. **O aumento da taxa de gols NÃO é linear.** Cresce de forma não-linear, mais acentuada no fim de cada metade e nos acréscimos.
2. **As DUAS metades mostram frequência de gols abaixo do esperado nos seus minutos iniciais** ("the early phases of each half show lower-than-expected goal frequency"). Ou seja, existe uma "ressaca" relativa também no **início do 2º tempo** (46–50 abaixo do esperado) — não é verdade que "o 2º tempo retoma a tendência linear sem ressaca".
3. Há um **dip claro em 45–50** por causa do intervalo (apito + reinício frio).

Isso **reforça** o ponto central (primeiros 15 min mais secos) mas **desmonta** a ideia de curva "quase linear" e a de "reinício sem ressaca".

### Momento médio do 1º gol (Premier League 2016–2021)
- Mandante marca o 1º gol em média aos **37min46s**; visitante aos **41min36s**.
- Médias do 1º gol por liga: Bundesliga ~28min, Serie A ~29min, Premier League/Ligue 1 ~31min, La Liga ~34min. **Bundesliga é a liga "mais rápida"** para o 1º gol.
- ~25% dos jogos chegam ao intervalo 0–0; ou seja, **há gol no 1º tempo em ~75% dos jogos**.

### Número duro que você precisa decorar: 0–0 ao intervalo → 2º tempo

Em levantamento de **6.078 jogos** que estavam 0–0 ao HT, **~26% terminaram 0–0** — portanto **~74–75% tiveram pelo menos um gol no 2º tempo**. Esse é o número que quantifica o melhor ângulo de toda a família (o "manômetro de pressão", Seção 3): mesmo sem pressão excepcional, partir do 0–0 ao intervalo já implica ~3 em cada 4 jogos com gol no 2º tempo.

---

## 1. Definição e regras de liquidação por submercado

> **Regra-mãe da família (vale para quase tudo):** salvo indicação contrária, todos liquidam por **tempo normal + acréscimos (90+)**, e **excluem prorrogação e pênaltis (disputa)**. Gol contra **conta** e é creditado ao time atacante. Gol anulado (impedimento, falta, VAR no jogo) **não conta**. Decisão retroativa pós-jogo não altera liquidação.

### 1.1 Mercados do 1º tempo
- **1X2 do 1º tempo (Half-Time Result):** resultado considerando só os gols dos primeiros 45+ min. O "empate" inclui 0–0. É um mercado independente do resultado final.
- **Over/Under do 1º tempo (ex.: O/U 0.5, 1.5):** conta gols só até o apito do intervalo. Linhas inteiras (0.5, 1.5) **não dão push** (não existe "exatamente 0.5"); linha 1.0 daria push se sair exatamente 1 gol no 1º tempo (raro de ofertar).
- **BTTS 1º tempo:** ambos os times precisam marcar **dentro dos primeiros 45+ min**. Muito mais difícil que BTTS de jogo cheio.
- **Borda:** se a partida é **abandonada antes do intervalo**, mercados de 1º tempo normalmente são **void** (stake devolvido), salvo regra específica da casa.

### 1.2 Mercados do 2º tempo
- **1X2 / O/U / BTTS do 2º tempo:** consideram **apenas** os gols marcados entre o reinício e o apito final (incluindo acréscimos do 2º tempo). **O placar do 1º tempo é zerado** para fins deste mercado — um jogo que vai 1–0 ao intervalo e termina 1–0 tem "2º tempo = 0–0 / Under / sem BTTS".
- **Borda (regra confirmada da bet365):** se o jogo é abandonado antes de completar os 90 min, mercados de 2º tempo são **void**, **exceto** os já determinados (ex.: Over 0.5 do 2º tempo já batido permanece ganho). A regra de "liquida após ~80 min jogados" **não** é padrão universal nem da bet365 — é política de algumas casas específicas. Na bet365: **void salvo já-determinado**.

### 1.3 Janelas de 15 minutos (interval markets)
- **Definição:** aposta em quantos gols (ou se haverá gol) numa janela específica: 0–15, 16–30, 31–45, 46–60, 61–75, 76–90.
- **Atenção às bordas de acréscimo:** gols de acréscimo do 1º tempo (45+X) entram na janela **31–45**; gols de acréscimo do 2º tempo (90+X) entram na janela **76–90**. Isso engorda artificialmente essas duas janelas.
- **Multigols por intervalo:** "gol no intervalo 31–45" é Sim/Não; "intervalo com mais gols" é mutuamente exclusivo entre as 6 janelas, com regra de **dead heat / tie** quando duas janelas empatam.

### 1.4 Momento do 1º gol (Time of First Goal)
- **Definição:** aposta na janela temporal em que sai o **primeiro gol da partida** (qualquer time).
- **Bandas:** variam por casa — algumas usam bandas de **10 min** (0–10, 11–20, 21–30…), outras de **15 min** (0–15, 16–30, 31–HT…). Sempre conferir o desenho.
- **Caso de borda crítico — "No Goal":** quase toda casa oferece a opção **"sem gol no jogo"** (0–0 final). Se você apostou numa banda e o jogo termina 0–0, você perde — a probabilidade de 0–0 (**~6–7%** dos jogos nas top-5; PL ~7,3%, Bundesliga ~4,9%) é parte essencial do overround deste mercado.
- **Confirmação bet365:** se um gol **já saiu** no momento do abandono, o mercado "Time of First Goal" (e "First Goalscorer") **vale**; se nenhum gol saiu, segue a regra de void/já-determinado.
- **Gol contra conta** como primeiro gol normalmente; pênalti no tempo normal conta.

### 1.5 Tempo com mais gols (Half With Most Goals)
- **Três resultados:** "1º tempo", "2º tempo" ou **"Empate"** (mesmo número de gols em cada metade — inclui 0–0/0–0, 1–1 por metade etc.).
- **Caso de borda:** um jogo 0–0 no 1º tempo e 0–0 no 2º tempo liquida como **Empate** (não como void).
- **Quando a casa NÃO oferece "Empate":** o empate entre metades cai em **dead heat**. Mecânica de payout: o stake é **dividido pelo número de seleções empatadas** e a fração é paga **em odds cheias**. Na prática, num empate de 2 vias (ex.: a casa só oferece "1º tempo" e "2º tempo" e os dois empatam), **metade do stake é tratada como ganha** à odd contratada e a outra metade é perdida. Sempre ler os termos (Borgata/SkyBet documentam essa mecânica).
- **Independe de qual time marcou:** só importa a contagem total de gols por metade.

### 1.6 Gol antes de X minutos (Goal Before Minute X)
- **Definição:** Sim/Não para "haverá pelo menos um gol (de qualquer time) até o minuto X". Variantes comuns: gol nos primeiros 10/15/30 min.
- **Liquidação:** decide-se assim que o critério é atingido (gol antes de X → Sim resolve na hora) ou no minuto X (sem gol → Não).
- **Borda:** gol exatamente "no minuto X" — depende se a casa usa "antes de X" (estrito) ou "até X inclusive"; conferir.

---

## 2. Como a odd/margem se forma

### Da curva temporal ao preço
A casa parte de um **λ (lambda) total esperado de gols** (via modelo Poisson + xG), e o **divide entre as metades** com um split típico ~44/56 (1º/2º tempo). Para janelas de 15 min, aplica a curva de distribuição (Seção 0). O modelo moderno **não usa Poisson puro estacionário** — é um **processo de Poisson não-homogêneo (não-estacionário)**: a taxa de gols λ(t) é **crescente e não-linear**, com **aceleração no fim de cada metade e nos acréscimos** (e dip no reinício). Não é "quase linear".

### Margem (overround/juice) típica por submercado
Quanto mais "exótico" o recorte, **maior o juice**:

| Mercado | Overround típico | Observação |
|---|---|---|
| O/U 2.5 jogo cheio (referência) | ~3–5% (top) | Mercado principal, muito líquido, margem fina. |
| 1X2 / O/U 1º tempo | ~5–8% | Líquido em jogos grandes. |
| BTTS (jogo / metade) | ~5–7% | Binário, relativamente eficiente. |
| Tempo com mais gols (3 vias) | ~8–12% | Menos líquido. |
| Janelas de 15 min / multigols | ~12–20% | Margem alta, baixa liquidez fora de jogos grandes. |
| **Momento do 1º gol** | **~20–40%** | Mercado de muitos resultados → juice enorme, como artilheiro. |
| Props de meia (cantos/cartões por tempo) | até >50% | Evitar. |

> **Princípio:** *overround alto costuma esconder precificação pobre.* É exatamente nos mercados de margem gorda (1º gol, intervalos) que as casas **mais erram pontualmente** — mas você precisa de uma vantagem maior só pra vencer o juice.

### Como a linha se move
- **Pré-jogo:** sai escalação → se um goleador/criador titular fica fora, a linha de Over (1º tempo e jogo) **cai**; defensor titular fora → Over **sobe**.
- **In-play (o motor real desta família):** cada minuto sem gol **derruba** a probabilidade dos Overs (decaimento temporal) e **sobe** os Unders. Um gol cedo **explode** as linhas de Over das janelas seguintes e mata o "No Goal" do mercado de 1º gol.

---

## 3. Tips e ângulos de valor (onde mora o EV+)

1. **"Pressure gauge" do 1º tempo (o melhor ângulo da família):** jogo **0–0 ao intervalo mas com xG alto no 1º tempo** (>1.0 combinado) → a probabilidade de gol no 2º tempo, que já é **~74–75% mesmo sem pressão excepcional**, frequentemente passa de **80%**, mas o mercado continua precificando pelo placar (0–0), não pela pressão. Entrar em Over do 2º tempo / Over 1.5 do restante aqui é o trade clássico de "cegueira de placar".
2. **Over 0.5 do 1º tempo cronometrado:** num 0–0, a probabilidade de Over 0.5 1º tempo é ~55% aos 15 min e cai pra <50% aos 20 min. Entrar **antes** dos 15–20 min em jogos de alto λ, ou fazer **lay/scalp** se você acha que o 1º tempo será seco.
3. **Under do 1º gol / bandas tardias:** como os primeiros 15 min são a janela mais seca (~10%), backing de bandas tardias (31–45) ou de "No early goal" tem valor em jogos de tempo lento.
4. **Assimetria por liga no momento do 1º gol (tip operacional):** a média do 1º gol por liga vira ângulo direto. **Bundesliga** (1º gol ~28min + mais gols/jogo) → favorece **Over 1º tempo** e **bandas cedo** (0–15/0–30) do 1º gol. **La Liga** (1º gol ~34min) → favorece **bandas tardias** e **"No early goal" / Under 1º tempo**. Serie A e Ligue 1 ficam no meio. Casamento estilo-de-liga ↔ banda é subexplorado pelo apostador casual.
5. **Times acima da média da liga no 1º tempo:** priorize times cujo % de "marca no 1º tempo" e "concede no 1º tempo" supera a baseline da liga — métrica subexplorada pelo mercado casual.
6. **Late goals / Over 76–90:** a janela final é das mais cheias (bloco 81–90 é o decil mais cheio, ~18–19%); em jogos abertos no placar tardio, o Over da última janela costuma estar barato porque o apostador casual "desistiu" do jogo.
7. **Combo de hedge clássico:** back banda 0–10 do 1º gol em odd alta (~5.0) + back Under 2.5 pré-jogo em odd baixa. Sem gol cedo → o Under valoriza e você lucra/cashout; gol cedo → a banda paga e cobre o Under.

---

## 4. Correlações com o jogo (o coração do dossiê)

Cada característica abaixo **puxa** os mercados temporais para cima ou para baixo. Sinais: ↑ = mais gols/mais cedo, ↓ = menos gols/mais tarde.

### Estilo de jogo
| Estilo | Efeito no 1º tempo | Efeito no 2º tempo | Mecanismo |
|---|---|---|---|
| **Pressing alto (Liverpool-like)** | ↑ gols cedo | ↑ | Força erro do adversário no campo dele já no início; cria caos perto da área. Puxa o **1º gol pra mais cedo** e o **Over 1º tempo pra cima**. |
| **Contra-ataque** | ↑ gols quando o adversário se expõe | ↑↑ no 2º tempo | Vive da transição; explode quando o rival empurra (chasing). Forte correlação com **gols tardios**. |
| **Posse paciente (build-up)** | ↓ gols cedo, jogo lento | ~ | Cansa o adversário sem necessariamente furar a defesa; pode atrasar o 1º gol. Cuidado: posse ≠ gols. |
| **Dois blocos baixos** | ↓↓ | ↓ | Joga pro Under em todas as janelas; favorece "No early goal" e Under 1º tempo. |

### Ritmo / tempo de jogo
- **Tempo alto + transições rápidas** → ↑ Over em todas as janelas, 1º gol mais cedo.
- **Times de tempo lento, defesa profunda, "início cauteloso histórico"** → raramente produzem múltiplos gols cedo. Sinal de Under 1º tempo / banda tardia do 1º gol.
- **Se nenhum dos dois pressiona cedo** → construção lenta → ↓ gols nos primeiros 30 min.

### Mando de campo
- Mandantes marcam o 1º gol mais cedo (~37min vs ~41min do visitante) e lideram o intervalo com mais frequência. **Visitante liderar ao intervalo é raro** → bom para lay do "visitante vence 1º tempo" e para o empate de intervalo.

### Perfil do árbitro
- Árbitro **permissivo (deixa jogar)** → jogo mais fluido, menos interrupções → tende a ↑ ritmo e gols. Árbitro **caseiro/rígido** → mais faltas, jogo picado → pode ↓ gols no 1º tempo. Árbitro propenso a pênalti/cartão → ↑ variância (pênaltis injetam gols; expulsões mudam o λ — ver Seção live).

### Clima / campo
- **Calor extremo / altitude** → ↑ fadiga → acentua o **viés do 2º tempo** (queda de ritmo mais severa após 60 min). **Chuva/campo encharcado** → erros de controle e bola parada perigosa, mas também escorregões defensivos → efeito ambíguo, geralmente ↑ variância. **Vento forte** → ↓ qualidade de jogo, ↓ gols.

### Calendário / cansaço
- Time vindo de **jogo no meio de semana (Champions, Copa) + viagem** → pernas pesadas, ↑ vulnerabilidade no 2º tempo (acentua o pico 76–90). Hipótese registrada do João ("ressaca de meio de semana"): jogo importante no meio + jogo fora no fim de semana → **viés de Under** no jogo seguinte; faz sentido para o **time cansado marcar menos no 1º tempo**, mas pode aumentar gols sofridos tarde.

### Motivação e contexto
- **Derby / clássico:** narrativa dupla. Muitos forçam urgência e erro defensivo → frantic opening 20–30 min (↑ 1º gol cedo). **Mas** muitos clássicos são tensos, medo de perder > vontade de atacar → ↓ gols, especialmente no 1º tempo. **Não trate "derby" como Over automático.**
- **"Six-pointer" de rebaixamento / decisão** → urgência alta → ↑ gols cedo.
- **Fim de temporada sem objetivo (mid-table)** → jogos mornos → ↓ gols, 1º tempo cauteloso.
- **Jogo de ida e volta (mata-mata):** ida pode ser cautelosa (↓ 1º tempo); volta com placar a recuperar abre o jogo no 2º tempo.

### Qualidade defensiva/ofensiva
- **Dois ataques fortes vs duas defesas fracas** → candidato a Over 0.5 / 1.5 do 1º tempo e BTTS. **Duas defesas sólidas e times de baixa média** → Under e "No early goal".

---

## 5. Indicadores preditivos e como lê-los

| Indicador | Como usar para mercados temporais |
|---|---|
| **xG / xGA por metade** | Separe o xG do time **por tempo**. Time com xG alto no 1º tempo e baixa conversão → candidato a "explodir" depois. xG do 1º tempo é **lead indicator** ("manômetro de pressão"); xG do 2º tempo é melhor para **confirmar saídas** (exits) de trade. |
| **% de jogos com gol no 1º/2º tempo (time)** | Compare contra a baseline da liga, não em absoluto. Time muito acima da média no 1º tempo → valor em Over 1º tempo. |
| **Distribuição de gols marcados/sofridos por janela** | Alguns times são "fast starters" (marcam 0–15), outros "late finishers" (76–90). FootyStats/SoccerStats dão isso por time. |
| **Forma recente (últimos 5–6 jogos)** | Tendência de tempo de jogo e de gols por metade; cuidado com amostra pequena. |
| **H2H** | Útil para padrão de tempo de jogo entre os dois estilos, mas **amostra pequena e enganosa** — peso menor. |
| **Escalação** | Ausência de criador/finalizador titular → ↓ Over 1º tempo e 1º gol mais tarde. Defensor titular fora → ↑ Over. |
| **Tiros / posse / cantos no 1º tempo (in-play)** | Volume de finalizações + cantos é melhor preditor de gol vindouro que a posse pura. Posse alta sem chances ≠ gol. |
| **Médias históricas da liga** | Bundesliga/Eredivisie tendem a mais gols e 1º gol mais cedo; ligas táticas (algumas fases de Serie A, Ligue 1) tendem a 1º tempos mais secos. |

---

## 6. Armadilhas comuns (traps)

1. **Cegueira de placar (a mais cara):** ler "0–0 ao intervalo" como "jogo fraco" quando o xG do 1º tempo foi alto. O mercado faz isso e deixa o Over do 2º tempo barato — e lembre: 0–0 ao HT já implica ~74–75% de chance de gol no 2º tempo **sem** ajuste de pressão. É trap pra eles, EV pra você.
2. **"Time que marca muito" ≠ "marca cedo".** Médias de gols totais não dizem **quando**. Muitos times de alta média são late finishers; apostar Over 1º tempo só pela média total é furada.
3. **Posse ≠ gols.** Time dominando a bola sem finalizar não está "perto do gol". Não compre Over por posse.
4. **Narrativa de derby.** Tratar todo clássico como Over ignora que muitos são travados pelo medo. Verifique o histórico **específico** do confronto.
5. **Acréscimos inflam as janelas de borda.** A janela 76–90 e a 31–45 carregam os gols de acréscimo (90+X e 45+X); não confunda "janela cheia" com "minuto a minuto perigoso" — o gol pode ser de 90+5.
6. **Juice gordo do 1º gol/intervalos.** Margens de 20–40% exigem vantagem real; é fácil "achar valor" que na verdade é só ruído dentro do overround.
7. **Esquecer a opção "No Goal" no momento do 1º gol.** ~6–7% dos jogos terminam 0–0; ignorar isso superestima sua chance nas bandas.
8. **Zerar o 1º tempo no mercado de 2º tempo.** Apostador novato vê 2–0 e acha que "tem gol garantido" no mercado de 2º tempo — mas ele começa do 0–0.
9. **Confundir escala 10 min com 15 min.** "81–90 é o decil mais cheio (~18,8%)" é diferente de "76–90 é a maior fatia de 15 min" (na escala de 15 min, três blocos empatam ~20%). Misturar as duas escalas distorce o preço justo.

---

## 7. Correlação entre mercados (bet builder / same game multi)

> **Aviso:** margens de bet builder são **15–30%** (até 20–25% de house edge é comum). Casas aplicam **desconto de correlação** quando as pernas se reforçam. Sempre compare contra o produto das odds individuais.

### Combina (correlação positiva — reforça, mas a casa desconta)
- **Over 2.5 jogo ↔ BTTS Sim** — fortemente correlacionados; jogo aberto produz os dois.
- **Over 1.5 1º tempo ↔ Over 2.5 jogo** — gols cedo puxam o total.
- **Over 1º tempo ↔ 1º gol em banda cedo (0–15/0–30)** — mesma tese (jogo rápido).
- **Time mandante vence ↔ mandante marca 1º** — coerentes.
- **Over 2º tempo ↔ "2º tempo tem mais gols"** — coerentes em jogos com 1º tempo seco e pressão acumulada.

### Se contradiz (correlação negativa — evite empilhar)
- **Under 1º tempo + Over 1.5 do 1º tempo** — contraditório direto.
- **"No goal before 30 min" + Over 1º tempo** — puxam em direções opostas.
- **BTTS 1º tempo + 1X2 1º tempo com clean sheet** (ex.: "mandante vence 1º tempo sem sofrer" + "BTTS 1º tempo Sim") — mutuamente exclusivos.
- **"1º tempo tem mais gols" + Over 2º tempo grande** — tensão lógica.

### Ângulo de valor em bet builder
Quando as pernas são **positivamente correlacionadas mas a casa precificou como independentes** (multiplicou as odds sem desconto), o combo pode estar **sobreprecificado a seu favor**. Acontece em casas menos sofisticadas — vale checar o combo "Over 1.5 1º tempo + BTTS Sim" contra o produto das singles.

---

## 8. Fontes de dados para alimentar prognósticos

| Fonte | O que entrega para esta família |
|---|---|
| **FootyStats** (footystats.org/stats/1st-2nd-half-goals) | Gols de 1º/2º tempo por liga e por time, Over 0.5/1.5 por metade, tabelas de meio-tempo, 1500+ ligas. Base mais profunda. |
| **SoccerStats.com** (timing.asp, halftime.asp) | Distribuição de gols por janela de tempo, tabelas de 1º e 2º tempo por liga. |
| **Understat / FBref (StatsBomb)** | xG/xGA — idealmente quebrado por metade/janela. Essencial para o "manômetro de pressão". |
| **Opta / StatsBomb (pago)** | Dados minuto a minuto, sequências, eventos — para modelagem própria de λ(t). |
| **Pinnacle / Betfair Exchange** | Odds de referência "limpas" (margem fina / preço de mercado eficiente) para checar valor. |
| **Play The Percentage / StatsUltra / Scoreroom / goalstatistics** | Agregados de distribuição temporal e médias de 1º gol por liga (atenção à escala 10 vs 15 min). |
| **Sportingpedia** | Split 1º/2º tempo por liga e por time (96 times das top-5). |

Para modelagem própria: combine **Poisson com λ dividido por metade (λ₁, λ₂)** e **modulado no tempo via processo não-homogêneo** (taxa crescente e não-linear, com dip no reinício e aceleração no fim de cada metade), alimentado por **xG** em vez de gols brutos — isso captura qualidade de chance, não só resultado.

---

## PLUS) Camada live (ao vivo)

A família temporal é, na essência, **um conjunto de mercados in-play** — o relógio é a variável dominante.

### Decaimento temporal (o motor)
- Cada minuto sem gol **derruba** todos os Overs e **valoriza** os Unders. Em mercado de janela, assim que a banda passa sem gol, ela "morre" e o peso migra pra próxima.
- **Scalp de Under 1º tempo:** entrar aos 15–20 min num jogo 0–0 de tempo lento captura boa parte do decaimento com risco menor (já passou a janela 16–30 parcial).

### Gol cedo
- Mata o "No Goal" do mercado de 1º gol e **explode** as linhas de Over das janelas seguintes (ficam caras). Abre o jogo: time que sofreu cedo tende a se expor → ↑ probabilidade de mais gols. Bom momento para **lay the draw** se o placar abriu cedo.

### 0–0 ao intervalo com xG alto (a jogada-rei)
- Entrar em **Over 1.5 do restante / Over 2º tempo entre os min 50–60**, quando o xG acumulado do 1º tempo foi >1.0 mas o placar é 0–0. Lembre da baseline: 0–0 ao HT → ~74–75% de gol no 2º tempo mesmo sem pressão; com xG alto acumulado, sobe. Segure se o xG do time que precisa de gol continua subindo; saia se achatar.

### Expulsão (red card) — com modulação temporal
- Impacto enorme no λ, mas **dependente do minuto da expulsão**: estimativas de **~1,45 gol** (Mark Taylor, efeito médio sobre o jogo) a **~1,8 gol** (full match ~95min) são **tetos para expulsão no início do jogo** — quanto **mais cedo** a expulsão, **maior** o efeito, porque sobra mais tempo de jogo com a vantagem numérica. O estudo da Copa do Mundo identifica um **"ponto de virada" em torno do intervalo**: expulsão **tardia move pouco** o λ restante (resta pouco tempo). Modele o efeito **proporcional ao tempo restante**, não como número fixo.
- Decomposição: ~64% da mudança no saldo vem do **time com 11 marcando mais** que o esperado; o resto, do time com 10 marcando menos.
- Expulsões ocorrem em média **logo após o min 60**. O time numerário passa a dominar campo de ataque → **↑ Over do 2º tempo / da janela seguinte**, especialmente se o time superior precisa do gol. Mandante expulso é o pior cenário (desvantagem ~1,2 gol).
- **Trade:** com placar apertado + 1 a menos no fim, faça **lay do time que está na frente** quando o adversário tem homem a mais e mostra intenção ofensiva.

### Momentum / mudança de placar
- Time que vira a perder no 2º tempo **empurra** → abre espaço (gols pros dois lados). Substituições ofensivas por volta dos 60–80 min confirmam intenção de Over. Algoritmos live pesam muito o xG do 1º tempo e às vezes **subestimam fatores humanos** (urgência, resiliência pós-expulsão) — é aí que o trader atento acha o gap.

### Checklist live antes de entrar num mercado temporal
1. Placar e minuto atual (decaimento).
2. xG acumulado vs placar (cegueira de placar?).
3. Volume de finalizações + cantos da última janela (pressão real?).
4. Trocas táticas no intervalo / por volta do min 60.
5. Cartões/expulsões, **minuto** da expulsão e quem está com homem a mais (efeito proporcional ao tempo restante).
6. Quem precisa do gol (motivação) e está se expondo.

---

### Resumo executivo (one-liners)
- A curva de gols **cresce de forma não-linear** rumo ao fim de cada metade; o **bloco final de 10 min (81–90) é o decil mais cheio** (~18–19%); os **primeiros minutos de cada metade são a seca** — atenção: na escala de 15 min três blocos empatam ~20%, não há "pico único".
- As **duas metades** têm início abaixo do esperado (processo não-estacionário, não "linear sem ressaca").
- 2º tempo > 1º tempo em gols (~56/44) por **fadiga + substituições + chasing**; split estrutural confirmado nas top-5.
- **0–0 ao intervalo → ~74–75% de gol no 2º tempo** mesmo sem pressão; com xG alto acumulado, é o melhor EV da família (**cegueira de placar**).
- Margens crescem com o exotismo: **1º gol e janelas têm juice de 20–40%** — precise de vantagem real.
- Borda de liquidação (bet365): abandono antes dos 90 min → **void salvo já-determinado**; "Time of First Goal" vale se um gol já saiu.
- Live, **o relógio manda**: decaimento, gol cedo e expulsão (efeito **proporcional ao tempo restante**) redesenham todos os preços temporais.

---

## Fontes

- https://www.sportsboom.co.uk/betting/first-half-goals-betting-explained
- https://playthepercentage.com/blog/what-time-are-goals-scored-in-football
- https://goalstatistics.com/article/first-half-goal-stats-and-strategy
- https://www.honestbettingreviews.com/time-of-first-goal-strategy/
- https://www.predictology.co/blog/1st-half-expected-goals-vs-2nd-half-expected-goals-which-is-better-for-your-in-play-football-trading/
- https://www.ontheballbets.com/betting-guides/football/betting-markets/half-with-most-goals/
- https://arxiv.org/pdf/1408.5442
- https://www.predictology.co/blog/bet-builders-vs-single-bets-the-truth-about-correlation-pricing-and-hidden-ev/
- https://www.pinnacleoddsdropper.com/blog/overround
- https://www.pinnacleoddsdropper.com/blog/btts
- https://repub.eur.nl/pub/109448/REPUB_109448_OA.pdf
- https://caanberry.com/5-in-play-football-betting-strategies-that-work/
- https://footystats.org/stats/1st-2nd-half-goals
- https://www.performanceodds.com/betting-tricks/first-half-football-stats-early-goals-btts-over-patterns/
- https://www.soccerstats.com/stats.asp?page=10
- https://statsultra.com/when-are-most-goals-scored-football/
- https://arxiv.org/html/2501.18606v1
- https://link.springer.com/article/10.1007/s00181-017-1287-5
- https://help.bet365.com/s/en/sportsrules/soccer/abandoned-matches
- https://medium.com/@davidcharles22/how-often-do-matches-end-a-draw-when-its-0-0-at-half-time-244f4a6360e
- https://www.sportingpedia.com/2024/10/17/first-vs-second-half-goal-distribution-across-europes-top-5-leagues-scoring-patterns-of-all-96-teams/
- https://help.borgataonline.com/en/sports-help/sports-house-rules/soccer-wager-types-and-rules
