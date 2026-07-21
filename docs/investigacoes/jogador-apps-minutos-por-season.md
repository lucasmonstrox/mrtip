# Investigação — Apps e minutos por season no perfil do jogador · W-003 + W-004 (LIG-001)

> Investigado em 2026-07-21. `/rs` tier Comparação (focada). Arqueologia interna via SocratiCode + 4 frentes em paralelo (API, UI, dados, mercado). Banco verificado no Neon `mrtip` (local `:5434` down). Fontes web fetchadas nesta sessão (as-of 2026-07-21).

## TL;DR + recomendação cravada

**W-003/W-004 ainda NÃO estão feitos.** O que existe hoje é o agregado da **campanha selecionada** (`season.appearances` / `season.minutes` no card Temporada) + um `SeasonSwitcher` que refetcha **uma** season por vez. O desejo da wishlist é a **quebra carreira**: várias temporadas lado a lado (`season | apps | minutes`).

**Recomendação:** entregar como extensão de **LIG-001** (não feature nova), W-003+W-004 juntos — campo aditivo no `getPlayerDetail` (ex.: `careerSeasons`, **não** reusar a key `seasons`) + tabela na UI. Sem migração: dado já em `lineup_player` / `match.seasonId`. Granularidade MVP = **uma linha por season de liga** (mesmo grão do switcher), com apps/minutos da **campanha** — pra cada league-season âncora, agregar sobre o conjunto `concurrentSeasonIds(uuid)` (liga + copas do mesmo `startYear` + país), o mesmo critério do card Temporada (`shared.ts:908`), **não** um `GROUP BY match.seasonId` solto (isso vira liga-only ou rows de copa).

Paridade de mercado: FBref / Transfermarkt / WhoScored History têm a tabela; FotMob / Sofascore competem no que já temos (switcher + totais de uma season).

> **Errata (2026-07-21, revisor contexto fresco):** TL;DR anterior citava `GROUP BY match.seasonId` e a receita usava `concurrentSeasonIds(season.id)` — `SeasonSummary` **não expõe** `id`. Corrigido abaixo.

---

## Brief (perguntas)

1. O que já existe em API/UI pra apps/minutos?
2. O gap é single-season vs multi-season table?
3. Dá pra derivar das seasons ingeridas sem migração?
4. Feature nova ou extensão de LIG-001?
5. Como o mercado mostra?

**Respondido:** 1–5 abaixo. Requisitos implícitos: transparência (número auditável → match-log da season), sem promessa de ganho, UI em PT, `type` não `interface`, fuso `America/Sao_Paulo` só se houver datas novas (aqui só labels de season).

---

## Estado real no código

| Item | Estado | Âncora |
|---|---|---|
| Totais da campanha selecionada | **Real** — `season.appearances` / `season.minutes` | `shared.ts:475-488` (tipo), `:1058-1072` (build) |
| Lista `seasons[]` | **Real** — metadata do switcher, **sem** apps/min | `SeasonSummary` `:43-48`; `seasonsOfPlayer` `:1358-1372`; return `:1209/:1242` |
| Spine per-match | **Real** — `appearances[]` com `minutes` | `PlayerAppearance` `:395-423`; query `:947-981` |
| Escopo campanha (liga+copas) | **Real** — `concurrentSeasonIds` | `:908`, LIG-011 |
| UI "jogos"/"minutos" | **Real** — tiles de **uma** season | `player-detail.tsx:161-163` |
| SeasonSwitcher | **Real** — `?season=` + refetch | `season-switcher.tsx:21-37`; `use-player-query.ts:11-18` |
| MinutesChart | **Real** — barras por partida da season atual | `minutes-chart.tsx:17-30` |
| Tabela carreira multi-season | **Gap** | nenhum consumidor UI; nenhum `GROUP BY season` na API |
| Schema | **Pronto** | `match.seasonId` `leagues.ts:132`; `lineup_player.minutesPlayed` `:296` |

**Correção a docs anteriores:** `docs/planos/LIG-001-pagina-do-jogador.md:13` (**Wishlist coberta:** W-003/W-004) cobria só o **total da season selecionada**, não a **quebra por temporada**. Premissa da wishlist antiga (contagem ausente no schema) já estava REFUTADA na investigação LIG-001 de 2026-06-28; o que faltava era a superfície carreira.

