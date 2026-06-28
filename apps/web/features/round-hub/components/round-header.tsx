import { Button } from "@workspace/ui/components/button"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { LEAGUE_NAME, SEASON } from "../consts"

// Cabeçalho do Hub: liga/temporada + navegação de rodada (← N →) + rótulo honesto de frescor.
// Só a PL está ingerida hoje, então o seletor de liga é informativo (sem troca real).
export function RoundHeader({
  round,
  dateRange,
  updatedAt,
  onPrev,
  onNext,
  canPrev,
  canNext,
}: {
  round: number
  dateRange: string
  updatedAt: string
  onPrev: () => void
  onNext: () => void
  canPrev: boolean
  canNext: boolean
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {LEAGUE_NAME} · {SEASON}
        </span>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Rodada {round}</h1>
          <span className="text-sm text-muted-foreground">{dateRange}</span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          Atualizado {updatedAt} · contexto da rodada, não previsão de resultado
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" onClick={onPrev} disabled={!canPrev} aria-label="Rodada anterior">
          <ChevronLeftIcon />
        </Button>
        <span className="w-8 text-center font-mono text-sm tabular-nums">{round}</span>
        <Button variant="outline" size="icon" onClick={onNext} disabled={!canNext} aria-label="Próxima rodada">
          <ChevronRightIcon />
        </Button>
      </div>
    </header>
  )
}
