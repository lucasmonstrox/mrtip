import { redirect } from "next/navigation"

import { DEFAULT_LEAGUE_TAB } from "@/features/leagues/components/league-detail/league-tabs"

// Entrada sem aba → Classificação (default histórico). Links legados `/leagues/:code` continuam válidos.
// Query (`?season=` / `?round=`) acompanha o redirect pra não perder LIG-008 / LIG-015.
// @feature LIG-025
export default async function LeaguePage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { code } = await params
  const sp = await searchParams
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(sp)) {
    if (typeof value === "string") qs.set(key, value)
    else if (Array.isArray(value)) for (const v of value) qs.append(key, v)
  }
  const suffix = qs.size > 0 ? `?${qs.toString()}` : ""
  redirect(`/leagues/${code}/${DEFAULT_LEAGUE_TAB}${suffix}`)
}
