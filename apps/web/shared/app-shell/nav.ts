import {
  FileSearchIcon,
  LineChartIcon,
  ListOrderedIcon,
  type LucideIcon,
  SettingsIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TrophyIcon,
  UserCircleIcon,
} from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
}

export interface NavSection {
  label?: string
  items: NavItem[]
}

/**
 * Navegação do shell. As superfícies vêm do design system (§2): os 3 destinos
 * canônicos de produto — Hub da Rodada · Dossiê · Histórico/CLV — mais conta e
 * conformidade. Por ora todas as páginas são placeholders (stub TODO).
 *
 * ┌─ DECISÃO DE NAVEGAÇÃO — ajuste aqui ──────────────────────────────────────
 * │ Versão "rica" (7 itens) abaixo, com os 3 canônicos no topo. Para o rail
 * │ ENXUTO do design system, mantenha só a 1ª seção (Hub · Dossiê · Histórico)
 * │ e mova Assistente/Jogo Responsável/Conta/Configurações para a topbar.
 * │ Admin é um shell separado (§2.4) — fora do rail por ora.
 * └───────────────────────────────────────────────────────────────────────────
 */
export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ title: "Hub da Rodada", href: "/", icon: TrophyIcon }],
  },
  {
    label: "Análise",
    items: [
      { title: "Dossiê do Jogo", href: "/jogo", icon: FileSearchIcon },
      { title: "Ligas", href: "/ligas", icon: ListOrderedIcon },
      { title: "Histórico · CLV", href: "/historico", icon: LineChartIcon },
    ],
  },
  {
    label: "Assistente",
    items: [{ title: "Assistente", href: "/assistente", icon: SparklesIcon }],
  },
  {
    label: "Sistema",
    items: [
      { title: "Jogo Responsável", href: "/jogo-responsavel", icon: ShieldCheckIcon },
      { title: "Conta", href: "/conta", icon: UserCircleIcon },
      { title: "Configurações", href: "/configuracoes", icon: SettingsIcon },
    ],
  },
  // TODO(admin): shell separado — operadores licenciados, conformidade, ingestão.
  // TODO(fase 2/3): perfil público de tipster, feed/seguir, marketplace, alertas.
]

/** Título da página atual, para breadcrumb/header. */
export function titleForPath(pathname: string): string {
  const items = NAV_SECTIONS.flatMap((section) => section.items)
  const exact = items.find((item) => item.href === pathname)
  if (exact) return exact.title
  const prefix = items.find(
    (item) => item.href !== "/" && pathname.startsWith(`${item.href}/`)
  )
  return prefix?.title ?? "mrtip"
}
