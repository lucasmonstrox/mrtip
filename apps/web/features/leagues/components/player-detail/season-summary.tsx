"use client"

import type { PlayerDetail } from "../../types"
import { ratingColor } from "../../utils/format"

// How many of the latest games feed each tile's sparkline.
const SPARK_GAMES = 10

// Tiny inline-SVG sparkline of the last N per-game values — endpoint dot emphasized. Pure SVG (no
// chart lib): five of these render per page and they only need shape, not axes/tooltip.
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null
  const w = 96
  const h = 24
  const max = Math.max(...values, 1)
  const x = (i: number) => (i / (values.length - 1)) * (w - 4) + 2
  const y = (v: number) => h - 3 - (v / max) * (h - 6)
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  const lastValue = values[values.length - 1]!
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-6 w-24" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={x(values.length - 1)} cy={y(lastValue)} r="2.5" fill={color} />
    </svg>
  )
}

function Tile({
  label,
  value,
  sub,
  spark,
  color,
  valueClass,
}: {
  label: string
  value: string
  sub: string | null
  spark: number[]
  color: string
  valueClass?: string
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border bg-muted/30 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-2xl font-bold tabular-nums ${valueClass ?? ""}`}>{value}</span>
      {sub ? <span className="text-xs text-muted-foreground">{sub}</span> : null}
      <Sparkline values={spark} color={color} />
    </div>
  )
}

// Season-at-a-glance tiles: total + per-90 + a last-10-games sparkline per headline metric — the
// "is he producing NOW" read that plain totals hide. @feature LIG-001
export function SeasonSummary({ player }: { player: PlayerDetail }) {
  const apps = player.appearances // oldest → newest (the sparkline reads left → right in time)
  const recent = apps.slice(-SPARK_GAMES)
  const minutes = apps.reduce((s, a) => s + (a.minutes ?? 0), 0)
  const per90 = (total: number) =>
    player.per90.sufficient && minutes > 0 ? `${((total / minutes) * 90).toFixed(2)} por 90` : null

  const kpTotal = player.stats.keyPasses
  const sotTotal = player.stats.shotsOnTarget
  const series = (pick: (a: (typeof apps)[number]) => number) => recent.map(pick)

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <Tile
        label="Gols"
        value={String(player.season.goals)}
        sub={per90(player.season.goals)}
        spark={series((a) => a.goals)}
        color="#3b82f6"
      />
      <Tile
        label="Assistências"
        value={String(player.season.assists)}
        sub={per90(player.season.assists)}
        spark={series((a) => a.assists)}
        color="#a855f7"
      />
      <Tile
        label="Passes-chave"
        value={String(kpTotal)}
        sub={per90(kpTotal)}
        spark={series((a) => a.keyPasses ?? 0)}
        color="#10b981"
      />
      <Tile
        label="Chutes no gol"
        value={String(sotTotal)}
        sub={per90(sotTotal)}
        spark={series((a) => a.shotsOnTarget ?? 0)}
        color="#f59e0b"
      />
      <Tile
        label="Nota média"
        value={player.season.avgRating != null ? player.season.avgRating.toFixed(2) : "–"}
        sub="score SportMonks"
        spark={series((a) => a.rating ?? 0)}
        color="#64748b"
        valueClass={player.season.avgRating != null ? ratingColor(player.season.avgRating) : ""}
      />
    </div>
  )
}
