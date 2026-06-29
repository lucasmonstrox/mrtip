// Ad-hoc: shot conversion = goals (non-own) / shots on target, per team, ranked. Highlights West Ham
// and the league weighted average. Conversion is over SoT (we don't ingest total shots). Throwaway.
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"

const rows = (await db.execute(sql`
  with sot as (
    select lu.team_id, coalesce(sum(lp.shots_on_target),0) as sot
    from lineup lu left join lineup_player lp on lp.lineup_id = lu.id
    group by lu.team_id
  ),
  g as (
    select team_id,
           count(*) filter (where type <> 'own') as goals,
           count(*) filter (where type = 'penalty') as pens
    from goal group by team_id
  )
  select t.name,
         g.goals::int as goals,
         g.pens::int as pens,
         s.sot::int as sot,
         round(100.0 * g.goals / nullif(s.sot,0), 1) as conv,
         round(100.0 * (g.goals - g.pens) / nullif(s.sot,0), 1) as conv_np
  from team t
  join sot s on s.team_id = t.id
  join g on g.team_id = t.id
  order by conv desc
`)) as unknown as Array<{ name: string; goals: number; pens: number; sot: number; conv: number; conv_np: number }>

const totGoals = rows.reduce((s, r) => s + r.goals, 0)
const totSot = rows.reduce((s, r) => s + r.sot, 0)
const leagueAvg = ((100 * totGoals) / totSot).toFixed(1)

console.log("Conversão = gols (não-own) / shots on target — ranking PL 2025/26\n")
console.log("  #  Time                     Gols  SoT   Conv%   s/ pênalti")
rows.forEach((r, i) => {
  const mark = /west ham/i.test(r.name) ? " ◄ WEST HAM" : ""
  console.log(
    `  ${String(i + 1).padStart(2)}  ${r.name.padEnd(24)} ${String(r.goals).padStart(4)} ${String(r.sot).padStart(4)}   ${String(r.conv).padStart(4)}%   ${String(r.conv_np).padStart(4)}%${mark}`,
  )
})
console.log(`\n  Média da liga (ponderada): ${leagueAvg}%  (${totGoals} gols / ${totSot} SoT)`)
process.exit(0)
