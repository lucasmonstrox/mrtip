import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Detalhe do jogador: totais (gols/assists/jogos fora) + lista de gols. */
export function useJogadorQuery(id: string) {
  return useQuery({
    queryKey: ["jogadores", id],
    queryFn: async () => {
      const { data, error } = await api.v1.jogadores({ id }).get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
