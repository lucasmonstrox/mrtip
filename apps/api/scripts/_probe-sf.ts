import { sm } from "../src/lib/sportmonks"
const j = (o:unknown)=>JSON.stringify(o)
// 1) stage da semifinal do Carabao 25/26 (id 77479680) DIRETO
console.log("== SF stage 77479680 direto ==")
try {
  const st = await sm<any>(`/stages/77479680?include=fixtures.participants;fixtures.scores`)
  console.log(`name=${st.name} type=${st.type_id} fixtures=${st.fixtures?.length ?? 0}`)
  for (const f of st.fixtures ?? []) console.log(`  [${f.id}] leg=${f.leg} agg=${f.aggregate_id} "${f.name}" ${j(f.scores?.map((s:any)=>`${s.type_id}:${s.score?.goals}`)?.slice(0,4))}`)
} catch(e){ console.log("  erro:", (e as Error).message) }
// 2) TODOS os fixtures do season via /fixtures/between (nov 25 → mar 26) com stage — conta por stage + leg
console.log("\n== fixtures/between (2025-11-01..2026-03-31) fixtureSeasons:25654 ==")
try {
  const fs = await sm<any[]>(`/fixtures/between/2025-11-01/2026-03-31?filters=fixtureSeasons:25654&include=stage;participants&per_page=50`)
  console.log(`total nesse range: ${fs.length}`)
  const byStage = new Map<string,number>()
  const twoLeg = fs.filter(f=>f.leg && f.leg!=="1/1")
  for (const f of fs){ const k=f.stage?.name??"?"; byStage.set(k,(byStage.get(k)??0)+1) }
  console.log("por stage:", j([...byStage]))
  console.log(`2 mãos (leg!=1/1): ${twoLeg.length}`)
  for (const f of twoLeg.slice(0,8)) console.log(`  [${f.id}] leg=${f.leg} agg=${f.aggregate_id} stage="${f.stage?.name}" "${f.name}"`)
} catch(e){ console.log("  erro:", (e as Error).message) }
process.exit(0)
