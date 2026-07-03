"use client"

import { Button } from "@workspace/ui/components/button"
import * as echarts from "echarts"
import { useEffect, useRef, useState } from "react"

import type { PlayerAppearance } from "../../types"
import { formatDate } from "../../utils/format"

// Rolling-mean window: the same "últimos 5" cut the prognosis engine uses (MOD-004).
const ROLL = 5

const METRICS = [
  { key: "keyPasses", label: "Passes-chave", color: "#10b981" },
  { key: "shotsOnTarget", label: "Chutes no gol", color: "#f59e0b" },
] as const

type MetricKey = (typeof METRICS)[number]["key"]

// Form curve of the season: the chosen volume metric per game (dots) + its 5-game rolling mean +
// the season average — the honest "is he heating up or cooling down" of a player. @feature LIG-001
export function FormCurve({ appearances }: { appearances: PlayerAppearance[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [metric, setMetric] = useState<MetricKey>("keyPasses")

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    const m = METRICS.find((x) => x.key === metric)!
    // SportMonks omits a detail type when its value is zero, so a null stat in a played game IS a
    // zero — coalescing keeps the curve honest instead of showing false gaps.
    const values = appearances.map((a) => a[metric] ?? 0)
    const avg = values.length ? values.reduce((s, v) => s + v, 0) / values.length : null
    const rolling = values.map((_, i) => {
      const win = values.slice(Math.max(0, i - ROLL + 1), i + 1)
      return +(win.reduce((s, v) => s + v, 0) / win.length).toFixed(2)
    })

    chart.setOption(
      {
        grid: { top: 16, right: 12, bottom: 24, left: 28 },
        tooltip: {
          trigger: "axis",
          formatter: (ps: { dataIndex: number }[]) => {
            const a = appearances[ps[0]!.dataIndex]
            if (!a) return ""
            const v = a[metric] ?? 0
            const r = rolling[ps[0]!.dataIndex]
            return `${formatDate(a.date, null)}<br/>${a.home ? "vs" : "@"} ${a.opponent}<br/><b>${m.label}: ${v}</b>${r != null ? ` · média móvel ${r}` : ""}`
          },
        },
        xAxis: {
          type: "category",
          data: appearances.map((a) => formatDate(a.date, null)),
          boundaryGap: false,
          axisLabel: { show: false },
          axisTick: { show: false },
          axisLine: { lineStyle: { color: "#94a3b8" } },
        },
        yAxis: {
          type: "value",
          minInterval: 1,
          splitLine: { lineStyle: { color: "rgba(148,163,184,0.18)" } },
          axisLabel: { color: "#94a3b8", fontSize: 11 },
        },
        series: [
          {
            name: m.label,
            type: "line",
            data: values,
            connectNulls: false,
            lineStyle: { width: 0 }, // dots only — the trend is the rolling line's job
            symbolSize: 7,
            itemStyle: { color: m.color, opacity: 0.55 },
          },
          {
            name: `Média móvel (${ROLL})`,
            type: "line",
            data: rolling,
            connectNulls: true,
            smooth: true,
            symbol: "none",
            lineStyle: { width: 2.5, color: m.color },
            ...(avg != null
              ? {
                  markLine: {
                    silent: true,
                    symbol: "none",
                    lineStyle: { type: "dashed", color: "#94a3b8" },
                    label: {
                      show: true,
                      formatter: `média ${avg.toFixed(1)}`,
                      color: "#94a3b8",
                      fontSize: 10,
                    },
                    data: [{ yAxis: avg }],
                  },
                }
              : {}),
          },
        ],
      },
      { notMerge: true },
    )

    const onResize = () => chart.resize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      chart.dispose()
    }
  }, [appearances, metric])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {METRICS.map((m) => (
          <Button
            key={m.key}
            variant="outline"
            size="sm"
            aria-pressed={metric === m.key}
            className={metric === m.key ? "" : "opacity-40"}
            onClick={() => setMetric(m.key)}
          >
            <span className="size-2.5 rounded-sm" style={{ backgroundColor: m.color }} aria-hidden />
            {m.label}
          </Button>
        ))}
      </div>
      <div ref={ref} className="h-56 w-full" />
    </div>
  )
}
