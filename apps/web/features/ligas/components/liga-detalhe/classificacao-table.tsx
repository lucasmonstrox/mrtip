"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import Link from "next/link"

import { useClassificacaoQuery } from "../../hooks/data/queries/use-classificacao-query"
import { FormaChips } from "../partida-detalhe/forma-guia"

export function ClassificacaoTable({ code }: { code: string }) {
  const { data: tabela, isPending, isError } = useClassificacaoQuery(code)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando classificação…</p>
  if (isError || !tabela)
    return <p className="text-sm text-destructive">Não foi possível carregar a classificação.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-center">J</TableHead>
          <TableHead className="text-center">V</TableHead>
          <TableHead className="text-center">E</TableHead>
          <TableHead className="text-center">D</TableHead>
          <TableHead className="text-center">GP</TableHead>
          <TableHead className="text-center">GC</TableHead>
          <TableHead className="text-center">SG</TableHead>
          <TableHead className="text-center font-semibold">Pts</TableHead>
          <TableHead className="text-center">Forma</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tabela.map((l) => (
          <TableRow key={l.time.id}>
            <TableCell className="text-muted-foreground">{l.posicao}</TableCell>
            <TableCell className="font-medium">
              <Link href={`/times/${l.time.slug}`} className="hover:underline">
                {l.time.nome}
              </Link>
            </TableCell>
            <TableCell className="text-center">{l.jogos}</TableCell>
            <TableCell className="text-center">{l.vitorias}</TableCell>
            <TableCell className="text-center">{l.empates}</TableCell>
            <TableCell className="text-center">{l.derrotas}</TableCell>
            <TableCell className="text-center">{l.golsPro}</TableCell>
            <TableCell className="text-center">{l.golsContra}</TableCell>
            <TableCell className="text-center">{l.saldo > 0 ? `+${l.saldo}` : l.saldo}</TableCell>
            <TableCell className="text-center font-semibold">{l.pontos}</TableCell>
            <TableCell>
              <div className="flex justify-center">
                <FormaChips ultimos={l.forma} size="sm" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
