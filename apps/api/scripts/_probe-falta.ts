// O que EXATAMENTE falta na Série A vs PL: união de type_ids sobre 12 fixtures de cada, com NOME.
import { env } from "../src/env"
const T = env.sportmonksApiKey!
const g = async (p:string) => (await (await fetch(`https://api.sportmonks.com/v3${p}${p.includes("?")?"&":"?"}api_token=${T}`)).json()) as any
const Q=(y:number):[string,string][]=>[[`${y}-01-01`,`${y}-03-31`],[`${y}-04-01`,`${y}-06-30`],[`${y}-07-01`,`${y}-09-30`],[`${y}-10-01`,`${y}-12-31`]]
async function union(id:number,win:[string,string][]){
  const out:any[]=[]
  for(const [f,t] of win){let p=1;for(;;){const r=await g(`/football/fixtures/between/${f}/${t}?filters=fixtureSeasons:${id}&include=state&per_page=50&page=${p}`);out.push(...(r.data??[]));if(!r.pagination?.has_more)break;p++}}
  const ft=out.filter(f=>f.state?.developer_name==="FT"); const step=Math.max(1,Math.floor(ft.length/12))
  const s=ft.filter((_,i)=>i%step===0).slice(0,12)
  const st=new Set<number>(), de=new Set<number>()
  for(const f of s){const d=await g(`/football/fixtures/${f.id}?include=statistics;lineups.details`)
    for(const x of d.data?.statistics??[]) st.add(x.type_id)
    for(const l of d.data?.lineups??[]) for(const x of l.details??[]) de.add(x.type_id)}
  return {st,de,n:s.length}
}
const SA=await union(25184,Q(2025)) // 2025: temporada completa e 100% de statistics
const PL=await union(25583,[["2025-08-01","2025-10-31"],["2025-11-01","2026-01-31"],["2026-02-01","2026-04-30"],["2026-05-01","2026-06-01"]])
const nome=async(id:number)=>{const t=await g(`/core/types/${id}`);return t.data?.name??"?"}
for(const [k,a,b] of [["statistics (time)",SA.st,PL.st],["lineups.details (jogador)",SA.de,PL.de]] as [string,Set<number>,Set<number>][]){
  const soPL=[...b].filter(x=>!a.has(x)).sort((x,y)=>x-y)
  const soSA=[...a].filter(x=>!b.has(x)).sort((x,y)=>x-y)
  console.log(`\n=== ${k} — SA=${a.size} types · PL=${b.size} types (12 fixtures cada) ===`)
  console.log(` NA PL e NÃO na Série A (${soPL.length}):`); for(const i of soPL) console.log(`   ${i} — ${await nome(i)}`)
  console.log(` NA Série A e NÃO na PL (${soSA.length}):`); for(const i of soSA) console.log(`   ${i} — ${await nome(i)}`)
}
process.exit(0)
