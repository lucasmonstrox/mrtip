/**
 * SOMENTE LEITURA: compara o que já foi aplicado no banco de PRODUÇÃO com o journal local.
 *
 * Lê a URL direto do .env.prod em vez de confiar em env exportada: o Bun carrega o `.env` local
 * sozinho e ele VENCE o que o shell exporta, então `set -a; . .env.prod` aponta pro banco de dev
 * sem avisar. Ler o arquivo é a única forma determinística de garantir que o alvo é prod mesmo.
 */
import { readFileSync } from "node:fs"
import { SQL } from "bun"

function urlDoEnvProd(): string {
  const raw = readFileSync(import.meta.dir + "/../.env.prod", "utf8")
  const linha = raw.split(/\r?\n/).find((l) => l.startsWith("DATABASE_URL="))
  if (!linha) throw new Error(".env.prod não tem DATABASE_URL")
  return linha.slice("DATABASE_URL=".length).trim().replace(/^["']|["']$/g, "")
}

const url = urlDoEnvProd()
const host = new URL(url).host
console.log(`banco alvo: ${host}`)
if (host.includes("localhost") || host.includes("127.0.0.1")) {
  console.error("❌ ABORTADO: isto é um banco local, não produção.")
  process.exit(1)
}

const sql = new SQL(url)

const applied = (await sql`
  select hash, created_at from drizzle.__drizzle_migrations order by created_at
`) as { hash: string; created_at: string }[]
console.log(`\nmigrations aplicadas em prod: ${applied.length}`)

const journal = JSON.parse(readFileSync(import.meta.dir + "/../src/db/migrations/meta/_journal.json", "utf8")) as {
  entries: { idx: number; tag: string }[]
}
console.log(`migrations no journal local:  ${journal.entries.length}`)

const pendentes = journal.entries.slice(applied.length)
if (!pendentes.length) console.log("\n✅ nada pendente")
else {
  console.log(`\n⚠️  PENDENTES (${pendentes.length}) — um db:migrate aplicaria TODAS estas:`)
  for (const e of pendentes) console.log(`   ${e.idx} · ${e.tag}`)
}

const col = (await sql`
  select count(*)::int as n from information_schema.columns
  where table_name = 'team' and column_name = 'twitter_username'
`) as { n: number }[]
console.log(`\nteam.twitter_username existe em prod? ${col[0]!.n ? "SIM" : "NÃO"}`)

const times = (await sql`select count(*)::int as n from team`) as { n: number }[]
console.log(`times em prod: ${times[0]!.n}`)

process.exit(0)
