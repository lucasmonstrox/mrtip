import { db } from "../src/db/client"
import { sql } from "drizzle-orm"

// Cobertura real de attendance/capacity/coach: separa "coluna existe" de "dado existe".
const q = async (s: string) => (await db.execute(sql.raw(s))).rows

console.log("== attendance por liga ==")
console.log(
  JSON.stringify(
    await q(`
    select l.code, count(*) as jogos,
           count(m.attendance) as com_attendance,
           round(100.0*count(m.attendance)/count(*),1) as pct
    from match m join league l on l.code = m.league_code
    group by l.code order by l.code
  `),
    null,
    2,
  ),
)

console.log("== capacity de venue ==")
console.log(
  JSON.stringify(
    await q(`select count(*) as venues, count(capacity) as com_capacity from venue`),
    null,
    2,
  ),
)

console.log("== jogos com venue+attendance (ocupacao computavel) ==")
console.log(
  JSON.stringify(
    await q(`
    select count(*) as jogos_com_ocupacao
    from match m join venue v on v.id = m.venue_id
    where m.attendance is not null and v.capacity is not null and v.capacity > 0
  `),
    null,
    2,
  ),
)

console.log("== coach: entidades e cobertura de lineup ==")
console.log(
  JSON.stringify(
    await q(`
    select (select count(*) from coach) as coaches,
           (select count(*) from lineup) as lineups,
           (select count(*) from lineup where coach_id is not null) as lineups_com_coach
  `),
    null,
    2,
  ),
)

process.exit(0)
