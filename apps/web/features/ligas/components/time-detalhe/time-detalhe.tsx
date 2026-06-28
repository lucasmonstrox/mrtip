"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import { useTimeQuery } from "../../hooks/data/queries/use-time-query"
import { formatData } from "../../utils/format"
import { FormaChips } from "../partida-detalhe/forma-guia"

export function TimeDetalhe({ slug }: { slug: string }) {
  const { data: time, isPending, isError } = useTimeQuery(slug)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando time…</p>
  if (isError || !time)
    return <p className="text-sm text-destructive">Não foi possível carregar o time.</p>

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{time.nome}</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Forma</span>
          <FormaChips ultimos={time.forma.ultimos} />
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jogos ({time.partidas.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {time.partidas.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/partidas/${p.id}`}
                  className="grid grid-cols-[6rem_1fr_auto_1fr] items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="text-xs text-muted-foreground">{formatData(p.data, null)}</span>
                  <span className={cn("text-right", p.mandante.id === time.id && "font-semibold")}>
                    {p.mandante.nome}
                  </span>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono tabular-nums">
                    {p.placar ? `${p.placar.ft[0]} - ${p.placar.ft[1]}` : "vs"}
                  </span>
                  <span className={cn(p.visitante.id === time.id && "font-semibold")}>
                    {p.visitante.nome}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
