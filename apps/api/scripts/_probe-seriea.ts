// Probe de cobertura: Série A (648) vs Premier League (8) na SportMonks — mesmo conjunto de includes,
// fixture ENCERRADA dos dois lados, diff de status HTTP e de type_ids retornados. Descobre onde a
// cobertura brasileira difere da inglesa antes de migrar o sync.
// Run: bun run scripts/_probe-seriea.ts
import { env } from "../src/env"

const BASE = "https://api.sportmonks.com/v3"
const TOKEN = env.sportmonksApiKey!

type Res = { status: number; body: any }
async function get(path: string): Promise<Res> {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}api_token=${TOKEN}`
  const res = await fetch(url)
  const body = await res.json().catch(() => ({}))
  return { status: res.status, body }
}

const SA = { id: 648, name: "Série A (BR)", season: 26763 }
const PL = { id: 8, name: "Premier League", season: 25583 }

// ---------- 1) Profundidade histórica: quais temporadas o plano expõe ----------
console.log("\n=== 1) TEMPORADAS DISPONÍVEIS POR LIGA ===")
const seasonsOf: Record<number, { id: number; name: string; finished?: boolean }[]> = {}
for (const L of [SA, PL]) {
  const r = await get(`/football/leagues/${L.id}?include=seasons`)
  const seasons = (r.body?.data?.seasons ?? []) as any[]
  seasonsOf[L.id] = seasons.map((s) => ({ id: s.id, name: s.name, finished: s.finished }))
  seasonsOf[L.id]!.sort((a, b) => a.name.localeCompare(b.name))
  console.log(`\n${L.name} [${L.id}] → ${seasons.length} season(s) (status ${r.status}):`)
  for (const s of seasonsOf[L.id]!) console.log(`   ${String(s.id).padStart(6)}  ${s.name}${s.finished ? "  (encerrada)" : "  (em curso)"}`)
}

// ---------- 2) Achar uma fixture ENCERRADA de cada liga ----------
console.log("\n=== 2) FIXTURE ENCERRADA DE REFERÊNCIA ===")
async function finishedFixture(seasonId: number, windows: [string, string][]): Promise<any | null> {
  for (const [from, to] of windows) {
    const r = await get(`/football/fixtures/between/${from}/${to}?filters=fixtureSeasons:${seasonId}&include=participants;state;round&per_page=50`)
    const fx = (r.body?.data ?? []) as any[]
    const done = fx.filter((f) => f.state?.developer_name === "FT")
    if (done.length) return done[done.length - 1]
  }
  return null
}
const saFx = await finishedFixture(SA.season, [["2026-06-01", "2026-07-18"], ["2026-04-01", "2026-05-31"], ["2026-02-01", "2026-03-31"]])
const plFx = await finishedFixture(PL.season, [["2026-04-01", "2026-05-31"], ["2026-02-01", "2026-03-31"]])
for (const [L, f] of [[SA, saFx], [PL, plFx]] as const) {
  console.log(`${L.name}: fixture ${f?.id} — ${f?.name} · ${f?.starting_at} · round ${f?.round?.name} · state ${f?.state?.developer_name}`)
}
if (!saFx || !plFx) { console.log("!! sem fixture encerrada — abortando"); process.exit(1) }

// ---------- 3) Include por include: status + volume ----------
console.log("\n=== 3) INCLUDES: SÉRIE A vs PL (mesma fixture encerrada) ===")
const INCLUDES = [
  "statistics", "lineups.details", "lineups.player", "events.type", "trends", "periods.statistics",
  "weatherReport", "sidelined.player", "referees", "comments", "metadata", "tvStations.tvStation",
  "venue", "formations", "scores", "coaches", "ballCoordinates", "xGFixture", "odds", "predictions", "pressure",
]
function volume(inc: string, data: any): string {
  const key = inc.split(".")[0]!
  const v = data?.[key] ?? data?.[key.toLowerCase()]
  if (v == null) return "—"
  if (Array.isArray(v)) {
    if (inc === "lineups.details") {
      const types = new Set<number>()
      for (const l of v) for (const d of l.details ?? []) types.add(d.type_id)
      return `${v.length} jogadores · ${types.size} type_ids`
    }
    if (inc === "statistics" || inc === "trends") {
      const types = new Set<number>(v.map((x: any) => x.type_id))
      return `${v.length} rows · ${types.size} type_ids`
    }
    if (inc === "periods.statistics") {
      const per = v.map((p: any) => `${p.description ?? p.type_id}:${(p.statistics ?? []).length}`)
      return per.join(" ")
    }
    return `${v.length} item(s)`
  }
  return "objeto"
}
const results: Record<string, { sa: string; pl: string }> = {}
for (const inc of INCLUDES) {
  const [a, b] = await Promise.all([
    get(`/football/fixtures/${saFx.id}?include=${inc}`),
    get(`/football/fixtures/${plFx.id}?include=${inc}`),
  ])
  const fmt = (r: Res) => (r.status !== 200 ? `HTTP ${r.status}` : volume(inc, r.body?.data))
  results[inc] = { sa: fmt(a), pl: fmt(b) }
  console.log(`${inc.padEnd(24)} SA: ${fmt(a).padEnd(30)} PL: ${fmt(b)}`)
}

// ---------- 4) Diff fino dos type_ids que importam ----------
console.log("\n=== 4) DIFF DE TYPE_IDS (statistics / lineups.details / trends) ===")
async function typeIds(fxId: number, inc: string): Promise<Set<number>> {
  const r = await get(`/football/fixtures/${fxId}?include=${inc}`)
  const set = new Set<number>()
  const key = inc.split(".")[0]!
  const v = r.body?.data?.[key]
  if (!Array.isArray(v)) return set
  if (inc === "lineups.details") { for (const l of v) for (const d of l.details ?? []) set.add(d.type_id) }
  else for (const x of v) set.add(x.type_id)
  return set
}
for (const inc of ["statistics", "lineups.details", "trends"]) {
  const [a, b] = await Promise.all([typeIds(saFx.id, inc), typeIds(plFx.id, inc)])
  const soPL = [...b].filter((t) => !a.has(t)).sort((x, y) => x - y)
  const soSA = [...a].filter((t) => !b.has(t)).sort((x, y) => x - y)
  console.log(`\n${inc}: SA=${a.size} types · PL=${b.size} types`)
  console.log(`   só na PL (faltam na SA): ${soPL.length ? soPL.join(", ") : "nenhum"}`)
  console.log(`   só na SA:                ${soSA.length ? soSA.join(", ") : "nenhum"}`)
}

// ---------- 5) Standings + estrutura de temporada (stages/rounds) ----------
console.log("\n=== 5) STANDINGS E ESTRUTURA DA TEMPORADA (Série A 26763) ===")
const st = await get(`/football/standings/seasons/${SA.season}?include=participant;details;rule.type`)
const rows = (st.body?.data ?? []) as any[]
console.log(`standings: HTTP ${st.status} · ${rows.length} linhas`)
if (rows.length) {
  const r0 = rows[0]
  console.log(`  topo: ${r0.participant?.name} · pos ${r0.position} · pts ${r0.points} · ${(r0.details ?? []).length} details · rule ${r0.rule?.type?.developer_name ?? "—"}`)
  const rules = new Set(rows.map((r) => r.rule?.type?.developer_name).filter(Boolean))
  console.log(`  zonas/rules distintas: ${[...rules].join(", ") || "nenhuma"}`)
  console.log(`  detail type_ids: ${[...new Set((r0.details ?? []).map((d: any) => d.type_id))].sort((a: any, b: any) => a - b).join(", ")}`)
}
const sea = await get(`/football/seasons/${SA.season}?include=stages;rounds`)
const sd = sea.body?.data
console.log(`season ${SA.season}: HTTP ${sea.status} · nome "${sd?.name}" · finished=${sd?.finished} · pending=${sd?.pending} · is_current=${sd?.is_current}`)
console.log(`  stages: ${(sd?.stages ?? []).map((s: any) => `${s.name}[${s.id}]`).join(" · ") || "—"}`)
console.log(`  rounds: ${(sd?.rounds ?? []).length} (ex.: ${(sd?.rounds ?? []).slice(0, 3).map((r: any) => r.name).join(", ")})`)

// ---------- 6) Volume da temporada: quantos jogos já ocorreram ----------
console.log("\n=== 6) VOLUME DA TEMPORADA EM CURSO ===")
let total = 0, done = 0, byState: Record<string, number> = {}
for (const [from, to] of [["2026-01-01", "2026-03-31"], ["2026-04-01", "2026-06-30"], ["2026-07-01", "2026-09-30"], ["2026-10-01", "2026-12-31"]] as [string, string][]) {
  let page = 1
  for (;;) {
    const r = await get(`/football/fixtures/between/${from}/${to}?filters=fixtureSeasons:${SA.season}&include=state&per_page=50&page=${page}`)
    const fx = (r.body?.data ?? []) as any[]
    total += fx.length
    for (const f of fx) { const s = f.state?.developer_name ?? "?"; byState[s] = (byState[s] ?? 0) + 1; if (s === "FT") done++ }
    if (!r.body?.pagination?.has_more) break
    page++
  }
}
console.log(`fixtures na season 26763: ${total} · encerradas(FT): ${done}`)
console.log(`por estado: ${Object.entries(byState).map(([k, v]) => `${k}=${v}`).join(" · ")}`)

// ---------- 7) Fuso, horário e nomes ----------
console.log("\n=== 7) AMOSTRA DE FIXTURES (horário/round/nome) ===")
const sample = await get(`/football/fixtures/between/2026-07-01/2026-07-31?filters=fixtureSeasons:${SA.season}&include=participants;round;state;venue&per_page=8`)
for (const f of ((sample.body?.data ?? []) as any[]).slice(0, 8)) {
  console.log(`  ${f.starting_at}  ${f.name}  · round ${f.round?.name} · ${f.state?.developer_name} · ${f.venue?.name ?? "?"} (${f.venue?.city_name ?? "?"})`)
}
process.exit(0)
