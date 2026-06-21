# Investigação — Viés favorito-azarão (FLB) e dinheiro recreativo (SIN-018)

> Lado **comportamental** do mercado de odds. Complementa o SIN-012 (CLV/closing line, movimento sharp) identificando *onde a linha é menos eficiente por viés sistemático do apostador casual* — não por dinheiro respeitado. Investigação verificada (web fetch + arqueologia interna). Não re-decide o que mercado-odds.md já cravou.
>
> - **Status:** investigado — alta confiança no veredito, média na magnitude exata.
> - **Data:** 2026-06-21.
> - **Âncora:** SIN-012 (anti-dupla-contagem é o eixo). `depende_de: SIN-012`; `impacta: SIN-012`.

---

## 1. TL;DR + recomendação cravada

**O favorite-longshot bias (FLB) e o dinheiro recreativo são fenômenos REAIS e peer-reviewed — mas majoritariamente de mercado de VAREJO / quote-driven, não de casa sharp nem de exchange.** Na closing line da Pinnacle e na Betfair eles estão comprimidos a quase zero; favorito-only continua **EV-negativo** (só perde menos), então "apostar favorito" **não é edge**. O dinheiro de torcida infla a odd do popular, mas a melhor evidência (Flepp/Nüesch/Franck 2016) mostra que **a transparência de preço impede que esse desbalanceamento vire retorno positivo para quem fadeia** — "fade the public" é majoritariamente **já precificado / mito** como estratégia autônoma.

**Recomendação cravada (só SUPPORTED):**

- **CLASSIFICAÇÃO: EXPLICAR + redutor de confiança (VALIDAR), NÃO ESTIMAR.** O FLB/dinheiro recreativo **não** ganha um motor próprio que move probabilidade. Ele entra de duas formas, ambas subordinadas ao SIN-012:
  1. **EXPLICAR (narrativa):** justificar por que um pick de favorito ou de fade-the-public *não* foi tomado, ou contextualizar que a odd do azarão/popular está "cara". Peso ZERO no quant.
  2. **VALIDAR / filtro negativo (regra defensiva):** **evitar longshots** (não apostar contra o justo) e **desconfiar de favorito popular encurtado** — um *guard-rail* que o motor herda, mensurável apenas contra a CLV (§5).
- **Onde sobra um fio de edge real (não no FLB em si):** o mecanismo *redireciona a atenção* para **ligas/mercados de baixa liquidez e soft books**, exatamente onde mercado-odds.md §3 já manda caçar — mas o achado citável é "evite a zebra cara", não "a zebra é EV+".

**Por que não é ESTIMAR (anti-dupla-contagem com SIN-012):** o FLB é um desvio **odd-vs-probabilidade-real** que já está *embutido* na linha de fechamento sharp/exchange — que é justamente a âncora do SIN-012. Modelar FLB como sinal que move probabilidade seria **dupla-contar** a mesma ineficiência que a CLV mede ex-post. O FLB é *insumo do devig* (Shin para mercado assimétrico, já cravado em porta-de-dinheiro), não um motor.

---

## 2. Contexto e problema (+ requisitos implícitos)

**Tema SIN-018:** (a) FLB — azarões sobre-apostados → odds curtas demais; favoritos sub-apostados → valor; (b) magnitude e persistência no futebol moderno / exchanges; (c) dinheiro recreativo — público em times de torcida grande infla a odd do popular (fade-the-public); (d) relação com SIN-012 (CLV) **sem dupla-contagem**.

**Requisitos implícitos:**

