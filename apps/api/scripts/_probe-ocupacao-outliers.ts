import { db } from "../src/db/client"
import { sql } from "drizzle-orm"

// Ocupacao passou de 100% em copa (max 887%) e PL teve min 0.1%: o venue_id do jogo aponta pro
// estadio errado, ou o attendance/capacity esta sujo? Preciso saber se o sinal e usavel.
const q = async (s: string) => (await db.execute(sql.raw(s))).rows

console.log("== PL: outliers de ocupacao ==")
console.log(
  JSON.stringify(
    await q(`
    select m.name, m.date, v.name as venue, v.capacity, m.attendance,
           round(100.0*m.attendance/v.capacity,1) as pct
    from match m join venue v on v.id = m.venue_id
    where m.league_code = 'PL' and m.attendance is not null and v.capacity > 0
      and (100.0*m.attendance/v.capacity < 70 or 100.0*m.attendance/v.capacity > 105)
    order by pct limit 15
  `),
    null,
    2,
  ),
)

console.log("== PL: distribuicao saudavel? (percentis) ==")
console.log(
  JSON.stringify(
    await q(`
    select count(*) as n,
           round(percentile_cont(0.05) within group (order by 100.0*m.attendance/v.capacity)::numeric,1) as p05,
           round(percentile_cont(0.50) within group (order by 100.0*m.attendance/v.capacity)::numeric,1) as p50,
           round(percentile_cont(0.95) within group (order by 100.0*m.attendance/v.capacity)::numeric,1) as p95,
           count(*) filter (where 100.0*m.attendance/v.capacity between 80 and 105) as na_faixa_plausivel
    from match m join venue v on v.id = m.venue_id
    where m.league_code = 'PL' and m.attendance is not null and v.capacity > 0
  `),
    null,
    2,
  ),
)

console.log("== copa: quais estadios estouram 100%? (capacity errada ou venue errado) ==")
console.log(
  JSON.stringify(
    await q(`
    select m.league_code, v.name as venue, v.capacity, max(m.attendance) as max_att,
           count(*) as jogos
    from match m join venue v on v.id = m.venue_id
    where m.attendance is not null and v.capacity > 0
      and 100.0*m.attendance/v.capacity > 110
    group by m.league_code, v.name, v.capacity
    order by max_att desc limit 12
  `),
    null,
    2,
  ),
)

process.exit(0)
