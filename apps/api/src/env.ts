// Bun carrega .env automaticamente. Objeto puro, validado uma vez no boot.

const APP_ENV = process.env.APP_ENV ?? "development"

function required(name: string): string {
  const v = process.env[name]
  if (!v) throw new Error(`Variável de ambiente ausente: ${name}`)
  return v
}

export const env = {
  appEnv: APP_ENV,
  port: Number(process.env.PORT ?? 3001),
  // Origem do front liberada no CORS. Em dev (vazio) cai no regex localhost (shared/plugins/cors.ts);
  // em prod, pinar na URL pública. Dados são públicos (openfootball), sem auth.
  webOrigin: process.env.WEB_ORIGIN,
  databaseUrl: required("DATABASE_URL"),
  // Usada só pelos scripts de seed (fetch da API-Football). A API HTTP não precisa.
  apiFootballKey: process.env.API_FOOTBALL_KEY,
}
