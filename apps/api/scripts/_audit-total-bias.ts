/**
 * Auditoria do VIÉS DE TOTAL do prognóstico — o total projetado bate com o total real?
 *
 * Suspeita levantada em 2026-07-20: todo pipeline (vivo, super V1, V2) projetou ~2.0-2.2 gols em jogos
 * que terminaram com 3-6. Se o viés existir fora da anedota, ele explica sozinho a monocultura de `under`
 * nos picks e é o defeito mais caro do produto — nenhum enriquecimento de briefing conserta λ errado.
 *
 * Método: pega o prognóstico MAIS RECENTE por partida (o histórico tem re-runs), só de jogos já
 * disputados, e mede (a) viés médio, (b) MAE, (c) calibração das probabilidades declaradas de over 2.5 e
 * BTTS contra a frequência observada. Descritivo — amostra é o que existe, não coorte congelada.
 *
 *   bun run scripts/_audit-total-bias.ts
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"

type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]

// distinct on (match_id) + order by run_at desc = o run mais recente de cada partida, que é o que valeria
// se o produto tivesse rodado uma vez só. Média de re-runs misturaria versões diferentes do prompt.
const rows = rowsOf(await db.execute(sql`
  select distinct on (mp.match_id)
    mp.match_id, m.league_code, m.date, m.ft_home, m.ft_away,
    th.name as home_name, ta.name as away_name,
    m.round, mp.total, mp.xg_home, mp.xg_away, mp.over25_prob, mp.btts_prob, mp.one_x_two
  from match_prognosis mp
  join match m on m.id = mp.match_id
  join team th on th.id = m.home_team_id
  join team ta on ta.id = m.away_team_id
  where m.ft_home is not null and m.ft_away is not null and mp.total is not null
  order by mp.match_id, mp.run_at desc`))

if (!rows.length) throw new Error("nenhum prognóstico com jogo disputado")

type Reg = { liga: string; proj: number; real: number; o25p: number | null; over: boolean; bttsP: number | null; btts: boolean }
const regs: Reg[] = rows.map((r) => {
  const h = Number(r.ft_home), a = Number(r.ft_away)
  return {
    liga: String(r.league_code),
    proj: Number(r.total),
    real: h + a,
    o25p: r.over25_prob == null ? null : Number(r.over25_prob),
    over: h + a > 2.5,
    bttsP: r.btts_prob == null ? null : Number(r.btts_prob),
    btts: h > 0 && a > 0,
  }
})

const mean = (xs: number[]) => xs.reduce((s, x) => s + x, 0) / xs.length
const f2 = (x: number) => x.toFixed(2)

function bloco(label: string, rs: Reg[]) {
  if (!rs.length) return
  const proj = mean(rs.map((r) => r.proj))
  const real = mean(rs.map((r) => r.real))
  const mae = mean(rs.map((r) => Math.abs(r.proj - r.real)))
  const sub = rs.filter((r) => r.real > r.proj).length
  console.log(`\n### ${label} (n=${rs.length})`)
  console.log(`  total projetado (média): ${f2(proj)}`)
  console.log(`  total REAL      (média): ${f2(real)}`)
  console.log(`  VIÉS: ${proj - real >= 0 ? "+" : ""}${f2(proj - real)} gol/jogo  ${Math.abs(proj - real) > 0.3 ? (proj < real ? "← SUBESTIMA" : "← SUPERESTIMA") : "(dentro do ruído)"}`)
  console.log(`  MAE: ${f2(mae)} · jogos com mais gols que o previsto: ${sub}/${rs.length} (${Math.round((sub / rs.length) * 100)}%)`)
}

console.log("# Auditoria de viés de total — prognóstico vs realidade")
console.log(`Fonte: match_prognosis (run mais recente por partida), só jogos disputados.`)

// AVISO DE COMPOSIÇÃO — a primeira rodagem desta auditoria (2026-07-20) mediu -0,52 de viés e quase virou
// ajuste de modelo antes de alguém notar que 50 dos 56 jogos eram de rodada ≥35. Rodada final tem mais gol
// por natureza (PL +0,14 · BRA +0,48), então o "viés" estava misturado com a composição da amostra e o
// grupo de controle tinha n=6. Este bloco existe pra que isso apareça ANTES do número, não depois.
const rodadas = rows.map((r) => Number(r.round)).filter((n) => Number.isFinite(n))
if (rodadas.length) {
  const finais = rodadas.filter((n) => n >= 35).length
  const pctFinais = Math.round((finais / rodadas.length) * 100)
  console.log(`\n⚠️  COMPOSIÇÃO DA AMOSTRA: ${finais}/${rodadas.length} jogos (${pctFinais}%) são de rodada ≥35.`)
  if (pctFinais > 40)
    console.log(
      `   Rodada final tem mais gol por natureza — com ${pctFinais}% da amostra ali, o viés medido abaixo\n` +
        `   NÃO é generalizável pra temporada inteira. Trate como "viés em rodada final" até ter jogos de meio\n` +
        `   de temporada em volume comparável.`,
    )
}
bloco("TODAS AS LIGAS", regs)
for (const liga of [...new Set(regs.map((r) => r.liga))]) bloco(liga, regs.filter((r) => r.liga === liga))

// Calibração: agrupa as probabilidades declaradas em faixas e compara com a frequência observada.
// Modelo bem calibrado que diz "60%" acerta ~60% das vezes. Desvio sistemático numa direção = viés.
function calib(label: string, pares: { p: number; hit: boolean }[]) {
  const val = pares.filter((x) => x.p != null)
  if (!val.length) return
  console.log(`\n### Calibração — ${label} (n=${val.length})`)
  const faixas = [[0, 0.2], [0.2, 0.35], [0.35, 0.5], [0.5, 0.65], [0.65, 0.8], [0.8, 1.01]]
  for (const [lo, hi] of faixas) {
    const b = val.filter((x) => x.p >= (lo as number) && x.p < (hi as number))
    if (!b.length) continue
    const declarado = mean(b.map((x) => x.p))
    const observado = b.filter((x) => x.hit).length / b.length
    const gap = observado - declarado
    console.log(`  ${(lo as number).toFixed(2)}-${(hi as number).toFixed(2)}: declarou ${(declarado * 100).toFixed(0)}% · aconteceu ${(observado * 100).toFixed(0)}% (n=${b.length}) ${Math.abs(gap) > 0.12 ? (gap > 0 ? "← declarou DE MENOS" : "← declarou DE MAIS") : ""}`)
  }
  const dec = mean(val.map((x) => x.p))
  const obs = val.filter((x) => x.hit).length / val.length
  console.log(`  GLOBAL: declarou ${(dec * 100).toFixed(0)}% · aconteceu ${(obs * 100).toFixed(0)}% → ${obs - dec >= 0 ? "+" : ""}${((obs - dec) * 100).toFixed(0)} p.p.`)
}
calib("over 2.5", regs.filter((r) => r.o25p != null).map((r) => ({ p: r.o25p as number, hit: r.over })))
calib("BTTS", regs.filter((r) => r.bttsP != null).map((r) => ({ p: r.bttsP as number, hit: r.btts })))

// Distribuição do real vs projetado — mostra se o erro é cauda (poucos jogos de goleada) ou deslocamento
// do centro. Cauda se corrige com variância; centro deslocado é λ errado, muito mais grave.
console.log("\n### Distribuição de gols")
const buckets = [0, 1, 2, 3, 4, 5, 99]
for (let i = 0; i < buckets.length - 1; i++) {
  const lo = buckets[i]!, hi = buckets[i + 1]!
  const nReal = regs.filter((r) => r.real >= lo && r.real < hi).length
  const nProj = regs.filter((r) => r.proj >= lo && r.proj < hi).length
  const lbl = hi === 99 ? `${lo}+` : `${lo}`
  console.log(`  ${lbl} gols: real ${String(nReal).padStart(3)} jogos | projetado (arredondado p/ faixa) ${String(nProj).padStart(3)}`)
}
process.exit(0)
