import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }
console.log("league:", JSON.stringify(await q(`select code, name, country, season, type, sportmonks_league_id, sportmonks_season_id from league order by code`), null, 1))
console.log("\nseason:", JSON.stringify(await q(`select league_code, name, start_year, is_current, sportmonks_season_id from season order by league_code, start_year`), null, 1))
console.log("\nmatches por season:", JSON.stringify(await q(`select s.league_code, s.name, count(m.id)::int as matches from season s left join match m on m.season_id = s.id group by 1,2 order by 1,2`), null, 1))
console.log("\ntotais:", JSON.stringify(await q(`select (select count(*) from match)::int as matches, (select count(*) from team)::int as teams, (select count(*) from player)::int as players, (select count(*) from standing)::int as standings`), null, 1))
process.exit(0)
