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

import { useStandingsQuery } from "../../hooks/data/queries/use-standings-query"
import { FormChips } from "../match-detail/form-guide"

// Qualification/relegation zones → border color + PT label (UI copy stays Portuguese).
const ZONES: Record<string, { border: string; dot: string; label: string }> = {
  champions: { border: "border-l-blue-600", dot: "bg-blue-600", label: "Champions League" },
  europa: { border: "border-l-orange-500", dot: "bg-orange-500", label: "Europa League" },
  conference: { border: "border-l-green-500", dot: "bg-green-500", label: "Conference League" },
  relegation: { border: "border-l-red-500", dot: "bg-red-500", label: "Rebaixamento" },
}

export function StandingsTable({ code }: { code: string }) {
  const { data: table, isPending, isError } = useStandingsQuery(code)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando classificação…</p>
  if (isError || !table)
    return <p className="text-sm text-destructive">Não foi possível carregar a classificação.</p>

  // Legend with only the zones actually present, in table order.
  const present = [...new Set(table.map((r) => r.zone).filter((z): z is string => !!z && z in ZONES))]

  return (
    <div className="flex flex-col gap-3">
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
          {table.map((row) => {
            const zone = row.zone ? ZONES[row.zone] : undefined
            return (
              <TableRow key={row.team.id}>
                <TableCell
                  className={`border-l-2 text-muted-foreground ${zone ? zone.border : "border-l-transparent"}`}
                >
                  {row.position}
                </TableCell>
                <TableCell className="font-medium">
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
                    {row.team.name}
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
                    <FormChips recent={row.form} size="sm" />
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {present.length ? (
        <div className="flex flex-wrap gap-x-4 gap-y-1 px-2 text-xs text-muted-foreground">
          {present.map((z) => (
            <span key={z} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${ZONES[z]!.dot}`} />
              {ZONES[z]!.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
