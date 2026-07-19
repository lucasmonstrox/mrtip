// Procura BOLSÕES de acerto nas best_bets já liquidadas: fatia por mercado, seleção, liga, mando,
// veredito de intenção e época do run, e testa cada fatia contra a base rate com binomial exato —
// pra separar bolsão real de garimpo (com n=48 jogos, fatiar demais fabrica vencedor por acaso).
// Run: bun run scripts/_onde-acerta.ts
import { SQL } from "bun"

import { env } from "../src/env"

// Conexão própria com max:1 — o pool padrão do client abre 10 e o Postgres local vive perto do teto.
const sql = new SQL(env.databaseUrl, { max: 1 })

type Row = Record<string, unknown>

type Settle = "win" | "lose" | "push" | null

// Liquida um mercado contra o placar final (mesma lógica do _calibracao-confianca / super-prognosis).
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

// Probabilidade binomial de sair >= k acertos em n tentativas com prob p (cauda superior exata).
// É o filtro anti-garimpo: bolsão que não passa disso é sorte, não edge.
function binomTailGE(k: number, n: number, p: number): number {
  let logFact = [0]
  for (let i = 1; i <= n; i++) logFact[i] = logFact[i - 1]! + Math.log(i)
  let acc = 0
  for (let i = k; i <= n; i++) {
    const logC = logFact[n]! - logFact[i]! - logFact[n - i]!
    acc += Math.exp(logC + i * Math.log(p) + (n - i) * Math.log(1 - p))
  }
  return acc
}

type Bet = {
  matchId: string
  runAt: Date
  matchDate: Date
  conf: string
  prob: number
  market: string
  selection: string
  team: string | null
  line: number | null
  league: string
  intent: boolean | null // 🔥 os dois precisam ir pra cima · ⚠️ assimétrico
  res: Settle
}

const raw: Row[] = await sql`
  select mp.match_id, mp.run_at, mp.best_bet_confidence, mp.best_bet_probability,
         mp.best_bet_market, mp.best_bet_selection, mp.best_bet_team, mp.best_bet_line,
         m.ft_home, m.ft_away, m.date as match_date, l.name as league,
         case when mp.prompt_text like '%VEREDITO DE INTENÇÃO: OS DOIS PRECISAM%' then true
              when mp.prompt_text like '%VEREDITO DE INTENÇÃO: ASSIM%' then false
              else null end as intent
  from match_prognosis mp
  join match m on m.id = mp.match_id
  join season s on s.id = m.season_id
  join league l on l.code = s.league_code
  where m.ft_home is not null and m.ft_away is not null
    and mp.best_bet_market is not null and mp.best_bet_probability is not null
    and mp.best_bet_market <> 'none'
  order by mp.match_id, mp.run_at desc`

