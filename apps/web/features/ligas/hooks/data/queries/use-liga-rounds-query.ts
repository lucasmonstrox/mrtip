import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Rounds (rodadas) de uma liga; `round` filtra uma rodada específica. */
export function useLigaRoundsQuery(code: string, round?: number) {
  return useQuery({
    queryKey: ["ligas", code, "rounds", round ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.ligas({ code }).rounds.get({
        query: round != null ? { round } : {},
      })
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
