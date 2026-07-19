"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

// Reads/writes the `?season=<sportmonksSeasonId>` URL param that scopes the league/team/player pages
// to a season. Absent = current/default (the API resolves to the current season). The season switcher
// writes here; the data query hooks read it and refetch. @feature LIG-008
export function useSeasonParam() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const raw = searchParams.get("season")
  const parsed = raw != null && raw !== "" ? Number(raw) : undefined
  const season = parsed != null && Number.isFinite(parsed) ? parsed : undefined

  // Replace (not push) so switching season doesn't pollute the back stack; keep the scroll position.
  const setSeason = useCallback(
    (next: number | undefined) => {
      const params = new URLSearchParams(searchParams)
      if (next == null) params.delete("season")
      else params.set("season", String(next))
      // A round number belongs to the season it was picked in, so switching season drops it and
      // the list reopens on that season's current round. No-op on the team/player pages, which
      // share this hook but have no `?round=`. @feature LIG-015
      params.delete("round")
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return { season, setSeason }
}
