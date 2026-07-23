CREATE TABLE "team_rival" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"rival_team_id" uuid NOT NULL,
	"source" text DEFAULT 'sportmonks' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "team_rival_team_id_rival_team_id_unique" UNIQUE("team_id","rival_team_id")
);
--> statement-breakpoint
ALTER TABLE "team_rival" ADD CONSTRAINT "team_rival_team_id_team_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_rival" ADD CONSTRAINT "team_rival_rival_team_id_team_id_fk" FOREIGN KEY ("rival_team_id") REFERENCES "public"."team"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_rival" ADD CONSTRAINT "team_rival_no_self" CHECK (team_id <> rival_team_id);--> statement-breakpoint
ALTER TABLE "team_rival" ADD CONSTRAINT "team_rival_source_check" CHECK (source IN ('sportmonks', 'manual'));
