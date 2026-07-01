import { eq } from "drizzle-orm"

import { db } from "../../../db/client"
import { matchTrend } from "../../../db/schema"
import { notFound } from "../../../lib/errors"
import { getMatchRow } from "../shared/shared"
import { buildMomentum, type MomentumPoint } from "./momentum"

// GET /v1/matches/:id/momentum — attack-momentum curve (pressão da partida) of the match: a per-minute
// seesaw {minute, home, away} reconstructed from the ingested per-minute trends. 404 if the match
// doesn't exist; empty array when the match has no trends (older fixture / league without coverage).
// Derived live from match_trend — no snapshot, formula iterable without re-sync. @feature SIN-021
export async function matchMomentum(id: string): Promise<MomentumPoint[]> {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const { m } = row
  const rows = await db
    .select({
      teamId: matchTrend.teamId,
      typeId: matchTrend.typeId,
      periodId: matchTrend.periodId,
      minute: matchTrend.minute,
      value: matchTrend.value,
    })
    .from(matchTrend)
    .where(eq(matchTrend.matchId, m.id))
  return buildMomentum(rows, m.homeTeamId, m.awayTeamId)
}
