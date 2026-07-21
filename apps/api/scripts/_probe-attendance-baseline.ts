import { db } from "../src/db/client"
import { sql } from "drizzle-orm"

// capacity e lixo fora da PL, entao a taxa de ocupacao nao serve. O proxy defensavel e attendance
// contra a BASELINE DO PROPRIO MANDANTE (so usa a coluna limpa). Tem variancia usavel?
const q = async (s: string) => (await db.execute(sql.raw(s))).rows

console.log("== desvio do publico vs media do proprio mandante (na season) ==")
console.log(
  JSON.stringify(
    await q(`
    with base as (
      select m.league_code, m.home_team_id, m.season_id, m.attendance,
             avg(m.attendance) over (partition by m.home_team_id, m.season_id) as media_time,
             count(*) over (partition by m.home_team_id, m.season_id) as n_jogos
      from match m
      where m.attendance is not null and m.attendance > 100
    )
    select league_code,
           count(*) as jogos,
           round(avg(abs(100.0*attendance/media_time - 100))::numeric,1) as desvio_medio_pct,
           round(percentile_cont(0.05) within group (order by 100.0*attendance/media_time)::numeric,1) as p05,
           round(percentile_cont(0.95) within group (order by 100.0*attendance/media_time)::numeric,1) as p95
    from base where n_jogos >= 5
    group by league_code order by league_code
  `),
    null,
    2,
  ),
)

console.log("== casos extremos: publico despencou vs a propria media (candidatos a 'organizada banida') ==")
console.log(
  JSON.stringify(
    await q(`
    with base as (
      select m.league_code, m.name, m.date, m.attendance, m.home_team_id, m.season_id,
             avg(m.attendance) over (partition by m.home_team_id, m.season_id) as media_time,
             count(*) over (partition by m.home_team_id, m.season_id) as n_jogos
      from match m
      where m.attendance is not null and m.attendance > 100
    )
    select league_code, name, date, attendance, round(media_time) as media_time,
           round((100.0*attendance/media_time)::numeric,1) as pct_da_media
    from base
    where n_jogos >= 5 and attendance < 0.5*media_time
    order by pct_da_media limit 15
  `),
    null,
    2,
  ),
)

process.exit(0)
