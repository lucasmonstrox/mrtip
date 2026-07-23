import { addDays, format, min, parseISO, subDays } from "date-fns"
import { and, eq, ne } from "drizzle-orm"

import { db } from "./client"
import { card, commentary, goal, injury, league, lineup, lineupPlayer, match, matchTeamStats, matchTrend, nationality, player, season, standing, team, venue, weather } from "./schema"
import { matchSlug, slugify } from "./slug"
import { normalizeZone } from "./zones"
import { roleFromGrid } from "./role-from-grid"
import { fixtureMetaOf, ingestReferees, ingestTvStations, preferredFootOf, type SmRefereeLink, type SmTvLink } from "./sync-ingest"
import { ingestTeamRivals } from "./sync-rivals"
import { env } from "../env"
import { kickoffInTimeZone } from "../lib/kickoff"
import { uploadImagem } from "../lib/r2"
import { sm, smAll } from "../lib/sportmonks"
import { extractScore, type SportmonksScore } from "../lib/sportmonks-scores"

// SportMonks sync for the Premier League 2025/26 into Postgres. Runs under Bun (not on the edge):
//   bun run src/db/sync-sportmonks.ts
// Idempotent — re-running upserts by SportMonks id (fixture/team/league/standing/player).
//
// Pipeline: league+logo → standings (teams + logos + official table) → fixtures (results +
// starting lineup: creates player with nationality/dob/height and writes lineup/lineup_player).