- **Não-dupla-contagem é o teste de sobrevivência** (taxonomia-sinais.md:12-14, mercado-odds.md §4). Qualquer sinal só vira quant se for **ortogonal** ao já precificado na closing. FLB falha esse teste em mercado líquido por definição (ele *é* o que a closing já corrige).
- **Odds em centavos (int).** Toda proxy de viés que toque preço usa `match_odds` em centavos (porta-de-dinheiro-odds-e-arredondamento.md; taxonomia-sinais.md:54). Devig por **Shin** (assimétrico/favorito pesado) ou **Power** — já cravado.
- **Honestidade regulatória** (Lei 14.790/2023): nada de "aposte favorito = lucro". O veredito honesto é defensivo (evitar zebra cara), não promessa de ganho.
- **Separar três coisas distintas** que o tema mistura: (i) FLB estrutural (odd-vs-prob); (ii) dinheiro recreativo / sentimento (volume em time popular); (iii) movimento sharp (SIN-012/SIN-019). São eixos diferentes — a matriz do §5 separa.

---

## 3. Estado real no repo (o que já está cravado, com path:linha)

O repo **já investigou FLB e dinheiro recreativo de forma substancial** — não re-pesquisar o decidido. Mapa do que existe:

| Onde | path:linha | O que já cravou |
|---|---|---|
| Regra de mercado | `docs/regras/mercado-odds.md:27` | FLB listado como sinal **Forte (mas encolhendo)**: "Longshots pagam abaixo do justo; favoritos pesados ROI ~0… evitar longshots; pouco edge em favorito pesado líquido". |
| Regra de mercado | `docs/regras/mercado-odds.md:42,48-50` | "Onde NÃO há valor: favoritos pesados em mercados líquidos/sharp (viés já comprimido)"; **§4 anti-dupla-contagem** ("se um sinal já moveu a linha, o EV evaporou"). |
| Regra de mercado | `docs/regras/mercado-odds.md:71` | "O viés favorito-longshot está **encolhendo** em mercados maduros" — ⚠️ ver §9: framing "encolhendo no tempo" **NÃO confirmado** pela fonte citada (Whelan 2024). |
| Mercado 1X2 | `docs/mercados/resultado-1x2.md:103-113` | **Distribuição assimétrica da margem** é fenômeno de **VAREJO**: favoritos menos margem, zebras/empate margem desproporcional. Ressalva já cravada: em Pinnacle (Sestovic SSRN 3035848) **nenhum sinal claro de longshot bias, só leve favorito bias**. |
| Mercado 1X2 | `docs/mercados/resultado-1x2.md:228,238` | Trap §6.1 (FLB de varejo, não generalizar p/ casa sharp) + §6.6 **public games**: "gigante popular atrai dinheiro de torcedor; a casa encurta o favorito popular além do justo → lado contrário pode ter valor". |
| Handicap asiático | `docs/mercados/handicap-asiatico.md:180,184,259,180` | **AH não tem o FLB do 1X2** (atribuído a "Hegarty & Whelan e arXiv 2003.09384"); "time da casa subvalorizado… público pende para grandes favoritos, inflando o handicap do zebra"; trap "viés de publico no favorito famoso". ⚠️ ver §9: a atribuição do arXiv 2003.09384 está **trocada** (é Constantinou, e ele diz que o AH *compartilha* ineficiências do 1X2). |
| Porta de dinheiro | `docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md:46` | **Devig:** Shin p/ mercado assimétrico (favorito pesado); Power default; aditivo gera prob negativa em longshot. Conecta FLB ↔ implementação do devig. |
| Rivalidade | `docs/regras/rivalidade.md:121,144` | "Combinar com o favourite-longshot bias (público supervaloriza o azarão/upset do clássico)"; **"favorito sempre tropeça" não tem dado — não fazer fade cego**. |
| Taxonomia | `docs/arquitetura/taxonomia-sinais.md:10,12-14,54` | SIN-012 é a camada VALIDAR transversal; anti-dupla-contagem; odds em centavos (DOS-001 ingere, SIN-012 valida). |
| Sinal irmão | `docs/features/sinais/SIN-019-*.md` | Steam/sharp-vs-square — **dinheiro recreativo (square)** aparece lá pelo lado da *microestrutura/origem da linha*. Fronteira: SIN-019 = movimento; SIN-018 = viés estático odd-vs-prob. |

