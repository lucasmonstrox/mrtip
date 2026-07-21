/**
 * Score pareado das runs já gravadas pelo Prognosis V2 contra o snapshot atual.
 * Não chama LLM e não escreve no banco.
 *
 * Run: bun run scripts/prognosis-v2-score.ts
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { PROGNOSIS_V2_CONTRACT_VERSION } from "./prognosis-v2/contract"
import type {
  OneXTwo,
  PrognosisV2,
  RecommendedPrediction,
} from "./prognosis-v2/contract"

type Row = Record<string, unknown>
type Outcome = "home" | "draw" | "away"
type Settled = "hit" | "miss" | "push" | "unsupported"
type CurrentPick = {
  market: string
  selection: string
  team: string | null
  line: number | null
}

type ScoredGame = {
  matchId: string
  score: string
  actualTotal: number
  outcome: Outcome
  current: {
    oneXTwo: OneXTwo
    total: number
    pick: CurrentPick
    settled: Settled
  }
  v2: {
    oneXTwo: OneXTwo
    total: number
    pick: RecommendedPrediction
    settled: Settled
  }
}

const rowsOf = (result: unknown): Row[] =>
  ((result as { rows?: Row[] })?.rows ?? (result as Row[])) as Row[]
const clampProbability = (value: number) =>
  Math.min(1 - 1e-9, Math.max(1e-9, value))
const outcomeOf = (home: number, away: number): Outcome =>
  home > away ? "home" : home < away ? "away" : "draw"
const logLoss = (probs: OneXTwo, outcome: Outcome) =>
  -Math.log(clampProbability(probs[outcome]))
const brier = (probs: OneXTwo, outcome: Outcome) =>
  (["home", "draw", "away"] as Outcome[]).reduce(
    (total, key) => total + (probs[key] - (key === outcome ? 1 : 0)) ** 2,
    0
  ) / 3
const rps = (probs: OneXTwo, outcome: Outcome) => {
  const observed =
    outcome === "home" ? [1, 1] : outcome === "draw" ? [0, 1] : [0, 0]
  const predicted = [probs.home, probs.home + probs.draw]
  return (
    ((predicted[0]! - observed[0]!) ** 2 +
      (predicted[1]! - observed[1]!) ** 2) /
    2
  )
}

function settle(
  pick: {
    market: string
    selection: string
    team: string | null
    line: number | null
  },
  home: number,
  away: number
): Settled {
  const total = home + away
  const outcome = outcomeOf(home, away)
  if (pick.market === "1x2") return pick.selection === outcome ? "hit" : "miss"
  if (pick.market === "btts") {
    const yes = home > 0 && away > 0
    return (pick.selection === "yes") === yes ? "hit" : "miss"
  }
  if (pick.market === "over_under" && pick.line != null) {
    if (total === pick.line) return "push"
    return pick.selection === "over"
      ? total > pick.line
        ? "hit"
        : "miss"
      : total < pick.line
        ? "hit"
        : "miss"
  }
  if (pick.market === "team_total" && pick.line != null && pick.team) {
    const goals = pick.team === "home" ? home : away
    if (goals === pick.line) return "push"
    return pick.selection === "over"
      ? goals > pick.line
        ? "hit"
        : "miss"
      : goals < pick.line
        ? "hit"
        : "miss"
  }
  if (pick.market === "double_chance") {
    const hit =
      pick.selection === "home_draw"
        ? outcome !== "away"
        : pick.selection === "draw_away"
          ? outcome !== "home"
          : outcome !== "draw"
    return hit ? "hit" : "miss"
  }
  if (pick.market === "draw_no_bet") {
    if (outcome === "draw") return "push"
    return pick.selection === outcome ? "hit" : "miss"
  }
  return "unsupported"
}

function oneXTwoOf(value: unknown): OneXTwo {
  let parsed = value
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed) as unknown
    } catch {
      parsed = null
    }
  }
  const row = parsed as Partial<OneXTwo> | null
  return {
    home: Number(row?.home ?? 0),
    draw: Number(row?.draw ?? 0),
    away: Number(row?.away ?? 0),
  }
}

const outputRoot = Bun.fileURLToPath(
  new URL("./output/prognosis-v2/", import.meta.url)
)
const glob = new Bun.Glob("*/**/result.json")
const candidates = new Map<string, string[]>()
for await (const path of glob.scan({ cwd: outputRoot, absolute: true })) {
  const parts = path.split(/[\\/]/)
  const matchId = parts.at(-3)
  if (!matchId) continue
  const paths = candidates.get(matchId) ?? []
  paths.push(path)
  candidates.set(matchId, paths)
}
if (!candidates.size)
  throw new Error("nenhuma run V2 com result.json encontrada")

