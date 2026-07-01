"use client"

import * as echarts from "echarts"
import { useEffect, useRef } from "react"

export type MomentumPoint = { minute: number; home: number; away: number }

// Attack-momentum seesaw (à la Sofascore): one bar per minute of (home − away) pressure — bar UP and
// tinted home-colour when the home side dominates that minute, DOWN and away-colour when the visitor
// does. The diff (not two stacked series) is what gives the recognisable swing across the midline. The
// curve is symmetric (both teams have value), unlike the paid zero-sum Pressure Index. @feature SIN-021
export function MomentumChart({
  series,
  homeColor,
  awayColor,
}: {
  series: MomentumPoint[]
  homeColor: string
  awayColor: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    const minutes = series.map((p) => p.minute)
    const diffs = series.map((p) => Math.round((p.home - p.away) * 100) / 100)

    chart.setOption({
      grid: { top: 12, right: 8, bottom: 24, left: 8 },
      tooltip: {
        trigger: "axis",
        formatter: (ps: { dataIndex: number }[]) => {
          const p = series[ps[0]!.dataIndex]
          if (!p) return ""
          const who = p.home >= p.away ? "Casa" : "Visitante"
          return `${p.minute}'<br/><b>${who}</b> pressionando<br/>casa ${p.home} · fora ${p.away}`
        },
      },
      xAxis: {
        type: "category",
        data: minutes,
        boundaryGap: false,
        axisLabel: { color: "#94a3b8", fontSize: 11, interval: 14, formatter: (v: string) => `${v}'` },
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#94a3b8" } },
      },
      yAxis: {
        type: "value",
        axisLabel: { show: false },
        splitLine: { show: false },
        axisLine: { show: false },
      },
      series: [
        {
          type: "bar",
          data: diffs,
          barCategoryGap: "10%",
          itemStyle: { color: (p: { value: number }) => (p.value >= 0 ? homeColor : awayColor) },
        },
      ],
    })

    const onResize = () => chart.resize()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      chart.dispose()
    }
  }, [series, homeColor, awayColor])

  return <div ref={ref} className="h-56 w-full" />
}
