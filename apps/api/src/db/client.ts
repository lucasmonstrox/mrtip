import { neonConfig, Pool as NeonPool, types as neonTypes } from "@neondatabase/serverless"
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"

import { env } from "../env"
import * as schema from "./schema"

const { Pool, types } = pg

// O bun-sql entregava numeric/decimal e int8 como number; o node-postgres entrega STRING por padrão
// (pra não perder precisão em bigint grande). Os `count()` do domínio (artilharia, gols, assistências)
// são int8 e o Drizzle os TIPA como number — o typecheck não pega a diferença, ela só aparece em
// runtime. Restaurar o parser globalmente mata a classe inteira de bug nos DOIS drivers.
for (const t of [types, neonTypes]) {
  t.setTypeParser(1700, (v) => (v === null ? null : Number(v))) // numeric / decimal
  t.setTypeParser(20, (v) => (v === null ? null : Number(v))) // int8 / bigint (count(*))
}

// O driver pg sobre socket TCP PENDURA no workerd ao adquirir conexão sob requests paralelos —
// incidente de produção no repo irmão (grupoceralis/apps/api/src/db/client.ts:21-29): o connect nunca
// completa e o request morre em 500. No workerd usamos então o @neondatabase/serverless, que fala com
// o proxy do Neon por FETCH (stateless, sem socket reusado entre requests — poolQueryViaFetch).
// Fora do workerd (Bun: dev, migrações e os scripts de sync) segue o pg/TCP, bem mais rápido pra
// escrita em massa. A detecção roda uma vez por isolate, no import do módulo.
const isWorkerd = typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers"

// Pool do Neon no workerd. `maxUses: 1` descarta a conexão ao soltar porque o workerd proíbe reusar
// I/O entre requests. As rotas do mrtip são 100% leitura (nenhum insert/update/delete em modules/,
// nenhuma transação), então na prática todo o tráfego do Worker sai pelo caminho de fetch.
function criarDbWorkerd() {
  neonConfig.poolQueryViaFetch = true
  const pool = new NeonPool({
    connectionString: env.databaseUrl,
    connectionTimeoutMillis: 10000,
    max: 10,
    maxUses: 1,
    idleTimeoutMillis: 1000,
    allowExitOnIdle: true,
  })
  return drizzleNeon(pool, { schema })
}

// Pool node-postgres sob Bun. Construir aqui não abre socket — o Pool só CONECTA no primeiro query.
function criarDbBun() {
  const pool = new Pool({
    connectionString: env.databaseUrl,
    connectionTimeoutMillis: 15000,
    allowExitOnIdle: true,
    max: 10,
  })
  return drizzle(pool, { schema })
}

// Os dois drizzles expõem a MESMA API de query/transaction; o cast unifica o tipo exportado
// (NodePgDatabase) pra não vazar uma união pra todo o domínio (o tipo Tx em lib/db.ts deriva daqui).
export const db = (isWorkerd ? criarDbWorkerd() : criarDbBun()) as ReturnType<
  typeof drizzle<typeof schema>
>

export type DB = typeof db
