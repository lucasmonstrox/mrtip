/**
 * Seleciona e CONGELA uma coorte de teste — a regra de seleção é declarada em código e determinística,
 * então não há espaço pra escolher jogo depois de ver o resultado.
 *
 * Por que existe: tudo que foi medido nesta sessão saiu da rodada 38 do Brasileirão, com os placares
 * conhecidos e o prompt ajustado entre as rodadas. 5/5 nessas condições é o resultado esperado de
 * ajustar até passar, não evidência de qualidade. Uma coorte só vale se: (a) o critério de escolha é
 * fixado ANTES, (b) os jogos não foram usados pra calibrar nada, (c) a composição é estratificada.
 *
 * Escolhas cravadas e o porquê de cada uma:
 * - **Premier League**, não Brasileirão: tiebreak diferente (pontos → saldo → gols pró, SEM vitórias),
 *   o que exercita a fronteira "até onde o cenário decide sozinho" no outro formato. Nada da PL foi
 *   usado pra ajustar prompt nesta sessão.
 * - **Rodadas espalhadas** (10, 15, 20, 25, 30): a auditoria de viés desta sessão morreu por ter 89%
 *   de rodada ≥35 — fim de temporada tem mais gol por natureza e confunde viés com composição.
 * - **2 jogos por rodada, os 2 primeiros em ordem alfabética do mandante**: regra idiota de propósito,
 *   pra não haver julgamento meu na escolha.
 *
 *   bun run scripts/_coorte-congelada.ts            # seleciona e grava
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"

const LEAGUE = "PL"
const SEASON = "2025/2026"
const RODADAS = [10, 15, 20, 25, 30]
const POR_RODADA = 2

type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]

const [s] = rowsOf(await db.execute(sql`
  select id from season where league_code = ${LEAGUE} and name = ${SEASON} limit 1`))
if (!s) throw new Error(`temporada ${LEAGUE} ${SEASON} não encontrada`)

const escolhidos: Row[] = []
for (const r of RODADAS) {
  const jogos = rowsOf(await db.execute(sql`
    select m.id, m.round, m.date, th.name hn, ta.name an, m.ft_home, m.ft_away
    from match m join team th on th.id = m.home_team_id join team ta on ta.id = m.away_team_id
    where m.season_id = ${s.id} and m.round = ${r} and m.ft_home is not null
    order by th.name asc`))
  escolhidos.push(...jogos.slice(0, POR_RODADA))
}

const total = escolhidos.reduce((acc, j) => acc + Number(j.ft_home) + Number(j.ft_away), 0)
console.log(`# Coorte congelada — ${LEAGUE} ${SEASON}`)
console.log(`Regra: rodadas ${RODADAS.join(", ")} · ${POR_RODADA} jogos por rodada · ordem alfabética do mandante\n`)
for (const j of escolhidos) console.log(`R${String(j.round).padStart(2)}  ${String(j.hn).padEnd(24)} ${j.ft_home}-${j.ft_away}  ${String(j.an).padEnd(24)} ${j.id}`)
console.log(`\nn=${escolhidos.length} · média de gols: ${(total / escolhidos.length).toFixed(2)}`)

const dest = new URL(`./output/coorte-${LEAGUE}-${SEASON.replace("/", "-")}.json`, import.meta.url)
await Bun.write(dest, JSON.stringify({
  liga: LEAGUE, temporada: SEASON, regra: { rodadas: RODADAS, porRodada: POR_RODADA, ordem: "mandante alfabético" },
  congeladoEm: "2026-07-21",
  jogos: escolhidos.map((j) => ({ id: String(j.id), rodada: Number(j.round), label: `${j.hn} ${j.ft_home}-${j.ft_away} ${j.an}`, total: Number(j.ft_home) + Number(j.ft_away) })),
}, null, 2))
console.log(`\ncongelada em ${dest.pathname.replace(/^\//, "")}`)
console.log(`\nIDS: ${escolhidos.map((j) => j.id).join(" ")}`)
process.exit(0)
