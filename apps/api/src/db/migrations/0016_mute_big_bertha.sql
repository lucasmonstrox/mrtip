CREATE TABLE "match_trend" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"team_id" uuid NOT NULL,
	"type_id" integer NOT NULL,
	"period_id" integer NOT NULL,
	"minute" integer NOT NULL,
	"value" integer NOT NULL,
	CONSTRAINT "match_trend_match_id_team_id_type_id_period_id_minute_unique" UNIQUE("match_id","team_id","type_id","period_id","minute")
);
--> statement-breakpoint
ALTER TABLE "match_trend" ADD CONSTRAINT "match_trend_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_trend" ADD CONSTRAINT "match_trend_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "match_trend_match_idx" ON "match_trend" USING btree ("match_id");