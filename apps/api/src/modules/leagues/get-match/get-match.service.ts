import { notFound } from "../../../lib/errors"
import {
  getLeagueOrThrow,
  getMatchRow,
  loadMatchCards,
  loadMatchGoals,
  serializeMatch,
} from "../shared/shared"

// GET /v1/matches/:id — detail of a match: match data + league summary + goals
// (scorer/assist/own goal/minute) + cards (yellow/red/second yellow). 404 (match_not_found).
export async function getMatch(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  const league = await getLeagueOrThrow(row.m.leagueCode)
  const goals = await loadMatchGoals(id)
  const cards = await loadMatchCards(id)
  return { ...serializeMatch(row), league, goals, cards }
}
