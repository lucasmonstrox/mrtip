import { and, count, eq } from "drizzle-orm"

import { db } from "../../../db/client"
import { match } from "../../../db/schema"
import { groupByRound, getLeagueOrThrow, loadMatches, resolveSeason, tiebreakOfSeason } from "../shared/shared"

// GET /v1/leagues/:code — summary of a league (metadata + count of rounds and matches) for ONE
// season (?season=<sportmonksSeasonId>, default current). 404 when the league/season doesn't exist.
export async function getLeague(code: string, seasonParam?: number) {
  const league = await getLeagueOrThrow(code)
  const seasonId = await resolveSeason(code, seasonParam)
  const matches = await loadMatches(code, seasonId)
  // Copa: o total inclui qualifying/fases de acesso (com byes; centenas na FA Cup) que NÃO entram no
  // chaveamento. Conta só o mata-mata "proper" (stage type 224) pra o número bater com o bracket. @feature CUP-001
  const shownMatches =
    league.type === "cup"
      ? Number((await db.select({ n: count() }).from(match).where(and(eq(match.seasonId, seasonId), eq(match.stageTypeId, 224))))[0]?.n ?? matches.length)
      : matches.length
  // Critério de desempate APLICADO nesta temporada, publicado como campo aditivo pra UI poder dizer sob a
  // tabela o que decidiu um empate de pontos. Reusa o `seasonId` já resolvido acima — resolver de novo
  // deixaria rótulo e ordem podendo divergir. @feature LIG-017
  const tiebreak = await tiebreakOfSeason(code, seasonId)
  return { ...league, rounds: groupByRound(matches).length, matches: shownMatches, tiebreak }
}
