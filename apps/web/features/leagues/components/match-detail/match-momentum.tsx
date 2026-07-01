"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { useMatchMomentumQuery } from "../../hooks/data/queries/use-match-momentum-query"
import type { TeamRef } from "../../types"
import { MomentumChart } from "./momentum-chart"

const HOME_COLOR = "#0ea5e9" // sky-500
const AWAY_COLOR = "#f97316" // orange-500

// Tiny colour-dot + team name, the chart's legend (which side each colour belongs to).
function LegendItem({ color, team }: { color: string; team: TeamRef }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className="size-2.5 rounded-sm" style={{ backgroundColor: color }} />
      {team.name}
    </span>
  )
}

// "Momentum" tab widget (@feature SIN-021): the per-minute attack-momentum seesaw reconstructed from the
// match's trends — who was pressing, when. Descriptive of match flow, NOT a goal probability. Hidden
// (empty state) when the match has no trends ingested.
export function MatchMomentum({ id, home, away }: { id: string; home: TeamRef; away: TeamRef }) {
  const { data, isPending } = useMatchMomentumQuery(id)
  if (isPending) return <p className="text-sm text-muted-foreground">Carregando momentum…</p>
  if (!data || data.length === 0)
    return <p className="text-sm text-muted-foreground">Sem dados de momentum para esta partida.</p>
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">Momentum da partida</CardTitle>
            <CardDescription className="text-xs">
              Pressão minuto a minuto (chutes e ameaças, via SportMonks) — quem dominava cada momento.
              Descreve o fluxo do jogo, não prevê gols.
            </CardDescription>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <LegendItem color={HOME_COLOR} team={home} />
            <LegendItem color={AWAY_COLOR} team={away} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <MomentumChart series={data} homeColor={HOME_COLOR} awayColor={AWAY_COLOR} />
      </CardContent>
    </Card>
  )
}
