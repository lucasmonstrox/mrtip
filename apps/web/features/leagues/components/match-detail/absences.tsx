import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import { useMatchInjuriesQuery } from "../../hooks/data/queries/use-match-injuries-query"
import type { TeamAbsences } from "../../types"
import { PlayerHoverCard } from "../player-hover-card/player-hover-card"

function AbsencesSide({ a }: { a: TeamAbsences | null }) {
  if (!a || !a.absences.length)
    return <p className="text-sm text-muted-foreground">Sem desfalques registrados.</p>
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium">{a.team.name}</p>
      <ul className="flex flex-col gap-1">
        {a.absences.map((x) => (
          <li key={x.player.id} className="flex items-baseline gap-2 text-sm">
            <PlayerHoverCard id={x.player.id}>
              <Link
                href={`/players/${x.player.id}`}
                className={cn("hover:underline", !x.didNotPlay && "text-muted-foreground")}
              >
                {x.player.name}
              </Link>
            </PlayerHoverCard>
            {x.goals > 0 ? (
              <span
                className="rounded bg-emerald-500/15 px-1 text-[10px] font-semibold text-emerald-600"
                title="gols na temporada até este jogo"
              >
                {x.goals}⚽
                {x.assists > 0 ? ` ${x.assists}🅰` : ""}
              </span>
            ) : null}
            {x.reason ? <span className="text-xs text-muted-foreground">· {x.reason}</span> : null}
            {x.consecutiveOut >= 2 ? (
              <span className="text-xs text-muted-foreground">· fora há {x.consecutiveOut} jogos</span>
            ) : null}
            {!x.didNotPlay ? (
              <span className="rounded bg-amber-500/15 px-1 text-[10px] font-medium text-amber-600">
                dúvida
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Absences({ id }: { id: string }) {
  const { data, isPending } = useMatchInjuriesQuery(id)
  if (isPending) return null
  if (!data || (!data.home && !data.away)) return null // no record → don't show the card

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Desfalques</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <AbsencesSide a={data.home} />
        <AbsencesSide a={data.away} />
      </CardContent>
    </Card>
  )
}
