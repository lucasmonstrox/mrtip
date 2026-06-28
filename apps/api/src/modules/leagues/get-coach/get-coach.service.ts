import { getCoachDetail } from "../shared/shared"

// GET /v1/coaches/:id — coach page: name + matches managed.
// 404 (coach_not_found) when the id doesn't exist.
export async function getCoach(id: string) {
  return getCoachDetail(id)
}
