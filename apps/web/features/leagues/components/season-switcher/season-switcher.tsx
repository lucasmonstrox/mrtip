"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

import { useSeasonParam } from "../../hooks/ui/use-season-param"

// One season as returned by the API (league /seasons, or the team/player payload's `seasons`).
type SeasonOption = {
  sportmonksSeasonId: number
  name: string
  startYear: number
  isCurrent: boolean
}

// Season picker at the top of the league/team/player pages — replaces the old season badge, so the
// current season is always labelled. Default = the current season; picking another writes
// `?season=<id>` (picking the current one clears it, keeping the URL clean). The page's query hooks
// read the same param and refetch. Hidden only when there's no season data at all. @feature LIG-008
export function SeasonSwitcher({ seasons }: { seasons: SeasonOption[] }) {
  const { season, setSeason } = useSeasonParam()
  if (seasons.length === 0) return null

  const current = seasons.find((s) => s.isCurrent) ?? seasons[0]!
  const selected = season ?? current.sportmonksSeasonId

  return (
    <Select
      value={String(selected)}
      onValueChange={(value) => {
        const id = Number(value)
        setSeason(id === current.sportmonksSeasonId ? undefined : id)
      }}
    >
      <SelectTrigger size="sm" className="w-[140px]" aria-label="Temporada">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {seasons.map((s) => (
          <SelectItem key={s.sportmonksSeasonId} value={String(s.sportmonksSeasonId)}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
