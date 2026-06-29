// One-time bridge (LIG-008 P2): create the current `season` row from the existing `league` row and
// tag every existing `match`/`standing` with it. Idempotent. After the sync becomes season-aware
// (P7), a fresh `db:reset` no longer needs this — it only bridges data that predates seasonId.
import { isNull, sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { league, match, season, standing } from "../src/db/schema"

const [lg] = await db.select().from(league)
if (!lg) throw new Error("no league row to backfill from")

// startYear from the season name ("2025/2026" → 2025).
const startYear = Number(lg.season.slice(0, 4))
if (!Number.isFinite(startYear)) throw new Error(`cannot parse start year from "${lg.season}"`)

// Upsert the current season (by sportmonksSeasonId) and mark it current.
const [s] = await db
  .insert(season)
  .values({
    sportmonksSeasonId: lg.sportmonksSeasonId,
    leagueCode: lg.code,
    name: lg.season,
    startYear,
    isCurrent: true,
  })
  .onConflictDoUpdate({
    target: season.sportmonksSeasonId,
    set: { leagueCode: lg.code, name: lg.season, startYear, isCurrent: true },
  })
  .returning({ id: season.id })

const seasonId = s!.id
console.log(`season: ${lg.season} (${lg.sportmonksSeasonId}) → ${seasonId} [isCurrent]`)

// Tag only the still-null rows (idempotent).
const m = await db.update(match).set({ seasonId }).where(isNull(match.seasonId)).returning({ id: match.id })
const st = await db.update(standing).set({ seasonId }).where(isNull(standing.seasonId)).returning({ id: standing.id })
console.log(`tagged match: ${m.length}, standing: ${st.length}`)

const [chk] = await db
  .select({
    matchNull: sql<number>`count(*) filter (where ${match.seasonId} is null)`,
  })
  .from(match)
const [chkS] = await db
  .select({ standingNull: sql<number>`count(*) filter (where ${standing.seasonId} is null)` })
  .from(standing)
console.log(`remaining null → match: ${chk!.matchNull}, standing: ${chkS!.standingNull}`)

process.exit(0)
