# Sinal: conflitos entre jogadores do mesmo elenco

> Investigação `/rs` da feature [[SIN-001]] (Sinal — conflitos entre jogadores). O sinal alimentaria o dossiê por partida [[DOS-001]]: atritos/brigas/rachas de vestiário → (falta de) coesão de grupo → desempenho do time. Pergunta central: **isso é um sinal preditivo medível, ou folclore narrativo?**
>
> - **Tipo:** sinal intangível novo, repo greenfield (sem camada de dados). **Método:** fan-out de buscas pt-BR + inglês, amplo→estreito; claim load-bearing triangulado por ≥2 fontes independentes; rótulo de confiança por claim.
> - **as-of:** 2026-06-18 (toda URL veio de tool result desta sessão).
> - **Não implementa nada.**

---

## TL;DR + recomendação cravada

**Veredito: ADIAR (não é dimensão do MVP). Sinal real na ciência, mas fraco, ruidoso e mal-observável exatamente no nicho do mrtip (futebol profissional de elite).** A literatura de psicologia do esporte SUSTENTA que coesão e desempenho se correlacionam — mas três fatos matam o valor preditivo direto de "conflito de elenco" como dimensão de aposta:

1. **A coesão é um preditor FRACO em profissionais.** A relação coesão–desempenho cai de r ≈ 0,43 em atletas recreativos/universitários para **r ≈ 0,19 em profissionais** [`verificado-fetch`, meta-análise de 10 anos] — e r=0,19 explica ~3,6% da variância. Exatamente a população do mrtip (PL + Brasileirão) é onde o sinal é mais fraco.
2. **A causalidade é bidirecional e inconclusiva — o tiro sai pela culatra como sinal PRÉ-jogo.** Vencer gera coesão tanto (ou mais) quanto coesão gera vitória; a direção predominante é "desempenho → coesão", não o contrário [`verificado-fetch`/`snippet`]. Ou seja: "elenco em crise" é em boa parte *consequência* de já estar perdendo — e isso já está precificado na forma recente e nas odds. Adicionar o sinal arrisca **double-counting** do que o modelo de gols/odds já captura.
3. **Não existe observável limpo do conflito *off-pitch*.** Nenhum provedor de dados (StatsBomb/Hudl, Opta/Stats Perform) vende métrica de "coesão" ou "moral" [`verificado-fetch`]. O que é medível — densidade da rede de passes — é **coordenação em campo**, um proxy de coesão-tarefa, não de briga de vestiário, e só é observável *pós-jogo*. A fonte realista (notícia/redes) é narrativa, atrasada e enviesada.

**Recomendação:** não construir como dimensão quantitativa do dossiê no MVP. Se entrar algum dia, entra como **flag qualitativa, de baixo peso, somente para a camada EXPLICAR (LLM)** — nunca como input que move probabilidade no motor ESTIMAR ([[MOD-001]]) —, e mesmo assim atrás de SIN-002/SIN-006/SIN-007 (rivalidade, lesões, odds), que têm sinal mais limpo. Custo de captura confiável (curadoria editorial + risco LGPD) é alto vs. um sinal que a própria ciência classifica como fraco e endógeno.

---

## Contexto e problema

O mrtip separa **estimar probabilidade (quant)** de **explicar (LLM)** (`docs/visao-geral.md` §6). O dossiê por partida ([[DOS-001]]) é o insumo de features. Esta investigação pergunta se "conflito entre jogadores do mesmo elenco" merece virar uma dimensão do dossiê — paridade (todo mundo tem) × diferencial (poucos quantificam) × ruído (sinal fraco/endógeno).

O tema é sedutor porque é **narrativamente forte**: a imprensa de junho/2026 está cheia de exemplos (briga Valverde–Tchouameni no Real Madrid com multa de € 500 mil cada; "unrest" no Liverpool sob Slot) [`snippet`, FOX/Tribuna, 2026]. Mas folclore narrativo ≠ efeito medido — e é essa distinção que decide a feature.

---

## Estado da arte / evidência

Claims atômicos, com URL e rótulo de confiança. A escada de fontes prioriza ciência do esporte > jornalismo sério; listicle nunca é evidência única.

### O elo coesão–desempenho EXISTE, mas o tamanho de efeito desinfla onde importa

