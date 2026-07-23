import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** News articles for a match (canonical URL + normalized provider). Empty when none. */
export function useMatchNewsQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "news"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).news.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
