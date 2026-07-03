// One-off (LIG-008): ingest ONE OLD PL season (default 2024/25 = 23614) with the same depth as the
// current-season sync, tagged with its own `season` row (isCurrent=false). Standalone on purpose —
// it does NOT touch sync-sportmonks.ts `main()` (under concurrent edit) and does NOT change the
// current season (no league upsert, no isCurrent demote). Skips commentaries (narration, not needed
// for the season-aware split/history). Idempotent (upserts by SportMonks ids). Run:
//   bun run scripts/sync-old-season.ts            # 2024/25
//   bun run scripts/sync-old-season.ts 23614      # explicit season id
import { db } from "../src/db/client"
import { card, goal, injury, lineup, lineupPlayer, match, nationality, player, season, standing, team, venue } from "../src/db/schema"
import { env } from "../src/env"
import { uploadImagem } from "../src/lib/r2"
import { sm, smAll } from "../src/lib/sportmonks"
import { matchSlug, slugify } from "../src/db/slug"
import { extractScore, type SportmonksScore } from "../src/lib/sportmonks-scores"

const LEAGUE_ID = 8
const CODE = "PL"
const SEASON_ID = Number(process.argv[2] ?? 23614) // 2024/2025
// Date windows covering the 2024/25 PL season (Aug 2024 → Jun 2025); fixtureSeasons filter keeps only it.
const WINDOWS: [string, string][] = [
  ["2024-08-01", "2024-10-31"],
  ["2024-11-01", "2025-01-31"],
  ["2025-02-01", "2025-04-30"],
  ["2025-05-01", "2025-06-30"],
]

const LINEUP_STARTER = 11
const LINEUP_BENCH = 12
const STAT = { rating: 118, minutes: 119, motm: 1490, keyPasses: 117, shotsOnTarget: 86 } as const
const GOAL_TYPE: Record<string, "normal" | "penalty" | "own"> = { GOAL: "normal", PENALTY: "penalty", OWNGOAL: "own" } // @feature DOS-002 (fix do pênalti; 24/25 precisa re-sync)
const CARD_TYPE: Record<string, "yellow" | "red" | "yellowred"> = { YELLOWCARD: "yellow", REDCARD: "red", YELLOWREDCARD: "yellowred" }
const DET = {
  played: 129, won: 130, drawn: 131, lost: 132, goalsFor: 133, goalsAgainst: 134, goalDifference: 179,
  homePlayed: 135, homeWon: 136, homeDrawn: 137, homeLost: 138, homeGoalsFor: 139, homeGoalsAgainst: 140,
  awayPlayed: 141, awayWon: 142, awayDrawn: 143, awayLost: 144, awayGoalsFor: 145, awayGoalsAgainst: 146,
} as const

type SmLeague = { id: number; name: string; image_path: string; country?: { name: string } }
type SmSeason = { id: number; name: string }
type SmTeam = { id: number; name: string; short_code?: string; image_path: string }
type SmDetail = { type_id: number; value: number }
type SmStanding = { position: number; points: number; participant: SmTeam; details: SmDetail[]; rule?: { type?: { developer_name?: string } } }
type SmPlayer = { id: number; display_name?: string; name?: string; date_of_birth?: string; height?: number; weight?: number; image_path?: string; nationality_id?: number }
type SmLineup = { team_id: number; type_id: number; jersey_number?: number; formation_field?: string; player?: SmPlayer; position?: { developer_name?: string }; details?: { type_id: number; data?: { value?: number } }[] }
type SmFormation = { participant_id: number; formation: string }
type SmEvent = { id: number; type_id: number; type?: { developer_name?: string }; participant_id: number; player_id?: number; player_name?: string; related_player_id?: number; related_player_name?: string; minute?: number }
type SmVenue = { id: number; name: string; city_name?: string | null; capacity?: number | null; surface?: string | null; latitude?: string | null; longitude?: string | null; image_path?: string | null }
type SmSidelined = { participant_id: number; player_id: number; player?: { id: number; name?: string; common_name?: string }; type?: { name: string; developer_name: string } }
type SmFixture = {
  id: number; name: string; starting_at: string; round?: { name: string }; state?: { developer_name: string }
  participants: { id: number; meta: { location: "home" | "away" } }[]
  scores?: SportmonksScore[]; lineups?: SmLineup[]; formations?: SmFormation[]; events?: SmEvent[]; sidelined?: SmSidelined[]; venue?: SmVenue | null
}
type SmCountry = { id: number; name: string; fifa_name?: string; iso2?: string; image_path?: string }

