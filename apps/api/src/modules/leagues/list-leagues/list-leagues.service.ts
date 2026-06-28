import { db } from "../../../db/client"
import { league } from "../../../db/schema"

// GET /v1/leagues — lists the available leagues (summary of the persisted catalog).
export async function listLeagues() {
  return db.select().from(league)
}
