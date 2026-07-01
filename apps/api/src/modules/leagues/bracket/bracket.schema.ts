import { t, type Static } from "elysia"

// Query de GET /v1/leagues/:code/bracket — ?season=<sportmonksSeasonId> (default current) e
// ?stages=proper|all: "proper" (default) traz só o mata-mata de verdade (stages type_id 224); "all"
// inclui as qualifying (centenas de jogos, não formam bracket limpo). @feature CUP-001
export const bracketQuery = t.Object({
  season: t.Optional(t.Integer()),
  stages: t.Optional(t.Union([t.Literal("proper"), t.Literal("all")])),
})
export type BracketQuery = Static<typeof bracketQuery>
