import { notFound } from "../../../lib/errors"
import { getMatchRow, loadGoalTiming, type TeamRef } from "../shared/shared"

// GET /v1/matches/:id/goal-timing — goal-timing profile of both teams: goals SCORED and CONCEDED per
// 15-min band over the league season (when each side scores and gets breached). 404 if the match
// doesn't exist. Derived live from goal⋈match — no snapshot, season-wide window.
export async function matchGoalTiming(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const { m } = row
  const home: TeamRef = { id: m.homeTeamId, name: row.homeName, slug: row.homeSlug, logoUrl: row.homeLogo }
  const away: TeamRef = { id: m.awayTeamId, name: row.awayName, slug: row.awaySlug, logoUrl: row.awayLogo }
  return loadGoalTiming(home, away, m.leagueCode)
}
