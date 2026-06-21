# SIN-013 — Sinal de escanteios (corners) como mercado/edge

> Investigação (`/rs`, tier comparação/focado — feita no main loop após limite de sessão nos subagentes). As-of: **2026-06-18**. Feature: [docs/features/sinais/SIN-013-escanteios.md](../features/sinais/SIN-013-escanteios.md).
> Rótulos: `verificado-fetch` (página aberta nesta sessão) · `snippet` (resultado de busca, não aberto) · `inferência`.

## TL;DR + recomendação cravada

Escanteios **são modeláveis e o mercado de cantos é mensuravelmente menos eficiente que o de gols** — o que casa com o achado recorrente do projeto de que o EV+ mora em **mercados de nicho** ([mercado-odds.md](../regras/mercado-odds.md)). Modelos de contagem (Poisson/negativa-binomial; **compound Poisson** porque cantos chegam em "lotes" com clustering serial) preveem o total de cantos a partir de **finalizações/volume ofensivo, força do time, mando e forma** — a cadeia causal é **posse → chutes → escanteios**, com **chutes mais informativos que posse** [`verificado-fetch`]. Há uma ineficiência **direcional concreta**: a tese de Lund achou que **o "under" de cantos na Premier League é sistematicamente subvalorizado** [`verificado-fetch`]. **MAS** três ressalvas matam o entusiasmo cego: (1) o edge é **pequeno** (~0,8%/aposta em 12 anos num modelo de over/under com chutes+cantos) e **sensível a threshold por temporada** [`snippet`]; (2) **não transfere entre ligas** (lucrativo na PL, vira prejuízo na Bundesliga sem retreino) [`verificado-fetch`]; (3) parte do sinal **já está na odd** (o próprio paper de previsão usa odds de mercado como input). **Recomendação: SIN-013 = candidato real da camada ESTIMAR, prioridade P2 — mas só ganha peso depois de backtest por-liga validado contra CLV (SIN-012).** Não prometer edge; tratar como "nicho promissor a calibrar", igual ao espírito da [calendario-fadiga.md](../regras/calendario-fadiga.md).

---

## Contexto e problema

SIN-013 nasce como candidato a sinal da camada **ESTIMAR** (`docs/arquitetura/taxonomia-sinais.md`) — o mercado de escanteios (over/under e handicap de cantos). Brief: (1) cantos são previsíveis? (2) o que os dirige? (3) o mercado é batível/ineficiente? (4) viável como edge, e a que custo de dados? Requisito implícito: anti-dupla-contagem com o mercado (validar via CLV), regulação BR.

## Estado real no código

**Greenfield** — não há coletor, schema nem motor. SIN-013 está `ideia`, depende de DOS-001. Fronteiras a checar (taxonomia): **SIN-009 (arbitragem)** toca faltas/cartões (não cantos diretamente, mas árbitro não dirige cantos — sobreposição baixa); **SIN-012 (mercado/CLV)** é quem valida se o edge de cantos sobrevive à closing line. `match_stats` do DOS-001 precisaria expor cantos (HC/AC) — hoje não modelado.

## Estado da arte / evidência

- **Cantos são modeláveis por contagem, com clustering serial.** arXiv 2112.13001 usa **compound Poisson (geometric-Poisson, bayesiano)** porque cantos "chegam em lote com padrão de clustering serial"; incorpora **odds de mercado cross-market** como input e discute ajuste de margem/ineficiência das odds cruas [`verificado-fetch`, arxiv.org/abs/2112.13001]. → cantos têm estrutura estatística própria; e o paper trata a **odd como informação**, sinal de que muito já está precificado.
- **Drivers = volume ofensivo > posse.** A cadeia causal é **posse → chutes → chutes no alvo → gols**, com **chutes mais impactantes que posse**; modelos usam médias móveis de cantos e de chutes recentes, xG e supremacia de gols do mandante [`snippet`, LSE "Profitable Model for Over/Under" + busca]. Escanteios são proxy de pressão ofensiva sustentada.
- **Mercado de cantos é menos eficiente / mais explorável** que o de gols — "bettors find value in corner markets due to relative unpredictability and inefficiencies in bookmaker odds" [`snippet`]. Coerente com a tese do mrtip (valor em mercado secundário/menos escrutinado).
- **Ineficiência direcional concreta (PL):** tese de Lund (15 modelos: negativa-binomial, logística, random forest; EPL; preditores = capacidade do time + forma + motivação) achou que **"as odds de under na Premier League eram geralmente subvalorizadas"** (assimetria), e os modelos foram **lucrativos em dados novos da PL** — apesar de baixo poder explicativo [`verificado-fetch`, lup.lub.lu.se/9127007].
- **Fragilidade do edge:** o mesmo trabalho mostra que a lucratividade **deteriora muito fora da PL** (Bundesliga vira não-lucrativa sem retreino) → **efeito é liga-específico, não transfere** [`verificado-fetch`]. E modelos de over/under com chutes+cantos+ratings renderam só **~0,8%/aposta em 12 anos, com thresholds que variam muito por temporada** → lucro real incerto [`snippet`].

