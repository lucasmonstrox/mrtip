import { asc, desc, eq, inArray, sql, type AnyColumn, type SQL } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { db } from "../../../db/client"
import { coach, league, lineup, lineupPlayer, match, player, team } from "../../../db/schema"

/* ---------- Domain contract (what /v1/search exposes; reused by apps/web via Eden) ---------- */

// A team as it appears in a search result (and on each side of a match): stable id + name + slug
// (for /teams/:slug) + logo.
export type SearchTeamRef = { id: string; name: string; slug: string; logoUrl: string | null }

export type SearchLeague = { code: string; name: string; country: string; logoUrl: string | null }

// A player hit, with the club he most recently lined up for so namesakes (two "Silva") disambiguate.
export type SearchPlayer = {
  id: string
  name: string
  imageUrl: string | null
  team: { name: string; slug: string; logoUrl: string | null } | null
}

// A match hit, identified by the confronto (both teams); `score` is null when not played yet.
export type SearchMatch = {
  id: string
  slug: string
  date: string // yyyy-MM-dd
  home: SearchTeamRef
  away: SearchTeamRef
  score: [number, number] | null
}

export type SearchCoach = { id: string; name: string }

// Grouped payload of the global search: one bucket per entity, each ranked best-first. `total` is the
// sum of all buckets (drives the "nothing found" state without re-counting on the client).
export type SearchResults = {
  query: string
  total: number
  leagues: SearchLeague[]
  teams: SearchTeamRef[]
  players: SearchPlayer[]
  matches: SearchMatch[]
  coaches: SearchCoach[]
}

const MIN_QUERY = 2 // 1-char queries are too noisy for trigram; the front also gates on this
const DEFAULT_LIMIT = 6
const MAX_LIMIT = 10

function clampLimit(limit?: number): number {
  if (limit == null || Number.isNaN(limit)) return DEFAULT_LIMIT
  return Math.max(1, Math.min(MAX_LIMIT, Math.trunc(limit)))
}

// Normaliza um nome (coluna) ou o termo (valor) para o mesmo espaço comparável: minúsculo + sem acento.
// Casar os dois lados normalizados é o que faz "sao paulo" achar "São Paulo" e bater o índice GIN trgm.
function norm(expr: AnyColumn | string): SQL {
  return sql`immutable_unaccent(lower(${expr}))`
}

// Predicado de match por nome: similaridade trigram (`%`, pega erro de digitação) OU substring (`LIKE`,
// pega prefixo/trecho exato mesmo quando o nome é longo e a similaridade global cai). União dos dois.
function nameMatches(nameCol: AnyColumn, needle: SQL): SQL {
  const n = norm(nameCol)
  return sql`(${n} % ${needle} OR ${n} LIKE '%' || ${needle} || '%')`
}

// Ranking por nome: quem COMEÇA com o termo primeiro, depois o mais parecido (similaridade trigram),
// e por fim alfabético como desempate estável.
function nameOrder(nameCol: AnyColumn, needle: SQL): SQL[] {
  const n = norm(nameCol)
  return [sql`(${n} LIKE ${needle} || '%') DESC`, sql`similarity(${n}, ${needle}) DESC`, asc(nameCol)]
}

async function searchLeagues(needle: SQL, limit: number): Promise<SearchLeague[]> {
  return db
    .select({ code: league.code, name: league.name, country: league.country, logoUrl: league.logoUrl })
    .from(league)
    .where(nameMatches(league.name, needle))
    .orderBy(...nameOrder(league.name, needle))
    .limit(limit)
}

async function searchTeams(needle: SQL, limit: number): Promise<SearchTeamRef[]> {
  return db
    .select({ id: team.id, name: team.name, slug: team.slug, logoUrl: team.logoUrl })
    .from(team)
    .where(nameMatches(team.name, needle))
    .orderBy(...nameOrder(team.name, needle))
    .limit(limit)
}

async function searchCoaches(needle: SQL, limit: number): Promise<SearchCoach[]> {
  return db
    .select({ id: coach.id, name: coach.name })
    .from(coach)
    .where(nameMatches(coach.name, needle))
    .orderBy(...nameOrder(coach.name, needle))
    .limit(limit)
}

// Busca jogadores por nome (fuzzy/acento) e anexa o clube mais recente de cada um — o clube desambigua
// homônimos no resultado (dois "Rodrigo" viram "Rodrigo · Man City" vs "Rodrigo · Bournemouth").
async function searchPlayers(needle: SQL, limit: number): Promise<SearchPlayer[]> {
  const rows = await db
    .select({ id: player.id, name: player.name, imageUrl: player.imageUrl })
    .from(player)
    .where(nameMatches(player.name, needle))
    .orderBy(...nameOrder(player.name, needle))
    .limit(limit)
  if (rows.length === 0) return []
  const clubs = await currentClubs(rows.map((r) => r.id))
  return rows.map((r) => ({ ...r, team: clubs.get(r.id) ?? null }))
}

