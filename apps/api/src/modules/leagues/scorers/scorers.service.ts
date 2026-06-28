import { and, asc, count, desc, eq, ne } from "drizzle-orm"

import { db } from "../../../db/client"
import { goal, match, player } from "../../../db/schema"
import { getLeagueOrThrow } from "../shared/shared"

// One row of the top-scorers ranking (marcadores).
export type Scorer = {
  id: string
  name: string
  imageUrl: string | null
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

  return goalRows.map((r) => ({
    id: r.id,
    name: r.name,
    imageUrl: r.imageUrl,
    goals: Number(r.goals),
    assists: assistsByPlayer.get(r.id) ?? 0,
  }))
}
