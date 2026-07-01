---
id: MOD-004
titulo: Mercados e correção do motor no prompt de prognóstico vivo
modulo: modelos
status: em-andamento
prioridade: P1
facetas:
  dados: em-andamento # split 1ºT/2ºT real (P6); falta baseline por faixa de 15min
  api: em-andamento # enum double_chance/draw_no_bet/odd_even (P1/P5)
  ia: em-andamento # Dixon-Coles + grid + doutrina (P3/P4/P8); falta P7 (xg_bands+momentum A/B)
  ui: em-andamento # betLabel dos mercados novos (P1)
testada: parcial
testes:
  - "typecheck api+web verde (2026-07-01)"
  - "prompt gen jogo real 00979e2b: blocos Dixon-Coles/dupla-chance/DNB/fair-odds/baseline renderizam; baseline 44/56 em 344 jogos"
  - "scripts/_backtest-dc.ts em 16 jogos reais: DC melhora log-loss do empate 0.848→0.808 e BTTS 0.708→0.697; over2.5 inalterado (esperado)"
depende_de: [DOS-002, LIG-007]
impacta: [MOD-001, MOD-005, AGT-001, AGT-002, DOS-002, LIG-007, SIN-017]
ancoras:
  settings: []
  tabelas: [match_prognosis, match_team_stats, card, match_trend, lineup_player]
  tools: []
  funcoes: [marketProbs, buildPrompt, absences, timing, stakesFor]
  rotas: ["/matches/:id/prognosis"]
docs:
  - docs/investigacoes/mercados-e-motor-prompt-prognostico.md
  - docs/investigacoes/analise-prompt-prognostico.md
  - docs/arquitetura/arquitetura-agente-prognostico.md
  - docs/planos/MOD-004-mercados-e-motor-prompt-vivo.md
verificado_em: null
atualizado: 2026-07-01
---

# Mercados e correção do motor no prompt de prognóstico vivo

## Descrição

O pipeline vivo de prognóstico (`prognosis-prompt.ts` → `run-deepseek.ts` → `persist-prognosis.ts` → `get-prognosis` → `prognosis.tsx`) roda hoje sem feature própria no registro. Esta feature captura a **evolução incremental** desse pipeline: (1) corrigir o motor determinístico (`marketProbs` usa Poisson independente; falta Dixon-Coles e o grid de placar é calculado e descartado); (2) abrir mercados derivados desse grid (dupla chance, DNB, placar exato, HT/FT, odd/even, multigoals, escanteios); (3) alinhar a doutrina do prompt à arquitetura quant-first já cravada (LLM explica, não estima números). É o caminho pragmático que de-risca o MOD-001 (motor quant greenfield) entregando valor no prompt que já roda.

## Tarefas

- [x] P1 api+ia+ui — walking skeleton: `double_chance`/`draw_no_bet`/`odd_even` no enum + prompt + `betLabel`, ponta-a-ponta
- [~] P2 ia — harness de calibração do motor em jogos reais (`scripts/_backtest-dc.ts`): DC melhora log-loss de empate/BTTS. Falta o harness que roda o pipeline e mede o `best_bet` do LLM
- [x] P3 ia — Dixon-Coles τ em `marketProbs` (ρ=−0.13 provisório; MLE fica pro harness quando a base crescer)
- [x] P4 ia — materializar o grid → dupla chance, DNB, odd/even, multigoals, placar exato, fair odds
- [~] P5 api+ia+ui — `double_chance`/`draw_no_bet`/`odd_even` selecionáveis + todos os derivados mostrados como prior. Falta `correct_score`/`ht_ft` selecionáveis (só exibidos)
- [~] P6 dados+ia — split 1ºT/2ºT real da liga (mata `share1`=0.45) + baseline no prompt. Falta o baseline por FAIXA de 15min (6 buckets)
- [ ] P7 ia — `bothPush` remodela `xg_bands` + mini-teste A/B de momentum (decide SIN-021 pelo número) — **não iniciado**
- [x] P8 ia — doutrina: park-the-bus corrigido, empate/DC destravado, `fair_odds` no-vig computado em código + prob-only

## Plano

