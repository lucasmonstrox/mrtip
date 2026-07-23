---
id: SIN-023
titulo: Viagem / deslocamento dos times (km, última perna)
modulo: sinais
status: verificado
prioridade: P2
facetas:
  ia: feito # last-leg+proxy, escala PL/BRA, doutrina EXPLAIN no prompt vivo; super herda Contexto
testada: sim
testes:
  - "P1 BRA dd109402 (2026-07-23): `Viagem do visitante: ~981 km (great-circle venue→venue; last-leg; modal desconhecido)`"
  - "P1 last-leg≠proxy 2584f5c3: prompt `~1010 km ... last-leg` (probe home-proxy seria 2160)"
  - "P2 PL 77a4255a: escala p50≈180 · p90≈357; BRA dd109402/d87c9963: 722/2314; 0 bins curta|média|longa nas linhas `- Viagem`/`- Escala`"
  - "P3 doutrina EXPLAIN + não dupla-conte mando + sem “viagem longa → under”; `rg SIN-023` em leagues.ts ≥1"
  - "P4 marcadores `## Contexto` + `**PARTE 3` presentes; Descanso byte-igual ao baseline; Rota A/B λ idênticos (dd109402 1.71/1.89; d87c9963 1.69/0.6)"
  - "typecheck @workspace/api --force verde (2026-07-23)"
  - "revisor fresco (Grok 4.5 high): nenhum gap A1–A4"
depende_de: [LIG-004, LIG-005]
impacta: [SIN-008, SIN-016, MOD-004]
ancoras:
  settings: []
  tabelas: [venue, match]
  tools: []
  funcoes: [haversineKm, lastMatchAnyComp, AwayTravel]
  rotas: []
docs:
  - docs/investigacoes/viagem-deslocamento-times.md
  - docs/regras/calendario-fadiga.md
  - docs/investigacoes/venue-estadio-geo.md
  - docs/planos/SIN-023-viagem-deslocamento-times.md
verificado_em: 2026-07-23
atualizado: 2026-07-23
---

# Viagem / deslocamento dos times (km, última perna)

## Descrição

Expor no dossiê/prompt de prognóstico a distância geográfica **inbound do visitante** até o estádio do jogo (haversine venue→venue, preferindo last-leg via `lastMatchAnyComp`; fallback = proxy casa→jogo), com proveniência explícita e **sem inventar modal**. Distinto de SIN-008 (ressaca de calendário + altitude) e de SIN-020 (janelas sazonais). Camada EXPLAIN — não move λ; não dupla-conta mando. ≠ W-049 (km corridos na partida).

## Tarefas

- [x] P1 ia — last-leg inbound do visitante + fallback proxy + linha com proveniência/modal desconhecido
- [x] P2 ia — escala p50/p90 por liga (PL/BRA) sem bins de edge
- [x] P3 ia — doutrina EXPLAIN (SIN-008/mando) + comentário venue→SIN-023
- [x] P4 ia — herança super + não-regressão do `## Contexto` / λ intactos

## Plano (2026-07-23)

Dossiê: [docs/planos/SIN-023-viagem-deslocamento-times.md](../../planos/SIN-023-viagem-deslocamento-times.md)
Gate `depende_de`: LIG-004 e LIG-005 estão `verificado` — sem P0.

### Objetivo, aceite e non-goals

