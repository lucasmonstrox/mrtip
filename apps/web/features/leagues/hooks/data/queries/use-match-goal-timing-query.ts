import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/**
 * Goal timing (15-min bands) of both teams of a match, by venue cut (`side`: all / home / away).
 * Keeps the previous cut's data while a new one loads, so toggling Todos/Casa/Fora doesn't flash.
 */
export function useMatchGoalTimingQuery(id: string, side: "all" | "home" | "away" = "all") {
  return useQuery({
    queryKey: ["matches", id, "goal-timing", side],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id })["goal-timing"].get({ query: { side } })
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
    placeholderData: keepPreviousData,
  })
}
