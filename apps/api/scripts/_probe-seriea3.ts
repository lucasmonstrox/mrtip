// Probe 3 (Série A): (a) a queda de profundidade da season 2024 é real ou amostra pequena?
// (b) distribuição mensal do calendário 2026 (parada da Copa do Mundo?); (c) meio de semana SA vs PL;
// (d) standings das temporadas antigas existem? (e) horário: starting_at é UTC?
// Run: bun run scripts/_probe-seriea3.ts
import { env } from "../src/env"

const BASE = "https://api.sportmonks.com/v3"
const TOKEN = env.sportmonksApiKey!
async function get(path: string) {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}api_token=${TOKEN}`
  const res = await fetch(url)
  return { status: res.status, body: (await res.json().catch(() => ({}))) as any }
}
async function allFixtures(seasonId: number, windows: [string, string][], include = "state") {
  const out: any[] = []
  for (const [from, to] of windows) {
    let page = 1
    for (;;) {
      const r = await get(`/football/fixtures/between/${from}/${to}?filters=fixtureSeasons:${seasonId}&include=${include}&per_page=50&page=${page}`)
      out.push(...((r.body?.data ?? []) as any[]))
      if (!r.body?.pagination?.has_more) break
      page++
    }
  }
  return out
}

// ---------- (a) profundidade da 2024 em amostra MAIOR e espalhada ----------
console.log("\n=== (a) PROFUNDIDADE POR TEMPORADA — 10 fixtures espalhadas ===")
for (const S of [
  { label: "SA 2024", id: 23265, win: [["2024-04-01", "2024-12-31"]] as [string, string][] },
  { label: "SA 2025", id: 25184, win: [["2025-03-01", "2025-12-31"]] as [string, string][] },
  { label: "SA 2026", id: 26763, win: [["2026-01-01", "2026-07-18"]] as [string, string][] },
]) {
  const fx = (await allFixtures(S.id, S.win)).filter((f) => f.state?.developer_name === "FT")
  const step = Math.max(1, Math.floor(fx.length / 10))
  const sample = fx.filter((_, i) => i % step === 0).slice(0, 10)
  const stats = new Set<number>(), details = new Set<number>(), trends = new Set<number>()
  let withStats = 0, withDetails = 0, withTrends = 0, withLineup = 0
  for (const f of sample) {
    const d = await get(`/football/fixtures/${f.id}?include=statistics;lineups.details;trends`)
    const dd = d.body?.data
    if ((dd?.statistics ?? []).length) { withStats++; for (const s of dd.statistics) stats.add(s.type_id) }
    if ((dd?.lineups ?? []).length) { withLineup++ }
    const det = (dd?.lineups ?? []).flatMap((l: any) => l.details ?? [])
    if (det.length) { withDetails++; for (const x of det) details.add(x.type_id) }
    if ((dd?.trends ?? []).length) { withTrends++; for (const t of dd.trends) trends.add(t.type_id) }
  }
  console.log(`${S.label}: ${fx.length} jogos FT · amostra ${sample.length}`)
  console.log(`   com statistics: ${withStats}/${sample.length} (${stats.size} types) · com lineup: ${withLineup}/${sample.length} · com details: ${withDetails}/${sample.length} (${details.size} types) · com trends: ${withTrends}/${sample.length} (${trends.size} types)`)
}

// ---------- (b) distribuição mensal 2026 + (c) meio de semana SA vs PL ----------
console.log("\n=== (b) CALENDÁRIO MENSAL SA 2026 vs (c) MEIO DE SEMANA ===")
async function calendario(seasonId: number, windows: [string, string][], label: string) {
  const fx = await allFixtures(seasonId, windows)
  const byMonth: Record<string, number> = {}
  let midweek = 0
  for (const f of fx) {
    const m = f.starting_at.slice(0, 7)
    byMonth[m] = (byMonth[m] ?? 0) + 1
    const d = new Date(f.starting_at.replace(" ", "T") + "Z").getUTCDay()
    if (d >= 2 && d <= 4) midweek++
  }
  console.log(`\n${label}: ${fx.length} jogos · meio de semana ${midweek} (${((midweek / fx.length) * 100).toFixed(1)}%)`)
  console.log(`   ${Object.entries(byMonth).sort().map(([m, n]) => `${m}:${n}`).join(" ")}`)
}
await calendario(26763, [["2026-01-01", "2026-03-31"], ["2026-04-01", "2026-06-30"], ["2026-07-01", "2026-09-30"], ["2026-10-01", "2026-12-31"]], "SA 2026")
await calendario(25184, [["2025-01-01", "2025-03-31"], ["2025-04-01", "2025-06-30"], ["2025-07-01", "2025-09-30"], ["2025-10-01", "2025-12-31"]], "SA 2025")
await calendario(25583, [["2025-08-01", "2025-10-31"], ["2025-11-01", "2026-01-31"], ["2026-02-01", "2026-04-30"], ["2026-05-01", "2026-06-01"]], "PL 25/26")

// ---------- (d) standings das temporadas antigas ----------
console.log("\n=== (d) STANDINGS DAS TEMPORADAS ANTIGAS ===")
for (const [label, id] of [["SA 2024", 23265], ["SA 2025", 25184], ["SA 2026", 26763]] as [string, number][]) {
  const r = await get(`/football/standings/seasons/${id}?include=participant;details;rule.type`)
  const rows = (r.body?.data ?? []) as any[]
  const champ = rows.find((x) => x.position === 1)
  console.log(`${label}: HTTP ${r.status} · ${rows.length} linhas · 1º = ${champ?.participant?.name ?? "?"} (${champ?.points ?? "?"} pts, ${(champ?.details ?? []).length} details)`)
}

// ---------- (e) starting_at é UTC? confere com timezone do fixture ----------
console.log("\n=== (e) FUSO: starting_at vs timezone ===")
const tz = await get(`/football/fixtures/between/2026-07-16/2026-07-18?filters=fixtureSeasons:26763&include=participants&per_page=3`)
for (const f of ((tz.body?.data ?? []) as any[]).slice(0, 3)) {
  console.log(`  ${f.name}: starting_at=${f.starting_at} · timestamp=${f.timestamp} · tz=${f.timezone_id ?? "?"} · result_info=${f.result_info ?? "—"}`)
  if (f.timestamp) console.log(`     → UTC do timestamp: ${new Date(f.timestamp * 1000).toISOString()}  (bate com starting_at? ${new Date(f.timestamp * 1000).toISOString().slice(0, 16) === f.starting_at.replace(" ", "T").slice(0, 16)})`)
}
process.exit(0)
