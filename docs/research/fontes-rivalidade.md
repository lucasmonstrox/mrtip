# Fontes de dados para detecção de rivalidade

> Catálogo das fontes que alimentam a [regra de Rivalidade](../regras/rivalidade.md). Complementa os catálogos gerais ([sites](./sites-futebol-masculino.md), [APIs](./apis-futebol.md)): aqui ficam as fontes **específicas de rivalidade/derby** — índices de rivalidade, listas de clássicos, histórico de transferências (lei do ex) e sinais de risco de torcida — que **não** aparecem nos catálogos gerais porque não são feeds de placar/stats.

- **Status:** rascunho inicial (v0), derivado da investigação web de 2026-06-18 (30 agentes, verificação adversarial).
- **Para que serve:** montar o **Índice de Rivalidade** por confronto (ver [rivalidade.md §3.1](../regras/rivalidade.md#31-detectar-e-quantificar-a-rivalidade-do-confronto)).
- **Achado-chave:** das ~14 fontes abaixo, **9 são novas** (não estavam em nenhum catálogo). As 5 já catalogadas (Transfermarkt, football-data.co.uk, API-Football, openfootball, StatsBomb) reaparecem aqui com **uso voltado a rivalidade**, não a placar/stats genéricos.

---

## 1. Tabela mestre

Legenda **No catálogo?**: 🆕 nova (não estava em sites/apis) · ♻️ já catalogada (uso aqui é específico de rivalidade).

| Fonte | Nível | O que dá p/ rivalidade | Custo | Cobertura | No catálogo? |
|---|---|---|---|---|---|
| **Know Rivalry (Tyler & Cobbs)** | Time/torcida | Score de rivalidade **validado** (Rivalry 0–100, Dyad 0–200, Difference) — a única medida acadêmica | Grátis (CC BY-SA 4.0) | MLS/EUA; pouco fora da América do Norte | 🆕 |
| **footballderbies.com** | Time | **Nota 0–10** por confronto + tipo (cidade/local/ampla) | Grátis (scraping) | Global, ~300+ clubes consagrados | 🆕 |
| **derby.ist (Derbyist)** | Time | Whitelist global de pares-rivais (de-para p/ flag "é derby") | Grátis (scraping) | Centenas de rivalidades; sem score | 🆕 |
| **Wikipedia — rivalries/derbies** | Time | Whitelist + **tipo** (religiosa/política/classe) por confronto | Grátis (CC BY-SA; MediaWiki API) | Global, viés editorial; sem magnitude | 🆕 |
| **Wikidata (SPARQL)** | Time/jogador/treinador | Coords de estádio (P625 → distância), carreira de jogador (P54) e técnico (P6087) com datas → flags ex-clube | Grátis (CC0, sem key) | Global, irregular; melhor p/ grandes nomes | 🆕 |
| **transfermarkt-datasets (dcaribou)** | Jogador | Histórico de transferências limpo (CSV/Parquet) p/ cruzar escalação × ex-clube | Grátis (semanal) | Grandes ligas; validar frescor (perda 2024/25) | 🆕 |
| **worldfootballR (pacote R)** | Jogador/treinador | `tm_player_transfer_history()` e H2H de técnicos via Transfermarkt | Grátis (MIT) | Cobertura Transfermarkt/FBref | 🆕 |
| **Transfermarkt — bilanztrainer** | Treinador | "Record against another manager" (W/D/L/PPM) — H2H de técnicos | Grátis (tabela; ToS restringe scraping) | Quase universal | ♻️ (site já listado) |
| **Home Office — arrests & banning orders** | Torcida | Proxy oficial de **risco/temperatura** por jogo/competição | Grátis (open data) | Inglaterra e País de Gales, desde 2010/11 | 🆕 |
| **UEFA — stadium bans** | Torcida | Proibição de visitante / portões fechados → mando neutralizado | Grátis (scraping) | Competições UEFA | 🆕 |
| **GDELT Project** | Torcida | Menções a violência de torcida/confrontos (notícia geolocalizada) | Grátis (API + BigQuery) | Global, multilíngue, quase real-time | 🆕 |
| **football-data.co.uk** | Time (backtest) | Cartões/faltas/escanteios **+ odds & closing** (CSV) | Grátis | Grandes ligas europeias | ♻️ |
| **Club Football Match Data 2000–2025 (xgabora)** | Time (backtest) | Stats **+ odds históricas** p/ validar valor vs mercado | Grátis (CSV) | 27 países / 42 ligas | 🆕 |
| **API-Football** | Time/jogador/torcida | Faltas/cartões/escanteios, attendance, `/transfers`, H2H | Free 100 req/dia; pago ~US$19+/mês | 1.100+ ligas | ♻️ |
| **openfootball** | Time | Clubes + estádio + coords → derivar derby local por distância | Grátis (CC0) | Global; sem stats finas | ♻️ |

---

## 2. Por que essas fontes (e não as do catálogo geral)

Os catálogos `sites-futebol-masculino` e `apis-futebol` são fortes em **placar, stats e odds** — mas **nenhum** carrega o sinal de *rivalidade* em si. Rivalidade exige três coisas que esses feeds não dão:

1. **Saber que o confronto É um clássico** → whitelist curada (Wikipedia/Wikidata/derby.ist/footballderbies) ou derivada por **distância entre estádios** (Wikidata P625 / openfootball).
2. **Medir a intensidade** → score acadêmico (Know Rivalry) ou nota editorial (footballderbies 0–10), normalizados pela carga do H2H.
3. **Sinais por nível** → transferências (lei do ex), H2H de técnicos, risco de torcida (Home Office/UEFA/GDELT).

> Os feeds genéricos entram só na **borda**: API-Football/football-data.co.uk fornecem os cartões/faltas/odds **sobre os quais** o sinal de rivalidade é calibrado (ver [rivalidade.md §5](../regras/rivalidade.md#5-calibração-transformar-heurística-em-número)).

---

## 3. Lacunas e cuidados

- **Cobertura BR é fraca nas fontes de score.** Know Rivalry é MLS/EUA; footballderbies/derby.ist cobrem os clássicos brasileiros consagrados (Derby paulista, Gre-Nal, Fla-Flu) mas não o long tail. Para o Brasileirão, o caminho mais confiável é **whitelist manual dos clássicos + distância de estádios + carga de H2H**, não um score pronto.
- **Risco de torcida é anglocêntrico.** Home Office/UEFA são Inglaterra/Europa. No Brasil o sinal de "torcida única / alto risco" vem de **imprensa** (ESPN, Itatiaia, ge) + protocolos de PM/federações — disperso, exige consolidação (candidato a GDELT + scraping de notícia).
- **Tudo que é Transfermarkt/footballderbies/derby.ist depende de scraping** e dos respectivos ToS — manter redundância (Wikidata como reconciliação) e validar frescor.
- **Sem score validado globalmente.** A medida de Tyler & Cobbs é citável, mas o produto provavelmente terá de **construir o próprio índice** combinando os sinais acima e calibrando com resultado real.

---

## Referências

Ver bloco de referências completo (com URLs e papers) em [regras/rivalidade.md](../regras/rivalidade.md#referências). Fontes-âncora desta nota: [Know Rivalry](https://knowrivalry.com/research/), [footballderbies.com](https://www.footballderbies.com/), [derby.ist](https://derby.ist/all), [Wikidata](https://query.wikidata.org/), [transfermarkt-datasets](https://github.com/dcaribou/transfermarkt-datasets), [Club Football Match Data 2000–2025](https://github.com/xgabora/Club-Football-Match-Data-2000-2025), [Home Office stats](https://www.gov.uk/government/statistics/football-related-arrests-banning-orders-202425-domestic-season), [GDELT](https://www.gdeltproject.org/).