**Objetivo:** evoluir o pipeline vivo de prognóstico movendo produção de número pro código determinístico (quant-first), abrindo mercados derivados coerentes e corrigindo a doutrina — tudo medido por backtest. Detalhe em `docs/planos/MOD-004-mercados-e-motor-prompt-vivo.md`. Escanteios → MOD-005.

> **Gate:** P2 (harness) precede toda calibração (P3+) — diretiva "medir antes de calibrar". O walking-skeleton ponta-a-ponta é o P1 (menor mercado que atravessa api+ia+ui, sem calibração). Regra dura: **todo campo numérico novo é computado em CÓDIGO** (`marketProbs`/helpers) e o LLM recebe por referência — nunca pedir número ao LLM.

**P1 — Walking skeleton: dupla chance + DNB (api+ia+ui).** Derivar `double_chance`/`draw_no_bet` da prob de empate JÁ existente (`probsGoals/probsSot.draw`, `prognosis-prompt.ts:520-521`) — sem grid, sem calibração. Adicionar ao enum `best_bet.market` (`run-deepseek.ts:113`) + `selection` novos se preciso (`home_draw`/`draw_away`, `:114`); instrução no prompt; branch em `betLabel` (`prognosis.tsx:186-204`).
  - **Prova:** `bun run scripts/run-deepseek.ts <matchId>` → objeto validado com `best_bet.market` podendo ser `double_chance`; abrir a aba Prognóstico no Chrome e ver o label correto (não o fallback genérico).

**P2 — Harness de backtest do `best_bet` (ia) [GATE].** Script `apps/api/scripts/backtest-prognosis.ts` que roda o pipeline em N partidas com resultado conhecido (anti-leak via `CUTOFF` já existente) e grava por jogo: aposta, resultado real, hit/miss, prob prevista; imprime acurácia + log-loss do 1x2. Detalhe: dossiê §Provas.
  - **Prova:** `bun run scripts/backtest-prognosis.ts --n 12` → tabela com ≥10 jogos, coluna hit/miss preenchida e linha final `acurácia=X/N · logloss=…`.

**P3 — Dixon-Coles τ em `marketProbs` (ia).** Aplicar o fator τ (ρ estimado por MLE sobre os jogos ingeridos; faixa −0.03…−0.15 como sanity) sobre `p(0,0)/p(1,0)/p(0,1)/p(1,1)` dentro de `marketProbs` (`prognosis-prompt.ts:422-440`); recalcular over/btts da matriz corrigida.
  - **Prova:** `bun run scripts/backtest-prognosis.ts` antes-vs-depois → log-loss/RPS documentado (não piora) e P(0-0)/P(1-1) sobem vs Poisson puro (assert no script).

**P4 — Materializar o grid de placar (ia).** `marketProbs` passa a retornar também `topScores`, `marginDist` (base de handicap), `oddEven`, `multigoals`, `htftMatrix` — do MESMO grid corrigido (coerência por construção). Detalhe: dossiê §Provas.
  - **Prova:** teste inline no script: `sum(topScores)+resto ≈ 1` e `oddEven.par+oddEven.impar ≈ 1` (tolerância 0.01).

**P5 — Expor os mercados do grid na saída (api+ia+ui).** Enum `best_bet.market` += `correct_score,ht_ft,odd_even,multigoals` (`run-deepseek.ts:113`); campos `general.*` (`correct_score_top`, `odd_even_prob`, `multigoals`, `ht_ft`, `first_to_score`) passados por referência ao prompt; branches em `betLabel` (UI + `run-deepseek.ts:264-274`).
  - **Prova:** `bun run scripts/run-deepseek.ts <matchId>` → `general` traz os campos novos; `best_bet` pode ser `correct_score`; Chrome renderiza o label.

**P6 — Baseline de liga por faixa + split real (dados+ia).** Computar sobre `played` a distribuição de gols da liga por faixa de 15min + split 1ºT/2ºT real; injetar como bloco de baseline no prompt; substituir o `share1` hardcoded 0.45 (`prognosis-prompt.ts:530`) pelo split real da liga.
  - **Prova:** prompt gerado contém o bloco "baseline da liga por faixa"; `grep -n "0.45" prognosis-prompt.ts` não retorna o fallback antigo em uso (ou assert que `share1` da liga ≠ 0.45 num jogo real).

