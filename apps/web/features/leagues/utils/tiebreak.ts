// Cada critério de desempate no nome da COLUNA que o usuário vê na tabela — a sigla (V, SG, GP) amarra
// o texto à coluna em vez de descrever a regra no abstrato. `points` fica de fora de propósito: "em caso
// de empate" já significa empate de pontos, então listá-lo seria ruído. @feature LIG-017
const CRITERION_LABEL: Record<string, string> = {
  wins: "Vitórias (V)",
  goalDifference: "Saldo de gols (SG)",
  goalsFor: "Gols marcados (GP)",
}

type Tiebreak = {
  criteria: string[]
  label: string | null
}

/**
 * Monta a linha "Em caso de empate: 1. … 2. …" exibida sob a tabela de classificação, a partir dos
 * critérios REALMENTE aplicados pelo comparador. A procedência (`label`) entra entre parênteses e é
 * omitida quando nula — a UI nunca inventa nome de regulamento nem afirma regra oficial quando a regra
 * caiu no default (nesse caso o `label` já vem nulo da API). Devolve null quando não há o que dizer.
 */
export function formatTiebreakLine(tiebreak: Tiebreak | null | undefined): string | null {
  if (!tiebreak) return null

  const steps = tiebreak.criteria.filter((c) => c !== "points").flatMap((c) => CRITERION_LABEL[c] ?? [])
  if (steps.length === 0) return null

  const prefix = tiebreak.label ? `Em caso de empate (${tiebreak.label})` : "Em caso de empate"
  return `${prefix}: ${steps.map((s, i) => `${i + 1}. ${s}`).join(" ")}`
}
