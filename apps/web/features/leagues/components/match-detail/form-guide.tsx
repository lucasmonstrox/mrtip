import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import type { Form, FormResult } from "../../types"

// Color per result: win (green), draw (gray), loss (red).
const COLOR: Record<FormResult["result"], string> = {
  W: "bg-emerald-500 hover:bg-emerald-600",
  D: "bg-zinc-400 hover:bg-zinc-500",
  L: "bg-red-500 hover:bg-red-600",
}

function Chip({ r, size }: { r: FormResult; size: "sm" | "md" }) {
  const score = `${r.goalsFor}-${r.goalsAgainst}`
  const where = r.side === "home" ? "em casa" : "fora"
  return (
    <Tooltip>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent>
        {score} vs {r.opponent.name} ({where})
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Row of form chips — clickable (link to the match) with a score tooltip. The API returns
 * `recent` from most recent to oldest; we display oldest → recent (left → right).
 */
export function FormChips({ recent, size = "md" }: { recent: FormResult[]; size?: "sm" | "md" }) {
  if (!recent.length) return <span className="text-xs text-muted-foreground">—</span>
  return (
    <div className="flex items-center gap-1">
      {[...recent].reverse().map((r) => (
        <Chip key={r.matchId} r={r} size={size} />
      ))}
    </div>
  )
}

/** Full form guide: the chips + the W/D/L summary. Used on the match screen. */
export function FormGuide({ form }: { form: Form }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FormChips recent={form.recent} />
      <p className="text-xs text-muted-foreground tabular-nums">
        {form.summary.w}V · {form.summary.d}E · {form.summary.l}D
      </p>
    </div>
  )
}
