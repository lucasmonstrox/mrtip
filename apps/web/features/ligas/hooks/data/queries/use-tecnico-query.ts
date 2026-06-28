import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Detalhe do técnico: nome + jogos dirigidos. */
export function useTecnicoQuery(id: string) {
  return useQuery({
    queryKey: ["tecnicos", id],
    queryFn: async () => {
      const { data, error } = await api.v1.tecnicos({ id }).get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
