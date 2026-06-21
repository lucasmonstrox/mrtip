"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@workspace/ui/components/button"

/**
 * Botão sol/lua no footer da sidebar. Espelha a hotkey `d` do ThemeProvider.
 * `mounted` evita mismatch de hidratação (next-themes só resolve no cliente).
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  // Guard de hidratação canônico do next-themes: o tema só resolve no cliente.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  React.useEffect(() => setMounted(true), [])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Alternar tema claro/escuro"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {mounted && resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
