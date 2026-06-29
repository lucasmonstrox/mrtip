# Prognóstico de expected goals — Tottenham Hotspur x Everton

**IMPORTANTE: raciocine (pense/chain-of-thought) E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno, deve ser em português do Brasil.

Você é um analista quantitativo de futebol. Produza um prognóstico de **expected goals (xG)** para esta partida.
Use o método: **PARTA da base rate** abaixo (duas rotas já calculadas: λ de gols puro E λ_SoT × conversão) e
**AJUSTE multiplicativamente** por fator (desfalques, fadiga, contexto), justificando cada ajuste. Regras:
- **ANCORE nas probabilidades Poisson fornecidas** (seção "Probabilidades de mercado"): seu `over25_prob`, `btts_prob`
  e `one_x_two` PARTEM delas (Rota B como principal). Só desvie com fator nomeado e quantificado. **NÃO** devolva tudo
  comprimido perto de ~40% — é exatamente o erro que estamos corrigindo.
- **SoT (chutes no alvo) é o sinal de VOLUME primário** — 3× mais denso que gols, logo menos ruído. Use gols para a
  CONVERSÃO (gols/SoT) e como checagem. Onde as duas rotas de base rate divergem, confie mais no SoT e trate a
  diferença como finalização acima/abaixo da média (tende a regredir à conversão do time).
- O **desconto por desfalque age no VOLUME (SoT/λ_SoT)**, não na conversão (a eficiência do time é mais estável).
- **NÃO double-conte**: se um desfalque já estava fora nos últimos jogos, o efeito dele já está na média recente.
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️. O with/without de **SoT** é mais estável que o de gols — prefira-o.
- Sinalize incerteza: NÃO temos xG real, clima, nem posse/chutes totais — SoT é o melhor proxy de volume/qualidade aqui.

