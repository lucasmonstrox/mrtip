# Dossiê de planejamento — DOS-002 · Estatísticas de partida por time

Base: commit `57f5b3d` (2026-06-29). Todo `path:linha` vale neste commit.

> Plano de codificação. Investigação: [docs/investigacoes/estatisticas-partida-posse-chutes-big-chances.md](../investigacoes/estatisticas-partida-posse-chutes-big-chances.md). Feature: [docs/features/dossie/DOS-002-estatisticas-partida-time.md](../features/dossie/DOS-002-estatisticas-partida-time.md).

## Briefing — o que já está decidido (não re-decidir)

- **Pedido do dono (esta conversa, 2026-06-29):** ingerir **posse de bola, big chances, chutes totais + na área** pra alimentar o `prognosis-prompt.ts`.
- **xG (add-on €29/mês): adiado** — dono disse "por agora não". A coluna `xg` entra **nullable** na tabela nova, sem popular; ligar é decisão futura. Não é bloqueio.
- **Big chances por JOGADOR: fase 2** — dono ok em adiar. v1 é nível-TIME só. (`lineups.details` per-jogador não foi probado — NEI.)
- **Bug do pênalti: incluir neste PR** — dono confirmou "sim". `GOAL_TYPE.PENALTY` vira `"penalty"` e a conversão do prompt passa a separar pênalti.
- **Valor preditivo reordena o uso (fact-check do repo, não opinião):** chutes-na-área > big-chances-criadas > posse. **Posse é REFUTADA como preditor de gol** (corr ~0,13, [metricas-previsao-gols-over-under.md:15](../investigacoes/metricas-previsao-gols-over-under.md)) → entra como **contexto rotulado** no prompt, nunca como sinal de over.

## Estado do terreno (`path:linha`, pinado em 57f5b3d)

