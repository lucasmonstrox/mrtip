import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Top scorers (marcadores) of a league: goals + assists per player, ranked by goals. */
export function useScorersQuery(code: string) {
  return useQuery({
    queryKey: ["leagues", code, "scorers"],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).scorers.get()
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
