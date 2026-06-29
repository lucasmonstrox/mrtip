# Prognóstico de expected goals — Manchester City x Aston Villa

**IMPORTANTE: raciocine (pense/chain-of-thought) E responda inteiramente EM PORTUGUÊS.** Todo o texto, inclusive o seu raciocínio interno, deve ser em português do Brasil.

Você é um analista quantitativo de futebol. Produza um prognóstico de **expected goals (xG)** para esta partida.
Use o método: **PARTA da base rate** abaixo (duas rotas já calculadas: λ de gols puro E λ_SoT × conversão) e
**AJUSTE multiplicativamente** por fator (desfalques, fadiga, contexto), justificando cada ajuste. Regras:
- **SoT (chutes no alvo) é o sinal de VOLUME primário** — 3× mais denso que gols, logo menos ruído. Use gols para a
  CONVERSÃO (gols/SoT) e como checagem. Onde as duas rotas de base rate divergem, confie mais no SoT e trate a
  diferença como finalização acima/abaixo da média (tende a regredir à conversão do time).
- O **desconto por desfalque age no VOLUME (SoT/λ_SoT)**, não na conversão (a eficiência do time é mais estável).
- **NÃO double-conte**: se um desfalque já estava fora nos últimos jogos, o efeito dele já está na média recente.
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️. O with/without de **SoT** é mais estável que o de gols — prefira-o.
- Sinalize incerteza: NÃO temos xG real, clima, nem posse/chutes totais — SoT é o melhor proxy de volume/qualidade aqui.

## Contexto
- Data: 2026-05-24 15:00 · Rodada 38 · Liga PL
- Local: Etihad Stadium, Manchester (grass)
- Descanso: Manchester City 5 dias · Aston Villa 9 dias
- Viagem do visitante: ~110 km
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo

## Tabela e motivação (pré-jogo — recomputada só com jogos antes de 2026-05-24)
- Manchester City: 2º, 78 pts · Aston Villa: 4º, 62 pts
- Linhas: segurança (sair do Z) 38 pts (17º) · Champions 59 pts (5º) · última vaga europeia 52 pts (9º)
- **Motivação de cada lado** (quem PRECISA vencer tende a atacar → +xG ofensivo / -solidez defensiva; quem não tem nada em jogo tende a baixar a intensidade → -xG do jogo todo). Pondere a direção:
  - Manchester City: 2º, 78 pts, 1 jogo(s) restante(s) (máx possível 81 pts)
  - já SEGURO do rebaixamento.
  - vaga de Champions já garantida.
  - → motivação: **baixa** — NÃO precisa lutar — Champions já garantida
  - Aston Villa: 4º, 62 pts, 1 jogo(s) restante(s) (máx possível 65 pts)
  - já SEGURO do rebaixamento.
  - vaga de Champions já garantida.
  - → motivação: **baixa** — NÃO precisa lutar — Champions já garantida

## Manchester City (manda) — até 2026-05-24
- Total na temporada: **76 gols marcados**, 33 sofridos em 37 jogos
- Média geral: marca 2.05 / sofre 0.89 por jogo
- **Em casa (18j): marca 2.44 / sofre 0.67** (total 44 gols em casa)
- Por tempo (casa+fora): 1ºT marca 1.08 sofre 0.27 · 2ºT marca 0.97 sofre 0.62
- **Finalização: 204 SoT total (5.51/jogo · em casa 6.28/jogo) · conversão 37%** (gols ÷ SoT)
- Sofre 3.32 SoT/jogo (adversário converte 27%) · cria 12.3 key passes/jogo
- Marca por faixa (/j): 0-15: 0.24 · 16-30: 0.24 · 31-45: 0.59 · 46-60: 0.24 · 61-75: 0.38 · 76-90: 0.35
- Sofre por faixa (/j): 0-15: 0 · 16-30: 0.11 · 31-45: 0.16 · 46-60: 0.16 · 61-75: 0.27 · 76-90: 0.19
- 1ºT: marca 40 / sofre 10 (totais na temporada)
### Desfalques de Manchester City neste jogo
Sem desfalques registrados.

