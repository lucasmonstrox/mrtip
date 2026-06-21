# Leitura de jogo — profundidade de domínio (camada EXPLICAR / núcleo agêntico)

> Investigação `/rs` da feature [[AGT-001]] (metade EXPLICAR). As-of: **2026-06-18**. Método: workflow multi-agente (17 agentes, ~838k tokens, 275 tool calls) — 8 frentes de profundidade de domínio, verificação por fetch + counter-review adversarial.
> Rótulos: `verificado-fetch` · `snippet` · `inferência` · `NEI`.
> **Complementa, não duplica**, a investigação irmã [docs/investigacoes/agente-selecao-melhor-mercado.md](./agente-selecao-melhor-mercado.md): aquela define a **arquitetura** do agente (pipeline determinístico, Kelly, devig, seleção de mercado); **esta** define **como o agente lê e entende um jogo** (o conteúdo do raciocínio da camada EXPLICAR). Ambas obedecem a [docs/arquitetura/taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md).

---

## TL;DR + recomendação cravada

A descoberta que reorganiza tudo (counter-review, `verificado-fetch`): **ler o jogo "em profundidade" é majoritariamente EXPLICATIVO, não PREDITIVO.** O conteúdo tático fino que dá vontade de narrar — matchup de estilo, xT/PPDA/VAEP/field-tilt, playbooks por arquétipo — tem evidência forte de *descrever* o jogo e evidência fraca-a-nula de **adicionar edge pré-jogo além do xG e, sobretudo, além da linha de fechamento**. No estudo Bundesliga 2022-25 [`verificado-fetch`, PMC12640942], EPV, xG, Elo **e as odds do mercado** ficam todos num intervalo apertadíssimo de RPS (~0,194–0,206); o melhor modelo só **empata** com o mercado. xT/VAEP são, pelos próprios autores, ferramentas de **valoração de ações**, não previsores de resultado. E raciocínio estruturado de especialista produz **acurácia sem lucro**: tipsters da AFL acertaram 65% vs 49% do acaso, mas **sem diferença monetária** vs seleção aleatória depois das odds [`verificado-fetch`, PMC10627876] — o aviso clínico-vs-atuarial aplicado.

**Logo, o que "deixar o agentic forte" significa de verdade:** não é um leitor que prevê melhor — é um **explicador rigoroso e honesto** que (1) **ancora no número do quant/mercado e NUNCA o move**; (2) lê o jogo como um scout profissional — destilando a poucas **alavancas causais** específicas, assimétricas e acionáveis, não num ensaio equilibrado; (3) **marca toda leitura tática como EXPLICATIVA-NÃO-PREDITIVA por padrão**, e só levanta "isto pode ser edge não-precificado" como **hipótese** a ser julgada pela camada VALIDAR/CLV — nunca como afirmação; (4) roda um **pipeline de profundidade** (mecanismo causal *hard-to-vary*, falsificável, diagnóstico, *grounded* na fonte do dossiê) cujo propósito é **calibração e anti-bullshit**, não mover a probabilidade; (5) por arquétipo de jogo, ajusta **o quê foregroundar e quanta variância comunicar**, não a estimativa. O perigo nº 1 é o usuário ler a narrativa densa e bem-citada como se fosse edge.

---

## Contexto e problema

[[AGT-001]] é a camada **EXPLICAR** (taxonomia-sinais §1, `visao-geral.md:106` §6): depois que o dossiê ([[DOS-001]]) ingere e o quant ([[MOD-001]]) estima a probabilidade, o agente **entende a partida e produz o "porquê"**. O dono pediu foco em **profundidade de domínio** — como um analista de verdade lê uma partida — não no stack/framework (esse vive na investigação irmã).

**Brief / requisitos implícitos:** PL + Brasileirão; a camada EXPLICAR **nunca** mexe na probabilidade (taxonomia-sinais:9); disciplina **causal × endógeno**, anti-dupla-contagem, anti-falácia narrativa (taxonomia-sinais:12-14); "sempre o porquê" com fonte (`visao-geral §5`).

---

## Estado real no código + decisões cravadas

- **Greenfield** para a camada EXPLICAR — nada construído (`lido-no-código`). AGT-001 `depende_de` DOS-001/MOD-001, ambos sem código.
- **Arquitetura manda (não re-decidir):** as 3 camadas (INGESTÃO → ESTIMAR → EXPLICAR + VALIDAR/CLV) e o princípio anti-dupla-contagem estão cravados em `docs/arquitetura/taxonomia-sinais.md`. A investigação irmã cravou o **pipeline determinístico** (LLM na borda; número só de tool; nunca o estimador). Esta investigação preenche **o conteúdo do raciocínio** dentro da camada EXPLICAR.
- **Sinais já investigados** (SIN-001..012): esta investigação **não os re-deriva** — define como **sintetizá-los** num read.

