---
id: SIN-007
titulo: Sinal de rivalidade (clássicos, torcida, ex-clube)
modulo: sinais
status: verificado
prioridade: P2
facetas:
  dados: feito # tabela team_rival + ingest SportMonks /rivals + stubs
  api: feito # getMatch.rivalry + searchTeams sem stubs
  ui: feito # card Rivalidade na aba Fatos quando isRivalry
  ia: investigado # Índice 0–1, cartões/mando, prompt — fora desta iteração
testada: sim
testes:
  - "bun run typecheck (raiz/web) — limpo"
  - "cd apps/api && bun run scripts/_check-rivals.ts → 11/11 (T1–T9 + T3b/T5b)"
  - "cd apps/api && bun run scripts/sync-rivals.ts → 51 edges · errors=0"
  - "Chrome (agent-browser + sessão Clerk): Fla-Flu mostra card Rivalidade + copy assimétrica; Newcastle-Fulham sem card; console sem error novo (só warn Clerk dev keys)"
verificado_em: 2026-07-23
atualizado: 2026-07-23
depende_de: []
impacta: [DOS-001, MOD-001, SIN-016, SIN-009]
ancoras:
  settings: []
  tabelas: [team_rival, team, match]
  tools: []
  funcoes: [getMatch, loadMatchRivalry, ingestTeamRivals, searchTeams]
  rotas: ["GET /v1/matches/:key", "GET /v1/search"]
docs: [docs/regras/rivalidade.md, docs/research/fontes-rivalidade.md, docs/arquitetura/taxonomia-sinais.md, docs/investigacoes/derby-por-formato-de-competicao.md, docs/investigacoes/grafo-agentico-prognostico.md, docs/arquitetura/matriz-cruzamento-fora-dentro.md, docs/planos/SIN-007-rivalidade.md]
---

# Sinal de rivalidade (clássicos, torcida, ex-clube)

## Descrição

Índice de rivalidade por confronto (whitelist + distância de estádios + carga de H2H) e seus efeitos verificados: mais cartões, mando que encolhe, lei do ex. Sob mito: under em clássico e "favorito sempre tropeça".

> **Camada de formato de competição** (investigado 2026-06-28, [derby-por-formato-de-competicao.md](../../investigacoes/derby-por-formato-de-competicao.md)): o efeito derby muda com liga × copa mata-mata × europa, mas o condicionamento é **dados + heurística qualitativa**, não peso quant calibrado (n amostral insuficiente). Pré-requisito é migração de schema (`match` ganha `stage`/`leg`/`aggregate`/`neutral_venue`/regra-de-desempate-versionada) — território de DOS-001. Efeito-copa genérico (knockout menos gols/mando) é **separado** da rivalidade (anti-dupla-contagem). Gol-fora-→-over **refutado**; final neutra **atenua** (não zera) mando.

> **Corte desta iteração (2026-07-23):** persistir arestas SportMonks + flag no `getMatch` + card UI na aba Fatos. Índice contínuo, lei do ex e efeitos quant ficam nas tarefas abaixo / fase 2.

## Tarefas

