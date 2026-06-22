"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Link from "next/link"

import { useLigasQuery } from "../hooks/data/queries/use-ligas-query"

export function LigasPage() {
  const { data: ligas, isPending, isError } = useLigasQuery()

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
      ) : isError || !ligas ? (
        <p className="text-sm text-destructive">Não foi possível carregar as ligas.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ligas.map((liga) => (
            <Link key={liga.code} href={`/ligas/${liga.code}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2">
                    {liga.nome}
                    <Badge variant="secondary">{liga.temporada}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{liga.pais}</CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
