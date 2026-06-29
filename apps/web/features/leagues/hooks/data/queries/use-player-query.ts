import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"
import { useSeasonParam } from "../../ui/use-season-param"

/**
 * Player detail (scoped to the selected season): totals (goals/assists/matches out) + list of goals +
 * the player's seasons. `enabled` lets callers defer the fetch — the hover card passes the popover's
 * open state so the request fires only on first hover; the cache (keyed by id + season) is shared.
 */
export function usePlayerQuery(id: string, enabled = true) {
  const { season } = useSeasonParam()
  return useQuery({
    queryKey: ["players", id, season ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.players({ id }).get({ query: season != null ? { season } : {} })
      if (error) throw error
      return data
    },
    enabled: enabled && id.length > 0,
  })
}
