"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import Link from "next/link"

import { useLeagueQuery } from "../../hooks/data/queries/use-league-query"
import { RoundsList } from "./rounds-list"
import { StandingsTable } from "./standings-table"

export function LeagueDetail({ code }: { code: string }) {
  const { data: league } = useLeagueQuery(code)

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Link href="/leagues" className="text-sm text-muted-foreground hover:text-foreground">
          ← Ligas
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{league?.name ?? code}</h1>
          <Badge variant="outline">{code}</Badge>
        </div>
        {league ? (
          <p className="text-sm text-muted-foreground">
            {league.country} · {league.season} · {league.rounds} rodadas · {league.matches} jogos
          </p>
        ) : null}
      </header>

      <Tabs defaultValue="standings">
        <TabsList>
          <TabsTrigger value="standings">Classificação</TabsTrigger>
          <TabsTrigger value="rounds">Rounds</TabsTrigger>
        </TabsList>
        <TabsContent value="standings" className="pt-2">
          <StandingsTable code={code} />
        </TabsContent>
        <TabsContent value="rounds" className="pt-2">
          <RoundsList code={code} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
