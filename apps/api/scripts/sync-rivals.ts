/**
 * Backfill de rivalidades SportMonks para todos os times que têm standing (PL + BRA + …).
 * Idempotente — re-rodar só refresca arestas `sportmonks` e preserva `manual`.
 *
 *   bun run scripts/sync-rivals.ts
 */
import { eq } from "drizzle-orm"

import { db } from "../src/db/client"
import { standing, team } from "../src/db/schema"
import { ingestTeamRivals } from "../src/db/sync-rivals"

const rows = await db
  .select({ id: team.id, sportmonksTeamId: team.sportmonksTeamId })
  .from(team)
  .innerJoin(standing, eq(standing.teamId, team.id))

const teamIdBySm = new Map<number, string>()
for (const r of rows) {
  if (!teamIdBySm.has(r.sportmonksTeamId)) teamIdBySm.set(r.sportmonksTeamId, r.id)
}

console.log(`times com standing: ${teamIdBySm.size}`)
const result = await ingestTeamRivals(teamIdBySm)
console.log(`rivals: ${result.edges} edges (${result.stubs} stubs) · errors=${result.errors}`)
process.exit(result.errors > 0 && result.edges === 0 ? 1 : 0)
