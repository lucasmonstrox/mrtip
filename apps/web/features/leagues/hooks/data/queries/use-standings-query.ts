import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"
import { useSeasonParam } from "../../ui/use-season-param"

/** Computed standings of a league (official PL rule), scoped to the selected season. */
export function useStandingsQuery(code: string) {
  const { season } = useSeasonParam()
  return useQuery({
    queryKey: ["leagues", code, "standings", season ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).standings.get({ query: season != null ? { season } : {} })
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
