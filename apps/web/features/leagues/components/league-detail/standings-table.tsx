"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
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

import { useStandingsQuery } from "../../hooks/data/queries/use-standings-query"
import { FormChips } from "../match-detail/form-guide"

// Qualification/relegation zones → border color + PT label (UI copy stays Portuguese).
const ZONES: Record<string, { border: string; dot: string; label: string }> = {
  champions: { border: "border-l-blue-600", dot: "bg-blue-600", label: "Champions League" },
  europa: { border: "border-l-orange-500", dot: "bg-orange-500", label: "Europa League" },
  conference: { border: "border-l-green-500", dot: "bg-green-500", label: "Conference League" },
  relegation: { border: "border-l-red-500", dot: "bg-red-500", label: "Rebaixamento" },
}

// Larguras de coluna fixas, compartilhadas pela tabela real e pelo skeleton. Com table-fixed
// elas decidem o layout em vez do conteúdo, então as colunas não saltam quando os dados chegam
// (a coluna "Time" absorve o espaço restante). Fonte única — muda aqui e os dois lados acompanham.
function StandingsCols() {
  return (
    <colgroup>
      <col className="w-12" /> {/* # */}
      <col /> {/* Time — flexível */}
      <col className="w-12" /> {/* J */}
      <col className="w-12" /> {/* V */}
      <col className="w-12" /> {/* E */}
      <col className="w-12" /> {/* D */}
      <col className="w-12" /> {/* GP */}
      <col className="w-12" /> {/* GC */}
      <col className="w-14" /> {/* SG */}
      <col className="w-14" /> {/* Pts */}
      <col className="w-44" /> {/* Forma */}
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
  "table-fixed [&_td:first-child]:pl-4 [&_td:last-child]:pr-4 [&_th:first-child]:pl-4 [&_th:last-child]:pr-4"

export function StandingsTable({ code }: { code: string }) {
  const { data: table, isPending, isError } = useStandingsQuery(code)

  if (isPending) return <StandingsSkeleton />
  if (isError || !table)
    return <p className="text-sm text-destructive">Não foi possível carregar a classificação.</p>

  // Legend with only the zones actually present, in table order.
  const present = [...new Set(table.map((r) => r.zone).filter((z): z is string => !!z && z in ZONES))]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Classificação</CardTitle>
      </CardHeader>
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

        {present.length ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1 border-t px-4 py-3 text-xs text-muted-foreground">
            {present.map((z) => (
              <span key={z} className="flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${ZONES[z]!.dot}`} />
                {ZONES[z]!.label}
              </span>
            ))}
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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Classificação</CardTitle>
      </CardHeader>
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
