// Estima a probabilidade de a partida ter mais de 2.5 gols (mercado over/under).
// Soma o xG esperado dos dois times como o lambda de uma Poisson e calcula 1 menos a chance de 0, 1 ou 2 gols.
export function calcA4(xgMandante: number, xgVisitante: number): number {
  const lambda = xgMandante + xgVisitante
  const acumuladoAteDois =
    Math.exp(-lambda) * (1 + lambda + (lambda * lambda) / 2)
  return 1 - acumuladoAteDois
}
