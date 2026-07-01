// Orquestra o lote de uma rodada inteira: (1) gera o prompt de cada jogo (anti-leak por data do jogo),
// (2) roda o deepseek N vezes por jogo em N passes separados — passes distintos garantem runAt distinto
// (linha própria no banco por run) e evita colisão de timestamp. Concorrência limitada pra não estourar
// rate limit. Run: bun run scripts/_batch-round.ts <round=37> <runs=2> <seasonSM=25583>
import { and, asc, eq } from "drizzle-orm"

import { db } from "../src/db/client"
import { match, season, team } from "../src/db/schema"

const ROUND = Number(process.argv[2] ?? 37)
const RUNS = Number(process.argv[3] ?? 2)
const SEASON_SM = Number(process.argv[4] ?? 25583)
const CONCURRENCY = 4

const [s] = await db.select().from(season).where(eq(season.sportmonksSeasonId, SEASON_SM))
if (!s) throw new Error(`season sportmonks ${SEASON_SM} não encontrada`)

const rows = await db
  .select()
  .from(match)
  .where(and(eq(match.round, ROUND), eq(match.seasonId, s.id)))
  .orderBy(asc(match.date))
const names = new Map<string, string>()
for (const t of await db.select().from(team)) names.set(t.id, t.name)
const label = (id: string) => {
  const m = rows.find((r) => r.id === id)!
  return `${names.get(m.homeTeamId)} x ${names.get(m.awayTeamId)}`
}
const ids = rows.map((r) => r.id)
console.log(`[batch] round ${ROUND} (${s.name}): ${ids.length} jogos × ${RUNS} runs = ${ids.length * RUNS} runs deepseek\n`)

// Pool simples de concorrência: roda `worker` sobre `items` com no máx `n` em paralelo.
async function pool<T>(items: T[], n: number, worker: (it: T, i: number) => Promise<void>) {
  let idx = 0
  const next = async (): Promise<void> => {
    const i = idx++
    if (i >= items.length) return
    await worker(items[i]!, i)
    return next()
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, () => next()))
}

// Spawna `bun run <script> <id>` no mesmo cwd (carrega .env) e devolve ok + cauda do log.
async function run(script: string, id: string): Promise<{ ok: boolean; tail: string }> {
  const proc = Bun.spawn(["bun", "run", `scripts/${script}`, id], { stdout: "pipe", stderr: "pipe" })
  const [out, err] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()])
  const code = await proc.exited
  const tail = (out + err).trim().split("\n").slice(-3).join(" | ")
  return { ok: code === 0, tail }
}

// Fase 1 — gera os prompts (1 por jogo). Local/DB, sem API.
console.log("── Fase 1: gerando prompts ──")
await pool(ids, CONCURRENCY, async (id) => {
  const r = await run("prognosis-prompt.ts", id)
  console.log(`  ${r.ok ? "✓" : "✗ FALHOU"}  prompt  ${label(id)}${r.ok ? "" : "  :: " + r.tail}`)
})

// Fases 2..N — um pass de deepseek por run, cada pass varre todos os jogos.
const fail: string[] = []
for (let pass = 1; pass <= RUNS; pass++) {
  console.log(`\n── Fase ${pass + 1}: deepseek pass ${pass}/${RUNS} ──`)
  await pool(ids, CONCURRENCY, async (id) => {
    const r = await run("run-deepseek.ts", id)
    if (!r.ok) fail.push(`pass${pass} ${label(id)}`)
    console.log(`  ${r.ok ? "✓" : "✗ FALHOU"}  run${pass}  ${label(id)}  :: ${r.tail}`)
  })
}

console.log(`\n[batch] concluído. ${ids.length * RUNS - fail.length}/${ids.length * RUNS} runs ok.`)
if (fail.length) console.log(`falhas: ${fail.join(" ; ")}`)
process.exit(0)
