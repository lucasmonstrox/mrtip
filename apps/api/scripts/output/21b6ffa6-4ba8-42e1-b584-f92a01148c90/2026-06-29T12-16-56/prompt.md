# Prognóstico de expected goals — Nottingham Forest x AFC Bournemouth

**IMPORTANTE: raciocine (pense/chain-of-thought) E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno, deve ser em português do Brasil.

Você é o melhor apostador de futebol do mundo — um **sharp**, não um palpiteiro. Seu edge vem de método e
disciplina: decide com modelos quantitativos (Poisson, xG, volume de SoT), busca **valor** e não certeza, dimensiona o
risco com frieza e **sempre crava o melhor mercado** — aquele onde o cenário mais o favorece. Mesmo sem edge enorme, ele
aponta a aposta de maior valor relativo e calibra a **confiança** ao tamanho da margem (nunca "passa"). Produza um prognóstico de
**expected goals (xG)** desta partida E a sua leitura de apostador.
Método: **PARTA da base rate** abaixo (duas rotas: λ de gols puro E λ_SoT × conversão) e das **probabilidades Poisson já
calculadas**, e **AJUSTE** por fator (desfalques, fadiga, mando, contexto), justificando cada ajuste e o tamanho. Regras:
- **ANCORE nas probabilidades Poisson fornecidas**: seu `over25_prob`, `btts_prob` e `one_x_two` PARTEM delas (Rota B
  como principal). **Comprometa-se com a âncora** — só desvie com um fator nomeado e quantificado (direção e tamanho). Se
  não há fator concreto pra mover, devolva a âncora; não regrida as probabilidades pro centro por cautela.
- **SoT (chutes no alvo) é o sinal de VOLUME primário** — 3× mais denso que gols, logo menos ruído. Use gols para a
  CONVERSÃO (gols/SoT) e como checagem. Onde as duas rotas de base rate divergem, confie mais no SoT e trate a
  diferença como finalização acima/abaixo da média (tende a regredir à conversão do time).
- O **desconto por desfalque age no VOLUME (SoT/λ_SoT)**, não na conversão (a eficiência do time é mais estável).
- **NÃO double-conte**: se um desfalque já estava fora nos últimos jogos, o efeito dele já está na média recente.
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️. O with/without de **SoT** é mais estável que o de gols — prefira-o.
- Sinalize incerteza: NÃO temos xG real, clima, nem posse/chutes totais — SoT é o melhor proxy de volume/qualidade aqui.

## Contexto
- Data: 2026-05-24 15:00 · Rodada 38 · Liga PL
- Local: The City Ground, Nottingham (grass)
- Descanso: Nottingham Forest 7 dias · AFC Bournemouth 5 dias
- Viagem do visitante: ~250 km
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.3 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- Nottingham Forest: 16º, 43 pts · AFC Bournemouth: 6º, 56 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Nottingham Forest: 16º, 43 pts, 1 jogo(s) restante(s) (máx possível 46 pts)
  - já SEGURO do rebaixamento.
  - sem alvo continental alcançável.
  - → motivação: **baixa** — NÃO precisa lutar — já seguro e sem alvo alcançável
  - AFC Bournemouth: 6º, 56 pts, 1 jogo(s) restante(s) (máx possível 59 pts)
  - já SEGURO do rebaixamento.
  - Champions ainda matematicamente possível.
  - distância de saldo p/ a vaga: empata em pontos com o 5º e precisa **virar 7 de saldo** (+4 vs +10) em 1 jogo(s) — **exigiria goleada; porta praticamente fechada → não deve se matar**
  - → motivação: **baixa** — NÃO precisa lutar — alvo continental matematicamente vivo mas REMOTO (saldo) — quase nada a jogar
  - disputa pela vaga (6º): pro AFC Bournemouth **um empate basta** (vai a 57, fora do alcance) — só perde a vaga se PERDER. Quem ainda ameaça → Brighton & Hove Albion (7º, 53 pts, máx 56) empata em pontos mas está **+5 de saldo** (+9 vs +4) — só passa se o AFC Bournemouth perder por muito E ele vencer por muito (virar -5)

