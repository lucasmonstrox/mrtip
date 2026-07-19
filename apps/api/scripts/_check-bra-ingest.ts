/**
 * Prova da ingestão da Série A 2025 (LIG-012 P4): contagens, integridade e os asserts herdados do
 * P1 (fuso) e do P3 (zonas/logo), que só agora têm dado brasileiro para rodar. Inclui a
 * não-regressão da PL — o modo de falha que interessa é ingestão cruzada.
 */
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { kickoffInTimeZone } from "../src/lib/kickoff"
import { sm } from "../src/lib/sportmonks"

const SEASON_BRA = 25184
const TZ = "America/Sao_Paulo"

async function q<T>(s: ReturnType<typeof sql>): Promise<T[]> {
  const r: unknown = await db.execute(s)
  return (Array.isArray(r) ? r : ((r as { rows: T[] }).rows ?? [])) as T[]
}

let ok = 0
let total = 0
function check(pass: boolean, label: string, detail: string): void {
  total++
  if (pass) ok++
  console.log(`${pass ? "OK  " : "FAIL"} ${label} — ${detail}`)
}

// --- Contagens e integridade, POR TEMPORADA -----------------------------------
// Escopado por season, não por liga: com 2025 e 2026 no ar, um assert de liga somaria as duas e
// deixaria de medir o que interessa (a completude de cada temporada).
// A janela aceita 1 dia de folga: o jogo noturno de BRT (UTC-3) cai no dia ANTERIOR ao do UTC, então
// uma partida na estreia pode legitimamente ter `date` = véspera do `starting_at` da temporada.
const SEASONS = [
  { sm: 25184, nome: "2025", jogos: 380, de: "2025-03-28", ate: "2025-12-07" },
  { sm: 26763, nome: "2026", jogos: 380, de: "2026-01-27", ate: "2026-12-02" },
]

for (const s of SEASONS) {
  const [m] = await q<{ n: number }>(sql`
    select count(*)::int as n from match m join season se on se.id = m.season_id
    where m.league_code = 'BRA' and se.sportmonks_season_id = ${s.sm}`)
  check(m?.n === s.jogos, `BRA ${s.nome}: ${s.jogos} partidas`, `n=${m?.n}`)

  const [t] = await q<{ n: number }>(sql`
    select count(distinct st.team_id)::int as n from standing st
    join season se on se.id = st.season_id where se.sportmonks_season_id = ${s.sm}`)
  check(t?.n === 20, `BRA ${s.nome}: 20 clubes na tabela`, `n=${t?.n}`)

  const [range] = await q<{ n: number; min: string; max: string }>(sql`
    select count(*) filter (where m.date < ${s.de}::date or m.date > ${s.ate}::date)::int as n,
           min(m.date)::text as min, max(m.date)::text as max
    from match m join season se on se.id = m.season_id
    where m.league_code='BRA' and se.sportmonks_season_id = ${s.sm}`)
  check(range?.n === 0, `BRA ${s.nome}: 0 partidas fora de ${s.de}..${s.ate}`, `n=${range?.n} · min=${range?.min} max=${range?.max}`)
}

const [nullSeason] = await q<{ n: number }>(sql`select count(*)::int as n from match where league_code='BRA' and season_id is null`)
check(nullSeason?.n === 0, "0 partidas BRA com season_id null", `n=${nullSeason?.n}`)

// Exatamente UMA corrente por liga (LIG-008) e, com a 2026 ingerida, tem de ser a 2026.
const [cur] = await q<{ n: number; sm: number }>(sql`
  select count(*)::int as n, max(sportmonks_season_id)::int as sm
  from season where league_code='BRA' and is_current = true`)
check(cur?.n === 1 && cur?.sm === 26763, "BRA: exatamente 1 season corrente, e é a 2026", `n=${cur?.n} · season=${cur?.sm}`)

// A 2026 está EM CURSO: tem de ter jogo com placar e jogo ainda sem placar. Se estivesse 100%
// preenchida ou 100% vazia, o sweep teria pego a temporada errada.
const [prog] = await q<{ jogados: number; futuros: number }>(sql`
  select count(*) filter (where m.ft_home is not null)::int as jogados,
         count(*) filter (where m.ft_home is null)::int as futuros
  from match m join season se on se.id = m.season_id
  where m.league_code='BRA' and se.sportmonks_season_id = 26763`)
check(
  (prog?.jogados ?? 0) > 0 && (prog?.futuros ?? 0) > 0,
  "BRA 2026: temporada em curso (tem jogo disputado E jogo futuro)",
  `disputados=${prog?.jogados} · a disputar=${prog?.futuros}`,
)

// --- (a) Fuso: confere contra a API, partida a partida (herdado do P1) --------
const fixtures = await sm<{ id: number; starting_at: string }[]>(
  `/fixtures/between/2025-03-22/2025-06-19?filters=fixtureSeasons:${SEASON_BRA}&per_page=50`,
)
const stored = await q<{ sm: number; date: string; time: string }>(sql`
  select sportmonks_fixture_id as sm, date::text as date, time from match where league_code = 'BRA'`)
const bySm = new Map(stored.map((r) => [r.sm, r]))
let compared = 0
let mismatched = 0
let dayShifted = 0
for (const f of fixtures) {
  const row = bySm.get(f.id)
  if (!row) continue
  compared++
  const expected = kickoffInTimeZone(f.starting_at, TZ)
  if (expected.date !== row.date || expected.time !== row.time) mismatched++
  if (f.starting_at.slice(0, 10) !== row.date) dayShifted++
}
check(compared > 0 && mismatched === 0, "fuso BRA bate com a API partida a partida", `comparadas=${compared} · divergentes=${mismatched}`)
check(dayShifted > 0, "≥1 partida BRA cujo dia local difere do dia UTC (jogo noturno)", `dayShifted=${dayShifted}/${compared}`)

// --- (b) Zonas CONMEBOL gravadas (herdado do P3) -----------------------------
const zones = await q<{ zone: string | null; n: number }>(sql`
  select st.zone, count(*)::int as n from standing st
  join season s on s.id = st.season_id where s.sportmonks_season_id = 25184 group by 1`)
const present = new Set(zones.map((z) => z.zone).filter((z): z is string => z !== null))
for (const w of ["libertadores", "libertadores-qualifiers", "sudamericana", "relegation"]) {
  check(present.has(w), `zona ${w} gravada na BRA`, JSON.stringify(zones))
}

// --- (c) Logo: ausência de colisão de chave no R2 (herdado do P3) ------------
const [logos] = await q<{ n: number; distinct: number; nulls: number }>(sql`
  select count(*)::int as n, count(distinct t.logo_url)::int as distinct, count(*) filter (where t.logo_url is null)::int as nulls
  from team t join standing st on st.team_id = t.id
  join season s on s.id = st.season_id where s.sportmonks_season_id = 25184`)
check(
  logos != null && logos.n === logos.distinct && logos.nulls === 0,
  "logo_url único nos 20 clubes da BRA (sem colisão de chave)",
  `n=${logos?.n} distintos=${logos?.distinct} nulos=${logos?.nulls}`,
)

// --- Não-regressão da PL ------------------------------------------------------
const pl = await q<{ season: string; n: number }>(sql`
  select s.name as season, count(m.id)::int as n from season s
  join match m on m.season_id = s.id where s.league_code = 'PL' group by 1 order by 1`)
check(pl.length === 2 && pl.every((r) => r.n === 380), "PL segue com 380+380 partidas", JSON.stringify(pl))

console.log(`\n${ok}/${total}`)
process.exit(ok === total ? 0 : 1)
