"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"

import { useTecnicoQuery } from "../../hooks/data/queries/use-tecnico-query"
import { formatData } from "../../utils/format"

export function TecnicoDetalhe({ id }: { id: string }) {
  const { data: t, isPending, isError } = useTecnicoQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando técnico…</p>
  if (isError || !t)
    return <p className="text-sm text-destructive">Não foi possível carregar o técnico.</p>

  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">{t.nome}</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jogos dirigidos ({t.jogos.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {t.jogos.map((j) => (
              <li key={j.partidaId}>
                <Link
                  href={`/partidas/${j.partidaId}`}
                  className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
                >
                  <span className="w-28 text-xs text-muted-foreground">{formatData(j.data, null)}</span>
                  <span className="flex-1">
                    {j.mandante} {j.placar ? `${j.placar[0]}-${j.placar[1]}` : "x"} {j.visitante}
                  </span>
                  <span className="text-xs text-muted-foreground">{j.time}</span>
                </Link>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
