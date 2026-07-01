import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"
import { useSeasonParam } from "../../ui/use-season-param"

/** Chaveamento (bracket) de uma copa: stages ordenadas + confrontos + vencedor + progressão. @feature CUP-001 */
export function useBracketQuery(code: string) {
  const { season } = useSeasonParam()
  return useQuery({
    queryKey: ["leagues", code, "bracket", season ?? null],
    queryFn: async () => {
      const { data, error } = await api.v1.leagues({ code }).bracket.get({ query: season != null ? { season } : {} })
      if (error) throw error
      return data
    },
    enabled: code.length > 0,
  })
}
