// Deriva o papel tático POR JOGO (goleiro, lateral, ala, zagueiro, volante, meia central,
// ponta, meia-atacante, centroavante) a partir de formation + grid do lineup_player,
// espelhando a coluna por mando — verificado no banco: MANDANTE col 1 = direita (Porro/RB
// é 2:1 em casa e 2:4 fora); VISITANTE col 1 = esquerda. A SportMonks removeu o
// detailed_position_id da entidade Lineup; o papel por jogo nasce daqui.
export function roleFromGrid(formation: string | null, grid: string | null, isHome: boolean): string | null {
  if (!grid || !formation) return null
  const [ln, col] = grid.split(":").map(Number)
  if (!ln || !col) return null
  if (ln === 1) return "goleiro"
  const parts = formation.split("-").map(Number).filter(Number.isFinite)
  const n = parts[ln - 2]
  if (!n || col > n) return null
  // normaliza a coluna pra esquerda→direita (o grid do mandante vem direita→esquerda)
  const c = isHome ? n - col + 1 : col
  const esq = c === 1, dir = c === n
  const flanco = n >= 3 && (esq || dir)
  const isLast = ln === parts.length + 1
  const midLines = parts.length - 2
  const midIdx = ln - 3

  if (ln === 2) {
    if (n >= 5) return flanco ? (esq ? "ala-esquerdo" : "ala-direito") : "zagueiro"
    if (n === 4) return esq ? "lateral-esquerdo" : dir ? "lateral-direito" : "zagueiro"
    return "zagueiro"
  }
  if (isLast) {
    if (n === 1) return "centroavante"
    if (n === 2) return "atacante"
    return flanco ? (esq ? "ponta-esquerda" : "ponta-direita") : "centroavante"
  }
  // linhas de meio
  const lastMid = midLines > 1 && midIdx === midLines - 1
  if (lastMid) return n >= 3 && flanco ? (esq ? "ponta-esquerda" : "ponta-direita") : "meia-atacante"
  if (midIdx > 0) return "meia central" // linha intermediária (losango: os interiores)
  // primeira (ou única) linha de meio
  if (n >= 5) return flanco ? (esq ? "ala-esquerdo" : "ala-direito") : c === Math.ceil(n / 2) ? "volante" : "meia central"
  if (n === 4) return flanco ? (esq ? "meia pela esquerda" : "meia pela direita") : "volante"
  if (n === 3) return c === 2 ? "volante" : "meia central"
  return "volante"
}
