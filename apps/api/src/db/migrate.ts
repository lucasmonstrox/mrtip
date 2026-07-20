import { migrate } from "drizzle-orm/node-postgres/migrator"

import { db } from "./client"
import { env } from "../env"

await migrate(db, { migrationsFolder: import.meta.dir + "/migrations" })

console.log(`✅ migrations aplicadas (${env.appEnv})`)
process.exit(0)
