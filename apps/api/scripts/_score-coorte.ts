/**
 * Pontua a coorte congelada. As métricas são definidas AQUI, antes de olhar o resultado — escolher a
 * régua depois de ver o placar é a forma mais fácil de transformar ruído em vitória.
 *
 * O que mede e por quê:
 * 1. VIÉS DE TOTAL — projetado vs real. É o defeito mais consistente encontrado nesta sessão (~-0,5 gol),
 *    mas só foi medido em rodada 38, onde a composição confunde. Aqui a coorte é estratificada.
 * 2. CALIBRAÇÃO — de over 2.5 e BTTS: quem declara 60% tem de acertar ~60%. Não precisa de comparador,
 *    é medida absoluta — por isso vale mesmo sem rodar o pipeline vivo em paralelo.
 * 3. DISTRIBUIÇÃO DE MERCADO — a monocultura de `under` foi o sintoma que iniciou tudo. Se voltar aqui,
 *    a mudança observada na rodada 38 era ajuste àquela amostra, não melhora.
 * 4. ACERTO de best_bet e leitura — DESCRITIVO. Sem odds não existe medida de valor, e n=10 não sustenta
 *    conclusão; entra pra ver se a `leitura` (sem piso de prob) acerta mais ou menos que a bet travada.
 *
 *   bun run scripts/_score-coorte.ts <dir-do-run>
 */
import { readdirSync, readFileSync } from "node:fs"

const DIR = process.argv[2]
if (!DIR) throw new Error("uso: bun run scripts/_score-coorte.ts <caminho do diretório do run>")

type Mkt = { market: string; selection: string; team?: string | null; line?: number | null }
function settle(m: Mkt, h: number, a: number): "win" | "lose" | "push" | null {
  const t = h + a, sel = m.selection
  switch (m.market) {
    case "1x2": { const r = h > a ? "home" : h < a ? "away" : "draw"; return sel === r ? "win" : "lose" }
    case "double_chance": { const r = h > a ? "home" : h < a ? "away" : "draw"
      return (sel === "home_draw" && r !== "away") || (sel === "draw_away" && r !== "home") || (sel === "home_away" && r !== "draw") ? "win" : "lose" }
    case "draw_no_bet": { if (h === a) return "push"; return (sel === "home") === (h > a) ? "win" : "lose" }
    case "over_under": { if (m.line == null) return null; if (t === m.line) return "push"; return (sel === "over") === (t > m.line) ? "win" : "lose" }
    case "btts": return (sel === "yes") === (h > 0 && a > 0) ? "win" : "lose"
    case "team_total": { if (m.line == null || !m.team) return null; const g = m.team === "home" ? h : a
      if (g === m.line) return "push"; return (sel === "over") === (g > m.line) ? "win" : "lose" }
    case "handicap": { if (m.line == null) return null; const side = sel === "home" || sel === "away" ? sel : m.team; if (!side) return null
      const adj = side === "home" ? h + m.line - a : a + m.line - h; return adj > 0 ? "win" : adj === 0 ? "push" : "lose" }
    case "odd_even": return (sel === "odd") === (t % 2 === 1) ? "win" : "lose"
    default: return null
  }
}

type Reg = { label: string; proj: number; real: number; o25: number | null; over: boolean; btts: number | null; bttsReal: boolean; bet: Mkt; betS: string | null; lei: Mkt | null; leiS: string | null; leiP: number | null }
const regs: Reg[] = []
for (const f of readdirSync(DIR).filter((x) => x.endsWith(".dump.json"))) {
  const d = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"))
  const o = d.output
  if (!o || d.ftH == null) continue
  const h = Number(d.ftH), a = Number(d.ftA)
  regs.push({
    label: `${d.homeName} ${h}-${a} ${d.awayName}`,
    proj: Number(o.general?.total), real: h + a,
    o25: o.general?.over25_prob ?? null, over: h + a > 2.5,
    btts: o.general?.btts_prob ?? null, bttsReal: h > 0 && a > 0,
    bet: o.best_bet, betS: settle(o.best_bet, h, a),
    lei: o.leitura ?? null, leiS: o.leitura ? settle(o.leitura, h, a) : null, leiP: o.leitura?.prob ?? null,
  })
}
if (!regs.length) throw new Error(`nenhum dump com placar em ${DIR}`)

