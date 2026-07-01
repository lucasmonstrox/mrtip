"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Input } from "@workspace/ui/components/input"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { useState, type ReactNode } from "react"

import { useLeagueRoundsQuery } from "../../hooks/data/queries/use-league-rounds-query"

// Dobra acento e caixa para busca tolerante: "sao paulo" casa com "São Paulo",
// "atletico" com "Atlético". Sem trim — preserva espaços/índices para o realce.
function fold(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
}

function normalize(s: string) {
  return fold(s).trim()
}

// Realça (marca-texto amarelo) só o trecho do nome que casou com a busca. Mapeia o índice
// do match — que é acento-insensível — de volta para os caracteres originais, char a char.
function highlight(name: string, q: string): ReactNode {
  if (!q) return name
  let norm = ""
  const map: number[] = [] // map[i] = índice no nome original do i-ésimo char normalizado
  for (let i = 0; i < name.length; i++) {
    const folded = fold(name[i]!)
    for (let k = 0; k < folded.length; k++) map.push(i)
    norm += folded
  }
  const idx = norm.indexOf(q)
  if (idx === -1) return name
  const start = map[idx]!
  const end = (map[idx + q.length - 1] ?? name.length - 1) + 1
  return (
    <>
      {name.slice(0, start)}
      <mark className="bg-transparent font-semibold text-yellow-600 dark:text-yellow-400">
        {name.slice(start, end)}
      </mark>
      {name.slice(end)}
    </>
  )
}

export function RoundsList({ code }: { code: string }) {
  const { data: rounds, isPending, isError } = useLeagueRoundsQuery(code)
  const [selected, setSelected] = useState<number | null>(null)
  // Busca de time: destaca a linha do time procurado dentro da rodada. Fica fora do
  // estado da rodada de propósito — o realce persiste ao navegar entre rodadas.
  const [query, setQuery] = useState("")

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando rounds…</p>
  if (isError || !rounds)
    return <p className="text-sm text-destructive">Não foi possível carregar os rounds.</p>

  const current = rounds.find((r) => r.round === selected) ?? rounds.at(-1)
  if (!current) return <p className="text-sm text-muted-foreground">Sem rounds disponíveis.</p>

  const q = normalize(query)
  const teamMatches = (name: string) => q.length > 0 && normalize(name).includes(q)
  // Filtro real: com busca ativa, a lista mostra só os confrontos do time procurado.
  const visible =
    q.length > 0
      ? current.matches.filter((m) => teamMatches(m.home.name) || teamMatches(m.away.name))
      : current.matches

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rodada {current.round}</CardTitle>
        <CardAction className="flex items-center gap-2">
          <div className="relative w-[180px]">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar time…"
              className="h-8 pr-7 pl-7"
              aria-label="Buscar time na rodada"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpar busca"
                className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            ) : null}
          </div>
          <Select value={String(current.round)} onValueChange={(v) => setSelected(Number(v))}>
            <SelectTrigger className="w-[140px]" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {rounds.map((r) => (
                <SelectItem key={r.round} value={String(r.round)}>
                  {r.round}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="p-0">
        {visible.length === 0 ? (
          <p className="border-t px-4 py-8 text-center text-sm text-muted-foreground">
            Nenhum time encontrado nesta rodada.
          </p>
        ) : (
        <ul className="divide-y border-t">
          {visible.map((m) => {
            return (
              <li
                key={m.id}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-2 text-sm transition-colors"
              >
                <Link
                  href={`/teams/${m.home.slug}`}
                  className="flex items-center justify-self-end gap-2 rounded font-medium decoration-2 underline-offset-4 hover:underline"
                >
                  <span>{highlight(m.home.name, q)}</span>
                  {m.home.logoUrl ? (
                    <img src={m.home.logoUrl} alt="" className="size-5 shrink-0 object-contain" loading="lazy" />
                  ) : null}
                </Link>
                <Link
                  href={`/matches/${m.slug}`}
                  className="rounded bg-muted px-2 py-0.5 font-mono tabular-nums transition-colors hover:bg-foreground hover:text-background"
                >
                  {m.score ? `${m.score.ft[0]} - ${m.score.ft[1]}` : "vs"}
                </Link>
                <Link
                  href={`/teams/${m.away.slug}`}
                  className="flex items-center justify-self-start gap-2 rounded font-medium decoration-2 underline-offset-4 hover:underline"
                >
                  {m.away.logoUrl ? (
                    <img src={m.away.logoUrl} alt="" className="size-5 shrink-0 object-contain" loading="lazy" />
                  ) : null}
                  <span>{highlight(m.away.name, q)}</span>
                </Link>
              </li>
            )
          })}
        </ul>
        )}
      </CardContent>
    </Card>
  )
}
