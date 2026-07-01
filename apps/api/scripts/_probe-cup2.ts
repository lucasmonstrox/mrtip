// Procura PROPRIEDADES que liguem o bracket sem precisar computar na mão: details("Match N"),
// placeholder name ("Winner Match N"), metadata, sort_order nas stages, aggregate. Dumpa JSON cru.
// Run: bun run scripts/_probe-cup2.ts
import { sm } from "../src/lib/sportmonks"

const j = (o: unknown) => JSON.stringify(o, null, 2)

// 1) Estrutura crua de UMA stage (a Final da FA Cup 25/26) — vê props da stage (sort_order?) + fixture cru completo.
console.log("══ (1) STAGE crua — FA Cup 25/26 Final (schedules) ══")
const sched = await sm<Record<string, unknown>[]>(`/schedules/seasons/25919`)
const final = sched.find((s) => s.name === "Final") ?? sched[sched.length - 1]!
console.log(`stage keys: ${Object.keys(final).join(", ")}`)
console.log(`stage (sem fixtures): ${j({ ...final, rounds: undefined, fixtures: Array.isArray(final.fixtures) ? `[${(final.fixtures as unknown[]).length}]` : final.fixtures })}`)
const finalFix = (final.fixtures as Record<string, unknown>[] | undefined)?.[0]
if (finalFix) {
  console.log(`\nFINAL fixture CRU:\n${j(finalFix)}`)
}

// 2) O MESMO fixture via /fixtures/:id com includes ricos — metadata? aggregate? stage.sort_order?
if (finalFix?.id) {
  console.log(`\n══ (2) /fixtures/${finalFix.id} com includes (metadata, aggregate, stage, round) ══`)
  try {
    const rich = await sm<Record<string, unknown>>(
      `/fixtures/${finalFix.id}?include=participants;stage;round;aggregate;metadata;state;scores`,
    )
    console.log(`fixture keys: ${Object.keys(rich).join(", ")}`)
    console.log(`stage: ${j(rich.stage)}`)
    console.log(`aggregate: ${j(rich.aggregate)}`)
    console.log(`metadata: ${j(rich.metadata)}`)
    console.log(`round: ${j(rich.round)}`)
  } catch (e) {
    console.log(`   ✗ ${(e as Error).message}`)
  }
}

// 3) Carabao SF (2 mãos) — tem aggregate_id? como liga as pernas? Pego a stage Semi-finals e um fixture com leg != 1/1.
console.log(`\n══ (3) Carabao 25/26 — procurando jogo de 2 mãos (leg, aggregate_id) ══`)
const carSched = await sm<Record<string, unknown>[]>(`/schedules/seasons/25654`)
const allCar = carSched.flatMap((s) => [...((s.fixtures as unknown[]) ?? []), ...(((s.rounds as Record<string, unknown>[]) ?? []).flatMap((r) => (r.fixtures as unknown[]) ?? []))]) as Record<string, unknown>[]
const twoLeg = allCar.find((f) => f.leg && f.leg !== "1/1") ?? allCar.find((f) => f.aggregate_id != null)
console.log(`fixtures Carabao: ${allCar.length} · com leg!="1/1": ${allCar.filter((f) => f.leg && f.leg !== "1/1").length} · com aggregate_id: ${allCar.filter((f) => f.aggregate_id != null).length}`)
if (twoLeg) console.log(`exemplo 2 mãos: ${j({ id: twoLeg.id, name: twoLeg.name, leg: twoLeg.leg, aggregate_id: twoLeg.aggregate_id, stage_id: twoLeg.stage_id, result_info: twoLeg.result_info })}`)

// 4) Temporada ATUAL (FA Cup 26/27, 28020) — placeholders carregam "Winner Match N" (progressão de graça em bracket vivo)?
console.log(`\n══ (4) FA Cup 26/27 (28020) — placeholders com nome de progressão? ══`)
try {
  const cur = await sm<Record<string, unknown>[]>(`/schedules/seasons/28020`)
  const curFix = cur.flatMap((s) => [...((s.fixtures as unknown[]) ?? []), ...(((s.rounds as Record<string, unknown>[]) ?? []).flatMap((r) => (r.fixtures as unknown[]) ?? []))]) as Record<string, unknown>[]
  const ph = curFix.filter((f) => f.placeholder === true)
  console.log(`fixtures: ${curFix.length} · placeholders: ${ph.length}`)
  for (const f of ph.slice(0, 6)) console.log(`   • [${f.id}] details=${j(f.details)} name=${j(f.name)}`)
  const real = curFix.find((f) => f.placeholder === false)
  if (real) console.log(`   (real) details=${j(real.details)} name=${j(real.name)}`)
} catch (e) {
  console.log(`   ✗ ${(e as Error).message}`)
}
process.exit(0)
