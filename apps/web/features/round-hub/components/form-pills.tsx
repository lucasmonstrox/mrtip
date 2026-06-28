import { cn } from "@workspace/ui/lib/utils"

import { FORM_COLOR, FORM_LABEL } from "../consts"
import type { FormResult } from "../types"

// Linha de forma recente (V/E/D), do mais antigo (esq.) ao mais recente (dir.). Letra + cor juntas
// (cor nunca comunica sozinha). `recent` chega do mais recente p/ o mais antigo, então invertemos.
export function FormPills({ recent, align = "start" }: { recent: FormResult[]; align?: "start" | "end" }) {
  if (!recent.length) return <span className="text-xs text-muted-foreground">—</span>
  return (
    <div className={cn("flex items-center gap-0.5", align === "end" && "justify-end")}>
      {recent.map((r, i) => (
        <span
          key={i}
          className={cn(
            "flex size-4 items-center justify-center rounded-sm text-[9px] font-bold text-white",
            FORM_COLOR[r],
          )}
          title={r === "W" ? "Vitória" : r === "D" ? "Empate" : "Derrota"}
        >
          {FORM_LABEL[r]}
        </span>
      ))}
    </div>
  )
}
