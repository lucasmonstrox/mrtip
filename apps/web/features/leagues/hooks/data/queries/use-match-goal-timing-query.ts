import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Conceded-goal timing (15-min bands) of both teams of a match — the defensive timing profile. */
export function useMatchGoalTimingQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "goal-timing"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id })["goal-timing"].get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
