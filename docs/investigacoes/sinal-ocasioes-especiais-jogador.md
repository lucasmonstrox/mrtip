# SIN-005 — Sinal de ocasiões especiais do jogador (aniversário, homenagem/luto, ex-clube, marcos)

> Investigação (`/rs`). As-of: **2026-06-18**. Feature: [docs/features/sinais/SIN-005-ocasioes-especiais-jogador.md](../features/sinais/SIN-005-ocasioes-especiais-jogador.md).
> Rótulos de confiança: `verificado-fetch` (página viva aberta nesta sessão) · `snippet` (resultado de busca, não aberto) · `inferência` (dedução, não fonte) · `NEI` (não encontrado/insuficiente).

## TL;DR + recomendação cravada

Ocasião especial é um guarda-chuva de quatro sub-sinais com **evidência muito desigual** — não tratar como um bloco só:

1. **Jogo contra ex-clube ("lei do ex"/revenge)** — **único com evidência acadêmica triangulada**. Estudo peer-reviewed (NBA+NHL+6 ligas europeias, inclui Premier League e Serie A italiana) acha efeito **mensurável mas QUANTITATIVO, não QUALITATIVO**: o jogador faz **mais chutes/ações ofensivas contra o ex-time, sem melhorar a pontaria/precisão**; efeito mais forte para quem teve **pouca minutagem, aceitou corte salarial ou foi dispensado**, e em jogos fora [`verificado-fetch`]. Implicação direta: pode mover **props do jogador (chutes, finalizações)**, **não** o resultado/gols do time. **Já é parcialmente propriedade da [SIN-007 rivalidade](../features/sinais/SIN-007-rivalidade.md)** ("lei do ex") — risco de dupla-contagem.

2. **Homenagem / luto (jogo pós-falecimento, "playing for a cause")** — evidência agregada **existe e é recente**, mas o efeito é **pequeno e efêmero**: estudo de Groningen (203 mortes súbitas de jogadores, 1970–2024) encontra um **"rally effect" claro porém de curta duração** — o time vai melhor **nas primeiras partidas** e o efeito **some depois de poucos jogos** [`verificado-fetch`]. Valida parcialmente a anedota tipo Eusébio/Eriksen como **efeito real mas transitório**, não como vantagem estrutural.

3. **Aniversário do jogador no dia/véspera do jogo** — **sem evidência confiável: é narrativa.** Não achei nenhum estudo agregado sério de boost de desempenho competitivo no aniversário. A busca por "birthday effect" retorna o **Relative Age Effect (RAE)**, que é **outro fenômeno** (mês de nascimento vs. data de corte de seleção — não tem nada a ver com jogar no dia do aniversário) [`snippet`]. O único número que apareceu é um blog não-revisado (+0,5 assistências/jogo, 1 temporada NBA) [`snippet`] — anedótico. **Veredito: folclore.**

4. **Marcos de carreira (jogo 100/gol 100, jogo-homenagem/testimonial, datas simbólicas)** — **sem efeito mensurado**; testimonials são, por definição, **amistosos não-competitivos** [`snippet`], logo irrelevantes para prognóstico. Marco numérico é `NEI` (nenhum estudo).

**Recomendação cravada:** **Descartar do MVP como sinal próprio.** O único pedaço com sinal real e observável (ex-clube) **já pertence à SIN-007**; o segundo (luto) é raro, efêmero e eticamente sensível num produto de apostas; aniversário e marcos são ruído/folclore. **Fase posterior, opcional:** capturar **flags baratas e observáveis** (`is_birthday`, `vs_former_club`, `tribute_context`) como **metadados de contexto no dossiê (DOS-001)** para o LLM **narrar o jogo** ("hoje é aniversário do X", "primeiro jogo do Y contra o ex-clube") — **sem peso no motor quant**, exceto talvez um leve viés em **props de chutes do ex-jogador** (e mesmo isso só se a SIN-007 não cobrir). É o caso clássico **barato-e-observável-mas-de-sinal-incerto**: o custo de capturar é ~zero (vem da SportMonks), mas o valor preditivo agregado é baixo ou nulo.

