"use client"

import Link from "next/link"

import type { RecentTeamGame } from "../../types"
import { formatDate } from "../../utils/format"

// Cell fill by the site's rating scale (same thresholds as RatingChart's visualMap): green ≥7.5,
// neutral 6.5–7.5, red <6.5. Played-without-rating gets the neutral fill.
const cellColor = (rating: number | null) =>
  rating == null
    ? "bg-muted"
    : rating >= 7.5
      ? "bg-emerald-500"
      : rating >= 6.5
        ? "bg-slate-400 dark:bg-slate-500"
        : "bg-red-500"

// Season at a glance: one cell per CLUB match of the league season, colored by the player's rating —
// hot and cold streaks pop; an outlined cell = he didn't play (tooltip says why when known). @feature LIG-001
export function RatingStrip({ games }: { games: RecentTeamGame[] }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-1">
        {games.map((g) => {
          const title = `${formatDate(g.date, null)} · ${g.home ? "vs" : "@"} ${g.opponent}${
            g.played
              ? ` · nota ${g.rating != null ? g.rating.toFixed(2) : "—"}`
              : ` · não jogou${g.absenceReason ? ` (${g.absenceReason})` : ""}`
          }`
          return (
            <Link
              key={g.matchId}
              href={`/matches/${g.slug}`}
              title={title}
              aria-label={title}
              className={`h-8 w-4 rounded-sm transition-transform hover:scale-110 sm:w-5 ${
                g.played ? cellColor(g.rating) : "border border-dashed border-muted-foreground/40"
              }`}
            />
          )
        })}
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-emerald-500" aria-hidden /> ≥ 7.5
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-slate-400 dark:bg-slate-500" aria-hidden /> 6.5–7.5
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-red-500" aria-hidden /> &lt; 6.5
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm border border-dashed border-muted-foreground/40"
            aria-hidden
          />{" "}
          não jogou
        </span>
      </div>
    </div>
  )
}
