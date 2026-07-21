"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { useSeasonParam } from "../../hooks/ui/use-season-param"
import type { PlayerDetail } from "../../types"

// Tabular career break: apps + minutes per league-season. Row click writes `?season=` (same
// contract as SeasonSwitcher). Cross-league rows stay visible but non-clickable (GET would 404).
// @feature LIG-001
export function CareerSeasons({ seasons }: { seasons: PlayerDetail["careerSeasons"] }) {
  const { season, setSeason } = useSeasonParam()
  if (seasons.length === 0) return null

  const current = seasons.find((s) => s.isCurrent && s.selectable) ?? seasons.find((s) => s.selectable)
  const selected = season ?? current?.sportmonksSeasonId

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Por temporada</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-[1fr_4.5rem_5rem] items-center gap-2 border-b px-4 py-2 text-xs font-medium text-muted-foreground">
          <span>Temporada</span>
          <span className="text-right">Jogos</span>
          <span className="text-right">Minutos</span>
        </div>
        <ul>
          {seasons.map((row) => {
            const isSelected = selected === row.sportmonksSeasonId
            const clickable = row.selectable
            return (
              <li key={row.sportmonksSeasonId}>
                <button
                  type="button"
                  disabled={!clickable}
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => {
                    if (!clickable || !current) return
                    setSeason(
                      row.sportmonksSeasonId === current.sportmonksSeasonId
                        ? undefined
                        : row.sportmonksSeasonId,
                    )
                  }}
                  className={`grid w-full grid-cols-[1fr_4.5rem_5rem] items-center gap-2 border-b px-4 py-2.5 text-left text-sm last:border-b-0 ${
                    clickable
                      ? "cursor-pointer hover:bg-muted/50"
                      : "cursor-not-allowed opacity-50"
                  } ${isSelected ? "bg-muted/40 font-medium" : ""}`}
                >
                  <span>{row.name}</span>
                  <span className="text-right tabular-nums">{row.appearances}</span>
                  <span className="text-right tabular-nums">{row.minutes}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
