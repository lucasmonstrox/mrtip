"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import Link from "next/link"

import type { TeamRest, TeamStanding } from "../../types"
import { useMatchFormQuery } from "../../hooks/data/queries/use-match-form-query"
import { useMatchQuery } from "../../hooks/data/queries/use-match-query"
import { formatDate } from "../../utils/format"
import { Absences } from "./absences"
import { FormChips } from "./form-guide"
import { GoalTiming } from "./goal-timing"
import { Lineup } from "./lineup"
import { MatchEvents } from "./match-events"
import { Prognosis } from "./prognosis"
import { Scorers } from "./scorers"

// Empty-state for tabs whose data isn't wired up yet (or has no record for this match).
function TabEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

// Rest of one side: days since its previous in-league match, or "estreia" when the team has no
// earlier match in the dataset. The number comes ready from the API. @feature LIG-005
function RestSide({ name, rest }: { name: string; rest: TeamRest }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="truncate text-sm font-medium">{name}</span>
      {rest ? (
        <span className="text-lg font-semibold tabular-nums">
          {rest.restDays}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            {rest.restDays === 1 ? "dia" : "dias"}
          </span>
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">estreia</span>
      )}
    </div>
  )
}

// Qualification/relegation zone → text color for the position number (mirrors team-standing.tsx's ZONE).
const ZONE_COLOR: Record<string, string> = {
  champions: "text-emerald-600 dark:text-emerald-400",
  europa: "text-blue-600 dark:text-blue-400",
  conference: "text-cyan-600 dark:text-cyan-400",
  relegation: "text-red-600 dark:text-red-400",
}

// One side of the standings snapshot: the team's official current-season position (tinted by zone),
// points, W-D-L and goal difference. null → "—" (no standing row yet). @feature LIG-006
function StandingSide({ name, standing: s }: { name: string; standing: TeamStanding | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="truncate text-sm font-medium">{name}</span>
      {s ? (
        <>
          <span className="text-lg font-semibold tabular-nums">
            <span className={s.zone ? ZONE_COLOR[s.zone] : undefined}>{s.position}º</span>
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">{s.points} pts</span>
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {s.won}V · {s.drawn}E · {s.lost}D · SG {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
          </span>
        </>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      )}
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
  // Venue subtitle: city · capacity (omitting whichever is missing). @feature LIG-004
  const venue = match.venue
  const venueSubtitle = venue
    ? [venue.cityName, venue.capacity ? `${venue.capacity.toLocaleString("pt-BR")} lugares` : null]
        .filter(Boolean)
        .join(" · ")
    : ""

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
          <TabsTrigger value="prognostico">Prognóstico</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
          <TabsTrigger value="escalacao">Escalação</TabsTrigger>
          <TabsTrigger value="h2h">H2H</TabsTrigger>
          <TabsTrigger value="gols">Gols (xG)</TabsTrigger>
          <TabsTrigger value="noticias">Notícias</TabsTrigger>
        </TabsList>

        <TabsContent value="prognostico" className="pt-2">
          <Prognosis id={id} home={match.home} away={match.away} />
        </TabsContent>

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

        <TabsContent value="h2h" className="pt-2">
          <TabEmpty>Confrontos diretos em breve.</TabEmpty>
        </TabsContent>

        <TabsContent value="gols" className="flex flex-col gap-6 pt-2">
          <Scorers id={id} />
          <GoalTiming id={id} />
        </TabsContent>

        <TabsContent value="fatos" className="flex flex-col gap-4 pt-2">
          {/* Standings snapshot: each team's official current-season position/points/W-D-L/goal
              difference, position tinted by zone. Hidden when the API hasn't sent standings yet
              (stale pre-LIG-006 payload — `?.` guards the runtime). @feature LIG-006 */}
          {match.standings?.home || match.standings?.away ? (
            <div className="rounded-lg border p-4">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Classificação</span>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <StandingSide name={match.home.name} standing={match.standings?.home ?? null} />
                <StandingSide name={match.away.name} standing={match.standings?.away ?? null} />
              </div>
            </div>
          ) : null}

          {/* Venue (stadium): name + city + capacity (+ photo). lat/long are NOT shown — they feed
              the travel/fatigue signal, not the UI. @feature LIG-004 */}
          {venue ? (
            <div className="flex items-center gap-4 rounded-lg border p-4">
              {venue.imageUrl ? (
                <img src={venue.imageUrl} alt="" className="h-16 w-24 shrink-0 rounded object-cover" />
              ) : null}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Estádio</span>
                <span className="text-base font-semibold">{venue.name}</span>
                {venueSubtitle ? (
                  <span className="text-sm text-muted-foreground">{venueSubtitle}</span>
                ) : null}
              </div>
            </div>
          ) : (
            <TabEmpty>Estádio não informado.</TabEmpty>
          )}

          {/* Rest days: days since each team's previous match IN THIS LEAGUE. Midweek cup/national-team
              games aren't ingested, so this can overestimate rest — hence the "na liga" caveat. @feature LIG-005 */}
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Descanso</span>
              <span
                className="cursor-help text-xs text-muted-foreground underline decoration-dotted"
                title="Dias desde o último jogo de cada time nesta liga. Jogos de meio de semana fora da liga (copa, seleção) não entram, então o descanso pode estar superestimado."
              >
                na liga
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {/* `rest` is always present in the contract; `?? null` only hardens against a stale
                  pre-LIG-005 API payload (renders "estreia" instead of crashing). */}
              <RestSide name={match.home.name} rest={match.rest?.home ?? null} />
              <RestSide name={match.away.name} rest={match.rest?.away ?? null} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="noticias" className="pt-2">
          <TabEmpty>Sem notícias para esta partida.</TabEmpty>
        </TabsContent>
      </Tabs>
    </section>
  )
}
