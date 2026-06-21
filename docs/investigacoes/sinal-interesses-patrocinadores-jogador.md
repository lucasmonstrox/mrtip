# SIN-002 — Sinal: interesses comerciais/de patrocínio do jogador como sinal preditivo

> Investigação (`/rs`). As-of: **2026-06-18**. Feature: [docs/features/sinais/SIN-002-interesses-patrocinadores-jogador.md](../features/sinais/SIN-002-interesses-patrocinadores-jogador.md).
> Rótulos de confiança: `verificado-fetch` (página viva aberta nesta sessão) · `snippet` (resultado de busca, não aberto) · `inferência` (dedução) · `NEI` (não encontrado/insuficiente).

## TL;DR + recomendação cravada

O efeito existe na literatura, **mas é fraco, inconsistente e medido sobre o jogador individual — não sobre o resultado do jogo**, que é o que o mrtip prevê. O **"contract year effect"** tem suporte robusto em **MLB** (beisebol, +6–7% de OPS no ano do contrato, via painel/efeitos fixos [`verificado-fetch`]) e suporte **moderado** em **futebol alemão** (Frick 2011: desempenho sobe no último ano de contrato [`verificado-fetch`]), mas a melhor replicação no futebol de elite (PLOS One 2019, 4 grandes ligas europeias incluindo a Premier League) **não encontrou efeito claro** [`verificado-fetch`]. O "jogo contra ex-clube" tem evidência multi-esporte de que o jogador **tenta mais** (mais finalizações/gols), mas **não acerta mais** (precisão não muda) [`verificado-fetch`]. Tradução pro produto: são efeitos no **nível do indivíduo e da intenção**, com tamanho pequeno, que **se diluem** ao agregar 11×11 jogadores num placar — e cuja transferência pra um edge de mercado é não demonstrada.

**Veredito: ADIAR (não descartar).** Não é dimensão de MVP. O sinal **falha no teste de paridade × diferencial × ruído**: ruído alto (efeito pequeno, no agregado quase nulo), diferencial baixo (não há evidência de edge de placar/mercado), e custo de sourcing real (dado de contrato/bônus é parcial e opaco). Encaixe correto: **micro-anotação narrativa** no dossiê por partida (DOS-001) — uma flag de contexto que o LLM pode citar ("X joga contra ex-clube; Y está em ano de contrato"), **nunca** um termo do motor quantitativo de probabilidade (MOD-001). Isso captura o valor de **explicação/engajamento** sem fingir poder preditivo que a evidência não sustenta.

---

## Contexto e problema

SIN-002 é um **sinal intangível novo** proposto pra alimentar o dossiê por partida (DOS-001 §6 da visão): incentivos comerciais do jogador — ano de contrato, bônus por desempenho/aparição, vitrine pra transferência, jogo contra ex-clube ou contra mercado-alvo, interesses de patrocinador — que *poderiam* mexer em motivação e desempenho. A pergunta de produto não é "isso existe na psicologia esportiva?" (existe), e sim **"isso move o placar de forma mensurável e capturável a ponto de virar edge num mercado de apostas BR?"**. O mrtip prevê **resultado de partida e mercados derivados** (1X2, over/under, cartões, escanteios), não a linha estatística de um jogador. Esse descasamento de granularidade é o eixo da avaliação.

Princípios do repo que pesam aqui: separação **quant (estima) × LLM (explica)** (visão §6) — um sinal fraco e narrativo pertence à camada de explicação; o motor quantitativo só deve absorver sinais com edge demonstrado, sob risco de descalibrar. E o princípio "**todo pick mostra o porquê**" (§5) dá valor a uma flag de contexto mesmo sem poder preditivo: ela enriquece a narrativa.

---

## Estado real no código

**Greenfield — não há nada a contestar.** Confirmado nesta sessão: o único código de app é o scaffold Next.js (`apps/web`); não existe camada de dados, ingestão, nem schema. SIN-002 estava como `status: ideia`, `facetas.dados/ia: ideia`, `depende_de: [DOS-001]`, sem âncoras nem docs (lido no arquivo da feature). Não há código nem coletor que implemente ou contradiga este sinal — toda a investigação é externa, conforme o brief.

---

## Estado da arte / evidência

Escada de fontes priorizada (peer-reviewed > jornalismo sério > resto). Claims atômicos com fonte + confiança + as-of (2026-06-18).

### A. "Contract year effect" — existe, mas depende do esporte e do método

