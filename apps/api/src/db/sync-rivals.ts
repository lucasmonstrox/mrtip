import { and, eq, notInArray } from "drizzle-orm"

import { db } from "./client"
import { team, teamRival } from "./schema"
import { slugify } from "./slug"
import { sm } from "../lib/sportmonks"

// One directed rival edge from SportMonks `/rivals/teams/{id}?include=rival`.
export type SmRivalEdge = {
  sport_id: number
  team_id: number
  rival_id: number
  id?: number
  rival?: {
    id: number
    name: string
    short_code?: string | null
    image_path?: string | null
  }
}

export type IngestRivalsResult = { edges: number; stubs: number; errors: number }

export type IngestRivalsOpts = {
  /** Override do fetch SportMonks — só pra prova T5b (forçar erro sem wipe). */
  fetchRivals?: (sportmonksTeamId: number) => Promise<SmRivalEdge[]>
}

/**
 * Ingest directed SportMonks rival edges for the given teams (smId → uuid). Creates stub `team`
 * rows for out-of-league rivals (slug ends with `-{smId}`); never auto-mirrors; never clobbers
 * `source='manual'`; prunes orphan `sportmonks` edges only after a successful fetch.
 * @feature SIN-007
 */
export async function ingestTeamRivals(
  teamIdBySm: Map<number, string>,
  opts?: IngestRivalsOpts,
): Promise<IngestRivalsResult> {
  let edges = 0
  let stubs = 0
  let errors = 0
  const fetchRivals =
    opts?.fetchRivals ??
    ((smTeamId: number) => sm<SmRivalEdge[]>(`/rivals/teams/${smTeamId}?include=rival`))

  const entries = [...teamIdBySm.entries()]
  for (const [smTeamId, teamId] of entries) {
    let rows: SmRivalEdge[]
    try {
      const data = await fetchRivals(smTeamId)
      if (!Array.isArray(data)) {
        console.warn(`rivals ${smTeamId}: data não é array — skip (sem prune)`)
        errors += 1
        continue
      }
      rows = data
    } catch (err) {
      console.warn(`rivals ${smTeamId}: ${(err as Error).message} — skip (sem prune)`)
      errors += 1
      continue
    }

    const keepRivalIds: string[] = []

    for (const edge of rows) {
      const rivalSmId = edge.rival_id
      if (!rivalSmId || rivalSmId === smTeamId) continue

      let rivalUuid = teamIdBySm.get(rivalSmId)
      if (!rivalUuid) {
        const [existing] = await db
          .select({ id: team.id })
          .from(team)
          .where(eq(team.sportmonksTeamId, rivalSmId))
          .limit(1)
        if (existing) {
          rivalUuid = existing.id
        } else {
          const name = edge.rival?.name ?? `team ${rivalSmId}`
          const [created] = await db
            .insert(team)
            .values({
              sportmonksTeamId: rivalSmId,
              name,
              slug: `${slugify(name)}-${rivalSmId}`,
              shortCode: edge.rival?.short_code ?? null,
              logoUrl: null,
            })
            .returning({ id: team.id })
          rivalUuid = created!.id
          stubs += 1
        }
        teamIdBySm.set(rivalSmId, rivalUuid)
      }

      const [existingEdge] = await db
        .select({ source: teamRival.source })
        .from(teamRival)
        .where(and(eq(teamRival.teamId, teamId), eq(teamRival.rivalTeamId, rivalUuid)))
        .limit(1)

      if (existingEdge?.source === "manual") {
        // Curadoria > API — não clobber e não entra no keep (prune só toca sportmonks).
        continue
      }

      keepRivalIds.push(rivalUuid)
      await db
        .insert(teamRival)
        .values({ teamId, rivalTeamId: rivalUuid, source: "sportmonks" })
        .onConflictDoUpdate({
          target: [teamRival.teamId, teamRival.rivalTeamId],
          set: { source: "sportmonks" },
        })
      edges += 1
    }

    // Prune só após fetch OK: remove arestas sportmonks que a API deixou de listar.
    if (keepRivalIds.length === 0) {
      await db
        .delete(teamRival)
        .where(and(eq(teamRival.teamId, teamId), eq(teamRival.source, "sportmonks")))
    } else {
      await db
        .delete(teamRival)
        .where(
          and(
            eq(teamRival.teamId, teamId),
            eq(teamRival.source, "sportmonks"),
            notInArray(teamRival.rivalTeamId, keepRivalIds),
          ),
        )
    }
  }

  return { edges, stubs, errors }
}
