// poisson, over 2.5, gols, probabilidade, lambda, xg combinado, total, mercado, under
export function calcA2(xgMandante: number, xgVisitante: number): number {
  const lambda = xgMandante + xgVisitante
  const acumuladoAteDois =
    Math.exp(-lambda) * (1 + lambda + (lambda * lambda) / 2)
  return 1 - acumuladoAteDois
}
