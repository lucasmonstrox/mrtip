"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"

import type { TeamRest } from "../../types"
import { useMatchPrognosisQuery } from "../../hooks/data/queries/use-match-prognosis-query"
import { AbsenceImpactPanel } from "./absence-impact-panel"

type TeamRef = { name: string; logoUrl: string | null }
// Days each side rested before this match, as the prognosis prompt itself sees them (fatigue factor).
type MatchRest = { home: TeamRest; away: TeamRest }
// Inferred payload of the prognosis endpoint (null = none generated yet).
type Prognosis = NonNullable<ReturnType<typeof useMatchPrognosisQuery>["data"]>
type TeamBlock = Prognosis["home"]
type OneXTwo = Prognosis["general"]["oneXTwo"]
type BestBet = NonNullable<Prognosis["bestBet"]>

const BANDS = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90"] as const
const pct = (x: number) => `${Math.round(x * 100)}%`

const CONF: Record<string, { label: string; cls: string }> = {
  low: { label: "confiança baixa", cls: "bg-amber-500/15 text-amber-600 dark:text-amber-400" },
  medium: { label: "confiança média", cls: "bg-blue-500/15 text-blue-600 dark:text-blue-400" },
  high: { label: "confiança alta", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
}

// One labelled probability row as a stacked bar with the % printed inside each segment:
// mandante (verde) / empate (cinza) / visitante (azul).
function OneXTwoRow({ label, p }: { label: string; p: OneXTwo }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="flex h-6 flex-1 overflow-hidden rounded-sm font-mono text-[11px] font-medium tabular-nums text-white">
        <div
          className="flex min-w-0 items-center justify-center overflow-hidden bg-emerald-500/80"
          style={{ width: pct(p.home) }}
          title={`Mandante ${pct(p.home)}`}
        >
          {pct(p.home)}
        </div>
        <div
          className="flex min-w-0 items-center justify-center overflow-hidden bg-muted-foreground/40"
          style={{ width: pct(p.draw) }}
          title={`Empate ${pct(p.draw)}`}
        >
          {pct(p.draw)}
        </div>
        <div
          className="flex min-w-0 items-center justify-center overflow-hidden bg-blue-500/70"
          style={{ width: pct(p.away) }}
          title={`Visitante ${pct(p.away)}`}
        >
          {pct(p.away)}
        </div>
      </div>
    </div>
  )
}

// A small KPI tile (number on top, label below).
function Kpi({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-card px-2 py-3 text-center">
      <span className="text-xl font-semibold tabular-nums text-primary">{value}</span>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  )
}

// One team's prognosis card: xG total + por tempo, faixas de 15min (barras) e a leitura textual.
function TeamCard({ team, block }: { team: TeamRef; block: TeamBlock }) {
  const peak = Math.max(0.01, ...BANDS.map((b) => block.bands[b] ?? 0))
  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {team.logoUrl ? <img src={team.logoUrl} alt="" className="size-6 shrink-0 object-contain" /> : null}
          <span className="truncate font-medium">{team.name}</span>
        </div>
        <span className="font-mono text-2xl font-bold tabular-nums text-primary">{block.xg.toFixed(2)}</span>
      </div>
      <div className="flex gap-4 text-xs text-muted-foreground">
        <span>
          1ºT <span className="font-mono font-medium text-foreground tabular-nums">{block.xg1t.toFixed(2)}</span>
        </span>
        <span>
          2ºT <span className="font-mono font-medium text-foreground tabular-nums">{block.xg2t.toFixed(2)}</span>
        </span>
        <span className="ml-auto text-muted-foreground">xG por faixa de 15&apos;</span>
      </div>
      <ul className="flex flex-col gap-1">
        {BANDS.map((b) => {
          const v = block.bands[b] ?? 0
          return (
            <li key={b} className="flex items-center gap-2">
              <span className="w-12 shrink-0 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                {b}&apos;
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-sm bg-muted">
                <div className="h-full rounded-sm bg-primary/70" style={{ width: `${(v / peak) * 100}%` }} />
              </div>
              <span className="w-9 shrink-0 text-right font-mono text-[11px] tabular-nums">{v.toFixed(2)}</span>
            </li>
          )
        })}
      </ul>
      <p className="text-sm text-muted-foreground">{block.summary}</p>
    </div>
  )
}

