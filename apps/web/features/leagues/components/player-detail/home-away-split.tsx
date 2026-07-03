"use client"

import * as echarts from "echarts"
import { useEffect, useRef } from "react"

import type { PlayerAppearance } from "../../types"

// Per-90 casa × fora of the headline metrics — where the player actually produces, the split that
// feeds venue-conditioned prop bets. Rates come from the per-match spine (stat sum ÷ minutes × 90
// per venue). @feature LIG-001
export function HomeAwaySplit({ appearances }: { appearances: PlayerAppearance[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current)

    const per90 = (side: boolean, pick: (a: PlayerAppearance) => number) => {
      const games = appearances.filter((a) => a.home === side)
      const minutes = games.reduce((s, a) => s + (a.minutes ?? 0), 0)
      if (!minutes) return 0
      return +((games.reduce((s, a) => s + pick(a), 0) / minutes) * 90).toFixed(2)
    }

    const metrics: { label: string; pick: (a: PlayerAppearance) => number }[] = [
      { label: "Gols", pick: (a) => a.goals },
      { label: "Assistências", pick: (a) => a.assists },
      { label: "Passes-chave", pick: (a) => a.keyPasses ?? 0 },
      { label: "Chutes no gol", pick: (a) => a.shotsOnTarget ?? 0 },
    ]

    chart.setOption({
      grid: { top: 8, right: 40, bottom: 24, left: 96 },
      tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
      legend: {
        data: ["Casa", "Fora"],
        bottom: 0,
        textStyle: { color: "#94a3b8", fontSize: 11 },
        itemWidth: 12,
        itemHeight: 8,
      },
      xAxis: {
        type: "value",
        splitLine: { lineStyle: { color: "rgba(148,163,184,0.18)" } },
        axisLabel: { color: "#94a3b8", fontSize: 11 },
      },
      yAxis: {
        type: "category",
        data: metrics.map((m) => m.label),
        inverse: true,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: "#94a3b8" } },
        axisLabel: { color: "#94a3b8", fontSize: 12 },
      },
      series: [
        {
          name: "Casa",
          type: "bar",
          data: metrics.map((m) => per90(true, m.pick)),
          itemStyle: { color: "#3b82f6", borderRadius: [0, 3, 3, 0] },
          barMaxWidth: 14,
          label: { show: true, position: "right", color: "#94a3b8", fontSize: 10 },
        },
        {
          name: "Fora",
          type: "bar",
          data: metrics.map((m) => per90(false, m.pick)),
          itemStyle: { color: "#f97316", borderRadius: [0, 3, 3, 0] },
          barMaxWidth: 14,
          label: { show: true, position: "right", color: "#94a3b8", fontSize: 10 },
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

  return <div ref={ref} className="h-56 w-full" />
}
