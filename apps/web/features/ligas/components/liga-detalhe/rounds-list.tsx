"use client"

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
        <select
          value={atual.rodada}
          onChange={(e) => setSelecionado(Number(e.target.value))}
          className="rounded-md border bg-background px-2 py-1 text-sm"
        >
          {rounds.map((r) => (
            <option key={r.rodada} value={r.rodada}>
              {r.nome}
            </option>
          ))}
        </select>
      </label>

      <ul className="divide-y rounded-lg border">
        {atual.partidas.map((p) => (
          <li
            key={`${p.mandante}-${p.visitante}`}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2 text-sm"
          >
            <span className="text-right font-medium">{p.mandante}</span>
            <span className="rounded bg-muted px-2 py-0.5 font-mono tabular-nums">
              {p.placar ? `${p.placar.ft[0]} - ${p.placar.ft[1]}` : "vs"}
            </span>
            <span className="font-medium">{p.visitante}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
