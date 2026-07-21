"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import Link from "next/link"

import { useTeamQuery } from "../../hooks/data/queries/use-team-query"
import { formatDate } from "../../utils/format"
import { FormGuide } from "../match-detail/form-guide"
import { SeasonSwitcher } from "../season-switcher/season-switcher"
import { TeamStanding } from "./team-standing"
import { TeamTrends } from "./team-trends"

// Result chip in the match log, from the team's perspective: win/draw/loss → color + PT letter.
const RESULT_COLOR: Record<"W" | "D" | "L", string> = {
  W: "bg-emerald-500",
  D: "bg-zinc-400",
  L: "bg-red-500",
}
const RESULT_LABEL: Record<"W" | "D" | "L", string> = { W: "V", D: "E", L: "D" }

// Logo do X desenhado à mão: o lucide tirou os ícones de marca, então depender dele quebraria no
// próximo bump. 24x24 no viewBox oficial, herda a cor do texto via currentColor.
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function TeamDetail({ slug }: { slug: string }) {
  const { data: team, isPending, isError } = useTeamQuery(slug)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando time…</p>
  if (isError || !team)
    return <p className="text-sm text-destructive">Não foi possível carregar o time.</p>

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {team.logoUrl ? (
            <img src={team.logoUrl} alt={team.name} className="size-14 object-contain" />
          ) : (
            <div className="size-14 rounded bg-muted" />
          )}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold tracking-tight">{team.name}</h1>
            <div className="flex items-center gap-3">
              {team.shortCode && (
                <span className="font-mono text-xs tracking-wider text-muted-foreground">
                  {team.shortCode}
                </span>
              )}
              {team.twitterUsername && (
                <a
                  href={`https://x.com/${team.twitterUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                  title={`Abrir @${team.twitterUsername} no X`}
                >
                  <XLogo className="size-3" />
                  <span className="font-mono">@{team.twitterUsername}</span>
                </a>
              )}
            </div>
          </div>
          <div className="ml-auto">
            <SeasonSwitcher seasons={team.seasons} />
          </div>
        </div>
        <FormGuide form={team.form} />
      </header>

      {team.standing && <TeamStanding standing={team.standing} />}

      <TeamTrends trends={team.trends} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Jogos ({team.matches.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="divide-y">
            {team.matches.map((m) => {
              const isHome = m.home.id === team.id
              let result: "W" | "D" | "L" | null = null
              if (m.score) {
                const gf = isHome ? m.score.ft[0] : m.score.ft[1]
                const ga = isHome ? m.score.ft[1] : m.score.ft[0]
                result = gf > ga ? "W" : gf < ga ? "L" : "D"
              }
              return (
                <li key={m.id}>
                  <Link
                    href={`/matches/${m.slug}`}
                    className="grid grid-cols-[1.5rem_5rem_1fr_auto_1fr] items-center gap-3 px-4 py-2 text-sm transition-colors hover:bg-muted/50"
                  >
                    {result ? (
                      <span
                        className={cn(
                          "flex size-5 items-center justify-center rounded text-[10px] font-semibold text-white",
                          RESULT_COLOR[result],
                        )}
                      >
                        {RESULT_LABEL[result]}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="text-xs text-muted-foreground">{formatDate(m.date, null)}</span>
                    <span className={cn("text-right", isHome && "font-semibold")}>{m.home.name}</span>
                    <span className="rounded bg-muted px-2 py-0.5 font-mono tabular-nums">
                      {m.score ? `${m.score.ft[0]} - ${m.score.ft[1]}` : "vs"}
                    </span>
                    <span className={cn(!isHome && "font-semibold")}>{m.away.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>
    </section>
  )
}
