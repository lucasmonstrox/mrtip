import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/**
 * Attack-momentum seesaw (per-minute home/away pressure) of a match, reconstructed from the ingested
 * trends. Empty array when the match has no trends (older fixture / league without coverage).
 */
export function useMatchMomentumQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "momentum"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).momentum.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
