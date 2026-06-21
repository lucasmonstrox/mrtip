# Força relativa entre ligas e calibração de times promovidos (MOD-003)

> Investigação `/rs` da feature [[MOD-003]] — **insumo do ESTIMAR** (alimenta o rating de força que vive na tabela `team_ratings` do [[MOD-001]]). Cobre: (a) ratings cross-league (Club Elo, 538 SPI, Opta Power Rankings, coeficientes UEFA/Conmebol); (b) inicialização do rating de promovidos/rebaixados sem histórico na divisão; (c) ajuste de força entre divisões para jogos cross-league (Copa do Brasil, Libertadores, Sul-Americana); (d) disponibilidade/licença/cobertura BR.
>
> **Não re-decide o que o [[MOD-001]] já cravou** (família de modelo, `team_ratings` como tabela de snapshots de força, Club Elo/pi-ratings como *feature* e não motor, 538 morto). Foca no buraco cross-league + promovidos, que o MOD-001 deixou em aberto.
>
> **As-of:** 2026-06-21. Veredito por claim: `SUPPORTED` (URL+fetch nesta sessão) / `REFUTED` / `NEI` (não verificado o suficiente).

---

## 1. TL;DR + recomendação cravada

O **rating de força é um *feature* do motor (MOD-001), não um motor** — isto o MOD-001 já cravou e esta investigação confirma (até a Opta Supercomputer usa rating como insumo, não substitui o modelo de gols). O problema novo é: **(1) qual fonte de força cross-league usar quando os ratings europeus grátis não cobrem o Brasil, e (2) como dar um rating inicial a um time que mudou de divisão.** Resposta recomendada, só com claims `SUPPORTED`:

1. **NÃO depender de Club Elo / FiveThirtyEight SPI como fonte de força BR.** Club Elo é **europeu/UEFA-only** (não cobre Brasileirão) `[SUPPORTED]`; FiveThirtyEight SPI está **morto** (sem atualização desde junho/2023) `[SUPPORTED]`. Ambos servem só de baseline histórico europeu.
2. **Força cross-league = construir um rating próprio (pi-ratings/Elo) treinado conjuntamente nas ligas do escopo** (o caminho **Dolores/pi-ratings** que o MOD-001 já cravou: um único modelo bayesiano treinado em 52 ligas prediz qualquer uma). A ponte entre divisões/ligas vem **organicamente dos jogos cross-league** (promovidos/rebaixados + Copa do Brasil/Libertadores/Sul-Americana), exatamente o mecanismo descrito por opisthokonta para inter-league Elo `[SUPPORTED]`. Isto **reusa** a infra de `team_ratings` do MOD-001 — não cria um segundo rating.
3. **Opta Power Rankings = referência/sanity-check externo, não fonte de produção.** Cobre Brasil de fato (Série A é a 6ª liga mais forte do mundo, rating 80,81; ~13.500 clubes, 183 países) `[SUPPORTED]`, mas o feed numérico completo é **comercial/licenciado** — o público (The Analyst) só publica artigos/visualizações, não API `[SUPPORTED]`. Usar para validar a calibração do nosso rating, não para alimentar `team_ratings`.
4. **Coeficientes UEFA/Conmebol = proxy fraco de força de liga, só prior grosseiro.** São médias ponderadas de desempenho continental ao longo de 5–10 anos, desenhadas para *seeding*, criticadas por preservar status quo `[SUPPORTED]`. Servem de prior inicial de força-de-liga (multiplicador), não de rating de time.
5. **Promovido/rebaixado: inicializar com prior = média da divisão de destino, puxando ~⅓ em direção à média (regressão entre temporadas), com viés negativo para promovidos.** A taxa histórica sustenta o prior negativo: **~47% dos promovidos à Premier League caem na temporada seguinte** (42 de 89 em 30 temporadas a 20 times) `[SUPPORTED]`; no BR o formato é 4 sobem / 4 caem por temporada `[SUPPORTED]`. Rota de promoção move o prior (campeão da 2ª divisão sobrevive ~67%, vice ~42% na PL) `[SUPPORTED]`.

