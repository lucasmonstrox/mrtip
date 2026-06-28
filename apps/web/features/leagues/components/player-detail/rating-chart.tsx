"use client"

import * as echarts from "echarts"
import { useEffect, useRef } from "react"

import { formatDate } from "../../utils/format"

type RatingPoint = {
  date: string | Date
  rating: number | null
  opponent: string
  opponentLogo: string | null
  home: boolean
}

// Rating-over-season line chart (ECharts). One point per appearance, coloured by the same scale as
// the match-log (green ≥7.5 · neutral ≥6.5 · red <6.5) via a piecewise visualMap; a dashed line marks
// the season average. Games without a rating leave a gap (connectNulls: false).
export function RatingChart({ appearances }: { appearances: RatingPoint[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    const labels = appearances.map((a) => formatDate(a.date, null))
    const values = appearances.map((a) => a.rating)
    const rated = values.filter((v): v is number => v != null)
    const avg = rated.length ? rated.reduce((s, v) => s + v, 0) / rated.length : null

    chart.setOption({
      grid: { top: 16, right: 12, bottom: 24, left: 28 },
      tooltip: {
        trigger: "axis",
        formatter: (ps: { dataIndex: number }[]) => {
          const a = appearances[ps[0]!.dataIndex]
          if (!a) return ""
          const side = a.home ? "vs" : "@"
          const r = a.rating != null ? a.rating.toFixed(2) : "—"
          const logo = a.opponentLogo
            ? `<img src="${a.opponentLogo}" style="height:16px;vertical-align:middle;margin-right:4px"/>`
            : ""
          return `${formatDate(a.date, null)}<br/>${side} ${logo}${a.opponent}<br/><b>Nota ${r}</b>`
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        boundaryGap: false,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#94a3b8" } },
      },
      yAxis: {
        type: "value",
        scale: true,
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.18)" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
      },
      visualMap: {
        show: false,
        dimension: 1,
        pieces: [
          { gte: 7.5, color: "#10b981" },
          { gte: 6.5, lt: 7.5, color: "#64748b" },
          { lt: 6.5, color: "#ef4444" },
        ],
        outOfRange: { color: "#64748b" },
      },
      series: [
        {
          type: "line",
          data: values,
          connectNulls: false,
          smooth: true,
          symbolSize: 6,
          lineStyle: { width: 2 },
          ...(avg != null
            ? {
                markLine: {
                  silent: true,
                  symbol: "none",
                  lineStyle: { type: "dashed", color: "#94a3b8" },
                  label: { show: false }, // average shown in the card header, not on the chart
                  data: [{ yAxis: avg }],
                },
              }
            : {}),
        },
      ],
    })

    const onResize = () => chart.resize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      chart.dispose()
    }
  }, [appearances])

  return <div ref={ref} className="h-64 w-full" />
}
