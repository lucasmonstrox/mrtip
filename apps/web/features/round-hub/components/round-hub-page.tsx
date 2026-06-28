"use client"

import { format, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useMemo, useState } from "react"

import { round30 } from "../mocks/round-30"
import type { HubMatch } from "../types"
import { evOf } from "../utils/format"
import { ComplianceBanner } from "./compliance-banner"
import { HubFilters, type MarketFilter, type SortBy } from "./hub-filters"
import { KeyAbsencesStrip } from "./key-absences-strip"
import { MatchCard } from "./match-card/match-card"
import { RoundHeader } from "./round-header"

// Mock: só a rodada 30 existe. As outras renderizam estado vazio (honestidade do mock).
const ROUNDS: Record<number, typeof round30> = { 30: round30 }
const MIN_ROUND = 1
const MAX_ROUND = 38

const dayLabel = (date: string) => {
  const d = parse(date, "yyyy-MM-dd", new Date())
  const s = format(d, "EEEE, dd 'de' MMM", { locale: ptBR })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const dateRangeOf = (matches: HubMatch[]) => {
  if (!matches.length) return ""
  const days = [...new Set(matches.map((m) => m.date))].sort()
  const fmt = (d: string) => format(parse(d, "yyyy-MM-dd", new Date()), "dd MMM", { locale: ptBR })
  return days.length > 1 ? `${fmt(days[0]!)} – ${fmt(days.at(-1)!)}` : fmt(days[0]!)
}

const marketCategory = (market: string): MarketFilter => {
  const m = market.toLowerCase()
  if (m.includes("ambas")) return "btts"
  if (m.includes("gol") || m.includes("2.5")) return "goals"
  return "result"
}

const evValue = (m: HubMatch) => (m.value ? evOf(m.value) : Number.NEGATIVE_INFINITY)

export function RoundHubPage() {
  const [round, setRound] = useState(30)
  const [sortBy, setSortBy] = useState<SortBy>("ev")
  const [evOnly, setEvOnly] = useState(false)
  const [market, setMarket] = useState<MarketFilter>("all")

  const data = ROUNDS[round]
  const allMatches = useMemo(() => data?.matches ?? [], [data])

  const filtered = useMemo(() => {
    let ms = allMatches
    if (evOnly) ms = ms.filter((m) => m.value)
    if (market !== "all")
      ms = ms.filter((m) => m.value && marketCategory(m.value.market) === market)
    return ms
  }, [allMatches, evOnly, market])

  // Por VALOR: lista plana ordenada por EV (modo varredura). Por HORÁRIO: agrupada por dia.
  const byEv = useMemo(() => [...filtered].sort((a, b) => evValue(b) - evValue(a)), [filtered])
  const byDay = useMemo(() => {
    const groups = new Map<string, HubMatch[]>()
    for (const m of [...filtered].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))) {
      const g = groups.get(m.date) ?? []
      g.push(m)
      groups.set(m.date, g)
    }
    return [...groups.entries()]
  }, [filtered])

  return (
    <div className="flex flex-col">
      <ComplianceBanner />
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-6 md:px-6">
        <RoundHeader
          round={round}
          dateRange={dateRangeOf(allMatches)}
          updatedAt={data?.updatedAt ?? "—"}
          onPrev={() => setRound((r) => Math.max(MIN_ROUND, r - 1))}
          onNext={() => setRound((r) => Math.min(MAX_ROUND, r + 1))}
          canPrev={round > MIN_ROUND}
          canNext={round < MAX_ROUND}
        />

        {allMatches.length === 0 ? (
          <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
            Rodada {round} não disponível neste mock. Volte para a rodada 30.
          </div>
        ) : (
          <>
            <KeyAbsencesStrip matches={allMatches} />
            <HubFilters
              sortBy={sortBy}
              onSortBy={setSortBy}
              evOnly={evOnly}
              onEvOnly={setEvOnly}
              market={market}
              onMarket={setMarket}
              shown={filtered.length}
              total={allMatches.length}
            />

            {filtered.length === 0 ? (
              <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
                Nenhum jogo com valor (EV+) nos filtros atuais. Não apostar também é resultado.
              </div>
            ) : sortBy === "ev" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {byEv.map((m) => (
                  <MatchCard key={m.id} match={m} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                {byDay.map(([date, ms]) => (
                  <section key={date} className="flex flex-col gap-3">
                    <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      {dayLabel(date)}
                    </h2>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                      {ms.map((m) => (
                        <MatchCard key={m.id} match={m} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