**SIN-012 não tem arquivo de feature** (`docs/features/**/SIN-012*` vazio) — ele vive como **regra** em `docs/regras/mercado-odds.md`. SIN-018 referencia a regra, não um feature-file.

**Gaps no repo:**
- Nenhum doc tem a **literatura primária de economia de apostas** do FLB (Cain-Law-Peel; Levitt 2004; Flepp/Nüesch/Franck; Whelan 2024) — só citações soltas. Esta investigação preenche (§4).
- Ausência de **modelo de dados** de proxies de viés (Facebook-Likes/torcida, volume público) — proposto no §6.
- A **contradição "FLB encolhendo no tempo"** (mercado-odds.md:71) vs evidência verificada precisa de correção (§9).

---

## 4. Estado da arte do FLB — claims atômicos (URL + confiança + as-of)

> Verdito por claim: SUPPORTED (≥2 fontes independentes, ≥1 fetchada) / NEI / REFUTED. as-of = 2026-06-21.

**F1 — FLB é regularidade empírica clássica: favoritos têm retorno esperado maior (menos negativo) que longshots.**
SUPPORTED (alta). Cain, Law & Peel (2000, *Scottish J. Political Economy*) no futebol UK; literatura horse-racing origem. URLs: https://ideas.repec.org/a/bla/scotjp/v47y2000i1p25-36.html · https://en.wikipedia.org/wiki/Favourite-longshot_bias (fetchado — exemplo: perder ~5% no favorito vs ~40% no longshot).

**F2 — Magnitude clássica no futebol UK: ~2% de perda em odds curtas (<1.66) vs ~15% em odds longas (>5.00); presente em match-result E placar exato.**
SUPPORTED (alta na direção, média no número exato). Cain-Law-Peel 2000. URL: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=234996 · https://ideas.repec.org/a/bla/scotjp/v47y2000i1p25-36.html. *(Números via síntese de busca atribuída ao paper; PDF primário não fetchado — tratar 2/15% como ordem de grandeza.)*

**F3 — FLB emerge mesmo em mercado competitivo onde apostadores acertam em média, via aversão a risco do bookmaker + carga de margem em eventos de baixa probabilidade (Whelan 2024, Economica 91, doi 10.1111/ecca.12500).**
SUPPORTED (alta). É paper de **mecanismo/teoria**. URL: https://onlinelibrary.wiley.com/doi/10.1111/ecca.12500 (paywall) + resumo fetchado https://www.karlwhelan.com/sports-betting-risk-aversion-and-biased-odds/. ⚠️ **Não** confirma "FLB encolhendo no tempo" — framing de equilíbrio emergente, não de desaparecimento temporal (ver §9).

**F4 — Em casa SHARP (Pinnacle), a closing line de futebol é altamente calibrada — yield esperado≈observado ao longo da faixa de odds, sem padrão direcional favorito-azarão além da margem.**
SUPPORTED (alta). football-data.co.uk, Pinnacle-efficiency (4 temporadas, ~87.960 pares de odds desde 2012/13). URL fetchada: https://www.football-data.co.uk/blog/pinnacle_efficiency.php.

**F5 — Mesmo quando o FLB aparece em casa sharp, é artefato RACIONAL de alocação de margem, não ineficiência explorável: Pinnacle soccer (27.150 jogos 2012–2020) aloca ~0,9% de margem por resultado quase igualmente, e ainda assim o retorno cai monotonicamente com odds mais longas — TODOS os resultados ficam EV-negativos (favorito só perde menos).**
SUPPORTED (alta). DataGolf "fav-longshot-not-a-bias". URL fetchada: https://datagolf.com/fav-longshot-not-a-bias. **→ apostar favorito-only NÃO é lucrativo.**

**F6 — O "FLB revisitado" reforça que parte do efeito é supply-side racional (ponderação de margem), não viés explorável: teste em Pinnacle (tênis, ~94.538 odds 2014–23) deu p=0,50, sem diferença estatística entre perda esperada e observada.**
SUPPORTED (alta). football-data.co.uk "favourite_longshot_bias_revisited_again". URL fetchada: https://www.football-data.co.uk/blog/favourite_longshot_bias_revisited_again.php.

