import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import type { Form, FormResult, TeamRef } from "../../types"
import { daysAgo, formatDate } from "../../utils/format"

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
  // Half-time score in home×away order (null when the source has no HT); 2nd half = full − half.
  const ht =
    r.htGoalsFor == null || r.htGoalsAgainst == null
      ? null
      : r.side === "home"
        ? ([r.htGoalsFor, r.htGoalsAgainst] as const)
        : ([r.htGoalsAgainst, r.htGoalsFor] as const)
  return (
    <HoverCard openDelay={100} closeDelay={50}>
      <HoverCardTrigger asChild>
        <Link
          href={`/matches/${r.slug}`}
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
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            {r.competition.logoUrl ? (
              <img
                src={r.competition.logoUrl}
                alt={r.competition.name}
                className="size-3.5 object-contain"
                loading="lazy"
              />
            ) : null}
            <span className="text-[11px] font-medium text-muted-foreground">{r.competition.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Crest team={home} />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-lg font-bold tabular-nums">
                {homeGoals}
                <span className="mx-1 text-muted-foreground">-</span>
                {awayGoals}
              </span>
              {ht && (
                <>
                  <span className="rounded bg-sky-500/10 px-1.5 text-[11px] font-medium text-sky-600 tabular-nums dark:text-sky-400">
                    {ht[0]}-{ht[1]}
                  </span>
                  <span className="rounded bg-sky-500/10 px-1.5 text-[11px] font-medium text-sky-600 tabular-nums dark:text-sky-400">
                    {homeGoals - ht[0]}-{awayGoals - ht[1]}
                  </span>
                </>
              )}
            </div>
            <Crest team={away} />
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDate(r.date, null)} · {daysAgo(r.date)}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

/**
 * Row of form chips — clickable (link to the match) with a score popover (logo X-Y logo). The API
 * returns `recent` most-recent-first; we display in that order (left → right = most recent → oldest).
 * `team` is the side this form belongs to, needed to render the score in home×away order.
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
      {recent.map((r) => (
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