Pronto = o prompt vivo de um jogo real mostra km inbound do **visitante** com método auditável (last-leg ou home-proxy), nota de escala PL/BRA, doutrina EXPLAIN anti-λ/anti-mando, e o super continua herdando o `## Contexto` sem mudança de λ.
Non-goals: modal inventado; Mapbox; schema/`match_team_travel`; viagem do mandante; bins curta/média/longa como edge; UI RestPanel; campo API; cumulative away-km; fuso/direção; backtest CLV; W-049.
Aceite (cada critério aponta a Prova que o cobre):
- A1 [ia] prompt traz `Viagem do visitante: ~N km` com proveniência great-circle + method (`last-leg` ou `home-proxy`) + “modal desconhecido” → coberto por P1
- A2 [ia] em `leagueCode` PL ou BRA, aparece escala p50/p90 (constantes do dossiê §Copy) **sem** rótulo de edge curta/média/longa → coberto por P2
- A3 [ia] bullet de doutrina: EXPLAIN / não move λ / não dupla-conta mando / sem causal “longe→under” → coberto por P3
- A4 [ia] `super-prognosis` ainda fatia `## Contexto`…`**PARTE 3`; diff do md restrito ao Contexto; linhas de λ/probs iguais ao baseline → coberto por P4

### Premissas

- `haversineKm` (`prognosis-prompt.ts:28-36`), `lastMatchAnyComp` (`:817-822`), `Row.venueId` e `matchVenue` (`:55`) existem e bastam — zero schema.
- Super herda Parte 2 via spawn (`super-prognosis.ts:772-778`) — mudar o vivo basta para o super, salvo marcadores quebrados.
- Cobertura geo PL/BRA ≈ 100% (FAC esparso → fallback); se premissa cair: PARAR e atualizar o Plano (não inventar Mapbox no MVP).
- Se `lastMatchAnyComp` deixar de devolver `venueId` / shape de `match`: PARAR.

### Decisões

- D1: copy = **km + proveniência + escala p50/p90** (proxy, as-of 2026-07-23: PL 180/357, BRA 722/2314) — driver: MVP do `/rs` + default seguro vs km-only; descartado: bins ordinais (counter-review) e km-only (perde contexto de liga); pagamos: constantes podem envelhecer até refresh manual.
- D2: primário = **last-leg away**; escala usa **distribuição proxy** (tamanho típico estável da liga) — driver: acute vs baseline; descartado: last-leg home (volta ≠ inbound do kickoff).
- D3: facetas `api`/`ui`/`dados` **omitidas** no MVP (só `ia`) — driver: não gold-platear; UI/API/materialização ficam em Fora de escopo.
- Adiadas ao `/i`: micro-copy exata dos labels `last-leg` vs “última perna”; se a linha de escala fica logo abaixo ou no mesmo bullet; escolha do 3º matchId onde last-leg ≠ proxy.

### Passos

**P1 [ia] esqueleto last-leg** — `apps/api/scripts/prognosis-prompt.ts`: substituir o bloco proxy `:901-909` por cálculo inbound do visitante — preferir venue de `lastMatchAnyComp(away.id)` → `matchVenue` via `haversineKm`; fallback = proxy casa→jogo atual; expor `method: "last_leg" | "home_proxy"` (`type`, nunca `interface`). Renderizar sob Descanso (`:1940`) a linha com `~N km`, great-circle, method e “modal desconhecido”. Regras: código/dado em inglês, string de UI/prompt em português; `type` não `interface`. Don't: calcular viagem do mandante; inferir ônibus/avião (limiar 500 km CBF ou 2,5 h Spurs); chamar Mapbox; criar coluna/tabela; alterar `restDays`/`lastMatchAnyComp`; tocar `lambdaHome`/`marketProbs`. Prova: `cd apps/api && bun run scripts/prognosis-prompt.ts dd109402-f7cd-4029-b3da-14e9044fb1c4 | rg -n "Viagem do visitante"` → 1 linha com `~[0-9]+ km`, `great-circle`, (`last-leg`|`home-proxy`|última perna|proxy) e `modal desconhecido`; exit 0.

**P2 [ia] escala por liga (depende: P1)** — mesma file: mapa/constantes `PL`/`BRA` (dossiê §Copy, D1); imprimir linha de escala só nessas ligas (“p50 ≈ … · p90 ≈ … — contexto, não edge”). Don't: bins `curta|média|longa` como rótulo de sinal; escala em liga sem constante (omitir); query online obrigatória no hot path. Prova: mesmo comando em id BRA → `rg "p50|p90"` ≥ 1 e `rg -i "curta|média|longa"` = 0 nas linhas novas de Viagem/Escala; em id PL default `77a4255a-3e44-4fd9-a133-b13ca0898a91` → escala PL presente; exit 0.

