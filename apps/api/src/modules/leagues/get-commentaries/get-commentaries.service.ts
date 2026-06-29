import { notFound } from "../../../lib/errors"
import { getMatchRow, loadMatchCommentaries } from "../shared/shared"

// GET /v1/matches/:id/commentaries — full play-by-play narration of the match, ordered
// chronologically. Empty array when there's no commentary (coverage is partial). 404 when the match
// doesn't exist. @feature LIG-010
export async function matchCommentaries(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")
  return loadMatchCommentaries(id)
}
