"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import Link from "next/link"

import { useMatchFormQuery } from "../../hooks/data/queries/use-match-form-query"
import { useMatchQuery } from "../../hooks/data/queries/use-match-query"
import { formatDate } from "../../utils/format"
import { Absences } from "./absences"
import { FormChips } from "./form-guide"
import { GoalTiming } from "./goal-timing"
import { Lineup } from "./lineup"
import { MatchEvents } from "./match-events"

// Empty-state for tabs whose data isn't wired up yet (or has no record for this match).
function TabEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

export function MatchDetail({ id }: { id: string }) {
  const { data: match, isPending, isError } = useMatchQuery(id)
  const { data: form } = useMatchFormQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando partida…</p>
  if (isError || !match)
    return <p className="text-sm text-destructive">Não foi possível carregar a partida.</p>

  const score = match.score

  return (
    <section className="flex flex-col gap-6">
      {/* Header: back-link + date + the scoreline itself (no card, compact) */}
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          <Link
            href={`/leagues/${match.league.code}`}
            className="hover:text-foreground"
          >
            ← {match.league.name}
          </Link>
          <span>{formatDate(match.date, match.time)}</span>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
          <div className="flex flex-col items-end gap-1.5">
            <Link
              href={`/teams/${match.home.slug}`}
              className="flex items-center justify-end gap-2 text-right text-base font-semibold hover:underline"
            >
              {match.home.name}
              {match.home.logoUrl ? (
                <img src={match.home.logoUrl} alt="" className="size-7 shrink-0 object-contain" />
              ) : null}
            </Link>
            {form ? <FormChips recent={form.home.recent} team={form.home.team} size="sm" /> : null}
          </div>
          <div className="text-center">
            {score ? (
              <div className="font-mono text-3xl font-bold tabular-nums">
                {score.ft[0]} <span className="text-muted-foreground">-</span> {score.ft[1]}
              </div>
            ) : (
              <div className="text-xl font-medium text-muted-foreground">vs</div>
            )}
            {score?.ht ? (
              <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                intervalo {score.ht[0]}-{score.ht[1]}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <Link
              href={`/teams/${match.away.slug}`}
              className="flex items-center gap-2 text-left text-base font-semibold hover:underline"
            >
              {match.away.logoUrl ? (
                <img src={match.away.logoUrl} alt="" className="size-7 shrink-0 object-contain" />
              ) : null}
              {match.away.name}
            </Link>
            {form ? <FormChips recent={form.away.recent} team={form.away.team} size="sm" /> : null}
          </div>
        </div>
      </header>

      <Tabs defaultValue="fatos">
        <TabsList>
          <TabsTrigger value="fatos">Fatos</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="escalacao">Escalação</TabsTrigger>
          <TabsTrigger value="h2h">H2H</TabsTrigger>
          <TabsTrigger value="gols">Gols (xG)</TabsTrigger>
          <TabsTrigger value="noticias">Notícias</TabsTrigger>
        </TabsList>

        <TabsContent value="eventos" className="pt-2">
          {match.goals.length || match.cards.length ? (
            <MatchEvents goals={match.goals} cards={match.cards} homeTeamId={match.home.id} />
          ) : (
            <TabEmpty>Sem eventos registrados.</TabEmpty>
          )}
        </TabsContent>

        <TabsContent value="escalacao" className="flex flex-col gap-6 pt-2">
          {/* Lineups + absences (each hidden when there's no record for this match) */}
          <Lineup id={id} />
          <Absences id={id} />
        </TabsContent>

        <TabsContent value="h2h" className="pt-2" />

        <TabsContent value="gols" className="pt-2">
          <GoalTiming id={id} />
        </TabsContent>

        <TabsContent value="fatos" className="pt-2">
          <TabEmpty>Fatos da partida em breve.</TabEmpty>
        </TabsContent>

        <TabsContent value="noticias" className="pt-2">
          <TabEmpty>Sem notícias para esta partida.</TabEmpty>
        </TabsContent>
      </Tabs>
    </section>
  )
}