// One side's rest as a tile: club logo + the days-since-last-match number (big), or "estreia" when
// the team has no earlier in-league match. @feature LIG-005
function RestTile({ team, rest }: { team: TeamRef; rest: TeamRest }) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border bg-card px-2 py-4 text-center">
      <div className="flex items-center gap-2">
        {team.logoUrl ? <img src={team.logoUrl} alt="" className="size-5 shrink-0 object-contain" /> : null}
        <span className="truncate text-sm font-medium">{team.name}</span>
      </div>
      {rest ? (
        <span className="text-3xl font-bold tabular-nums text-primary">
          {rest.restDays}{" "}
          <span className="text-sm font-normal text-muted-foreground">{rest.restDays === 1 ? "dia" : "dias"}</span>
        </span>
      ) : (
        <span className="py-1.5 text-sm text-muted-foreground">estreia</span>
      )}
    </div>
  )
}

// Explicit rest/fatigue panel for the prognosis tab: each side's days since its last in-league match
// plus the ASYMMETRY (the gap is what moves a bet — a side coming off 3 days vs 7). This is the same
// fatigue factor the prognosis prompt is fed, surfaced so the read is auditable. @feature LIG-005
function RestPanel({ home, away, rest }: { home: TeamRef; away: TeamRef; rest: MatchRest }) {
  const gap = rest.home && rest.away ? Math.abs(rest.home.restDays - rest.away.restDays) : null
  const fresher =
    rest.home && rest.away && rest.home.restDays !== rest.away.restDays
      ? rest.home.restDays > rest.away.restDays
        ? home.name
        : away.name
      : null
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          Descanso
          <span
            className="cursor-help rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground underline decoration-dotted"
            title="Dias desde o último jogo do time em qualquer competição (liga ou copa). Jogos de seleção/amistosos não são ingeridos."
          >
            liga + copa
          </span>
        </CardTitle>
        <CardDescription className="text-xs">
          Dias desde o último jogo — o fator de fadiga que o modelo já considerou
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-3">
          <RestTile team={home} rest={rest.home} />
          <RestTile team={away} rest={rest.away} />
        </div>
        {gap != null ? (
          gap === 0 ? (
            <p className="text-sm text-muted-foreground">Descanso parelho — sem vantagem de calendário.</p>
          ) : (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{fresher}</span> chega com{" "}
              <span className="font-medium text-foreground">
                {gap} {gap === 1 ? "dia" : "dias"}
              </span>{" "}
              a mais de descanso.
            </p>
          )
        ) : null}
      </CardContent>
    </Card>
  )
}

// Rótulo legível da aposta a partir dos campos estruturados — o time sai de `selection` + o match (não
// vem do modelo). Mantém o conteúdo (PT) na borda de exibição; market/selection são código (inglês).
function betLabel(b: BestBet, home: TeamRef, away: TeamRef): { title: string; team: TeamRef | null } {
  if (b.market === "1x2") {
    if (b.selection === "draw") return { title: "Empate", team: null }
    return { title: "Vitória", team: b.selection === "home" ? home : away }
  }
  if (b.market === "over_under") return { title: `${b.selection === "over" ? "Over" : "Under"} ${b.line ?? ""} gols`.trim(), team: null }
  if (b.market === "btts") return { title: `Ambos marcam: ${b.selection === "yes" ? "Sim" : "Não"}`, team: null }
  if (b.market === "handicap") {
    const h = b.line == null ? "" : b.line > 0 ? `+${b.line}` : `${b.line}`
    return { title: `Handicap ${h}`.trim(), team: b.selection === "home" ? home : away }
  }
  if (b.market === "team_total") {
    return {
      title: `${b.selection === "over" ? "Over" : "Under"} ${b.line ?? ""} gols`.trim(),
      team: b.team === "home" ? home : b.team === "away" ? away : null,
    }
  }
  // Mercados derivados do grid Dixon-Coles (MOD-004)
  if (b.market === "double_chance") {
    const dc =
      b.selection === "home_draw" ? `${home.name} ou Empate`
      : b.selection === "draw_away" ? `Empate ou ${away.name}`
      : `${home.name} ou ${away.name}`
    return { title: `Dupla chance: ${dc}`, team: null }
  }
  if (b.market === "draw_no_bet") return { title: "Empate anula aposta", team: b.selection === "home" ? home : away }
  if (b.market === "odd_even") return { title: `Total de gols: ${b.selection === "odd" ? "Ímpar" : "Par"}`, team: null }
  return { title: `${b.selection ?? ""} ${b.line ?? ""}`.trim() || "Aposta", team: null }
}

