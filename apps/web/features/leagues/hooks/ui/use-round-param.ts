"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

// Reads/writes the `?round=<n>` URL param that holds the round the user picked on the league's
// Rounds tab. Absent = the current round (the default the list computes). It lives in the URL, not
// in state, because Radix unmounts the inactive tab — local state would die on every tab switch,
// and this way a refresh or a shared link lands on the same round. @feature LIG-015
export function useRoundParam() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const raw = searchParams.get("round")
  const parsed = raw != null && raw !== "" ? Number(raw) : undefined
  const round = parsed != null && Number.isFinite(parsed) ? parsed : undefined

  // Replace (not push) so browsing rounds doesn't pollute the back stack; keep the scroll position.
  const setRound = useCallback(
    (next: number | undefined) => {
      const params = new URLSearchParams(searchParams)
      if (next == null) params.delete("round")
      else params.set("round", String(next))
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams],
  )

  return { round, setRound }
}
