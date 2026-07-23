"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useLayoutEffect } from "react"

import { useLeagueQuery } from "../../hooks/data/queries/use-league-query"
import { useSeasonsQuery } from "../../hooks/data/queries/use-seasons-query"
import { useStandingsQuery } from "../../hooks/data/queries/use-standings-query"
import { SeasonSwitcher } from "../season-switcher/season-switcher"
import { CupBracket } from "./cup-bracket"
import {
  CUP_TABS,
  defaultTabForType,
  isTabValidForType,
  LEAGUE_TABS,
  type LeaguePageTabValue,
} from "./league-tabs"
import { RoundsList } from "./rounds-list"
import { ScorersTable } from "./scorers-table"
import { StandingsTable } from "./standings-table"

export function LeagueDetail({ code, tab }: { code: string; tab: LeaguePageTabValue }) {
  const { data: league, isPending } = useLeagueQuery(code)
  const { data: seasons } = useSeasonsQuery(code)
  // Hold the header skeleton until the main content (standings) is also ready, so the
  // above-the-fold reveals as one piece instead of the header popping in over a loading table.
  const { isPending: standingsPending } = useStandingsQuery(code)
  const headerLoading = isPending || standingsPending
  // Copa (mata-mata) → Classificação/Rodadas não existem; Chaveamento no lugar. @feature CUP-001
  const isCup = league?.type === "cup"
  const leagueType = isCup ? "cup" : "league"
  const tabs = isCup ? CUP_TABS : LEAGUE_TABS

  const router = useRouter()
  const searchParams = useSearchParams()
  const qs = searchParams.toString()
  const qsSuffix = qs ? `?${qs}` : ""

  // Bare `/leagues/:code` redireciona pra /classificacao; em copa (ou deep-link inválido) corrige
  // pro default do tipo sem perder `?season=` / `?round=`. @feature LIG-025
  useLayoutEffect(() => {
    if (!league) return
    if (isTabValidForType(tab, leagueType)) return
    router.replace(`/leagues/${code}/${defaultTabForType(leagueType)}${qsSuffix}`)
  }, [league, leagueType, tab, code, router, qsSuffix])

  const tabOk = !league || isTabValidForType(tab, leagueType)

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
              {/* season switcher (ml-auto) reveals once seasons load; no skeleton placeholder for it */}
              <Skeleton className="ml-auto h-8 w-[140px] rounded-md bg-foreground/10" />
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
              {/* Season badge removed — the season switcher now shows the current season. @feature LIG-008 */}
              <div className="ml-auto">
                <SeasonSwitcher seasons={seasons ?? []} />
              </div>
            </div>
            {league ? (
              <p className="text-sm text-muted-foreground">
                {isCup ? `${league.matches} jogos` : `${league.rounds} rodadas · ${league.matches} jogos`}
              </p>
            ) : null}
          </>
        )}
      </header>

      {/* Aba controlada pela URL (`/leagues/[code]/[tab]`): refresh e deep-link abrem a aba certa.
          Query string acompanha o Link pra LIG-008/LIG-015. @feature LIG-025 */}
      <Tabs key={isCup ? "cup" : "league"} value={tabOk ? tab : defaultTabForType(leagueType)}>
        {/* Mesma linguagem de abas da página da partida (variante `line` + ícone). */}
        <TabsList variant="line" className="border-b">
          {tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} asChild className="gap-1.5">
              <Link href={`/leagues/${code}/${value}${qsSuffix}`}>
                <Icon aria-hidden />
                {label}
              </Link>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Só o painel da aba ativa monta — evita fetches escondidos. @feature LIG-025 */}
        {tabOk && tab === "classificacao" ? (
          <TabsContent value="classificacao" className="pt-2" forceMount>
            <StandingsTable code={code} />
          </TabsContent>
        ) : null}
        {tabOk && tab === "rodadas" ? (
          <TabsContent value="rodadas" className="pt-2" forceMount>
            <RoundsList code={code} />
          </TabsContent>
        ) : null}
        {tabOk && tab === "marcadores" ? (
          <TabsContent value="marcadores" className="pt-2" forceMount>
            <ScorersTable code={code} />
          </TabsContent>
        ) : null}
        {tabOk && tab === "chaveamento" ? (
          <TabsContent value="chaveamento" className="pt-2" forceMount>
            <CupBracket code={code} />
          </TabsContent>
        ) : null}
      </Tabs>
    </section>
  )
}
