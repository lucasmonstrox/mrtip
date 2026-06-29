import { Badge } from "@workspace/ui/components/badge"
import { Card, CardContent } from "@workspace/ui/components/card"
import { cn } from "@workspace/ui/lib/utils"
import { ArrowLeftRight, Clock, Crosshair, Flag, FlagOff, Hand, Target, TriangleAlert, Tv } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import type { CommentaryItem } from "../../types"
import { useMatchCommentariesQuery } from "../../hooks/data/queries/use-match-commentaries-query"
import { PlayerHoverCard } from "../player-hover-card/player-hover-card"

// Event kind inferred from the (English) commentary text + the is_goal flag. SportMonks has no event
// type on a commentary line, so we classify from keywords — enough to pick an icon and a tone. @feature LIG-010
type EventKind =
  | "goal" | "yellow" | "red" | "sub" | "penalty" | "corner" | "offside" | "save" | "foul" | "var" | "whistle" | "chance" | "plain"

function classify(comment: string, isGoal: boolean, minute: number | null): EventKind {
  const c = comment.toLowerCase()
  // SportMonks' is_goal flag is unreliable (a 3-0 match can flag only 1 of 3 goals), but the text of a
  // goal line always uses the verb "scores"/"scored" — while framing lines say "a score of N-N" (the
  // noun). So a goal is the flag OR the scoring verb. The scoreline/goal truth still lives in the
  // Eventos/Gols tabs (the `goal` table); this is only the narration's visual cue. @feature LIG-010
  if (isGoal || /\bscore[sd]\b/.test(c)) return "goal"
  if (/\bvar\b|video assistant/.test(c)) return "var"
  if (/red card/.test(c)) return "red"
  if (/yellow card|booked|caution/.test(c)) return "yellow"
  if (/penalty/.test(c)) return "penalty"
  if (/substitution|replaced|comes on|comes off|substituted/.test(c)) return "sub"
  if (/saved|save by|denied by|parried/.test(c)) return "save"
  if (/corner/.test(c)) return "corner"
  if (/offside/.test(c)) return "offside"
  if (/free kick|foul|brings down|fouled|handball/.test(c)) return "foul"
  if (/shot|header|attempt|effort|chance|blocked|misses|wide|post|crossbar|woodwork/.test(c)) return "chance"
  if (minute == null) return "whistle"
  return "plain"
}

// Icon + colour tone of the badge per event kind. Goals and cards use the same emoji language as the
// Eventos tab; the rest use lucide glyphs. Neutral tone keeps the timeline calm; only the meaningful
// events get colour.
const ICON: Record<EventKind, ReactNode> = {
  goal: <span aria-hidden>⚽</span>,
  yellow: <span aria-hidden className="block h-3 w-2.5 rounded-[2px] bg-yellow-400" />,
  red: <span aria-hidden className="block h-3 w-2.5 rounded-[2px] bg-red-500" />,
  sub: <ArrowLeftRight className="size-3.5" />,
  penalty: <Target className="size-3.5" />,
  corner: <Flag className="size-3.5" />,
  offside: <FlagOff className="size-3.5" />,
  save: <Hand className="size-3.5" />,
  foul: <TriangleAlert className="size-3.5" />,
  var: <Tv className="size-3.5" />,
  whistle: <Clock className="size-3.5" />,
  chance: <Crosshair className="size-3.5" />,
  plain: <span aria-hidden className="size-1.5 rounded-full bg-muted-foreground/40" />,
}

const TONE: Partial<Record<EventKind, string>> = {
  goal: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
  red: "bg-red-500/10 ring-red-500/30",
  yellow: "bg-yellow-400/10 ring-yellow-500/30",
  penalty: "bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/30",
  sub: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/25",
}

function minuteLabel(minute: number | null, extra: number | null): string {
  if (minute == null) return ""
  return extra ? `${minute}+${extra}'` : `${minute}'`
}

