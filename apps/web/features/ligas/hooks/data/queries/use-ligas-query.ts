import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Lista o catálogo de ligas disponíveis. */
export function useLigasQuery() {
  return useQuery({
    queryKey: ["ligas"],
    queryFn: async () => {
      const { data, error } = await api.v1.ligas.get()
      if (error) throw error
      return data
    },
  })
}
