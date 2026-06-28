import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Forma (últimos 5 V/E/D) dos dois times da partida, ancorada na data do jogo. */
export function usePartidaFormaQuery(id: string) {
  return useQuery({
    queryKey: ["partidas", id, "forma"],
    queryFn: async () => {
      const { data, error } = await api.v1.partidas({ id }).forma.get({ query: {} })
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
