import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Form (last 5 W/D/L) of both teams of the match, anchored on the match date. */
export function useMatchFormQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "form"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).form.get({ query: {} })
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