Git (âncoras): `57f5b3d` introduz `seasonsOfPlayer`; `7504968` shape de `season.appearances`; `7af237f` ingest de `minutesPlayed`.

---

## Dados (banco)

Neon `mrtip` (2026-07-21) — seasons com lineups:

| league | season | sm id | matches | players c/ apps |
|---|---|---|---|---|
| PL | 2025/2026 | 25583 | 380 | 675 |
| PL | 2024/2025 | 23614 | 380 | 684 |
| BRA | 2026 | 26763 | 380 | 738 |
| BRA | 2025 | 25184 | 380 | 862 |
| + FAC/CARA 25/26 | — | — | cups | — |

Amostra dual-season PL **filtrada só em `league.type = 'league'`** (prova de que há ≥2 seasons com lineups e que `sum(minutes_played)` roda): Emiliano Martínez 24/25 → 37 apps / 3197' · 25/26 → 32 / 2836'. Khusanov 11/504' → 30/1429'.

**Atenção:** esses números são **liga-only** — **não** são o shape do MVP (campanha via `concurrentSeasonIds`, que inclui FAC/CARA). Servem só como evidência de cobertura dual-season + agregabilidade; o invariante produto é `careerRow.apps/min == season.appearances/minutes` no mesmo GET.

**Gotcha:** algumas linhas de `lineup_player` têm `minutes_played = 0` (ex. reservas jovens) — `sum` ainda é o denominador certo; UI deve tolerar 0 sem esconder a row.

LIG-008: máximo viável no plano SportMonks ≈ 2 seasons históricas de profundidade plena (P9 refutado pra 5 seasons) — a tabela carreira cresce conforme novas seasons forem ingeridas; **não** bloquear o MVP.

Local `localhost:5434` estava down nesta sessão — evidência de dados veio do Neon, alinhada às provas do LIG-008.

---

## Mercado (as-of 2026-07-21)

