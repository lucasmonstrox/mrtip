import { boolean, date, integer, jsonb, numeric, pgTable, real, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"

// League + season (one row per league/season). `code` is the domain key (e.g. "PL"), used in the
// URL and as the match FK. `sportmonksLeagueId` is the SportMonks league id (Premier League = 8);
// `sportmonksSeasonId` is the synced season (2025/26 = 25583).
export const league = pgTable("league", {
  code: text("code").primaryKey(),
  sportmonksLeagueId: integer("sportmonks_league_id").notNull(),
  sportmonksSeasonId: integer("sportmonks_season_id").notNull(),
  name: text("name").notNull(),
  country: text("country").notNull(),
  season: text("season").notNull(),
  // Logo URL in R2 (bucket mrtip); origin is the SportMonks CDN `image_path`.
  logoUrl: text("logo_url"),
})

export type League = typeof league.$inferSelect

// Season of a league (one row per league/season). `sportmonksSeasonId` is the natural key from the
// source; `name` is the display label ("2024/2025"); `startYear` orders seasons (2024 for 2024/25);
// `isCurrent` marks the single live season per league (default view). Reads are scoped by season via
// `match.seasonId`/`standing.seasonId`; the league stays one row per `code` ("PL"). @feature LIG-008
export const season = pgTable("season", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksSeasonId: integer("sportmonks_season_id").notNull().unique(),
  leagueCode: text("league_code")
    .notNull()
    .references(() => league.code),
  name: text("name").notNull(),
  startYear: integer("start_year").notNull(),
  isCurrent: boolean("is_current").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Season = typeof season.$inferSelect

// Team/club — own entity with a stable id. `sportmonksTeamId` (SportMonks team id) is the natural
// dedup key across matches/seasons. `slug` (kebab of the name) is what goes in URLs.
export const team = pgTable("team", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksTeamId: integer("sportmonks_team_id").notNull().unique(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  // SportMonks short code (e.g. "ARS"); nullable because not every team has one.
  shortCode: text("short_code"),
  // Logo URL in R2 (bucket mrtip); origin is the SportMonks CDN `image_path`.
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Team = typeof team.$inferSelect

// Venue (stadium) — own entity, deduped by `sportmonksVenueId`. The match's actual venue (handles
// neutral grounds). `latitude`/`longitude` come from SportMonks as strings (numeric here; Number()
// at the edge) and feed the travel/fatigue signal (SIN-008) + territorial proximity (SIN-007) —
// they are NOT displayed. `cityName` denormalized for display; `imageUrl` is the photo in R2.
// @feature LIG-004
export const venue = pgTable("venue", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksVenueId: integer("sportmonks_venue_id").notNull().unique(),
  name: text("name").notNull(),
  cityName: text("city_name"),
  capacity: integer("capacity"),
  surface: text("surface"), // "grass" | "artificial" | null
  latitude: numeric("latitude", { precision: 9, scale: 6 }),
  longitude: numeric("longitude", { precision: 9, scale: 6 }),
  imageUrl: text("image_url"), // stadium photo in R2 (bucket mrtip); origin SportMonks image_path
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Venue = typeof venue.$inferSelect

// Match of a season. `sportmonksFixtureId` ties the match to the source — it's what the lineup is
// matched by. Teams normalized (FK → team.id). Score flattened into 4 nullable columns
// (null = no result). `date` (yyyy-MM-dd) + `time` (HH:mm) kept separate.
export const match = pgTable("match", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksFixtureId: integer("sportmonks_fixture_id").notNull().unique(),
  leagueCode: text("league_code")
    .notNull()
    .references(() => league.code),
  round: integer("round").notNull(),
  name: text("name").notNull(),
  // Pretty, collision-free URL key (kebab of league-season-home-vs-away, e.g.
  // "premier-league-2025-2026-chelsea-vs-everton") — what goes in /matches/:slug. @feature LIG-009
  slug: text("slug").notNull().unique(),
  date: date("date", { mode: "string" }).notNull(),
  time: text("time"),
  homeTeamId: uuid("home_team_id")
    .notNull()
    .references(() => team.id),
  awayTeamId: uuid("away_team_id")
    .notNull()
    .references(() => team.id),
  // Actual venue of this match (FK → venue.id); nullable until re-synced. @feature LIG-004
  venueId: uuid("venue_id").references(() => venue.id),
  // Season this match belongs to (FK → season.id); nullable until backfilled. Reads scope by it so
  // multiple seasons of the same league don't mix. @feature LIG-008
  seasonId: uuid("season_id").references(() => season.id),
  ftHome: integer("ft_home"),
  ftAway: integer("ft_away"),
  htHome: integer("ht_home"),
  htAway: integer("ht_away"),
  // SportMonks match state (state developer_name): "FT", "NS", "POSTP", etc.
  status: text("status"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Match = typeof match.$inferSelect

// OFFICIAL SportMonks standing (standings/seasons/:id) — one row per team per league. Source of
// truth for the table: already comes with points, deductions and tiebreaker ordering applied, so
// nothing is recomputed from results. Re-sync upserts by (leagueCode, teamId).
export const standing = pgTable(
  "standing",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leagueCode: text("league_code")
      .notNull()
      .references(() => league.code),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id),
    // Season of this standing row (FK → season.id); nullable until backfilled. The dedup key becomes
    // (seasonId, teamId) so the same team has one row per season. @feature LIG-008
    seasonId: uuid("season_id").references(() => season.id),
    position: integer("position").notNull(),
    points: integer("points").notNull(),
    played: integer("played").notNull(),
    won: integer("won").notNull(),
    drawn: integer("drawn").notNull(),
    lost: integer("lost").notNull(),
    goalsFor: integer("goals_for").notNull(),
    goalsAgainst: integer("goals_against").notNull(),
    goalDifference: integer("goal_difference").notNull(),
    // Official HOME/AWAY split of the season record (SportMonks standing detail type_ids 135-146).
    // Nullable: only populated on re-sync after this column was added; older rows stay null.
    // @feature LIG-002
    homePlayed: integer("home_played"),
    homeWon: integer("home_won"),
    homeDrawn: integer("home_drawn"),
    homeLost: integer("home_lost"),
    homeGoalsFor: integer("home_goals_for"),
    homeGoalsAgainst: integer("home_goals_against"),
    awayPlayed: integer("away_played"),
    awayWon: integer("away_won"),
    awayDrawn: integer("away_drawn"),
    awayLost: integer("away_lost"),
    awayGoalsFor: integer("away_goals_for"),
    awayGoalsAgainst: integer("away_goals_against"),
    // Qualification/relegation zone of the position (from SportMonks `rule.type`), normalized:
    // "champions" | "europa" | "conference" | "relegation" | null (mid-table).
    zone: text("zone"),
  },
  // Dedup by (seasonId, teamId): one standing per team per season. @feature LIG-008
  (t) => [unique().on(t.seasonId, t.teamId)],
)

export type Standing = typeof standing.$inferSelect

// Nationality = the SportMonks Country entity (stable id as PK). The player's `nationality_id` and
// `country_id` both point here; we use the sporting nationality (national team / flag).
export const nationality = pgTable("nationality", {
  id: integer("id").primaryKey(), // SportMonks country id (e.g. Brazil = 5)
  name: text("name").notNull(), // "Brazil"
  fifaName: text("fifa_name"), // "BRA"
  iso2: text("iso2"), // "BR"
  flagUrl: text("flag_url"), // flag in R2 (bucket mrtip)
})

export type Nationality = typeof nationality.$inferSelect

// Player — own entity, deduped by `sportmonksPlayerId`. `nationalityId` comes from the player's
// `nationality_id` (sporting nationality). `height` in cm; `imageUrl` is the profile photo in R2
// (not season-specific).
export const player = pgTable("player", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksPlayerId: integer("sportmonks_player_id").notNull().unique(),
  name: text("name").notNull(),
  dateOfBirth: date("date_of_birth", { mode: "string" }),
  height: integer("height"), // cm
  weight: integer("weight"), // kg
  imageUrl: text("image_url"),
  nationalityId: integer("nationality_id").references(() => nationality.id),
})

export type Player = typeof player.$inferSelect

// Coach — own entity (stable id for /coaches/:id URLs). `sportmonksCoachId` is filled when the
// lineup is (re)imported with coach.id; name is unique (dedup key).
export const coach = pgTable("coach", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksCoachId: integer("sportmonks_coach_id").unique(),
  name: text("name").notNull().unique(),
})

export type Coach = typeof coach.$inferSelect

// Lineup of ONE team in ONE match: formation + coach. Players live in lineup_player. `coachName`
// (text) is the denormalized name; `coachId` links to the entity.
// unique(matchId, teamId) — one lineup per team per match.
export const lineup = pgTable(
  "lineup",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id),
    formation: text("formation"),
    coachName: text("coach_name"),
    coachId: uuid("coach_id").references(() => coach.id),
  },
  (t) => [unique().on(t.matchId, t.teamId)],
)

export type Lineup = typeof lineup.$inferSelect

// A player within a lineup: starter or bench, with number/position/grid.
export const lineupPlayer = pgTable(
  "lineup_player",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    lineupId: uuid("lineup_id")
      .notNull()
      .references(() => lineup.id),
    playerId: uuid("player_id")
      .notNull()
      .references(() => player.id),
    number: integer("number"),
    position: text("position"), // G/D/M/F
    starter: boolean("starter").notNull(),
    grid: text("grid"), // pitch position, e.g. "1:1"
    // Per-player match stats from SportMonks Match Facts (lineups.details).
    rating: real("rating"), // type 118, e.g. 6.59; null when not rated
    minutesPlayed: integer("minutes_played"), // type 119
    keyPasses: integer("key_passes"), // type 117 — last pass leading to a teammate's shot; null = 0 or didn't play
    shotsOnTarget: integer("shots_on_target"), // type 86 — null = 0 or didn't play; SUM per team = team SoT that match
    manOfMatch: boolean("man_of_match").notNull().default(false), // type 1490
  },
  (t) => [unique().on(t.lineupId, t.playerId)],
)

