import type { ValueBet } from "../types"

/** Proporção 0..1 → "58%". */
export const pct = (v: number) => `${Math.round(v * 100)}%`

/** Proporção 0..1 → pontos percentuais com sinal, ex.: +7 p.p. */
export const ppGap = (a: number, b: number) => {
  const d = Math.round((a - b) * 100)
  return `${d >= 0 ? "+" : ""}${d} p.p.`
}

/** Odd decimal → "1.95" (ponto, padrão odds pt-BR conforme design system). */
export const fmtOdd = (o: number) => o.toFixed(2)

/** EV em fração → "+6.2%" / "−2.1%" (vírgula decimal, percentual pt-BR). */
export const fmtEv = (ev: number) => {
  const v = (ev * 100).toFixed(1).replace(".", ",")
  return `${ev >= 0 ? "+" : ""}${v}%`
}

/** EV esperado de uma value bet = prob do modelo × odd ofertada − 1. */
export const evOf = (v: ValueBet) => v.modelProb * v.offeredOdd - 1

/** Odd justa segundo o modelo = 1 / prob. */
export const fairOddOf = (v: ValueBet) => 1 / v.modelProb

/**
 * Stake sugerido como fração do bankroll: Kelly fracionado (¼ por padrão — nunca full Kelly).
 * f* = (p·b − q)/b, com b = odd − 1; retornamos f* × fração, piso em 0.
 */
export const kellyStake = (v: ValueBet, fraction = 0.25) => {
  const b = v.offeredOdd - 1
  const f = (v.modelProb * v.offeredOdd - 1) / b
  return Math.max(0, f * fraction)
}
