/**
 * Sonda o critério de desempate (tiebreaker) que a SportMonks declara por temporada: o campo
 * `tie_breaker_rule_id` vive na entidade season e resolve em /core/types (model_type
 * "tie_breaker_rule"). Não há include pra ele — precisa de uma segunda chamada no core.
 *
 * Achado: PL 25/26 = 1526 (saldo → gols pró); Brasileirão = 577 (pontos → vitórias → saldo →
 * gols pró). Confirma que ordenar standings com a regra da PL mis-ordena o Brasileirão.
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { env } from "../src/env"

type SmType = { id: number; name: string; code: string; model_type: string }
type SmSeason = { id: number; league_id: number; name: string; tie_breaker_rule_id: number | null }

async function get<T>(url: string): Promise<T | undefined> {
  const u = new URL(url)
  u.searchParams.set("api_token", env.sportmonksApiKey!)
  const res = await fetch(u.toString())
  const body = (await res.json()) as { data?: T }
  return body.data
}

// catálogo completo dos tipos de desempate (paginação até o fim — são poucos, mas espalhados)
const types: SmType[] = []
for (let page = 1; page <= 200; page++) {
  const u = new URL("https://api.sportmonks.com/v3/core/types")
  u.searchParams.set("api_token", env.sportmonksApiKey!)
  u.searchParams.set("page", String(page))
  const body = (await (await fetch(u.toString())).json()) as { data?: SmType[]; pagination?: { has_more: boolean } }
  if (!body.data) break
  types.push(...body.data)
  if (!body.pagination?.has_more) break
}
const tb = new Map(types.filter((t) => t.model_type === "tie_breaker_rule").map((t) => [t.id, t]))
console.log(`tipos de desempate disponíveis (${tb.size}):`)
for (const t of [...tb.values()].sort((a, b) => a.id - b.id)) console.log(`  ${t.id} | ${t.name}`)

// regra declarada em cada season ingerida
const seasons = (
  await db.execute(sql.raw(`select league_code, sportmonks_season_id from season order by league_code`))
).rows as { league_code: string; sportmonks_season_id: number }[]

console.log("\nregra por temporada ingerida:")
for (const s of seasons) {
  const data = await get<SmSeason>(`https://api.sportmonks.com/v3/football/seasons/${s.sportmonks_season_id}`)
  const rule = data?.tie_breaker_rule_id ? tb.get(data.tie_breaker_rule_id) : undefined
  console.log(
    `  ${s.league_code.padEnd(5)} ${data?.name ?? "?"} (league ${data?.league_id}) → ${data?.tie_breaker_rule_id ?? "null"} ${rule?.name ?? ""}`,
  )
}

process.exit(0)
