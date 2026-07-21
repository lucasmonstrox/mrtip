# LIG-001 — Apps/minutos por season (W-003 + W-004) · dossiê de planejamento (2026-07-21)

Feature: [docs/features/ligas/LIG-001-pagina-do-jogador.md](../features/ligas/LIG-001-pagina-do-jogador.md)
Base: commit `de67425` (2026-07-21) — todo file:line deste doc vale neste commit.
Investigação: [docs/investigacoes/jogador-apps-minutos-por-season.md](../investigacoes/jogador-apps-minutos-por-season.md)

## TL;DR

Entregar a **quebra carreira** de jogos e minutos por temporada no perfil do jogador (wishlist W-003 + W-004) como **P10 de LIG-001**: campo aditivo `careerSeasons` em `getPlayerDetail` + tabela UI. Sem migração. Uma linha por season de liga (mesmo grão do switcher), com apps/minutos da **campanha** (liga+copas via `concurrentSeasonIds`) pra bater com o card Temporada.

## Briefing — o que já foi falado e decidido

- Dono (2026-07-21): implementar W-003 e W-004; `/rs` primeiro; depois plano completo — fonte: conversa do `/rs` + este `/pl`.
- W-002 (histórico de clubes) ficou de fora — "muito difícil" / próximo — fonte: dono na conversa do `/rs`.
- Investigação LIG-001 (2026-06-28) REFUTOU a premissa de minutos/apps ausentes; marcou W-003/W-004 sob **Wishlist coberta:** no plano antigo (`docs/planos/LIG-001-pagina-do-jogador.md:13`) — **parcialmente errado** pra quebra multi-season — fonte: plano + `docs/investigacoes/pagina-do-jogador.md`.
- LIG-008 entregou multi-season + switcher + 2 seasons PL — fonte: feature LIG-008 verificado 2026-06-29; commit `57f5b3d` (`seasonsOfPlayer`).
- Recomendação `/rs` 2026-07-21: P10 em LIG-001, key nova `careerSeasons`, não sobrescrever `seasons` — fonte: `docs/investigacoes/jogador-apps-minutos-por-season.md`.
- Default produto: **sem** split season×competição no MVP (TM-style adiados) — fonte: investigação §Opções.
- Dono (2026-07-21, pós-`/pl`): "pra já é só por temporada" — confirma Opção A (1 row/campanha); split TM fora — fonte: dono nesta conversa.

## Estado do terreno

- **API:** `getPlayerDetail` (`apps/api/src/modules/leagues/shared/shared.ts:886-1244`) devolve `season` single-object (tipo `:475-488`, build `:1058-1072`) e `seasons: SeasonSummary[]` (`:43-48`, return `:1209` / `:1242`) só pra switcher via `seasonsOfPlayer` (`:1358-1372`). Campanha: `concurrentSeasonIds` (`:765-776`) expandido em `:908`. **Gap:** nenhum `careerSeasons` (SocratiCode `codebase_symbols` 2026-07-21: zero matches).
- **Lookup uuid:** coluna `sportmonksSeasonId` em `apps/api/src/db/schemas/leagues.ts:31` (`.unique()` no schema). `resolveSeason` (`apps/api/src/modules/leagues/shared/shared.ts:692-701`) exige `leagueCode` + smId — **não** usar com `leagueCodeOfPlayer` pra carreira (falha se o jogador trocou de liga). Lookup interno = `eq(season.sportmonksSeasonId, smId)` → `id` → `concurrentSeasonIds(id)`.
- **UI:** `apps/web/features/leagues/components/player-detail/player-detail.tsx:161-163` mostra jogos/minutos da season selecionada; `SeasonSwitcher` em `apps/web/features/leagues/components/season-switcher/season-switcher.tsx:25-51` + `useSeasonParam` (`apps/web/features/leagues/hooks/ui/use-season-param.ts:9-35`). `MinutesChart` por partida da payload atual. **Gap:** sem tabela multi-season. Nome collisão: componente web `SeasonSummary` ≠ type API `SeasonSummary` — o card novo é `career-seasons.tsx`.
- **Schema:** `match.seasonId` (`leagues.ts:132`), `lineup_player.minutesPlayed` (`:296`) — prontos.
- **Dados:** Neon 2026-07-21 — PL 25583 + 23614 com lineups; dual-season amostra (Martínez 37/3197' → 32/2836' **liga-only** — só prova cobertura; invariante produto = campanha). Local `:5434` pode estar down — `/i` usa DB disponível.
- **SocratiCode note:** `codebase_symbol`/`impact` em `seasonsOfPlayer` reportou 0 callers locais (falso negativo barrel); leitura confirma chamada em `getPlayerDetail` `:1209`. `concurrentSeasonIds` callers listados = scripts `_check-campaign`; callee real também em `getPlayerDetail` `:908`.

## Mapa de dependências

**Features**
- LIG-008 ← seasons / `?season=` / `seasonsOfPlayer` (já feito)
- LIG-011 ← `concurrentSeasonIds` (campanha)
- LIG-003 ← lê mesmo `PlayerDetail` (campo aditivo não quebra)
- impacta declarado: LIG-003; `features impact LIG-001` lista muitos compartilhadores de âncora `player`/`match` — **re-teste prático** = página do jogador + switcher (mudança aditiva no payload)

**Código**

| Alvo | Consumidores | Re-testar |
|---|---|---|
| `shared.ts#getPlayerDetail` | `get-player.service.ts:11` → `players.routes.ts` → Eden → web | curl `/v1/players/:id` shape; Chrome perfil |
| `shared.ts#seasonsOfPlayer` | só dentro de `getPlayerDetail` (`:1209`) | switcher ainda lista seasons |
| `shared.ts#concurrentSeasonIds` | `getPlayerDetail` + `_check-campaign.ts` | invariante apps carreira[current] == season.appearances |
| `player-detail.tsx` | page `/players/[id]` | Chrome tabela + click season |
| `useSeasonParam` | SeasonSwitcher + queries | click row escreve `?season=` |

