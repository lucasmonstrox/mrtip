"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

import { useLeagueQuery } from "../../hooks/data/queries/use-league-query"
import { useStandingsQuery } from "../../hooks/data/queries/use-standings-query"
import { RoundsList } from "./rounds-list"
import { ScorersTable } from "./scorers-table"
import { StandingsTable } from "./standings-table"

export function LeagueDetail({ code }: { code: string }) {
  const { data: league, isPending } = useLeagueQuery(code)
  // Hold the header skeleton until the main content (standings) is also ready, so the
  // above-the-fold reveals as one piece instead of the header popping in over a loading table.
  const { isPending: standingsPending } = useStandingsQuery(code)
  const headerLoading = isPending || standingsPending

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        {headerLoading ? (
          <>
            {/* bg-foreground/10: o header fica direto sobre bg-background, onde o
                bg-muted padrão do Skeleton é quase invisível (mesma luminância). */}
            <div className="flex items-center gap-3">
              <Skeleton className="size-8 rounded-md bg-foreground/10" />
              <Skeleton className="h-7 w-48 bg-foreground/10" />
              <Skeleton className="h-5 w-10 rounded-4xl bg-foreground/10" />
              <Skeleton className="h-5 w-20 rounded-4xl bg-foreground/10" />
            </div>
            {/* Reserva o line-box de 20px do <p text-sm> abaixo — sem isso a
                tabela desce 4px quando o subtítulo real entra (CLS). */}
            <div className="flex h-5 items-center">
              <Skeleton className="h-4 w-40 bg-foreground/10" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              {league?.logoUrl ? (
                <img
                  src={league.logoUrl}
                  alt=""
                  className="size-8 shrink-0 object-contain"
                  loading="lazy"
                />
              ) : null}
              <h1 className="text-2xl font-semibold tracking-tight">{league?.name ?? code}</h1>
              <Badge variant="outline">{code}</Badge>
              {league ? <Badge variant="secondary">{league.season}</Badge> : null}
            </div>
            {league ? (
              <p className="text-sm text-muted-foreground">
                {league.rounds} rodadas · {league.matches} jogos
              </p>
            ) : null}
          </>
        )}
      </header>

      <Tabs defaultValue="standings">
        <TabsList>
          <TabsTrigger value="standings">Classificação</TabsTrigger>
          <TabsTrigger value="rounds">Rounds</TabsTrigger>
          <TabsTrigger value="scorers">Marcadores</TabsTrigger>
        </TabsList>
        <TabsContent value="standings" className="pt-2">
          <StandingsTable code={code} />
        </TabsContent>
        <TabsContent value="rounds" className="pt-2">
          <RoundsList code={code} />
        </TabsContent>
        <TabsContent value="scorers" className="pt-2">
          <ScorersTable code={code} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
