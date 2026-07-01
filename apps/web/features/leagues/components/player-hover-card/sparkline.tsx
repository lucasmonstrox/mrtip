import { ratingColor } from "../../utils/format"

/**
 * Tiny SVG sparkline of a player's recent form: a line of match ratings in chronological order
 * (oldest → newest), the last rated point dotted and coloured by the same rating scale as the rest of
 * the app (≥7.5 green · ≥6.5 neutral · <6.5 red). `null` entries are games he didn't play — the line
 * breaks across them (a gap, not a fabricated dip), with a faint dotted marker so the absence is
 * visible. The vertical scale is relative to the rated values (min→max), so it reads trend/shape, not
 * absolute height — the numeric average anchors it alongside.
 */
export function Sparkline({
  values,
  width = 116,
  height = 26,
}: {
  values: (number | null)[]
  width?: number
  height?: number
}) {
  const rated = values.filter((v): v is number => v != null)
  if (rated.length < 2) return null

  const min = Math.min(...rated)
  const max = Math.max(...rated)
  const span = max - min || 1 // flat line guard (all ratings equal)
  const pad = 3
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  const x = (i: number) => pad + (i / (values.length - 1)) * innerW
  const y = (v: number) => pad + (1 - (v - min) / span) * innerH

  // Project to numeric points; null entries (didn't play) become null so we can break the line on them.
  const points = values.map((v, i) => (v == null ? null : { x: x(i), y: y(v), v }))

  // Split into continuous runs of played games so the polyline doesn't bridge a missed match.
  const segments: { x: number; y: number }[][] = []
  let run: { x: number; y: number }[] = []
  for (const p of points) {
    if (p == null) {
      if (run.length) segments.push(run)
      run = []
      continue
    }
    run.push(p)
  }
  if (run.length) segments.push(run)

  // Last rated game — the coloured dot that anchors the current form.
  const last = points.reduce<{ x: number; y: number; v: number } | null>((acc, p) => p ?? acc, null)!

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden
    >
      {segments.map((seg, i) =>
        seg.length === 1 ? (
          // A lone rated game between two absences: no line to draw, just mark the point.
          <circle key={i} cx={seg[0]!.x} cy={seg[0]!.y} r={1.6} className="fill-muted-foreground/60" />
        ) : (
          <polyline
            key={i}
            points={seg.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground/60"
          />
        ),
      )}
      {/* Faint dotted markers on the baseline where he didn't play. */}
      {values.map((v, i) =>
        v == null ? (
          <circle key={`gap-${i}`} cx={x(i)} cy={height / 2} r={1} className="fill-muted-foreground/30" />
        ) : null,
      )}
      <circle cx={last.x} cy={last.y} r={2.5} fill="currentColor" className={ratingColor(last.v)} />
    </svg>
  )
}
