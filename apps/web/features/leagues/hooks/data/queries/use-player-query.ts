import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/**
 * Player detail: totals (goals/assists/matches out) + list of goals. `enabled` lets callers defer the
 * fetch — the hover card passes the popover's open state so the request fires only on first hover, not
 * on mount; the React Query cache (keyed by id) is then shared across every mention of that player.
 */
export function usePlayerQuery(id: string, enabled = true) {
  return useQuery({
    queryKey: ["players", id],
    queryFn: async () => {
      const { data, error } = await api.v1.players({ id }).get()
      if (error) throw error
      return data
    },
    enabled: enabled && id.length > 0,
  })
}