// One line of the play-by-play: icon rail + minute + optional player avatar (links to the profile,
// rich hover card) + the comment text. Goals get an emphasized row. `kind` is computed by the parent
// (so duplicate goal lines for the same minute can be de-emphasized).
function Line({ c, kind }: { c: CommentaryItem; kind: EventKind }) {
  const isGoalLine = kind === "goal"
  const framing = c.minute == null && !c.isImportant && !isGoalLine
  const p = c.player

  return (
    <li
      className={cn(
        "flex items-start gap-3 rounded-lg px-2 py-2",
        isGoalLine && "bg-emerald-500/10",
        framing && "opacity-70",
      )}
    >
      {/* icon rail */}
      <span
        className={cn(
          "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-sm ring-1 ring-border",
          TONE[kind] ?? "bg-muted text-muted-foreground",
        )}
      >
        {ICON[kind]}
      </span>

      {/* minute */}
      <span className="mt-1 w-9 shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
        {minuteLabel(c.minute, c.extraMinute)}
      </span>

      {/* player avatar (when the line names one) */}
      {p ? (
        <PlayerHoverCard id={p.id}>
          <Link href={`/players/${p.id}`} className="mt-0.5 shrink-0">
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.imageUrl}
                alt={p.name}
                className="size-7 rounded-full object-cover ring-1 ring-border transition hover:ring-foreground/40"
              />
            ) : (
              <span className="flex size-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground ring-1 ring-border">
                {p.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
              </span>
            )}
          </Link>
        </PlayerHoverCard>
      ) : null}

      {/* comment */}
      <p className={cn("flex-1 pt-1 text-sm leading-snug", (isGoalLine || c.isImportant) && "font-medium")}>
        {c.comment}
      </p>
    </li>
  )
}

// Play-by-play narration tab: the full SportMonks commentary feed, chronological, with an event icon
// per line, the involved player's photo (hover card → season snapshot, link → profile) and emphasis on
// goals/important moments. Self-fetches by match id; renders its own loading/empty states. Comment text
// stays in English (source data). @feature LIG-010
export function Commentary({ id }: { id: string }) {
  const { data, isPending, isError } = useMatchCommentariesQuery(id)

  if (isPending) return <p className="text-sm text-muted-foreground">Carregando narração…</p>
  if (isError)
    return <p className="text-sm text-destructive">Não foi possível carregar a narração.</p>
  if (!data || !data.length)
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        Sem narração para esta partida.
      </div>
    )

  // NB: we don't surface a goal count here — SportMonks' is_goal flag on commentary is incomplete
  // (a 3-0 match can flag only 1 goal). The authoritative scoreline/goals live in the Eventos/Gols
  // tabs (the `goal` table). The narration is a story, not the source of truth. @feature LIG-010
  const highlights = data.filter((c) => c.isImportant).length

  // SportMonks emits TWO lines for one goal: an ANNOUNCEMENT ("Goal! X scores to make it 1-0",
  // is_goal=true) plus a descriptive companion ("X scores with a header", is_goal=false) — both at the
  // same minute. That double-highlights the goal (e.g. min 67). Dedup WITHOUT merging two real goals in
  // the same minute (which each get their own "Goal!" announcement): a "scores" line is downgraded to a
  // plain line only when it is NOT itself an announcement AND an announcement already exists for that
  // minute. Two announced goals in the same minute therefore both stay goals. @feature LIG-010
  const isAnnouncement = (c: CommentaryItem) => c.isGoal || /^goal[!\s]/i.test(c.comment.trim())
  const announcedGoalMinutes = new Set<number>()
  for (const c of data) if (isAnnouncement(c) && c.minute != null) announcedGoalMinutes.add(c.minute)

  const lines = data.map((c) => {
    let kind = classify(c.comment, c.isGoal, c.minute)
    if (kind === "goal" && !isAnnouncement(c) && c.minute != null && announcedGoalMinutes.has(c.minute)) {
      kind = "plain" // descriptive companion of an already-announced goal at this minute
    }
    return { c, kind }
  })

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="font-normal">{data.length} lances</Badge>
          {highlights > 0 ? <Badge variant="secondary" className="font-normal">{highlights} destaques</Badge> : null}
        </div>
        <ol className="flex flex-col gap-0.5">
          {lines.map(({ c, kind }, i) => (
            <Line key={i} c={c} kind={kind} />
          ))}
        </ol>
      </CardContent>
    </Card>
  )
}
