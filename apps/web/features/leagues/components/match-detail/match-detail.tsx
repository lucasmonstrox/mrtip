"use client"

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import type { LucideIcon } from "lucide-react"
import { Swords } from "lucide-react"
import Link from "next/link"

import type { TeamRef, TeamRest, TeamStanding } from "../../types"
import { useMatchFormQuery } from "../../hooks/data/queries/use-match-form-query"
import { useMatchQuery } from "../../hooks/data/queries/use-match-query"
import { formatDate, initials } from "../../utils/format"
import { Absences } from "./absences"
import { Commentary } from "./commentary"
import { FormChips } from "./form-guide"
import { GoalTiming } from "./goal-timing"
import { Lineup } from "./lineup"
import { MatchEvents } from "./match-events"
import { MatchMomentum } from "./match-momentum"
import { MatchNews } from "./match-news"
import { MATCH_TABS, type MatchTabValue } from "./match-tabs"
import { Prognosis } from "./prognosis"
import { Scorers } from "./scorers"
import { Statistics } from "./statistics"

// Empty-state for tabs whose data isn't wired up yet (or has no record for this match).
function TabEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

// Empty state with icon + title + description (shadcn Empty), used on tabs like H2H.
function TabEmptyRich({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

// Rest of one side: days since its previous match in ANY competition (league or cup), or "estreia" when
// the team has no earlier match in the campaign. The number comes ready from the API. @feature LIG-005
function RestSide({ name, rest }: { name: string; rest: TeamRest }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="truncate text-sm font-medium">{name}</span>
      {rest ? (
        <span className="text-lg font-semibold tabular-nums">
          {rest.restDays}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            {rest.restDays === 1 ? "dia" : "dias"}
          </span>
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">estreia</span>
      )}
    </div>
  )
}

// Rivais de um lado (união outbound+inbound da whitelist). Vazio = fonte não liga ninguém.
function RivalSide({ name, rivals }: { name: string; rivals: TeamRef[] }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="truncate text-sm font-medium">{name}</span>
      {rivals.length === 0 ? (
        <span className="text-xs text-muted-foreground">Nenhum rival listado</span>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {rivals.map((r) => (
            <li key={r.id}>
              <Link
                href={`/teams/${r.slug}`}
                className="flex items-center gap-2 text-sm hover:underline"
              >
                {r.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={r.logoUrl} alt="" className="size-5 shrink-0 object-contain" />
                ) : null}
                <span className="truncate">{r.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// Qualification/relegation zone → text color for the position number (mirrors team-standing.tsx's ZONE).
const ZONE_COLOR: Record<string, string> = {
  champions: "text-emerald-600 dark:text-emerald-400",
  europa: "text-blue-600 dark:text-blue-400",
  conference: "text-cyan-600 dark:text-cyan-400",
  // Zonas CONMEBOL (Série A) — mesma paleta do team-standing.tsx. @feature LIG-012
  libertadores: "text-emerald-600 dark:text-emerald-400",
  "libertadores-qualifiers": "text-teal-600 dark:text-teal-400",
  sudamericana: "text-amber-600 dark:text-amber-400",
  relegation: "text-red-600 dark:text-red-400",
}

// One side of the standings snapshot: the team's official current-season position (tinted by zone),
// points, W-D-L and goal difference. null → "—" (no standing row yet). @feature LIG-006
function StandingSide({ name, standing: s }: { name: string; standing: TeamStanding | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="truncate text-sm font-medium">{name}</span>
      {s ? (
        <>
          <span className="text-lg font-semibold tabular-nums">
            <span className={s.zone ? ZONE_COLOR[s.zone] : undefined}>{s.position}º</span>
            <span className="ml-1.5 text-sm font-normal text-muted-foreground">{s.points} pts</span>
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {s.won}V · {s.drawn}E · {s.lost}D · SG {s.goalDifference > 0 ? `+${s.goalDifference}` : s.goalDifference}
          </span>
        </>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      )}
    </div>
  )
}

export function MatchDetail({ slug, tab }: { slug: string; tab: MatchTabValue }) {
  const { data: match, isPending, isError } = useMatchQuery(slug)
  // Sub-resources (form/lineup/scorers/goal-timing/…) are keyed by the match UUID, not the slug —
  // so they wait for the detail to resolve the id from the pretty URL. @feature LIG-009
  const { data: form } = useMatchFormQuery(match?.id ?? "")

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando partida…</p>
  if (isError || !match)
    return <p className="text-sm text-destructive">Não foi possível carregar a partida.</p>

  const id = match.id // uuid for the sub-resource tabs below (slug → id resolved by the detail)
  const score = match.score
  // Venue subtitle: city · capacity (omitting whichever is missing). @feature LIG-004
  const venue = match.venue
  const venueSubtitle = venue
    ? [venue.cityName, venue.capacity ? `${venue.capacity.toLocaleString("pt-BR")} lugares` : null]
        .filter(Boolean)
        .join(" · ")
    : ""

  return (
    <section className="flex flex-col gap-6">
      {/* Header: no desktop o back-link e a data FLANQUEIAM o placar (bordas da tela) em vez de ficarem
          empilhados acima dele; o miolo times+placar segue centralizado. No mobile não cabe flanquear, então
          os dois voltam pra uma linha própria — `sm:contents` dissolve o wrapper no desktop e joga os dois
          como filhos diretos do flex, sem duplicar markup. */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground sm:contents">
          <Link
            href={`/leagues/${match.league.code}`}
            className="shrink-0 hover:text-foreground sm:pt-1"
          >
            ← {match.league.name}
          </Link>
          <span className="shrink-0 sm:order-last sm:pt-1">{formatDate(match.date, match.time)}</span>
        </div>
        <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-start gap-3">
          <div className="flex flex-col items-end gap-1.5">
            <Link
              href={`/teams/${match.home.slug}`}
              className="flex items-center justify-end gap-2 text-right text-base font-semibold hover:underline"
            >
              {match.home.name}
              {match.home.logoUrl ? (
                <img src={match.home.logoUrl} alt="" className="size-7 shrink-0 object-contain" />
              ) : null}
            </Link>
            {form ? <FormChips recent={form.home.recent} team={form.home.team} size="sm" /> : null}
          </div>
          <div className="text-center">
            {score ? (
              <div className="font-mono text-3xl font-bold tabular-nums">
                {score.ft[0]} <span className="text-muted-foreground">-</span> {score.ft[1]}
              </div>
            ) : (
              <div className="text-xl font-medium text-muted-foreground">vs</div>
            )}
            {score?.ht ? (
              <div className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                intervalo {score.ht[0]}-{score.ht[1]}
              </div>
            ) : null}
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <Link
              href={`/teams/${match.away.slug}`}
              className="flex items-center gap-2 text-left text-base font-semibold hover:underline"
            >
              {match.away.logoUrl ? (
                <img src={match.away.logoUrl} alt="" className="size-7 shrink-0 object-contain" />
              ) : null}
              {match.away.name}
            </Link>
            {form ? <FormChips recent={form.away.recent} team={form.away.team} size="sm" /> : null}
          </div>
        </div>
      </header>

      {/* Aba controlada pela URL (`/matches/[slug]/[tab]`): refresh e deep-link abrem a aba certa. @feature LIG-024 */}
      <Tabs value={tab}>
        {/* 10 abas não cabem numa pill preenchida sem virar um paredão cinza: a variante `line` deixa o
            indicador ser um sublinhado fino e dá ar pros ícones. O wrapper rola na horizontal (barra
            escondida) em vez de espremer — a página inteira já estoura em viewport estreita e a barra de
            abas não precisa herdar isso. Máscara nas bordas avisa que há mais aba fora de vista. */}
        {/* A régua fica no wrapper, não na TabsList (que é `w-fit` e morreria no meio da página): assim
            ela atravessa a largura do conteúdo e o sublinhado da aba ativa se apoia nela. */}
        {/* `min-w-0` é o que faz o `overflow-x-auto` engatar: item de flex nasce com `min-width:auto` e
            cresceria pra caber as 10 abas (990px com ícone) em vez de rolar, empurrando a largura da
            página inteira. Com ele a barra encolhe e rola sozinha. */}
        <div className="-mx-1 min-w-0 max-w-[calc(100vw-2rem)] overflow-x-auto border-b px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <TabsList variant="line">
            {MATCH_TABS.map(({ value, label, icon: Icon, primary }) => (
              <TabsTrigger key={value} value={value} asChild className="gap-1.5">
                <Link href={`/matches/${slug}/${value}`}>
                  {/* O Prognóstico não é par dos outros: é a tese do produto (a aposta com evidência).
                      Ganha o ícone tingido quando inativo pra ser achável de relance, sem virar enfeite. */}
                  <Icon className={primary ? "text-primary" : undefined} aria-hidden />
                  {label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Só o painel da aba ativa monta — evita 10 fetches escondidos. @feature LIG-024 */}
        {tab === "momentum" ? (
          <TabsContent value="momentum" className="pt-2" forceMount>
            <MatchMomentum id={id} home={match.home} away={match.away} />
          </TabsContent>
        ) : null}

        {tab === "estatisticas" ? (
          <TabsContent value="estatisticas" className="pt-2" forceMount>
            <Statistics id={id} home={match.home} away={match.away} />
          </TabsContent>
        ) : null}

        {tab === "prognostico" ? (
          <TabsContent value="prognostico" className="pt-2" forceMount>
            <Prognosis id={id} home={match.home} away={match.away} rest={match.rest} />
          </TabsContent>
        ) : null}

        {tab === "eventos" ? (
          <TabsContent value="eventos" className="pt-2" forceMount>
            {match.goals.length || match.cards.length ? (
              <MatchEvents goals={match.goals} cards={match.cards} homeTeamId={match.home.id} />
            ) : (
              <TabEmpty>Sem eventos registrados.</TabEmpty>
            )}
          </TabsContent>
        ) : null}

        {tab === "escalacao" ? (
          <TabsContent value="escalacao" className="flex flex-col gap-6 pt-2" forceMount>
            <Lineup id={id} />
            <Absences id={id} />
          </TabsContent>
        ) : null}

        {tab === "h2h" ? (
          <TabsContent value="h2h" className="pt-2" forceMount>
            <TabEmptyRich
              icon={Swords}
              title="Confrontos diretos"
              description="O histórico de confrontos entre estes times chega em breve."
            />
          </TabsContent>
        ) : null}

        {tab === "gols" ? (
          <TabsContent value="gols" className="flex flex-col gap-6 pt-2" forceMount>
            <Scorers id={id} />
            <GoalTiming id={id} />
          </TabsContent>
        ) : null}

        {tab === "fatos" ? (
          <TabsContent value="fatos" className="flex flex-col gap-4 pt-2" forceMount>
          {/* Standings snapshot: each team's official current-season position/points/W-D-L/goal
              difference, position tinted by zone. Hidden when the API hasn't sent standings yet
              (stale pre-LIG-006 payload — `?.` guards the runtime). @feature LIG-006 */}
          {match.standings?.home || match.standings?.away ? (
            <div className="rounded-lg border bg-card p-4">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Classificação</span>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <StandingSide name={match.home.name} standing={match.standings?.home ?? null} />
                <StandingSide name={match.away.name} standing={match.standings?.away ?? null} />
              </div>
            </div>
          ) : null}

          {/* Venue (stadium): name + city + capacity (+ photo). lat/long are NOT shown — they feed
              the travel/fatigue signal, not the UI. @feature LIG-004 */}
          {venue ? (
            <div className="flex items-center gap-4 rounded-lg border bg-card p-4">
              {venue.imageUrl ? (
                <img src={venue.imageUrl} alt="" className="h-16 w-24 shrink-0 rounded object-cover" />
              ) : null}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">Estádio</span>
                <span className="text-base font-semibold">{venue.name}</span>
                {venueSubtitle ? (
                  <span className="text-sm text-muted-foreground">{venueSubtitle}</span>
                ) : null}
              </div>
            </div>
          ) : (
            <TabEmpty>Estádio não informado.</TabEmpty>
          )}

          {/* Rest days: days since each team's previous match in ANY competition (league OR cup — cups are
              ingested now, so a midweek cup tie correctly shortens the rest). Only national-team/friendlies
              aren't ingested. @feature LIG-005 */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Descanso</span>
              <span
                className="cursor-help text-xs text-muted-foreground underline decoration-dotted"
                title="Dias desde o último jogo do time em qualquer competição (liga ou copa). Jogos de seleção/amistosos não são ingeridos, então pode superestimar em datas FIFA."
              >
                liga + copa
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-4">
              {/* `rest` is always present in the contract; `?? null` only hardens against a stale
                  pre-LIG-005 API payload (renders "estreia" instead of crashing). */}
              <RestSide name={match.home.name} rest={match.rest?.home ?? null} />
              <RestSide name={match.away.name} rest={match.rest?.away ?? null} />
            </div>
          </div>

          {/* Rivalidade whitelist SportMonks: lista outbound de cada lado (sempre), e destaca
              quando o confronto atual também é clássico (isRivalry). @feature SIN-007 */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Rivalidade</span>
              <span
                className="cursor-help text-xs text-muted-foreground underline decoration-dotted"
                title="Rivais ligados ao clube na whitelist (SportMonks ou seed manual), nos dois sentidos. A fonte é assimétrica — por isso unimos quem o clube lista e quem o lista. Não é o Índice 0–1 calibrado."
              >
                whitelist
              </span>
            </div>
            {match.rivalry?.isRivalry ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Este confronto está marcado como clássico/rivalidade
                {(match.rivalry.edges?.length ?? 0) === 1
                  ? " (só um lado lista o outro)."
                  : "."}
              </p>
            ) : null}
            <div className="mt-3 grid grid-cols-2 gap-4">
              <RivalSide name={match.home.name} rivals={match.rivalry?.home ?? []} />
              <RivalSide name={match.away.name} rivals={match.rivalry?.away ?? []} />
            </div>
          </div>

          {/* Quem apita: árbitro principal da partida. O card renderiza SEMPRE — em jogo futuro a
              designação normalmente ainda não saiu, e "ainda não designado" é o estado mais comum
              da página, não uma borda. @feature SIN-009 */}
          <div className="rounded-lg border bg-card p-4">
            <span className="text-xs uppercase tracking-wide text-muted-foreground">Arbitragem</span>
            {match.referee ? (
              <div className="mt-3 flex items-center gap-3">
                {match.referee.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={match.referee.imageUrl}
                    alt=""
                    className="size-10 shrink-0 rounded-full border object-cover"
                  />
                ) : (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border bg-background text-xs text-muted-foreground">
                    {initials(match.referee.name)}
                  </span>
                )}
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{match.referee.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Árbitro principal
                    {match.referee.countryName ? ` · ${match.referee.countryName}` : ""}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Árbitro ainda não designado para esta partida.
              </p>
            )}
          </div>

          {/* Onde assistir: emissoras/streams do jogo (SportMonks tvStations), mais abrangentes primeiro.
              O total de emissoras também é um proxy de visibilidade da partida. @feature W-059 */}
          {match.tvStations?.length ? (
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  Onde assistir
                </span>
                <span className="text-xs text-muted-foreground">
                  {match.tvStations.length} emissoras/streams
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {match.tvStations.slice(0, 12).map((tv) => {
                  const chip = (
                    <span className="flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-xs">
                      {tv.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={tv.imageUrl} alt="" className="size-4 shrink-0 rounded object-contain" />
                      ) : null}
                      {tv.name}
                      {tv.type === "stream" ? (
                        <span className="text-[10px] uppercase text-muted-foreground">stream</span>
                      ) : null}
                    </span>
                  )
                  return tv.url ? (
                    <a
                      key={tv.name}
                      href={tv.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-70"
                    >
                      {chip}
                    </a>
                  ) : (
                    <span key={tv.name}>{chip}</span>
                  )
                })}
                {match.tvStations.length > 12 ? (
                  <span className="self-center text-xs text-muted-foreground">
                    +{match.tvStations.length - 12} outras
                  </span>
                ) : null}
              </div>
            </div>
            ) : null}
          </TabsContent>
        ) : null}

        {tab === "noticias" ? (
          <TabsContent value="noticias" className="pt-2" forceMount>
            <MatchNews id={id} />
          </TabsContent>
        ) : null}

        {tab === "narracao" ? (
          <TabsContent value="narracao" className="pt-2" forceMount>
            <Commentary id={id} />
          </TabsContent>
        ) : null}
      </Tabs>
    </section>
  )
}
