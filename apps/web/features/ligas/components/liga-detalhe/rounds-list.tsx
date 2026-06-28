"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import Link from "next/link"
import { useState } from "react"

import { useLigaRoundsQuery } from "../../hooks/data/queries/use-liga-rounds-query"

export function RoundsList({ code }: { code: string }) {
  const { data: rounds, isPending, isError } = useLigaRoundsQuery(code)
  const [selecionado, setSelecionado] = useState<number | null>(null)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando rounds…</p>
  if (isError || !rounds)
    return <p className="text-sm text-destructive">Não foi possível carregar os rounds.</p>

  const atual = rounds.find((r) => r.rodada === selecionado) ?? rounds.at(-1)
  if (!atual) return <p className="text-sm text-muted-foreground">Sem rounds disponíveis.</p>

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">Rodada</span>
        <Select value={String(atual.rodada)} onValueChange={(v) => setSelecionado(Number(v))}>
          <SelectTrigger className="w-[180px]" size="sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rounds.map((r) => (
              <SelectItem key={r.rodada} value={String(r.rodada)}>
                {r.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </label>

      <ul className="divide-y rounded-lg border">
        {atual.partidas.map((p) => (
          <li
            key={p.id}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2 text-sm"
          >
            <Link
              href={`/times/${p.mandante.slug}`}
              className="justify-self-end rounded font-medium decoration-2 underline-offset-4 hover:underline"
            >
              {p.mandante.nome}
            </Link>
            <Link
              href={`/partidas/${p.id}`}
              className="rounded bg-muted px-2 py-0.5 font-mono tabular-nums transition-colors hover:bg-foreground hover:text-background"
            >
              {p.placar ? `${p.placar.ft[0]} - ${p.placar.ft[1]}` : "vs"}
            </Link>
            <Link
              href={`/times/${p.visitante.slug}`}
              className="justify-self-start rounded font-medium decoration-2 underline-offset-4 hover:underline"
            >
              {p.visitante.nome}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
