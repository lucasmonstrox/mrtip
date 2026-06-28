import { boolean, date, integer, pgTable, real, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"

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
  date: date("date", { mode: "string" }).notNull(),
  time: text("time"),
  homeTeamId: uuid("home_team_id")
    .notNull()
    .references(() => team.id),
  awayTeamId: uuid("away_team_id")
    .notNull()
    .references(() => team.id),
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
  (t) => [unique().on(t.leagueCode, t.teamId)],
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
    manOfMatch: boolean("man_of_match").notNull().default(false), // type 1490
  },
  (t) => [unique().on(t.lineupId, t.playerId)],
)

export type LineupPlayer = typeof lineupPlayer.$inferSelect

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
