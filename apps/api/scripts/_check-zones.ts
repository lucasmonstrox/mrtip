/**
 * Prova das zonas de classificação (LIG-012 P3). Sem flag: função pura — alimenta `normalizeZone`
 * com os `developer_name` que a SportMonks devolve e confere a chave normalizada, sem banco e sem
 * rede. Com `--db`: confere as zonas gravadas em `standing` na season da Série A (P4).
 *
 * Cobre as 4 zonas CONMEBOL (incluindo a armadilha de prefixo Libertadores × pré-Libertadores) e a
 * NÃO-REGRESSÃO das 4 zonas europeias, que têm de sair idênticas ao comportamento anterior.
 */
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { normalizeZone } from "../src/db/zones"

type ZoneCase = { dev: string; expected: string | null; what: string }

const CASES: ZoneCase[] = [
  // CONMEBOL — as 4 zonas da Série A. Libertadores e pré-Libertadores são zonas DISTINTAS na tabela.
  { dev: "CONMEBOL_LIBERTADORES", expected: "libertadores", what: "Libertadores (fase de grupos)" },
  { dev: "CONMEBOL_LIBERTADORES_QUALIFIERS", expected: "libertadores-qualifiers", what: "pré-Libertadores (prefixo colide com a de cima)" },
  { dev: "CONMEBOL_SUDAMERICANA", expected: "sudamericana", what: "Sudamericana" },
  { dev: "RELEGATION", expected: "relegation", what: "rebaixamento (compartilhado com a PL)" },
  // Não-regressão da PL — saída idêntica à de hoje.
  { dev: "CHAMPIONS_LEAGUE", expected: "champions", what: "não-regressão PL: Champions" },
  { dev: "EUROPA_LEAGUE", expected: "europa", what: "não-regressão PL: Europa" },
  { dev: "CONFERENCE_LEAGUE", expected: "conference", what: "não-regressão PL: Conference" },
  { dev: "CHAMPIONS_LEAGUE_QUALIFIERS", expected: "champions", what: "não-regressão PL: pré-Champions cai em champions (como hoje)" },
  // Bordas.
  { dev: "", expected: null, what: "vazio → null (meio de tabela)" },
  { dev: "SOMETHING_UNKNOWN", expected: null, what: "zona desconhecida → null, não quebra" },
]

function pure(): number {
  let ok = 0
  for (const c of CASES) {
    const got = normalizeZone(c.dev || undefined)
    const pass = got === c.expected
    if (pass) ok++
    console.log(`${pass ? "OK  " : "FAIL"} ${(c.dev || "(vazio)").padEnd(34)} → esperado ${String(c.expected).padEnd(24)} · obtido ${String(got).padEnd(24)} [${c.what}]`)
  }
  // As 4 zonas CONMEBOL têm de ser 4 valores DISTINTOS (senão duas zonas pintam igual na tabela).
  const conmebol = CASES.slice(0, 3).map((c) => normalizeZone(c.dev))
  const distinct = new Set(conmebol).size === 3 && !conmebol.includes(null)
  if (distinct) ok++
  console.log(`${distinct ? "OK  " : "FAIL"} 3 zonas CONMEBOL distintas e não-null → ${JSON.stringify(conmebol)}`)
  const total = CASES.length + 1
  console.log(`\n${ok}/${total}`)
  return ok === total ? 0 : 1
}

async function checkDb(): Promise<number> {
  const r: unknown = await db.execute(sql`
    select st.zone, count(*)::int as n
    from standing st join season s on s.id = st.season_id
    where s.league_code = 'BRA' group by 1 order by 1 nulls last`)
  const rows = (Array.isArray(r) ? r : ((r as { rows: unknown[] }).rows ?? [])) as { zone: string | null; n: number }[]
  console.log("zonas gravadas na BRA:", JSON.stringify(rows))
  const zones = new Set(rows.map((x) => x.zone).filter((z): z is string => z !== null))
  const wanted = ["libertadores", "libertadores-qualifiers", "sudamericana", "relegation"]
  let ok = 0
  for (const w of wanted) {
    const pass = zones.has(w)
    if (pass) ok++
    console.log(`${pass ? "OK  " : "FAIL"} zona ${w} presente na Série A`)
  }
  console.log(`\n${ok}/${wanted.length}`)
  return ok === wanted.length ? 0 : 1
}

const code = process.argv[2] === "--db" ? await checkDb() : pure()
process.exit(code)
