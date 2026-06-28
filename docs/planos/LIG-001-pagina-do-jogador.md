# Dossiê de planejamento — LIG-001 · Página do jogador (perfil de performance)

Base: commit `827e8ac` (2026-06-28). Todo `file:linha` deste doc vale nesse commit.

> Plano de codificação do **MVP sem migração**: agregar e exibir o granular por partida **já ingerido** (`lineup_player.rating/minutesPlayed/manOfMatch`, `goal`, `card`, `injury`). O unlock de stats de volume (chutes/passes/desarmes) é `dados`-pesado e sai como feature separada **LIG-003** (`depende_de: LIG-001`). Investigação completa: `docs/investigacoes/pagina-do-jogador.md`.

## Briefing — o que já foi decidido

- **Dono (esta conversa):** quer a página do jogador "muito foda" com estatísticas de performance (jogos, notas, gráfico de minutos por jogo). Abriu para investigação. O `/rs` cravou o MVP.
- **`/rs` LIG-001 (`docs/investigacoes/pagina-do-jogador.md`):** recomendação cravada — MVP = seções a partir do dado já ingerido; volume stats num passo de `dados` à parte; `rating` SportMonks **carimbado como score externo opaco** (não é o "porquê"); curva gols-vs-xG **cortada** (xG é add-on pago, xA não existe); split *por adversário* **cortado** (ruído com 1 season). Per-90 com **piso de minutos**.
- **Constraint de dados:** só **PL 2025/26** ingerida → 1 season. Multi-season é roadmap; desenhar a UI com scaffold de seletor mas popular com 1 season.
- **Memória do projeto:** Elysia em CF Workers exige TypeBox e **sem response schemas** (`[[elysia-cloudflare-workers]]`); Eden **revive datas em `Date`** no client → tratar `string | Date` no front (`[[eden-revive-datas-em-date]]`, já tratado em `utils/format.ts:11`); **`type`, não `interface`** (`[[preferencia-type-nao-interface]]`); código/dado em inglês, UI em PT (`[[codigo-em-ingles-ui-em-pt]]`); web rola dentro de `ScrollArea`/`customScrollParent`, não na window (`[[web-scroll-radix-scrollarea]]` — relevante se houver lista virtualizada).
- **Wishlist coberta:** W-001 (sparkline de nota), W-003 (jogos), W-004 (minutos), W-005/W-006 (splits de gol casa-fora / 1º-2º tempo). W-002 (carreira) e volume ficam fora deste MVP.

## Estado do terreno

**API (Elysia, `apps/api`):**
- Rota: `players.routes.ts:8` `GET /v1/players/:id` → `getPlayer(id)` (`get-player/get-player.service.ts:5`) → `getPlayerDetail(id)` (`shared/shared.ts:264`). Registrada em `app.ts:31`. **Sem response schema** (só `params`), coerente com a regra de CF Workers.
- `getPlayerDetail` (`shared.ts:264-313`) hoje deriva só de `goal`/`injury`: conta gols (`ne(goal.type,"own")`), assists (`goal.assistId`), `matchesOut` (`injury.type="Missing Fixture"`), e a `goalsList` (join `goal⋈match⋈teamHome⋈teamAway`). **Não toca `lineup_player`** — rating, minutos, MOTM, titular, cartões ficam de fora.
- Tipo de saída `PlayerDetail` (`shared.ts:168-176`): `{id,name,goals,assists,matchesOut,goalsList}`; `PlayerGoal` (`shared.ts:157-166`): `{matchId,date,minute,type,home,away,score}`.
- **Padrão de agregação a espelhar:** `scorers/scorers.service.ts:23-83` — agregação ao vivo `goal⋈match`, `groupBy` + `Map` pra juntar dimensões, `desc(count())` + tie por nome. Mostra o jeito do projeto de derivar rankings sem snapshot. O join do clube (`scorers.service.ts:54-73`, "gol mais recente vence") é o padrão pra resolver clube do jogador.

**Schema (`apps/api/src/db/schemas/leagues.ts`):**
- `lineup_player` (`:156-176`): `lineupId`, `playerId`, `number`, `position` (G/D/M/F), `starter` (bool), `grid`, **`rating` (real, type 118, `:171`)**, **`minutesPlayed` (int, type 119, `:172`)**, **`manOfMatch` (bool, type 1490, `:173`)**. `unique(lineupId, playerId)`.
- `lineup` (`:136-153`): `matchId`, `teamId`, `formation`, `coachId` — ponte `lineup_player → match`.
- `goal` (`:207-225`): `playerId`, `assistId`, `teamId`, `minute`, `type` (normal/penalty/own). `card` (`:229-245`): `playerId`, `teamId`, `minute`, `type` (yellow/red/yellowred). `injury` (`:183-202`): `playerId`, `type` (Missing Fixture/Questionable), `reason`.
- `player` (`:111-119`): `name`, `dateOfBirth`, `height`, `imageUrl`, `nationalityId`. `nationality` (`:98-104`): `name`, `iso2`, `flagUrl`.
- `match` (`:38-61`): `leagueCode`, `round`, `date`, `time`, `homeTeamId`, `awayTeamId`, `ftHome/ftAway`, `htHome/htAway`.

