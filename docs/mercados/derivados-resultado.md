---
mercado: derivados-resultado
titulo: Derivados de Resultado
---

# Derivados de Resultado

> Dossiê de referência neutro/global sobre os mercados que derivam do resultado do jogo (1X2) sem serem o 1X2 puro: **Dupla Chance**, **Empate Anula / Draw No Bet (DNB)**, **Intervalo-Final (HT/FT)**, **Margem de Vitória / Vencedor por X gols**, **Corrida a X gols (Race to X Goals)** e **Resultado + Ambas Marcam combinado**.
>
> Princípio unificador: todos estes mercados são *transformações algébricas da matriz de placar*. Se você modela a probabilidade de cada placar (ex.: via Poisson bivariado / xG), todos eles caem como subtotais da mesma grade. Isso é o que permite atacar precificação ruim: a casa muitas vezes precifica cada derivado isoladamente, sem garantir coerência interna entre eles.

---

## 0. Mapa-mãe: tudo vem da matriz de placar

Considere a grade de probabilidades de placar P(i,j) = prob. de o mandante fazer `i` e o visitante fazer `j`. Todo derivado de resultado é uma soma de células dessa grade:

| Mercado | Definição como soma de células |
|---|---|
| 1 (Casa) | soma onde i > j |
| X (Empate) | soma onde i = j |
| 2 (Fora) | soma onde i < j |
| 1X (Dupla Chance) | P(1) + P(X) = soma onde i ≥ j |
| 12 | P(1) + P(2) = soma onde i ≠ j |
| X2 | P(X) + P(2) = soma onde i ≤ j |
| DNB Casa | P(1) / (P(1)+P(2))  *(renormalizado, empate devolvido)* |
| Margem Casa por 1 | soma onde i − j = 1 |
| Margem Casa por 2+ | soma onde i − j ≥ 2 |
| Resultado + BTTS (Casa & GG) | soma onde i > j **e** j ≥ 1 |
| HT/FT | exige modelar 1º tempo e jogo todo separadamente |
| Race to 2 | quem chega primeiro a 2 gols — depende da **sequência temporal**, não só do placar final |

**Implicação prática nº 1:** Dupla Chance e DNB são *recombinações* do mesmo 1X2. Não há informação nova — só uma redistribuição de risco. O valor mora em descompasso de margem.

**Implicação prática nº 2:** Race to X e HT/FT **não** são puramente função do placar final — dependem de *quando* e *em que ordem* os gols saem. São os únicos da família com dependência temporal real, e por isso os mais difíceis de precificar (e onde mais aparece valor/erro).

**Implicação prática nº 3 (contexto de consumo):** hoje a maioria desses derivados — Dupla Chance como perna "segura", Result+BTTS, Race-to-X — é consumida **dentro de Same Game Parlay / Bet Builder** (bet365 Bet Builder, SGP de DraftKings/FanDuel etc.), não como aposta simples isolada. Isso é decisivo porque **as regras de liquidação (void vs. perda) mudam conforme o derivado está sozinho ou dentro de uma combinada** — ver §1.5 e §7.

---

## 1. Definição e Regras de Liquidação

> **Padrão de tempo (vale para TODA a família, salvo indicação explícita):** liquida em **90 min + acréscimos**. **Prorrogação e pênaltis NÃO contam.** O ponto que **difere por casa e por mercado** é o tratamento de **abandono/adiamento** — destacado em cada submercado abaixo.

### 1.1 Dupla Chance (1X, 12, X2)

- **1X** — vence se mandante ganha **ou** empata. Perde só se o visitante vence.
- **X2** — vence se visitante ganha **ou** empata. Perde só se o mandante vence.
- **12** — vence se qualquer time ganha. Perde só no empate.
- **Tempo regulamentar apenas:** liquida em 90 min + acréscimos; prorrogação/pênaltis fora.
- **Push/void:** mercado de 3 resultados cobrindo 2 — não há "push" natural. **Abandono/adiamento:** void conforme regras da casa (stake devolvida) se o jogo não chega ao tempo mínimo definido.
- **Borda importante:** não é o mesmo que dividir a stake em duas apostas 1X2 separadas. A casa cota um preço único — que pode ou não bater com a combinação justa das duas pernas (ver §2).

### 1.2 Empate Anula / Draw No Bet (DNB)

- Você banca um time para **vencer**. Resultados:
  - Time vence → paga nas odds exibidas.
  - **Empate → stake devolvida (push/void da aposta).**
  - Time perde → perde a stake.
- Equivale economicamente a um **handicap asiático 0,0** (linha zero) — equivalência confirmada (AH 0.0 = DNB).
- **Mecânica do risco:** o empate, que no 1X2 é resultado perdedor, vira *devolução*. Quanto isso "reduz" a probabilidade de perda **depende do jogo**:
  - *Jogo equilibrado* (win/draw/loss ≈ 33% cada): a chance de perder cai de ~66% (empate+derrota perdem no 1X2) para ~33% (só a derrota perde). **Esses números são ilustrativos desse caso simétrico, não constantes.**
  - *Favorito claro:* o empate costuma valer só ~25–30%, então a "redução" real de risco é menor e a devolução acontece com menos frequência. Calcule caso a caso a partir do 1X2 no-vig.
