"use client"

import { TrophyIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@workspace/ui/components/sidebar"

import { Logo } from "@/shared/ui/logo"
import { ThemeToggle } from "@/shared/ui/theme-toggle"
import { NAV_SECTIONS } from "./nav"
import { SidebarExpander } from "./sidebar-expander"
import { useLeaguesNav } from "./use-leagues-nav"
import { UserMenu } from "./user-menu"

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link
            href="/"
            className="flex items-center px-1 py-1.5"
            aria-label="mrtip — início"
          >
            <Logo />
          </Link>
        </SidebarHeader>

        <SidebarContent>
          {NAV_SECTIONS.map((section, i) => (
            <Fragment key={section.label ?? i}>
              <SidebarGroup>
                {section.label ? (
                  <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
                ) : null}
                <SidebarMenu>
                  {section.items.map((item) => {
                    const active =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname === item.href ||
                          pathname.startsWith(`${item.href}/`)
                    const Icon = item.icon
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.title}
                          className="data-active:bg-sidebar-primary! data-active:text-sidebar-primary-foreground! data-active:hover:bg-sidebar-primary!"
                        >
                          <Link href={item.href}>
                            <Icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroup>
              {/* Seção dinâmica de ligas logo abaixo do topo (Hub), acima de Análise. */}
              {i === 0 ? <LeaguesNavGroup pathname={pathname} /> : null}
            </Fragment>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <div className="flex items-center justify-end px-1">
            <ThemeToggle />
          </div>
          <UserMenu />
        </SidebarFooter>
      </Sidebar>
      <SidebarExpander />
    </>
  )
}

// Rail dinâmico das ligas: uma liga por item, com o logo da liga no lugar do ícone. Some
// enquanto não há ligas; mostra skeletons durante o carregamento pra não dar pop-in.
function LeaguesNavGroup({ pathname }: { pathname: string }) {
  const { data: leagues, isPending } = useLeaguesNav()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Ligas</SidebarGroupLabel>
      <SidebarMenu>
        {isPending ? (
          Array.from({ length: 2 }).map((_, i) => (
            <SidebarMenuItem key={i}>
              <SidebarMenuSkeleton
                showIcon
                className="[&_[data-slot=skeleton]]:bg-sidebar-primary/20"
              />
            </SidebarMenuItem>
          ))
        ) : (
          leagues?.map((league) => {
            const href = `/leagues/${league.code}`
            const active = pathname === href || pathname.startsWith(`${href}/`)
            return (
              <SidebarMenuItem key={league.code}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={league.name}
                  className="data-active:bg-sidebar-primary! data-active:text-sidebar-primary-foreground! data-active:hover:bg-sidebar-primary!"
                >
                  <Link href={href}>
                    {league.logoUrl ? (
                      <img
                        src={league.logoUrl}
                        alt=""
                        // Active row tem bg roxo (sidebar-primary) e muitos escudos são escuros →
                        // somem. Backing branco arredondado faz o logo saltar quando ativo.
                        className={`size-4 shrink-0 object-contain ${active ? "rounded-[3px] bg-white p-px" : ""}`}
                        loading="lazy"
                      />
                    ) : (
                      <TrophyIcon />
                    )}
                    <span>{league.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
