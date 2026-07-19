// MOTM (type 1490) e Clearance Offline (582) existem na Série A? Amostra maior, 3 temporadas.
// Importa porque o sync ingere motm:1490 (sync-sportmonks.ts:33) e o MOD-007 depende dele.
import { env } from "../src/env"
const T = env.sportmonksApiKey!
const g = async (p:string) => (await (await fetch(`https://api.sportmonks.com/v3${p}${p.includes("?")?"&":"?"}api_token=${T}`)).json()) as any
const Q=(y:number):[string,string][]=>[[`${y}-01-01`,`${y}-03-31`],[`${y}-04-01`,`${y}-06-30`],[`${y}-07-01`,`${y}-09-30`],[`${y}-10-01`,`${y}-12-31`]]
for (const [label,id,win] of [["SA 2026",26763,Q(2026)],["SA 2025",25184,Q(2025)],["SA 2024",23265,Q(2024)],["PL 25/26",25583,[["2025-08-01","2025-10-31"],["2025-11-01","2026-01-31"],["2026-02-01","2026-04-30"],["2026-05-01","2026-06-01"]] as [string,string][]]] as [string,number,[string,string][]][]) {
  const out:any[]=[]
  for(const [f,t] of win){let p=1;for(;;){const r=await g(`/football/fixtures/between/${f}/${t}?filters=fixtureSeasons:${id}&include=state&per_page=50&page=${p}`);out.push(...(r.data??[]));if(!r.pagination?.has_more)break;p++}}
  const ft=out.filter(f=>f.state?.developer_name==="FT"); const step=Math.max(1,Math.floor(ft.length/20))
  const s=ft.filter((_,i)=>i%step===0).slice(0,20)
  let motm=0, clr=0, rating=0
  for(const f of s){const d=await g(`/football/fixtures/${f.id}?include=lineups.details`)
    const det=(d.data?.lineups??[]).flatMap((l:any)=>l.details??[])
    if(det.some((x:any)=>x.type_id===1490)) motm++
    if(det.some((x:any)=>x.type_id===582)) clr++
    if(det.some((x:any)=>x.type_id===118)) rating++}
  console.log(`${label.padEnd(9)} MOTM(1490): ${motm}/${s.length} · ClearanceOffline(582): ${clr}/${s.length} · Rating(118): ${rating}/${s.length}`)
}
process.exit(0)
