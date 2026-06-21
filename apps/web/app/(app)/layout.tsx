import * as React from "react"

import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

import { AppHeader } from "@/shared/app-shell/app-header"
import { AppSidebar } from "@/shared/app-shell/app-sidebar"

/**
 * Shell do app: sidebar colapsável + header fino + área de conteúdo de altura
 * limitada (`flex-1 min-h-0`). Cada página decide seu enquadramento — páginas-
 * documento usam `<PageContainer>`; telas full-bleed ocupam `h-full`.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <AppHeader />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
