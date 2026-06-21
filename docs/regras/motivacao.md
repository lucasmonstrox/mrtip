# Regra de prognóstico — Motivação e peso do jogo (stakes)

> Como o **peso/importância** de uma partida (briga por título/vaga/rebaixamento, jogo "morto", liga vs mata-mata) entra na pipeline do mrtip. O sinal mais forte aqui é a **motivação assimétrica** — e o mercado costuma precificar **reputação**, não motivação.

- **Status:** rascunho inicial (v0) — investigado.
- **Última atualização:** 2026-06-18
- **Dimensão no dossiê:** adiciona "Motivação/stakes" às dimensões do [overview](../visao-geral.md#6-como-a-ia-entende-um-jogo). A parte de **fadiga/calendário/altitude** vive em [calendario-fadiga.md](./calendario-fadiga.md) — esta regra é só sobre **o que está em jogo**.

---

## 1. Por que o peso do jogo importa

Em jogos importantes os jogadores não correm **mais** (distância total é igual), mas o **engajamento de contato** cresce: +16% de duelos, +36% de faltas. E quando os dois lados têm **incentivos diferentes** — um precisa desesperadamente, o outro já não tem nada em jogo — o resultado se distorce de forma mensurável e **explorável**, porque o mercado tende a olhar a força/reputação dos times, não a hierarquia de objetivos.

> **Regra-base:** o melhor edge é a **motivação assimétrica** — time que *precisa* (rebaixamento/vaga) contra time *indiferente* (já salvo/classificado/sem objetivo). Inclinar a favor do necessitado, especialmente onde o mercado é menos eficiente.

---

## 2. Sinais e heurísticas

| Sinal | Evidência | Efeito | Direção do pick | Força |
|---|---|---|---|---|
| **Motivação assimétrica** (precisa vs indiferente) | Elaad et al. (2018), 75 países: time ameaçado atinge o resultado desejado acima do esperado contra adversário indiferente; efeito **cresce com a corrupção** do país + quid pro quo no ano seguinte | Necessitado rende acima da força | ↑ **1X2/AH** pro necessitado | **Forte** |
| **Mercado precifica reputação, não motivação** | Feddersen et al.: casas ajustam odds p/ times sem objetivo, mas o público sobrevaloriza o favorito reputacional | Valor no azarão motivado vs favorito acomodado | ↑ underdog motivado | Moderada |
| **Dead rubber bilateral** (ambos sem objetivo) | Menos esforço, rotação, fim de temporada | Imprevisibilidade ↑, favorito menos confiável | ↓ desconto no **favorito reputacional** | Moderada |
| **Mata-mata / copa vs liga** | Copa tende a mais cautela e menos gols que liga; gestão de risco > dominância | Jogo mais travado | ↓ leve **under** / ↑ empate (tempo normal) | Moderada |
| **Engajamento físico em jogo importante** | +16% duelos, +36% faltas (Bundesliga) | Mais faltas/cartões | ↑ leve **over de cartões** | Moderada |
| **Drift de odds anômalo em jogo sensível** | Sinal de possível manipulação (corrupção) | Red flag | ⚠️ **filtrar**, não seguir cego | Moderada |

---

## 3. Como obter o sinal

A feature central é a **importância matemática** de cada jogo, por time, naquela rodada:

1. Puxar **standings + rodada** (football-data.org / API-Football).
2. Para cada lado, calcular a **consequência ainda viva**: chance de título, vaga continental ou rebaixamento (análogo ao "post-season consequences > 0,05" dos estudos).
3. Classificar o confronto: **assimétrico** (um precisa, outro não), **dead rubber bilateral**, ou ambos com objetivo.
4. Cruzar com o **formato** (liga vs copa/mata-mata) e a **fase** (fim de temporada amplifica dead rubbers).

---

## 4. Como aplicar no pick

1. **Motivação assimétrica** (melhor edge): inclinar 1X2/handicap a favor do necessitado — **mais forte em ligas de país com alto índice de corrupção** e de **baixa liquidez**, onde o efeito é maior e o mercado precifica pior.
2. **Dead rubber bilateral:** reduzir a confiança no favorito reputacional; não é direção limpa de 1X2, é **desconto de confiança**.
3. **Copa/mata-mata:** leve viés a under/empate no tempo normal.
4. **Explicar** (LLM): *"valor no [necessitado]: briga contra o rebaixamento na última rodada vs adversário já salvo e desmotivado — o mercado precifica a força, não a fome."*

> **Onde o mercado já precifica:** odds de fechamento já ajustam parcialmente para times sem incentivo em ligas líquidas. O valor residual está em (a) **motivação assimétrica subprecificada**, (b) **ligas de menor liquidez/maior corrupção**.

---

## 5. Fontes de dados

| Fonte | O que dá | Custo | Cobertura |
|---|---|---|---|
| **football-data.org** | Standings (total/casa/fora), fixtures por rodada | Free (top comps) | Europa principalmente |
| **API-Football** | Standings + fixtures + odds → cruzar posição/rodada e detectar drift em jogo sensível | Free 100 req/dia; pago | Global, incl. ligas menores (úteis p/ o sinal de corrupção) |
| **football-data.co.uk** | CSV histórico + odds de fechamento → reconstruir tabela em qualquer rodada e backtestar reputação-vs-motivação | Grátis | Europa, longo histórico |

---

## 6. Limitações e cuidados

- **Manipulação é tema sensível.** O drift de odds em jogo sensível é **red flag defensivo** (filtrar/baixar confiança), nunca incentivo a "seguir o esquema". Coerente com o [risco regulatório/jogo responsável](../visao-geral.md#13-riscos-e-considerações) (Lei 14.790/2023).
- **Efeito probabilístico, não determinístico.** Elaad é um efeito **médio** condicionado à corrupção; fraco/ausente em países de baixa corrupção.
- **Dead rubber não tem direção limpa de 1X2** — rotação pode tanto enfraquecer o ataque quanto abrir a defesa. Use como ajuste de confiança, não como aposta forte.
- **Importância é subjetiva no meio da tabela** — exige um modelo de "consequência viva", não só posição bruta.

---

## Decisões em aberto

1. **Modelo de importância:** como quantificar "consequência viva" por time/rodada (probabilidade de cenário pós-temporada). `[A confirmar]`
2. **Lista de ligas de alto risco/corrupção** onde o sinal assimétrico é amplificado. `[A confirmar]`
3. **Política para drift anômalo:** filtrar o jogo, baixar confiança, ou sinalizar ao usuário? `[A confirmar]`
4. **Peso** vs forma, mando, rivalidade. `[A confirmar]`

---

## Referências

- Elaad, Krumer & Kantor (2018) — [*Corruption and Sensitive Soccer Games*](https://academic.oup.com/jleo/article/34/3/364/5049429) (J. Law, Economics & Organization).
- Feddersen, Humphreys & Soebbing — [*Contest Incentives, Team Effort, and Betting Market Outcomes*](https://portal.findresearcher.sdu.dk/en/publications/contest-incentives-team-effort-and-betting-market-outcomes-in-eur).
- Linke et al. (2016) — [*Match Importance Affects Activity* (pacing)](https://pmc.ncbi.nlm.nih.gov/articles/PMC4900650/).
- [*Incentives matter sometimes: league vs Cup*](https://www.sciencedirect.com/science/article/pii/S2773161824000144) (2024).
- Goal.com — [*Value in dead rubber games*](https://www.goal.com/en-gb/betting/opinion/value-in-dead-rubber-games-big-5-leagues/A:blt6c2cca8eb23cc475).
