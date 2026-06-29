# Prognóstico de expected goals — West Ham United x Leeds United

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
- Local: London Stadium, London (grass)
- Descanso: West Ham United 7 dias · Leeds United 7 dias
- Viagem do visitante: ~270 km
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.3 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- West Ham United: 18º, 36 pts · Leeds United: 14º, 47 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - West Ham United: 18º, 36 pts, 1 jogo(s) restante(s) (máx possível 39 pts)
  - AINDA PODE CAIR — luta direta contra o rebaixamento, precisa pontuar.
  - → motivação: **alta** — PRECISA LUTAR — luta contra o rebaixamento
  - Leeds United: 14º, 47 pts, 1 jogo(s) restante(s) (máx possível 50 pts)
  - já SEGURO do rebaixamento.
  - sem alvo continental alcançável.
  - → motivação: **baixa** — NÃO precisa lutar — já seguro e sem alvo alcançável

## West Ham United (manda) — até 2026-05-24
- Total na temporada: **43 gols marcados**, 65 sofridos em 37 jogos
- Média geral: marca 1.16 / sofre 1.76 por jogo
- **Em casa (18j): marca 1.33 / sofre 1.67** (total 24 gols em casa)
- Por tempo (casa+fora): 1ºT marca 0.57 sofre 0.7 · 2ºT marca 0.59 sofre 1.05
- **Finalização: 135 SoT total (3.65/jogo · em casa 3.61/jogo) · conversão 30%** (jogada aberta ÷ SoT; exclui 3 pênaltis)
- Sofre 5.3 SoT/jogo (adversário converte 30%) · cria 7.68 key passes/jogo
- **Volume (chutes): 10.5/jogo (7.6 na área) · 1.9 big chances criadas/jogo** · posse 42.5% (contexto — posse sozinha NÃO prevê gol)
- **Forma (momento) — últimos 5: DDDVE** (4pts) · marca 0.6↓ / sofre 1.6= g/j · SoT 4.4 feito / 4.2 sofrido · últimos 10: DDDVEVDEVD (11pts · 1.1/1.6 g/j · SoT 3.8/4.9)
- Marca por faixa (/j): 0-15: 0.24 · 16-30: 0.08 · 31-45: 0.24 · 46-60: 0.11 · 61-75: 0.19 · 76-90: 0.3
- Sofre por faixa (/j): 0-15: 0.3 · 16-30: 0.11 · 31-45: 0.3 · 46-60: 0.27 · 61-75: 0.38 · 76-90: 0.41
- 1ºT: marca 21 / sofre 26 (totais na temporada)
### Desfalques de West Ham United neste jogo
- **Adama Traoré** (Muscle Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/3 gols = **0%** (≈ estável); with/without: com ele 1.44 g/j (9j) vs sem ele 1.07 g/j (28j) = −26%; finaliza **0 SoT/jogo** (time: 3.67 SoT/j com ele vs 3.64 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Lukasz Fabianski** (Back Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/3 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.16 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Leeds United (visita) — até 2026-05-24
- Total na temporada: **49 gols marcados**, 53 sofridos em 37 jogos
- Média geral: marca 1.32 / sofre 1.43 por jogo
- **Fora (18j): marca 1.11 / sofre 1.78** (total 20 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.65 sofre 0.43 · 2ºT marca 0.68 sofre 1
- **Finalização: 150 SoT total (4.05/jogo · fora 3.61/jogo) · conversão 29%** (jogada aberta ÷ SoT; exclui 6 pênaltis)
- Sofre 4.24 SoT/jogo (adversário converte 30%) · cria 8.7 key passes/jogo
- **Volume (chutes): 12.6/jogo (8.6 na área) · 2.4 big chances criadas/jogo** · posse 45.4% (contexto — posse sozinha NÃO prevê gol)
- **Forma (momento) — últimos 5: VEVEV** (11pts) · marca 2↑ / sofre 0.8↓ g/j · SoT 4.4 feito / 4.6 sofrido · últimos 10: VEVEVVEEDD (16pts · 1.2/0.7 g/j · SoT 4.2/4)
- Marca por faixa (/j): 0-15: 0.19 · 16-30: 0.16 · 31-45: 0.3 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.24
- Sofre por faixa (/j): 0-15: 0.11 · 16-30: 0.19 · 31-45: 0.14 · 46-60: 0.3 · 61-75: 0.3 · 76-90: 0.41
- 1ºT: marca 24 / sofre 16 (totais na temporada)
### Desfalques de Leeds United neste jogo
- **Noah Okafor** (Calf Injury) — 8 gols + 1 assists até a data; season: **16% dos gols** do time (18% com assists); **últimos 5 jogos do time**: participou de 3/10 gols = **30%** (↑ mais decisivo AGORA); with/without: com ele 1.61 g/j (28j) vs sem ele 0.44 g/j (9j) = −73%; finaliza **0.54 SoT/jogo** (time: 4.39 SoT/j com ele vs 3 sem — volume mais estável que gols)
- **Anton Stach** (Ankle Injury) — 5 gols + 3 assists até a data; season: **10% dos gols** do time (16% com assists); **últimos 5 jogos do time**: participou de 1/10 gols = **10%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.1 g/j (29j) vs sem ele 2.13 g/j (8j) = +94%; finaliza **0.48 SoT/jogo** (time: 3.9 SoT/j com ele vs 4.63 sem — volume mais estável que gols)
- **Ilia Gruev** (Unknown Injury) — 0 gols + 3 assists até a data; season: **0% dos gols** do time (6% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.52 g/j (23j) vs sem ele 1 g/j (14j) = −34%; finaliza **0.04 SoT/jogo** (time: 3.96 SoT/j com ele vs 4.21 sem — volume mais estável que gols)
- **Gabriel Gudmundsson** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 1.34 g/j (32j) vs sem ele 1.2 g/j (5j) = −10%; finaliza **0.09 SoT/jogo** (time: 4.03 SoT/j com ele vs 4.2 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**West Ham United atacando × Leeds United defendendo**
| Faixa | West Ham United marca/j | Leeds United sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.24 | 0.11 | 0.35 |
| 16-30 | 0.08 | 0.19 | 0.27 |
| 31-45 | 0.24 | 0.14 | 0.38 |
| 46-60 | 0.11 | 0.3 | 0.41 |
| 61-75 | 0.19 | 0.3 | 0.49 |
| 76-90 | 0.3 | 0.41 | 0.71 |

**Leeds United atacando × West Ham United defendendo**
| Faixa | Leeds United marca/j | West Ham United sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.19 | 0.3 | 0.49 |
| 16-30 | 0.16 | 0.11 | 0.27 |
| 31-45 | 0.3 | 0.3 | 0.6 |
| 46-60 | 0.19 | 0.27 | 0.46 |
| 61-75 | 0.24 | 0.38 | 0.62 |
| 76-90 | 0.24 | 0.41 | 0.65 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ West Ham United (casa) = 1.55 · λ Leeds United (fora) = 1.51 · total = 3.06

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- West Ham United: λ_SoT 3.89 × conv 30% → **1.17 gols**
- Leeds United: λ_SoT 4.44 × conv 29% → **1.29 gols**
- total via SoT = 2.46
- **Índice de volume do jogo**: λ_SoT total 8.3 vs média da liga 8.5 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — ÂNCORA: ajuste A PARTIR daqui, não invente)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 39/24/37% | 34/27/39% |
| Over 1.5 | 81% | 70% |
| Over 2.5 | 59% | 45% |
| Over 3.5 | 37% | 23% |
| BTTS | 61% | 50% |
São as probabilidades que o volume IMPLICA. Seus `over25_prob`, `btts_prob` e `one_x_two` devem **partir destes números** (use a Rota B como principal). **Comprometa-se com elas**: só desvie com um **fator nomeado** (motivação, desfalque, fadiga, mando) dizendo a direção e o tamanho. Se não há fator concreto pra mover, devolva a âncora — não regrida pro centro por cautela.

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= West Ham United) e `away` (= Leeds United), cada um com:
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
