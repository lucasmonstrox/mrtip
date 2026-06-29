CREATE TABLE "commentary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_commentary_id" integer NOT NULL,
	"match_id" uuid NOT NULL,
	"player_id" uuid,
	"related_player_id" uuid,
	"comment" text NOT NULL,
	"minute" integer,
	"extra_minute" integer,
	"is_goal" boolean DEFAULT false NOT NULL,
	"is_important" boolean DEFAULT false NOT NULL,
	"sort_order" integer NOT NULL,
	CONSTRAINT "commentary_sportmonks_commentary_id_unique" UNIQUE("sportmonks_commentary_id")
);
--> statement-breakpoint
ALTER TABLE "commentary" ADD CONSTRAINT "commentary_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commentary" ADD CONSTRAINT "commentary_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commentary" ADD CONSTRAINT "commentary_related_player_id_player_id_fk" FOREIGN KEY ("related_player_id") REFERENCES "public"."player"("id") ON DELETE no action ON UPDATE no action;