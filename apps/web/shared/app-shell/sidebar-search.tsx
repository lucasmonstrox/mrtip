"use client"

import { SearchIcon, TrophyIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@workspace/ui/components/command"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

import { NAV_SECTIONS } from "./nav"
import { useLeaguesNav } from "./use-leagues-nav"

/**
 * Botão de busca da sidebar que abre uma paleta de comandos no estilo ⌘K
 * (command palette do shadcn/cmdk) para navegar rápido entre páginas e ligas.
 * Atalho global: ⌘K no Mac, Ctrl+K no Windows/Linux.
 */
export function SidebarSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { data: leagues } = useLeaguesNav()

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  // Navega e fecha a paleta. Envolve o router.push pra cada item de resultado.
  function go(href: string) {
    setOpen(false)
    router.push(href)
  }

  const navItems = NAV_SECTIONS.flatMap((section) => section.items)

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setOpen(true)}
            tooltip="Pesquisar"
            className="text-sidebar-foreground/70"
          >
            <SearchIcon />
            <span>Pesquisar</span>
            <kbd className="ml-auto hidden items-center gap-0.5 rounded border border-sidebar-border bg-sidebar px-1.5 font-mono text-[10px] text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Pesquisar"
        description="Navegue entre páginas e ligas"
      >
        <CommandInput placeholder="Buscar páginas, ligas…" />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          <CommandGroup heading="Navegação">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <CommandItem
                  key={item.href}
                  // value alimenta o filtro fuzzy do cmdk (busca pelo título).
                  value={item.title}
                  onSelect={() => go(item.href)}
                >
                  <Icon />
                  <span>{item.title}</span>
                </CommandItem>
              )
            })}
          </CommandGroup>

          {leagues && leagues.length > 0 ? (
            <>
              <CommandSeparator />
              <CommandGroup heading="Ligas">
                {leagues.map((league) => (
                  <CommandItem
                    key={league.code}
                    value={league.name}
                    onSelect={() => go(`/leagues/${league.code}`)}
                  >
                    {league.logoUrl ? (
                      <img
                        src={league.logoUrl}
                        alt=""
                        className="size-4 shrink-0 rounded-[3px] bg-white object-contain p-px"
                        loading="lazy"
                      />
                    ) : (
                      <TrophyIcon />
                    )}
                    <span>{league.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  )
}