const mean = (x: number[]) => x.reduce((s, v) => s + v, 0) / x.length
const f2 = (x: number) => x.toFixed(2)
console.log(`# Score da coorte — n=${regs.length}\n`)

console.log(`## 1. Viés de total`)
const proj = mean(regs.map((r) => r.proj)), real = mean(regs.map((r) => r.real))
console.log(`   projetado ${f2(proj)} · real ${f2(real)} · VIÉS ${proj - real >= 0 ? "+" : ""}${f2(proj - real)}`)
console.log(`   MAE ${f2(mean(regs.map((r) => Math.abs(r.proj - r.real))))} · acima do previsto: ${regs.filter((r) => r.real > r.proj).length}/${regs.length}`)

console.log(`\n## 2. Calibração`)
for (const [nome, p, hit] of [["over 2.5", regs.map((r) => r.o25), regs.map((r) => r.over)], ["BTTS", regs.map((r) => r.btts), regs.map((r) => r.bttsReal)]] as const) {
  const val = (p as (number | null)[]).map((x, i) => ({ p: x, hit: (hit as boolean[])[i]! })).filter((x): x is { p: number; hit: boolean } => x.p != null)
  if (!val.length) continue
  const dec = mean(val.map((x) => x.p)), obs = val.filter((x) => x.hit).length / val.length
  console.log(`   ${nome}: declarou ${(dec * 100).toFixed(0)}% · aconteceu ${(obs * 100).toFixed(0)}% → ${obs - dec >= 0 ? "+" : ""}${((obs - dec) * 100).toFixed(0)} p.p.`)
}

console.log(`\n## 3. Distribuição de mercado (a monocultura voltou?)`)
const cont = new Map<string, number>()
for (const r of regs) { const k = `${r.bet.market}/${r.bet.selection}${r.bet.line != null ? " " + r.bet.line : ""}`; cont.set(k, (cont.get(k) ?? 0) + 1) }
for (const [k, n] of [...cont.entries()].sort((a, b) => b[1] - a[1])) console.log(`   ${String(n).padStart(2)}× ${k}`)
const maior = Math.max(...cont.values())
console.log(`   → mercado mais repetido: ${maior}/${regs.length} (${Math.round((maior / regs.length) * 100)}%)${maior / regs.length > 0.5 ? "  ⚠️ MONOCULTURA" : ""}`)

console.log(`\n## 4. Acerto (descritivo — sem odds não há medida de valor)`)
const cnt = (xs: (string | null)[], v: string) => xs.filter((x) => x === v).length
console.log(`   best_bet: ${cnt(regs.map((r) => r.betS), "win")}W ${cnt(regs.map((r) => r.betS), "lose")}L ${cnt(regs.map((r) => r.betS), "push")}P`)
const comLei = regs.filter((r) => r.leiS)
console.log(`   leitura:  ${cnt(comLei.map((r) => r.leiS), "win")}W ${cnt(comLei.map((r) => r.leiS), "lose")}L ${cnt(comLei.map((r) => r.leiS), "push")}P` +
  (comLei.length ? ` · prob média declarada ${(mean(comLei.map((r) => r.leiP ?? 0)) * 100).toFixed(0)}%` : ""))
const div = comLei.filter((r) => r.leiS !== r.betS)
console.log(`   divergiram: ${div.length}/${comLei.length}${div.length ? ` — leitura venceu em ${div.filter((r) => r.leiS === "win").length}` : ""}`)

console.log(`\n## Por jogo`)
for (const r of regs) console.log(`   ${r.label.padEnd(42)} proj ${f2(r.proj)} → real ${r.real} · bet ${String(r.betS).padEnd(4)} · leitura ${String(r.leiS ?? "-")}`)
process.exit(0)
