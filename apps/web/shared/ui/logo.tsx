import { GoalIcon } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

type LogoProps = {
  /** Ajusta tamanho/cor via Tailwind (ex.: "text-lg"). */
  className?: string
}

/**
 * Wordmark do mrtip. Provisório (TODO marca): marca textual + mark de gol. O
 * texto recolhe automaticamente quando a sidebar está em modo ícone.
 */
export function Logo({ className }: LogoProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 font-heading text-base font-semibold tracking-tight select-none",
        className
      )}
    >
      <GoalIcon className="size-5 shrink-0 text-sidebar-primary" />
      <span className="group-data-[collapsible=icon]:hidden">mrtip</span>
    </span>
  )
}
