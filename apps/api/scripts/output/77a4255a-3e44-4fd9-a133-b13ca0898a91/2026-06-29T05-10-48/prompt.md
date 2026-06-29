# Prognóstico de expected goals — West Ham United x Leeds United

Você é um analista quantitativo de futebol. Produza um prognóstico de **expected goals (xG)** para esta partida.
Use o método: **PARTA da base rate Poisson** abaixo (já calculada) e **AJUSTE multiplicativamente** por fator
(desfalques, fadiga, contexto), justificando cada ajuste. Regras:
- **NÃO double-conte**: se um desfalque já estava fora nos últimos jogos, o efeito dele já está na média recente.
- O **with/without** é evidência DIRECIONAL; ignore os marcados com ⚠️ (volante/lateral sem G+A, ou amostra pequena).
- Sinalize incerteza (dados ausentes: NÃO temos xG real, clima, nem chutes/posse — isto é proxy por gols reais).

## Contexto
- Data: 2026-05-24 15:00 · Rodada 38 · Liga PL
- Local: London Stadium, London (grass)
- Descanso: West Ham United 7 dias · Leeds United 7 dias
- Viagem do visitante: ~270 km
- Média da liga (pré-jogo, 370 jogos): mandante 1.532 gols/jogo · visitante 1.227 gols/jogo

## West Ham United (manda) — até 2026-05-24
- Total na temporada: **43 gols marcados**, 65 sofridos em 37 jogos
- Média geral: marca 1.16 / sofre 1.76 por jogo
- **Em casa (18j): marca 1.33 / sofre 1.67** (total 24 gols em casa)
- Por tempo (casa+fora): 1ºT marca 0.57 sofre 0.7 · 2ºT marca 0.59 sofre 1.05
- Marca por faixa (/j): 0-15: 0.24 · 16-30: 0.08 · 31-45: 0.24 · 46-60: 0.11 · 61-75: 0.19 · 76-90: 0.3
- Sofre por faixa (/j): 0-15: 0.3 · 16-30: 0.11 · 31-45: 0.3 · 46-60: 0.27 · 61-75: 0.38 · 76-90: 0.41
- 1ºT: marca 21 / sofre 26 (totais na temporada)
### Desfalques de West Ham United neste jogo
- **Adama Traoré** (Muscle Injury) — 0 gols + 0 assists até a data; representa **0% dos gols** do time (0% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.44 g/j (9j) vs sem ele 1.07 g/j (28j) = −26%  ⚠️ with/without NÃO confiável (sem contribuição direta ou amostra pequena)
- **Lukasz Fabianski** (Back Injury) — 0 gols + 0 assists até a data; representa **0% dos gols** do time (0% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 0 g/j (0j) vs sem ele 1.16 g/j (37j) = −0%  ⚠️ with/without NÃO confiável (sem contribuição direta ou amostra pequena)

## Leeds United (visita) — até 2026-05-24
- Total na temporada: **49 gols marcados**, 53 sofridos em 37 jogos
- Média geral: marca 1.32 / sofre 1.43 por jogo
- **Fora (18j): marca 1.11 / sofre 1.78** (total 20 gols fora)
- Por tempo (casa+fora): 1ºT marca 0.65 sofre 0.43 · 2ºT marca 0.68 sofre 1
- Marca por faixa (/j): 0-15: 0.19 · 16-30: 0.16 · 31-45: 0.3 · 46-60: 0.19 · 61-75: 0.24 · 76-90: 0.24
- Sofre por faixa (/j): 0-15: 0.11 · 16-30: 0.19 · 31-45: 0.14 · 46-60: 0.3 · 61-75: 0.3 · 76-90: 0.41
- 1ºT: marca 24 / sofre 16 (totais na temporada)
### Desfalques de Leeds United neste jogo
- **Noah Okafor** (Calf Injury) — 8 gols + 1 assists até a data; representa **16% dos gols** do time (18% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.61 g/j (28j) vs sem ele 0.44 g/j (9j) = −73%
- **Anton Stach** (Ankle Injury) — 5 gols + 3 assists até a data; representa **10% dos gols** do time (16% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.1 g/j (29j) vs sem ele 2.13 g/j (8j) = +94%
- **Ilia Gruev** (Unknown Injury) — 0 gols + 3 assists até a data; representa **0% dos gols** do time (6% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.52 g/j (23j) vs sem ele 1 g/j (14j) = −34%
- **Gabriel Gudmundsson** (Unknown Injury) — 0 gols + 0 assists até a data; representa **0% dos gols** do time (0% com assists) → o ataque perde isso se ele não jogar; with/without: com ele 1.34 g/j (32j) vs sem ele 1.2 g/j (5j) = −10%  ⚠️ with/without NÃO confiável (sem contribuição direta ou amostra pequena)

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

## Base rate (ponto de partida — Poisson força ataque×defesa, por mando)
- λ West Ham United (casa) = 1.55
- λ Leeds United (fora) = 1.51
- Total base = 3.06

## Saída exigida (objeto tipado — o schema é validado pelo runtime)
- Para CADA time (`home` = West Ham United, `away` = Leeds United): `xg` (total), `xg_1t`, `xg_2t` e
  **`xg_bands`** = o xG distribuído pelas 6 faixas de 15 min (`"0-15"`,`"16-30"`,`"31-45"`,`"46-60"`,`"61-75"`,`"76-90"`).
  A soma das 6 faixas deve bater com `xg` (e 0-15+16-30+31-45 = `xg_1t`). Use o cruzamento ataque×defesa por faixa pra distribuir.
- Agregados: `total`, `total_1t`, `total_2t`, `over25_prob`, `btts_prob`, `one_x_two` (home/draw/away).
- `confianca` ∈ {baixa, media, alta}, `drivers` (3 fatores), `raciocinio` (1 parágrafo curto com a maior incerteza).
