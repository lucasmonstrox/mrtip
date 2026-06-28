CREATE TABLE "coach" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_coach_id" integer,
	"name" text NOT NULL,
	CONSTRAINT "coach_sportmonks_coach_id_unique" UNIQUE("sportmonks_coach_id"),
	CONSTRAINT "coach_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "goal" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_event_id" integer NOT NULL,
	"match_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"assist_id" uuid,
	"minute" integer,
	"type" text NOT NULL,
	CONSTRAINT "goal_sportmonks_event_id_unique" UNIQUE("sportmonks_event_id")
);
--> statement-breakpoint
CREATE TABLE "injury" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"type" text NOT NULL,
	"reason" text,
	CONSTRAINT "injury_match_id_player_id_unique" UNIQUE("match_id","player_id")
);
--> statement-breakpoint
CREATE TABLE "league" (
	"code" text PRIMARY KEY NOT NULL,
	"sportmonks_league_id" integer NOT NULL,
	"sportmonks_season_id" integer NOT NULL,
	"name" text NOT NULL,
	"country" text NOT NULL,
	"season" text NOT NULL,
	"logo_url" text
);
--> statement-breakpoint
CREATE TABLE "lineup" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"formation" text,
	"coach_name" text,
	"coach_id" uuid,
	CONSTRAINT "lineup_match_id_team_id_unique" UNIQUE("match_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "lineup_player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lineup_id" uuid NOT NULL,
	"player_id" uuid NOT NULL,
	"number" integer,
	"position" text,
	"starter" boolean NOT NULL,
	"grid" text,
	"rating" real,
	"minutes_played" integer,
	"man_of_match" boolean DEFAULT false NOT NULL,
	CONSTRAINT "lineup_player_lineup_id_player_id_unique" UNIQUE("lineup_id","player_id")
);
--> statement-breakpoint
CREATE TABLE "match" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_fixture_id" integer NOT NULL,
	"league_code" text NOT NULL,
	"round" integer NOT NULL,
	"name" text NOT NULL,
	"date" date NOT NULL,
	"time" text,
	"home_team_id" uuid NOT NULL,
	"away_team_id" uuid NOT NULL,
	"ft_home" integer,
	"ft_away" integer,
	"ht_home" integer,
	"ht_away" integer,
	"status" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "match_sportmonks_fixture_id_unique" UNIQUE("sportmonks_fixture_id")
);
--> statement-breakpoint
CREATE TABLE "nationality" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"fifa_name" text,
	"iso2" text,
	"flag_url" text
);
--> statement-breakpoint
CREATE TABLE "player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_player_id" integer NOT NULL,
	"name" text NOT NULL,
	"date_of_birth" date,
	"height" integer,
	"image_url" text,
	"nationality_id" integer,
	CONSTRAINT "player_sportmonks_player_id_unique" UNIQUE("sportmonks_player_id")
);
--> statement-breakpoint
CREATE TABLE "standing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"league_code" text NOT NULL,
	"team_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"points" integer NOT NULL,
	"played" integer NOT NULL,
	"won" integer NOT NULL,
	"drawn" integer NOT NULL,
	"lost" integer NOT NULL,
	"goals_for" integer NOT NULL,
	"goals_against" integer NOT NULL,
	"goal_difference" integer NOT NULL,
	"zone" text,
	CONSTRAINT "standing_league_code_team_id_unique" UNIQUE("league_code","team_id")
);
--> statement-breakpoint
CREATE TABLE "team" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_team_id" integer NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"short_code" text,
	"logo_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_sportmonks_team_id_unique" UNIQUE("sportmonks_team_id"),
	CONSTRAINT "team_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal" ADD CONSTRAINT "goal_assist_id_player_id_fk" FOREIGN KEY ("assist_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injury" ADD CONSTRAINT "injury_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injury" ADD CONSTRAINT "injury_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "injury" ADD CONSTRAINT "injury_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineup" ADD CONSTRAINT "lineup_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineup" ADD CONSTRAINT "lineup_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineup" ADD CONSTRAINT "lineup_coach_id_coach_id_fk" FOREIGN KEY ("coach_id") REFERENCES "public"."coach"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineup_player" ADD CONSTRAINT "lineup_player_lineup_id_lineup_id_fk" FOREIGN KEY ("lineup_id") REFERENCES "public"."lineup"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lineup_player" ADD CONSTRAINT "lineup_player_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_league_code_league_code_fk" FOREIGN KEY ("league_code") REFERENCES "public"."league"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_home_team_id_team_id_fk" FOREIGN KEY ("home_team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_away_team_id_team_id_fk" FOREIGN KEY ("away_team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "player" ADD CONSTRAINT "player_nationality_id_nationality_id_fk" FOREIGN KEY ("nationality_id") REFERENCES "public"."nationality"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standing" ADD CONSTRAINT "standing_league_code_league_code_fk" FOREIGN KEY ("league_code") REFERENCES "public"."league"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standing" ADD CONSTRAINT "standing_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;