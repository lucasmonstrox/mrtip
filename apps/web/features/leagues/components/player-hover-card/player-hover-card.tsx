"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"
import Link from "next/link"
import type { ReactNode } from "react"
import { useState } from "react"

import { usePlayerQuery } from "../../hooks/data/queries/use-player-query"
import type { PlayerDetail } from "../../types"
import { ratingColor } from "../../utils/format"
import { Sparkline } from "./sparkline"

// Most-played position code (G/D/M/F) → label, same wording as the player page.
const POSITION_LABEL: Record<string, string> = {
  G: "Goleiro",
  D: "Defensor",
  M: "Meio-campo",
  F: "Atacante",
}

// How many recent rated appearances feed the sparkline — enough to read a trend without crowding.
const FORM_GAMES = 10

function Stat({ value, label, className }: { value: string | number; label: string; className?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-base font-bold tabular-nums ${className ?? ""}`}>{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}

function PlayerHoverSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="h-3.5 w-28 animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="h-10 animate-pulse rounded bg-muted" />
    </div>
  )
}

function PlayerHoverBody({ data }: { data: PlayerDetail }) {
  // Ratings in chronological order (the API returns appearances oldest → newest), most recent window.
  const ratings = data.appearances
    .filter((a) => a.rating != null)
    .map((a) => a.rating as number)
    .slice(-FORM_GAMES)

  return (
    <div className="flex flex-col gap-2.5">
      <Link href={`/players/${data.id}`} className="group flex items-center gap-2.5">
        {data.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={data.imageUrl}
            alt=""
            className="size-10 shrink-0 rounded-full object-cover ring-1 ring-border"
          />
        ) : null}
        <div className="flex min-w-0 flex-col">
          <span className="truncate font-semibold leading-tight group-hover:underline">{data.name}</span>
          <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            {data.currentTeam?.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.currentTeam.logoUrl} alt="" className="size-3.5 shrink-0 object-contain" />
            ) : null}
            <span className="truncate">
              {data.currentTeam?.name ?? "—"}
              {data.position ? ` · ${POSITION_LABEL[data.position] ?? data.position}` : ""}
            </span>
          </span>
        </div>
      </Link>

      <div className="grid grid-cols-4 gap-1 border-t pt-2">
        <Stat value={data.season.appearances} label="jogos" />
        <Stat value={data.season.goals} label="gols" />
        <Stat value={data.season.assists} label="assist" />
        <Stat
          value={data.season.avgRating != null ? data.season.avgRating.toFixed(2) : "–"}
          label="nota"
          className={data.season.avgRating != null ? ratingColor(data.season.avgRating) : ""}
        />
      </div>

      {ratings.length >= 2 ? (
        <div className="flex items-center justify-between gap-2 border-t pt-2">
          <span className="text-[10px] text-muted-foreground">Forma · últimos {ratings.length}</span>
          <Sparkline values={ratings} />
        </div>
      ) : null}
    </div>
  )
}

/**
 * Hover card for any mention of a player (a goal scorer, an assist, a booked player…). On first hover
 * it lazy-loads the player and shows a season snapshot: photo, club, position, goals/assists/avg rating
 * and a sparkline of recent match ratings. `children` is the trigger (usually the player-name link).
 */
export function PlayerHoverCard({ id, children }: { id: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const { data, isError } = usePlayerQuery(id, open)

  return (
    <HoverCard openDelay={200} closeDelay={100} onOpenChange={setOpen}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent side="top" className="w-64">
        {isError ? (
          <p className="text-xs text-muted-foreground">Não foi possível carregar o jogador.</p>
        ) : data ? (
          <PlayerHoverBody data={data} />
        ) : (
          <PlayerHoverSkeleton />
        )}
      </HoverCardContent>
    </HoverCard>
  )
}
