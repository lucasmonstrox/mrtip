"use client"

import { BellIcon, InboxIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@workspace/ui/components/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover"

/**
 * Sino de notificações no footer da sidebar: popover com o que já disparou.
 * Voa pra direita porque o gatilho fica no canto inferior esquerdo, dentro do rail.
 */
// TODO(notificações): sem backend ainda — a lista é o empty state fixo. Quando existir
// a rota, trocar por um hook de query aqui e ligar o contador de não lidas no sino.
export function NotificationsBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Notificações">
          <BellIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" align="end" className="gap-0 p-0">
        <div className="border-b px-3 py-2.5">
          <p className="font-medium">Notificações</p>
        </div>

        <div className="flex flex-col items-center gap-1.5 px-3 py-8 text-center">
          <InboxIcon className="size-5 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Nenhuma notificação por aqui.
          </p>
        </div>

        <div className="border-t p-1.5">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link href="/alertas">Configurar alertas</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
