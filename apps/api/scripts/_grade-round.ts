// Avalia o lote de uma rodada: puxa as 2 runs mais recentes de cada jogo (match_prognosis), grada a
// best_bet contra o placar real nos 5 mercados (1x2/over_under/btts/handicap/team_total) e resume acerto
// + estabilidade (as 2 runs concordam no mercado/seleção?). Run: bun run scripts/_grade-round.ts <round=37>
import { readFileSync } from "node:fs"

import { and, asc, desc, eq } from "drizzle-orm"

import { db } from "../src/db/client"
import { match, matchPrognosis, season, team } from "../src/db/schema"

const ROUND = Number(process.argv[2] ?? 37)
const SEASON_SM = Number(process.argv[3] ?? 25583)

type Bet = {
  market: string | null
  selection: string | null
  team: string | null
  line: number | null
  confidence: string | null
}

// Grada uma aposta contra o placar final. Devolve W/L/push/? (? = mercado não reconhecido / sem aposta).
function grade(b: Bet, fh: number, fa: number): "W" | "L" | "push" | "?" {
  const total = fh + fa
  const homeWin = fh > fa, awayWin = fh < fa, draw = fh === fa
  const btts = fh > 0 && fa > 0
  switch (b.market) {
    case "1x2":
      if (b.selection === "home") return homeWin ? "W" : "L"
      if (b.selection === "away") return awayWin ? "W" : "L"
      if (b.selection === "draw") return draw ? "W" : "L"
      return "?"
    case "over_under": {
      const line = b.line ?? 2.5
      if (b.selection === "over") return total > line ? "W" : total < line ? "L" : "push"
      if (b.selection === "under") return total < line ? "W" : total > line ? "L" : "push"
      return "?"
    }
    case "btts":
      if (b.selection === "yes") return btts ? "W" : "L"
      if (b.selection === "no") return !btts ? "W" : "L"
      return "?"
    case "handicap": {
      // selection (home/away) = qual time leva o handicap; line = o hcap (-1, +1) aplicado a ele.
      const tg = b.selection === "home" ? fh : fa
      const og = b.selection === "home" ? fa : fh
      const adj = tg + (b.line ?? 0)
      return adj > og ? "W" : adj < og ? "L" : "push"
    }
    case "team_total": {
      // team (home/away) = de quem é o total; line = gols dele.
      const tg = b.team === "home" ? fh : fa
      const line = b.line ?? 1.5
      if (b.selection === "over") return tg > line ? "W" : tg < line ? "L" : "push"
      if (b.selection === "under") return tg < line ? "W" : tg > line ? "L" : "push"
      return "?"
    }
    default:
      return "?"
  }
}

// Rótulo legível da aposta (espelha o bestBetLabel do run-deepseek).
function label(b: Bet, hn: string, an: string): string {
  const side = b.selection === "home" ? hn : b.selection === "away" ? an : null
  const hcap = (n: number | null) => (n == null ? "" : n > 0 ? `+${n}` : `${n}`)
  if (b.market === "1x2") return b.selection === "draw" ? "Empate" : `${side}`
  if (b.market === "over_under") return `${b.selection} ${b.line ?? ""}`.trim()
  if (b.market === "btts") return `BTTS ${b.selection}`
  if (b.market === "handicap") return `${side} ${hcap(b.line)}`.trim()
  if (b.market === "team_total") return `${b.team === "home" ? hn : an} ${b.selection} ${b.line ?? ""}`.trim()
  return b.market ?? "?"
}

const [s] = await db.select().from(season).where(eq(season.sportmonksSeasonId, SEASON_SM))
if (!s) throw new Error(`season ${SEASON_SM} não encontrada`)
const matches = await db
  .select()
  .from(match)
  .where(and(eq(match.round, ROUND), eq(match.seasonId, s.id)))
  .orderBy(asc(match.date))
const names = new Map<string, string>()
for (const t of await db.select().from(team)) names.set(t.id, t.name)

let w = 0, l = 0, push = 0, unk = 0
let bothWin = 0, bothLose = 0, split = 0, atLeastOne = 0
let stableSel = 0 // as 2 runs concordam em mercado+seleção+linha
// Acerto SEGREGADO pelo VEREDITO DE INTENÇÃO (🔥 os dois vão pra cima · ⚠️ assimétrico/trava) — é o teste do filtro.
let fireW = 0, fireL = 0, stallW = 0, stallL = 0, fireGames = 0, stallGames = 0

