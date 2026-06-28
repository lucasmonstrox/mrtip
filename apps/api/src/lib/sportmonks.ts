import { env } from "../env"

/**
 * Client mínimo da SportMonks Football API v3. Usado pelos scripts de sync (a API HTTP
 * não bate aqui). Auth via query param `api_token`. Toda resposta vem no envelope
 * { data, pagination?, rate_limit, subscription } — `sm()` devolve `data` desembrulhado.
 *
 * Plano Starter (Advanced): 5 ligas, 2000 req/h por entidade. Premier League = league_id 8.
 */
const BASE = "https://api.sportmonks.com/v3/football"

type Envelope<T> = {
  data?: T
  message?: string
  pagination?: { count: number; per_page: number; current_page: number; has_more: boolean }
  rate_limit?: { remaining: number; resets_in_seconds: number; requested_entity: string }
}

function token(): string {
  const t = env.sportmonksApiKey
  if (!t) throw new Error("SPORTMONKS_API_KEY ausente no .env (necessária pro sync da SportMonks).")
  return t
}

function withAuth(path: string): string {
  const url = new URL(BASE + path)
  url.searchParams.set("api_token", token())
  return url.toString()
}

/** GET de um recurso (objeto ou array numa página só). Lança em status != 2xx. */
export async function sm<T>(path: string): Promise<T> {
  const res = await fetch(withAuth(path))
  const body = (await res.json()) as Envelope<T>
  if (!res.ok || body.data === undefined) {
    throw new Error(`SportMonks ${path} → ${res.status} ${body.message ?? "sem data"}`)
  }
  return body.data
}

/**
 * GET paginado: segue `pagination.has_more` acumulando todas as páginas num array só.
 * Usar quando o recurso é uma lista grande (ex.: times de uma temporada). `path` não deve
 * conter `page`; o helper injeta `?page=N` (preserva os outros query params via `&`).
 */
export async function smAll<T>(path: string): Promise<T[]> {
  const sep = path.includes("?") ? "&" : "?"
  const out: T[] = []
  let page = 1
  for (;;) {
    const res = await fetch(withAuth(`${path}${sep}page=${page}`))
    const body = (await res.json()) as Envelope<T[]>
    if (!res.ok || body.data === undefined) {
      throw new Error(`SportMonks ${path} (page ${page}) → ${res.status} ${body.message ?? "sem data"}`)
    }
    out.push(...body.data)
    if (!body.pagination?.has_more) break
    page += 1
  }
  return out
}
