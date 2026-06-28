import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Player detail: totals (goals/assists/matches out) + list of goals. */
export function usePlayerQuery(id: string) {
  return useQuery({
    queryKey: ["players", id],
    queryFn: async () => {
      const { data, error } = await api.v1.players({ id }).get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
