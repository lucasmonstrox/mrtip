import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import { InfoIcon, MinusCircleIcon, TrendingUpIcon } from "lucide-react"

import { CONFIDENCE_STYLE } from "../../consts"
import type { ValueBet } from "../../types"
import { evOf, fairOddOf, fmtEv, fmtOdd, kellyStake, pct, ppGap } from "../../utils/format"

// Duas barras: prob calibrada do modelo (cyan, a tese) vs prob no-vig do mercado (cinza). O gap em
// p.p. é a borda. Mostrar lado a lado é o diferencial honesto — o número do mrtip ao lado do mercado.
function ProbBars({ model, market }: { model: number; market: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="w-28 shrink-0 text-[11px] text-muted-foreground">Modelo (calibrado)</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-cyan-500" style={{ width: pct(model) }} />
        </div>
        <span className="w-9 text-right font-mono text-xs font-semibold tabular-nums">{pct(model)}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-28 shrink-0 text-[11px] text-muted-foreground">Mercado (s/ vig)</span>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-zinc-400 dark:bg-zinc-500" style={{ width: pct(market) }} />
        </div>
        <span className="w-9 text-right font-mono text-xs tabular-nums text-muted-foreground">
          {pct(market)}
        </span>
      </div>
    </div>
  )
}

// Estado "sem valor" — conteúdo de primeira classe (tese anti-cassino): não apostar também é resultado.
export function NoValueBlock() {
  return (
    <div className="flex items-center gap-2 rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
      <MinusCircleIcon className="size-4 shrink-0" />
      <span>
        <span className="font-medium text-foreground">Sem valor</span> nos mercados analisados — a odd
        cobre a probabilidade. Não apostar também é resultado.
      </span>
    </div>
  )
}

export function ValueBlock({ value }: { value: ValueBet }) {
  const ev = evOf(value)
  const fair = fairOddOf(value)
  const stake = kellyStake(value)

  return (
    <div className="flex flex-col gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/[0.04] p-3">
      {/* Linha herói: EV + mercado/pick + selo de confiança */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 font-mono text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
            <TrendingUpIcon className="size-4" />
            {fmtEv(ev)}
            <span className="text-[10px] font-medium text-muted-foreground">EV</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{value.market}</span>
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              odd {fmtOdd(value.offeredOdd)} · justa {fmtOdd(fair)}
            </span>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium",
            CONFIDENCE_STYLE[value.confidence],
          )}
        >
          confiança {value.confidence}
        </span>
      </div>

      <ProbBars model={value.modelProb} market={value.marketProb} />

      {/* Borda + stake sugerido (Kelly fracionado) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-500/20 pt-2 text-[11px]">
        <span className="rounded bg-cyan-500/10 px-1.5 py-0.5 font-medium text-cyan-700 dark:text-cyan-300">
          {value.edgeType} · {ppGap(value.modelProb, value.marketProb)}
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="flex items-center gap-1 font-mono tabular-nums text-muted-foreground">
              stake {pct(stake)}
              <InfoIcon className="size-3" />
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-56 text-xs">
            Fração do bankroll por Kelly ¼ (nunca Kelly cheio). +EV não garante ganhar este jogo —
            é vantagem no longo prazo, sujeita a variância.
          </TooltipContent>
        </Tooltip>
      </div>

      <p className="text-[11px] leading-relaxed text-muted-foreground">{value.rationale}</p>
    </div>
  )
}
