/**
 * THROWAWAY — mede o ACERTO do best_bet do LLM com o motor MOD-004 (Dixon-Coles + grid + baseline).
 * Pra cada jogo com resultado: gera o prompt (prognosis-prompt) → roda o DeepSeek (run-deepseek, persiste)
 * → gradua o best_bet persistido contra o placar real. Roda: bun run scripts/_backtest-bestbet.ts
 */
import { desc, eq, inArray } from "drizzle-orm"
import { db } from "../src/db/client"
import { match, matchPrognosis } from "../src/db/schema"

// Lote com mix de resultados (todos têm placar no banco).
const IDS = [
  "00979e2b-e65e-4d68-b046-8bf152458e5d", // 3-0
  "1aef4960-5514-465b-9fd8-3bc2832b8be0", // 2-1
  "5b985b3d-86be-4da4-8b89-fa58c4343af8", // 3-1
  "21b6ffa6-4ba8-42e1-b584-f92a01148c90", // 1-1
  "e294b08b-bfb8-44d0-94bd-25ebde70785d", // 2-2
  "fa11e94d-7317-4b61-8e9a-d2b46dbb38ed", // 0-1
]
const API = `${import.meta.dir}/..` // cwd = apps/api (onde vive o .env)

for (const id of IDS) {
  console.error(`\n>>> ${id}: gerando prompt (MOD-004)…`)
  Bun.spawnSync(["bun", "run", "scripts/prognosis-prompt.ts", id], { cwd: API, stdout: "ignore", stderr: "ignore" })
  console.error(`>>> ${id}: DeepSeek (1-3 min)…`)
  Bun.spawnSync(["bun", "run", "scripts/run-deepseek.ts", id], { cwd: API, stdout: "ignore", stderr: "ignore" })
}

// ---- graduação ----
type V = "win" | "loss" | "push" | "na"
function grade(mkt: string | null, sel: string | null, line: number | null, team: string | null, h: number, a: number): V {
  const tot = h + a
  const out = h > a ? "home" : h < a ? "away" : "draw"
  switch (mkt) {
    case "1x2": return sel === out ? "win" : "loss"
    case "double_chance":
      if (sel === "home_draw") return out !== "away" ? "win" : "loss"
      if (sel === "draw_away") return out !== "home" ? "win" : "loss"
      return out !== "draw" ? "win" : "loss"
    case "draw_no_bet": return out === "draw" ? "push" : sel === out ? "win" : "loss"
    case "btts": { const both = h >= 1 && a >= 1; return (sel === "yes") === both ? "win" : "loss" }
    case "odd_even": { const odd = tot % 2 === 1; return (sel === "odd") === odd ? "win" : "loss" }
    case "over_under":
      if (line == null) return "na"
      if (tot === line) return "push"
      return (sel === "over") === (tot > line) ? "win" : "loss"
    case "team_total": {
      if (line == null || team == null) return "na"
      const g = team === "home" ? h : a
      if (g === line) return "push"
      return (sel === "over") === (g > line) ? "win" : "loss"
    }
    case "handicap": {
      if (line == null) return "na"
      const adj = sel === "home" ? h + line - a : a + line - h
      return adj > 0 ? "win" : adj < 0 ? "loss" : "push"
    }
    default: return "na"
  }
}

const matches = await db.select().from(match).where(inArray(match.id, IDS))
const byId = new Map(matches.map((m) => [m.id, m]))
let win = 0, loss = 0, push = 0
console.log(`\n\n===== ACERTO DO BEST_BET (motor MOD-004) =====`)
console.log(`jogo       placar  aposta                         → resultado`)
for (const id of IDS) {
  const [pg] = await db.select().from(matchPrognosis).where(eq(matchPrognosis.matchId, id)).orderBy(desc(matchPrognosis.runAt)).limit(1)
  const g = byId.get(id)
  if (!pg || !g || g.ftHome == null || g.ftAway == null) { console.log(`${id.slice(0, 8)}  (sem run/placar)`); continue }
  const v = grade(pg.bestBetMarket, pg.bestBetSelection, pg.bestBetLine, pg.bestBetTeam, g.ftHome, g.ftAway)
  if (v === "win") win++; else if (v === "loss") loss++; else if (v === "push") push++
  const bet = `${pg.bestBetMarket}/${pg.bestBetSelection}${pg.bestBetLine != null ? ` ${pg.bestBetLine}` : ""}${pg.bestBetTeam ? ` (${pg.bestBetTeam})` : ""}`
  const icon = v === "win" ? "✅" : v === "loss" ? "❌" : v === "push" ? "➖" : "·"
  console.log(`${id.slice(0, 8)}  ${g.ftHome}-${g.ftAway}     ${bet.padEnd(30)} → ${icon} ${v}`)
}
const decided = win + loss
console.log(`\nAcerto: ${win}/${decided} decididos (${decided ? Math.round((win / decided) * 100) : 0}%) · ${push} push · lote de ${IDS.length}`)
console.log(`(amostra pequena — sinal de direção, não veredito; e sem odds não é ROI)`)
process.exit(0)
