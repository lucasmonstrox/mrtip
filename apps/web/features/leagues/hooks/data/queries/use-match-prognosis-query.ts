import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/**
 * Latest LLM xG prognosis of a match (per-team + overall): xG total/1ºT/2ºT + 15-min bands + texts,
 * over/under, BTTS, 1x2 in three cuts. `data` is null when no prognosis has been generated yet.
 */
export function useMatchPrognosisQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "prognosis"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).prognosis.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
