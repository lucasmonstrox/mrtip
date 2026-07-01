// Sonda a estrutura de uma COPA na SportMonks (FA Cup 24, Carabao 27) pra desenhar sync+schema+brackets.
// Pra cada liga: lista temporadas (acha a 2025/2026 concluída), e nela:
//   (1) BRACKETS — /seasons/:id/brackets → stages + edges? (edges só vêm em copa "elegível"; é o teste-chave)
//   (2) SCHEDULES — /schedules/seasons/:id → stages→rounds→fixtures (estrutura real, sempre disponível)
//   (3) amostra de 1 fixture real → campos que importam (leg, aggregate_id, placeholder, participants)
// Run: bun run scripts/_probe-cup.ts            (roda 24 e 27)
//      bun run scripts/_probe-cup.ts 24 2025/2026
import { sm } from "../src/lib/sportmonks"

const LEAGUES = process.argv[2] ? [Number(process.argv[2])] : [24, 27]
const WANT = process.argv[3] ?? "2025/2026"

type Season = { id: number; name: string; finished?: boolean; is_current?: boolean }
type League = { id: number; name: string; seasons?: Season[] }

const keys = (o: unknown) => (o && typeof o === "object" ? Object.keys(o as object).join(", ") : typeof o)
const j = (o: unknown) => JSON.stringify(o, null, 2)

for (const leagueId of LEAGUES) {
  console.log(`\n${"█".repeat(70)}\n██ LIGA ${leagueId}\n${"█".repeat(70)}`)
  let league: League
  try {
    league = await sm<League>(`/leagues/${leagueId}?include=seasons`)
  } catch (e) {
    console.log(`  ✗ /leagues/${leagueId} → ${(e as Error).message}`)
    continue
  }
  const seasons = (league.seasons ?? []).sort((a, b) => b.id - a.id)
  console.log(`${league.name} · ${seasons.length} temporadas: ${seasons.slice(0, 6).map((s) => `${s.name}[${s.id}]${s.is_current ? "*" : ""}`).join(" · ")}`)
  const target = seasons.find((s) => s.name === WANT) ?? seasons.find((s) => s.finished) ?? seasons[0]
  if (!target) { console.log("  (sem temporada)"); continue }
  console.log(`→ alvo: ${target.name} [${target.id}] (finished=${target.finished})`)

  // (1) BRACKETS — o teste de elegibilidade. edges vazio = copa não tem bracket pronto na API.
  console.log(`\n── (1) BRACKETS /seasons/${target.id}/brackets ──`)
  try {
    const br = await sm<{ stages?: { stage_id: number; stage_name: string; fixtures?: unknown[] }[]; edges?: unknown[] }>(
      `/seasons/${target.id}/brackets?include=participants;state`,
    )
    const stages = br.stages ?? []
    const edges = br.edges ?? []
    console.log(`stages: ${stages.length} · edges: ${edges.length}  ${edges.length ? "✅ TEM BRACKET" : "❌ SEM edges (inelegível p/ bracket pronto)"}`)
    for (const s of stages) console.log(`   • ${s.stage_name} [${s.stage_id}] — ${s.fixtures?.length ?? 0} fixtures`)
    if (edges.length) console.log(`   edge[0]: ${j(edges[0])}`)
  } catch (e) {
    console.log(`   ✗ brackets → ${(e as Error).message}`)
  }

  // (2) SCHEDULES — estrutura sempre disponível (stages→rounds→fixtures).
  console.log(`\n── (2) SCHEDULES /schedules/seasons/${target.id} ──`)
  try {
    const sched = await sm<{ id: number; name: string; type_id?: number; rounds?: { id: number; name: string; fixtures?: unknown[] }[]; fixtures?: unknown[] }[]>(
      `/schedules/seasons/${target.id}`,
    )
    console.log(`stages: ${sched.length}`)
    let sampleFixture: Record<string, unknown> | undefined
    for (const st of sched) {
      const rounds = st.rounds ?? []
      const nFix = rounds.reduce((a, r) => a + (r.fixtures?.length ?? 0), 0) + (st.fixtures?.length ?? 0)
      console.log(`   • stage "${st.name}" [${st.id}] type_id=${st.type_id ?? "?"} — ${rounds.length} rounds, ${nFix} fixtures${rounds.length ? " → " + rounds.map((r) => `${r.name}(${r.fixtures?.length ?? 0})`).slice(0, 8).join(" ") : ""}`)
      if (!sampleFixture) {
        const f = (rounds.flatMap((r) => r.fixtures ?? [])[0] ?? st.fixtures?.[0]) as Record<string, unknown> | undefined
        if (f) sampleFixture = f
      }
    }
    if (sampleFixture) {
      console.log(`\n   AMOSTRA de fixture (campos): ${keys(sampleFixture)}`)
      const pick = (k: string) => (k in sampleFixture! ? `${k}=${j(sampleFixture![k])}` : "")
      console.log(`   ${["id", "name", "starting_at", "leg", "aggregate_id", "round_id", "stage_id", "group_id", "placeholder", "result_info", "home_score", "away_score", "state_id"].map(pick).filter(Boolean).join(" · ")}`)
    }
  } catch (e) {
    console.log(`   ✗ schedules → ${(e as Error).message}`)
  }
}
console.log("\n[fim do probe]")
process.exit(0)
