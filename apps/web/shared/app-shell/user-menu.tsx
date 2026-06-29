"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { ChevronsUpDownIcon, LogOutIcon, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? "") + (parts.at(-1)?.[0] ?? "")).toUpperCase()
}

/** Menu de usuário da sidebar, ligado à sessão Clerk (perfil + sair). */
export function UserMenu() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const nome = user?.fullName ?? user?.username ?? "Apostador"
  const email = user?.primaryEmailAddress?.emailAddress ?? ""

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
              <Avatar size="sm">
                {user?.imageUrl ? <AvatarImage src={user.imageUrl} alt={nome} /> : null}
                <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-medium">
                  {initials(nome)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{nome}</span>
                <span className="truncate text-xs text-sidebar-foreground/70">
                  {email || "Apostador"}
                </span>
              </div>
              <ChevronsUpDownIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col">
                <span className="font-medium">{nome}</span>
                {email ? (
                  <span className="text-muted-foreground text-xs">{email}</span>
                ) : null}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/conta")}>
              <UserIcon />
              Conta
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => void signOut({ redirectUrl: "/sign-in" })}>
              <LogOutIcon />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
