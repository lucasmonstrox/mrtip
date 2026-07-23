import {
  Activity,
  BarChart3,
  ClipboardList,
  Clock,
  type LucideIcon,
  Newspaper,
  Radio,
  Shirt,
  Swords,
  Target,
  TrendingUp,
} from "lucide-react"

// Segmentos de URL das abas do dossiê (`/matches/[slug]/[tab]`). Ordem = ordem na barra.
// @feature LIG-024
export const MATCH_TAB_VALUES = [
  "fatos",
  "escalacao",
  "h2h",
  "gols",
  "noticias",
  "prognostico",
  "momentum",
  "estatisticas",
  "eventos",
  "narracao",
] as const

export type MatchTabValue = (typeof MATCH_TAB_VALUES)[number]

export const DEFAULT_MATCH_TAB: MatchTabValue = "fatos"

export function isMatchTabValue(value: string): value is MatchTabValue {
  return (MATCH_TAB_VALUES as readonly string[]).includes(value)
}

// Ícones do vernáculo do futebol (não dashboard genérico). `primary` = tese do produto.
type MatchTab = { value: MatchTabValue; label: string; icon: LucideIcon; primary?: boolean }

export const MATCH_TABS: readonly MatchTab[] = [
  { value: "fatos", label: "Fatos", icon: ClipboardList },
  { value: "escalacao", label: "Escalação", icon: Shirt },
  { value: "h2h", label: "H2H", icon: Swords },
  { value: "gols", label: "Gols (xG)", icon: Target },
  { value: "noticias", label: "Notícias", icon: Newspaper },
  { value: "prognostico", label: "Prognóstico", icon: TrendingUp, primary: true },
  { value: "momentum", label: "Momentum", icon: Activity },
  { value: "estatisticas", label: "Estatísticas", icon: BarChart3 },
  { value: "eventos", label: "Eventos", icon: Clock },
  { value: "narracao", label: "Narração", icon: Radio },
]
