/**
 * Catalog of available leagues. Source = API-Football (api-sports.io).
 * Adding a league/season = adding an entry here (leagueId + season) and running the seed.
 * `season` is the starting year (2024 = 2024/25). The Free plan covers 2022–2024.
 */
export type LeagueCatalog = {
  code: string
  name: string
  country: string
  season: string
  leagueId: number // competition id in API-Football (PL = 39)
  seasonYear: number // starting year (2024 = 2024/25)
}

export const CATALOG = [
  {
    code: "PL",
    name: "Premier League",
    country: "England",
    season: "2024/25",
    leagueId: 39,
    seasonYear: 2024,
  },
] as const satisfies readonly LeagueCatalog[]

export type LeagueCode = (typeof CATALOG)[number]["code"]