## Contexto
- Data: 2026-05-24 15:00 · Rodada 38 · Liga PL
- Local: Tottenham Hotspur Stadium, London (grass)
- Descanso: Tottenham Hotspur 5 dias · Everton 7 dias
- Viagem do visitante: ~284 km
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- Tottenham Hotspur: 17º, 38 pts · Everton: 12º, 49 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (9º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Tottenham Hotspur: 17º, 38 pts, 1 jogo(s) restante(s) (máx possível 41 pts)
  - AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - Everton: 12º, 49 pts, 1 jogo(s) restante(s) (máx possível 52 pts)
  - já SEGURO do rebaixamento.
  - ainda briga por vaga europeia — motivado.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga europeia

## Tottenham Hotspur (manda) — até 2026-05-24
- Total na temporada: **47 gols marcados**, 57 sofridos em 37 jogos
- Média geral: marca 1.27 / sofre 1.54 por jogo
- **Em casa (18j): marca 1.17 / sofre 1.72** (total 21 gols em casa)
- Por tempo (casa+fora): 1ºT marca 0.51 sofre 0.81 · 2ºT marca 0.76 sofre 0.73
- **Finalização: 145 SoT total (3.92/jogo · em casa 4/jogo) · conversão 32%** (gols ÷ SoT)
- Sofre 4.08 SoT/jogo (adversário converte 38%) · cria 8.43 key passes/jogo
- **Forma (momento) — últimos 5: DEVVE** (8pts) · marca 1.4= / sofre 1.2↓ g/j · SoT 3.8 feito / 2.8 sofrido · últimos 10: DEVVEDDEDD (9pts · 1/1.6 g/j · SoT 4.1/3.5)
- Marca por faixa (/j): 0-15: 0.11 · 16-30: 0.14 · 31-45: 0.27 · 46-60: 0.22 · 61-75: 0.19 · 76-90: 0.35
- Sofre por faixa (/j): 0-15: 0.19 · 16-30: 0.11 · 31-45: 0.51 · 46-60: 0.14 · 61-75: 0.22 · 76-90: 0.38
- 1ºT: marca 19 / sofre 30 (totais na temporada)
### Desfalques de Tottenham Hotspur neste jogo
- **Mohammed Kudus** (Muscle Injury) — 2 gols + 5 assists até a data; representa **4% dos gols** do time (15% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.37 g/j (19j) vs sem ele 1.17 g/j (18j) = −15%; finaliza **0.47 SoT/jogo** (time: 3.37 SoT/j com ele vs 4.5 sem — volume mais estável que gols)
- **Xavi Simons** (Unknown Injury) — 2 gols + 5 assists até a data; representa **4% dos gols** do time (15% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.29 g/j (28j) vs sem ele 1.22 g/j (9j) = −5%; finaliza **0.36 SoT/jogo** (time: 3.93 SoT/j com ele vs 3.89 sem — volume mais estável que gols)
- **Cristian Romero** (Muscle Injury) — 4 gols + 1 assists até a data; representa **9% dos gols** do time (11% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.26 g/j (23j) vs sem ele 1.29 g/j (14j) = +2%; finaliza **0.26 SoT/jogo** (time: 4.04 SoT/j com ele vs 3.71 sem — volume mais estável que gols)
- **Wilson Odobert** (Unknown Injury) — 0 gols + 2 assists até a data; representa **0% dos gols** do time (4% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.38 g/j (24j) vs sem ele 1.08 g/j (13j) = −22%; finaliza **0.33 SoT/jogo** (time: 3.92 SoT/j com ele vs 3.92 sem — volume mais estável que gols)
- **Ben Davies** (Ankle Injury) — 1 gols + 0 assists até a data; representa **2% dos gols** do time (2% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 0.67 g/j (3j) vs sem ele 1.32 g/j (34j) = +97%; finaliza **0.67 SoT/jogo** (time: 4 SoT/j com ele vs 3.91 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **D. Kulusevski** (Knee Injury) — 0 gols + 0 assists até a data; representa **0% dos gols** do time (0% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 0 g/j (0j) vs sem ele 1.27 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Everton (visita) — até 2026-05-24
- Total na temporada: **47 gols marcados**, 49 sofridos em 37 jogos
- Média geral: marca 1.27 / sofre 1.32 por jogo
- **Fora (18j): marca 1.17 / sofre 1.22** (total 21 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.51 sofre 0.54 · 2ºT marca 0.76 sofre 0.78
- **Finalização: 142 SoT total (3.84/jogo · fora 3.33/jogo) · conversão 33%** (gols ÷ SoT)
- Sofre 4.24 SoT/jogo (adversário converte 31%) · cria 8.38 key passes/jogo
- **Forma (momento) — últimos 5: DEEDD** (2pts) · marca 1.6↑ / sofre 2.4↑ g/j · SoT 4.6 feito / 4.8 sofrido · últimos 10: DEEDDEVDVV (12pts · 1.8/1.8 g/j · SoT 5.2/4.8)
- Marca por faixa (/j): 0-15: 0.11 · 16-30: 0.19 · 31-45: 0.22 · 46-60: 0.19 · 61-75: 0.16 · 76-90: 0.41
- Sofre por faixa (/j): 0-15: 0.11 · 16-30: 0.24 · 31-45: 0.19 · 46-60: 0.19 · 61-75: 0.19 · 76-90: 0.41
- 1ºT: marca 19 / sofre 20 (totais na temporada)
### Desfalques de Everton neste jogo
- **Jack Grealish** (Unknown Injury) — 2 gols + 6 assists até a data; representa **4% dos gols** do time (17% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.2 g/j (20j) vs sem ele 1.35 g/j (17j) = +13%; finaliza **0.4 SoT/jogo** (time: 3.1 SoT/j com ele vs 4.71 sem — volume mais estável que gols)
- **Idrissa Gueye** (Muscle Injury) — 2 gols + 3 assists até a data; representa **4% dos gols** do time (11% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.2 g/j (25j) vs sem ele 1.42 g/j (12j) = +18%; finaliza **0.28 SoT/jogo** (time: 3.8 SoT/j com ele vs 3.92 sem — volume mais estável que gols)
- **Jarrad Branthwaite** (Unknown Injury) — 1 gols + 0 assists até a data; representa **2% dos gols** do time (2% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.6 g/j (10j) vs sem ele 1.15 g/j (27j) = −28%; finaliza **0.2 SoT/jogo** (time: 5.1 SoT/j com ele vs 3.37 sem — volume mais estável que gols)

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Tottenham Hotspur atacando × Everton defendendo**
| Faixa | Tottenham Hotspur marca/j | Everton sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.11 | 0.11 | 0.22 |
| 16-30 | 0.14 | 0.24 | 0.38 |
| 31-45 | 0.27 | 0.19 | 0.46 |
| 46-60 | 0.22 | 0.19 | 0.41 |
| 61-75 | 0.19 | 0.19 | 0.38 |
| 76-90 | 0.35 | 0.41 | 0.76 |

**Everton atacando × Tottenham Hotspur defendendo**
| Faixa | Everton marca/j | Tottenham Hotspur sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.11 | 0.19 | 0.3 |
| 16-30 | 0.19 | 0.11 | 0.3 |
| 31-45 | 0.22 | 0.51 | 0.73 |
| 46-60 | 0.19 | 0.14 | 0.33 |
| 61-75 | 0.16 | 0.22 | 0.38 |
| 76-90 | 0.41 | 0.38 | 0.79 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Tottenham Hotspur (casa) = 0.93 · λ Everton (fora) = 1.64 · total = 2.57

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Tottenham Hotspur: λ_SoT 3.81 × conv 32% → **1.22 gols**
- Everton: λ_SoT 3.48 × conv 33% → **1.15 gols**
- total via SoT = 2.37
- **Índice de volume do jogo**: λ_SoT total 7.3 vs média da liga 8.5 SoT → **ABAIXO** (jogo travado → pressão de UNDER)
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — ÂNCORA: ajuste A PARTIR daqui, não invente)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 21/25/54% | 38/28/34% |
| Over 1.5 | 73% | 68% |
| Over 2.5 | 47% | 42% |
| Over 3.5 | 26% | 22% |
| BTTS | 49% | 48% |
São as probabilidades que o volume IMPLICA. Seus `over25_prob`, `btts_prob` e `one_x_two` devem **partir destes números** (use a Rota B como principal); só desvie com um **fator nomeado** (motivação, desfalque, fadiga) dizendo a direção e o tamanho. **NÃO comprima tudo pra ~40%** — se a âncora diz over 2.5 = 55%, justifique explicitamente para baixá-la.

## Saída exigida (objeto tipado — validado pelo runtime). Estrutura: PROGNÓSTICO POR TIME + GERAL.
**Por time** — `home` (= Tottenham Hotspur) e `away` (= Everton), cada um com:
- `xg` (total), `xg_1t`, `xg_2t` e **`xg_bands`** = o xG nas 6 faixas de 15 min (`"0-15"`,`"16-30"`,`"31-45"`,`"46-60"`,`"61-75"`,`"76-90"`). Soma das 6 = `xg`; 0-15+16-30+31-45 = `xg_1t`. Use o cruzamento ataque×defesa por faixa.
- `resumo` = leitura CURTA daquele time (1-2 frases): motivação de tabela, desfalque que pesa, mando, e como isso move o xG dele.

**Geral** (`geral`) — agregados do jogo:
- `total`, `total_1t`, `total_2t`, `over25_prob`, `btts_prob`.
- **1x2 (home/draw/away)** em 3 recortes: `one_x_two` (jogo 90min), `one_x_two_1t` (placar do 1º tempo), `one_x_two_2t` (2º tempo isolado). Derive do Poisson com os λ do respectivo tempo.
- `confianca` ∈ {baixa, media, alta} e `resumo` = 1 parágrafo do jogo + a maior incerteza.

No topo: `drivers` = os 3 fatores que mais moveram o número.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (chain-of-thought / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