// Configuração da liga/temporada a sincar, por flags NOMEADAS (D7 do LIG-012 — os syncs de copa e de
// temporada antiga seguem com argv posicional de propósito):
//   bun run db:sync --league 648 --season 25184 --code BRA --timezone America/Sao_Paulo [--dry-run]
// Sem flags, o default é a Premier League — é o que mantém `bun run db:sync`/`db:reset` funcionando
// como antes. O que NÃO tem default é a janela de varredura: ela vem sempre da API (ver seasonWindows).
function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`)
  return i >= 0 ? process.argv[i + 1] : undefined
}
const LEAGUE_ID = Number(flag("league") ?? 8) // Premier League
const SEASON_ID = Number(flag("season") ?? 25583) // 2025/2026
const CODE = (flag("code") ?? "PL").toUpperCase() // domain key (URL)
const TIMEZONE = flag("timezone") ?? "Europe/London" // fuso da liga: `date`/`time` na hora de parede local
const DRY_RUN = process.argv.includes("--dry-run") // varre e conta, não escreve no banco nem no R2
// Nome de exibição por código — SportMonks manda "Serie A"; no produto BR é "Brasileirão".
// O mesmo nome alimenta o prefixo do match.slug (`brasileirao-…`, não `serie-a-…`).
const LEAGUE_DISPLAY_NAME: Record<string, string> = { BRA: "Brasileirão" }

// SportMonks lineup type_ids: starter (titular) vs bench (banco).
const LINEUP_STARTER = 11
const LINEUP_BENCH = 12

// SportMonks lineups.details stat type_ids (Match Facts) — per player per match.
// keyPasses (117): last pass before a teammate's shot — chance creation; omitted by the API when 0.
// shotsOnTarget (86): per-player shots on target; SUM per team rebuilds the team's SoT for the match.
// Volume defensivo + criação por jogador (LIG-003 / tese do desfalque): tackles/interceptions/duels/
// crosses/dribbles/big-chances-missed/passes — todos confirmados no lineups.details da PL 25/26.
const STAT = { rating: 118, minutes: 119, motm: 1490, keyPasses: 117, shotsOnTarget: 86, shotsTotal: 42, shotsOffTarget: 41, shotsBlocked: 58, duelsLost: 1491, crossesSuccessfulPct: 1533, passesAccuratePct: 1584, fouls: 56, foulsDrawn: 96, saves: 57, savesInsidebox: 104, dispossessed: 94, blockedShots: 97, clearances: 101, duelsTotal: 105, aerialsWon: 107, passesAccurate: 116, touches: 120, longBalls: 122, longBallsWon: 123, bigChancesCreated: 580, chancesCreated: 9706, aerialsTotal: 27274, aerialsLost: 27266, aerialsWonPct: 27275, tacklesWon: 27267, tacklesWonPct: 27268, duelsWonPct: 27276, passesFinalThird: 27269, longBallsWonPct: 27270, ballRecoveries: 27271, backwardPasses: 27272, possessionLost: 27273, errorsLeadToShot: 48997, lastManTackle: 583, goodHighClaim: 584, offsides: 51, captain: 40,
  tackles: 78, interceptions: 100, duelsWon: 106, passes: 80, crossesTotal: 98, crossesAccurate: 99, dribbleAttempts: 108, dribblesSuccessful: 109, dribbledPast: 110, bigChancesMissed: 581,
  // Erro individual e evento raro decisivo (LIG-003). ESPARSOS: só vêm quando o lance aconteceu —
  // pênalti cometido aparece em 22% dos jogos, corte na linha em 20%. Cobertura medida em 200 jogos da PL.
  errorLeadToGoal: 571, penaltiesCommitted: 114, penaltiesWon: 115, offsidesProvoked: 95, turnovers: 121, clearanceOffline: 582 } as const
// SportMonks fixture-statistics type_ids ingeridos por time por partida (include=statistics). @feature DOS-002
// Bloco 2 (defesa + construção): só os que o probe confirmou virem no nível-partida da PL 25/26.
const TEAM_STAT = { possession: 45, shotsTotal: 42, shotsInsidebox: 49, shotsOutsidebox: 50, shotsOnTarget: 86, shotsOffTarget: 41, shotsBlocked: 58, bigChancesCreated: 580, dangerousAttacks: 44, corners: 34, freeKicks: 55,
  tackles: 78, interceptions: 100, duelsWon: 106, successfulHeaders: 65, attacks: 43, passes: 80, passesAccurate: 81, passAccuracy: 82, longPasses: 62, crossesTotal: 98, crossesAccurate: 99, dribbleAttempts: 108, dribblesSuccessful: 109, dribbleSuccess: 1605, bigChancesMissed: 581, hitWoodwork: 64, goalAttempts: 54 } as const
// SportMonks per-minute trend type_ids ingeridos pro attack momentum (include=trends). Os mais "perigosos"
// pesam mais na reconstrução da gangorra (ver SIN-021): SoT/big-chance/dangerous-attack > shots > attack > posse. @feature SIN-021
const TREND_TYPES = [86, 580, 44, 42, 43, 49, 34, 78, 100, 45] as const
const TREND_TYPE_SET = new Set<number>(TREND_TYPES)
const TEAM_STAT_IDS = Object.values(TEAM_STAT).join(",")

// SportMonks goal-event developer_names → our goal.type. Por agora só goal vs owngoal: o pênalti
// convertido conta como gol normal (mantém o placar consistente). MISSED_PENALTY não é gol (fora).
const GOAL_TYPE: Record<string, "normal" | "penalty" | "own"> = {
  GOAL: "normal",
  PENALTY: "penalty", // @feature DOS-002 — era "normal" (bug): zerava penaltyGoals e poluía a conversão
  OWNGOAL: "own",
}

// SportMonks card-event developer_names → our card.type. VAR_CARD (review) is ignored.
const CARD_TYPE: Record<string, "yellow" | "red" | "yellowred"> = {
  YELLOWCARD: "yellow",
  REDCARD: "red",
  YELLOWREDCARD: "yellowred",
}

// Standing detail type_ids (discovered on the real API — see standings/seasons/:id). 129-134/179 are
// the season totals; 135-146 are the official HOME/AWAY split (confirmed against the live response).
const DET = {
  played: 129,
  won: 130,
  drawn: 131,
  lost: 132,
  goalsFor: 133,
  goalsAgainst: 134,
  goalDifference: 179,
  homePlayed: 135,
  homeWon: 136,
  homeDrawn: 137,
  homeLost: 138,
  homeGoalsFor: 139,
  homeGoalsAgainst: 140,
  awayPlayed: 141,
  awayWon: 142,
  awayDrawn: 143,
  awayLost: 144,
  awayGoalsFor: 145,
  awayGoalsAgainst: 146,
} as const

type SmLeague = { id: number; name: string; image_path: string; country?: { name: string } }
// `starting_at`/`ending_at` ("YYYY-MM-DD") delimitam a temporada e são a fonte da janela de varredura —
// é o que impede o sweep de nascer com o calendário europeu hardcoded. @feature LIG-012
type SmSeason = { id: number; name: string; starting_at: string; ending_at: string; tie_breaker_rule_id: number | null }
type SmTeam = { id: number; name: string; short_code?: string; image_path: string }
type SmDetail = { type_id: number; value: number }
type SmStanding = {
  position: number
  points: number
  participant: SmTeam
  details: SmDetail[]
  rule?: { type?: { developer_name?: string } }
}
type SmPlayer = {
  id: number
  display_name?: string
  name?: string
  date_of_birth?: string
  height?: number
  weight?: number
  image_path?: string
  nationality_id?: number
  detailed_position_id?: number // preferred role (148 CB, 154 RB, 152 LW, …) — per-match role is derived from grid+formation
  metadata?: { type_id: number; values?: unknown }[] // type_id 229 = preferred foot ("left"/"right"/"both") @feature W-057
}
type SmLineup = {
  team_id: number
  type_id: number // 11 = starter, 12 = bench
  jersey_number?: number
  formation_field?: string // grid "row:col"
  player?: SmPlayer
  position?: { developer_name?: string }
  details?: { type_id: number; data?: { value?: number } }[] // filtered to Rating (118) only
}
type SmFormation = { participant_id: number; formation: string }
type SmEvent = {
  id: number
  type_id: number
  type?: { developer_name?: string }
  participant_id: number
  player_id?: number
  player_name?: string
  related_player_id?: number
  related_player_name?: string
  minute?: number
}
// SportMonks `venue` on a fixture (include=venue): the actual ground of the match. lat/long come
// as strings (or null); image_path is the stadium photo. city_name is the denormalized city.
type SmVenue = {
  id: number
  name: string
  city_name?: string | null
  capacity?: number | null
  surface?: string | null
  latitude?: string | null
  longitude?: string | null
  image_path?: string | null
}
type SmFixture = {
  id: number
  name: string
  starting_at: string
  round?: { name: string }
  state?: { developer_name: string }
  participants: { id: number; meta: { location: "home" | "away" } }[]
  scores?: SportmonksScore[]
  lineups?: SmLineup[]
  formations?: SmFormation[]
  events?: SmEvent[]
  sidelined?: SmSidelined[]
  venue?: SmVenue | null
  statistics?: SmStatistic[]
  trends?: SmTrend[]
  weatherreport?: SmWeather | null // chave LOWERCASE no JSON (include=weatherReport, como `relatedplayer`)
  metadata?: { type_id: number; values?: unknown }[] // 578 attendance, 572 lineup confirmed (fixtureMetaOf)
  tvstations?: SmTvLink[] // chave LOWERCASE no JSON (include=tvStations.tvStation) @feature W-059
  referees?: SmRefereeLink[] // include=referees; jogo futuro sem designação vem vazio
}
// SportMonks weather report (include=weatherReport): a chave no JSON vem como `weatherreport` (minúscula).
// temperature/feels_like/wind são objetos; usamos o período "day" (~horário do jogo). `description` = condição.
type SmWeather = {
  temperature?: { day?: number } | null
  feels_like?: { day?: number } | null
  wind?: { speed?: number; direction?: number } | null
  humidity?: string | null
  clouds?: string | null
  pressure?: number | null
  description?: string | null
  type?: string | null
}
// SportMonks fixture statistic (include=statistics): one row per (team, type) per match. `type_id`
// decodes the metric (45=possession, 42=shots total, 49=shots inside box, 580=big chances created).
type SmStatistic = { type_id: number; participant_id: number; location?: "home" | "away"; data?: { value?: number } }
// SportMonks per-minute trend (include=trends): one row per (team, type, period, minute). `value` is
// CUMULATIVE within the period. Feeds the attack-momentum reconstruction (`match_trend`). @feature SIN-021
type SmTrend = { type_id: number; participant_id: number; period_id: number; minute: number; value: number }
// SportMonks `sidelined` item on a fixture: a player unavailable (or a doubt) for THAT match.
// `type.developer_name` is the cause/category (HAMSTRING_INJURY, RED_CARD_SUSPENSION, DOUBTFUL).
type SmSidelined = {
  participant_id: number
  player_id: number
  player?: { id: number; name?: string; common_name?: string }
  type?: { name: string; developer_name: string }
}
type SmCountry = { id: number; name: string; fifa_name?: string; iso2?: string; image_path?: string }
// SportMonks commentary line (GET /commentaries/fixtures/:id). With include=player;relatedPlayer the
// JSON key comes back as `relatedplayer` (lowercase) — map it literally. `order` is a large increasing
// int (the chronological key, NOT 1,2,3). `player`/`relatedplayer` reuse the SmPlayer shape.
type SmCommentary = {
  id: number
  comment: string
  minute?: number | null
  extra_minute?: number | null
  is_goal: boolean
  is_important: boolean
  order: number
  player?: SmPlayer | null
  relatedplayer?: SmPlayer | null
}

function detVal(details: SmDetail[], typeId: number): number {
  return details.find((d) => d.type_id === typeId)?.value ?? 0
}

// Builds the "pretty" image key in R2: folder/slug-of-name.ext (e.g. "teams/arsenal.png").
// `suffix` (optional) disambiguates colliding names — e.g. player "players/harry-kane-12345".
// The extension comes from the SportMonks image_path itself (usually .png), it isn't guessed.
function imgKey(folder: string, name: string, imagePath: string, suffix?: number | string): string {
  const ext = imagePath.split("?")[0]!.split(".").pop() ?? "png"
  const base = suffix != null ? `${slugify(name)}-${suffix}` : slugify(name)
  return `${folder}/${base}.${ext}`
}

// position.developer_name from SportMonks (GOALKEEPER/DEFENDER/MIDFIELDER/ATTACKER) → G/D/M/F.
function shortPosition(dev?: string): string | null {
  if (!dev) return null
  const d = dev.toUpperCase()
  if (d.startsWith("GOAL")) return "G"
  if (d.startsWith("DEF")) return "D"
  if (d.startsWith("MID")) return "M"
  return "F"
}

// Countries live at /v3/core/countries (outside the /football base). Pages everything into a Map
// by id — used to fill the `nationality` table only with the countries actually referenced.
async function fetchCountries(): Promise<Map<number, SmCountry>> {
  const map = new Map<number, SmCountry>()
  let page = 1
  for (;;) {
    const url = `https://api.sportmonks.com/v3/core/countries?api_token=${env.sportmonksApiKey}&per_page=100&page=${page}`
    const res = await fetch(url)
    const body = (await res.json()) as { data?: SmCountry[]; pagination?: { has_more: boolean } }
    if (!res.ok || !body.data) throw new Error(`countries page ${page} → ${res.status}`)
    for (const c of body.data) map.set(c.id, c)
    if (!body.pagination?.has_more) break
    page += 1
  }
  return map
}

