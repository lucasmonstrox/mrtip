Segue o relatório.

---

# Comparativo de APIs de Futebol para o mrtip

O mrtip precisa de dados de futebol masculino brasileiro (Brasileirão, Copa do Brasil, estaduais) com livescore, estatísticas e — idealmente — insumos para dicas/predições; a escolha gira em torno de combinar uma API brasileira forte em cobertura com uma fonte global para o que faltar (xG, odds, predictions).

## 2. Tabela comparativa principal

| API | Acesso | Free tier | Rate limit | Preço | Cobertura BR | Principais dados |
|---|---|---|---|---|---|---|
| **API-Football (API-Sports)** | REST pública | Sim, 100 req/dia, todos endpoints (temporadas antigas) | 100 req/dia, 10 req/min (free) | Pro USD 19, Ultra 29, Mega 39, Custom | Completa (A, B, Copa do Brasil, estaduais, Liberta/Suda) | livescore, fixtures, standings, lineups, events, player-stats, odds, predictions, transfers, histórico. Sem xG |
| **API Futebol (BR)** | REST pública | Existe conta grátis/"teste", mas números do free não publicados (2026) | Free desconhecido; pagos: Startup 2.000, Profissional 5.000 req/dia | A partir de R$ 99/mês por campeonato; Startup R$ 599; Profissional R$ 999; Enterprise sob consulta | Parcial/gateada por campeonato (A, B, C, D, Copa do Brasil, estaduais; "todos" só Enterprise) | livescore, fixtures, standings, lineups, events, player-stats, histórico. Sem xG, sem odds, sem predictions |
| **football-data.org** | REST pública | Sim, 12 competições (inclui Brasileirão A, placar atrasado) | 10 req/min (free) | Free+Livescores EUR 12; Standard 49; Advanced 99; Pro 199; add-ons Odds/Statistics EUR 15 cada | Parcial (A no free atrasado; B e Copa do Brasil só pago; sem C/D/estaduais) | livescore, fixtures, standings, lineups, events, odds, histórico. Sem xG, sem predictions |
| **Highlightly** | REST pública | Sim, BASIC 100 req/dia (livescore, odds, lineups, events, stats, predictions) | 100 req/dia (free) | PRO USD 9,49; ULTRA 20,99; MEGA 45,99 (descontos anuais ~40%) | Parcial (só Serie A confirmada; B/C/D/Copa/estaduais não confirmados) | livescore, fixtures, standings, lineups, events, player-stats, odds, predictions, transfers, highlights-vídeo, histórico. Sem xG |
| **TheSportsDB** | REST pública | Sim, key "123" (fixtures, tabelas, lineups, histórico; sem livescore) | 30 req/min (free); Premium 100/min | Premium USD 9; Small Business USD 20 | Parcial (Serie A free, id 4351; resto não confirmado, crowdsourced) | livescore, fixtures, standings, lineups, events, player-stats, transfers, histórico. Sem xG, sem odds, sem predictions |
| **Sportmonks** | REST pública | Sim, mas só 2 ligas (Dinamarca/Escócia); BR não está no free | Free 3.000/entidade/hora; pagos 2.000–5.000/entidade/hora | Starter EUR 29, Growth 99, Pro 249; add-ons: xG EUR 24, Odds&Predictions 15, ligas extras EUR 4 cada | Parcial (A, B, Copa do Brasil, Liberta/Suda, estaduais; exige Growth+ ou ligas extras; sem C/D confirmado) | livescore, fixtures, standings, lineups, events, player-stats, **xg**, odds, predictions, transfers, histórico (xG/odds são add-ons) |
| **Live-Score API** | REST pública | Trial 14 dias, 1.500 req/dia (não permanente) | 1.500 req/dia (trial) | Starter EUR 11, Professional 26, Premium 69, Commentary 190 | Parcial (A, B, C, Copa do Brasil, Paulista A1 confirmados; sem gating por liga) | livescore, fixtures, standings, lineups, events, histórico. Sem xG, sem predictions, sem player-stats detalhado |
| **The Odds API** | REST pública | Sim, 500 créditos/mês (todos esportes/mercados) | Cota mensal de créditos (500 free) | 20K créd USD 30, 100K 59, 5M 119, 15M 249 | Parcial (só A e B, com odds e scores; sem C/D/Copa/estaduais) | livescore, fixtures, **odds**, histórico. Sem stats/lineups/xG/predictions |
| **Odds-API.io** | REST pública | Sim, free permanente: 2 bookmakers, 100 req/hora, sem WebSocket | 100 req/hora (free); pagos a partir de 5.000/hora | Starter £99, Growth £179, Pro £229; WebSocket +100% | Parcial (só A e B; só odds; sem estaduais/Copa confirmados) | **odds**, livescore, histórico. Sem fixtures detalhado/standings/lineups/xG/predictions |
| **SoccersAPI** | REST pública | Sim, 3 ligas + ~100 req (fontes divergem 100/h vs 100/dia) | ~100 req (free, indefinido) | Soccer 20 USD 39, Soccer 100 USD 79, superiores sob consulta | **Desconhecido** (coverage carrega dinâmico; BR não verificado) | livescore, fixtures, standings, lineups, events, player-stats, odds, transfers, histórico. Sem xG, sem predictions confirmados |
| **AllSportsAPI** | REST pública | Sim, mas só 2 ligas **aleatórias**/ano (sem garantia de BR); sem odds | Free 260/hora; pagos 2.000–1.000.000/hora | European ~USD 99, Worldwide ~149, Ultimate ~199 (preço não confirmado, página 404/403) | Apenas-pago (Serie A só em Worldwide/Ultimate; B/C/D/Copa/estaduais não confirmados) | livescore, fixtures, standings, lineups, events, player-stats, odds, predictions, histórico. Sem xG, sem transfers |
| **isportsAPI** | REST pública | Não permanente; trial 15 dias (full access) | ~1 chamada/10s por endpoint | Stats USD 299, Live Data 449, Odds 449, Odds Pro 599, Live Animation 1.299 (por módulo/mês) | Parcial (só "Brazil Serie A" confirmada; B/C/D/Copa/estaduais não confirmados) | livescore, fixtures, standings, lineups, events, player-stats, **xg** (61 métricas), odds, histórico. Sem predictions/tips nativos |
| **Entity Sport** | REST pública | Free dev token (3 ligas históricas 2018) + trial 7 dias; sem free permanente atual | Desconhecido (cota mensal: 1M–6M chamadas) | Starter ~USD 250, Pro ~450, Elite ~750, Gold ~1.600 | Parcial (Serie A só a partir do Pro; Copa do Brasil em Pro/Elite; sem B/C/D/estaduais) | livescore, fixtures, standings, lineups, events, player-stats, odds, predictions, histórico. xG não confirmado |
| **StatsBomb Open Data** | Open data | Totalmente grátis (JSON estático no GitHub, com crédito) | Desconhecido | Open Data grátis; produto comercial sob consulta (B2B) | **Não** (zero clubes BR; só seleção em torneios) | fixtures, lineups, events, player-stats; **xG derivável** do event data. Dados estáticos/históricos |
| **openfootball / football.db** | Open data | Tudo grátis, domínio público (CC0), arquivos no GitHub | Limite do GitHub (60–5.000 req/h) | Grátis | Parcial (A e B ~2018–2026; Copa do Brasil desde 2025; sem C/D/estaduais) | fixtures, standings, histórico. Sem livescore/lineups/events/xG/odds/predictions |
| **Club Elo** | REST pública | Grátis, sem key (CSV) | Desconhecido | Grátis | **Não** (só clubes europeus/UEFA; zero BR) | standings, histórico, predictions (Elo), fixtures. Inútil para core BR |
| **OpenLigaDB** | REST pública | Grátis, sem auth (ODbL) | Desconhecido | Grátis | **Não** (foco Alemanha; BR inexistente/não confiável) | livescore, fixtures, standings (básico) |
| **soccerdata (probberechts)** | Scraping não-oficial | Grátis, open-source (Apache 2.0); custo = manter scrapers e ToS | Sem limite próprio; aplica delays/cache; limite das fontes raspadas | Grátis | Parcial (BR não vem default; exige liga custom; FBref/Sofascore indexam A, B, Copa; estaduais irregulares) | fixtures, standings, lineups, events, player-stats, **xg**, odds, predictions, histórico. **Batch, não tempo real** |
| **Goalserve** | B2B contrato | Sem free permanente; trial 30 dias (full) | Não publicado (feeds: livescore 2–4s, odds live <1s) | Por feed: Livescore USD 150, Stats 200, Pregame Odds 250, Live Odds 500, Full Soccer 550 (~150–800/mês) | **Completa** (A, B, C, D, Copa do Brasil, estaduais, base) | livescore, fixtures, standings, lineups, events, player-stats, odds, histórico. Sem xG, sem predictions |
| **SportsDataIO** | B2B contrato | Free trial não expira, mas só UEFA Champions League (sem BR) | Desconhecido (pagos "unlimited") | Sob consulta; estimativas de terceiros ~USD 99–1.000+/mês (não verificado) | Apenas-pago (A, B, C, D, vários estaduais, Copa do Brasil/Nordeste — tudo atrás de contrato) | livescore, fixtures, standings, lineups, events, player-stats, odds, predictions (projections fantasy, não 1X2). xG/transfers não confirmados |

