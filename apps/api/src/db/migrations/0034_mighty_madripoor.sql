ALTER TABLE "lineup_player" ADD COLUMN "last_man_tackle" integer;--> statement-breakpoint
ALTER TABLE "lineup_player" ADD COLUMN "good_high_claim" integer;--> statement-breakpoint
ALTER TABLE "lineup_player" ADD COLUMN "offsides" integer;--> statement-breakpoint
ALTER TABLE "lineup_player" ADD COLUMN "captain" boolean DEFAULT false NOT NULL;