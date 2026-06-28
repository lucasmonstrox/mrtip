import { notFound } from "../../../lib/errors"
import { getMatchRow, loadMatchLineups } from "../shared/shared"

// GET /v1/matches/:id/lineup — lineup of both teams of the match (starters/bench/formation/coach).
// `null` per side when there's no lineup yet (the API-Football backfill is incremental).
// 404 when the match doesn't exist.
export async function matchLineup(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const list = await loadMatchLineups(id)
  return {
    home: list.find((l) => l.team.id === row.m.homeTeamId) ?? null,
    away: list.find((l) => l.team.id === row.m.awayTeamId) ?? null,
  }
}
