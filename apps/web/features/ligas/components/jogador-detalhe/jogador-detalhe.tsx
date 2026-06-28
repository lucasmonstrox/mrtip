"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"

import { useJogadorQuery } from "../../hooks/data/queries/use-jogador-query"
import { formatData } from "../../utils/format"

function Stat({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-bold tabular-nums">{valor}</span>
      <span className="text-xs text-muted-foreground">{rotulo}</span>
    </div>
  )
}

export function JogadorDetalhe({ id }: { id: string }) {
  const { data: j, isPending, isError } = useJogadorQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando jogador…</p>
  if (isError || !j)
    return <p className="text-sm text-destructive">Não foi possível carregar o jogador.</p>

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{j.nome}</h1>
        <div className="flex gap-8">
          <Stat valor={j.gols} rotulo="gols" />
          <Stat valor={j.assistencias} rotulo="assistências" />
          <Stat valor={j.jogosFora} rotulo="jogos fora" />
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gols ({j.golsLista.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {j.golsLista.length ? (
            <ul className="divide-y">
              {j.golsLista.map((g, i) => (
                <li key={i}>
                  <Link
                    href={`/partidas/${g.partidaId}`}
                    className="flex items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    <span className="w-28 text-xs text-muted-foreground">{formatData(g.data, null)}</span>
                    <span className="tabular-nums text-muted-foreground">
                      {g.minuto != null ? `${g.minuto}'` : ""}
                      {g.tipo === "penalti" ? " (pên)" : ""}
                    </span>
                    <span className="flex-1">
                      {g.mandante} {g.placar ? `${g.placar[0]}-${g.placar[1]}` : "x"} {g.visitante}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 pb-4 text-sm text-muted-foreground">
              Nenhum gol registrado (ou backfill de gols ainda incompleto).
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
