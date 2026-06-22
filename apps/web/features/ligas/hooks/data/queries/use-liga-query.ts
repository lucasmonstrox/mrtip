import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Resumo de uma liga (nome, país, temporada, nº de rounds/partidas). */
export function useLigaQuery(code: string) {
  return useQuery({
    queryKey: ["ligas", code],
    queryFn: async () => {
      const { data, error } = await api.v1.ligas({ code }).get()
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
