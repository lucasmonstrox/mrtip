import { ratingColor } from "../../utils/format"

/**
 * Tiny SVG sparkline of a player's recent form: a line of match ratings in chronological order
 * (oldest → newest), the last point dotted and coloured by the same rating scale as the rest of the
 * app (≥7.5 green · ≥6.5 neutral · <6.5 red). The vertical scale is relative to the values shown
 * (min→max), so it reads trend/shape, not absolute height — the numeric average anchors it alongside.
 */
export function Sparkline({
  values,
  width = 116,
  height = 26,
}: {
  values: number[]
  width?: number
  height?: number
}) {
  if (values.length < 2) return null

  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1 // flat line guard (all ratings equal)
  const pad = 3
  const innerW = width - pad * 2
  const innerH = height - pad * 2

  const x = (i: number) => pad + (i / (values.length - 1)) * innerW
  const y = (v: number) => pad + (1 - (v - min) / span) * innerH

  const points = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ")
  const lastIdx = values.length - 1
  const last = values[lastIdx]!

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground/60"
      />
      <circle cx={x(lastIdx)} cy={y(last)} r={2.5} fill="currentColor" className={ratingColor(last)} />
    </svg>
  )
}
