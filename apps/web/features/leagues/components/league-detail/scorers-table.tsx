"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"
import { useCallback, useState } from "react"
import { Virtuoso } from "react-virtuoso"

import { useScorersQuery } from "../../hooks/data/queries/use-scorers-query"

// Reveal 20 scorers at a time; each time the user scrolls to the bottom, 20 more are shown.
const PAGE = 20

// Shared grid so the header and every row line up: rank · team logo · player · goals · assists.
const COLS = "grid grid-cols-[2.5rem_1.75rem_1fr_3.5rem_3.5rem] items-center gap-2"

// Module-level (stable identity) footer so Virtuoso doesn't remount it on every render; reads
// `hasMore` from the list context to show the loading hint until the whole ranking is revealed.
function LoadingMore({ context }: { context?: { hasMore: boolean } }) {
  if (!context?.hasMore) return null
  return <div className="py-3 text-center text-xs text-muted-foreground">Carregando mais…</div>
}

const VIRTUOSO_COMPONENTS = { Footer: LoadingMore }

// Nearest scrollable ancestor of `el`. The app shell scrolls inside a container (not the window),
// so Virtuoso must virtualize against that element — the list then grows the page and uses the
// existing scrollbar instead of an inner one.
function findScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null
  while (node) {
    const overflowY = getComputedStyle(node).overflowY
    if (overflowY === "auto" || overflowY === "scroll") return node
    node = node.parentElement
  }
  return null
}

export function ScorersTable({ code }: { code: string }) {
  const { data: scorers, isPending, isError } = useScorersQuery(code)
  // How many rows are revealed; grows by PAGE every time the bottom is reached (20 em 20).
  const [count, setCount] = useState(PAGE)
  // undefined = not resolved yet; null = no scroll container found (fall back to the window).
  const [scrollParent, setScrollParent] = useState<HTMLElement | null | undefined>(undefined)
  // Callback ref: resolves the scroll parent once the wrapper actually mounts (after data loads).
  const setRootRef = useCallback((node: HTMLDivElement | null) => {
    if (node) setScrollParent(findScrollParent(node))
  }, [])

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando marcadores…</p>
  if (isError || !scorers)
    return <p className="text-sm text-destructive">Não foi possível carregar os marcadores.</p>
  if (!scorers.length)
    return <p className="text-sm text-muted-foreground">Nenhum gol registrado nesta liga ainda.</p>

  const visible = scorers.slice(0, count)
  const hasMore = count < scorers.length
  // Page scroll, never an internal scrollbar: virtualize against the app's scroll container.
  const scrollProps =
    scrollParent != null ? { customScrollParent: scrollParent } : { useWindowScroll: true as const }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Marcadores</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={setRootRef} className="flex flex-col">
          <div className={`${COLS} border-y px-4 py-2 text-sm font-medium text-muted-foreground`}>
            <span>#</span>
            <span aria-hidden="true" />
            <span>Jogador</span>
            <span className="text-center">G</span>
            <span className="text-center">A</span>
          </div>

          {scrollParent !== undefined ? (
            <Virtuoso
              {...scrollProps}
              data={visible}
              context={{ hasMore }}
              endReached={() => setCount((c) => Math.min(c + PAGE, scorers.length))}
              increaseViewportBy={300}
              components={VIRTUOSO_COMPONENTS}
              itemContent={(index, s) => (
                <Link
                  href={`/players/${s.id}`}
                  className={`${COLS} border-b px-4 py-2 text-sm transition-colors hover:bg-muted/50`}
                >
              <span className="tabular-nums text-muted-foreground">{index + 1}</span>
              <span className="flex items-center justify-center">
                {s.team?.logoUrl ? (
                  <img
                    src={s.team.logoUrl}
                    alt=""
                    title={s.team.name}
                    className="size-5 shrink-0 object-contain"
                    loading="lazy"
                  />
                ) : null}
              </span>
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
              )}
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
