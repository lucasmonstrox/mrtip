import { notFound } from "../../../lib/errors"
import { computeForm, getMatchRow, loadMatches, type TeamRef } from "../shared/shared"
import type { FormQuery } from "./form.schema"

// GET /v1/matches/:id/form — form (last N W/D/L) of BOTH teams of the match, ANCHORED on its date
// (only earlier matches count) — that's what the match page needs.
// `side` narrows the perspective (default "all" = overall form). 404 if the match doesn't exist.
//
// Note: the home/away cut is applied equally to both sides. The classic "predictive" view
// (home team at home + away team away) is a combination the front builds with two cuts;
// the default already delivers the overall form, which is the MVP.
export async function form(id: string, query: FormQuery) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")

  const matches = await loadMatches(row.m.leagueCode)
  const home: TeamRef = { id: row.m.homeTeamId, name: row.homeName, slug: row.homeSlug, logoUrl: row.homeLogo }
  const away: TeamRef = { id: row.m.awayTeamId, name: row.awayName, slug: row.awaySlug, logoUrl: row.awayLogo }
  const opts = { before: row.m.date, n: query.n, side: query.side }

  return {
    match: { id: row.m.id, date: row.m.date, home, away },
    home: computeForm(matches, home, opts),
    away: computeForm(matches, away, opts),
  }
}
