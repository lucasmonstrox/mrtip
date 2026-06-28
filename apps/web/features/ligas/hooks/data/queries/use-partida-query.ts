import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Detalhe de uma partida (dados do jogo + resumo da liga) — base da tela de partida. */
export function usePartidaQuery(id: string) {
  return useQuery({
    queryKey: ["partidas", id],
    queryFn: async () => {
      const { data, error } = await api.v1.partidas({ id }).get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