const games: ScoredGame[] = []
for (const [matchId, paths] of candidates) {
  let path: string | null = null
  for (const candidate of paths.sort().reverse()) {
    const manifest = await Bun.file(
      candidate.replace(/result\.json$/, "manifest.json")
    )
      .json()
      .catch(() => null)
    if (manifest?.contractVersion !== PROGNOSIS_V2_CONTRACT_VERSION) continue
    const dump = await Bun.file(candidate.replace(/result\.json$/, "dump.json"))
      .json()
      .catch(() => null)
    if (dump?.validation?.valid === true) {
      path = candidate
      break
    }
  }
  if (!path) continue
  const output = (await Bun.file(path).json()) as PrognosisV2
  const [row] = rowsOf(
    await db.execute(sql`
    select m.ft_home, m.ft_away, home.name as home_name, away.name as away_name,
           mp.total, mp.one_x_two, mp.best_bet_market, mp.best_bet_selection,
           mp.best_bet_team, mp.best_bet_line
    from match m
    join team home on home.id = m.home_team_id
    join team away on away.id = m.away_team_id
    left join lateral (
      select total, one_x_two, best_bet_market, best_bet_selection, best_bet_team, best_bet_line
      from match_prognosis
      where match_id = m.id
      order by run_at desc
      limit 1
    ) mp on true
    where m.id = ${matchId}
  `)
  )
  if (
    !row ||
    row.ft_home == null ||
    row.ft_away == null ||
    row.one_x_two == null
  )
    continue
  const home = Number(row.ft_home)
  const away = Number(row.ft_away)
  const currentPick: CurrentPick = {
    market: String(row.best_bet_market ?? ""),
    selection: String(row.best_bet_selection ?? ""),
    team: row.best_bet_team == null ? null : String(row.best_bet_team),
    line: row.best_bet_line == null ? null : Number(row.best_bet_line),
  }
  games.push({
    matchId,
    score: `${row.home_name} ${home}-${away} ${row.away_name}`,
    actualTotal: home + away,
    outcome: outcomeOf(home, away),
    current: {
      oneXTwo: oneXTwoOf(row.one_x_two),
      total: Number(row.total),
      pick: currentPick,
      settled: settle(currentPick, home, away),
    },
    v2: {
      oneXTwo: output.general.one_x_two,
      total: output.general.total,
      pick: output.recommended_prediction,
      settled: settle(output.recommended_prediction, home, away),
    },
  })
}
if (!games.length)
  throw new Error(
    "nenhuma run V2 encontrada para jogo finalizado com snapshot atual"
  )

const metric = (fn: (game: ScoredGame) => number) =>
  games.reduce((total, game) => total + fn(game), 0) / games.length
const hitRate = (side: "current" | "v2") => {
  const settled = games
    .map((game) => game[side].settled)
    .filter((value) => value === "hit" || value === "miss")
  return settled.length
    ? settled.filter((value) => value === "hit").length / settled.length
    : null
}
const summary = {
  n: games.length,
  current: {
    logLoss: metric((game) => logLoss(game.current.oneXTwo, game.outcome)),
    brier: metric((game) => brier(game.current.oneXTwo, game.outcome)),
    rps: metric((game) => rps(game.current.oneXTwo, game.outcome)),
    totalMae: metric((game) => Math.abs(game.current.total - game.actualTotal)),
    hitRate: hitRate("current"),
  },
  v2: {
    logLoss: metric((game) => logLoss(game.v2.oneXTwo, game.outcome)),
    brier: metric((game) => brier(game.v2.oneXTwo, game.outcome)),
    rps: metric((game) => rps(game.v2.oneXTwo, game.outcome)),
    totalMae: metric((game) => Math.abs(game.v2.total - game.actualTotal)),
    hitRate: hitRate("v2"),
  },
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-")
const markdown = `# Score Prognosis V2

N pareado: **${games.length}**

| pipeline | log-loss 1x2 | Brier | RPS | MAE total | acerto previsão |
|---|---:|---:|---:|---:|---:|
| atual | ${summary.current.logLoss.toFixed(4)} | ${summary.current.brier.toFixed(4)} | ${summary.current.rps.toFixed(4)} | ${summary.current.totalMae.toFixed(3)} | ${summary.current.hitRate == null ? "—" : `${(summary.current.hitRate * 100).toFixed(0)}%`} |
| V2 | ${summary.v2.logLoss.toFixed(4)} | ${summary.v2.brier.toFixed(4)} | ${summary.v2.rps.toFixed(4)} | ${summary.v2.totalMae.toFixed(3)} | ${summary.v2.hitRate == null ? "—" : `${(summary.v2.hitRate * 100).toFixed(0)}%`} |

${games.map((game) => `- ${game.score} · atual ${game.current.settled} · V2 ${game.v2.settled}`).join("\n")}

> Amostra descritiva. Não declarar superioridade antes de uma coorte congelada e fora da amostra.
`
await Promise.all([
  Bun.write(
    new URL(`./output/prognosis-v2/score-${stamp}.json`, import.meta.url),
    JSON.stringify({ summary, games }, null, 2)
  ),
  Bun.write(
    new URL(`./output/prognosis-v2/score-${stamp}.md`, import.meta.url),
    markdown
  ),
])
console.log(markdown)
