import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Seasons of a league (for the season switcher on the league page), most recent first. @feature LIG-008 */
export function useSeasonsQuery(code: string) {
  return useQuery({
    queryKey: ["leagues", code, "seasons"],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).seasons.get()
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