## Aston Villa (visita) — até 2026-05-24
- Total na temporada: **54 gols marcados**, 48 sofridos em 37 jogos
- Média geral: marca 1.46 / sofre 1.3 por jogo
- **Fora (18j): marca 1.22 / sofre 1.44** (total 22 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.57 sofre 0.59 · 2ºT marca 0.89 sofre 0.7
- **Finalização: 170 SoT total (4.59/jogo · fora 4.17/jogo) · conversão 32%** (gols ÷ SoT)
- Sofre 4.54 SoT/jogo (adversário converte 29%) · cria 9.76 key passes/jogo
- Marca por faixa (/j): 0-15: 0.11 · 16-30: 0.16 · 31-45: 0.3 · 46-60: 0.27 · 61-75: 0.24 · 76-90: 0.38
- Sofre por faixa (/j): 0-15: 0.24 · 16-30: 0.11 · 31-45: 0.24 · 46-60: 0.27 · 61-75: 0.19 · 76-90: 0.24
- 1ºT: marca 21 / sofre 22 (totais na temporada)
### Desfalques de Aston Villa neste jogo
- **Boubacar Kamara** (Knee Injury) — 1 gols + 3 assists até a data; representa **2% dos gols** do time (7% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.78 g/j (18j) vs sem ele 1.16 g/j (19j) = −35%; finaliza **0.22 SoT/jogo** (time: 4.67 SoT/j com ele vs 4.53 sem — volume mais estável que gols)
- **Emiliano Martínez** (Doubtful) — 0 gols + 1 assists até a data; representa **0% dos gols** do time (2% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.44 g/j (32j) vs sem ele 1.6 g/j (5j) = +11%; finaliza **0 SoT/jogo** (time: 4.47 SoT/j com ele vs 5.4 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT
- **Alysson** (Muscle Injury) — 0 gols + 0 assists até a data; representa **0% dos gols** do time (0% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 0.67 g/j (3j) vs sem ele 1.53 g/j (34j) = +128%; finaliza **0 SoT/jogo** (time: 3.67 SoT/j com ele vs 4.68 sem — volume mais estável que gols)  ⚠️ with/without de GOLS NÃO confiável (sem contribuição direta ou amostra pequena) — olhe o de SoT

## Cruzamento ataque × defesa por faixa de 15 min
Onde o ataque de um e a defesa do outro coincidem em alta, é a janela onde o gol tende a sair. Use pra distribuir o xG pelos tempos.

**Manchester City atacando × Aston Villa defendendo**
| Faixa | Manchester City marca/j | Aston Villa sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.24 | 0.24 | 0.48 |
| 16-30 | 0.24 | 0.11 | 0.35 |
| 31-45 | 0.59 | 0.24 | 0.83 |
| 46-60 | 0.24 | 0.27 | 0.51 |
| 61-75 | 0.38 | 0.19 | 0.57 |
| 76-90 | 0.35 | 0.24 | 0.59 |

**Aston Villa atacando × Manchester City defendendo**
| Faixa | Aston Villa marca/j | Manchester City sofre/j | índice janela |
|---|---|---|---|
| 0-15 | 0.11 | 0 | 0.11 |
| 16-30 | 0.16 | 0.11 | 0.27 |
| 31-45 | 0.3 | 0.16 | 0.46 |
| 46-60 | 0.27 | 0.16 | 0.43 |
| 61-75 | 0.24 | 0.27 | 0.51 |
| 76-90 | 0.38 | 0.19 | 0.57 |

## Base rate (ponto de partida — duas rotas independentes; devem convergir)
**Rota A — gols puros** (Poisson força ataque×defesa de GOLS, por mando):
- λ Manchester City (casa) = 2.29 · λ Aston Villa (fora) = 0.67 · total = 2.96

**Rota B — SoT × conversão** (volume de finalização via Poisson, depois × conversão do time — menos ruído):
- Manchester City: λ_SoT 6.46 × conv 37% → **2.39 gols**
- Aston Villa: λ_SoT 3.12 × conv 32% → **1 gols**
- total via SoT = 3.39
- **Se A e B divergirem**, prefira B (volume é mais estável); a diferença é sorte de finalização e tende a regredir.

## Saída exigida (objeto tipado — validado pelo runtime). Estrutura: PROGNÓSTICO POR TIME + GERAL.
**Por time** — `home` (= Manchester City) e `away` (= Aston Villa), cada um com:
- `xg` (total), `xg_1t`, `xg_2t` e **`xg_bands`** = o xG nas 6 faixas de 15 min (`"0-15"`,`"16-30"`,`"31-45"`,`"46-60"`,`"61-75"`,`"76-90"`). Soma das 6 = `xg`; 0-15+16-30+31-45 = `xg_1t`. Use o cruzamento ataque×defesa por faixa.
- `resumo` = leitura CURTA daquele time (1-2 frases): motivação de tabela, desfalque que pesa, mando, e como isso move o xG dele.

**Geral** (`geral`) — agregados do jogo:
- `total`, `total_1t`, `total_2t`, `over25_prob`, `btts_prob`.
- **1x2 (home/draw/away)** em 3 recortes: `one_x_two` (jogo 90min), `one_x_two_1t` (placar do 1º tempo), `one_x_two_2t` (2º tempo isolado). Derive do Poisson com os λ do respectivo tempo.
- `confianca` ∈ {baixa, media, alta} e `resumo` = 1 parágrafo do jogo + a maior incerteza.

No topo: `drivers` = os 3 fatores que mais moveram o número.

---
⚠️ LEMBRETE FINAL (idioma): escreva TODO o seu raciocínio interno (chain-of-thought / thinking) em **PORTUGUÊS do Brasil**, desde a PRIMEIRA palavra. Comece o raciocínio com algo como "Vou analisar...". Não pense em inglês em nenhum momento. A resposta final também 100% em português.
