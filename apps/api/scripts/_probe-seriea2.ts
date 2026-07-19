// Probe 2 (Série A): (a) estabilidade dos type_ids em N fixtures — 1 jogo só gera falso negativo;
// (b) profundidade das temporadas antigas 2024/2025 (backtest/calibração dependem disso);
// (c) nomes dos type_ids que divergem entre SA e PL; (d) rodadas fora de ordem cronológica (jogo atrasado).
// Run: bun run scripts/_probe-seriea2.ts
import { env } from "../src/env"

const BASE = "https://api.sportmonks.com/v3"
const TOKEN = env.sportmonksApiKey!
async function get(path: string) {
  const url = `${BASE}${path}${path.includes("?") ? "&" : "?"}api_token=${TOKEN}`
  const res = await fetch(url)
  return { status: res.status, body: (await res.json().catch(() => ({}))) as any }
}

const SEASONS = [
  { label: "SA 2026 (curso)", id: 26763, win: [["2026-05-01", "2026-07-18"]] },
  { label: "SA 2025", id: 25184, win: [["2025-08-01", "2025-10-31"]] },
  { label: "SA 2024", id: 23265, win: [["2024-08-01", "2024-10-31"]] },
  { label: "PL 2025/26", id: 25583, win: [["2026-03-01", "2026-05-31"]] },
] as const

// ---------- (a)+(b) união de type_ids sobre N fixtures encerradas, por temporada ----------
console.log("\n=== UNIÃO DE TYPE_IDS SOBRE 4 FIXTURES ENCERRADAS (por temporada) ===")
const unionByLabel: Record<string, { stats: Set<number>; details: Set<number>; trends: Set<number>; n: number }> = {}
for (const S of SEASONS) {
  const acc = { stats: new Set<number>(), details: new Set<number>(), trends: new Set<number>(), n: 0 }
  const [from, to] = S.win[0]!
  const r = await get(`/football/fixtures/between/${from}/${to}?filters=fixtureSeasons:${S.id}&include=state&per_page=50`)
  const done = ((r.body?.data ?? []) as any[]).filter((f) => f.state?.developer_name === "FT").slice(-4)
  for (const f of done) {
    const d = await get(`/football/fixtures/${f.id}?include=statistics;lineups.details;trends`)
    if (d.status !== 200) { console.log(`   fixture ${f.id} → HTTP ${d.status}`); continue }
    acc.n++
    for (const s of d.body?.data?.statistics ?? []) acc.stats.add(s.type_id)
    for (const l of d.body?.data?.lineups ?? []) for (const x of l.details ?? []) acc.details.add(x.type_id)
    for (const t of d.body?.data?.trends ?? []) acc.trends.add(t.type_id)
  }
  unionByLabel[S.label] = acc
  console.log(`${S.label.padEnd(18)} n=${acc.n} fixtures · statistics=${acc.stats.size} · lineups.details=${acc.details.size} · trends=${acc.trends.size}`)
}
const sa = unionByLabel["SA 2026 (curso)"]!, pl = unionByLabel["PL 2025/26"]!
for (const k of ["stats", "details", "trends"] as const) {
  const soPL = [...pl[k]].filter((t) => !sa[k].has(t)).sort((a, b) => a - b)
  const soSA = [...sa[k]].filter((t) => !pl[k].has(t)).sort((a, b) => a - b)
  console.log(`\n${k}: só na PL → ${soPL.join(", ") || "nenhum"}`)
  console.log(`${" ".repeat(k.length)}  só na SA → ${soSA.join(", ") || "nenhum"}`)
}

// ---------- (c) nomes dos type_ids relevantes ----------
console.log("\n=== NOMES DOS TYPE_IDS EM DISPUTA ===")
const IDS = [47, 79, 83, 95, 103, 111, 114, 115, 121, 124, 125, 582, 583, 584, 185, 186, 187]
for (const id of IDS) {
  const t = await get(`/core/types/${id}`)
  const d = t.body?.data
  console.log(`  ${String(id).padStart(5)}  ${d?.name ?? "?"}  (${d?.developer_name ?? "?"}) · model ${d?.model_type ?? "?"}`)
}

// ---------- (d) rodadas fora de ordem cronológica (jogo atrasado) ----------
console.log("\n=== RODADAS FORA DE ORDEM (jogo atrasado) — SA 2026 vs PL 25/26 ===")
async function roundOrder(seasonId: number, windows: [string, string][], label: string) {
  const all: { id: number; round: number; date: string; state: string }[] = []
  for (const [from, to] of windows) {
    let page = 1
    for (;;) {
      const r = await get(`/football/fixtures/between/${from}/${to}?filters=fixtureSeasons:${seasonId}&include=round;state&per_page=50&page=${page}`)
      for (const f of (r.body?.data ?? []) as any[]) {
        const rn = Number(f.round?.name)
        if (Number.isFinite(rn)) all.push({ id: f.id, round: rn, date: f.starting_at, state: f.state?.developer_name ?? "?" })
      }
      if (!r.body?.pagination?.has_more) break
      page++
    }
  }
  const played = all.filter((f) => f.state === "FT").sort((a, b) => a.date.localeCompare(b.date))
  // "atrasado" = jogo cuja rodada é menor que a rodada máxima já disputada antes dele
  let maxSoFar = 0, late = 0
  const examples: string[] = []
  for (const f of played) {
    if (f.round < maxSoFar - 1) { late++; if (examples.length < 5) examples.push(`round ${f.round} em ${f.date.slice(0, 10)} (máx já jogada: ${maxSoFar})`) }
    maxSoFar = Math.max(maxSoFar, f.round)
  }
  console.log(`${label}: ${played.length} jogos encerrados · ${late} fora de ordem (${((late / Math.max(played.length, 1)) * 100).toFixed(1)}%)`)
  for (const e of examples) console.log(`     ex.: ${e}`)
}
await roundOrder(26763, [["2026-01-01", "2026-03-31"], ["2026-04-01", "2026-06-30"], ["2026-07-01", "2026-09-30"]], "SA 2026")
await roundOrder(25583, [["2025-08-01", "2025-10-31"], ["2025-11-01", "2026-01-31"], ["2026-02-01", "2026-04-30"], ["2026-05-01", "2026-06-01"]], "PL 25/26")

// ---------- (e) janela real do calendário e densidade meio-de-semana ----------
console.log("\n=== CALENDÁRIO SA 2026: janela e jogos de meio de semana ===")
const dates: string[] = []
for (const [from, to] of [["2026-01-01", "2026-03-31"], ["2026-04-01", "2026-06-30"], ["2026-07-01", "2026-09-30"], ["2026-10-01", "2026-12-31"]] as [string, string][]) {
  let page = 1
  for (;;) {
    const r = await get(`/football/fixtures/between/${from}/${to}?filters=fixtureSeasons:26763&per_page=50&page=${page}`)
    for (const f of (r.body?.data ?? []) as any[]) dates.push(f.starting_at)
    if (!r.body?.pagination?.has_more) break
    page++
  }
}
dates.sort()
const dow = dates.map((d) => new Date(d.replace(" ", "T") + "Z").getUTCDay())
const midweek = dow.filter((d) => d >= 2 && d <= 4).length
console.log(`janela: ${dates[0]} → ${dates[dates.length - 1]} · ${dates.length} jogos`)
console.log(`meio de semana (ter/qua/qui UTC): ${midweek} (${((midweek / dates.length) * 100).toFixed(1)}%)`)
process.exit(0)
