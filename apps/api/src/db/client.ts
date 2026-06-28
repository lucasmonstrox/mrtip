import { drizzle } from "drizzle-orm/bun-sql"

import { env } from "../env"
import * as schema from "./schema"

// Driver nativo do Bun (Bun.SQL) via Drizzle — zero dependência de driver pg externo.
// (Não roda no workerd: lá o destino seria D1/Hyperdrive. Hoje a API é Bun local.)
export const db = drizzle(env.databaseUrl, { schema })

export type DB = typeof db
