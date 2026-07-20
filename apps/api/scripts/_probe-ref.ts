/**
 * Sonda a cobertura de árbitro (include=referees) em jogos JÁ ENCERRADOS de cada competição
 * ingerida — um probe por season sem filtro de estado pega fixtures futuros, onde o árbitro
 * ainda não foi escalado, e reporta falso negativo. Evidência pro SIN-009 (arbitragem).
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { sm } from "../src/lib/sportmonks"

type SmRef = { referee_id: number; type_id: number }
type SmFixtureRefs = { id: number; referees?: SmRef[] }

const rows = (
  await db.execute(
    sql.raw(`
      select s.league_code, m.sportmonks_fixture_id
      from match m join season s on s.id = m.season_id
      where m.ft_home is not null
      order by s.league_code, m.date desc
    `),
  )
).rows as { league_code: string; sportmonks_fixture_id: number }[]

const byLeague = new Map<string, number[]>()
for (const r of rows) {
  const arr = byLeague.get(r.league_code) ?? []
  if (arr.length < 12) arr.push(Number(r.sportmonks_fixture_id))
  byLeague.set(r.league_code, arr)
}

for (const [code, ids] of byLeague) {
  const data = await sm<SmFixtureRefs[]>(`/fixtures/multi/${ids.join(",")}?include=referees`)
  const withMain = data.filter((f) => (f.referees ?? []).some((x) => x.type_id === 6))
  const sample = withMain.slice(0, 3).map((f) => f.referees?.find((x) => x.type_id === 6)?.referee_id)
  console.log(`${code}: ${data.length} encerrados amostrados | com principal (type 6): ${withMain.length} | referee_ids: ${sample.join(",")}`)
}

process.exit(0)