## 3. Por tipo de necessidade

**(a) Livescore/resultados BR baratos**
- **API Futebol (BR)** — `/ao-vivo` (polling ~30s), tabela, escalações, eventos; foco nativo no Brasil, preço em R$ via PIX. Sem free numérico confirmado.
- **Live-Score API** — EUR 11/mês, A/B/C/Copa do Brasil/Paulista, sem gating por liga (só trial 14 dias no free).
- **football-data.org** — Serie A no free, mas **placar atrasado** e 10 req/min: inviável p/ tempo real sem pagar.
- **TheSportsDB** — livescore só em plano pago (USD 9, V2); free serve para fixtures/tabelas/identidade visual.

**(b) Stats avançadas/xG**
- **Sportmonks** — xG via add-on (EUR 24/mês) sobre Growth+ (cobre BR).
- **isportsAPI** — xG robusto (61 métricas, open play/set piece/non-penalty), mas USD 299+/mês e BR abaixo da Serie A não confirmado.
- **soccerdata / StatsBomb Open Data** — xG grátis, mas batch/histórico e BR limitado ou inexistente (StatsBomb Open Data não tem clubes BR; xG derivável do event data europeu).
- API-Football, API Futebol, football-data, Highlightly, Live-Score, Goalserve, AllSportsAPI: **não oferecem xG**.

