import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/**
 * Audit dossier of a match's latest prognosis run: the model's reasoning chain, the evidence prompt it
 * received and the raw output. Payload is heavy (~100KB), so `enabled` is tied to the panel being OPEN —
 * it must never fire on a normal visit to the Prognóstico tab. @feature MOD-011
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
