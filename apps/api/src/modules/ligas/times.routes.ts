import { Elysia, t } from "elysia"

import { getTime } from "./get-time/get-time.service"

// Rotas de times (mesma feature/dados das ligas, namespace próprio p/ a página do time).
// Roteado por SLUG (URL bonita: /v1/times/liverpool-fc). Slug inexistente → 404 no service.
export const timesRoutes = new Elysia({ prefix: "/v1/times" }).get(
  "/:slug",
  ({ params }) => getTime(params.slug),
  { params: t.Object({ slug: t.String() }), detail: { summary: "Detalhe do time: jogos + forma" } },
)