- **Meta-análise seminal (Carron et al., 2002): relação geral moderada-a-grande, ES ≈ 0,655**, sobre **46 estudos / 164 effect sizes**; efeito maior em publicações revisadas e em times femininos [`verificado-fetch` (existência/escopo) + `snippet` (ES=.655), triangulado em 2 buscas independentes — https://journals.humankinetics.com/view/journals/jsep/24/2/article-p168.xml e https://www.scirp.org/reference/referencespapers?referenceid=3118490 , 2026-06-18].
- **Decomposição task vs social (meta-análise de 10 anos, 2000–2010, 118 effect sizes): coesão-TAREFA r ≈ 0,45 (grande); coesão-SOCIAL r ≈ 0,11 (pequena); geral r ≈ 0,34** [`snippet`, triangulado em 2 buscas — https://link.springer.com/article/10.1007/s11332-014-0188-7 e https://www.academia.edu/14402214/ , 2026-06-18]. Implicação direta: o que correlaciona com resultado é "o grupo rema junto na tarefa", **não** "os caras se gostam" — e conflito de vestiário ataca mais a dimensão SOCIAL (a de sinal pequeno).
- **O efeito é FRACO em profissionais.** Mesma meta-análise de 10 anos: recreativos/universitários **r = 0,43 (p < 0,02)** vs **profissionais r = 0,19** [`verificado-fetch`/`snippet`, triangulado — https://link.springer.com/article/10.1007/s11332-014-0188-7 , 2026-06-18]. Meta-análise de team-building (2024) confirma o mesmo padrão por nível: o efeito da intervenção em profissionais é **0,40, IC 95% [−0,02; 0,83] — NÃO significativo**, atribuído a "efeito teto" (profissionais já têm coesão alta) [`verificado-fetch`, https://pmc.ncbi.nlm.nih.gov/articles/PMC10978621/ , 2026-06-18].

### A causalidade é o calcanhar de Aquiles do sinal pré-jogo

- **Relação bidirecional, sem predomínio causal claro; quando há predomínio, é desempenho → coesão.** "Um efeito mais forte foi encontrado para o impacto do desempenho sobre a coesão, com times vencedores tendo níveis mais altos de coesão que os perdedores"; cross-lagged sem predomínio de uma direção [`verificado-fetch`/`snippet`, https://www.researchgate.net/publication/263733534 e https://journals.humankinetics.com/view/journals/jsep/4/2/article-p170.xml (Carron & Ball 1982, abstract) , 2026-06-18]. Para um sinal de **previsão** isso é fatal: a "crise de vestiário" tende a ser efeito de já estar perdendo, e a forma recente/odds já carregam isso.
- **Revisão integrativa brasileira (futebol, 19 artigos, última década): existe relação coesão↔desempenho, mas "a direção desta relação é inconclusiva, necessitando de pesquisas com procedimentos estatísticos mais robustos"** [`snippet`, https://periodicos.pucpr.br/psicologiaargumento/article/view/29931 , 2026-06-18]. Consenso pt-BR e internacional batem: relação sim, direção/uso preditivo não resolvido.

### Como é (e como NÃO é) quantificado hoje

- **Clubes/ciência do esporte medem coesão por questionário (GEQ — Group Environment Questionnaire), não por dado de jogo.** É instrumento interno, auto-relato, retrospectivo — inacessível externamente e impossível de coletar pré-jogo para 380+ partidas [`verificado-fetch`, mencionado nas meta-análises acima, 2026-06-18].
- **Provedores comerciais NÃO vendem métrica de coesão/moral.** StatsBomb/Hudl (3.400+ eventos/jogo, possession-value), Opta/Stats Perform (Opta Points, 19 data points) — nenhum oferece "morale"/"cohesion" [`verificado-fetch`, https://statsbomb.com/ e https://www.statsperform.com/ , 2026-06-18]. O mercado de dados sério **não monetiza esse intangível** — sinal de que ele não é confiavelmente capturável.
- **O proxy medível é rede de passes — mas é COORDENAÇÃO em campo, não conflito off-pitch.** Análise de redes: densidade/clustering/centralidade altos associam-se a sucesso; revisão diz que estrutura de rede coesa é preditiva de gols [`snippet`, https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6186964/ e https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12484057/ , 2026-06-18]. Mas isso só existe **depois** do jogo e mede coesão-tarefa, não "panelinha de vestiário".
- **Modeladores de aposta tratam moral/coesão como ruído fora do escopo.** "Team morale… tem impacto significativo mas é difícil de medir com precisão com a coleta de dados atual"; modelos quant focam em estatísticas medíveis, não em "motivação/momentum" [`snippet`, https://www.nature.com/articles/s41598-025-91870-8 e https://www.sportico.com/business/finance/2022/ml-sports-betting-app-1234691458/ , 2026-06-18].
- **Proxy via sentimento de redes dá sinal fraco e ruidoso.** Modelo de sentimento do Twitter para a Premier League: **~50% de acurácia** em resultado (vs baseline de odds-favoritos com 65,57%); um modelo de sentimento teve retorno financeiro maior que apostar no favorito, mas com acurácia menor (trade-off de apostar em zebra) [`snippet`, triangulado — https://www.sciencedirect.com/science/article/abs/pii/S0167923616300835 e https://www.researchgate.net/publication/303892471 , 2026-06-18]. Sentimento de torcida não é conflito de elenco e é, na melhor hipótese, sinal marginal.

---

## Opções de sourcing e viabilidade

De onde o sinal viria, observabilidade ANTES do jogo, custo e legalidade:

| Fonte | Observável pré-jogo? | Sinal de *conflito*? | Custo | Risco |
|---|---|---|---|---|
| **Notícia esportiva / clipping editorial** (ge.globo, ESPN, marca, etc.) | Sim, mas **atrasado e enviesado** (vaza quando já há crise) | Indireto (narrativa) | Médio (curadoria/NLP + verificação) | Alto: ruído, *hype*, double-counting com forma/odds |
| **Redes sociais (X/Instagram) — sentimento/eventos** | Sim, ruidoso | Muito indireto (mede torcida, não vestiário) | Médio-alto (scraping + NLP) | **Alto LGPD** + ToS das plataformas |
| **Multas/punições disciplinares oficiais do clube** | Às vezes (quando divulgado) | Direto, mas **raríssimo e tardio** | Baixo (evento pontual) | Baixo, mas cobertura esparsa demais p/ feature |
| **Rede de passes / coordenação (Opta/StatsBomb)** | **Não** (só pós-jogo) | Não (é coesão-tarefa em campo) | Alto (licença de dados) | Baixo legal, mas não mede o alvo |
| **Questionário GEQ (interno do clube)** | Não acessível | Sim (gold standard científico) | Inviável externamente | — |

**Conclusão de sourcing:** não há fonte que seja simultaneamente *pré-jogo* + *específica de conflito off-pitch* + *de baixo ruído* + *legalmente barata*. A única realista (clipping editorial) entrega narrativa atrasada e endógena.

---

## Nota de modelo de dados (que campo seria no dossiê)

Se um dia entrar, NÃO vira feature numérica do motor ESTIMAR. Forma sugerida, **camada EXPLICAR apenas**:

- Em `dossie.contexto` (ou tabela `match_context_flags`): um item qualitativo opcional do tipo
  `{ tipo: "conflito_elenco", time: "...", severidade: "rumor|confirmado", fonte_url: "...", data: "...", resumo: "<1 frase>" }`.
- **Sem coluna de score que alimente probabilidade.** O LLM pode *citar* a flag ao explicar um pick ("há relatos de atrito no elenco X"), com fonte, sem que isso altere a probabilidade calibrada. Isso respeita a tese mrtip ("estimar ≠ explicar", `visao-geral §6`) e o princípio de transparência (§5: mostra o porquê e a fonte).
- Reuso: se a infra de clipping/NLP for construída, ela serve também SIN-003 (mood do jogador) e SIN-005 (ocasiões especiais) — promover para `shared/`/`lib/`, não acoplar a uma feature.

---

## Riscos

- **Endogeneidade / double-counting (modelagem):** o sinal correlaciona com resultado em boa parte *porque* segue o resultado. Alimentar o motor com ele é arriscar inflar artificialmente a confiança em algo já precificado.
- **LGPD / ANPD (legal):** a ANPD colocou **raspagem de dados (data scraping) como tema prioritário no seu Mapa de Temas Prioritários (dez/2023)** [`verificado-fetch`, https://www.grantthornton.com.br/insights/artigos-e-publicacoes/raspagem-de-dados-entenda-a-nova-prioridade-da-anpd-e-seus-efeitos/ , 2026-06-18]. Dado "manifestamente público" **não** é passe livre: exige base legal (interesse legítimo com teste de ponderação), finalidade compatível com a expectativa do titular, minimização e respeito ao ToS da plataforma [`verificado-fetch`, mesma fonte + https://mfoadvogados.com.br/a-lgpd-e-o-data-scraping-a-coleta-de-dados-massiva-na-web-e-redes-sociais/ , 2026-06-18]. Coletar/processar fala de jogador identificável sobre brigas internas é dado pessoal — sob escrutínio regulatório ativo.
- **Ética / reputação:** amplificar fofoca de vestiário como "sinal de aposta" é frágil reputacionalmente e atrita com jogo responsável (Lei 14.790/2023): sugere falsa precisão sobre vida privada de terceiros.
- **Difamação / fonte não confiável:** rumor de "racha" frequentemente é falso/inflado; citar como base de pick expõe a produto a erro factual.
- **Custo de oportunidade:** esforço de NLP/curadoria renderia mais em SIN-011 (lesões) ou SIN-012 (odds), de sinal limpo e legal.

---

## Refutado

- **"Coesão de vestiário é forte preditor de resultado em times de elite."** Refutado pelo tamanho de efeito: r ≈ 0,19 em profissionais (≈3,6% da variância), com efeito de team-building não-significativo nessa população [`verificado-fetch`, https://pmc.ncbi.nlm.nih.gov/articles/PMC10978621/ e https://link.springer.com/article/10.1007/s11332-014-0188-7]. Forte é coesão-TAREFA (r≈0,45), e majoritariamente em amadores.
- **"Coesão causa vitória" (seta única).** Refutado: a evidência aponta relação bidirecional, com predomínio frequentemente no sentido inverso (desempenho → coesão) [`verificado-fetch`, Carron & Ball 1982 + retrospectiva de 10 anos].
- **"Provedores de dados já oferecem métrica de moral/coesão para plugar."** Refutado: StatsBomb e Stats Perform/Opta não comercializam tal métrica [`verificado-fetch`, https://statsbomb.com/ , https://www.statsperform.com/]. O que existe (rede de passes) mede coordenação em campo, pós-jogo.
- **"Sentimento de redes sociais resolve a captura do sinal."** Enfraquecido: modelo de sentimento Twitter para PL ≈ 50% de acurácia, abaixo do baseline de odds (65,57%) [`snippet`/triangulado, https://www.sciencedirect.com/science/article/abs/pii/S0167923616300835]. E sentimento de torcida ≠ conflito de elenco.

---

## Perguntas abertas / lacunas (buscas vazias declaradas)

- **Não encontrei nenhum estudo que isole "conflito/atrito interpessoal entre jogadores" como variável e meça efeito sobre RESULTADO de partida** (placar/1X2). A literatura mede *coesão* (construto positivo via GEQ), não *conflito* como sinal preditivo de jogo. Lacuna real — pode ser que o efeito específico simplesmente não tenha tamanho mensurável publicado.
- **Não encontrei evidência de que casa de aposta ou modelo quant sério use "conflito de elenco" como feature com edge demonstrado.** Buscas por "intangibles/morale/chemistry" em modelos retornaram só menções de que isso é tratado como ruído fora do escopo. Ausência de evidência (não prova de ausência), mas consistente com o veredito.
- **Não consegui fetch do texto completo** de: Carron 2002 (Human Kinetics 403; ES=.655 veio triangulado de 2 buscas), Carron & Ball 1982 (403; finding via snippet+busca), e do PDF do paper de sentimento Twitter (binário ilegível; números via 2 buscas independentes). Os números load-bearing estão triangulados por ≥2 fontes, mas não por leitura direta da página primária — confiança rebaixada onde marcado `snippet`.
- **Brasileirão especificamente:** a cobertura editorial de conflito de elenco no Brasil é alta (cultura de "panela"/"vestiário"), mas não achei dataset estruturado nem estudo quantificando efeito no Brasileirão. Lacuna de dados, coerente com o buraco de cobertura do Brasileirão já notado em [[MOD-001]].
