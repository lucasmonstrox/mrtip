# LIG-023 — Cortes (clearances) na aba Estatísticas · dossiê de planejamento (2026-07-23)

Feature: [docs/features/ligas/LIG-023-cortes-clearances-estatisticas.md](../features/ligas/LIG-023-cortes-clearances-estatisticas.md)
Base: commit `119aa6a` (2026-07-23) — todo file:line deste doc vale neste commit.
Nota: o working tree já contém superfície LIG-019/LIG-020 (`shotsInsidebox`/`shotsOutsidebox` em `TeamMatchStats` + `StatRow`s) — o `/i` **estende**, não reverte. IDs LIG-021 (cartões) e LIG-022 (faltas) foram tomados em paralelo; este ID é **LIG-023**.

## TL;DR

Coluna oficial `match_team_stats.clearances` + ingestão derivada da soma de `lineup_player.clearances` (SportMonks type **101**) + exposição em `GET /v1/matches/:id/statistics` + `StatRow` **"Cortes"** na aba Estatísticas. Type 101 **não vem** no include `statistics` de time (inventário Detalhe 1); por isso a coluna é populada por agregação per-player no sync/backfill — não por `TEAM_STAT.clearances = 101`. ≠ desarmes (78) ≠ interceptações (100).

## Briefing — o que já foi falado e decidido

- Wishlist **W-088**: cortes/clearances na aba Estatísticas; pressão sofrida / alívio defensivo; paridade SofaScore/FotMob — fonte: `docs/wishlist.md` (W-088, 2026-07-23).
- Wishlist sugeria MVP = só somar `lineup_player.clearances` na leitura — fonte: mesma entrada.
- **Dono CORRIGIU (2026-07-23):** também colocar **coluna oficial em `match_team_stats`** (não só soma ad-hoc na API). Decisão cravada — fonte: dono nesta conversa / pedido do `/pl`.
- Distinguir na UI: **"Cortes" (101) ≠ "Desarmes" (78) ≠ "Interceptações" (100)** — fonte: wishlist + dono.
- **NÃO é desarmes** — é clearances type 101 — fonte: dono.
- Precedente de superfície (coluna JÁ existente): LIG-019 / LIG-020 — plano-mini api+ui; **não copiar cegamente** porque LIG-023 precisa de schema+sync.
- Precedente de coluna+sync em `match_team_stats`: DOS-002 (feito) — migração 0013 + expansão 0018 (`tackles`/`interceptions`) — fonte: `docs/features/dossie/DOS-002-estatisticas-partida-time.md`.
- Type 101 Clearances ingerido no **jogador** desde 2026-07-03 → `lineup_player.clearances` — fonte: inventário + schema.
- Pedido original do `/pl` sugeria ID LIG-021; **LIG-021 já é cartões (W-089/W-090)** e **LIG-022 é faltas (W-087)** — promoção correta = **LIG-023**.
- **Dono (2026-07-23, nesta conversa):** teste primário de UI desta feature = **`agent-browser`** (skill `.claude/skills/agent-browser/SKILL.md` / `agent-browser skills get core`) — **não** chrome-devtools MCP.

## Estado do terreno

### Schema / dados

- Coluna per-jogador clearances (type 101) já existe — `apps/api/src/db/schemas/leagues.ts:336`.
- `match_team_stats` tem `tackles` (78) e `interceptions` (100) — `leagues.ts:472-473`; **não** tem `clearances`.
- Sync per-jogador já grava type 101 — `apps/api/src/db/sync-ingest.ts:23` (`STAT` com clearances) e espelho em `sync-sportmonks.ts:51`; mapeamento em `sync-ingest.ts:374`.
- `TEAM_STAT` (filtro `fixtureStatisticTypes`) **não** inclui 101 — `sync-ingest.ts:28-29` / `sync-sportmonks.ts:58-59`. Lista atual: possession… goalAttempts; defesa = `tackles`/`interceptions`/…
- Upsert de team stats (sem clearances): `sync-sportmonks.ts:701-731` + `sync-ingest.ts:396-399`.
- Ordem no sync: lineups/players **antes** de team stats (`sync-sportmonks.ts:677` log → `679` bloco 3e-bis) — dá pra agregar clearances dos jogadores já persistidos (ou acumular no loop de lineup) antes/durante o upsert de time.

### SportMonks — type 101 no nível TIME?

- Inventário Detalhe 1 (`include=statistics`, todos os types devolvidos): tabela de types de TIME em `docs/investigacoes/sportmonks-inventario-completo.md:185-228` — após **100 Interceptions** vem **106 Duels Won**; **101 Clearances está ausente** da lista de types entregues no nível partida.
- Detalhe 2 (jogador / `lineups.details`): type **101 Clearances** ✅ → `lineup_player.clearances` — inventário `:258`.
- Conclusão com evidência: **não dá pra ingerir 101 via `TEAM_STAT` / `g(101)`** — a API de fixture statistics não entrega esse type no nível time. Caminho: **derivar** `SUM(lineup_player.clearances)` por `(match_id, team_id)`.