**P3 [ia] doutrina + naming (depende: P1)** — bullet novo no `## Contexto` (perto `:1943-1946`) com as 5 âncoras do dossiê §Doutrina (EXPLAIN; não move λ; não dupla-conta mando já em `:1946`; acute fraco; sem causal longe→under). Atualizar comentário de `haversineKm` (`:27`) e de `venue` em `apps/api/src/db/schemas/leagues.ts:92-95` para citar SIN-023 (travel) vs SIN-008 (fadiga/altitude). Don't: peso numérico no λ; “EXPLAIN never weights” sem as travas de mando/fadiga; migrar schema “de passagem”. Prova: `rg -n "EXPLAIN|não dupla-cont|nao dupla-cont|NÃO.*λ|não move" scripts/output/prognosis-dd109402-f7cd-4029-b3da-14e9044fb1c4.md` (após regenerar) ≥ 1 no bloco Contexto; `rg "SIN-023" apps/api/src/db/schemas/leagues.ts` ≥ 1; exit 0.

**P4 [ia] super + não-regressão (depende: P1-P3)** — confirmar que `super-prognosis.ts:772-778` ainda encontra marcadores após o diff (gerar prompt basta; spawn do super só se o `/i` tiver env). Salvar baseline pré-mudança (ou diff contra output já gerado na árvore) e regenerar: hunks **só** em `## Contexto` (Viagem/Escala/doutrina); seções de λ/probs byte-iguais nas linhas de âncora. Don't: editar o protocolo longo do super “por simetria” sem necessidade; mudar formato de saída JSON do super. Prova: `cd apps/api && bun run scripts/prognosis-prompt.ts dd109402-f7cd-4029-b3da-14e9044fb1c4` exit 0; `rg -n "^## Contexto|^\*\*PARTE 3" scripts/output/prognosis-dd109402-f7cd-4029-b3da-14e9044fb1c4.md` → ambos presentes; diff vs baseline pré-P1 restrito a Contexto (nenhum hunk em “λ”/“Rota A”/“Rota B”/market probs); exit 0.

### Verificação final

- `bun run typecheck` limpo na raiz (ou pelo menos `apps/api` se o monorepo tiver ruído pré-existente — declare).
- **API/dados:** N/A (sem rota/schema). Assert opcional de cobertura geo: query read-only PL/BRA 100% (dossiê §Testes) — não inventar `bun test`.
- **Browser / Playwright:** N/A (sem faceta `ui`).
- Provas P1–P4 nos matchIds do dossiê §Provas.
- re-teste prático: MOD-004 (prompt gera; λ intactos), SIN-008/SIN-016 (doutrina anti-dupla-contagem presente no texto), LIG-005 (linha Descanso intacta).
- último passo: subagent em contexto fresco revisa o diff contra A1–A4 — reporta só gap de requisito; diff fora de `prognosis-prompt.ts` + comentário `leagues.ts` = achado.

### Pré-mortem e rollback

3 semanas depois do merge, quebrou. Causas mais prováveis:
- C1: **dupla contagem com mando** — LLM desconta visitante “longe” além da vantagem de casa já nos λ — sintoma: bias sistemático em away long-haul; mitigação: bullet P3 + A3.
- C2: **last-leg mentiroso (FAC/copa sem geo ou jogo sumido)** — sintoma: method sempre `home-proxy` ou km absurdo; mitigação: proveniência explícita + fallback; não inventar modal.
- C3: **linguagem causal / bins** — sintoma: copy “viagem longa → under”; mitigação: Prova P2 proíbe bins; doutrina P3.
- C4: **marcadores do super quebrados** — sintoma: super throw na fatia Contexto; mitigação: Prova P4.
Rollback: `git revert` (só texto de script + comentário). O rollback NÃO desfaz: prompts/prognósticos já gerados e persistidos com a linha antiga/nova.

