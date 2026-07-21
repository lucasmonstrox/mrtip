/**
 * Prova da coluna de desempate por temporada (LIG-017 P1/P2): confere que
 * `season.sportmonks_tie_breaker_rule_id` existe com o tipo certo e que as temporadas ingeridas por
 * caminho que fala com a SportMonks têm a regra preenchida (A1 do plano).
 *
 * Não há `psql` nesta máquina — a consulta vai por `db` + `sql` cru, como fazem os `_probe-tiebreaker*.ts`.
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"

// 1) A coluna existe e é integer nullable (expand puro — a ponte local não preenche).
const cols = (
  await db.execute(
    sql.raw(`select column_name, data_type, is_nullable
             from information_schema.columns
             where table_name = 'season' and column_name = 'sportmonks_tie_breaker_rule_id'`),
  )
).rows as { column_name: string; data_type: string; is_nullable: string }[]

const col = cols[0]
if (!col) {
  console.log("FAIL coluna sportmonks_tie_breaker_rule_id não existe na tabela season")
  process.exit(1)
}
console.log(`OK ${col.column_name} ${col.data_type} (nullable=${col.is_nullable})`)

// 2) Cobertura do dado: cada temporada ingerida e a regra que ela declara.
const seasons = (
  await db.execute(
    sql.raw(`select league_code, name, sportmonks_season_id, sportmonks_tie_breaker_rule_id
             from season order by league_code, start_year`),
  )
).rows as {
  league_code: string
  name: string
  sportmonks_season_id: number
  sportmonks_tie_breaker_rule_id: number | null
}[]

console.log(`\nregra por temporada (${seasons.length} linhas):`)
for (const s of seasons) {
  console.log(
    `  ${s.league_code.padEnd(5)} ${String(s.name).padEnd(10)} sm=${String(s.sportmonks_season_id).padEnd(6)} → ${s.sportmonks_tie_breaker_rule_id ?? "null"}`,
  )
}

const nulls = seasons.filter((s) => s.sportmonks_tie_breaker_rule_id == null)
console.log(`\n${nulls.length} null`)
for (const s of nulls) console.log(`  null: ${s.league_code} ${s.name}`)

process.exit(0)
