"use client"

import { Toaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import { ThemeProvider } from "@/components/theme-provider"

/**
 * Providers globais do app. `ThemeProvider` (next-themes, com hotkey `d`) já
 * existe em `components/`; aqui só o envolvemos com `TooltipProvider` —
 * necessário pros tooltips dos itens da sidebar quando colapsada — e o
 * `Toaster` (sonner).
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        {children}
        <Toaster position="top-right" closeButton />
      </TooltipProvider>
    </ThemeProvider>
  )
}
