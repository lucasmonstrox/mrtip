import { treaty } from "@elysiajs/eden"

import type { App } from "@workspace/api"

const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"

/**
 * Client type-safe da API do mrtip (Eden Treaty). Os tipos vêm direto do
 * `App` exportado em `apps/api` — sem duplicação de contrato.
 */
export const api = treaty<App>(baseUrl)
