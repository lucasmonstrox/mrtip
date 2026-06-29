import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"
import { useSeasonParam } from "../../ui/use-season-param"

/** Top scorers (marcadores) of a league, scoped to the selected season: goals + assists, ranked by goals. */
export function useScorersQuery(code: string) {
  const { season } = useSeasonParam()
  return useQuery({
    queryKey: ["leagues", code, "scorers", season ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).scorers.get({ query: season != null ? { season } : {} })
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
