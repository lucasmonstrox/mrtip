---
mercado: contexto-motivacao-fatores
titulo: Contexto, Motivacao e Fatores
---

# Contexto, Motivacao e Fatores

> **Camada fundacional.** Este dossiê NÃO é sobre um mercado de aposta específico (over/under, escanteios, cartões, resultado). É sobre os **fatores de contexto e motivação** que atuam como *variáveis explicativas* por trás de TODOS os outros mercados. Para cada fator, a pergunta central é: **qual característica do jogo ele move, em que mercado, e em que direção?**

A tese operacional: o mercado de apostas precifica bem a *qualidade média* dos times (rankings, xG de longo prazo), mas precifica **mal os fatores situacionais** — motivação, calendário, clima, arbitragem, viagem. É exatamente aí que mora a maior parte do EV+ de um apostador analítico. As casas sabem disso e ajustam, mas o ajuste é frequentemente parcial e/ou atrasado.

**Aviso de calibração:** boa parte das "vantagens situacionais" que circulam em blogs de apostas é folclore. Onde a literatura peer-reviewed contradiz o número de blog, este dossiê marca a discrepância explicitamente (ver seções 4.6 e 6). O objetivo é separar **mecanismo plausível** de **edge comprovado** — não são a mesma coisa.

---

## 1. Definição e regras de liquidação (o que é "fator de contexto")

Esta família não tem regra de liquidação própria — ela é um **conjunto de inputs**. O que precisa ficar claro é o *escopo temporal e factual* de cada fator, porque é isso que determina como ele se conecta às regras dos mercados-alvo.

| Fator | Definição operacional | Janela em que age | Mensurável via |
|---|---|---|---|
| **Motivação/contexto** | O que cada time *precisa* do resultado (decisão, rebaixamento, fim de temporada, "nada em jogo") | Pré-jogo; muda só por classificação | Tabela, pontos para meta, rodadas restantes |
| **Estilo tático** | Posse vs contra-ataque vs pressão alta vs bloco baixo | Estrutural (muda lento) | PPDA, % posse, passes, xG por estilo |
| **Perfil de árbitro** | Tolerância a falta antes de cartão | Por designação | Cartões/jogo, faltas/cartão, pênaltis/jogo |
| **Clima e campo** | Chuva, vento, frio, gramado pesado | Dia do jogo | Previsão (vento km/h, mm de chuva), estado do gramado |
| **Calendário/cansaço** | Dias de descanso, jogo de meio de semana, congestionamento | Janela de ~7 dias antes | Datas dos jogos, minutos acumulados |
| **Mando + altitude/viagem** | Casa vs fora, distância percorrida, altitude do estádio | Pré-jogo | Mando, km de viagem, metros de altitude |
| **Viés psicológico** | Rivalidade, derby, pressão, narrativa, momentum | Pré + ao vivo | H2H, contexto narrativo, sequência recente |

**Casos de borda importantes:**
- "Nada em jogo" **não** é simétrico: um time já rebaixado pode jogar solto (mais gols) OU desligado (menos esforço). O contexto de cada elenco resolve o sinal.
- Decisão **dupla** (ambos precisam vencer) ≠ decisão **unilateral** (só um precisa). A segunda gera o clássico "favorito sem motivação x desesperado" — armadilha frequente.
- Altitude só conta como fator quando o **visitante sobe ≥ 2.000 m** vs. seu nível habitual; jogo entre dois times de altitude se anula.

---

## 2. Como a odd/margem se forma a partir do contexto

A casa precifica em camadas:

1. **Modelo base** (força do time): rankings, Elo, xG/xGA de longo prazo → probabilidade "limpa".
2. **Ajustes situacionais**: lesões/desfalques confirmados, mando, e *parcialmente* motivação/calendário/clima.
3. **Margem (juice/vig)**: tipicamente **3–7% por mercado** nas casas afiadas (Pinnacle na ponta baixa, ~2–3%; casas de varejo 5–10%+). Em mercados de nicho (cartões, escanteios, contexto) a margem sobe, porque há menos volume corretivo.
4. **Movimento de linha**: a linha se move por (a) dinheiro afiado (sharp) e (b) dinheiro de público. O **público se concentra em favoritos, clubes grandes e narrativas** — isso cria o desalinhamento.

