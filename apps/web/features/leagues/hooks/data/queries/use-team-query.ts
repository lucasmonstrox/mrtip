import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"
import { useSeasonParam } from "../../ui/use-season-param"

/** Team detail (by slug) scoped to the selected season: matches + form + standing + the team's seasons. */
export function useTeamQuery(slug: string) {
  const { season } = useSeasonParam()
  return useQuery({
    queryKey: ["teams", slug, season ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.teams({ slug }).get({ query: season != null ? { season } : {} })
      if (error) throw error
      return data
    },
    enabled: slug.length > 0,
  })
}
