import { boolean, date, index, integer, jsonb, numeric, pgTable, real, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"

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
  // "league" (tabela/pontos corridos) vs "cup" (mata-mata/bracket) — decide se a aba mostra tabela ou
  // chaveamento. Default "league": só o sync de copa marca "cup". @feature CUP-001
  type: text("type").notNull().default("league"),
  // IANA timezone da liga ("Europe/London", "America/Sao_Paulo"): `match.date`/`match.time` são gravados
  // na hora de parede deste fuso, não em UTC. Default cobre as ligas inglesas já ingeridas. @feature LIG-012
  timezone: text("timezone").notNull().default("Europe/London"),
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
  // --- Copa / mata-mata (CUP-001): a liga deixa tudo isto null (o round numérico já basta). A "rodada"
  // de copa é a STAGE ("Quarter-finals"); `stageOrder` (= sort_order da SportMonks) ordena as colunas do
  // bracket; `stageTypeId` separa qualifying (225) de proper (224); `leg`/`aggregateId` cobrem ida-e-volta;
  // `resultInfo` carrega o desempate exibível ("won after penalties").
  stageId: integer("stage_id"),
  stageName: text("stage_name"),
  stageOrder: integer("stage_order"),
  stageTypeId: integer("stage_type_id"),
  leg: text("leg"),
  aggregateId: integer("aggregate_id"),
  resultInfo: text("result_info"),
  // Quem AVANÇOU no confronto (FK → team.id) — vem de participants.meta.winner, então cobre pênaltis
  // (placar empatado mas há vencedor). É o que liga a progressão do bracket à stage seguinte. @feature CUP-001
  winnerTeamId: uuid("winner_team_id").references(() => team.id),
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
  // Main referee appointed to this match (FK → referee.id). Nullable and usually EMPTY for upcoming
  // fixtures: the appointment only lands days before kickoff. SportMonks also sends assistants and the
  // fourth official; we keep just the one that decides the game. @feature SIN-009
  refereeId: uuid("referee_id").references(() => referee.id),
  // Season this match belongs to (FK → season.id); nullable until backfilled. Reads scope by it so
  // multiple seasons of the same league don't mix. @feature LIG-008
  seasonId: uuid("season_id").references(() => season.id),
  ftHome: integer("ft_home"),
  ftAway: integer("ft_away"),
  htHome: integer("ht_home"),
  htAway: integer("ht_away"),
  // SportMonks match state (state developer_name): "FT", "NS", "POSTP", etc.
  status: text("status"),
  // Público presente no estádio — fixture metadata type_id 578 (include=metadata). Nullable: só vem
  // depois do jogo (e nem sempre). Leitura de caldeirão/pressão da torcida.
  attendance: integer("attendance"),
  // Escalação CONFIRMADA (true) vs provável — fixture metadata type_id 572. Pra jogo futuro é o gate
  // "o XI já saiu"; pra jogo encerrado é sempre true. Nullable até re-sync.
  lineupConfirmed: boolean("lineup_confirmed"),
  // Confronto de copa ainda indefinido (placeholder "Winner Match N") — não exibir os times. @feature CUP-001
  isPlaceholder: boolean("is_placeholder").notNull().default(false),
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
  // SportMonks detailed_position_id — the player's PREFERRED role (where he plays most), not the
  // per-match slot (that's lineup_player.grid; the field was removed from the Lineup entity in the
  // API). Comes free in the lineups.player include. Names in DETAILED_POSITIONS below.
  detailedPositionId: integer("detailed_position_id"),
  // Preferred foot ("left" | "right" | "both") — SportMonks player metadata type_id 229, via the
  // lineups.player.metadata include. Nullable: players without the metadata entry stay null. @feature W-057
  preferredFoot: text("preferred_foot"),
})

