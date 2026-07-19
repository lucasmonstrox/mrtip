// Structural shape of what this util needs from a `Round` — kept local (instead of importing the
// Eden contract) so the rule stays pure and the check script can feed it plain fixtures.
type RoundLike = {
  round: number
  matches: { date: string | Date }[]
}

/**
 * Day (yyyy-MM-dd) of a match date that Eden Treaty may have revived into a `Date`. Same
 * normalization as `formatDate` in ./format — duplicated on purpose, so this rule has no
 * dependency on the display helpers.
 */
function day(date: string | Date): string {
  return (typeof date === "string" ? date : date.toISOString()).slice(0, 10)
}

/**
 * Picks the round a league is currently playing, by ROUND-NUMBER PROGRESSION: the highest-numbered
 * round that already kicked off, advancing to the next one once it has finished. Immune to a
 * postponed match dragging the default back to an old round — which deciding by missing score, or
 * by the nearest future date, are not.
 *
 * `rounds` must be ordered by round number ascending (what the API's `groupByRound` serves).
 * `today` is a yyyy-MM-dd day and arrives as a PARAMETER — never read the clock in here, or none
 * of this is testable. Returns the round NUMBER, or null when there are no rounds at all.
 */
export function pickCurrentRound(rounds: RoundLike[], today: string): number | null {
  if (rounds.length === 0) return null

  // Base = the highest-NUMBERED round that already kicked off (has a match on a day <= today) —
  // by round number, never by latest date: that is what makes a straggler from an old round
  // harmless. Comparing yyyy-MM-dd strings lexicographically is exact (fixed width, zero-padded)
  // and dodges timezones entirely.
  let baseIndex = -1
  for (let i = 0; i < rounds.length; i++) {
    const r = rounds[i]!
    if (!r.matches.some((m) => day(m.date) <= today)) continue
    if (baseIndex === -1 || r.round > rounds[baseIndex]!.round) baseIndex = i
  }

  // Nothing has kicked off yet: the season hasn't started -> the first round.
  if (baseIndex === -1) return rounds[0]!.round

  const base = rounds[baseIndex]!

  // Still under way (e.g. Saturday played, Sunday pending) -> stay on it.
  if (base.matches.some((m) => day(m.date) >= today)) return base.round

  // Finished -> the NEXT round of the ordered array (never `base.round + 1`: round numbers can
  // have gaps). No next round means the season is over -> keep the last one.
  return rounds[baseIndex + 1]?.round ?? base.round
}
