import { and, eq, inArray, sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { match, season, lineup, goal, matchTrend, matchTeamStats, commentary, venue } from "../src/db/schema"
const [s] = await db.select().from(season).where(and(eq(season.leagueCode, "CARA"), eq(season.isCurrent, true)))
const ms = await db.select({ id: match.id, v: match.venueId }).from(match).where(eq(match.seasonId, s!.id))
const ids = ms.map((m) => m.id)
const withVenue = ms.filter((m) => m.v).length
const cnt = async (t: any) => (await db.select({ n: sql<number>`count(*)::int` }).from(t).where(inArray(t.matchId, ids)))[0]!.n
console.log(`CARA matches: ${ids.length} · com venue: ${withVenue}`)
console.log(`lineups: ${await cnt(lineup)} · goals: ${await cnt(goal)} · teamStats: ${await cnt(matchTeamStats)} · trends: ${await cnt(matchTrend)} · commentaries: ${await cnt(commentary)}`)
process.exit(0)
