"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

import { useMatchStatisticsQuery } from "../../hooks/data/queries/use-match-statistics-query"
import type { TeamRef } from "../../types"

// Convenção de cor casa/fora do projeto (espelha match-momentum): casa = sky-500, fora = orange-500.
const HOME_BAR = "bg-sky-500"
const AWAY_BAR = "bg-orange-500"

// Uma linha de comparação de estatística: os dois valores ladeando um rótulo central, sobre uma barra
// dividida cujos segmentos são proporcionais a cada time (casa azul, fora laranja). A largura é
// normalizada por (casa+fora), então a barra sempre enche mesmo se os valores não somarem 100; um
// lado ausente vira "—" e 0 de largura. Reaproveitável pra chutes/escanteios/etc. quando entrarem.
function StatRow({
  label,
  home,
  away,
  suffix = "",
}: {
  label: string
  home: number | null
  away: number | null
  suffix?: string
}) {
  const total = (home ?? 0) + (away ?? 0)
  const homeWidth = total > 0 ? ((home ?? 0) / total) * 100 : 50
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold tabular-nums">{home == null ? "—" : `${home}${suffix}`}</span>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{away == null ? "—" : `${away}${suffix}`}</span>
      </div>
      <div className="flex h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${HOME_BAR}`} style={{ width: `${homeWidth}%` }} />
        <div className={`h-full ${AWAY_BAR}`} style={{ width: `${100 - homeWidth}%` }} />
      </div>
    </div>
  )
}

// Legenda de qual cor é cada time (bolinha + nome), no topo do card de estatísticas.
function Legend({ home, away }: { home: TeamRef; away: TeamRef }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className={`size-2 rounded-full ${HOME_BAR}`} aria-hidden />
        {home.name}
      </span>
      <span className="flex items-center gap-1.5">
        <span className={`size-2 rounded-full ${AWAY_BAR}`} aria-hidden />
        {away.name}
      </span>
    </div>
  )
}

// Aba "Estatísticas" da página de partida: dados da partida por time vindos de match_team_stats
// (fixture statistics da SportMonks). Por ora só a posse de bola (%); a estrutura de linhas comporta
// mais métricas depois. Esconde-se quando a partida não tem nenhuma estatística registrada.
export function Statistics({ id, home, away }: { id: string; home: TeamRef; away: TeamRef }) {
  const { data, isPending } = useMatchStatisticsQuery(id)
  if (isPending) return <p className="text-sm text-muted-foreground">Carregando estatísticas…</p>
  if (!data) return null
  const hasStats = data.home.possession != null || data.away.possession != null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Estatísticas</CardTitle>
        <CardDescription className="text-xs">Dados da partida por time.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {hasStats ? (
          <>
            <Legend home={home} away={away} />
            <StatRow
              label="Posse de bola"
              home={data.home.possession}
              away={data.away.possession}
              suffix="%"
            />
          </>
        ) : (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Sem estatísticas para esta partida.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
