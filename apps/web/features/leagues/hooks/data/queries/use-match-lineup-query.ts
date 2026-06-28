import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Lineup (starters/bench/formation/coach) of both teams of a match. */
export function useMatchLineupQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "lineup"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).lineup.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