**F7 — Na EXCHANGE (Betfair), FLB é substancialmente reduzido/ausente (margem ~100,5–101%); retornos por faixa de odds não mostram declínio monotônico claro.**
SUPPORTED (média). Síntese de busca + arXiv 2402.02623 (eficiência Betfair). URLs: https://arxiv.org/abs/2402.02623 · https://www.sbo.net/horse-racing/favourite-longshot-bias/. *(Paper primário de FLB-exchange não fetchado limpo — confiança média.)*

**F8 — FLB é estruturalmente fenômeno de mercado bookmaker; a grade de odds bookmaker embute FLB, enquanto grades pari-mutuel tendem a reverse-FLB; em Pinnacle não há longshot bias claro, só leve favorito bias.**
SUPPORTED (média). Sestovic SSRN 3035848 (já citado no repo, resultado-1x2.md:111). URL: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3035848 *(SSRN 403/abstract via busca)*.

**F9 — Asian Handicap NÃO escapa das ineficiências: Constantinou (arXiv 2003.09384, 13 temporadas EPL) acha que o AH "compartilha as ineficiências do mercado tradicional 1X2", com diferenças mas não eficiência plena.**
SUPPORTED (alta) — abstract fetchado. URL: https://arxiv.org/abs/2003.09384. ⚠️ **Corrige** a afirmação do repo (handicap-asiatico.md:180) de que "AH não tem FLB / é eficiente" e a **atribuição trocada** a "Hegarty & Whelan".

### Dinheiro recreativo / sentimento / fade-the-public

**R1 — Bookmakers (quote-driven) dão odds mais favoráveis a clubes populares/torcida grande (shading de sentimento).**
SUPPORTED (alta, ≥3). Franck, Verbeek & Nüesch (16.000+ jogos ingleses; "more favorable odds extended to bets on more popular clubs", amplificado em fins de semana). Forrest & Simmons (sentimento no futebol espanhol/escocês). Levitt 2004 (books desviam do preço de equilíbrio para explorar viés). URLs: https://ideas.repec.org/p/iso/wpaper/0089.html (fetchado) · https://eprints.lancs.ac.uk/id/eprint/44748/1/10.pdf · https://academic.oup.com/ej/article-abstract/114/495/223/5086012.

**R2 — Esse shading é fenômeno do regime quote-driven (bookmaker), NÃO (ou muito menos) da exchange Betfair.**
SUPPORTED (média-alta). Franck/Verbeek/Nüesch: "o desenho organizacional de um mercado quote-driven permite ao dealer tirar proveito das preferências sentimentais". URL fetchada: https://ideas.repec.org/p/iso/wpaper/0089.html. *(Grupo de pesquisa único como fonte do contraste explícito; direcionalmente consistente com exchanges = mais eficientes.)*

**R3 — Dinheiro público concentra em "over"/favorito/casa — desbalanceamento de volume observável.**
SUPPORTED (alta). Flepp/Nüesch/Franck (2016, *Does Bettor Sentiment Affect Bookmaker Pricing?*): >80% do volume no "over" do O/U 2.5 (abstract fetchado). Levitt 2004: road/home favorites são as apostas públicas mais populares. URL fetchada: https://ideas.repec.org/a/sae/jospec/v17y2016i1p3-11.html.

**R4 — Bookmakers aumentam o preço de times populares (sentimento de mídia social, proxy Facebook-Likes).**
SUPPORTED (média). Linha de sentimento Flepp/Nüesch/Franck (paper separado do O/U 2.5). ⚠️ atribuição via síntese de busca do abstract — não confundir com a URL do paper O/U 2.5 (R3/R5), que **não** trata de Facebook-Likes. URL: https://journals.sagepub.com/doi/abs/10.1177/1527002514521427.

