import { and, eq, inArray } from "drizzle-orm"
import { db } from "../src/db/client"
import { match, season, league } from "../src/db/schema"
for (const code of ["FAC", "CARA"]) {
  const [l] = await db.select().from(league).where(eq(league.code, code))
  const [s] = await db.select().from(season).where(and(eq(season.leagueCode, code), eq(season.isCurrent, true)))
  if (!s) continue
  const rows = await db.select({ id: match.sportmonksFixtureId, stt: match.stageTypeId }).from(match).where(eq(match.seasonId, s.id))
  const proper = rows.filter((r) => r.stt === 224)
  console.log(`${code} (${l?.name}): total ${rows.length} · proper(224) ${proper.length} · qualifying ${rows.length - proper.length}`)
}
process.exit(0)
