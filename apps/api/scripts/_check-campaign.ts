/**
 * Prova da campanha por país (LIG-012 P6): `concurrentSeasonIds` tem de continuar cruzando
 * PL + FA Cup + Carabao (feature do LIG-011, valor conhecido = 3) e, ao mesmo tempo, NÃO deixar a
 * Série A entrar na campanha inglesa só por dividir o mesmo `startYear`.
 */
import { eq, sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { season } from "../src/db/schema"
import { concurrentSeasonIds } from "../src/modules/leagues/shared/shared"

let ok = 0
let total = 0
function check(pass: boolean, label: string, detail: string): void {
  total++
  if (pass) ok++
  console.log(`${pass ? "OK  " : "FAIL"} ${label} — ${detail}`)
}

async function seasonIdOf(smId: number): Promise<string> {
  const [row] = await db.select({ id: season.id }).from(season).where(eq(season.sportmonksSeasonId, smId)).limit(1)
  if (!row) throw new Error(`season ${smId} ausente no banco`)
  return row.id
}

async function describe(ids: string[]): Promise<string> {
  const r: unknown = await db.execute(sql`select league_code, name from season where id = any(${sql.raw(`ARRAY['${ids.join("','")}']::uuid[]`)}) order by league_code`)
  const rows = (Array.isArray(r) ? r : ((r as { rows: unknown[] }).rows ?? [])) as { league_code: string; name: string }[]
  return rows.map((x) => `${x.league_code} ${x.name}`).join(" · ")
}

// PL 2025/2026 — o número 3 é o que o LIG-011 registrou (PL + FA Cup + Carabao, mesma campanha inglesa).
const plIds = await concurrentSeasonIds(await seasonIdOf(25583))
check(plIds.length === 3, "concurrentSeasonIds(PL 2025/2026) = 3 (LIG-011 intacto)", `n=${plIds.length} → ${await describe(plIds)}`)

// Série A 2025 — sozinha: nenhuma copa brasileira ingerida, e a PL não pode vazar para cá.
const braIds = await concurrentSeasonIds(await seasonIdOf(25184))
check(braIds.length === 1, "concurrentSeasonIds(BRA 2025) = 1", `n=${braIds.length} → ${await describe(braIds)}`)

// Borda explícita do plano: mesmo `startYear`, países diferentes → campanhas separadas.
const crossed = plIds.filter((id) => braIds.includes(id))
check(crossed.length === 0, "PL 2025/26 e BRA 2025 não compartilham season (mesmo startYear, países diferentes)", `interseção=${crossed.length}`)

// PL 2024/2025 segue com a própria campanha (não deve puxar as copas de 2025/26).
const plOldIds = await concurrentSeasonIds(await seasonIdOf(23614))
check(plOldIds.length === 1, "concurrentSeasonIds(PL 2024/2025) = 1", `n=${plOldIds.length} → ${await describe(plOldIds)}`)

console.log(`\n${ok}/${total}`)
process.exit(ok === total ? 0 : 1)