| Fonte | O que mostra | Classe vs gap | Confiança |
|---|---|---|---|
| FotMob (Mbappé profile, fetch 2026-07-21) | Totais de **uma** season (matches + minutes); career = spells por clube (apps/gols, **sem** minutes by season) | Já temos o switcher+totais | verificado-fetch |
| Sofascore (Son profile, fetch 2026-07-21; re-check HTTP 403) | Match list c/ minutes; Career tab **NEI** (JS) | Switcher ≈ nós | verificado-fetch / NEI |
| Transfermarkt detailed stats ([Tarkowski](https://www.transfermarkt.co.uk/james-tarkowski/leistungsdatendetails/spieler/173504)) | Tabela **season × competition** + apps + minutes + club | **Paridade** (ouro) | verificado-fetch (estrutura); cells JS = NEI |
| FBref Standard Stats / all_comps (Neymar, fetch 2026-07-21; re-check HTTP 403) | Grid `Season \| Squad \| Comp \| MP \| Min \| …` | **Paridade** | verificado-fetch |
| WhoScored History (Gabriel Pires, fetch 2026-07-21; re-check HTTP 403) | Feed: season / team / tournament / **apps** / **minsPlayed** | **Paridade** | verificado-fetch (JSON feed) |

**UX:** tabela > chart pra carreira (nenhum chart de apps/min por season verificado). Club + split por competição = diferencial nice-to-have, não bloqueio do MVP.

---

## Opções

| Opção | Prós | Contras |
|---|---|---|
| **A. Campo aditivo `careerSeasons[]` + tabela UI (recomendada)** | Sem migração; 1 request; bate com switcher; blast radius baixo | Precisa alinhar campanha vs liga-only |
| B. Só enriquecer `SeasonSummary` in-place | Menos keys | Contamina tipo do switcher; risco de apps/min "liga-only" divergirem do card Temporada |
| C. N fetches client (trocar season e cachear) | Zero API nova | N round-trips; UX ruim; não é tabela |
| D. Materializar `player_season_stat` | Escala | Overkill com ≤2–4 seasons; migração sem dor atual |
| E. Feature LIG-019 separada | Tracking isolado | Duplica posse da página do jogador (LIG-001) |

**Counter-review (adversarial):**
1. *"Switcher já resolve"* — **REFUTADO**: wishlist pede quebra; FBref/TM/WS têm tabela; comparar 24/25 vs 25/26 sem clicar 2× é o job.
2. *"Precisa materializar"* — **REFUTADO**: Neon prova agregação live; LIG-001 já deriva on-the-fly.
3. *"Linha = season×copa estilo TM"* — **adiado**: MVP 1 linha/campanha; split por competição = fase 2 (pode reusar `appearances[].competition`).

---

## Modelo / receita (decisão, não spec de implementação)

**Shape desejado (conceitual):** para cada league-season do switcher — `sportmonksSeasonId`, `name`, `startYear`, `isCurrent` + `appearances` + `minutes` (campanha). Campo **novo** no `PlayerDetail` (nome sugerido `careerSeasons`); **proibido** sobrescrever `seasons: SeasonSummary[]`.

**Receita de agregação (o que não pode errar):**
1. Partir de `seasonsOfPlayer(playerId)` → lista de `SeasonSummary` (`shared.ts:43-48`: `sportmonksSeasonId | name | startYear | isCurrent` — **sem** uuid).
2. Para cada row: **resolver o uuid** da season de liga (`season.id`) a partir de `sportmonksSeasonId` (lookup na tabela `season`) — `concurrentSeasonIds` exige uuid (`shared.ts:765-776`), não o id SportMonks.
3. `ids = await concurrentSeasonIds(uuid)` → `count(*)` e `sum(minutesPlayed)` em `lineup_player ⋈ lineup ⋈ match` com `inArray(match.seasonId, ids)` e o `playerId`.
4. Alternativa equivalente: um SQL que agrega por `startYear` + país da liga (mesmo critério LIG-011) — desde que o resultado bata com o card Temporada.

Don't: `GROUP BY match.seasonId` como definição do MVP; chamar `concurrentSeasonIds(season.id)` no return atual de `seasonsOfPlayer` (não existe `.id`); filtrar apps por `minutes > 0`; materializar `player_season_stat` agora; listar seasons de copa como linhas próprias (já entram na campanha).

**Faceta (só o que muda):** dados = nada; api = campo aditivo + agregação; ui = tabela multi-season; ia = fora. Detalhe de código/passos = `/pl` quando o dono pedir.

---

## Riscos e gotchas

- **Divergência campanha vs liga-only** se a query esquecer `concurrentSeasonIds` (ou usar a amostra Neon liga-only como “verdade”) — o card Temporada incluiria copas e a tabela não.
- **Lookup uuid esquecido** — `sportmonksSeasonId` ≠ argumento de `concurrentSeasonIds`.
- **Minutos 0** em lineups reais — não filtrar `minutes > 0` na contagem de apps.
- **Nome `seasons` ocupado** — nova key obrigatória.
- **Poucas seasons** (2 na PL) — tabela curta é ok; copy "temporadas ingeridas", não "carreira completa".
- Eden revive / TypeBox: campo aditivo, sem response schema.

---

## Refutado

- "W-003/W-004 cobertos pelo MVP LIG-001" (plano antigo) — só totais single-season.
- "Falta ingestão de minutos/apps" — REFUTADO desde 2026-06-28 (`lineup_player.minutesPlayed`).
- "Precisa Transfermarkt pra carreira de apps/min" — REFUTADO pra este escopo (dado local basta); Transfermarkt continua relevante só pra W-002 (clubes/fees).

## Perguntas abertas / lacunas

- **[PENDENTE-DONO opcional]** Split por competição (TM) no MVP ou só campanha agregada? Default da recomendação: **só campanha**.
- Sofascore Career tab: **NEI** (não inventar).
- Local Postgres down — revalidar script de prova no ambiente do `/i` (Neon ok nesta sessão).

## Próximo passo

Quando o dono pedir: `/pl` a partir desta recomendação (campo aditivo + tabela; receita campanha com lookup uuid).