- **Tempo regulamentar**, prorrogação/pênaltis fora salvo indicação. Abandono: void.

### 1.3 Intervalo-Final (HT/FT)

- Acerto duplo num único bilhete: **resultado no intervalo E resultado final**, ambos corretos. 9 combinações: 1/1, 1/X, 1/2, X/1, X/X, X/2, 2/1, 2/X, 2/2 (notação Casa/Empate/Fora em cada checkpoint).
- Exemplo: jogo X/1 = empate no intervalo, vitória da casa no fim (ex.: 0-0 ao HT, 2-1 ao FT).
- **Liquida em 90 min**; prorrogação e pênaltis não contam.
- Por exigir dois checkpoints corretos, as odds são **mais longas** que o 1X2 (ver distribuições em §5).
- **Void por abandono (granular):** abandono **antes do intervalo** geralmente anula **tudo**; abandono **no 2º tempo** varia por casa (algumas anulam tudo, outras já consideram a perna do HT, que é evento consumado) — checar regras específicas.

### 1.4 Margem de Vitória / Vencedor por X gols

- Você aposta na **banda de gols** entre vencedor e perdedor: "Casa por 1", "Casa por 2", "Casa por 3+", "Fora por 1"…
- Variante "Vencedor & Margem" exige acertar **quem vence E por quantos**.
- **Empate tratado como DUAS seleções na maioria das casas (importante e frequentemente omitido):**
  - **"Score Draw"** = qualquer empate **com gols** (1-1, 2-2, 3-3…).
  - **"No Score Draw"** = somente **0-0**.
  - Isso importa porque o **0-0 é uma célula isolada** da matriz de placar: na hora de somar células, o empate não é uma faixa única. Se a casa só oferecer "Empate" como seleção única, ela está agregando essas duas células — sempre confira a estrutura de seleções.
- **Push:** em futebol (gol inteiro), a margem é discreta — não há meia-linha, então não há push por meia-banda como em pontos. Se a casa oferece bandas (ex.: "1-2 gols") e o resultado cai fora da banda, **perde** (não há push).
- Se você bancou "Casa por X" e deu empate (qualquer), **perde**.
- **Tempo regulamentar.** "Winning margin" europeia ≠ handicap (handicap dá vantagem fictícia; margem exige número/banda exatos). Abandono: void conforme casa.

### 1.5 Corrida a X Gols (Race to X Goals)

- Aposta em **qual time chega primeiro a X gols** (tipicamente 2 ou 3). Seleções: "Casa", "Fora" e, na maioria das casas, **"Nenhum time" (Neither)** quando ninguém atinge X.
- **Borda crítica de liquidação (corrigida — o ponto mais importante deste dossiê):**
  - **Aposta SIMPLES sem a opção "Neither" disponível, e ninguém atinge X gols:** a regra padrão da indústria (DraftKings, regras genéricas verificadas) é **VOID / aposta anulada → stake REEMBOLSADO** ("all bets will be declared void, unless odds for such eventuality have been published"). **Não** é perda automática.
  - **Dentro de Same Game Parlay / Bet Builder:** aí sim a perna pode ser tratada como **PERDA** (a perna correlacionada é marcada como perdida para não "quebrar"/anular a combinada inteira). Esse é o caso onde o derivado de fato vira perdedor.
  - Resumo: *simples sem Neither que não atinge o alvo = void/reembolso; mesma perna dentro de SGP = pode ser perda.* Sempre confirme (a) se há a terceira via "Neither" e (b) se você está em simples ou builder.
- **Settlement instantâneo:** liquida no momento em que um time marca o X-ésimo gol (mercado tipicamente in-play/live).
- **Tempo regulamentar** (90 min + acréscimos), prorrogação fora salvo indicação.
- Dependência de **ordem temporal**: em 2-1, se a casa fez 2-0 antes do visitante descontar → "Casa Race to 2" vence; mesmo na sequência 0-1, 1-1, 2-1 a casa chega primeiro a 2. A sequência importa.

### 1.6 Resultado + Ambas Marcam (Result + BTTS)

- Bilhete único de duas partes: **quem vence (ou empata) E ambos marcam (GG)**. Ex.: "Casa vence & GG" vence em 2-1, 3-2, 3-1 (com gol do visitante)… mas **perde** em 1-0, 2-0, 3-0.
- Não é múltipla — é uma seleção única com duas partes; se uma parte falha, perde tudo.
- Subcaso correlato: **"Win to Nil"** (vencer sem sofrer) é o *oposto* — vence + NG (não-ambos). Result+BTTS e Win-to-Nil são **mutuamente exclusivos** para o mesmo vencedor.
- **Tempo regulamentar.** **Abandono (granular):** se o evento "ambos marcaram" **já ocorreu** antes do abandono, muitas casas já liquidam essa parte como cumprida; se ainda não ocorreu, costuma anular. Checar regras.

---

## 2. Como a Odd/Margem se Forma

### 2.1 Conversão a partir do 1X2 (a fórmula que você precisa)

O caminho canônico (3 passos):

