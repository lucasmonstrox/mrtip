# Prognóstico de expected goals — Sunderland x Chelsea

**IMPORTANTE: raciocine (pense/chain-of-thought) E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno, deve ser em português do Brasil.

Você é o melhor apostador de futebol do mundo — um **sharp**, não um palpiteiro. Seu edge vem de método e
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
- Local: Stadium of Light, Sunderland (grass)
- Descanso: Sunderland 7 dias · Chelsea 5 dias
- Viagem do visitante: ~390 km
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.3 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- Sunderland: 10º, 51 pts · Chelsea: 8º, 52 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Sunderland: 10º, 51 pts, 1 jogo(s) restante(s) (máx possível 54 pts)
  - já SEGURO do rebaixamento.
  - vaga europeia ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga europeia
  - Chelsea: 8º, 52 pts, 1 jogo(s) restante(s) (máx possível 55 pts)
  - já SEGURO do rebaixamento.
  - vaga europeia ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga europeia
  - disputa pela vaga (8º): o Chelsea **precisa vencer** pra travar (empate ainda deixa 2 rival vivo). Quem ainda ameaça → Brentford (9º, 52 pts, máx 55) pode **passar em pontos** — vencendo, se o Chelsea tropeçar; Sunderland (10º, 51 pts, máx 54) pode **passar em pontos** — vencendo, se o Chelsea tropeçar; Newcastle United (11º, 49 pts, máx 52) empata em pontos mas está **-7 de saldo** (+0 vs +7) — só passa se o Chelsea perder por muito E ele vencer por muito (virar 7); Everton (12º, 49 pts, máx 52) empata em pontos mas está **-9 de saldo** (-2 vs +7) — só passa se o Chelsea perder por muito E ele vencer por muito (virar 9); Fulham (13º, 49 pts, máx 52) empata em pontos mas está **-13 de saldo** (-6 vs +7) — só passa se o Chelsea perder por muito E ele vencer por muito (virar 13)

