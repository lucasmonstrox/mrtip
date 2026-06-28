import {
  BellIcon,
  FileSearchIcon,
  LineChartIcon,
  type LucideIcon,
  TrophyIcon,
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
 * │ e mova Assistente/Conta/Configurações para a topbar.
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
      { title: "Histórico · CLV", href: "/historico", icon: LineChartIcon },
    ],
  },
  {
    label: "Sistema",
    items: [{ title: "Alertas", href: "/alertas", icon: BellIcon }],
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
  if (prefix) return prefix.title
  // Ligas vivem numa seção dinâmica fora do NAV_SECTIONS (uma liga por item).
  if (pathname.startsWith("/leagues/")) return "Ligas"
  return "mrtip"
}