**R5 — KEY ADVERSARIAL: o desbalanceamento de volume (R3) NÃO se traduz em retorno positivo confiável para quem fadeia — é mecanismo de extração de lucro do book, não edge grátis.**
SUPPORTED (média-alta). Flepp/Nüesch/Franck (2016): "We do not find that this volume imbalance is associated with systematic biases in bettor returns… High price transparency seems to prevent bookmakers from systematically distorting their odds in order to exploit bettor sentiment". URL fetchada (abstract confirmado): https://ideas.repec.org/a/sae/jospec/v17y2016i1p3-11.html.

**R6 — "Fade the public" como estratégia autônoma NÃO é edge pós-vig demonstrado em estudo rigoroso.**
REFUTED (como edge autônomo) / NEI (como camada de confirmação). Único resultado contrarian academicamente citado: Levitt — home-underdog ~53% (NFL/NCAA), mal acima do breakeven ~52,4% a −110, e é futebol americano. URL: https://academic.oup.com/ej/article-abstract/114/495/223/5086012. Todo "fade works" restante = listicle de tipster (BANIDO).

**R7 — Brasil-específico: torcida (Flamengo/Corinthians) inflando odds.**
NEI. Nenhuma fonte acadêmica/desk mediu shading em odds de clube brasileiro. Mecanismo genérico (R1) é plausível mas é **extrapolação não testada**. Lacuna explícita (§9).

---

## 5. FLB vs dinheiro recreativo vs movimento sharp — matriz, recomendação, counter-review

### Matriz (o eixo que separa de SIN-012)

| Dimensão | **FLB (SIN-018a)** | **Dinheiro recreativo (SIN-018b)** | **Movimento sharp (SIN-012/SIN-019)** |
|---|---|---|---|
| Natureza | desvio **estático** odd-vs-prob-real por faixa de odds | desvio por **volume de torcida** num time popular | **dinâmica** abertura→fechamento (dinheiro respeitado) |
| Direção | longshot caro / favorito barato (varejo) | popular caro (over/favorito/casa) | linha migra p/ onde o sharp aposta |
| Onde vive | grade de odds do **bookmaker varejo** | regime **quote-driven** (não exchange) | originating books → cascata |
| Sharp/exchange | **comprimido a ~0** (F4-F8) | **ausente/fraco** na Betfair (R2) | a closing É o sinal |
| Explorável? | **Não** (favorito-only EV−, F5); só "evite zebra" | **Não** como fade autônomo (R5-R6) | sim, no timing antes da soft (mercado-odds.md §3) |
| Dupla-conta SIN-012? | **SIM em mercado líquido** — já na closing | **SIM** — transparência precifica (R5) | é o próprio SIN-012 |
| Classificação | EXPLICAR + guard-rail VALIDAR | EXPLICAR + guard-rail VALIDAR | VALIDAR (âncora) |

**Recomendação (repetida do §1, agora justificada pela matriz):** FLB e dinheiro recreativo são **o mesmo tipo de objeto** — desvios que a closing sharp/exchange **já corrige**. Logo são **EXPLICAR** (narrar o "porquê" de não pegar a zebra cara / o favorito popular encurtado) + **guard-rail defensivo** mensurável só contra a CLV. **Não** viram motor que move probabilidade — isso dupla-contaria SIN-012. O resíduo de valor real mora em **soft books / baixa liquidez**, território que mercado-odds.md §3 já é dono.

### Counter-review (tentativa honesta de refutar a recomendação — ≥3 problemas reais)

1. **"Já está arbitrado nas exchanges — então é inútil até como narrativa."** Parcialmente procede: F4-F8 mostram FLB ~0 em Pinnacle/Betfair e R5 mostra fade-the-public sem retorno. **Resposta:** por isso a classificação é EXPLICAR/guard-rail, **não** ESTIMAR. O valor de EXPLICAR é honestidade ("a odd do azarão tá cara, não é value"), não geração de pick. Em **soft books .bet.br** (público BR de torcida grande), o regime quote-driven de R1/R4 *plausivelmente* sobrevive — mas é **NEI** (R7), então não cravo edge, só guard-rail.