## Sunderland (manda) — até 2026-05-24
- Total na temporada: **40 gols marcados**, 47 sofridos em 37 jogos
- Média geral: marca 1.08 / sofre 1.27 por jogo
- **Em casa (18j): marca 1.28 / sofre 1.06** (total 23 gols em casa)
- Por tempo (casa+fora): 1ºT marca 0.32 sofre 0.62 · 2ºT marca 0.76 sofre 0.65
- **Finalização: 125 SoT total (3.38/jogo · em casa 3.5/jogo) · conversão 32%** (gols ÷ SoT)
- Sofre 4.65 SoT/jogo (adversário converte 27%) · cria 6.95 key passes/jogo
- **Forma (momento) — últimos 5: VEEDD** (5pts) · marca 1.4↑ / sofre 2.2↑ g/j · SoT 4 feito / 5 sofrido · últimos 10: VEEDDVVDVE (15pts · 1.2/1.4 g/j · SoT 3.8/5)
- Marca por faixa (/j): 0-15: 0.05 · 16-30: 0.16 · 31-45: 0.11 · 46-60: 0.14 · 61-75: 0.27 · 76-90: 0.35
- Sofre por faixa (/j): 0-15: 0.22 · 16-30: 0.14 · 31-45: 0.27 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.22
- 1ºT: marca 12 / sofre 23 (totais na temporada)
### Desfalques de Sunderland neste jogo
- **Dan Ballard** (Red Card Suspension) — 2 gols + 0 assists até a data; season: **5% dos gols** do time (5% com assists); **últimos 5 jogos do time**: participou de 0/7 gols = **0%** (≈ estável); with/without: com ele 1.07 g/j (29j) vs sem ele 1.13 g/j (8j) = +6%; finaliza **0.31 SoT/jogo** (time: 3.41 SoT/j com ele vs 3.25 sem — volume mais estável que gols)
- **Simon Moore** (Broken Hand) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/7 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.08 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Romaine Mundle** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/7 gols = **0%** (≈ estável); with/without: com ele 0.93 g/j (14j) vs sem ele 1.17 g/j (23j) = +26%; finaliza **0.14 SoT/jogo** (time: 3.5 SoT/j com ele vs 3.3 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Chelsea (visita) — até 2026-05-24
- Total na temporada: **57 gols marcados**, 50 sofridos em 37 jogos
- Média geral: marca 1.54 / sofre 1.35 por jogo
- **Fora (18j): marca 1.72 / sofre 1.39** (total 31 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.7 sofre 0.62 · 2ºT marca 0.84 sofre 0.73
- **Finalização: 164 SoT total (4.43/jogo · fora 4.61/jogo) · conversão 35%** (gols ÷ SoT)
- Sofre 4.19 SoT/jogo (adversário converte 32%) · cria 10.27 key passes/jogo
- **Forma (momento) — últimos 5: VEDDD** (4pts) · marca 0.8↓ / sofre 1.8↑ g/j · SoT 3 feito / 4 sofrido · últimos 10: VEDDDDDDVD (7pts · 0.9/1.9 g/j · SoT 3.6/5.1)
- Marca por faixa (/j): 0-15: 0.16 · 16-30: 0.19 · 31-45: 0.35 · 46-60: 0.35 · 61-75: 0.24 · 76-90: 0.24
- Sofre por faixa (/j): 0-15: 0.3 · 16-30: 0.14 · 31-45: 0.19 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.3
- 1ºT: marca 26 / sofre 23 (totais na temporada)
### Desfalques de Chelsea neste jogo
- **Estêvão** (Unknown Injury) — 2 gols + 2 assists até a data; season: **4% dos gols** do time (7% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.45 g/j (22j) vs sem ele 1.67 g/j (15j) = +15%; finaliza **0.36 SoT/jogo** (time: 4.59 SoT/j com ele vs 4.2 sem — volume mais estável que gols)
- **Jamie Gittens** (Doubtful) — 0 gols + 2 assists até a data; season: **0% dos gols** do time (4% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 2.06 g/j (16j) vs sem ele 1.14 g/j (21j) = −45%; finaliza **0.13 SoT/jogo** (time: 5.56 SoT/j com ele vs 3.57 sem — volume mais estável que gols)
- **Roméo Lavia** (Doubtful) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 1.08 g/j (12j) vs sem ele 1.76 g/j (25j) = +63%; finaliza **0 SoT/jogo** (time: 4.42 SoT/j com ele vs 4.44 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Mykhaylo Mudryk** (Doping Ban) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.54 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **C. Wiley** (Adductor Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/4 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.54 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Sunderland atacando × Chelsea defendendo**
| Faixa | Sunderland marca/j | Chelsea sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.05 | 0.3 | 0.35 |
| 16-30 | 0.16 | 0.14 | 0.3 |
| 31-45 | 0.11 | 0.19 | 0.3 |
| 46-60 | 0.14 | 0.19 | 0.33 |
| 61-75 | 0.27 | 0.24 | 0.51 |
| 76-90 | 0.35 | 0.3 | 0.65 |

**Chelsea atacando × Sunderland defendendo**
| Faixa | Chelsea marca/j | Sunderland sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.16 | 0.22 | 0.38 |
| 16-30 | 0.19 | 0.14 | 0.33 |
| 31-45 | 0.35 | 0.27 | 0.62 |
| 46-60 | 0.35 | 0.19 | 0.54 |
| 61-75 | 0.24 | 0.24 | 0.48 |
| 76-90 | 0.24 | 0.22 | 0.46 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Sunderland (casa) = 1.16 · λ Chelsea (fora) = 1.49 · total = 2.65

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Sunderland: λ_SoT 3.42 × conv 32% → **1.09 gols**
- Chelsea: λ_SoT 4.56 × conv 35% → **1.6 gols**
- total via SoT = 2.69
- **Índice de volume do jogo**: λ_SoT total 8 vs média da liga 8.5 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — ÂNCORA: ajuste A PARTIR daqui, não invente)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 30/26/45% | 26/25/49% |
| Over 1.5 | 74% | 75% |
| Over 2.5 | 49% | 50% |
| Over 3.5 | 27% | 28% |
| BTTS | 53% | 53% |
São as probabilidades que o volume IMPLICA. Seus `over25_prob`, `btts_prob` e `one_x_two` devem **partir destes números** (use a Rota B como principal). **Comprometa-se com elas**: só desvie com um **fator nomeado** (motivação, desfalque, fadiga, mando) dizendo a direção e o tamanho. Se não há fator concreto pra mover, devolva a âncora — não regrida pro centro por cautela.

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Sunderland) e `away` (= Chelsea), cada um com:
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
