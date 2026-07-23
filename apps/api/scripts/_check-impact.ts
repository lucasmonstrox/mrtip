/**
 * Re-teste dos dependentes de `match.date` depois da reescrita de fuso do LIG-012 (P1).
 *
 * O risco real para eles NÃO é a hora, é o DIA: meio-de-semana × fim-de-semana (SIN-008), dias de
 * descanso (LIG-005) e densidade da janela de forma (MOD-009) são todos derivados da data. Este
 * script prova as duas metades: (a) o dado inglês manteve o MESMO dia da semana (nenhuma
 * reclassificação silenciosa) e (b) os cálculos rodam corretos sobre o dado novo da Série A.
 */
import { existsSync, readFileSync } from "node:fs"
import { getDay, parseISO } from "date-fns"
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { lastMatchBefore, loadMatches } from "../src/modules/leagues/shared/shared"

const SNAPSHOT = `${import.meta.dir}/output/_kickoff-snapshot.json`

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

// --- (a) SIN-008: nenhum jogo INGLÊS mudou de dia da semana ------------------------------------
// Meio-de-semana × fim-de-semana é função do weekday; se algum jogo tivesse trocado de dia, o sinal
// de "ressaca de meio de semana" reclassificaria sozinho, sem erro visível.
if (existsSync(SNAPSHOT)) {
  const before = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as Record<string, string>
  const rows = await q<{ id: string; date: string; league_code: string }>(sql`
    select id::text as id, date::text as date, league_code from match where league_code <> 'BRA'`)
  let compared = 0
  let weekdayChanged = 0
  for (const m of rows) {
    const prev = before[m.id]
    if (prev === undefined) continue
    compared++
    if (getDay(parseISO(prev.slice(0, 10))) !== getDay(parseISO(m.date))) weekdayChanged++
  }
  check(compared > 0 && weekdayChanged === 0, "SIN-008: 0 jogos ingleses mudaram de dia da semana", `comparados=${compared} · mudaram=${weekdayChanged}`)
} else {
  console.log("(snapshot ausente — a metade de não-regressão do SIN-008 não pôde ser rodada)")
}

// Fixado na temporada 2025 (encerrada) de propósito: é a que o LIG-012 ingeriu e prova, e uma season
// encerrada dá assert estável — a corrente muda de valor a cada rodada.
const SEASON_2025 = 25184
const [s2025] = await q<{ id: string }>(sql`select id::text as id from season where sportmonks_season_id = ${SEASON_2025}`)

// Distribuição de meio-de-semana na Série A (o calendário BR é notoriamente denso).
const bra = await q<{ date: string }>(sql`
  select m.date::text as date from match m join season se on se.id = m.season_id
  where m.league_code='BRA' and se.sportmonks_season_id = ${SEASON_2025}`)
const midweek = bra.filter((m) => {
  const d = getDay(parseISO(m.date))
  return d >= 2 && d <= 4 // ter/qua/qui
}).length
check(bra.length === 380 && midweek > 0, "SIN-008: Série A tem jogos de meio de semana classificáveis", `${midweek}/${bra.length} em ter-qui (${((midweek / bra.length) * 100).toFixed(1)}%)`)

// --- (b) LIG-005: dias de descanso calculam sobre o dado brasileiro ----------------------------
const braMatches = await loadMatches("BRA", s2025!.id)
let restComputed = 0
let restInvalid = 0
for (const m of braMatches.slice(0, 120)) {
  const prev = lastMatchBefore(braMatches, m.home.id, m.date)
  if (!prev) continue
  restComputed++
  const days = Math.round((Date.parse(m.date) - Date.parse(prev.date)) / 86_400_000)
  // Descanso tem de ser positivo e plausível — negativo denuncia ordenação/data corrompida.
  if (days <= 0 || days > 90) restInvalid++
}
check(restComputed > 0 && restInvalid === 0, "LIG-005: dias de descanso positivos e plausíveis na Série A", `calculados=${restComputed} · inválidos=${restInvalid}`)

// --- (b) MOD-009: gaps da janela de forma são positivos e ordenados ---------------------------
const [flamengo] = await q<{ id: string }>(sql`
  select t.id::text as id from team t join standing st on st.team_id=t.id
  join season s on s.id=st.season_id where s.sportmonks_season_id = ${SEASON_2025} order by st.position limit 1`)
const flaMatches = braMatches
  .filter((m) => m.home.id === flamengo!.id || m.away.id === flamengo!.id)
  .sort((a, b) => a.date.localeCompare(b.date))
const gaps: number[] = []
for (let i = 1; i < flaMatches.length; i++) {
  gaps.push(Math.round((Date.parse(flaMatches[i]!.date) - Date.parse(flaMatches[i - 1]!.date)) / 86_400_000))
}
check(
  flaMatches.length === 38 && gaps.every((g) => g >= 0) && gaps.some((g) => g > 0),
  "MOD-009: espaçamento da janela de forma computável na Série A",
  `38 jogos · ${gaps.length} gaps · min=${Math.min(...gaps)} max=${Math.max(...gaps)} dias`,
)

// --- LIG-009: slug da partida nasce bem-formado e único na Série A ----------------------------
const [slugs] = await q<{ n: number; distinct: number; bad: number }>(sql`
  select count(*)::int as n, count(distinct m.slug)::int as distinct,
         count(*) filter (where m.slug is null or m.slug !~ '^brasileirao-2025-')::int as bad
  from match m join season se on se.id = m.season_id
  where m.league_code = 'BRA' and se.sportmonks_season_id = ${SEASON_2025}`)
check(
  slugs != null && slugs.n === slugs.distinct && slugs.bad === 0,
  "LIG-009: 380 slugs únicos e bem-formados na Série A",
  `n=${slugs?.n} distintos=${slugs?.distinct} malformados=${slugs?.bad}`,
)

console.log(`\n${ok}/${total}`)
process.exit(ok === total ? 0 : 1)