export type LineupPlayer = typeof lineupPlayer.$inferSelect

// Per-team match statistics from the SportMonks fixture `statistics` include (team-level, one row per
// team per match). Volume/quality inputs for the prognosis dossier that DON'T exist per-player in our
// feed: ball possession, total/inside-box shots, big chances created. `shotsOnTarget` here is the
// OFFICIAL team total (cross-check vs SUM of lineup_player). `xg` is reserved (nullable) for the
// SportMonks xG add-on (type 5304), not yet purchased. @feature DOS-002
export const matchTeamStats = pgTable(
  "match_team_stats",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id),
    possession: integer("possession"), // type 45 BALL_POSSESSION (%)
    shotsTotal: integer("shots_total"), // type 42
    shotsInsidebox: integer("shots_insidebox"), // type 49
    shotsOutsidebox: integer("shots_outsidebox"), // type 50
    shotsOnTarget: integer("shots_on_target"), // type 86 — official team total
    bigChancesCreated: integer("big_chances_created"), // type 580
    dangerousAttacks: integer("dangerous_attacks"), // type 44
    corners: integer("corners"), // type 34
    xg: real("xg"), // type 5304 — NULL até o add-on de xG (DOS-002 fase 2)
  },
  (t) => [unique().on(t.matchId, t.teamId)],
)

