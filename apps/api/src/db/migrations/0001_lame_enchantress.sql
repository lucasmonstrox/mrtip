CREATE TABLE "lesao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partida_id" uuid NOT NULL,
	"time_id" uuid NOT NULL,
	"jogador_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"motivo" text,
	CONSTRAINT "lesao_partida_id_jogador_id_unique" UNIQUE("partida_id","jogador_id")
);
--> statement-breakpoint
ALTER TABLE "lesao" ADD CONSTRAINT "lesao_partida_id_partida_id_fk" FOREIGN KEY ("partida_id") REFERENCES "public"."partida"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesao" ADD CONSTRAINT "lesao_time_id_time_id_fk" FOREIGN KEY ("time_id") REFERENCES "public"."time"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lesao" ADD CONSTRAINT "lesao_jogador_id_jogador_id_fk" FOREIGN KEY ("jogador_id") REFERENCES "public"."jogador"("id") ON DELETE no action ON UPDATE no action;