// Clube mais recente de cada jogador, em UMA query: DISTINCT ON pelo jogador, ordenado pela data da
// partida desc (a escalação mais recente vence). Mapa playerId → time, p/ dobrar nos resultados acima.
async function currentClubs(
  ids: string[],
): Promise<Map<string, { name: string; slug: string; logoUrl: string | null }>> {
  const rows = await db
    .selectDistinctOn([lineupPlayer.playerId], {
      playerId: lineupPlayer.playerId,
      name: team.name,
      slug: team.slug,
      logoUrl: team.logoUrl,
    })
    .from(lineupPlayer)
    .innerJoin(lineup, eq(lineup.id, lineupPlayer.lineupId))
    .innerJoin(match, eq(match.id, lineup.matchId))
    .innerJoin(team, eq(team.id, lineup.teamId))
    .where(inArray(lineupPlayer.playerId, ids))
    .orderBy(asc(lineupPlayer.playerId), desc(match.date))
  return new Map(rows.map((r) => [r.playerId, { name: r.name, slug: r.slug, logoUrl: r.logoUrl }]))
}

// `team` entra no join do confronto 2x (mandante e visitante) → um alias para cada lado.
const searchHome = alias(team, "search_home")
const searchAway = alias(team, "search_away")

// Busca jogos pelo CONFRONTO: match.name é "Matchday 12" (inútil), então casa pelos nomes dos times.
// Aceita um time só ("chelsea" → jogos do Chelsea) ou os dois em qualquer ordem ("chelsea everton" =
// "everton chelsea", via similaridade da concatenação nos dois sentidos). Ranqueado por similaridade
// e data (mais recente primeiro).
async function searchMatches(needle: SQL, limit: number): Promise<SearchMatch[]> {
  const hn = norm(searchHome.name)
  const an = norm(searchAway.name)
  const pair = sql`immutable_unaccent(lower(${searchHome.name} || ' ' || ${searchAway.name}))`
  const pairRev = sql`immutable_unaccent(lower(${searchAway.name} || ' ' || ${searchHome.name}))`
  const score = sql<number>`greatest(similarity(${hn}, ${needle}), similarity(${an}, ${needle}), similarity(${pair}, ${needle}), similarity(${pairRev}, ${needle}))`
  const rows = await db
    .select({
      id: match.id,
      slug: match.slug,
      date: match.date,
      ftHome: match.ftHome,
      ftAway: match.ftAway,
      homeId: searchHome.id,
      homeName: searchHome.name,
      homeSlug: searchHome.slug,
      homeLogo: searchHome.logoUrl,
      awayId: searchAway.id,
      awayName: searchAway.name,
      awaySlug: searchAway.slug,
      awayLogo: searchAway.logoUrl,
    })
    .from(match)
    .innerJoin(searchHome, eq(searchHome.id, match.homeTeamId))
    .innerJoin(searchAway, eq(searchAway.id, match.awayTeamId))
    .where(
      sql`${hn} LIKE '%' || ${needle} || '%' OR ${an} LIKE '%' || ${needle} || '%' OR ${pair} % ${needle} OR ${pairRev} % ${needle}`,
    )
    .orderBy(desc(score), desc(match.date))
    .limit(limit)
  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    date: r.date,
    home: { id: r.homeId, name: r.homeName, slug: r.homeSlug, logoUrl: r.homeLogo },
    away: { id: r.awayId, name: r.awayName, slug: r.awaySlug, logoUrl: r.awayLogo },
    score: r.ftHome != null && r.ftAway != null ? [r.ftHome, r.ftAway] : null,
  }))
}

// Busca global fuzzy (trigram + sem acento) por nome: liga, time, jogador, jogo (confronto) e treinador.
// Uma ida ao banco por entidade, todas em paralelo; cada balde já vem ranqueado e cortado em `limit`.
// Tolera erro de digitação ("liverpol"→Liverpool) e acento ("guimaraes"→Guimarães). @feature CORE-002
export async function search(rawQuery: string, limitParam?: number): Promise<SearchResults> {
  const query = rawQuery.trim()
  const limit = clampLimit(limitParam)
  if (query.length < MIN_QUERY) {
    return { query, total: 0, leagues: [], teams: [], players: [], matches: [], coaches: [] }
  }
  const needle = norm(query)
  const [leagues, teams, players, matches, coaches] = await Promise.all([
    searchLeagues(needle, limit),
    searchTeams(needle, limit),
    searchPlayers(needle, limit),
    searchMatches(needle, limit),
    searchCoaches(needle, limit),
  ])
  const total = leagues.length + teams.length + players.length + matches.length + coaches.length
  return { query, total, leagues, teams, players, matches, coaches }
}
