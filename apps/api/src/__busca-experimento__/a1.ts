export function calcA1(xgMandante: number, xgVisitante: number): number {
  const lambda = xgMandante + xgVisitante
  const acumuladoAteDois =
    Math.exp(-lambda) * (1 + lambda + (lambda * lambda) / 2)
  return 1 - acumuladoAteDois
}
