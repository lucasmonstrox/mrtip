---
id: DOS-002
titulo: Estatísticas de partida por time (fixture statistics)
modulo: dossie
status: feito
prioridade: P2
facetas:
  dados: feito # ingestão do include `statistics` da SportMonks → match_team_stats
  ia: feito # consumo no prognosis-prompt (chutes na área, big chances, posse-como-contexto)
testada: sim
testes:
  - "migração 0013 aplicada; match_team_stats → 760 linhas, posse média 50%, big chances 748/760 (2026-06-29)"
  - "re-sync: goal type=penalty → 77 (era 0 pelo bug); blast C2 limpo (2026-06-29)"
  - "prompt e48a0228 regenerado: linhas Volume (chutes/área/big chances/posse) + conversão open-play (2026-06-29)"
  - "expansão defesa+construção (migração 0018): +17 colunas em match_team_stats; backfill 760 linhas; tackles/interceptions/duels/passes(+%)/crosses/dribbles(+%)/long-passes/attacks/big-chances-missed/hit-woodwork/goal-attempts (2026-06-30)"
  - "probe season inteira (380 fixtures): headers(70)/challenges(77)/through-balls(124,125)/counter-attacks(1527)/cross-%(1533)/succ-interceptions(66)/shots(1677) NÃO vêm no nível-partida — ficaram de fora (2026-06-30)"
depende_de: [DOS-001]
impacta: [MOD-001, MOD-002]
ancoras:
  tabelas: [match_team_stats, match]
  funcoes: [sync-sportmonks]
docs:
  - docs/investigacoes/estatisticas-partida-posse-chutes-big-chances.md
  - docs/planos/DOS-002-estatisticas-partida-time.md
verificado_em: null
atualizado: 2026-06-29
---

# Estatísticas de partida por time (fixture statistics)

## Descrição

Ingerir as **estatísticas de partida por time** da SportMonks (include `statistics`, hoje não buscado) numa tabela nova `match_team_stats` — posse de bola (45), chutes totais (42), chutes na área (49), big chances criadas (580), + corners/dangerous-attacks de brinde. Alimenta o criador de prognóstico (`prognosis-prompt.ts`), que hoje só tem SoT + key passes per-jogador e admite a lacuna "não temos posse/chutes totais". A tabela é também a **casa futura do xG agregado** (5304) quando o add-on for comprado. Probe ao vivo confirmou os 3 pedidos disponíveis no tier atual de graça; xG e big-chances-perdidas (581), não.

## Tarefas

- [x] P1 dados — tabela `match_team_stats` + migração (expand-only) ✓ `0013_flat_human_torch.sql`
- [x] P2 dados — include `statistics` + `fixtureStatisticTypes` no sync; ramo de upsert por `(matchId, teamId)` ✓ 760 linhas
- [x] P3 dados — bug do pênalti `GOAL_TYPE.PENALTY` (`"normal"`→`"penalty"`) + varrer consumidores ✓ 77 pênaltis (era 0); blast C2 limpo
- [x] P4 ia — consumir no `prognosis-prompt.ts`: chutes-na-área/totais + big-chances com conversão (open-play); posse como contexto rotulado ✓
- [x] P5 dados — expansão defesa+construção por time (migração 0018, +17 colunas, backfill 760) ✓ 2026-06-30
- [ ] ia — consumir as novas (interceptações/desarmes/duelos defensivos, big-chances-missed = "cria e desperdiça") no `prognosis-prompt.ts`

## Plano (2026-06-29)

Dossiê: [docs/planos/DOS-002-estatisticas-partida-time.md](../../planos/DOS-002-estatisticas-partida-time.md). Pino: `57f5b3d`.

**Objetivo:** ingerir estatísticas de partida por time (posse, chutes totais/na-área, big chances criadas) numa tabela nova `match_team_stats` via o include `statistics` da SportMonks, corrigir o bug do pênalti, e consumir no `prognosis-prompt.ts`. xG e big-chances-por-jogador ficam fora (adiados — dossiê §Briefing).

**P1 · dados — tabela `match_team_stats` + migração (só-expand).** Criar a tabela em `apps/api/src/db/schemas/leagues.ts` (shape no dossiê §Schema: 9 colunas `integer` nullable + `xg real` null + `unique(matchId,teamId)`); exportar no barrel `schema.ts`; gerar e aplicar a migração (drizzle-kit).
_Prova:_ a migração gerada contém `CREATE TABLE "match_team_stats"`; após aplicar, `SELECT count(*) FROM match_team_stats` retorna `0` sem erro.

