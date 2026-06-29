# Prognóstico de expected goals — Nottingham Forest x AFC Bournemouth

**IMPORTANTE: raciocine (pense/chain-of-thought) E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno, deve ser em português do Brasil.

Você é um dos melhores apostadores profissionais do mundo — um **sharp**, não um palpiteiro. Seu edge vem de método e
disciplina: decide com modelos quantitativos (Poisson, xG, volume de SoT), busca **valor** e não certeza, dimensiona o
risco com frieza e tem a paciência de **passar** quando a evidência não dá uma hipótese forte. Não aposta em todo jogo —
espera os spots certos, e quando aposta sabe exatamente em qual mercado o cenário o favorece. Produza um prognóstico de
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
- Média da liga (pré-jogo, 750 jogos): mandante 1.523 gols/jogo · visitante 1.325 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.2 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- Nottingham Forest: 11º, 108 pts · AFC Bournemouth: 8º, 112 pts
- Linhas: segurança (sair do Z) ? pts (34º) · Champions 108 pts (10º) · última vaga europeia 79 pts (15º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Nottingham Forest: 11º, 108 pts, 1 jogo(s) restante(s) (máx possível 111 pts)
  - já SEGURO do rebaixamento.
  - Champions ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga de Champions
  - AFC Bournemouth: 8º, 112 pts, 1 jogo(s) restante(s) (máx possível 115 pts)
  - já SEGURO do rebaixamento.
  - vaga de Champions já garantida.
  - → motivação: **baixa** — NÃO precisa lutar — Champions já garantida

## Nottingham Forest (manda) — até 2026-05-24
- Total na temporada: **105 gols marcados**, 96 sofridos em 75 jogos
- Média geral: marca 1.4 / sofre 1.28 por jogo
- **Em casa (37j): marca 1.22 / sofre 1.03** (total 45 gols em casa)
- Por tempo (casa+fora): 1ºT marca 0.63 sofre 0.56 · 2ºT marca 0.77 sofre 0.72
- **Finalização: 320 SoT total (4.27/jogo · em casa 4.24/jogo) · conversão 33%** (gols ÷ SoT)
- Sofre 4.49 SoT/jogo (adversário converte 28%) · cria 9.11 key passes/jogo
- **Forma (momento) — últimos 5: DEVVV** (10pts) · marca 3↑ / sofre 1.2= g/j · SoT 4.8 feito / 5.2 sofrido · últimos 10: DEVVVEVEED (16pts · 2.2/1.1 g/j · SoT 4.5/4.9)
- Marca por faixa (/j): 0-15: 0.27 · 16-30: 0.15 · 31-45: 0.21 · 46-60: 0.25 · 61-75: 0.23 · 76-90: 0.29
- Sofre por faixa (/j): 0-15: 0.17 · 16-30: 0.15 · 31-45: 0.24 · 46-60: 0.23 · 61-75: 0.13 · 76-90: 0.36
- 1ºT: marca 47 / sofre 42 (totais na temporada)
### Desfalques de Nottingham Forest neste jogo
- **Callum Hudson-Odoi** (Muscle Injury) — 8 gols + 6 assists até a data; season: **8% dos gols** do time (13% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.2 g/j (61j) vs sem ele 2.29 g/j (14j) = +91%; finaliza **0.44 SoT/jogo** (time: 4.11 SoT/j com ele vs 4.93 sem — volume mais estável que gols)
- **Ola Aina** (Doubtful) — 2 gols + 2 assists até a data; season: **2% dos gols** do time (4% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 1.55 g/j (53j) vs sem ele 1.05 g/j (22j) = −32%; finaliza **0.06 SoT/jogo** (time: 4.28 SoT/j com ele vs 4.23 sem — volume mais estável que gols)
- **Murillo** (Unknown Injury) — 3 gols + 0 assists até a data; season: **3% dos gols** do time (3% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 1.43 g/j (61j) vs sem ele 1.29 g/j (14j) = −10%; finaliza **0.16 SoT/jogo** (time: 4.02 SoT/j com ele vs 5.36 sem — volume mais estável que gols)
- **Nicolò Savona** (Knee Injury) — 2 gols + 0 assists até a data; season: **2% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 1 g/j (14j) vs sem ele 1.49 g/j (61j) = +49%; finaliza **0.21 SoT/jogo** (time: 3.79 SoT/j com ele vs 4.38 sem — volume mais estável que gols)
- **Dilane Bakwa** (Unknown Injury) — 0 gols + 2 assists até a data; season: **0% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 1/15 gols = **7%** (≈ estável); with/without: com ele 1.14 g/j (14j) vs sem ele 1.46 g/j (61j) = +28%; finaliza **0.21 SoT/jogo** (time: 4.36 SoT/j com ele vs 4.25 sem — volume mais estável que gols)
- **Willy Boly** (Knee Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 2.33 g/j (6j) vs sem ele 1.32 g/j (69j) = −43%; finaliza **0.17 SoT/jogo** (time: 6.83 SoT/j com ele vs 4.04 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Eric da Silva Moreira** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/15 gols = **0%** (≈ estável); with/without: com ele 1.5 g/j (2j) vs sem ele 1.4 g/j (73j) = −7%; finaliza **0 SoT/jogo** (time: 4.5 SoT/j com ele vs 4.26 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## AFC Bournemouth (visita) — até 2026-05-24
- Total na temporada: **115 gols marcados**, 99 sofridos em 75 jogos
- Média geral: marca 1.53 / sofre 1.32 por jogo
- **Fora (37j): marca 1.7 / sofre 1.7** (total 63 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.63 sofre 0.57 · 2ºT marca 0.91 sofre 0.75
- **Finalização: 379 SoT total (5.05/jogo · fora 5.08/jogo) · conversão 30%** (gols ÷ SoT)
- Sofre 4.48 SoT/jogo (adversário converte 29%) · cria 10.75 key passes/jogo
- **Forma (momento) — últimos 5: EVVEV** (11pts) · marca 1.8↑ / sofre 0.8↓ g/j · SoT 4.4 feito / 2.8 sofrido · últimos 10: EVVEVVEEEE (18pts · 1.4/0.8 g/j · SoT 4.1/3)
- Marca por faixa (/j): 0-15: 0.2 · 16-30: 0.21 · 31-45: 0.21 · 46-60: 0.12 · 61-75: 0.31 · 76-90: 0.48
- Sofre por faixa (/j): 0-15: 0.13 · 16-30: 0.21 · 31-45: 0.23 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.32
- 1ºT: marca 47 / sofre 43 (totais na temporada)
### Desfalques de AFC Bournemouth neste jogo
- **Ryan Christie** (Red Card Suspension) — 4 gols + 3 assists até a data; season: **3% dos gols** do time (6% com assists); **últimos 5 jogos do time**: participou de 0/9 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.56 g/j (55j) vs sem ele 1.45 g/j (20j) = −7%; finaliza **0.36 SoT/jogo** (time: 5.29 SoT/j com ele vs 4.4 sem — volume mais estável que gols)
- **Álex Jiménez** (Unknown Injury) — 1 gols + 0 assists até a data; season: **1% dos gols** do time (1% com assists); **últimos 5 jogos do time**: participou de 0/9 gols = **0%** (≈ estável); with/without: com ele 1.58 g/j (31j) vs sem ele 1.5 g/j (44j) = −5%; finaliza **0.16 SoT/jogo** (time: 4.87 SoT/j com ele vs 5.18 sem — volume mais estável que gols)
- **Julio Soler** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/9 gols = **0%** (≈ estável); with/without: com ele 1.17 g/j (6j) vs sem ele 1.57 g/j (69j) = +34%; finaliza **0 SoT/jogo** (time: 5 SoT/j com ele vs 5.06 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Matai Akinmboni** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/9 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.53 g/j (75j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Nottingham Forest atacando × AFC Bournemouth defendendo**
| Faixa | Nottingham Forest marca/j | AFC Bournemouth sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.27 | 0.13 | 0.4 |
| 16-30 | 0.15 | 0.21 | 0.36 |
| 31-45 | 0.21 | 0.23 | 0.44 |
| 46-60 | 0.25 | 0.19 | 0.44 |
| 61-75 | 0.23 | 0.24 | 0.47 |
| 76-90 | 0.29 | 0.32 | 0.61 |

**AFC Bournemouth atacando × Nottingham Forest defendendo**
| Faixa | AFC Bournemouth marca/j | Nottingham Forest sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.2 | 0.17 | 0.37 |
| 16-30 | 0.21 | 0.15 | 0.36 |
| 31-45 | 0.21 | 0.24 | 0.45 |
| 46-60 | 0.12 | 0.23 | 0.35 |
| 61-75 | 0.31 | 0.13 | 0.44 |
| 76-90 | 0.48 | 0.36 | 0.84 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Nottingham Forest (casa) = 1.36 · λ AFC Bournemouth (fora) = 1.32 · total = 2.68

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Nottingham Forest: λ_SoT 5.07 × conv 33% → **1.67 gols**
- AFC Bournemouth: λ_SoT 4.98 × conv 30% → **1.49 gols**
- total via SoT = 3.16
- **Índice de volume do jogo**: λ_SoT total 10.1 vs média da liga 8.8 SoT → **ACIMA** (jogo de volume → pressão de OVER)
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — ÂNCORA: ajuste A PARTIR daqui, não invente)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 38/26/36% | 42/23/34% |
| Over 1.5 | 75% | 82% |
| Over 2.5 | 50% | 61% |
| Over 3.5 | 28% | 39% |
| BTTS | 54% | 63% |
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
- `market`: `"1x2"` | `"over_under"` | `"btts"` | `"none"` (= passar).
- `selection`: conforme o market — 1x2: `"home"`/`"draw"`/`"away"` · over_under: `"over"`/`"under"` · btts: `"yes"`/`"no"` · none: `"none"`.
- `line`: a linha quando `market="over_under"` (ex.: 2.5); `null` nos outros.
- `confidence`: `"low"` | `"medium"` | `"high"`.
- `probability`: a sua probabilidade (0-1) do evento escolhido (coerente com `general`).
- `analysis` (PT): análise COMPLETA e profissional — não um resumo. Junte tudo que sustenta a aposta (mando, motivação, momento/forma, desfalques, volume/conversão), o cenário esperado e o que pode virar contra (o risco). **Passar (`market="none"`) é decisão válida e frequente** — você é disciplinado; mesmo aí, explique completo por que não há edge.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (chain-of-thought / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