2. **Dupla-contagem com SIN-012 é severa e talvez fatal.** Se o FLB já está na closing (a âncora do SIN-012), incluí-lo como sinal separado **conta a mesma coisa duas vezes**. **Resposta:** correto — e é exatamente por isso que **rejeito ESTIMAR**. A única forma não-redundante é como (i) *insumo do devig* (Shin p/ favorito pesado, já em porta-de-dinheiro) e (ii) *filtro negativo* ("não recomende longshot que só parece value por pagar muito"). Ambos são subordinados, não aditivos.

3. **Os números de magnitude (F2: 2%/15%) são de varejo UK dos anos 1990 e podem não valer no futebol BR/moderno.** **Resposta:** procede — por isso F2 é confiança média e o veredito **não depende** da magnitude exata, só da direção (longshot pior). A persistência moderna está ancorada em F4-F6 (dados 2012–2023), que são robustos e apontam para **compressão**, reforçando "não é edge".

4. **(bônus) A atribuição interna do AH como "sem FLB" (handicap-asiatico.md:180) está errada (F9).** Constantinou diz que o AH *compartilha* ineficiências do 1X2. **Resposta:** correção registrada no §9 — não muda o veredito (AH continua sem ser rota de edge de FLB), mas a afirmação "AH é eficiente / sem FLB" precisa ser suavizada no doc de mercado.

**Conclusão do counter-review:** a recomendação **sobrevive** porque já é defensiva (EXPLICAR/guard-rail, não ESTIMAR). As três objeções principais (arbitrado, dupla-contagem, magnitude datada) são exatamente os motivos pelos quais **não** se promove a ESTIMAR.

---

## 6. Modelo de dados proposto (proxies de viés; odds em centavos)

> Nenhuma coluna nova de schema é obrigatória para ESTIMAR (o sinal não move probabilidade). O que segue são **proxies opcionais** para a camada EXPLICAR/guard-rail e para *auditar* o FLB em soft books BR. Tudo subordinado a DOS-001 (ingere) / SIN-012 (valida). **Carimbar `// @feature SIN-018` só em ponto de posse única.**

- **Reuso, não nova tabela.** A faixa de odds (longshot vs favorito) é **derivável** de `match_odds` (centavos, já ingerida por DOS-001). FLB não precisa de coluna — é uma *leitura* da odd existente.
- **Proxy de "dinheiro recreativo" (popularidade do time):** campo opcional de **índice de popularidade/torcida** por clube (proxy de Facebook-Likes da literatura R4, ou tamanho de torcida BR — Datafolha/IBOPE). Estático por clube, não por jogo. Habilita o guard-rail "favorito popular encurtado" (resultado-1x2.md:238). **NEI p/ BR (R7)** → começar como flag de contexto, não feature quant.
- **Devig sensível a assimetria:** garantir que o pipeline de no-vig use **Shin** quando o mercado é favorito-pesado (porta-de-dinheiro:46) — é onde o FLB de varejo distorce a normalização. Isso já é responsabilidade do devig, SIN-018 só *aponta* a necessidade.
- **Métrica de auditoria (não-coluna):** bucket de odds × (yield observado vs implícito) por casa, para **medir** FLB residual por operador BR — confirma se soft books .bet.br exibem o efeito de varejo (F4 dá o método). Sai do mesmo histórico de odds que SIN-012 precisa.
- **Centavos sempre.** Qualquer cálculo de EV/odd parte de `*_cents` (int) via `@workspace/core/money`; conversão só na borda. Proibido `Number(x)*100`/`toFixed(2)`.

---

## 7. Plano por faceta (dados → ia)

