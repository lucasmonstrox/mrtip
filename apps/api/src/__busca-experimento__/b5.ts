/**
 * Estima quanto o total de gols esperado de um time cai quando o seu artilheiro
 * esta ausente por lesao ou suspensao. A ideia: um jogador que participa de uma
 * fatia grande dos gols do time deixa um buraco maior ao faltar. O ajuste pondera
 * a "participacao" do ausente (gols dele sobre gols do time) e atenua o impacto
 * pela metade quando existe um substituto de nivel equivalente no elenco — porque
 * um elenco profundo absorve melhor a baixa. E um dos ajustes de maior valor para
 * prever se a partida tera menos gols (under) do que a media.
 */
export function calcB5(
  golsDoTime: number,
  golsDoAusente: number,
  temSubstitutoEquivalente: boolean,
): number {
  const participacao = golsDoAusente / golsDoTime
  const atenuacao = temSubstitutoEquivalente ? 0.5 : 1
  return golsDoTime * (1 - participacao * 0.3 * atenuacao)
}
