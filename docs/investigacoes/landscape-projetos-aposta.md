# LANDSCAPE — Projetos, papers e produtos de aposta esportiva

_Consolidação de uma varredura por categoria, lida com a lente do **mrtip**: motor quant-first (Poisson/Dixon-Coles calcula probabilidade calibrada — empate/over/BTTS/placar/dupla-chance) + LLM (DeepSeek) que só **explica e escolhe direção, nunca inventa número**. Foco Premier League, SportMonks como fonte única, sem odds ingeridas ainda. Tese: todo pick mostra o porquê + evidência._

---

## TL;DR (o que a varredura prova)

1. **LLM decidindo sozinho perde dinheiro** — em amostra de temporada inteira e multi-seed (KellyBench, PolyBench), os LLMs de fronteira ficam no vermelho e são **mal calibrados** (confiança fixa em 0,8–0,9 independente do domínio). Isso valida diretamente a regra do mrtip de não deixar o LLM gerar o número.
2. **ML complexo ganha pouco de Poisson/Dixon-Coles** — o ganho de redes neurais/GBM sobre a família Poisson é marginal (<1% de RPS em vários estudos sérios). A escolha quant-first do mrtip está alinhada ao estado da arte.
3. **O que importa é calibração e peso temporal, não a distribuição** — selecionar modelo por calibração em vez de acurácia vira -35% em +34% de ROI (arXiv 2303.06021); e otimizar o decay temporal move o RPS mais que trocar Poisson→Dixon-Coles→Bivariate (penaltyblog).
4. **Todo produto sério híbrido convergiu para a arquitetura do mrtip** — "motor estatístico calcula, LLM explica" (Gecko Edge é o caso mais maduro; QuantIntelli o open-source mais próximo; Man Group valida em finanças). É convenção emergente, não conservadorismo.
5. **O nicho exato do mrtip está vago** — o open-source quant mais maduro (sports-betting, 730★) não tem LLM; o LLM-de-apostas com mais estrelas mal chega a 11. Ninguém combina motor calibrado + LLM explicador + transparência em escala.
6. **Lacunas do mrtip que o mercado já resolve**: não ingere odds (→ sem EV/CLV), não reporta RPS/Brier do próprio motor, não dimensiona stake (Kelly).

---

## Categoria 1 — Agentes/LLM que apostam sozinhos (benchmarks e produtos)

