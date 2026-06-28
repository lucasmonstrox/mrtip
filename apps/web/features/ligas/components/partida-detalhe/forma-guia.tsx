import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import type { Forma, ResultadoForma } from "../../types"

// Cor por resultado: vitória (verde), empate (cinza), derrota (vermelho).
const COR: Record<ResultadoForma["resultado"], string> = {
  V: "bg-emerald-500 hover:bg-emerald-600",
  E: "bg-zinc-400 hover:bg-zinc-500",
  D: "bg-red-500 hover:bg-red-600",
}

function Chip({ r, size }: { r: ResultadoForma; size: "sm" | "md" }) {
  const placar = `${r.golsPro}-${r.golsContra}`
  const local = r.mando === "casa" ? "em casa" : "fora"
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={`/partidas/${r.partidaId}`}
          className={cn(
            "flex cursor-pointer items-center justify-center rounded font-semibold text-white transition-colors",
            size === "md" ? "h-7 w-7 text-xs" : "h-5 w-5 text-[10px]",
            COR[r.resultado],
          )}
        >
          {r.resultado}
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        {placar} vs {r.adversario.nome} ({local})
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Fileira de chips de forma — clicáveis (vão pro jogo) com tooltip do placar. A API devolve
 * `ultimos` do mais recente pro mais antigo; exibimos antigo → recente (esquerda → direita).
 */
export function FormaChips({ ultimos, size = "md" }: { ultimos: ResultadoForma[]; size?: "sm" | "md" }) {
  if (!ultimos.length) return <span className="text-xs text-muted-foreground">—</span>
  return (
    <div className="flex items-center gap-1">
      {[...ultimos].reverse().map((r) => (
        <Chip key={r.partidaId} r={r} size={size} />
      ))}
    </div>
  )
}

/** Guia de forma completo: os chips + o resumo V/E/D. Usado na tela de partida. */
export function FormaGuia({ forma }: { forma: Forma }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FormaChips ultimos={forma.ultimos} />
      <p className="text-xs text-muted-foreground tabular-nums">
        {forma.resumo.v}V · {forma.resumo.e}E · {forma.resumo.d}D
      </p>
    </div>
  )
}
