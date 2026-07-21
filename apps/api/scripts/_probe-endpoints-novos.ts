/**
 * Sonda os 14 endpoints da SportMonks que este projeto nunca tocou, pra fechar o inventário
 * completo (plano Starter Advanced + add-on Match Facts). Cobre: rivais/clássico, notícia
 * pré/pós-jogo, team rankings (Elo), artilheiros, season/stage/round statistics, correções de
 * tabela, tabela ao vivo, expected lineups (premium), xG dedicado, elenco, transferências,
 * catálogo de markets/bookmakers e Team of the Week. Cada chamada é isolada em try/catch —
 * um 403/404 numa não derruba as outras.
 *
 * Paths confirmados via mcp__sportmonks-docs (docs.sportmonks.com/v3) em 2026-07-20, não chutados:
 *  - /football/rivals/teams/{id}
 *  - /football/news/pre-match(/seasons/{id}) e /football/news/post-match(/seasons/{id})
 *  - /football/team-rankings(/teams/{id})(/date/{yyyy-mm-dd})
 *  - /football/topscorers/seasons/{id}
 *  - /football/statistics/seasons/teams/{id}  (participant={players|teams|coaches|referees})
 *  - /football/statistics/stages/{id} e /football/statistics/rounds/{id}
 *  - /football/standings/corrections/seasons/{id}
 *  - /football/standings/live/leagues/{id}
 *  - /football/expected-lineups/teams/{id}  (Premium Expected Lineups — add-on Growth+)
 *  - /football/expected/fixtures (xG por time) e /football/expected/lineups (xG por jogador)
 *  - /football/squads/teams/{id} e /football/squads/seasons/{seasonId}/teams/{teamId}
 *  - /football/transfers/teams/{id}
 *  - /odds/markets e /odds/bookmakers (domínio é odds, não football)
 *  - /football/team-of-the-week(/rounds/{id})(/leagues/{id}/latest)
 *
 * Uso: cd apps/api && bun run scripts/_probe-endpoints-novos.ts
 */
import { env } from "../src/env"

const FOOTBALL = "https://api.sportmonks.com/v3/football"
const ODDS = "https://api.sportmonks.com/v3/odds"
const SEASON_ID = 25583 // Premier League 2025/26
const LEAGUE_ID = 8

const token = env.sportmonksApiKey
if (!token) throw new Error("SPORTMONKS_API_KEY ausente no .env")

type Envelope = {
  data?: unknown
  message?: string
  pagination?: { count: number; per_page: number; current_page: number; has_more: boolean }
  subscription?: unknown
}

type Result = { label: string; url: string; status: number; ok: boolean; summary: string }

const results: Result[] = []

/** GET com try/catch total: nunca lança, sempre devolve status + resumo do shape/erro. */
async function probe(label: string, path: string, base = FOOTBALL): Promise<Envelope | undefined> {
  const url = new URL(base + path)
  url.searchParams.set("api_token", token!)
  try {
    const res = await fetch(url.toString())
    let body: Envelope
    try {
      body = (await res.json()) as Envelope
    } catch {
      results.push({ label, url: url.toString(), status: res.status, ok: false, summary: "resposta não é JSON" })
      return undefined
    }
    if (!res.ok || body.data === undefined) {
      results.push({ label, url: url.toString(), status: res.status, ok: false, summary: body.message ?? "sem data" })
      return undefined
    }
    const d = body.data
    let summary: string
    if (Array.isArray(d)) {
      const sampleKeys = d.length > 0 && typeof d[0] === "object" && d[0] !== null ? Object.keys(d[0] as object).join(",") : "?"
      summary = `array[${d.length}]${body.pagination ? ` (pagination.count=${body.pagination.count})` : ""} keys=[${sampleKeys}]`
    } else if (typeof d === "object" && d !== null) {
      summary = `object keys=[${Object.keys(d as object).join(",")}]`
    } else {
      summary = `valor=${JSON.stringify(d)}`
    }
    results.push({ label, url: url.toString(), status: res.status, ok: true, summary })
    return body
  } catch (err) {
    results.push({ label, url: url.toString(), status: 0, ok: false, summary: `EXCEPTION: ${err instanceof Error ? err.message : String(err)}` })
    return undefined
  }
}

console.log("=".repeat(100))
console.log("FASE 0 — descobrir ids reais (times, stages, rounds) da Premier League 2025/26")
console.log("=".repeat(100))

const teamsBody = await probe("teams/seasons/{season} (descoberta)", `/teams/seasons/${SEASON_ID}`)
const teams = (teamsBody?.data as { id: number; name: string }[] | undefined) ?? []
console.log(`times encontrados: ${teams.length}`)
if (teams.length > 0) console.log(teams.map((t) => `${t.id}=${t.name}`).join(", "))

const stagesBody = await probe("stages/seasons/{season} (descoberta)", `/stages/seasons/${SEASON_ID}`)
const stages = (stagesBody?.data as { id: number; name: string }[] | undefined) ?? []
console.log(`\nstages encontrados: ${stages.length}`)
if (stages.length > 0) console.log(stages.map((s) => `${s.id}=${s.name}`).join(", "))

