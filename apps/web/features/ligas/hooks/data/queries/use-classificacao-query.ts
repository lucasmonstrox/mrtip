import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Classificação calculada de uma liga (regra oficial PL). */
export function useClassificacaoQuery(code: string) {
  return useQuery({
    queryKey: ["ligas", code, "classificacao"],
    queryFn: async () => {
      const { data, error } = await api.v1.ligas({ code }).classificacao.get()
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