### Fora de escopo

- UI linha de viagem no painel Descanso / campo `travel` na API get-match → opcional pós-MVP (não criar ID agora; reabrir com `/rs` curto se o dono pedir paridade RestPanel).
- Materializar `match_team_travel` → pós-MVP audit/UI.
- Mapbox Directions / geocode — só se `missing_geo` > 0.
- Cumulative away-km / time-away (S4) → v2; merece `/rs` curto depois.
- Fuso / direção leste×oeste BR — fora.
- Backtest CLV distância×mercados (`calendario-fadiga.md` §4) — pós; peso continua zero até lá.
- W-049 tracking in-match — outro constructo.
- Last-leg do mandante — counter-review REFUTED.

## Evidências

- [doc] docs/investigacoes/viagem-deslocamento-times.md — investigação completa + matriz A–F + counter-review.
- [doc] docs/planos/SIN-023-viagem-deslocamento-times.md — dossiê deste `/pl` (Base `b8d47c1`).
- [código] `apps/api/scripts/prognosis-prompt.ts:28-36` — `haversineKm` já existe.
- [código] `apps/api/scripts/prognosis-prompt.ts:901-909` — proxy atual (casa visitante→jogo), não last-leg.
- [código] `apps/api/scripts/prognosis-prompt.ts:1940` — linha `Viagem do visitante: ~N km` no Contexto.
- [código] `apps/api/scripts/prognosis-prompt.ts:817-822` — `lastMatchAnyComp` (base do last-leg).
- [código] `apps/api/scripts/super-prognosis.ts:772-778` — super herda `## Contexto` via spawn.
- [código] `apps/api/src/db/schemas/leagues.ts:104-105` — `venue.latitude`/`longitude`.
- [web] https://www.bbc.co.uk/sport/football/65017565 — PL não manda viagem; 81 voos/100 jogos (Flightradar24).
- [web] https://ge.globo.com/futebol/futebol-feminino/brasileiro-feminino/noticia/2025/06/13/brasileiro-feminino-como-clubes-encaram-regra-da-cbf-para-viagens.ghtml — CBF feminino A1 &gt;500 km = custeio, não fisiologia.
- [web] https://stcbfsiteprdimgbrs.blob.core.windows.net/img-site/cdn/REC_Copa_do_Brasil_2026_7c91253458.pdf — REC oficial: rodoviário ≤500 km / aéreo &gt;500 km (ainda custeio).
- [web] https://pubmed.ncbi.nlm.nih.gov/39079688/ — viagem aguda sem associação clara; cumulativo efeito pequeno.
- [web] https://doi.org/10.1016/j.jsams.2023.08.151 — A-League: modalidade &gt; home/away; road no dia pior.
- [doc] docs/regras/calendario-fadiga.md — fadiga crua REFUTED; distância não-sig controlando força; altitude fica em SIN-008.

## Verificação

Provas P1–P4 do Plano (2026-07-23), superfície **ia** via `bun run scripts/prognosis-prompt.ts <matchId>` (cwd `apps/api`):

1. **Erro/borda:** bins `curta|média|longa` ausentes nas linhas `- Viagem`/`- Escala` (3 jogos). Match `2584f5c3` prova method `last-leg` quando km ≠ home-proxy (1010 vs 2160).
2. **Variantes:** PL (escala 180/357) + BRA (722/2314); método `last-leg` nos 4 ids gerados nesta sessão.
3. **Golden path:** Contexto com viagem+escala+doutrina EXPLAIN; Descanso intacto; λ/Rota A/B iguais ao baseline pré-diff; marcadores `## Contexto`→`**PARTE 3` intactos (super herda).

UI/API/chrome: N/A (MVP só `ia`). Revisor em contexto fresco: nenhum gap A1–A4.
