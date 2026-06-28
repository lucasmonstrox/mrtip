import { boolean, date, integer, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"

// Liga + temporada (uma linha por liga/temporada). `code` é a chave de domínio (ex.: "PL"),
// usada na URL e como FK das partidas. `apiId` é o league id da API-Football (PL = 39).
export const liga = pgTable("liga", {
  code: text("code").primaryKey(),
  apiFootballLeagueId: integer("api_football_league_id").notNull(),
  nome: text("nome").notNull(),
  pais: text("pais").notNull(),
  temporada: text("temporada").notNull(),
})

export type Liga = typeof liga.$inferSelect

// Time/clube — entidade própria com id estável. `apiId` (id do time na API-Football) é a chave
// natural de dedup entre jogos/temporadas. `slug` (kebab do nome) é o que vai nas URLs.
export const time = pgTable("time", {
  id: uuid("id").primaryKey().defaultRandom(),
  apiFootballTeamId: integer("api_football_team_id").notNull().unique(),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
})

export type Time = typeof time.$inferSelect

// Partida de uma temporada. `fixtureId` (id do fixture na API-Football) liga a partida à fonte —
// é por ele que a escalação é casada. Times normalizados (FK → time.id). Placar achatado em 4
// colunas nullable (null = sem resultado). `data` (yyyy-MM-dd) + `hora` (HH:mm) separados.
export const partida = pgTable("partida", {
  id: uuid("id").primaryKey().defaultRandom(),
  apiFootballFixtureId: integer("api_football_fixture_id").notNull().unique(),
  ligaCode: text("liga_code")
    .notNull()
    .references(() => liga.code),
  rodada: integer("rodada").notNull(),
  nome: text("nome").notNull(),
  data: date("data", { mode: "string" }).notNull(),
  hora: text("hora"),
  mandanteId: uuid("mandante_id")
    .notNull()
    .references(() => time.id),
  visitanteId: uuid("visitante_id")
    .notNull()
    .references(() => time.id),
  placarFtMandante: integer("placar_ft_mandante"),
  placarFtVisitante: integer("placar_ft_visitante"),
  placarHtMandante: integer("placar_ht_mandante"),
  placarHtVisitante: integer("placar_ht_visitante"),
  // Marca se os eventos de gol já foram importados (backfill /fixtures/events é por jogo / quota).
  golsImportados: boolean("gols_importados").notNull().default(false),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
})

export type Partida = typeof partida.$inferSelect

// Jogador — entidade própria, dedup por `apiId` (id do jogador na API-Football).
export const jogador = pgTable("jogador", {
  id: uuid("id").primaryKey().defaultRandom(),
  apiFootballPlayerId: integer("api_football_player_id").notNull().unique(),
  nome: text("nome").notNull(),
})

export type Jogador = typeof jogador.$inferSelect

// Técnico — entidade própria (id estável pras URLs /tecnicos/:id). `apiFootballCoachId` é
// preenchido quando o lineup é (re)importado com coach.id; nome é único (chave de dedup).
export const tecnico = pgTable("tecnico", {
  id: uuid("id").primaryKey().defaultRandom(),
  apiFootballCoachId: integer("api_football_coach_id").unique(),
  nome: text("nome").notNull().unique(),
})

export type Tecnico = typeof tecnico.$inferSelect

// Escalação de UM time em UMA partida: formação + técnico. Os jogadores ficam em
// escalacao_jogador. `tecnico` (texto) é o nome denormalizado; `tecnicoId` liga à entidade.
// unique(partidaId, timeId) — uma escalação por time por jogo.
export const escalacao = pgTable(
  "escalacao",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    partidaId: uuid("partida_id")
      .notNull()
      .references(() => partida.id),
    timeId: uuid("time_id")
      .notNull()
      .references(() => time.id),
    formacao: text("formacao"),
    tecnico: text("tecnico"),
    tecnicoId: uuid("tecnico_id").references(() => tecnico.id),
  },
  (t) => [unique().on(t.partidaId, t.timeId)],
)

export type Escalacao = typeof escalacao.$inferSelect

// Um jogador dentro de uma escalação: titular ou banco, com número/posição/grid.
export const escalacaoJogador = pgTable(
  "escalacao_jogador",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    escalacaoId: uuid("escalacao_id")
      .notNull()
      .references(() => escalacao.id),
    jogadorId: uuid("jogador_id")
      .notNull()
      .references(() => jogador.id),
    numero: integer("numero"),
    posicao: text("posicao"), // G/D/M/F
    titular: boolean("titular").notNull(),
    grid: text("grid"), // posição no campo, ex.: "1:1"
  },
  (t) => [unique().on(t.escalacaoId, t.jogadorId)],
)

export type EscalacaoJogador = typeof escalacaoJogador.$inferSelect

// Desfalque: um jogador que faltou (ou era dúvida) em UMA partida. Vem de /injuries da
// API-Football. `tipo` = "Missing Fixture" (não jogou) ou "Questionable" (dúvida);
// `motivo` = razão (ex.: "Muscle Injury", "Suspended"). unique(partidaId, jogadorId).
export const lesao = pgTable(
  "lesao",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    partidaId: uuid("partida_id")
      .notNull()
      .references(() => partida.id, { onDelete: "cascade" }),
    timeId: uuid("time_id")
      .notNull()
      .references(() => time.id),
    jogadorId: uuid("jogador_id")
      .notNull()
      .references(() => jogador.id),
    tipo: text("tipo").notNull(),
    motivo: text("motivo"),
  },
  (t) => [unique().on(t.partidaId, t.jogadorId)],
)

export type Lesao = typeof lesao.$inferSelect

// Gol de uma partida. `timeId` = time que MARCOU (no autogolo, o time beneficiado); `jogadorId`
// = autor (no autogolo, quem fez contra); `assistenteId` = quem deu a assistência (nullable).
// `tipo` = "normal" | "penalti" | "contra" (autogolo). `minuto` em minutos do jogo.
export const gol = pgTable("gol", {
  id: uuid("id").primaryKey().defaultRandom(),
  partidaId: uuid("partida_id")
    .notNull()
    .references(() => partida.id, { onDelete: "cascade" }),
  timeId: uuid("time_id")
    .notNull()
    .references(() => time.id),
  jogadorId: uuid("jogador_id")
    .notNull()
    .references(() => jogador.id),
  assistenteId: uuid("assistente_id").references(() => jogador.id),
  minuto: integer("minuto"),
  tipo: text("tipo").notNull(),
})

export type Gol = typeof gol.$inferSelect