// Lê o veredito de intenção do prompt salvo do jogo (🔥=true, ⚠️=false, null=desconhecido).
function intentOf(matchId: string): boolean | null {
  try {
    const t = readFileSync(new URL(`./output/prognosis-${matchId}.md`, import.meta.url), "utf8")
    if (t.includes("VEREDITO DE INTENÇÃO: OS DOIS PRECISAM")) return true
    if (t.includes("VEREDITO DE INTENÇÃO: ASSIMÉTRICA")) return false
  } catch { /* sem prompt salvo */ }
  return null
}
const mkt: Record<string, number> = {}
const lines: string[] = []

for (const m of matches) {
  if (m.ftHome == null || m.ftAway == null) continue
  const hn = names.get(m.homeTeamId) ?? "?"
  const an = names.get(m.awayTeamId) ?? "?"
  // 2 runs mais recentes, ordenadas asc (run1 = pass1, run2 = pass2).
  const runs = (
    await db
      .select()
      .from(matchPrognosis)
      .where(eq(matchPrognosis.matchId, m.id))
      .orderBy(desc(matchPrognosis.runAt))
      .limit(2)
  ).reverse()
  if (runs.length === 0) {
    lines.push(`${hn} ${m.ftHome}-${m.ftAway} ${an}  →  (sem prognóstico)`)
    continue
  }
  const fire = intentOf(m.id) // 🔥 os dois vão pra cima · ⚠️ assimétrico/trava
  if (fire === true) fireGames++
  else if (fire === false) stallGames++
  const cells: string[] = []
  const results: ("W" | "L" | "push" | "?")[] = []
  for (const r of runs) {
    const b: Bet = {
      market: r.bestBetMarket, selection: r.bestBetSelection, team: r.bestBetTeam,
      line: r.bestBetLine, confidence: r.bestBetConfidence,
    }
    const g = grade(b, m.ftHome, m.ftAway)
    results.push(g)
    if (g === "W") w++
    else if (g === "L") l++
    else if (g === "push") push++
    else unk++
    if (fire === true) { if (g === "W") fireW++; else if (g === "L") fireL++ }
    else if (fire === false) { if (g === "W") stallW++; else if (g === "L") stallL++ }
    if (b.market) mkt[b.market] = (mkt[b.market] ?? 0) + 1
    const mark = g === "W" ? "✅" : g === "L" ? "❌" : g === "push" ? "➖" : "❓"
    cells.push(`${label(b, hn, an)} ${mark}`)
  }
  const wins = results.filter((x) => x === "W").length
  const loses = results.filter((x) => x === "L").length
  if (runs.length === 2) {
    if (wins === 2) bothWin++
    else if (loses === 2) bothLose++
    else split++
    if (wins >= 1) atLeastOne++
    const a = runs[0]!, b2 = runs[1]!
    if (a.bestBetMarket === b2.bestBetMarket && a.bestBetSelection === b2.bestBetSelection &&
        a.bestBetTeam === b2.bestBetTeam && a.bestBetLine === b2.bestBetLine) stableSel++
  } else if (wins >= 1) atLeastOne++
  const tag = fire === true ? "🔥" : fire === false ? "⚠️ " : "? "
  lines.push(`${tag} ${hn} ${m.ftHome}-${m.ftAway} ${an}\n    R1: ${cells[0] ?? "—"}\n    R2: ${cells[1] ?? "—"}`)
}

console.log(`\n════════ ROUND ${ROUND} · grade ════════\n`)
for (const ln of lines) console.log(ln)
const bets = w + l + push + unk
console.log(`\n──────── total ────────`)
console.log(`apostas: ${bets}  →  ${w}W / ${l}L${push ? ` / ${push} push` : ""}${unk ? ` / ${unk} ?` : ""}  =  ${bets ? Math.round((w / (w + l)) * 100) : 0}% (W/(W+L))`)
console.log(`por jogo: ${bothWin} cravou os 2 · ${split} dividiu · ${bothLose} zerou · ${atLeastOne}/${matches.length} com ≥1 acerto`)
console.log(`estabilidade (2 runs = mesma aposta exata): ${stableSel}/${matches.length}`)
console.log(`mercados usados: ${JSON.stringify(mkt)}`)
const pct = (a: number, b: number) => (a + b ? `${Math.round((a / (a + b)) * 100)}%` : "—")
console.log(`\n──── SEGREGADO PELO VEREDITO DE INTENÇÃO ────`)
console.log(`🔥 os dois vão pra cima (${fireGames}j): ${fireW}W / ${fireL}L = ${pct(fireW, fireL)}`)
console.log(`⚠️  assimétrico / trava (${stallGames}j): ${stallW}W / ${stallL}L = ${pct(stallW, stallL)}`)
process.exit(0)
