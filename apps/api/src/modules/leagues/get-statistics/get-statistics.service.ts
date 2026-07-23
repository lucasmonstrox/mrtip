import { eq } from "drizzle-orm"

import { db } from "../../../db/client"
import { card, matchTeamStats } from "../../../db/schema"
import { notFound } from "../../../lib/errors"
import { getMatchRow, type MatchStats, type TeamMatchStats, type TeamRef } from "../shared/shared"

// GET /v1/matches/:id/statistics — team-level match statistics of BOTH teams for the "Estatísticas"
// tab: ball possession + shots inside/outside the box + clearances (SUM lineup, LIG-023) from
// match_team_stats (DOS-002 / LIG-019/020), plus yellow/red card counts from the `card` table
// (LIG-021; yellowred counts in both). 404 if the match doesn't exist; each side is null-filled for
// match_team_stats when the row is missing; card counts default to 0.
export async function matchStatistics(id: string): Promise<MatchStats> {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const { m } = row
  const home: TeamRef = { id: m.homeTeamId, name: row.homeName, slug: row.homeSlug, logoUrl: row.homeLogo }
  const away: TeamRef = { id: m.awayTeamId, name: row.awayName, slug: row.awaySlug, logoUrl: row.awayLogo }
  const [rows, cardRows] = await Promise.all([
    db
      .select({
        teamId: matchTeamStats.teamId,
        possession: matchTeamStats.possession,
        shotsInsidebox: matchTeamStats.shotsInsidebox,
        shotsOutsidebox: matchTeamStats.shotsOutsidebox,
        clearances: matchTeamStats.clearances,
      })
      .from(matchTeamStats)
      .where(eq(matchTeamStats.matchId, m.id)),
    db
      .select({ teamId: card.teamId, type: card.type })
      .from(card)
      .where(eq(card.matchId, m.id)),
  ])
  const cardsFor = (teamId: string) => {
    let yellowCards = 0
    let redCards = 0
    for (const c of cardRows) {
      if (c.teamId !== teamId) continue
      if (c.type === "yellow" || c.type === "yellowred") yellowCards++
      if (c.type === "red" || c.type === "yellowred") redCards++
    }
    return { yellowCards, redCards }
  }
  const side = (t: TeamRef): TeamMatchStats => {
    const r = rows.find((row) => row.teamId === t.id)
    const cards = cardsFor(t.id)
    return {
      team: t,
      possession: r?.possession ?? null,
      shotsInsidebox: r?.shotsInsidebox ?? null,
      shotsOutsidebox: r?.shotsOutsidebox ?? null,
      clearances: r?.clearances ?? null,
      yellowCards: cards.yellowCards,
      redCards: cards.redCards,
    }
  }
  return { home: side(home), away: side(away) }
}
