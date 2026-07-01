import {
  computeForm,
  computeTeamTrends,
  getTeamBySlug,
  loadTeamFormMatches,
  loadTeamMatches,
  loadTeamStanding,
  resolveSeason,
  seasonsOfTeam,
} from "../shared/shared"

// GET /v1/teams/:slug — team page for ONE season (?season=<sportmonksSeasonId>, default current):
// team data + official standing + betting trends + its matches (most recent first) + form (last 5)
// + the seasons the team has data in (for the switcher). `standing` is null when the team has no
// standing in that season. 404 (team_not_found / season_not_found). @feature LIG-008
// TODO multi-liga: the season is resolved against "PL" (the only league today); derive the team's
// league when a second one is added.
export async function getTeam(slug: string, seasonParam?: number) {
  const team = await getTeamBySlug(slug)
  const seasonId = await resolveSeason("PL", seasonParam)
  const [standing, matches, seasons, formMatches] = await Promise.all([
    loadTeamStanding(team.id, seasonId),
    loadTeamMatches(team.id, seasonId),
    seasonsOfTeam(team.id),
    loadTeamFormMatches(team.id, { seasonId }),
  ])
  return {
    ...team,
    standing,
    trends: computeTeamTrends(matches, team.id),
    // Form crosses ALL competitions of the campaign (league + cups), not just the league match list
    // above — the team's real recent run. Trends/standing stay league-scoped. @feature LIG-011
    form: computeForm(formMatches, team),
    matches,
    seasons,
  }
}