- **Fetch de fixtures filtra per-jogador e NÃO inclui `statistics` de time:** [sync-sportmonks.ts:348-349](../../apps/api/src/db/sync-sportmonks.ts#L348). O include atual: `participants;scores;round;state;lineups.player;lineups.position;lineups.details;formations;events.type;sidelined.player;sidelined.type;venue`. → adicionar `statistics` aqui.
- **O sync processa cada seção num loop próprio sobre `fixtures`**, cada um upsertando por chave idempotente: lineups [sync-sportmonks.ts:497-545](../../apps/api/src/db/sync-sportmonks.ts#L497), gols/cards [sync-sportmonks.ts:564-596](../../apps/api/src/db/sync-sportmonks.ts#L564) (`onConflictDoUpdate({ target: goal.sportmonksEventId, set: g })`). → o ramo de team-stats é **mais um loop**, upsert por `(matchId, teamId)`.
- **Maps de resolução já montados no escopo do sync:** `matchIdByFixture` (fixture SM → match.id uuid, usado em L501/565/604) e `teamIdBySm` (team SM → team.id uuid, L509/569). O loop novo reusa os dois — `stat.participant_id` → `teamIdBySm`.
- **Tipos `Sm*` do fixture** em [sync-sportmonks.ts:91-110](../../apps/api/src/db/sync-sportmonks.ts#L91) (`SmLineup`, `SmEvent`…). O tipo do fixture carrega `events`/`formations`/`sidelined`/`lineups`. → adicionar `type SmStatistic = { type_id: number; participant_id: number; location?: string; data?: { value?: number } }` e `statistics?: SmStatistic[]` no tipo do fixture.
- **Bug do pênalti:** [sync-sportmonks.ts:33-35](../../apps/api/src/db/sync-sportmonks.ts#L33) — `GOAL_TYPE: Record<string,"normal"|"penalty"|"own">` já tem `"penalty"` no union, mas `PENALTY: "normal"` mapeia errado. `goal.type` (schema) já aceita `"penalty"` → trocar o mapa é suficiente no lado da ingestão.
- **Consumo no prompt:** `statByMatchTeam` em [prognosis-prompt.ts:59-82](../../apps/api/scripts/prognosis-prompt.ts#L59) monta SoT+KP por `(matchId,teamId)` **somando lineup_player**. → adicionar leitura de `match_team_stats` (total OFICIAL de time) + render das novas linhas; a conversão (hoje `gols/SoT`) passa a usar **gols de jogada aberta** (exclui pênalti).
- **Padrão de tabela** (mirror): `lineup_player` tem colunas `integer(...)`; dedup via `(t) => [unique().on(...)]` (ex.: `standing` em [leagues.ts:155-156](../../apps/api/src/db/schemas/leagues.ts#L155)); PK `uuid().defaultRandom()`, FKs `uuid().references(() => x.id)`.

## Schema — `match_team_stats` (aditivo, só-expand)

Uma linha por time × partida, dedup `(matchId, teamId)`. Tudo nullable (tier/fixture pode faltar linha). `xg` entra agora mas fica null (add-on adiado).

```ts
export const matchTeamStats = pgTable("match_team_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").notNull().references(() => match.id),
  teamId: uuid("team_id").notNull().references(() => team.id),
  possession: integer("possession"),          // 45 BALL_POSSESSION (%)
  shotsTotal: integer("shots_total"),          // 42
  shotsInsidebox: integer("shots_insidebox"),  // 49
  shotsOutsidebox: integer("shots_outsidebox"),// 50
  shotsOnTarget: integer("shots_on_target"),   // 86 (oficial de time)
  bigChancesCreated: integer("big_chances_created"), // 580
  dangerousAttacks: integer("dangerous_attacks"),    // 44
  corners: integer("corners"),                 // 34
  xg: real("xg"),                              // 5304 — NULL até o add-on (DOS-002 fase 2)
}, (t) => [unique().on(t.matchId, t.teamId)])
```

type_ids alvo do `fixtureStatisticTypes`: `42,44,45,49,50,86,580,34`.

## Dependências e blast radius

| Alvo alterado | Consumidores / o que re-testar | Sintoma se quebrar |
|---|---|---|
| `sync-sportmonks.ts` include (L349) | todo o sync (idempotente) | request maior; se `statistics` 403 no tier → fetch falha (probe confirma que vem, risco baixo) |
| `GOAL_TYPE.PENALTY` (L35) | `goal.type` em todo consumo de gols: prognosis-prompt (conversão, filtros `type!=="own"`), scorers, W-009/W-013 (marcadores) | gols de pênalti deixam de contar como "normal" — **checar** que nenhum consumidor faz `type === "normal"` esperando incluir pênalti |
| `match_team_stats` (tabela nova) | só o prognosis-prompt (novo consumo) | nenhum consumidor pré-existente — risco isolado |
| `prognosis-prompt.ts` conversão | a saída do prognóstico (números mudam) | conversão muda pra todos os jogos — esperado e desejado (de-noise) |

`bun run features impact DOS-002`: impacta MOD-001, MOD-002 (insumo futuro). Âncora `goal.type` é compartilhada — o único ponto de atenção real é o blast do pênalti (varrer `type === "normal"`).

## Riscos (C1..Cn)

- **C1 — `fixtureStatisticTypes` pode não filtrar** (o probe trouxe 38 sem filtro). Mitigação: se não filtrar, ingerir todos e selecionar no map por type_id (barato). Não bloqueia.
- **C2 — relabel do pênalti pode quebrar um consumidor que conta `type === "normal"` esperando pênalti junto.** Mitigação: grep `type.*===.*"normal"` / `=== "penalty"` em todo o repo no P3 antes de fechar; ajustar quem precisar de "todos os gols" pra `type !== "own"`.
- **C3 — SoT oficial de time (86) pode divergir da soma per-jogador** que o prompt usa hoje. Mitigação: preferir o oficial; logar divergência no P4; manter per-jogador só pro with/without de desfalque (que precisa de granularidade).
- **C4 — re-sync é o caminho de teste** (não há fixture isolado barato). Mitigação: o sync é idempotente; rodar uma vez popula tudo. Prova por query no banco.

## Evidências

- [probe] API SportMonks `include=statistics.type`, fixture 19427240 (2026-06-29): tier entrega 45/42/49/50/86/580/44/34; **não** 581 nem 5304.
- [código] [sync-sportmonks.ts:348-349](../../apps/api/src/db/sync-sportmonks.ts#L348) — include atual sem `statistics`.
- [código] [sync-sportmonks.ts:35](../../apps/api/src/db/sync-sportmonks.ts#L35) — `PENALTY: "normal"` (bug).
- [código] [prognosis-prompt.ts:59-82](../../apps/api/scripts/prognosis-prompt.ts#L59) — `statByMatchTeam` (ponto de consumo).
- [doc] [metricas-previsao-gols-over-under.md:15](../investigacoes/metricas-previsao-gols-over-under.md) — posse não prevê gol (corr 0,13); ordena o uso.