---

## Contexto e problema

SIN-005 é um **sinal intangível novo** que alimentaria o **dossiê por partida (DOS-001)** — estágio 2 da pipeline (ingestão → dossiê → IA quant/LLM → picks/insights). O brief pergunta: (1) há evidência crível de que ocasião especial eleva desempenho **mensuravelmente**? (2) como se quantifica hoje? (3) é observável por calendário/eventos a custo viável? (4) viável / adiar / descartar, distinguindo paridade × diferencial × ruído.

O exemplo do brief (Benfica "inspirado" homenageando Eusébio) é exatamente o tipo de **anedota motivacional** que NÃO pode ser tratada como evidência de efeito agregado. A disciplina desta investigação foi separar **efeito medido** de **narrativa pós-fato**.

---

## Estado real no código

**Greenfield — não há sinal, schema nem coletor.** Confirmado nesta sessão:

- Não existe camada de dados (`packages/db` ainda é o esqueleto planejado por DOS-001), nem coletor/ingestão, nem motor (MOD-001 está `ideia`). SIN-005 está `ideia`, depende só de DOS-001, `impacta: []`.
- **Sobreposição relevante:** [SIN-007 (rivalidade)](../features/sinais/SIN-007-rivalidade.md), status `investigado`, **já lista "lei do ex" / "tilt em props do ex-jogador" como efeito a capturar** (via transferências) e já `impacta: [DOS-001, MOD-001]`. O sub-sinal "ex-clube" de SIN-005 **é o mesmo dado e o mesmo efeito** da SIN-007 → resolver por **fronteira de posse**, não por nova feature.
- DOS-001 já escolheu **SportMonks** como espinha dorsal de dados ([docs/investigacoes/dossie-por-partida-fontes-de-dados.md](dossie-por-partida-fontes-de-dados.md)) — o que torna os campos de SIN-005 praticamente grátis (ver Sourcing).

Implicação: SIN-005 não justifica feature de motor própria. Se algo dela vive, vive como **metadado de contexto no `dossier_snapshot`** e como **flag para o LLM narrar**, não como coluna de peso no quant.

---

## Estado da arte / evidência — por sub-sinal

Claims atômicos, fonte inline + confiança + as-of (2026-06-18).

### Sub-sinal A — Jogo contra ex-clube ("lei do ex" / revenge) — EVIDÊNCIA REAL

- **Assanskiy, Shaposhnikov, Tylkin & Vasiliev (2022), *Journal of Behavioral and Experimental Economics*, vol. 98** — "Prove them wrong: Do professional athletes perform better when facing their former clubs?". Dados de NBA, NHL e **6 ligas europeias de futebol** [`verificado-fetch` ideas.repec.org/phys.org].
  - Achado central: atletas executam **mais ações ofensivas contra o ex-time**. Basquete: mais arremessos e pontos **sem melhorar a precisão**. Hóquei e futebol: **mais chutes** [`verificado-fetch`].
  - **Caveat load-bearing:** "performam melhor em termos **quantitativos, não qualitativos** — fazem mais chutes, mas não necessariamente mais precisos" [`verificado-fetch` phys.org]. → move **volume de finalização**, não conversão/resultado.
  - Heterogeneidade: efeito mais forte em **jogos fora**, e quando o atleta teve **minutagem insuficiente no ex-time, aceitou corte salarial na transferência, ou foi dispensado** [`verificado-fetch` ideas.repec.org]. Bate com a hipótese "tinha algo a provar".
  - Diferença por liga: Premier League mostrou "mais chutes"; Serie A italiana "marcou mais vezes" — **efeito não é homogêneo entre ligas** [`verificado-fetch` phys.org].
  - Conclusão dos autores: "emoção prevalece sobre o melhor conhecimento do jogo do adversário" [`verificado-fetch`].