## Blast radius e cuidados

- Campo aditivo no payload — sintoma se quebrar: web typecheck / tiles some; detectar: typecheck + curl.
- Sobrescrever `seasons` por engano — sintoma: switcher perde `name`/`isCurrent`; detectar: Chrome select vazio.
- Agregar só liga (sem `concurrentSeasonIds`) — sintoma: números da tabela ≠ card Temporada; detectar: assert script (dossiê §Testes).
- `resolveSeason(leagueCodeOfPlayer, smId)` na carreira — sintoma: 404 / row sumida em season de outra liga; detectar: Don't P10.1 + jogador dual-liga se houver.
- Minutos 0 em lineups — sintoma: apps > 0 com minutes 0; **não** filtrar apps por minutes>0.

## Evidências

- [código] `apps/api/src/modules/leagues/shared/shared.ts:1058-1072` — totais single-campaign.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:1358-1372` — `seasonsOfPlayer` metadata-only.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:765-776` — `concurrentSeasonIds` (mesmo país + startYear).
- [código] `apps/api/src/modules/leagues/shared/shared.ts:692-701` — `resolveSeason` exige leagueCode (não usar na carreira).
- [código] `apps/api/src/db/schemas/leagues.ts:31` — `sportmonksSeasonId` unique → lookup uuid seguro.
- [código] `apps/web/features/leagues/components/player-detail/player-detail.tsx:161-163` — UI jogos/minutos single-season.
- [banco] Neon 2026-07-21 — PL 2 seasons + amostra dual-season Martínez/Khusanov (liga-only).
- [commit] `57f5b3d` — introduz `seasonsOfPlayer`.
- [doc] `docs/investigacoes/jogador-apps-minutos-por-season.md` — recomendação + mercado.
- [web] FBref / Transfermarkt / WhoScored — paridade = tabela season\|apps\|min (as-of 2026-07-21).

## Detalhes por passo

### §Shape `CareerSeason`

```ts
type CareerSeason = {
  sportmonksSeasonId: number
  name: string
  startYear: number
  isCurrent: boolean
  appearances: number
  minutes: number
}
// PlayerDetail += careerSeasons: CareerSeason[]
```

### §Query (intenção)

1. `leagueSeasons = await seasonsOfPlayer(playerId)` (já existe; N≤4 hoje; ordem `desc startYear`).
2. Para cada season: lookup uuid `SELECT id FROM season WHERE sportmonks_season_id = $smId` (coluna unique) → `ids = await concurrentSeasonIds(uuid)` → `count(*)` e `sum(coalesce(minutesPlayed,0))` em `lineup_player ⋈ lineup ⋈ match` com `inArray(match.seasonId, ids)` e `eq(lineupPlayer.playerId, id)`.
3. Emitir `careerSeasons` **na mesma ordem** de `seasonsOfPlayer` (não reordenar).
4. Alternativa performance (se N seasons crescer): um SQL agrupando por `startYear`+país — só se a prova P10 mostrar latência; default = loop reusando `concurrentSeasonIds`.

Don't da query: filtrar `minutesPlayed > 0`; incluir seasons de copa como linhas próprias; mutar `seasonsOfPlayer` / `SeasonSummary`; usar `resolveSeason(leagueCodeOfPlayer(playerId), smId)`.

### §UI

- Novo componente `career-seasons.tsx` em `apps/web/features/leagues/components/player-detail/`.
- Grid tabular espelhando match-log / scorers-table rhythm.
- Título: **"Por temporada"**. Colunas: Temporada · Jogos · Minutos (PT).
- Row click: `isCurrent ? setSeason(undefined) : setSeason(smId)` (mesmo contrato do `SeasonSwitcher`).
- Mostrar mesmo com `length === 1` (transparência do ingerido).
- Posição default: após card Temporada / antes do match-log (só micro-ajuste adiado).
- Dual-liga: se `careerSeasons` tiver season cuja liga ≠ `leagueCodeOfPlayer`, row **não** chama `setSeason` (GET 404 via `resolveSeason`) — aceite P10 = PL dual-season.

### §Testes

**API script** `apps/api/scripts/_check-career-seasons.ts` (criar no `/i`):
- Âncora: resolver player dual-season PL por nome (ex. Emiliano Martínez) ou id do ambiente; seasons SportMonks `25583` + `23614`.
- Happy: `careerSeasons.length >= 2`, cada row com apps>0, ordem `desc startYear`.
- Invariante: para a season selecionada (default current), a row correspondente em `careerSeasons` tem `.appearances === season.appearances` e `.minutes === season.minutes` no mesmo GET.
- Borda: jogador só 1 season → length 1, sem throw.
- Erro: player 404 inalterado (smoke; espelhar padrão `_check-campaign.ts` se útil).

**Chrome (roteiro):**
- T1: `/players/<id>` (Martínez dual PL) → card "Por temporada" com ≥2 rows; labels Jogos/Minutos; ordem mais recente primeiro.
- T2: click row 2024/2025 → URL `?season=23614`; card Temporada refetcha; números da row batem com tiles jogos/minutos. Click na row current limpa `?season=`.
- T3: console limpo; network `/v1/players/` 200.
- Fechar com `list_console_messages` + `list_network_requests`.

## Plano executável

Ver seção `## Plano (2026-07-21) — W-003/W-004` em [LIG-001](../features/ligas/LIG-001-pagina-do-jogador.md).
