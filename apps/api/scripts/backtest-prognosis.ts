/**
 * HARNESS DE BACKTEST do prognóstico (MOD-004 P2) — mede o que uma run isolada não mede:
 * roda o pipeline SUPER em N partidas com resultado conhecido × R runs por partida,
 * liquida cada best_bet E a APOSTA DE CONSENSO (maioria de mercado entre as R runs;
 * probs por mediana), e imprime acurácia individual vs consenso + log-loss do 1x2 e
 * do over 2.5. É o gate "medir antes de calibrar": toda mudança de prompt passa aqui.
 *
 * Run:  bun run scripts/backtest-prognosis.ts [--runs 3] [--par 4] [matchId ...]
 *       (sem ids: todas as partidas FT com prompt_text em match_prognosis)
 * Out:  scripts/output/backtest/<stamp>.json + tabela no console
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { runOne, settle, type RunResult, type Settle, type SuperPrognosis } from "./super-prognosis"

type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2)
const flag = (name: string, dflt: number) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : dflt
}
const RUNS = flag("runs", 3)
const PAR = flag("par", 4)
const idArgs = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--runs" && args[i - 1] !== "--par")

// ---------------------------------------------------------------------------
// Seleção de partidas: FT + prompt_text disponível (anti-leak: o prompt é pré-jogo)
// ---------------------------------------------------------------------------
async function eligibleMatches(): Promise<string[]> {
  const ms = rowsOf(await db.execute(sql`
    select distinct m.id, m.date from match m
    join match_prognosis mp on mp.match_id = m.id and mp.prompt_text is not null
    where m.status = 'FT' and m.ft_home is not null
    order by m.date desc`))
  return ms.map((m) => String(m.id))
}

// ---------------------------------------------------------------------------
// Pool simples de concorrência (o DeepSeek segura bem; PAR controla a pressão)
// ---------------------------------------------------------------------------
async function pool<T, R>(items: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let next = 0
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i]!)
    }
  }))
  return out
}

// ---------------------------------------------------------------------------
// Consenso entre as R runs de um jogo: best_bet por maioria de (market/selection/
// team/line); empate → maior soma de probability. Probs de mercado por MEDIANA.
// ---------------------------------------------------------------------------
type Bet = SuperPrognosis["best_bet"]
const betKey = (b: Bet) => `${b.market}|${b.selection}|${b.team ?? ""}|${b.line ?? ""}`
const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m]! : (s[m - 1]! + s[m]!) / 2
}
function consensusBet(bets: Bet[]): Bet {
  const groups = new Map<string, Bet[]>()
  for (const b of bets) groups.set(betKey(b), [...(groups.get(betKey(b)) ?? []), b])
  const ranked = [...groups.values()].sort((a, b) =>
    b.length - a.length || b.reduce((s, x) => s + x.probability, 0) - a.reduce((s, x) => s + x.probability, 0))
  const g = ranked[0]!
  return { ...g[0]!, probability: median(g.map((b) => b.probability)) }
}

// ---------------------------------------------------------------------------
// Métricas: log-loss do 1x2 (probs mediana renormalizadas) e do over 2.5
// ---------------------------------------------------------------------------
const clampP = (p: number) => Math.min(0.99, Math.max(0.01, p))
function oneXTwoLogLoss(outs: SuperPrognosis[], ftH: number, ftA: number): number {
  const med = {
    home: median(outs.map((o) => o.general.one_x_two.home)),
    draw: median(outs.map((o) => o.general.one_x_two.draw)),
    away: median(outs.map((o) => o.general.one_x_two.away)),
  }
  const tot = med.home + med.draw + med.away
  const real: keyof typeof med = ftH > ftA ? "home" : ftH < ftA ? "away" : "draw"
  return -Math.log(clampP(med[real] / (tot || 1)))
}
function over25LogLoss(outs: SuperPrognosis[], ftH: number, ftA: number): number {
  const p = clampP(median(outs.map((o) => o.general.over25_prob)))
  return -Math.log(ftH + ftA > 2.5 ? p : 1 - p)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const ids = idArgs.length ? idArgs : await eligibleMatches()
if (!ids.length) throw new Error("nenhuma partida elegível (FT + prompt_text)")
console.error(`[backtest] ${ids.length} jogos × ${RUNS} runs (paralelismo ${PAR})`)

const jobs = ids.flatMap((id) => Array.from({ length: RUNS }, (_, r) => ({ id, r })))
const results = await pool(jobs, PAR, async ({ id, r }) => {
  try {
    return { id, r, res: await runOne(id) }
  } catch (e) {
    console.error(`[backtest] ${id} run ${r + 1} ERRO: ${(e as Error).message}`)
    return { id, r, res: null as RunResult | null }
  }
})

type GameSummary = {
  matchId: string; jogo: string; real: string
  runs: { bet: string; prob: number; conf: string; settle: Settle }[]
  consenso: { bet: string; prob: number; settle: Settle } | null
  logloss1x2: number | null; loglossOver25: number | null
}
const games: GameSummary[] = []
for (const id of ids) {
  const ok = results.filter((x) => x.id === id && x.res?.output).map((x) => x.res!)
  if (!ok.length) continue
  const first = ok[0]!
  const ftH = first.ftH, ftA = first.ftA
  if (ftH == null || ftA == null) continue
  const outs = ok.map((x) => x.output!) // best_bet + general de cada run
  const runsRows = outs.map((o) => ({
    bet: betKey(o.best_bet),
    prob: o.best_bet.probability,
    conf: o.best_bet.confidence,
    settle: settle(o.best_bet, ftH, ftA),
  }))
  const cons = consensusBet(outs.map((o) => o.best_bet))
  games.push({
    matchId: id,
    jogo: `${first.homeName} x ${first.awayName}`,
    real: `${ftH}-${ftA}`,
    runs: runsRows,
    consenso: { bet: betKey(cons), prob: cons.probability, settle: settle(cons, ftH, ftA) },
    logloss1x2: oneXTwoLogLoss(outs, ftH, ftA),
    loglossOver25: over25LogLoss(outs, ftH, ftA),
  })
}

// ---- tabela + agregados
const mark = (s: Settle) => (s === "win" ? "✓" : s === "lose" ? "✗" : s === "push" ? "◦" : "?")
let indW = 0, indL = 0, conW = 0, conL = 0
for (const g of games) {
  for (const r of g.runs) { if (r.settle === "win") indW++; else if (r.settle === "lose") indL++ }
  if (g.consenso?.settle === "win") conW++
  else if (g.consenso?.settle === "lose") conL++
  console.log(`\n${g.jogo} — real ${g.real}`)
  for (const [i, r] of g.runs.entries()) console.log(`  run ${i + 1}: ${r.bet} p=${r.prob.toFixed(2)} (${r.conf}) ${mark(r.settle)}`)
  console.log(`  CONSENSO: ${g.consenso?.bet} p=${g.consenso?.prob.toFixed(2)} ${mark(g.consenso?.settle ?? null)} · logloss 1x2 ${g.logloss1x2?.toFixed(3)} · over2.5 ${g.loglossOver25?.toFixed(3)}`)
}
const avg = (xs: (number | null)[]) => {
  const v = xs.filter((x): x is number => x != null)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}
console.log(`\n===== ${games.length} jogos × ${RUNS} runs`)
console.log(`acurácia individual = ${indW}/${indW + indL} (${indW + indL ? ((indW / (indW + indL)) * 100).toFixed(0) : "?"}%)`)
console.log(`acurácia CONSENSO   = ${conW}/${conW + conL} (${conW + conL ? ((conW / (conW + conL)) * 100).toFixed(0) : "?"}%)`)
console.log(`logloss 1x2 (mediana) = ${avg(games.map((g) => g.logloss1x2))?.toFixed(3)} · logloss over2.5 = ${avg(games.map((g) => g.loglossOver25))?.toFixed(3)}`)

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
const outPath = new URL(`./output/backtest/${stamp}.json`, import.meta.url)
await Bun.write(outPath, JSON.stringify({ stamp, runs: RUNS, games }, null, 2))
console.log(`\n[json] ${Bun.fileURLToPath(outPath)}`)
process.exit(0)
