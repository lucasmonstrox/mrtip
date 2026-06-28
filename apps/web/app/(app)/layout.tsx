import * as React from "react"

import { ScrollArea } from "@workspace/ui/components/scroll-area"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"

import { AppSidebar } from "@/shared/app-shell/app-sidebar"

/**
 * Shell do app: sidebar colapsável + área de conteúdo rolável. O scroll vertical é da
 * `ScrollArea` (Radix, scrollbar estilizada) — única região de rolagem; o `PageContainer`
 * não rola por conta própria. Telas full-bleed ocupam `h-full` dentro do viewport.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <ScrollArea className="min-h-0 flex-1">
          <main className="flex flex-col">{children}</main>
        </ScrollArea>
      </SidebarInset>
    </SidebarProvider>
  )
}
