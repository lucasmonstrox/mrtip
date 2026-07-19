/**
 * Prova da season derivada da liga (LIG-012 P7). O teste é BIDIRECIONAL de propósito: só provar que
 * um time da PL resolve para "PL" passaria também se a derivação estivesse quebrada e devolvendo
 * `null` para todo mundo (o fallback é "PL"). Então exige-se as duas metades — clube/jogador
 * brasileiro tem de resolver "BRA", e inglês tem de resolver "PL" de verdade, não por acidente.
 *
 * A metade "PL" é o que sustenta a não-regressão: se `leagueCodeOfTeam(arsenal) === "PL"`, o argumento
 * passado a `resolveSeason` é idêntico ao "PL" hardcoded de antes — logo a resposta inteira é idêntica.
 */
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { leagueCodeOfPlayer, leagueCodeOfTeam } from "../src/modules/leagues/shared/shared"

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

// Um clube de cada liga, pela tabela de classificação da temporada corrente.
const [braTeam] = await q<{ id: string; name: string }>(sql`
  select t.id::text as id, t.name from team t join standing st on st.team_id = t.id
  join season s on s.id = st.season_id where s.league_code = 'BRA' order by st.position limit 1`)
const [plTeam] = await q<{ id: string; name: string }>(sql`
  select t.id::text as id, t.name from team t join standing st on st.team_id = t.id
  join season s on s.id = st.season_id where s.league_code = 'PL' and s.is_current order by st.position limit 1`)

check((await leagueCodeOfTeam(braTeam!.id)) === "BRA", `time brasileiro (${braTeam?.name}) → BRA`, `obtido ${await leagueCodeOfTeam(braTeam!.id)}`)
check((await leagueCodeOfTeam(plTeam!.id)) === "PL", `time inglês (${plTeam?.name}) → PL`, `obtido ${await leagueCodeOfTeam(plTeam!.id)}`)

// Um jogador cuja aparição mais recente é de cada liga.
const [braPlayer] = await q<{ id: string; name: string }>(sql`
  select p.id::text as id, p.name from player p
  join lineup_player lp on lp.player_id = p.id join lineup l on l.id = lp.lineup_id
  join match m on m.id = l.match_id where m.league_code = 'BRA' limit 1`)
const [plPlayer] = await q<{ id: string; name: string }>(sql`
  select p.id::text as id, p.name from player p
  join lineup_player lp on lp.player_id = p.id join lineup l on l.id = lp.lineup_id
  join match m on m.id = l.match_id where m.league_code = 'PL' limit 1`)

check((await leagueCodeOfPlayer(braPlayer!.id)) === "BRA", `jogador brasileiro (${braPlayer?.name}) → BRA`, `obtido ${await leagueCodeOfPlayer(braPlayer!.id)}`)
check((await leagueCodeOfPlayer(plPlayer!.id)) === "PL", `jogador inglês (${plPlayer?.name}) → PL`, `obtido ${await leagueCodeOfPlayer(plPlayer!.id)}`)

// O filtro `league.type = 'league'` TEM de estar ativo: um jogador que só tem escalação de copa não
// pode resolver para FAC/CARA — cai em null (→ default "PL"). Sem o filtro, jogador da PL com jogo de
// copa mais recente resolveria para a copa.
const [cupOnly] = await q<{ id: string; name: string }>(sql`
  select p.id::text as id, p.name from player p
  join lineup_player lp on lp.player_id = p.id join lineup l on l.id = lp.lineup_id
  join match m on m.id = l.match_id
  group by p.id, p.name
  having count(*) filter (where m.league_code in ('FAC','CARA')) > 0
     and count(*) filter (where m.league_code not in ('FAC','CARA')) = 0
  limit 1`)
if (cupOnly) {
  const got = await leagueCodeOfPlayer(cupOnly.id)
  check(got === null, `jogador só de copa (${cupOnly.name}) → null (não FAC/CARA)`, `obtido ${got}`)
} else {
  console.log("(sem jogador exclusivo de copa no banco — filtro league.type não pôde ser exercitado por este caso)")
}

// Borda: entidade sem aparição nenhuma → null, para o service cair no default "PL" sem lançar.
const [orphan] = await q<{ id: string; name: string }>(sql`
  select t.id::text as id, t.name from team t
  left join standing st on st.team_id = t.id where st.id is null limit 1`)
if (orphan) {
  const got = await leagueCodeOfTeam(orphan.id)
  check(got === null, `time sem campanha (${orphan.name}) → null (service cai no default "PL")`, `obtido ${got}`)
}

console.log(`\n${ok}/${total}`)
process.exit(ok === total ? 0 : 1)