**Onde o contexto distorce a precificação:**
- Apostas de "história" (revanche de derby, jogo-decisão hypado) tendem a ficar **superprecificadas no lado popular** — a linha do lado favorito do público fica curta demais. A *direção* é bem documentada (viés narrativo); os percentuais exatos de inflação que circulam (ex.: "5–10% na Pinnacle") vêm de blogs secundários e devem ser tratados como **ilustrativos, não auditados**.
- Quando um time faz **5+ mudanças** na escalação, a performance média cai de forma material, mas as casas tendem a mover a odd **menos do que a queda real** — o ajuste é insuficiente, sobra valor. (Magnitudes específicas — "queda de 18%, move só 8–10%" — são estimativas de mercado, não números peer-reviewed.)
- Clima extremo: as casas grandes incorporam previsão, mas o ajuste é **lento**; quem monitora vento/chuva e age cedo pega a linha antes do corte.

### 2.1 Reverse line movement (RLM) — o gatilho operacional de fade

O indicador mais concreto de "dinheiro afiado contra o público" é o **reverse line movement**: quando a **maioria dos bilhetes** está num lado, mas a **linha se move contra esse lado**.

- Exemplo: 75% dos bilhetes no favorito, mas a linha **encurta no azarão** (ou o handicap do favorito *aumenta*). Isso significa que o dinheiro grande (poucos bilhetes, muito volume) está do lado impopular.
- Regra prática: RLM > volume de bilhetes. Quando os dois divergem, **siga a linha, não o público**. É o sinal mais limpo de fade.
- Atenção: RLM é um *gatilho de atenção*, não uma garantia. Use-o para identificar onde olhar, depois confirme com a leitura de contexto (motivação, cansaço, clima). Não fade só por RLM isolado.

---

## 3. Tips e ângulos de valor (onde mora o EV+)

Resumo acionável por fator (detalhado na seção 4):

| Ângulo | Direção do EV+ | Por quê | Solidez |
|---|---|---|---|
| **Desesperado x favorito sem motivação no fim de temporada** | Handicap/empate no desesperado; under | Motivação assimétrica subprecificada; público olha só reputação | Mecanismo forte; magnitude variável |
| **Time com mais descanso x adversário com menos** | Lado descansado (efeito **atenuado**, não forte) | Cansaço subprecificado, mas o edge é pequeno na prática | Direção plausível; **62% NÃO confirmado** |
| **Árbitro rígido (≥4,5 amarelos/jogo) + dois times faltosos** | Over cartões | Casas precificam a média da liga, não o cruzamento árbitro×estilo | Forte (range de árbitro é real) |
| **Vento forte (> ~25 km/h)** | Under / BTTS Não | Precisão de passe e bola parada degradam | **Forte** (fator climático dominante) |
| **Chuva forte** | Under (leve) | Afeta passe; efeito sobre placar é pequeno | **Fraco-moderado** (rebaixado) |
| **Visitante de nível do mar subindo a 2.800–3.600 m** | Casa / over no 2º tempo / visitante sofre após 60' | Queda de sprint do visitante após o min 60 | Forte (efeito de altitude robusto) |
| **Reverse line movement contra o público** | Lado que a linha favorece | Dinheiro afiado vs público | Direção forte; é gatilho, não certeza |
| **Empate em jogo equilibrado e/ou de baixa motivação** | Back no empate | Público subvaloriza empate ("torcer pelo chato") | Direção real, **mas margem do empate é a maior** |

**Princípio do alinhamento:** nenhum fator isolado decide. O Over de cartões só é valor quando **os dois times E o árbitro** alinham. Dois times agressivos com árbitro caseiro podem dar **zero cartão**. Sempre cruze fatores.

---

## 4. Correlações com o jogo — o CORAÇÃO do dossiê

Aqui o mapeamento explícito: **fator → mercado → direção**, com números quando a fonte fornece (e com ressalva quando a fonte é fraca).

### 4.1 Motivação e contexto

