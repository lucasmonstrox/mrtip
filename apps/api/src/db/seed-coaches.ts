import { eq, isNotNull } from "drizzle-orm"

import { db } from "./client"
import { escalacao, tecnico } from "./schema"

/**
 * Normaliza técnicos a partir do que já está em `escalacao.tecnico` (nome) — SEM API/quota.
 * Cria as entidades `tecnico` (por nome) e liga cada escalação via `tecnicoId`. O
 * `apiFootballCoachId` fica null até um (re)backfill de lineups trazer o coach.id.
 *
 * Uso: bun run src/db/seed-coaches.ts
 */
const nomes = await db
  .selectDistinct({ nome: escalacao.tecnico })
  .from(escalacao)
  .where(isNotNull(escalacao.tecnico))
const limpos = nomes.map((n) => n.nome!).filter(Boolean)

if (limpos.length) {
  await db
    .insert(tecnico)
    .values(limpos.map((nome) => ({ nome })))
    .onConflictDoNothing({ target: tecnico.nome })
}

const tecnicos = await db.select({ id: tecnico.id, nome: tecnico.nome }).from(tecnico)
for (const t of tecnicos) {
  await db.update(escalacao).set({ tecnicoId: t.id }).where(eq(escalacao.tecnico, t.nome))
}

console.log(`✅ ${tecnicos.length} técnicos normalizados e ligados às escalações.`)
process.exit(0)
