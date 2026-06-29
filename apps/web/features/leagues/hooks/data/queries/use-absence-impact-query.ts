import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/**
 * Prognosis-grade absence impact of a match (per team): each absent player's share of the team's goals
 * + the team's goals/game with him vs without, plus a per-team total. Deterministic (anti-leak, cut at
 * the match date) — powers the "impacto dos desfalques" panel on the prognosis tab. @feature LIG-007
 */
export function useAbsenceImpactQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "absence-impact"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id })["absence-impact"].get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
