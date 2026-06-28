import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import { usePartidaDesfalquesQuery } from "../../hooks/data/queries/use-partida-desfalques-query"
import type { DesfalquesTime } from "../../types"

function LadoDesfalques({ d }: { d: DesfalquesTime | null }) {
  if (!d || !d.desfalques.length)
    return <p className="text-sm text-muted-foreground">Sem desfalques registrados.</p>
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium">{d.time.nome}</p>
      <ul className="flex flex-col gap-1">
        {d.desfalques.map((x) => (
          <li key={x.jogador.id} className="flex items-baseline gap-2 text-sm">
            <Link
              href={`/jogadores/${x.jogador.id}`}
              className={cn("hover:underline", !x.naoJogou && "text-muted-foreground")}
            >
              {x.jogador.nome}
            </Link>
            {x.gols > 0 ? (
              <span
                className="rounded bg-emerald-500/15 px-1 text-[10px] font-semibold text-emerald-600"
                title="gols na temporada até este jogo"
              >
                {x.gols}⚽
                {x.assistencias > 0 ? ` ${x.assistencias}🅰` : ""}
              </span>
            ) : null}
            {x.motivo ? <span className="text-xs text-muted-foreground">· {x.motivo}</span> : null}
            {x.jogosForaSeguidos >= 2 ? (
              <span className="text-xs text-muted-foreground">· fora há {x.jogosForaSeguidos} jogos</span>
            ) : null}
            {!x.naoJogou ? (
              <span className="rounded bg-amber-500/15 px-1 text-[10px] font-medium text-amber-600">
                dúvida
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Desfalques({ id }: { id: string }) {
  const { data, isPending } = usePartidaDesfalquesQuery(id)
  if (isPending) return null
  if (!data || (!data.mandante && !data.visitante)) return null // sem registro → não mostra o card

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Desfalques</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <LadoDesfalques d={data.mandante} />
        <LadoDesfalques d={data.visitante} />
      </CardContent>
    </Card>
  )
}
