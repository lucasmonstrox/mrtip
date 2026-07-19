/**
 * Prova de superfície `api` do LIG-012 (A5/A7) no nível de SERVICE. O HTTP está atrás do Clerk
 * (`{"error":"no_token"}`), então o `curl` do plano não é executável nesta sessão; estes asserts
 * chamam exatamente os mesmos services que as rotas chamam, sem a borda de auth.
 *
 * Cobre: time/jogador brasileiro resolvendo para a temporada da Série A, os equivalentes ingleses
 * seguindo na PL, e a borda de erro (`?season=` inexistente → season_not_found).
 */
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { getPlayer } from "../src/modules/leagues/get-player/get-player.service"
import { getTeam } from "../src/modules/leagues/get-team/get-team.service"
import { standings } from "../src/modules/leagues/standings/standings.service"

let ok = 0
let total = 0
function check(pass: boolean, label: string, detail: string): void {
  total++
  if (pass) ok++
  console.log(`${pass ? "OK  " : "FAIL"} ${label} — ${detail}`)
}

async function q<T>(s: ReturnType<typeof sql>): Promise<T[]> {
  const r: unknown = await db.execute(s)
  return (Array.isArray(r) ? r : ((r as { rows: T[] }).rows ?? [])) as T[]
}

const [braTeam] = await q<{ slug: string; name: string }>(sql`
  select t.slug, t.name from team t join standing st on st.team_id = t.id
  join season s on s.id = st.season_id where s.league_code='BRA' order by st.position limit 1`)
const [braPlayer] = await q<{ id: string; name: string }>(sql`
  select p.id::text as id, p.name from player p join lineup_player lp on lp.player_id=p.id
  join lineup l on l.id=lp.lineup_id join match m on m.id=l.match_id where m.league_code='BRA' limit 1`)
const [plPlayer] = await q<{ id: string; name: string }>(sql`
  select p.id::text as id, p.name from player p join lineup_player lp on lp.player_id=p.id
  join lineup l on l.id=lp.lineup_id join match m on m.id=l.match_id where m.league_code='PL' limit 1`)

// --- Time brasileiro abre na Série A -------------------------------------------------------------
const bra = await getTeam(braTeam!.slug)
const braCodes = new Set(bra.matches.map((m: { competition: { code: string } }) => m.competition.code))
check(bra.matches.length > 0 && braCodes.has("BRA") && !braCodes.has("PL"), `getTeam(${braTeam?.name}) resolve na Série A`, `${bra.matches.length} jogos · competições=${JSON.stringify([...braCodes])}`)
check(bra.standing != null, `getTeam(${braTeam?.name}) traz a classificação da season BRA`, `posição=${bra.standing?.position} zona=${bra.standing?.zone}`)

// --- Time inglês segue na PL (não-regressão por equivalência de argumento) ------------------------
const ars = await getTeam("arsenal")
const arsCodes = new Set(ars.matches.map((m: { competition: { code: string } }) => m.competition.code))
check(ars.matches.length > 0 && !arsCodes.has("BRA"), "getTeam(arsenal) segue inglês, sem vazar Série A", `${ars.matches.length} jogos · competições=${JSON.stringify([...arsCodes])}`)

// --- Jogadores ------------------------------------------------------------------------------------
const braP = await getPlayer(braPlayer!.id)
check(braP != null, `getPlayer(${braPlayer?.name}) responde (Série A)`, `jogos=${JSON.stringify(Object.keys(braP ?? {})).slice(0, 80)}`)
const plP = await getPlayer(plPlayer!.id)
check(plP != null, `getPlayer(${plPlayer?.name}) responde (PL)`, `ok`)

// --- Tabela das duas ligas -------------------------------------------------------------------------
// A 2025 é passada explicitamente: a corrente da BRA é a 2026 (em curso), cujas zonas mudam a cada
// rodada — assert estável só existe sobre a temporada encerrada.
const braTable = await standings("BRA", { season: 25184 })
const braCurrent = await standings("BRA", {})
const plTable = await standings("PL", {})
check(braTable.length === 20, "standings(BRA 2025) devolve 20 clubes", `n=${braTable.length}`)
check(braCurrent.length === 20, "standings(BRA corrente/2026) devolve 20 clubes", `n=${braCurrent.length}`)
check(plTable.length === 20, "standings(PL) devolve 20 clubes", `n=${plTable.length}`)
const zoned = braTable.filter((r) => r.zone != null).length
check(zoned === 16, "standings(BRA 2025) traz 16 linhas com zona (4+2+6+4)", `zonas=${zoned}`)
// A PL não pode ter ganho rótulo CONMEBOL nenhum.
const plZones = new Set(plTable.map((r) => r.zone).filter(Boolean))
check(![...plZones].some((z) => String(z).includes("libertadores") || z === "sudamericana"), "standings(PL) sem zona CONMEBOL vazada", JSON.stringify([...plZones]))

// --- Borda de erro: season inexistente -------------------------------------------------------------
try {
  await getTeam(braTeam!.slug, 999999)
  check(false, "?season= inexistente → season_not_found", "não lançou")
} catch (e) {
  const msg = (e as Error).message ?? String(e)
  check(/season_not_found/.test(msg), "?season= inexistente → season_not_found", msg.slice(0, 60))
}

console.log(`\n${ok}/${total}`)
process.exit(ok === total ? 0 : 1)