// Role name per detailed_position_id (verified via core/types on 2026-07-02).
export const DETAILED_POSITIONS: Record<number, string> = {
  24: "Goleiro", 148: "Zagueiro", 149: "Volante", 150: "Meia-atacante", 151: "Centroavante",
  152: "Ponta-esquerda", 153: "Meia central", 154: "Lateral-direito", 155: "Lateral-esquerdo",
  156: "Ponta-direita", 157: "Meia pela esquerda", 158: "Meia pela direita", 163: "Segundo atacante",
}

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
    // Papel tático POR JOGO derivado de formation+grid+mando (roleFromGrid) — "lateral-direito",
    // "ponta-esquerda", "volante"… Cruza com player.detailedPositionId (ofício) pra detectar improviso.
    role: text("role"),
    // Per-player match stats from SportMonks Match Facts (lineups.details).
    rating: real("rating"), // type 118, e.g. 6.59; null when not rated
    minutesPlayed: integer("minutes_played"), // type 119
    keyPasses: integer("key_passes"), // type 117 — last pass leading to a teammate's shot; null = 0 or didn't play
    shotsOnTarget: integer("shots_on_target"), // type 86 — null = 0 or didn't play; SUM per team = team SoT that match
    shotsTotal: integer("shots_total"), // type 42 — total de finalizações; denominador da conversão (SoT/total)
    shotsOffTarget: integer("shots_off_target"), // type 41 — chutes pra fora
    // type 58 no nível do jogador = chutes DELE que foram bloqueados (verificado: SoT + fora + bloqueados
    // ≈ shots_total). O "chutes que ele bloqueou" defensivo é o type 97, não ingerido.
    shotsBlocked: integer("shots_blocked"),
    duelsLost: integer("duels_lost"), // type 1491 — duelos perdidos (par do duelsWon: dá a taxa de duelo)
    fouls: integer("fouls"), // type 56 — faltas cometidas (insumo de cartões)
    foulsDrawn: integer("fouls_drawn"), // type 96 — faltas sofridas (o pênalti "cavado")
    saves: integer("saves"), // type 57 — defesas (goleiro)
    savesInsidebox: integer("saves_insidebox"), // type 104 — defesas dentro da área (goleiro)
    dispossessed: integer("dispossessed"), // type 94 — perdeu a bola pressionado
    blockedShots: integer("blocked_shots"), // type 97 — chutes que ELE bloqueou (defensivo; par do shots_blocked 58)
    clearances: integer("clearances"), // type 101 — cortes/afastamentos
    duelsTotal: integer("duels_total"), // type 105 — duelos totais (denominador do duels_won)
    aerialsWon: integer("aerials_won"), // type 107 — duelos aéreos ganhos
    passesAccurate: integer("passes_accurate"), // type 116 — passes certos (numerador do passes)
    touches: integer("touches"), // type 120 — toques na bola (volume de participação)
    longBalls: integer("long_balls"), // type 122 — bolas longas
    longBallsWon: integer("long_balls_won"), // type 123 — bolas longas certas
    bigChancesCreated: integer("big_chances_created"), // type 580 — grandes chances criadas (por jogador)
    chancesCreated: integer("chances_created"), // type 9706 — chances criadas (mais amplo que key passes)
    aerialsTotal: integer("aerials_total"), // type 27274 — duelos aéreos totais
    aerialsLost: integer("aerials_lost"), // type 27266 — aéreos perdidos
    aerialsWonPct: real("aerials_won_pct"), // type 27275 — % aéreo no jogo
    tacklesWon: integer("tackles_won"), // type 27267 — desarmes ganhos
    tacklesWonPct: real("tackles_won_pct"), // type 27268 — % de desarme no jogo
    duelsWonPct: real("duels_won_pct"), // type 27276 — % de duelo no jogo
    passesFinalThird: integer("passes_final_third"), // type 27269 — passes no terço final
    longBallsWonPct: real("long_balls_won_pct"), // type 27270 — % de bola longa no jogo
    ballRecoveries: integer("ball_recoveries"), // type 27271 — bolas recuperadas
    backwardPasses: integer("backward_passes"), // type 27272 — passes pra trás (jogo conservador)
    possessionLost: integer("possession_lost"), // type 27273 — posses perdidas
    errorsLeadToShot: integer("errors_lead_to_shot"), // type 48997 — erro que virou finalização (o "frangueiro auditável")
    lastManTackle: integer("last_man_tackle"), // type 583 — desarme como último homem
    goodHighClaim: integer("good_high_claim"), // type 584 — saída pelo alto (goleiro)
    offsides: integer("offsides"), // type 51 — impedimentos do jogador
    captain: boolean("captain").notNull().default(false), // type 40 — quem tem a braçadeira no jogo
    crossesSuccessfulPct: real("crosses_successful_pct"), // type 1533 — % de cruzamento certo no jogo
    passesAccuratePct: real("passes_accurate_pct"), // type 1584 — precisão de passe no jogo (%)
    // Volume defensivo + criação POR JOGADOR (lineups.details; presença confirmada na PL 25/26).
    // Base da tese do desfalque: jogador ausente com muita interceptação/desarme = mais espaço de
    // criação pro adversário. Agregar por time (via lineup) descontando lesionados. null = 0 ou não jogou.
    tackles: integer("tackles"), // type 78 — desarmes
    interceptions: integer("interceptions"), // type 100 — interceptações
    duelsWon: integer("duels_won"), // type 106 — duelos ganhos
    passes: integer("passes"), // type 80 — passes tentados (volume de construção)
    crossesTotal: integer("crosses_total"), // type 98 — cruzamentos
    crossesAccurate: integer("crosses_accurate"), // type 99 — cruzamentos certos
    dribbleAttempts: integer("dribble_attempts"), // type 108 — dribles tentados
    dribblesSuccessful: integer("dribbles_successful"), // type 109 — dribles certos
    dribbledPast: integer("dribbled_past"), // type 110 — dribles sofridos (vezes que FOI driblado)
    bigChancesMissed: integer("big_chances_missed"), // type 581 — grandes chances perdidas
    manOfMatch: boolean("man_of_match").notNull().default(false), // type 1490
  },
  (t) => [unique().on(t.lineupId, t.playerId)],
)

