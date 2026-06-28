import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Escalação (titulares/banco/formação/técnico) dos dois times de uma partida. */
export function usePartidaEscalacaoQuery(id: string) {
  return useQuery({
    queryKey: ["partidas", id, "escalacao"],
    queryFn: async () => {
      const { data, error } = await api.v1.partidas({ id }).escalacao.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
