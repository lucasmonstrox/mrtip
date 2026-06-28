import { Card, CardContent } from "@workspace/ui/components/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { BedIcon } from "lucide-react"
import Link from "next/link"

import { SHORT_REST_DAYS } from "../../consts"
import type { HubMatch, Proportion } from "../../types"
import { pct } from "../../utils/format"
import { Crest } from "../crest"
import { FormPills } from "../form-pills"
import { NoValueBlock, ValueBlock } from "./value-block"

// Tendência (over 2.5 / ambas marcam): % + banda Wilson 95% + n no tooltip. Nunca um % nu —
// honestidade de amostra é a tese. Rotulado "contexto, não previsão".
function TrendChip({ label, p }: { label: string; p: Proportion }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="flex items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[11px]">
          <span className="text-muted-foreground">{label}</span>
          <span className="font-mono font-semibold tabular-nums">{pct(p.pct)}</span>
          {p.lowSample ? <span className="text-amber-600 dark:text-amber-400">·n baixo</span> : null}
        </span>
      </TooltipTrigger>
      <TooltipContent className="text-xs">
        IC95% {pct(p.lo)}–{pct(p.hi)} · n={p.n}
        <br />
        <span className="text-muted-foreground">Contexto da temporada, não previsão.</span>
      </TooltipContent>
    </Tooltip>
  )
}

function RestChip({ home, away }: { home: number; away: number }) {
  const short = home <= SHORT_REST_DAYS || away <= SHORT_REST_DAYS
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "flex items-center gap-1 rounded border bg-background px-1.5 py-0.5 text-[11px] font-mono tabular-nums",
            short && "border-amber-500/40 text-amber-600 dark:text-amber-400",
          )}
        >
          <BedIcon className="size-3" />
          {home}d / {away}d
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-52 text-xs">
        Dias de descanso desde o último jogo. Só a PL está ingerida — jogos de copa/seleção no meio de
        semana não entram, então o descanso pode estar superestimado.
      </TooltipContent>
    </Tooltip>
  )
}

function Side({ team, rank, pts, align }: { team: HubMatch["home"]; rank: number; pts: number; align: "home" | "away" }) {
  return (
    <Link
      href={`/teams/${team.slug}`}
      className={cn(
        "group flex min-w-0 items-center gap-2",
        align === "home" ? "flex-row-reverse text-right" : "flex-row text-left",
      )}
    >
      <Crest team={team} />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold group-hover:underline">{team.name}</span>
        <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
          {rank}º · {pts} pts
        </span>
      </div>
    </Link>
  )
}

export function MatchCard({ match }: { match: HubMatch }) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardContent className="flex flex-col gap-3 p-4">
        {/* Confronto */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <Side team={match.home} rank={match.homeRank} pts={match.homePts} align="home" />
          <Link
            href="/jogo"
            className="flex flex-col items-center rounded px-2 py-0.5 text-center transition-colors hover:bg-muted"
          >
            <span className="font-mono text-sm font-semibold tabular-nums">{match.time}</span>
            <span className="text-[10px] text-muted-foreground">ver dossiê</span>
          </Link>
          <Side team={match.away} rank={match.awayRank} pts={match.awayPts} align="away" />
        </div>

        {/* Forma recente dos dois lados */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <FormPills recent={match.homeForm} align="end" />
          <span className="text-[10px] text-muted-foreground">forma</span>
          <FormPills recent={match.awayForm} align="start" />
        </div>

        {/* Tendências + descanso */}
        <div className="flex flex-wrap items-center gap-1.5">
          <TrendChip label="+2.5" p={match.over25} />
          <TrendChip label="Ambas" p={match.btts} />
          <RestChip home={match.homeRest} away={match.awayRest} />
        </div>

        {/* Coração: valor ou estado sem-valor */}
        {match.value ? <ValueBlock value={match.value} /> : <NoValueBlock />}
      </CardContent>
    </Card>
  )
}
