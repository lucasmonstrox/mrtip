import { sql } from "drizzle-orm"
import { db } from "../../src/db/client"
const rowsOf = (r: unknown): any[] => ((r as any)?.rows ?? r) as any[]
console.log(JSON.stringify(rowsOf(await db.execute(sql`
  select m.id, m.round, m.date::text from match m join match_prognosis mp on mp.match_id=m.id and mp.prompt_text is not null
  where m.status='FT' and m.ft_home is not null group by m.id, m.round, m.date order by m.date desc limit 3`))))
console.log("rodada_dist", JSON.stringify(rowsOf(await db.execute(sql`
  select case when m.round >= 35 then 'r>=35' else 'r<35' end k, count(distinct m.id)::int n
  from match m join match_prognosis mp on mp.match_id=m.id and mp.prompt_text is not null
  where m.status='FT' and m.ft_home is not null group by 1`))))
process.exit(0)