| Cenário | Estilo de jogo que provoca | Mercado puxado | Direção |
|---|---|---|---|
| **Briga de rebaixamento (luta direta)** | Jogo aberto, desespero, risco | Over gols, BTTS Sim, over escanteios, over cartões | ↑ todos |
| **Decisão de título (precisa vencer)** | Pressão alta, tomada de risco | Over gols, vitória do motivado | ↑ |
| **"Nada em jogo" (já salvo, sem Europa)** | Intensidade baixa, rotação, juventude | Under gols, under escanteios | ↓ |
| **Time já rebaixado/campeão** | Bimodal: solto (↑) ou desligado (↓) | Depende do elenco | ambíguo |
| **Favorito grande no fim de temporada sem objetivo x time lutando** | Favorito desliga, lutador aperta | Empate/handicap do lutador; under | empate ↑ |
| **Derby/rivalidade** | Atmosfera intensa, mais faltas, mais empates | Over cartões ↑; empate ↑; gols com início travado | cartões ↑ |

> **Regra prática:** o time que **precisa** do resultado joga mais aberto → mais gols, escanteios e cartões. O time **sem nada em jogo** baixa a intensidade → unders. O erro de público é olhar só a **qualidade média** e ignorar o **gap de motivação**.

### 4.2 Estilo tático (o que puxa gols e escanteios)

Dados de cruzamento de estilos:

| Confronto | Média de gols | Escanteios | Cartões |
|---|---|---|---|
| **Pressão alta x bloco baixo** | ~2,4 gols (alta variância) | médio-alto | pressão alta gera mais faltas/cartões |
| **Dois times de pressão alta / jogo aberto** | alto | alto | alto |
| **Dois times defensivos / bloco baixo** | baixo (lean under) | baixo | baixo |
| **Posse dominante por um lado** | — | **Over escanteios** (domina território) | — |
| **Contra-ataque** | — | **menos escanteios** (ataque termina rápido) | — |

- Times de **pressão alta + jogo pelas pontas**: ~**5,5–6,5 escanteios/jogo**; times passivos e centrais: ~**4–5**.
- Times que atacam com **largura** (alas, laterais subindo, cruzamentos) empurram laterais adversários e **ganham mais escanteios**.
- Pressão alta força chutões apressados → mais escanteios concedidos pelo pressionado; e mais faltas → **mais cartões**.

### 4.3 Mando de campo

- Vantagem de casa hoje (médias 2026 por liga): **Serie A ~46% vitórias em casa / 1,60 PPG / +0,33 saldo**; **Bundesliga ~45% / 1,58 / +0,30**; **La Liga ~44% / 1,58 / +0,33**; **Ligue 1 ~43% / 1,55 / +0,27**; **Premier League ~42% / 1,53 / +0,25** (em queda histórica — de 65% em 1895).
- **Direção:** mando ↑ probabilidade de vitória do mandante, ↑ leve no over (mandante ataca mais), ↑ escanteios do mandante. Mas o efeito **encolheu** com o tempo — não superestime.
- **Experimento natural (COVID):** na temporada **2020/21 da Premier League, jogada sem público**, a taxa de vitória **visitante superou a do mandante pela primeira vez na história** (~40% visitante x ~38% mandante). Isso é evidência direta de que **parte relevante da vantagem de mando é torcida + influência sobre a arbitragem**, não logística pura. Reforça a tese: o componente "casa" que sobrevive sem público é menor do que o número agregado sugere.

### 4.4 Perfil de árbitro (puxa o mercado de cartões)

- Classificação: **rígido** = 1 cartão a cada **4–5 faltas**; **tolerante** = 1 a cada **8–10 faltas**.
- Premier League: árbitros variam de **~2,5 cartões/jogo** (mais brando, ex.: Craig Pawson) a **~4,7–5,0 cartões/jogo** (mais rígido, ex.: Stuart Attwell) — quase o dobro entre extremos. (Números "de até 7,0 cartões/jogo" que circulam não correspondem a nenhuma média de temporada real de PL.) Árbitro ≥ **4,5 amarelos/jogo** → valor no Over; ≤ **2,8** → evitar Over.
- **Booking points** (pontos de reserva): **10 pts por amarelo, 25 por vermelho**; o **máximo por jogador é 35 pts** (1 amarelo + 1 vermelho direto = 35; o 2º amarelo que vira vermelho **não soma 45**, e sim fica capado em 35).
- **Direção:** árbitro rígido **+ times faltosos + derby** → Over cartões/booking points. Árbitro tolerante → No-cards/Under fica curto. La Liga lidera disciplina (1.755 amarelos / 89 vermelhos em 2023/24).

### 4.5 Clima e campo (puxa under — com o vento na liderança)

