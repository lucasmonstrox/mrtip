import { computeForm, getTeamBySlug, loadTeamMatches } from "../shared/shared"

// GET /v1/teams/:slug — team page: team data + its matches (most recent first) +
// the current form (last 5). 404 (team_not_found) when the slug doesn't exist.
export async function getTeam(slug: string) {
  const team = await getTeamBySlug(slug)
  const matches = await loadTeamMatches(team.id)
  return { ...team, form: computeForm(matches, team), matches }
}
