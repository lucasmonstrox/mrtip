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
const FORM_GAMES = 5

// The per-game output strip covers this many recent games; each goal is a football icon and each
// assist a boot icon, so a game reads as goal involvements at a glance.
const GOAL_GAMES = 5

type Appearance = PlayerDetail["appearances"][number]

// Shared line-icon wrapper so the goal ball and assist shoe read as one set (same stroke + size props).
function StripIcon({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

// Goal marker — Tabler's "ball-football" (MIT): a clean soccer ball (ring + pentagon + spokes).
function GoalIcon({ className }: { className?: string }) {
  return (
    <StripIcon className={className}>
      <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M12 7l4.76 3.45l-1.76 5.55h-6l-1.76 -5.55l4.76 -3.45" />
      <path d="M12 7v-4m3 13l2.5 3m-.74 -8.55l3.74 -1.45m-11.44 7.05l-2.56 2.95m.74 -8.55l-3.74 -1.45" />
    </StripIcon>
  )
}

// Assist marker — lucide's "sport-shoe" (ISC): a cleat, same stroke style as the goal ball.
function AssistIcon({ className }: { className?: string }) {
  return (
    <StripIcon className={className}>
      <path d="m15 10.42 4.8-5.07" />
      <path d="M19 18h3" />
      <path d="M9.5 22 21.414 9.415A2 2 0 0 0 21.2 6.4l-5.61-4.208A1 1 0 0 0 14 3v2a2 2 0 0 1-1.394 1.906L8.677 8.053A1 1 0 0 0 8 9c-.155 6.393-2.082 9-4 9a2 2 0 0 0 0 4h14" />
    </StripIcon>
  )
}

function Stat({ value, label, className }: { value: string | number; label: string; className?: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-base font-bold tabular-nums ${className ?? ""}`}>{value}</span>
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  )
}

// One recent game in the output strip: a football per goal + a boot per assist, wrapped and centred,
// with the opponent crest below and a dash for a blank game. Exact counts live in the title tooltip.
function GameInvolvement({ a }: { a: Appearance }) {
  const hasOutput = a.goals > 0 || a.assists > 0
  return (
    <div
      className="flex flex-1 flex-col items-center gap-1.5 rounded-md bg-muted/50 py-1.5"
      title={`${a.goals}G ${a.assists}A · ${a.home ? "vs" : "@"} ${a.opponent}`}
    >
      <div className="flex h-9 flex-wrap content-center items-center justify-center gap-0.5 overflow-hidden">
        {hasOutput ? (
          <>
            {Array.from({ length: a.goals }).map((_, i) => (
              <GoalIcon key={`g${a.matchId}-${i}`} className="size-3 text-foreground" />
            ))}
            {Array.from({ length: a.assists }).map((_, i) => (
              <AssistIcon key={`b${a.matchId}-${i}`} className="size-3 text-muted-foreground" />
            ))}
          </>
        ) : (
          <span className="text-sm leading-none text-muted-foreground/50">–</span>
        )}
      </div>
      {a.opponentLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.opponentLogo} alt={a.opponent} title={a.opponent} className="size-3.5 object-contain" />
      ) : (
        <span className="text-[8px] font-bold text-muted-foreground">{a.opponent.slice(0, 3).toUpperCase()}</span>
      )}
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

  // Per-game output strip: the player's goals + assists in each of the last few games. Same appearances
  // spine as the sparkline (oldest → newest), so it reads left → right in the same direction. Shown for
  // anyone with offensive output this season — a keeper's all-dash strip would be noise.
  const recentGames = data.appearances.slice(-GOAL_GAMES)
  const goalsInWindow = recentGames.reduce((sum, a) => sum + a.goals, 0)
  const assistsInWindow = recentGames.reduce((sum, a) => sum + a.assists, 0)
  const showOutput = (data.season.goals > 0 || data.season.assists > 0) && recentGames.length > 0

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

      {showOutput ? (
        <div className="flex flex-col gap-1.5 border-t pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">Gols e assists · últimos {recentGames.length}</span>
            <span className="flex items-center gap-2 text-[10px] tabular-nums text-muted-foreground">
              <span className="flex items-center gap-0.5" title="gols">
                <GoalIcon className="size-3.5 text-foreground" />
                <span className="font-semibold text-foreground">{goalsInWindow}</span>
              </span>
              <span className="flex items-center gap-0.5" title="assistências">
                <AssistIcon className="size-3.5" />
                <span className="font-semibold text-foreground">{assistsInWindow}</span>
              </span>
            </span>
          </div>
          <div className="flex gap-1">
            {recentGames.map((a) => (
              <GameInvolvement key={a.matchId} a={a} />
            ))}
          </div>
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