**Faceta `dados` (status alvo após /pl → planejado):**
- Não criar tabela nova. Confirmar que `match_odds` (centavos) cobre **abertura e fechamento** por casa (pré-requisito também de SIN-012) — sem isso não dá nem para *auditar* o FLB.
- (Opcional, P3) catálogo de **popularidade por clube** (proxy torcida BR) como dimensão de contexto, não feature quant — só habilita guard-rail/narrativa.
- Job de auditoria: bucket odds × yield por operador BR (replica football-data.co.uk §F4) para checar se soft books .bet.br têm FLB de varejo explorável. **Esse é o único caminho que poderia *promover* algo a ESTIMAR — e só se a auditoria achar FLB residual em soft book que sobreviva à CLV.**

**Faceta `ia` (status alvo → planejado):**
- **EXPLICAR:** o assistente narra, quando aplicável, "a odd do azarão está cara (FLB de varejo)" / "favorito popular encurtado por torcida" — texto, peso ZERO no quant.
- **VALIDAR/guard-rail:** o motor (MOD-001) aplica filtro negativo — *não* sugerir pick de longshot cujo único atrativo é a odd alta, salvo se bater a CLV (SIN-012). Análogo ao "redutor de confiança" do SIN-004 (taxonomia-sinais.md:39).
- **Anti-dupla-contagem explícita:** documentar no motor que FLB/recreativo **não somam probabilidade** — são insumo do devig (Shin) e filtro, nunca termo aditivo. Fronteira com SIN-019: SIN-019 cuida do *movimento* (sharp vs square); SIN-018 do *viés estático* odd-vs-prob.

---

## 8. Riscos e gotchas

- **Dupla-contagem com SIN-012 (risco nº1).** FLB líquido já está na closing. Mitigação: nunca tratar como termo aditivo de probabilidade; só devig + filtro negativo (§5, §7).
- **"Já precificado / arbitrado".** F4-F8 + R5: sharp/exchange comprimem o efeito; favorito-only é EV−. Não vender como edge. Coerente com mercado-odds.md:42,71.
- **Magnitude datada (F2).** 2%/15% é varejo UK histórico; não extrapolar número para BR. Direção robusta, número não.
- **Atribuição interna a corrigir:** (a) "FLB encolhendo no tempo" (mercado-odds.md:71) não é o que Whelan 2024 mostra — é *menor em sharp/exchange*, não *declinando temporalmente* (§9); (b) AH "sem FLB / eficiente" (handicap-asiatico.md:180) contraria Constantinou/arXiv 2003.09384 (F9), e a atribuição "Hegarty & Whelan" ao arXiv 2003.09384 está trocada (é Constantinou). Suavizar nesses docs num passe futuro — **não toquei** neles nesta sessão.
- **Brasil é NEI (R7).** Torcida-money em odds BR é plausível, não medido. Risco de afirmar edge inexistente — manter como flag de contexto.
- **Soft books .bet.br fora do The Odds API** (taxonomia-sinais.md:54): a auditoria de FLB por operador BR herda o risco aberto de fonte de odds do SIN-012/DOS-001.

---

## 9. Refutado e Perguntas Abertas / lacunas

**Refutado (com evidência):**
- ❌ **"Apostar favorito é EV+ por causa do FLB."** REFUTED por F5 (DataGolf): favorito-only continua EV-negativo em Pinnacle; FLB só significa que perde *menos*. Coerente com mercado-odds.md:27 ("favoritos pesados ROI ~0").
- ❌ **"Fade the public é edge pós-vig autônomo."** REFUTED por R5/R6: transparência de preço impede o desbalanceamento de virar retorno; único caso contrarian citável é home-underdog NFL ~53% (Levitt), marginal e fora do futebol.
- ❌ **"FLB está encolhendo ao longo do tempo" (como afirma mercado-odds.md:71).** NÃO confirmado pela fonte (Whelan 2024 é mecanismo de equilíbrio, não declínio temporal). O verificado é: FLB é **menor em casa sharp/exchange** que em varejo (F4-F8) — diferença de *venue*, não de *época*.
- ❌ **"AH não tem FLB / é eficiente" (handicap-asiatico.md:180).** Contradito por Constantinou (F9): AH *compartilha* ineficiências do 1X2. Atribuição "Hegarty & Whelan → arXiv 2003.09384" trocada (é Constantinou).

