/**
 * Auditoria de STAKES por rodada — pra cada rodada pedida, recomputa a tabela pré-rodada
 * (anti-leak, só jogos antes do 1º jogo da rodada) e classifica a motivação de cada time
 * (título/Champions/Europa/rebaixamento com alcance matemático + porta fechada por saldo),
 * listando quais jogos têm pelo menos 1 time com interesse real. Filtro do backtest.
 *
 * Run: bun run scripts/stakes-rounds.ts [round ...]   (default: 35 36 37 38)
 */
import { and, eq } from "drizzle-orm"

import { db } from "../src/db/client"
import { match, season, standing, team } from "../src/db/schemas/leagues"
import { tiebreakComparator, tiebreakOfSeason } from "../src/modules/leagues/shared/shared"

const rounds = process.argv.slice(2).map(Number).filter(Boolean)
const ROUNDS = rounds.length ? rounds : [35, 36, 37, 38]

const [ssn] = await db.select({ id: season.id, leagueCode: season.leagueCode }).from(season).where(eq(season.sportmonksSeasonId, 25583))
if (!ssn) throw new Error("season 25583 não encontrada")

// Desempate da temporada, lido UMA vez (o script inteiro roda sobre uma season só). Antes daqui a tabela
// pré-rodada ordenava com a regra da PL hardcoded. @feature LIG-017
const TIEBREAK = (await tiebreakOfSeason(ssn.leagueCode, ssn.id)).criteria

const teams = await db.select({ id: team.id, name: team.name }).from(team)
const nameOf = (id: string) => teams.find((t) => t.id === id)?.name ?? id

const fixtures = await db
  .select({ id: match.id, round: match.round, date: match.date, h: match.homeTeamId, a: match.awayTeamId, ftH: match.ftHome, ftA: match.ftAway, status: match.status })
  .from(match)
  .where(and(eq(match.leagueCode, ssn.leagueCode), eq(match.seasonId, ssn.id)))

// Vagas por zona da tabela oficial (contagem contígua da borda — mesma regra do prognosis-prompt)
const zoneRows = await db
  .select({ position: standing.position, zone: standing.zone })
  .from(standing)
  .where(and(eq(standing.leagueCode, ssn.leagueCode), eq(standing.seasonId, ssn.id)))
const N = zoneRows.length
const byPos = [...zoneRows].sort((a, b) => a.position - b.position)
const isEuro = (z: string | null) => z === "champions" || z === "europa" || z === "conference"
let C = 0
for (const r of byPos) { if (r.zone === "champions") C += 1; else break }
let Q = 0
for (const r of byPos) { if (isEuro(r.zone)) Q += 1; else break }
let R = 0
for (let i = byPos.length - 1; i >= 0; i--) { if (byPos[i]?.zone === "relegation") R += 1; else break }

// `won` existe para o critério "vitórias" ser aplicável — sem ele o desempate da Série A seria
// silenciosamente ignorado neste sort. @feature LIG-017
type Line = { teamId: string; points: number; won: number; gd: number; gf: number }