1. **Odd → probabilidade implícita:** `p = 1 / odd_decimal`
2. **Somar as duas probabilidades relevantes**
3. **Voltar para odd:** `odd_DC = 1 / (p_A + p_B)`

**Exemplo numérico (Dupla Chance 1X):** odds 1X2 = Casa 2.50 / Empate 3.20 / Fora 3.00.
- p(Casa) = 1/2.50 = 40,0%
- p(Empate) = 1/3.20 = 31,25%
- p(1X) = 71,25% → odd justa 1X = 1/0,7125 = **1.40**

⚠️ Esses 1X2 já trazem a margem embutida. Para a odd **justa** (no-vig), remova a margem do 1X2 primeiro, renormalize, e só então some.

### 2.2 A questão da margem na Dupla Chance (formulação correta)

Existe um mito de que "Dupla Chance sempre paga a margem duas vezes e é sempre pior que o 1X2". **A formulação precisa é mais sutil:**

- **A penalidade de valor é real em casas de VAREJO** que precificam o mercado de Dupla Chance **isoladamente**, aplicando uma margem própria inflada sobre o derivado em vez de derivá-lo do 1X2 no-vig. Aí, sim, o apostador efetivamente paga juice em cima de juice.
- **Mas não há valor inerentemente pior.** Uma casa afiada como a **Pinnacle não trata DC como *loss leader* nem aplica margem extra** — ela aplica a **mesma margem baixa (~2%) a todo mercado** e chega a enquadrar a Dupla Chance como alternativa que pode ser "melhor" dependendo do uso. Ou seja: DC só é pior **quando a casa cobra margem separada/dupla sobre o derivado**, não por natureza do mercado.

A consequência prática para o trader: **compare sempre `odd_DC` da casa contra a combinação justa (no-vig) das duas pernas 1X2.** Se a casa cota acima do justo, está cara (caso comum no varejo). Se cota igual ou melhor, não há penalidade. O alerta clássico — *"a casa precifica o mercado de dupla chance de forma injusta… cortam as odds e isso esconde valor terrível"* — aplica-se ao **varejo precificando DC isolado**, não a toda casa.

### 2.3 DNB: derivação no-vig

DNB Casa = probabilidade condicional de vitória **dado que não houve empate**:

```
odd_DNB_Casa = 1 / [ p(Casa) / (p(Casa) + p(Fora)) ]
```

Removido o empate, a stake só "joga" nas células onde alguém vence. **Exemplo:** p(Casa)=40%, p(Fora)=33,3% → p_DNB = 40/(40+33,3) = 54,5% → odd ≈ **1.83**. Compare com a Dupla Chance 1X (1.40): para o mesmo time, **DNB paga muito mais** quando o time efetivamente vence, ao custo de só devolver (não lucrar) no empate.

### 2.4 Margens típicas por mercado

| Mercado | Margem/overround típico | Observação |
|---|---|---|
| 1X2 (casas afiadas tipo Pinnacle) | 2–3% | benchmark de referência |
| 1X2 (casas de varejo) | 5–7% | padrão de indústria |
| Dupla Chance | igual ao 1X2 quando derivada no-vig; **inflada** quando precificada isolada no varejo | não é pior por natureza (ver §2.2) |
| DNB | ~igual ao 1X2 (handicap 0) | costuma ser justo |
| HT/FT | **elevada: ~15–20% escondidos** (gamblingcalc) | overround espalhado em 9 seleções |
| Margem de Vitória | alta (muitas bandas, evento raro) | bandas extremas mais "esticadas" |
| Race to X | média-alta, depende de live | sensível a sequência |
| Result+BTTS | alta (combo) | margem composta das duas dimensões |

**Regra de bolso:** quanto mais exótico e mais "vias" o mercado tem, mais a casa espalha (e infla) a margem. HT/FT chega a esconder **15–20%** de margem; Margem e Result+BTTS também são pesados de juice — só valem a pena com edge claro.

### 2.5 Como a linha se move

- **Movimento puxado pelo 1X2:** como tudo deriva do 1X2, DC/DNB seguem mecanicamente o movimento da linha-mãe. Notícia de escalação que encurta a Casa encurta automaticamente 1X e DNB-Casa.
- **HT/FT e Margem** movem-se também com **expectativa de gols (totais)** e de **placar**: a linha aqui responde a *dois* sinais (resultado + volume de gols). Mais gols esperados não favorece uniformemente — alimenta viradas e desfechos D/H (empate ao HT → vitória), não necessariamente o 1/1.

---

## 3. Tips e Ângulos de Valor (onde mora o EV+)

### 3.1 Dupla Chance
- **EV+ raramente no preço puro de varejo** (margem isolada inflada — §2.2). O valor aparece quando você precisa de **uma perna segura num builder/cash-out** ou para **bancar zebra que você acha que "não perde"** (1X num azarão em casa sólido defensivamente).
- **Arbitragem interna:** compare sempre `odd_DC` da casa contra a combinação justa (no-vig) das duas pernas 1X2. Promoções/erros às vezes deixam o DC **mais barato** que o justo (raro, mas é onde está o ouro).

