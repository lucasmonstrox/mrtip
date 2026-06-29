ALTER TABLE "match" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "match" ADD CONSTRAINT "match_slug_unique" UNIQUE("slug");