import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Top scorers (goals + assists) of each team of a match — the "who can score" preview. */
export function useMatchScorersQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "scorers"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).scorers.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
