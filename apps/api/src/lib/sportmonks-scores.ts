// Score extraction from a SportMonks v3 fixture `scores[]` array.
//
// Each fixture carries SEVERAL entries in `scores[]` — one per (half × team). Discovered on the
// real API (fixture 19427455, Liverpool 4-2 Bournemouth) that the `type_id`/`description` are:
//
//   type_id 1525  description "CURRENT"        → current/final score (FT once the match is over)
//   type_id 1     description "1ST_HALF"        → first half           (HT)
//   type_id 2     description "2ND_HALF"        → running total at the end of the 2nd half
//   type_id 48996 description "2ND_HALF_ONLY"   → 2nd-half goals only
//
// Each entry already states the side in `score.participant` ("home" | "away"), so we can split
// home/away without cross-referencing `participants[]`.

/** One entry of a fixture's `scores[]` array (the fields we use). */
export type SportmonksScore = {
  type_id: number
  description?: string
  participant_id: number
  score: { goals: number; participant: "home" | "away" }
}

/** Score flattened into 4 nullable columns — mirrors the `match` schema (null = no result). */
export type MatchScore = {
  ftHome: number | null
  ftAway: number | null
  htHome: number | null
  htAway: number | null
}

// SportMonks type_ids (discovered on the real API — see table above).
export const SCORE_TYPE_CURRENT = 1525 // final/current score
export const SCORE_TYPE_1ST_HALF = 1 // half-time

/**
 * Converts ONE fixture's `scores[]` into the 4 score columns of `match`.
 *  - FT (final) comes from the SCORE_TYPE_CURRENT entries, split home/away by `score.participant`.
 *  - HT comes from the SCORE_TYPE_1ST_HALF entries.
 *  - No result (empty scores / no CURRENT) → all null (preserves "null = no result").
 */
export function extractScore(scores: SportmonksScore[] | undefined): MatchScore {
  // Goals for a side at a given moment; null if the entry is missing (no/partial result).
  const goals = (type: number, side: "home" | "away"): number | null =>
    scores?.find((s) => s.type_id === type && s.score.participant === side)?.score.goals ?? null

  return {
    ftHome: goals(SCORE_TYPE_CURRENT, "home"),
    ftAway: goals(SCORE_TYPE_CURRENT, "away"),
    htHome: goals(SCORE_TYPE_1ST_HALF, "home"),
    htAway: goals(SCORE_TYPE_1ST_HALF, "away"),
  }
}
