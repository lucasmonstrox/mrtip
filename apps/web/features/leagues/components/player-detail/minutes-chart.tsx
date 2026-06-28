"use client"

import * as echarts from "echarts"
import { useEffect, useRef } from "react"

import { formatDate } from "../../utils/format"

type MinutePoint = {
  date: string | Date
  minutes: number | null
  starter: boolean
  opponent: string
  opponentLogo: string | null
  home: boolean
}

// Minutes-per-match bar chart (ECharts), one bar per appearance across the season. Bars are coloured
// by role (green = titular, grey = entrou do banco) so rotation/usage reads at a glance.
export function MinutesChart({ appearances }: { appearances: MinutePoint[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    const labels = appearances.map((a) => formatDate(a.date, null))
    const data = appearances.map((a) => ({
      value: a.minutes ?? 0,
      itemStyle: { color: a.starter ? "#10b981" : "#94a3b8" },
    }))

    chart.setOption({
      grid: { top: 16, right: 12, bottom: 24, left: 28 },
      tooltip: {
        trigger: "axis",
        formatter: (ps: { dataIndex: number }[]) => {
          const a = appearances[ps[0]!.dataIndex]
          if (!a) return ""
          const side = a.home ? "vs" : "@"
          const logo = a.opponentLogo
            ? `<img src="${a.opponentLogo}" style="height:16px;vertical-align:middle;margin-right:4px"/>`
            : ""
          return `${formatDate(a.date, null)}<br/>${side} ${logo}${a.opponent}<br/><b>${a.minutes ?? 0}'</b> ${a.starter ? "titular" : "suplente"}`
        },
      },
      xAxis: {
        type: "category",
        data: labels,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#94a3b8" } },
      },
      yAxis: {
        type: "value",
        min: 0,
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.18)" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
      },
      series: [{ type: "bar", data, barWidth: "60%" }],
    })

    const onResize = () => chart.resize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      chart.dispose()
    }
  }, [appearances])

  return <div ref={ref} className="h-56 w-full" />
}
