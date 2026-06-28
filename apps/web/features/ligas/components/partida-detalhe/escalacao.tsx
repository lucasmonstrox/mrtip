import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"

import { usePartidaEscalacaoQuery } from "../../hooks/data/queries/use-partida-escalacao-query"
import type { EscalacaoTime, JogadorEscalado } from "../../types"

function LinhaJogador({ j }: { j: JogadorEscalado }) {
  return (
    <li className="flex items-center gap-2 py-0.5 text-sm">
      <span className="w-6 text-right font-mono tabular-nums text-muted-foreground">{j.numero ?? "–"}</span>
      <Link href={`/jogadores/${j.id}`} className="flex-1 hover:underline">
        {j.nome}
      </Link>
      {j.posicao ? <span className="text-xs text-muted-foreground">{j.posicao}</span> : null}
    </li>
  )
}

function LadoEscalacao({ esc }: { esc: EscalacaoTime | null }) {
  if (!esc) return <p className="text-sm text-muted-foreground">Escalação não disponível.</p>
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="font-medium">{esc.time.nome}</p>
        <p className="text-xs text-muted-foreground">
          {esc.formacao ?? "—"}
          {esc.tecnico ? " · " : ""}
          {esc.tecnico && esc.tecnicoId ? (
            <Link href={`/tecnicos/${esc.tecnicoId}`} className="hover:underline">
              {esc.tecnico}
            </Link>
          ) : (
            esc.tecnico
          )}
        </p>
      </div>
      <ul>
        {esc.titulares.map((j) => (
          <LinhaJogador key={j.id} j={j} />
        ))}
      </ul>
      {esc.banco.length ? (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">Banco ({esc.banco.length})</summary>
          <ul className="mt-1">
            {esc.banco.map((j) => (
              <LinhaJogador key={j.id} j={j} />
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  )
}

export function Escalacao({ id }: { id: string }) {
  const { data, isPending } = usePartidaEscalacaoQuery(id)
  if (isPending) return null
  if (!data || (!data.mandante && !data.visitante)) return null // sem lineup ainda → não mostra o card

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Escalações</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LadoEscalacao esc={data.mandante} />
        <LadoEscalacao esc={data.visitante} />
      </CardContent>
    </Card>
  )
}