const roundsBody = await probe("rounds/seasons/{season} (descoberta)", `/rounds/seasons/${SEASON_ID}`)
const rounds = (roundsBody?.data as { id: number; name: string }[] | undefined) ?? []
console.log(`\nrounds encontrados: ${rounds.length}`)
if (rounds.length > 0) console.log(rounds.slice(0, 5).map((r) => `${r.id}=${r.name}`).join(", "), rounds.length > 5 ? "..." : "")

// fallback pra ids conhecidos caso a descoberta falhe (Liverpool=8, Arsenal=19, Man City=9)
const teamId = teams[0]?.id ?? 8
const teamId2 = teams[1]?.id ?? 19
const stageId = stages[0]?.id
const roundId = rounds[0]?.id

console.log(`\nusando teamId=${teamId} teamId2=${teamId2} stageId=${stageId ?? "N/A"} roundId=${roundId ?? "N/A"}`)

console.log("\n" + "=".repeat(100))
console.log("FASE 1 — os 14 endpoints alvo")
console.log("=".repeat(100))

// 1. Rivais / clássico
await probe("1. rivals/teams/{id}", `/rivals/teams/${teamId}`)

// 2. Notícia pré/pós-jogo (add-on News — provavelmente 403 sem o add-on)
await probe("2a. news/pre-match", `/news/pre-match`)
await probe("2b. news/pre-match/seasons/{season}", `/news/pre-match/seasons/${SEASON_ID}`)
await probe("2c. news/post-match", `/news/post-match`)
await probe("2d. news/post-match/seasons/{season}", `/news/post-match/seasons/${SEASON_ID}`)

// 3. Team rankings (beta, Elo-like)
await probe("3a. team-rankings (all)", `/team-rankings`)
await probe("3b. team-rankings/teams/{id}", `/team-rankings/teams/${teamId}`)

// 4. Topscorers
await probe("4. topscorers/seasons/{season}", `/topscorers/seasons/${SEASON_ID}`)

// 5. Season statistics by participant (participant = teams|players|coaches|referees)
await probe("5. statistics/seasons/teams/{id}", `/statistics/seasons/teams/${teamId}`)

// 6. Statistics por stage/round
if (stageId) await probe("6a. statistics/stages/{id}", `/statistics/stages/${stageId}`)
else results.push({ label: "6a. statistics/stages/{id}", url: "N/A", status: 0, ok: false, summary: "sem stageId descoberto" })
if (roundId) await probe("6b. statistics/rounds/{id}", `/statistics/rounds/${roundId}`)
else results.push({ label: "6b. statistics/rounds/{id}", url: "N/A", status: 0, ok: false, summary: "sem roundId descoberto" })

// 7. Standings corrections (punições)
await probe("7. standings/corrections/seasons/{season}", `/standings/corrections/seasons/${SEASON_ID}`)

// 8. Standings ao vivo
await probe("8. standings/live/leagues/{league}", `/standings/live/leagues/${LEAGUE_ID}`)

// 9. Expected Lineups (Premium — add-on Growth+, Starter deve dar 403)
await probe("9. expected-lineups/teams/{id}", `/expected-lineups/teams/${teamId}`)

// 10. Expected (xG dedicado — add-on xG Basic/Advanced)
await probe("10a. expected/fixtures (por time)", `/expected/fixtures`)
await probe("10b. expected/lineups (por jogador)", `/expected/lineups`)

// 11. Squads
await probe("11a. squads/teams/{id}", `/squads/teams/${teamId}`)
await probe("11b. squads/seasons/{season}/teams/{id}", `/squads/seasons/${SEASON_ID}/teams/${teamId}`)

// 12. Transfers
await probe("12. transfers/teams/{id}", `/transfers/teams/${teamId}`)

// 13. Markets e bookmakers (domínio odds, não football)
await probe("13a. odds/markets (catálogo)", `/markets`, ODDS)
await probe("13b. odds/bookmakers (catálogo)", `/bookmakers`, ODDS)

// 14. Team of the Week
await probe("14a. team-of-the-week (all)", `/team-of-the-week`)
if (roundId) await probe("14b. team-of-the-week/rounds/{id}", `/team-of-the-week/rounds/${roundId}`)
else results.push({ label: "14b. team-of-the-week/rounds/{id}", url: "N/A", status: 0, ok: false, summary: "sem roundId descoberto" })
await probe("14c. team-of-the-week/leagues/{league}/latest", `/team-of-the-week/leagues/${LEAGUE_ID}/latest`)

console.log("\n" + "=".repeat(100))
console.log("RELATÓRIO — uma linha por chamada")
console.log("=".repeat(100))
for (const r of results) {
  const flag = r.ok ? "OK " : "ERR"
  console.log(`[${flag}] ${r.status.toString().padStart(3)} | ${r.label.padEnd(45)} | ${r.summary}`)
}

const okCount = results.filter((r) => r.ok).length
console.log(`\n${okCount}/${results.length} chamadas OK.`)

await Bun.write("scripts/output/probe-endpoints-novos.json", JSON.stringify(results, null, 2))
console.log("→ scripts/output/probe-endpoints-novos.json")

process.exit(0)
