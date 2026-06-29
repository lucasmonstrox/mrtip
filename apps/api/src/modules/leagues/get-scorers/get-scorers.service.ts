import { notFound } from "../../../lib/errors"
import { getMatchRow, loadTeamScorers, type TeamRef } from "../shared/shared"

// How many scorers to show per team — short on purpose: with 1 season the list is curta, this is a
// preview ("quem pode marcar"), not the full ranking.
const TOP_N = 5

// GET /v1/matches/:id/scorers — top scorers (goals + assists) of BOTH teams over the league season,
// the "who can score" preview of the match page. 404 if the match doesn't exist. Derived live from
// goal⋈match — no snapshot.
export async function matchScorers(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const { m } = row
  const home: TeamRef = { id: m.homeTeamId, name: row.homeName, slug: row.homeSlug, logoUrl: row.homeLogo }
  const away: TeamRef = { id: m.awayTeamId, name: row.awayName, slug: row.awaySlug, logoUrl: row.awayLogo }
  const [homeScorers, awayScorers] = await Promise.all([
    loadTeamScorers(home, m.leagueCode, TOP_N),
    loadTeamScorers(away, m.leagueCode, TOP_N),
  ])
  return { home: homeScorers, away: awayScorers }
}
