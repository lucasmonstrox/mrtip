/**
 * Relatório de validação: para CADA time, quem pode ultrapassá-lo e quem ele ainda alcança, com o
 * detalhe completo do desempate. Serve pro dono conferir na mão se os cenários batem com a realidade.
 *
 * Usa `./lib/ultrapassagem.ts` — o MESMO módulo que o `prognosis-prompt.ts` importa. É de propósito:
 * validar uma cópia da lógica não valida nada. Se este relatório estiver certo, o prompt está certo.
 *
 *   bun run scripts/_report-ultrapassagem.ts <league> <season> [cutoff-YYYY-MM-DD]
 *   bun run scripts/_report-ultrapassagem.ts BRA 2025 2025-12-07
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { tiebreakOfSeason } from "../src/modules/leagues/shared/shared"
import { cenarioUltrapassagem, ordenar, type TeamLine } from "./lib/ultrapassagem"

const [LEAGUE = "BRA", SEASON = "2025", CUTOFF = "2025-12-07"] = process.argv.slice(2)
type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]

const [seasonRow] = rowsOf(await db.execute(sql`
  select s.id, s.name from season s where s.league_code = ${LEAGUE} and s.name = ${SEASON} limit 1`))
if (!seasonRow) throw new Error(`temporada ${LEAGUE} ${SEASON} não encontrada`)
const TIEBREAK = (await tiebreakOfSeason(LEAGUE, String(seasonRow.id))).criteria

// Só jogos ANTES do cutoff entram na tabela; os do cutoff em diante contam como "restantes".
const jogos = rowsOf(await db.execute(sql`
  select m.home_team_id h, m.away_team_id a, m.ft_home fh, m.ft_away fa, m.date, th.name hn, ta.name an
  from match m
  join team th on th.id = m.home_team_id
  join team ta on ta.id = m.away_team_id
  where m.season_id = ${seasonRow.id} and m.ft_home is not null
  order by m.date`))

type Acc = { teamId: string; name: string; points: number; won: number; gd: number; gf: number; jogados: number; restantes: number }
const acc = new Map<string, Acc>()
const pega = (id: string, nome: string) => {
  let v = acc.get(id)
  if (!v) acc.set(id, (v = { teamId: id, name: nome, points: 0, won: 0, gd: 0, gf: 0, jogados: 0, restantes: 0 }))
  return v
}
for (const j of jogos) {
  const h = pega(String(j.h), String(j.hn))
  const a = pega(String(j.a), String(j.an))
  const antes = String(j.date) < CUTOFF
  if (!antes) {
    h.restantes++
    a.restantes++
    continue
  }
  const fh = Number(j.fh), fa = Number(j.fa)
  h.gf += fh; h.gd += fh - fa; h.jogados++
  a.gf += fa; a.gd += fa - fh; a.jogados++
  if (fh > fa) { h.points += 3; h.won++ } else if (fa > fh) { a.points += 3; a.won++ } else { h.points++; a.points++ }
}

const tabela = ordenar([...acc.values()], TIEBREAK)
const linhas: TeamLine[] = tabela.map((t, i) => ({
  teamId: t.teamId, name: t.name, pos: i + 1,
  points: t.points, won: t.won, gd: t.gd, gf: t.gf, gamesRemaining: t.restantes,
}))
const sg = (n: number) => (n >= 0 ? `+${n}` : `${n}`)

const out: string[] = []
out.push(`# Relatório de ultrapassagem — ${LEAGUE} ${SEASON}`)
out.push(``)
out.push(`Corte: jogos **antes de ${CUTOFF}**. Desempate da temporada: **${TIEBREAK.join(" → ")}** (regra ${LEAGUE === "BRA" ? "577 · CBF" : "da liga"}).`)
out.push(`Gerado por \`scripts/_report-ultrapassagem.ts\`, usando \`lib/ultrapassagem.ts\` — o mesmo módulo que monta o bloco no prompt.`)
out.push(``)
out.push(`## Tabela no corte`)
out.push(``)
out.push(`| # | Time | P | J | V | SG | GP | Restam |`)
out.push(`|---|---|--:|--:|--:|--:|--:|--:|`)
for (const l of linhas) {
  const t = acc.get(l.teamId)!
  out.push(`| ${l.pos} | ${l.name} | **${l.points}** | ${t.jogados} | ${l.won} | ${sg(l.gd)} | ${l.gf} | ${l.gamesRemaining} |`)
}
out.push(``)
out.push(`---`)
out.push(``)

for (const alvo of linhas) {
  out.push(`## ${alvo.pos}º · ${alvo.name} — ${alvo.points} pts · ${alvo.won} V · SG ${sg(alvo.gd)} · ${alvo.gf} GP · restam ${alvo.gamesRemaining}`)
  out.push(``)

  // PRA BAIXO: quem pode passá-lo
  const ameacas = linhas
    .filter((c) => c.pos > alvo.pos)
    .map((c) => cenarioUltrapassagem(c, alvo, TIEBREAK, "chaser"))
    .filter((x): x is NonNullable<typeof x> => x != null)
  out.push(`**Pode ser ultrapassado por ${ameacas.length}:**`)
  if (!ameacas.length) out.push(`- ninguém abaixo alcança ${alvo.points} pts — posição travada por baixo.`)
  for (const c of ameacas) out.push(`- [${c.via}${c.swingNecessario ? ` · swing ${c.swingNecessario}` : ""}] ${c.texto}`)
  out.push(``)

  // PRA CIMA: quem ele pode passar
  const alcances = linhas
    .filter((t) => t.pos < alvo.pos)
    .map((t) => cenarioUltrapassagem(alvo, t, TIEBREAK, "alvo"))
    .filter((x): x is NonNullable<typeof x> => x != null)
  out.push(`**Pode ultrapassar ${alcances.length}:**`)
  if (!alcances.length) out.push(`- não alcança ninguém acima — teto atingido.`)
  for (const c of alcances) out.push(`- [${c.via}${c.swingNecessario ? ` · swing ${c.swingNecessario}` : ""}] ${c.texto}`)
  out.push(``)
}

const dest = new URL(`./output/ultrapassagem-${LEAGUE}-${SEASON}-${CUTOFF}.md`, import.meta.url)
await Bun.write(dest, out.join("\n"))
console.log(`[relatório] ${dest.pathname.replace(/^\//, "")}`)
console.log(`  ${linhas.length} times · corte ${CUTOFF} · desempate ${TIEBREAK.join(" → ")}`)
console.log(`  jogos restantes por time: ${[...new Set(linhas.map((l) => l.gamesRemaining))].sort().join(", ")}`)
process.exit(0)
