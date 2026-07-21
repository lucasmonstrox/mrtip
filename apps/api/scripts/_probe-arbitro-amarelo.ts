import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => (await db.execute(sql.raw(s))).rows ?? []
// SO AMARELOS (type='yellow'): a medida teoricamente correta de rigor.
for (const liga of ["PL", "BRA"]) {
  const rows = (await q(`
    with r as (select m.referee_id, m.id, count(cd.id) filter (where cd.type='yellow')::int as cartoes
      from match m left join card cd on cd.match_id=m.id
      where m.status='FT' and m.referee_id is not null and m.league_code='${liga}' group by 1,2)
    select count(*)::int as n, avg(cartoes)::float8 as media, var_samp(cartoes)::float8 as var_intra
    from r group by referee_id having count(*)>=10`)) as { n: number; media: number; var_intra: number }[]
  const N = rows.length
  const grande = rows.reduce((a,r)=>a+r.media*r.n,0)/rows.reduce((a,r)=>a+r.n,0)
  const mBar = rows.reduce((a,r)=>a+r.media,0)/N
  const varObs = rows.reduce((a,r)=>a+(r.media-mBar)**2,0)/(N-1)
  const ruido = rows.reduce((a,r)=>a+(r.var_intra??grande)/r.n,0)/N
  const sdVerd = Math.max(0, varObs-ruido) ** 0.5
  console.log(`\n=== ${liga} AMARELOS ===  arbitros=${N} media=${grande.toFixed(2)}`)
  console.log(`SD observada=${Math.sqrt(varObs).toFixed(3)} | SD ruido=${Math.sqrt(ruido).toFixed(3)} | SD VERDADEIRA=${sdVerd.toFixed(3)} | confiabilidade=${(varObs>0?Math.max(0,varObs-ruido)/varObs*100:0).toFixed(1)}%`)
  if (sdVerd>0) console.log(`spread real +-2SD: ${(grande-2*sdVerd).toFixed(2)} a ${(grande+2*sdVerd).toFixed(2)} => razao ${((grande+2*sdVerd)/(grande-2*sdVerd)).toFixed(2)}x`)
}
// estabilidade entre temporadas, AMARELOS, PL
const est = await q(`
  with r as (select m.referee_id, s.start_year, m.id, count(cd.id) filter (where cd.type='yellow')::int as c
    from match m join season s on s.id=m.season_id left join card cd on cd.match_id=m.id
    where m.status='FT' and m.referee_id is not null and m.league_code='PL' group by 1,2,3),
  a as (select referee_id, start_year, count(*)::int as n, avg(c)::float8 as cj from r group by 1,2 having count(*)>=8)
  select x.cj as ano1, y.cj as ano2 from a x join a y on y.referee_id=x.referee_id and y.start_year=x.start_year+1`) as {ano1:number;ano2:number}[]
const m1=est.reduce((a,p)=>a+p.ano1,0)/est.length, m2=est.reduce((a,p)=>a+p.ano2,0)/est.length
const num=est.reduce((a,p)=>a+(p.ano1-m1)*(p.ano2-m2),0)
const d1=Math.sqrt(est.reduce((a,p)=>a+(p.ano1-m1)**2,0)), d2=Math.sqrt(est.reduce((a,p)=>a+(p.ano2-m2)**2,0))
console.log(`\nPL AMARELOS estabilidade 24/25->25/26: pares=${est.length} r=${(num/(d1*d2)).toFixed(3)}`)
process.exit(0)
