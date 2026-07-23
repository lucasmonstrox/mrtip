/**
 * Seed manual dos buracos conhecidos da SportMonks no Brasileirão (SIN-007 fase 2 mini).
 * Não clobberra arestas já existentes; source='manual'. Idempotente.
 *
 *   bun run scripts/seed-rivals-manual-bra.ts
 */
import { and, eq, sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { team, teamRival } from "../src/db/schema"

// Pares dirigidos A→B (e, quando marcado, também B→A). Nomes exatamente como em `team.name`.
const PAIRS: { from: string; to: string; bothWays?: boolean }[] = [
  // Botafogo: SM não lista outbound nem inbound — clássicos cariocas
  { from: "Botafogo", to: "Flamengo", bothWays: true },
  { from: "Botafogo", to: "Fluminense", bothWays: true },
  { from: "Botafogo", to: "Vasco da Gama", bothWays: true },
  // Grêmio: SM só tem Inter→Grêmio; completa o espelho + clássicos gaúchos úteis
  { from: "Grêmio", to: "Internacional" },
  // Flamengo: SM só inbound (Flu/Vasco); completa outbound dos clássicos
  { from: "Flamengo", to: "Fluminense" },
  { from: "Flamengo", to: "Vasco da Gama" },
  // Corinthians: SM só inbound; completa outbound do trio paulista
  { from: "Corinthians", to: "Palmeiras" },
  { from: "Corinthians", to: "São Paulo" },
  { from: "Corinthians", to: "Santos" },
]

async function teamIdByName(name: string): Promise<string | null> {
  const [row] = await db.select({ id: team.id }).from(team).where(eq(team.name, name)).limit(1)
  return row?.id ?? null
}

async function upsertManual(fromId: string, toId: string): Promise<"inserted" | "skipped"> {
  if (fromId === toId) return "skipped"
  const [existing] = await db
    .select({ source: teamRival.source })
    .from(teamRival)
    .where(and(eq(teamRival.teamId, fromId), eq(teamRival.rivalTeamId, toId)))
    .limit(1)
  if (existing) return "skipped" // não clobber sportmonks nem manual já lá
  await db.insert(teamRival).values({ teamId: fromId, rivalTeamId: toId, source: "manual" })
  return "inserted"
}

let inserted = 0
let skipped = 0
let missing = 0

for (const pair of PAIRS) {
  const fromId = await teamIdByName(pair.from)
  const toId = await teamIdByName(pair.to)
  if (!fromId || !toId) {
    console.warn(`missing team: ${pair.from}→${pair.to} (from=${!!fromId} to=${!!toId})`)
    missing += 1
    continue
  }
  const directions: [string, string][] = [[fromId, toId]]
  if (pair.bothWays) directions.push([toId, fromId])
  for (const [a, b] of directions) {
    const r = await upsertManual(a, b)
    if (r === "inserted") inserted += 1
    else skipped += 1
  }
}

const [count] = (
  await db.execute(sql.raw(`select count(*)::int as n from team_rival where source='manual'`))
).rows as { n: number }[]
console.log(`manual seed: inserted=${inserted} skipped=${skipped} missing=${missing} · total manual=${count?.n}`)
process.exit(missing > 0 && inserted === 0 ? 1 : 0)
