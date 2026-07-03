"use client"

import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ChevronLeft, ChevronRight, Footprints, MapPin, Ruler, Weight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { usePlayerQuery } from "../../hooks/data/queries/use-player-query"
import { age, formatDate, ratingColor } from "../../utils/format"
import { SeasonSwitcher } from "../season-switcher/season-switcher"
import { CumulativeGa } from "./cumulative-ga"
import { FormCurve } from "./form-curve"
import { HomeAwaySplit } from "./home-away-split"
import { MinuteClock } from "./minute-clock"
import { MinutesChart } from "./minutes-chart"
import { RatingStrip } from "./rating-strip"
import { SeasonSummary } from "./season-summary"
import { PlayerStatCards } from "./player-stat-cards"
import { RatingChart } from "./rating-chart"

// Short labels for the most-played position code (G/D/M/F).
const POSITION_LABEL: Record<string, string> = {
  G: "Goleiro",
  D: "Defensor",
  M: "Meio-campo",
  F: "Atacante",
}

// Preferred foot (SportMonks metadata) → PT label. @feature W-057
const FOOT_LABEL: Record<string, string> = {
  left: "Canhoto",
  right: "Destro",
  both: "Ambidestro",
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

// Row layout shared by the match-log header and each appearance row. The 2rem competition track
// mirrors the rank track of the scorers table so both tables share the same left rhythm.
const ROW = "grid grid-cols-[6.5rem_2rem_3rem_1fr_3rem_2.5rem_2.5rem_2.5rem_2.5rem_2.5rem] items-center gap-2"

// Matches shown per page in the match log (10 em 10, com paginador).
const MATCHES_PAGE = 10

export function PlayerDetail({ id }: { id: string }) {
  const { data: player, isPending, isError } = usePlayerQuery(id)
  // Current page of the match log (0-based). Clamped at render so a season switch never strands
  // the user past the last page of a shorter list.
  const [matchPage, setMatchPage] = useState(0)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando jogador…</p>
  if (isError || !player)
    return <p className="text-sm text-destructive">Não foi possível carregar o jogador.</p>

  // Most recent first (the API returns appearances oldest → newest, the spine order for aggregates).
  const matches = [...player.appearances].reverse()
  const totalPages = Math.max(1, Math.ceil(matches.length / MATCHES_PAGE))
  const page = Math.min(matchPage, totalPages - 1)
  const pageMatches = matches.slice(page * MATCHES_PAGE, (page + 1) * MATCHES_PAGE)

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
              {player.preferredFoot ? (
                <span className="flex items-center gap-1">
                  <Footprints className="size-3.5" aria-hidden />
                  {FOOT_LABEL[player.preferredFoot] ?? player.preferredFoot}
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

      {player.appearances.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temporada em resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <SeasonSummary player={player} />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temporada</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              <Stat value={player.season.appearances} label="jogos" />
              <Stat value={player.season.starts} label="titular" />
              <Stat value={player.season.minutes} label="minutos" />
              {player.season.avgMinutes != null ? (
                <Stat value={Math.round(player.season.avgMinutes)} label="min/jogo" />
              ) : null}
              <div className="flex flex-col">
                <span
                  className={`text-2xl font-bold tabular-nums ${player.season.avgRating != null ? ratingColor(player.season.avgRating) : ""}`}
                >
                  {player.season.avgRating != null ? player.season.avgRating.toFixed(2) : "–"}
                </span>
                <span className="text-xs text-muted-foreground">nota média</span>
              </div>
              <Stat value={player.season.motm} label="MOTM" />
              <Stat value={player.matchesOut} label="jogos fora" />
              {player.stats.captainGames > 0 ? (
                <Stat value={player.stats.captainGames} label="capitão" />
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produção</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-x-4 gap-y-3">
              <Stat
                value={player.season.goals}
                label={player.season.penaltyGoals ? `gols (${player.season.penaltyGoals} pên)` : "gols"}
              />
              <Stat value={player.season.assists} label="assistências" />
              <Stat value={player.stats.keyPasses} label="passes-chave" />
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Por 90 min:</span>{" "}
              {player.per90.sufficient
                ? `${player.per90.goals.toFixed(2)} gols · ${player.per90.assists.toFixed(2)} assists · ${player.per90.ga.toFixed(2)} G+A`
                : "amostra insuficiente (< 540 min)"}
            </div>
            {player.season.goals > 0 ? (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Gols:</span> casa {player.goalSplits.home} ·
                fora {player.goalSplits.away} · 1º tempo {player.goalSplits.firstHalf} · 2º tempo{" "}
                {player.goalSplits.secondHalf}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <PlayerStatCards player={player} />
      </div>

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

      {player.seasonTeamGames.length ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rating jogo a jogo — a temporada num olhar</CardTitle>
          </CardHeader>
          <CardContent>
            <RatingStrip games={player.seasonTeamGames} />
          </CardContent>
        </Card>
      ) : null}

      {player.appearances.length >= 5 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Curva de forma</CardTitle>
          </CardHeader>
          <CardContent>
            <FormCurve appearances={player.appearances} />
          </CardContent>
        </Card>
      ) : null}

      {player.season.goals + player.season.assists > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gols + assistências acumulados</CardTitle>
            </CardHeader>
            <CardContent>
              <CumulativeGa appearances={player.appearances} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Casa × fora (por 90 min)</CardTitle>
            </CardHeader>
            <CardContent>
              <HomeAwaySplit appearances={player.appearances} />
            </CardContent>
          </Card>
        </div>
      ) : null}

      {player.minuteEvents.some((e) => e.minute != null) ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Em que minuto ele decide</CardTitle>
          </CardHeader>
          <CardContent>
            <MinuteClock events={player.minuteEvents} />
          </CardContent>
        </Card>
      ) : null}

      {player.appearances.some((a) => a.minutes != null) ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Minutos por partida</CardTitle>
              {player.season.avgMinutes != null ? (
                <span className="text-sm text-muted-foreground">
                  Média{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {Math.round(player.season.avgMinutes)}&#39;
                  </span>{" "}
                  por jogo
                </span>
              ) : null}
            </div>
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
              <div className={`${ROW} h-10 border-b px-4 text-sm font-medium text-foreground`}>
                <span>Data</span>
                <span className="text-center" title="Competição">
                  Cp
                </span>
                <span className="text-center">Placar</span>
                <span>Adversário</span>
                <span className="text-center">Nota</span>
                <span className="text-center">Min</span>
                <span className="text-center">G</span>
                <span className="text-center">A</span>
                <span className="text-center" title="Passes-chave">
                  PC
                </span>
                <span className="text-center" title="Chutes no gol">
                  CG
                </span>
              </div>
              <ul className="divide-y">
                {pageMatches.map((m) => {
                  return (
                    <li key={m.matchId}>
                      <Link
                        href={`/matches/${m.slug}`}
                        className={`${ROW} h-12 px-4 text-sm transition-colors hover:bg-muted/50`}
                      >
                        <span className="text-xs text-muted-foreground">{formatDate(m.date, null)}</span>
                        <span className="flex justify-center" title={m.competition.name}>
                          {m.competition.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.competition.logoUrl}
                              alt={m.competition.name}
                              className="size-5 shrink-0 object-contain"
                            />
                          ) : (
                            <span className="text-xs text-muted-foreground">–</span>
                          )}
                        </span>
                        {/* Placar na perspectiva do jogador (gols do time dele primeiro), colorido
                            pelo resultado: verde vitória, vermelho derrota, neutro empate. */}
                        {(() => {
                          const us = m.score ? (m.home ? m.score[0] : m.score[1]) : null
                          const them = m.score ? (m.home ? m.score[1] : m.score[0]) : null
                          const color =
                            us == null || them == null
                              ? "text-muted-foreground"
                              : us > them
                                ? "text-green-600 dark:text-green-500"
                                : us < them
                                  ? "text-red-600 dark:text-red-500"
                                  : "text-muted-foreground"
                          return (
                            <span className={`text-center font-medium tabular-nums ${color}`}>
                              {us != null ? `${us}-${them}` : "–"}
                            </span>
                          )
                        })()}
                        <span className="flex min-w-0 items-center gap-2 truncate">
                          <span
                            className="flex size-4 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-semibold text-muted-foreground"
                            title={m.home ? "Em casa" : "Fora de casa"}
                          >
                            {m.home ? "C" : "F"}
                          </span>
                          {m.opponentLogo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.opponentLogo} alt="" className="size-8 shrink-0 object-contain" />
                          ) : null}
                          <span className="truncate">{m.opponent}</span>
                          {m.motm ? <span title="Melhor da partida">⭐</span> : null}
                          {m.red ? <span className="text-destructive" title="Expulso">🟥</span> : null}
                          {m.yellow ? <span title={`${m.yellow} amarelo(s)`}>🟨</span> : null}
                        </span>
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
                        <span className="text-center tabular-nums text-muted-foreground">
                          {m.keyPasses || "–"}
                        </span>
                        <span className="text-center tabular-nums text-muted-foreground">
                          {m.shotsOnTarget || "–"}
                        </span>
                      </Link>
                    </li>
                  )
                })}
                {/* Filler rows keep the table at a fixed 10-slot height so flipping to a shorter
                    last page doesn't shift the layout (CLS). */}
                {/* h-12 lives on an inner div (not the li) so the divide-y border adds the same 1px
                    to fillers as it does to real rows — otherwise border-box eats it and the last
                    page ends up a few px shorter. */}
                {Array.from({ length: MATCHES_PAGE - pageMatches.length }, (_, i) => (
                  <li key={`filler-${i}`} aria-hidden>
                    <div className="h-12" />
                  </li>
                ))}
              </ul>
              {totalPages > 1 ? (
                <div className="flex items-center justify-center gap-3 border-t px-4 py-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page === 0}
                    onClick={() => setMatchPage(page - 1)}
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                    Anteriores
                  </Button>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    Página {page + 1} de {totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={page >= totalPages - 1}
                    onClick={() => setMatchPage(page + 1)}
                  >
                    Próximas
                    <ChevronRight className="size-4" aria-hidden />
                  </Button>
                </div>
              ) : null}
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
