import {
  computeForm,
  computeTeamTrends,
  getTeamBySlug,
  loadTeamMatches,
  loadTeamStanding,
} from "../shared/shared"

// GET /v1/teams/:slug — team page: team data + official standing (position/points/W-D-L/goals/zone)
// + betting trends (over2.5/BTTS/clean-sheet with sample band) + its matches (most recent first) +
// the current form (last 5). `standing` is null when the team has no standing row yet. 404
// (team_not_found) when the slug doesn't exist.
export async function getTeam(slug: string) {
  const team = await getTeamBySlug(slug)
  const [standing, matches] = await Promise.all([
    loadTeamStanding(team.id),
    loadTeamMatches(team.id),
  ])
  return { ...team, standing, trends: computeTeamTrends(matches, team.id), form: computeForm(matches, team), matches }
}
