import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Detalhe do time (por slug): jogos (mais recentes primeiro) + forma atual. Base da página do time. */
export function useTimeQuery(slug: string) {
  return useQuery({
    queryKey: ["times", slug],
    queryFn: async () => {
      const { data, error } = await api.v1.times({ slug }).get()
      if (error) throw error
      return data
    },
    enabled: slug.length > 0,
  })
}
