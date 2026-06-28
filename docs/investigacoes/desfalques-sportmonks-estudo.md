# Estudo empírico — `sidelined` (desfalques/lesões) SportMonks, PL 2025/26

**Quando:** 2026-06-28 · **Tier:** `Starter (Advanced) — trial`. Varredura das **380 fixtures** da temporada via `/fixtures/between` com `include=sidelined.player;sidelined.type;sidelined.sideline` (mesmas janelas do sync, sem request extra por fixture). JSON cru: `scratchpad/pl-sidelined.json`.

## Números

| métrica | valor |
|---|---|
| fixtures totais / encerradas | 380 / 380 |
| fixtures com ≥1 desfalque | **380 (100%)** |
| registros de desfalque | **3334** |
| média por fixture | **8.8** (mediana 8, máx 18) |
| com detalhe `sideline` (datas/games_missed) | **556 (17%)** — 83% só base |
| `Doubtful` (dúvida) | 213 (6%) |
| baixas ~confirmadas | 3121 (94%) |
| `games_missed` (onde há) | n=540, mediana 27, máx 100, média 32 |

## Distribuição por tipo (top)

`UNKNOWN_INJURY 810` · `HAMSTRING 371` · `KNEE 350` · `CRUCIATE_LIGAMENT 247` · `DOUBTFUL 213` · `ANKLE 195` · `MUSCLE 170` · `KNOCK 91` · `BACK 88` · `GROIN 82` · … e **suspensões misturadas**: `RED_CARD_SUSPENSION 66`, `YELLOW_CARD_SUSPENSION 27`, `NO_ELIGIBILITY 34`, `DOPING_BAN 25`.

`UNKNOWN_INJURY` sozinho = ~24% — a categoria fina nem sempre vem; muitas vezes só "está lesionado".

## Achados que mudam a modelagem (e que a doc NÃO diz)

1. **Cobertura 100% e base sempre presente.** Todo registro traz `participant_id`, `player_id`, `player{}` e `type{name,developer_name}`. Mapeia limpo na nossa `injury(matchId, playerId, teamId, type, reason)`.
2. **É lista por-fixture, não snapshot atual.** Lesão de longo prazo aparece em todas as fixtures do período (ex.: A. Webster em 38/38). Logo "quem estava fora NAQUELA rodada" é reconstruível por jogo — exatamente o grão da nossa tabela.
3. **`sideline` detalhado é bônus de 17%.** Tratar `gamesMissed`/`outSince`/`completed` como **nullable**; nunca depender deles.
4. **⚠️ `games_missed` é cumulativo/carreira, não desta lesão-nesta-season.** Máx 100 num campeonato de 38 jogos prova isso. NÃO ler como "perdeu N jogos seguidos". Útil só como proxy grosseiro de gravidade.
5. **Suspensão e lesão dividem a mesma lista** (`model_type: "injury_suspension"`). Nossa tabela `injury` na prática vira "desfalques" (lesão + suspensão + inelegibilidade). Nome levemente impreciso, semântica correta para aposta.
6. **`Doubtful` (6%)** é o antigo "Questionable" — dúvida, não baixa. Derivável por `developer_name === "DOUBTFUL"`.

## Recomendação de ingestão (confirmada pelo dado real)

Append `;sidelined.player;sidelined.type` no include de fixtures (`sync-sportmonks.ts:292`) + loop de upsert na `injury`:

| coluna | origem |
|---|---|
| `teamId` | `participant_id` (via `teamIdBySm`) |
| `playerId` | `player_id` (via `ensurePlayer`) |
| `type` | `type.developer_name` (`HAMSTRING_INJURY`, `DOUBTFUL`, `RED_CARD_SUSPENSION`…) |
| `reason` | `type.name` (label PT-friendly p/ UI) |
| `gamesMissed` (nova, nullable) | `sideline.games_missed` — proxy de gravidade, cumulativo |
| `outSince` (nova, nullable) | `sideline.start_date` |

Migração só-expand (2 colunas). Custo de request: **zero** — vem na mesma chamada já feita.
