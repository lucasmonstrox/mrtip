/**
 * Backfill do árbitro nos jogos JÁ ingeridos, sem re-rodar o sync inteiro. Busca só
 * `include=referees.referee` (nada de escalação/trends/narração/R2 além da foto do árbitro) e
 * preenche `referee` + `match.refereeId`. Idempotente: pode rodar quantas vezes quiser.
 *
 * Feito pro deploy do SIN-009 em prod, onde re-sincronizar 6 seasons inteiras reescreveria muito
 * mais superfície do que a feature precisa.
 *
 *   bun run scripts/backfill-referees.ts            # todos os jogos
 *   bun run scripts/backfill-referees.ts --only-missing   # só quem ainda não tem árbitro
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { ingestReferees, type SmRefereeLink } from "../src/db/sync-ingest"
import { sm } from "../src/lib/sportmonks"

const ONLY_MISSING = process.argv.includes("--only-missing")
const BATCH = 25

type Row = { id: string; fx: number }
const rows = (
  await db.execute(
    sql.raw(`
      select m.id, m.sportmonks_fixture_id as fx
      from match m
      where m.sportmonks_fixture_id is not null
        ${ONLY_MISSING ? "and m.referee_id is null" : ""}
      order by m.date
    `),
  )
).rows as Row[]

console.log(`jogos a varrer: ${rows.length}${ONLY_MISSING ? " (só sem árbitro)" : ""}`)

const matchIdByFixture = new Map<number, string>(rows.map((r) => [Number(r.fx), r.id]))
const ids = [...matchIdByFixture.keys()]
let appointed = 0
let people = 0

for (let i = 0; i < ids.length; i += BATCH) {
  const chunk = ids.slice(i, i + BATCH)
  const fixtures = await sm<{ id: number; referees?: SmRefereeLink[] }[]>(
    `/fixtures/multi/${chunk.join(",")}?include=referees.referee`,
  )
  const r = await ingestReferees(fixtures, matchIdByFixture)
  appointed += r.appointed
  people += r.people
  console.log(`  ${Math.min(i + BATCH, ids.length)}/${ids.length} — +${r.appointed} designados`)
}

const [after] = (
  await db.execute(
    sql.raw(`select (select count(*)::int from referee) as catalogo,
                    (select count(*)::int from match where referee_id is not null) as com_arbitro`),
  )
).rows as { catalogo: number; com_arbitro: number }[]

console.log(`\n✓ ${appointed} designações escritas nesta rodada`)
console.log(`  catálogo: ${after?.catalogo} árbitros · jogos com árbitro: ${after?.com_arbitro}`)
process.exit(0)