export type MatchTeamStats = typeof matchTeamStats.$inferSelect

// Injury/absence: a player who missed (or was doubtful for) ONE match. `type` = "Missing Fixture"
// (didn't play) or "Questionable" (doubt); `reason` = cause (e.g. "Muscle Injury", "Suspended").
// unique(matchId, playerId).
export const injury = pgTable(
  "injury",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id),
    playerId: uuid("player_id")
      .notNull()
      .references(() => player.id),
    type: text("type").notNull(),
    reason: text("reason"),
  },
  (t) => [unique().on(t.matchId, t.playerId)],
)

export type Injury = typeof injury.$inferSelect

// Goal of a match. `teamId` = scoring team (on an own goal, the benefited team); `playerId` =
// scorer (on an own goal, who scored it); `assistId` = who assisted (nullable). `type` =
// "normal" | "penalty" | "own". `minute` in match minutes.
export const goal = pgTable("goal", {
  id: uuid("id").primaryKey().defaultRandom(),
  // SportMonks event id — dedup key so re-sync upserts instead of duplicating.
  sportmonksEventId: integer("sportmonks_event_id").notNull().unique(),
  matchId: uuid("match_id")
    .notNull()
    .references(() => match.id, { onDelete: "cascade" }),
  teamId: uuid("team_id")
    .notNull()
    .references(() => team.id),
  playerId: uuid("player_id")
    .notNull()
    .references(() => player.id),
  assistId: uuid("assist_id").references(() => player.id),
  minute: integer("minute"),
  type: text("type").notNull(),
})

export type Goal = typeof goal.$inferSelect

// Card of a match. `type` = "yellow" | "red" (straight red) | "yellowred" (second yellow → off).
// `playerId` = booked player; `minute` in match minutes. Dedup by SportMonks event id.
export const card = pgTable("card", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksEventId: integer("sportmonks_event_id").notNull().unique(),
  matchId: uuid("match_id")
    .notNull()
    .references(() => match.id, { onDelete: "cascade" }),
  teamId: uuid("team_id")
    .notNull()
    .references(() => team.id),
  playerId: uuid("player_id")
    .notNull()
    .references(() => player.id),
  minute: integer("minute"),
  type: text("type").notNull(),
})

export type Card = typeof card.$inferSelect

