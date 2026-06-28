import Link from "next/link"

import type { GolItem } from "../../types"

function Gol({ g }: { g: GolItem }) {
  const extra = g.tipo === "penalti" ? " (pên)" : g.tipo === "contra" ? " (gc)" : ""
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      <span className="tabular-nums text-muted-foreground">{g.minuto != null ? `${g.minuto}'` : ""}</span>
      <span>⚽</span>
      <Link href={`/jogadores/${g.autor.id}`} className="font-medium hover:underline">
        {g.autor.nome}
        {extra}
      </Link>
      {g.assistente ? (
        <Link href={`/jogadores/${g.assistente.id}`} className="text-xs text-muted-foreground hover:underline">
          ({g.assistente.nome})
        </Link>
      ) : null}
    </span>
  )
}

/** Linha do tempo dos gols: cada gol no lado do time que marcou (mandante à esquerda). */
export function GolsLista({ gols, mandanteId }: { gols: GolItem[]; mandanteId: string }) {
  if (!gols.length) return null
  return (
    <ul className="flex flex-col gap-1.5 border-t pt-4 text-sm">
      {gols.map((g, i) => {
        const ehMandante = g.time.id === mandanteId
        return (
          <li key={i} className="grid grid-cols-2 items-baseline gap-4">
            <span className="text-right">{ehMandante ? <Gol g={g} /> : null}</span>
            <span className="text-left">{!ehMandante ? <Gol g={g} /> : null}</span>
          </li>
        )
      })}
    </ul>
  )
}
