CREATE TABLE "match_team_stats" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"possession" integer,
	"shots_total" integer,
	"shots_insidebox" integer,
	"shots_outsidebox" integer,
	"shots_on_target" integer,
	"big_chances_created" integer,
	"dangerous_attacks" integer,
	"corners" integer,
	"xg" real,
	CONSTRAINT "match_team_stats_match_id_team_id_unique" UNIQUE("match_id","team_id")
);
--> statement-breakpoint
ALTER TABLE "match_team_stats" ADD CONSTRAINT "match_team_stats_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_team_stats" ADD CONSTRAINT "match_team_stats_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;