# AGT-001 — Agente de seleção do melhor mercado: arquitetura de raciocínio

> Investigação (`/rs`). As-of: **2026-06-18**. Feature: [docs/features/agente/AGT-001-selecao-melhor-mercado.md](../features/agente/AGT-001-selecao-melhor-mercado.md).
> Rótulos: `verificado-fetch` · `snippet` · `inferência` · `NEI`. Nota de processo: os subagentes de pesquisa rodaram verificação adversarial própria (votação 3×); as refutações entraram em **Refutado/Riscos**. Counter-review dedicado pulado (limite de sessão Opus) — declarado aqui.

## TL;DR + recomendação cravada

O "agente que entende um jogo e acha o melhor mercado" **não é um LLM solto decidindo** — é um **pipeline determinístico com núcleo quant, e o LLM só na borda** (extrair sinal qualitativo + explicar). Isso é convergente em toda a literatura e em todos os concorrentes (DraftKings, Sportradar, OddsJam, Rithmm, blueprint Gemma): **modelo quant estima a probabilidade; o LLM nunca emite o número** — LLMs alucinam número em 17–55% das tarefas e ficam descalibrados (ECE até 0,88 pós-RLHF), e a confiança que verbalizam não correlaciona com acerto. O **melhor mercado = maior edge calibrado contra a closing line sharp vig-free**, ranqueado por **Kelly fracionário**, e só publicado onde (a) o modelo está calibrado naquele mercado e (b) há hipótese causal de edge — senão é p-hacking (testar 10 mercados ⇒ ~40% de falso-positivo). A descoberta que governa tudo: **calibrar vence maximizar acurácia por ~70 p.p. de ROI** (+34,69% vs −35,17%, Walsh & Joshi 2024) — nunca alimentar o Kelly com probabilidade crua. O edge **não mora no 1X2 de liga grande** (eficiente no fechamento) e sim em **cartões/escanteios (árbitro!), ligas de baixa liquidez e props** — exatamente os sinais mensuráveis que a [taxonomia](../arquitetura/taxonomia-sinais.md) já identificou. Diferencial defensável do mrtip: **proveniência por número + CLV auditável** (cada dígito rastreável a uma tool, cada pick gravado antes do jogo).

---

## Contexto e problema

AGT-001 é o cérebro que consome o dossiê (DOS-001) + os sinais (SIN-*) + as probabilidades do quant (MOD-001) e decide **qual mercado oferecer**, ranqueado por valor, com explicação e fontes. Requisitos implícitos do repo: separação **estimar (quant) × explicar (LLM)**; **todo pick mostra o porquê + fontes**; **anti-dupla-contagem contra a closing** ([SIN-012](../regras/mercado-odds.md)); regulação BR (Lei 14.790, sem promessa de ganho); odds em centavos. Brief: foco em ARQUITETURA e estado da arte, não em fontes de dados (DOS-001).

## Estado real no código

Greenfield (confirmado nesta sessão): AGT-001 depende de DOS-001/MOD-001/SIN-012, **nenhum construído** (`lido-no-código`, estrutura do repo). A arte prévia interna é a [regra de mercado/CLV](../regras/mercado-odds.md) (árbitro de valor) e a [taxonomia de sinais](../arquitetura/taxonomia-sinais.md) (quem é quant vs narrativa) — ambas mandam aqui.

## Estado da arte / mercado

### A. Quant: como se estima por mercado e como sindicatos acham o melhor

- **Distribuição de placar é o núcleo:** Dixon-Coles (correção `rho≈−0,13` nas células baixas) com **xG como λ** é o mínimo viável; **Bayesian state-space (Oxford JRSS-C 2025)** é o estado da arte (RPS 17,55 vs 22,22 do Dixon-Coles ponderado) [`verificado-fetch` academic.oup.com/jrsssc/article/74/3/717]. Da matriz `P(i,j)` saem 1X2, O/U, BTTS, AH por agregação [`inferência`].
- **Mercados não-gol têm modelo próprio:** escanteios = **Negative Binomial / Compound Poisson** (sobredispersão, clustering) [`verificado-fetch` arxiv 2112.13001]; cartões = Poisson com **forte prior de árbitro** (xB, análogo ao xG) [`snippet` arxiv 2401.08718]; props = NB por jogador com **offset de minutos** [`inferência`].
- **Sindicatos são agnósticos de mercado:** geram prob. própria para cada mercado, comparam com o devig do book, e apostam onde a divergência é maior; **especializam por liga/mercado** (depth > breadth) [`inferência`, múltiplas fontes]. Medem **CLV, não win-rate** — significativo em ~50 apostas vs milhares [`verificado-fetch` pinnacleoddsdropper].
- **Mercado é eficiente onde há liquidez:** 1X2 de liga grande tem overround 2,5–4% e é quase eficiente no fechamento; **77,63% das "ineficiências" publicadas em 1X2 são ruído estatístico** (Winkelmann 2024, 14 temporadas) [`verificado-fetch` journals.sagepub 15270025231204997]. Edge vive em escanteios/cartões (overround 6–10%), ligas inferiores e props.

