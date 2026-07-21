/**
 * Backfill dos 6 stats defensivos novos (LIG-003) nos jogos JÁ ingeridos, sem re-rodar o sync
 * inteiro. Busca só `include=lineups.details` e preenche error_lead_to_goal (571),
 * penalties_committed (114), penalties_won (115), offsides_provoked (95), turnovers (121) e
 * clearance_offline (582) em lineup_player. Idempotente.
 *
 * Esses types são ESPARSOS — só vêm na resposta quando o evento aconteceu (pênalti cometido
 * aparece em 22% dos jogos). Por isso o backfill escreve null->valor onde houve e deixa o
 * resto null, que continua significando "0 ou não jogou", igual às outras colunas da tabela.
 *
 *   bun run scripts/backfill-defensive-stats.ts
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { STAT } from "../src/db/sync-ingest"
import { sm } from "../src/lib/sportmonks"

const BATCH = 25
const NOVOS = {
  error_lead_to_goal: STAT.errorLeadToGoal,
  penalties_committed: STAT.penaltiesCommitted,
  penalties_won: STAT.penaltiesWon,
  offsides_provoked: STAT.offsidesProvoked,
  turnovers: STAT.turnovers,
  clearance_offline: STAT.clearanceOffline,
} as const
const COLS = Object.keys(NOVOS) as Array<keyof typeof NOVOS>

type Row = { lp_id: string; sm_player: number; fx: number }
const rows = (
  await db.execute(
    sql.raw(`
      select lp.id as lp_id, p.sportmonks_player_id as sm_player, m.sportmonks_fixture_id as fx
      from lineup_player lp
      join lineup l on l.id = lp.lineup_id
      join match m on m.id = l.match_id
      join player p on p.id = lp.player_id
      where m.sportmonks_fixture_id is not null
    `),
  )
).rows as Row[]

// (fixture, jogador) -> id da linha em lineup_player, pra escrever direto sem re-resolver nada.
const lpByKey = new Map<string, string>(rows.map((r) => [`${Number(r.fx)}:${Number(r.sm_player)}`, r.lp_id]))
const fixtures = [...new Set(rows.map((r) => Number(r.fx)))]
console.log(`jogos a varrer: ${fixtures.length} (${rows.length} linhas de lineup_player)`)

type SmLineup = { player_id: number; details?: { type_id: number; data?: { value?: unknown } }[] }
let escritas = 0
const porCol = new Map<string, number>(COLS.map((c) => [c, 0]))

for (let i = 0; i < fixtures.length; i += BATCH) {
  const chunk = fixtures.slice(i, i + BATCH)
  const fx = await sm<{ id: number; lineups?: SmLineup[] }[]>(
    `/fixtures/multi/${chunk.join(",")}?include=lineups.details`,
  )

  const tuplas: string[] = []
  for (const f of fx) {
    for (const l of f.lineups ?? []) {
      const lpId = lpByKey.get(`${f.id}:${l.player_id}`)
      if (!lpId) continue
      const vals = COLS.map((c) => {
        const d = (l.details ?? []).find((x) => x.type_id === NOVOS[c])
        const v = d?.data?.value
        if (typeof v !== "number") return "null"
        porCol.set(c, (porCol.get(c) ?? 0) + 1)
        return String(Math.trunc(v))
      })
      // só escreve a linha se ao menos um dos 6 tem valor — evita UPDATE inútil em 90% das linhas
      if (vals.every((v) => v === "null")) continue
      tuplas.push(`('${lpId}'::uuid, ${vals.join(", ")})`)
    }
  }

  if (tuplas.length > 0) {
    await db.execute(
      sql.raw(`
        update lineup_player lp set
          ${COLS.map((c) => `${c} = v.${c}::integer`).join(",\n          ")}
        from (values ${tuplas.join(", ")}) as v(id, ${COLS.join(", ")})
        where lp.id = v.id
      `),
    )
    escritas += tuplas.length
  }
  console.log(`  ${Math.min(i + BATCH, fixtures.length)}/${fixtures.length} jogos — ${escritas} linhas escritas`)
}

const [tot] = (
  await db.execute(
    sql.raw(`select ${COLS.map((c) => `sum(${c})::int as ${c}`).join(", ")},
                    ${COLS.map((c) => `count(${c})::int as n_${c}`).join(", ")}
             from lineup_player`),
  )
).rows as Record<string, number>[]

console.log(`\n✓ ${escritas} linhas de lineup_player atualizadas`)
console.log(`\ncoluna                | linhas c/ dado | soma`)
for (const c of COLS) console.log(`${c.padEnd(21)} | ${String(tot?.[`n_${c}`] ?? 0).padStart(14)} | ${tot?.[c] ?? 0}`)
process.exit(0)
