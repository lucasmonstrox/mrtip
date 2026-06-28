import Link from "next/link"

import type { GoalItem } from "../../types"

function Goal({ g }: { g: GoalItem }) {
  const extra = g.type === "penalty" ? " (pên)" : g.type === "own" ? " (gc)" : ""
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      <span className="tabular-nums text-muted-foreground">{g.minute != null ? `${g.minute}'` : ""}</span>
      <span>⚽</span>
      <Link href={`/players/${g.scorer.id}`} className="font-medium hover:underline">
        {g.scorer.name}
        {extra}
      </Link>
      {g.assist ? (
        <Link href={`/players/${g.assist.id}`} className="text-xs text-muted-foreground hover:underline">
          ({g.assist.name})
        </Link>
      ) : null}
    </span>
  )
}

/** Timeline of goals: each goal on the side of the team that scored (home on the left). */
export function GoalsList({ goals, homeTeamId }: { goals: GoalItem[]; homeTeamId: string }) {
  if (!goals.length) return null
  return (
    <ul className="flex flex-col gap-1.5 border-t pt-4 text-sm">
      {goals.map((g, i) => {
        const isHome = g.team.id === homeTeamId
        return (
          <li key={i} className="grid grid-cols-2 items-baseline gap-4">
            <span className="text-right">{isHome ? <Goal g={g} /> : null}</span>
            <span className="text-left">{!isHome ? <Goal g={g} /> : null}</span>
          </li>
        )
      })}
    </ul>
  )
}
