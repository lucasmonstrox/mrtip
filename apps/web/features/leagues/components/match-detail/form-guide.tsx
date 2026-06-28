import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import type { Form, FormResult, TeamRef } from "../../types"

// Color per result: win (green), draw (gray), loss (red).
const COLOR: Record<FormResult["result"], string> = {
  W: "bg-emerald-500 hover:bg-emerald-600",
  D: "bg-zinc-400 hover:bg-zinc-500",
  L: "bg-red-500 hover:bg-red-600",
}

// One side of the score popover: logo over the team name (name as fallback when there's no logo).
function Crest({ team }: { team: TeamRef }) {
  return (
    <div className="flex w-16 flex-col items-center gap-1 text-center">
      {team.logoUrl ? (
        <img src={team.logoUrl} alt={team.name} className="size-8 object-contain" loading="lazy" />
      ) : (
        <div className="size-8" />
      )}
      <span className="line-clamp-2 text-xs leading-tight font-medium">{team.name}</span>
    </div>
  )
}

function Chip({ r, team, size }: { r: FormResult; team: TeamRef; size: "sm" | "md" }) {
  // Rebuild the match in canonical home×away order from the team's perspective (side tells us
  // whether `team` was home or away); the popover shows logo_home X-Y logo_away.
  const [home, away] = r.side === "home" ? [team, r.opponent] : [r.opponent, team]
  const [homeGoals, awayGoals] =
    r.side === "home" ? [r.goalsFor, r.goalsAgainst] : [r.goalsAgainst, r.goalsFor]
  return (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger asChild>
        <Link
          href={`/matches/${r.matchId}`}
          className={cn(
            "flex cursor-pointer items-center justify-center rounded font-semibold text-white transition-colors",
            size === "md" ? "h-7 w-7 text-xs" : "h-5 w-5 text-[10px]",
            COLOR[r.result],
          )}
        >
          {r.result}
        </Link>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-auto px-3 py-2.5">
        <div className="flex items-center gap-3">
          <Crest team={home} />
          <span className="text-lg font-bold tabular-nums">
            {homeGoals}
            <span className="mx-1 text-muted-foreground">-</span>
            {awayGoals}
          </span>
          <Crest team={away} />
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

/**
 * Row of form chips — clickable (link to the match) with a score popover (logo X-Y logo). The API
 * returns `recent` from most recent to oldest; we display oldest → recent (left → right). `team` is
 * the side this form belongs to, needed to render the score in home×away order.
 */
export function FormChips({
  recent,
  team,
  size = "md",
}: {
  recent: FormResult[]
  team: TeamRef
  size?: "sm" | "md"
}) {
  if (!recent.length) return <span className="text-xs text-muted-foreground">—</span>
  return (
    <div className="flex items-center gap-1">
      {[...recent].reverse().map((r) => (
        <Chip key={r.matchId} r={r} team={team} size={size} />
      ))}
    </div>
  )
}

/** Full form guide: the chips + the W/D/L summary. Used on the match screen. */
export function FormGuide({ form }: { form: Form }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FormChips recent={form.recent} team={form.team} />
      <p className="text-xs text-muted-foreground tabular-nums">
        {form.summary.w}V · {form.summary.d}E · {form.summary.l}D
      </p>
    </div>
  )
}