// Runs `fn` over `items` with at most `n` in parallel (pool). Used to upload hundreds of images
// to R2 without spawning too many processes — each upload is a wrangler spawn.
async function pool<T, R>(items: T[], n: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length)
  let cursor = 0
  async function worker() {
    for (;;) {
      const i = cursor++
      if (i >= items.length) return
      out[i] = await fn(items[i]!)
    }
  }
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, worker))
  return out
}

// A API limita `fixtures/between` a ~100 dias por chamada, então a temporada é varrida em fatias. 90
// dias dá folga sob o teto; a margem cobre jogo remarcado para fora da janela oficial da temporada.
const WINDOW_DAYS = 90
const WINDOW_MARGIN_DAYS = 7

// Fatia a temporada (`starting_at`→`ending_at` da própria API) nas janelas da varredura. É isto que
// mantém o sweep honesto em qualquer calendário — o europeu (ago→mai) e o brasileiro (mar→dez). Não
// existe janela hardcoded de fallback: sem as datas da API o sync não teria como varrer. @feature LIG-012
function seasonWindows(startingAt: string, endingAt: string): [string, string][] {
  const last = addDays(parseISO(endingAt), WINDOW_MARGIN_DAYS)
  const windows: [string, string][] = []
  let from = subDays(parseISO(startingAt), WINDOW_MARGIN_DAYS)
  while (from <= last) {
    const to = min([addDays(from, WINDOW_DAYS - 1), last])
    windows.push([format(from, "yyyy-MM-dd"), format(to, "yyyy-MM-dd")])
    from = addDays(to, 1)
  }
  return windows
}

// Varre as janelas e devolve as fixtures da temporada, deduplicadas por id (uma partida pode cair em
// duas janelas na fronteira). O filtro fixtureSeasons garante que só a temporada alvo entra; os
// includes de lineup/stats/trends vêm na MESMA requisição.
async function sweepFixtures(windows: [string, string][]): Promise<SmFixture[]> {
  const byId = new Map<number, SmFixture>()
  for (const [from, to] of windows) {
    const window = await smAll<SmFixture>(
      `/fixtures/between/${from}/${to}?filters=fixtureSeasons:${SEASON_ID};fixtureStatisticTypes:${TEAM_STAT_IDS};trendTypes:${TREND_TYPES.join(",")}` +
        `&include=participants;scores;round;state;lineups.player.metadata;lineups.position;lineups.details;formations;events.type;sidelined.player;sidelined.type;venue;statistics;trends;weatherReport;metadata;tvStations.tvStation;referees.referee&per_page=50`,
    )
    for (const f of window) byId.set(f.id, f)
  }
  return [...byId.values()]
}

