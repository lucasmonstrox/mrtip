import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"
import { useSeasonParam } from "../../ui/use-season-param"

/** Rounds of a league scoped to the selected season; `round` filters one specific round. */
export function useLeagueRoundsQuery(code: string, round?: number) {
  const { season } = useSeasonParam()
  return useQuery({
    queryKey: ["leagues", code, "rounds", round ?? null, season ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).rounds.get({
        query: { ...(round != null ? { round } : {}), ...(season != null ? { season } : {}) },
      })
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
