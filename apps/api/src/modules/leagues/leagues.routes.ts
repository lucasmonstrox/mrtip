import { Elysia, t } from "elysia"

import { getLeague } from "./get-league/get-league.service"
import { listLeagues } from "./list-leagues/list-leagues.service"
import { listRoundsQuery } from "./list-rounds/list-rounds.schema"
import { listRounds } from "./list-rounds/list-rounds.service"
import { standingsQuery } from "./standings/standings.schema"
import { standings } from "./standings/standings.service"

const paramCode = t.Object({ code: t.String() })

// League routes. Method chaining is required for Eden's type-inference (it infers the response
// type from the RETURN of each handler). Routes have no logic — they only call the service.
export const leaguesRoutes = new Elysia({ prefix: "/v1/leagues" })
  .get("/", () => listLeagues(), { detail: { summary: "List the available leagues" } })
  .get("/:code", ({ params }) => getLeague(params.code), {
    params: paramCode,
    detail: { summary: "Summary of a league" },
  })
  .get("/:code/rounds", ({ params, query }) => listRounds(params.code, query), {
    params: paramCode,
    query: listRoundsQuery,
    detail: { summary: "Rounds with their matches; ?round=N filters one" },
  })
  .get("/:code/standings", ({ params, query }) => standings(params.code, query), {
    params: paramCode,
    query: standingsQuery,
    detail: { summary: "Computed standings table; ?upTo=N cuts at round N" },
  })