| Esporte / liga | Achado | Magnitude | Método | Fonte | Conf. |
|---|---|---|---|---|---|
| **MLB (beisebol)** | Rebatedores **melhoram** no ano do contrato | **+6,11 pts de adjusted-OPS (~+6,7%)**; 256 free agents, 1.016 obs., 2006–2011 | **Efeitos fixos (painel)**; OLS **não** acha o efeito | O'Neill, SABR/Baseball Research Journal | `verificado-fetch` |
| **NBA (basquete)** | PER **sobe** no ano do contrato; **cai abaixo do baseline no ano seguinte** ("undermining") | direção, sem % no resumo; >230 jogadores, 10 anos | painel | White & Sheldon (2013), *Motivation and Emotion* | `snippet` (abstract) + Wikipedia `verificado-fetch` |
| **Futebol alemão (Bundesliga)** | Desempenho **sobe** e **variância cai** no último ano de contrato ("moral hazard") | direção; sem tamanho no abstract | painel sobre notas do *Kicker* | Frick (2011), *Int. J. of Sport Finance* | `verificado-fetch` (repec abstract) |
| **Futebol elite — 4 grandes ligas EU (inclui Premier League)** | **Sem efeito claro** antes/depois de assinar; nem declínio nem melhora consistente | "did not show a clear decline or improvement"; efeitos só em jogadores **menos importantes** e após assinar | Magnitude-Based Inference (Cohen's d); 249 jogadores, 747 obs., 2008–2015 | Gómez, Lago, Gómez & Furley (2019), *PLOS One* 14(1):e0211058 | `verificado-fetch` |

**Leitura:** o efeito é **robusto onde o desempenho é individual e isolável** (beisebol: o rebatedor enfrenta o arremesso sozinho). No **futebol de elite** — esporte coletivo, jogador medido por contribuição diluída — a melhor evidência recente **não confirma** o efeito no agregado, e o que aparece é em jogadores periféricos, não nas estrelas que movem placar. O choque MLB-positivo × futebol-elite-nulo é exatamente o argumento contra usar isso como preditor de jogo. Detalhe metodológico crítico: **OLS some o efeito mesmo no beisebol** (O'Neill) — ou seja, o sinal é tão tênue que só aparece com técnica de painel cuidadosa; isso é o oposto de "edge fácil de explorar".

### B. "Motivação contra ex-clube" — tenta mais, não acerta mais

- Estudo multi-esporte (NBA, NHL e seis grandes ligas europeias de futebol; dados de NBA, Hockey-Reference, Understat) acha que atletas contra o ex-clube **melhoram quantitativamente (mais finalizações/tentativas) mas não qualitativamente (precisão não muda)**. No futebol: na Premier League "marcaram mais gols" e no Italiano "marcaram mais vezes" — **sem magnitude reportada** pro futebol. Efeito **aumenta** com tempo no ex-clube e **diminui** com tempo desde a saída; mais forte em quem teve pouco tempo de jogo, aceitou redução salarial ou foi dispensado, e no antigo estádio. — Assanskiy, Shaposhnikov et al. (2022), *Journal of Behavioral and Experimental Economics* [`verificado-fetch` via phys.org; abstract ScienceDirect deu 403]. Conf.: `verificado-fetch` (resumo institucional) + `snippet` (detalhe de moderadores).

**Leitura:** "tenta mais, não acerta mais" é o padrão mais hostil possível a um edge de placar — mais chutes sem mais precisão pode não mudar gols, e o efeito vive no nível do indivíduo + circunstância (precisa saber tempo de casa, motivo da saída). É um ótimo **gancho narrativo**, péssimo **feature quantitativa**.

### C. Bônus por desempenho/aparição, vitrine de transferência, patrocinador

- **Sem evidência peer-reviewed dedicada** localizada que ligue cláusulas de bônus (gols/aparições) ou "vitrine pra transferência" a desempenho mensurável **no nível do jogo** [`NEI`]. São extensões teóricas do mesmo mecanismo de moral hazard do contract-year — herdam a mesma fraqueza (efeito individual pequeno) **e** o problema de sourcing (cláusulas de bônus são confidenciais, ver §sourcing). "Interesse de patrocinador" movendo desempenho individual em partida é **narrativa, não efeito medido** [`inferência`].

### D. Distinção narrativa × efeito medido

A mídia e listicles ("10 jogadores que marcaram contra o ex-clube") vendem a narrativa como se fosse lei. A evidência medida diz: efeito **pequeno, condicional, no indivíduo, na intenção mais que no resultado, e ausente no agregado de futebol de elite**. O produto deve refletir essa distinção: citar o contexto, não apostar nele.

---

## Opções de sourcing / viabilidade

O dado preciso pra acionar este sinal é **observável só em parte**, e a parte mais preditiva (bônus/salário) é a menos disponível.

| Subsinal | Dado necessário | Onde | Cobertura PL / Brasileirão | Custo | Legalidade derivar+exibir | Conf. |
|---|---|---|---|---|---|---|
| Ano de contrato | data de expiração do contrato | **Transfermarkt** (canônico; sem API oficial — scraping/3rd-party) | ampla nas duas | scraper 3rd-party (Apify/ScrapingBee) ou open-source `worldfootballR`; baixo anti-bot | **ToS de scraping = risco**; checar termos. Sem licença comercial explícita | `snippet` |
| Transferência / vitrine | histórico + rumores de transferência | **SportMonks** (já é a espinha de dados do projeto, DOS-001): endpoints `transfers`, `pendingTransfers`, `transfer-rumours` | sim (dentro da assinatura) | já contratado em DOS-001 | **sim** (licença comercial da SportMonks já avaliada em DOS-001) | `verificado-fetch` (endpoints) |
| Jogo contra ex-clube | histórico de clubes do jogador × adversário da partida | **derivável** de `transfers`/histórico SportMonks cruzado com a escalação | sim | zero marginal | sim | `inferência` (derivação direta) |
| Bônus por desempenho/aparição, salário | cláusulas contratuais | **confidencial** — não há fonte estruturada confiável | — | — | — | `NEI` (não capturável de forma confiável) |
| Interesse de patrocinador | contratos de patrocínio individuais | esparso (notícia) | fraca | alto/manual | risível em escala | `NEI` |

**Veredito de sourcing:** os **únicos subsinais viáveis e baratos** são (a) **ano de contrato** (Transfermarkt, com ressalva de ToS) e (b) **jogo contra ex-clube** (derivável de graça da SportMonks já contratada). Bônus, salário e patrocínio — justamente os mais ligados ao mecanismo causal — **não são capturáveis** de forma confiável/legal em escala. Nota: a SportMonks confirma `transfers`/`transfer-rumours`, mas **não confirmei** que o objeto traz **data de expiração de contrato** [`NEI`] — se faltar, a expiração depende de Transfermarkt.

---

## Nota de modelo de dados

Se/quando entrar, encaixa como **anotação derivada de baixo custo no dossiê (DOS-001)**, não como tabela nova de ingestão:

- Campos derivados por (partida × jogador relevante), calculados na consolidação do dossiê: `contract_expiry_date` (nullable; origem Transfermarkt/SportMonks), `is_contract_year` (bool, derivado vs. data da partida no fuso `America/Sao_Paulo` com `date-fns-tz`), `vs_former_club` (bool, derivado do histórico de transferências × adversário), `former_club_tenure_months` e `months_since_left` (moderadores que a evidência diz importarem).
- **Proveniência por campo** (requisito de DOS-001): cada flag carrega fonte + as-of, pra o "porquê" e pro snapshot imutável por pick.
- **Consumo: só LLM** (camada de explicação). **Não** vira feature do motor quant (MOD-001) sem backtest próprio que demonstre lift de calibração — o que a evidência atual **não** sustenta.
- Sem dado de salário/bônus → **sem coluna** pra eles (não modelar o que não se captura).

---

## Riscos

- **Falso edge / descalibração:** plugar um sinal de efeito ~nulo no agregado no motor quant degrada a calibração e contamina value bets. Mitigação: confinar ao LLM até backtest provar o contrário.
- **Sourcing frágil/legal:** contract-expiry depende de Transfermarkt (sem API oficial, ToS de scraping = risco jurídico) — mesma classe de risco já sinalizada em DOS-001 pra fontes scraped.
- **Regulatório (Lei 14.790/2023):** transformar "está em ano de contrato" em recomendação de aposta aumenta o risco de "recomendar aposta" com base especulativa; reforça a necessidade de gate +18, jogo responsável e linguagem de probabilidade — não de certeza (alinhado ao achado regulatório de DOS-001).
- **Cherry-picking narrativo:** o LLM pode amplificar a narrativa ("vai brilhar contra o ex-clube") além do que a evidência permite. Mitigação: prompt/guardrail que apresente como contexto de baixa confiança, não como driver de pick.

---

## Refutado

- **"Jogador em ano de contrato rende mais" como lei geral aplicável ao futebol** — REFUTADO pra futebol de elite: PLOS One 2019 (4 ligas, inclui Premier League) **não acha efeito claro** [`verificado-fetch`]. Vale com força só no beisebol; no futebol é, na melhor das hipóteses, moderado e em jogadores periféricos.
- **"Quem joga contra ex-clube performa melhor" ⇒ mais gols/edge** — PARCIALMENTE REFUTADO: atletas **tentam mais mas não acertam mais** (precisão inalterada) [`verificado-fetch`]; o salto pra "mais gols/edge de mercado" não está demonstrado em magnitude no futebol.
- **"É um sinal barato de capturar"** — REFUTADO pra a parte preditiva: bônus/salário/patrocínio são confidenciais e não capturáveis em escala [`NEI`]; só ano-de-contrato e ex-clube são viáveis.

## Perguntas Abertas

1. O objeto `transfers` da SportMonks (já contratada) traz **data de expiração de contrato** ou só histórico de movimentação? Se não, Transfermarkt vira dependência obrigatória pro subsinal mais útil. [`NEI`]
2. Tamanho de efeito **no futebol** pro "contra ex-clube" (o estudo de 2022 não reportou magnitude pro futebol) — quanto, em gols/xG? Sem isso, não dá pra dimensionar nem um peso narrativo honesto.
3. Os ToS atuais da Transfermarkt permitem uso comercial derivado? (mesma pergunta aberta de DOS-001 pra fontes scraped). [`NEI`]
4. Há lift de calibração real? Só um backtest no próprio histórico do mrtip (pós-DOS-001) responde se a flag, mesmo fraca, melhora algo num mercado de nicho (ex.: anytime-scorer do jogador em ano de contrato vs. ex-clube) — onde, ao contrário do placar, o sinal é sobre o **indivíduo** e pode sobreviver.
