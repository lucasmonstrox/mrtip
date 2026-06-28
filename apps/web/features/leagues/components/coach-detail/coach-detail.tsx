"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"

import { useCoachQuery } from "../../hooks/data/queries/use-coach-query"
import { formatDate } from "../../utils/format"

export function CoachDetail({ id }: { id: string }) {
  const { data: coach, isPending, isError } = useCoachQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando técnico…</p>
  if (isError || !coach)
    return <p className="text-sm text-destructive">Não foi possível carregar o técnico.</p>

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{coach.name}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jogos dirigidos ({coach.matches.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {coach.matches.map((m) => (
              <li key={m.matchId}>
                <Link
                  href={`/matches/${m.matchId}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="w-28 text-xs text-muted-foreground">{formatDate(m.date, null)}</span>
                  <span className="flex-1">
                    {m.home} {m.score ? `${m.score[0]}-${m.score[1]}` : "x"} {m.away}
                  </span>
                  <span className="text-xs text-muted-foreground">{m.team}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