**Perguntas abertas / lacunas:**
1. **Soft books BR (.bet.br) exibem FLB de varejo explorável que sobreviva à CLV?** (R7/NEI). É o *único* caminho que poderia promover algo a ESTIMAR — exige a auditoria do §7 com histórico de odds BR, que depende da fonte de odds aberta no SIN-012/DOS-001.
2. **Torcida-money brasileira (Flamengo/Corinthians) shada odds locais?** (R7/NEI). Mecanismo genérico plausível (R1/R4), nunca medido em clube BR. Carece de dado de volume/popularidade por jogo.
3. **Fronteira fina SIN-018 ↔ SIN-019 ↔ SIN-012 no motor:** quem aplica o filtro negativo de FLB — regra SIN-018, microestrutura SIN-019, ou o motor MOD-001? (resolver no /pl do MOD-001).

---

## Fontes

### FLB — acadêmico e primário
- Cain, Law & Peel (2000) — *Favourite-Longshot Bias and Market Efficiency in UK Football Betting*, Scottish J. Political Economy: https://ideas.repec.org/a/bla/scotjp/v47y2000i1p25-36.html · SSRN https://papers.ssrn.com/sol3/papers.cfm?abstract_id=234996
- Whelan (2024) — *Sports Betting, Risk Aversion and Biased Odds*, Economica, doi 10.1111/ecca.12500: https://onlinelibrary.wiley.com/doi/10.1111/ecca.12500 · resumo: https://www.karlwhelan.com/sports-betting-risk-aversion-and-biased-odds/
- Sestovic — *Bookmaker Margins and Favourite-Longshot Bias in Football* (SSRN 3035848): https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3035848
- Constantinou — *Asian Handicap soccer market efficiency* (arXiv 2003.09384): https://arxiv.org/abs/2003.09384
- football-data.co.uk — *Pinnacle efficiency*: https://www.football-data.co.uk/blog/pinnacle_efficiency.php · *Favourite-Longshot Bias revisited again*: https://www.football-data.co.uk/blog/favourite_longshot_bias_revisited_again.php
- DataGolf — *Favorite-Longshot: Not a Bias*: https://datagolf.com/fav-longshot-not-a-bias
- Wikipedia — *Favourite-longshot bias*: https://en.wikipedia.org/wiki/Favourite-longshot_bias
- arXiv 2402.02623 — *Betfair exchange efficiency*: https://arxiv.org/abs/2402.02623

### Dinheiro recreativo / sentimento / price-shading
- Levitt (2004) — *Why are Gambling Markets Organised so Differently from Financial Markets?*, Economic Journal 114(495):223–246: https://academic.oup.com/ej/article-abstract/114/495/223/5086012 · https://ideas.repec.org/a/ecj/econjl/v114y2004i495p223-246.html
- Franck, Verbeek & Nüesch — *Sentimental Preferences and the Organizational Regime of Betting Markets*: https://ideas.repec.org/p/iso/wpaper/0089.html
- Flepp, Nüesch & Franck (2016) — *Does Bettor Sentiment Affect Bookmaker Pricing?*, J. Sports Economics 17(1):3–11: https://ideas.repec.org/a/sae/jospec/v17y2016i1p3-11.html · https://journals.sagepub.com/doi/abs/10.1177/1527002514521427
- Forrest & Simmons — *Sentiment in the betting market on Spanish football*: https://eprints.lancs.ac.uk/id/eprint/44748/1/10.pdf

### Interno (já cravado)
- `docs/regras/mercado-odds.md` (§2 FLB, §4 anti-dupla-contagem) · `docs/mercados/resultado-1x2.md` (§2.3, §6.1, §6.6) · `docs/mercados/handicap-asiatico.md` (§3.1, §6) · `docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md` (devig Shin/Power) · `docs/arquitetura/taxonomia-sinais.md` · `docs/regras/rivalidade.md` · `docs/features/sinais/SIN-019-steam-moves-sharp-vs-square.md`
