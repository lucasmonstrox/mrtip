"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { MapPin, Ruler, Weight } from "lucide-react"
import Link from "next/link"

import { usePlayerQuery } from "../../hooks/data/queries/use-player-query"
import { age, formatDate, ratingColor } from "../../utils/format"
import { SeasonSwitcher } from "../season-switcher/season-switcher"
import { MinutesChart } from "./minutes-chart"
import { RatingChart } from "./rating-chart"

// Short labels for the most-played position code (G/D/M/F).
const POSITION_LABEL: Record<string, string> = {
  G: "Goleiro",
  D: "Defensor",
  M: "Meio-campo",
  F: "Atacante",
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// Row layout shared by the match-log header and each appearance row.
const ROW = "grid grid-cols-[6.5rem_1fr_3rem_3rem_2.5rem_2.5rem_2.5rem] items-center gap-2"

export function PlayerDetail({ id }: { id: string }) {
  const { data: player, isPending, isError } = usePlayerQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando jogador…</p>
  if (isError || !player)
    return <p className="text-sm text-destructive">Não foi possível carregar o jogador.</p>

  // Most recent first (the API returns appearances oldest → newest, the spine order for aggregates).
  const matches = [...player.appearances].reverse()

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {player.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={player.imageUrl}
              alt=""
              className="size-20 shrink-0 rounded-full object-cover ring-1 ring-border"
            />
          ) : null}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">{player.name}</h1>
            {player.currentTeam ? (
              <Link
                href={`/teams/${player.currentTeam.slug}`}
                className="flex w-fit items-center gap-1.5 text-sm font-medium hover:underline"
              >
                {player.currentTeam.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={player.currentTeam.logoUrl} alt="" className="size-5 shrink-0 object-contain" />
                ) : null}
                {player.currentTeam.name}
              </Link>
            ) : null}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {player.nationality ? (
                <span className="flex items-center gap-1.5">
                  {player.nationality.flagUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={player.nationality.flagUrl} alt="" className="h-3.5 w-5 shrink-0 object-cover" />
                  ) : null}
                  {player.nationality.name}
                </span>
              ) : null}
              {player.position ? (
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {POSITION_LABEL[player.position] ?? player.position}
                </span>
              ) : null}
              {age(player.dateOfBirth) != null ? (
                <span>
                  {age(player.dateOfBirth)} anos
                  {player.dateOfBirth ? ` · ${formatDate(player.dateOfBirth, null)}` : ""}
                </span>
              ) : null}
              {player.height ? (
                <span className="flex items-center gap-1">
                  <Ruler className="size-3.5" aria-hidden />
                  {player.height} cm
                </span>
              ) : null}
              {player.weight ? (
                <span className="flex items-center gap-1">
                  <Weight className="size-3.5" aria-hidden />
                  {player.weight} kg
                </span>
              ) : null}
            </div>
          </div>
          <div className="ml-auto self-start">
            <SeasonSwitcher seasons={player.seasons} />
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Temporada</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            <Stat value={player.season.appearances} label="jogos" />
            <Stat value={player.season.starts} label="titular" />
            <Stat value={player.season.minutes} label="minutos" />
            <div className="flex flex-col">
              <span
                className={`text-2xl font-bold tabular-nums ${player.season.avgRating != null ? ratingColor(player.season.avgRating) : ""}`}
              >
                {player.season.avgRating != null ? player.season.avgRating.toFixed(2) : "–"}
              </span>
              <span className="text-xs text-muted-foreground">nota média</span>
            </div>
            <Stat
              value={player.season.goals}
              label={player.season.penaltyGoals ? `gols (${player.season.penaltyGoals} pên)` : "gols"}
            />
            <Stat value={player.season.assists} label="assistências" />
            <Stat value={player.season.motm} label="MOTM" />
            <Stat value={player.season.yellow} label="amarelos" />
            <Stat value={player.season.red} label="vermelhos" />
            <Stat value={player.matchesOut} label="jogos fora" />
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Por 90 min:</span>{" "}
            {player.per90.sufficient
              ? `${player.per90.goals.toFixed(2)} gols · ${player.per90.assists.toFixed(2)} assists · ${player.per90.ga.toFixed(2)} G+A`
              : "amostra insuficiente (< 540 min)"}
          </div>
          {player.season.goals > 0 ? (
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Gols:</span> casa {player.goalSplits.home} · fora{" "}
              {player.goalSplits.away} · 1º tempo {player.goalSplits.firstHalf} · 2º tempo{" "}
              {player.goalSplits.secondHalf}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {player.appearances.some((a) => a.rating != null) ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Evolução da nota na temporada</CardTitle>
              {player.season.avgRating != null ? (
                <span className="text-sm text-muted-foreground">
                  Média{" "}
                  <span className={`font-semibold tabular-nums ${ratingColor(player.season.avgRating)}`}>
                    {player.season.avgRating.toFixed(2)}
                  </span>
                </span>
              ) : null}
            </div>
          </CardHeader>
          <CardContent>
            <RatingChart appearances={player.appearances} />
          </CardContent>
        </Card>
      ) : null}

      {player.appearances.some((a) => a.minutes != null) ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Minutos por partida</CardTitle>
          </CardHeader>
          <CardContent>
            <MinutesChart appearances={player.appearances} />
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Partidas ({matches.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {matches.length ? (
            <>
              <div className={`${ROW} border-b px-4 py-2 text-xs font-medium text-muted-foreground`}>
                <span>Data</span>
                <span>Adversário</span>
                <span className="text-center">Placar</span>
                <span className="text-center">Nota</span>
                <span className="text-center">Min</span>
                <span className="text-center">G</span>
                <span className="text-center">A</span>
              </div>
              <ul className="divide-y">
                {matches.map((m) => {
                  // Score from the player's perspective: their team's goals first.
                  const score = m.score
                    ? m.home
                      ? `${m.score[0]}-${m.score[1]}`
                      : `${m.score[1]}-${m.score[0]}`
                    : "—"
                  return (
                    <li key={m.matchId}>
                      <Link
                        href={`/matches/${m.slug}`}
                        className={`${ROW} px-4 py-2 text-sm transition-colors hover:bg-muted/50`}
                      >
                        <span className="text-xs text-muted-foreground">{formatDate(m.date, null)}</span>
                        <span className="flex min-w-0 items-center gap-1.5 truncate">
                          <span className="text-xs text-muted-foreground">{m.home ? "vs" : "@"}</span>
                          {m.opponentLogo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.opponentLogo} alt="" className="size-5 shrink-0 object-contain" />
                          ) : null}
                          <span className="truncate">{m.opponent}</span>
                          {m.motm ? <span title="Melhor da partida">⭐</span> : null}
                          {m.red ? <span className="text-destructive" title="Expulso">🟥</span> : null}
                          {m.yellow ? <span title={`${m.yellow} amarelo(s)`}>🟨</span> : null}
                        </span>
                        <span className="text-center tabular-nums text-muted-foreground">{score}</span>
                        <span
                          className={`text-center font-semibold tabular-nums ${m.rating != null ? ratingColor(m.rating) : ""}`}
                        >
                          {m.rating != null ? m.rating.toFixed(2) : "–"}
                        </span>
                        <span className="text-center tabular-nums text-muted-foreground">
                          {m.minutes != null ? `${m.minutes}'` : "–"}
                        </span>
                        <span className="text-center font-semibold tabular-nums">
                          {m.goals || "–"}
                        </span>
                        <span className="text-center tabular-nums text-muted-foreground">
                          {m.assists || "–"}
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </>
          ) : (
            <p className="px-4 pb-4 text-sm text-muted-foreground">
              Nenhuma participação registrada (ou backfill de escalações ainda incompleto).
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
