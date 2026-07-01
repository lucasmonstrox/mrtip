CREATE TABLE "weather" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"match_id" uuid NOT NULL,
	"description" text,
	"temp_day" real,
	"feels_like_day" real,
	"wind_speed" real,
	"wind_direction" integer,
	"humidity" text,
	"clouds" text,
	"pressure" integer,
	"type" text,
	CONSTRAINT "weather_match_id_unique" UNIQUE("match_id")
);
--> statement-breakpoint
ALTER TABLE "weather" ADD CONSTRAINT "weather_match_id_match_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."match"("id") ON DELETE cascade ON UPDATE no action;