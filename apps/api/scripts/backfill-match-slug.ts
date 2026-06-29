// One-time bridge (LIG-009 P2): compute match.slug for every existing match from its league/season/
// team names, reusing the same `matchSlug`/`slugify` the sync uses. Idempotent — recomputes on every
// run. After this, the contract migration makes match.slug notNull + unique.
import { eq, sql } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { db } from "../src/db/client"
import { league, match, season, team } from "../src/db/schema"
import { matchSlug } from "../src/db/slug"

const homeTeam = alias(team, "home_team")
const awayTeam = alias(team, "away_team")

// season is left-joined (a match predating the seasonId backfill falls back to the league's season name).
const rows = await db
  .select({
    id: match.id,
    leagueName: league.name,
    seasonName: season.name,
    leagueSeason: league.season,
    homeName: homeTeam.name,
    awayName: awayTeam.name,
  })
  .from(match)
  .innerJoin(league, eq(league.code, match.leagueCode))
  .leftJoin(season, eq(season.id, match.seasonId))
  .innerJoin(homeTeam, eq(homeTeam.id, match.homeTeamId))
  .innerJoin(awayTeam, eq(awayTeam.id, match.awayTeamId))

let n = 0
for (const r of rows) {
  const slug = matchSlug(r.leagueName, r.seasonName ?? r.leagueSeason, r.homeName, r.awayName)
  await db.update(match).set({ slug }).where(eq(match.id, r.id))
  n += 1
}
console.log(`backfilled slug on ${n} matches`)

const [chk] = await db
  .select({ nullCount: sql<number>`count(*) filter (where ${match.slug} is null)` })
  .from(match)
const [dup] = await db
  .select({ dupes: sql<number>`count(*) - count(distinct ${match.slug})` })
  .from(match)
console.log(`remaining null slug: ${chk!.nullCount}; duplicate slugs: ${dup!.dupes}`)
process.exit(0)
