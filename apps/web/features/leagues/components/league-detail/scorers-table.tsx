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

import { useScorersQuery } from "../../hooks/data/queries/use-scorers-query"

export function ScorersTable({ code }: { code: string }) {
  const { data: scorers, isPending, isError } = useScorersQuery(code)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando marcadores…</p>
  if (isError || !scorers)
    return <p className="text-sm text-destructive">Não foi possível carregar os marcadores.</p>
  if (!scorers.length)
    return <p className="text-sm text-muted-foreground">Nenhum gol registrado nesta liga ainda.</p>

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10">#</TableHead>
          <TableHead>Jogador</TableHead>
          <TableHead className="text-center">G</TableHead>
          <TableHead className="text-center">A</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scorers.map((s, i) => (
          <TableRow key={s.id}>
            <TableCell className="text-muted-foreground">{i + 1}</TableCell>
            <TableCell className="font-medium">
              <Link
                href={`/players/${s.id}`}
                className="flex items-center gap-2 hover:underline"
              >
                {s.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt=""
                    className="size-5 shrink-0 rounded-full object-cover"
                    loading="lazy"
                  />
                ) : null}
                {s.name}
              </Link>
            </TableCell>
            <TableCell className="text-center font-semibold tabular-nums">{s.goals}</TableCell>
            <TableCell className="text-center tabular-nums">{s.assists}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
