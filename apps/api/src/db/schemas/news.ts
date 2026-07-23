import { pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"

import { league, match, team } from "./leagues"

// Veículo/site de notícia (GE, Lance!, UOL…). Entidade normalizada — sem isso "Globo"/"ge.globo"/"GE"
// viram quatro filtros. `tier` alimenta whitelist futura; `kind` separa imprensa de conta de plataforma
// (X ≠ veículo no mesmo sentido que GE). Logo fica nullable até upload R2 (W-077).
export const newsProvider = pgTable("news_provider", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  domain: text("domain").notNull(),
  homeUrl: text("home_url").notNull(),
  // established | niche | club | platform_account
  tier: text("tier").notNull(),
  // press | club_official | platform_account
  kind: text("kind").notNull(),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type NewsProvider = typeof newsProvider.$inferSelect

// Artigo ingerido (ou semeado): título + URL canônica + resumo estruturado — sem body (copyright +
// prompt). `eventType`/`severity` tipam a evidência narrativa pro super-prognosis (EXPLAIN, não λ).
export const newsArticle = pgTable("news_article", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull().unique(),
  title: text("title").notNull(),
  providerId: uuid("provider_id")
    .notNull()
    .references(() => newsProvider.id),
  publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
  summary: text("summary").notNull(),
  // availability | xi_quality | institutional | stake_form | player_flag | venue | preview
  eventType: text("event_type").notNull(),
  // rumor | confirmado
  severity: text("severity").notNull(),
  matchId: uuid("match_id").references(() => match.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export type NewsArticle = typeof newsArticle.$inferSelect

// Matéria ↔ time (M2M): uma peça pode falar dos dois (preview) ou de um só (Arboleda / Viveros).
export const newsArticleTeam = pgTable(
  "news_article_team",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => newsArticle.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => team.id),
    // subject | opponent | mentioned
    role: text("role").notNull().default("subject"),
  },
  (t) => [unique().on(t.articleId, t.teamId)],
)

export type NewsArticleTeam = typeof newsArticleTeam.$inferSelect

// Classificação explícita de liga (não inferida na hora do prompt). Seed BRA = Brasileirão.
export const newsArticleLeague = pgTable(
  "news_article_league",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => newsArticle.id, { onDelete: "cascade" }),
    leagueCode: text("league_code")
      .notNull()
      .references(() => league.code),
    // primary | mentioned
    linkRole: text("link_role").notNull().default("primary"),
    // manual | url | match | inferred
    confidence: text("confidence").notNull().default("manual"),
  },
  (t) => [unique().on(t.articleId, t.leagueCode)],
)

export type NewsArticleLeague = typeof newsArticleLeague.$inferSelect