### API / UI

- `TeamMatchStats` hoje: `possession` + `shotsInsidebox` + `shotsOutsidebox` — `apps/api/src/modules/leagues/shared/shared.ts:391-396` (working tree pós-LIG-019/020).
- `matchStatistics` select/side espelha esses 3 campos — `get-statistics.service.ts:19-34`. Caller: só `matches.routes.ts` (`codebase_impact` hop 1).
- UI: `statistics.tsx` — `StatRow` reutilizável (`:21-47`); `hasStats` OR de posse + inside + outside (`:72-75`); labels LIG-019/020 já presentes (`:91-100`).
- Hook: `useMatchStatisticsQuery` — sem mudança de path; só cresce o shape tipado via `@workspace/api`.
- Prognóstico: `prognosis-prompt.ts` lê `matchTeamStats` inteiro (`:414`) e tem `TeamStatField` com `tackles`/`interceptions` mas **sem** `clearances` (`:424`) — **fora de escopo** deste ID (não adicionar ao prompt).

## Mapa de dependências

**Features** (`bun run features impact` sobre DOS-002 / âncora `match_team_stats`):
- **DOS-002** ← LIG-023 `depende_de` (tabela + pipeline `statistics`; DOS-002 já `feito`).
- LIG-019 / LIG-020 / LIG-022 ← compartilham âncora `match_team_stats` + mesmos arquivos de superfície; re-testar não-regressão das StatRows irmãs.
- LIG-021 (cartões via tabela `card`) ← mesma aba Estatísticas / `matchStatistics`; re-testar convivência de StatRows, sem schema compartilhado de clearances.
- MOD-004 / MOD-005 / MOD-008 / MOD-014 ← leem `match_team_stats` no prognóstico; coluna **aditiva nullable** — blast baixo se sync não zerar outras cols no upsert.

**Código:**

| Alvo (path/símbolo) | Consumidores | O que re-testar |
|---|---|---|
| `leagues.ts#matchTeamStats` (+coluna) | sync-sportmonks, sync-ingest, get-statistics, prognosis-prompt (`select *`) | migrate aplica; upserts compilam; prompt typecheck |
| `sync-sportmonks` / `sync-ingest` upsert team stats | `db:sync` | clearances populado pós-sync; outras cols intactas |
| `shared.ts#TeamMatchStats` | get-statistics, web types re-export | shape JSON |
| `matchStatistics` | `matches.routes.ts` only | GET `/statistics` |
| `statistics.tsx#Statistics` | match-detail tab | StatRow Cortes + hasStats |

## Blast radius e cuidados

- **Upsert `set: ts` com objeto incompleto** — se o `/i` montar `ts` sem as cols antigas, o `onConflictDoUpdate` pode gravar `undefined`/apagar valores. Sintoma: posse/chutes zeram após sync. Detectar: query pré/pós-sync numa partida conhecida; Don't no P3.
- **Confundir Cortes com Desarmes/Interceptações** — sintoma: label ou campo errado (`tackles`/`interceptions`). Detectar: assert type 101 / coluna `clearances` + label exato "Cortes".
- **Tratar null como 0 no payload** — barra distorce / "0" falso quando lineup sem clearances. Detectar: partida sem `lineup_player.clearances` → JSON `null`, UI "—".
- **Soma na API sem coluna** — viola decisão do dono; Don't explícito.
- **Adicionar 101 ao filtro `TEAM_STAT_IDS` "por garantia"** — inventário prova que não vem; polui o filtro sem ganho. Descartado em D2.
- Superfícies que leem o mesmo banco: web Estatísticas × `prognosis-prompt` — prompt **não** muda neste ID; só não quebrar o `select()`.
- Colisão de ID: LIG-021/022 já existem — não reutilizar.

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:336` — `lineup_player.clearances` type 101 já existe
- [código] `apps/api/src/db/schemas/leagues.ts:472-473` — team stats tem tackles/interceptions, sem clearances
- [código] `apps/api/src/db/sync-ingest.ts:28-29` — `TEAM_STAT` sem 101
- [código] `apps/api/src/db/sync-sportmonks.ts:701-731` — upsert team stats sem clearances
- [doc] `docs/investigacoes/sportmonks-inventario-completo.md:185-228` — types de TIME; 101 ausente
- [doc] `docs/investigacoes/sportmonks-inventario-completo.md:258` — 101 Clearances só no nível jogador
- [código] `apps/api/src/modules/leagues/get-statistics/get-statistics.service.ts:19-34` — select atual (posse + LIG-019/020)
- [código] `apps/web/features/leagues/components/match-detail/statistics.tsx:72-100` — hasStats + StatRows atuais
- [feature] DOS-002 — padrão expand-only + sync `statistics`
- [wishlist] W-088 + correção do dono (coluna oficial)

## Detalhes por passo (referenciados pelo ## Plano)

### §Schema

Adicionar em `matchTeamStats` (junto do bloco defesa, após `interceptions`):

```ts
clearances: integer("clearances"), // type 101 — cortes; DERIVADO de SUM(lineup_player.clearances) — NÃO vem no include statistics de time
```

Só-expand; sem contract. Comentário no schema deve deixar explícito que a fonte é agregação per-player, não `TEAM_STAT`.

### §Backfill

Após migrate, popular histórico (NULL-safe: só atualiza onde há pelo menos um jogador com clearances não-nulo):

```sql
UPDATE match_team_stats AS mts
SET clearances = sub.sum_clr
FROM (
  SELECT li.match_id, li.team_id,
         SUM(lp.clearances)::int AS sum_clr
  FROM lineup_player lp
  JOIN lineup li ON li.id = lp.lineup_id
  WHERE lp.clearances IS NOT NULL
  GROUP BY li.match_id, li.team_id
) AS sub
WHERE mts.match_id = sub.match_id
  AND mts.team_id = sub.team_id;
