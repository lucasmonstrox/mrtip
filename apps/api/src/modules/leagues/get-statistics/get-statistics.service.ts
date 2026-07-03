import { eq } from "drizzle-orm"

import { db } from "../../../db/client"
import { matchTeamStats } from "../../../db/schema"
import { notFound } from "../../../lib/errors"
import { getMatchRow, type MatchStats, type TeamMatchStats, type TeamRef } from "../shared/shared"

// GET /v1/matches/:id/statistics — team-level match statistics of BOTH teams for the "Estatísticas"
// tab: today just ball possession (posse de bola, %), read from the match_team_stats row ingested
// from the SportMonks fixture `statistics` include (DOS-002). 404 if the match doesn't exist; each
// side is null-filled when its stats row is missing (older fixtures / tiers without the include).
export async function matchStatistics(id: string): Promise<MatchStats> {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const { m } = row
  const home: TeamRef = { id: m.homeTeamId, name: row.homeName, slug: row.homeSlug, logoUrl: row.homeLogo }
  const away: TeamRef = { id: m.awayTeamId, name: row.awayName, slug: row.awaySlug, logoUrl: row.awayLogo }
  const rows = await db
    .select({ teamId: matchTeamStats.teamId, possession: matchTeamStats.possession })
    .from(matchTeamStats)
    .where(eq(matchTeamStats.matchId, m.id))
  const side = (t: TeamRef): TeamMatchStats => ({
    team: t,
    possession: rows.find((r) => r.teamId === t.id)?.possession ?? null,
  })
  return { home: side(home), away: side(away) }
}