const bets: Bet[] = raw.map((r: Row) => ({
  matchId: String(r.match_id),
  runAt: new Date(String(r.run_at)),
  matchDate: new Date(String(r.match_date)),
  conf: String(r.best_bet_confidence ?? "?"),
  prob: Number(r.best_bet_probability),
  market: String(r.best_bet_market),
  selection: String(r.best_bet_selection ?? ""),
  team: r.best_bet_team == null ? null : String(r.best_bet_team),
  line: r.best_bet_line == null ? null : Number(r.best_bet_line),
  league: String(r.league ?? "?"),
  intent: r.intent == null ? null : Boolean(r.intent),
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

// Dedup por (jogo + chave da fatia): runs do mesmo jogo são correlacionadas. Deduplicar DENTRO da fatia
// (e não global) evita medir "jogos cuja última run calhou de cair nesta fatia".
const dedupBy = (list: Bet[], key: (b: Bet) => string) => {
  const seen = new Map<string, Bet>()
  for (const b of list) {
    const k = `${b.matchId}|${key(b)}`
    if (!seen.has(k)) seen.set(k, b)
  }
  return [...seen.values()]
}

const wl = (list: Bet[]) => {
  const w = list.filter((b) => b.res === "win").length
  const l = list.filter((b) => b.res === "lose").length
  const mean = list.length ? list.reduce((s, b) => s + b.prob, 0) / list.length : 0
  return { w, l, n: w + l, rate: w + l ? w / (w + l) : null, mean }
}

// Base rate global (deduplicado por jogo) — é contra ela que cada fatia é testada.
const global = wl(dedupBy(bets, () => ""))
const BASE = global.rate ?? 0.5
console.log(
  `\nBASE RATE (1 aposta por jogo): ${global.w}W/${global.l}L = ${(BASE * 100).toFixed(0)}% em ${global.n} jogos\n` +
    `prob. média cravada: ${(global.mean * 100).toFixed(0)}%  ·  gap de calibração: ${((BASE - global.mean) * 100).toFixed(0)}pp`,
)

type Slice = { dim: string; label: string; w: number; l: number; n: number; rate: number; mean: number; p: number }
const slices: Slice[] = []

function scan(dim: string, keyOf: (b: Bet) => string | null, minN = 6) {
  const groups = new Map<string, Bet[]>()
  for (const b of bets) {
    const k = keyOf(b)
    if (k == null) continue
    if (!groups.has(k)) groups.set(k, [])
    groups.get(k)!.push(b)
  }
  for (const [label, list] of groups) {
    const d = dedupBy(list, () => label)
    const s = wl(d)
    if (s.n < minN || s.rate == null) continue
    slices.push({
      dim, label, w: s.w, l: s.l, n: s.n, rate: s.rate, mean: s.mean,
      p: binomTailGE(s.w, s.n, BASE),
    })
  }
}

scan("mercado", (b) => b.market)
scan("mercado+seleção", (b) => `${b.market} ${b.selection}${b.team ? ` (${b.team})` : ""}`)
scan("direção", (b) => (b.selection === "over" ? "OVER (qualquer mercado)" : b.selection === "under" ? "UNDER (qualquer mercado)" : null))
scan("liga", (b) => b.league)
scan("confidence", (b) => b.conf)
scan("faixa de prob", (b) => `${Math.floor(b.prob * 10) * 10}s`)
scan("intenção", (b) => (b.intent === true ? "🔥 os dois precisam ir pra cima" : b.intent === false ? "⚠️ assimétrico/trava" : null))
scan("linha do team_total", (b) => (b.market === "team_total" ? `team_total linha ${b.line}` : null))
scan("linha do over_under", (b) => (b.market === "over_under" ? `over_under linha ${b.line}` : null))
scan("época do run", (b) => (b.runAt >= new Date("2026-07-10") ? "run recente (≥10/jul)" : "run antiga (<10/jul)"))

slices.sort((a, b) => b.rate - a.rate || b.n - a.n)

console.log(
  `\n════ FATIAS ORDENADAS POR ACERTO ════\n` +
    `Dedup é 1 aposta por jogo DENTRO de cada fatia — um mesmo jogo pode aparecer em fatias diferentes\n` +
    `(runs distintas escolheram mercados/faixas distintos), então os n NÃO somam 48. Para os números de\n` +
    `headline por faixa de probabilidade use _calibracao-confianca.ts (dedup global, n=48).\n` +
    `A coluna que mede HABILIDADE é 'cravado' vs 'acerto' — 'vs base' só diz se o mercado é fácil.`,
)
console.log(`\n${"dimensão".padEnd(20)}│ ${"fatia".padEnd(36)}│  n  │ W-L   │ acerto │ cravado │ vs base │ p(acaso)`)
console.log(`${"─".repeat(20)}┼${"─".repeat(37)}┼─────┼───────┼────────┼─────────┼─────────┼─────────`)
for (const s of slices) {
  const lift = (s.rate - BASE) * 100
  const flag = s.p < 0.05 && s.n >= 8 ? " ★" : s.n < 10 ? " ⚠n" : ""
  console.log(
    `${s.dim.padEnd(20)}│ ${s.label.slice(0, 36).padEnd(36)}│ ${String(s.n).padStart(3)} │ ${`${s.w}-${s.l}`.padEnd(5)} │ ` +
      `${`${(s.rate * 100).toFixed(0)}%`.padStart(5)}  │  ${`${(s.mean * 100).toFixed(0)}%`.padStart(4)}   │ ` +
      `${`${lift >= 0 ? "+" : ""}${lift.toFixed(0)}pp`.padStart(6)}  │ ${s.p.toFixed(3)}${flag}`,
  )
}

console.log(
  `\n★ = bate a base rate com p<0.05 E n>=8  ·  ⚠n = n<10, indicativo\n` +
    `ATENÇÃO À MULTIPLICIDADE: ${slices.length} fatias testadas. Com p<0.05 puro, ` +
    `~${(slices.length * 0.05).toFixed(1)} fatias apareceriam "vencedoras" só por acaso.\n` +
    `Limiar de Bonferroni honesto para este scan: p < ${(0.05 / slices.length).toFixed(4)}.`,
)

// Contraste PÓS-HOC (formulado depois de ver o scan, não antes — não é confirmatório): apostar A FAVOR
// de um evento (over / btts yes) vs CONTRA (under / btts no). Vale como hipótese a pré-registrar, não
// como achado. Mecanismo plausível: o λ de Poisson sustenta o over; o under exige prever supressão.
const aFavor = (b: Bet) => b.selection === "over" || b.selection === "yes"
const contra = (b: Bet) => b.selection === "under" || b.selection === "no"
const A = wl(dedupBy(bets.filter(aFavor), () => "A"))
const C = wl(dedupBy(bets.filter(contra), () => "C"))
// Teste z de duas proporções (bicaudal) — o contraste foi definido antes de olhar a tabela.
const pool = (A.w + C.w) / (A.n + C.n)
const se = Math.sqrt(pool * (1 - pool) * (1 / A.n + 1 / C.n))
const z = se ? ((A.rate ?? 0) - (C.rate ?? 0)) / se : 0
const erf = (x: number) => {
  const t = 1 / (1 + 0.3275911 * Math.abs(x))
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x)
  return x >= 0 ? y : -y
}
const pz = 2 * (1 - 0.5 * (1 + erf(Math.abs(z) / Math.SQRT2)))
console.log(
  `\n════ CONTRASTE DIRIGIDO · apostar A FAVOR do evento vs CONTRA ════\n` +
    `A FAVOR (over / btts yes): ${A.w}W/${A.l}L = ${((A.rate ?? 0) * 100).toFixed(0)}%  · cravado ${(A.mean * 100).toFixed(0)}%  · calibração ${(((A.rate ?? 0) - A.mean) * 100).toFixed(0)}pp\n` +
    `CONTRA  (under / btts no): ${C.w}W/${C.l}L = ${((C.rate ?? 0) * 100).toFixed(0)}%  · cravado ${(C.mean * 100).toFixed(0)}%  · calibração ${(((C.rate ?? 0) - C.mean) * 100).toFixed(0)}pp\n` +
    `diferença: ${(((A.rate ?? 0) - (C.rate ?? 0)) * 100).toFixed(0)}pp  ·  z=${z.toFixed(2)}  ·  p=${pz.toFixed(3)}`,
)

const sobreviventes = slices.filter((s) => s.p < 0.05 / slices.length)
console.log(
  `\nFatias que sobrevivem a Bonferroni: ${sobreviventes.length ? sobreviventes.map((s) => `${s.label} (${(s.rate * 100).toFixed(0)}%, n=${s.n})`).join(" · ") : "NENHUMA"}`,
)
process.exit(0)
