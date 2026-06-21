# Estado da arte: IA/ML/LLM para predição de futebol (papers, modelos, LLMs, GitHub, comerciais)

> Investigação `/rs` da feature [[MOD-001]] (Motor de prognóstico quantitativo). Survey amplo do que existe — academia, modelos estatísticos, deep learning, LLMs, projetos open-source, datasets e players comerciais — para decidir a abordagem do motor que **estima probabilidade** no mrtip.
>
> - **Tipo:** tema amplo. **Método:** workflow multi-agente (17 agentes, ~786k tokens, 283 tool calls) — 8 frentes de descoberta em paralelo, cada uma verificando seus top leads por fetch, + counter-review adversarial.
> - **as-of:** 2026-06-18 (toda URL veio de tool result desta sessão; rótulo de confiança por claim).
> - **Não implementa nada.** Decisão de tooling = protótipo comparativo, não fechada aqui.

---

## TL;DR + recomendação cravada

O **estado da arte de predição de futebol é um platô**: papers independentes convergem num teto de **RPS ~0,205–0,21** para 1X2 em dados de gols, com acurácia ~51–53% (vs ~54% dos bookmakers) — e **a família de modelo quase não move o ponteiro no topo** (Dixon-Coles afinado ≈ GBT+ratings ≈ deep learning). O que decide é **feature + calibração**, não arquitetura exótica. Recomendação para o motor ESTIMAR do mrtip, já filtrada pelo counter-review:

1. **Separar ESTIMAR (quant) de EXPLICAR (LLM) é a decisão mais bem sustentada da investigação** — evidência empírica direta: num experimento real, **8 LLMs apostaram uma temporada inteira da Premier League e TODOS perderam dinheiro** (melhor: Claude Opus −11%) [`verificado-fetch`]; benchmarks de calibração mostram LLMs sistematicamente *overconfident*. LLM **nunca** emite probabilidade/stake; só lê contexto e redige.
2. **MVP = Premier League primeiro; Brasileirão é fase 2** — o counter-review provou que a cobertura de dados do Brasileirão (xG e odds de fechamento) é um **buraco estrutural**, não "um ponto a validar". Isso casa com a `visao-geral §7` (PL recomendada).
3. **Baseline honesto = Dixon-Coles com time-decay + odds de-margined como feature**, via a lib **penaltyblog** (MIT, mantida, traz Dixon-Coles/Poisson + RPS + remoção de margem) — produz **1X2 e over/under 2.5 do mesmo grid de placar**. GBT (CatBoost/XGBoost) entra como **desafiante depois**, quando o feature set estiver rico — não como promessa de MVP.
4. **Calibração é o produto:** calibrar com **isotonic regression** e avaliar com **RPS** (ordinal, 1X2) + **Brier/ECE + reliability diagram**; gate de "não dar tip quando o modelo está descalibrado para a liga" (padrão que a Sportmonks já comercializa).
5. **Rebaixar "bater a closing line" de barra de sucesso do MVP para experimento de validação (CLV).** O mercado Tier-1 é eficiente e — pior — na fonte de dados indicada a Pinnacle aparece marcada como sistematicamente desatualizada, então a closing line pode nem ser confiável no MVP.
6. **O risco nº 1 é o DADO, não o modelo.** Scrapers frágeis, licença restritiva do football-data.co.uk e assimetria PL×Brasileirão dominam o risco.

---

## Contexto e problema

O mrtip é um copiloto de IA para futebol que separa explicitamente **estimar probabilidade (quant)** de **explicar (LLM)** (`docs/visao-geral.md:106`, §6). O motor de prognóstico ([[MOD-001]]) consome o dossiê por partida ([[DOS-001]]) e produz probabilidades calibradas que alimentam picks e value bets. Esta investigação responde: **que abordagem de modelo o mrtip deve construir, e o que dá pra reusar?**

