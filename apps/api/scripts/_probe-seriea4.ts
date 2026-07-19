// Probe 4 (Série A): profundidade por temporada com janelas <=100 dias (o /fixtures/between tem teto).
// Mede em quantas fixtures ENCERRADAS de cada season vêm statistics / lineups.details / trends —
// é o que decide se dá pra backtestar o motor em Série A ou só operar a temporada viva.
// Run: bun run scripts/_probe-seriea4.ts
import { env } from "../src/env"

const BASE = "https://api.sportmonks.com/v3"
const TOKEN = env.sportmonksApiKey!
async function get(path: string) {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}api_token=${TOKEN}`
  const res = await fetch(url)
  return { status: res.status, body: (await res.json().catch(() => ({}))) as any }
}
async function allFixtures(seasonId: number, windows: [string, string][]) {
  const out: any[] = []
  for (const [from, to] of windows) {
    let page = 1
    for (;;) {
      const r = await get(`/football/fixtures/between/${from}/${to}?filters=fixtureSeasons:${seasonId}&include=state;round&per_page=50&page=${page}`)
      out.push(...((r.body?.data ?? []) as any[]))
      if (!r.body?.pagination?.has_more) break
      page++
    }
  }
  return out
}
const Q = (y: number): [string, string][] => [[`${y}-01-01`, `${y}-03-31`], [`${y}-04-01`, `${y}-06-30`], [`${y}-07-01`, `${y}-09-30`], [`${y}-10-01`, `${y}-12-31`]]

for (const S of [
  { label: "SA 2024", id: 23265, win: Q(2024) },
  { label: "SA 2025", id: 25184, win: Q(2025) },
  { label: "SA 2026", id: 26763, win: Q(2026) },
  { label: "PL 25/26", id: 25583, win: [["2025-08-01", "2025-10-31"], ["2025-11-01", "2026-01-31"], ["2026-02-01", "2026-04-30"], ["2026-05-01", "2026-06-01"]] as [string, string][] },
]) {
  const fx = (await allFixtures(S.id, S.win)).filter((f) => f.state?.developer_name === "FT")
  const step = Math.max(1, Math.floor(fx.length / 12))
  const sample = fx.filter((_, i) => i % step === 0).slice(0, 12)
  const stats = new Set<number>(), details = new Set<number>(), trends = new Set<number>()
  let withStats = 0, withLineup = 0, withDetails = 0, withTrends = 0, withWeather = 0, withRef = 0
  for (const f of sample) {
    const d = await get(`/football/fixtures/${f.id}?include=statistics;lineups.details;trends;weatherReport;referees`)
    const dd = d.body?.data
    if ((dd?.statistics ?? []).length) { withStats++; for (const s of dd.statistics) stats.add(s.type_id) }
    if ((dd?.lineups ?? []).length) withLineup++
    const det = (dd?.lineups ?? []).flatMap((l: any) => l.details ?? [])
    if (det.length) { withDetails++; for (const x of det) details.add(x.type_id) }
    if ((dd?.trends ?? []).length) { withTrends++; for (const t of dd.trends) trends.add(t.type_id) }
    if (dd?.weatherreport ?? dd?.weatherReport) withWeather++
    if ((dd?.referees ?? []).length) withRef++
  }
  console.log(`\n${S.label}: ${fx.length} jogos FT · amostra ${sample.length}`)
  console.log(`   statistics ${withStats}/${sample.length} (${stats.size} types) · lineup ${withLineup}/${sample.length} · details ${withDetails}/${sample.length} (${details.size} types)`)
  console.log(`   trends ${withTrends}/${sample.length} (${trends.size} types) · weather ${withWeather}/${sample.length} · referees ${withRef}/${sample.length}`)
}

// fuso: fixture individual traz timezone?
console.log("\n=== FUSO ===")
const one = await get(`/football/fixtures/19621899`)
const f = one.body?.data
console.log(`  ${f?.name}: starting_at=${f?.starting_at} · timestamp=${f?.timestamp} · tz_id=${f?.timezone_id ?? "?"}`)
if (f?.timestamp) console.log(`  timestamp→UTC ${new Date(f.timestamp * 1000).toISOString()} · →BRT ${new Date(f.timestamp * 1000).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}`)
console.log(`  campos disponíveis: ${Object.keys(f ?? {}).join(", ")}`)
process.exit(0)
