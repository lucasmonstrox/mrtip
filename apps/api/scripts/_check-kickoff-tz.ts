/**
 * Prova do fuso de kickoff (LIG-012 P1a/P1b). Sem flag: função pura — alimenta `kickoffInTimeZone`
 * com entradas fixas e confere `date`/`time` esperados, sem banco e sem rede. Com `--db`: confere no
 * banco, por lote de sync, a fração de partidas cujo horário mudou depois do re-sync.
 *
 * `--snapshot` grava o estado atual de `match.date`/`match.time` (rodar ANTES do re-sync do P1b);
 * `--db` compara o banco contra esse snapshot e denuncia lote esquecido (0% global) ou conversão
 * dupla (100%).
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { differenceInMinutes, parseISO } from "date-fns"
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { kickoffInTimeZone } from "../src/lib/kickoff"

const SNAPSHOT = `${import.meta.dir}/output/_kickoff-snapshot.json`

type PureCase = { startingAt: string; timeZone: string; date: string; time: string; what: string }

// Camada 1 do dossiê §Fuso: BRT que vira o dia, BST que corrige para 15:00, GMT que sai inalterado.
const CASES: PureCase[] = [
  { startingAt: "2026-01-29 00:30:00", timeZone: "America/Sao_Paulo", date: "2026-01-28", time: "21:30", what: "BRT (UTC-3) vira o dia anterior" },
  { startingAt: "2025-08-16 14:00:00", timeZone: "Europe/London", date: "2025-08-16", time: "15:00", what: "BST aplicado (bug vivo: hoje grava 14:00)" },
  { startingAt: "2025-12-27 15:00:00", timeZone: "Europe/London", date: "2025-12-27", time: "15:00", what: "GMT inalterado (se mudar = conversão dupla)" },
]

type Row = { id: string; season: number; league_code: string; date: string; time: string }

async function rows(): Promise<Row[]> {
  const r: unknown = await db.execute(sql`
    select m.id::text as id, s.sportmonks_season_id as season, m.league_code, m.date::text as date, m.time
    from match m join season s on s.id = m.season_id`)
  return (Array.isArray(r) ? r : ((r as { rows: Row[] }).rows ?? [])) as Row[]
}

function pure(): number {
  let ok = 0
  for (const c of CASES) {
    let got: { date: string; time: string } | string
    try {
      got = kickoffInTimeZone(c.startingAt, c.timeZone)
    } catch (e) {
      got = `throw: ${(e as Error).message}`
    }
    const pass = typeof got !== "string" && got.date === c.date && got.time === c.time
    if (pass) ok++
    const shown = typeof got === "string" ? got : `${got.date} ${got.time}`
    console.log(`${pass ? "OK  " : "FAIL"} ${c.startingAt} @ ${c.timeZone} → esperado ${c.date} ${c.time} · obtido ${shown}  [${c.what}]`)
  }
  console.log(`\n${ok}/${CASES.length}`)
  return ok === CASES.length ? 0 : 1
}

async function snapshot(): Promise<number> {
  const all = await rows()
  const map: Record<string, string> = {}
  for (const m of all) map[m.id] = `${m.date} ${m.time}`
  writeFileSync(SNAPSHOT, JSON.stringify(map))
  console.log(`snapshot: ${all.length} partidas gravadas em ${SNAPSHOT}`)
  return all.length > 0 ? 0 : 1
}

// Meses seguramente em BST (verão inglês) e em GMT (inverno). Março/abril/outubro/novembro são meses de
// virada do horário de verão — ficam fora do assert estrito de propósito.
const BST_MONTHS = new Set([5, 6, 7, 8, 9])
const GMT_MONTHS = new Set([12, 1, 2])

async function checkDb(): Promise<number> {
  if (!existsSync(SNAPSHOT)) {
    console.error(`FAIL: snapshot ausente (${SNAPSHOT}) — rode --snapshot ANTES do re-sync`)
    return 1
  }
  const before = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as Record<string, string>
  const all = await rows()
  type Lote = { total: number; bst: number; bstShifted: number; gmt: number; gmtShifted: number; oddDelta: number; dateRolled: number }
  const lotes = new Map<string, Lote>()
  for (const m of all) {
    const prev = before[m.id]
    if (prev === undefined) continue // partida nova (BRA no P4) não tem "antes" para comparar
    const key = `${m.league_code} ${m.season}`
    const l = lotes.get(key) ?? { total: 0, bst: 0, bstShifted: 0, gmt: 0, gmtShifted: 0, oddDelta: 0, dateRolled: 0 }
    l.total++
    // Mudança de DIA (não só de hora) é o que reclassifica feature que depende de `match.date`:
    // meio-de-semana × fim-de-semana (SIN-008) e dias de descanso (LIG-005). Londres é UTC+0/+1, então
    // nenhum lote inglês pode virar o dia; a Série A (UTC-3) vira, e é esperado.
    if (prev.slice(0, 10) !== m.date) l.dateRolled++
    // Delta em minutos entre a hora de parede gravada antes e depois do re-sync.
    const delta = differenceInMinutes(parseISO(`${m.date}T${m.time}`), parseISO(prev.replace(" ", "T")))
    if (delta !== 0 && delta !== 60) l.oddDelta++
    const month = Number(m.date.slice(5, 7))
    if (BST_MONTHS.has(month)) {
      l.bst++
      if (delta === 60) l.bstShifted++
    }
    if (GMT_MONTHS.has(month)) {
      l.gmt++
      if (delta !== 0) l.gmtShifted++
    }
    lotes.set(key, l)
  }

  let ok = 0
  const total = lotes.size
  for (const [key, l] of [...lotes].sort()) {
    // Jogo em BST TEM de andar +1h (senão aquele lote não foi re-sincado); jogo em GMT NÃO pode andar
    // (senão é conversão dupla); e nenhum delta pode ser diferente de 0/+60.
    const bstOk = l.bst === 0 || l.bstShifted === l.bst
    const gmtOk = l.gmtShifted === 0
    // Todos os lotes com "antes" são ingleses (a BRA nasceu no P4 e não tem snapshot): Londres nunca
    // vira o dia, então qualquer dateRolled > 0 aqui reclassificaria SIN-008/LIG-005 em silêncio.
    const dateOk = l.dateRolled === 0
    const pass = bstOk && gmtOk && dateOk && l.oddDelta === 0
    if (pass) ok++
    const why = !bstOk
      ? `SYNC ESQUECIDO (${l.bst - l.bstShifted} jogo(s) BST sem o +1h)`
      : !gmtOk
        ? `CONVERSÃO DUPLA (${l.gmtShifted} jogo(s) GMT mudou)`
        : !dateOk
          ? `DIA MUDOU em ${l.dateRolled} jogo(s) inglês(es) — reclassifica SIN-008/LIG-005`
          : l.oddDelta > 0
            ? `DELTA INESPERADO em ${l.oddDelta} jogo(s)`
            : "ok"
    console.log(`${pass ? "OK  " : "FAIL"} ${key.padEnd(12)} n=${String(l.total).padEnd(4)} BST +1h ${String(l.bstShifted).padStart(3)}/${String(l.bst).padEnd(3)} · GMT mudou ${l.gmtShifted}/${l.gmt} · dia mudou ${l.dateRolled}  [${why}]`)
  }
  console.log(`\n${ok}/${total}`)
  return ok === total && total > 0 ? 0 : 1
}

const mode = process.argv[2]
const code = mode === "--db" ? await checkDb() : mode === "--snapshot" ? await snapshot() : pure()
process.exit(code)
