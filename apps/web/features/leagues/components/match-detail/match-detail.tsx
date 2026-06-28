"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Link from "next/link"

import { useMatchFormQuery } from "../../hooks/data/queries/use-match-form-query"
import { useMatchQuery } from "../../hooks/data/queries/use-match-query"
import { formatDate } from "../../utils/format"
import { Absences } from "./absences"
import { FormGuide } from "./form-guide"
import { Lineup } from "./lineup"
import { MatchEvents } from "./match-events"

export function MatchDetail({ id }: { id: string }) {
  const { data: match, isPending, isError } = useMatchQuery(id)
  const { data: form } = useMatchFormQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando partida…</p>
  if (isError || !match)
    return <p className="text-sm text-destructive">Não foi possível carregar a partida.</p>

  const score = match.score

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Link
          href={`/leagues/${match.league.code}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {match.league.name}
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{match.name}</Badge>
          <span>{formatDate(match.date, match.time)}</span>
        </div>
      </header>

      {/* Score */}
      <Card>
        <CardContent className="flex flex-col gap-4 py-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link
            href={`/teams/${match.home.slug}`}
            className="flex items-center justify-end gap-2 text-right text-lg font-semibold hover:underline"
          >
            {match.home.name}
            {match.home.logoUrl ? (
              <img src={match.home.logoUrl} alt="" className="size-8 shrink-0 object-contain" />
            ) : null}
          </Link>
          <div className="text-center">
            {score ? (
              <div className="font-mono text-4xl font-bold tabular-nums">
                {score.ft[0]} <span className="text-muted-foreground">-</span> {score.ft[1]}
              </div>
            ) : (
              <div className="text-2xl font-medium text-muted-foreground">vs</div>
            )}
            {score?.ht ? (
              <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                intervalo {score.ht[0]}-{score.ht[1]}
              </div>
            ) : null}
          </div>
          <Link
            href={`/teams/${match.away.slug}`}
            className="flex items-center gap-2 text-left text-lg font-semibold hover:underline"
          >
            {match.away.logoUrl ? (
              <img src={match.away.logoUrl} alt="" className="size-8 shrink-0 object-contain" />
            ) : null}
            {match.away.name}
          </Link>
          </div>
          <MatchEvents goals={match.goals} cards={match.cards} homeTeamId={match.home.id} />
        </CardContent>
      </Card>

      {/* Form of both teams */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Forma</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{match.home.name}</p>
            {form ? <FormGuide form={form.home} /> : <Skeleton className="h-7 w-44" />}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{match.away.name}</p>
            {form ? <FormGuide form={form.away} /> : <Skeleton className="h-7 w-44" />}
          </div>
        </CardContent>
      </Card>

      {/* Absences (injuries/suspensions) — hidden when there's no record */}
      <Absences id={id} />

      {/* Lineups (hidden when there's no lineup for this match yet) */}
      <Lineup id={id} />
    </section>
  )
}
