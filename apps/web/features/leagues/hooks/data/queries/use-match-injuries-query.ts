import { useQuery } from "@tanstack/react-query"

import { api } from "@/shared/api/eden"

/** Absences (injuries/suspensions) of both teams of a match. */
export function useMatchInjuriesQuery(id: string) {
  return useQuery({
    queryKey: ["matches", id, "injuries"],
    queryFn: async () => {
      const { data, error } = await api.v1.matches({ id }).injuries.get()
      if (error) throw error
      return data
    },
    enabled: id.length > 0,
  })
}
