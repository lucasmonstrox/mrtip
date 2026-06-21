# Regra de prognóstico — Rivalidade

> Como a **rivalidade** entra na pipeline de prognósticos do mrtip: que sinais extrair (entre **times/clássicos**, **torcidas**, **jogadores** e **treinadores**), como obtê-los (jogo futuro e histórico) e como aplicá-los — sempre como **heurística calibrável**, separando **efeito real** de **folclore**.

- **Status:** rascunho inicial (v0)
- **Última atualização:** 2026-06-18
- **Dimensão no dossiê:** adiciona "Rivalidade/temperatura do jogo" às dimensões já previstas no [overview](../visao-geral.md#6-como-a-ia-entende-um-jogo) (forma, H2H, lesões, social, mercado). Conversa de perto com o **contexto social** (torcida) e o **H2H** (confronto direto).
- **Documento-irmão:** segue o mesmo padrão de [clima.md](./clima.md) — sinal barato, qualitativo, de baixo peso até calibrar.
- **Itens `[A confirmar]`** dependem de decisão de domínio/calibração — ver [Decisões em aberto](#decisões-em-aberto).

---

## 1. Por que a rivalidade importa

Um clássico não é "mais um jogo". A rivalidade muda o **comportamento** em campo (agressividade, faltas, cartões), **achata a vantagem de quem joga em casa** e mexe com a **arbitragem** sob pressão de torcida. É um sinal **barato de coletar** (proximidade de estádios + lista de derbies + H2H) e que o mercado de odds **só precifica bem nos grandes jogos de ligas líquidas** — em ligas e mercados secundários sobra **valor (EV+)**, exatamente o que o produto busca.

> **Regra-base (a do dia a dia):** em **clássico quente, o jogo fica mais truncado e violento** — mais faltas e cartões, mando de campo vale menos, e o favorito tropeça mais do que a tabela sugere. Logo, rivalidade alta empurra para **over de cartões** e **desconto na vantagem do mandante/favorito**.

**Importante — separar efeito de folclore.** A pesquisa (ver §7) confirma parte da sabedoria popular e **derruba** outra parte:

- ✅ **Confirmado:** mais faltas/cartões em clássicos (forte na Premier League); a vantagem de casa **encolhe** em derby; pressão de torcida **enviesa o árbitro**; jogador rende mais contra o **ex-clube**.
- ❌ **Mito / sem dado robusto:** "clássico não tem gol" (under) — evidência **mista**; "forma vai pro lixo / favorito sempre tropeça" — **sem suporte estatístico de larga amostra** (o único ajuste defensável é o desconto no *mando*, não um *fade* cego do favorito); "técnico revanche contra ex-clube" — **narrativa**, sem estudo isolando treinadores.

A regra só vale o que valer a **calibração com dados reais** (§5 e §6). Coerente com o princípio do produto: *estimar* (modelo quant) é separado de *explicar* (LLM), e probabilidade só conta se for **calibrada**.

---

## 2. Sinais e heurísticas por nível

A rivalidade é **multidimensional**. Cada nível vira um ajuste **qualitativo** distinto — não confunda "torcida quente" com "jogador com a lei do ex". Os efeitos abaixo são **pontos de partida**; devem ser recalibrados com o histórico da liga do MVP (§5).

### 2.1 Nível TIME / clássico (o confronto em si)

| Sinal | Evidência | Efeito esperado | Direção do pick | Força |
|---|---|---|---|---|
| **Clássico/derby confirmado** | +1,4 a 5,7 faltas/jogo na Premier League (p=0,0013) | Mais faltas e cartões | ↑ **Over cartões/faltas** | Forte (PL) / ⚠️ não generaliza |
| **Mando de campo em derby** | Brasileirão: vitória do mandante caiu de **52,4% → 30,0%** em clássicos (p≤0,001) | Vantagem de casa **encolhe muito** | ↓ Desconto no mandante; ↑ X2 / empate | **Forte** |
| **"Favorito tropeça / forma vai pro lixo"** | Sem estudo de larga amostra; só o dado indireto do mando | Edge do favorito **comprime** um pouco | ⚠️ **Não** fazer *fade* cego — só descontar o *mando* | Fraca/mito |
| **Gols (over/under)** | Statathlon: menos oportunidades; books: 65% over 2,5 → **conflito** | Ambíguo | ⚠️ **Neutro** — não apostar under só por ser clássico | Fraca/mista |
| **Empate** | Decorre indiretamente do mando que some | Jogo mais equilibrado | ↑ Leve viés a **empate** | Fraca/indireta |

### 2.2 Nível TORCIDA / atmosfera / segurança

| Sinal | Evidência | Efeito esperado | Direção do pick | Força |
|---|---|---|---|---|
| **Torcida cheia + atmosfera ultra** | Jogos sem público (COVID): vantagem de mando caiu (~59%→55% dos pontos) e o **viés de árbitro sumiu** | Público **amplifica** mando e favorece a casa na arbitragem | ↑ Reforça **mandante**; ↑ cartões do **visitante** | **Forte** |
| **Dose-resposta do público** | La Liga/CSL: mais público → mais amarelos contra o visitante e mais acréscimo pró-casa | Quanto maior a lotação, maior o viés pró-casa | ↑ **Over cartões do visitante** | **Forte** |
| **Jogo "alto risco" (Cat C/C-IR; histórico de violência)** | Categorias de risco da polícia inglesa; estatísticas do Home Office | Mais tensão → mais cartões | ↑ **Over cartões** | Moderada |
| **Proibição de visitante / torcida única / portões fechados** | UEFA ban, torcida única (BR), ghost games | Efeito de mando **enfraquece** (jogo "neutro") | ⚠️ **Calibrar PARA BAIXO** o viés pró-casa | **Forte** |

> ⚠️ **Atenção ao mito da proibição.** Banir torcida visitante **não** é regra automática de "high risk" — é decisão discricionária e até controversa; a UEFA, ao contrário, **exige um mínimo** de visitantes. O sinal útil aqui é binário: *tem torcida visitante normal* (mando pleno) vs *torcida única / portões fechados* (mando neutralizado).

### 2.3 Nível JOGADOR (a "lei do ex")

| Sinal | Evidência | Efeito esperado | Direção do pick | Força |
|---|---|---|---|---|
| **Jogador enfrentando ex-clube** | Estudo peer-reviewed (Assanskiy et al. 2022, JBEE): mais finalizações/gols contra ex-times | Mais ações ofensivas do ex-jogador | ↑ Leve **over** em chutes/gols dele (anytime scorer) | **Confirmada** (magnitude não publicada) |
| **Reforço 1 — joga no estádio do ex-clube** | Efeito **fortalece em jogos fora** (na antiga casa) | Motivação emocional maior | ↑ Peso maior se o ex-jogador é **visitante** | Moderada |
| **Reforço 2 — saída conturbada** | Efeito maior com pouca minutagem / corte salarial / dispensa | "Rancor" eleva o desempenho | ↑ Peso extra (índice de rancor) | Moderada |

> O mecanismo é **emocional**, não tático ("provar que estavam errados"). Como o *effect size* exato não foi publicado, é **sinal secundário de baixo-moderado peso** — bom para *tilt* em props/gols, não como motor de 1X2.

### 2.4 Nível TREINADOR

| Sinal | Evidência | Efeito esperado | Direção do pick | Força |
|---|---|---|---|---|
| **H2H entre os dois técnicos** | Transfermarkt "Record against another manager" (W/D/L/PPM) | Matchup tático persistente | ↑ Leve viés pro técnico dominante (se amostra ≥ ~6 jogos) | Moderada (confundida por elenco) |
| **Técnico enfrentando ex-clube ("revanche")** | **Sem estudo** isolando treinadores — só vale para jogadores | Narrativa, não edge de resultado | ⚠️ Usar como sinal de **viés de mercado** (*fade* contrarian), não seguir a narrativa | Fraca/mito |

> ⚠️ **"Técnico revanche" é folclore.** Não há evidência de que treinador rende mais contra o ex-clube. A leitura segura é o **oposto**: se o público supervaloriza a "revanche" e move a linha, há valor em **apostar contra** o exagero emocional.

---

## 3. Como obter a rivalidade

São **dois casos de uso**, como em [clima.md](./clima.md#3-como-obter-o-clima): gerar o pick (jogo futuro) e validar/enriquecer (histórico).

### 3.1 Detectar e quantificar a rivalidade do confronto

Construir um **Índice de Rivalidade contínuo (0–1)** por par de times, combinando:

1. **Whitelist curada** (flag binário "é derby"): listas da [Wikipedia](https://en.wikipedia.org/wiki/List_of_association_football_rivalries) (e Wikidata), [derby.ist](https://derby.ist/all), [footballderbies.com](https://www.footballderbies.com/) (este dá **nota 0–10** por confronto).
2. **Proximidade geográfica** entre estádios (geocoding via **Wikidata P625** / openfootball): peso inverso à distância — **< 30 km ≈ derby local forte**. Mesma cidade/região reforça.
3. **Carga do H2H**: nº de confrontos + variância de resultados + **média de cartões acima da baseline da liga**.
4. **(Opcional) Sentimento/volume social** (X/Reddit) e **score Know Rivalry** (Tyler & Cobbs) quando existir para o par.

> **A medida acadêmica de referência** é a escala de **Tyler & Cobbs / Know Rivalry**: rivalidade como **contínuo** (não binário), medida por alocação de **100 pontos** entre os adversários de um time, gerando **Rivalry Score** (0–100), **Dyad Score** (agregado dos dois lados, 0–200) e **Difference Score** (assimetria — quando só *um* lado considera clássico). Cobertura ainda focada em MLS/EUA (CC BY-SA 4.0), mas é o framework citável para construir um score próprio.

### 3.2 Sinais por nível (onde mora cada dado)

- **Time/clássico:** whitelist + geocoding + H2H (acima).
- **Torcida/risco:** classificação de risco e [estatísticas do Home Office](https://www.gov.uk/government/statistics/football-related-arrests-banning-orders-202425-domestic-season) (Inglaterra), [stadium bans da UEFA](https://www.uefa.com/running-competitions/disciplinary/stadium-bans/), notícias (Sky/ESPN) / **GDELT** para "high risk" e torcida única; **attendance** (taxa de lotação) via API-Football como proxy de pressão.
- **Jogador (lei do ex):** cruzar **elenco escalado × histórico de transferências**. Base: **[transfermarkt-datasets](https://github.com/dcaribou/transfermarkt-datasets)** (tabelas `transfers` + `appearances` + `game_lineups`); enriquecer com **API-Football `/transfers`**, **worldfootballR** (`tm_player_transfer_history()`), **Wikidata SPARQL** (P54 + datas). O *tipo* da saída (`Loan`/dispensa/corte salarial) alimenta o **índice de rancor**.
- **Treinador:** H2H via **Transfermarkt "Record against another manager"** (`/trainer/{id}/bilanztrainer`) e **worldfootballR**; flag ex-clube via **Wikidata P6087** + datas.

### 3.3 Comparativo rápido de fontes

| Fonte | O que dá p/ rivalidade | Custo | Cobertura | Observação |
|---|---|---|---|---|
| **football-data.co.uk** | Cartões, escanteios, faltas **e odds + closing** (CSV) | **Grátis** | Grandes ligas europeias | **Padrão-ouro p/ backtest** de cartões/empate |
| **Club Football Match Data 2000–2025** ([Kaggle/GitHub](https://github.com/xgabora/Club-Football-Match-Data-2000-2025)) | Stats + **odds históricas** | Grátis | 27 países / 42 ligas | Ótimo p/ validar valor vs mercado |
| **API-Football** | Faltas/cartões/escanteios, attendance, `/transfers`, H2H | Free 100 req/dia; pago ~US$19+/mês | 1.100+ ligas | Cap free inviabiliza ingestão em escala |
| **transfermarkt-datasets** | Histórico de transferências (lei do ex) | Grátis (CSV/Parquet) | Grandes ligas | Validar frescor (perda em 2024/25) |
| **Wikipedia / Wikidata** | Whitelist de derbies + coords de estádio (P625) | Grátis (CC BY-SA / CC0) | Global | Sem score de intensidade — só presença/tipo |
| **Know Rivalry (Tyler & Cobbs)** | Score de rivalidade validado (0–100 / dyad 0–200) | Grátis (CC BY-SA) | MLS/EUA | Framework citável; pouca cobertura global |
| **Home Office / UEFA bans** | Risco de torcida, proibição de visitante | Grátis | Inglaterra / UEFA | Proxy de "jogo quente" |

---

## 4. Como aplicar no pick

1. **Calcular** o Índice de Rivalidade do confronto (§3.1) e levantar os sinais por nível (§3.2): torcida (presente/única/banida + lotação), ex-jogadores escalados, H2H de técnicos.
2. **Classificar** a temperatura do jogo (baixa / média / alta rivalidade) e os modificadores (mando neutralizado? ex-jogador motivado visitante?).
3. **Ajustar** as estimativas do modelo quantitativo:
   - **Cartões/faltas:** índice alto → desloca para **over** (sempre normalizando pela **baseline de cartões da liga** e pelo **árbitro escalado** — ver §6).
   - **Mando:** torcida cheia → reforça o mandante; **torcida única/ban** → calibra **para baixo** a vantagem de casa.
   - **1X2:** derby → **desconto no mando do favorito** e leve peso a **empate/X2** (nunca *fade* cego do favorito).
   - **Props do ex-jogador:** leve **over** em chutes/gols, ponderado por mando (visitante no ex-estádio) e rancor.
4. **Explicar** (camada LLM): o pick **sempre mostra o porquê** — ex.: *"over 4,5 cartões reforçado: clássico de alto risco (torcida única), árbitro acima da média de cartões e H2H historicamente faltoso."*

> **Não dupla-contar com o mercado.** Em **grandes jogos de ligas líquidas** o efeito derby **já está na linha** (over de gols inflado ~2,8 vs xG ~2,35; odds de favorito comprimidas). O valor aparece em **mercados secundários** (cartões, escanteios, empate) e **ligas de menor volume**, onde o book ajusta de forma grosseira. Combinar com o **favourite-longshot bias** (público supervaloriza o azarão/upset do clássico).

---

## 5. Calibração (transformar heurística em número)

Antes de a rivalidade virar peso fixo, validar com o histórico da liga do MVP:

1. Montar a **whitelist** de pares-rivais e o Índice de Rivalidade (§3.1) para todos os jogos das últimas N temporadas.
2. Separar os jogos em faixas (sem rivalidade / média / alta).
3. Comparar, por faixa: **média de cartões/faltas**, **taxa de vitória do mandante**, **taxa de empate**, **média de gols** e — crucial — **resultado vs. odd de fechamento** (a rivalidade só é EV+ se **bater o mercado**).
4. Para a lei do ex: medir gols/finalizações de ex-jogadores **vs. ex-clube** contra a baseline deles.
5. Só então fixar os limiares do índice e a magnitude de cada ajuste — substituindo os valores "de partida" da §2.

> Esse passo separa uma regra **calibrada** de "achismo de clássico". Enquanto não houver calibração, a rivalidade entra como sinal **qualitativo e de baixo peso**, e o pick deixa isso explícito.

---

## 6. Limitações e cuidados

- **Não generaliza entre ligas.** O efeito "mais faltas" é forte na Premier League, mas **some ou inverte** em outras (o Derby d'Italia tem *menos* faltas que a média). Calibrar **por liga e por rivalidade específica**, não por "é clássico".
- **Cartões ≠ agressividade pura.** Parte do excesso de cartões vem do **viés do árbitro** sob pressão de torcida, não só da violência dos jogadores. **Normalizar pelo árbitro escalado** e pela baseline da temporada (há inflação estrutural de cartões ano a ano).
- **Under é mito frágil.** Não apostar under só por ser clássico — a evidência de "menos gols" é mista (academia diz menos chances; books dizem mais gols).
- **"Favorito sempre tropeça" não tem dado.** O único ajuste defensável é o **desconto no mando**; *fade* cego do favorito por elenco é narrativa.
- **Treinador-revanche é folclore.** Sem estudo. Tratar como possível **viés de mercado** a explorar, não como motivação real.
- **Lei do ex sem magnitude pública.** O efeito existe (peer-reviewed) mas o tamanho não foi divulgado → manter **peso baixo-moderado**.
- **Assimetria da rivalidade.** Nem sempre os dois lados se odeiam igual (Difference Score). Um confronto pode ser clássico só para um dos times — ponderar o lado mais "investido".
- **Dados frágeis/ToS.** Várias fontes dependem de scraping (Transfermarkt, footballderbies, derby.ist) e dos Termos de Uso; manter redundância e validar frescor.
- **Não é determinístico.** Rivalidade *desloca a tendência* (mais cartões, mando menor); não garante nada. Posicionar como probabilidade, nunca como "bilhete certo" (riscos de jogo responsável no [overview](../visao-geral.md#13-riscos-e-considerações)).

---

## Decisões em aberto

1. **Composição e pesos do Índice de Rivalidade** (whitelist vs distância vs H2H vs social) — fixar após calibração da §5. `[A confirmar]`
2. **Limiares de faixa** (média/alta rivalidade) e **magnitude do ajuste** por mercado (cartões, 1X2, empate). `[A confirmar]`
3. **Fonte da whitelist de derbies** em produção: Wikipedia/Wikidata, derby.ist, footballderbies, ou curadoria manual? `[A confirmar]`
4. **Cadastro de estádios** (lat/long para distância + status de cobertura/torcida única) — compartilhar com o cadastro do [clima.md](./clima.md#decisões-em-aberto). `[A confirmar]`
5. **Lei do ex:** entra já no MVP (exige cruzar escalação × transferências em tempo real) ou fica para a Fase 2? `[A confirmar]`
6. **Peso relativo** da rivalidade frente às demais dimensões (forma, lesões, mercado, clima). `[A confirmar]`
7. **Mercados-alvo:** priorizar cartões/escanteios (onde sobra valor) já no MVP, mesmo que o overview comece com 1X2 + over/under 2.5? `[A confirmar]`

---

## Referências

**Medição / tipologia**
- [Know Rivalry Project (Tyler & Cobbs)](https://knowrivalry.com/research/) — escala de rivalidade, 100 pontos, Rivalry/Dyad/Difference Score (CC BY-SA 4.0).
- Tyler & Cobbs, [*All Rivals Are Not Equal*](https://journals.humankinetics.com/view/journals/jsm/31/1/article-p1.xml) (Journal of Sport Management, 2017) e *Rival conceptions of rivalry* (ESMQ, 2015) — 10 ingredientes em 3 categorias.
- [footballderbies.com](https://www.footballderbies.com/) (notas 0–10) · [Wikipedia — rivalries](https://en.wikipedia.org/wiki/List_of_association_football_rivalries) · [derby.ist](https://derby.ist/all).

**Efeito no jogo (cartões, mando, árbitro)**
- HSAC — [*Do Derbies Feature More Aggression?*](https://harvardsportsanalysis.org/2015/01/premier-league-do-derbies-feature-more-aggression/) e a [contra-análise europeia (2018)](https://harvardsportsanalysis.org/2018/03/an-analysis-of-aggression-in-major-european-soccer-rivalries/) — efeito não generaliza.
- Volossovitch et al. — [*Home advantage in derby and non-derby matches (Brasil 2007–2011)*](https://www.researchgate.net/publication/278158148) — mando 52,4%→30,0%.
- [*Home-bias in referee decisions: Ghost Matches (COVID)*](https://www.sciencedirect.com/science/article/pii/S0165176520303815) e [*No Fans–No Pressure* (Frontiers)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8416626/) — viés de árbitro causal.
- [*A complete season with attendance restrictions* (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9261922/) e [*The size of the crowd and home advantage*](https://www.sciencedirect.com/science/article/pii/S2667239124000261) — dose-resposta.

**Jogador / treinador**
- Assanskiy et al. — [*Prove them wrong: athletes vs former clubs*](https://www.sciencedirect.com/science/article/abs/pii/S2214804322000532) (JBEE, 2022) · cobertura: [HSE](https://www.hse.ru/en/news/research/696201233.html), [Phys.org](https://phys.org/news/2022-07-professional-athletes-clubs.html).
- [Transfermarkt — Record against another manager](https://www.transfermarkt.us/zinedine-zidane/bilanztrainer/trainer/21284) · [worldfootballR](https://jaseziv.github.io/worldfootballR/articles/extract-transfermarkt-data.html).

**Torcida / risco**
- [Home Office — Football-related arrests & banning orders](https://www.gov.uk/government/statistics/football-related-arrests-banning-orders-202425-domestic-season) · [UEFA — Stadium bans](https://www.uefa.com/running-competitions/disciplinary/stadium-bans/) · [NPCC — Policing Football](https://library.college.police.uk/docs/NPCC/Policing-Football-Operational-Advice-2022.pdf).
- ESPN Brasil — [torcida única](https://www.espn.com.br/futebol/paulista/artigo/_/id/14897943).

**Mercado / dados**
- [Favourite-longshot bias (Wikipedia)](https://en.wikipedia.org/wiki/Favourite-longshot_bias) · [football-data.co.uk](https://www.football-data.co.uk/) · [Club Football Match Data 2000–2025](https://github.com/xgabora/Club-Football-Match-Data-2000-2025) · [API-Football](https://www.api-football.com/) · [transfermarkt-datasets](https://github.com/dcaribou/transfermarkt-datasets).
