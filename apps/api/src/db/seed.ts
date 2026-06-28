import { sql } from "drizzle-orm"

import { af } from "../lib/api-football"
import { CATALOGO } from "../modules/ligas/consts"
import { db } from "./client"
import { liga, partida, time } from "./schema"

/**
 * Seed: carrega fixtures + times da API-Football (uma competição/temporada por entrada do
 * CATALOGO). Idempotente — upsert de liga/times e zera+reinsere as partidas da liga.
 * Lineups NÃO entram aqui (1 req por jogo, quota Free) — ver seed-lineups.ts.
 *
 * Precisa de API_FOOTBALL_KEY no .env.
 */

// Shape parcial do item de /fixtures que usamos.
type Fixture = {
  fixture: { id: number; date: string }
  league: { round: string }
  teams: { home: { id: number; name: string }; away: { id: number; name: string } }
  goals: { home: number | null; away: number | null }
  score: { halftime: { home: number | null; away: number | null } }
}

/** "Regular Season - 12" → 12 (0 se não casar). */
function rodadaDeNome(nome: string): number {
  const m = nome.match(/\d+/)
  return m ? Number(m[0]) : 0
}

/** Nome do time → slug kebab-case ("Manchester United" → "manchester-united"). */
function slugify(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

for (const meta of CATALOGO) {
  console.log(`\n${meta.code} (${meta.temporada}) — buscando fixtures da API-Football...`)
  const fixtures = await af<Fixture[]>(`/fixtures?league=${meta.leagueId}&season=${meta.season}`)
  console.log(`  ${fixtures.length} fixtures`)

  // Upsert da liga.
  await db
    .insert(liga)
    .values({
      code: meta.code,
      apiFootballLeagueId: meta.leagueId,
      nome: meta.nome,
      pais: meta.pais,
      temporada: meta.temporada,
    })
    .onConflictDoUpdate({
      target: liga.code,
      set: {
        apiFootballLeagueId: meta.leagueId,
        nome: meta.nome,
        pais: meta.pais,
        temporada: meta.temporada,
      },
    })

  // Times: dedup pelo id da API-Football, upsert (id interno estável entre re-seeds).
  const times = new Map<number, string>() // apiFootballTeamId → nome
  for (const f of fixtures) {
    times.set(f.teams.home.id, f.teams.home.name)
    times.set(f.teams.away.id, f.teams.away.name)
  }
  await db
    .insert(time)
    .values([...times].map(([apiFootballTeamId, nome]) => ({ apiFootballTeamId, nome, slug: slugify(nome) })))
    .onConflictDoNothing({ target: time.apiFootballTeamId })

  // Mapa apiFootballTeamId → id interno do time.
  const timeRows = await db.select({ id: time.id, apiFootballTeamId: time.apiFootballTeamId }).from(time)
  const idDoTime = new Map(timeRows.map((t) => [t.apiFootballTeamId, t.id]))

  const linhas = fixtures.map((f) => {
    const mandanteId = idDoTime.get(f.teams.home.id)
    const visitanteId = idDoTime.get(f.teams.away.id)
    if (!mandanteId || !visitanteId) throw new Error(`Time sem id: ${f.teams.home.name} x ${f.teams.away.name}`)
    return {
      apiFootballFixtureId: f.fixture.id,
      ligaCode: meta.code,
      rodada: rodadaDeNome(f.league.round),
      nome: f.league.round,
      data: f.fixture.date.slice(0, 10),
      hora: f.fixture.date.slice(11, 16) || null,
      mandanteId,
      visitanteId,
      placarFtMandante: f.goals.home,
      placarFtVisitante: f.goals.away,
      placarHtMandante: f.score.halftime.home,
      placarHtVisitante: f.score.halftime.away,
    }
  })

  // Upsert por apiFootballFixtureId: mantém o id da partida estável entre re-seeds (lineups/
  // lesões/gols sobrevivem), só atualizando os campos mutáveis (placar/rodada/data) via excluded.
  for (let i = 0; i < linhas.length; i += 500) {
    await db
      .insert(partida)
      .values(linhas.slice(i, i + 500))
      .onConflictDoUpdate({
        target: partida.apiFootballFixtureId,
        set: {
          rodada: sql`excluded.rodada`,
          nome: sql`excluded.nome`,
          data: sql`excluded.data`,
          hora: sql`excluded.hora`,
          placarFtMandante: sql`excluded.placar_ft_mandante`,
          placarFtVisitante: sql`excluded.placar_ft_visitante`,
          placarHtMandante: sql`excluded.placar_ht_mandante`,
          placarHtVisitante: sql`excluded.placar_ht_visitante`,
        },
      })
  }
  console.log(`  ${times.size} times, ${linhas.length} partidas`)
}

console.log("\n✅ seed concluído")
process.exit(0)