## Sourcing / viabilidade

| Dado | Fonte | Custo | Confiança |
|---|---|---|---|
| Cantos por jogo (HC/AC) + odds histórico | **football-data.co.uk** (colunas HC/AC + odds; CSV) | Grátis | `verificado-fetch` (já usado na [arbitragem.md](../regras/arbitragem.md)) |
| Cantos ao vivo/histórico + odds | API-Football (`/fixtures/statistics`: Corner Kicks) | Free 100 req/dia; pago | `inferência` (mesmo provedor das outras regras) |
| Chutes/xG (a cadeia posse→chutes→cantos) | FBref / Understat | Grátis | `inferência` |
| Odds de fechamento (CLV) | Pinnacle / OddsPortal / football-data.co.uk | Grátis/scraping | herda risco BR do DOS-001/SIN-012 |

**Custo marginal baixo:** football-data.co.uk já traz cantos + odds → backtest direto possível. O gargalo é o mesmo de todo o produto: **odds de fechamento das casas BR** (risco aberto do DOS-001).

## Nota de modelo de dados

- Cantos entram como **stat de partida no dossiê (DOS-001)** — adicionar HC/AC ao `match_stats` (não é entidade nova).
- Sinal vive na camada **ESTIMAR**: modelo de contagem (Poisson/NB ou compound Poisson) → over/under e handicap de cantos. **Peso só após validação CLV (SIN-012)** — anti-dupla-contagem é mandatório porque o próprio mercado de cantos já carrega sinal.
- Se confirmado no backtest, **atualizar `docs/arquitetura/taxonomia-sinais.md`** para incluir SIN-013 na tabela de candidatos a edge quant.

## Riscos e gotchas
1. **Edge pequeno e threshold-sensível** (~0,8%/aposta) — fácil de evaporar com vig/erro de execução.
2. **Não transfere entre ligas** — exige backtest e calibração **por liga** (PL ≠ Bundesliga ≠ Brasileirão); proibido assumir que a ineficiência da PL vale no BR.
3. **Dupla-contagem** — odds de cantos já embutem muito; sem CLV positivo, é -EV apesar do backtest bonito.
4. **Cobertura BR de cantos + odds de cantos** das casas .bet.br não verificada (`NEI`).
5. **Baixo poder explicativo** dos modelos (a própria tese admite) — alta variância.

## Refutado (com evidência)
- **"Cantos são imprevisíveis/aleatórios"** — REFUTADO: modeláveis por contagem (compound Poisson capturando clustering) a partir de chutes/força/forma [`verificado-fetch`, arxiv 2112.13001].
- **"Achei um modelo de cantos lucrativo, logo tenho edge"** — REFUTADO (parcial): lucro é **liga-específico, some fora da liga de treino**, é pequeno (~0,8%) e parte já está na odd [`verificado-fetch` Lund + `snippet`]. Edge só é real se bater a closing (CLV).
- **"Posse manda nos cantos"** — REFUTADO (parcial): **chutes/volume ofensivo são mais informativos que posse** [`snippet`].

## Perguntas Abertas / lacunas
- **Ineficiência de cantos no Brasileirão** (`NEI`) — a assimetria "under subvalorizado" é achado da PL; **não testada no BR**. É o backtest que decide.
- **Cobertura de odds de cantos das casas .bet.br** (`NEI`) — cruza com o risco aberto do DOS-001/SIN-012.
- **Números exatos da tese de Lund e do arXiv** (`NEI`) — PDFs não abriram (binário); usei abstract/record. Ler PDFs p/ coeficientes/ROI se a feature avançar.
- **Counter-review independente** não rodou (limite de sessão) — vale um passe adversarial ao planejar.

## Evidências decisivas
- [web] https://arxiv.org/abs/2112.13001 — Forecasting corner kicks: compound Poisson (clustering serial), usa odds de mercado como input.
- [web] https://lup.lub.lu.se/student-papers/record/9127007 — tese de Lund: NB/logística/RF; **under de cantos na PL subvalorizado**; lucro **não transfere** p/ Bundesliga.
- [web] https://eprints.lse.ac.uk/103712/1/Predict_total_goals_LSE.pdf — cadeia posse→chutes→gols, chutes>posse; ~0,8%/aposta em 12 anos com chutes+cantos (threshold-sensível) [`snippet`].
- [web] https://www.oddalerts.com/corner-predictions — mercado de cantos visto como nicho de valor (fonte comercial; tratar como sinal de mercado, não prova).
- [doc] docs/regras/mercado-odds.md — princípio CLV/anti-dupla-contagem que governa este sinal.