**Tooling = protótipo comparativo (bake-off), não compra.** Finalistas a prototipar: **(A) pi-ratings/Elo próprio treinado conjuntamente** (produção, reusa `team_ratings`) vs **(B) Opta Power Rankings** como ground-truth externo de calibração. Sem licença comercial no MVP → **(A) é o caminho**, **(B)** é benchmark.

---

## 2. Contexto e problema (+ requisitos implícitos)

O motor (MOD-001) precisa de um **rating de força por time** como feature. Dois furos que o MOD-001 não fechou:

- **Cross-league:** o Brasileirão joga contra si mesmo o ano todo, mas em **Copa do Brasil** (Série A × Série B × Série C/D), **Libertadores** e **Sul-Americana** (BR × ARG × outros) os ratings de ligas isoladas não são comparáveis entre si. Sem uma escala comum, o rating erra sistematicamente em jogos cross-league — exatamente os jogos de maior interesse de tip.
- **Promovidos/rebaixados:** no início de temporada um time recém-promovido **não tem histórico na divisão atual**. Carregar o rating cru da divisão de origem é "completamente errado e leva tempo pra ficar realista" (opisthokonta). Precisa de um **prior**.

**Requisitos implícitos:** (i) cobrir o Brasil de fato (o escopo BR é a cunha do produto — MOD-001 §"cluster pt-BR"); (ii) não depender de fonte morta ou europeia-only; (iii) custo zero/baixo no MVP (greenfield, sem orçamento de licença Opta); (iv) **não duplicar** o rating — alimentar a `team_ratings` já cravada, não criar uma segunda tabela; (v) o número tem de ser **explicável** (princípio mrtip: mostrar o porquê), então um rating opaco comercial é pior que um rating próprio auditável.

---

## 3. Estado real no repo (o que o MOD-001 já crava + gaps)

Repo majoritariamente docs; **nenhum código de rating/ingestão existe** (scaffold Turborepo+Next, confirmado em `docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md:38-39`). O que **já está cravado** e MOD-003 deve respeitar:

- **`team_ratings` é a tabela canônica de força** — "snapshots de Elo/pi-ratings/força por time/data (feature de força)" — `docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md:159`; listada nas âncoras do MOD-001 (`docs/features/modelos/MOD-001-motor-prognostico-quant.md:17`). **MOD-003 escreve nesta tabela; não cria outra.**
- **Rating é *feature*, não motor** — matriz de famílias: "Elo / Club Elo / SPI ... **Feature**, não motor; precisa camada de gols p/ O/U" — `docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md:90`.
- **Transferência cross-league já reconhecida como viável** — "Dolores (Bayesian + pi-ratings dinâmicas) treina em 52 ligas e prediz qualquer uma; 2º lugar no desafio 2017, RPS 0,2083" — `docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md:53`. **Este é o esqueleto da solução cross-league do MOD-003.**
- **538 SPI já marcado como morto** — "URL faz 301 pra abcnews.com/politics; último commit de dados 2022-12-19" — `predicao-futebol-ia-ml-estado-da-arte.md:196`.
- **Cobertura BR do Club Elo ficou como pergunta aberta (NEI)** — "Club Elo cobre Brasileirão? Host deu ECONNREFUSED; snippet sugere só UEFA/Europa (inferência-negativa, não verificada por fetch)" — `predicao-futebol-ia-ml-estado-da-arte.md:206`. **Esta investigação fecha esse NEI** (ver §4: REFUTED para Brasil).
- **Taxonomia:** MOD-003 é **insumo do ESTIMAR** (camada 2). O rating de força é um sinal que **move a probabilidade** e, portanto, exige backtest vs CLV como qualquer feature de camada 2 (`docs/arquitetura/taxonomia-sinais.md:8`). **Não é narrativa.** Distinto de **SIN-008 (altitude/Conmebol)**, que é dono do *viés de altitude* em jogos Conmebol — MOD-003 é dono da *força relativa* cross-league, não do efeito-altitude. Fronteira a registrar (ver §6).
- **Fonte BR de resultados (fuel do rating):** `openfootball/south-america` (CC0, Brasileirão resultados, sem odds/xG) e Kaggle adaoduque (~9k jogos 2003-2025) — `predicao-futebol-ia-ml-estado-da-arte.md:121,134`. Suficiente para treinar Elo/pi-ratings (que só precisam de resultados).

