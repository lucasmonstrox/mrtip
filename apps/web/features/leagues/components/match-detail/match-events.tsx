import Link from "next/link"

import type { CardItem, GoalItem } from "../../types"

type MatchEvent = ({ kind: "goal" } & GoalItem) | ({ kind: "card" } & CardItem)

function cardIcon(type: CardItem["type"]): string {
  if (type === "yellow") return "🟨"
  if (type === "red") return "🟥"
  return "🟨🟥" // second yellow → sent off
}

function EventContent({ e }: { e: MatchEvent }) {
  const minute = (
    <span className="tabular-nums text-muted-foreground">{e.minute != null ? `${e.minute}'` : ""}</span>
  )

  if (e.kind === "goal") {
    const extra = e.type === "penalty" ? " (pên)" : e.type === "own" ? " (gc)" : ""
    return (
      <span className="inline-flex flex-wrap items-baseline gap-x-1">
        {minute}
        <span>⚽</span>
        <Link href={`/players/${e.scorer.id}`} className="font-medium hover:underline">
          {e.scorer.name}
          {extra}
        </Link>
        {e.assist ? (
          <Link href={`/players/${e.assist.id}`} className="text-xs text-muted-foreground hover:underline">
            ({e.assist.name})
          </Link>
        ) : null}
      </span>
    )
  }

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      {minute}
      <span>{cardIcon(e.type)}</span>
      <Link href={`/players/${e.player.id}`} className="font-medium hover:underline">
        {e.player.name}
      </Link>
    </span>
  )
}

/** Single chronological timeline of match events (goals + cards), each on the team's side. */
export function MatchEvents({
  goals,
  cards,
  homeTeamId,
}: {
  goals: GoalItem[]
  cards: CardItem[]
  homeTeamId: string
}) {
  const events: MatchEvent[] = [
    ...goals.map((g) => ({ kind: "goal" as const, ...g })),
    ...cards.map((c) => ({ kind: "card" as const, ...c })),
  ].sort((a, b) => (a.minute ?? 999) - (b.minute ?? 999))

  if (!events.length) return null
  return (
    <ul className="flex flex-col gap-1.5 border-t pt-4 text-sm">
      {events.map((e, i) => {
        const isHome = e.team.id === homeTeamId
        return (
          <li key={i} className="grid grid-cols-2 items-baseline gap-4">
            <span className="text-right">{isHome ? <EventContent e={e} /> : null}</span>
            <span className="text-left">{!isHome ? <EventContent e={e} /> : null}</span>
          </li>
        )
      })}
    </ul>
  )
}
