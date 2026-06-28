import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"

import { useMatchLineupQuery } from "../../hooks/data/queries/use-match-lineup-query"
import type { LineupPlayer, TeamLineup } from "../../types"

// Rating → text color (green good, amber average, red poor).
function ratingColor(r: number): string {
  if (r >= 7.5) return "text-emerald-600 dark:text-emerald-400"
  if (r >= 6.5) return "text-foreground"
  return "text-red-600 dark:text-red-400"
}

function LineupRow({ p }: { p: LineupPlayer }) {
  return (
    <li className="flex items-center gap-2 py-0.5 text-sm">
      <span className="w-6 text-right font-mono tabular-nums text-muted-foreground">{p.number ?? "–"}</span>
      {p.imageUrl ? (
        <img
          src={p.imageUrl}
          alt=""
          className="size-6 shrink-0 rounded-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="size-6 shrink-0 rounded-full bg-muted" />
      )}
      <Link href={`/players/${p.id}`} className="flex-1 truncate hover:underline">
        {p.name}
      </Link>
      {p.manOfMatch ? <span title="Man of the Match">⭐</span> : null}
      {p.minutesPlayed != null ? (
        <span className="font-mono text-xs tabular-nums text-muted-foreground">{p.minutesPlayed}&apos;</span>
      ) : null}
      {p.position ? <span className="w-4 text-center text-xs text-muted-foreground">{p.position}</span> : null}
      {p.rating != null ? (
        <span
          className={`w-9 rounded bg-muted px-1 text-center font-mono text-xs font-semibold tabular-nums ${ratingColor(p.rating)}`}
        >
          {p.rating.toFixed(1)}
        </span>
      ) : (
        <span className="w-9" />
      )}
    </li>
  )
}

function LineupSide({ lineup }: { lineup: TeamLineup | null }) {
  if (!lineup) return <p className="text-sm text-muted-foreground">Escalação não disponível.</p>
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="flex items-center gap-2 font-medium">
          {lineup.team.logoUrl ? (
            <img src={lineup.team.logoUrl} alt="" className="size-6 shrink-0 object-contain" />
          ) : null}
          {lineup.team.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {lineup.formation ?? "—"}
          {lineup.coach ? " · " : ""}
          {lineup.coach && lineup.coachId ? (
            <Link href={`/coaches/${lineup.coachId}`} className="hover:underline">
              {lineup.coach}
            </Link>
          ) : (
            lineup.coach
          )}
        </p>
      </div>
      <ul>
        {lineup.starters.map((p) => (
          <LineupRow key={p.id} p={p} />
        ))}
      </ul>
      {lineup.bench.length ? (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">Banco ({lineup.bench.length})</summary>
          <ul className="mt-1">
            {lineup.bench.map((p) => (
              <LineupRow key={p.id} p={p} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

export function Lineup({ id }: { id: string }) {
  const { data, isPending } = useMatchLineupQuery(id)
  if (isPending) return null
  if (!data || (!data.home && !data.away)) return null // no lineup yet → don't show the card

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Escalações</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LineupSide lineup={data.home} />
        <LineupSide lineup={data.away} />
      </CardContent>
    </Card>
  )
}