| Condição | Efeito mensurado | Mercado | Direção | Solidez |
|---|---|---|---|---|
| **Vento forte** | precisão de passe e bola parada degradam; degrada goleiro e cruzamento | Under, BTTS Não | ↓ gols | **Forte** |
| **Chuva forte** | afeta principalmente precisão de passe; efeito sobre placar **pequeno** | Under (leve) | ↓ gols leve | Fraco-moderado |
| **Gramado pesado/encharcado** | jogo truncado, menos técnica | Under gols; jogo físico → mais faltas | ↓ gols, ↑ cartões | Moderado |
| **Frio extremo** | menos fluidez | Under (leve) | ↓ | Fraco |

> **O vento é o fator climático dominante**, não a chuva. Ele ataca passe, bola parada e goleiro. Time tecnicamente superior **sofre mais** (perde sua vantagem) — bom para handicap do azarão e para Under. A chuva tem efeito real mas **pequeno** sobre o placar (o número "gols caem ~17% na chuva" vem de fonte fraca e está provavelmente superestimado — não use como âncora).

**Curva de thresholds de vento (proxy do futebol americano, onde o dado é mais quantificado, transposto com cautela):**

| Velocidade de vento | Tendência de Under (proxy NFL) |
|---|---|
| > 10 mph (~16 km/h) | ~55% under |
| > 15 mph (~24 km/h) | ~58% under |
| > 17 mph (~27 km/h) | ~60% under |

No futebol o mecanismo é o mesmo (degrada passe longo, cruzamento, bola parada, saída de goleiro). O gatilho prático de **> 25 km/h (~15 mph)** é coerente com a curva; use a curva para *dosar* a convicção em vez de um corte binário.

### 4.6 Calendário e cansaço — onde o folclore mais erra

**O que a literatura SUSTENTA:**
- **Lesão sobe com congestionamento**: jogar com **< 4 dias** entre partidas associa-se a **+~28% de risco de lesão** (revisão sistemática, PMC9758680). Esse número é sólido.
- Músculo precisa de ~**72–96h** para recuperar plenamente. (O número específico "+44% de lesões de partes moles em dois jogos em 72h" **NÃO foi confirmado** em fonte peer-reviewed direta — é provável extrapolação de blog; trate como não-verificado.)

**O que a literatura REFUTA (correção crítica — o "European hangover" como queda de performance é majoritariamente um MITO entre times de elite):**

- O **estudo de 20 anos da Kitman Labs (Verheijen)** conclui o **oposto** do mito: times de Champions League **NÃO sofrem** com o congestionamento doméstico — eles **ganham ~+0,3 PPG** nos jogos pós-meio-de-semana, e o *gap* sobre times não-europeus **AUMENTOU** ao longo de 20 anos. Atribui o mito a **viés de confirmação**.
- A **meta-análise PMC7846542** (revisão crítica com meta-análise sobre congestionamento e performance) encontrou **efeito ZERO** do congestionamento sobre distância total, distância de sprint **e** desempenho técnico (passe). E **nem aborda gols**.
- O estudo peer-reviewed da **MDPI / Journal of Functional Morphology and Kinesiology (PMC7739226)** mostra que clubes na **Europa League tiveram desempenho doméstico SUPERIOR**, não inferior.

**Conclusão honesta:** o "European hangover" como **fade de performance dos grandes clubes** não tem suporte empírico robusto — as três fontes acima dizem o contrário. O ângulo só *pode* sobreviver em **recortes específicos**: time **mediano** (não elite, sem profundidade de elenco), **voo longo**, jogo **fora de casa**, **sem rodízio** de elenco. Mesmo aí, é **hipótese plausível, não comprovada**.

> **Teoria do João (ressaca de meio de semana):** "jogo importante no meio de semana + jogo **fora** no fim de semana → **Under**". Honestidade primeiro: a literatura citada acima **não comprova** o mecanismo para times de elite — para grandes clubes, ela o **refuta**. O ângulo da teoria pode reter validade num **recorte estreito** (time mediano, viagem longa, fora de casa, elenco sem profundidade para rodízio), onde a fadiga não é compensada por rotação. Mas tratá-lo como edge geral é folclore. Use a teoria como **filtro de atenção** sobre times medianos em viagem, não como regra automática de Under.