→ **Tudo do MVP é agregação ao vivo do já ingerido. Zero migração.** A "appearance" do jogador = linha de `lineup_player` ⋈ `lineup` ⋈ `match`. É a espinha: dela saem appearances, minutos, avg rating, forma, denominador do per-90, split casa/fora.

**Web (Next 16, `apps/web/features/leagues`):**
- Página: `app/(app)/players/[id]/page.tsx:8` renderiza `<PlayerDetail id>` (barrel `@/features/leagues`).
- Componente: `components/player-detail/player-detail.tsx` — stub: header com `name` + 3 `<Stat>` (gols/assists/jogos-fora) + Card "Gols" com a lista. `<Stat>` local (`:9-16`).
- Hook: `hooks/data/queries/use-player-query.ts` → `api.v1.players({id}).get()` (Eden). Padrão de query em `use-scorers-query.ts`.
- Util: `utils/format.ts:11` `formatDate(date: string|Date, time)` — já trata o reviver do Eden.
- Charts: `docs/investigacoes/pagina-do-jogador.md` §dataviz — **SVG manual + `d3-scale`** pros pequenos (sparkline, strip), **shadcn `chart`/Recharts** pros médios. (Recharts/visx **não** estão instalados hoje — checar antes de P5; sparkline/strip dá em SVG puro sem dep nova.)

## Mapa de dependências e blast radius

| Alvo alterado | Consumidores | O que re-testar |
|---|---|---|
| `getPlayerDetail` / `PlayerDetail` (`shared.ts:168,264`) | `get-player.service.ts:5` (passthrough), `use-player-query.ts`, `player-detail.tsx` | mudança é **aditiva** (campos novos) → TS não quebra consumidores; re-render da página |
| `player-detail.tsx` | `app/(app)/players/[id]/page.tsx:8` via barrel | E2E Chrome da página |
| Tabelas `lineup_player`/`goal`/`card`/`injury` | leitura nova (não escrita) | nenhum re-sync; dado de dev gira no re-seed |

**Blast radius:** baixo e contido ao produto `leagues`. Risco real = (1) `getPlayerDetail` muda de "só gols" pra "appearances ⋈ goals/cards" → query nova pode contar errado (gol contra, jogo sem rating); (2) Eden revive datas → strip/sparkline ordenando por `date` deve aceitar `string|Date` (já resolvido em `formatDate`); (3) jogador sem nenhuma `lineup_player` (só apareceu em evento) → appearances vazio, página não pode quebrar. As âncoras `match`/`goal` do INDEX pertencem à **arquitetura planejada** (DOS-001/MOD-001), tabelas homônimas distintas das reais do produto — sem colisão.

## Fora de escopo (features à parte)

- **LIG-003 · Stats de volume por partida** (`depende_de: LIG-001`): alargar `lineupDetailTypes:118,119,1490` (`sync-sportmonks.ts:265`) pros ~12 types de aposta (86 SoT, total shots, 80/116/1584 passes, 117 key-passes, 78 tackles, 100 int, 105/106 duelos, 108/109 dribles, 120 toques, 56/96 faltas) + colunas em `lineup_player` + re-sync. É `dados`+`api`+`ui` e o maior unlock de apostador — detalhe em `docs/investigacoes/pagina-do-jogador.md`. Stub criado `status: ideia`.
- **Fase 2 (futuro, sem ID ainda):** radar de percentil (precisa baseline da liga); xG (add-on pago); carreira/transferências (multi-season, W-002); heatmap/shot-map (coordenadas não existem na SportMonks). Listadas como roadmap na investigação.
- **Norte de produto:** bloco próxima-partida + projeção λ do prop (quant) + explicação (LLM) — faceta `ia`, depende de odds/motor (território DOS-001/MOD-001). Fora deste plano.

## Evidências decisivas

- [código] `apps/api/src/modules/leagues/shared/shared.ts:264-313` — `getPlayerDetail` atual deriva só de goal/injury; não toca `lineup_player`.
- [código] `apps/api/src/db/schemas/leagues.ts:171-173` — `rating`/`minutesPlayed`/`manOfMatch` já no schema (o achado que dispensa migração).
- [código] `apps/api/src/modules/leagues/scorers/scorers.service.ts:23-83` — padrão do projeto de agregação ao vivo + join por Map (a espelhar).
- [código] `apps/web/features/leagues/components/player-detail/player-detail.tsx` — estado stub da UI a substituir.
- [doc] `docs/investigacoes/pagina-do-jogador.md` — recomendação cravada (MVP, cortes, per-90 gate, rating carimbado).
- [commit] `7af237f` — trouxe ratings/minutes/MOTM por jogador-partida pro banco (origem do dado que o MVP exibe).