// "Aposta recomendada" — a leitura de sharp: a decisão estruturada (mercado + seleção + prob) e a
// análise completa. O destaque da aba; "Sem aposta" quando o modelo passou (disciplina).
function BestBetCard({ bet, home, away }: { bet: BestBet; home: TeamRef; away: TeamRef }) {
  const { title, team } = betLabel(bet, home, away)
  const conf = CONF[bet.confidence ?? "medium"] ?? CONF.medium!
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          🎯 Aposta recomendada
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", conf.cls)}>{conf.label}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {team?.logoUrl ? <img src={team.logoUrl} alt="" className="size-7 shrink-0 object-contain" /> : null}
          <span className="text-lg font-semibold">
            {title}
            {team ? <span className="text-muted-foreground"> · {team.name}</span> : null}
          </span>
          <span className="ml-auto font-mono text-xl font-bold tabular-nums text-primary">{pct(bet.probability ?? 0)}</span>
        </div>
        <p className="text-sm text-muted-foreground">{bet.analysis}</p>
      </CardContent>
    </Card>
  )
}

// "Prognóstico" tab: a per-team + overall expected-goals read produced by the LLM, served from
// match_prognosis. Empty state when no run exists for the match yet.
export function Prognosis({
  id,
  home,
  away,
  rest,
}: {
  id: string
  home: TeamRef
  away: TeamRef
  rest?: MatchRest
}) {
  const { data, isPending, isError } = useMatchPrognosisQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando prognóstico…</p>
  if (isError) return <p className="text-sm text-destructive">Não foi possível carregar o prognóstico.</p>
  if (!data)
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        Prognóstico ainda não gerado para esta partida.
      </div>
    )

  const g = data.general
  const conf = CONF[data.confidence] ?? CONF.medium!
  return (
    <div className="flex flex-col gap-6">
      {/* Aposta recomendada (leitura de sharp) — o destaque, no topo da aba */}
      {data.bestBet ? <BestBetCard bet={data.bestBet} home={home} away={away} /> : null}

      {/* Geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-base">
            Prognóstico geral
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", conf.cls)}>{conf.label}</span>
          </CardTitle>
          <CardDescription className="text-xs">
            Expected goals do jogo · gerado por {data.model}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Kpi value={g.total.toFixed(2)} label="total xG" />
            <Kpi value={pct(g.over25Prob)} label="over 2.5" />
            <Kpi value={pct(g.bttsProb)} label="ambas marcam" />
            <Kpi value={`${g.total1t.toFixed(1)} / ${g.total2t.toFixed(1)}`} label="xG 1ºT / 2ºT" />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              Resultado (mandante · empate · visitante)
            </span>
            <OneXTwoRow label="Jogo" p={g.oneXTwo} />
            <OneXTwoRow label="1º tempo" p={g.oneXTwo1t} />
            <OneXTwoRow label="2º tempo" p={g.oneXTwo2t} />
          </div>
          <p className="text-sm text-muted-foreground">{g.summary}</p>
          {data.drivers.length ? (
            <div className="flex flex-wrap gap-1.5">
              {data.drivers.map((d) => (
                <span key={d} className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {d}
                </span>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Descanso (fadiga): mesmo sinal que entra no prompt, agora explícito na aba. @feature LIG-005 */}
      {rest ? <RestPanel home={home} away={away} rest={rest} /> : null}

      {/* Impacto dos desfalques: quanto o ataque depende de quem está fora — determinístico. @feature LIG-007 */}
      <AbsenceImpactPanel id={id} />

      {/* Por time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TeamCard team={home} block={data.home} />
        <TeamCard team={away} block={data.away} />
      </div>
    </div>
  )
}
