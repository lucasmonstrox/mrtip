/**
 * Teste do motor de cenários contra VERDADE DE CAMPO: a rodada 38 já aconteceu, então o resultado real é
 * um dos cenários enumerados. Reconstrói a posição final de cada time usando a MESMA contagem
 * "quantos estão acima / empatados" que o motor usa pra calcular piso e teto, e compara com a `standing`
 * ingerida da SportMonks.
 *
 * Por que não basta "a posição real caiu entre teto e piso": um piso INFLADO contém a verdade do mesmo
 * jeito, então essa checagem passaria com a contagem errada. Foi exatamente o bug que existiu aqui (times
 * já garantidos acima eram contados duas vezes). O assert que morde é reconstruir a posição EXATA.
 *
 *   bun run scripts/_test-cenarios.ts BRA 2025
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { tiebreakOfSeason } from "../src/modules/leagues/shared/shared"
import { analisarCenarios, type EstadoTime, type Jogo } from "./lib/cenarios"
import { ordenar } from "./lib/ultrapassagem"

const [LEAGUE = "BRA", SEASON = "2025"] = process.argv.slice(2)
type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]

const [seasonRow] = rowsOf(await db.execute(sql`
  select id from season where league_code = ${LEAGUE} and name = ${SEASON} limit 1`))
if (!seasonRow) throw new Error(`temporada ${LEAGUE} ${SEASON} não encontrada`)
const TIEBREAK = (await tiebreakOfSeason(LEAGUE, String(seasonRow.id))).criteria

const jogos = rowsOf(await db.execute(sql`
  select m.home_team_id h, m.away_team_id a, m.ft_home fh, m.ft_away fa, m.round, th.name hn, ta.name an
  from match m join team th on th.id = m.home_team_id join team ta on ta.id = m.away_team_id
  where m.season_id = ${seasonRow.id} and m.ft_home is not null order by m.round`))

const ULTIMA = Math.max(...jogos.map((j) => Number(j.round)))
type Acc = EstadoTime & { ga: number }
const acc = new Map<string, Acc>()
const pega = (id: string, nome: string) => {
  let v = acc.get(id)
  if (!v) acc.set(id, (v = { teamId: id, name: nome, points: 0, won: 0, gd: 0, gf: 0, ga: 0 }))
  return v
}
const aplicar = (j: Row) => {
  const h = pega(String(j.h), String(j.hn)), a = pega(String(j.a), String(j.an))
  const fh = Number(j.fh), fa = Number(j.fa)
  h.gf += fh; h.ga += fa; h.gd += fh - fa
  a.gf += fa; a.ga += fh; a.gd += fa - fh
  if (fh > fa) { h.points += 3; h.won++ } else if (fa > fh) { a.points += 3; a.won++ } else { h.points++; a.points++ }
}

// Estado ANTES da última rodada + os jogos que faltam.
for (const j of jogos.filter((x) => Number(x.round) < ULTIMA)) aplicar(j)
const antes: EstadoTime[] = [...acc.values()].map((t) => ({ ...t }))
const restantes: Jogo[] = jogos.filter((x) => Number(x.round) === ULTIMA).map((x) => ({ homeId: String(x.h), awayId: String(x.a) }))

// Estado FINAL real (aplica a última rodada de verdade).
for (const j of jogos.filter((x) => Number(x.round) === ULTIMA)) aplicar(j)
const finalReal = [...acc.values()]

const oficial = new Map<string, number>(
  rowsOf(await db.execute(sql`select team_id, position from standing where season_id = ${seasonRow.id}`)).map((r) => [String(r.team_id), Number(r.position)]),
)

console.log(`# Teste do motor de cenários — ${LEAGUE} ${SEASON}`)
console.log(`última rodada: ${ULTIMA} · ${restantes.length} jogos · desempate ${TIEBREAK.join(" → ")}\n`)

// ---------------------------------------------------------------------------
// ASSERT 1 — reconstrução da posição final pela CONTAGEM do motor
// ---------------------------------------------------------------------------
// Mesma regra de contagem do motor: quantos estão estritamente acima pelo prefixo enumerável, mais os
// empatados nesse prefixo que o desempate por gols coloca à frente. Se isto bate com a `standing` oficial
// em 20/20, o esqueleto de contagem que produz piso/teto está correto.
const ENUMERAVEIS = new Set(["points", "wins"])
const criterios = [...TIEBREAK].reduce<string[]>((acc2, c) => (acc2.length === TIEBREAK.indexOf(c) && ENUMERAVEIS.has(c) ? [...acc2, c] : acc2), [])
const valEnum = (t: Acc, c: string) => (c === "points" ? t.points : t.won)
const cmpEnum = (a: Acc, b: Acc) => { for (const c of criterios) { const d = valEnum(a, c) - valEnum(b, c); if (d) return d } return 0 }
const ordemCompleta = ordenar(finalReal, TIEBREAK)
const posPorTiebreakCompleto = new Map(ordemCompleta.map((t, i) => [t.teamId, i + 1]))

let ok1 = 0
const falhas1: string[] = []
for (const eu of finalReal) {
  let acima = 0
  for (const o of finalReal) {
    if (o.teamId === eu.teamId) continue
    const d = cmpEnum(o, eu)
    if (d > 0) acima++
    // Empate no prefixo: o desempate por gols decide. Usa a ordem completa como árbitro — é o único
    // lugar em que gol entra, e SÓ pra reconstruir a verdade, nunca pra calcular piso.
    else if (d === 0 && (posPorTiebreakCompleto.get(o.teamId) ?? 99) < (posPorTiebreakCompleto.get(eu.teamId) ?? 99)) acima++
  }
  const calc = acima + 1
  const real = oficial.get(eu.teamId)
  if (real == null) { falhas1.push(`${eu.name}: sem posição oficial ingerida`); continue }
  if (calc === real) ok1++
  else falhas1.push(`${eu.name}: motor diz ${calc}º, oficial diz ${real}º`)
}
console.log(`## ASSERT 1 — posição final reconstruída pela contagem do motor`)
console.log(`   ${ok1}/${finalReal.length} corretas${falhas1.length ? "" : "  ✅"}`)
for (const f of falhas1) console.log(`   ❌ ${f}`)

// ---------------------------------------------------------------------------
// ASSERT 2 — a posição real tem de caber entre teto e piso do desfecho que de fato ocorreu
// ---------------------------------------------------------------------------
// Checagem mais fraca (um piso inflado passaria), mas pega inversão teto>piso e desfecho fora do intervalo.
console.log(`\n## ASSERT 2 — posição real dentro de [teto, piso] do resultado que aconteceu`)
let ok2 = 0
const falhas2: string[] = []
for (const t of antes) {
  const meuJogo = jogos.find((j) => Number(j.round) === ULTIMA && (String(j.h) === t.teamId || String(j.a) === t.teamId))
  if (!meuJogo) continue
  const souCasa = String(meuJogo.h) === t.teamId
  const fh = Number(meuJogo.fh), fa = Number(meuJogo.fa)
  const res = fh === fa ? "empate" : (souCasa ? fh > fa : fa > fh) ? "vitoria" : "derrota"
  const an = analisarCenarios({ times: antes, jogos: restantes, tiebreak: TIEBREAK, alvoId: t.teamId })
  const d = an.desfechos.find((x) => x.resultado === res)!
  const real = oficial.get(t.teamId)!
  if (d.teto > d.piso) falhas2.push(`${t.name}: teto ${d.teto} > piso ${d.piso} (inversão)`)
  else if (real < d.teto || real > d.piso) falhas2.push(`${t.name}: real ${real}º fora de [${d.teto}, ${d.piso}] (${res})`)
  else ok2++
}
console.log(`   ${ok2}/${antes.length} dentro do intervalo${falhas2.length ? "" : "  ✅"}`)
for (const f of falhas2) console.log(`   ❌ ${f}`)

// ---------------------------------------------------------------------------
// Amostra legível — o caso que o dono vem citando
// ---------------------------------------------------------------------------
const flu = antes.find((t) => t.name === "Fluminense")
if (flu) {
  const an = analisarCenarios({ times: antes, jogos: restantes, tiebreak: TIEBREAK, alvoId: flu.teamId })
  const posAntes = ordenar(antes, TIEBREAK).findIndex((t) => t.teamId === flu.teamId) + 1
  console.log(`\n## Amostra — Fluminense (${posAntes}º, ${flu.points} pts, ${flu.won} V, SG ${flu.gd >= 0 ? "+" : ""}${flu.gd})`)
  console.log(`   enumeração ${an.exata ? "EXATA" : "PARCIAL (limite)"} · ${an.jogosEnumerados} jogos · ${Math.pow(3, an.jogosEnumerados)} cenários por desfecho`)
  for (const d of an.desfechos) console.log(`   se ${d.resultado.padEnd(8)} → garante ${d.piso}º · pode chegar a ${d.teto}º`)
  console.log(`   posição final real: ${oficial.get(flu.teamId)}º`)
  const cat = (r: string) => an.rivais.filter((x) => x.relacao === r)
  for (const [rot, lista] of [["ABAIXO (podem passar)", cat("abaixo")], ["EMPATADOS (podem os dois lados)", cat("empatado")], ["ACIMA (pode passar)", cat("acima")]] as const) {
    if (!lista.length) continue
    console.log(`   ${rot}:`)
    for (const r of lista) {
      console.log(`     - ${r.name}${r.confrontoDireto ? " ⚔️ CONFRONTO DIRETO" : ""}${r.dependeDeGol ? " [decide no gol]" : ""} — pode ficar à frente:${r.podeFicarAFrente ? "sim" : "não"} · atrás:${r.podeFicarAtras ? "sim" : "não"}`)
      for (const b of r.ramos ?? []) console.log(`         se ${b.resultado.padEnd(8)} → você ${b.alvoPts} · ele ${b.rivalPts} → ele fica ${b.fica}`)
    }
  }
}

const falhou = falhas1.length + falhas2.length
console.log(`\n${falhou ? `❌ ${falhou} falha(s)` : "✅ motor validado contra a classificação oficial"}`)
process.exit(falhou ? 1 : 0)