export type LineupPlayer = typeof lineupPlayer.$inferSelect

// TV station / stream que transmite partidas (include=tvStations.tvStation). Catálogo global — o logo
// vai pro R2. `type` = "channel" (TV) | "stream". @feature W-059
export const tvStation = pgTable("tv_station", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksTvStationId: integer("sportmonks_tv_station_id").notNull().unique(),
  name: text("name").notNull(),
  url: text("url"),
  imageUrl: text("image_url"),
  type: text("type"), // "channel" | "stream"
})

export type TvStation = typeof tvStation.$inferSelect

// Onde assistir: vínculo partida ↔ estação, deduplicado por estação (a SportMonks manda uma linha por
// estação×país; agregamos os países em `countryIds` pra permitir "onde assistir no Brasil"). @feature W-059
export const matchTvStation = pgTable(
  "match_tv_station",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id, { onDelete: "cascade" }),
    tvStationId: uuid("tv_station_id")
      .notNull()
      .references(() => tvStation.id),
    countryIds: jsonb("country_ids").$type<number[]>().notNull().default([]),
  },
  (t) => [unique().on(t.matchId, t.tvStationId)],
)

export type MatchTvStation = typeof matchTvStation.$inferSelect

// Referee (match official) — own entity, deduped by `sportmonksRefereeId`. The referee appointed to a
// match is the single biggest driver of the CARDS market (strict vs lenient officials differ ~2x in
// yellows per game), so this is the identity half of that signal. `imageUrl` is the photo in R2. @feature SIN-009
export const referee = pgTable("referee", {
  id: uuid("id").primaryKey().defaultRandom(),
  sportmonksRefereeId: integer("sportmonks_referee_id").notNull().unique(),
  name: text("name").notNull(),
  commonName: text("common_name"),
  slug: text("slug").notNull().unique(),
  countryId: integer("country_id").references(() => nationality.id),
  imageUrl: text("image_url"),
  dateOfBirth: date("date_of_birth", { mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type Referee = typeof referee.$inferSelect

// Per-team match statistics from the SportMonks fixture `statistics` include (team-level, one row per
// team per match). Volume/quality inputs for the prognosis dossier that DON'T exist per-player in our
// feed: ball possession, shot breakdown (total / on-target / off-target / blocked / inside / outside box),
// free kicks, corners, big chances created. `shotsOnTarget` here is the
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
    shotsOffTarget: integer("shots_off_target"), // type 41 — chutes pra fora (shots_total = on + off + blocked)
    shotsBlocked: integer("shots_blocked"), // type 58 — chutes bloqueados pela defesa adversária
    bigChancesCreated: integer("big_chances_created"), // type 580
    dangerousAttacks: integer("dangerous_attacks"), // type 44
    corners: integer("corners"), // type 34
    freeKicks: integer("free_kicks"), // type 55 — faltas a favor (cobranças de falta concedidas)
    // Expansão DOS-002 (defesa + construção, mesmo include `statistics`; presença confirmada na PL
    // 25/26 por probe na temporada inteira). Métricas pedidas mas NÃO entregues no nível-partida —
    // headers(70), challenges(77), through-balls(124/125), counter-attacks(1527), cross-%(1533),
    // succ-interceptions(66), shots(1677) — ficam de fora (0/380); cross-% deriva de acc/total na leitura.
    tackles: integer("tackles"), // type 78 — desarmes
    interceptions: integer("interceptions"), // type 100 — interceptações
    duelsWon: integer("duels_won"), // type 106 — duelos ganhos
    successfulHeaders: integer("successful_headers"), // type 65 — cabeçadas certas (70 "headers" não vem)
    attacks: integer("attacks"), // type 43 — ataques (dangerous_attacks 44 é separado)
    passes: integer("passes"), // type 80 — passes tentados
    passesAccurate: integer("passes_accurate"), // type 81 — passes certos (successful-passes)
    passAccuracy: real("pass_accuracy"), // type 82 — % de passes certos
    longPasses: integer("long_passes"), // type 62 — passes longos
    crossesTotal: integer("crosses_total"), // type 98 — cruzamentos totais
    crossesAccurate: integer("crosses_accurate"), // type 99 — cruzamentos certos
    dribbleAttempts: integer("dribble_attempts"), // type 108 — dribles tentados
    dribblesSuccessful: integer("dribbles_successful"), // type 109 — dribles certos
    dribbleSuccess: real("dribble_success"), // type 1605 — % de dribles certos
    bigChancesMissed: integer("big_chances_missed"), // type 581 — fecha o par com created (580): "cria e desperdiça"
    hitWoodwork: integer("hit_woodwork"), // type 64 — bolas na trave (omitido quando 0)
    goalAttempts: integer("goal_attempts"), // type 54 — finalizações/tentativas a gol
    xg: real("xg"), // type 5304 — NULL até o add-on de xG (DOS-002 fase 2)
  },
  (t) => [unique().on(t.matchId, t.teamId)],
)

export type MatchTeamStats = typeof matchTeamStats.$inferSelect

// Time-series trend (SportMonks `trends` include): one row per (team, stat-type, period, minute) per
// match — the minute-by-minute attack momentum / pressão da partida. `value` is CUMULATIVE within the
// period (e.g. dangerous-attacks 3→4→5→8), so the momentum is the per-minute DELTA, not the level.
// Re-built into the seesaw curve (à la Sofascore) at read time; the paid Pressure Index is gated, this
// is reconstructed from the free trends. ~1300 rows/match. @feature SIN-021
export const matchTrend = pgTable(
  "match_trend",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id),
    typeId: integer("type_id").notNull(), // 86=SoT, 580=big-chance, 44=dangerous-attack, 42=shots, 43=attack, 49=shots-insidebox, 34=corners…
    periodId: integer("period_id").notNull(), // separates 1st/2nd half/ET so injury time doesn't overlap
    minute: integer("minute").notNull(), // minute+extra already summed (injury time)
    value: integer("value").notNull(), // CUMULATIVE within the period
  },
  (t) => [unique().on(t.matchId, t.teamId, t.typeId, t.periodId, t.minute), index("match_trend_match_idx").on(t.matchId)],
)

