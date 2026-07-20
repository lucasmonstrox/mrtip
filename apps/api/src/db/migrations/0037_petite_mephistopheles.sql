CREATE TABLE "referee" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"sportmonks_referee_id" integer NOT NULL,
	"name" text NOT NULL,
	"common_name" text,
	"slug" text NOT NULL,
	"country_id" integer,
	"image_url" text,
	"date_of_birth" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "referee_sportmonks_referee_id_unique" UNIQUE("sportmonks_referee_id"),
	CONSTRAINT "referee_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "referee_id" uuid;--> statement-breakpoint
ALTER TABLE "referee" ADD CONSTRAINT "referee_country_id_nationality_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."nationality"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_referee_id_referee_id_fk" FOREIGN KEY ("referee_id") REFERENCES "public"."referee"("id") ON DELETE no action ON UPDATE no action;