import { and, eq, inArray, isNotNull } from "drizzle-orm"

import { af } from "../lib/api-football"
import { db } from "./client"
import { gol, jogador, partida, time } from "./schema"

/**
 * Backfill de gols (autor, assistência, autogolo, minuto) via /fixtures/events — 1 request por
 * jogo. RETOMÁVEL: processa só partidas com `gols_importados = false`, até LINEUPS_BUDGET por
 * execução; marca a partida como importada no fim (mesmo com 0 gols). Throttle + retry no rate limit.
 *
 * Uso: bun run src/db/seed-gols.ts   (orçamento via GOLS_BUDGET, default 80)
 */
const BUDGET = Number(process.env.GOLS_BUDGET ?? 80)
const THROTTLE_MS = Number(process.env.GOLS_THROTTLE_MS ?? 7000)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

type Evento = {
  type: string
  detail: string
  time: { elapsed: number | null; extra: number | null }
  team: { id: number }
  player: { id: number | null; name: string | null }
  assist: { id: number | null; name: string | null }
}

const TIPO: Record<string, "normal" | "penalti" | "contra"> = {
  "Normal Goal": "normal",
  Penalty: "penalti",
  "Own Goal": "contra",
}

async function buscaEventos(fixtureId: number): Promise<Evento[]> {
  for (let tentativa = 0; ; tentativa++) {
    try {
      return await af<Evento[]>(`/fixtures/events?fixture=${fixtureId}`)
    } catch (e) {
      const msg = String(e)
      if ((msg.includes("rateLimit") || msg.includes("Too many requests")) && tentativa < 3) {
        console.log("    rate limit — aguardando 65s...")
        await sleep(65000)
        continue
      }
      throw e
    }
  }
}

const timeRows = await db.select({ id: time.id, api: time.apiFootballTeamId }).from(time)
const idDoTime = new Map(timeRows.map((t) => [t.api, t.id]))

const pendentes = await db
  .select({
    id: partida.id,
    fixtureId: partida.apiFootballFixtureId,
    mandanteId: partida.mandanteId,
    visitanteId: partida.visitanteId,
  })
  .from(partida)
  .where(and(isNotNull(partida.placarFtMandante), eq(partida.golsImportados, false)))
  .limit(BUDGET)

console.log(`Partidas pendentes de gols: processando ${pendentes.length} (budget ${BUDGET})\n`)

let totalGols = 0
for (const [i, p] of pendentes.entries()) {
  if (i > 0) await sleep(THROTTLE_MS)
  const eventos = await buscaEventos(p.fixtureId)
  const golsEvt = eventos.filter((e) => e.type === "Goal" && TIPO[e.detail])

  // Upsert dos jogadores citados (autores + assistências).
  const players = [
    ...new Map(
      golsEvt
        .flatMap((e) => [e.player, e.assist])
        .filter((pl) => pl?.id != null)
        .map((pl) => [pl.id!, pl.name ?? "?"]),
    ).entries(),
  ]
  if (players.length) {
    await db
      .insert(jogador)
      .values(players.map(([apiFootballPlayerId, nome]) => ({ apiFootballPlayerId, nome })))
      .onConflictDoNothing({ target: jogador.apiFootballPlayerId })
  }
  const jrows = players.length
    ? await db
        .select({ id: jogador.id, api: jogador.apiFootballPlayerId })
        .from(jogador)
        .where(inArray(jogador.apiFootballPlayerId, players.map(([id]) => id)))
    : []
  const idDoJogador = new Map(jrows.map((r) => [r.api, r.id]))

  const linhas = golsEvt.flatMap((e) => {
    const tipo = TIPO[e.detail]!
    const autorId = e.player.id != null ? idDoJogador.get(e.player.id) : undefined
    const timeMarcou = idDoTime.get(e.team.id)
    if (!autorId || !timeMarcou) return []
    // Autogolo: o gol conta pro ADVERSÁRIO do time do autor.
    const timeId = tipo === "contra" ? (timeMarcou === p.mandanteId ? p.visitanteId : p.mandanteId) : timeMarcou
    const assistenteId = e.assist.id != null ? (idDoJogador.get(e.assist.id) ?? null) : null
    return [
      {
        partidaId: p.id,
        timeId,
        jogadorId: autorId,
        assistenteId,
        minuto: e.time.elapsed,
        tipo,
      },
    ]
  })

  // Re-importação limpa (caso rode após crash): zera os gols da partida antes de inserir.
  await db.delete(gol).where(eq(gol.partidaId, p.id))
  if (linhas.length) await db.insert(gol).values(linhas)
  await db.update(partida).set({ golsImportados: true }).where(eq(partida.id, p.id))
  totalGols += linhas.length
}

console.log(`\n✅ gols: ${pendentes.length} partidas processadas, ${totalGols} gols inseridos.`)
process.exit(0)
