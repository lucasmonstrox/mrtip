"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import { useAbsenceImpactQuery } from "../../hooks/data/queries/use-absence-impact-query"
import type { AbsencePlayerImpact, TeamAbsenceImpact } from "../../types"
import { PlayerHoverCard } from "../player-hover-card/player-hover-card"

// "com ele X g/j · sem ele Y g/j ▼Z%" — the directional read of what the attack loses without a player.
// Dimmed + ⚠️ when the with/without is noise (no direct G+A or thin sample); the drop arrow flips for the
// rare case the team scored MORE without him.
function WithWithout({ a }: { a: AbsencePlayerImpact }) {
  const up = a.dropPct < 0 // scored more without him → counterintuitive
  return (
    <span className={cn("text-xs tabular-nums", a.confound ? "text-muted-foreground" : "text-foreground")}>
      com ele <span className="font-medium">{a.withGf.toFixed(2)}</span> · sem ele{" "}
      <span className="font-medium">{a.withoutGf.toFixed(2)}</span> g/j{" "}
      <span className={cn("font-semibold", !a.confound && (up ? "text-emerald-600" : "text-rose-600"))}>
        {up ? "▲" : "▼"}
        {Math.abs(a.dropPct)}%
      </span>
      {a.confound ? (
        <span className="ml-1 cursor-help" title="with/without não confiável: sem contribuição direta (G+A) ou amostra pequena">
          ⚠️
        </span>
      ) : null}
    </span>
  )
}

function PlayerRow({ a }: { a: AbsencePlayerImpact }) {
  return (
    <li className="flex flex-col gap-0.5 border-b border-dashed pb-2 last:border-0 last:pb-0">
      <div className="flex items-baseline gap-2 text-sm">
        <PlayerHoverCard id={a.player.id}>
          <Link
            href={`/players/${a.player.id}`}
            className={cn("font-medium hover:underline", !a.didNotPlay && "text-muted-foreground")}
          >
            {a.player.name}
          </Link>
        </PlayerHoverCard>
        {a.goals > 0 || a.assists > 0 ? (
          <span
            className="rounded bg-emerald-500/15 px-1 text-[10px] font-semibold text-emerald-600"
            title="participação nos gols do time até este jogo"
          >
            {a.pctGoals}% dos gols
            {a.pctInvolve > a.pctGoals ? ` · ${a.pctInvolve}% c/ assist` : ""}
          </span>
        ) : null}
        {a.reason ? <span className="text-xs text-muted-foreground">· {a.reason}</span> : null}
        {!a.didNotPlay ? (
          <span className="rounded bg-amber-500/15 px-1 text-[10px] font-medium text-amber-600">dúvida</span>
        ) : null}
      </div>
      <WithWithout a={a} />
    </li>
  )
}

// One side: the absent players ranked by weight + the TOTAL — additive-safe % of goals out (headline)
// and the aggregate full-squad → depleted goals/game when the sample allows, with the "drops don't sum"
// caveat.
function TeamImpact({ t }: { t: TeamAbsenceImpact }) {
  const total = t.total
  const showAgg = total.fullSquadGf != null && total.depletedGf != null && total.fullSquadN >= 3 && total.depletedN >= 3
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {t.team.logoUrl ? <img src={t.team.logoUrl} alt="" className="size-5 shrink-0 object-contain" /> : null}
        <span className="truncate font-medium">{t.team.name}</span>
      </div>
      <ul className="flex flex-col gap-2">
        {t.players.map((a) => (
          <PlayerRow key={a.player.id} a={a} />
        ))}
      </ul>
      <div className="mt-1 rounded-lg border bg-muted/40 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">Total fora</span>
          <span className="font-mono text-2xl font-bold tabular-nums text-primary">{total.sumPctGoals}%</span>
        </div>
        <p className="text-xs text-muted-foreground">
          dos gols do time saíram de quem está fora deste jogo
          {total.sumPctInvolve > total.sumPctGoals ? ` (${total.sumPctInvolve}% contando assistências)` : ""}
        </p>
        {showAgg ? (
          <p className="mt-2 text-xs text-muted-foreground">
            elenco cheio <span className="font-medium text-foreground tabular-nums">{total.fullSquadGf!.toFixed(2)}</span> →
            com estes fora <span className="font-medium text-foreground tabular-nums">{total.depletedGf!.toFixed(2)}</span>{" "}
            g/j{" "}
            {total.dropPct != null ? (
              <span className={cn("font-semibold", total.dropPct >= 0 ? "text-rose-600" : "text-emerald-600")}>
                {total.dropPct >= 0 ? "▼" : "▲"}
                {Math.abs(total.dropPct)}%
              </span>
            ) : null}
            <span className="ml-1 text-muted-foreground/70">· quedas individuais não somam linearmente</span>
          </p>
        ) : null}
      </div>
    </div>
  )
}

// "Impacto dos desfalques" panel on the prognosis tab: deterministic, anti-leak read of how much each
// side's attack leans on the players who are out — the same absence signal the prognosis prompt is fed,
// surfaced so the bet is auditable. Renders nothing when neither side has an absence record. @feature LIG-007
export function AbsenceImpactPanel({ id }: { id: string }) {
  const { data, isPending } = useAbsenceImpactQuery(id)
  if (isPending) return null
  if (!data || (!data.home && !data.away)) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Impacto dos desfalques</CardTitle>
        <CardDescription className="text-xs">
          Quanto o ataque de cada lado depende de quem está fora — o mesmo sinal que o modelo já considerou
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {data.home ? <TeamImpact t={data.home} /> : <p className="text-sm text-muted-foreground">Sem desfalques.</p>}
        {data.away ? <TeamImpact t={data.away} /> : <p className="text-sm text-muted-foreground">Sem desfalques.</p>}
      </CardContent>
    </Card>
  )
}
