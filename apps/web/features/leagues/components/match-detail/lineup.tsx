import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"

import { useMatchLineupQuery } from "../../hooks/data/queries/use-match-lineup-query"
import type { LineupPlayer, TeamLineup } from "../../types"

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
      <Link href={`/players/${p.id}`} className="flex-1 hover:underline">
        {p.name}
      </Link>
      {p.position ? <span className="text-xs text-muted-foreground">{p.position}</span> : null}
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
