---
id: DOS-002
titulo: Estatísticas de partida por time (fixture statistics)
modulo: dossie
status: investigado
prioridade: P2
facetas:
  dados: investigado # ingestão do include `statistics` da SportMonks → match_team_stats
  ia: ideia # consumo no prognosis-prompt (chutes na área, big chances, posse-como-contexto)
testada: nao
testes: []
depende_de: [DOS-001]
impacta: [MOD-001, MOD-002]
ancoras:
  tabelas: [match_team_stats, match]
  funcoes: [sync-sportmonks]
docs:
  - docs/investigacoes/estatisticas-partida-posse-chutes-big-chances.md
verificado_em: null
atualizado: 2026-06-29
---

# Estatísticas de partida por time (fixture statistics)

## Descrição

Ingerir as **estatísticas de partida por time** da SportMonks (include `statistics`, hoje não buscado) numa tabela nova `match_team_stats` — posse de bola (45), chutes totais (42), chutes na área (49), big chances criadas (580), + corners/dangerous-attacks de brinde. Alimenta o criador de prognóstico (`prognosis-prompt.ts`), que hoje só tem SoT + key passes per-jogador e admite a lacuna "não temos posse/chutes totais". A tabela é também a **casa futura do xG agregado** (5304) quando o add-on for comprado. Probe ao vivo confirmou os 3 pedidos disponíveis no tier atual de graça; xG e big-chances-perdidas (581), não.

## Tarefas

- [ ] dados — tabela `match_team_stats` + migração (drizzle-kit)
- [ ] dados — include `statistics` + `fixtureStatisticTypes` no fetch do sync; ramo de upsert por `(matchId, teamId)`
- [ ] dados — (paralelo) corrigir bug do pênalti `GOAL_TYPE.PENALTY` (`"normal"` → `"penalty"`) + conversão
- [ ] ia — consumir no `prognosis-prompt.ts`: chutes-na-área/totais + big-chances **com a conversão**; posse como **contexto rotulado**, não sinal de over

## Plano

_(pendente — `/pl DOS-002`)_

## Evidências

- [código] [sync-sportmonks.ts:348-349](../../../apps/api/src/db/sync-sportmonks.ts#L348) — o fetch filtra `lineupDetailTypes` (per-jogador) e **não** inclui `statistics` de time; prova que posse/chutes-de-time não chegam hoje.
- [código] [sync-sportmonks.ts:35](../../../apps/api/src/db/sync-sportmonks.ts#L35) — `GOAL_TYPE.PENALTY = "normal"` zera `penaltyGoals` e polui a conversão (bug tangente).
- [probe] API SportMonks `include=statistics.type`, fixture 19427240 (2026-06-29) — tier atual entrega posse (45), shots-total (42), shots-insidebox (49), big-chances-created (580); **não** entrega big-chances-missed (581) nem xG (5304).
- [web] https://docs.sportmonks.com/v3/definitions/types/statistics/fixture-statistics — catálogo de type_ids de fixture statistics.
- [doc] [metricas-previsao-gols-over-under.md](../../investigacoes/metricas-previsao-gols-over-under.md) — posse % NÃO prevê gols (corr ~0,13); big chances redundante com xG; xG é a espinha dorsal.
- [doc] [MOD-002](../modelos/MOD-002-xg-qualidade-de-chute.md) — xG = add-on SportMonks €29/mês, backbone recomendado (confirma que 5304 está fora do tier base).

## Verificação

_(pendente)_
