/**
 * THROWAWAY — backtest de bancada do Dixon-Coles em JOGOS REAIS.
 * Pega os λ (Rota A) dos dossiês já gerados em scripts/output/prognosis-*.md, cruza com o PLACAR FINAL
 * no banco, e mede se o DC melhora a calibração (log-loss) no resultado real, pra empate / over2.5 / BTTS.
 * Roda:  bun run scripts/_backtest-dc.ts
 */
import { eq } from "drizzle-orm"
import { db } from "../src/db/client"
import { match } from "../src/db/schema"

const MAX = 10
const RHO = -0.13
const pois = (k: number, l: number) => { let p = Math.exp(-l); for (let i = 1; i <= k; i++) p *= l / i; return p }
const tau = (x: number, y: number, lh: number, la: number, r: number) =>
  x === 0 && y === 0 ? 1 - lh * la * r : x === 0 && y === 1 ? 1 + lh * r : x === 1 && y === 0 ? 1 + la * r : x === 1 && y === 1 ? 1 - r : 1

function probs(lh: number, la: number, rho: number) {
  const ph = Array.from({ length: MAX + 1 }, (_, k) => pois(k, lh))
  const pa = Array.from({ length: MAX + 1 }, (_, k) => pois(k, la))
  let draw = 0, over25 = 0, btts = 0, sum = 0
  const g: number[][] = []
  for (let h = 0; h <= MAX; h++) { g[h] = []; for (let a = 0; a <= MAX; a++) { const p = ph[h]! * pa[a]! * tau(h, a, lh, la, rho); g[h]![a] = p; sum += p } }
  for (let h = 0; h <= MAX; h++) for (let a = 0; a <= MAX; a++) {
    const p = g[h]![a]! / sum
    if (h === a) draw += p
    if (h + a >= 3) over25 += p
    if (h >= 1 && a >= 1) btts += p
  }
  return { draw, over25, btts }
}
const logloss = (p: number, y: boolean) => -(y ? Math.log(Math.max(p, 1e-9)) : Math.log(Math.max(1 - p, 1e-9)))

// Lê os λ e o matchId de cada dossiê gerado.
const glob = new Bun.Glob("prognosis-*.md")
const rows: { id: string; lh: number; la: number }[] = []
for await (const file of glob.scan({ cwd: `${import.meta.dir}/output` })) {
  const id = file.replace("prognosis-", "").replace(".md", "")
  const txt = await Bun.file(`${import.meta.dir}/output/${file}`).text()
  const m = txt.match(/λ[^=]*\(casa\)\s*=\s*([\d.]+)[^=]*\(fora\)\s*=\s*([\d.]+)/)
  if (m) rows.push({ id, lh: +m[1]!, la: +m[2]! })
}

let nInd = { draw: 0, over: 0, btts: 0 }, nDc = { draw: 0, over: 0, btts: 0 }, graded = 0
let drawsReais = 0, overReais = 0, bttsReais = 0
let pDrawInd = 0, pDrawDc = 0
const games: { lh: number; la: number; isDraw: boolean }[] = []
console.log(`\njogo                       λ      placar  empate?  P(emp) ind→DC   over2.5? P(o) ind→DC`)
for (const r of rows) {
  const [g] = await db.select().from(match).where(eq(match.id, r.id))
  if (!g || g.ftHome == null || g.ftAway == null) continue
  const isDraw = g.ftHome === g.ftAway, isOver = g.ftHome + g.ftAway >= 3, isBtts = g.ftHome >= 1 && g.ftAway >= 1
  const ind = probs(r.lh, r.la, 0), dc = probs(r.lh, r.la, RHO)
  nInd.draw += logloss(ind.draw, isDraw); nDc.draw += logloss(dc.draw, isDraw)
  nInd.over += logloss(ind.over25, isOver); nDc.over += logloss(dc.over25, isOver)
  nInd.btts += logloss(ind.btts, isBtts); nDc.btts += logloss(dc.btts, isBtts)
  pDrawInd += ind.draw; pDrawDc += dc.draw
  games.push({ lh: r.lh, la: r.la, isDraw })
  drawsReais += isDraw ? 1 : 0; overReais += isOver ? 1 : 0; bttsReais += isBtts ? 1 : 0; graded++
  console.log(
    `${r.id.slice(0, 8)}  ${String(r.lh).padStart(4)}/${String(r.la).padEnd(4)}  ${g.ftHome}-${g.ftAway}     ${isDraw ? "SIM " : "não"}   ${(ind.draw * 100).toFixed(0)}%→${(dc.draw * 100).toFixed(0)}%      ${isOver ? "SIM" : "não"}   ${(ind.over25 * 100).toFixed(0)}%→${(dc.over25 * 100).toFixed(0)}%`,
  )
}

const avg = (x: number) => (x / graded).toFixed(4)
console.log(`\n===== ${graded} jogos com placar =====`)
console.log(`Empates reais: ${drawsReais}/${graded} (${(drawsReais / graded * 100).toFixed(0)}%) · over2.5 reais: ${overReais}/${graded} · BTTS reais: ${bttsReais}/${graded}`)
console.log(`P(empate) média prevista: indep ${(pDrawInd / graded * 100).toFixed(1)}%  →  DC ${(pDrawDc / graded * 100).toFixed(1)}%  (real ${(drawsReais / graded * 100).toFixed(1)}%)`)
console.log(`\nLOG-LOSS (menor = melhor):     indep    →   Dixon-Coles`)
console.log(`  empate     ${avg(nInd.draw)}  →   ${avg(nDc.draw)}   ${nDc.draw < nInd.draw ? "✅ DC melhor" : "❌ pior"}`)
console.log(`  over 2.5   ${avg(nInd.over)}  →   ${avg(nDc.over)}   ${nDc.over < nInd.over ? "✅ DC melhor" : nDc.over === nInd.over ? "= igual" : "❌ pior"}`)
console.log(`  BTTS       ${avg(nInd.btts)}  →   ${avg(nDc.btts)}   ${nDc.btts < nInd.btts ? "✅ DC melhor" : "❌ pior"}`)

// ---- mini-MLE na marra: qual ρ minimiza o log-loss do EMPATE nestes jogos ----
console.log(`\n===== VARREDURA DE ρ (log-loss do empate nos ${graded} jogos) =====`)
let best = { rho: 0, loss: Infinity }
for (let i = 0; i <= 15; i++) {
  const rho = -i * 0.02
  let loss = 0, pmean = 0
  for (const g of games) { const p = probs(g.lh, g.la, rho).draw; loss += logloss(p, g.isDraw); pmean += p }
  loss /= games.length; pmean /= games.length
  if (loss < best.loss) best = { rho, loss }
  const bar = "█".repeat(Math.round((0.86 - loss) * 400))
  console.log(`  ρ=${rho.toFixed(2)}   logloss ${loss.toFixed(4)}   P(emp) média ${(pmean * 100).toFixed(1)}%  ${bar}`)
}
console.log(`\n→ melhor ρ nestes ${graded} jogos: ${best.rho.toFixed(2)} (logloss ${best.loss.toFixed(4)}) · empate real ${(drawsReais / graded * 100).toFixed(0)}%`)
console.log(`  (nota: 16 jogos = amostra pequena; em produção o ρ vem de MLE sobre TODOS os jogos ingeridos, re-ajustado conforme o banco cresce)`)
process.exit(0)
