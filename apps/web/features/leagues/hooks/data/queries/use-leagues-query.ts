import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Lists the catalog of available leagues. */
export function useLeaguesQuery() {
  return useQuery({
    queryKey: ["leagues"],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues.get()
      if (error) throw error
      return data
    },
  })
}
