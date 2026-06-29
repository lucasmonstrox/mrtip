CREATE TABLE "venue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_venue_id" integer NOT NULL,
	"name" text NOT NULL,
	"city_name" text,
	"capacity" integer,
	"surface" text,
	"latitude" numeric(9, 6),
	"longitude" numeric(9, 6),
	"image_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "venue_sportmonks_venue_id_unique" UNIQUE("sportmonks_venue_id")
);
--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "venue_id" uuid;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_venue_id_venue_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venue"("id") ON DELETE no action ON UPDATE no action;