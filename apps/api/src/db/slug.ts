// Slug helpers shared by the sync and backfill scripts. `slugify` lowercases + strips accents (NFD)
// + kebab-cases any string; `matchSlug` builds the pretty, collision-free match URL key from the
// league/season/team names (e.g. "premier-league-2025-2026-chelsea-vs-everton"). @feature LIG-009
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

// Pretty match slug: {league}-{season}-{home}-vs-{away}. Unique by construction within a league+season
// (an ordered home×away pair plays once; the reverse fixture is the away-vs-home slug). @feature LIG-009
export function matchSlug(leagueName: string, seasonName: string, homeName: string, awayName: string): string {
  return [slugify(leagueName), slugify(seasonName), slugify(homeName), "vs", slugify(awayName)].join("-")
}
