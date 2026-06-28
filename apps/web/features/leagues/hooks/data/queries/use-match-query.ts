import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Detail of a match (match data + league summary) — base of the match screen. */
export function useMatchQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
