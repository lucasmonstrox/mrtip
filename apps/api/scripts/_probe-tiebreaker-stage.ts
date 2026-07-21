/**
 * A entidade Stage da SportMonks também tem `tie_breaker_rule_id`. Se o estágio divergir da temporada,
 * modelar o desempate na `season` seria perder informação (o Brasileirão tem fases; copas têm grupos).
 * Este probe compara os dois níveis nas competições ingeridas.
 */
import { env } from "../src/env"

type SmStage = { id: number; name: string; tie_breaker_rule_id: number | null; type_id: number }

async function get<T>(path: string): Promise<T | undefined> {
  const u = new URL(`https://api.sportmonks.com/v3/football${path}`)
  u.searchParams.set("api_token", env.sportmonksApiKey!)
  const body = (await (await fetch(u.toString())).json()) as { data?: T }
  return body.data
}

const SEASONS: [string, number][] = [
  ["BRA 2026", 26763],
  ["BRA 2025", 25184],
  ["PL 25/26", 25583],
  ["PL 24/25", 23614],
  ["FA Cup", 25919],
  ["Carabao", 25654],
]

for (const [label, id] of SEASONS) {
  const season = await get<{ tie_breaker_rule_id: number | null }>(`/seasons/${id}`)
  const stages = (await get<SmStage[]>(`/stages/seasons/${id}`)) ?? []
  const divergem = stages.filter((s) => s.tie_breaker_rule_id !== season?.tie_breaker_rule_id)
  console.log(`\n${label} — season=${season?.tie_breaker_rule_id ?? "null"} | ${stages.length} estágios`)
  for (const s of stages) {
    const flag = s.tie_breaker_rule_id !== season?.tie_breaker_rule_id ? "  <-- DIVERGE" : ""
    console.log(`  stage ${s.id} "${s.name}" → ${s.tie_breaker_rule_id ?? "null"}${flag}`)
  }
  if (stages.length && !divergem.length) console.log("  (todos batem com a season)")
}

process.exit(0)
