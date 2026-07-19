// A correção de fuso é só da Série A, ou a PL também está errada? BST = UTC+1 (mar-out).
import { env } from "../src/env"
const T = env.sportmonksApiKey!
const g = async (p: string) => (await (await fetch(`https://api.sportmonks.com/v3${p}${p.includes("?")?"&":"?"}api_token=${T}`)).json()) as any
const out:any[]=[]
for (const [f,t] of [["2025-08-01","2025-10-31"],["2025-11-01","2026-01-31"],["2026-02-01","2026-04-30"],["2026-05-01","2026-06-01"]] as [string,string][]) {
  let p=1;for(;;){const r=await g(`/football/fixtures/between/${f}/${t}?filters=fixtureSeasons:25583&per_page=50&page=${p}`);out.push(...(r.data??[]));if(!r.pagination?.has_more)break;p++}
}
let off=0; const ex:string[]=[]
for (const f of out) {
  const utc = new Date(f.starting_at.replace(" ","T")+"Z")
  const localHM = new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/London",hour:"2-digit",minute:"2-digit",hour12:false}).format(utc)
  if (localHM !== f.starting_at.slice(11,16)) { off++; if(ex.length<3) ex.push(`${f.name}: grava "${f.starting_at.slice(11,16)}" · real ${localHM} Londres (${f.starting_at.slice(0,10)})`) }
}
console.log(`PL 25/26: ${off}/${out.length} jogos com HORA errada (${(off/out.length*100).toFixed(1)}%) — BST não aplicado`)
for (const e of ex) console.log(`   ${e}`)
process.exit(0)
