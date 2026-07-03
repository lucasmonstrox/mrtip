"use client"

import * as echarts from "echarts"
import { useEffect, useRef } from "react"

import type { PlayerAppearance } from "../../types"
import { formatDate } from "../../utils/format"

// Cumulative goals and assists across the season, one step per game — a flat stretch reads as a
// drought, a staircase as a hot streak. @feature LIG-001
export function CumulativeGa({ appearances }: { appearances: PlayerAppearance[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    let g = 0
    let a = 0
    const goals: number[] = []
    const assists: number[] = []
    for (const ap of appearances) {
      g += ap.goals
      a += ap.assists
      goals.push(g)
      assists.push(a)
    }

    chart.setOption({
      grid: { top: 16, right: 12, bottom: 24, left: 28 },
      tooltip: {
        trigger: "axis",
        formatter: (ps: { dataIndex: number }[]) => {
          const i = ps[0]!.dataIndex
          const ap = appearances[i]
          if (!ap) return ""
          return `${formatDate(ap.date, null)} · ${ap.home ? "vs" : "@"} ${ap.opponent}<br/><b>${goals[i]} gols · ${assists[i]} assistências</b>`
        },
      },
      legend: {
        data: ["Gols", "Assistências"],
        bottom: 0,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        itemWidth: 12,
        itemHeight: 8,
      },
      xAxis: {
        type: "category",
        data: appearances.map((ap) => formatDate(ap.date, null)),
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
        { name: "Gols", type: "line", step: "end", data: goals, symbol: "none", lineStyle: { width: 2 }, itemStyle: { color: "#3b82f6" } },
        { name: "Assistências", type: "line", step: "end", data: assists, symbol: "none", lineStyle: { width: 2 }, itemStyle: { color: "#a855f7" } },
      ],
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
