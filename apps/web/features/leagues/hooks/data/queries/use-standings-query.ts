import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"
import { useSeasonParam } from "../../ui/use-season-param"

/** Computed standings of a league, scoped to the selected season — including the tiebreak rule that
 *  season declares (Série A puts wins before goal difference; the PL doesn't). @feature LIG-017 */
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
