/**
 * Sonda de catálogo: (1) qual plano/add-ons o token tem HOJE (o envelope da SportMonks devolve
 * `subscription` em toda resposta — resolve a dúvida do trial vencido em 12/07 numa request só),
 * (2) dump completo de `core/types` paginado, salvo em JSON pra virar o inventário de métricas.
 *
 * Uso: cd apps/api && bun run scripts/_probe-catalogo.ts
 */
import { env } from "../src/env"

const BASE = "https://api.sportmonks.com/v3"
const token = env.sportmonksApiKey
if (!token) throw new Error("SPORTMONKS_API_KEY ausente no .env")

type Envelope<T> = {
  data?: T
  message?: string
  pagination?: { count: number; per_page: number; current_page: number; has_more: boolean }
  rate_limit?: { remaining: number; resets_in_seconds: number; requested_entity: string }
  subscription?: unknown
}

async function raw<T>(url: string): Promise<{ status: number; body: Envelope<T> }> {
  const u = new URL(url)
  u.searchParams.set("api_token", token!)
  const res = await fetch(u.toString())
  return { status: res.status, body: (await res.json()) as Envelope<T> }
}

// --- 1. Qual é o plano HOJE ------------------------------------------------------------------
const probe = await raw<unknown>(`${BASE}/football/leagues/8`)
console.log(`status=${probe.status}`)
console.log("SUBSCRIPTION:", JSON.stringify(probe.body.subscription, null, 2))
console.log("RATE LIMIT:", JSON.stringify(probe.body.rate_limit))
if (probe.body.message) console.log("MESSAGE:", probe.body.message)

// --- 2. Catálogo completo de types -----------------------------------------------------------
type SmType = { id: number; name: string; code?: string; developer_name?: string; model_type?: string; stat_group?: string | null }
const types: SmType[] = []
for (let page = 1; ; page++) {
  const { status, body } = await raw<SmType[]>(`${BASE}/core/types?page=${page}&per_page=100`)
  if (status !== 200 || !body.data) {
    console.log(`core/types page ${page} → ${status} ${body.message ?? ""}`)
    break
  }
  types.push(...body.data)
  if (!body.pagination?.has_more) break
}
console.log(`\ncore/types: ${types.length} types`)

// Agrupa por model_type + stat_group — é isso que diz a QUE ENTIDADE cada métrica pertence.
const byModel = new Map<string, number>()
const byGroup = new Map<string, number>()
for (const t of types) {
  const m = t.model_type ?? "(sem model_type)"
  const g = t.stat_group ?? "(sem stat_group)"
  byModel.set(m, (byModel.get(m) ?? 0) + 1)
  byGroup.set(g, (byGroup.get(g) ?? 0) + 1)
}
console.log("\nPor model_type:")
for (const [k, v] of [...byModel.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${v.toString().padStart(5)}  ${k}`)
console.log("\nPor stat_group:")
for (const [k, v] of [...byGroup.entries()].sort((a, b) => b[1] - a[1])) console.log(`  ${v.toString().padStart(5)}  ${k}`)

await Bun.write("scripts/output/core-types.json", JSON.stringify(types, null, 2))
console.log("\n→ scripts/output/core-types.json")
