import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Coach detail: name + matches managed. */
export function useCoachQuery(id: string) {
  return useQuery({
    queryKey: ["coaches", id],
    queryFn: async () => {
      const { data, error } = await api.v1.coaches({ id }).get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
