// Reconstrói o BRACKET de uma copa a partir do NOSSO banco (prova que o dado sincronizado basta):
// agrupa os matches por stage (ordenado por stageOrder), mostra cada confronto com placar + vencedor,
// e computa a PROGRESSÃO (o vencedor de um confronto aparece no confronto da stage seguinte = a "linha").
// Run: bun run scripts/_bracket.ts <code=CARA> [proper]
import { and, asc, eq } from "drizzle-orm"

import { db } from "../src/db/client"
import { league, match, season, team } from "../src/db/schema"

const CODE = (process.argv[2] ?? "CARA").toUpperCase()
const PROPER_ONLY = process.argv[3] === "proper"

const [lg] = await db.select().from(league).where(eq(league.code, CODE))
if (!lg) throw new Error(`liga ${CODE} não sincronizada`)
const [s] = await db.select().from(season).where(and(eq(season.leagueCode, CODE), eq(season.isCurrent, true)))
if (!s) throw new Error(`sem season current p/ ${CODE}`)

const names = new Map<string, string>()
for (const t of await db.select().from(team)) names.set(t.id, t.name)

const rows = await db
  .select()
  .from(match)
  .where(eq(match.seasonId, s.id))
  .orderBy(asc(match.stageOrder), asc(match.date))

// Agrupa por stage (na ordem do bracket).
const stages = new Map<number, { name: string; order: number; ties: typeof rows }>()
for (const m of rows) {
  if (PROPER_ONLY && m.stageTypeId !== 224) continue
  const k = m.stageOrder ?? 0
  if (!stages.has(k)) stages.set(k, { name: m.stageName ?? "?", order: k, ties: [] })
  stages.get(k)!.ties.push(m)
}
const ordered = [...stages.values()].sort((a, b) => a.order - b.order)

console.log(`\n🏆 ${lg.name} ${s.name} — ${rows.length} jogos · ${ordered.length} stages\n`)
for (const st of ordered) {
  const dec = st.ties.filter((t) => t.winnerTeamId).length
  console.log(`━━ [${st.order}] ${st.name} — ${st.ties.length} confrontos (${dec} decididos) ━━`)
  for (const t of st.ties.slice(0, 6)) {
    const h = names.get(t.homeTeamId) ?? "?"
    const a = names.get(t.awayTeamId) ?? "?"
    const sc = t.ftHome != null ? `${t.ftHome}-${t.ftAway}` : "—"
    const w = t.winnerTeamId ? names.get(t.winnerTeamId) ?? "?" : "?"
    const pen = /penalties/i.test(t.resultInfo ?? "") ? " (pên)" : ""
    console.log(`   ${h} ${sc} ${a}${pen}  →  ✅ ${w}`)
  }
  if (st.ties.length > 6) console.log(`   … +${st.ties.length - 6}`)
}

// PROGRESSÃO: pra cada confronto decidido, acha o confronto da PRÓXIMA stage que contém o vencedor.
// É a "linha" do bracket (winner → próximo jogo), computada sem o endpoint de brackets.
console.log(`\n── progressão computada (amostra das stages finais) ──`)
for (let i = 0; i < ordered.length - 1; i++) {
  const cur = ordered[i]!, next = ordered[i + 1]!
  if (next.ties.length > 4) continue // só mostra as fases finais (curtas)
  for (const t of cur.ties) {
    if (!t.winnerTeamId) continue
    const child = next.ties.find((n) => n.homeTeamId === t.winnerTeamId || n.awayTeamId === t.winnerTeamId)
    if (child) console.log(`   ${names.get(t.winnerTeamId)} (${cur.name}) → ${next.name}: ${names.get(child.homeTeamId)} vs ${names.get(child.awayTeamId)}`)
  }
}
process.exit(0)
