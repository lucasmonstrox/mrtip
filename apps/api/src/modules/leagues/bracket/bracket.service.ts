import { and, asc, eq } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { db } from "../../../db/client"
import { match, team } from "../../../db/schema"
import { getLeagueOrThrow, resolveSeason, type TeamRef } from "../shared/shared"
import type { BracketQuery } from "./bracket.schema"

// GET /v1/leagues/:code/bracket — o CHAVEAMENTO de uma copa (mata-mata) numa season. Agrupa os jogos por
// STAGE (ordenado por stageOrder, ex.: Round 3 → QF → SF → Final), monta cada confronto com placar +
// quem AVANÇOU (winnerTeamId, que cobre pênaltis), e computa as "linhas" de progressão (vencedor de um
// confronto → confronto dele na stage seguinte). A SportMonks NÃO entrega o bracket pronto p/ FA Cup/
// Carabao (endpoint de brackets vem vazio), então a árvore é reconstruída aqui. @feature CUP-001

const STAGE_PROPER = 224 // stages "de verdade" do mata-mata (as qualifying são 225)

export type BracketTie = {
  id: string
  slug: string
  date: string
  home: TeamRef
  away: TeamRef
  score: [number, number] | null // [home, away]; em ida/volta é o AGREGADO; null se não jogado
  winnerId: string | null // quem avançou (cobre pênaltis, onde o placar empata)
  resultInfo: string | null // "won after penalties" / "won after full-time"
  leg: string | null // "1/1" jogo único; "1/2","2/2" ida e volta; "agg" = nó agregado
  // Placar de cada mão (só em ida/volta), na perspectiva do mando do NÓ (home/away do confronto): [ida, volta].
  legs?: [number, number][]
}
export type BracketStage = { order: number; name: string; typeId: number | null; ties: BracketTie[] }
// "o vencedor de `fromTieId` foi pro `slot` do `toTieId`" — a linha do chaveamento.
export type BracketEdge = { fromTieId: string; toTieId: string; teamId: string; slot: "home" | "away" }
export type Bracket = {
  league: { code: string; name: string; type: string }
  season: string
  stages: BracketStage[]
  edges: BracketEdge[]
}

const teamHome = alias(team, "bracket_team_home")
const teamAway = alias(team, "bracket_team_away")

