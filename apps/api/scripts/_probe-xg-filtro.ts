/** Última dúvida em aberto: os type_ids de xG passam pelo include `statistics` NORMAL
 * (que já pagamos) se entrarem no filtro fixtureStatisticTypes? É caminho diferente do
 * include xGFixture, que dá 403. Uma request decide. */
import { env } from "../src/env"
const BASE = "https://api.sportmonks.com/v3/football"
const XG = [5304, 9684, 9685, 9686, 9687, 7943]
const FIX = 19427242 // PL encerrada, mesma usada nas outras sondas

async function get(path: string) {
  const u = new URL(BASE + path); u.searchParams.set("api_token", env.sportmonksApiKey!)
  const r = await fetch(u.toString()); return { status: r.status, body: await r.json() as any }
}
// 1. include statistics SEM filtro nenhum — o que vem de verdade
const all = await get(`/fixtures/${FIX}?include=statistics`)
const got = new Set<number>((all.body.data?.statistics ?? []).map((s: any) => s.type_id))
console.log(`sem filtro → ${all.status}, ${got.size} types distintos`)
console.log(`xG presentes sem filtro: ${XG.filter(t => got.has(t)).join(",") || "NENHUM"}`)

// 2. include statistics PEDINDO explicitamente os ids de xG no filtro
const f = await get(`/fixtures/${FIX}?include=statistics&filters=fixtureStatisticTypes:${XG.join(",")}`)
const fgot = (f.body.data?.statistics ?? []) as any[]
console.log(`\ncom filtro xG → ${f.status}, ${fgot.length} linhas`)
if (f.body.message) console.log(`message: ${f.body.message}`)
console.log(fgot.length ? JSON.stringify(fgot.slice(0, 6), null, 1) : "VAZIO — o filtro não traz xG")
