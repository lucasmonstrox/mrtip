"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"

import { usePlayerQuery } from "../../hooks/data/queries/use-player-query"
import { formatDate } from "../../utils/format"

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function PlayerDetail({ id }: { id: string }) {
  const { data: player, isPending, isError } = usePlayerQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando jogador…</p>
  if (isError || !player)
    return <p className="text-sm text-destructive">Não foi possível carregar o jogador.</p>

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{player.name}</h1>
        <div className="flex gap-8">
          <Stat value={player.goals} label="gols" />
          <Stat value={player.assists} label="assistências" />
          <Stat value={player.matchesOut} label="jogos fora" />
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gols ({player.goalsList.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {player.goalsList.length ? (
            <ul className="divide-y">
              {player.goalsList.map((g, i) => (
                <li key={i}>
                  <Link
                    href={`/matches/${g.matchId}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="w-28 text-xs text-muted-foreground">{formatDate(g.date, null)}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {g.minute != null ? `${g.minute}'` : ""}
                      {g.type === "penalty" ? " (pên)" : ""}
                    </span>
                    <span className="flex-1">
                      {g.home} {g.score ? `${g.score[0]}-${g.score[1]}` : "x"} {g.away}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 pb-4 text-sm text-muted-foreground">
              Nenhum gol registrado (ou backfill de gols ainda incompleto).
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
