/**
 * Sonda /teams/{id}?include=statistics.details.type&filters=teamStatisticSeasons:{season} pra
 * inventariar TODAS as estatísticas de time-por-temporada que o token entrega. Decodifica os
 * type_ids via /core/types e reporta shape de valores aninhados (goal-line, pass-stats, etc.) e
 * se os types de xG (5304/9684/9685/9686/9687) aparecem — unlock grande se sim, porque dispensa
 * o include xGFixture que dá 403 no plano.
 */
import { env } from "../src/env"

const SEASON_ID = 25583 // Premier League 2024/25
const LEAGUE_ID = 8

type SmType = {
  id: number
  name: string
  code?: string
  developer_name?: string
  model_type?: string
  stat_group?: string | null
}

type StatDetail = {
  id: number
  type_id: number
  value: unknown
}

type TeamStatistic = {
  id: number
  team_id: number
  season_id: number
  details?: StatDetail[]
}

type Team = {
  id: number
  name: string
  statistics?: TeamStatistic[]
}

async function pages<T>(base: string): Promise<T[]> {
  const out: T[] = []
  for (let page = 1; page <= 100; page++) {
    const u = new URL(base)
    u.searchParams.set("api_token", env.sportmonksApiKey!)
    u.searchParams.set("page", String(page))
    const res = await fetch(u.toString())
    const body = (await res.json()) as { data?: T[]; pagination?: { has_more: boolean } }
    if (!res.ok || !body.data) break
    out.push(...body.data)
    if (!body.pagination?.has_more) break
  }
  return out
}

// 1) catálogo de types (pra decodificar os type_id que voltarem nos details)
console.log("Buscando /core/types ...")
const types = await pages<SmType>("https://api.sportmonks.com/v3/core/types")
console.log(`core/types: ${types.length} entradas`)
const typeById = new Map(types.map((t) => [t.id, t]))

import { writeFileSync, mkdirSync } from "node:fs"
mkdirSync("scripts/output", { recursive: true })
writeFileSync("scripts/output/core-types.json", JSON.stringify(types, null, 2))
console.log("core-types.json salvo em scripts/output/\n")

// 2) descobrir alguns team ids reais da PL via /teams/seasons/{season_id}
console.log(`Buscando /teams/seasons/${SEASON_ID} ...`)
const seasonTeamsUrl = new URL(`https://api.sportmonks.com/v3/football/teams/seasons/${SEASON_ID}`)
seasonTeamsUrl.searchParams.set("api_token", env.sportmonksApiKey!)
const seasonTeamsRes = await fetch(seasonTeamsUrl.toString())
const seasonTeamsBody = (await seasonTeamsRes.json()) as { data?: { id: number; name: string }[]; message?: string }
console.log(`status /teams/seasons/${SEASON_ID}: ${seasonTeamsRes.status}`)
let teamIds: number[] = []
if (seasonTeamsBody.data) {
  teamIds = seasonTeamsBody.data.map((t) => t.id)
  console.log(`times encontrados: ${teamIds.length}`)
  console.log(seasonTeamsBody.data.map((t) => `${t.id}=${t.name}`).join(", "))
} else {
  console.log(`sem data. message: ${seasonTeamsBody.message}`)
  // fallback: ids conhecidos (Liverpool, Arsenal, etc.) — tenta mesmo assim
  teamIds = [8, 9, 14, 19]
}
console.log("")

// 3) sondar o endpoint alvo pro primeiro time da lista (e mais um de fallback, pra comparar)
const candidates = teamIds.slice(0, 2)

for (const teamId of candidates) {
  console.log(`\n${"=".repeat(80)}`)
  console.log(`GET /teams/${teamId}?include=statistics.details.type&filters=teamStatisticSeasons:${SEASON_ID}`)
  console.log("=".repeat(80))

  const url = new URL(`https://api.sportmonks.com/v3/football/teams/${teamId}`)
  url.searchParams.set("api_token", env.sportmonksApiKey!)
  url.searchParams.set("include", "statistics.details.type")
  url.searchParams.set("filters", `teamStatisticSeasons:${SEASON_ID}`)

  const res = await fetch(url.toString())
  const status = res.status
  const body = (await res.json()) as { data?: Team; message?: string; subscription?: unknown; rate_limit?: unknown }

  console.log(`HTTP status: ${status}`)
  console.log(`rate_limit: ${JSON.stringify(body.rate_limit)}`)
  console.log(`subscription: ${JSON.stringify(body.subscription)}`)
  if (!res.ok || !body.data) {
    console.log(`message: ${body.message}`)
    console.log(`body: ${JSON.stringify(body).slice(0, 2000)}`)
    continue
  }

  const team = body.data
  console.log(`team: ${team.id} ${team.name}`)
  const stats = team.statistics ?? []
  console.log(`statistics[] length: ${stats.length}`)

  for (const stat of stats) {
    console.log(`\n-- team_statistic id=${stat.id} season_id=${stat.season_id} --`)
    const details = stat.details ?? []
    console.log(`details[] length: ${details.length}`)

    // agrupa por type_id (pode repetir, ex.: goals por período)
    const byType = new Map<number, unknown[]>()
    for (const d of details) {
      const arr = byType.get(d.type_id) ?? []
      arr.push(d.value)
      byType.set(d.type_id, arr)
    }

    const sortedTypeIds = [...byType.keys()].sort((a, b) => a - b)
    console.log(`type_ids distintos: ${sortedTypeIds.length}`)

    for (const typeId of sortedTypeIds) {
      const t = typeById.get(typeId)
      const values = byType.get(typeId)!
      const sample = values[0]
      const isObject = sample !== null && typeof sample === "object"
      const shape = isObject ? Object.keys(sample as object).join(",") : typeof sample
      console.log(
        `  ${String(typeId).padStart(6)} | ${(t?.developer_name ?? "??").padEnd(28)} | ${(t?.name ?? "??").padEnd(30)} | n=${values.length} | ${isObject ? "OBJ" : "scalar"} | shape=[${shape}] | sample=${JSON.stringify(sample).slice(0, 300)}`,
      )
    }

    // checagem específica de xG
    const XG_IDS = [5304, 9684, 9685, 9686, 9687]
    console.log("\n  -- checagem xG --")
    for (const xid of XG_IDS) {
      const present = byType.has(xid)
      const t = typeById.get(xid)
      console.log(`  type_id ${xid} (${t?.developer_name ?? "desconhecido no core/types"}): ${present ? "PRESENTE" : "ausente"}`)
      if (present) console.log(`    valor: ${JSON.stringify(byType.get(xid))}`)
    }
  }
}

console.log("\n\nFIM.")
process.exit(0)
