import { Button } from "@workspace/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowDownWideNarrowIcon, ClockIcon, ZapIcon } from "lucide-react"

export type SortBy = "ev" | "time"
export type MarketFilter = "all" | "result" | "goals" | "btts"

const MARKETS: { value: MarketFilter; label: string }[] = [
  { value: "all", label: "Todos os mercados" },
  { value: "result", label: "Resultado (1X2)" },
  { value: "goals", label: "Gols (over/under)" },
  { value: "btts", label: "Ambas marcam" },
]

export function HubFilters({
  sortBy,
  onSortBy,
  evOnly,
  onEvOnly,
  market,
  onMarket,
  shown,
  total,
}: {
  sortBy: SortBy
  onSortBy: (s: SortBy) => void
  evOnly: boolean
  onEvOnly: (v: boolean) => void
  market: MarketFilter
  onMarket: (m: MarketFilter) => void
  shown: number
  total: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Ordenação */}
      <div className="flex items-center rounded-md border p-0.5">
        <button
          type="button"
          onClick={() => onSortBy("ev")}
          className={cn(
            "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
            sortBy === "ev" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <ArrowDownWideNarrowIcon className="size-3.5" />
          Valor
        </button>
        <button
          type="button"
          onClick={() => onSortBy("time")}
          className={cn(
            "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-medium transition-colors",
            sortBy === "time" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
          )}
        >
          <ClockIcon className="size-3.5" />
          Horário
        </button>
      </div>

      {/* Filtro de mercado */}
      <Select value={market} onValueChange={(v) => onMarket(v as MarketFilter)}>
        <SelectTrigger size="sm" className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MARKETS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Só com valor (EV+) — aqui ATIVO porque o mock tem EV; com dado real fica gated por SIN-012 */}
      <Button
        type="button"
        size="sm"
        variant={evOnly ? "default" : "outline"}
        onClick={() => onEvOnly(!evOnly)}
        className={cn(evOnly && "bg-emerald-600 hover:bg-emerald-600/90")}
      >
        <ZapIcon className="size-3.5" />
        Só com valor (EV+)
      </Button>

      <span className="ml-auto text-xs text-muted-foreground tabular-nums">
        {shown} de {total} jogos
      </span>
    </div>
  )
}
