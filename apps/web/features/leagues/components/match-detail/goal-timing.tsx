import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { useMatchGoalTimingQuery } from "../../hooks/data/queries/use-match-goal-timing-query"
import type { TeamGoalTiming } from "../../types"

// One metric's bar within a band: a proportional bar + fixed-width count and % columns, so the counts
// and percentages line up across every row no matter how many digits each one has.
function Bar({ value, pct, peak, color }: { value: number; pct: number; peak: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-2.5 flex-1 overflow-hidden rounded-sm bg-muted">
        <div className={`h-full rounded-sm ${color}`} style={{ width: `${peak ? (value / peak) * 100 : 0}%` }} />
      </div>
      <span className="w-5 shrink-0 text-right font-mono text-[11px] tabular-nums">{value}</span>
      <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
        {Math.round(pct * 100)}%
      </span>
    </div>
  )
}

// One team's column: the six 15-min bands, each with two bars — goals SCORED (green) and CONCEDED
// (red). Both share one scale (the team's worst band of either metric) so "scores more than it
// concedes here" reads directly; the % is each goal's share of that metric's season total.
function TimingSide({ t }: { t: TeamGoalTiming }) {
  const peak = Math.max(1, ...t.buckets.flatMap((b) => [b.scored, b.conceded]))
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {t.team.logoUrl ? (
          <img src={t.team.logoUrl} alt="" className="size-6 shrink-0 object-contain" />
        ) : null}
        <span className="truncate font-medium">{t.team.name}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-emerald-600">{t.totalScored} marcados</span>
        {" · "}
        <span className="font-medium text-rose-600">{t.totalConceded} sofridos</span>
        {" · "}
        {t.matches} jogos
        {t.lowSample ? <span className="ml-1 text-amber-600">amostra baixa</span> : null}
      </p>
      <ul className="flex flex-col gap-2">
        {t.buckets.map((b) => (
          <li key={b.label} className="flex items-center gap-2">
            <span className="w-10 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
              {b.label}&apos;
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <Bar value={b.scored} pct={b.scoredPct} peak={peak} color="bg-emerald-500/80" />
              <Bar value={b.conceded} pct={b.concededPct} peak={peak} color="bg-rose-500/70" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// "Gols (xG)" tab widget (W-024 + offensive mirror): WHEN each side scores and gets breached, in
// 15-min bands over the season — a timing profile that feeds the over/under-by-half read.
export function GoalTiming({ id }: { id: string }) {
  const { data, isPending } = useMatchGoalTimingQuery(id)
  if (isPending) return <p className="text-sm text-muted-foreground">Carregando perfil de gols…</p>
  if (!data) return null
  const empty =
    data.home.totalScored + data.home.totalConceded === 0 &&
    data.away.totalScored + data.away.totalConceded === 0
  if (empty) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        Sem gols registrados para montar o perfil de timing.
      </div>
    )
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Gols por faixa de 15&apos;</CardTitle>
        <p className="text-xs text-muted-foreground">
          Quando cada time <span className="text-emerald-600">marca</span> e{" "}
          <span className="text-rose-600">sofre</span> ao longo da temporada — perfil de timing pro
          over/under por tempo.
        </p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
        <TimingSide t={data.home} />
        <TimingSide t={data.away} />
      </CardContent>
    </Card>
  )
}
