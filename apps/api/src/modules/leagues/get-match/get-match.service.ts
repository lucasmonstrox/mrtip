import { notFound } from "../../../lib/errors"
import {
  getLeagueOrThrow,
  getMatchRow,
  getMatchRowBySlug,
  lastPlayedDateAnyComp,
  loadMatchCards,
  loadMatchGoals,
  loadMatches,
  loadMatchTvStations,
  loadTeamStanding,
  serializeMatch,
  type TeamRest,
} from "../shared/shared"

// A uuid looks like 8-4-4-4-12 hex; anything else coming on /matches/:key is treated as a slug. Lets
// old uuid URLs keep resolving while new links use the pretty slug. @feature LIG-009
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Rest of a side: days between this match's date and the team's previous PLAYED match in ANY competition
// (league OR cup). Both are pure yyyy-MM-dd dates (UTC midnight), so the diff is exact in CALENDAR days —
// no date-fns (not a dep of apps/api) and no float/timezone error. Do NOT swap for date-fns. Cups ARE
// ingested now, so a midweek cup tie correctly ENCURTA o descanso (antes só-liga superestimava). @feature LIG-005
async function restFor(teamId: string, date: string, seasonStart: string): Promise<TeamRest> {
  const lastDate = await lastPlayedDateAnyComp(teamId, date, seasonStart)
  if (!lastDate) return null
  return { lastMatchDate: lastDate, restDays: Math.round((Date.parse(date) - Date.parse(lastDate)) / 86_400_000) }
}

// GET /v1/matches/:key — detail of a match: match data + league summary + goals
// (scorer/assist/own goal/minute) + cards (yellow/red/second yellow) + rest days + official season
// standing of both teams. `key` is a slug (pretty URL) or a uuid (legacy). 404 (match_not_found).
export async function getMatch(key: string) {
  const row = UUID_RE.test(key) ? await getMatchRow(key) : await getMatchRowBySlug(key)
  if (!row) throw notFound("match_not_found")
  const id = row.m.id
  const league = await getLeagueOrThrow(row.m.leagueCode)
  const goals = await loadMatchGoals(id)
  const cards = await loadMatchCards(id)
  // Onde assistir (W-059): emissoras/streams do jogo, mais abrangentes primeiro.
  const tvStations = await loadMatchTvStations(id)
  // Descanso cruza liga + copa, mas bounded ao campeonato: seasonStart = 1º jogo de liga da season (as
  // copas caem depois disso). Sem esse bound o "último jogo" de uma estreia de season puxaria a temporada
  // passada. Standing continua scopado à season (LIG-008/LIG-006).
  const matches = await loadMatches(row.m.leagueCode, row.m.seasonId ?? undefined)
  const seasonStart = matches.reduce((min, mm) => (mm.date < min ? mm.date : min), row.m.date)
  const [homeRest, awayRest] = await Promise.all([
    restFor(row.m.homeTeamId, row.m.date, seasonStart),
    restFor(row.m.awayTeamId, row.m.date, seasonStart),
  ])
  const rest = { home: homeRest, away: awayRest }
  // Official season standing of each side (position/points/W-D-L/goals/zone) for the Fatos snapshot;
  // null when the team has no standing row yet. @feature LIG-006
  const [homeStanding, awayStanding] = await Promise.all([
    loadTeamStanding(row.m.homeTeamId, row.m.seasonId),
    loadTeamStanding(row.m.awayTeamId, row.m.seasonId),
  ])
  return {
    ...serializeMatch(row),
    league,
    goals,
    cards,
    rest,
    standings: { home: homeStanding, away: awayStanding },
    tvStations,
  }
}
