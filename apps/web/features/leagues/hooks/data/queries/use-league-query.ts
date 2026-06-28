import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Summary of a league (name, country, season, number of rounds/matches). */
export function useLeagueQuery(code: string) {
  return useQuery({
    queryKey: ["leagues", code],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).get()
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
