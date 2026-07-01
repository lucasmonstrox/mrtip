import { Elysia, t } from "elysia"

import { search } from "./search/search.service"

// Global search route (cross-entity, own namespace). Thin: 1 route → 1 service. `q` is the user's
// term; `limit` caps results per entity bucket. Empty/short `q` resolves to empty buckets in the
// service (no 422 on `?q=`), so the front can fire as the user types.
export const searchRoutes = new Elysia({ prefix: "/v1/search" }).get(
  "/",
  ({ query }) => search(query.q, query.limit),
  {
    query: t.Object({
      q: t.String({ description: "Termo de busca: nome de liga, time, jogador, treinador ou confronto" }),
      limit: t.Optional(t.Integer({ minimum: 1, maximum: 10 })),
    }),
    detail: {
      summary: "Busca global fuzzy (trigram) por nome: ligas, times, jogadores, jogos e treinadores",
    },
  },
)
