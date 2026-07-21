import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
import { env } from "../src/env"
import { readFileSync } from "fs"

// Decodifica type_id → nome usando o catálogo local (1310 core/types), pra não depender
// do include `.type` (que a doc recomenda evitar e nem sempre vem populado).
const coreTypes = JSON.parse(readFileSync(new URL("./output/core-types.json", import.meta.url), "utf8")) as Array<{
  id: number
  name: string
}>
const typeName = new Map(coreTypes.map((t) => [t.id, t.name]))
const nameOf = (id: number) => typeName.get(id) ?? "(fora do core-types.json)"

/**
 * Sonda a fronteira real do plano SportMonks (Starter Advanced + Match Facts) e o que
 * ainda não inventariamos: rollups de season (statistics.details), details de standings
 * (xPTS etc.), topscorers oficiais, e acesso a xG/odds/predictions/pressure/match-facts/
 * periods.statistics/ballCoordinates num fixture real da PL. Reporta status HTTP e
 * mensagem de erro de cada sonda sem deixar o script morrer no primeiro 403.
 */

const LEAGUE_ID = 8
const SEASON_ID = 25583
const BASE = "https://api.sportmonks.com/v3/football"

function token(): string {
  const t = env.sportmonksApiKey
  if (!t) throw new Error("SPORTMONKS_API_KEY ausente")
  return t
}

type ProbeResult = {
  label: string
  path: string
  status: number | "fetch-error"
  ok: boolean
  message?: string
  extra?: unknown
}

const results: ProbeResult[] = []
// Cada entidade (Fixture, Stage, MatchFact, ...) tem cota própria — registra a última
// observação de cada uma, não só a última chamada.
const rateLimitByEntity = new Map<string, { remaining: number; resets_in_seconds: number }>()

/** GET cru contra a API, sem lançar — devolve status + body pra sonda decidir o que reportar. */
async function rawGet(path: string): Promise<{ status: number; body: any }> {
  const url = new URL(path.startsWith("http") ? path : BASE + path)
  if (!url.searchParams.has("api_token")) url.searchParams.set("api_token", token())
  const res = await fetch(url.toString())
  let body: any = null
  try {
    body = await res.json()
  } catch {
    body = { message: "resposta não-JSON" }
  }
  if (body?.rate_limit?.requested_entity) {
    rateLimitByEntity.set(body.rate_limit.requested_entity, {
      remaining: body.rate_limit.remaining,
      resets_in_seconds: body.rate_limit.resets_in_seconds,
    })
  }
  return { status: res.status, body }
}

async function probe(label: string, path: string, onOk?: (body: any) => unknown): Promise<void> {
  try {
    const { status, body } = await rawGet(path)
    const ok = status >= 200 && status < 300 && body?.data !== undefined
    const extra = ok && onOk ? onOk(body.data) : undefined
    results.push({ label, path, status, ok, message: body?.message, extra })
    console.log(`[${ok ? "OK" : "FAIL"}] ${label} → ${status}${ok ? "" : ` — ${body?.message ?? "sem mensagem"}`}`)
    if (extra !== undefined) console.log(`       ${JSON.stringify(extra)}`)
  } catch (e) {
    results.push({ label, path, status: "fetch-error", ok: false, message: (e as Error).message })
    console.log(`[ERR ] ${label} → fetch-error — ${(e as Error).message}`)
  }
}

// ---------------------------------------------------------------------------
console.log("== 1. /seasons/:id?include=statistics.type — rollups de season ==")
// `statistics.details.type` não existe nesse endpoint (SeasonStatistic não tem `details`,
// o valor já vem agregado em `value`). O include documentado é `statistics.type`.
await probe("season.statistics", `/seasons/${SEASON_ID}?include=statistics.type`, (data) => {
  const stats = data.statistics ?? []
  const typeIds = new Set<number>(stats.map((s: any) => s.type_id))
  return {
    n_statistics_blocks: stats.length,
    n_distinct_types: typeIds.size,
    types: [...typeIds].map((id) => `${id}:${nameOf(id)}`),
    sample_values: stats.slice(0, 3).map((s: any) => ({ type_id: s.type_id, name: nameOf(s.type_id), relation_id: s.relation_id, value: s.value })),
  }
})

// ---------------------------------------------------------------------------
console.log("\n== 2. /standings/seasons/:id?include=details.type — xPTS (7393) e outros details ==")
await probe("standings.details", `/standings/seasons/${SEASON_ID}?include=details.type`, (data) => {
  const arr = Array.isArray(data) ? data : [data]
  const typeIds = new Map<number, string>()
  let nDetails = 0
  for (const row of arr) {
    for (const d of row.details ?? []) {
      nDetails++
      const name = d.type?.name ?? `type_${d.type_id}`
      typeIds.set(d.type_id, name)
    }
  }
  return {
    n_standing_rows: arr.length,
    n_details_total: nDetails,
    n_distinct_types: typeIds.size,
    // docs SportMonks são inconsistentes sobre o type_id do xPTS (tutorial diz 7393,
    // referência "Expected types" diz 7939) — checar os dois.
    has_xpts_7393: typeIds.has(7393),
    has_xpts_7939: typeIds.has(7939),
    types: [...typeIds.entries()].map(([id, name]) => `${id}:${name}`),
  }
})

