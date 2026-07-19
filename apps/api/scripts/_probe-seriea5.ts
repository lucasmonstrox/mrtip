import { env } from "../src/env"
const T = env.sportmonksApiKey!
const g = async (p: string) => (await (await fetch(`https://api.sportmonks.com/v3${p}${p.includes("?")?"&":"?"}api_token=${T}`)).json()) as any
const Q = (y:number):[string,string][] => [[`${y}-01-01`,`${y}-03-31`],[`${y}-04-01`,`${y}-06-30`],[`${y}-07-01`,`${y}-09-30`],[`${y}-10-01`,`${y}-12-31`]]
for (const [label,id,win] of [["SA 2024",23265,Q(2024)],["SA 2025",25184,Q(2025)]] as [string,number,[string,string][]][]) {
  const out:any[]=[]
  for (const [f,t] of win){let p=1;for(;;){const r=await g(`/football/fixtures/between/${f}/${t}?filters=fixtureSeasons:${id}&include=state&per_page=50&page=${p}`);out.push(...(r.data??[]));if(!r.pagination?.has_more)break;p++}}
  const ft=out.filter(f=>f.state?.developer_name==="FT")
  const step=Math.max(1,Math.floor(ft.length/30)); const s=ft.filter((_,i)=>i%step===0).slice(0,30)
  let ok=0; for(const f of s){const d=await g(`/football/fixtures/${f.id}?include=statistics`); if((d.data?.statistics??[]).length) ok++}
  console.log(`${label}: statistics presentes em ${ok}/${s.length} fixtures (${(ok/s.length*100).toFixed(0)}%)`)
}
const one = await g(`/football/fixtures/19621899`)
const ts = one.data?.starting_at_timestamp
console.log(`\nfuso: starting_at="${one.data?.starting_at}" · starting_at_timestamp=${ts}`)
console.log(`  → UTC ${new Date(ts*1000).toISOString()} · BRT ${new Date(ts*1000).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"})}`)
process.exit(0)