export async function getBracket(code: string, query: BracketQuery): Promise<Bracket> {
  const lg = await getLeagueOrThrow(code)
  const seasonId = await resolveSeason(code, query.season)

  const rows = await db
    .select({
      m: match,
      homeName: teamHome.name, homeSlug: teamHome.slug, homeLogo: teamHome.logoUrl,
      awayName: teamAway.name, awaySlug: teamAway.slug, awayLogo: teamAway.logoUrl,
    })
    .from(match)
    .innerJoin(teamHome, eq(teamHome.id, match.homeTeamId))
    .innerJoin(teamAway, eq(teamAway.id, match.awayTeamId))
    .where(and(eq(match.leagueCode, code), eq(match.seasonId, seasonId)))
    .orderBy(asc(match.stageOrder), asc(match.date))

  // Default: só o mata-mata "proper" (type_id 224); ?stages=all inclui as qualifying (ruído p/ o bracket).
  const wantAll = query.stages === "all"
  type Row = (typeof rows)[number]
  const byStage = new Map<number, { name: string; typeId: number | null; rows: Row[] }>()
  for (const r of rows) {
    if (!wantAll && r.m.stageTypeId !== STAGE_PROPER) continue
    const order = r.m.stageOrder ?? 0
    let s = byStage.get(order)
    if (!s) { s = { name: r.m.stageName ?? "—", typeId: r.m.stageTypeId ?? null, rows: [] }; byStage.set(order, s) }
    s.rows.push(r)
  }
  const teamRef = (r: Row, side: "home" | "away"): TeamRef =>
    side === "home"
      ? { id: r.m.homeTeamId, name: r.homeName, slug: r.homeSlug, logoUrl: r.homeLogo }
      : { id: r.m.awayTeamId, name: r.awayName, slug: r.awaySlug, logoUrl: r.awayLogo }
  const singleTie = (r: Row): BracketTie => ({
    id: r.m.id, slug: r.m.slug, date: r.m.date, home: teamRef(r, "home"), away: teamRef(r, "away"),
    score: r.m.ftHome != null && r.m.ftAway != null ? [r.m.ftHome, r.m.ftAway] : null,
    winnerId: r.m.winnerTeamId ?? null, resultInfo: r.m.resultInfo ?? null, leg: r.m.leg ?? null,
  })
  // Confronto de 2 MÃOS: soma os gols de cada time nas duas pernas (mando alterna); vencedor = meta.winner
  // (já é o AGREGADO); linka pra 2ª mão (a decisiva). Ex.: Newcastle 1-5 Man City na semi do Carabao.
  const aggTie = (legs: Row[]): BracketTie => {
    const first = legs.find((r) => r.m.leg === "1/2") ?? legs[0]!
    const decider = legs.find((r) => r.m.leg === "2/2") ?? legs[legs.length - 1]!
    const homeId = first.m.homeTeamId, awayId = first.m.awayTeamId
    const goalsOf = (teamId: string) => legs.reduce((s, r) => s + (r.m.homeTeamId === teamId ? (r.m.ftHome ?? 0) : (r.m.ftAway ?? 0)), 0)
    // Placar de cada mão na perspectiva do mando do NÓ (homeId/awayId), ordenado ida (1/2) → volta (2/2).
    const legsScores: [number, number][] = [...legs]
      .sort((a, b) => (a.m.leg ?? "").localeCompare(b.m.leg ?? ""))
      .map((r): [number, number] => (r.m.homeTeamId === homeId ? [r.m.ftHome ?? 0, r.m.ftAway ?? 0] : [r.m.ftAway ?? 0, r.m.ftHome ?? 0]))
    return {
      id: decider.m.id, slug: decider.m.slug, date: decider.m.date, home: teamRef(first, "home"), away: teamRef(first, "away"),
      score: [goalsOf(homeId), goalsOf(awayId)], winnerId: first.m.winnerTeamId ?? null, resultInfo: "agregado (ida e volta)", leg: "agg", legs: legsScores,
    }
  }
  const stages: BracketStage[] = [...byStage.entries()]
    .map(([order, s]) => {
      const singles: Row[] = []
      const aggs = new Map<number, Row[]>()
      for (const r of s.rows) {
        if (r.m.aggregateId != null) aggs.set(r.m.aggregateId, [...(aggs.get(r.m.aggregateId) ?? []), r])
        else singles.push(r)
      }
      const ties = [...singles.map(singleTie), ...[...aggs.values()].map(aggTie)].sort((a, b) => a.date.localeCompare(b.date))
      return { order, name: s.name, typeId: s.typeId, ties }
    })
    .sort((a, b) => a.order - b.order)

  // Progressão computada: em cada stage decidida, o vencedor de um confronto aparece num confronto da
  // stage seguinte → essa é a linha (winner → slot). Robusto p/ mata-mata concluído (jogo único).
  const edges: BracketEdge[] = []
  for (let i = 0; i < stages.length - 1; i++) {
    const next = stages[i + 1]!
    for (const t of stages[i]!.ties) {
      if (!t.winnerId) continue
      const child = next.ties.find((n) => n.home.id === t.winnerId || n.away.id === t.winnerId)
      if (child) {
        edges.push({
          fromTieId: t.id,
          toTieId: child.id,
          teamId: t.winnerId,
          slot: child.home.id === t.winnerId ? "home" : "away",
        })
      }
    }
  }

  return { league: { code: lg.code, name: lg.name, type: lg.type }, season: lg.season, stages, edges }
}
