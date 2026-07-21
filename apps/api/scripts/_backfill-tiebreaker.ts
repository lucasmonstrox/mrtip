/**
 * Backfill de `season.sportmonks_tie_breaker_rule_id` (LIG-017 P2) nas temporadas já ingeridas: para cada
 * `sportmonksSeasonId`, lê `tie_breaker_rule_id` em GET /v3/football/seasons/{id} e faz update só dessa
 * coluna. Não re-roda os syncs inteiros — eles são caros e mexem em partida/tabela/elenco.
 *
 * Idempotente: reescrever com o mesmo valor é inofensivo, então rodar duas vezes não estraga nada.
 */
import { eq, sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { season } from "../src/db/schema"
import { env } from "../src/env"

type SmSeason = { id: number; name: string; tie_breaker_rule_id: number | null }

async function get<T>(url: string): Promise<T | undefined> {
  const u = new URL(url)
  u.searchParams.set("api_token", env.sportmonksApiKey!)
  const res = await fetch(u.toString())
  const body = (await res.json()) as { data?: T }
  return body.data
}

const rows = (
  await db.execute(
    sql.raw(`select id, league_code, name, sportmonks_season_id from season order by league_code, start_year`),
  )
).rows as { id: string; league_code: string; name: string; sportmonks_season_id: number }[]

let updated = 0
let missing = 0

for (const s of rows) {
  const data = await get<SmSeason>(`https://api.sportmonks.com/v3/football/seasons/${s.sportmonks_season_id}`)
  const ruleId = data?.tie_breaker_rule_id ?? null
  if (ruleId == null) {
    missing++
    console.log(`  ${s.league_code.padEnd(5)} ${String(s.name).padEnd(10)} → sem regra declarada pela fonte`)
    continue
  }
  await db.update(season).set({ sportmonksTieBreakerRuleId: ruleId }).where(eq(season.id, s.id))
  updated++
  console.log(`  ${s.league_code.padEnd(5)} ${String(s.name).padEnd(10)} → ${ruleId}`)
}

console.log(`\n${updated} seasons atualizadas, ${missing} sem regra`)
process.exit(0)
