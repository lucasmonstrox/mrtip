/**
 * Prova P10.1 / A1 de LIG-001: `careerSeasons` em getPlayer — apps+minutos por season de liga
 * (campanha via concurrentSeasonIds), ordem = seasonsOfPlayer, invariante vs `season.*`.
 */
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { getPlayer } from "../src/modules/leagues/get-player/get-player.service"

let ok = 0
let total = 0
function check(pass: boolean, label: string, detail: string): void {
  total++
  if (pass) ok++
  console.log(`${pass ? "OK  " : "FAIL"} ${label} — ${detail}`)
}

async function q<T>(s: ReturnType<typeof sql>): Promise<T[]> {
  const r: unknown = await db.execute(s)
  return (Array.isArray(r) ? r : ((r as { rows: T[] }).rows ?? [])) as T[]
}

// Dual-season PL âncora: jogador com lineups em 25583 e 23614 (ex. Emiliano Martínez).
const dual = await q<{ id: string; name: string }>(sql`
  select p.id::text as id, p.name
  from player p
  where exists (
    select 1 from lineup_player lp
    join lineup l on l.id = lp.lineup_id
    join match m on m.id = l.match_id
    join season s on s.id = m.season_id
    where lp.player_id = p.id and s.sportmonks_season_id = 25583
  )
  and exists (
    select 1 from lineup_player lp
    join lineup l on l.id = lp.lineup_id
    join match m on m.id = l.match_id
    join season s on s.id = m.season_id
    where lp.player_id = p.id and s.sportmonks_season_id = 23614
  )
  order by p.name
  limit 1`)

const [single] = await q<{ id: string; name: string }>(sql`
  select p.id::text as id, p.name
  from player p
  join lineup_player lp on lp.player_id = p.id
  join lineup l on l.id = lp.lineup_id
  join match m on m.id = l.match_id
  where m.league_code = 'PL'
  group by p.id, p.name
  having count(distinct m.season_id) = 1
  limit 1`)

if (!dual[0]) {
  console.error("FAIL sem jogador dual-season PL (25583+23614) no banco")
  process.exit(1)
}

const dualPlayer = dual[0]!
const detail = await getPlayer(dualPlayer.id)

check(
  Array.isArray(detail.careerSeasons) && detail.careerSeasons.length >= 2,
  `careerSeasons.length >= 2 (${dualPlayer.name})`,
  `n=${detail.careerSeasons?.length ?? "missing"}`,
)

const smIds = new Set(detail.careerSeasons.map((r) => r.sportmonksSeasonId))
check(smIds.has(25583) && smIds.has(23614), "rows incluem seasons PL 25583 e 23614", [...smIds].join(","))

const years = detail.careerSeasons.map((r) => r.startYear)
const sorted = [...years].sort((a, b) => b - a)
check(
  years.every((y, i) => y === sorted[i]),
  "ordem desc startYear (= seasonsOfPlayer)",
  years.join(" → "),
)

for (const row of detail.careerSeasons) {
  check(row.appearances > 0, `apps > 0 (${row.name})`, `apps=${row.appearances} min=${row.minutes}`)
}

// A row da season resolvida pelo GET (default = corrente da liga âncora) — selectable + isCurrent.
const currentRow =
  detail.careerSeasons.find((r) => r.selectable && r.isCurrent) ??
  detail.careerSeasons.find((r) => r.selectable)
check(currentRow != null, "há row corrente/âncora pra invariante", currentRow?.name ?? "none")
if (currentRow) {
  check(
    currentRow.appearances === detail.season.appearances && currentRow.minutes === detail.season.minutes,
    "invariante career[current].apps/min == season.apps/min",
    `career=${currentRow.appearances}/${currentRow.minutes} season=${detail.season.appearances}/${detail.season.minutes}`,
  )
  check(currentRow.selectable === true, "row da liga âncora é selectable", `selectable=${currentRow.selectable}`)
}

check(
  detail.seasons.length === detail.careerSeasons.length,
  "seasons (switcher) e careerSeasons têm o mesmo length",
  `seasons=${detail.seasons.length} career=${detail.careerSeasons.length}`,
)
check(
  detail.seasons.every((s) => typeof s.name === "string" && typeof s.isCurrent === "boolean"),
  "seasons (switcher) intacto — shape SeasonSummary",
  detail.seasons.map((s) => s.name).join(" · "),
)

// Borda: 1 season → length 1, sem throw
if (single) {
  const one = await getPlayer(single.id)
  check(
    one.careerSeasons.length === 1,
    `borda 1-season (${single.name}) → length 1`,
    `n=${one.careerSeasons.length}`,
  )
} else {
  check(true, "borda 1-season — sem amostra no banco (skip)", "ok")
}

// Erro: player 404 inalterado
try {
  await getPlayer("00000000-0000-0000-0000-000000000000")
  check(false, "player inexistente → player_not_found", "não lançou")
} catch (e) {
  const msg = (e as Error).message ?? String(e)
  check(/player_not_found/.test(msg), "player inexistente → player_not_found", msg.slice(0, 60))
}

console.log(`\n${ok}/${total}`)
process.exit(ok === total ? 0 : 1)
