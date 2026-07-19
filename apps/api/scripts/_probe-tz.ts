// Quantifica o impacto do fuso: quantos jogos da Série A têm data UTC != data em America/Sao_Paulo
// (o sync grava starting_at.slice(0,10) cru → jogo de 21:30 BRT vira 00:30 do dia seguinte).
import { env } from "../src/env"
const T = env.sportmonksApiKey!
const g = async (p: string) => (await (await fetch(`https://api.sportmonks.com/v3${p}${p.includes("?")?"&":"?"}api_token=${T}`)).json()) as any
const Q = (y:number):[string,string][] => [[`${y}-01-01`,`${y}-03-31`],[`${y}-04-01`,`${y}-06-30`],[`${y}-07-01`,`${y}-09-30`],[`${y}-10-01`,`${y}-12-31`]]
for (const [label,id,win] of [["SA 2026",26763,Q(2026)],["SA 2025",25184,Q(2025)],["PL 25/26",25583,[["2025-08-01","2025-10-31"],["2025-11-01","2026-01-31"],["2026-02-01","2026-04-30"],["2026-05-01","2026-06-01"]] as [string,string][]]] as [string,number,[string,string][]][]) {
  const out:any[]=[]
  for (const [f,t] of win){let p=1;for(;;){const r=await g(`/football/fixtures/between/${f}/${t}?filters=fixtureSeasons:${id}&per_page=50&page=${p}`);out.push(...(r.data??[]));if(!r.pagination?.has_more)break;p++}}
  const tzName = label.startsWith("SA") ? "America/Sao_Paulo" : "Europe/London"
  let shifted = 0; const ex:string[]=[]
  for (const f of out) {
    const utc = new Date(f.starting_at.replace(" ","T")+"Z")
    const local = new Intl.DateTimeFormat("en-CA",{timeZone:tzName,year:"numeric",month:"2-digit",day:"2-digit"}).format(utc)
    if (local !== f.starting_at.slice(0,10)) { shifted++; if(ex.length<3) ex.push(`${f.name}: grava ${f.starting_at.slice(0,10)} ${f.starting_at.slice(11,16)} · real ${local} ${new Intl.DateTimeFormat("pt-BR",{timeZone:tzName,hour:"2-digit",minute:"2-digit"}).format(utc)}`) }
  }
  console.log(`\n${label} (${tzName}): ${shifted}/${out.length} jogos com DATA errada (${(shifted/out.length*100).toFixed(1)}%)`)
  for (const e of ex) console.log(`   ${e}`)
}
process.exit(0)