## Nottingham Forest (manda) — até 2026-05-24
- Total na temporada: **47 gols marcados**, 50 sofridos em 37 jogos
- Média geral: marca 1.27 / sofre 1.35 por jogo
- **Em casa (18j): marca 1.06 / sofre 1.22** (total 19 gols em casa)
- Por tempo (casa+fora): 1ºT marca 0.49 sofre 0.65 · 2ºT marca 0.78 sofre 0.7
- **Finalização: 153 SoT total (4.14/jogo · em casa 4/jogo) · conversão 29%** (jogada aberta ÷ SoT; exclui 3 pênaltis)
- Sofre 4.35 SoT/jogo (adversário converte 28%) · cria 9.32 key passes/jogo
- **Volume (chutes): 12.5/jogo (7.7 na área) · 1.8 big chances criadas/jogo** · posse 46.8% (contexto — posse sozinha NÃO prevê gol)
- **Forma (momento) — últimos 5: DEVVV** (10pts) · marca 3↑ / sofre 1.2= g/j · SoT 4.8 feito / 5.2 sofrido · últimos 10: DEVVVEVEED (16pts · 2.2/1.1 g/j · SoT 4.5/4.9)
- Marca por faixa (/j): 0-15: 0.22 · 16-30: 0.05 · 31-45: 0.22 · 46-60: 0.27 · 61-75: 0.16 · 76-90: 0.35
- Sofre por faixa (/j): 0-15: 0.16 · 16-30: 0.16 · 31-45: 0.32 · 46-60: 0.22 · 61-75: 0.08 · 76-90: 0.41
- 1ºT: marca 18 / sofre 24 (totais na temporada)
### Desfalques de Nottingham Forest neste jogo
- **Callum Hudson-Odoi** (Muscle Injury) — 3 gols + 4 assists até a data; season: **6% dos gols** do time (15% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 0.93 g/j (30j) vs sem ele 2.71 g/j (7j) = +191%; finaliza **0.33 SoT/jogo** (time: 3.9 SoT/j com ele vs 5.14 sem — volume mais estável que gols)
- **Nicolò Savona** (Knee Injury) — 2 gols + 0 assists até a data; season: **4% dos gols** do time (4% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 1 g/j (14j) vs sem ele 1.43 g/j (23j) = +43%; finaliza **0.21 SoT/jogo** (time: 3.79 SoT/j com ele vs 4.35 sem — volume mais estável que gols)
- **Dilane Bakwa** (Unknown Injury) — 0 gols + 2 assists até a data; season: **0% dos gols** do time (4% com assists); **últimos 5 jogos do time**: participou de 1/15 gols = **7%** (≈ estável); with/without: com ele 1.14 g/j (14j) vs sem ele 1.35 g/j (23j) = +18%; finaliza **0.21 SoT/jogo** (time: 4.36 SoT/j com ele vs 4 sem — volume mais estável que gols)
- **Murillo** (Unknown Injury) — 1 gols + 0 assists até a data; season: **2% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 1.32 g/j (25j) vs sem ele 1.17 g/j (12j) = −11%; finaliza **0.16 SoT/jogo** (time: 3.56 SoT/j com ele vs 5.33 sem — volume mais estável que gols)
- **Ola Aina** (Doubtful) — 0 gols + 1 assists até a data; season: **0% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 1.5 g/j (18j) vs sem ele 1.05 g/j (19j) = −30%; finaliza **0.06 SoT/jogo** (time: 3.94 SoT/j com ele vs 4.32 sem — volume mais estável que gols)
- **Willy Boly** (Knee Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.27 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Eric da Silva Moreira** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.27 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## AFC Bournemouth (visita) — até 2026-05-24
- Total na temporada: **57 gols marcados**, 53 sofridos em 37 jogos
- Média geral: marca 1.54 / sofre 1.43 por jogo
- **Fora (18j): marca 1.56 / sofre 1.83** (total 28 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.7 sofre 0.59 · 2ºT marca 0.84 sofre 0.84
- **Finalização: 177 SoT total (4.78/jogo · fora 5/jogo) · conversão 29%** (jogada aberta ÷ SoT; exclui 5 pênaltis)
- Sofre 4.3 SoT/jogo (adversário converte 30%) · cria 9.76 key passes/jogo
- **Volume (chutes): 13.7/jogo (8.2 na área) · 2.5 big chances criadas/jogo** · posse 50% (contexto — posse sozinha NÃO prevê gol)
- **Forma (momento) — últimos 5: EVVEV** (11pts) · marca 1.8↑ / sofre 0.8↓ g/j · SoT 4.4 feito / 2.8 sofrido · últimos 10: EVVEVVEEEE (18pts · 1.4/0.8 g/j · SoT 4.1/3)
- Marca por faixa (/j): 0-15: 0.22 · 16-30: 0.22 · 31-45: 0.27 · 46-60: 0.14 · 61-75: 0.27 · 76-90: 0.43
- Sofre por faixa (/j): 0-15: 0.14 · 16-30: 0.19 · 31-45: 0.27 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.41
- 1ºT: marca 26 / sofre 22 (totais na temporada)
### Desfalques de AFC Bournemouth neste jogo
- **Ryan Christie** (Red Card Suspension) — 2 gols + 0 assists até a data; season: **4% dos gols** do time (4% com assists); **últimos 5 jogos do time**: participou de 0/9 gols = **0%** (≈ estável); with/without: com ele 1.46 g/j (26j) vs sem ele 1.73 g/j (11j) = +18%; finaliza **0.31 SoT/jogo** (time: 4.65 SoT/j com ele vs 5.09 sem — volume mais estável que gols)
- **Álex Jiménez** (Unknown Injury) — 1 gols + 0 assists até a data; season: **2% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/9 gols = **0%** (≈ estável); with/without: com ele 1.58 g/j (31j) vs sem ele 1.33 g/j (6j) = −16%; finaliza **0.16 SoT/jogo** (time: 4.87 SoT/j com ele vs 4.33 sem — volume mais estável que gols)
- **Julio Soler** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/9 gols = **0%** (≈ estável); with/without: com ele 1 g/j (3j) vs sem ele 1.59 g/j (34j) = +59%; finaliza **0 SoT/jogo** (time: 6 SoT/j com ele vs 4.68 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **M. Akinmboni** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/9 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.54 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Nottingham Forest atacando × AFC Bournemouth defendendo**
| Faixa | Nottingham Forest marca/j | AFC Bournemouth sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.22 | 0.14 | 0.36 |
| 16-30 | 0.05 | 0.19 | 0.24 |
| 31-45 | 0.22 | 0.27 | 0.49 |
| 46-60 | 0.27 | 0.19 | 0.46 |
| 61-75 | 0.16 | 0.24 | 0.4 |
| 76-90 | 0.35 | 0.41 | 0.76 |

**AFC Bournemouth atacando × Nottingham Forest defendendo**
| Faixa | AFC Bournemouth marca/j | Nottingham Forest sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.22 | 0.16 | 0.38 |
| 16-30 | 0.22 | 0.16 | 0.38 |
| 31-45 | 0.27 | 0.32 | 0.59 |
| 46-60 | 0.14 | 0.22 | 0.36 |
| 61-75 | 0.27 | 0.08 | 0.35 |
| 76-90 | 0.43 | 0.41 | 0.84 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Nottingham Forest (casa) = 1.27 · λ AFC Bournemouth (fora) = 1.55 · total = 2.82

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Nottingham Forest: λ_SoT 4.9 × conv 29% → **1.42 gols**
- AFC Bournemouth: λ_SoT 5.23 × conv 29% → **1.52 gols**
- total via SoT = 2.94
- **Índice de volume do jogo**: λ_SoT total 10.1 vs média da liga 8.5 SoT → **ACIMA** (jogo de volume → pressão de OVER)
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — ÂNCORA: ajuste A PARTIR daqui, não invente)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 31/25/44% | 36/25/40% |
| Over 1.5 | 77% | 79% |
| Over 2.5 | 54% | 56% |
| Over 3.5 | 31% | 34% |
| BTTS | 57% | 59% |
São as probabilidades que o volume IMPLICA. Seus `over25_prob`, `btts_prob` e `one_x_two` devem **partir destes números** (use a Rota B como principal). **Comprometa-se com elas**: só desvie com um **fator nomeado** (motivação, desfalque, fadiga, mando) dizendo a direção e o tamanho. Se não há fator concreto pra mover, devolva a âncora — não regrida pro centro por cautela.

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Nottingham Forest) e `away` (= AFC Bournemouth), cada um com:
- `xg` (total), `xg_1t`, `xg_2t` e **`xg_bands`** = o xG nas 6 faixas de 15 min (`"0-15"`,`"16-30"`,`"31-45"`,`"46-60"`,`"61-75"`,`"76-90"`). Soma das 6 = `xg`; 0-15+16-30+31-45 = `xg_1t`. Use o cruzamento ataque×defesa por faixa.
- `summary` (PT) = leitura CURTA daquele time (1-2 frases): motivação de tabela, desfalque que pesa, mando, e como isso move o xG dele.

**Geral** (`general`) — agregados do jogo:
- `total`, `total_1t`, `total_2t`, `over25_prob`, `btts_prob`.
- **1x2 (home/draw/away)** em 3 recortes: `one_x_two` (jogo 90min), `one_x_two_1t` (placar do 1º tempo), `one_x_two_2t` (2º tempo isolado). Derive do Poisson com os λ do respectivo tempo.
- `confidence` ∈ {low, medium, high} e `summary` (PT) = 1 parágrafo do jogo + a maior incerteza.

No topo: `drivers` = os 3 fatores (frases em PT) que mais moveram o número.

**`best_bet`** — a sua leitura de APOSTADOR (a DECISÃO, em campos SEPARADOS; **não** escreva o nome do time, ele sai de `selection`):
- `market`: `"1x2"` | `"over_under"` | `"btts"` — escolha SEMPRE um (o de maior valor); não há opção de passar.
- `selection`: conforme o market — 1x2: `"home"`/`"draw"`/`"away"` · over_under: `"over"`/`"under"` · btts: `"yes"`/`"no"`.
- `line`: a linha quando `market="over_under"` (ex.: 2.5); `null` nos outros.
- `confidence`: `"low"` | `"medium"` | `"high"`.
- `probability`: a sua probabilidade (0-1) do evento escolhido (coerente com `general`).
- `analysis` (PT): análise COMPLETA e profissional — não um resumo. Junte tudo que sustenta a aposta (mando, motivação, momento/forma, desfalques, volume/conversão), o cenário esperado e o que pode virar contra (o risco). **Sempre recomende o melhor mercado** — aquele onde o cenário mais te favorece; se o edge for fino, escolha mesmo assim e marque `confidence` baixa, explicando o tamanho da margem.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (chain-of-thought / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
