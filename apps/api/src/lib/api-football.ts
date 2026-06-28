import { env } from "../env"

/**
 * Client mínimo da API-Football v3 (api-sports.io). Usado só pelos scripts de seed.
 * Auth via header `x-apisports-key`. Toda resposta vem no envelope
 * { response, errors, results, paging } — devolvemos `response` já desembrulhado.
 *
 * Plano Free: 100 req/dia, temporadas 2022–2024.
 */
const BASE = "https://v3.football.api-sports.io"

type Envelope<T> = {
  response: T
  errors: unknown
  results: number
  paging?: { current: number; total: number }
}

function temErro(errors: unknown): boolean {
  if (Array.isArray(errors)) return errors.length > 0
  return !!errors && typeof errors === "object" && Object.keys(errors).length > 0
}

export async function af<T>(path: string): Promise<T> {
  if (!env.apiFootballKey) {
    throw new Error("API_FOOTBALL_KEY ausente no .env (necessária pro seed da API-Football).")
  }
  const res = await fetch(BASE + path, { headers: { "x-apisports-key": env.apiFootballKey } })
  const body = (await res.json()) as Envelope<T>
  if (temErro(body.errors)) {
    throw new Error(`API-Football ${path} → ${JSON.stringify(body.errors)}`)
  }
  return body.response
}
