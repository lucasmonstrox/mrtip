import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Desfalques (lesões/suspensões) dos dois times de uma partida. */
export function usePartidaDesfalquesQuery(id: string) {
  return useQuery({
    queryKey: ["partidas", id, "desfalques"],
    queryFn: async () => {
      const { data, error } = await api.v1.partidas({ id }).desfalques.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
