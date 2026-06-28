import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

// Catálogo de ligas para o rail dinâmico da sidebar (uma liga por item, com logo). Mesma
// query key da listagem (`/leagues`) pra compartilhar cache e não refazer o fetch.
export function useLeaguesNav() {
  return useQuery({
    queryKey: ["leagues"],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues.get()
      if (error) throw error
      return data
    },
  })
}
