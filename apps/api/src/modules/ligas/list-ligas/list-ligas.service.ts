import { db } from "../../../db/client"
import { liga } from "../../../db/schema"

// GET /v1/ligas — lista as ligas disponíveis (resumo do catálogo persistido).
export async function listLigas() {
  return db.select().from(liga)
}
