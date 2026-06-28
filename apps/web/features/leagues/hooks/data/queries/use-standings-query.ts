import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Computed standings of a league (official PL rule). */
export function useStandingsQuery(code: string) {
  return useQuery({
    queryKey: ["leagues", code, "standings"],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).standings.get()
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