---

## 1. Como um pro lê um jogo (a estrutura, e a linha pro-vs-fã)

Convergente em fontes EN e pt-BR [`verificado-fetch`: Coaches' Voice, TheMastermindSite, Total Football Analysis, 360Scouting, Ciência da Bola, Universidade do Futebol]:

**Ordem de operações:** (1) selecionar amostra **estável** de jogos do adversário em **circunstâncias similares** (casa/fora, qualidade do oponente, game-state) — não médias de temporada, não um jogo vívido recente; (2) ler os dois times pelos **4 momentos** (org. ofensiva / transição defensiva / org. defensiva / transição ofensiva) — a espinha luso-brasileira, equivalente ao "in/out of possession + transitions" inglês; (3) **localizar** o perigo por terços/fases, nomeando o **ator-chave** por fase; (4) caçar fraquezas de forma **assimétrica** (forças de ataque deles + fragilidades de defesa deles; pular o não-acionável); (5) **bola parada** como bloco discreto; (6) **game-state** + **red-teaming** (atacar a própria leitura pelo lado do adversário); (7) **destilar sem dó** (o analista corta ~350 clips → ~40; jogadores absorvem poucos pontos claros, overload prejudica).

**A linha pro-vs-fã (o achado mais load-bearing):** o fã para no **macro** (formação, posição na tabela, "momento", "parecem fortes"); o pro vai ao **micro** — o **gatilho/mecanismo** específico, localizado em zona + momento + ator nomeado, com especificidade tipo PMDS ("não 'perigoso', mas onde/quando/que direção/que velocidade"). O read pro é **assimétrico e acionável**, usa stat só pra **reforçar** uma leitura causal (nunca cherry-pick pra encaixar história), e trata a partida como a **colisão de dois modelos**, não como "quem é melhor".

> **Validade preditiva honesta:** nenhuma dessas metodologias tem estudo controlado mostrando que **adiciona edge** sobre a linha de fechamento. São andaimes de **raciocínio rigoroso** e evidência de **usabilidade** (poucos pontos claros > muitos fatos inertes). Para o EXPLICAR: emprestar a **estrutura e a especificidade** do read pro pra **explicar** o número, com VALIDAR/CLV como árbitro de edge.

---

## 2. Táticas e matchups de estilo — a tensão central

**O rótulo de estilo quase não move resultado.** O estudo causal mais limpo [`verificado-fetch`, Forcher et al., Frontiers 2023, PMC10361297] isola estilo ofensivo e acha efeito **não-significativo** sobre pontos/gols (Goals R²=0,13 p=0,14; Points R²=0,10 p=0,36). O estudo de estilos-como-KPI com 81,9% de acurácia [`verificado-fetch`, **Plakias et al. 2024** — não "Gonzalez-Rodenas", correção da verificação, PMC11130910] é **in-sample**, mede as variáveis **durante** o jogo previsto, e os autores admitem ser "um vislumbre momentâneo". → **não narrar "joga posse, logo favorito".**

**O único matchup causal robusto:** azarão deve **contra-atacar** vs favorito de posse [`verificado-fetch`, Northwestern]. Chutes de contra-ataque convertem a taxas extremas (38–60% vs 7–14% open-play) e são ~1,5% dos chutes; a correlação posse↔xGD desaba (R² 0,61→0,30) ao remover os 20 clubes que mais gastam — **endogeneidade** ("posse funciona porque times bons têm a bola"). O canal mecânico é **linha alta + velocidade nas costas**.

**Game-state é o confound-mestre** [`verificado-fetch`, Pugsley/StatsBomb]: time ganhando é **superado em chutes** (TSR 46,6% a +1) mas faz 52,9% dos gols; posse/chutes/xG brutos são **contaminados** pelo placar. → nunca dizer "foram dominados" quando o time geriu a vantagem; ler **xG empatando** como o sinal mais limpo de qualidade. **PPDA** mede intensidade, não qualidade (r²~0,18 com a tabela) — descritor de estilo, não sinal de edge.

**Bola parada** é a dimensão mais repetível e em alta: ~28–30% dos gols da PL (28,3% em 25-26, máxima de 10 anos), set-piece xG mais estável que gols; arremesso longo quase dobrou na PL 25-26 [`verificado-fetch`, Opta]. **Baselines por liga** (calibrar, não transportar): PL = intensidade alta, transições verticais, 25-26 mais direto; Brasileirão = ritmo cadenciado, mais espaço pra conduzir, criatividade individual; mando ~54% casa vs 36% fora, amplificado por viagem continental + clima [`snippet`].

---

## 3. Métricas além do xG — descritivas, não preditivas

**Hierarquia de validade (season-level, `verificado-fetch`):** goal diff (r²~0,94) > xG diff (~0,87) > field tilt (0,78) > shot diff (0,75) > possession (0,72). xG segue o melhor preditor de pontos futuros, **mas a vantagem encolheu** desde 2015 (supera placar real só após ~8 jogos) [`verificado-fetch`, ASA Replication].

**xT, VAEP, OBV, packing são de VALORAÇÃO de ações ocorridas, não forecast** — confirmado pelos próprios criadores [`verificado-fetch`: Karun Singh, socceraction, DTAI KU Leuven, Hudl]. Servem pra explicar **COMO** o perigo é construído (verticalidade vs posicional; quebra de linha; domínio territorial estéril = field-tilt alto + xG baixo), **não** pra re-derivar a probabilidade.

**Achado pré-jogo (`verificado-fetch`, Bundesliga, PMC12640942):** EPV (possession value) prevê **ligeiramente** melhor pré-jogo (RPS 0,194 vs xG 0,199) porque captura construção que não vira chute; xG ganha pós-jogo. **Mas a diferença é 0,005 de RPS** e o melhor modelo só empata o mercado (RPS 0,206) — sinal extra modesto, não substituto. **Janela de estabilidade do xG ~10 jogos**; abaixo é ruído; over/underperformance de xG **regride** ("hot finishing" não sustentável) — e se o quant já ancorou no xG, **não recontar** como edge. **Calibrar por liga**: modelo de xG da PL não serve pro Brasileirão [`snippet` pt-BR].

---

## 4. Causal × narrativa — os traps e a disciplina

**Read causal** = mecanismo (a) identificável **ex-ante**, (b) **falsificável**, (c) que passa no **teste de simetria** (valeria com os times trocados), (d) **não** já dentro da prob/linha. **Read narrativo** = ajustado após o resultado, invocado só pro vencedor, sem falsificador.

**Os 4 traps de endogeneidade a suprimir** [`verificado-fetch`]: (1) **game-state** (placar causa o comportamento que gera a stat); (2) **new-manager bounce** = regressão à média — demissão é selecionada no fundo do poço [`verificado-fetch`, Ter Weel/Soccernomics via Whittall]; (3) **forma recente** = proxy ruidoso de qualidade+sorte, já no modelo — re-explicar via "forma" é dupla-contagem; (4) **momentum/coesão** = presumir narrativa no futebol (a única evidência positiva é NFL intra-jogo, **não transferir** [`verificado-fetch`, PLoS One]).

**Calibração de amostra pequena:** mesmo uma temporada de 38 jogos é luck-dominada — ~40% skill / ~60% sorte [`verificado-fetch` thesis geral, Holzmeister & Johannesson 2025]. ⚠️ Correção da verificação: o número específico "76% das rebaixados são sorte" **não foi confirmado** (vai pra Refutado). **Disciplina positiva** (Tetlock + "resulting"): pra cada "porque X", gerar o contrafactual sem X, declarar o falsificador, checar se já está no preço; julgar a leitura pela **qualidade ex-ante do raciocínio e por CLV** (processo), nunca pelo placar (outcome).

---

## 5. Fusão de sinais — o gate de 3 perguntas

A literatura de superforecasting dá o esqueleto (taxa-base primeiro → fermi-izar → ponderar por força/independência → atualizar incrementalmente) [`verificado-fetch`, GJP: reference-class foi o hábito de menor Brier, 0,17 vs 0,26]; e o achado experimental-chave (`verificado-fetch`, **Keck & Tang 2020, Psych Science** — inclui um estudo de previsão de **futebol**): erros do **mesmo processo cognitivo** são correlacionados (r̄ até 0,90); só a média de erros **independentes** se cancela.

**Tradução direta da regra anti-dupla-contagem → gate de 3 perguntas por sinal antes de deixá-lo "pesar" na explicação:**
1. **Causal ou narrativa/endogenia?**
2. **Independente ou correlacionado** com sinais já citados? (forma + moral + confiança = **um** sinal contado 3×; agrupar por causa-raiz, contar a causa **uma vez**.)
3. **Já está no preço** (forma/desfalque major/mando/escalação/notícia pública = SIM por default) **ou plausivelmente ortogonal** (congestão de calendário específica, assimetria de motivação por contexto de tabela, micro-tática de matchup)?

Só sinais que passam nas 3 viram "razão"; os já-precificados viram **contexto transparente** ("sim, o mercado sabe que falta o X"); narrativos/correlacionados são descartados. **Conflito entre sinais** (rivalidade X vs fadiga Y vs mercado Z): Z é o piso de informação; X e Y só deslocam a **narrativa**, nunca o número; se apontam direções opostas e ambos são causais+ortogonais, **a honestidade é dizer que se cancelam e a incerteza é maior** — não escolher o lado mais dramático. ⚠️ Correções da verificação: o "Contribution-Weighted Model" estava mal-atribuído à URL citada (re-fonte: Budescu & Chen 2015, não verificado) — não usar; a "extremização" do GJP tem ressalva de possível fluke.

> **Conexão com a memória do João:** a [[teoria-ressaca-meio-de-semana]] é um caso particular de **congestão de calendário** — um candidato a sinal **ortogonal** plausível no Brasileirão (fator que "a forma recente não captura", `snippet` pt-BR). Tratar como **hipótese a validar por CLV**, não como verdade.

---

## 6. Arquétipos de jogo — andaime de comunicação, não fonte de probabilidade

O agente classifica o jogo em alguns eixos **antes** de raciocinar (competição/formato, vetor de stakes por lado, flag de rivalidade, congestão/viagem/altitude, mismatch favorito-vs-bloco, ambiente) e **compõe** os reads dominantes (um jogo pode ser vários arquétipos). Para a camada EXPLICAR, o arquétipo seleciona **qual mecanismo foregroundar** e **quanta variância comunicar** — **nunca** licença pra mover a probabilidade.

| Arquétipo | Read dominante | Sinal mrtip |
|---|---|---|
| Favorito vs ferrolho | posse sem **penetração** ≠ domínio; criar chance central vs cruzar | — |
| Clássico/derby | **mando reduzido** + variância maior; forma é prior mais fraco | SIN-007 |
| Jogo-morto | motivação assimétrica/degradada + rotação; modelos pioram | SIN-010 |
| Six-pointer / decisão | medo, ansiedade cognitiva → travado, decidido por erro/bola parada | SIN-010 |
| Ressaca europeia/meio-semana | **rotação e quem viajou**, não fadiga genérica | SIN-008 |
| Reta final / título | pressão/choking mecanístico (não "coesão") | SIN-010 |
| Stakes assimétricos | lado com algo concreto + mando + desespero | SIN-010 |
| 1ª vs 2ª mão | intent condicionado ao agregado — **só copa** (gate: não liga) | — |
| Clima | rain/wind → under + favorece direto/físico ⚠️ números são **NFL**, não transferir magnitude | SIN-006 |

**3 narrativas que o agente NÃO pode repetir como causais** (`verificado-fetch`): **ressaca europeia** é mito pra clubes de elite (estudo 61k jogos/20 anos — é **localização**, não congestão); **new-manager bounce** é regressão/seleção (uplift bruto real ~41%, mas sem controle de RTM); **derby "está na hora/fervor"** → usar o fato estrutural de **mando reduzido** (Brasileirão 2007-11: 30,0% mando em derby vs 52,4% fora), não a história emocional. ⚠️ Correções: fonte do new-manager é Opta/Premier League (não OLBG); o número de derby foi via corroboração (ResearchGate deu 403).

---

## 7. Profundidade analítica — o pipeline anti-bullshit

"Profundo" não é mais persuasivo — é mais **restrito**. Pipeline ordenado que o EXPLICAR deve rodar [`verificado-fetch`: Deutsch, IOED/Rozenblit-Keil, Buchalter; `snippet`: ACH/Heuer, Klein, Tetlock]:

1. **Reconhecer** arquétipo + estrutura profunda (não rótulo de superfície).
2. **Decompor** em sub-claims causais checáveis separadamente.
3. **Mecanismo passo-a-passo** — se a cadeia não preenche dos fatos do dossiê, **derrubar o claim** (teste da Ilusão de Profundidade Explicativa: o detector mais barato de bullshit).
4. **Diagnosticidade** (ACH): só fatores que **discriminam** entre desfechos; "boa forma" é não-diagnóstico → rebaixar.
5. **Hard-to-vary** (Deutsch): se as mesmas palavras encaixariam no placar oposto, é narrativa, não explicação.
6. **Preditivo-E-não-precificado** (Buchalter): declarar **por que o mercado está errado**; se não consegue, deferir ao mercado.
7. **Counter-case limitado** (2-3 razões, não 10 — o excesso tem efeito reverso) + **pré-mortem** ("é segunda, a leitura furou — por quê?").
8. **Span-grounding**: todo fato load-bearing citado a uma fonte do dossiê; não-suportado = flag/drop.

Nada disso toca a probabilidade (ESTIMAR é dono dela); governa a **qualidade e honestidade do "porquê"**, e os falsificadores/diagnosticidade alimentam o VALIDAR/CLV ao longo do tempo.

---

## 8. Processo de quem ganha — âncora, desvio raro, seletividade

[`verificado-fetch`: Buchdahl/CLV, DataGolf, PLoS One Madsen 2025, The Power Rank, VSiN]: **default = concordar com o baseline.** O blend ótimo modelo-vs-mercado é ~**45/55 a favor do mercado** (DataGolf); a multidão (52,1%) bate todo indivíduo (41-48%) mas **perde dinheiro** depois da margem (-£57,96 em 36 jogos, PLoS One EPL). **Desviar só com razão mensurável e não-precificada** (workflow VSiN: power ratings → ajustes específicos → fair line → só fala/aposta no gap; risco nomeado = "over-adjusting on narrative"). **Alvo de edge estrutural citável:** super-estimação de favoritos populares (big-6 ~+0,28 xG) e sub-estimação de promovidos (~-0,22 xG) [`verificado-fetch`, PLoS One] — viés de calibração documentado, não narrativa. **Humildade anti-sobrevivência:** track record bruto regride (tipsters 17,4%→1,1% quando auditados); sequência de acertos **não** prova que a leitura estava certa — a validação é CLV/longo prazo. ⚠️ Correções: DataGolf é **golfe** (princípio, não esporte); a citação "Voulgaris 90% variance" é `NEI` (não usar como verbatim).

---

## Recomendação — spec de raciocínio do EXPLICAR

**O agente "forte" é o explicador honesto, não o preditor melhor.** Spec, sobrevivente ao counter-review:

1. **Âncora imutável** na prob do quant/mercado; a explicação **nunca** a altera.
2. **Tag default EXPLICATIVO-NÃO-PREDITIVO** em toda leitura tática. O agente só sugere "isto pode ser edge" como **hipótese marcada** que o VALIDAR/CLV julga — nunca afirma edge.
3. **Estrutura de scout pro**: destilar a 3-5 alavancas causais, assimétrico/acionável, específico (mecanismo + zona + ator), stat só reforçando.
4. **Gate de 3 perguntas** (§5) por sinal; agrupar por causa-raiz, contar uma vez; o que está no preço vira "contexto transparente".
5. **Pipeline de profundidade** (§7) como QA anti-bullshit: mecanismo → diagnosticidade → hard-to-vary → preditivo-e-não-precificado → counter-case limitado → span-grounding.
6. **Roteado por arquétipo** (§6) só pra escolher o foco e comunicar variância; honrar as 3 narrativas proibidas.
7. **Default confortável de "nada anômalo — o mercado precifica bem isto"**; abstenção de tese forte é resposta legítima e frequente.
8. **Baselines por liga** (PL ≠ Brasileirão); game-state como confound-mestre antes de qualquer afirmação de "estilo".

---

## Riscos e gotchas (o que o counter-review levantou)

1. **Métricas avançadas não dão edge além do xG/mercado** (RPS empata; EPV ganha 0,005) — narrar xT/PPDA/VAEP como preditivo é **dupla-contagem** [`verificado-fetch`, PMC12640942]. `severity: high`
2. **xT/VAEP são valoração, não forecast** — usá-los como sinal de placar é "astrologia com passos extras" [`verificado-fetch`, DTAI]. `severity: high`
3. **"Estilo prevê resultado" é circular/in-sample** — medido durante o jogo previsto, sem holdout [`verificado-fetch`, PMC11130910]. `severity: high`
4. **Acurácia sem edge monetário** — experts batem o acaso mas não o mercado (AFL) → a camada pode **fabricar narrativa persuasiva** sem valor [`verificado-fetch`, PMC10627876]. `severity: high`
5. **Clinical-vs-actuarial** — modelos simples igualam/superam julgamento holístico; só é seguro se o EXPLICAR for **proibido** de mover o número E o usuário não tratar a explicação como info acionável [`snippet`, Meehl/PubMed 16904059]. **Nuance**: Pachur (recognition heuristic, Euro 2004) achou experts > leigos — efeito dependente de contexto, não inutilidade universal. `severity: medium`
6. **A própria estrutura "ler como analista" empurra pra fabricação de elo causal** mesmo com tags — mitigar com o gate anti-confiança. `severity: medium`

---

## Refutado (com a evidência que matou)

- **"Métricas avançadas / matchup de estilo dão edge preditivo pré-jogo"** → REFUTADO: RPS empata entre EPV/xG/Elo/mercado; estilo isolado não-significativo (p=0,14-0,36) [`verificado-fetch`, PMC12640942, PMC10361297].
- **"xT/VAEP preveem resultado"** → REFUTADO: são valoração de ações pelos próprios autores [`verificado-fetch`, DTAI].
- **"European/midweek hangover" e "new-manager bounce" como causais** → REFUTADOS: localização não congestão (61k jogos); regressão/seleção [`verificado-fetch`, Kitman Labs; Opta/PL].
- **"76% dos rebaixamentos decididos por sorte"** → não-confirmado nesta sessão (Sage/OSF/RG bloquearam corpo); a tese geral 40/60 skill-luck **fica**, o número específico **não** [`verificado-fetch` abstract só].
- **Atribuições corrigidas:** estilos-KPI = **Plakias et al. 2024** (não Gonzalez-Rodenas); Silicon-Crowd-style venue à parte; "CWM/mediana>média" mal-atribuído (re-fonte Budescu & Chen 2015, não verificado); citação "Voulgaris 90% variance" = `NEI`; números de clima são **NFL** (não transferir a magnitude).

## Perguntas Abertas / lacunas

- **Nenhum estudo isola que leitura qualitativa humana adiciona edge sobre modelo+mercado** — a evidência aponta o contrário; o valor do qualitativo é seletividade + identificar viés de calibração (big-6). Lacuna real, não preguiça de busca.
- **Não existe taxonomia peer-reviewed de "profundidade de explicação no futebol"** — montada de filosofia da ciência + análise de inteligência + expertise + forecasting.
- **Validar por CLV** se os candidatos ortogonais (congestão de calendário/[[teoria-ressaca-meio-de-semana]], assimetria de motivação) sobrevivem ao fechamento — só se confirma medindo, não a priori.
- **Brasileirão**: estudos de derby/mando deram 403; baselines de estilo são `snippet` pt-BR — confirmar com fonte primária antes de tratar magnitude como load-bearing.
- **pt-BR forte é escasso**: melhor traduzir conceitos (CLV, devig, hard-to-vary) que citar listicles SEO.

---

## Evidências decisivas

- [paper] https://pmc.ncbi.nlm.nih.gov/articles/PMC12640942/ — EPV/xG/Elo/mercado empatam em RPS pré-jogo (o achado que rebaixa "métrica fina = edge").
- [paper] https://pmc.ncbi.nlm.nih.gov/articles/PMC10361297/ — estilo isolado não move pontos/gols (anti-narrativa de estilo).
- [paper] https://pmc.ncbi.nlm.nih.gov/articles/PMC10627876/ — experts: acurácia sim, edge monetário não (o risco epistêmico da camada).
- [analyst] https://sites.northwestern.edu/nusportsanalytics/2019/01/17/why-certain-teams-should-focus-on-the-counterattack/ — o único matchup causal robusto (underdog-counter) + endogeneidade da posse.
- [blog] https://blogarchive.statsbomb.com/articles/soccer/score-effects/ — game-state como confound-mestre.
- [paper] https://pmc.ncbi.nlm.nih.gov/articles/PMC7549292/ — erro correlacionado destrói a média (base da regra anti-dupla-contagem; inclui estudo de futebol).
- [analyst] https://analytics.bet/articles/narratives/ — trichotomia falso/verdadeiro-mas-não-preditivo/preditivo-mas-precificado.
- [paper] https://pmc.ncbi.nlm.nih.gov/articles/PMC11785260/ — crowd bate indivíduo mas perde dinheiro; viés big-6 explorável.
- [doc] [docs/investigacoes/agente-selecao-melhor-mercado.md](./agente-selecao-melhor-mercado.md) — arquitetura irmã (pipeline, mercado, Kelly).
- [doc] [docs/arquitetura/taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md) — 3 camadas + anti-dupla-contagem.
