"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import { useTeamQuery } from "../../hooks/data/queries/use-team-query"
import { formatDate } from "../../utils/format"
import { FormChips } from "../match-detail/form-guide"

export function TeamDetail({ slug }: { slug: string }) {
  const { data: team, isPending, isError } = useTeamQuery(slug)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando time…</p>
  if (isError || !team)
    return <p className="text-sm text-destructive">Não foi possível carregar o time.</p>

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Forma</span>
          <FormChips recent={team.form.recent} />
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jogos ({team.matches.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {team.matches.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/matches/${m.id}`}
                  className="grid grid-cols-[6rem_1fr_auto_1fr] items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="text-xs text-muted-foreground">{formatDate(m.date, null)}</span>
                  <span className={cn("text-right", m.home.id === team.id && "font-semibold")}>
                    {m.home.name}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono tabular-nums">
                    {m.score ? `${m.score.ft[0]} - ${m.score.ft[1]}` : "vs"}
                  </span>
                  <span className={cn(m.away.id === team.id && "font-semibold")}>
                    {m.away.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
