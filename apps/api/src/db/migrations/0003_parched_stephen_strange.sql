CREATE TABLE "tecnico" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_football_coach_id" integer,
	"nome" text NOT NULL,
	CONSTRAINT "tecnico_api_football_coach_id_unique" UNIQUE("api_football_coach_id"),
	CONSTRAINT "tecnico_nome_unique" UNIQUE("nome")
);
--> statement-breakpoint
ALTER TABLE "escalacao" ADD COLUMN "tecnico_id" uuid;--> statement-breakpoint
ALTER TABLE "escalacao" ADD CONSTRAINT "escalacao_tecnico_id_tecnico_id_fk" FOREIGN KEY ("tecnico_id") REFERENCES "public"."tecnico"("id") ON DELETE no action ON UPDATE no action;