import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Rounds of a league; `round` filters one specific round. */
export function useLeagueRoundsQuery(code: string, round?: number) {
  return useQuery({
    queryKey: ["leagues", code, "rounds", round ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).rounds.get({
        query: round != null ? { round } : {},
      })
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
