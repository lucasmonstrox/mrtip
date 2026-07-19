// Mede a CALIBRAÇÃO das best_bets já gravadas: liquida cada aposta contra o placar real e compara a
// probabilidade que o modelo cravou com a taxa de acerto observada, agrupada em faixas de 10pp e
// segregada por confidence (high/medium/low). Responde "quando ele diz 80%, acerta 80%?".
// Run: bun run scripts/_calibracao-confianca.ts
import { SQL } from "bun"

import { env } from "../src/env"

// Conexão própria com max:1 — o pool padrão do client abre 10 e o Postgres local vive perto do teto.
const sql = new SQL(env.databaseUrl, { max: 1 })

type Row = Record<string, unknown>

type Settle = "win" | "lose" | "push" | null

// Liquida um mercado contra o placar final (cópia da settle do super-prognosis, sem o import pesado).
function settle(
  mkt: { market: string; selection: string; team?: string | null; line?: number | null },
  ftH: number,
  ftA: number,
): Settle {
  const total = ftH + ftA
  const sel = mkt.selection
  switch (mkt.market) {
    case "1x2": {
      const res = ftH > ftA ? "home" : ftH < ftA ? "away" : "draw"
      return sel === res ? "win" : "lose"
    }
    case "double_chance": {
      const res = ftH > ftA ? "home" : ftH < ftA ? "away" : "draw"
      const ok =
        (sel === "home_draw" && res !== "away") ||
        (sel === "draw_away" && res !== "home") ||
        (sel === "home_away" && res !== "draw")
      return ok ? "win" : "lose"
    }
    case "draw_no_bet": {
      if (ftH === ftA) return "push"
      return (sel === "home") === (ftH > ftA) ? "win" : "lose"
    }
    case "over_under": {
      if (mkt.line == null) return null
      if (total === mkt.line) return "push"
      return (sel === "over") === (total > mkt.line) ? "win" : "lose"
    }
    case "btts": {
      const both = ftH > 0 && ftA > 0
      return (sel === "yes") === both ? "win" : "lose"
    }
    case "team_total": {
      if (mkt.line == null || !mkt.team) return null
      const g = mkt.team === "home" ? ftH : ftA
      if (g === mkt.line) return "push"
      return (sel === "over") === (g > mkt.line) ? "win" : "lose"
    }
    case "handicap": {
      if (mkt.line == null) return null
      const side = sel === "home" || sel === "away" ? sel : mkt.team
      if (!side) return null
      const adj = side === "home" ? ftH + mkt.line - ftA : ftA + mkt.line - ftH
      return adj > 0 ? "win" : adj === 0 ? "push" : "lose"
    }
    case "odd_even":
      return (sel === "odd") === (total % 2 === 1) ? "win" : "lose"
    default:
      return null
  }
}

type Bet = {
  matchId: string
  runAt: Date
  conf: string
  rowConf: string
  prob: number
  market: string
  res: Settle
}

const raw: Row[] = await sql`
  select mp.match_id, mp.run_at, mp.best_bet_confidence, mp.confianca, mp.best_bet_probability,
         mp.best_bet_market, mp.best_bet_selection, mp.best_bet_team, mp.best_bet_line,
         m.ft_home, m.ft_away
  from match_prognosis mp
  join match m on m.id = mp.match_id
  where m.ft_home is not null and m.ft_away is not null
    and mp.best_bet_market is not null and mp.best_bet_probability is not null
  order by mp.match_id, mp.run_at desc`

const bets: Bet[] = raw.map((r: Row) => ({
  matchId: String(r.match_id),
  runAt: new Date(String(r.run_at)),
  conf: String(r.best_bet_confidence ?? "?"),
  rowConf: String(r.confianca ?? "?"),
  prob: Number(r.best_bet_probability),
  market: String(r.best_bet_market),
  res: settle(
    {
      market: String(r.best_bet_market),
      selection: String(r.best_bet_selection ?? ""),
      team: r.best_bet_team == null ? null : String(r.best_bet_team),
      line: r.best_bet_line == null ? null : Number(r.best_bet_line),
    },
    Number(r.ft_home),
    Number(r.ft_away),
  ),
}))

// Dedup: 1 aposta por jogo (várias runs do mesmo jogo são correlacionadas — inflam o n).
// `bets` já vem ordenado por match_id, run_at desc, então o primeiro visto é o mais recente.
const dedupBy = (list: Bet[]) => {
  const latest = new Map<string, Bet>()
  for (const b of list) if (!latest.has(b.matchId)) latest.set(b.matchId, b)
  return [...latest.values()]
}
const deduped = dedupBy(bets) // curva geral: run mais recente do jogo, seja qual for a confidence

