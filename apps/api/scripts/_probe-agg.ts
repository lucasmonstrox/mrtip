import { sm } from "../src/lib/sportmonks"
// aggregate object + fixture completo da semi
const st = await sm<any>(`/stages/77479680?include=fixtures.participants;fixtures.scores;fixtures.aggregate`)
const f = (st.fixtures ?? [])[0]
console.log("FIXTURE keys:", Object.keys(f).join(", "))
console.log("aggregate:", JSON.stringify(f.aggregate, null, 1))
console.log("participants meta:", JSON.stringify(f.participants?.map((p:any)=>({id:p.id,name:p.name,meta:p.meta})), null, 1))
// os 4 fixtures resumidos
for (const x of st.fixtures ?? []) console.log(`[${x.id}] leg=${x.leg} agg=${x.aggregate_id} "${x.name}" result="${x.result_info}"`)
process.exit(0)
