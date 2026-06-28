import { cn } from "@workspace/ui/lib/utils"

import type { Crest as CrestType } from "../types"

// Monograma do clube (sigla sobre a cor da marca) — substitui o escudo por risco jurídico de uso
// de logos no BR (design system §marca). Cor decorativa; a sigla é que carrega a informação.
export function Crest({ team, size = "md" }: { team: CrestType; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded font-mono font-semibold text-white",
        size === "md" ? "size-9 text-xs" : "size-6 text-[10px]",
      )}
      style={{ backgroundColor: team.color }}
      aria-hidden
    >
      {team.code}
    </span>
  )
}
