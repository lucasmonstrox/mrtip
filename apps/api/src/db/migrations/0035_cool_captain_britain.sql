CREATE TABLE "match_tv_station" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"tv_station_id" uuid NOT NULL,
	"country_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "match_tv_station_match_id_tv_station_id_unique" UNIQUE("match_id","tv_station_id")
);
--> statement-breakpoint
CREATE TABLE "tv_station" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_tv_station_id" integer NOT NULL,
	"name" text NOT NULL,
	"url" text,
	"image_url" text,
	"type" text,
	CONSTRAINT "tv_station_sportmonks_tv_station_id_unique" UNIQUE("sportmonks_tv_station_id")
);
--> statement-breakpoint
ALTER TABLE "match_tv_station" ADD CONSTRAINT "match_tv_station_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match_tv_station" ADD CONSTRAINT "match_tv_station_tv_station_id_tv_station_id_fk" FOREIGN KEY ("tv_station_id") REFERENCES "public"."tv_station"("id") ON DELETE no action ON UPDATE no action;