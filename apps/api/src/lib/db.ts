import { db } from "../db/client"

// Handle de transação do Drizzle (o `tx` recebido no callback de `db.transaction`).
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