**P2 · dados — ingestão no sync (completa o esqueleto: dado pinga ponta-a-ponta).** Em `apps/api/src/db/sync-sportmonks.ts`: (a) `type SmStatistic = { type_id; participant_id; data?: { value? } }` + `statistics?: SmStatistic[]` no tipo do fixture (~L91); (b) add `statistics` ao include + `fixtureStatisticTypes:42,44,45,49,50,86,580,34` ao filtro (L348-349); (c) loop novo sobre `fixtures` mapeando `f.statistics[]` por `participant_id`→`teamIdBySm` → upsert `match_team_stats` por `(matchId,teamId)` (mirror do loop de gols L564-582). Rodar `bun run db:sync`.
_Prova:_ `SELECT count(*), round(avg(possession)) FROM match_team_stats` → ~760 linhas (2/jogo) e posse média ~50; a linha do Liverpool×Brentford tem `shots_insidebox` e `big_chances_created` não-nulos.

**P3 · dados — fix do bug do pênalti.** `GOAL_TYPE.PENALTY: "normal"` → `"penalty"` ([sync-sportmonks.ts:35](../../../apps/api/src/db/sync-sportmonks.ts#L35)); varrer `apps/` por `=== "normal"` / `=== "penalty"` e ajustar quem espera "todos os gols" pra `type !== "own"`. Re-sync.
_Prova:_ `SELECT count(*) FROM goal WHERE type='penalty'` > 0 (hoje 0); `bun run typecheck` limpo nos arquivos tocados.

**P4 · ia — consumo no `prognosis-prompt.ts`.** Ler `match_team_stats` por `(matchId,teamId)` (map novo, espelho de `statByMatchTeam` [prognosis-prompt.ts:59](../../../apps/api/scripts/prognosis-prompt.ts#L59)); adicionar ao dossiê do time **chutes na área/jogo**, **chutes totais/jogo**, **big chances criadas/jogo** (ao lado da conversão); **posse** como linha de contexto rotulada ("posse não prevê gols sozinha"); conversão vira `(gols − pênaltis)/SoT` (open-play, usa o P3).
_Prova:_ `bun run scripts/prognosis-prompt.ts e48a0228-e381-42d3-8ce9-c1a84c0009c0` regenera o prompt e `grep -E "chutes na área|big chances|posse" output/prognosis-e48a0228-….md` acha as 3 linhas.

**Verificação (feature → testada):** `match_team_stats` populada (query P2) + `goal.type='penalty'` existe (P3) + prompt do Liverpool mostra as novas métricas (P4). Sem facetas api/ui neste PR.

**Decisões adiadas pro `/i`:** (a) preferir SoT oficial de time (86) vs soma per-jogador — usar oficial, manter per-jogador só pro with/without (dossiê C3); (b) sintaxe exata do `fixtureStatisticTypes` — se não filtrar, ingerir todos e selecionar no map (dossiê C1).

## Evidências

- [código] [sync-sportmonks.ts:348-349](../../../apps/api/src/db/sync-sportmonks.ts#L348) — o fetch filtra `lineupDetailTypes` (per-jogador) e **não** inclui `statistics` de time; prova que posse/chutes-de-time não chegam hoje.
- [código] [sync-sportmonks.ts:35](../../../apps/api/src/db/sync-sportmonks.ts#L35) — `GOAL_TYPE.PENALTY = "normal"` zera `penaltyGoals` e polui a conversão (bug tangente).
- [probe] API SportMonks `include=statistics.type`, fixture 19427240 (2026-06-29) — tier atual entrega posse (45), shots-total (42), shots-insidebox (49), big-chances-created (580); **não** entrega big-chances-missed (581) nem xG (5304).
- [web] https://docs.sportmonks.com/v3/definitions/types/statistics/fixture-statistics — catálogo de type_ids de fixture statistics.
- [doc] [metricas-previsao-gols-over-under.md](../../investigacoes/metricas-previsao-gols-over-under.md) — posse % NÃO prevê gols (corr ~0,13); big chances redundante com xG; xG é a espinha dorsal.
- [doc] [MOD-002](../modelos/MOD-002-xg-qualidade-de-chute.md) — xG = add-on SportMonks €29/mês, backbone recomendado (confirma que 5304 está fora do tier base).

## Verificação

Implementado e provado por query no banco + regeneração do prompt (2026-06-29; sem facetas api/ui):
- **P1** migração `0013_flat_human_torch.sql` aplicada; tabela `match_team_stats` existe.
- **P2** re-sync (`db:sync`) → `team stats: 760` (2/jogo × 380); `SELECT` confirma posse média 50%, chutes médios 12.5, big chances em 748/760.
- **P3** `SELECT count(*) FROM goal WHERE type='penalty'` → **77** (era 0 pelo bug). Blast C2 varrido: nenhum consumidor usa `=== "normal"` esperando pênalti; `shared.ts:689` (penaltyGoals) e `match-events.tsx:20` (label "(pên)") ativam corretamente.
- **P4** `prognosis-prompt.ts e48a0228` regenera com linhas **Volume (chutes/área/big chances/posse)** + conversão **jogada aberta** excluindo pênaltis (Liverpool exclui 1, Brentford exclui 8).
