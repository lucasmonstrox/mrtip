// Exporta pra JSON os jogos ainda não disputados da rodada 19 do Brasileirão com o prognóstico completo
// de cada run (xG, 1x2, over/btts, best_bet) + escudo de cada time, pra alimentar o gerador de imagem.
import { and, asc, eq } from "drizzle-orm"

import { db } from "../src/db/client"
import { match, matchPrognosis, season, team } from "../src/db/schema"

const [s] = await db.select().from(season).where(eq(season.sportmonksSeasonId, 26763))
const teams = new Map((await db.select().from(team)).map((t) => [t.id, t]))
const rows = await db
  .select()
  .from(match)
  .where(and(eq(match.round, 19), eq(match.seasonId, s!.id)))
  .orderBy(asc(match.date))

const out = []
for (const m of rows) {
  if (m.status !== "NS") continue
  const h = teams.get(m.homeTeamId)!
  const a = teams.get(m.awayTeamId)!
  const progs = await db
    .select()
    .from(matchPrognosis)
    .where(eq(matchPrognosis.matchId, m.id))
    .orderBy(asc(matchPrognosis.runAt))
  out.push({
    date: m.date,
    time: m.time,
    home: { name: h.name, short: h.shortCode, logo: h.logoUrl },
    away: { name: a.name, short: a.shortCode, logo: a.logoUrl },
    runs: progs.map((p) => ({
      xgHome: p.xgHome, xgAway: p.xgAway, total: p.total,
      over25: p.over25Prob, btts: p.bttsProb,
      oneXTwo: p.oneXTwo, confianca: p.confianca,
      drivers: p.drivers,
      bet: {
        market: p.bestBetMarket, selection: p.bestBetSelection, team: p.bestBetTeam,
        line: p.bestBetLine, conf: p.bestBetConfidence, prob: p.bestBetProbability,
      },
    })),
  })
}
await Bun.write("scripts/output/r19.json", JSON.stringify(out, null, 2))
console.log(`ok ${out.length} jogos → scripts/output/r19.json`)
console.log("exemplo logo:", out[0]?.home.logo)
process.exit(0)
