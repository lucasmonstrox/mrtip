CREATE TABLE "news_article" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"title" text NOT NULL,
	"provider_id" uuid NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"summary" text NOT NULL,
	"event_type" text NOT NULL,
	"severity" text NOT NULL,
	"match_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_article_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "news_article_league" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"league_code" text NOT NULL,
	"link_role" text DEFAULT 'primary' NOT NULL,
	"confidence" text DEFAULT 'manual' NOT NULL,
	CONSTRAINT "news_article_league_article_id_league_code_unique" UNIQUE("article_id","league_code")
);
--> statement-breakpoint
CREATE TABLE "news_article_team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"article_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"role" text DEFAULT 'subject' NOT NULL,
	CONSTRAINT "news_article_team_article_id_team_id_unique" UNIQUE("article_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "news_provider" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"domain" text NOT NULL,
	"home_url" text NOT NULL,
	"tier" text NOT NULL,
	"kind" text NOT NULL,
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "news_provider_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "news_article" ADD CONSTRAINT "news_article_provider_id_news_provider_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."news_provider"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_article" ADD CONSTRAINT "news_article_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_article_league" ADD CONSTRAINT "news_article_league_article_id_news_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."news_article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_article_league" ADD CONSTRAINT "news_article_league_league_code_league_code_fk" FOREIGN KEY ("league_code") REFERENCES "public"."league"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_article_team" ADD CONSTRAINT "news_article_team_article_id_news_article_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."news_article"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_article_team" ADD CONSTRAINT "news_article_team_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;