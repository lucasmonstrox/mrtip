import * as React from "react"

import { cn } from "@workspace/ui/lib/utils"

/**
 * Enquadramento das páginas-documento (hub, histórico, conta, configurações):
 * largura máxima contida + padding de operação + rolagem vertical própria.
 * Telas full-bleed (ex.: dossiê com chat lateral) NÃO usam este wrapper.
 */
export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="min-h-0 w-full flex-1 overflow-y-auto">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 md:px-6",
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}
