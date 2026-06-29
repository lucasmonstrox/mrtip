import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Full play-by-play commentary of a match, chronological. Empty array when there's no coverage. */
export function useMatchCommentariesQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "commentaries"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).commentaries.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