### B. LLM + quant: o LLM não estima número

- **LLM é estruturalmente ruim em número:** RLHF premia confiança → ECE 0,88 em GSM8K [`verificado-fetch` arxiv 2410.09724]; confiança verbalizada não correlaciona com acerto (AUROC ~0,52) [`verificado-fetch` arxiv 2306.13063]; erro aritmético sobe para 55,6% quando embutido em texto [`verificado-fetch` arxiv 2502.08680].
- **Padrão consolidado — tool-calling:** o LLM **chama a ferramenta determinística**, não calcula. TSAG: hallucination rate **0,02** com tool-calling vs 0,26 sem [`verificado-fetch` arxiv 2604.19633]. Anthropic: tool use levou exatidão de 72%→90% [`verificado-fetch` platform.claude.com/docs].
- **Structured output garante forma, não verdade:** constrained decoding mascara tokens inválidos, mas "0,73" forçado pelo schema ainda pode ser inventado — o número certo precisa vir da tool [`verificado-fetch` letsdatascience.com].
- **Grounding/proveniência:** Proof-Carrying Numbers — número é "claim-bound token" verificado **no renderer**, default = **não-verificado** ("trust is earned only by proof") [`verificado-fetch` arxiv 2509.06902]; Universal Fact Ledger + Sentinel SLM que classifica Found/Fake/General <50ms [`verificado-fetch` arxiv 2603.04663].
- **Onde o LLM agrega valor:** extrair sinal de **texto não-estruturado** (notícia de lesão, contexto) → variável tipada que vira feature do quant; e **traduzir** o output quant em explicação. Nunca o estimador, nunca emitir delta de probabilidade [`verificado-fetch` daloopa.com; arxiv 2402.10979 mostra LLM degradando ao renomear jogadores → usa memória, não contexto].

### C. Ranqueamento de valor (devig → edge → Kelly → CLV)

- **Devig:** Power method é o default robusto; **Shin** quando o mercado é assimétrico (favorito <1,25) [`verificado-fetch` betherosports.com/devigging-methods].
- **Calibrar > acurácia (a descoberta central):** modelo calibrado **+34,69% ROI** vs **−35,17%** do otimizado para acurácia — ~70 p.p. (Walsh & Joshi 2024, peer-reviewed) [`verificado-fetch` arxiv 2303.06021]. Calibrar por mercado (Platt/isotonic), monitorar **ECE** (<0,05 = forte); **nunca expor probabilidade crua ao Kelly**.
- **Kelly como ranqueador:** `f* = (b·p − q)/b`; **Kelly fracionário 0,25** (half-Kelly retém ~75% do crescimento com 1/4 da variância) [`verificado-fetch` nickyoder.com, matthewdowney.github.io]; ranqueia mercados e serve de filtro mínimo (`f* < 1%` → pular).
- **Múltiplas comparações:** testar 10 mercados a α=5% ⇒ ~40% de chance de ≥1 falso-positivo. Mitigar: só publicar mercado com **hipótese causal de edge** + Bonferroni/FDR + holdout out-of-sample [`verificado-search` arxiv 2410.21484].
- **Correlação intra-jogo:** O/U 2.5 + BTTS são correlacionados; apostar 4 mercados do mesmo jogo sem ajuste ≈ 4× Kelly no resultado compartilhado → cap por jogo ≤5% banca [`inferência`].

### D. Padrões de agente, anti-padrões e concorrentes

