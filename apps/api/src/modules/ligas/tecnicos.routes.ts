import { Elysia, t } from "elysia"

import { getTecnico } from "./get-tecnico/get-tecnico.service"

const paramId = t.Object({ id: t.String({ format: "uuid", error: "id_invalido" }) })

// Rotas de técnicos (mesma feature/dados das ligas, namespace próprio p/ a página do técnico).
export const tecnicosRoutes = new Elysia({ prefix: "/v1/tecnicos" }).get(
  "/:id",
  ({ params }) => getTecnico(params.id),
  { params: paramId, detail: { summary: "Detalhe do técnico: jogos dirigidos" } },
)
