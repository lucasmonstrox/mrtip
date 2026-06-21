# Regra de prognóstico — Arbitragem (o árbitro escalado)

> Como a **identidade do árbitro** entra na pipeline do mrtip. É o achado mais **forte e acionável** das regras de contexto: o árbitro é o maior driver isolado do mercado de **cartões**, é mensurável, razoavelmente estável e o mercado o precifica **devagar** fora das grandes ligas.

- **Status:** rascunho inicial (v0) — investigado, alta confiança.
- **Última atualização:** 2026-06-18
- **Dimensão no dossiê:** adiciona "Arbitragem" às dimensões do [overview](../visao-geral.md#6-como-a-ia-entende-um-jogo). Complementa [rivalidade.md](./rivalidade.md) (ambos puxam cartões) — o derby **e** o árbitro rígido juntos é o cenário de maior over de cartões.
- **Mercado-alvo primário:** over/under de **cartões** e **booking points**. Secundário: pênalti, faltas, leve viés pró-casa.

---

## 1. Por que o árbitro importa

Árbitros do **mesmo campeonato** variam de ~2,5 a ~4,7+ cartões por jogo — quase **2×** entre o mais rígido e o mais brando. Saber quem apita uma partida muda a expectativa de cartões em **20%+** em qualquer direção, e essa tendência é **razoavelmente estável** temporada a temporada. É um sinal barato (basta o ID do árbitro escalado) que casas recreativas e mercados de nicho **não precificam bem**.

> **Regra-base:** árbitro rígido + dois times faltosos (ou um clássico) → **over de cartões**. Árbitro brando → **under**. O árbitro é o input que o público mais ignora nos mercados de cartões.

---

## 2. Sinais e heurísticas

| Sinal | Evidência | Efeito | Direção do pick | Força |
|---|---|---|---|---|
| **Rigor do árbitro (cartões/jogo)** | PL: Attwell ~4,7 vs Pawson ~2,5 (≈2×). Razão faltas/cartão: ~4-5 (rígido) a ~8-10 (brando) | Define o teto de cartões do jogo | ↑/↓ **Over/under cartões** | **Forte** |
| **Baseline da liga** | La Liga/Serie A muito acima da PL em cartões; PL ~5,4 amarelos, La Liga ~4,4-5,3, UCL ~4,2 (25/26) | Âncora obrigatória da normalização | (calibração) | **Forte** |
| **Viés pró-casa do árbitro** | Ghost games COVID: sem torcida, vantagem de casa cai >50% e cartões ao visitante caem ~⅓ de amarelo/jogo | Torcida enviesa o árbitro pró-mandante | ↑ leve pró-**casa**; ↑ cartões do **visitante** | **Forte** (causal) |
| **Dose-resposta do público** | La Liga: +acréscimo quando mandante precisa; efeito cresce com a lotação | Quanto mais público, maior o viés | ↑ cartões do visitante em jogo cheio | **Forte** |
| **Regime VAR** | PL: VAR subiu pênaltis +26%, vermelhos +58%, amarelos +11,5% (p<0,001) | Baselines mudaram | comparar só vs **era-VAR** | **Forte** |
| **Pênaltis por árbitro** | Amostra pequena (~0,1-0,26/jogo), alto ruído | Sinal fraco isolado | ⚠️ **modificador**, não driver | Fraca |

> ⚠️ **Acréscimo "+112s pró-mandante"** (Lago & Gómez): direção confirmada, mas o número exato vem de press release e o enquadramento original é "favorece **times grandes**", não estritamente mandante. Tratar como tendência, não cravar o número.

---

## 3. O erro fatal: dupla contagem

**Nunca** some "média de cartões do árbitro" + "média de cartões do time". Cada média **já embute** o outro (a média do árbitro inclui os times que ele apitou; a do time inclui os árbitros que o apitaram). Como árbitros **não migram entre ligas**, os efeitos se confundem.

**Método correto:**
- **Multiplicativo sobre baseline da liga:** `cartões_esperados = baseline_liga × rate_ratio_árbitro × rate_ratio_time_casa × rate_ratio_time_fora`, onde `rate_ratio = média_do_ator / média_da_liga`.
- **Em produção:** modelo Poisson / Conway-Maxwell-Poisson com **efeitos fixos separados** de árbitro, time (casa/fora) e liga-temporada (abordagem do paper *Yellow fever*, JRSS-A 2026).
- **Shrink** o efeito-árbitro pelo nº de jogos apitados (não superajustar árbitro com poucas partidas).

---

## 4. Como aplicar no pick

1. **Obter** o árbitro escalado (sai com a designação da rodada).
2. **Calcular** seu rate_ratio de cartões (rolling, mesma competição, era-VAR) e a razão faltas/cartão.
3. **Combinar** com a propensão a faltas dos dois times e o índice de [rivalidade](./rivalidade.md) — sem dupla contagem (§3).
4. **Direcionar:** over/under de cartões totais, **booking points** (amarelo=10, vermelho=25), handicap/total de cartões por time, total de faltas; pênalti e viés pró-casa só como **modificadores**.
5. **Explicar** (LLM): *"over 4,5 cartões: árbitro [X] média 5,1/jogo (top-3 rígidos da liga), confronto faltoso e jogo com casa lotada (viés pró-mandante nos cartões do visitante)."*

> **Onde há valor:** (a) **ligas menores / menos cobertas** onde a casa não tem dado confiável de árbitro; (b) **mercados de nicho** (booking points em faixas, cartões por time, total de faltas); (c) a **janela** entre a divulgação da escala e o ajuste da linha. Nas top-5 e nos mercados principais de cartões, casas afiadas **já precificam** o árbitro — edge pequeno e some rápido.

---

## 5. Fontes de dados

| Fonte | O que dá | Custo | Cobertura |
|---|---|---|---|
| **API-Football** | Campo `referee` por fixture + cartões via `/statistics`/`/events` | Free 100 req/dia; pago | 1.100+ ligas |
| **football-data.co.uk** | Coluna `Referee` + HY/AY/HR/AR (cartões), HF/AF (faltas), HBP/ABP (booking points) — **CSV grátis p/ backtest** | Grátis | Europa (Referee mais consistente nas ligas inglesas) |
| **FootyStats / OddAlerts** | Stats por árbitro + **escala da rodada** (chave para a janela de valor) | Freemium | 60+ ligas, incl. Brasileirão |
| **FBref / WhoScored** | Árbitro no match report; rankings de cartões/jogo por árbitro | Grátis (scraping) | Top europeias |
| **Transfermarkt** | Histórico do árbitro + pênaltis; cobre **ligas menores** sem coluna Referee | Grátis | Muito ampla |
| **Premier League Referee Index** | Designação e stats oficiais | Grátis | PL (canônico) |

---

## 6. Limitações e cuidados

- **Sinal direcional, não determinístico.** O árbitro inclina a probabilidade de cartões; não a garante. Combinar sempre com a propensão dos times.
- **Regime VAR.** Só comparar árbitro contra baseline da **mesma era** (pós-VAR os baselines subiram muito).
- **Pênaltis e vermelhos são ruidosos** (eventos raros) — sinal-árbitro fraco aí; o robusto é em **cartões amarelos e faltas**.
- **Consistência tem ruído contextual:** 2º tempo recebe muito mais acréscimo; pressão de torcida muda decisões. A estabilidade é "boa o suficiente para apostar", não perfeita.
- **Cobertura BR:** API-Football/FootyStats cobrem o Brasileirão, mas validar o preenchimento do campo árbitro por liga-temporada.

---

## Decisões em aberto

1. **Modelo de normalização:** multiplicativo simples vs Poisson/CMP com efeitos fixos — definir na calibração. `[A confirmar]`
2. **Janela rolling** (nº de jogos) e fator de **shrink** por amostra do árbitro. `[A confirmar]`
3. **Mercados-alvo no MVP:** entrar já com cartões/booking points (onde está o EV), mesmo que o overview comece com 1X2 + over/under 2.5? `[A confirmar]`
4. **Pipeline da escala:** de onde puxar a designação do árbitro com antecedência (janela de valor). `[A confirmar]`

---

## Referências

- [Squawka — PL referees by leniency](https://www.squawka.com/en/features/premier-league-referees-ranked-leniency/) · [TheStatsDontLie — La Liga cards](https://www.thestatsdontlie.com/football/europe/spain/la-liga/cards/)
- Endrich & Gesche — [*Home-bias in referee decisions: Ghost Matches*](https://www.sciencedirect.com/science/article/pii/S0165176520303815) · Reade, Schreyer & Singleton — [*Ghost Games*](https://journalofsportbehavior.org/index.php/JSB/article/view/158)
- Lago & Gómez (2016) — [viés de acréscimo](https://pubmed.ncbi.nlm.nih.gov/27166341/)
- [*Yellow fever: referee consistency in the Big 5*](https://academic.oup.com/jrsssa/advance-article/doi/10.1093/jrsssa/qnag014/8488960) (JRSS-A 2026) — modelo CMP com efeitos separados.
- Frontiers (2026) — [VAR & disciplinary decisions](https://pmc.ncbi.nlm.nih.gov/articles/PMC13044101/)
- [football-data.co.uk data dictionary](https://www.football-data.co.uk/notes.txt) · [API-Football docs](https://api-sports.io/documentation/football/v3)