async function main() {
  // 1) League + logo ------------------------------------------------------------
  const apiLeague = await sm<SmLeague>(`/leagues/${LEAGUE_ID}?include=country`)
  const apiSeason = await sm<SmSeason>(`/seasons/${SEASON_ID}`)
  const WINDOWS = seasonWindows(apiSeason.starting_at, apiSeason.ending_at)
  console.log(`league: ${apiLeague.name} (${apiSeason.name}) · code=${CODE} · tz=${TIMEZONE}`)
  console.log(
    `temporada ${apiSeason.starting_at}→${apiSeason.ending_at} · janelas (${WINDOWS.length}): ${WINDOWS.map(([f, t]) => `${f}→${t}`).join(" · ")}`,
  )

  // Dry-run: prova a varredura (janelas + contagem de fixtures) SEM escrever no banco nem no R2.
  // Sai antes do primeiro upload de logo, que é a primeira escrita do pipeline.
  if (DRY_RUN) {
    const found = await sweepFixtures(WINDOWS)
    console.log(`fixtures: ${found.length}`)
    console.log("(dry-run: nada escrito no banco nem no R2)")
    return
  }

  const leagueLogo = await uploadImagem(apiLeague.image_path, imgKey("leagues", apiLeague.name, apiLeague.image_path))

  const leagueValues = {
    code: CODE,
    sportmonksLeagueId: apiLeague.id,
    sportmonksSeasonId: SEASON_ID,
    name: LEAGUE_DISPLAY_NAME[CODE] ?? apiLeague.name,
    country: apiLeague.country?.name ?? "—",
    season: apiSeason.name,
    timezone: TIMEZONE, // @feature LIG-012
    logoUrl: leagueLogo,
  }
  await db
    .insert(league)
    .values(leagueValues)
    .onConflictDoUpdate({ target: league.code, set: leagueValues })

  // 1b) Season row (the current season) — match/standing are tagged with its id so reads scope by
  // season (LIG-008). startYear from the name ("2025/2026" → 2025). Marked isCurrent. @feature LIG-008
  const seasonValues = {
    sportmonksSeasonId: SEASON_ID,
    leagueCode: CODE,
    name: apiSeason.name,
    startYear: Number(apiSeason.name.slice(0, 4)),
    isCurrent: true,
    // Seletor da regra de desempate declarada pela fonte; a semântica mora em TIEBREAK_BY_RULE_ID. @feature LIG-017
    sportmonksTieBreakerRuleId: apiSeason.tie_breaker_rule_id ?? null,
  }
  const [seasonRow] = await db
    .insert(season)
    .values(seasonValues)
    .onConflictDoUpdate({ target: season.sportmonksSeasonId, set: seasonValues })
    .returning({ id: season.id })
  const seasonId = seasonRow!.id
  // Exactly one current season per league: demote any other PL season so `currentSeasonId` is
  // unambiguous once old seasons are ingested. @feature LIG-008
  await db
    .update(season)
    .set({ isCurrent: false })
    .where(and(eq(season.leagueCode, CODE), ne(season.sportmonksSeasonId, SEASON_ID)))

  // 2) Standings → teams + logos + official table -------------------------------
  const standings = await sm<SmStanding[]>(
    `/standings/seasons/${SEASON_ID}?include=participant;details;rule.type`,
  )
  const teamIdBySm = new Map<number, string>() // sportmonksTeamId → team.id (uuid)
  const teamNameBySm = new Map<number, string>() // sportmonksTeamId → team name (for the match slug)

  for (const row of standings) {
    const t = row.participant
    teamNameBySm.set(t.id, t.name)
    // Sufixo = id SportMonks do time, igual venues/players já fazem: o namespace `teams/` no R2 é
    // global às ligas e dois clubes com nome que normaliza igual sobrescreveriam um ao outro. @feature LIG-012
    const logo = await uploadImagem(t.image_path, imgKey("teams", t.name, t.image_path, t.id))
    const [r] = await db
      .insert(team)
      .values({
        sportmonksTeamId: t.id,
        name: t.name,
        slug: slugify(t.name),
        shortCode: t.short_code ?? null,
        logoUrl: logo,
      })
      .onConflictDoUpdate({
        target: team.sportmonksTeamId,
        set: { name: t.name, slug: slugify(t.name), shortCode: t.short_code ?? null, logoUrl: logo },
      })
      .returning({ id: team.id })
    teamIdBySm.set(t.id, r!.id)
  }

  // Rivais clube×clube (SIN-007): pós-mapa de times, 1 req/time. Dry-run já saiu acima.
  const rivals = await ingestTeamRivals(teamIdBySm)
  console.log(`rivals: ${rivals.edges} edges (${rivals.stubs} stubs) · errors=${rivals.errors}`)

  for (const row of standings) {
    const teamId = teamIdBySm.get(row.participant.id)!
    const values = {
      leagueCode: CODE,
      teamId,
      seasonId, // @feature LIG-008
      position: row.position,
      points: row.points,
      played: detVal(row.details, DET.played),
      won: detVal(row.details, DET.won),
      drawn: detVal(row.details, DET.drawn),
      lost: detVal(row.details, DET.lost),
      goalsFor: detVal(row.details, DET.goalsFor),
      goalsAgainst: detVal(row.details, DET.goalsAgainst),
      goalDifference: detVal(row.details, DET.goalDifference),
      homePlayed: detVal(row.details, DET.homePlayed),
      homeWon: detVal(row.details, DET.homeWon),
      homeDrawn: detVal(row.details, DET.homeDrawn),
      homeLost: detVal(row.details, DET.homeLost),
      homeGoalsFor: detVal(row.details, DET.homeGoalsFor),
      homeGoalsAgainst: detVal(row.details, DET.homeGoalsAgainst),
      awayPlayed: detVal(row.details, DET.awayPlayed),
      awayWon: detVal(row.details, DET.awayWon),
      awayDrawn: detVal(row.details, DET.awayDrawn),
      awayLost: detVal(row.details, DET.awayLost),
      awayGoalsFor: detVal(row.details, DET.awayGoalsFor),
      awayGoalsAgainst: detVal(row.details, DET.awayGoalsAgainst),
      zone: normalizeZone(row.rule?.type?.developer_name),
    }
    await db
      .insert(standing)
      .values(values)
      .onConflictDoUpdate({ target: [standing.seasonId, standing.teamId], set: values })
  }
  console.log(`teams + standings: ${standings.length} rows`)

  // 3) Fixtures → results + starting lineup -------------------------------------
  const fixtures = await sweepFixtures(WINDOWS)

  // 3a-pre) Venues (estádios): distinct venues across fixtures → photo to R2 (parallel) + upsert by
  // sportmonksVenueId. Must run BEFORE matches so `venueId` exists when the match is inserted.
  // lat/long arrive as strings (or null) and are stored as-is (numeric column); they feed the
  // travel/fatigue signal, not the display.
  const venuesById = new Map<number, SmVenue>()
  for (const f of fixtures) if (f.venue) venuesById.set(f.venue.id, f.venue)
  const venues = [...venuesById.values()]
  const venueImgById = new Map<number, string | null>()
  await pool(venues, 8, async (v) => {
    const img = v.image_path
      ? await uploadImagem(v.image_path, imgKey("venues", v.name, v.image_path, v.id))
      : null
    venueImgById.set(v.id, img)
  })
  const venueIdBySm = new Map<number, string>() // sportmonksVenueId → venue.id (uuid)
  for (const v of venues) {
    const vv = {
      sportmonksVenueId: v.id,
      name: v.name,
      cityName: v.city_name ?? null,
      capacity: v.capacity ?? null,
      surface: v.surface ?? null,
      latitude: v.latitude ?? null,
      longitude: v.longitude ?? null,
      imageUrl: venueImgById.get(v.id) ?? null,
    }
    const [r] = await db
      .insert(venue)
      .values(vv)
      .onConflictDoUpdate({ target: venue.sportmonksVenueId, set: vv })
      .returning({ id: venue.id })
    venueIdBySm.set(v.id, r!.id)
  }
  console.log(`venues: ${venues.length}`)

  // 3a) Matches (result). Keeps the match uuid by fixture to link the lineup later.
  const matchIdByFixture = new Map<number, string>()
  for (const f of fixtures) {
    const home = f.participants.find((p) => p.meta.location === "home")
    const away = f.participants.find((p) => p.meta.location === "away")
    if (!home || !away) continue // no two sides = not a valid match
    const homeTeamId = teamIdBySm.get(home.id)
    const awayTeamId = teamIdBySm.get(away.id)
    if (!homeTeamId || !awayTeamId) {
      throw new Error(`team outside standings in fixture ${f.id} (${home.id} vs ${away.id})`)
    }

    const score = extractScore(f.scores)
    // Pretty URL key: league-season-home-vs-away, from the same team names that feed team.slug. The
    // away fixture gets the reversed slug, so the pair is unique within the season. @feature LIG-009
    // Prefixo da liga = nome de produto (LEAGUE_DISPLAY_NAME), não o rótulo cru da SportMonks.
    const leagueNameForSlug = LEAGUE_DISPLAY_NAME[CODE] ?? apiLeague.name
    const slug = matchSlug(leagueNameForSlug, apiSeason.name, teamNameBySm.get(home.id) ?? f.name, teamNameBySm.get(away.id) ?? "")
    const values = {
      sportmonksFixtureId: f.id,
      leagueCode: CODE,
      round: Number(f.round?.name ?? 0),
      name: f.name,
      slug,
      ...kickoffInTimeZone(f.starting_at, TIMEZONE),
      homeTeamId,
      awayTeamId,
      venueId: f.venue ? venueIdBySm.get(f.venue.id) ?? null : null,
      seasonId, // @feature LIG-008
      ...score,
      status: f.state?.developer_name ?? null,
      ...fixtureMetaOf(f),
    }
    const [m] = await db
      .insert(match)
      .values(values)
      .onConflictDoUpdate({ target: match.sportmonksFixtureId, set: values })
      .returning({ id: match.id })
    matchIdByFixture.set(f.id, m!.id)
  }
  console.log(`matches: ${matchIdByFixture.size} written`)

  // Onde assistir (W-059): catálogo de estações + vínculos por partida, logos no R2.
  const nTv = await ingestTvStations(fixtures, matchIdByFixture)
  console.log(`tv links: ${nTv}`)

  // Quem apita (SIN-009): catálogo de árbitros + vínculo por partida com o papel. Jogo futuro sem
  // designação simplesmente não traz o include — não é erro.
  const refs = await ingestReferees(fixtures, matchIdByFixture)
  console.log(`referees: ${refs.people} people, ${refs.appointed} matches appointed`)

  // 3b) Collect distinct players and nationalities from the lineups: starters (type_id 11) AND
  // bench (type_id 12). `starter` is later set from the type.
  const lineupOf = (f: SmFixture) =>
    (f.lineups ?? []).filter(
      (l) => (l.type_id === LINEUP_STARTER || l.type_id === LINEUP_BENCH) && l.player,
    )
  const playersById = new Map<number, SmPlayer>()
  const natIds = new Set<number>()
  for (const f of fixtures)
    for (const l of lineupOf(f)) {
      playersById.set(l.player!.id, l.player!)
      if (l.player!.nationality_id) natIds.add(l.player!.nationality_id)
    }

  // 3c) Nationalities: flags to R2 (parallel) + upsert only the used countries.
  const countries = await fetchCountries()
  const usedNats = [...natIds].map((id) => countries.get(id)).filter((c): c is SmCountry => !!c)
  const flagByNat = new Map<number, string | null>()
  await pool(usedNats, 8, async (c) => {
    const flag = c.image_path
      ? await uploadImagem(c.image_path, imgKey("nationalities", c.name, c.image_path))
      : null
    flagByNat.set(c.id, flag)
  })
  for (const c of usedNats) {
    const v = {
      id: c.id,
      name: c.name,
      fifaName: c.fifa_name ?? null,
      iso2: c.iso2 ?? null,
      flagUrl: flagByNat.get(c.id) ?? null,
    }
    await db.insert(nationality).values(v).onConflictDoUpdate({ target: nationality.id, set: v })
  }
  console.log(`nationalities: ${usedNats.length}`)

  // 3d) Players: photos to R2 (parallel) + upsert. `playerName` prefers the display_name.
  const playerName = (pl: SmPlayer) => pl.display_name ?? pl.name ?? `player ${pl.id}`
  const players = [...playersById.values()]
  const photoByPlayer = new Map<number, string | null>()
  await pool(players, 8, async (pl) => {
    const photo = pl.image_path
      ? await uploadImagem(pl.image_path, imgKey("players", playerName(pl), pl.image_path, pl.id))
      : null
    photoByPlayer.set(pl.id, photo)
  })
  const playerIdBySm = new Map<number, string>()
  for (const pl of players) {
    const v = {
      sportmonksPlayerId: pl.id,
      name: playerName(pl),
      dateOfBirth: pl.date_of_birth ?? null,
      height: pl.height ?? null,
      weight: pl.weight ?? null,
      imageUrl: photoByPlayer.get(pl.id) ?? null,
      nationalityId: pl.nationality_id && countries.has(pl.nationality_id) ? pl.nationality_id : null,
      detailedPositionId: pl.detailed_position_id ?? null,
      preferredFoot: preferredFootOf(pl),
    }
    const [j] = await db
      .insert(player)
      .values(v)
      .onConflictDoUpdate({ target: player.sportmonksPlayerId, set: v })
      .returning({ id: player.id })
    playerIdBySm.set(pl.id, j!.id)
  }
  console.log(`players: ${players.length}`)

  // 3e) Lineup: one lineup per (match, team) with formation; starters + bench in lineup_player.
  // LIG-023: accumulate SUM(clearances) per (matchId, teamId) for derived match_team_stats.clearances
  // (type 101 is NOT in TEAM_STAT / fixture statistics — only per-player).
  const clearancesByMatchTeam = new Map<string, number>()
  let nLineups = 0
  let nPlayers = 0
  for (const f of fixtures) {
    const entries = lineupOf(f)
    const matchId = matchIdByFixture.get(f.id)
    if (!entries.length || !matchId) continue
    const formationByTeam = new Map<number, string>()
    for (const fm of f.formations ?? []) formationByTeam.set(fm.participant_id, fm.formation)
    const byTeam = new Map<number, SmLineup[]>()
    for (const l of entries) byTeam.set(l.team_id, [...(byTeam.get(l.team_id) ?? []), l])

    const homeSmId = f.participants.find((p) => p.meta.location === "home")?.id
    for (const [teamSmId, players2] of byTeam) {
      const teamId = teamIdBySm.get(teamSmId)
      if (!teamId) continue
      const isHome = teamSmId === homeSmId
      const [lu] = await db
        .insert(lineup)
        .values({ matchId, teamId, formation: formationByTeam.get(teamSmId) ?? null })
        .onConflictDoUpdate({
          target: [lineup.matchId, lineup.teamId],
          set: { formation: formationByTeam.get(teamSmId) ?? null },
        })
        .returning({ id: lineup.id })
      nLineups += 1
      for (const l of players2) {
        const playerId = playerIdBySm.get(l.player!.id)
        if (!playerId) continue
        const stat = (typeId: number) => l.details?.find((d) => d.type_id === typeId)?.data?.value
        const lp = {
          lineupId: lu!.id,
          playerId,
          number: l.jersey_number ?? null,
          position: shortPosition(l.position?.developer_name),
          starter: l.type_id === LINEUP_STARTER,
          grid: l.formation_field ?? null,
          role: roleFromGrid(formationByTeam.get(teamSmId) ?? null, l.formation_field ?? null, isHome),
          rating: stat(STAT.rating) ?? null,
          minutesPlayed: stat(STAT.minutes) ?? null,
          keyPasses: stat(STAT.keyPasses) ?? null,
          shotsOnTarget: stat(STAT.shotsOnTarget) ?? null,
          shotsTotal: stat(STAT.shotsTotal) ?? null,
          shotsOffTarget: stat(STAT.shotsOffTarget) ?? null,
          shotsBlocked: stat(STAT.shotsBlocked) ?? null,
          duelsLost: stat(STAT.duelsLost) ?? null,
          crossesSuccessfulPct: stat(STAT.crossesSuccessfulPct) ?? null, fouls: stat(STAT.fouls) ?? null, foulsDrawn: stat(STAT.foulsDrawn) ?? null, saves: stat(STAT.saves) ?? null, savesInsidebox: stat(STAT.savesInsidebox) ?? null, dispossessed: stat(STAT.dispossessed) ?? null, blockedShots: stat(STAT.blockedShots) ?? null, clearances: stat(STAT.clearances) ?? null, duelsTotal: stat(STAT.duelsTotal) ?? null, aerialsWon: stat(STAT.aerialsWon) ?? null, passesAccurate: stat(STAT.passesAccurate) ?? null, touches: stat(STAT.touches) ?? null, longBalls: stat(STAT.longBalls) ?? null, longBallsWon: stat(STAT.longBallsWon) ?? null, bigChancesCreated: stat(STAT.bigChancesCreated) ?? null, chancesCreated: stat(STAT.chancesCreated) ?? null, aerialsTotal: stat(STAT.aerialsTotal) ?? null, aerialsLost: stat(STAT.aerialsLost) ?? null, aerialsWonPct: stat(STAT.aerialsWonPct) ?? null, tacklesWon: stat(STAT.tacklesWon) ?? null, tacklesWonPct: stat(STAT.tacklesWonPct) ?? null, duelsWonPct: stat(STAT.duelsWonPct) ?? null, passesFinalThird: stat(STAT.passesFinalThird) ?? null, longBallsWonPct: stat(STAT.longBallsWonPct) ?? null, ballRecoveries: stat(STAT.ballRecoveries) ?? null, backwardPasses: stat(STAT.backwardPasses) ?? null, possessionLost: stat(STAT.possessionLost) ?? null, errorsLeadToShot: stat(STAT.errorsLeadToShot) ?? null, lastManTackle: stat(STAT.lastManTackle) ?? null, goodHighClaim: stat(STAT.goodHighClaim) ?? null, offsides: stat(STAT.offsides) ?? null, captain: (stat(STAT.captain) ?? 0) >= 1,
          passesAccuratePct: stat(STAT.passesAccuratePct) ?? null,
          tackles: stat(STAT.tackles) ?? null,
          interceptions: stat(STAT.interceptions) ?? null,
          duelsWon: stat(STAT.duelsWon) ?? null,
          passes: stat(STAT.passes) ?? null,
          crossesTotal: stat(STAT.crossesTotal) ?? null,
          crossesAccurate: stat(STAT.crossesAccurate) ?? null,
          dribbleAttempts: stat(STAT.dribbleAttempts) ?? null,
          dribblesSuccessful: stat(STAT.dribblesSuccessful) ?? null,
          dribbledPast: stat(STAT.dribbledPast) ?? null,
          bigChancesMissed: stat(STAT.bigChancesMissed) ?? null,
          errorLeadToGoal: stat(STAT.errorLeadToGoal) ?? null,
          penaltiesCommitted: stat(STAT.penaltiesCommitted) ?? null,
          penaltiesWon: stat(STAT.penaltiesWon) ?? null,
          offsidesProvoked: stat(STAT.offsidesProvoked) ?? null,
          turnovers: stat(STAT.turnovers) ?? null,
          clearanceOffline: stat(STAT.clearanceOffline) ?? null,
          manOfMatch: stat(STAT.motm) === 1,
        }
        if (lp.clearances != null) {
          const k = `${matchId}:${teamId}`
          clearancesByMatchTeam.set(k, (clearancesByMatchTeam.get(k) ?? 0) + lp.clearances)
        }
        await db
          .insert(lineupPlayer)
          .values(lp)
          .onConflictDoUpdate({ target: [lineupPlayer.lineupId, lineupPlayer.playerId], set: lp })
        nPlayers += 1
      }
    }
  }
  console.log(`lineups: ${nLineups} | players (starters + bench): ${nPlayers}`)

  // 3e-bis) Team-level match statistics (SportMonks fixture `statistics` include): one row per team per
  // match — possession, total/inside-box shots, big chances created, etc. Volume/quality that the
  // prognosis dossier can't get per-player. Upsert by (matchId, teamId). @feature DOS-002
  let nTeamStats = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId || !f.statistics?.length) continue
    const byTeam = new Map<number, Map<number, number>>() // teamSmId → (type_id → value)
    for (const s of f.statistics) {
      const v = s.data?.value
      if (v == null) continue
      let row = byTeam.get(s.participant_id)
      if (!row) {
        row = new Map()
        byTeam.set(s.participant_id, row)
      }
      row.set(s.type_id, v)
    }
    for (const [teamSmId, vals] of byTeam) {
      const teamId = teamIdBySm.get(teamSmId)
      if (!teamId) continue
      const g = (id: number) => vals.get(id) ?? null
      const ts = {
        matchId,
        teamId,
        possession: g(TEAM_STAT.possession),
        shotsTotal: g(TEAM_STAT.shotsTotal),
        shotsInsidebox: g(TEAM_STAT.shotsInsidebox),
        shotsOutsidebox: g(TEAM_STAT.shotsOutsidebox),
        shotsOnTarget: g(TEAM_STAT.shotsOnTarget),
        shotsOffTarget: g(TEAM_STAT.shotsOffTarget),
        shotsBlocked: g(TEAM_STAT.shotsBlocked),
        bigChancesCreated: g(TEAM_STAT.bigChancesCreated),
        dangerousAttacks: g(TEAM_STAT.dangerousAttacks),
        corners: g(TEAM_STAT.corners),
        freeKicks: g(TEAM_STAT.freeKicks),
        tackles: g(TEAM_STAT.tackles),
        interceptions: g(TEAM_STAT.interceptions),
        // LIG-023 — derived SUM(lineup_player.clearances); NOT g(101) / TEAM_STAT
        clearances: clearancesByMatchTeam.get(`${matchId}:${teamId}`) ?? null,
        duelsWon: g(TEAM_STAT.duelsWon),
        successfulHeaders: g(TEAM_STAT.successfulHeaders),
        attacks: g(TEAM_STAT.attacks),
        passes: g(TEAM_STAT.passes),
        passesAccurate: g(TEAM_STAT.passesAccurate),
        passAccuracy: g(TEAM_STAT.passAccuracy),
        longPasses: g(TEAM_STAT.longPasses),
        crossesTotal: g(TEAM_STAT.crossesTotal),
        crossesAccurate: g(TEAM_STAT.crossesAccurate),
        dribbleAttempts: g(TEAM_STAT.dribbleAttempts),
        dribblesSuccessful: g(TEAM_STAT.dribblesSuccessful),
        dribbleSuccess: g(TEAM_STAT.dribbleSuccess),
        bigChancesMissed: g(TEAM_STAT.bigChancesMissed),
        hitWoodwork: g(TEAM_STAT.hitWoodwork),
        goalAttempts: g(TEAM_STAT.goalAttempts),
      }
      await db
        .insert(matchTeamStats)
        .values(ts)
        .onConflictDoUpdate({ target: [matchTeamStats.matchId, matchTeamStats.teamId], set: ts })
      nTeamStats += 1
    }
  }
  console.log(`team stats: ${nTeamStats}`)

  // 3e-ter) Per-minute trends (SportMonks `trends` include): ~1300 rows per match (one per team×type×
  // period×minute), `value` cumulative within the period. Reconstructed into the attack-momentum curve
  // at read time. BULK insert per fixture (one statement, not a row-at-a-time await — ~500k rows/season).
  // `trendTypes` filter may be ignored upstream (same gotcha as fixtureStatisticTypes), so we also filter
  // by TREND_TYPE_SET in code. @feature SIN-021
  let nTrends = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId || !f.trends?.length) continue
    const rows: (typeof matchTrend.$inferInsert)[] = []
    for (const t of f.trends) {
      if (!TREND_TYPE_SET.has(t.type_id)) continue
      const teamId = teamIdBySm.get(t.participant_id)
      if (!teamId) continue
      rows.push({ matchId, teamId, typeId: t.type_id, periodId: t.period_id, minute: t.minute, value: t.value })
    }
    if (!rows.length) continue
    await db.insert(matchTrend).values(rows).onConflictDoNothing()
    nTrends += rows.length
  }
  console.log(`trends: ${nTrends}`)

  // 3e-bis) Clima do jogo (include=weatherReport → chave `weatherreport` lowercase no JSON). 1 linha/match;
  // pega o período "day" de temp/feels e o vento; `description` carrega chuva/sol. Upsert por matchId.
  let nWeather = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    const w = f.weatherreport
    if (!matchId || !w) continue
    const wrow = {
      matchId,
      description: w.description ?? null,
      tempDay: w.temperature?.day ?? null,
      feelsLikeDay: w.feels_like?.day ?? null,
      windSpeed: w.wind?.speed ?? null,
      windDirection: w.wind?.direction ?? null,
      humidity: w.humidity ?? null,
      clouds: w.clouds ?? null,
      pressure: w.pressure ?? null,
      type: w.type ?? null,
    }
    await db.insert(weather).values(wrow).onConflictDoUpdate({ target: [weather.matchId], set: wrow })
    nWeather += 1
  }
  console.log(`weather: ${nWeather}`)

  // 3f) Goals + cards of every match, from events. Most players are already in playerIdBySm
  // (lineups); for any that aren't, upsert a minimal player (id + name). Upsert by sportmonksEventId
  // so re-sync is idempotent.
  const ensurePlayer = async (smId: number, name: string): Promise<string> => {
    const known = playerIdBySm.get(smId)
    if (known) return known
    const [j] = await db
      .insert(player)
      .values({ sportmonksPlayerId: smId, name })
      .onConflictDoUpdate({ target: player.sportmonksPlayerId, set: { name } })
      .returning({ id: player.id })
    playerIdBySm.set(smId, j!.id)
    return j!.id
  }

  let nGoals = 0
  let nCards = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId) continue
    for (const ev of f.events ?? []) {
      if (!ev.player_id) continue
      const teamId = teamIdBySm.get(ev.participant_id)
      if (!teamId) continue
      const dev = ev.type?.developer_name ?? ""
      const minute = ev.minute ?? null

      const goalType = GOAL_TYPE[dev]
      if (goalType) {
        const playerId = await ensurePlayer(ev.player_id, ev.player_name ?? `player ${ev.player_id}`)
        const assistId =
          ev.related_player_id && goalType !== "own"
            ? await ensurePlayer(ev.related_player_id, ev.related_player_name ?? `player ${ev.related_player_id}`)
            : null
        const g = { sportmonksEventId: ev.id, matchId, teamId, playerId, assistId, minute, type: goalType }
        await db.insert(goal).values(g).onConflictDoUpdate({ target: goal.sportmonksEventId, set: g })
        nGoals += 1
        continue
      }

      const cardType = CARD_TYPE[dev]
      if (cardType) {
        const playerId = await ensurePlayer(ev.player_id, ev.player_name ?? `player ${ev.player_id}`)
        const c = { sportmonksEventId: ev.id, matchId, teamId, playerId, minute, type: cardType }
        await db.insert(card).values(c).onConflictDoUpdate({ target: card.sportmonksEventId, set: c })
        nCards += 1
      }
    }
  }
  console.log(`goals: ${nGoals} | cards: ${nCards}`)

  // 3f) Injuries/absences (desfalques): SportMonks `sidelined` per fixture → who missed (or was a
  // doubt for) that match and why. `type` = "Missing Fixture" (didn't play) or "Questionable"
  // (doubt, from developer_name DOUBTFUL); `reason` keeps the cause ("Hamstring Injury",
  // "Red Card Suspension"). Sidelined players aren't in lineups → ensurePlayer makes a stub.
  let nInjuries = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId) continue
    for (const s of f.sidelined ?? []) {
      if (!s.player_id) continue
      const teamId = teamIdBySm.get(s.participant_id)
      if (!teamId) continue
      const playerId = await ensurePlayer(
        s.player_id,
        s.player?.common_name ?? s.player?.name ?? `player ${s.player_id}`,
      )
      const type = s.type?.developer_name === "DOUBTFUL" ? "Questionable" : "Missing Fixture"
      const v = { matchId, teamId, playerId, type, reason: s.type?.name ?? null }
      await db
        .insert(injury)
        .values(v)
        .onConflictDoUpdate({ target: [injury.matchId, injury.playerId], set: v })
      nInjuries += 1
    }
  }
  console.log(`injuries: ${nInjuries}`)

  // 3h) Commentaries (narração lance-a-lance): SportMonks `/commentaries/fixtures/:id` per FINISHED
  // fixture (state FT). We store the FULL feed (~96 lines/match on the PL); isGoal/isImportant flag
  // the highlights. player/relatedplayer reuse ensurePlayer — most lines reference players already in
  // playerIdBySm (lineups); commentary-only players get a stub. The include key comes back as
  // `relatedplayer` (lowercase). Idempotent: bulk upsert that does nothing on the unique commentary id
  // (post-match lines are immutable). Coverage is partial — fixtures without commentary are skipped.
  // @feature LIG-010
  let nCommentaries = 0
  let nFixturesWithComm = 0
  const finished = fixtures.filter((f) => f.state?.developer_name === "FT" && matchIdByFixture.has(f.id))
  for (const f of finished) {
    const matchId = matchIdByFixture.get(f.id)!
    let items: SmCommentary[]
    try {
      items = await sm<SmCommentary[]>(`/commentaries/fixtures/${f.id}?include=player;relatedPlayer`)
    } catch (e) {
      console.log(`  commentary fixture ${f.id}: ${(e as Error).message} — skip`)
      continue
    }
    if (!items.length) continue
    nFixturesWithComm += 1
    const rows = []
    for (const c of items) {
      const playerId = c.player ? await ensurePlayer(c.player.id, playerName(c.player)) : null
      const relatedPlayerId = c.relatedplayer ? await ensurePlayer(c.relatedplayer.id, playerName(c.relatedplayer)) : null
      rows.push({
        sportmonksCommentaryId: c.id,
        matchId,
        playerId,
        relatedPlayerId,
        comment: c.comment,
        minute: c.minute ?? null,
        extraMinute: c.extra_minute ?? null,
        isGoal: c.is_goal ?? false,
        isImportant: c.is_important ?? false,
        sortOrder: c.order,
      })
    }
    await db.insert(commentary).values(rows).onConflictDoNothing({ target: commentary.sportmonksCommentaryId })
    nCommentaries += rows.length
  }
  console.log(`commentaries: ${nCommentaries} (${nFixturesWithComm}/${finished.length} fixtures)`)

  console.log("✓ sync done")
}

main().then(() => process.exit(0))
