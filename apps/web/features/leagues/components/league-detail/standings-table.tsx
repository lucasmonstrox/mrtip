"use client"

import { Card, CardContent } from "@workspace/ui/components/card"
import { Skeleton } from "@workspace/ui/components/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import Link from "next/link"

import { useLeagueQuery } from "../../hooks/data/queries/use-league-query"
import { useStandingsQuery } from "../../hooks/data/queries/use-standings-query"
import { formatTiebreak } from "../../utils/tiebreak"
import { FormChips } from "../match-detail/form-guide"

// Qualification/relegation zones → border color + PT label (UI copy stays Portuguese).
const ZONES: Record<string, { border: string; dot: string; label: string }> = {
  champions: { border: "border-l-blue-600", dot: "bg-blue-600", label: "Champions League" },
  europa: { border: "border-l-orange-500", dot: "bg-orange-500", label: "Europa League" },
  conference: { border: "border-l-green-500", dot: "bg-green-500", label: "Conference League" },
  // Zonas CONMEBOL (Série A). Chave em inglês como vem do dado; só o rótulo é PT. @feature LIG-012
  libertadores: { border: "border-l-emerald-600", dot: "bg-emerald-600", label: "Libertadores" },
  "libertadores-qualifiers": { border: "border-l-teal-500", dot: "bg-teal-500", label: "Pré-Libertadores" },
  sudamericana: { border: "border-l-amber-500", dot: "bg-amber-500", label: "Sudamericana" },
  relegation: { border: "border-l-red-500", dot: "bg-red-500", label: "Rebaixamento" },
}

// Larguras de coluna fixas, compartilhadas pela tabela real e pelo skeleton. Com table-fixed
// elas decidem o layout em vez do conteúdo, então as colunas não saltam quando os dados chegam
// (a coluna "Time" absorve o espaço restante). Fonte única — muda aqui e os dois lados acompanham.
// Ordem das colunas: # · Time (flexível) · J · V · E · D · GP · GC · SG · Pts · Forma. NÃO colocar
// comentário/espaço inline entre os <col> — um espaço na mesma linha vira text node, e <colgroup> não
// aceita filho de texto (erro de hydration). Só os <col>, um por linha (a quebra é whitespace inócuo).
function StandingsCols() {
  return (
    <colgroup>
      <col className="w-12" />
      <col />
      <col className="w-12" />
      <col className="w-12" />
      <col className="w-12" />
      <col className="w-12" />
      <col className="w-12" />
      <col className="w-12" />
      <col className="w-14" />
      <col className="w-14" />
      <col className="w-44" />
    </colgroup>
  )
}

function StandingsHead() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>#</TableHead>
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
  )
}

const TABLE_CLASS =
  "table-fixed tabular-nums [&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4"

export function StandingsTable({ code }: { code: string }) {
  const { data: table, isPending, isError } = useStandingsQuery(code)
  // Mesma query que o `league-detail` já faz (mesma `useSeasonParam`) — sem request novo, e rótulo e
  // ordem saem da MESMA temporada. Copa não tem tabela, logo não tem o que desempatar. @feature LIG-017
  const { data: league } = useLeagueQuery(code)
  const tiebreak = league?.type === "cup" ? null : formatTiebreak(league?.tiebreak)

  if (isPending) return <StandingsSkeleton />
  if (isError || !table)
    return <p className="text-sm text-destructive">Não foi possível carregar a classificação.</p>

  // Legend with only the zones actually present, in table order.
  const present = [...new Set(table.map((r) => r.zone).filter((z): z is string => !!z && z in ZONES))]

  // Sem CardHeader: a aba já diz "Classificação"; repetir o rótulo dentro do card é ruído. O skeleton
  // abaixo acompanha — se só um dos dois perdesse o header, a troca geraria salto de layout.
  return (
    <Card className="pt-0">
      <CardContent className="p-0">
        <Table className={TABLE_CLASS}>
          <StandingsCols />
          <StandingsHead />
          <TableBody>
            {table.map((row) => {
              const zone = row.zone ? ZONES[row.zone] : undefined
              return (
                <TableRow key={row.team.id}>
                  <TableCell
                    className={`border-l-2 text-muted-foreground ${zone ? zone.border : "border-l-transparent"}`}
                  >
                    {row.position}
                  </TableCell>
                  <TableCell className="truncate font-medium">
                    <Link
                      href={`/teams/${row.team.slug}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      {row.team.logoUrl ? (
                        <img
                          src={row.team.logoUrl}
                          alt=""
                          className="size-5 shrink-0 object-contain"
                          loading="lazy"
                        />
                      ) : null}
                      <span className="truncate">{row.team.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">{row.played}</TableCell>
                  <TableCell className="text-center">{row.won}</TableCell>
                  <TableCell className="text-center">{row.drawn}</TableCell>
                  <TableCell className="text-center">{row.lost}</TableCell>
                  <TableCell className="text-center">{row.goalsFor}</TableCell>
                  <TableCell className="text-center">{row.goalsAgainst}</TableCell>
                  <TableCell className="text-center">
                    {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                  </TableCell>
                  <TableCell className="text-center font-semibold">{row.points}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <FormChips recent={row.form} team={row.team} size="sm" />
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>

        {/* A faixa aparece se houver zonas OU critério de desempate: pendurar o bloco de desempate na
            condição das zonas a faria sumir justamente nas ligas sem zona alguma. @feature LIG-017 */}
        {present.length || tiebreak ? (
          <div className="flex flex-col gap-2 border-t px-4 py-3 text-xs text-muted-foreground">
            {present.length ? (
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {present.map((z) => (
                  <span key={z} className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${ZONES[z]!.dot}`} />
                    {ZONES[z]!.label}
                  </span>
                ))}
              </div>
            ) : null}
            {tiebreak ? (
              <div>
                <p>{tiebreak.title}</p>
                <ol className="mt-1 list-decimal space-y-0.5 pl-4">
                  {tiebreak.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

// Loading placeholder mirroring the standings table layout (position, team crest + name, stats,
// form) so the page doesn't jump when the real data arrives. Shares StandingsCols/StandingsHead
// with the real table, so column geometry is identical → no horizontal shift on load.
function StandingsSkeleton() {
  // Sem CardHeader: a aba já diz "Classificação"; repetir o rótulo dentro do card é ruído. O skeleton
  // abaixo acompanha — se só um dos dois perdesse o header, a troca geraria salto de layout.
  return (
    <Card className="pt-0">
      <CardContent className="p-0">
        <Table className={TABLE_CLASS}>
          <StandingsCols />
          <StandingsHead />
          <TableBody>
            {Array.from({ length: 20 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="border-l-2 border-l-transparent">
                  <Skeleton className="h-4 w-4" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-5 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                {Array.from({ length: 8 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="mx-auto h-4 w-5" />
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Skeleton key={k} className="size-5 rounded-sm" />
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