- [x] P1 dados — tabela `team_rival` + CHECKs (`no_self`, `source`) + migração expand-only
- [x] P2 dados — `ingestTeamRivals` (prune só pós-fetch OK; não clobber `manual`; stub slug-`smId`)
- [x] P2b api — `searchTeams` exclui stubs sem standing
- [x] P3 api — `loadMatchRivalry` + `getMatch.rivalry` (Don't anti-prompt)
- [x] P4 dados — `_check-rivals.ts` T1–T9 verde após sync/backfill
- [x] P5 ui — card "Rivalidade / clássico" na aba Fatos quando `isRivalry` (copy whitelist, sem fingir Índice)
- [ ] (fase 2) dados — whitelist complementar (Wikipedia/derby.ist) + distância via `venue` lat/long
- [ ] (fase 2) dados — seed manual / buracos SM (Botafogo×Fla, …) + tier anti-FP (Dagenham) `[PENDENTE-DONO]`
- [ ] (fase 2) dados — schema de formato no `match` (DOS-001) + include `stage`
- [ ] (fase 2) ia — over de cartões, desconto no mando, tilt lei do ex; explicação no dossiê
- [ ] (fase 2) ia — roteador de formato (mando/neutro/prorrogação)

## Plano (2026-07-23)

Dossiê: [docs/planos/SIN-007-rivalidade.md](../../planos/SIN-007-rivalidade.md)

> Revisado após adversário Grok 4.5 high (REPROVA v0 → BLOQUEIOs incorporados). Pronto pro `/i` só com estes passos.

### Objetivo, aceite e non-goals

Persistir rivalidades clube×clube da SportMonks e expor no `getMatch` se o par tem aresta dirigida em qualquer sentido (`isRivalry` = whitelist SM, **não** Índice 0–1).
Non-goals: Índice 0–1; calibração cartões/mando; lei do ex; seed Wikipedia; mexer em `prognosis-prompt.ts`; auto-espelhar; score/tier.
Aceite:
- A1 [dados] após ingest, ≥25 arestas `sportmonks` **e** golden set (Flu→Fla, Inter→Grêmio, ≥1 PL) **e** ≥1 stub com slug `-{smId}` → P2/P4 (T2/T3)
- A2 [dados] re-ingest não apaga nem clobberra `manual`; fetch falho não pruneia → P4 (T5/T5b)
- A3 [api] derby → `isRivalry===true`; comum → `false`; legado intacto; stubs fora do search; prompt intacto → P2b/P3/P4 (T3b/T6/T7/T9)
- A4 [ui] derby mostra card Rivalidade na aba Fatos; comum não mostra → P5 (dono pediu após walking skeleton, 2026-07-23)

### Premissas

- `GET /v3/football/rivals/teams/{id}?include=rival` 200 no plano atual (probe 2026-07-23).
- `team.sportmonksTeamId` (`leagues.ts:51`) join com `rival_id` SM.
- Cobertura SM parcial/assimétrica — esperado; Botafogo×Fla etc. ficam FN até fase 2.
- `searchTeams` hoje varre todo `team` (`search.service.ts:85-91`) — premissa que P2b corrige.
- Se endpoint SM mudar: PARAR, datar divergência no Plano/dossiê.

### Decisões

- D1: aresta dirigida + `source` — driver: shape SM + Difference Score; descartado: unique undirected; pagamos: `isRivalry` = OR.
- D2: stub `team` pra rival fora da liga **com** `slug=slugify(name)+"-"+smId` e exclusão da busca — driver: FK + higiene (adversário); descartado: `sportmonks_rival_id` sem FK; pagamos: rows fantasma no catálogo (invisíveis no search).
- D3: prune só `source='sportmonks'` **e só após fetch OK** — driver: preservar manual + anti-wipe (adversário).
- D4: conflito `(team,rival)` com `manual` → SM **não** faz DoUpdate (skip) — driver: curadoria > API.
- D5: consumidor = `getMatch.rivalry` + card Fatos; `isRivalry` documentado como whitelist SM — driver: walking skeleton sem fingir calibração (UI pedida pelo dono após P1–P4).
- D6: CHECK SQL `team_id<>rival_team_id` + `source IN (…)` na migration — driver: adversário; descartado: “só guard no ingest”.
- Adiadas pro `/i`: nome exato do arquivo (`sync-rivals.ts` vs bloco em `sync-ingest.ts`), copy de logs, se `getTeam` lista rivais (não aceite).

### Passos

**P1 [dados] schema `team_rival`** — em `apps/api/src/db/schemas/leagues.ts`, criar `teamRival` (dossiê §Schema) com `unique(teamId, rivalTeamId)`, FKs → `team.id`, `source` default `"sportmonks"`, carimbo `// @feature SIN-007` só na tabela. Migration SQL **obriga** `CHECK (team_id <> rival_team_id)` e `CHECK (source IN ('sportmonks','manual'))`. `cd apps/api && bun run db:generate && bun run db:migrate`. Regras: inglês no dado; `type` nunca `interface`; expand-only. Don't: score/intensidade; `interface`; unique undirected; FK nullable; carimbo em `team`/`match`; omitir os CHECKs. Prova: migrate 0; information_schema lista cols + unique + 2 check constraints.

**P2 [dados] ingest SportMonks (depende: P1)** — `ingestTeamRivals` (dossiê §Ingest): pós-`teamIdBySm` em `sync-sportmonks.ts:400`; stub com slug `-{smId}`; **prune só após fetch 200+parse OK** (erro → skip, sem DELETE); se row `(team,rival)` é `manual` → não clobber; Don't auto-espelhar; Don't drop rival fora da liga; Don't mutar time completo no stub; Don't chamar `/rivals` por fixture; Don't gravar em dry-run. Script `scripts/sync-rivals.ts` pra backfill. Prova: `bun run scripts/sync-rivals.ts` → log com N≥25 e errors reportados; `COUNT(*) source=sportmonks` ≥ 25.

**P2b [api] search sem stubs (depende: P2)** — `searchTeams` em `apps/api/src/modules/leagues/search/search.service.ts:85-91` só retorna times com ≥1 `standing` (join/exists). Regras: pasta-por-endpoint; `type` não `interface`. Don't: filtrar por `logoUrl`; quebrar busca de times reais da PL/BRA. Prova: T3b — search do nome do stub → 0 hits desse id; search "Arsenal"/"Flamengo" ainda retorna o clube real.

**P3 [api] `rivalry` no getMatch (depende: P2)** — `loadMatchRivalry` em `shared/shared.ts` + campo em `get-match.service.ts` (dossiê §API). Comentário no loader: não alimentar λ/prompt. Regras: routes fino; TypeBox se precisar; sem response schema Elysia; `type` não `interface`. Don't: remover legado; calcular índice 0–1; filtrar por liga; editar `prognosis-prompt.ts`; `interface RivalryInfo`. Prova: getMatch derby → `isRivalry===true`; não-derby → `false`; `referee`/`tvStations` definidos.

**P4 [dados+api] verificação (depende: P2b,P3)** — `apps/api/scripts/_check-rivals.ts` com T1–T9 (dossiê §Testes; inclui T3b/T5b → 11 asserts). Don't: inventar `bun test`; soft-assert N=0; T8 só por COUNT. Prova: `cd apps/api && bun run scripts/_check-rivals.ts` → exit 0 imprimindo `11/11`.

### Verificação final

- `bun run typecheck` limpo (raiz)
- **API/dados:** `_check-rivals.ts` → todos T1–T9 (dossiê §Testes)
- **Browser / Playwright:** n/a (sem `ui`)
- re-teste: search de clube real; `getMatch` legado (T6); sync não regrediu teams/fixtures
- último passo: subagent fresco revisa diff contra A1..A3 — gap só de requisito

### Pré-mortem e rollback

- C1: rival fora da liga dropado → T3 + stub obrigatório
- C2: prune/clobber `manual` → T5; skip se manual; prune só `sportmonks`
- C3: auto-espelho → T4; Don't P2
- C4: fetch falha → wipe SM — **mitigado**: skip sem DELETE (T5b)
- C5: stub no search / slug colide → slug-`smId` + P2b (T3/T3b)
- C6: alguém pluga `isRivalry` no prompt cedo → T9 + Don't P3; matriz representável≠identificável
Rollback: `DROP TABLE team_rival`; revert campo `rivalry` + filtro search. NÃO desfaz: stubs `team` (permanecem; invisíveis no search até standing).

### Fora de escopo

- Índice 0–1 + calibração + prompt → fase 2 (`ia: investigado`)
- Seed manual / tier anti-Dagenham / Botafogo×Fla → fase 2; `[PENDENTE-DONO]`
- Schema `match.stage` → DOS-001

## Verificação

- **A1 [dados]** `_check-rivals` T2: 51 arestas `sportmonks`; golden Flu→Fla, Inter→Grêmio, Arsenal→Spurs / City→United; T3 stub `america-mineiro-6325`.
- **A2 [dados]** T5 manual sobrevive re-ingest; T5b fetch forçado a falhar → arestas SM intactas (`errors=1`, before=after).
- **A3 [api]** T6 Fla-Flu `isRivalry===true` + legado 6/6; T7 Newcastle-Fulham `false`; T3b search "América" sem stub / Arsenal+Flamengo ok; T9 `prognosis-prompt.ts` sem diff.
- **UI** agent-browser (Clerk): Fla-Flu card "Clássico / rivalidade marcada" + assimetria; Newcastle-Fulham sem card; console sem error novo.
- Typecheck API/web limpo; `sync-rivals.ts` → `51 edges · errors=0`.
- Nota: `chrome-devtools` MCP indisponível nesta sessão — prova UI via `agent-browser`.

## Evidências

- [doc] `docs/investigacoes/grafo-agentico-prognostico.md` §6.1 (posterior ao pino) — ingerir `/rivals`.
- [doc] `docs/arquitetura/matriz-cruzamento-fora-dentro.md` §9 (posterior ao pino) — sem entidade de rivalidade.
- [doc] `docs/regras/rivalidade.md:147` — assimetria (Difference Score).
- [código] `apps/api/src/db/schemas/leagues.ts` — `teamRival` + CHECKs na migration `0042`.
- [código] `apps/api/src/db/sync-rivals.ts` — `ingestTeamRivals` + gancho em `sync-sportmonks.ts`.
- [código] `apps/api/src/modules/leagues/search/search.service.ts` — `searchTeams` exige standing.
- [código] `apps/api/src/modules/leagues/get-match/get-match.service.ts` — campo aditivo `rivalry`.
- [prova] 2026-07-23 — `bun run scripts/_check-rivals.ts` → **11/11**.
- [adversário] 2026-07-23 Grok 4.5 high — REPROVA v0; BLOQUEIOs neste Plano.
- [probe] 2026-07-23 — BRA 17 (12/20); PL 31 (16/20); Flu→Fla; Botafogo FN.
