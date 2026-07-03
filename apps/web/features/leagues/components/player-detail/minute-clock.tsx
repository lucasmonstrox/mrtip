"use client"

import { Button } from "@workspace/ui/components/button"
import * as echarts from "echarts"
import { useEffect, useRef, useState } from "react"

import type { PlayerMinuteEvent } from "../../types"
import { formatDate } from "../../utils/format"

// Series config per event kind: label + fixed color (identity follows the kind, never the order).
const KINDS = [
  { kind: "goal", label: "Gols", color: "#3b82f6" },
  { kind: "assist", label: "Assistências", color: "#a855f7" },
  { kind: "yellow", label: "Amarelos", color: "#eab308" },
  { kind: "red", label: "Vermelhos", color: "#ef4444" },
] as const satisfies readonly { kind: PlayerMinuteEvent["kind"]; label: string; color: string }[]

// 0–90' clock of the season: one DOT per goal/assist/card at the exact match minute (overlapping
// minutes stack into lanes), with per-kind filter chips — "in which minute of games does he
// decide". @feature LIG-001
export function MinuteClock({ events }: { events: PlayerMinuteEvent[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<Set<PlayerMinuteEvent["kind"]>>(
    () => new Set(KINDS.map((k) => k.kind)),
  )

  // Kinds that exist in this player's season — a defender with zero assists doesn't get a dead chip.
  const present = KINDS.filter((k) => events.some((e) => e.kind === k.kind))

  const toggle = (kind: PlayerMinuteEvent["kind"]) => {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(kind)) {
        // Never filter down to an empty chart: at least one PRESENT kind stays on.
        if (present.some((k) => k.kind !== kind && next.has(k.kind))) next.delete(kind)
      } else next.add(kind)
      return next
    })
  }

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    // One dot per event at its exact minute. Events sharing a 2-minute cell stack into vertical
    // lanes so nothing overlaps; the y value is just the lane index (axis hidden — it encodes
    // nothing beyond "these coincide").
    const shown = KINDS.filter((k) => active.has(k.kind))
    const lanes = new Map<number, number>()
    const points = new Map<PlayerMinuteEvent["kind"], { value: [number, number]; ev: PlayerMinuteEvent }[]>()
    for (const k of shown) points.set(k.kind, [])
    let maxLane = 0
    for (const e of [...events].sort((x, y) => (x.minute ?? 0) - (y.minute ?? 0))) {
      if (e.minute == null || !active.has(e.kind)) continue
      const cell = Math.floor(e.minute / 2)
      const lane = lanes.get(cell) ?? 0
      lanes.set(cell, lane + 1)
      maxLane = Math.max(maxLane, lane)
      points.get(e.kind)!.push({ value: [e.minute, lane], ev: e })
    }

    chart.setOption(
      {
        grid: { top: 12, right: 12, bottom: 24, left: 12 },
        tooltip: {
          trigger: "item",
          formatter: (p: { seriesIndex: number; dataIndex: number }) => {
            const k = shown[p.seriesIndex]
            const pt = k ? points.get(k.kind)![p.dataIndex] : undefined
            if (!k || !pt) return ""
            const e = pt.ev
            return `<b>${e.minute}' — ${k.label.replace(/s$/, "")}</b><br/>${e.home ? "vs" : "@"} ${e.opponent} · ${formatDate(e.date, null)}`
          },
        },
        xAxis: {
          type: "value",
          min: 0,
          max: 95,
          interval: 15,
          axisLabel: { color: "#94a3b8", fontSize: 11, formatter: (v: number) => (v > 90 ? "" : `${v}'`) },
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "#94a3b8" } },
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.18)" } },
        },
        yAxis: { type: "value", min: -0.5, max: Math.max(maxLane, 3) + 0.5, show: false },
        // Half-time marker: the one vertical reference the clock needs.
        series: shown.map((k, i) => ({
          name: k.label,
          type: "scatter",
          data: points.get(k.kind)!.map((p) => p.value),
          symbolSize: 12,
          itemStyle: { color: k.color, borderColor: "rgba(0,0,0,0.35)", borderWidth: 1 },
          ...(i === 0
            ? {
                markLine: {
                  silent: true,
                  symbol: "none",
                  lineStyle: { type: "dashed", color: "#94a3b8" },
                  label: { show: true, formatter: "HT", color: "#94a3b8", fontSize: 10 },
                  data: [{ xAxis: 45 }],
                },
              }
            : {}),
        })),
      },
      { notMerge: true }, // a removed kind must drop its series, not linger merged
    )

    const onResize = () => chart.resize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      chart.dispose()
    }
  }, [events, active])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {present.map((k) => (
          <Button
            key={k.kind}
            variant="outline"
            size="sm"
            aria-pressed={active.has(k.kind)}
            className={active.has(k.kind) ? "" : "opacity-40"}
            onClick={() => toggle(k.kind)}
          >
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: k.color }} aria-hidden />
            {k.label}
          </Button>
        ))}
      </div>
      <div ref={ref} className="h-56 w-full" />
    </div>
  )
}
