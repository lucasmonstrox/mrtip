import { notFound } from "../../../lib/errors"
import { getMatchRow, loadAbsenceImpact } from "../shared/shared"

// GET /v1/matches/:id/absence-impact — prognosis-grade absence impact of both teams: per absent player
// the share of the team's goals he carries + the team's goals/game with him vs without, plus a per-team
// total (additive-safe % of goals out + the full-squad→depleted goals/game). Deterministic and anti-leak
// (cut at the match date) — feeds the "impacto dos desfalques" panel on the prognosis tab. @feature LIG-007
// `null` per side when there's no absence record. 404 when the match doesn't exist.
export async function getAbsenceImpact(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  return loadAbsenceImpact(id)
}
