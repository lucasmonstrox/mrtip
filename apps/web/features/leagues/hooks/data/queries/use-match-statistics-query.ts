import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/**
 * Team-level match statistics of both teams (ball possession today; more to come).
 * Keyed by the match UUID resolved from the detail payload, like the other sub-tabs.
 */
export function useMatchStatisticsQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "statistics"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).statistics.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
