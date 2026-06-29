"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import Link from "next/link"
import { useState } from "react"

import { useLeagueRoundsQuery } from "../../hooks/data/queries/use-league-rounds-query"

export function RoundsList({ code }: { code: string }) {
  const { data: rounds, isPending, isError } = useLeagueRoundsQuery(code)
  const [selected, setSelected] = useState<number | null>(null)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando rounds…</p>
  if (isError || !rounds)
    return <p className="text-sm text-destructive">Não foi possível carregar os rounds.</p>

  const current = rounds.find((r) => r.round === selected) ?? rounds.at(-1)
  if (!current) return <p className="text-sm text-muted-foreground">Sem rounds disponíveis.</p>

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rodada {current.round}</CardTitle>
        <CardAction>
          <Select value={String(current.round)} onValueChange={(v) => setSelected(Number(v))}>
            <SelectTrigger className="w-[140px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rounds.map((r) => (
                <SelectItem key={r.round} value={String(r.round)}>
                  {r.round}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y border-t">
          {current.matches.map((m) => (
            <li
              key={m.id}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2 text-sm"
            >
              <Link
                href={`/teams/${m.home.slug}`}
                className="flex items-center justify-self-end gap-2 rounded font-medium decoration-2 underline-offset-4 hover:underline"
              >
                {m.home.name}
                {m.home.logoUrl ? (
                  <img src={m.home.logoUrl} alt="" className="size-5 shrink-0 object-contain" loading="lazy" />
                ) : null}
              </Link>
              <Link
                href={`/matches/${m.slug}`}
                className="rounded bg-muted px-2 py-0.5 font-mono tabular-nums transition-colors hover:bg-foreground hover:text-background"
              >
                {m.score ? `${m.score.ft[0]} - ${m.score.ft[1]}` : "vs"}
              </Link>
              <Link
                href={`/teams/${m.away.slug}`}
                className="flex items-center justify-self-start gap-2 rounded font-medium decoration-2 underline-offset-4 hover:underline"
              >
                {m.away.logoUrl ? (
                  <img src={m.away.logoUrl} alt="" className="size-5 shrink-0 object-contain" loading="lazy" />
                ) : null}
                {m.away.name}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
