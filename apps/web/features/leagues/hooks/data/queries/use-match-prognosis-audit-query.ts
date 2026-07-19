import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/**
 * Reasoning chain of a match's latest prognosis run, for auditing why the engine picked that bet. The text
 * runs 20k-41k chars (~25KB payload), so `enabled` is tied to the panel being OPEN — it must never fire on
 * a normal visit to the Prognóstico tab. The evidence prompt is NOT part of this payload (D7). @feature MOD-011
 */
export function useMatchPrognosisAuditQuery(id: string, open: boolean) {
  return useQuery({
    queryKey: ["matches", id, "prognosis", "audit"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).prognosis.audit.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0 && open,
    // O dossiê de uma run é imutável depois de gravado — não revalida por foco nem por remontagem.
    staleTime: Infinity,
  })
}
