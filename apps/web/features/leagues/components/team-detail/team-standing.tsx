import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import type { TeamStanding as TeamStandingType, VenueRecord } from "../../types"

// Qualification/relegation zone → PT label + accent color. null (mid-table) renders nothing.
const ZONE: Record<string, { label: string; className: string }> = {
  champions: { label: "Champions League", className: "text-emerald-600" },
  europa: { label: "Europa League", className: "text-blue-600" },
  conference: { label: "Conference League", className: "text-cyan-600" },
  relegation: { label: "Rebaixamento", className: "text-red-600" },
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-semibold tabular-nums">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}

// Official W-D-L + goals for one venue (home or away). null = split not ingested for this row.
function VenueColumn({ label, v }: { label: string; v: VenueRecord | null }) {
  return (
    <div className="flex flex-col gap-1 rounded bg-muted/40 px-3 py-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {v ? (
        <>
          <span className="text-sm font-semibold tabular-nums">
            {v.won}V · {v.drawn}E · {v.lost}D
          </span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            {v.played} jogos · {v.goalsFor}/{v.goalsAgainst} gols
          </span>
        </>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      )}
    </div>
  )
}

// Official season standing of the team (source: SportMonks `standing` table) — position, points,
// played, W-D-L, goals and goal difference, plus the qualification/relegation zone when in one.
export function TeamStanding({ standing: s }: { standing: TeamStandingType }) {
  const zone = s.zone ? ZONE[s.zone] : null
  const gd = s.goalDifference > 0 ? `+${s.goalDifference}` : String(s.goalDifference)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Classificação</CardTitle>
        {zone && <span className={`text-xs font-medium ${zone.className}`}>{zone.label}</span>}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-4 gap-y-4 sm:grid-cols-8">
          <Stat label="Posição" value={`${s.position}º`} />
          <Stat label="Pontos" value={s.points} />
          <Stat label="J" value={s.played} />
          <Stat label="V" value={s.won} />
          <Stat label="E" value={s.drawn} />
          <Stat label="D" value={s.lost} />
          <Stat label="GP/GC" value={`${s.goalsFor}/${s.goalsAgainst}`} />
          <Stat label="SG" value={gd} />
        </div>
        {(s.home || s.away) && (
          <div className="grid grid-cols-2 gap-3 border-t pt-3">
            <VenueColumn label="Em casa" v={s.home} />
            <VenueColumn label="Fora" v={s.away} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