function detVal(details: SmDetail[], typeId: number): number {
  return details.find((d) => d.type_id === typeId)?.value ?? 0
}
function normalizeZone(dev?: string): string | null {
  if (!dev) return null
  if (dev.includes("CHAMPIONS")) return "champions"
  if (dev.includes("EUROPA")) return "europa"
  if (dev.includes("CONFERENCE")) return "conference"
  if (dev.includes("RELEGATION")) return "relegation"
  return null
}
function imgKey(folder: string, name: string, imagePath: string, suffix?: number | string): string {
  const ext = imagePath.split("?")[0]!.split(".").pop() ?? "png"
  const base = suffix != null ? `${slugify(name)}-${suffix}` : slugify(name)
  return `${folder}/${base}.${ext}`
}
function shortPosition(dev?: string): string | null {
  if (!dev) return null
  const d = dev.toUpperCase()
  if (d.startsWith("GOAL")) return "G"
  if (d.startsWith("DEF")) return "D"
  if (d.startsWith("MID")) return "M"
  return "F"
}
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

async function main() {
  const t0 = Date.now()
  const apiLeague = await sm<SmLeague>(`/leagues/${LEAGUE_ID}?include=country`)
  const apiSeason = await sm<SmSeason>(`/seasons/${SEASON_ID}`)
  console.log(`OLD season: ${apiLeague.name} (${apiSeason.name}) — id ${SEASON_ID}`)

  // Season row (NOT current). Does not touch the league row or the current season's isCurrent flag.
  const seasonValues = {
    sportmonksSeasonId: SEASON_ID,
    leagueCode: CODE,
    name: apiSeason.name,
    startYear: Number(apiSeason.name.slice(0, 4)),
    isCurrent: false,
  }
  const [seasonRow] = await db
    .insert(season)
    .values(seasonValues)
    .onConflictDoUpdate({ target: season.sportmonksSeasonId, set: seasonValues })
    .returning({ id: season.id })
  const seasonId = seasonRow!.id

  // Standings → teams (relegated ones get added; shared ones harmlessly re-upserted) + official table.
  const standings = await sm<SmStanding[]>(`/standings/seasons/${SEASON_ID}?include=participant;details;rule.type`)
  const teamIdBySm = new Map<number, string>()
  const teamNameBySm = new Map<number, string>()
  for (const row of standings) {
    const t = row.participant
    teamNameBySm.set(t.id, t.name)
    const logo = await uploadImagem(t.image_path, imgKey("teams", t.name, t.image_path))
    const [r] = await db
      .insert(team)
      .values({ sportmonksTeamId: t.id, name: t.name, slug: slugify(t.name), shortCode: t.short_code ?? null, logoUrl: logo })
      .onConflictDoUpdate({ target: team.sportmonksTeamId, set: { name: t.name, slug: slugify(t.name), shortCode: t.short_code ?? null, logoUrl: logo } })
      .returning({ id: team.id })
    teamIdBySm.set(t.id, r!.id)
  }
  for (const row of standings) {
    const teamId = teamIdBySm.get(row.participant.id)!
    const values = {
      leagueCode: CODE, teamId, seasonId, position: row.position, points: row.points,
      played: detVal(row.details, DET.played), won: detVal(row.details, DET.won), drawn: detVal(row.details, DET.drawn), lost: detVal(row.details, DET.lost),
      goalsFor: detVal(row.details, DET.goalsFor), goalsAgainst: detVal(row.details, DET.goalsAgainst), goalDifference: detVal(row.details, DET.goalDifference),
      homePlayed: detVal(row.details, DET.homePlayed), homeWon: detVal(row.details, DET.homeWon), homeDrawn: detVal(row.details, DET.homeDrawn), homeLost: detVal(row.details, DET.homeLost),
      homeGoalsFor: detVal(row.details, DET.homeGoalsFor), homeGoalsAgainst: detVal(row.details, DET.homeGoalsAgainst),
      awayPlayed: detVal(row.details, DET.awayPlayed), awayWon: detVal(row.details, DET.awayWon), awayDrawn: detVal(row.details, DET.awayDrawn), awayLost: detVal(row.details, DET.awayLost),
      awayGoalsFor: detVal(row.details, DET.awayGoalsFor), awayGoalsAgainst: detVal(row.details, DET.awayGoalsAgainst),
      zone: normalizeZone(row.rule?.type?.developer_name),
    }
    await db.insert(standing).values(values).onConflictDoUpdate({ target: [standing.seasonId, standing.teamId], set: values })
  }
  console.log(`teams + standings: ${standings.length}`)

  // Fixtures (results + lineup + events + sidelined + venue), swept by window.
  const byId = new Map<number, SmFixture>()
  for (const [from, to] of WINDOWS) {
    const win = await smAll<SmFixture>(
      `/fixtures/between/${from}/${to}?filters=fixtureSeasons:${SEASON_ID};lineupDetailTypes:${STAT.rating},${STAT.minutes},${STAT.motm},${STAT.keyPasses},${STAT.shotsOnTarget}` +
        `&include=participants;scores;round;state;lineups.player.metadata;lineups.position;lineups.details;formations;events.type;sidelined.player;sidelined.type;venue&per_page=50`,
    )
    for (const f of win) byId.set(f.id, f)
  }
  const fixtures = [...byId.values()]
  console.log(`fixtures: ${fixtures.length}`)

  // Venues first (so venueId exists when the match is inserted).
  const venuesById = new Map<number, SmVenue>()
  for (const f of fixtures) if (f.venue) venuesById.set(f.venue.id, f.venue)
  const venues = [...venuesById.values()]
  const venueImgById = new Map<number, string | null>()
  await pool(venues, 8, async (v) => {
    venueImgById.set(v.id, v.image_path ? await uploadImagem(v.image_path, imgKey("venues", v.name, v.image_path, v.id)) : null)
  })
  const venueIdBySm = new Map<number, string>()
  for (const v of venues) {
    const vv = { sportmonksVenueId: v.id, name: v.name, cityName: v.city_name ?? null, capacity: v.capacity ?? null, surface: v.surface ?? null, latitude: v.latitude ?? null, longitude: v.longitude ?? null, imageUrl: venueImgById.get(v.id) ?? null }
    const [r] = await db.insert(venue).values(vv).onConflictDoUpdate({ target: venue.sportmonksVenueId, set: vv }).returning({ id: venue.id })
    venueIdBySm.set(v.id, r!.id)
  }
  console.log(`venues: ${venues.length}`)

  // Matches.
  const matchIdByFixture = new Map<number, string>()
  let noResult = 0
  for (const f of fixtures) {
    const home = f.participants.find((p) => p.meta.location === "home")
    const away = f.participants.find((p) => p.meta.location === "away")
    if (!home || !away) continue
    const homeTeamId = teamIdBySm.get(home.id)
    const awayTeamId = teamIdBySm.get(away.id)
    if (!homeTeamId || !awayTeamId) throw new Error(`team outside standings in fixture ${f.id} (${home.id} vs ${away.id})`)
    const score = extractScore(f.scores)
    if (score.ftHome == null) noResult += 1
    const slug = matchSlug(apiLeague.name, apiSeason.name, teamNameBySm.get(home.id) ?? f.name, teamNameBySm.get(away.id) ?? "")
    const values = {
      sportmonksFixtureId: f.id, leagueCode: CODE, round: Number(f.round?.name ?? 0), name: f.name, slug,
      date: f.starting_at.slice(0, 10), time: f.starting_at.slice(11, 16), homeTeamId, awayTeamId,
      venueId: f.venue ? venueIdBySm.get(f.venue.id) ?? null : null, seasonId, ...score, status: f.state?.developer_name ?? null,
    }
    const [m] = await db.insert(match).values(values).onConflictDoUpdate({ target: match.sportmonksFixtureId, set: values }).returning({ id: match.id })
    matchIdByFixture.set(f.id, m!.id)
  }
  console.log(`matches: ${matchIdByFixture.size} (sem resultado: ${noResult})`)

  // Players + nationalities from lineups.
  const lineupOf = (f: SmFixture) => (f.lineups ?? []).filter((l) => (l.type_id === LINEUP_STARTER || l.type_id === LINEUP_BENCH) && l.player)
  const playersById = new Map<number, SmPlayer>()
  const natIds = new Set<number>()
  for (const f of fixtures) for (const l of lineupOf(f)) { playersById.set(l.player!.id, l.player!); if (l.player!.nationality_id) natIds.add(l.player!.nationality_id) }

  const countries = await fetchCountries()
  const usedNats = [...natIds].map((id) => countries.get(id)).filter((c): c is SmCountry => !!c)
  const flagByNat = new Map<number, string | null>()
  await pool(usedNats, 8, async (c) => { flagByNat.set(c.id, c.image_path ? await uploadImagem(c.image_path, imgKey("nationalities", c.name, c.image_path)) : null) })
  for (const c of usedNats) {
    const v = { id: c.id, name: c.name, fifaName: c.fifa_name ?? null, iso2: c.iso2 ?? null, flagUrl: flagByNat.get(c.id) ?? null }
    await db.insert(nationality).values(v).onConflictDoUpdate({ target: nationality.id, set: v })
  }
  console.log(`nationalities: ${usedNats.length}`)

  const playerName = (pl: SmPlayer) => pl.display_name ?? pl.name ?? `player ${pl.id}`
  const players = [...playersById.values()]
  const photoByPlayer = new Map<number, string | null>()
  await pool(players, 8, async (pl) => { photoByPlayer.set(pl.id, pl.image_path ? await uploadImagem(pl.image_path, imgKey("players", playerName(pl), pl.image_path, pl.id)) : null) })
  const playerIdBySm = new Map<number, string>()
  for (const pl of players) {
    const v = { sportmonksPlayerId: pl.id, name: playerName(pl), dateOfBirth: pl.date_of_birth ?? null, height: pl.height ?? null, weight: pl.weight ?? null, imageUrl: photoByPlayer.get(pl.id) ?? null, nationalityId: pl.nationality_id && countries.has(pl.nationality_id) ? pl.nationality_id : null }
    const [j] = await db.insert(player).values(v).onConflictDoUpdate({ target: player.sportmonksPlayerId, set: v }).returning({ id: player.id })
    playerIdBySm.set(pl.id, j!.id)
  }
  console.log(`players: ${players.length}`)

  // Lineups.
  let nLineups = 0, nLp = 0, matchesWithLineup = 0
  for (const f of fixtures) {
    const entries = lineupOf(f)
    const matchId = matchIdByFixture.get(f.id)
    if (!entries.length || !matchId) continue
    matchesWithLineup += 1
    const formationByTeam = new Map<number, string>()
    for (const fm of f.formations ?? []) formationByTeam.set(fm.participant_id, fm.formation)
    const byTeam = new Map<number, SmLineup[]>()
    for (const l of entries) byTeam.set(l.team_id, [...(byTeam.get(l.team_id) ?? []), l])
    for (const [teamSmId, ps] of byTeam) {
      const teamId = teamIdBySm.get(teamSmId)
      if (!teamId) continue
      const [lu] = await db.insert(lineup).values({ matchId, teamId, formation: formationByTeam.get(teamSmId) ?? null })
        .onConflictDoUpdate({ target: [lineup.matchId, lineup.teamId], set: { formation: formationByTeam.get(teamSmId) ?? null } }).returning({ id: lineup.id })
      nLineups += 1
      for (const l of ps) {
        const playerId = playerIdBySm.get(l.player!.id)
        if (!playerId) continue
        const stat = (typeId: number) => l.details?.find((d) => d.type_id === typeId)?.data?.value
        const lp = { lineupId: lu!.id, playerId, number: l.jersey_number ?? null, position: shortPosition(l.position?.developer_name), starter: l.type_id === LINEUP_STARTER, grid: l.formation_field ?? null, rating: stat(STAT.rating) ?? null, minutesPlayed: stat(STAT.minutes) ?? null, keyPasses: stat(STAT.keyPasses) ?? null, shotsOnTarget: stat(STAT.shotsOnTarget) ?? null, manOfMatch: stat(STAT.motm) === 1 }
        await db.insert(lineupPlayer).values(lp).onConflictDoUpdate({ target: [lineupPlayer.lineupId, lineupPlayer.playerId], set: lp })
        nLp += 1
      }
    }
  }
  console.log(`lineups: ${nLineups} | lineup_players: ${nLp}`)

  // Goals + cards from events.
  const ensurePlayer = async (smId: number, name: string): Promise<string> => {
    const known = playerIdBySm.get(smId)
    if (known) return known
    const [j] = await db.insert(player).values({ sportmonksPlayerId: smId, name }).onConflictDoUpdate({ target: player.sportmonksPlayerId, set: { name } }).returning({ id: player.id })
    playerIdBySm.set(smId, j!.id)
    return j!.id
  }
  let nGoals = 0, nCards = 0, matchesWithEvents = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId) continue
    if (f.events?.length) matchesWithEvents += 1
    for (const ev of f.events ?? []) {
      if (!ev.player_id) continue
      const teamId = teamIdBySm.get(ev.participant_id)
      if (!teamId) continue
      const dev = ev.type?.developer_name ?? ""
      const minute = ev.minute ?? null
      const goalType = GOAL_TYPE[dev]
      if (goalType) {
        const playerId = await ensurePlayer(ev.player_id, ev.player_name ?? `player ${ev.player_id}`)
        const assistId = ev.related_player_id && goalType !== "own" ? await ensurePlayer(ev.related_player_id, ev.related_player_name ?? `player ${ev.related_player_id}`) : null
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

  // Sidelined (desfalques).
  let nInjuries = 0, matchesWithSidelined = 0
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId) continue
    if (f.sidelined?.length) matchesWithSidelined += 1
    for (const s of f.sidelined ?? []) {
      if (!s.player_id) continue
      const teamId = teamIdBySm.get(s.participant_id)
      if (!teamId) continue
      const playerId = await ensurePlayer(s.player_id, s.player?.common_name ?? s.player?.name ?? `player ${s.player_id}`)
      const type = s.type?.developer_name === "DOUBTFUL" ? "Questionable" : "Missing Fixture"
      const v = { matchId, teamId, playerId, type, reason: s.type?.name ?? null }
      await db.insert(injury).values(v).onConflictDoUpdate({ target: [injury.matchId, injury.playerId], set: v })
      nInjuries += 1
    }
  }
  console.log(`injuries: ${nInjuries}`)

  const n = matchIdByFixture.size || 1
  const pct = (x: number) => `${Math.round((x / n) * 100)}%`
  console.log("\n=== COBERTURA (season antiga) ===")
  console.log(`matches: ${n} | com lineup: ${matchesWithLineup} (${pct(matchesWithLineup)}) | com eventos: ${matchesWithEvents} (${pct(matchesWithEvents)}) | com desfalque: ${matchesWithSidelined} (${pct(matchesWithSidelined)})`)
  console.log(`tempo: ${Math.round((Date.now() - t0) / 1000)}s`)
  process.exit(0)
}

main()