| Projeto | O que faz | Maturidade |
|---|---|---|
| **KellyBench** ([arXiv 2604.27865](https://arxiv.org/abs/2604.27865) · [openreward.ai](https://openreward.ai/GeneralReasoning/KellyBench)) | Simula PL 2023-24; 8 LLMs de fronteira recebem odds+stats+escalação, montam modelo próprio, gerenciam £100k e apostam com/sem Kelly. Avaliação = bankroll final + rubrica de 52 pontos. | **Pesquisa publicada** (General Reasoning, abr/2026), API aberta, citada por várias matérias. |
| **PolyBench** ([arXiv 2604.14199](https://arxiv.org/html/2604.14199v1)) | 7 LLMs preveem+tradam em 38.666 mercados binários do Polymarket; mede Confidence-Weighted Return e acurácia direcional por domínio. | Paper recente (2026), ativo. |
| **LLM Sports Betting Benchmark** ([GitHub](https://github.com/meo0138-dev/llm_sports_betting_benchmark)) | Leaderboard automatizado (GitHub Actions): LLMs com €1.000 apostam semanalmente em 1X2/DC/O-U/BTTS em PL/La Liga/Serie A; bankroll, ROI, drawdown, calibração; análise bootstrap em R. | 0★, 486 commits — projeto pessoal, dev contínuo. |
| **asknews_mlb** ([GitHub](https://github.com/smarmau/asknews_mlb)) | Compara GPT-4o/Claude/Llama com o mesmo contexto (notícias AskNews + odds scraped) apostando $100/jogo em MLB. | 9★, experimento de 2 semanas (ago/2024), abandonado. |
| **FootballBettingAgent** ([GitHub](https://github.com/Haemon-Yang/FootballBettingAgent)) | Agente conversacional (LangGraph+LangChain+OpenAI) + RAG Tavily; recomendação sai **inteiramente** do LLM, sem modelo estatístico. | 11★, amador, sem métricas. |
| **predikt** ([GitHub](https://github.com/vahagn-madatyan/predikt)) | Agente autônomo p/ Polymarket, "superforecaster" 2 estágios (GPT-4o mini) + RAG (ChromaDB/NewsAPI/Tavily); decide E executa on-chain, paper-trading + salvaguardas de orçamento. | Ativo, v0.1.2 (mar/2026), 158 commits, MIT. |
| **BillyBets / SportsTensor** ([docs](https://docs.billybets.ai/autonomous-betting/betting-engine)) | Personalidade "Billy" (Eliza) orquestra vários LLMs p/ comunicação; a **predição** vem de subnet incentivada (SportsTensor, Bittensor Subnet 41). Aposta on-chain via Polymarket. | Produto comercial vivo com token (fev/2026). |
| **QuantIntelli+** ([GitHub](https://github.com/IanDublew/QuantIntelli)) | Dual-engine: XGBoost gera baseline de odds; RAG (Tavily/Google/DDG) busca lesão/forma/H2H; Gemini faz análise final. Ver categoria "Híbridos". | 11★, 16 commits, educacional. |
| **LLM-Football** ([GitHub](https://github.com/aditya-018/LLM-Football)) | POC de analytics (não betting): StatsBomb→xG XGBoost→K-Means tático→LLM (Ollama/llama3) gera "relatório de treinador". | 0★, 3 commits, abandonado. |

**Achado-chave:** todos os 8 modelos de fronteira do KellyBench ficaram no **vermelho em média** (melhor caso -8% a -11%); Grok quebrou numa rodada. No asknews_mlb, **no mesmo dado e período** GPT lucrou +$1.354 e Claude perdeu -$592 — variância enorme, amostra curta não confiável. **Vale estudar:** KellyBench e o LLM Sports Betting Benchmark como blueprint de avaliação out-of-sample multi-seed do próprio mrtip.

---

## Categoria 2 — ML/estatística pura de futebol (open-source)

| Projeto | O que faz | Maturidade |
|---|---|---|
| **penaltyblog** ([GitHub](https://github.com/martineastwood/penaltyblog)) | **A referência.** Python/Cython: Poisson, Bivariate Poisson, Dixon-Coles, Bayesian hierárquico (MCMC) + Elo/Massey/Colley/Pi; mercados (handicap asiático, O-U, 1X2), remove overround; pipeline de dados (StatsBomb/Opta/Understat/ClubElo/FPL). | **189★**, MIT, v1.11.0 (jun/2026), "production-ready". |
| **footBayes** ([GitHub](https://github.com/LeoEgidi/footBayes)) | R/Stan: double/bivariate Poisson, Skellam, Student-t, diagonal-inflated, zero-inflated Skellam; MLE ou Bayesiano (HMC/ADVI/Laplace). Implementação de referência de paper acadêmico. | CRAN (v2.1.0+), ativo, acadêmico. |
| **BayesWDFM** (paper [arXiv 2508.05891](https://arxiv.org/html/2508.05891v1) · [código](https://github.com/RoMaD-96/BayesWDFM)) | Estende footBayes com precisões de evolução variáveis no tempo por habilidade/time via spike-and-slab. **Publica RPS 2024/25 por liga.** | Paper 2025/26, código aberto. |
| **goalmodel** ([GitHub](https://github.com/opisthokonta/goalmodel)) | R: Poisson, Neg. Binomial, Conway-Maxwell-Poisson, Gaussiana + variante Dixon-Coles. Alternativas de distribuição p/ over/underdispersion. | 115★, estável desde mar/2024. |
| **MatchOracle** ([GitHub](https://github.com/abailey81/MatchOracle)) | Ensemble 5 camadas p/ PL: camada 0 = Dixon-Coles puro; camada 1 = 13 modelos ML (XGB/LGBM/CatBoost/RF/MLP, 376+ features); camada 2 = meta-learners com calibração isotônica; 8 fontes (inclui clima e sentimento de notícias via NLP). | Hobby (5★), mas **backtest walk-forward** reportado: 60,2% acc vs 55,6% do mercado em 20 temporadas, +11,2% RPS. |
| **Club Elo** ([API](http://clubelo.com/API)) | Elo puro p/ futebol: home advantage +53, multiplicador por raiz da diferença de gols, K~20; API pública por data desde 1939. | Produção há 10+ anos, referência-padrão. |
| **FiveThirtyEight SPI** ([GitHub](https://github.com/fivethirtyeight/data/tree/master/soccer-spi)) | Ratings ofensivo/defensivo + previsões 1X2 e spread de gols desde 2016; **metodologia e dados publicados** (raro). | Congelado (538 fechou em 2023), mas 17.4k★, benchmark de comunicação. |
| **piratings** ([GitHub](https://github.com/larsvancutsem/piratings)) | Pi-rating (Constantinou & Fenton) em R: pondera magnitude do placar; lambda/gamma otimizáveis. Claim de superar Elo em lucratividade na PL. | 14★, R, acadêmico. |
| **dixon-coles-worldcup** ([GitHub](https://github.com/huffyhenry/dixon-coles-worldcup)) | Dixon-Coles (Python+Stan) p/ Copa; time-weighting **manual** (conta jogos da Copa 3x) em vez de decay exponencial. | 7★, inativo. |
| **world-cup-2026-prediction-model** ([GitHub](https://github.com/Hicruben/world-cup-2026-prediction-model)) | Elo→λ Poisson→Dixon-Coles bivariado (correção τ)→50k Monte Carlo pelo chaveamento; "no black box". | Ativo (commit no dia da pesquisa), site ao vivo. **Backtest: RPS 0.175 vs baseline 0.241, 66% acerto em 763 jogos.** |

**Números para o mrtip se comparar:**
- **PL RPS ≈ 0.193** (zero-inflated Skellam, BayesWDFM 2024/25) — benchmark direto, mesma liga.
- Diferença Poisson/DC/Bivariate em RPS é minúscula (0.1914–0.1916); **otimizar o decay temporal** levou DC a 0.1891 (penaltyblog). → priorizar afinar janela/peso de jogos recentes sobre trocar de distribuição.
- **Crítica ao RPS** ([arXiv 1908.08980](https://arxiv.org/abs/1908.08980)): antes de adotar RPS como KPI único, complementar com Brier por mercado binário (O-U, BTTS).

**Vale estudar:** `penaltyblog` (código Cython de Dixon-Coles + Bayesian hierárquico p/ encolher parâmetros de times com poucos jogos no início de temporada); `MatchOracle` (blueprint de camadas se um dia empilhar ML sobre o DC); `world-cup-2026-prediction-model` (Monte Carlo de mata-mata, relevante p/ o trabalho de brackets de copa).

---

## Categoria 3 — Value betting, EV e CLV (bots e frameworks)

| Projeto | O que faz | Maturidade |
|---|---|---|
| **georgedouzas/sports-betting** ([GitHub](https://github.com/georgedouzas/sports-betting)) | **O mais maduro do nicho.** Dataloaders + "Bettors" sklearn + `backtest()` com CV temporal; identifica value bets prob-modelo vs odds implícita. CLI/GUI (Reflex). | **730★**, 425 commits, CI/CD, ativo (jan/2026). Sem LLM. |
| **kyleskom/NBA-ML-Sports-Betting** ([GitHub](https://github.com/kyleskom/NBA-Machine-Learning-Sports-Betting)) | XGBoost/NN sobre stats+odds NBA; EV + Kelly p/ stake. | **1.669★** — o repo ML+odds mais popular do GitHub. |
| **mmoore07129/mlb-kalshi-bot** ([GitHub](https://github.com/mmoore07129/mlb-kalshi-bot)) | Bot **em produção** no Kalshi: Pinnacle como fair value, XGBoost como veto, EV líquido de taxas, roda 24/7, **mede CLV em prob-space e ROI-space**. | Pessoal, produção real. |
| **odds-api/odds-api** ([GitHub](https://github.com/odds-api/odds-api)) | API OpenAPI-first agregando odds, SDK TS/Python + **servidor MCP** (arbitragem, +EV, line movement), modo mock. | 10★, push mai/2026, emergente. |
| **RebelBetting / OddsJam / Trademate** ([site](https://www.rebelbetting.com/)) | SaaS: escaneiam centenas de casas, devigam, sinalizam +EV/arbitragem; Trademate enfatiza tracking de CLV. | Comerciais maduros, base paga. |
| **BettingIsCool / Pinnacle Data** ([site](https://bettingiscool.com/)) | Devig por vários métodos (proporcional, log, power, **Shin**); vende histórico Pinnacle (abertura/fechamento) p/ calibrar. | Comercial ativo. |
| **jacksebastian17/betting-algo** ([GitHub](https://github.com/jacksebastian17/betting-algo)) · **jbram22/ev_sports_betting** ([GitHub](https://github.com/jbram22/ev_sports_betting)) | Scrapers +EV + Kelly + tracking de CLV/lucro por aposta em planilha. | Hobby, pequenos. |
| **Live-Sports-Arbitrage-Bet-Finder** ([GitHub](https://github.com/personal-coding/Live-Sports-Arbitrage-Bet-Finder)) · **SureBetsBot** ([GitHub](https://github.com/TessaRichardson/SureBetsBot)) | Arbitragem pura entre casas (sem modelo próprio); Streamlit + Kelly. | Nicho/hobby. |

**Papers de staking/edge:**
- **"Beating the Market with a Bad Predictive Model"** ([arXiv 2010.12508](https://arxiv.org/abs/2010.12508)) — valor vem de **descorrelação** com o mercado, não de acurácia pura. Reforça medir CLV, não só RPS.
- **"Optimal sports betting strategies"** ([arXiv 2107.08827](https://arxiv.org/abs/2107.08827)) — **fractional Kelly adaptativo** é o mais robusto cross-sport.
- **Handicap asiático** ([arXiv 2003.09384](https://arxiv.org/abs/2003.09384)) — pi-ratings→rede Bayesiana; mercado que o mrtip ainda não cobre.

**Onde o mrtip está:** tecnicamente uma **fase anterior** — só gera probabilidade calibrada, sem a etapa EV/CLV que dá nome à categoria. CLV contra fechamento da Pinnacle é o padrão-ouro de validação; devig (Shin) seria o primeiro componente a adicionar se ingerir odds; Kelly fracionário é a feature de stake que todo concorrente sério já tem.

---

## Categoria 4 — xG e qualidade de chance (open-source)

| Projeto | O que faz | Maturidade |
|---|---|---|
| **socceraction** ([GitHub](https://github.com/ML-KULeuven/socceraction)) | Formato universal SPADL/Atomic-SPADL + valorização de ação (VAEP via GBM, xT via grade espacial). Não é xG de chute — valoriza toda ação. | 787★, MIT, KU Leuven; "não em desenvolvimento ativo". |
| **soccer_xg** ([GitHub](https://github.com/ML-KULeuven/soccer_xg)) | xG puro por chute sobre SPADL; 4 modelos pré-treinados (logreg/XGB), calibração isotonic/Platt, pipelines p/ pênalti/falta. | 252★, Apache 2.0, acadêmico ativo. |
| **understatAPI** ([GitHub](https://github.com/collinb9/understatAPI)) | Scraper do understat.com (xG já calculado) p/ top-5 ligas + PL desde 2014/15. | 39★, MIT, ativo (fev/2026). |
| **StatsBomb Open Data** ([GitHub](https://github.com/statsbomb/open-data)) | Eventos JSON posse-a-posse + StatsBomb 360 (freeze frame dos 22 jogadores). Dado de treino padrão-ouro. | **3.4k★**, o dataset mais usado da comunidade. |
| **xG+ (Beyond Expected Goals)** ([arXiv 2512.00203](https://arxiv.org/abs/2512.00203)) | Modela conjuntamente P(chute ocorrer no próximo segundo) **e** xG condicional — não só os chutes que aconteceram. | Preprint dez/2025; dado bruto fechado (Gradient Sports). |
| **Player/Position adjusted xG** ([arXiv 2301.13052](https://arxiv.org/abs/2301.13052)) | Separa habilidade do finalizador da qualidade da chance (logreg + GBM). | Peer-reviewed 2023. |
| **Wilkens 2026 — Bundesliga** ([SAGE](https://journals.sagepub.com/doi/10.1177/22150218261416681)) | xG (Understat) como intensidade de Poisson → **Skellam** p/ 1X2; médias móveis de xG por mando, calibração isotônica. | Peer-reviewed 2026. **Log-loss 1.25 (modelo) vs 1.41 (mercado); ROI ~10-15%, forte assimetria mando.** |
| **Football xG** ([footballxg.com](https://footballxg.com/xgmodels/)) | Produto comercial: xG "de verdade" como insumo de Poisson; valor = modelo − 1/odds Pinnacle. | Comercial, ROI "dois dígitos baixos". |

**O mais comparável ao mrtip:** **Wilkens 2026** usa o mesmo esqueleto (Poisson intensidade + Skellam) e dá baliza honesta de edge (~10-15% ROI) quando odds entrarem. **Understat** (via understatAPI, ativo) é a fonte mais prática p/ benchmark externo de xG na PL sem treinar nada. Ressalva: nenhum xG open-source cobre a PL atual completa sem dado posse-a-posse que o SportMonks não fornece — o mrtip recebe xG pronto do SportMonks, então isso é auditoria, não implementação.

---

## Categoria 5 — Datasets e APIs de futebol/odds

| Fonte | O que oferece | Nota p/ mrtip |
|---|---|---|
| **football-data.co.uk** ([site](https://www.football-data.co.uk/data.php)) | CSVs desde 1993: resultado + stats + **odds** de ~10 casas (Pinnacle incluso), O-U/AH/1X2. Sem API. | Fonte-padrão p/ backtest do motor contra mercado, **grátis**. |
| **Betfair Historical Data** ([site](https://historicdata.betfair.com/)) | Exchange (não bookmaker): preço negociado, volume, BSP por minuto desde 2016. | "Verdade de mercado" mais granular que Pinnacle. |
| **Pinnacle Data** (via [bettingiscool](https://api.bettingiscool.com/)) | API oficial fechou (jul/2025); revendedores servem sharp odds p/ CLV. | Benchmark de CLV quando ingerir odds. |
| **The Odds API** ([site](https://the-odds-api.com/)) · **odds-api MCP** ([GitHub](https://github.com/odds-api/odds-api)) | Odds ao vivo de 250+ casas, SDKs; a segunda já expõe **servidor MCP**. | Caminho mais simples p/ ingerir odds; MCP casa com a stack do mrtip. |
| **soccerdata** ([GitHub](https://github.com/probberechts/soccerdata)) | Scraper unificado: Club Elo, ESPN, FBref, Sofascore, SoFIFA, Understat, WhoScored; IDs normalizados. | **1.827★**, ativo (jun/2026). Como cruzar múltiplas fontes sem trocar de provedor. |
| **statsbombpy** ([GitHub](https://github.com/statsbomb/statsbombpy)) | Wrapper oficial dos JSONs StatsBomb → DataFrame. | Padrão de client fino sobre fonte. |
| **API-Football** ([site](https://www.api-football.com/)) | Concorrente do SportMonks: mais barato, stats mais rasas em ligas menores + predictions próprias. | Confirma que SportMonks = "qualidade sobre preço". |
| **SportMonks Predictions/Value Bets** ([docs](https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/predictions/get-value-bets)) | **A própria fonte do mrtip** já vende probabilidades 1X2/CS/O-U/BTTS + endpoint Value Bets que cruza com odds, 21 dias antes. | **Acionável:** baseline direto p/ comparar o motor próprio, e já cruza com odds. |
| **Kaggle Octosport/SportMonks 2022** ([blog](https://www.sportmonks.com/blogs/football-predictions-kaggle-competition/)) | Competição com 150k+ jogos SportMonks; solução vencedora LSTM sobre últimas 10 partidas. | Notebooks públicos = benchmark técnico sobre o **mesmo dado**. |
| **Soccer Prediction Challenge 2017** ([Kaggle](https://www.kaggle.com/datasets/saurabhshahane/soccer-prediction-dataset)) | 216k jogos/52 ligas, avaliado por RPS; virou benchmark acadêmico. | RPS como métrica multi-classe correta. |
| **ML vs Poisson** ([arXiv 2408.08331](https://arxiv.org/pdf/2408.08331)) | CatBoost+pi-ratings: RPS 0.1925 / 55.82% — supera submissões de 2017. | Contraponto: GBM+rating bate Poisson puro por pouco → trade-off explicabilidade vs precisão marginal. |
| **Systematic Review ML betting** ([arXiv 2410.21484](https://arxiv.org/pdf/2410.21484)) | Mapa de armadilhas: **data leakage temporal**, overfitting em janelas curtas. | Checklist ao validar backtest do motor na PL. |

---

## Categoria 6 — Produtos/plataformas comerciais de tips

| Produto | O que faz | Nota |
|---|---|---|
| **Forebet** ([site](https://www.forebet.com/)) | Grátis desde 2009, 850+ ligas; modelo estatístico caixa-preta → 1X2/placar/xG + "Forebet Index" + Kelly. | Benchmark B2C "quant-first", mas **nunca publica método nem valida RPS**. |
| **Gecko Edge** ([site](https://geckoedge.ai/bayesian-vs-llm-football-prediction/)) | **Produto mais próximo da tese do mrtip.** Engine Bayesiano (xG→Poisson→Dixon-Coles ρ=-0.13→blend Bayesiano com odds+priors de liga) → LLM só **traduz**, não recalcula. Log de auditoria público. | Produção; claim 8.439 apostas, +398 pts em 66 competições (auto-reportado). |
| **FiveThirtyEight SPI** ([site](https://fivethirtyeight.com/features/how-our-club-soccer-projections-work/)) | Rating xG + Monte Carlo; **metodologia e dados abertos** — padrão-ouro de transparência. | Editorial encerrado, dados vivos (17.4k★). |
| **Rithmm** ([site](https://www.rithmm.com/)) | App IA multi-esporte; mostra "fórmula preditiva" + gap vs mercado (DTM); usuário ajusta pesos. | Transparência **parcial**, sem explicação em linguagem natural. |
| **Infogol → xGscore** ([xgscore.io](https://xgscore.io/)) | xG (Opta) vs preço Betfair ("fairness rating"). Infogol original saiu do ar. | Prova que "xG vs linha" sozinho não sustenta negócio sem narrativa. |
| **Tipstrr / Betting Gods / Bet2Invest** | Marketplaces de tipsters **humanos** com proofing contra odds reais; Bet2Invest usa CLV vs Pinnacle. | Provam o tipster, não a partida; nenhum expõe probabilidade calibrada por jogo. |
| **Academia das Apostas Brasil** ([site](https://www.academiadasapostas.com/)) | Portal PT-BR: previews humano-analíticos com dados de apoio, busca de valor vs odds. | **Maior concorrente em PT-BR**; humano, sem motor exposto → espaço claro p/ diferenciar. |
| **ProphitBet** ([GitHub](https://github.com/kochlisGit/ProphitBet-Soccer-Bets-Predictor)) | Desktop ML (NN/RF/ensemble) p/ futebol, sem Poisson nem explicação. | 551★, ativo — repo hobby-ML mais popular. |
| **SoccerGPT** ([GitHub](https://github.com/chrisby/SoccerGPT)) | POC: GPT-4o + SportMonks preveem Euro 2024 — LLM gera a previsão **direto**, sem camada quant. | 28★, POC. **O antipadrão exato que o mrtip evita.** |
| **Football_Prediction_Project** ([GitHub](https://github.com/mhaythornthwaite/Football_Prediction_Project)) | ML clássico sobre api-football, só PL, validação informal vs odds. | 296★, mesmo escopo do mrtip. |

---

## Categoria 7 — Híbridos quant+LLM em produção (sports + finance)

| Projeto | O que faz | Maturidade / Resultado |
|---|---|---|
| **Football-Skill/football-match-forecasting** ([GitHub](https://github.com/Football-Skill/football-match-forecasting)) | **Análogo arquitetural mais próximo.** Elo→Poisson/DC calibrado (min. log-loss/Brier) = baseline; LLM só ajusta com "intel nomeável" (lesão/suspensão/clima) e desvio limitado a **±0.08 de probabilidade** ("anchor + named deviation"). Loop pós-jogo se autoavalia por Brier/log-loss. | Hobby (3★), sem apostas reais, foco em rigor. |
| **Soccer Analytics Agent (Oracle)** ([GitHub](https://github.com/oracle-devrel/oracle-ai-developer-hub/tree/main/workshops/soccer-analytics-agent)) | XGBoost 92 features (Elo/forma/H2H/xG/momentum) + RAG híbrido (OracleVS); **LLM cita exatamente qual das 13 tools/features gerou cada afirmação** ("tool tracing"). | Workshop (não produção), stack completo. |
| **QuantIntelli+** ([GitHub](https://github.com/IanDublew/QuantIntelli)) | XGBoost sobre odds = baseline W/D/L; RAG (Tavily/Google/DDG) + Gemini gera relatório com "Eficiência de Mercado"/"Resolução de Conflito". | 11★, educacional. |
| **TradingAgents** ([GitHub](https://github.com/TauricResearch/TradingAgents)) | Multi-agente: analistas + bull/bear debatem + trader decide. **LLM participa da decisão**, não só explica. | Ativo, paper, v0.2.0 (2026). **Exemplo do que EVITAR.** |
| **Man Group — Alpha Assistant** ([reportagem](https://www.ai-street.co/p/man-group-s-ai-agents-uncover-dozens-of-trading-signals)) | Hedge fund: LLM foca em **explicar em linguagem simples** o sinal (não descobri-lo); comitê humano com veto. | Produção real. **Dobrou a adoção por PMs em 3 meses ao trocar "descoberta" por "explicação".** |
| **LLM→Bayesian Nets (Options Wheel)** ([arXiv 2512.01123](https://arxiv.org/abs/2512.01123)) | LLM **constrói a rede Bayesiana** (estrutura explicável), mas a decisão sai de inferência probabilística transparente; ~27 fatores por trade. | **Sharpe 1.08 vs 0.62; drawdown -8.2% vs -60% em ~19 anos.** Prova numérica de "LLM estrutura, cálculo decide". |
| **Prophet Arena** ([arXiv 2510.17638](https://arxiv.org/abs/2510.17638)) | Benchmark contínuo: LLMs como previsores diretos em 1300+ eventos reais. | LLMs têm calibração razoável mas perdem p/ dados quant na agregação perto da resolução. |
| **AI for Handball** ([arXiv 2407.15987](https://arxiv.org/abs/2407.15987)) | Deep learning + XAI + LLM tradutor p/ handebol nas Olimpíadas 2024. | Acadêmico, confirma o padrão "número + XAI + LLM tradutor". |

**Vale estudar (design):** o **±0.08 bound** do Football-Skill como forma de formalizar o contrato quant↔LLM; o **tool tracing** do Oracle como design de telemetria p/ "todo pick mostra o porquê"; o paper de **Bayesian nets** como argumento numérico de que o LLM deve ficar fora do cálculo final.

---

## Onde o mrtip se encaixa

### Paridade (já é padrão de mercado — não é diferencial)
- **Motor Poisson/Dixon-Coles** calibrado: é exatamente `penaltyblog`, `goalmodel`, Gecko Edge, world-cup-2026. O mrtip está alinhado ao estado da arte, **não à frente**, na parte quant.
- **"Motor calcula, LLM explica"**: convergência independente em Gecko Edge, QuantIntelli, Oracle agent, Football-Skill, Man Group. É convenção emergente — o mrtip acertou a arquitetura, mas ela não é única.
- **xG como insumo do Poisson**: Wilkens 2026 e footballxg.com fazem o mesmo.

### Diferencial real do mrtip
- **Nicho vago**: o open-source quant mais maduro (sports-betting, 730★) **não tem LLM**; o LLM-de-apostas mais estrelado mal chega a 11★. Ninguém combina, **em produto com escala**, motor calibrado + LLM explicador **em PT-BR** + transparência de método.
- **Transparência de método**: só o FiveThirtyEight SPI (descontinuado) publicou fórmula/dados; Forebet/Rithmm/Gecko são caixas-pretas de marketing. "Todo pick mostra o porquê + evidência" é **gap real**, não commodity.
- **Explicação em linguagem natural sobre número calibrado**: os bots ML cospem só pick+EV; o mrtip narra a evidência (stakes/fadiga/desfalque/mando). Man Group prova institucionalmente que **é a narrativa que destrava confiança**.
- **Tese narrativa ("jogo sem história não vale pick")**: única no landscape — os projetos segmentam por dificuldade **estatística** (Kelly Index), nunca por narrativa/stakes.

### Ideias para roubar
1. **RPS + Brier como KPI interno** do motor (benchmark PL ≈ 0.193 do BayesWDFM; complementar Brier por mercado binário pela crítica arXiv 1908.08980).
2. **Backtest walk-forward publicado** do próprio motor (como MatchOracle e Hicruben fizeram) — publicar RPS/Brier antes de vender a camada LLM como diferencial.
3. **Otimizar decay temporal** dos jogos recentes (penaltyblog mostra que rende mais que trocar de distribuição) e **encolhimento Bayesiano** p/ times com poucos jogos no início de temporada.
4. **SportMonks Value Bets/Predictions** como baseline de comparação imediato — mesmo dado bruto, custo zero.
5. **"Anchor + named deviation" com bound explícito** (Football-Skill: ±0.08) — formalizar quanto o LLM pode desviar do número quant.
6. **Tool tracing** (Oracle): o DeepSeek expõe qual feature/tool sustentou cada afirmação.
7. **Understat como validação externa de xG** (understatAPI) e **Club Elo/pi-ratings** como prior/feature complementar.
8. **Roadmap de odds** via `odds-api` (MCP-native, casa com a stack) → devig Shin → EV → **CLV vs Pinnacle** como métrica de validação superior a "acertou/errou".
9. **Fractional Kelly adaptativo** (arXiv 2107.08827) quando for dimensionar stake.
10. **Monte Carlo de mata-mata** (world-cup-2026) p/ o suporte a brackets de copa já em andamento.

---

## Veredito: LLM vs ML puro vs Híbrido

**LLM aposta bem sozinho? Não.** É a conclusão mais robusta da varredura — múltiplos estudos independentes, multi-seed e temporada inteira, batem no mesmo prego:
- KellyBench: **8/8 modelos de fronteira no vermelho** na PL 2023-24.
- PolyBench: **só 2/7** com retorno positivo; miscalibração sistemática (confiança fixa 0,8–0,9).
- asknews_mlb: variância absurda no **mesmo dado** (GPT +$1.354, Claude -$592 em 15 dias).
- Prophet Arena: LLM perde p/ dados quant na velocidade de agregar informação.

O problema não é raciocínio — é **calibração**: a probabilidade verbalizada do LLM não bate com frequência real ([arXiv 2410.06707](https://arxiv.org/pdf/2410.06707)). Serve p/ direção/narrativa, não p/ o número que decide a aposta.

**ML puro ganha?** Ganha **de pouco**, ao custo de virar caixa-preta. O ganho de GBM/NN sobre Poisson/Dixon-Coles é marginal (<1% RPS; CatBoost+pi-ratings 0.1925 vs Poisson ~0.191–0.193). E o que realmente move o resultado **não é o modelo** — é **calibração** (selecionar por calibração: -35% → +34% ROI) e **peso temporal** (decay otimizado move mais o RPS que trocar de distribuição). Ou seja: perseguir ML complexo é otimizar a variável errada. O LLM zero-shot até empata com ML clássico (OSF preprint), mas sem garantia de calibração — inútil p/ apostar.

**Híbrido é o caminho — mas com o LLM no lugar certo.** A evidência é convergente e inclui a validação numérica mais forte de toda a varredura:
- **LLM→Bayesian nets** (options wheel): LLM **estrutura**, inferência transparente **decide** → Sharpe 1.08 vs 0.62, drawdown -8.2% vs -60%.
- **Man Group**: focar o LLM em **explicar** (não descobrir) dobrou a adoção institucional.
- Todo produto sério (Gecko Edge, QuantIntelli, Oracle, Football-Skill) colocou o motor estatístico no centro e o LLM como camada de tradução/contexto com bound.
- O antipadrão (LLM decide: TradingAgents, SoccerGPT, predikt) repete o ponto fraco dos benchmarks.

**Conclusão para o mrtip:** a arquitetura está **tecnicamente correta e defensável** — não é conservadorismo, é o padrão que sobrevive quando alguém tenta monetizar. As tarefas pendentes não são de arquitetura, são de **rigor e prova**: (1) publicar RPS/Brier + backtest walk-forward do motor; (2) formalizar o bound quant↔LLM; (3) planejar ingestão de odds só p/ calibração/CLV (não p/ decidir stake às cegas). O diferencial de mercado — transparência + narrativa de evidência em PT-BR sobre número calibrado — está num espaço genuinamente pouco disputado.