**(c) Odds**
- **The Odds API** — especialista em odds (40+ casas), free 500 créditos/mês, cobre A e B; sem stats/lineups.
- **Odds-API.io** — agregador (265+ casas), free 100 req/hora; só A e B; sem stats.
- Odds incluídas em: Goalserve, Sportmonks (add-on), football-data (add-on), Highlightly, AllSportsAPI (só Ultimate), Live-Score, SoccersAPI, isportsAPI, SportsDataIO.
- API-Football tem odds; **API Futebol (BR) não tem odds**.

**(d) Predictions**
- **API-Football** — predictions com modelo ML prontas (1X2, BTTS, over/under, placar exato, handicap, escanteios, cartões), até 21 dias antes. Melhor encaixe para "tips" sem construir modelo.
- **Highlightly** — predictions com modelo próprio + odds.
- **Sportmonks** — predictions (add-on, 20+ mercados).
- **SportsDataIO** — "projections" são fantasy/stats de jogador, **não** previsão 1X2.
- **Club Elo** — probabilidades por Elo, mas só Europa.

**(e) Dado aberto/gratuito para protótipo**
- **openfootball / football.db** — CC0, A e B + Copa do Brasil (2025+), calendário/resultados/tabela. Bom para backfill histórico do core BR.
- **StatsBomb Open Data** — event data + xG granular, mas **sem BR** (treino de modelo/benchmark europeu).
- **Club Elo / OpenLigaDB** — grátis porém **sem cobertura BR**.

**(f) Enterprise/B2B**
- **Goalserve** — cobertura BR completa (A–D, estaduais, Copa do Brasil), feeds push/WebSocket, ~USD 150–800/mês por feed; sem xG/predictions.
- **SportsDataIO** — cobertura BR ampla no papel, mas trial não cobre BR e preço sob consulta.
- **Sportmonks Pro / Entity Sport Gold** — tiers altos (EUR 249 / USD 1.600) com cobertura ampliada.

## 4. Cobertura do futebol brasileiro

Quem **realmente cobre o núcleo BR** (Brasileirão + Copa do Brasil + estaduais), e em qual plano:

- **API-Football** — cobertura **completa** declarada (A, B, Copa do Brasil, principais estaduais, Liberta/Suda) em todos os planos, **inclusive o free** (limitado a temporadas antigas; temporada corrente exige Pro USD 19). Serie C/D não confirmada — checar `/coverage`.
- **Goalserve** — cobertura **completa** confirmada na página (A, B, C, D, Copa do Brasil, estaduais variados, competições de base). Profundidade depende do feed/pacote, não da liga.
- **API Futebol (BR)** — cobre A, B, C, D, Copa do Brasil e estaduais, mas **gateado por campeonato**: cobrir tudo simultaneamente exige plano de volume alto ou Enterprise (não vem junto no básico).
- **SportsDataIO** — lista A–D, muitos estaduais, Copa do Brasil/Nordeste, mas **tudo atrás de contrato** (trial só dá Champions League).
- **Sportmonks** — A, B, Copa do Brasil, Liberta/Suda, alguns estaduais e Seleção; exige **Growth+ ou ligas extras** (EUR 4 cada); C/D não verificado.
- **Live-Score API** — confirmados A, B, C, Copa do Brasil e Paulista A1; sem gating por liga (~24 competições BR). Serie D e demais estaduais não confirmados.