### 3.2 DNB > Dupla Chance para o mesmo time
- **Tese de valor canônica:** se você tem convicção forte de vitória mas teme um gol tardio, **DNB entrega odds muito mais atraentes** que a Dupla Chance, maximizando lucro na vitória e protegendo o capital no empate.
- DNB **suaviza variância**: transforma períodos de perda em "estagnação" (devoluções) — bom para moral e gestão de banca.
- **Use DC (1X) em vez de DNB** só quando você acha que o **empate em si é o resultado provável de sucesso** (azarão jogando para o ponto).

### 3.3 HT/FT
- Valor vem de **modelar o ritmo do 1º tempo + ajustes do 2º tempo + comportamento do treinador**, e então alinhar ao preço.
- **Ângulo X/1 e X/2 (empate ao HT, favorito vence ao FT):** acontece MAIS do que modelos básicos sugerem, porque **mais gols saem no 2º tempo**. Favoritos que demoram a "engrenar" são X/1 clássicos. Subvalorizado por apostadores que assumem que favorito sai na frente cedo.
- **Evitar viradas (1/2, 2/1)** como aposta de valor — são "marcadas por aleatoriedade e odds altas" (30.00 a 100.00). Só com leitura específica (favorito frágil + zebra de bom 2º tempo).

### 3.4 Margem de Vitória
- **As margens que mais saem são as simples: 1 e 2 gols.** Tentar 3, 4, 5+ é sedutor (payout grande) mas raro.
- Bandas seguras (margem 1-2) ainda pagam 5/1 a 10/1 — bom EV quando você tem mismatch claro.
- **Favorito forte em casa contra defesa ruim → margem 2+** é o cenário de valor mais consistente.

### 3.5 Race to X Goals
- Valor live: **após gol cedo de um time forte**, "Race to 2" desse time fica curto mas pode ainda ter EV se o adversário está aberto. Inversamente, em jogo travado 0-0 aos 60', "Neither team to reach 2" frequentemente é subvalorizado.

### 3.6 Result+BTTS
- **Sweet spot: bancar favorito que VENCE mas CONCEDE** — não goleada. Foque em times com **ataque forte + defesa vazada** (e o adversário com ataque decente).
- Times de **meio de tabela** são os melhores para BTTS: marcam o suficiente, mas defesa frágil.

---

## 4. Correlações com o Jogo (o CORAÇÃO)

> Aqui o que importa: **qual característica do jogo PUXA cada mercado pra cima ou pra baixo, e em que direção.** Organizado por driver.

### 4.1 Estilo de jogo (posse vs contra-ataque vs pressão alta)

| Característica | Empurra ↑ | Empurra ↓ |
|---|---|---|
| **Pressão alta + linha adiantada** (Gegenpress) | BTTS, Result+BTTS, Race to 2, viradas HT/FT (X/H, A/H) — deixa espaço atrás → mais gols dos dois lados | "Win to Nil", DC defensivo do adversário |
| **Posse controlada + bloco baixo sólido** | Win-to-Nil, Margem 1-0/2-0, DNB do favorito | Result+BTTS (o forte não concede), Race a 2 do adversário |
| **Contra-ataque** (cede posse, golpeia) | 12 (jogo aberto), viradas, Race volátil | HT/FT 1/1 estável |
| **Dois times ofensivos e ingênuos** | Result+BTTS, 12, BTTS | Margem 3+ (placar elástico raro quando ambos marcam) |

**Mecânica-chave:** times que **pressionam alto e deixam espaço atrás engajam mais em jogos BTTS**, especialmente contra meio de tabela com bom ataque. Já times que **controlam posse + têm zaga sólida vencem to nil com mais frequência**.

### 4.2 Ritmo / Tempo (pace)

