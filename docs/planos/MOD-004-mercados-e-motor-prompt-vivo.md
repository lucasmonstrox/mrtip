# Dossiê de planejamento — MOD-004 · Mercados e motor do prompt de prognóstico vivo

Base: commit `da67b87` (2026-07-01). Todos os `file:linha` valem NESSE commit.

## Briefing (o que já foi decidido)

- **Investigação-mãe:** `docs/investigacoes/mercados-e-motor-prompt-prognostico.md` (`/rs` 2026-07-01) + dossiê web `scratchpad/dossie-mercados-prognostico.md` (61 subagentes).
- **Decisões do dono (esta conversa, 2026-07-01):**
  1. **Incremental** no prompt vivo — não o MOD-001 greenfield.
  2. **Backtest com lote pequeno** (10-15 jogos PL 25/26) — o harness é a fase 1, **gate** antes de calibrar.
  3. **Momentum pré-jogo:** decidir por **mini-teste A/B** (com vs sem, mede acerto do `best_bet`), não por palpite.
- **Altitude cravada (não re-litigar):** arquitetura **quant-first** (`docs/arquitetura/arquitetura-agente-prognostico.md`) — o LLM **nunca emite número**, o código calcula e o LLM só EXPLICA; confiança = f(calibração). Diretiva "**medir antes de calibrar**" (`docs/investigacoes/analise-prompt-prognostico.md`). Refutados que NÃO voltam como edge: fade-the-public (SIN-018), cansaço→under (SIN-020), game-state como edge pré-jogo (SIN-017), under-do-mata-mata como rivalidade (SIN-007).
- **Fora de escopo (viram feature própria):** escanteios → **MOD-005** (`depende_de: MOD-004`, precisa da plumbing de mercado + λ próprio); cartões (árbitro não ingerido — `needs_new_data`); goalscorer/player-shots (fase 2). Odds/EV/CLV dependem de DOS-001/SIN-012.

## Estado do terreno (real, com âncoras)

- **Motor:** `apps/api/scripts/prognosis-prompt.ts:422-440` — `marketProbs(lh,la)` monta `ph[]`/`pa[]` (Poisson por time) e no duplo laço soma `p = ph[h]*pa[a]` (**Poisson independente**). Retorna só `home/draw/away/over15/over25/over35/btts`. **O grid conjunto é computado no laço e descartado** — é a matéria-prima de todos os mercados derivados.
- **λ:** duas rotas — gols puros `lambdaHome/Away` (`:448-449`) e SoT×conv `xgViaSotHome/Away` (`:511-512`); `marketProbs` roda nas duas → `probsGoals`/`probsSot` (`:520-521`) + por tempo `probs1t`/`probs2t` (`:533-534`).
- **`share1` hardcoded 0.45:** `prognosis-prompt.ts:530` (fallback quando `scored1+scored2==0`) — deveria ser o split real da liga.
- **Doutrina park-the-bus (sinal invertido):** `prognosis-prompt.ts:1117-1121` ("favorito que faz 2-0 pode ADMINISTRAR → o jogo morre" / "queda longa após marcar = administra/segura").
- **Momentum pré-jogo:** `prognosis-prompt.ts:876-903` (reconstrói via `buildMomentum` + `matchTrend`), render em `momentumLines` (~`:1047`). Tensão com SIN-021 (momentum é descritivo/in-play).
- **Saída tipada:** `apps/api/scripts/run-deepseek.ts:110-135,145` — JSON Schema (AI SDK). Enum `best_bet.market` = `["1x2","over_under","btts","handicap","team_total"]` (`:113`); `general` em `:98-109`. Label de report em `:264-274`.
- **Persistência:** `match_prognosis` colunas tipadas text/real nullable + `rawOutput jsonb` (`apps/api/src/db/schemas/leagues.ts:496-534`; map `persist-prognosis.ts:53-58`). **Nenhuma migração** para valor de mercado novo.
- **Leitura/UI:** `get-prognosis.service.ts:12-62` (passthrough); `prognosis.tsx:186-204` (`betLabel`, um `if` por mercado — adicionar mercado = novo branch).
- **Dados mortos:** `match_team_stats.corners` (`leagues.ts:304`), tabela `card` (`:434-450`) — ingeridos, nunca lidos. `match_team_stats.xg` (`:283-284,327`) é **fantasma reservado** (add-on 5304 não comprado, sempre NULL).
- **Player-level existente:** `lineup_player.shotsOnTarget/keyPasses` (`leagues.ts:258-259`) — só agregado por time (`:94-112`), nunca por jogador. Chutes totais por jogador NÃO existem.

## Mapa de dependências

