CREATE TABLE "escalacao" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partida_id" uuid NOT NULL,
	"time_id" uuid NOT NULL,
	"formacao" text,
	"tecnico" text,
	CONSTRAINT "escalacao_partida_id_time_id_unique" UNIQUE("partida_id","time_id")
);
--> statement-breakpoint
CREATE TABLE "escalacao_jogador" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"escalacao_id" uuid NOT NULL,
	"jogador_id" uuid NOT NULL,
	"numero" integer,
	"posicao" text,
	"titular" boolean NOT NULL,
	"grid" text,
	CONSTRAINT "escalacao_jogador_escalacao_id_jogador_id_unique" UNIQUE("escalacao_id","jogador_id")
);
--> statement-breakpoint
CREATE TABLE "jogador" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_football_player_id" integer NOT NULL,
	"nome" text NOT NULL,
	CONSTRAINT "jogador_api_football_player_id_unique" UNIQUE("api_football_player_id")
);
--> statement-breakpoint
CREATE TABLE "liga" (
	"code" text PRIMARY KEY NOT NULL,
	"api_football_league_id" integer NOT NULL,
	"nome" text NOT NULL,
	"pais" text NOT NULL,
	"temporada" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partida" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_football_fixture_id" integer NOT NULL,
	"liga_code" text NOT NULL,
	"rodada" integer NOT NULL,
	"nome" text NOT NULL,
	"data" date NOT NULL,
	"hora" text,
	"mandante_id" uuid NOT NULL,
	"visitante_id" uuid NOT NULL,
	"placar_ft_mandante" integer,
	"placar_ft_visitante" integer,
	"placar_ht_mandante" integer,
	"placar_ht_visitante" integer,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "partida_api_football_fixture_id_unique" UNIQUE("api_football_fixture_id")
);
--> statement-breakpoint
CREATE TABLE "time" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"api_football_team_id" integer NOT NULL,
	"nome" text NOT NULL,
	"slug" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "time_api_football_team_id_unique" UNIQUE("api_football_team_id"),
	CONSTRAINT "time_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "escalacao" ADD CONSTRAINT "escalacao_partida_id_partida_id_fk" FOREIGN KEY ("partida_id") REFERENCES "public"."partida"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalacao" ADD CONSTRAINT "escalacao_time_id_time_id_fk" FOREIGN KEY ("time_id") REFERENCES "public"."time"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalacao_jogador" ADD CONSTRAINT "escalacao_jogador_escalacao_id_escalacao_id_fk" FOREIGN KEY ("escalacao_id") REFERENCES "public"."escalacao"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "escalacao_jogador" ADD CONSTRAINT "escalacao_jogador_jogador_id_jogador_id_fk" FOREIGN KEY ("jogador_id") REFERENCES "public"."jogador"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partida" ADD CONSTRAINT "partida_liga_code_liga_code_fk" FOREIGN KEY ("liga_code") REFERENCES "public"."liga"("code") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partida" ADD CONSTRAINT "partida_mandante_id_time_id_fk" FOREIGN KEY ("mandante_id") REFERENCES "public"."time"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partida" ADD CONSTRAINT "partida_visitante_id_time_id_fk" FOREIGN KEY ("visitante_id") REFERENCES "public"."time"("id") ON DELETE no action ON UPDATE no action;