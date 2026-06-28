// Reduz o total de gols esperado do time quando o seu principal goleador esta fora (lesao ou suspensao).
// O desconto e proporcional a participacao do ausente nos gols e e atenuado se houver um substituto de nivel equivalente.
export function calcB4(
  golsDoTime: number,
  golsDoAusente: number,
  temSubstitutoEquivalente: boolean,
): number {
  const participacao = golsDoAusente / golsDoTime
  const atenuacao = temSubstitutoEquivalente ? 0.5 : 1
  return golsDoTime * (1 - participacao * 0.3 * atenuacao)
}
