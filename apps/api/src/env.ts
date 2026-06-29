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
  // em prod, pinar na URL pública.
  webOrigin: process.env.WEB_ORIGIN,
  databaseUrl: required("DATABASE_URL"),
  // Usada só pelo sync da SportMonks (fonte de dados). A API HTTP não precisa.
  sportmonksApiKey: process.env.SPORTMONKS_API_KEY,
  // Autenticação (Clerk). O guard global (auth/guard.ts) só exige token quando
  // `secretKey` existe; sem ele, dev roda sem auth. `jwtKey` (PEM público do
  // Dashboard) torna a verificação networkless; `authorizedParties` é a allowlist
  // de origens aceitas no token.
  clerk: {
    secretKey: process.env.CLERK_SECRET_KEY,
    jwtKey: process.env.CLERK_JWT_KEY,
    authorizedParties: process.env.CLERK_AUTHORIZED_PARTIES?.split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  },
}
