"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import Link from "next/link"

import { useMatchScorersQuery } from "../../hooks/data/queries/use-match-scorers-query"
import type { TeamScorers } from "../../types"
import { PlayerHoverCard } from "../player-hover-card/player-hover-card"

// One team's column: its top goleadores (foto + nome) with goals (G) and assists (A). Each row links
// to the player page and opens the season hover-card; the header row aligns the G/A columns.
function ScorersSide({ t }: { t: TeamScorers }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {t.team.logoUrl ? (
          <img src={t.team.logoUrl} alt="" className="size-6 shrink-0 object-contain" />
        ) : null}
        <Link href={`/teams/${t.team.slug}`} className="truncate font-medium hover:underline">
          {t.team.name}
        </Link>
      </div>
      {t.scorers.length === 0 ? (
        <p className="text-xs text-muted-foreground">Sem gols registrados.</p>
      ) : (
        <ul className="flex flex-col">
          <li className="grid grid-cols-[1fr_2rem_2rem] items-center gap-2 border-b pb-1 text-[11px] font-medium text-muted-foreground">
            <span>Jogador</span>
            <span className="text-center">G</span>
            <span className="text-center">A</span>
          </li>
          {t.scorers.map((s) => (
            <li key={s.id}>
              <PlayerHoverCard id={s.id}>
                <Link
                  href={`/players/${s.id}`}
                  className="grid grid-cols-[1fr_2rem_2rem] items-center gap-2 border-b py-1.5 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="flex min-w-0 items-center gap-2 font-medium">
                    {s.imageUrl ? (
                      <img
                        src={s.imageUrl}
                        alt=""
                        className="size-5 shrink-0 rounded-full object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <span className="truncate">{s.name}</span>
                  </span>
                  <span className="text-center font-semibold tabular-nums">{s.goals}</span>
                  <span className="text-center tabular-nums">{s.assists}</span>
                </Link>
              </PlayerHoverCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// "Gols (xG)" tab widget (W-022): the top scorers (marcadores) of each team over the season — a
// "quem pode marcar" preview that pairs with the goal-timing profile in the same tab.
export function Scorers({ id }: { id: string }) {
  const { data, isPending } = useMatchScorersQuery(id)
  if (isPending) return <p className="text-sm text-muted-foreground">Carregando artilheiros…</p>
  if (!data) return null
  const empty = data.home.scorers.length === 0 && data.away.scorers.length === 0
  if (empty) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        Sem gols registrados para listar artilheiros.
      </div>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Artilheiros</CardTitle>
        <CardDescription className="text-xs">
          Principais goleadores de cada equipe na temporada — prévia de quem pode marcar.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <ScorersSide t={data.home} />
        <ScorersSide t={data.away} />
      </CardContent>
    </Card>
  )
}
