CREATE TABLE "season" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_season_id" integer NOT NULL,
	"league_code" text NOT NULL,
	"name" text NOT NULL,
	"start_year" integer NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "season_sportmonks_season_id_unique" UNIQUE("sportmonks_season_id")
);
--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "season_id" uuid;--> statement-breakpoint
ALTER TABLE "standing" ADD COLUMN "season_id" uuid;--> statement-breakpoint
ALTER TABLE "season" ADD CONSTRAINT "season_league_code_league_code_fk" FOREIGN KEY ("league_code") REFERENCES "public"."league"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_season_id_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."season"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standing" ADD CONSTRAINT "standing_season_id_season_id_fk" FOREIGN KEY ("season_id") REFERENCES "public"."season"("id") ON DELETE no action ON UPDATE no action;