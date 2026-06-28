/**
 * CORS para o front (apps/web). Dados são públicos (openfootball), sem auth/credenciais.
 * Em PROD: pinado no `WEB_ORIGIN`. Em DEV (sem `WEB_ORIGIN`): regex que libera qualquer
 * porta de localhost — o Next escolhe 3000/3001/… conforme o que estiver livre.
 */
import { cors } from "@elysiajs/cors"
import { Elysia } from "elysia"

import { env } from "../../env"

export const corsPlugin = new Elysia({ name: "plugin.cors" }).use(
  cors({
    origin: env.webOrigin ?? /^http:\/\/localhost:\d+$/,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
)