### Sub-sinal B — Homenagem / luto (pós-falecimento, "playing for a cause") — EVIDÊNCIA REAL, MAS EFÊMERA

- **Jong-A-Pin & Prandi (2026)**, "From grief to goals? The performance effects of sudden player death in professional football", open access (Taylor & Francis), University College Groningen [`verificado-fetch` rug.nl].
  - Amostra: **203 jogadores profissionais que morreram inesperadamente, 1970–2024** [`verificado-fetch`].
  - Achado: **"rally effect" claro porém de curta duração** — times tendem a **resultados melhores nas primeiras partidas** após a morte; **"o efeito é temporário e some depois de poucos jogos"** [`verificado-fetch`].
  - Magnitude numérica exata (Δ pontos / prob. vitória / gols): **`NEI`** — a página institucional descreve direção e duração, não publica o tamanho do coeficiente; ler o paper completo para extrair o efeito quantitativo.
  - Exemplos citados (Diogo Jota, jul/2025; alusão à fala de Mourinho sobre time sair mais forte) são ilustração, **não** a evidência — a evidência é o painel de 203 casos.
- Literatura qualitativa de psicologia do esporte (luto/bereavement em times): resposta **altamente variável** — choque, isolamento, alguns atletas "compartimentalizam" e performam (ex. anedóticos: Tiger Woods 2006, seleção dinamarquesa pós-Eriksen 2021); não há tamanho de efeito agregado, é estudo de coping [`snippet` ResearchGate/Human Kinetics].

### Sub-sinal C — Aniversário do jogador no dia do jogo — SEM EVIDÊNCIA (NARRATIVA)

- **Nenhum estudo agregado crível** de boost competitivo no aniversário foi encontrado. A literatura de "birthday effect" em esporte é, na prática, o **Relative Age Effect (RAE)**: super-representação de atletas nascidos logo após a data de corte de seleção (atletas do início do ano têm ~2 a 3,5× mais chance de top-100 juvenil) — **fenômeno de seleção/desenvolvimento, NÃO de jogar no dia do aniversário** [`snippet` Frontiers/PMC]. **Confundir os dois seria erro.**
- Único número "pró-aniversário": blog não-revisado, **+0,5 assistências/jogo** numa temporada NBA (2022-23), reportado como significativo [`snippet` — não acadêmico, n pequeno, sem replicação]. **Insuficiente.**
- **Veredito: folclore.** "Sem evidência confiável, é narrativa."

### Sub-sinal D — Marcos de carreira (jogo 100/gol 100, testimonial, datas simbólicas) — SEM EFEITO MEDIDO

- **Testimonial / jogo-homenagem:** por definição **amistoso não-competitivo** [`snippet` Wikipedia] → irrelevante para prognóstico de partida oficial.
- **Marco numérico (100º jogo, gol 100):** `NEI` — nenhum estudo de efeito no desempenho. É narrativa de mídia.

---

## Sourcing / viabilidade

Estes são, de fato, **os sinais mais observáveis por calendário/cadastro** — e o provedor já escolhido em DOS-001 entrega quase tudo:

| Sub-sinal | Fonte | Como deriva | Custo marginal | Confiança |
|---|---|---|---|---|
| Aniversário (`is_birthday`) | SportMonks player `date_of_birth` (ex.: `"1991-10-31"`) | comparar `date_of_birth` (dia/mês) com `kickoff_at` no fuso `America/Sao_Paulo` | **~zero** (já no payload do jogador) | `verificado-fetch` (docs SportMonks) |
| Ex-clube (`vs_former_club`) | SportMonks `transfers` / `GET Transfers by Player ID` | cruzar histórico de transferências do jogador com o adversário da partida | **~zero** (mesmo provedor) | `verificado-fetch` (docs SportMonks) — **mas já é insumo da SIN-007** |
| Homenagem/luto (`tribute_context`) | notícia/RSS oficial (ge.globo, premierleague.com/BBC) + braçadeira preta/minuto de silêncio anunciado | NLP/regra sobre o feed de notícia já coletado no MVP (DOS-001) | baixo (feed já existe); **detecção confiável é o difícil** | `inferência` |
| Marcos/testimonial | notícia/calendário | parsing de notícia; testimonial é amistoso (filtrável) | baixo, **mas sinal nulo** | `inferência` |

