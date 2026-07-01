-- Busca global por nome (CORE-002): trigramas + remoção de acento, para casar nomes de ligas,
-- times, jogadores, treinadores e jogos tolerando erro de digitação e acento ("vinicius"→"Vinícius").
CREATE EXTENSION IF NOT EXISTS pg_trgm;
--> statement-breakpoint
CREATE EXTENSION IF NOT EXISTS unaccent;
--> statement-breakpoint
-- unaccent() é STABLE (depende de search_path/dicionário) e índices de expressão exigem IMMUTABLE.
-- Este wrapper fixa o dicionário (forma de 2 args) e marca IMMUTABLE — seguro para indexar e para o
-- WHERE/ORDER BY da busca. Sem ele, o índice de expressão é recusado pelo Postgres.
CREATE OR REPLACE FUNCTION immutable_unaccent(text)
  RETURNS text
  LANGUAGE sql
  IMMUTABLE PARALLEL SAFE STRICT
AS $$ SELECT public.unaccent('public.unaccent', $1) $$;
--> statement-breakpoint
-- Índices GIN trigram sobre o nome normalizado (sem acento, minúsculo). Aceleram tanto o operador de
-- similaridade `%` (fuzzy/typo) quanto o `LIKE '%q%'` (substring) que o /v1/search usa. match.name é
-- "Matchday 12" (inútil p/ busca) → jogos casam pelos nomes dos times, que já usam team_name_trgm_idx.
CREATE INDEX IF NOT EXISTS league_name_trgm_idx ON league USING gin (immutable_unaccent(lower(name)) gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS team_name_trgm_idx ON team USING gin (immutable_unaccent(lower(name)) gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS player_name_trgm_idx ON player USING gin (immutable_unaccent(lower(name)) gin_trgm_ops);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS coach_name_trgm_idx ON coach USING gin (immutable_unaccent(lower(name)) gin_trgm_ops);
