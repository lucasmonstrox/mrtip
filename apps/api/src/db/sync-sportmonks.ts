import { db } from "./client"
import { goal, league, lineup, lineupPlayer, match, nationality, player, standing, team } from "./schema"
import { env } from "../env"
import { uploadImagem } from "../lib/r2"
import { sm, smAll } from "../lib/sportmonks"
import { extractScore, type SportmonksScore } from "../lib/sportmonks-scores"

// SportMonks sync for the Premier League 2025/26 into Postgres. Runs under Bun (not on the edge):
//   bun run src/db/sync-sportmonks.ts
// Idempotent — re-running upserts by SportMonks id (fixture/team/league/standing/player).
//
// Pipeline: league+logo → standings (teams + logos + official table) → fixtures (results +
// starting lineup: creates player with nationality/dob/height and writes lineup/lineup_player).

const LEAGUE_ID = 8 // Premier League
const SEASON_ID = 25583 // 2025/2026 (last completed season)
const CODE = "PL" // domain key (URL)

// SportMonks lineup type_ids: starter (titular) vs bench (banco).
const LINEUP_STARTER = 11
const LINEUP_BENCH = 12

// SportMonks lineups.details stat type_ids (Match Facts) — per player per match.
const STAT = { rating: 118, minutes: 119, motm: 1490 } as const

// SportMonks goal-event developer_names → our goal.type. Por agora só goal vs owngoal: o pênalti
// convertido conta como gol normal (mantém o placar consistente). MISSED_PENALTY não é gol (fora).
const GOAL_TYPE: Record<string, "normal" | "penalty" | "own"> = {
  GOAL: "normal",
  PENALTY: "normal",
  OWNGOAL: "own",
}

// Standing detail type_ids (discovered on the real API — see standings/seasons/:id).
const DET = {
  played: 129,
  won: 130,
  drawn: 131,
  lost: 132,
  goalsFor: 133,
  goalsAgainst: 134,
  goalDifference: 179,
} as const

type SmLeague = { id: number; name: string; image_path: string; country?: { name: string } }
type SmSeason = { id: number; name: string }
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
  image_path?: string
  nationality_id?: number
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
}
type SmCountry = { id: number; name: string; fifa_name?: string; iso2?: string; image_path?: string }

function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function detVal(details: SmDetail[], typeId: number): number {
  return details.find((d) => d.type_id === typeId)?.value ?? 0
}