```

Prova: `SELECT count(*) FILTER (WHERE clearances IS NOT NULL) FROM match_team_stats` > 0 nas ligas com lineups ingeridos; spot-check 1 partida: `SUM(lp.clearances)` == `mts.clearances`.

### §Sync

Nos dois caminhos (`sync-sportmonks.ts` bloco 3e-bis e `sync-ingest.ts` §5):

1. **Não** adicionar `clearances: 101` a `TEAM_STAT` / `TEAM_STAT_IDS`.
2. Ao montar `ts`, setar `clearances` a partir de:
   - mapa acumulado no loop de lineups (`matchId+teamId → sum`), **ou**
   - query `SUM(lineup_player.clearances)` join `lineup` filtrando o par `(matchId, teamId)` já escrito.
3. Incluir `clearances` no objeto `ts` do upsert (todas as outras cols permanecem).
4. Se nenhum jogador do time tiver `clearances` não-nulo → gravar `null` (não `0`).

### §Testes (roteiro agent-browser)

Teste primário de UI = **agent-browser** (decisão do dono 2026-07-23). Pré: `apps/web` em `:3000`, API de pé, sessão Clerk (padrão das provas LIG-019/021). Escada: bordas → golden. Refs `@eN` mudam a cada snapshot — re-snapshot antes de cada click.

**T1 (borda — empty / sem clearances)** partida sem `match_team_stats` (ou NS):
```bash
agent-browser open "http://localhost:3000/matches/<slug-sem-stats>"
agent-browser wait --load networkidle
agent-browser snapshot -i
# achar aba/tab Estatísticas → click @eN (re-snapshot)
agent-browser find text "Estatísticas" click
agent-browser wait --text "Sem estatísticas"
agent-browser snapshot
# assert observável: texto "Sem estatísticas para esta partida."
agent-browser network requests   # GET …/statistics → 200 (ou vazio sem crash)
```

**T2 (variante — posse/chutes sem clearances)** partida com posse mas `clearances` null nos dois lados:
```bash
agent-browser open "http://localhost:3000/matches/<slug-com-posse>"
agent-browser wait --load networkidle
agent-browser find text "Estatísticas" click
agent-browser wait --text "Posse"
agent-browser snapshot
# assert: "Posse de bola" (e StatRows irmãs se no branch) presentes;
# linha "Cortes" com "—"/"—" OU ausente só se hasStats global não incluir clearances null —
# padrão do plano: mostrar StatRow quando hasStats; null → "—" (igual posse)
```

**T3 (golden — clearances populados)** partida com `match_team_stats.clearances` não-nulo nos dois lados (escolher após P2 backfill via SQL):
```bash
agent-browser open "http://localhost:3000/matches/<slug-com-clearances>"
agent-browser wait --load networkidle
agent-browser find text "Estatísticas" click
agent-browser wait --text "Cortes"
agent-browser snapshot
# assert: texto "Cortes" + dois valores numéricos (não "Desarmes"/"Interceptações")
# posse / chutes na área / remates fora (se no branch) intactos
agent-browser network requests
# assert: GET …/statistics 200; payload com home.clearances / away.clearances numéricos
agent-browser close
```

Fechamento: sem erro de página óbvio no snapshot; network sem falha no GET `/statistics`. CLI ausente / login Clerk bloqueado → declarar no `/i`, não afirmar UI verde.

## Plano executável

Ver seção `## Plano` de [docs/features/ligas/LIG-023-cortes-clearances-estatisticas.md](../features/ligas/LIG-023-cortes-clearances-estatisticas.md) — os passos NÃO são duplicados aqui.