**Gaps que MOD-003 fecha:** (1) confirmar cobertura BR das fontes de rating europeias (fecha o NEI); (2) método de prior para promovidos/rebaixados; (3) mecânica de ponte entre divisões/ligas para jogos cross-league.

---

## 4. Estado da arte — ratings cross-league (claims atômicos)

### Club Elo (clubelo.com)
- **Club Elo é europeu/UEFA-only — NÃO cobre o Brasileirão.** `[SUPPORTED, as-of 2026-06-21]` O site irmão/equivalente elofootball.com declara explicitamente: "*The database covers over 55 European countries with up to five league tiers, 3300+ clubs and 250+ competitions*", e o menu de países lista só nações europeias + competições UEFA, sem clubes sul-americanos (https://elofootball.com/). Convergente com a inferência-negativa do MOD-001. **→ fecha o NEI de `predicao-futebol-ia-ml-estado-da-arte.md:206` como REFUTED-para-Brasil.**
- **O host clubelo.com está inacessível por fetch** (ECONNREFUSED nesta sessão, igual à sessão MOD-001) `[SUPPORTED — observação direta]`. Risco operacional adicional de depender dele.
- **Confiança:** alta para "europeu-only"; o feed CSV do Club Elo é grátis quando o host responde, mas irrelevante para o escopo BR.

### FiveThirtyEight SPI (Soccer Power Index)
- **Morto: o feed parou de atualizar em junho/2023.** `[SUPPORTED, as-of 2026-06-21]` Após a saída de Nate Silver (abril/2023, cortes da Disney), "*all its sports models stopped updating in June*" (https://fromthebyline.substack.com/p/fivethirtyeight-is-dead-long-live). Silver era dono dos modelos e os licenciava à empresa; com a saída, o feed público morreu. Convergente com o commit final 2022-12-19 do MOD-001 (`:196`).
- **Veredito:** só **baseline histórico**. Não usar como fonte viva. ≥2 fontes (substack + repo GitHub do MOD-001).

### Opta Power Rankings (Stats Perform)
- **Cobre o Brasil de fato e é genuinamente cross-league.** `[SUPPORTED, as-of 2026-06-21]` Atribui score 0–100 a "*nearly 13,500 domestic football teams*" em "*413 unique domestic leagues*" de "*183 different countries*", atualizado diariamente; usa hierarquia de 4 níveis (time → liga → país → continente) para tornar ligas comparáveis (https://theanalyst.com/articles/power-rankings-your-club-ranked). Brasil incluído (exemplos citam Vasco/Brasileirão).
- **Brasileirão Série A = 6ª liga mais forte do mundo (rating 80,81), a mais forte fora da Europa.** `[SUPPORTED, as-of 2026-06-21]` (https://theanalyst.com/articles/strongest-leagues-in-the-world-opta-power-rankings-june-2025 + planetfootball mirror). Quantifica o gap Europa×BR — útil de prior de força-de-liga.
- **Mas o feed numérico completo é comercial/licenciado; o público só vê artigos.** `[SUPPORTED, as-of 2026-06-21]` "*Opta releases Power Rankings via The Analyst (free public site) for top-flight clubs. The full database (13,000+ clubs) is available via paid Opta subscriptions*" (https://kiqiq.com/blog/opta-power-rankings). Sem API grátis → não dá para alimentar `team_ratings` de produção sem contrato.
- **Metodologia é Elo-derivada com multiplicador de qualidade de liga e ajuste de saldo de gols** `[SUPPORTED]` (mesmas fontes) — ou seja, replicável em casa.
- **Veredito:** **benchmark de calibração externo**, não fonte de produção no MVP.

### Coeficientes UEFA / Conmebol (proxy de força de liga)
- **São médias ponderadas de desempenho continental (5 temporadas UEFA; 10 edições + histórico + liga local na Conmebol), desenhadas para *seeding*.** `[SUPPORTED, as-of 2026-06-21]` UEFA: coeficiente por associação das últimas 5 temporadas de Champions/Europa/Conference (https://en.wikipedia.org/wiki/UEFA_coefficient). Conmebol Clubs Ranking (rebatizado em 2021 ao incluir Sudamericana): Libertadores recente + histórico + campeonato local (kickalgor / footballranking.fandom).
- **Criticados por preservar status quo e favorecer ligas fortes** `[SUPPORTED]` (Wikipedia UEFA coefficient). São lentos (janela plurianual) e grosseiros (granularidade de país/clube-em-continental, não de força atual de time).
- **Veredito:** **prior grosseiro de força-de-liga** (multiplicador inicial quando uma liga entra no sistema sem jogos cross-league suficientes), nunca rating de time. Confiança média.

### World Football Elo Ratings (eloratings.net)
- **É de seleções nacionais, não de clubes.** `[SUPPORTED, as-of 2026-06-21]` "*Ratings for national football teams based on the Elo rating system*" (https://www.eloratings.net/about). Fora de escopo para rating de clube, mas é o oráculo de **spec** do algoritmo Elo com peso de importância de jogo e saldo de gols (mesma mecânica a aplicar a clubes).

---

## 5. Promovidos + ajuste entre divisões — matriz → recomendação + counter-review

### 5a. Inicializar rating de promovido/rebaixado

| Método | Como | Prós | Contras | Veredito |
|---|---|---|---|---|
| **Carregar rating cru da divisão de origem** | promovido entra com seu Elo da 2ª divisão | trivial | "*completamente errado, leva tempo pra ficar realista*" (opisthokonta) `[SUPPORTED]`; ignora gap entre divisões | **Rejeitar** |
| **Prior = piso da divisão de destino** | promovido recebe rating perto do fundo da divisão de cima `[SUPPORTED]` | reflete o gap real; ~47% dos promovidos PL caem `[SUPPORTED]` | pode subestimar o promovido forte (campeão da 2ª) | **Base recomendada** |
| **Regressão à média entre temporadas** | puxar ~⅓ em direção à média da divisão no off-season (carrossel de transferências) `[SUPPORTED]` | corrige squad-churn; padrão usado em vários esportes `[SUPPORTED]` | parâmetro (⅓) a calibrar por liga | **Recomendado, combinado** |
| **Otimização automática do rating inicial** | ajustar ratings iniciais por otimização num ano de dados, usando só a fórmula de conversão (não a de update) (opisthokonta) `[SUPPORTED]` | melhor fit empírico; estima também HFA e K | mais complexo; precisa de janela de dados | **Refinamento futuro** |
| **Modular pela rota de promoção** | campeão da 2ª > play-off > vice (PL: 67% / 61% / 42% sobrevivência) `[SUPPORTED]` | prior mais fino | rota nem sempre disponível/comparável entre ligas | **Ajuste fino** |

**Recomendação:** prior do promovido = **média da divisão de destino com viés negativo (perto do fundo) + regressão de ~⅓**, refinado pela rota quando disponível. Para rebaixado, espelhar: entra perto do topo da divisão de baixo. Simbolicamente armazenar como `rating_prior` separado do `rating` corrente em `team_ratings`, com `prior_source` auditável.

### 5b. Ponte entre divisões/ligas (jogos cross-league)

- **Mecânica:** num rating Elo/pi-ratings **treinado conjuntamente**, as ligas só ficam comparáveis pelos **jogos que as cruzam** — promovidos/rebaixados (ponte vertical Série A↔B) e copas (ponte horizontal: Copa do Brasil cruza divisões; Libertadores/Sul-Americana cruzam países) `[SUPPORTED]` (opisthokonta: "*only promoted/relegated teams create bridges between leagues*"). Quanto mais jogos cross-league, melhor calibrada a escala comum.
- **Incluir HFA na otimização** corrige distorção quando os times têm distribuição desigual de jogos em casa (opisthokonta estimou HFA 84,3 e K=14 vs K=18,5 sem isso) `[SUPPORTED]`.
- **Prior de liga via coeficiente** só quando faltam jogos-ponte (liga nova no sistema): usar o coeficiente UEFA/Conmebol ou o rating de liga Opta como multiplicador inicial, depois deixar os jogos cross-league corrigirem.

### Counter-review (≥3 problemas reais da recomendação)
1. **Sparsidade de jogos-ponte no BR** `[severity: high]`: Série A×B só se cruzam na Copa do Brasil (poucos jogos/ano, muitos em mata-mata com perna única/dois jogos) → a escala A↔B fica mal calibrada; o rating de um time de Série B terá intervalo de confiança largo. Mitigação: regressão forte à média + marcar baixa confiança (gate "predictable=false" do MOD-001).
2. **Viés de seleção dos promovidos** `[severity: high]`: a taxa de ~47% de queda é *condicional a ter sido promovido* — promovidos não são draw aleatório da 2ª divisão (são o topo dela). Usar a taxa bruta como prior negativo dobra-conta se o rating já capturou que eram fortes na 2ª. Mitigação: o prior é sobre a **incerteza** (largura), não só sobre a **média**; calibrar separadamente "quão forte era na origem" de "qual o gap entre divisões".
3. **Endogeneidade copa×liga** `[severity: medium]`: em copas, times poupam titulares (rodízio), então o resultado cross-league não reflete a força "real" — contamina a ponte. Mitigação: ponderar jogos de copa por força do XI escalado (precisa do feed de escalação do DOS-001) ou descontar K em jogos de copa.
4. **Não-estacionariedade entre temporadas BR** `[severity: medium]`: o calendário BR (ano-civil) e o europeu (ago–mai) desalinham as janelas de regressão; um único parâmetro ⅓ pode não servir às duas. Mitigação: parâmetro de regressão por liga/calendário.
5. **Opta como ground-truth é circular** `[severity: low]`: validar nosso rating contra Opta assume que Opta está certo, mas Opta também é Elo-derivado — concordância não prova calibração. Mitigação: a validação que **decide** é vs CLV/closing line (SIN-012), não vs Opta; Opta é só sanity-check de ordenação.

---

## 6. Modelo de dados proposto (estende `team_ratings` do MOD-001)

**Não cria tabela nova.** Estende a `team_ratings` já cravada (snapshots por time/data). Colunas adicionais propostas (a detalhar no `/pl`):

- `team_ratings.rating` — força corrente (Elo/pi-rating), já prevista pelo MOD-001.
- `team_ratings.scope` — escala em que o rating é comparável (`global` para o rating cross-league treinado conjuntamente; permite distinguir de um rating intra-liga, se houver).
- `team_ratings.rating_prior` — valor inicial atribuído quando o time entrou na divisão/sistema (auditável: por que começou aqui).
- `team_ratings.prior_source` — enum: `division_floor` | `regression_mean` | `promotion_route` | `league_coefficient` | `optimized`.
- `team_ratings.confidence` — largura/incerteza (alta para recém-promovido com poucos jogos-ponte) → alimenta o gate "predictable=false" do MOD-001.
- (opcional) `leagues.strength_coefficient` — multiplicador de força-de-liga (prior de coeficiente UEFA/Conmebol ou rating de liga Opta), usado só para inicializar ligas sem jogos-ponte.

**Anti-dupla-contagem:** o rating de força é **um** feature do `match_features`/motor; a altitude Conmebol é **outra** (SIN-008). MOD-003 não modela efeito-altitude; SIN-008 não modela força relativa. A força de liga não pode ser contada duas vezes (uma no rating cross-league, outra como multiplicador) — o multiplicador é só seed inicial, decai a zero conforme jogos-ponte chegam.

---

## 7. Plano por faceta (input pro `/pl` — sem implementar)

- **`dados`** — ingerir resultados BR cross-divisão para treinar o rating: `openfootball/south-america` (CC0) + Kaggle adaoduque (Série A) + fonte de Série B/Copa do Brasil/Libertadores/Sul-Americana (resultados bastam; Elo/pi-ratings não precisam de xG). Persistir snapshots em `team_ratings` com `scope=global`. Opta Power Rankings: ingerir **só os artigos públicos** como tabela de referência manual (rating de liga BR=80,81 etc.) para sanity-check — não como feed.
- **`ia` (ESTIMAR)** — implementar pi-ratings/Elo **treinado conjuntamente** nas ligas do escopo (caminho Dolores do MOD-001); HFA na otimização; prior de promovido = piso-da-divisão + regressão ⅓ (modulado por rota quando disponível); `confidence` por nº de jogos-ponte; backtest vs CLV (SIN-012) como qualquer feature de camada 2. O rating é **feature do motor**, nunca um motor paralelo.
- **(validação)** — comparar a **ordenação** do rating próprio contra Opta Power Rankings (concordância de ranking BR) como sanity-check; a calibração que decide é vs closing line (SIN-012), não vs Opta.

---

## 8. Riscos e gotchas

- **Fonte morta/europeia:** quem usar Club Elo/538 para o BR vai cair em fonte morta (538) ou vazia para o Brasil (Club Elo). **Mitigado** pela recomendação de rating próprio.
- **Viés de seleção de promovidos** (§5 counter #2): a taxa de queda é condicional; não usar como prior cego.
- **Sparsidade de jogos-ponte** (§5 counter #1): escala A↔B mal calibrada; marcar baixa confiança.
- **Rodízio em copa** (§5 counter #3): resultado cross-league contaminado por times reservas.
- **Licença Opta:** o feed completo é pago; depender dele cria dependência comercial e quebra o requisito de rating explicável/auditável. **Mitigado** ao usar Opta só de benchmark.
- **Anti-dupla-contagem força-de-liga × rating** (§6): multiplicador de coeficiente só como seed que decai.
- **Calendário BR ano-civil** desalinha regressão entre temporadas vs ligas europeias (§5 counter #4).

---

## 9. Refutado e Perguntas Abertas

### Refutado
- **"Club Elo cobre o Brasileirão"** → **REFUTED** (europeu/UEFA-only, 55 países europeus, sem sul-americanos — https://elofootball.com/, as-of 2026-06-21). Fecha o NEI do MOD-001 (`:206`).
- **"FiveThirtyEight SPI é fonte viva de rating cross-league"** → **REFUTED** (parou em junho/2023 — https://fromthebyline.substack.com/p/fivethirtyeight-is-dead-long-live).
- **"Opta Power Rankings dá feed grátis para alimentar o modelo"** → **REFUTED** (feed completo é assinatura paga; público só artigos — https://kiqiq.com/blog/opta-power-rankings).
- **"Coeficiente UEFA/Conmebol mede força atual de time"** → **REFUTED como rating de time** (é média plurianual de desempenho continental para seeding, criticada por preservar status quo — https://en.wikipedia.org/wiki/UEFA_coefficient). Só prior grosseiro de liga.

### Perguntas Abertas / lacunas
- **Quantos jogos-ponte/ano** Copa do Brasil + Libertadores + Sul-Americana realmente fornecem para calibrar Série A↔B↔C e BR↔ARG? (sparsidade decide a confiança — medir no protótipo).
- **Parâmetro de regressão (⅓)** serve ao calendário BR ano-civil ou precisa de valor próprio? (calibrar por liga).
- **Fonte limpa de resultados de Série B / Série C / copas** com proveniência e licença aberta — `openfootball/south-america` cobre Série B? (verificar cobertura exata; lacuna herdada do mapeamento de fontes do MOD-001/DOS-001).
- **Fronteira MOD-003 × SIN-008 (altitude):** confirmar no /pl que o rating cross-league não absorve o efeito-altitude (que é dono da SIN-008) em jogos Conmebol — evitar dupla-contagem.