**Brief (requisitos implícitos do repo, não negociáveis):** mercados **1X2 + over/under 2.5** (`visao-geral §7`); ligas **Premier League (MVP) + Brasileirão (fase 2)**; **calibração importa mais que acurácia crua**; transparência ("sempre mostra o porquê", §5); regulação **Lei 14.790/2023** (+18, jogo responsável, nada de promessa de ganho).

**Perguntas do brief e onde foram respondidas:** (1) famílias de modelo + teto real → *Estado da arte* + *Matriz*; (2) repos GitHub reusáveis → *Inventário open-source*; (3) LLMs em predição e onde falham → *LLMs*; (4) features/dados → *Datasets* + *Modelo de dados*; (5) o que casa com a tese mrtip → *Recomendação* + *Riscos*.

---

## Estado real no código (arqueologia interna)

**mrtip é greenfield para predição — não existe motor, modelo, ingestão de dados nem schema ainda.** Achados:

- **Registro de features estava vazio** (`docs/features/INDEX.md` — "0 feature(s)" antes desta sessão). Esta investigação criou `docs/features/modelos/MOD-001-motor-prognostico-quant.md`.
- **Nenhum código de modelo/ingestão/odds** no repo — a base é o scaffold Turborepo+Next.js (`apps/web`, `packages/ui`). A pipeline da `visao-geral §6` (ingestão → dossiê → raciocínio IA → saída → calibração) é **toda fantasma** (documentada, não implementada).
- **Decisão de produto já cravada (não re-decidir):** separação ESTIMAR/EXPLICAR (`docs/visao-geral.md:106`); LLM "ótimo para ler contexto e redigir; ruim para calibrar probabilidade sozinho". **A investigação externa CONFIRMA fortemente essa decisão** (ver LLMs).
- **Dependência de feature:** MOD-001 `depende_de` [[DOS-001]] — o dossiê é o insumo. A matriz de dimensões do dossiê (`visao-geral §6`: forma/xG, H2H, lesões, social, mercado) é exatamente o feature set que os modelos campeões usam.
- **Research correlato já no repo:** `docs/research/apis-futebol.md`, `sites-futebol-masculino-completo.md` (catálogos de fontes de placar/stats/odds) e `fontes-rivalidade.md`. Esta investigação **não** re-cataloga feeds genéricos; foca em **modelos e pipelines de predição**. Há overlap de fontes a reconciliar depois (football-data.co.uk, StatsBomb, openfootball aparecem nos dois).

---

## Estado da arte (academia) — o platô de ~0,21 RPS

Claims atômicos, com URL e rótulo de confiança. A convergência entre fontes independentes é o achado central.

