import { and, asc, count, desc, eq, ne } from "drizzle-orm"

import { db } from "../../../db/client"
import { goal, match, player, team } from "../../../db/schema"
import { getLeagueOrThrow } from "../shared/shared"

// The scorer's club (escudo/logo do time), shown on the left of each row in the marcadores table.
type ScorerTeam = { id: string; name: string; slug: string; logoUrl: string | null }

// One row of the top-scorers ranking (marcadores).
export type Scorer = {
  id: string
  name: string
  imageUrl: string | null
  team: ScorerTeam | null
  goals: number
  assists: number
}

// League top scorers (marcadores): goals + assists per player for the league's season, ranked by
// goals. Own goals are excluded from the goal tally. Derived live from goal⋈match (no snapshot
// table); 404 when the league doesn't exist.
export async function scorers(code: string): Promise<Scorer[]> {
  await getLeagueOrThrow(code)

  // Goals per scorer (own goals excluded), most goals first; name breaks ties for a stable order.
  const goalRows = await db
    .select({
      id: player.id,
      name: player.name,
      imageUrl: player.imageUrl,
      goals: count(),
    })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .innerJoin(player, eq(player.id, goal.playerId))
    .where(and(eq(match.leagueCode, code), ne(goal.type, "own")))
    .groupBy(player.id, player.name, player.imageUrl)
    .orderBy(desc(count()), asc(player.name))

  // Assists per player in the same league (innerJoin on assistId drops goals with no assist).
  const assistRows = await db
    .select({ id: player.id, assists: count() })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .innerJoin(player, eq(player.id, goal.assistId))
    .where(eq(match.leagueCode, code))
    .groupBy(player.id)

  const assistsByPlayer = new Map(assistRows.map((r) => [r.id, Number(r.assists)]))

  // The scorer's club, taken from the team they scored for (goal.teamId). Ordered by match date so
  // the most recent goal wins — handles a player who changed clubs mid-season (keeps the current one).
  const teamRows = await db
    .select({
      playerId: goal.playerId,
      id: team.id,
      name: team.name,
      slug: team.slug,
      logoUrl: team.logoUrl,
      date: match.date,
    })
    .from(goal)
    .innerJoin(match, eq(match.id, goal.matchId))
    .innerJoin(team, eq(team.id, goal.teamId))
    .where(and(eq(match.leagueCode, code), ne(goal.type, "own")))
    .orderBy(desc(match.date))

  const teamByPlayer = new Map<string, ScorerTeam>()
  for (const r of teamRows) {
    if (!teamByPlayer.has(r.playerId))
      teamByPlayer.set(r.playerId, { id: r.id, name: r.name, slug: r.slug, logoUrl: r.logoUrl })
  }

  return goalRows.map((r) => ({
    id: r.id,
    name: r.name,
    imageUrl: r.imageUrl,
    team: teamByPlayer.get(r.id) ?? null,
    goals: Number(r.goals),
    assists: assistsByPlayer.get(r.id) ?? 0,
  }))
}
