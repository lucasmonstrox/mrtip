/**
 * Varredura completa dos 20 times da Premier League 2024/25 (season 25583) no endpoint
 * /teams/{id}?include=statistics.details.type&filters=teamStatisticSeasons:{season}. Constrói
 * a UNIÃO de todos os type_ids que aparecem em pelo menos um time — decide o inventário
 * definitivo, já que alguns types só aparecem quando o valor é não-zero (ex.: REDCARDS).
 */
import { env } from "../src/env"

const SEASON_ID = 25583
const TEAM_IDS = [78, 11, 8, 19, 29, 71, 51, 14, 236, 3, 52, 20, 63, 13, 9, 1, 18, 15, 6, 27]

type StatDetail = { id: number; type_id: number; value: unknown; type?: { id: number; name: string; code?: string; developer_name?: string; model_type?: string; stat_group?: string | null } }
type TeamStatistic = { id: number; team_id: number; season_id: number; details?: StatDetail[] }
type Team = { id: number; name: string; statistics?: TeamStatistic[] }

const union = new Map<number, { developer_name: string; name: string; stat_group: string | null | undefined; sample: unknown; teams_present: string[] }>()
const perTeamCount = new Map<string, number>()

for (const teamId of TEAM_IDS) {
  const url = new URL(`https://api.sportmonks.com/v3/football/teams/${teamId}`)
  url.searchParams.set("api_token", env.sportmonksApiKey!)
  url.searchParams.set("include", "statistics.details.type")
  url.searchParams.set("filters", `teamStatisticSeasons:${SEASON_ID}`)
  const res = await fetch(url.toString())
  const body = (await res.json()) as { data?: Team; message?: string }
  if (!res.ok || !body.data) {
    console.log(`team ${teamId}: FALHOU status=${res.status} msg=${body.message}`)
    continue
  }
  const team = body.data
  const stat = (team.statistics ?? [])[0]
  const details = stat?.details ?? []
  perTeamCount.set(team.name, details.length)
  for (const d of details) {
    if (!union.has(d.type_id)) {
      union.set(d.type_id, {
        developer_name: d.type?.developer_name ?? "??",
        name: d.type?.name ?? "??",
        stat_group: d.type?.stat_group,
        sample: d.value,
        teams_present: [],
      })
    }
    union.get(d.type_id)!.teams_present.push(team.name)
  }
  console.log(`ok team ${teamId} ${team.name}: ${details.length} details`)
}

console.log(`\n\n=== UNIÃO FINAL: ${union.size} type_ids distintos entre ${TEAM_IDS.length} times ===\n`)
const sorted = [...union.entries()].sort((a, b) => a[0] - b[0])
for (const [typeId, info] of sorted) {
  const isObj = info.sample !== null && typeof info.sample === "object"
  const shape = isObj ? Object.keys(info.sample as object).join(",") : typeof info.sample
  const presentCount = info.teams_present.length
  const missingFlag = presentCount < TEAM_IDS.length ? ` [SÓ EM ${presentCount}/${TEAM_IDS.length} TIMES]` : ""
  console.log(`${String(typeId).padStart(6)} | ${info.developer_name.padEnd(28)} | grupo=${(info.stat_group ?? "-").padEnd(12)} | ${isObj ? "OBJ" : "scalar"} shape=[${shape}]${missingFlag}`)
}

console.log(`\n\n=== contagem de details por time ===`)
for (const [name, count] of perTeamCount) console.log(`${name.padEnd(28)} ${count}`)

console.log(`\n\n=== checagem xG na união ===`)
for (const xid of [5304, 9684, 9685, 9686, 9687]) {
  console.log(`type_id ${xid}: ${union.has(xid) ? "PRESENTE em pelo menos 1 time — " + JSON.stringify(union.get(xid)) : "AUSENTE em todos os 20 times"}`)
}

process.exit(0)
