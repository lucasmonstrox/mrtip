import { t, type Static } from "elysia"

// Query do GET /v1/partidas/:id/forma — N jogos (1–10, default 5) e o recorte de local.
// "todos" = forma geral; "casa"/"fora" = só como mandante/visitante.
export const formaQuery = t.Object({
  n: t.Optional(t.Integer({ minimum: 1, maximum: 10 })),
  local: t.Optional(t.UnionEnum(["todos", "casa", "fora"])),
})
export type FormaQuery = Static<typeof formaQuery>