export type MatchTrend = typeof matchTrend.$inferSelect

// Clima do jogo, do include `weatherReport` da SportMonks. ATENÇÃO: no JSON o campo vem como
// `weatherreport` (tudo minúsculo) — ler camelCase devolve undefined. 1 linha por match. `description`
// carrega a condição (chuva/sol); temp/feels em °C (período "day", ~horário do jogo); wind em m/s.
// `type` = forecast | actual. @feature SIN-006
export const weather = pgTable(
  "weather",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    matchId: uuid("match_id")
      .notNull()
      .references(() => match.id, { onDelete: "cascade" }),
    description: text("description"), // "sky is clear" | "light rain" | "scattered clouds"
    tempDay: real("temp_day"), // °C — temperature.day
    feelsLikeDay: real("feels_like_day"), // °C — feels_like.day
    windSpeed: real("wind_speed"), // m/s — wind.speed
    windDirection: integer("wind_direction"), // graus — wind.direction
    humidity: text("humidity"), // "81%"
    clouds: text("clouds"), // "5%"
    pressure: integer("pressure"),
    type: text("type"), // forecast | actual
  },
  (t) => [unique().on(t.matchId)],
)

export type Weather = typeof weather.$inferSelect

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
    bestBetMarket: text("best_bet_market"), // "1x2" | "over_under" | "btts" | "handicap" | "team_total"
    bestBetSelection: text("best_bet_selection"), // "home"|"draw"|"away"|"over"|"under"|"yes"|"no"
    bestBetTeam: text("best_bet_team"), // "home" | "away" — só em team_total (de qual time é o total); null nos outros
    bestBetLine: real("best_bet_line"), // over_under: linha do jogo · handicap: hcap do time · team_total: linha de gols · null em 1x2/btts
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
