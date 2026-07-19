"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { ScrollTextIcon } from "lucide-react"
import { useState } from "react"

import { useMatchPrognosisAuditQuery } from "../../hooks/data/queries/use-match-prognosis-audit-query"

/**
 * Painel de auditoria da run de prognóstico: abre sob demanda e mostra a cadeia de raciocínio do modelo —
 * o "por que ele cravou essa aposta". O reasoning pesa 20k-40k caracteres, então a query só dispara quando
 * o painel abre. O prompt de evidências NÃO aparece aqui: é o IP do motor e nem sai da API. @feature MOD-011
 */
export function PrognosisAudit({ id }: { id: string }) {
  const [open, setOpen] = useState(false)
  const { data, isPending, isError } = useMatchPrognosisAuditQuery(id, open)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="self-start">
          <ScrollTextIcon />
          Ver raciocínio do prognóstico
        </Button>
      </SheetTrigger>
      {/* 60% da tela: o raciocínio é texto longo e corrido, precisa de largura pra ser lido de verdade.
          As classes repetem o variant `data-[side=right]` do próprio Sheet pra vencer o max-w-sm padrão. */}
      <SheetContent
        side="right"
        className="data-[side=right]:w-[60vw] data-[side=right]:sm:max-w-[60vw]"
      >
        <SheetHeader className="pb-0">
          <SheetTitle>Raciocínio do prognóstico</SheetTitle>
          <SheetDescription>
            A cadeia de raciocínio do modelo nesta run — o que sustenta a aposta recomendada.
          </SheetDescription>
        </SheetHeader>

        {/* O conteúdo só monta com o painel aberto: é isso que mantém o texto pesado fora da visita normal. */}
        {isPending ? (
          <p className="px-4 text-sm text-muted-foreground">Carregando raciocínio…</p>
        ) : isError ? (
          <p className="px-4 text-sm text-destructive">Não foi possível carregar o raciocínio.</p>
        ) : !data ? (
          <div className="mx-4 rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
            Nenhuma run de prognóstico gravada para esta partida.
          </div>
        ) : data.reasoning ? (
          // Texto PURO de propósito: é saída de LLM cheia de markdown, e passar por HTML seria injeção.
          <div className="mx-4 mb-4 min-h-0 flex-1 overflow-y-auto rounded-md border bg-muted/30 p-4">
            <pre className="font-mono text-xs leading-relaxed break-words whitespace-pre-wrap">
              {data.reasoning}
            </pre>
          </div>
        ) : (
          <div className="mx-4 mb-4 flex min-h-0 flex-1 items-center justify-center rounded-md border border-dashed p-6">
            <p className="max-w-sm text-center text-sm text-muted-foreground">
              Esta run não guardou o raciocínio do modelo.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