// ---------------------------------------------------------------------------
console.log("\n== 3. /topscorers/seasons/:id — artilheiros oficiais ==")
await probe("topscorers", `/topscorers/seasons/${SEASON_ID}`, (data) => {
  const arr = Array.isArray(data) ? data : [data]
  const types = new Set<number>()
  for (const row of arr) types.add(row.type_id)
  return { n_rows: arr.length, distinct_type_ids: [...types], sample: arr.slice(0, 3) }
})

// ---------------------------------------------------------------------------
console.log("\n== 0. Achando um fixture_id encerrado da PL no banco ==")
let fixtureId: number | null = null
try {
  const rows = (
    await db.execute(
      sql.raw(
        `select m.sportmonks_fixture_id as id, m.status, m.date
         from match m
         join season s on s.id = m.season_id
         where s.sportmonks_season_id = ${SEASON_ID} and m.status = 'FT'
         order by m.date desc
         limit 1`,
      ),
    )
  ).rows as any[]
  fixtureId = rows[0]?.id ?? null
  console.log(`fixture encontrado: ${fixtureId} (status=${rows[0]?.status}, date=${rows[0]?.date})`)
} catch (e: any) {
  console.log(`erro ao buscar fixture no banco: ${e.message} | causa: ${e.cause?.message}`)
}

if (!fixtureId) {
  console.log("fallback: buscando via /schedules/seasons/:id por um fixture FT")
  try {
    const { status, body } = await rawGet(`/schedules/seasons/${SEASON_ID}`)
    console.log(`  /schedules/seasons/${SEASON_ID} → ${status}`)
    const stack: any[] = Array.isArray(body?.data) ? [...body.data] : []
    outer: while (stack.length) {
      const node = stack.pop()
      if (node?.id && node?.state?.state === "FT") {
        fixtureId = node.id
        break outer
      }
      for (const round of node?.rounds ?? []) stack.push(...(round.fixtures ?? []))
      for (const f of node?.fixtures ?? []) stack.push(f)
    }
    console.log(`fixture via fallback: ${fixtureId}`)
  } catch (e) {
    console.log(`erro no fallback de schedules: ${(e as Error).message}`)
  }
}

// ---------------------------------------------------------------------------
console.log(`\n== 4. Fronteira de acesso (fixture_id=${fixtureId ?? "N/A"}) ==`)

if (fixtureId) {
  await probe("xGFixture", `/fixtures/${fixtureId}?include=xGFixture`, (data) => data.xgfixture ?? data.xGFixture ?? "campo presente mas sem xg* — ver payload cru")

  await probe("odds.pre-match", `/odds/pre-match/fixtures/${fixtureId}`, (data) => {
    const arr = Array.isArray(data) ? data : [data]
    return { n_rows: arr.length }
  })

  await probe("predictions.probabilities", `/predictions/probabilities/fixtures/${fixtureId}`, (data) => {
    const arr = Array.isArray(data) ? data : [data]
    return { n_rows: arr.length, sample: arr[0] }
  })

  await probe("pressure", `/fixtures/${fixtureId}?include=pressure`, (data) => {
    const p = data.pressure
    return { has_pressure: p !== undefined, n_entries: Array.isArray(p) ? p.length : typeof p }
  })

  // match-facts é endpoint beta com path diferente (sem /fixtures/), auth via api_token igual aos demais
  await probe("match-facts (beta)", `https://api.sportmonks.com/v3/football/match-facts/${fixtureId}`, (data) => {
    const arr = Array.isArray(data) ? data : [data]
    const typeIds = new Set<number>(arr.map((f: any) => f.type_id))
    const categories = new Set<string>(arr.map((f: any) => f.category))
    const bases = new Set<string>(arr.map((f: any) => f.basis))
    return {
      n_facts: arr.length,
      distinct_types: [...typeIds].map((id) => `${id}:${nameOf(id)}`),
      categories: [...categories],
      bases: [...bases],
    }
  })

  await probe("periods.statistics", `/fixtures/${fixtureId}?include=periods.statistics`, (data) => {
    const periods = data.periods ?? []
    const byPeriod: Record<string, string[]> = {}
    for (const p of periods) {
      const typeIds = new Set<number>()
      for (const s of p.statistics ?? []) typeIds.add(s.type_id)
      byPeriod[`period_${p.id}_(type_id=${p.type_id ?? "?"})`] = [...typeIds]
        .sort((a, b) => a - b)
        .map((id) => `${id}:${nameOf(id)}`)
    }
    return { n_periods: periods.length, types_por_periodo: byPeriod }
  })

  await probe("ballCoordinates", `/fixtures/${fixtureId}?include=ballCoordinates`, (data) => {
    const bc = data.ballcoordinates ?? data.ballCoordinates
    return { has_ballcoordinates: bc !== undefined, n_entries: Array.isArray(bc) ? bc.length : typeof bc }
  })
} else {
  console.log("nenhum fixture_id disponível — pulando sondas de fronteira de acesso")
}

// ---------------------------------------------------------------------------
console.log("\n== 5. Rate limit remanescente (por entidade — cota é per-entidade, não global) ==")
for (const [entity, rl] of rateLimitByEntity) {
  console.log(`  ${entity.padEnd(14)} remaining=${rl.remaining}  resets_in_seconds=${rl.resets_in_seconds}`)
}

console.log("\n== RESUMO ==")
for (const r of results) {
  console.log(`${r.ok ? "OK  " : "FAIL"} ${r.label.padEnd(28)} ${String(r.status).padEnd(6)} ${r.path}`)
}

process.exit(0)
