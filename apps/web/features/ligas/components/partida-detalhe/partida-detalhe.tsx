"use client"

import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import Link from "next/link"

import { usePartidaFormaQuery } from "../../hooks/data/queries/use-partida-forma-query"
import { usePartidaQuery } from "../../hooks/data/queries/use-partida-query"
import { formatData } from "../../utils/format"
import { Desfalques } from "./desfalques"
import { Escalacao } from "./escalacao"
import { FormaGuia } from "./forma-guia"
import { GolsLista } from "./gols-lista"

export function PartidaDetalhe({ id }: { id: string }) {
  const { data: partida, isPending, isError } = usePartidaQuery(id)
  const { data: forma } = usePartidaFormaQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando partida…</p>
  if (isError || !partida)
    return <p className="text-sm text-destructive">Não foi possível carregar a partida.</p>

  const placar = partida.placar

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <Link
          href={`/ligas/${partida.liga.code}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {partida.liga.nome}
        </Link>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{partida.nome}</Badge>
          <span>{formatData(partida.data, partida.hora)}</span>
        </div>
      </header>

      {/* Placar */}
      <Card>
        <CardContent className="flex flex-col gap-4 py-8">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link
            href={`/times/${partida.mandante.slug}`}
            className="text-right text-lg font-semibold hover:underline"
          >
            {partida.mandante.nome}
          </Link>
          <div className="text-center">
            {placar ? (
              <div className="font-mono text-4xl font-bold tabular-nums">
                {placar.ft[0]} <span className="text-muted-foreground">-</span> {placar.ft[1]}
              </div>
            ) : (
              <div className="text-2xl font-medium text-muted-foreground">vs</div>
            )}
            {placar?.ht ? (
              <div className="mt-1 text-xs text-muted-foreground tabular-nums">
                intervalo {placar.ht[0]}-{placar.ht[1]}
              </div>
            ) : null}
          </div>
          <Link
            href={`/times/${partida.visitante.slug}`}
            className="text-left text-lg font-semibold hover:underline"
          >
            {partida.visitante.nome}
          </Link>
          </div>
          <GolsLista gols={partida.gols} mandanteId={partida.mandante.id} />
        </CardContent>
      </Card>

      {/* Forma dos dois times */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Forma — últimos 5 (antes deste jogo)</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{partida.mandante.nome}</p>
            {forma ? <FormaGuia forma={forma.mandante} /> : <Skeleton className="h-7 w-44" />}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium">{partida.visitante.nome}</p>
            {forma ? <FormaGuia forma={forma.visitante} /> : <Skeleton className="h-7 w-44" />}
          </div>
        </CardContent>
      </Card>

      {/* Desfalques (lesões/suspensões) — some quando não há registro */}
      <Desfalques id={id} />

      {/* Escalações (some quando ainda não há lineup pra esta partida) */}
      <Escalacao id={id} />
    </section>
  )
}
