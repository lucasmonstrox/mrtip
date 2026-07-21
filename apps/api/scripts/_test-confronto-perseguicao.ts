/**
 * Testa a hipótese do dono: quando dois times PRÓXIMOS na tabela se enfrentam e o de baixo precisa
 * ultrapassar o de cima (pra quem o empate já serve), o jogo ABRE — porque o perseguidor não tem plano B.
 *
 * Isso contradiz o veredito que o `prognosis-prompt.ts` emite hoje pra essa configuração ("um lado
 * ADMINISTRA → jogo tende a travar → prefira UNDER"), que foi o banner por trás de um under errado.
 * Como é pergunta empírica e temos temporadas completas no banco, dá pra medir em vez de opinar.
 *
 * CONTROLE OBRIGATÓRIO: rodada final tem mais gol por natureza (medido: PL +0,14 · BRA +0,48). Comparar
 * confrontos de perseguição contra a média geral confundiria o efeito com a fase da temporada. Então o
 * baseline é sempre "os OUTROS jogos das MESMAS rodadas".
 *
 *   bun run scripts/_test-confronto-perseguicao.ts
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"

type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]

const seasons = rowsOf(await db.execute(sql`
  select s.id, s.league_code, s.name, count(m.id)::int as n
  from season s join match m on m.season_id = s.id and m.ft_home is not null
  group by 1,2,3 having count(m.id) > 300 order by s.league_code, s.name`))

// Só a reta final: é onde a tabela pesa de verdade. Antes disso "perseguição" é ruído — todo mundo
// ainda alcança todo mundo e o time não muda o jogo por causa de 1 posição.
const ULTIMAS = 8

type Caso = { total: number; rodada: number; label: string; gapPts: number }
const perseguicao: Caso[] = []
const controle: Caso[] = []

for (const s of seasons) {
  const jogos = rowsOf(await db.execute(sql`
    select m.home_team_id h, m.away_team_id a, m.ft_home fh, m.ft_away fa, m.round, th.name hn, ta.name an
    from match m join team th on th.id = m.home_team_id join team ta on ta.id = m.away_team_id
    where m.season_id = ${s.id} and m.ft_home is not null order by m.round`))
  const maxR = Math.max(...jogos.map((j) => Number(j.round)))

  for (const alvo of jogos) {
    const r = Number(alvo.round)
    if (r <= maxR - ULTIMAS) continue
    // Tabela ANTES desta rodada (não inclui a rodada corrente, pra não vazar o próprio jogo).
    const tb = new Map<string, { pts: number; w: number; gd: number }>()
    const g = (id: string) => { let v = tb.get(id); if (!v) tb.set(id, (v = { pts: 0, w: 0, gd: 0 })); return v }
    for (const j of jogos) {
      if (Number(j.round) >= r) continue
      const h = g(String(j.h)), a = g(String(j.a)), fh = Number(j.fh), fa = Number(j.fa)
      h.gd += fh - fa; a.gd += fa - fh
      if (fh > fa) { h.pts += 3; h.w++ } else if (fa > fh) { a.pts += 3; a.w++ } else { h.pts++; a.pts++ }
    }
    const H = tb.get(String(alvo.h)), A = tb.get(String(alvo.a))
    if (!H || !A) continue
    const total = Number(alvo.fh) + Number(alvo.fa)
    const gap = Math.abs(H.pts - A.pts)
    const caso: Caso = { total, rodada: r, label: `${s.league_code} ${s.name} R${r} ${alvo.hn} ${alvo.fh}-${alvo.fa} ${alvo.an}`, gapPts: gap }
    // "Perseguição": times colados (o de baixo alcança o de cima com uma vitória) — 1 a 3 pontos de
    // distância. Empate serve pro de cima, vitória é obrigatória pro de baixo. Gap 0 fica de fora:
    // ali NENHUM dos dois administra, é outra configuração.
    if (gap >= 1 && gap <= 3) perseguicao.push(caso)
    else controle.push(caso)
  }
}

const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN)
const pct = (xs: number[], f: (n: number) => boolean) => (xs.length ? (xs.filter(f).length / xs.length) * 100 : NaN)
const tot = (c: Caso[]) => c.map((x) => x.total)

console.log(`# Confronto de perseguição abre o jogo?`)
console.log(`Últimas ${ULTIMAS} rodadas de ${seasons.length} temporadas · baseline = outros jogos das MESMAS rodadas\n`)
console.log(`| grupo | n | gols/jogo | over 2.5 | over 3.5 |`)
console.log(`|---|--:|--:|--:|--:|`)
for (const [nome, arr] of [["PERSEGUIÇÃO (gap 1-3 pts)", perseguicao], ["controle (mesmas rodadas)", controle]] as const)
  console.log(`| ${nome} | ${arr.length} | ${media(tot(arr)).toFixed(2)} | ${pct(tot(arr), (x) => x > 2.5).toFixed(0)}% | ${pct(tot(arr), (x) => x > 3.5).toFixed(0)}% |`)

const dif = media(tot(perseguicao)) - media(tot(controle))
console.log(`\nDIFERENÇA: ${dif >= 0 ? "+" : ""}${dif.toFixed(2)} gol/jogo`)
console.log(dif > 0.15 ? "→ hipótese do dono SUSTENTADA: o jogo abre." : dif < -0.15 ? "→ hipótese REFUTADA: o jogo trava (o prompt está certo hoje)." : "→ INCONCLUSIVO: diferença dentro do ruído; nenhum dos dois vereditos se sustenta.")

// Erro padrão da diferença — sem isto, 0.2 gol em n=40 parece sinal e é ruído.
const sd = (xs: number[]) => { const m = media(xs); return Math.sqrt(media(xs.map((x) => (x - m) ** 2))) }
const se = Math.sqrt(sd(tot(perseguicao)) ** 2 / perseguicao.length + sd(tot(controle)) ** 2 / controle.length)
console.log(`erro padrão da diferença: ±${se.toFixed(2)} · |dif|/EP = ${(Math.abs(dif) / se).toFixed(1)}${Math.abs(dif) / se < 2 ? "  ← abaixo de 2, NÃO distinguível de ruído" : "  ← acima de 2"}`)

// Corte por distância: se o efeito for real, deve ser mais forte quanto mais colado o par.
console.log(`\n## Por distância na tabela`)
for (const g of [1, 2, 3]) {
  const sub = perseguicao.filter((x) => x.gapPts === g)
  if (sub.length < 10) continue
  console.log(`   gap ${g} pt(s): n=${sub.length} · ${media(tot(sub)).toFixed(2)} gols/jogo · over2.5 ${pct(tot(sub), (x) => x > 2.5).toFixed(0)}%`)
}
process.exit(0)
