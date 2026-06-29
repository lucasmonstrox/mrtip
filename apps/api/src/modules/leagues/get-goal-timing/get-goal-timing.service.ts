import { notFound } from "../../../lib/errors"
import { getMatchRow, loadGoalTiming, type TeamRef } from "../shared/shared"
import type { GoalTimingQuery } from "./get-goal-timing.schema"

// GET /v1/matches/:id/goal-timing — goal-timing profile of both teams: goals SCORED and CONCEDED per
// 15-min band over the league season (when each side scores and gets breached), optionally cut by
// venue (`side`: all / home / away, applied to each team independently). 404 if the match doesn't
// exist. Derived live from goal⋈match — no snapshot, season-wide window.
export async function matchGoalTiming(id: string, query: GoalTimingQuery) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const { m } = row
  const home: TeamRef = { id: m.homeTeamId, name: row.homeName, slug: row.homeSlug, logoUrl: row.homeLogo }
  const away: TeamRef = { id: m.awayTeamId, name: row.awayName, slug: row.awaySlug, logoUrl: row.awayLogo }
  return loadGoalTiming(home, away, m.leagueCode, query.side)
}