- **Pipeline determinístico > agente solto para alto risco:** consenso 2025-2026. Shell determinístico (orquestração, regras de risco hard-coded, gates) + núcleo agêntico **limitado** (schema-constrained) + execução determinística. Gartner: **>40% dos projetos agênticos serão cancelados até 2027** por falta de controle [`verificado-fetch` via agente]. Acurácia composta: 85%/passo × 10 passos = ~20% de sucesso → menos passos, escopo restrito.
- **Orchestrator pattern (2 LLM calls):** rotear → (ferramentas determinísticas executam) → sintetizar; ~70% mais barato que loop agêntico [`verificado-fetch` stackademic].
- **Auditabilidade = arquitetura:** claim-level attribution, replay harness determinístico (mesma entrada → mesma saída, exigência regulatória), logs imutáveis com hash; EU AI Act art. 12 exige registro automático em sistema de alto risco [`verificado-fetch` arxiv 2602.13855, 2601.15322, truescreen.io]. Casa com "mostra o porquê" + histórico auditável do mrtip.
- **Concorrentes (matriz):** OddsJam = scanner de EV multi-book (valida contra vários sharps) [`verificado-fetch` oddsjam.com]; Outlier = agregação + execução 1-tap, EV via no-vig de sharps (não modelo próprio) [`verificado-fetch` bettingnews]; Rithmm = modelo configurável pelo usuário, transparência alta mas dados travados [`verificado-fetch` rithmm.com]; Juice Reel = prova social verificada (15M bets sincronizadas) [`verificado-fetch` betsmart]; blueprint público (Gemma): XGBoost gera prob → LLM explica com RAG [`verificado-fetch` mager.co]. **Padrão dominante: o LLM é interface/explicação, o quant é o motor.** Claims de acurácia dos vendors (Rithmm "72%", "300% higher accuracy") = marketing single-origin, **não auditados** [`snippet`].

---

## Recomendação — arquitetura do agente

**Pipeline determinístico, LLM na borda, mercado como árbitro.** O fluxo de "entender o jogo → melhor mercado":

```
1. Dossiê (DOS-001)            point-in-time, passado→presente (sem look-ahead)
        ↓
2. LLM-extrator               texto não-estruturado → features TIPADAS (sem inventar número)
        ↓
3. Quant por mercado (MOD-001)  Dixon-Coles/Bayesian SSM + xG → matriz de placar → 1X2/OU/BTTS/AH;
                                NB/Poisson+árbitro p/ escanteios/cartões; props c/ offset de minutos
        ↓
4. Calibração por mercado      Platt/isotonic; GATE: ECE alto → não publica aquele mercado
        ↓
5. Devig sharp (Power/Shin)    fair prob; edge = p_calibrado − p_fair
        ↓
6. Ranquear por Kelly f*       fracionário 0,25; filtros: EV mínimo, só mercado com hipótese causal,
                                controle de múltiplas comparações, cap correlação intra-jogo
        ↓
7. Validar vs CLV (SIN-012)    só sobrevive sinal ORTOGONAL ao já precificado no fechamento
        ↓
8. LLM-explicador (1 call)     narra o pick top citando fontes do dossiê; NÃO emite dígito novo
        ↓
9. Sentinel + log imutável     todo número rastreia a uma tool; pick gravado ANTES do kickoff
```

**Inegociáveis (guardrails):**
- LLM nunca emite número que não veio de tool output (Proof-Carrying-Numbers; Sentinel verifica).
- Probabilidade crua nunca vai pro Kelly — calibrar primeiro, gate por ECE.
- Mercado só publicado com hipótese causal + sobrevivência ao CLV (anti-dupla-contagem e anti-p-hacking).
- Validação **walk-forward + embargo + feature lag** (anti look-ahead); odds são **baseline de comparação, não feature** (anti-copiar-o-mercado).
- Pick imutável gravado antes do jogo (auditabilidade + Lei 14.790: sem promessa de ganho, jogo responsável).

**Quem faz o quê:** quant decide o número; LLM extrai sinal qualitativo + explica; regras determinísticas fazem o risco (Kelly, caps, gates); humano/jogo-responsável na borda.

## Modelo de dados (proposto)

Estende o `dossier_snapshot` (DOS-001) e o `pick`:
- `market_estimate(id, snapshot_id, market, p_raw, p_calibrated, calibration_version, model_version)`
- `market_value(id, market_estimate_id, bookmaker, odds_cents, p_fair_devig, edge, kelly_f, devig_method)`
- `pick(... selection, market, edge, kelly_f, expected_clv, snapshot_id, created_at < kickoff_at)` — + proveniência por número (refs às fontes do dossiê).
- `clv_record(pick_id, closing_odds_cents, clv_pct, captured_at)` — KPI auditável ex-post.

## Plano por faceta (dados → api → ia → ui)

- **dados:** feature store point-in-time (sem look-ahead); captura abertura→fechamento p/ CLV (depende da fonte de odds BR ainda aberta em DOS-001).
- **api:** servir o pick ranqueado + explicação + proveniência (atrás do gate +18).
- **ia:** quant por mercado (MOD-001) + calibração + devig + ranqueador Kelly + LLM-extrator + LLM-explicador + Sentinel. Separação estimar/explicar é estrutural.
- **ui:** mostrar o melhor mercado COM o porquê, edge, fonte de cada número, disclaimer de jogo responsável.

