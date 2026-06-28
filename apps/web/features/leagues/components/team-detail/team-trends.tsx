"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { useState } from "react"

import type { Proportion, TeamTrendSplit, TeamTrends as TeamTrendsType } from "../../types"

const SPLITS = [
  { key: "all", label: "Tudo" },
  { key: "home", label: "Casa" },
  { key: "away", label: "Fora" },
] as const

const pct = (v: number) => `${Math.round(v * 100)}%`

// One trend = headline % + the Wilson band and sample size below; n=0 shows nothing to claim.
function TrendRow({ label, p }: { label: string; p: Proportion }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      {p.n === 0 ? (
        <span className="text-xs text-muted-foreground">sem jogos</span>
      ) : (
        <div className="flex flex-col items-end">
          <span className="font-semibold tabular-nums">{pct(p.pct)}</span>
          <span className="text-[11px] text-muted-foreground tabular-nums">
            IC95% {pct(p.lo)}–{pct(p.hi)} · n={p.n}
            {p.lowSample && <span className="ml-1 text-amber-600">amostra baixa</span>}
          </span>
        </div>
      )}
    </div>
  )
}

// Betting trends derived from results (over 2.5 / both score / clean sheet), with a venue toggle.
// Every number carries its 95% band and sample size — never a bare % (small-sample honesty).
export function TeamTrends({ trends }: { trends: TeamTrendsType }) {
  const [split, setSplit] = useState<(typeof SPLITS)[number]["key"]>("all")
  const s: TeamTrendSplit = trends[split]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Gols</CardTitle>
        <div className="flex gap-1">
          {SPLITS.map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setSplit(o.key)}
              className={cn(
                "rounded px-2 py-1 text-xs transition-colors",
                split === o.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          <TrendRow label="Mais de 2.5 gols" p={s.over25} />
          <TrendRow label="Ambas marcam" p={s.btts} />
          <TrendRow label="Sem sofrer gol" p={s.cleanSheet} />
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">Gols feitos / sofridos (média)</span>
            <span className="font-semibold tabular-nums">
              {s.goalsForAvg.toFixed(2)} / {s.goalsAgainstAvg.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          Derivado dos resultados da temporada (PL 2025/26). Faixa = intervalo de confiança 95%.
        </p>
      </CardContent>
    </Card>
  )
}
