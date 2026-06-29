import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"
import { useSeasonParam } from "../../ui/use-season-param"

/** Summary of a league (name, country, season, number of rounds/matches), scoped to the selected season. */
export function useLeagueQuery(code: string) {
  const { season } = useSeasonParam()
  return useQuery({
    queryKey: ["leagues", code, season ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).get({ query: season != null ? { season } : {} })
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
