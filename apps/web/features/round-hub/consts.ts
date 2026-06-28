import type { Confidence, FormResult } from "./types"

export const LEAGUE_NAME = "Premier League"
export const SEASON = "2025/26"

/** Cor por resultado de forma: vitória (verde), empate (cinza), derrota (vermelho). */
export const FORM_COLOR: Record<FormResult, string> = {
  W: "bg-emerald-500",
  D: "bg-zinc-500",
  L: "bg-red-500",
}
export const FORM_LABEL: Record<FormResult, string> = { W: "V", D: "E", L: "D" }

/** Selo de confiança — texto + cor (cor nunca comunica sozinha: sempre acompanha o rótulo). */
export const CONFIDENCE_STYLE: Record<Confidence, string> = {
  alta: "border-emerald-500/40 text-emerald-600 dark:text-emerald-400",
  média: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  baixa: "border-zinc-500/40 text-muted-foreground",
}

/** Limiar abaixo do qual marcamos descanso curto (fadiga) em âmbar. */
export const SHORT_REST_DAYS = 4