**Descanso assimétrico — atenção ao número inflado:**
- A direção (mais descanso ajuda) é **plausível, mas fraca/atenuada**, não um edge forte. O número de blog "**62% de vitória do time descansado (7 dias x 3 dias)**" **NÃO está confirmado** em fonte peer-reviewed de futebol — trate como não-verificado.
- A única estatística robusta de vantagem de descanso vem da **NFL** (esporte diferente): 7 dias rendia ~**58% PRÉ-2011** e **caiu para ~54%** depois, com pesquisa recente achando **"nenhuma evidência significativa"** de edge do time descansado na NFL moderna (o mercado já precifica). Lição: vantagens de descanso, mesmo onde existem, **encolhem** assim que o mercado aprende a precificá-las.

### 4.7 Altitude e viagem (puxa casa e desgaste tardio)

- **Quito ~2.800 m; La Paz ~3.600 m.** Visitante de nível do mar perde capacidade atlética; **sprints de alta intensidade despencam após o min 60**, com cãibras e fadiga.
- **Gradiente quantificado por país (McSharry 2007 / dados CONMEBOL):** o efeito **escala com a altitude**:
  - **Bolívia (La Paz, ~3.600 m):** ~**+45 pontos percentuais** de probabilidade de vitória vs. times de nível do mar.
  - **Equador (Quito, ~2.800 m):** ~**+29 pontos percentuais**.
