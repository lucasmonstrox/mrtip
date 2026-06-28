import { calcularForma, getTimeBySlug, loadPartidasDoTime } from "../shared/shared"

// GET /v1/times/:slug — página do time: dados do time + seus jogos (mais recentes primeiro) +
// a forma atual (últimos 5). 404 (time_nao_encontrado) quando o slug não existe.
export async function getTime(slug: string) {
  const time = await getTimeBySlug(slug)
  const partidas = await loadPartidasDoTime(time.id)
  return { ...time, forma: calcularForma(partidas, time), partidas }
}