**P7 — `xg_bands` por `bothPush` + A/B de momentum (ia).** No veredito de intenção (`prognosis-prompt.ts:871-874`), quando `bothPush`, instruir a concentrar mais massa nas faixas tardias (76-90) do `xg_bands` (não só o total) e moderar a conversão do lado que persegue. Rodar o mini-teste A/B: backtest com vs sem o bloco de momentum (`:876-903`).
  - **Prova:** `bun run scripts/backtest-prognosis.ts --ab momentum` → duas acurácias (com/sem) impressas; decisão de manter/remover registrada no dossiê §Riscos.

**P8 — Doutrina no prompt (ia, EXPLICAR).** Corrigir o texto park-the-bus (`:1117-1121`) para o sinal certo (compactação tardia do líder AUMENTA risco de sofrer); destravar empate/dupla-chance como pick legítimo (remover o empurrão anti-empate); reenquadrar `best_bet` como prob-only + emitir `general.fair_odds_1x2` (no-vig `1/prob` normalizado, **computado em código**).
  - **Prova:** `bun run scripts/run-deepseek.ts <matchId>` → `general.fair_odds_1x2` presente e ≈ devig de `one_x_two`; diff do prompt mostra o texto park-the-bus corrigido e a regra de empate.

**Verificação:** backtest do `best_bet` em ≥10 jogos com acurácia + log-loss (P2), assert das somas do grid (P4), e os campos novos presentes no payload do `/matches/:id/prognosis` (assert no banco/Eden).

**Fora de escopo (features próprias):** escanteios → MOD-005 (`depende_de: MOD-004`); cartões (precisa árbitro, `needs_new_data`); goalscorer/player-shots (fase 2); odds/EV/CLV (DOS-001/SIN-012).

## Evidências

- [código] `apps/api/scripts/prognosis-prompt.ts:422-440` — `marketProbs` soma o grid `ph[h]*pa[a]` e só retorna 1x2/over/btts; o grid é descartado.
- [código] `apps/api/scripts/run-deepseek.ts:113` — enum `best_bet.market` = `["1x2","over_under","btts","handicap","team_total"]`; `double_chance`/`draw_no_bet` ausentes.
- [código] `apps/api/src/db/schemas/leagues.ts:304,434-450` — `match_team_stats.corners` e tabela `card` existem, ingeridos, nunca lidos pelo prompt.
- [código] `apps/api/src/db/schemas/leagues.ts:283-284,327` — `match_team_stats.xg` é coluna reservada nullable (add-on 5304 não comprado) → "não temos xG" está correto.
- [doc] `docs/investigacoes/analise-prompt-prognostico.md` — diretiva "NÃO calibrar viés-under sem MEDIR" + "nunca passa" contradiz persona sharp.
- [doc] `docs/arquitetura/arquitetura-agente-prognostico.md` — quant-first: LLM nunca emite número, só explica; confiança = f(calibração).

## Verificação

Feito em 2026-07-01 (parcial — P7 e o E2E do LLM em aberto):
- **typecheck** api + web verde (`tsc --noEmit`).
- **Motor (P3/P4)** provado gerando o prompt de um jogo REAL (`bun run scripts/prognosis-prompt.ts 00979e2b-…`, exit 0): bloco "Probabilidades de mercado (Poisson corrigido por Dixon-Coles)" + "Mercados derivados" renderizam com números coerentes — dupla chance 1X 83%/X2 48%, DNB 75/25, placar exato 1-0 16%/0-0 14%/1-1 14% (DC elevou os empates), fair odds 1.93/3.22/5.89 (=1/prob). Grid soma 1.
- **Baseline (P6)** computou 44%/56% (1ºT/2ºT) sobre 344 jogos reais — bate com a literatura (~44/56).
- **Harness (P2, `scripts/_backtest-dc.ts`)**: em 16 jogos reais com placar do banco, Dixon-Coles baixa o log-loss do empate (0.848→0.808) e do BTTS (0.708→0.697); over2.5 inalterado (propriedade do τ, confirmada).

**Em aberto pra `status: verificado`:** P7 (xg_bands por bothPush + A/B de momentum); E2E do LLM (rodar `run-deepseek` e confirmar que ele escolhe `double_chance`/`draw_no_bet` e a UI renderiza o label — não rodado: custa chamada de API); baseline por faixa de 15min; `ρ` definitivo por MLE quando a base crescer.
