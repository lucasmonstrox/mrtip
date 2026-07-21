import { db } from "../src/db/client"
import { sql } from "drizzle-orm"

// coach_id veio 0/3072: o coach_name (texto denormalizado) tambem esta vazio, ou so a FK falta?
const q = async (s: string) => (await db.execute(sql.raw(s))).rows

console.log("== lineup.coach_name ==")
console.log(
  JSON.stringify(
    await q(`
    select count(*) as lineups,
           count(coach_name) as com_coach_name,
           count(distinct coach_name) as nomes_distintos
    from lineup
  `),
    null,
    2,
  ),
)

console.log("== amostra de coach_name ==")
console.log(
  JSON.stringify(await q(`select distinct coach_name from lineup where coach_name is not null limit 10`), null, 2),
)

console.log("== attendance: ocupacao por liga (media) ==")
console.log(
  JSON.stringify(
    await q(`
    select m.league_code,
           count(*) as jogos,
           round(avg(100.0*m.attendance/v.capacity),1) as ocupacao_media_pct,
           round(min(100.0*m.attendance/v.capacity),1) as min_pct,
           round(max(100.0*m.attendance/v.capacity),1) as max_pct
    from match m join venue v on v.id = m.venue_id
    where m.attendance is not null and v.capacity > 0
    group by m.league_code order by m.league_code
  `),
    null,
    2,
  ),
)

process.exit(0)
