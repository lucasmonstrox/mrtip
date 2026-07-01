import { sm } from "../src/lib/sportmonks"
const FX = 19427245
const fx = await sm<any>(`/fixtures/${FX}?include=participants;trends.type;scores`)
const parts: any[] = fx.participants ?? []
const home = parts.find((p) => p.meta?.location === "home")
const away = parts.find((p) => p.meta?.location === "away")
const trends: any[] = fx.trends ?? []

// Pesos do momentum ofensivo (proxy do Pressure Index; a fórmula oficial da SM é fechada).
// Valores são ACUMULADOS → trabalhamos com o delta por minuto (a "taxa" de ameaça).
const W: Record<number, number> = { 86: 5, 580: 6, 44: 3, 42: 2, 43: 1, 49: 2, 34: 1 }

// Reconstrói série acumulada por (time, tipo) e deriva o delta minuto a minuto.
type Key = string
const series = new Map<Key, Map<number, number>>() // `${team}:${type}` -> minute -> cumValue
for (const t of trends) {
  if (!(t.type_id in W)) continue
  const k = `${t.participant_id}:${t.type_id}`
  if (!series.has(k)) series.set(k, new Map())
  series.get(k)!.set(t.minute, t.value)
}
const minutes = [...new Set(trends.map((t) => t.minute))].sort((a, b) => a - b)
const maxMin = Math.max(...minutes)

function scoreAt(teamId: number, minute: number): number {
  let s = 0
  for (const [typeId, w] of Object.entries(W)) {
    const m = series.get(`${teamId}:${typeId}`)
    if (!m) continue
    // delta = acumulado(min) - acumulado(min-1), carregando o último valor visto
    let cur = 0, prev = 0
    for (let mm = 0; mm <= minute; mm++) if (m.has(mm)) { prev = cur; cur = m.get(mm)! }
    const last = (() => { let v = 0; for (let mm = 0; mm <= minute; mm++) if (m.has(mm)) v = m.get(mm)!; return v })()
    const before = (() => { let v = 0; for (let mm = 0; mm < minute; mm++) if (m.has(mm)) v = m.get(mm)!; return v })()
    s += Math.max(0, last - before) * Number(w)
  }
  return s
}

// EMA pra suavizar a gangorra (raw delta é serrilhado). alpha ~ janela de 6 min.
const alpha = 0.3
let emaH = 0, emaA = 0
console.log(`${home.name} (home) ◄———————+———————► ${away.name} (away)\n`)
console.log("min | momentum")
for (let m = 1; m <= maxMin; m++) {
  emaH = alpha * scoreAt(home.id, m) + (1 - alpha) * emaH
  emaA = alpha * scoreAt(away.id, m) + (1 - alpha) * emaA
  const diff = emaH - emaA
  const mag = Math.min(Math.round(Math.abs(diff) * 1.2), 22)
  const bar = diff >= 0
    ? " ".repeat(22 - mag) + "█".repeat(mag) + "|"
    : "|" + "█".repeat(mag)
  if (m % 2 === 0 || Math.abs(diff) > 4) // imprime a cada 2 min ou em picos
    console.log(`${String(m).padStart(3)} | ${bar}`)
}
const fin = (fx.scores ?? []).filter((s:any)=>s.description==="CURRENT")
console.log("\nplacar final:", JSON.stringify(fin.map((s:any)=>({t:parts.find(p=>p.id===s.participant_id)?.name,g:s.score?.goals}))))