**Cobertura/custo:** aniversário e ex-clube são **dados estruturados, 100% de cobertura PL+Brasileirão, custo zero adicional** (vêm da assinatura SportMonks de DOS-001). Homenagem/luto depende de **detecção em texto** (ruidoso, eventos raros). **Nenhum exige novo provedor.**

---

## Nota de modelo de dados

- **Não criar entidade/peso próprio.** Onde algo vive, vive como **flags de contexto no `dossier_snapshot.content_jsonb`** (dimensão "contexto"), com proveniência por campo (padrão D2 de DOS-001): `{ is_player_birthday: {value, source, observed_at}, vs_former_club: {...}, tribute_context: {...} }`.
- **`vs_former_club` é DADO COMPARTILHADO com SIN-007** — carimbar posse única numa só feature (provavelmente SIN-007, que já modela transferências/lei do ex) para **evitar dupla-contagem no quant**. SIN-005 **consome**, não duplica.
- **Quant (MOD-001):** no máximo um leve ajuste em **props de chutes/finalizações do ex-jogador** (alinhado ao achado "mais volume, não mais precisão") — **e só se a SIN-007 não cobrir**. Aniversário, luto e marcos: **peso zero** no quant.
- **LLM:** uso legítimo é **narrativa/cor** ("hoje é aniversário do X"; "primeiro reencontro do Y com o ex-clube") — citando a fonte, sem afirmar causalidade de resultado. Regulação (Lei 14.790 / Portaria SPA-MF 1.231) **proíbe afirmações infundadas sobre probabilidade de ganhar** — não usar "joga inspirado, então vai vencer" como racional de pick.

---

## Riscos e gotchas

1. **Dupla-contagem com SIN-007** — o sub-sinal de maior evidência (ex-clube) já é da SIN-007; se SIN-005 também pesar, infla o efeito. Resolver por fronteira de posse antes de codar.
2. **Confundir RAE com "jogar no aniversário"** — são fenômenos distintos; usar RAE como prova de SIN-005 seria erro metodológico.
3. **Anedota como evidência** — Eusébio/Eriksen/Woods são ilustração; a evidência de luto é o painel de 203 casos (efeito pequeno e efêmero), não o caso heroico.
4. **Quantidade ≠ qualidade (ex-clube)** — mover linha de gols/resultado com base nesse efeito é erro; ele move **volume de chutes**, não conversão.
5. **Efêmero (luto)** — o rally some em poucos jogos; janela de validade curta e eventos raros → baixíssima frequência de aplicação.
6. **Ética/regulação** — monetizar "pick" sobre o luto de um time é sensível num produto de apostas regulado (Lei 14.790); preferir uso narrativo, com disclaimer.
7. **Detecção de homenagem é ruidosa** — NLP sobre notícia para "tribute_context" tem alto falso-positivo/negativo; não confiável para peso quant.

---

## Refutado (com a evidência que matou)