for (const round of ROUNDS) {
  const roundGames = fixtures.filter((f) => f.round === round).sort((a, b) => a.date.localeCompare(b.date))
  if (!roundGames.length) { console.log(`\n== Rodada ${round}: sem jogos ==`); continue }
  const cutoff = roundGames[0]!.date

  // Tabela pré-rodada: só jogos FT estritamente antes do 1º jogo da rodada
  const played = fixtures.filter((f) => f.date < cutoff && f.ftH != null && f.ftA != null)
  const acc = new Map<string, Line>()
  const at = (id: string) => { let l = acc.get(id); if (!l) acc.set(id, (l = { teamId: id, points: 0, won: 0, gd: 0, gf: 0 })); return l }
  for (const p of played) {
    const h = at(p.h), a = at(p.a)
    const hg = p.ftH!, ag = p.ftA!
    h.gf += hg; a.gf += ag; h.gd += hg - ag; a.gd += ag - hg
    if (hg > ag) { h.points += 3; h.won++ } else if (hg < ag) { a.points += 3; a.won++ } else { h.points++; a.points++ }
  }
  // Desempate da TEMPORADA (a Série A põe vitórias antes do saldo; a PL não). @feature LIG-017
  const table = [...acc.values()].sort(
    tiebreakComparator<Line>(TIEBREAK, {
      points: (l) => l.points,
      wins: (l) => l.won,
      goalDifference: (l) => l.gd,
      goalsFor: (l) => l.gf,
    }),
  )
  const posOf = (id: string) => table.findIndex((l) => l.teamId === id) + 1
  const lineOf = (id: string) => table.find((l) => l.teamId === id)!

  const gamesRemaining = (id: string) => fixtures.filter((f) => (f.h === id || f.a === id) && f.date >= cutoff).length
  const bounds = table.map((l) => ({ teamId: l.teamId, pts: l.points, maxPts: l.points + 3 * gamesRemaining(l.teamId) }))
  const boundOf = (id: string) => bounds.find((b) => b.teamId === id)!
  const canFinishAbove = (id: string, extra = 0) => {
    const b = boundOf(id)
    return bounds.filter((o) => o.teamId !== id && o.maxPts > b.pts + extra).length
  }
  const guaranteedAbove = (id: string) => {
    const b = boundOf(id)
    return bounds.filter((o) => o.teamId !== id && o.pts > b.maxPts).length
  }

  // Motivação simplificada (espelho do stakesFor do prognosis-prompt): o que o time ainda disputa DE VERDADE
  const stake = (id: string): { hot: boolean; why: string } => {
    const b = boundOf(id), pos = posOf(id), gr = gamesRemaining(id)
    const above = canFinishAbove(id), lost = guaranteedAbove(id)
    const relegSafe = above < N - R
    const relegDoomed = lost >= N - R
    const titleClinched = above === 0
    const titlePossible = !titleClinched && lost === 0
    const chClinched = above < C
    const canCh = lost < C
    const euClinched = above < Q
    const canEu = lost < Q
    const fightingDown = !relegSafe && !relegDoomed
    if (relegDoomed) return { hot: false, why: `${pos}º — já rebaixado` }
    if (fightingDown) return { hot: true, why: `${pos}º — luta contra o Z (${b.pts} pts, máx ${b.maxPts})` }
    // perseguição por cima com checagem de saldo (porta fechada = maxPts só EMPATA e saldo é fantasia)
    const chase = (targetPos: number, label: string): { hot: boolean; why: string } | null => {
      const occ = table[targetPos - 1]
      if (!occ || occ.teamId === id) return null
      if (b.maxPts < occ.points) return null // nem alcança
      if (b.maxPts === occ.points) {
        const swing = occ.gd - lineOf(id).gd + 1
        if (swing > 2 * gr) return { hot: false, why: `${pos}º — ${label} só no saldo (virar ${swing}) → porta fechada` }
      }
      return { hot: true, why: `${pos}º — briga por ${label} (${b.pts} pts, máx ${b.maxPts}; linha ${occ.points})` }
    }
    if (titlePossible) {
      const r = chase(1, "TÍTULO")
      if (r) return r
    }
    if (canCh && !chClinched) {
      const r = chase(C, "Champions")
      if (r) return r
    }
    if (canEu && !euClinched) {
      const r = chase(Q, "vaga europeia")
      if (r) return r
    }
    // defende vaga europeia ainda contestada? (alguém abaixo alcança os pontos dele)
    if (pos <= Q && !((pos <= C && chClinched) || (pos <= Q && euClinched))) {
      return { hot: true, why: `${pos}º — DEFENDE vaga europeia ainda não travada` }
    }
    if (titleClinched) return { hot: false, why: `${pos}º — título já garantido` }
    if (chClinched || euClinched) return { hot: false, why: `${pos}º — vaga europeia já travada` }
    return { hot: false, why: `${pos}º — salvo e sem alvo alcançável` }
  }

  console.log(`\n== Rodada ${round} (cutoff ${cutoff}) — vagas: CL ${C} / Europa ${Q} / Z ${R} ==`)
  for (const g of roundGames) {
    const sh = stake(g.h), sa = stake(g.a)
    const flag = sh.hot || sa.hot ? "✅" : "💤"
    const score = g.ftH != null ? ` (${g.ftH}-${g.ftA})` : ""
    console.log(`${flag} ${nameOf(g.h)} x ${nameOf(g.a)}${score}`)
    console.log(`     casa: ${sh.hot ? "🔥" : "—"} ${sh.why}`)
    console.log(`     fora: ${sa.hot ? "🔥" : "—"} ${sa.why}`)
  }
}
process.exit(0)