- **O melhor modelo em dados de gols é GBT+ratings — mas a margem é minúscula.** Survey de Bunker/Yeung/Fujii: *gradient-boosted trees (CatBoost) sobre pi-ratings são os melhores em datasets só-de-gols* [`verificado-fetch`, https://arxiv.org/abs/2403.07669, 2026-06-18].
- **Teto realista de RPS ~0,205–0,21, e os top models são "muito similares".** Review experimental de 40 anos (Hubacek et al., ~91k partidas) confirma o platô: "as performances são muito similares entre os top models" [`verificado-fetch` existência/platô; número Berrar RPS ~0,2101 é `snippet`, https://academic.oup.com/imaman/article/33/1/1/6342916].
- **Números concretos:** CatBoost+pi-ratings **RPS 0,2085**, deep learning (Inception+Transformer+MLP) 0,2098, XGBoost+Berrar 0,2141 — GBT bate DL por **0,0013** em dados só-de-gols [`verificado-fetch`, https://arxiv.org/html/2309.14807]. ⚠️ **Correção da verificação (carrega decisão):** esse 0,2085 é o melhor na *validação interna* do paper, **não** o vencedor do desafio oficial — no leaderboard do 2023 Soccer Prediction Challenge **venceu um modelo de consenso de bookmakers (RPS 0,2063)**, e o modelo DL submetido pelos autores fez 0,2195. **Um baseline de mercado bateu todos os modelos acadêmicos.** (ver Refutado).
- **Transferência cross-league existe.** Dolores (Bayesian + pi-ratings dinâmicas) treina em 52 ligas e prediz qualquer uma; 2º lugar no desafio 2017, RPS 0,2083 [`verificado-fetch` existência+ROI, https://link.springer.com/article/10.1007/s10994-018-5703-7].
- **Modelos generativos de gols (a base do mrtip):** Dixon-Coles (1997) — Poisson + correção de placar baixo (ρ) + time-decay, gera 1X2 **e** over/under do grid de placar [`snippet`, https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/1467-9876.00065]; Karlis-Ntzoufras (2003) — bivariate Poisson com termo de covariância λ₃ para corrigir empates [`snippet`, https://rss.onlinelibrary.wiley.com/doi/abs/10.1111/1467-9884.00366]. Fórmulas (τ/ρ/time-decay) verificadas em [`verificado-fetch`, https://dashee87.github.io/football/python/predicting-football-results-with-statistical-modelling-dixon-coles-and-time-weighting/].
- **Métrica:** RPS é o padrão de fato, mas há caso contra ele — o **Ignorance/log-loss** é estritamente próprio e local [`verificado-fetch`, https://ideas.repec.org/p/ehl/lserod/111494.html]. Recomendação: avaliar com RPS (ordinal) **e** log-loss.
- **Realidade do "bater as odds":** modelo xG+isotonic na Bundesliga (11 temporadas) dá ~10% ROI (médias) / ~15% (melhor preço), **mas concentrado em mandante e com as odds do bookmaker MELHOR calibradas que o modelo** [`snippet` (SAGE/SSRN 403), https://journals.sagepub.com/doi/10.1177/22150218261416681].

**Deep learning / redes neurais — forte fora do escopo do MVP:**
- **Em dados tabulares pré-jogo, árvores ≥ deep nets.** "Deep Learning is Not All You Need": XGBoost supera modelos tabulares profundos e precisa de muito menos tuning [`verificado-fetch`, https://arxiv.org/abs/2106.03253]; benchmark de 111 datasets: CatBoost vence em 19, primeiro DL só em 5º [`verificado-fetch`, https://arxiv.org/html/2408.14817v1].
- **Mas o "árvores sempre vencem" é datado (2024):** foundation models tabulares (TabPFNv2, TabICL) batem GBDTs justamente no **regime de poucos dados** (<5k linhas, 31×3) — exatamente onde uma liga vive (PL ~380 jogos/temporada) [`verificado-fetch`, https://arxiv.org/html/2402.03970v3]. → candidato a bake-off, não assunção.
- **GNNs (passing networks) e transformers entregam ganho só com dados de evento/tracking** (posições, cada game-state) que o MVP do mrtip não ingere; reportam acurácia/AUC, não calibração [GNN sport-agnóstico `verificado-fetch`, https://ar5iv.labs.arxiv.org/html/2207.14124; complex networks `verificado-fetch`, https://arxiv.org/html/2409.13098v1]. **Fora do MVP.**
- 🚩 **Red flag de leakage:** qualquer paper reportando 90%+ de acurácia em 1X2 quase certamente tem vazamento ou alvo binarizado — avaliar sempre em split temporal, RPS vs closing line.

---

## LLMs em predição esportiva — confirmam a tese ESTIMAR/EXPLICAR

Sinal convergente de 4+ papers independentes: **LLMs são sistematicamente overconfident e mal calibrados, e calibração é um eixo separado da acurácia** (modelo mais acurado pode ser pior calibrado).

- **KalshiBench:** 300 questões de prediction market que resolvem **depois do cutoff** (anti-memorização). Universalmente overconfident; só Claude Opus 4.5 bate a base rate (BSS 0,057); GPT-5.2-XHigh tem acurácia 65% mas **ECE 0,395 — pior que a base rate** [`verificado-fetch`, https://arxiv.org/html/2512.16030].
- **LLMs vs superforecasters:** frontier models batem a multidão humana mas ficam **bem atrás de experts** (~0,017 Brier); flip prompt-dependente entre over e underconfidence [`verificado-fetch`, https://arxiv.org/html/2507.04562v3].
- **Ensemble de 12 LLMs** iguala a acurácia da multidão **mas continua mal calibrado/overconfident** — ensembling não resolve calibração [`verificado-fetch`, venue **Science Advances** (não PNAS Nexus — ver Refutado), https://pmc.ncbi.nlm.nih.gov/articles/PMC11800985/].
- **O paper "LLM prediz futebol" mede só acurácia argmax**, nunca calibração nem odds — ou seja, o único paper direto não toca nas métricas que o mrtip precisa [`verificado-fetch` via OSF API, https://osf.io/preprints/socarxiv/e5wpy_v1].
- **Failure modes documentados:** (a) miscalibração; (b) fabricação de números, que piora com contexto longo e **mesmo quando há tool disponível** (Grid-Mind: LLM inventou 127 MW em vez de chamar a tool que dava 3,9 MW — erro 33×) [`snippet`, https://arxiv.org/pdf/2602.20683]; (c) leakage de cutoff (todo benchmark sério filtra pós-cutoff).
- **Padrões de arquitetura corretos:** TSAG/TimeCopilot — LLM **orquestra/explica**, modelos quant **estimam**; guardrail de "função quant verificada" previne o tool-bypass [`snippet`, https://arxiv.org/html/2604.19633; https://arxiv.org/pdf/2509.00616].
- **Se um dia quiser uma probabilidade do LLM como FEATURE** (não como estimativa): usar o **logprob do token numérico** [`verificado-fetch`, https://arxiv.org/html/2501.04880v1] e o **invert-softmax** antes de escalar [`verificado-fetch`, https://arxiv.org/html/2410.06707v1].
- **Contexto textual tem sinal real** (artigos de jornalistas dão +6,9% acurácia) — mas como **feature para o quant**, não como estimador [`snippet`, https://arxiv.org/pdf/2012.04380]. Isso é exatamente o papel do EXPLICAR alimentando o ESTIMAR.

> **Lacuna (negativa, válida):** nenhum estudo peer-reviewed demonstra LLM (sozinho ou agente) **batendo a closing line**; e nenhuma fonte pt-BR acadêmica aplica LLM ao Brasileirão com métrica de calibração.

---

## Matriz de famílias de modelo (síntese entre fontes)

| Família | 1X2 | O/U 2.5 | Calibração | Dados/feature exigidos | RPS/nota | Veredito p/ mrtip |
|---|---|---|---|---|---|---|
| **Poisson independente** | ✓ | ✓ (mesmo grid) | fraca em empates | só gols | piso | Floor a bater; trivial |
| **Dixon-Coles (+time-decay)** | ✓ | ✓ | **boa** (corrige placar baixo) | só gols (+ xG opcional) | ref ~0,19–0,21 | **Baseline recomendado (MVP)** |
| **Bivariate Poisson (λ₃)** | ✓ | ✓ | boa (empates via covariância) | só gols | ≈ D-C | Alternativa ao D-C |
| **Elo / Club Elo / SPI** | ✓ (W/D/L) | ✗ (sem placar) | prior de força | resultados | — | **Feature**, não motor; precisa camada de gols p/ O/U |
| **GBT (CatBoost/XGBoost)+ratings** | ✓ | indireto | boa c/ recalibração | **40–100 features ricas** | **0,2085** (SOTA validação) | Desafiante **fase 2**, depende de feature set rico |
| **Deep learning (LSTM/GNN/transformer)** | ✓ | ✓ | nets são overconfident | **evento/tracking** | ≈ GBT, mais estável | **Fora do MVP** (precisa dado que não temos) |
| **Foundation tabular (TabPFNv2/TabICL)** | ✓ | ✓ | a verificar | tabular pequeno | rank 2–3 (geral) | Bake-off futuro vs GBT |
| **LLM-as-estimator** | ✓ | ✓ | **ruim/overconfident** | texto | perde p/ mercado | **PROIBIDO estimar** (só EXPLICAR) |
| **Closing line de-vigged (mercado)** | ✓ | ✓ | **a melhor** (~1–2pp) | odds | venceu o desafio 2023 | **Benchmark**, não algo a "vencer" no MVP |

**Leitura:** entre o topo das famílias a diferença de RPS é da ordem de 0,001–0,002 — **investir em features (xG, pi-/Berrar ratings, descanso, mercado de-margined) e calibração rende mais que trocar de arquitetura.** O caminho mrtip: **Dixon-Coles afinado → grid de placar → 1X2 + O/U 2.5 → isotonic → comparar contra odds de-vigged (Shin/power) → filtro de EV → Kelly fracionário (≤¼)**.

---

## Inventário open-source (GitHub) — verificado por fetch

Maturidade confirmada na página do repo em 2026-06-18 (`verificado-fetch` salvo nota).

### Motor / modelos (ESTIMAR)
| Repo | ★ | Licença | Estado | Papel p/ mrtip |
|---|---|---|---|---|
| **penaltyblog** (martineastwood) | 180 | MIT | v1.11.0 (2026-06-02), ativo | **Peça central** — Dixon-Coles/Poisson/Bivariate + RPS + remoção de margem; 1X2 **e** O/U |
| **sports-betting** (georgedouzas) | 719 | MIT | commit 2025-12-07, ativo | Harness de **value-bet/backtest** (prob>implícita); operacionaliza CLV |
| **goalmodel** (opisthokonta) | 115 | (R) | — | Oráculo de spec (R); Poisson family + D-C + Rue-Salvesen, dá O/U e BTTS direto |
| **socceraction/VAEP** (ML-KULeuven) | 783 | MIT | v1.5.3 (2024-08), **NÃO ativo** | ⚠️ só fonte de **feature** (xT/VAEP); README diz "not actively developed" |
| **SoccerPredictor** (Szita) | 44 | MIT | solo | Blueprint do fluxo scrape→features→ensemble→W/D/L+gols |

### Dados / odds (alimenta o ESTIMAR)
| Repo | ★ | Licença | Cobertura | Nota |
|---|---|---|---|---|
| **soccerdata** (probberechts) | 1.8k | Apache-2.0 | EPL+Brasileirão (FBref/Sofascore) | Melhor feeder Python; ⚠️ **scraper frágil** (anti-bot, ToS) |
| **OddsHarvester** (jordantete) | 190 | MIT | 1x2 **e** O/U, PL | v0.3.0 (2026-05-20); odds via OddsPortal p/ benchmark closing |
| **xgabora/Club-Football-Match-Data-2000-2025** | 180 | MIT | 42 ligas, odds+Club Elo | Melhor fuel de backtest empacotado; ⚠️ confirmar se Brasil está nas 42 |
| **ScraperFC** (oseymour) | 389 | **GPL-3.0** | FBref/Sofascore | ⚠️ copyleft — evitar no core fechado |
| **openfootball/south-america** | 89 | CC0 | Brasileirão (resultados) | Fonte limpa p/ a metade BR; sem odds/xG |
| **kloppy** (PySport) | 524 | BSD-3 | evento/tracking | Overkill p/ MVP; revisitar se entrar evento |
| **fivethirtyeight/data soccer-spi** | — | CC | **morto** (último commit 2022-12-19) | Só baseline histórico (ver Refutado) |

---

## Datasets & competições (fuel de treino/backtest)

- **football-data.co.uk** — resultados+odds CSV; **EPL rico (inclui odds de fechamento + O/U 2.5)**, Brasil é "Extra League" (mais fino); atualizado 2×/semana; ⚠️ **sem licença aberta** ("league match prediction only") [`verificado-fetch`, https://www.football-data.co.uk/data.php; Brasil: https://www.football-data.co.uk/brazil.php "Last updated 02/06/26"].
- **Kaggle Brazilian Soccer Odds** (felipebandeiraramos) — odds de todo Brasileirão 2012-2024, **inclui O/U** [`snippet`, https://www.kaggle.com/datasets/felipebandeiraramos/brazilian-soccer-odds-data].
- **StatsBomb Open Data** — 3.303★, atribuição; **EPL só 2003/04 e 2015/16, ZERO Brasileirão** (confirmado no competitions.json) [`verificado-fetch` via GitHub API, https://github.com/statsbomb/open-data]. → laboratório de xG histórico, não backbone.
- **Understat (scrapes)** — top-5 europeu só; **sem Brasileirão** [`verificado-fetch`, https://github.com/douglasbc/scraping-understat-dataset].
- **FBref via worldfootballR/soccerdata** — **único caminho livre de xG para o Brasileirão** [`snippet`, https://github.com/JaseZiv/worldfootballR].
- **Kaggle adaoduque "Campeonato Brasileiro"** — ~9k jogos 2003-2025, resultados+stats (sem odds/xG) [`snippet`, https://www.kaggle.com/datasets/adaoduque/campeonato-brasileiro-de-futebol].
- **Kaggle "Football Match Probability Prediction"** — competição de 1X2 por **log-loss** (calibração), >150k jogos; melhor template público de benchmark calibration-first [`snippet`, https://www.kaggle.com/competitions/football-match-probability-prediction].

> **Mapa de cobertura (o ponto que decide o roadmap):** odds+xG são **ricos para PL, escassos/assimétricos para Brasileirão**. xG do Brasileirão só via FBref; closing odds do Brasil são mais finas. → treinar **um único modelo "calibrado" para as duas ligas com feature sets desiguais é risco de calibração** (counter-review).

---

## Players comerciais — landscape competitivo

- **Opta Supercomputer** (Stats Perform): blenda **odds de mercado** + Power Rankings + Monte-Carlo; **não** faz O/U 2.5 como headline. **Sinal-chave:** até o gold-standard *usa* as odds do bookmaker como input em vez de batê-las do zero [`verificado-fetch`, https://theanalyst.com/articles/opta-football-predictions].
- **Sportmonks Predictions API**: vende **calibração-como-feature** — publica **log-loss por liga + Hit Ratio + League Predictability Index** e suprime tip quando o modelo é não-confiável; €29–249/mo [`verificado-fetch`, https://www.sportmonks.com/football-api/football-predictions-api/]. → **copiar o padrão "predictable=false"** (gate de "sem aposta").
- **Infogol** (Timeform): app consumer xG-cêntrico que **lista Brazil Serie A + PL** — exatamente as duas ligas do MVP [`snippet`, https://www.infogol.net/en].
- **Forebet**: free, Poisson+Monte-Carlo, 850+ ligas — o **piso comoditizado** que o mrtip precisa bater em calibração [`snippet`, https://www.forebet.com/].
- **Cluster pt-BR de tipsters IA** (NerdyTips, InBet, Palpite.IA, GoalAI, DeepBetting, Aposta Inteligente): mercado lotado, **todos opacos "confie na IA", sem calibração publicada nem separação ESTIMAR/EXPLICAR** [`snippet`, https://nerdytips.com/]. → **a cunha defensável do mrtip no BR.**
- **Experimento 8-LLMs na PL**: deram £100k a cada um pra apostar a temporada 2023-24 inteira; **todos perderam, 2 quebraram, melhor −11%** [`verificado-fetch`, https://exame.com/inteligencia-artificial/...]. → validação externa mais forte da arquitetura quant/LLM.

**Paridade × diferencial:** gerar 1X2 + O/U 2.5 é **paridade comoditizada** (Forebet/cluster BR já fazem). Diferencial defensável do mrtip: **(1) calibração transparente benchmarkada à closing line, (2) EXPLICAR via LLM que não toca nos números, (3) dizer "sem aposta" quando descalibrado, (4) O/U 2.5 como mercado calibrado de primeira classe** (subatendido — Opta não faz, StatsBomb vende dado, BR é opaco).

---

## Modelo de dados proposto (esboço — faceta `dados`)

Greenfield; proposta conceitual (a detalhar no `/pl`):

- `matches` — partida (liga, temporada, mandante/visitante, data no fuso `America/Sao_Paulo`, placar FT/HT). Âncora de [[DOS-001]].
- `team_ratings` — snapshots de Elo/pi-ratings/força por time/data (feature de força).
- `match_features` — xG, forma (rolling), descanso/congestão, mando — o feature set do modelo.
- `odds_snapshots` — odds por casa **e por timestamp** (incl. **closing**), com `overround` e fair-odds de-vigged (Shin/power). Dinheiro/odds **nunca** float ingênuo.
- `model_predictions` — probabilidade calibrada por mercado (1X2, O/U 2.5), versão do modelo, **antes do jogo** (imutável p/ histórico auditável — `visao-geral §13`).
- `backtest_clv` — CLV/Brier/RPS/ECE por janela; gate de "predictable".

---

## Plano por faceta (sem implementar — input pro `/pl`)

- **`dados`** — ingerir football-data.co.uk (EPL: odds+closing+O/U) + FBref xG via soccerdata; Club Elo/pi-ratings como feature; snapshots de odds com de-vig. **Brasileirão = fase 2** (FBref xG + openfootball/south-america + Kaggle odds BR). Tratar scraper como **superfície de manutenção**, não "foundation barata".
- **`ia` (ESTIMAR)** — penaltyblog Dixon-Coles time-weighted como baseline → grid de placar → 1X2 + O/U 2.5; **isotonic calibration**; avaliar **RPS + Brier + ECE + reliability**; GBT+ratings como desafiante quando o feature set amadurecer; **TabPFNv2 vs CatBoost** como bake-off futuro. LLM **nunca** estima.
- **`ia` (EXPLICAR)** — LLM só lê contexto e narra o output do quant; **retrieval-grounded + fact-check** em toda stat citada (fabricação cresce com contexto). Guardrail tipo TSAG: LLM chama a função quant, não inventa o número.
- **`api`** — servir predição + metadados de calibração + EV vs odds de-vigged; expor o "porquê".
- **`ui`** — mostrar probabilidade + porquê + histórico/calibração; **estado "sem aposta"** quando descalibrado; avisos de jogo responsável/+18 (Lei 14.790).

---

## Riscos e gotchas

1. **DADO é o risco nº 1, não o modelo.** Assimetria PL×Brasileirão (xG + closing odds) ameaça a calibração de um modelo único [counter, `severity: high`].
2. **Scrapers frágeis = custo contínuo.** soccerdata vive quebrando contra anti-bot/Cloudflare (já removeu FotMob, reescreveu Understat); socceraction está sem desenvolvimento ativo [counter, https://github.com/probberechts/soccerdata/releases, `severity: high`].
3. **Licença do football-data.co.uk** ("league match prediction only") é restrição **comercial/legal** num produto pago — validar enquadramento.
4. **Closing line pode ser inverificável no MVP:** Pinnacle aparece marcada como sistematicamente desatualizada na própria fonte indicada → CLV vira experimento, não barra de sucesso [counter, https://www.football-data.co.uk/all_new_data.php, `severity: high`].
5. **Edge é fino e sazonal:** ~10–15% ROI só num cenário limpo, concentrado em mandante, e o **mercado é melhor calibrado que o modelo** (Wilkens 2026) [counter, `severity: medium`].
6. **"Dixon-Coles e/ou GBM" esconde um trade-off:** o ganho do GBM depende de feature set rico que o Brasileirão não tem → no BR o GBM vira "wrapper das odds". Comprometer-se com o baseline D-C+odds antes de prometer GBM [counter, `severity: medium`].
7. **Hallucination no EXPLICAR** — fabricação de stats; exige grounding estrito.
8. **Leakage/overfitting** — 90%+ acurácia é red flag; avaliar em split temporal vs closing line.

---

## Refutado (evidência que matou o claim)

- **"CatBoost+pi-ratings venceu o 2023 Soccer Prediction Challenge"** → **parcialmente refutado**: 0,2085 é melhor só na *validação interna*; no leaderboard oficial venceu um **modelo de consenso de bookmakers (0,2063)**, e o DL submetido fez 0,2195 [`verificado-fetch`, https://arxiv.org/html/2309.14807].
- **"r²=0,997 entre closing line e resultado (397.935 jogos)" atribuído ao pinnacleoddsdropper** → **refutado para essa URL** (o número não está lá; traça pra um blog Pyckio que não foi fetchável — `NEI`). A página *suporta* outros claims de CLV (3,94% de encurtamento em 756/952 bets) [`verificado-fetch`, https://www.pinnacleoddsdropper.com/blog/closing-line-value--clv-demystified-by-expert-joseph-buchdahl].
- **"Silicon Crowd publicado na PNAS Nexus"** → é **Science Advances** (2024) [`verificado-fetch`, https://pmc.ncbi.nlm.nih.gov/articles/PMC11800985/].
- **"Modelo próprio de xG bate a calibração do mercado"** (tese implícita) → **refutado**: Wilkens 2026 acha o mercado **melhor calibrado** que o modelo [`snippet`, https://journals.sagepub.com/doi/10.1177/22150218261416681].
- **FiveThirtyEight SPI como fonte viva** → **morto**: URL faz 301 pra abcnews.com/politics; último commit de dados 2022-12-19 [`verificado-fetch`, https://github.com/fivethirtyeight/data/tree/master/soccer-spi]. Só baseline histórico.
- **"Dolores não reporta ROI"** → reporta: PL ~20%/7 temporadas, agregado ~break-even [`verificado-fetch`, https://link.springer.com/article/10.1007/s10994-018-5703-7].

---

## Perguntas Abertas / lacunas

- **Profundidade das closing odds do Brasileirão** no `BRA.csv` do football-data — baixar e confirmar colunas (B365C/PSCH?).
- **xgabora 42-ligas inclui Brasil?** README destacou ligas europeias — não confirmado.
- **Cobertura Brasileirão por tier da Sportmonks** — página não enumerou quais ligas entram em cada plano.
- **Club Elo cobre Brasileirão?** Host deu ECONNREFUSED; snippet sugere **só UEFA/Europa** (inferência-negativa, não verificada por fetch).
- **Nenhuma fonte comercial provou publicamente um ROI batendo a closing line** (achado negativo, real).
- **Bake-off TabPFNv2 vs CatBoost** para o regime de poucos dados por liga — não testado, vale antes de assumir supremacia do GBDT.
- **Sem fonte pt-BR acadêmica** aplicando LLM ao Brasileirão com calibração — gap de literatura.
- Reconciliar overlap de fontes com `docs/research/apis-futebol.md` e catálogos de sites (football-data, StatsBomb, openfootball aparecem nos dois).

---

## Evidências decisivas

- [survey] https://arxiv.org/abs/2403.07669 — prova que GBT+pi-ratings é SOTA em dados de gols (define o design space do ESTIMAR).
- [paper] https://arxiv.org/html/2309.14807 — RPS concretos (0,2085) **e** que um modelo de bookmakers venceu o desafio (a closing line é a barra real).
- [bench] https://academic.oup.com/imaman/article/33/1/1/6342916 — platô: top models "muito similares" → investir em feature/calibração, não arquitetura.
- [paper] https://arxiv.org/html/2512.16030 — LLMs sistematicamente overconfident/mal calibrados (sustenta ESTIMAR≠EXPLICAR).
- [comercial] https://exame.com/inteligencia-artificial/... — 8 LLMs apostaram a PL e todos perderam (validação externa da arquitetura).
- [paper] https://journals.sagepub.com/doi/10.1177/22150218261416681 — mercado melhor calibrado que o modelo; ROI ~10-15% concentrado em mandante (rebaixa CLV a experimento).
- [lib] https://github.com/martineastwood/penaltyblog — MIT, mantida, Dixon-Coles+RPS+remoção de margem (peça central do ESTIMAR).
- [comercial] https://www.sportmonks.com/football-api/football-predictions-api/ — calibração-como-feature + gate "predictable" (padrão a copiar).