const pct = (n: number) => `${(n * 100).toFixed(0)}%`
function summarize(list: Bet[]) {
  const w = list.filter((b) => b.res === "win").length
  const l = list.filter((b) => b.res === "lose").length
  const p = list.filter((b) => b.res === "push").length
  const nul = list.filter((b) => b.res === null).length
  const rate = w + l ? w / (w + l) : null
  const mean = list.length ? list.reduce((s, b) => s + b.prob, 0) / list.length : 0
  return { n: list.length, w, l, p, nul, rate, mean }
}

function table(title: string, list: Bet[]) {
  console.log(`\n════ ${title} ════`)
  const all = summarize(list)
  console.log(
    `geral: n=${all.n}  ${all.w}W/${all.l}L${all.p ? `/${all.p}push` : ""}${all.nul ? `/${all.nul}?` : ""}  ` +
      `acerto=${all.rate == null ? "—" : pct(all.rate)}  prob.média cravada=${pct(all.mean)}  ` +
      `gap=${all.rate == null ? "—" : `${((all.rate - all.mean) * 100).toFixed(0)}pp`}`,
  )
  console.log(`\nfaixa │  n  │  W-L-push │ acerto │ prob.média │  gap   │ nota`)
  console.log(`──────┼─────┼───────────┼────────┼────────────┼────────┼──────`)
  for (const band of [40, 50, 60, 70, 80, 90]) {
    const inBand = list.filter((b) => b.prob * 100 >= band && b.prob * 100 < band + 10)
    if (!inBand.length) {
      console.log(`${band}s   │  0  │     —     │   —    │     —      │   —    │ sem dado`)
      continue
    }
    const s = summarize(inBand)
    const nota = s.n < 5 ? "n<5 — indicativo" : ""
    console.log(
      `${band}s   │ ${String(s.n).padStart(2)}  │  ${s.w}-${s.l}-${s.p}     │ ${(s.rate == null ? "—" : pct(s.rate)).padStart(5)}  │   ` +
        `${pct(s.mean).padStart(5)}    │ ${(s.rate == null ? "—" : `${((s.rate - s.mean) * 100).toFixed(0)}pp`).padStart(5)}  │ ${nota}`,
    )
  }
}

console.log(`\nUniverso: ${bets.length} runs com best_bet + jogo finalizado · ${deduped.length} jogos distintos`)
console.log(`(dedup = run mais recente por jogo)`)

// Por confidence: dedup DENTRO da classe (a run high mais recente do jogo). Deduplicar global e depois
// filtrar mediria outra coisa — "jogos cuja ÚLTIMA run calhou de ser high" — e derrubaria o n pela metade.
for (const c of ["high", "medium", "low"]) {
  const r = bets.filter((b) => b.conf === c)
  const d = dedupBy(r)
  if (!d.length) continue
  table(`confidence = ${c.toUpperCase()} · 1 run por jogo (dedup dentro da classe)`, d)
  if (r.length !== d.length) {
    const s = summarize(r)
    console.log(
      `\n  [secundário — todas as ${s.n} runs, sem dedup] ${s.w}W/${s.l}L${s.p ? `/${s.p}push` : ""} = ` +
        `${s.rate == null ? "—" : pct(s.rate)} · prob.média ${pct(s.mean)}`,
    )
  }
}

// Curva de calibração geral (todas as confidences juntas) — onde há n de verdade.
table(`TODAS as confidences · 1 run por jogo (n = jogos, independentes)`, deduped)
table(`TODAS as confidences · TODAS as runs (n INFLADO — runs do mesmo jogo são correlacionadas)`, bets)

// Divergência entre os dois campos de confiança do schema.
const rowHigh = deduped.filter((b) => b.rowConf === "high" || b.rowConf === "alta")
if (rowHigh.length) {
  const s = summarize(rowHigh)
  console.log(
    `\n──── campo alternativo: confianca (nível do jogo, não da aposta) = high/alta ────\n` +
      `n=${s.n}  ${s.w}W/${s.l}L${s.p ? `/${s.p}push` : ""}  acerto=${s.rate == null ? "—" : pct(s.rate)}  prob.média=${pct(s.mean)}`,
  )
}

// Mercados usados no high — pra saber se a taxa é de um mercado só.
const mktHigh: Record<string, number> = {}
for (const b of dedupBy(bets.filter((x) => x.conf === "high"))) mktHigh[b.market] = (mktHigh[b.market] ?? 0) + 1
console.log(`\nmercados no high (dedup): ${JSON.stringify(mktHigh)}`)
process.exit(0)
