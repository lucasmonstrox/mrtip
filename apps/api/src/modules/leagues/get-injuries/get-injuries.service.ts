import { notFound } from "../../../lib/errors"
import { getMatchRow, loadMatchAbsences } from "../shared/shared"

// GET /v1/matches/:id/injuries — absences (injuries/suspensions) of both teams of the match.
// `null` per side when there's no record. 404 when the match doesn't exist.
export async function matchInjuries(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const list = await loadMatchAbsences(id)
  return {
    home: list.find((a) => a.team.id === row.m.homeTeamId) ?? null,
    away: list.find((a) => a.team.id === row.m.awayTeamId) ?? null,
  }
}