- **"Aniversário do jogador eleva o desempenho no jogo"** — REFUTADO / sem suporte: nenhum estudo agregado crível; o "birthday effect" da literatura é o RAE, fenômeno diferente [`snippet` Frontiers/PMC]; único número pró é blog não-revisado (+0,5 ast., 1 temporada) [`snippet`]. **É narrativa.**
- **"Jogo-homenagem/testimonial mostra time mais motivado"** — REFUTADO: testimonial é **amistoso não-competitivo** [`snippet` Wikipedia], irrelevante para prognóstico oficial.
- **"Luto gera vantagem estrutural (time joga inspirado e ganha)"** — REFUTADO (parcial): o efeito é **real mas curto** — rally nas primeiras partidas que **some depois de poucos jogos** (203 casos, 1970–2024) [`verificado-fetch` rug.nl]. Não é vantagem duradoura.
- **"Ex-clube faz o jogador marcar/ganhar mais"** — REFUTADO (parcial): faz **mais chutes, sem mais precisão** — efeito **quantitativo, não qualitativo** [`verificado-fetch` phys.org]. Move props de volume, não resultado.
- **"SIN-005 precisa de feature/peso de motor próprio"** — REFUTADO: o pedaço com evidência já é da SIN-007; o resto é narrativa → metadado de contexto, não motor.

## Perguntas Abertas / lacunas

- **Tamanho do efeito do luto (`NEI`)** — a página institucional de Groningen dá direção e duração, não o coeficiente; ler o paper completo (Taylor & Francis) para extrair Δ pontos / prob. vitória se a feature for adiante.
- **Magnitude do efeito ex-clube em futebol (`NEI`)** — fontes secundárias (phys.org/ideas.repec) confirmam direção e nuance (volume não precisão) mas não dão coeficientes por liga; o paper na *J. Behav. Exp. Econ.* está atrás de paywall (ScienceDirect deu 403). Extrair números exatos exige acesso ao PDF.
- **Fronteira de posse SIN-007 × SIN-005** — decisão de produto/arquitetura: quem modela "ex-clube"? **CRAVADO**: posse da "lei do ex" é exclusiva da SIN-007 (rivalidade), ver `docs/arquitetura/taxonomia-sinais.md`; SIN-005 só consome flags narrativas).
- **Detecção confiável de "tribute_context"** em texto pt-BR/en — viabilidade de NLP de baixo falso-positivo não testada (`NEI`).
- **Marco numérico (gol 100/jogo 100)** — nenhum estudo encontrado (`NEI`); provavelmente nulo, mas não testado.

---

## Evidências decisivas (fontes abertas via fetch nesta sessão)

- [web] https://www.rug.nl/ucg/news/2026/new-publicaiton-with-ucg-alumnus?lang=en — Jong-A-Pin & Prandi (2026), "From grief to goals?": 203 mortes súbitas 1970–2024, **rally effect curto** que some após poucos jogos.
- [web] https://phys.org/news/2022-07-professional-athletes-clubs.html — efeito ex-clube **quantitativo não qualitativo** (mais chutes, não mais precisos); heterogêneo por liga.
- [web] https://ideas.repec.org/a/eee/soceco/v98y2022ics2214804322000532.html — Assanskiy et al. (2022), *J. Behav. Exp. Econ.* 98; efeito mais forte fora, e p/ quem teve pouca minutagem/corte salarial/dispensa; "emoção prevalece sobre tática".
- [web] https://studyfinds.com/athletes-former-team/ — cobertura do mesmo estudo (NBA+NHL+6 ligas, HSE/RANEPA/NES); subgrupo "pouco tempo de jogo".
- [web] https://docs.sportmonks.com/.../players/get-all-players + /transfers/get-transfers-by-player-id — `date_of_birth` e histórico de transferências expostos pelo provedor já adotado em DOS-001 (sourcing ~custo zero).
- [snippet] Frontiers/PMC (RAE) — "birthday effect" da literatura é Relative Age Effect, fenômeno distinto de jogar no aniversário; não sustenta SIN-005.
- [doc] [docs/features/sinais/SIN-007-rivalidade.md](../features/sinais/SIN-007-rivalidade.md) — "lei do ex" já modelada; fronteira de posse a definir.
- [doc] [docs/investigacoes/dossie-por-partida-fontes-de-dados.md](dossie-por-partida-fontes-de-dados.md) — SportMonks como espinha dorsal + regra anti-"afirmação infundada de ganho" (Lei 14.790).
