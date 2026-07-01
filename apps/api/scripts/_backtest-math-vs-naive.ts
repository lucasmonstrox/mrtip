/**
 * THROWAWAY — "com math vs sem math" em jogos reais.
 * Compara o motor per-jogo (Poisson + Dixon-Coles, a partir dos λ dos dossiês) contra o baseline BURRO
 * ("chuta a média da liga em todo jogo") — log-loss no resultado real de 1x2 / over2.5 / BTTS.
 * Se o math ganha, prova que a conta per-jogo agrega valor sobre "sem modelo". Roda: bun run scripts/_backtest-math-vs-naive.ts
 */
import { and, eq, inArray, isNotNull } from "drizzle-orm"
import { db } from "../src/db/client"
import { match } from "../src/db/schema"

const MAX = 10, RHO = -0.13
const pois = (k: number, l: number) => { let p = Math.exp(-l); for (let i = 1; i <= k; i++) p *= l / i; return p }
const tau = (x: number, y: number, lh: number, la: number, r: number) =>
  x === 0 && y === 0 ? 1 - lh * la * r : x === 0 && y === 1 ? 1 + lh * r : x === 1 && y === 0 ? 1 + la * r : x === 1 && y === 1 ? 1 - r : 1
function mathProbs(lh: number, la: number) {
  const ph = Array.from({ length: MAX + 1 }, (_, k) => pois(k, lh))
  const pa = Array.from({ length: MAX + 1 }, (_, k) => pois(k, la))
  let home = 0, draw = 0, away = 0, over = 0, btts = 0, sum = 0
  const g: number[][] = []
  for (let h = 0; h <= MAX; h++) { g[h] = []; for (let a = 0; a <= MAX; a++) { const p = ph[h]! * pa[a]! * tau(h, a, lh, la, RHO); g[h]![a] = p; sum += p } }
  for (let h = 0; h <= MAX; h++) for (let a = 0; a <= MAX; a++) {
    const p = g[h]![a]! / sum
    if (h > a) home += p; else if (h === a) draw += p; else away += p
    if (h + a >= 3) over += p
    if (h >= 1 && a >= 1) btts += p
  }
  return { home, draw, away, over, btts }
}
const ll = (p: number, y: boolean) => -(y ? Math.log(Math.max(p, 1e-9)) : Math.log(Math.max(1 - p, 1e-9)))
const llMulti = (p: number) => -Math.log(Math.max(p, 1e-9))

// ---- taxa-base BURRA da liga (mesma prob pra todo jogo) sobre TODOS os jogos jogados da PL ----
const all = await db.select().from(match).where(and(eq(match.leagueCode, "PL"), isNotNull(match.ftHome)))
let H = 0, D = 0, A = 0, OV = 0, BT = 0
for (const p of all) {
  const h = p.ftHome!, a = p.ftAway!
  if (h > a) H++; else if (h === a) D++; else A++
  if (h + a >= 3) OV++
  if (h >= 1 && a >= 1) BT++
}
const N = all.length
const base = { home: H / N, draw: D / N, away: A / N, over: OV / N, btts: BT / N }
console.log(`Taxa-base da liga (${N} jogos): 1x2 ${(base.home * 100).toFixed(0)}/${(base.draw * 100).toFixed(0)}/${(base.away * 100).toFixed(0)} · over2.5 ${(base.over * 100).toFixed(0)}% · BTTS ${(base.btts * 100).toFixed(0)}%`)

// ---- λ dos dossiês + resultado real ----
const glob = new Bun.Glob("prognosis-*.md")
let mMath = { x2: 0, over: 0, btts: 0 }, mNaive = { x2: 0, over: 0, btts: 0 }, n = 0
for await (const file of glob.scan({ cwd: `${import.meta.dir}/output` })) {
  const id = file.replace("prognosis-", "").replace(".md", "")
  const txt = await Bun.file(`${import.meta.dir}/output/${file}`).text()
  const m = txt.match(/λ[^=]*\(casa\)\s*=\s*([\d.]+)[^=]*\(fora\)\s*=\s*([\d.]+)/)
  if (!m) continue
  const [g] = await db.select().from(match).where(inArray(match.id, [id]))
  if (!g || g.ftHome == null || g.ftAway == null) continue
  const h = g.ftHome, a = g.ftAway
  const isH = h > a, isD = h === a, isOver = h + a >= 3, isBtts = h >= 1 && a >= 1
  const mp = mathProbs(+m[1]!, +m[2]!)
  // 1x2 multiclasse: log-loss da classe que ACONTECEU
  mMath.x2 += llMulti(isH ? mp.home : isD ? mp.draw : mp.away)
  mNaive.x2 += llMulti(isH ? base.home : isD ? base.draw : base.away)
  mMath.over += ll(mp.over, isOver); mNaive.over += ll(base.over, isOver)
  mMath.btts += ll(mp.btts, isBtts); mNaive.btts += ll(base.btts, isBtts)
  n++
}
const avg = (x: number) => (x / n).toFixed(4)
console.log(`\n===== ${n} jogos reais · LOG-LOSS (menor = melhor) =====`)
console.log(`               SEM math (média liga) → COM math (Poisson+DC)`)
const row = (name: string, na: number, ma: number) =>
  console.log(`  ${name.padEnd(10)} ${avg(na)}            →  ${avg(ma)}   ${ma < na ? "✅ math ganha" : "❌ math perde"} (${(((na - ma) / na) * 100).toFixed(1)}%)`)
row("1x2", mNaive.x2, mMath.x2)
row("over 2.5", mNaive.over, mMath.over)
row("BTTS", mNaive.btts, mMath.btts)
process.exit(0)
