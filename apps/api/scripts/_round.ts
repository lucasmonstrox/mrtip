// Lista as partidas de uma rodada (round) de uma temporada — id/slug/placar/data — pra orquestrar o lote.
// Run: bun run scripts/_round.ts <round=37> <sportmonksSeasonId=25583>
import { and, asc, eq } from "drizzle-orm"

import { db } from "../src/db/client"
import { match, season, team } from "../src/db/schema"

const ROUND = Number(process.argv[2] ?? 37)
const SEASON_SM = Number(process.argv[3] ?? 25583)

const [s] = await db.select().from(season).where(eq(season.sportmonksSeasonId, SEASON_SM))
if (!s) throw new Error(`season sportmonks ${SEASON_SM} não encontrada`)

const rows = await db
  .select()
  .from(match)
  .where(and(eq(match.round, ROUND), eq(match.seasonId, s.id)))
  .orderBy(asc(match.date))

const names = new Map<string, string>()
for (const t of await db.select().from(team)) names.set(t.id, t.name)

console.log(`round ${ROUND} · season ${s.name} (${SEASON_SM}) · ${rows.length} jogos\n`)
for (const m of rows) {
  const h = names.get(m.homeTeamId) ?? "?"
  const a = names.get(m.awayTeamId) ?? "?"
  const res = m.ftHome != null && m.ftAway != null ? `${m.ftHome}-${m.ftAway}` : "—"
  console.log(`${m.id}\t${res}\t${h} x ${a}\t${m.date?.toISOString?.()?.slice(0, 10) ?? m.date}`)
}
process.exit(0)