// SportMonks standing `rule.type.developer_name` → normalized zone (or null for mid-table).
function normalizeZone(dev?: string): string | null {
  if (!dev) return null
  if (dev.includes("CHAMPIONS")) return "champions"
  if (dev.includes("EUROPA")) return "europa"
  if (dev.includes("CONFERENCE")) return "conference"
  if (dev.includes("RELEGATION")) return "relegation"
  return null
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

async function main() {
  // 1) League + logo ------------------------------------------------------------
  const apiLeague = await sm<SmLeague>(`/leagues/${LEAGUE_ID}?include=country`)
  const apiSeason = await sm<SmSeason>(`/seasons/${SEASON_ID}`)
  const leagueLogo = await uploadImagem(apiLeague.image_path, imgKey("leagues", apiLeague.name, apiLeague.image_path))
  console.log(`league: ${apiLeague.name} (${apiSeason.name})`)

  const leagueValues = {
    code: CODE,
    sportmonksLeagueId: apiLeague.id,
    sportmonksSeasonId: SEASON_ID,
    name: apiLeague.name,
    country: apiLeague.country?.name ?? "—",
    season: apiSeason.name,
    logoUrl: leagueLogo,
  }
  await db
    .insert(league)
    .values(leagueValues)
    .onConflictDoUpdate({ target: league.code, set: leagueValues })

  // 2) Standings → teams + logos + official table -------------------------------
  const standings = await sm<SmStanding[]>(
    `/standings/seasons/${SEASON_ID}?include=participant;details;rule.type`,
  )
  const teamIdBySm = new Map<number, string>() // sportmonksTeamId → team.id (uuid)

  for (const row of standings) {
    const t = row.participant
    const logo = await uploadImagem(t.image_path, imgKey("teams", t.name, t.image_path))
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

  for (const row of standings) {
    const teamId = teamIdBySm.get(row.participant.id)!
    const values = {
      leagueCode: CODE,
      teamId,
      position: row.position,
      points: row.points,
      played: detVal(row.details, DET.played),
      won: detVal(row.details, DET.won),
      drawn: detVal(row.details, DET.drawn),
      lost: detVal(row.details, DET.lost),
      goalsFor: detVal(row.details, DET.goalsFor),
      goalsAgainst: detVal(row.details, DET.goalsAgainst),
      goalDifference: detVal(row.details, DET.goalDifference),
      zone: normalizeZone(row.rule?.type?.developer_name),
    }
    await db
      .insert(standing)
      .values(values)
      .onConflictDoUpdate({ target: [standing.leagueCode, standing.teamId], set: values })
  }
  console.log(`teams + standings: ${standings.length} rows`)

  // 3) Fixtures → results + starting lineup -------------------------------------
  // fixtures/between is capped at ~100 days per call, so we sweep the season in windows
  // (Aug/2025 → May/2026); the fixtureSeasons filter keeps only PL 2025/26. Dedup by id.
  // The lineups.player/lineups.position/formations includes bring the lineup in the SAME request.
  const WINDOWS: [string, string][] = [
    ["2025-08-01", "2025-10-31"],
    ["2025-11-01", "2026-01-31"],
    ["2026-02-01", "2026-04-30"],
    ["2026-05-01", "2026-06-01"],
  ]
  const byId = new Map<number, SmFixture>()
  for (const [from, to] of WINDOWS) {
    const window = await smAll<SmFixture>(
      `/fixtures/between/${from}/${to}?filters=fixtureSeasons:${SEASON_ID};lineupDetailTypes:${STAT.rating},${STAT.minutes},${STAT.motm}` +
        `&include=participants;scores;round;state;lineups.player;lineups.position;lineups.details;formations;events.type&per_page=50`,
    )
    for (const f of window) byId.set(f.id, f)
  }
  const fixtures = [...byId.values()]

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
    const values = {
      sportmonksFixtureId: f.id,
      leagueCode: CODE,
      round: Number(f.round?.name ?? 0),
      name: f.name,
      date: f.starting_at.slice(0, 10),
      time: f.starting_at.slice(11, 16),
      homeTeamId,
      awayTeamId,
      ...score,
      status: f.state?.developer_name ?? null,
    }
    const [m] = await db
      .insert(match)
      .values(values)
      .onConflictDoUpdate({ target: match.sportmonksFixtureId, set: values })
      .returning({ id: match.id })
    matchIdByFixture.set(f.id, m!.id)
  }
  console.log(`matches: ${matchIdByFixture.size} written`)

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
      imageUrl: photoByPlayer.get(pl.id) ?? null,
      nationalityId: pl.nationality_id && countries.has(pl.nationality_id) ? pl.nationality_id : null,
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

    for (const [teamSmId, players2] of byTeam) {
      const teamId = teamIdBySm.get(teamSmId)
      if (!teamId) continue
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
          rating: stat(STAT.rating) ?? null,
          minutesPlayed: stat(STAT.minutes) ?? null,
          manOfMatch: stat(STAT.motm) === 1,
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

  // 3f) Goals (scorers) of every match, from events. Most scorers/assisters are already in
  // playerIdBySm (lineups); for any that aren't, upsert a minimal player (id + name). Upsert by
  // sportmonksEventId so re-sync is idempotent.
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
  for (const f of fixtures) {
    const matchId = matchIdByFixture.get(f.id)
    if (!matchId) continue
    for (const ev of f.events ?? []) {
      const type = GOAL_TYPE[ev.type?.developer_name ?? ""]
      if (!type || !ev.player_id) continue // not a goal (cards/subs/VAR/missed penalty) or no scorer
      const teamId = teamIdBySm.get(ev.participant_id)
      if (!teamId) continue
      const playerId = await ensurePlayer(ev.player_id, ev.player_name ?? `player ${ev.player_id}`)
      const assistId =
        ev.related_player_id && type !== "own"
          ? await ensurePlayer(ev.related_player_id, ev.related_player_name ?? `player ${ev.related_player_id}`)
          : null
      const g = { sportmonksEventId: ev.id, matchId, teamId, playerId, assistId, minute: ev.minute ?? null, type }
      await db.insert(goal).values(g).onConflictDoUpdate({ target: goal.sportmonksEventId, set: g })
      nGoals += 1
    }
  }
  console.log(`goals: ${nGoals}`)
  console.log("✓ sync done")
}

main().then(() => process.exit(0))