## Riscos e gotchas

1. **LLM alucinando número** → grounding obrigatório + Sentinel; default não-verificado.
2. **P-hacking de mercados** → hipótese causal + Bonferroni/FDR + holdout; só publicar onde o modelo é calibrado.
3. **Dupla-contagem com a closing** → CLV é o árbitro; sinal precisa ser ortogonal (SIN-012).
4. **Calibração que apodrece (drift)** → monitorar ECE/PSI por mercado; recalibrar (transfer window, troca de técnico).
5. **Look-ahead bias** → walk-forward + embargo; o dossiê é point-in-time por design (DOS-001).
6. **TS vs Python no quant** → o ecossistema ML é Python; o monorepo é Bun/TS. Provável serviço quant separado (decisão de MOD-001).
7. **Over-engineering agêntico** → começar pipeline determinístico; LLM só na explicação no v1.

## Refutado (com a evidência que matou)

- **"O LLM pode estimar a probabilidade / escolher o pick"** — REFUTADO: alucinação 17–55%, ECE até 0,88, confiança não-correlacionada [`verificado-fetch` arxiv 2410.09724, 2306.13063, 2502.08680].
- **"Otimizar para acurácia"** — REFUTADO: calibrar vence por ~70 p.p. de ROI [`verificado-fetch` arxiv 2303.06021].
- **"Analisar mais mercados = mais valor"** — REFUTADO: múltiplas comparações ⇒ ~40% falso-positivo [`verificado-search` arxiv 2410.21484].
- **"CLV garante lucro"** — REFUTADO/nuance: é retrospectivo, quebra em ilíquidos, steam-chasing dá CLV sem skill [`verificado-fetch` betting-forum.com].
- **"Agente totalmente autônomo é melhor p/ alto risco"** — REFUTADO: consenso é shell determinístico + núcleo limitado; >40% dos projetos agênticos cancelados (Gartner) [`verificado-fetch`].
- **"O edge está no 1X2 de liga grande"** — REFUTADO: eficiente no fechamento, 77,63% das ineficiências publicadas são ruído [`verificado-fetch` sagepub].
- **Claims de acurácia dos concorrentes (Rithmm 72%, "300% accuracy")** — REFUTADO como marketing single-origin não auditado [`snippet`].

## Perguntas Abertas / lacunas

- **Quant em TS ou serviço Python?** (decisão de MOD-001; o ML é Python, o monorepo é Bun) — `NEI`, protótipo.
- **Orquestração:** pipeline puro vs LangGraph vs Temporal — protótipo comparativo (regra do dono).
- **Fonte de CLV/odds das casas BR** — herda o risco aberto de DOS-001 (The Odds API não cobre .bet.br).
- **Quanto de LLM no v1** — recomendação: mínimo (só explicação); confirmar com o dono.
- **Conformal prediction p/ aposta** — framework promissor mas **sem aplicação peer-reviewed a apostas** até jun/2026 (`NEI`).
- Política de drift/recalibração (cadência, PSI threshold é convenção de crédito, não lei) — definir no MOD-001.

## Evidências decisivas (fetch nesta sessão)

- [web] arxiv.org/abs/2303.06021 (Walsh & Joshi 2024) — calibrar +34,69% vs acurácia −35,17% ROI: a descoberta central.
- [web] academic.oup.com/jrsssc/article/74/3/717 — Bayesian SSM bate Dixon-Coles (RPS 17,55 vs 22,22).
- [web] arxiv 2306.13063 / 2410.09724 / 2502.08680 — LLM descalibrado, confiança não-correlacionada, aritmética falha → não estima número.
- [web] arxiv 2604.19633 (TSAG) / 2509.06902 (PCN) / 2603.04663 (VeNRA) — tool-calling + grounding + Sentinel: número só de ferramenta.
- [web] journals.sagepub 15270025231204997 (Winkelmann 2024) — 1X2 eficiente; 77,63% das ineficiências são ruído.
- [web] betherosports.com/devigging-methods — Power/Shin para fair odds.
- [web] nickyoder.com/kelly-criterion — Kelly fracionário 0,25 como ranqueador/sizing.
- [web] mager.co/blog/2025-12-30 + oddsjam.com + rithmm.com — concorrentes: quant decide, LLM explica.
- [doc] [docs/regras/mercado-odds.md](../regras/mercado-odds.md) (SIN-012) — CLV como árbitro + anti-dupla-contagem.
- [doc] [docs/arquitetura/taxonomia-sinais.md](../arquitetura/taxonomia-sinais.md) — quem é quant vs narrativa; o edge vive nos sinais mensuráveis.
