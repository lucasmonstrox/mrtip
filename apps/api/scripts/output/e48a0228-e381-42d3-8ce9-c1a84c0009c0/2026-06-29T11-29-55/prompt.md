# Prognóstico de expected goals — Liverpool x Brentford

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
- Local: Anfield, Liverpool (grass)
- Descanso: Liverpool 9 dias · Brentford 7 dias
- Viagem do visitante: ~282 km
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo
- **Vantagem de casa** (já embutida nos λ — NÃO some de novo): mandantes desta liga marcam +0.3 gol/jogo a mais que visitantes. Torcida/pressão pesam no **resultado (1x2)** mais que no total: **não** dê o visitante como favorito sem qualidade nitidamente superior E mando fraco do mandante. Em jogo de stake alto, o fator casa aperta mais.

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- Liverpool: 5º, 59 pts · Brentford: 9º, 52 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (8º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Liverpool: 5º, 59 pts, 1 jogo(s) restante(s) (máx possível 62 pts)
  - já SEGURO do rebaixamento.
  - vaga de Champions praticamente garantida.
  - → motivação: **baixa** — NÃO precisa lutar — Champions praticamente garantida
  - disputa pela vaga (5º): pro Liverpool **um empate basta** (vai a 60, fora do alcance) — só perde a vaga se PERDER. Quem ainda ameaça → AFC Bournemouth (6º, 56 pts, máx 59) empata em pontos mas está **-6 de saldo** (+4 vs +10) — só passa se o Liverpool perder por muito E ele vencer por muito (virar 6)
  - Brentford: 9º, 52 pts, 1 jogo(s) restante(s) (máx possível 55 pts)
  - já SEGURO do rebaixamento.
  - vaga europeia ainda matematicamente possível.
  - → motivação: **alta** — PRECISA LUTAR — briga por vaga europeia

## Liverpool (manda) — até 2026-05-24
- Total na temporada: **62 gols marcados**, 52 sofridos em 37 jogos
- Média geral: marca 1.68 / sofre 1.41 por jogo
- **Em casa (18j): marca 1.83 / sofre 1.06** (total 33 gols em casa)
- Por tempo (casa+fora): 1ºT marca 0.65 sofre 0.46 · 2ºT marca 1.03 sofre 0.95
- **Finalização: 169 SoT total (4.57/jogo · em casa 5.11/jogo) · conversão 37%** (gols ÷ SoT)
- Sofre 4.11 SoT/jogo (adversário converte 34%) · cria 12.08 key passes/jogo
- **Forma (momento) — últimos 5: DEDVV** (7pts) · marca 2↑ / sofre 2↑ g/j · SoT 4.4 feito / 5.8 sofrido · últimos 10: DEDVVVDEDV (14pts · 2/1.7 g/j · SoT 5/5.4)
- Marca por faixa (/j): 0-15: 0.11 · 16-30: 0.14 · 31-45: 0.41 · 46-60: 0.32 · 61-75: 0.16 · 76-90: 0.54
- Sofre por faixa (/j): 0-15: 0.19 · 16-30: 0.08 · 31-45: 0.19 · 46-60: 0.24 · 61-75: 0.24 · 76-90: 0.46
- 1ºT: marca 24 / sofre 17 (totais na temporada)
### Desfalques de Liverpool neste jogo
- **Hugo Ekitiké** (Unknown Injury) — 11 gols + 4 assists até a data; season: **18% dos gols** do time (24% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (↓ menos decisivo / time se adaptou); with/without: com ele 1.68 g/j (28j) vs sem ele 1.67 g/j (9j) = −1%; finaliza **0.68 SoT/jogo** (time: 4.86 SoT/j com ele vs 3.67 sem — volume mais estável que gols)
- **Conor Bradley** (Knee Injury) — 0 gols + 1 assists até a data; season: **0% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 1.47 g/j (15j) vs sem ele 1.82 g/j (22j) = +24%; finaliza **0 SoT/jogo** (time: 3.6 SoT/j com ele vs 5.23 sem — volume mais estável que gols)
- **Giovanni Leoni** (Cruciate Ligament Tear) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.68 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **S. Bajcetic Maquieira** (Unknown Injury) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/10 gols = **0%** (≈ estável); with/without: com ele 0 g/j (0j) vs sem ele 1.68 g/j (37j) = −0%  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Brentford (visita) — até 2026-05-24
- Total na temporada: **54 gols marcados**, 51 sofridos em 37 jogos
- Média geral: marca 1.46 / sofre 1.38 por jogo
- **Fora (18j): marca 1.17 / sofre 1.67** (total 21 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.65 sofre 0.65 · 2ºT marca 0.81 sofre 0.73
- **Finalização: 145 SoT total (3.92/jogo · fora 3.72/jogo) · conversão 37%** (gols ÷ SoT)
- Sofre 4.3 SoT/jogo (adversário converte 32%) · cria 8.08 key passes/jogo
- **Forma (momento) — últimos 5: EDVDE** (5pts) · marca 1.2↓ / sofre 1.4= g/j · SoT 3.8 feito / 5 sofrido · últimos 10: EDVDEEEEEV (12pts · 1.4/1.4 g/j · SoT 3.7/4.7)
- Marca por faixa (/j): 0-15: 0.22 · 16-30: 0.16 · 31-45: 0.27 · 46-60: 0.16 · 61-75: 0.14 · 76-90: 0.51
- Sofre por faixa (/j): 0-15: 0.16 · 16-30: 0.22 · 31-45: 0.27 · 46-60: 0.16 · 61-75: 0.16 · 76-90: 0.41
- 1ºT: marca 24 / sofre 24 (totais na temporada)
### Desfalques de Brentford neste jogo
- **Fábio Carvalho** (Unknown Injury) — 1 gols + 0 assists até a data; season: **2% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 0.83 g/j (6j) vs sem ele 1.58 g/j (31j) = +90%; finaliza **0.17 SoT/jogo** (time: 2.83 SoT/j com ele vs 4.13 sem — volume mais estável que gols)
- **Rico Henry** (Unknown Injury) — 0 gols + 1 assists até a data; season: **0% dos gols** do time (2% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1.64 g/j (25j) vs sem ele 1.08 g/j (12j) = −34%; finaliza **0 SoT/jogo** (time: 4.12 SoT/j com ele vs 3.5 sem — volume mais estável que gols)
- **Antoni Milambo** (Cruciate Ligament Tear) — 0 gols + 0 assists até a data; season: **0% dos gols** do time (0% com assists); **últimos 5 jogos do time**: participou de 0/6 gols = **0%** (≈ estável); with/without: com ele 1 g/j (1j) vs sem ele 1.47 g/j (36j) = +47%; finaliza **0 SoT/jogo** (time: 3 SoT/j com ele vs 3.94 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Liverpool atacando × Brentford defendendo**
| Faixa | Liverpool marca/j | Brentford sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.11 | 0.16 | 0.27 |
| 16-30 | 0.14 | 0.22 | 0.36 |
| 31-45 | 0.41 | 0.27 | 0.68 |
| 46-60 | 0.32 | 0.16 | 0.48 |
| 61-75 | 0.16 | 0.16 | 0.32 |
| 76-90 | 0.54 | 0.41 | 0.95 |

**Brentford atacando × Liverpool defendendo**
| Faixa | Brentford marca/j | Liverpool sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.22 | 0.19 | 0.41 |
| 16-30 | 0.16 | 0.08 | 0.24 |
| 31-45 | 0.27 | 0.19 | 0.46 |
| 46-60 | 0.16 | 0.24 | 0.4 |
| 61-75 | 0.14 | 0.24 | 0.38 |
| 76-90 | 0.51 | 0.46 | 0.97 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Liverpool (casa) = 1.99 · λ Brentford (fora) = 1.01 · total = 3

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Liverpool: λ_SoT 5.06 × conv 37% → **1.87 gols**
- Brentford: λ_SoT 3.63 × conv 37% → **1.34 gols**
- total via SoT = 3.21
- **Índice de volume do jogo**: λ_SoT total 8.7 vs média da liga 8.5 SoT → na média
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Probabilidades de mercado (Poisson sobre os λ — ÂNCORA: ajuste A PARTIR daqui, não invente)
| Mercado | Rota A (gols) | Rota B (SoT×conv) |
|---|---|---|
| 1x2 casa/E/fora | 60/21/19% | 50/23/28% |
| Over 1.5 | 80% | 83% |
| Over 2.5 | 58% | 62% |
| Over 3.5 | 35% | 40% |
| BTTS | 55% | 62% |
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
- `market`: `"1x2"` | `"over_under"` | `"btts"` — escolha SEMPRE um (o de maior valor); não há opção de passar.
- `selection`: conforme o market — 1x2: `"home"`/`"draw"`/`"away"` · over_under: `"over"`/`"under"` · btts: `"yes"`/`"no"`.
- `line`: a linha quando `market="over_under"` (ex.: 2.5); `null` nos outros.
- `confidence`: `"low"` | `"medium"` | `"high"`.
- `probability`: a sua probabilidade (0-1) do evento escolhido (coerente com `general`).
- `analysis` (PT): análise COMPLETA e profissional — não um resumo. Junte tudo que sustenta a aposta (mando, motivação, momento/forma, desfalques, volume/conversão), o cenário esperado e o que pode virar contra (o risco). **Sempre recomende o melhor mercado** — aquele onde o cenário mais te favorece; se o edge for fino, escolha mesmo assim e marque `confidence` baixa, explicando o tamanho da margem.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (chain-of-thought / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
