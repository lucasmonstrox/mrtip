/**
 * Mede a COBERTURA do `tie_breaker_rule_id` na assinatura: de todas as seasons que o plano enxerga,
 * quantas declaram a regra de desempate e qual a distribuição dos tipos. Decide se o campo pode
 * DIRIGIR o comparador da classificação ou se serve só como enfeite/validação.
 */
import { env } from "../src/env"

type SmSeason = { id: number; league_id: number; name: string; tie_breaker_rule_id: number | null }
type SmType = { id: number; name: string; model_type: string }

async function pages<T>(base: string): Promise<T[]> {
  const out: T[] = []
  for (let page = 1; page <= 100; page++) {
    const u = new URL(base)
    u.searchParams.set("api_token", env.sportmonksApiKey!)
    u.searchParams.set("page", String(page))
    const body = (await (await fetch(u.toString())).json()) as { data?: T[]; pagination?: { has_more: boolean } }
    if (!body.data) break
    out.push(...body.data)
    if (!body.pagination?.has_more) break
  }
  return out
}

const types = await pages<SmType>("https://api.sportmonks.com/v3/core/types")
const tbName = new Map(types.filter((t) => t.model_type === "tie_breaker_rule").map((t) => [t.id, t.name]))

const seasons = await pages<SmSeason>("https://api.sportmonks.com/v3/football/seasons")
const leagues = await pages<{ id: number; name: string }>("https://api.sportmonks.com/v3/football/leagues")
const leagueName = new Map(leagues.map((l) => [l.id, l.name]))

const withRule = seasons.filter((s) => s.tie_breaker_rule_id != null)
console.log(`seasons visíveis no plano: ${seasons.length}`)
console.log(`com tie_breaker_rule_id: ${withRule.length} (${((withRule.length / seasons.length) * 100).toFixed(1)}%)`)
console.log(`nulas: ${seasons.length - withRule.length}`)

const dist = new Map<number, number>()
for (const s of withRule) dist.set(s.tie_breaker_rule_id!, (dist.get(s.tie_breaker_rule_id!) ?? 0) + 1)
console.log("\ndistribuição dos tipos:")
for (const [id, n] of [...dist.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(id).padStart(6)} | ${n.toString().padStart(3)} seasons | ${tbName.get(id) ?? "?? (não é tie_breaker_rule!)"}`)
}

console.log("\npor liga (todas as seasons visíveis):")
const byLeague = new Map<number, SmSeason[]>()
for (const s of seasons) byLeague.set(s.league_id, [...(byLeague.get(s.league_id) ?? []), s])
for (const [lid, ss] of byLeague) {
  const linha = ss
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((s) => `${s.name}=${s.tie_breaker_rule_id ?? "null"}`)
    .join(" ")
  console.log(`  ${(leagueName.get(lid) ?? `league ${lid}`).padEnd(22)} ${linha}`)
}

process.exit(0)
