import { keepPreviousData, useQuery } from "@tanstack/react-query"
import * as React from "react"

import { api } from "@/shared/api/eden"

// Atrasa a propagação de `value` em `delay` ms — evita disparar uma busca a cada tecla digitada.
export function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// Busca global server-side (trigram, tolerante a typo/acento) por nome de liga, time, jogador, jogo
// (confronto) ou treinador. Só dispara com 2+ caracteres; mantém o resultado anterior visível
// enquanto a próxima consulta carrega (sem flicker entre teclas). @feature CORE-002
export function useSearch(query: string) {
  const q = query.trim()
  return useQuery({
    queryKey: ["search", q],
    queryFn: async () => {
      const { data, error } = await api.v1.search.get({ query: { q } })
      if (error) throw error
      return data
    },
    enabled: q.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  })
}
