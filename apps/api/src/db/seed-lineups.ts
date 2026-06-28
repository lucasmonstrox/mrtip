import { desc, inArray, isNotNull } from "drizzle-orm"

import { af } from "../lib/api-football"
import { db } from "./client"
import { escalacao, escalacaoJogador, jogador, partida, time } from "./schema"

/**
 * Backfill de escalações (lineups) da API-Football — 1 request por jogo (endpoint /fixtures/lineups).
 * RETOMÁVEL: pula partidas que já têm escalação, e processa no máximo LINEUPS_BUDGET por execução
 * (plano Free = 100 req/dia). Rode várias vezes (em dias diferentes) pra completar a temporada.
 *
 * Uso: bun run src/db/seed-lineups.ts   (orçamento via LINEUPS_BUDGET, default 80)
 */
const BUDGET = Number(process.env.LINEUPS_BUDGET ?? 80)
// Free limita por MINUTO também (~10/min). Espaça as chamadas e tenta de novo no rate limit.
const THROTTLE_MS = Number(process.env.LINEUPS_THROTTLE_MS ?? 7000)
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function buscaLineup(fixtureId: number): Promise<LineupResp[]> {
  for (let tentativa = 0; ; tentativa++) {
    try {
      return await af<LineupResp[]>(`/fixtures/lineups?fixture=${fixtureId}`)
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

type PlayerLine = {
  id: number | null
  name: string
  number: number | null
  pos: string | null
  grid: string | null
}
type LineupResp = {
  team: { id: number; name: string }
  formation: string | null
  startXI: { player: PlayerLine }[]
  substitutes: { player: PlayerLine }[]
  coach: { id: number | null; name: string | null }
}

// Times: apiFootballTeamId → id interno.
const timeRows = await db.select({ id: time.id, api: time.apiFootballTeamId }).from(time)
const idDoTime = new Map(timeRows.map((t) => [t.api, t.id]))

// Partidas jogadas (com placar) que ainda NÃO têm escalação — mais recentes primeiro.
const jaTem = new Set((await db.selectDistinct({ pid: escalacao.partidaId }).from(escalacao)).map((r) => r.pid))
const jogadas = await db
  .select({ id: partida.id, fixtureId: partida.apiFootballFixtureId })
  .from(partida)
  .where(isNotNull(partida.placarFtMandante))
  .orderBy(desc(partida.data))
const pendentes = jogadas.filter((p) => !jaTem.has(p.id)).slice(0, BUDGET)

console.log(
  `Partidas jogadas: ${jogadas.length} | já com lineup: ${jaTem.size} | processando agora: ${pendentes.length} (budget ${BUDGET})\n`,
)

let ok = 0
for (const [i, p] of pendentes.entries()) {
  if (i > 0) await sleep(THROTTLE_MS) // respeita o limite por minuto do Free
  const lados = await buscaLineup(p.fixtureId)
  if (!lados.length) {
    console.log(`  fixture ${p.fixtureId}: sem lineup disponível`)
    continue
  }

  for (const lado of lados) {
    const timeId = idDoTime.get(lado.team.id)
    if (!timeId) continue

    const [esc] = await db
      .insert(escalacao)
      .values({ partidaId: p.id, timeId, formacao: lado.formation, tecnico: lado.coach?.name ?? null })
      .onConflictDoNothing({ target: [escalacao.partidaId, escalacao.timeId] })
      .returning({ id: escalacao.id })
    if (!esc) continue // já existia

    const titulares = lado.startXI.map((x) => x.player).filter((pl) => pl.id != null)
    const banco = lado.substitutes.map((x) => x.player).filter((pl) => pl.id != null)
    const todos = [...titulares, ...banco]
    if (!todos.length) continue

    // Upsert jogadores (dedup por apiFootballPlayerId) e mapeia → id interno.
    await db
      .insert(jogador)
      .values(todos.map((pl) => ({ apiFootballPlayerId: pl.id!, nome: pl.name })))
      .onConflictDoNothing({ target: jogador.apiFootballPlayerId })
    const jrows = await db
      .select({ id: jogador.id, api: jogador.apiFootballPlayerId })
      .from(jogador)
      .where(inArray(jogador.apiFootballPlayerId, todos.map((pl) => pl.id!)))
    const idDoJogador = new Map(jrows.map((r) => [r.api, r.id]))

    const linhas = [
      ...titulares.map((pl) => ({ pl, titular: true })),
      ...banco.map((pl) => ({ pl, titular: false })),
    ].flatMap(({ pl, titular }) => {
      const jogadorId = idDoJogador.get(pl.id!)
      if (!jogadorId) return []
      return [{ escalacaoId: esc.id, jogadorId, numero: pl.number, posicao: pl.pos, titular, grid: pl.grid }]
    })
    if (linhas.length) await db.insert(escalacaoJogador).values(linhas)
  }
  ok++
  if (ok % 10 === 0) console.log(`  ${ok}/${pendentes.length}...`)
}

console.log(`\n✅ lineups: ${ok} partidas processadas. Faltam ${jogadas.length - jaTem.size - ok}.`)
process.exit(0)
