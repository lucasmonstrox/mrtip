import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Team detail (by slug): matches (most recent first) + current form. Base of the team page. */
export function useTeamQuery(slug: string) {
  return useQuery({
    queryKey: ["teams", slug],
    queryFn: async () => {
      const { data, error } = await api.v1.teams({ slug }).get()
      if (error) throw error
      return data
    },
    enabled: slug.length > 0,
  })
}
