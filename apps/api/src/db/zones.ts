/**
 * Traduz a zona de classificação da SportMonks (`standing.rule.type.developer_name`) para a chave
 * curta que a UI usa para colorir a linha da tabela — Libertadores, Sudamericana, rebaixamento — ou
 * `null` para meio de tabela sem zona. Fonte única: liga e temporada antiga consomem daqui. @feature LIG-012
 */

// Ordem IMPORTA: `CONMEBOL_LIBERTADORES` é prefixo de `CONMEBOL_LIBERTADORES_QUALIFIERS`, então a
// pré-Libertadores (fase classificatória, zona distinta na tabela) tem de ser testada ANTES.
export function normalizeZone(dev?: string): string | null {
  if (!dev) return null
  if (dev.includes("CONMEBOL_LIBERTADORES_QUALIFIERS")) return "libertadores-qualifiers"
  if (dev.includes("CONMEBOL_LIBERTADORES")) return "libertadores"
  if (dev.includes("CONMEBOL_SUDAMERICANA")) return "sudamericana"
  if (dev.includes("CHAMPIONS")) return "champions"
  if (dev.includes("EUROPA")) return "europa"
  if (dev.includes("CONFERENCE")) return "conference"
  if (dev.includes("RELEGATION")) return "relegation"
  return null
}
