# Prognóstico de expected goals — Liverpool x Brentford

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
- Local: Anfield, Liverpool (grass)
- Descanso: Liverpool 9 dias · Brentford 7 dias
- Viagem do visitante: ~282 km
- Média da liga (pré-jogo, 750 jogos): mandante 1.523 gols/jogo · visitante 1.325 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.2 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- Liverpool: 3º, 143 pts · Brentford: 10º, 108 pts
- Linhas: segurança (sair do Z) ? pts (34º) · Champions 108 pts (10º) · última vaga europeia 79 pts (15º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Liverpool: 3º, 143 pts, 1 jogo(s) restante(s) (máx possível 146 pts)
  - já SEGURO do rebaixamento.
  - vaga de Champions já garantida.
  - → motivação: **baixa** — NÃO precisa lutar — Champions já garantida
  - Brentford: 10º, 108 pts, 1 jogo(s) restante(s) (máx possível 111 pts)
  - já SEGURO do rebaixamento.
  - Champions ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga de Champions

## Liverpool (manda) — até 2026-05-24
- Total na temporada: **148 gols marcados**, 93 sofridos em 75 jogos
- Média geral: marca 1.97 / sofre 1.24 por jogo
- **Em casa (37j): marca 2.03 / sofre 0.95** (total 75 gols em casa)
- Por tempo (casa+fora): 1ºT marca 0.85 sofre 0.49 · 2ºT marca 1.12 sofre 0.75
- **Finalização: 400 SoT total (5.33/jogo · em casa 5.51/jogo) · conversão 37%** (gols ÷ SoT)
- Sofre 3.91 SoT/jogo (adversário converte 32%) · cria 12.87 key passes/jogo
- **Forma (momento) — últimos 5: DEDVV** (7pts) · marca 2= / sofre 2↑ g/j · SoT 4.4 feito / 5.8 sofrido · últimos 10: DEDVVVDEDV (14pts · 2/1.7 g/j · SoT 5/5.4)
- Marca por faixa (/j): 0-15: 0.17 · 16-30: 0.28 · 31-45: 0.4 · 46-60: 0.32 · 61-75: 0.32 · 76-90: 0.48
- Sofre por faixa (/j): 0-15: 0.21 · 16-30: 0.05 · 31-45: 0.23 · 46-60: 0.2 · 61-75: 0.2 · 76-90: 0.35
- 1ºT: marca 64 / sofre 37 (totais na temporada)
### Desfalques de Liverpool neste jogo
- **Hugo Ekitiké** (Unknown Injury) — 11 gols + 4 assists até a data; season: **7% dos gols** do time (10% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.68 g/j (28j) vs sem ele 2.15 g/j (47j) = +28%; finaliza **0.68 SoT/jogo** (time: 4.86 SoT/j com ele vs 5.62 sem — volume mais estável que gols)
- **Conor Bradley** (Knee Injury) — 0 gols + 3 assists até a data; season: **0% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 1.68 g/j (34j) vs sem ele 2.22 g/j (41j) = +32%; finaliza **0.09 SoT/jogo** (time: 4.68 SoT/j com ele vs 5.88 sem — volume mais estável que gols)
- **Giovanni Leoni** (Cruciate Ligament Tear) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.97 g/j (75j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **S. Bajcetic Maquieira** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.97 g/j (75j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Brentford (visita) — até 2026-05-24
- Total na temporada: **120 gols marcados**, 108 sofridos em 75 jogos
- Média geral: marca 1.6 / sofre 1.44 por jogo
- **Fora (37j): marca 1.27 / sofre 1.41** (total 47 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.79 sofre 0.65 · 2ºT marca 0.81 sofre 0.79
- **Finalização: 329 SoT total (4.39/jogo · fora 3.95/jogo) · conversão 36%** (gols ÷ SoT)
- Sofre 4.92 SoT/jogo (adversário converte 29%) · cria 8.47 key passes/jogo
- **Forma (momento) — últimos 5: EDVDE** (5pts) · marca 1.2↓ / sofre 1.4= g/j · SoT 3.8 feito / 5 sofrido · últimos 10: EDVDEEEEEV (12pts · 1.4/1.4 g/j · SoT 3.7/4.7)
- Marca por faixa (/j): 0-15: 0.23 · 16-30: 0.28 · 31-45: 0.28 · 46-60: 0.19 · 61-75: 0.21 · 76-90: 0.41
- Sofre por faixa (/j): 0-15: 0.15 · 16-30: 0.27 · 31-45: 0.24 · 46-60: 0.19 · 61-75: 0.19 · 76-90: 0.41
- 1ºT: marca 59 / sofre 49 (totais na temporada)
### Desfalques de Brentford neste jogo
- **Fábio Carvalho** (Unknown Injury) — 3 gols + 1 assists até a data; season: **3% dos gols** do time (3% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1.68 g/j (25j) vs sem ele 1.56 g/j (50j) = −7%; finaliza **0.28 SoT/jogo** (time: 4.52 SoT/j com ele vs 4.32 sem — volume mais estável que gols)
- **Rico Henry** (Unknown Injury) — 0 gols + 1 assists até a data; season: **0% dos gols** do time (1% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1.83 g/j (30j) vs sem ele 1.44 g/j (45j) = −21%; finaliza **0 SoT/jogo** (time: 4.4 SoT/j com ele vs 4.38 sem — volume mais estável que gols)
- **Antoni Milambo** (Cruciate Ligament Tear) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1 g/j (1j) vs sem ele 1.61 g/j (74j) = +61%; finaliza **0 SoT/jogo** (time: 3 SoT/j com ele vs 4.41 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Liverpool atacando × Brentford defendendo**
| Faixa | Liverpool marca/j | Brentford sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.17 | 0.15 | 0.32 |
| 16-30 | 0.28 | 0.27 | 0.55 |
| 31-45 | 0.4 | 0.24 | 0.64 |
| 46-60 | 0.32 | 0.19 | 0.51 |
| 61-75 | 0.32 | 0.19 | 0.51 |
| 76-90 | 0.48 | 0.41 | 0.89 |

**Brentford atacando × Liverpool defendendo**
| Faixa | Brentford marca/j | Liverpool sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.23 | 0.21 | 0.44 |
| 16-30 | 0.28 | 0.05 | 0.33 |
| 31-45 | 0.28 | 0.23 | 0.51 |
| 46-60 | 0.19 | 0.2 | 0.39 |
| 61-75 | 0.21 | 0.2 | 0.41 |
| 76-90 | 0.41 | 0.35 | 0.76 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Liverpool (casa) = 1.88 · λ Brentford (fora) = 0.91 · total = 2.79

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Liverpool: λ_SoT 6.31 × conv 37% → **2.33 gols**
- Brentford: λ_SoT 3.35 × conv 36% → **1.21 gols**
- total via SoT = 3.54
- **Índice de volume do jogo**: λ_SoT total 9.7 vs média da liga 8.8 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — ÂNCORA: ajuste A PARTIR daqui, não invente)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 60/22/18% | 62/19/19% |
| Over 1.5 | 77% | 87% |
| Over 2.5 | 53% | 69% |
| Over 3.5 | 31% | 47% |
| BTTS | 51% | 63% |
São as probabilidades que o volume IMPLICA. Seus `over25_prob`, `btts_prob` e `one_x_two` devem **partir destes números** (use a Rota B como principal). **Comprometa-se com elas**: só desvie com um **fator nomeado** (motivação, desfalque, fadiga, mando) dizendo a direção e o tamanho. Se não há fator concreto pra mover, devolva a âncora — não regrida pro centro por cautela.

## Saída exigida (objeto tipado — validado pelo runtime). Campos em INGLÊS; só os textos (`summary`, `analysis`) em português.
**Por time** — `home` (= Liverpool) e `away` (= Brentford), cada um com:
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