// Play-by-play commentary of a match (SportMonks `GET /commentaries/fixtures/:id`): the textual
// narration of every action — corners, fouls, shots, goals, cards. We store the FULL feed (~96
// lines/match on the PL); `isGoal`/`isImportant` flag the highlights for display/consumption.
// `playerId`/`relatedPlayerId` link the line to the player(s) involved (nullable — framing lines like
// "First Half starts" have none). `sortOrder` is SportMonks' `order` (a large, increasing int — the
// canonical chronological key, NOT 1,2,3). Dedup by `sportmonksCommentaryId` so re-sync is idempotent.
// @feature LIG-010
export const commentary = pgTable("commentary", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksCommentaryId: integer("sportmonks_commentary_id").notNull().unique(),
  matchId: uuid("match_id")
    .notNull()
    .references(() => match.id, { onDelete: "cascade" }),
  playerId: uuid("player_id").references(() => player.id),
  relatedPlayerId: uuid("related_player_id").references(() => player.id),
  comment: text("comment").notNull(),
  minute: integer("minute"),
  extraMinute: integer("extra_minute"),
  isGoal: boolean("is_goal").notNull().default(false),
  isImportant: boolean("is_important").notNull().default(false),
  sortOrder: integer("sort_order").notNull(),
})

export type Commentary = typeof commentary.$inferSelect

// Prognóstico de expected goals de uma partida gerado por um LLM (deepseek-v4-pro, reasoning xhigh).
// Uma linha por RUN (matchId+model+runAt único) — guarda métricas E textos E auditoria do raciocínio,
// pra alimentar a aba "Prognóstico" na UI e auditar depois. xG/probabilidades em `real`; os objetos
// aninhados (faixas de 15min, 1x2 nos 3 recortes, drivers, saída crua) em `jsonb` tipado.
type XgBands = Record<"0-15" | "16-30" | "31-45" | "46-60" | "61-75" | "76-90", number>
type OneXTwo = { home: number; draw: number; away: number }
export const matchPrognosis = pgTable(
  "match_prognosis",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id, { onDelete: "cascade" }),
    // Proveniência do run.
    model: text("model").notNull(), // "deepseek-v4-pro"
    reasoningEffort: text("reasoning_effort"), // "xhigh"
    runAt: timestamp("run_at", { withTimezone: true }).notNull(),

    // --- Métricas POR TIME (mandante) ---
    xgHome: real("xg_home").notNull(),
    xgHome1t: real("xg_home_1t").notNull(),
    xgHome2t: real("xg_home_2t").notNull(),
    xgHomeBands: jsonb("xg_home_bands").$type<XgBands>().notNull(),
    resumoHome: text("resumo_home").notNull(), // leitura do mandante

    // --- Métricas POR TIME (visitante) ---
    xgAway: real("xg_away").notNull(),
    xgAway1t: real("xg_away_1t").notNull(),
    xgAway2t: real("xg_away_2t").notNull(),
    xgAwayBands: jsonb("xg_away_bands").$type<XgBands>().notNull(),
    resumoAway: text("resumo_away").notNull(), // leitura do visitante

    // --- GERAL (agregados do jogo) ---
    total: real("total").notNull(),
    total1t: real("total_1t").notNull(),
    total2t: real("total_2t").notNull(),
    over25Prob: real("over25_prob").notNull(),
    bttsProb: real("btts_prob").notNull(),
    oneXTwo: jsonb("one_x_two").$type<OneXTwo>().notNull(), // resultado do jogo (90min)
    oneXTwo1t: jsonb("one_x_two_1t").$type<OneXTwo>().notNull(), // placar do 1º tempo
    oneXTwo2t: jsonb("one_x_two_2t").$type<OneXTwo>().notNull(), // 2º tempo isolado
    confianca: text("confianca").notNull(), // "baixa" | "media" | "alta"
    resumoGeral: text("resumo_geral").notNull(), // parágrafo do jogo + maior incerteza
    drivers: jsonb("drivers").$type<string[]>().notNull(), // 3 fatores

    // --- BEST BET (leitura de apostador: a decisão + análise). Nullable: runs antigas não têm. ---
    bestBetMarket: text("best_bet_market"), // "1x2" | "over_under" | "btts" | "none"
    bestBetSelection: text("best_bet_selection"), // "home"|"draw"|"away"|"over"|"under"|"yes"|"no"|"none"
    bestBetLine: real("best_bet_line"), // 2.5 etc. pra over_under; null nos outros
    bestBetConfidence: text("best_bet_confidence"), // "low" | "medium" | "high"
    bestBetProbability: real("best_bet_probability"), // 0-1
    bestBetAnalysis: text("best_bet_analysis"), // análise completa (PT — texto visível de UI)

    // --- Auditoria ---
    reasoning: text("reasoning"), // cadeia de raciocínio (reasoning_content) em PT
    promptText: text("prompt_text"), // o dossiê exato enviado
    rawOutput: jsonb("raw_output"), // objeto tipado cru, pra não perder nada
    reasoningTokens: integer("reasoning_tokens"),
    totalTokens: integer("total_tokens"),
    latencyMs: integer("latency_ms"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique().on(t.matchId, t.model, t.runAt)],
)

export type MatchPrognosis = typeof matchPrognosis.$inferSelect