| Alvo alterado | Consumidores / re-teste | Como detectar quebra |
|---|---|---|
| `marketProbs` (`prognosis-prompt.ts:422`) | `probsGoals/probsSot/probs1t/probs2t` (`:520-534`) → todo o bloco de probabilidades do prompt | prompt gera; somas de placar ≈ 1; over/btts coerentes |
| enum `best_bet.market` (`run-deepseek.ts:113`) | `run-deepseek` (validação do provider); `persist` (passthrough); `prognosis.tsx:betLabel` | provider rejeita valor fora do enum → run falha; UI cai no fallback genérico `:203` |
| campos `general.*` novos | `persist-prognosis.ts` (rawOutput absorve); `get-prognosis.service.ts`; UI se renderizar | campo ausente no payload Eden |
| `share1` (`:530`) | `probs1t/probs2t` | 1x2 por tempo diverge da distribuição real |
| `match_team_stats`/`card` (leitura nova) | nenhum (só leitura) | — |

`bun run features impact MOD-004` → re-testar: MOD-001, AGT-001/002, DOS-002, LIG-007, SIN-017 (compartilham o motor/prompt).

## Blast radius

- **Motor (Dixon-Coles):** muda TODAS as probabilidades do prompt de uma vez. Sintoma se errar: over/btts pioram (calibração), 1x2 enviesa. Detecção: **backtest antes-vs-depois** (log-loss/RPS) — por isso o harness é gate.
- **Enum de mercado:** valor novo sem branch de label → UI mostra texto genérico (cosmético, não quebra). Valor novo que o provider não conhece → run falha (obrigatório atualizar `:113`).
- **`rawOutput jsonb`:** absorve qualquer campo novo sem migração — risco baixo.

## Modelo de dados

- **Sem migração no núcleo.** Mercados derivados reusam `bestBetMarket/Selection/Line` (text/real) + caem em `rawOutput`. Campos `general.*` computados vivem no jsonb até valer coluna própria.
- **Campos novos (computados em CÓDIGO, LLM recebe por referência):** `general.fair_odds_1x2`, `draw_value_flag`, `game_openness`, `correct_score_top`, `odd_even_prob`, `multigoals`, `first_to_score`, `ht_ft`, `league_band_baseline`. Enum `best_bet.market` += (faseado) `double_chance,draw_no_bet,correct_score,ht_ft,odd_even,multigoals`.
- **`selection` para dupla chance:** avaliar valores `home_draw`/`draw_away`/`home_away` — se adicionados, entram em `run-deepseek.ts:114` + `betLabel` (detalhe no passo P1).

## Riscos e gotchas

- **C1 — calibrar sem medir** contradiz diretiva cravada → harness (P2) é gate de P3+.
- **C2 — ρ do Dixon-Coles** precisa de MLE sobre os jogos ingeridos (só PL 25/26 → amostra curta); usar a faixa −0.03…−0.15 como sanity, número vem do harness.
- **C3 — LLM emitir número:** os campos numéricos novos são computados em código (`marketProbs`/helpers), NÃO pedidos ao LLM — senão viola quant-first e realuciona.
- **C4 — proliferação de mercado** dilui a leitura; só entram os com edge/baixa-variância (DC/DNB/multigoals/placar) — odd/even é neutro (incluir só porque é grátis do grid, sem alarde).
- **C5 — `bandOf` joga 45+x em '46-60'** (`:267`) diverge da convenção de mercado (acréscimo do 1ºT em '31-45') — documentar ao comparar com linha de 1ºT.
- **C6 — regulação (Lei 14.790):** saída é probabilidade/leitura, nunca promessa de ganho — o reenquadramento prob-only (P8) reforça.

## Provas — detalhe pesado

- **Harness (P2):** script `apps/api/scripts/backtest-prognosis.ts` que roda `run-deepseek` (ou lê runs persistidas) para N partidas com resultado conhecido (anti-leak já garantido pelo `CUTOFF=match.date` do prompt), grava por jogo: `best_bet` (market/selection/line), resultado real, hit/miss, prob prevista. Saída: tabela + `acurácia = hits/N` + log-loss do 1x2. Reusado em P3 (DC antes/depois) e P7 (momentum A/B).
- **Grid materializado (P4):** `marketProbs` passa a retornar também `topScores` (top-4 placares + prob), `marginDist` (P por diferença de gols, base de handicap), `oddEven`, `multigoals` (faixas 0-1/2-3/1-4/4+), `htftMatrix` (9 combinações via `probs1t`×condicional). Prova: `sum(topScores)+resto ≈ 1`, `oddEven.par+impar ≈ 1`.