Cobertura **parcial/só Serie A** (validar antes de adotar): football-data.org (A free atrasado; B/Copa só pago), Highlightly, TheSportsDB, isportsAPI, AllSportsAPI, The Odds API e Odds-API.io (A e B, só odds), openfootball (A e B), Entity Sport (A só no Pro). **SoccersAPI: desconhecido** (não verificado). **Sem BR:** StatsBomb Open Data, Club Elo, OpenLigaDB.

## 5. Recomendação para o mrtip

- **Base de cobertura + predictions (MVP):** **API-Football (API-Sports)** como espinha dorsal. É a única REST pública com free tier (100 req/dia) que declara cobertura BR completa **e** já entrega **predictions de modelo ML prontas** (1X2, BTTS, over/under, placar, escanteios, cartões) — exatamente o insumo de um produto de "dicas". Subir para Pro (USD 19/mês) libera a temporada corrente. Trade-off: **não tem xG nativo**.
- **Fonte brasileira para profundidade local:** considerar **API Futebol (BR)** quando o foco for estaduais/Serie C-D e nomenclatura/dados locais, pagando por campeonato (a partir de R$ 99) ou Profissional (R$ 999) para stats avançadas. Risco: sem odds, sem predictions e free sem números públicos — validar criando conta antes de fechar arquitetura. Pode ser redundante com API-Football no MVP; entra se a cobertura local da API-Football decepcionar no `/coverage`.
- **Dado aberto para protótipo/backfill:** **openfootball/football.db** (CC0) para histórico de calendário, resultados e tabela de Serie A/B + Copa do Brasil (2025+), a custo zero e sem ToS restritivo. Para treinar/benchmark de xG, **StatsBomb Open Data** (Europa) — ciente de que **não tem clubes BR**.
- **Complementos opcionais conforme o produto evoluir:**
  - *Odds reais:* **The Odds API** (free 500 créditos/mês, cobre A e B) é o caminho mais barato para linhas de mercado/detecção de valor, já que API-Football foca em predictions e API Futebol BR não tem odds.
  - *xG (se virar requisito):* **Sportmonks** (Growth EUR 99 + add-on xG EUR 24) é a opção oficial com BR; **soccerdata/FBref** só como ETL de protótipo, nunca em tempo real (ver nota 6).
- **Riscos a registrar:**
  - **B2B caro** (Goalserve ~150–800/mês, SportsDataIO/Entity Sport sob consulta, USD 250–1.600) — só justifica com orçamento e necessidade de livescore push/WebSocket de baixa latência e cobertura A–D garantida; **fora do MVP**.
  - **Free tiers enganosos:** Sportmonks/AllSportsAPI free não dão BR; football-data free dá A com **placar atrasado**; isportsAPI/Entity Sport/Goalserve/SoccersAPI só trial.
  - **Cobertura não verificada** (Highlightly, SoccersAPI, AllSportsAPI, isportsAPI abaixo da Serie A) deve ser confirmada com chave antes de prometer estaduais/Serie C-D no produto.

## 6. Nota sobre limitações legais/ToS de scraping

A biblioteca **soccerdata (probberechts)** é a única opção do conjunto que obtém dados por **scraping não-oficial** de **Sofascore, FBref, WhoScored, Understat, Transfermarkt** etc. Implicações para o mrtip:

- **ToS:** raspar Sofascore, FBref (Sports Reference) e Transfermarkt pode **violar os Termos de Uso** desses sites; nenhum deles autoriza redistribuição comercial de dados raspados. Usar em produção é risco jurídico e reputacional.
- **Fragilidade técnica:** qualquer mudança de layout quebra a coleta; há **bloqueio por IP e captcha** sob carga; **sem SLA**.
- **Não é tempo real:** é coleta em **batch/histórico** com cache local — serve como pipeline de ETL/backfill ou treino de modelo, **não** como backend de livescore.
- O reader de predictions vinha do **FiveThirtyEight, que foi descontinuado** — esse caminho está efetivamente obsoleto.
- **Recomendação:** usar soccerdata apenas em prototipagem/pesquisa interna, nunca como fonte de produção voltada ao usuário; para xG/stats em produto, preferir uma fonte oficial licenciada (Sportmonks, isportsAPI) mesmo que paga. O produto comercial da StatsBomb (Hudl) cobre o Brasileirão, mas é B2B sob contrato (fora do Open Data).

> Campos marcados como **desconhecido** (rate limits de Goalserve/SportsDataIO/Entity Sport/SoccersAPI/Club Elo/OpenLigaDB; números do free da API Futebol BR; cobertura BR da SoccersAPI; preços estimados de SportsDataIO/AllSportsAPI) não foram confirmados nas fontes fornecidas e devem ser validados antes de decisão final.