- **Direção:** Casa ↑↑; **over no 2º tempo / gols tardios do mandante** ↑ (visitante quebra após 60'); handicap do mandante de altitude ↑.
- **Viagem (distância pura):** efeito histórico, mas **encolheu muito** — relevante antes de ~1990, hoje quase insignificante na maioria das ligas (jatos, logística; estudo de 57 anos confirma o declínio). Não superestime distância pura; **altitude continua real**.

### 4.8 Qualidade defensiva/ofensiva

- xGA alto (defesa vazada) dos dois lados → **BTTS Sim / Over**. xGA baixo dos dois → **Under / BTTS Não**.
- Ataque potente x defesa frágil é o cruzamento mais limpo para Over; dois blocos sólidos para Under.

### 4.9 Derby/rivalidade — números

- Derbies têm **~30%+ mais cartões** que a média da liga (suporta a direção "cartões ↑").
- Padrão de gols é **bimodal/cauteloso no início**: **menos gols nos primeiros ~20 min** (medo de errar, tensão), e o jogo **abre depois**. Útil para mercados de **gols por tempo** (under 1º tempo, over no 2º).
- Dado de mercado: ~**65% dos grandes derbies passam de 2.5 gols** — apesar do início travado. Isso *refina* a célula "over gols ambíguo": no agregado tende a **over**, mas com **1º tempo lento**. O builder ideal é *under HT + over FT*, não over linear.

---

## 5. Indicadores preditivos e como lê-los

| Indicador | Lê o quê | Aplicação por mercado |
|---|---|---|
| **xG / xGA** | Qualidade real de chances criadas/concedidas | Over/Under, BTTS — usar **mesma fonte** nos dois lados (não misturar Understat com FBref) |
| **PPDA** | Intensidade de pressing (passes permitidos por ação defensiva) | Estilo → gols, cartões, escanteios |
| **% posse / passes / largura** | Domínio territorial e estilo | Escanteios (posse+largura ↑), ritmo |
| **Forma recente** | Momentum, mas cuidado com recência | Ajuste, não causa principal |
| **H2H** | Padrão de confronto (derby, cartões) | Cartões, empate |
| **Escalação confirmada** | Rotação, desfalques | Um dos inputs mais subprecificados (5+ trocas = queda material de performance) |
| **Dias de descanso** | Fadiga | Under, oposição ao cansado (efeito atenuado — não superestime) |
| **Previsão do tempo** | Vento (km/h) > chuva (mm) | Under, BTTS Não (priorize vento) |

**Sobre fontes de xG:** FBref usa StatsBomb/Opta; Understat tem modelo próprio (>10 parâmetros, rede neural, >100k chutes). Modelos divergem: o mesmo chute pode ser 0,12 (Opta) vs 0,22 (StatsBomb). Em estudos, **Understat teve melhor lucro médio nas Big5**; Opta mais estável em La Liga/Ligue 1. **Regra de ouro:** uma fonte por comparação — nunca misture provedores nos dois lados de um Over/Under.

---

## 6. Armadilhas comuns (traps)

1. **Olhar só a qualidade média e ignorar o gap de motivação.** O clássico "grande sem objetivo segurado pelo lutador" no fim de temporada é comum, não exceção.
2. **Narrativa de revanche/derby infla a linha** do lado popular — comprar o lado hypado paga mal. (A *direção* é sólida; percentuais exatos de inflação são ilustrativos.)
3. **Recência:** mercado superreage a goleadas e highlights virais. Um número que "andou" por causa de um resultado isolado costuma ser valor no lado contrário.
4. **Subvalorizar o empate** por aversão psicológica ("torcer pelo chato") — mas ver trap #9: a margem do empate é a maior, então o desconto come parte do valor.
5. **Backing de cartões só por H2H** sem cruzar com o árbitro designado — dois times faltosos com árbitro caseiro dão **zero cartão**.
6. **Superestimar viagem/distância pura** — efeito quase morto hoje; altitude sim, distância não.
7. **Assumir que "nada em jogo" = under sempre** — pode virar festa de gols se o elenco joga solto.
8. **Comprar o "European hangover" como edge geral** — para times de elite a literatura **refuta** o efeito (Kitman 20 anos, PMC7846542, MDPI/PMC7739226). Só vale em recortes estreitos (time mediano + viagem + fora + sem rodízio), e mesmo assim como hipótese.
9. **Tratar "back no empate" como EV+ automático.** O empate é o mercado da via 1X2 com a **maior margem/vig embutida**, justamente porque o público o evita (outcome bias / preferência por resultados decisivos). ~**25% dos jogos terminam empatados**, e a ineficiência é real — **mas a margem inflada come parte do valor**. Só é EV+ quando sua probabilidade estimada **supera a margem extra**, não basta o jogo "ser equilibrado".
10. **Confundir mecanismo plausível com edge comprovado** (descanso 62%, chuva −17%, ressalva geral de meio de semana) — números de blog não são fatos.

---

## 7. Correlação entre mercados (bet builder / same game multi)

Como os fatores de contexto se propagam por várias pernas — e o que **combina** vs **se contradiz**:

| Combinação | Correlação | Observação de pricing |
|---|---|---|
| **Over 2.5 + BTTS Sim** | Positiva forte | Casa **encurta** a odd combinada (não multiplica) |
| **Mandante vence + Over escanteios mandante** | Positiva | Domínio territorial casa as duas |
| **Pressão alta dos dois + Over cartões** | Positiva | Mais faltas no pressing |
| **Resultado + Cartões/Escanteios** | Desconto típico **5–20%** | |
| **Resultado + Artilheiro específico** | Desconto **40–55%** | Forte correlação |
| **Under + Over cartões** | *Pode coexistir* | Jogo travado e faltoso (gramado pesado, derby) — não é contradição |
| **Over gols + Under cartões** | Tensão | Jogo aberto e limpo é possível, mas o builder paga pouco |
| **Mandante de altitude vence + Over 2º tempo** | Positiva | Visitante quebra após 60' |
| **Derby: Under HT + Over FT** | Positiva | Início travado, jogo abre depois |

**Mecânica:** o builder usa correlação (cópulas/Monte Carlo), não multiplicação simples. Margem composta de várias pernas chega a **20–30%** escondida. Combine pernas que o **mesmo fator de contexto** empurra na mesma direção (ex.: vento forte → Under + BTTS Não; derby → Over cartões + Under HT) — é onde o desconto da casa subestima a correlação real a seu favor.

---

## 8. Fontes de dados para alimentar prognósticos

| Categoria | Fonte | Para qual fator |
|---|---|---|
| **xG / xGA / chutes** | Understat, FBref (StatsBomb/Opta), StatsBomb, Opta/StatPerform | Gols, BTTS, qualidade |
| **PPDA / pressing / estilo** | FBref, Understat, provedores de PPDA | Tático |
| **Árbitros (cartões, faltas, pênaltis)** | FootyMetrics (referees), Squawka (fouls per card), bases de árbitro por liga | Cartões |
| **Clima** | Serviços de previsão (vento km/h em primeiro lugar, mm chuva) | Under, BTTS Não |
| **Calendário / minutos / descanso** | Calendários oficiais, trackers de carga | Fadiga (com cautela sobre magnitude) |
| **Mando / altitude / distância** | Bases de home advantage por liga, dados geográficos do estádio | Mando, altitude |
| **Linhas e movimento** | Pinnacle (referência afiada), comparadores de odds, monitores de % bilhetes vs linha | Detectar sharp vs público (RLM) |

---

## PLUS) Camada live (ao vivo)

Como a leitura dos fatores muda durante o jogo:

| Evento | O que o mercado faz | Onde mora o valor |
|---|---|---|
| **Gol cedo (dois times)** | Over encurta demais ("vai chover gol") | Se os gols vieram de bola parada/erro individual e não de domínio, **Under 2º tempo** pode ter valor |
| **Vermelho cedo** | "11x10, acabou" — preço bate forte | Mercado superreage; se foi após o 80', ainda precifica como se houvesse meio jogo — fade |
| **Vermelho no time forte (x fraco)** | Assume goleada do fraco | Frequentemente **total de gols CAI**: forte recua, organiza, frustra; fraco não tem qualidade para furar |
| **Mudança de placar** | Time que marca relaxa; time que sofre ou desmorona ou reage com urgência | Ler intensidade real, não emoção |
| **Gol no fim do 1º tempo** | Peso psicológico maior que gol no min 15 | Desmoraliza adversário na ida ao intervalo |
| **Altitude após min 60** | Visitante quebra fisicamente | **Over 2º tempo / próximo gol do mandante** |
| **Pós-meio-de-semana visível em campo** | Pressing some, jogo arrasta | Reforça **Under** ao vivo — **mas confirme com os olhos**, não pressuponha pelo calendário (ver 4.6) |
| **Derby após os ~20 min** | Início travado abre | Over no resto do tempo se o jogo destravou |

**Disciplina live:** o apostador profissional fica **parado a maior parte do tempo**, esperando o momento em que estado de jogo + odd ao vivo + leitura analítica se alinham. A camada de contexto pré-jogo (cansaço, motivação, altitude) é o que diz **qual overreaction live vale a pena fadar**. Agir sem motivo claro ao vivo é tão custoso quanto no pré-jogo.

---

### Síntese: tabela mestre fator → direção

| Fator | Empurra Over gols | Empurra Under gols | Empurra Cartões | Empurra Escanteios | Empurra Resultado |
|---|:--:|:--:|:--:|:--:|:--:|
| Desespero/decisão | ↑ | | ↑ | ↑ | a favor do motivado |
| Nada em jogo | | ↑ | ↓ | ↓ | |
| Pressão alta x bloco baixo | ↑ | | ↑ | ↑ | |
| Dois blocos defensivos | | ↑ | ↓ | ↓ | empate ↑ |
| Posse + largura | leve ↑ | | | ↑↑ | |
| Contra-ataque | | | | ↓ | |
| Árbitro rígido + faltosos | | | ↑↑ | | |
| Vento forte (> ~25 km/h) | | ↑↑ | | | azarão ↑ |
| Chuva forte | | ↑ (leve) | | | |
| Gramado pesado | | ↑ | ↑ | | |
| Pós-meio-de-semana / congestão | | ↑ (recorte estreito) | | ↓ | adversário descansado ↑ (atenuado) |
| Mando de campo | leve ↑ | | | mandante ↑ | mandante ↑ (parte é torcida/arbitragem) |
| Altitude (visitante sobe) | 2º tempo ↑ | | | | mandante ↑↑ |
| Derby/rivalidade | over FT ↑ / under HT | | ↑ | | empate ↑ |

---

## Fontes

- Late-Season Football Betting: Identifying Motivation Edges — Asianconnect88: https://www.asianconnect88.com/blog/betting-strategies/late-season-football-betting-motivation-edges
- Tactical Matchup Analysis: High Press vs Low Block = 2.4 Goals Average — StatPair: https://statpair.com/blog/tactical-matchup-analysis-team-styles
- Understanding football markets - Goals, cards and corners — AfricaPicks: https://www.africapicks.com/the-playbook/football-betting/understanding-football-markets-goals-cards-and-corners/
- Betting on bookings; the card markets & the impact of the referee — OLBG: https://www.olbg.com/blogs/betting-bookings-the-card-markets-the-impact-the-referee
- Referee Card Stats: Using Discipline Data for Betting — Planete Football: https://planetefootball.com/guides/referee-card-stats-betting
- Premier League referee stats ranked by fouls per card — Squawka: https://www.squawka.com/en/features/premier-league-referees-ranked-leniency/
- Weather Football Betting Guide: How Rain, Wind & Pitch Conditions Affect Matches — TipsterCompetition: https://tipstercompetition.com/article/weather-football-betting-how-rain-wind-pitch-conditions-affect-your-bets
- The influence of meteorological factors on technical performance of football teams — PMC11474995: https://pmc.ncbi.nlm.nih.gov/articles/PMC11474995/
- Home Advantage Statistics by Football League 2026 — SportBot AI: https://www.sportbotai.com/blog/home-advantage-statistics-by-football-league-2026
- Why Are Premier League Home Wins Down at COVID-Era Levels? — Opta Analyst: https://theanalyst.com/articles/premier-league-home-wins-covid-levels
- The Effect of Fixture Congestion on Performance: Systematic Review with Meta-Analysis — PMC7846542: https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542/
- The Effects of Fixture Congestion on Injury in Professional Male Soccer: A Systematic Review — PMC9758680: https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9758680/
- Playing in the UEFA Europa League Does Not Adversely Affect EPL or La Liga Performance — MDPI / J. Funct. Morphol. Kinesiol.: https://www.mdpi.com/2411-5142/4/1/2
- Fixture Congestion Betting: Exploit Winter Football's Fatigue Patterns — Watchdog Uganda: https://www.watchdoguganda.com/business/20251212/186589/fixture-congestion-betting-exploit-winter-footballs-hidden-injury-fatigue-patterns.html
- Do mid-week European matches influence domestic league performance? A 20-year study — Kitman Labs (Verheijen): https://www.kitmanlabs.com/blog/verheijen-20-year-study/
- European hangover: Who bettors should oppose ahead of the weekend — Goal.com: https://www.goal.com/en-gb/betting/european-hangover-weekend-picks/blt8043f079a752ab85
- Statistical influence of travelling distance on home advantage over 57 years — Springer / German Journal of Exercise and Sport Research: https://link.springer.com/article/10.1007/s12662-021-00787-7
- South America's home-field advantage like no other (altitude) — ESPN: https://www.espn.com/soccer/story/_/id/37345733/south-america-home-field-advantage-no-other
- Ecuador Soccer Analytics: Altitude Home-Field Advantage — Sports-Analytics.pro: https://sports-analytics.pro/ecuador-soccer-analytics-home-advantage-at-altitude/
- Altitude and athletic performance: statistical analysis using football results (McSharry) — ResearchGate: https://www.researchgate.net/publication/278351298_Altitude_and_athletic_performance_statististical_analysis_using_football_results
- Narrative Fallacy: Creating Stories from Random Results in Sports Betting — OddsOnNet: https://oddsonnet.com/news/narrative-fallacy-creating-stories-from-random-results-in-sports-betting
- Bet Builder Calculator: Estimate Same Game Multi Odds & Correlation Discount — GamblingCalc: https://gamblingcalc.com/betting/football/bet-builder-calculator/
- Booking Points (yellow=10, red=25, max 35/player) settlement rules — GamblingCalc: https://gamblingcalc.com/betting/football/cards-booking-points-calculator/
- Comparing the predictive power of different xG data providers — Beat the Bookie: https://beatthebookie.blog/2024/01/06/comparing-the-predictive-power-of-different-xg-data-providers/
- xG Explained — FBref: https://fbref.com/en/expected-goals-model-explained/
- Live Football Betting Strategy: In-Play Markets and Tactics — FootballBookie: https://football-bookie.com/articles/live-football-betting-strategy/
- Red Cards & In-Play Betting: How to Spot Value When the Odds Overreact — GeckoEdge: https://geckoedge.ai/red-cards-in-play-betting-how-to-spot-value-when-the-odds-overreact/
- How packed schedules affect football pool results — FixtureResults: https://www.fixturesults.com/results/how-packed-schedules-affect-football-pool-results-and-prediction-accuracy/
- Bye-bye, bye advantage: estimating competitive impact of rest differential (NFL) — Frontiers: https://www.frontiersin.org/journals/behavioral-economics/articles/10.3389/frbhe.2024.1479832/full
