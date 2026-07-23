import { CalendarDays, GitMerge, Goal, ListOrdered, type LucideIcon } from "lucide-react"

// Segmentos de URL das abas da página da liga (`/leagues/[code]/[tab]`). Ordem = ordem na barra.
// Liga e copa compartilham o validador server-side; o client escolhe o subset pelo `league.type`.
// @feature LIG-025
export const LEAGUE_PAGE_TAB_VALUES = [
  "classificacao",
  "rodadas",
  "marcadores",
  "chaveamento",
] as const

export type LeaguePageTabValue = (typeof LEAGUE_PAGE_TAB_VALUES)[number]

export const LEAGUE_TAB_VALUES = ["classificacao", "rodadas", "marcadores"] as const
export type LeagueTabValue = (typeof LEAGUE_TAB_VALUES)[number]

export const CUP_TAB_VALUES = ["chaveamento", "marcadores"] as const
export type CupTabValue = (typeof CUP_TAB_VALUES)[number]

export const DEFAULT_LEAGUE_TAB: LeagueTabValue = "classificacao"
export const DEFAULT_CUP_TAB: CupTabValue = "chaveamento"

export function isLeaguePageTabValue(value: string): value is LeaguePageTabValue {
  return (LEAGUE_PAGE_TAB_VALUES as readonly string[]).includes(value)
}

export function defaultTabForType(type: "league" | "cup"): LeaguePageTabValue {
  return type === "cup" ? DEFAULT_CUP_TAB : DEFAULT_LEAGUE_TAB
}

export function isTabValidForType(
  tab: LeaguePageTabValue,
  type: "league" | "cup",
): boolean {
  if (type === "cup") return (CUP_TAB_VALUES as readonly string[]).includes(tab)
  return (LEAGUE_TAB_VALUES as readonly string[]).includes(tab)
}

type LeaguePageTab = {
  value: LeaguePageTabValue
  label: string
  icon: LucideIcon
}

// Ícones do vernáculo: Classificação = lista ordenada; Rodadas = calendário; Marcadores = gols;
// Chaveamento = mata-mata que converge (GitMerge). Mesma linguagem da barra da partida.
export const LEAGUE_TABS: readonly LeaguePageTab[] = [
  { value: "classificacao", label: "Classificação", icon: ListOrdered },
  { value: "rodadas", label: "Rodadas", icon: CalendarDays },
  { value: "marcadores", label: "Marcadores", icon: Goal },
]

export const CUP_TABS: readonly LeaguePageTab[] = [
  { value: "chaveamento", label: "Chaveamento", icon: GitMerge },
  { value: "marcadores", label: "Marcadores", icon: Goal },
]
