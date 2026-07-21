import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => (await db.execute(sql.raw(s))).rows ?? []

// Quanto da dispersao observada entre arbitros e EFEITO REAL e quanto e RUIDO AMOSTRAL?
// Decomposicao: Var(medias observadas) = Var(efeito verdadeiro) + E[Var amostral]
// Sob Poisson, Var amostral do arbitro i ~ lambda / n_i.
for (const liga of ["PL", "BRA"]) {
  const rows = (await q(`
    with r as (
      select m.referee_id, m.id, count(cd.id)::int as cartoes
      from match m left join card cd on cd.match_id=m.id
      where m.status='FT' and m.referee_id is not null and m.league_code='${liga}'
      group by 1,2)
    select referee_id::text, count(*)::int as n, avg(cartoes)::float8 as media,
           var_samp(cartoes)::float8 as var_intra
    from r group by 1 having count(*)>=10`)) as { n: number; media: number; var_intra: number }[]

  const N = rows.length
  const grande = rows.reduce((a, r) => a + r.media * r.n, 0) / rows.reduce((a, r) => a + r.n, 0)
  // variancia observada entre as medias dos arbitros
  const mBar = rows.reduce((a, r) => a + r.media, 0) / N
  const varObs = rows.reduce((a, r) => a + (r.media - mBar) ** 2, 0) / (N - 1)
  // ruido amostral esperado: media de (var_intra / n)
  const ruido = rows.reduce((a, r) => a + (r.var_intra ?? grande) / r.n, 0) / N
  const varVerd = varObs - ruido
  const sdVerd = varVerd > 0 ? Math.sqrt(varVerd) : 0
  // confiabilidade (reliability) media: quanto da variancia observada e sinal
  const rel = varObs > 0 ? Math.max(0, varVerd) / varObs : 0
  // jogos necessarios pra reliability 0.7 (Spearman-Brown a partir do n medio)
  const nMed = rows.reduce((a, r) => a + r.n, 0) / N

  console.log(`\n=== ${liga} — decomposicao do efeito-arbitro (cartoes/jogo) ===`)
  console.log(`arbitros (>=10 jogos): ${N} | jogos/arbitro (media): ${nMed.toFixed(1)} | media liga: ${grande.toFixed(2)}`)
  console.log(`SD observada entre arbitros : ${Math.sqrt(varObs).toFixed(3)}`)
  console.log(`SD esperada so por RUIDO    : ${Math.sqrt(ruido).toFixed(3)}`)
  console.log(`SD VERDADEIRA (shrunk)      : ${sdVerd.toFixed(3)}   <-- o efeito real`)
  console.log(`confiabilidade (sinal/total): ${(rel * 100).toFixed(1)}%`)
  console.log(`=> spread real ~+-2SD: ${(grande - 2 * sdVerd).toFixed(2)} a ${(grande + 2 * sdVerd).toFixed(2)} cartoes/jogo`)
  console.log(`=> razao real max/min (2SD): ${sdVerd > 0 ? ((grande + 2 * sdVerd) / (grande - 2 * sdVerd)).toFixed(2) : "n/a"}x  (cru observado era 1.33x PL / 1.59x BRA)`)

  // ESTABILIDADE ENTRE TEMPORADAS — o teste que importa pra apostar (PL tem 24/25 e 25/26)
  if (liga === "PL") {
    const est = await q(`
      with r as (
        select m.referee_id, s.start_year, m.id, count(cd.id)::int as cartoes
        from match m join season s on s.id=m.season_id
        left join card cd on cd.match_id=m.id
        where m.status='FT' and m.referee_id is not null and m.league_code='PL' group by 1,2,3),
      a as (select referee_id, start_year, count(*)::int as n, avg(cartoes)::float8 as cj
            from r group by 1,2 having count(*)>=8)
      select x.referee_id::text, x.cj as ano1, y.cj as ano2, x.n as n1, y.n as n2
      from a x join a y on y.referee_id=x.referee_id and y.start_year=x.start_year+1`)
    const pares = est as { ano1: number; ano2: number }[]
    if (pares.length > 2) {
      const m1 = pares.reduce((a, p) => a + p.ano1, 0) / pares.length
      const m2 = pares.reduce((a, p) => a + p.ano2, 0) / pares.length
      const num = pares.reduce((a, p) => a + (p.ano1 - m1) * (p.ano2 - m2), 0)
      const d1 = Math.sqrt(pares.reduce((a, p) => a + (p.ano1 - m1) ** 2, 0))
      const d2 = Math.sqrt(pares.reduce((a, p) => a + (p.ano2 - m2) ** 2, 0))
      console.log(`\n--- PL: estabilidade temporada->temporada (>=8 jogos em cada) ---`)
      console.log(`pares de arbitro-temporada: ${pares.length} | r = ${(num / (d1 * d2)).toFixed(3)}`)
      console.log(`(r alto = o rigor do arbitro se repete no ano seguinte = apostavel;`)
      console.log(` r ~0 = a "media do arbitro" do ano passado nao prediz nada)`)
    }
  }
}
process.exit(0)
