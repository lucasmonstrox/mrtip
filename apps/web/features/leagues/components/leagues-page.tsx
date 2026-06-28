"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Link from "next/link"

import { useLeaguesQuery } from "../hooks/data/queries/use-leagues-query"

export function LeaguesPage() {
  const { data: leagues, isPending, isError } = useLeaguesQuery()

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Ligas</h1>
        <p className="text-sm text-muted-foreground">
          Escolha uma liga para ver os rounds e a classificação.
        </p>
      </header>

      {isPending ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : isError || !leagues ? (
        <p className="text-sm text-destructive">Não foi possível carregar as ligas.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.map((league) => (
            <Link key={league.code} href={`/leagues/${league.code}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2">
                      {league.logoUrl ? (
                        <img
                          src={league.logoUrl}
                          alt=""
                          className="size-6 shrink-0 object-contain"
                          loading="lazy"
                        />
                      ) : null}
                      {league.name}
                    </span>
                    <Badge variant="secondary">{league.season}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{league.country}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
