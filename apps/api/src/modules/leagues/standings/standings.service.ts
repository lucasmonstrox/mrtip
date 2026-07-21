import { and, eq } from "drizzle-orm"

import { db } from "../../../db/client"
import { standing } from "../../../db/schema"
import { computeStandings, getLeagueOrThrow, loadMatches, resolveSeason, tiebreakOfSeason } from "../shared/shared"
import type { StandingsQuery } from "./standings.schema"

// GET /v1/leagues/:code/standings — computed table for ONE season (?season=<sportmonksSeasonId>,
// default current); ?upTo=N considers only up to round N (useful for "standings at the time of the
// match"). 404 when the league/season doesn't exist. The qualification/relegation zone comes from
// the OFFICIAL SportMonks table (`standing`), scoped to the same season, merged onto the full table.
export async function standings(code: string, query: StandingsQuery) {
  await getLeagueOrThrow(code)
  const seasonId = await resolveSeason(code, query.season)
  const matches = await loadMatches(code, seasonId)
  // O desempate é da TEMPORADA, não da liga: a regra vem do que a fonte declara pra `seasonId` (a Série A
  // ordena vitórias antes do saldo; a PL não). Reusa a season já resolvida acima. @feature LIG-017
  const tiebreak = await tiebreakOfSeason(code, seasonId)

  if (query.upTo != null) {
    return computeStandings(
      matches.filter((m) => m.round <= query.upTo!),
      tiebreak.criteria,
    )
  }

  const table = computeStandings(matches, tiebreak.criteria)
  const rows = await db
    .select({ teamId: standing.teamId, zone: standing.zone })
    .from(standing)
    .where(and(eq(standing.leagueCode, code), eq(standing.seasonId, seasonId)))
  const zoneByTeam = new Map(rows.map((r) => [r.teamId, r.zone]))
  return table.map((r) => ({ ...r, zone: zoneByTeam.get(r.team.id) ?? null }))
}
