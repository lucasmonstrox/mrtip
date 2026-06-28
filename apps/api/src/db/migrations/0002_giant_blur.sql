CREATE TABLE "gol" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partida_id" uuid NOT NULL,
	"time_id" uuid NOT NULL,
	"jogador_id" uuid NOT NULL,
	"assistente_id" uuid,
	"minuto" integer,
	"tipo" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "partida" ADD COLUMN "gols_importados" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "gol" ADD CONSTRAINT "gol_partida_id_partida_id_fk" FOREIGN KEY ("partida_id") REFERENCES "public"."partida"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gol" ADD CONSTRAINT "gol_time_id_time_id_fk" FOREIGN KEY ("time_id") REFERENCES "public"."time"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gol" ADD CONSTRAINT "gol_jogador_id_jogador_id_fk" FOREIGN KEY ("jogador_id") REFERENCES "public"."jogador"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gol" ADD CONSTRAINT "gol_assistente_id_jogador_id_fk" FOREIGN KEY ("assistente_id") REFERENCES "public"."jogador"("id") ON DELETE no action ON UPDATE no action;