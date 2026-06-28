import { eq, inArray } from "drizzle-orm"

import { af } from "../lib/api-football"
import { CATALOGO } from "../modules/ligas/consts"
import { db } from "./client"
import { jogador, lesao, partida, time } from "./schema"

/**
 * Backfill de desfalques (lesões/suspensões) da API-Football. `/injuries?league=&season=` traz
 * a temporada inteira em 1 request — barato. Por liga: clear + insert (idempotente).
 * `type` = "Missing Fixture" (não jogou) ou "Questionable" (dúvida); `reason` = motivo.
 *
 * Precisa de API_FOOTBALL_KEY no .env.
 */
type InjuryRec = {
  player: { id: number | null; name: string; type: string; reason: string | null }
  team: { id: number }
  fixture: { id: number }
}

for (const meta of CATALOGO) {
  const recs = await af<InjuryRec[]>(`/injuries?league=${meta.leagueId}&season=${meta.season}`)
  console.log(`${meta.code} (${meta.temporada}): ${recs.length} registros de desfalque`)

  // Mapas fixture→partida, apiTeam→time.
  const partidas = await db
    .select({ id: partida.id, fx: partida.apiFootballFixtureId })
    .from(partida)
    .where(eq(partida.ligaCode, meta.code))
  const idDaPartida = new Map(partidas.map((p) => [p.fx, p.id]))
  const times = await db.select({ id: time.id, api: time.apiFootballTeamId }).from(time)
  const idDoTime = new Map(times.map((t) => [t.api, t.id]))

  // Upsert jogadores citados nos desfalques (muitos não estão nos lineups que já temos).
  const players = [
    ...new Map(recs.filter((r) => r.player.id != null).map((r) => [r.player.id!, r.player.name])).entries(),
  ]
  if (players.length) {
    await db
      .insert(jogador)
      .values(players.map(([apiFootballPlayerId, nome]) => ({ apiFootballPlayerId, nome })))
      .onConflictDoNothing({ target: jogador.apiFootballPlayerId })
  }
  const jrows = await db
    .select({ id: jogador.id, api: jogador.apiFootballPlayerId })
    .from(jogador)
    .where(inArray(jogador.apiFootballPlayerId, players.map(([id]) => id)))
  const idDoJogador = new Map(jrows.map((r) => [r.api, r.id]))

  // Clear + insert dos desfalques da liga.
  const partidaIds = partidas.map((p) => p.id)
  if (partidaIds.length) await db.delete(lesao).where(inArray(lesao.partidaId, partidaIds))

  const seen = new Set<string>()
  const linhas = recs.flatMap((r) => {
    const partidaId = idDaPartida.get(r.fixture.id)
    const timeId = idDoTime.get(r.team.id)
    const jogadorId = r.player.id != null ? idDoJogador.get(r.player.id) : undefined
    if (!partidaId || !timeId || !jogadorId) return []
    const k = `${partidaId}|${jogadorId}` // dedup por (partida, jogador)
    if (seen.has(k)) return []
    seen.add(k)
    return [{ partidaId, timeId, jogadorId, tipo: r.player.type, motivo: r.player.reason }]
  })

  for (let i = 0; i < linhas.length; i += 500) {
    await db.insert(lesao).values(linhas.slice(i, i + 500)).onConflictDoNothing()
  }
  console.log(`  ${linhas.length} desfalques inseridos`)
}

console.log("\n✅ desfalques concluídos")
process.exit(0)
