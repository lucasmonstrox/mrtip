/**
 * Mede a CONFIABILIDADE do perfil disciplinar do árbitro (SIN-009) antes de usá-lo como sinal: spread
 * observado entre árbitros pode ser ruído amostral, e a única forma de saber é split-half / ano-a-ano.
 * Resultado medido em 2026-07-21: o canal IDENTIDADE-DO-ÁRBITRO é ruído; o canal VIÉS ESTRUTURAL
 * pró-mandante é real e forte. Ver comentário no fim do arquivo.
 */
import { db } from "../src/db/client"
import { sql } from "drizzle-orm"

const pearson = (xs: number[], ys: number[]) => {
  const n = xs.length
  const mx = xs.reduce((a, b) => a + b, 0) / n
  const my = ys.reduce((a, b) => a + b, 0) / n
  let sxy = 0, sxx = 0, syy = 0
  for (let i = 0; i < n; i++) { const dx = xs[i]! - mx, dy = ys[i]! - my; sxy += dx * dy; sxx += dx * dx; syy += dy * dy }
  return sxy / Math.sqrt(sxx * syy)
}
/** Spearman-Brown: corrige o split-half para a confiabilidade da média COMPLETA. É o número que vira
 * fator de encolhimento — confiabilidade 0.1 significa que 90% do spread observado é ruído. */
const spearmanBrown = (r: number) => (2 * r) / (1 + r)

// 1) Persistência ano-a-ano do cartões/jogo do árbitro (PL 24/25 → 25/26)
const yoy = await db.execute(sql`
 with t as (select r.name, s.name season, count(*) n, avg(cc.n) cpg
   from match m join referee r on r.id=m.referee_id
   join season s on s.id=m.season_id join league l on l.code=s.league_code
   join lateral (select count(*) n from card c where c.match_id=m.id) cc on true
   where l.code='PL' and m.status='FT' group by r.name,s.name)
 select a.name, a.n n1, round(a.cpg::numeric,2) cpg1, b.n n2, round(b.cpg::numeric,2) cpg2
 from t a join t b on a.name=b.name and a.season='2024/2025' and b.season='2025/2026'
 where a.n>=10 and b.n>=10 order by a.cpg`)
const y = (yoy.rows ?? yoy) as any[]
console.table(y)
console.log(`ano-a-ano cartoes/jogo por arbitro (PL, n=${y.length}): r=${pearson(y.map(r => +r.cpg1), y.map(r => +r.cpg2)).toFixed(3)}`)

// 2) Split-half DENTRO da temporada (jogos ímpares vs pares) — isola ruído de mudança de diretriz
for (const seas of ["2024/2025", "2025/2026"]) {
  const sh = await db.execute(sql`
   with g as (select r.name, cc.n cards, row_number() over (partition by r.name order by m.date) rn
     from match m join referee r on r.id=m.referee_id
     join season s on s.id=m.season_id join league l on l.code=s.league_code
     join lateral (select count(*) n from card c where c.match_id=m.id) cc on true
     where l.code='PL' and m.status='FT' and s.name=${seas})
   select name, avg(case when rn%2=1 then cards end) x, avg(case when rn%2=0 then cards end) y
   from g group by name having count(*)>=12`)
  const r2 = (sh.rows ?? sh) as any[]
  const r = pearson(r2.map((v) => +v.x), r2.map((v) => +v.y))
  console.log(`split-half ${seas} (n=${r2.length}): r=${r.toFixed(3)} SB=${spearmanBrown(r).toFixed(3)}`)
}

// 3) O VIÉS pró-mandante: teste pareado dentro do jogo (cada jogo é seu próprio controle)
const bias = await db.execute(sql`
 select l.code, count(*) n, round(avg(h.n)::numeric,3) casa, round(avg(a.n)::numeric,3) fora,
   round(avg(a.n-h.n)::numeric,3) delta, round((stddev(a.n-h.n)/sqrt(count(*)))::numeric,3) se,
   round((avg(a.n-h.n)/(stddev(a.n-h.n)/sqrt(count(*))))::numeric,2) t
 from match m join season s on s.id=m.season_id join league l on l.code=s.league_code
 join lateral (select count(*) n from card c where c.match_id=m.id and c.team_id=m.home_team_id) h on true
 join lateral (select count(*) n from card c where c.match_id=m.id and c.team_id=m.away_team_id) a on true
 where m.status='FT' and l.code in ('PL','BRA') group by l.code`)
console.table(bias.rows ?? bias)

// 4) Esse viés é atributo do ÁRBITRO? split-half do delta casa/fora
const shb = await db.execute(sql`
 with g as (select r.name, (a.n-h.n)::float d, row_number() over (partition by r.name order by m.date) rn
   from match m join referee r on r.id=m.referee_id
   join season s on s.id=m.season_id join league l on l.code=s.league_code
   join lateral (select count(*) n from card c where c.match_id=m.id and c.team_id=m.home_team_id) h on true
   join lateral (select count(*) n from card c where c.match_id=m.id and c.team_id=m.away_team_id) a on true
   where l.code='PL' and m.status='FT')
 select name, avg(case when rn%2=1 then d end) x, avg(case when rn%2=0 then d end) y
 from g group by name having count(*)>=20`)
const b2 = (shb.rows ?? shb) as any[]
console.log(`split-half do VIES casa/fora por arbitro (PL, n=${b2.length}): r=${pearson(b2.map((v) => +v.x), b2.map((v) => +v.y)).toFixed(3)}`)

/* MEDIDO 2026-07-21 ------------------------------------------------------------------------------
 * IDENTIDADE do árbitro é RUÍDO: ano-a-ano r=-0.198 (n=17); split-half SB=0.085 (24/25) e 0.252 (25/26);
 * BRA 2025→2026 r=0.069. O spread observado de 2.81→4.92 cartões/jogo na PL 25/26 é ~75-90% amostral.
 * O viés casa/fora TAMBÉM não é atributo do árbitro: split-half r=-0.018 (não existe "árbitro caseiro").
 * O que É real: viés ESTRUTURAL pró-mandante, PL delta=+0.333 cartões contra o visitante (SE 0.064,
 * t=5.19) e BRA +0.267 (SE 0.080, t=3.34) — parâmetro de LIGA, não de jogo. Conclusão: árbitro entra
 * como CONSTANTE no baseline, nunca como sinal por partida. Encolhimento correto ≈ 75-90%.
 * ------------------------------------------------------------------------------------------------ */
process.exit(0)
