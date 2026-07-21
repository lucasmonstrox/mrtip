import { sql } from "drizzle-orm"
import { db } from "../../src/db/client"
const rowsOf = (r: unknown): any[] => ((r as any)?.rows ?? r) as any[]
const q = async (label: string, s: any) => { try { console.log(label, JSON.stringify(rowsOf(await db.execute(s)))) } catch(e:any) { console.log(label, "ERR", e.message.slice(0,140)) } }
await q("ft_matches", sql`select count(*)::int n from match where status='FT'`)
await q("with_prompt", sql`select count(distinct m.id)::int n from match m join match_prognosis mp on mp.match_id=m.id and mp.prompt_text is not null where m.status='FT' and m.ft_home is not null`)
await q("prognosis_rows", sql`select count(*)::int n from match_prognosis`)
await q("commentary", sql`select count(*)::int n from commentary`)
await q("card", sql`select count(*)::int n from card`)
process.exit(0)
