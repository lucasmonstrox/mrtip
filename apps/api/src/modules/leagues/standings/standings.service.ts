import { eq } from "drizzle-orm"

import { db } from "../../../db/client"
import { standing } from "../../../db/schema"
import { computeStandings, getLeagueOrThrow, loadMatches } from "../shared/shared"
import type { StandingsQuery } from "./standings.schema"

// GET /v1/leagues/:code/standings — computed table; ?upTo=N considers only up to round N
// (useful for "standings at the time of the match"). 404 when the league doesn't exist.
// The qualification/relegation zone comes from the OFFICIAL SportMonks table (the `standing` table)
// and is merged onto the full table only — a ?upTo snapshot has no zone.
export async function standings(code: string, query: StandingsQuery) {
  await getLeagueOrThrow(code)
  const matches = await loadMatches(code)

  if (query.upTo != null) {
    return computeStandings(matches.filter((m) => m.round <= query.upTo!))
  }

  const table = computeStandings(matches)
  const rows = await db
    .select({ teamId: standing.teamId, zone: standing.zone })
    .from(standing)
    .where(eq(standing.leagueCode, code))
  const zoneByTeam = new Map(rows.map((r) => [r.teamId, r.zone]))
  return table.map((r) => ({ ...r, zone: zoneByTeam.get(r.team.id) ?? null }))
}
