export function calcB1(
  golsDoTime: number,
  golsDoAusente: number,
  temSubstitutoEquivalente: boolean,
): number {
  const participacao = golsDoAusente / golsDoTime
  const atenuacao = temSubstitutoEquivalente ? 0.5 : 1
  return golsDoTime * (1 - participacao * 0.3 * atenuacao)
}
