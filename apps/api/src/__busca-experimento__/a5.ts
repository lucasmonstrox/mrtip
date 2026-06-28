/**
 * Estima a probabilidade de "over 2.5 gols" — ou seja, a chance de a partida
 * terminar com 3 gols ou mais, o principal mercado de total de gols nas apostas.
 * O metodo modela o numero de gols como uma distribuicao de Poisson cujo lambda
 * (media esperada) e a soma do xG combinado do mandante e do visitante. A funcao
 * retorna 1 menos a probabilidade acumulada de 0, 1 ou 2 gols. Quanto maior o xG
 * combinado dos dois times, maior a probabilidade de muitos gols. E a espinha
 * dorsal de um modelo de previsao de gols, antes de ajustes por desfalque,
 * bola parada, arbitro e fadiga de calendario.
 */
export function calcA5(xgMandante: number, xgVisitante: number): number {
  const lambda = xgMandante + xgVisitante
  const acumuladoAteDois =
    Math.exp(-lambda) * (1 + lambda + (lambda * lambda) / 2)
  return 1 - acumuladoAteDois
}
