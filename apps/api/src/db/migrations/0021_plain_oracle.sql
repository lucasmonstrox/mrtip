ALTER TABLE "match" ADD COLUMN "stage_id" integer;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "stage_name" text;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "stage_order" integer;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "stage_type_id" integer;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "leg" text;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "aggregate_id" integer;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "result_info" text;--> statement-breakpoint
ALTER TABLE "match" ADD COLUMN "is_placeholder" boolean DEFAULT false NOT NULL;