- **Liga/jogo de tempo alto → mais gols → favorece Result+BTTS, viradas HT/FT, Race a 2 rápido.** Bundesliga produz mais jogos BTTS que Serie A; Premier no meio.
- **2º tempo concentra gols** → estrutura natural de X/1, X/2 (empate ao HT, decisão no fim). Por isso X/* é estatisticamente comum (ver §5).
- **Tempo baixo / muitas faltas e paradas** → favorece **0-0 ao HT (X/*), Margem pequena, DC defensiva**, e "Neither" no Race.

### 4.3 Mando de campo

- Vantagem de casa empurra **1X (casa não perde)** e **1/1 (lidera e mantém)**. Por isso 1/1 é o HT/FT mais comum em cenário de favorito mandante.
- Mando também sustenta **DNB-Casa** e **Margem-Casa 1-2**.
- Visitante forte → X2 e 2/2 ganham peso; viradas A/H (casa reage no fim) aparecem.

### 4.4 Perfil do árbitro

- Árbitro **rigoroso (muitos cartões) → mais expulsões/pênaltis → mais variância**: favorece viradas HT/FT, jogo aberto (12), e desfavorece Win-to-Nil e Margem previsível.
- Árbitro **permissivo (deixa correr) → jogo mais up-tempo → mais gols → BTTS/Race**.
- O driver é indireto: cartões mudam **game state** (homem a menos → §9), que então move os derivados.

### 4.5 Clima / campo

- **Chuva forte / campo pesado / vento** → menos gols, mais erros → empurra **Empate, 0-0 (X/X e "No Score Draw"), DC defensiva, Neither no Race, Margem 0-1**. Reduz Result+BTTS e goleadas (Margem 3+).
- Calor extremo → ritmo cai no 2º tempo → favorece quem lidera ao HT segurar (1/1, 2/2).

### 4.6 Calendário / cansaço

- **Time com jogo decisivo no meio de semana + viagem + jogo fora no fim de semana → under / menos gols / mais empate** (rotação, pernas pesadas). Isso empurra **X2/1X defensivo, DNB do time descansado, Margem pequena**. *(Hipótese alinhada à "teoria da ressaca de meio de semana" — checar contexto específico.)*
- Fadiga reduz intensidade do 2º tempo → favorece manutenção de placar (1/1, 2/2) sobre viradas.

### 4.7 Motivação e contexto

- **Decisão / mata-mata / fim de temporada com algo em jogo** → jogo cauteloso → **mais empate ao HT (X/*), Margem pequena, DC, under**. Times "jogam para não perder".
- **Time sem nada em jogo vs time precisando vencer** → assimetria → favorece o motivado no DNB/Margem, e abre espaço para Result+BTTS.
- **Rivalidade/dérbi** → mais cartões + mais cautela tática → tende a empate/margem curta, mas com cauda de jogo aberto.

### 4.8 Qualidade defensiva/ofensiva (o mais direto)

- **Ataque forte vs defesa fraca** = motor da **Margem 2+ e goleada**.
- **Ataque forte + defesa fraca (do MESMO favorito)** = motor do **Result+BTTS** (vence mas concede).
- **Defesa elite** = motor de **Win-to-Nil, Margem 1-0, DNB seguro** e *contra* Result+BTTS.

---

## 5. Indicadores Preditivos (como ler para cada mercado)

### 5.1 Ferramentas-base

- **xG / xGA:** expectativa de gols criados/sofridos. Some xG dos dois → ritmo do jogo (alimenta BTTS/Race/Margem). Diferença xG − xGA → favoritismo (alimenta DC/DNB/Margem).
- **Poisson:** converte xG (λ) em probabilidade de cada placar: `P(k) = (λ^k · e^−λ) / k!`. Da grade de placar você extrai **todos** os derivados (§0). Limitação: ignora forma, cartões, táticas — combine com xG/julgamento.
- **Forma recente, H2H, escalação, chutes/posse, médias históricas.**

### 5.2 Leitura por mercado

| Mercado | Indicadores que mais importam |
|---|---|
| **Dupla Chance / DNB** | diferencial de força (xG−xGA), solidez defensiva do azarão, taxa histórica de empate do confronto, mando |
| **HT/FT** | **xG por 15 min** e tempo de chute inicial; distribuição do tempo do 1º gol; minuto médio de substituições; índice de proteção de vantagem (tempo de passe quando à frente) |
| **Margem de Vitória** | xG-diff esperado, margens recentes do favorito, xGA do adversário, histórico de goleadas/jogos apertados, % de 0-0 (para No Score Draw) |
| **Race a X** | ritmo (xG somado), tempo médio do 1º gol, % de jogos que atingem 2+ gols cedo, perfil de início rápido vs lento |
| **Result+BTTS** | xG do favorito **E** xGA do favorito (precisa conceder); xG do adversário; % BTTS histórico dos dois; meio-de-tabela como filtro |

### 5.3 Distribuições HT/FT de referência (ORDENS DE GRANDEZA — não números fechados)

> Nenhum dataset auditado único; fontes secundárias divergem. **Tratar como faixa, não verdade.**

| Resultado | Frequência típica | Notas |
|---|---|---|
| **Empate ao intervalo (qualquer X/*)** | **~40%** | desfecho de HT mais provável — base do ângulo X/1, X/2 |
| **1/1** (casa lidera e vence) | ~22–26% (até 30–35% em ligas de forte mando) | mais comum dos 9 desfechos |
| **X/1** (empate HT → casa vence) | ~16–20% | subvalorizado; 2º tempo concentra gols |
| **X/X** (empate-empate) | ~24% de probabilidade real (gamblingcalc) | desfecho frequente, subprecificado |
| **X/2** (empate HT → fora vence) | ~10–15% | análogo a X/1 para o visitante |
| **2/2** (fora lidera e vence) | variável (< 1/1, sem mando) | |
| **1/X, 2/X** (lidera e cede empate) | médio | "lead protection" fraca |
| **1/2, 2/1** (viradas) | **raras** | odds 30.00–100.00; alta aleatoriedade |

*(O 2º tempo concentra mais gols que o 1º nas top-5 ligas europeias — Sportingpedia —, o que sustenta a prevalência de empate ao HT e desfechos X/*.)*

---

## 6. Armadilhas Comuns (Traps)

1. **DC "porque parece seguro":** a maior trap. O viés de aversão à perda faz o apostador pagar margem **isolada inflada** (no varejo) por segurança ilusória. Quase sempre DNB ou 1X2 simples têm melhor EV — *exceto* se a casa derivar o DC no-vig (Pinnacle), aí não há penalidade.
2. **Esticar odds sem correlação no builder** (ver §7): adicionar "Resultado" só pra alongar o preço quando ele *contradiz* as outras pernas.
3. **HT/FT viradas (1/2, 2/1) como "value de odd alta":** odds altas ≠ valor; são quase ruído.
4. **Race to X sem checar a opção "Neither" E sem saber se é simples ou SGP:** em **simples sem Neither**, ninguém atingir X = **VOID/reembolso** (não perda). **Dentro de SGP**, a mesma perna pode ser tratada como **perda** e derrubar a expectativa do builder. Confundir os dois casos quebra o cálculo de EV.
5. **Margem 3+/goleada em favorito:** o cérebro superestima a goleada; a base é margem 1-2. Payout sedutor, EV negativo.
6. **Narrativa "favorito sempre sai na frente":** ignora que o 2º tempo concentra gols → subestima X/1, X/2 e superprecifica 1/1.
7. **Result+BTTS num favorito que goleia:** se o esperado é 3-0/4-0, BTTS cai — a perna BTTS mata o bilhete. Trap clássica de correlação negativa.
8. **Ignorar prorrogação em mata-mata:** todos esses mercados liquidam em 90 min; o apostador esquece e "vê" o time avançar nos pênaltis achando que ganhou o DNB.
9. **Tratar "Empate" como seleção única na Margem:** muitas casas separam **Score Draw** (1-1, 2-2…) de **No Score Draw** (só 0-0). Apostar "empate" achando que cobre os dois pode deixar metade do risco descoberto.
10. **Jogos onde o mercado erra sistematicamente:** mata-mata cauteloso (mercado infla gols/viradas), times pós-meio-de-semana cansados (mercado lento pra ajustar o under), e azarões mandantes defensivos (DC 1X subvalorizado porque o público só vê o favorito).

---

## 7. Correlação Entre Mercados (bet builder / same game multi)

> Regra de ouro: **só combine pernas que se reforçam (correlação positiva). Combinações negativas destroem o EV mesmo com odd grande.** E lembre que **dentro de SGP as regras de void/perda mudam** (ver §1.5).

### 7.1 Mini-matriz de correlação (soccer-específica)

| Par | Sinal | Por quê |
|---|---|---|
| **Over 2.5 + BTTS** | **POSITIVA** | mais gols → mais provável ambos marcarem; é o par de SGP mais explorado. Casas **reduzem o payout** e às vezes **bloqueiam** a combinação por causa disso (BoydsBets) |
| **Result+BTTS + Over 2.5** | **POSITIVA** | "Casa vence & GG" herda a correlação Over/BTTS — alto xG dos dois lados |
| **Favorito ML + Over** | **POSITIVA** | favorito que ganha costuma marcar |
| **Win-to-Nil + Over** | **NEGATIVA** | vencer sem sofrer puxa para under do perdedor |
| **Under 2.5 + BTTS** | **NEGATIVA** | BTTS já implica ≥2 gols; conflita com poucos gols |
| **Favorito por margem grande + BTTS** | **NEGATIVA** | goleada normalmente é a zero do perdedor |

### 7.2 Combina (correlação POSITIVA)

| Perna A | Perna B | Por quê |
|---|---|---|
| Favorito vence (1) | Over 1.5/2.5 | favorito que ganha costuma marcar |
| 1X (DC) | Under 2.5 | jogo travado favorece azarão segurar + poucos gols |
| Result+BTTS (Casa & GG) | Over 2.5 | GG + vitória implica ≥3 gols frequentemente |
| Margem Casa 2+ | Favorito vence to nil OU over 2.5 | placar elástico |
| HT/FT 1/1 | Casa −1 handicap / Over 1.5 1º tempo | dominância precoce |
| Race to 2 (favorito) | Favorito vence + Over 1.5 | chegar a 2 implica gols |

### 7.3 Contradiz (correlação NEGATIVA — evitar)

| Perna A | Perna B | Conflito |
|---|---|---|
| Result+BTTS | Win to Nil mesmo time | **mutuamente exclusivos** |
| Casa por 3+ (Margem alta) | BTTS Sim | goleada normalmente é a zero do perdedor |
| 1X (azarão segura) | Over 3.5 | travado vs goleada |
| HT/FT 1/1 | Virada / A/H | direções opostas |
| Favorito goleia | Result+BTTS | adversário improvável marcar |

**Por que as casas restringem combinações correlacionadas:** para proteger a margem — não deixam empilhar resultados altamente correlacionados sem reprecificar (correlation discount). Calculadoras de bet builder aplicam esse desconto — quando a casa **não** aplica corretamente, surge o valor (correlação positiva não-precificada).

---

## 8. Fontes de Dados para Alimentar Prognósticos

- **xG/xGA e mapas de chute:** Understat, FBref/StatsBomb, Opta-derivados, FootyStats, FotMob.
- **Distribuições HT/FT por time/liga:** SoccerStats, WinDrawWin, FCTables, ScoreRoom, KickOffProfits, Sportingpedia (distribuição 1º vs 2º tempo).
- **BTTS / médias de gols por liga:** FootyStats, OddAlerts, PerformanceOdds, StatsChecker.
- **Árbitros (cartões/faltas/pênaltis):** FootyMetrics, PlaneteFootball, Footiehound.
- **Tempo do 1º gol / ritmo minuto-a-minuto:** PerformanceOdds (first-half stats), bases minuto-a-minuto.
- **Odds / no-vig / margem:** Pinnacle (benchmark afiado + margin calculator), OddsPortal, Oddspedia; calculadoras de Dupla Chance/HT/FT (gamblingcalc, topendsports, betcalcul).
- **Impacto de eventos (cartões):** RunRepeat (estudo de 19.985 jogos sobre expulsões).
- **Modelagem própria:** Poisson (Smarkets/SBO guides, calculadoras xGscore/topendsports) → matriz de placar → todos os derivados.

---

## 9. Camada LIVE (Ao Vivo)

> A família inteira é **hipersensível ao game state**. Ao vivo, o que move cada mercado:

### 9.1 Gol cedo
- Muda tudo: favorito que **sai atrás cedo** empurra para frente, abre espaço → sobem **viradas (A/H, X/H ao vivo), BTTS, Race a 2, Margem volátil**.
- Gol cedo do favorito → encurta **1/1, Margem 2+, DNB-Casa**; "Neither/Under" perde valor.
- **Disciplina:** evitar entradas nos primeiros ~20 min sem edge estrutural (lesão defensiva, expulsão).

### 9.2 Expulsão (red card)
- Time com 10 → win prob despenca e as odds live mudam em segundos. **Faixas agregadas (RunRepeat, 19.985 jogos)** em vez de um par pontual: o time que recebe o vermelho **perde ~55–59%** das vezes, **vence ~23–24%**, **empata ~18–21%**. O **mandante é desproporcionalmente penalizado** (~0,86 ponto/jogo de déficit; mandantes vencem muito mais raramente com um a menos).
- **Cartão no time que PERDE** → ele se lança → **Over goals, Race do líder, Margem 2+ do líder** sobem.
- **Cartão no favorito** → empurra **X2/1X do adversário, Empate, DNB do azarão**.

### 9.3 Momentum
- Driver nº1 do live. Sequência de escanteios/chutes sinaliza gol iminente → antecipa **Race, próxima margem, viradas HT/FT** *antes* de a odd ajustar. Confirmar com entradas claras na área antes de stake (não reagir emocionalmente).

### 9.4 Mudança de placar
- 1-0 aos 70' num jogo travado → **"Casa Race to 2" / Margem 2+** ficam baratos mas o jogo pode ser de 1-0; **"Margem 1" e "1/1"** muitas vezes têm melhor EV.
- 0-0 aos 60' → **"Neither to reach 2", Under, X/X (HT já é empate → foca X/1, X/2, X/X)** ganham valor.

### 9.5 Estratégias live específicas por mercado
- **DNB ao vivo:** entrar no favorito após ele sofrer gol cedo (odd inflada) se você acredita na reação — protege contra empate.
- **DC 1X ao vivo:** azarão segurando 0-0 aos 75' → travar 1X barato como proteção.
- **HT/FT no intervalo:** com o HT já definido, o mercado vira "resultado final condicionado" — value se a casa não ajustou a 2ª metade ao perfil de gols-no-2º-tempo.
- **Race ao vivo:** após 1-1 rápido, "Race to 3" reabre com prêmio.
- **Bankroll live:** adicionar só 0,25–0,5% por entrada, e só com confirmação de momentum.

---

## Apêndice A — Cheat sheet: que jogo puxa cada mercado

| Quero que SUBA… | Procure jogo com… |
|---|---|
| 1X / DC defensiva | azarão mandante sólido, favorito viajante cansado, clima ruim, decisão cautelosa |
| DNB favorito | favorito claro mas confronto com histórico de empate / defesa adversária boa |
| HT/FT 1/1 | favorito mandante de início rápido, mando forte, sem rotação |
| HT/FT X/1, X/2 | favorito de início lento, liga de 2º tempo goleador |
| Margem 2+ | ataque elite vs defesa vazada, mando, adversário sem motivação |
| No Score Draw (0-0) | dois times defensivos, clima ruim, mata-mata travado, baixo xG dos dois |
| Result+BTTS | favorito de ataque forte + defesa frágil, adversário meio-de-tabela ofensivo |
| Race a 2 (favorito) | ritmo alto, gol cedo provável, jogo aberto |
| "Neither"/Under derivados | dérbi tenso, mata-mata, chuva, dois times cautelosos |

---

## Fontes

- Double Chance Betting Explained (1X, X2, 12) — 22bet News: https://news.22bet.com/wiki/betting-guide/double-chance-betting-explained-1x-x2-12/
- Double Chance Bet Explained — BetBurger: https://www.betburger.com/blog/double-chance-bet-explained
- Double Chance betting: using odds to calculate your stake — Pinnacle: https://www.pinnacle.com/betting-resources/en/betting-strategy/double-chance-betting-using-odds-to-calculate-your-stake/7rx2xrrawglbxd8v
- Double Chance vs Draw No Bet: Which Offers Better Value — Caan Berry: https://caanberry.com/double-chance-vs-draw-no-bet/
- Draw No Bet and Double Chance — Bet-Analytix Academy: https://www.bet-analytix.com/academy/draw-no-bet-double-chance
- What Are Draw No Bet and Double Chance Betting — RulesofSport: https://www.rulesofsport.com/betting/football/what-are-draw-no-bet-and-double-chance-betting/
- Understanding Draw No Bet — NerdyTips: https://nerdytips.com/blog/understanding-draw-no-bet-in-football-a-complete-beginners-guide/
- HT/FT Predictions — Professional Strategy & Betting Tips — FootyMind: https://www.footymind.com/ht-ft
- HT/FT Statistics — 1/2 and 2/1 Stats — ScoreRoom: https://scoreroom.com/stats-half-time-full-time/
- Half Time/Full Time Betting Strategy Guide — Mr Super Tips: https://www.mrsupertips.com/guides/half-time-full-time-betting
- Popular Football Betting Markets Explained — Punter2Pro: https://punter2pro.com/popular-football-betting-markets-explained/
- Winning Margin Bets Explained — BetPack: https://www.betpack.com/guides/betting-strategy/winning-margin/
- Understanding a Winning Margin Bet — The Punters Page: https://www.thepunterspage.com/understanding-a-winning-margin-bet/
- How are Soccer bets settled — DraftKings Help: https://help.draftkings.com/hc/en-us/articles/27609510981651-How-are-Soccer-bets-settled-US
- How are Soccer bets settled (Race to X / market rules) — DraftKings Support: https://support.draftkings.com/dk/en-us/how-are-soccer-bets-settled?id=kb_article_view&sysparm_article=KB0010834
- Rules and Settlement Policy for Sports Betting — Azuro Gem: https://gem.azuro.org/knowledge-hub/additional/rules-and-settlements-policy
- Double Chance Calculator (Fair Odds & EV) — GamblingCalc: https://gamblingcalc.com/betting/double-chance-calculator/
- HT/FT Calculator (margens 15-20%, X/X ~24%) — GamblingCalc: https://gamblingcalc.com/betting/football/half-time-full-time-calculator/
- Double Chance Calculator — TopEndSports: https://www.topendsports.com/sport/betting-tools/double-chance-calculator.htm
- Poisson Distribution: Predict the score — Pinnacle: https://www.pinnacle.com/betting-resources/en/soccer/poisson-distribution-predict-the-score-in-soccer-betting/md62mlxumkmxz6a8
- Poisson Distribution Guide — SBO.net: https://www.sbo.net/strategy/football-prediction-model-poisson-distribution/
- How to Use Correlation in Sports Betting — OddsJam: https://oddsjam.com/betting-education/how-to-use-correlation-in-sports-betting
- Correlated Parlays Explained (Over2.5/BTTS correlation) — BoydsBets: https://www.boydsbets.com/correlated-parlays/
- Correlated Stats Matter — Bet Builder Strategy — Footy Amigo: https://footyamigo.com/correlated-stats-matter-why-your-bet-builder-strategy-isnt-working-and-how-to-use-data-to-fix-it/
- BTTS Betting Strategy 2026 — Mr Super Tips: https://www.mrsupertips.com/guides/btts-betting-strategy
- What is Both Teams to Score — Goal.com: https://www.goal.com/en-gb/betting/what-is-both-teams-to-score-betting/blt370fa2ee32c827c1
- Match Result and Both Teams to Score Bet Explained — TipsterReviews: https://tipsterreviews.co.uk/match-result-and-both-teams-to-score-bet-explained/
- What Is Win to Nil Betting — WagerTalk: https://www.wagertalk.com/sports-betting-guide/win-to-nil-betting
- Winning Margin Bet guide (Score Draw vs No Score Draw) — TribalFootball/PaddyPower: https://www.tribalfootball.com/reviews/betting/guide/winning-margin/
- Live Betting Strategies That Actually Work — Breaking The Lines: https://breakingthelines.com/opinion/live-betting-mastery-how-to-win-with-in-play-wagering/
- Red Card Impact on Live Betting (UCL) — Register96: https://www.register96.com/football/red-card-impact-on-live-betting-in-the-champions-league/
- Home teams win 208% more often with red card (19,985 games) — RunRepeat: https://runrepeat.com/red-card-study
- Football Betting Statistics Hub 2026 — PerformanceOdds: https://www.performanceodds.com/football-stats-trends/football-betting-statistics-hub-2026-league-team-data-that-predict-goals-btts-corners-cards/
- How Referee Profiles and Card Patterns Influence Pricing — Footiehound: https://footiehound.com/how-referee-profiles-and-card-patterns-influence-match-pricing
- Best Leagues for Over 2.5, BTTS, Corners & Cards — OddAlerts: https://www.oddalerts.com/guides/best-leagues-goals-btts-corners-cards
- Mastering Bet Builder Strategies — Coventry Bet: https://coventry-bet.com/bet-builder-strategy-guide/
- Asian Handicap / Draw No Bet equivalence — Wikipedia: https://en.wikipedia.org/wiki/Asian_handicap
- First vs Second half goal distribution Europe top 5 leagues — Sportingpedia: https://www.sportingpedia.com/2024/10/17/first-vs-second-half-goal-distribution-across-europes-top-5-leagues-scoring-patterns-of-all-96-teams/
