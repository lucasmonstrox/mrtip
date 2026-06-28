import { UserXIcon } from "lucide-react"

import type { HubMatch } from "../types"
import { Crest } from "./crest"

// Tira horizontal com os desfalques mais relevantes da RODADA INTEIRA (peso = gols+assists na
// temporada). Leitura cross-jogo de "quem falta e quanto importa" — o fator que mais derruba aposta.
export function KeyAbsencesStrip({ matches }: { matches: HubMatch[] }) {
  const ranked = matches
    .flatMap((m) =>
      [
        ...m.absences.home.map((a) => ({ ...a, team: m.home })),
        ...m.absences.away.map((a) => ({ ...a, team: m.away })),
      ].map((a) => ({ ...a, weight: a.goals + a.assists })),
    )
    .filter((a) => a.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)

  if (!ranked.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-card px-3 py-2">
      <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <UserXIcon className="size-3.5" />
        Desfalques de peso
      </span>
      {ranked.map((a) => (
        <span
          key={`${a.team.code}-${a.player}`}
          className="flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 text-xs"
        >
          <Crest team={a.team} size="sm" />
          <span className="font-medium">{a.player}</span>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
            {a.goals}G{a.assists > 0 ? ` ${a.assists}A` : ""}
          </span>
          {a.doubt ? (
            <span className="rounded bg-amber-500/15 px-1 text-[9px] font-medium text-amber-600 dark:text-amber-400">
              dúvida
            </span>
          ) : null}
        </span>
      ))}
    </div>
  )
}
