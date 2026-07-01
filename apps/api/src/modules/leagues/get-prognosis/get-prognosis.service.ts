import { desc, eq } from "drizzle-orm"

import { db } from "../../../db/client"
import { matchPrognosis } from "../../../db/schema"
import { notFound } from "../../../lib/errors"
import { getMatchRow } from "../shared/shared"

// GET /v1/matches/:id/prognosis — o prognóstico de xG mais recente da partida (gerado por LLM), pronto
// pra aba "Prognóstico": leitura POR TIME (xG total/1ºT/2ºT + faixas de 15min + resumo) + GERAL (total,
// over/under, BTTS, 1x2 nos 3 recortes, confiança, resumo) + drivers. A auditoria pesada (reasoning,
// prompt, saída crua) NÃO entra no payload. `null` quando ainda não há prognóstico; 404 se o match não existe.
export async function getPrognosis(id: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")

  const [p] = await db
    .select()
    .from(matchPrognosis)
    .where(eq(matchPrognosis.matchId, id))
    .orderBy(desc(matchPrognosis.runAt))
    .limit(1)
  if (!p) return null

  // `real` é float de precisão simples → arredonda na borda pra tirar o ruído (1.7100000381 → 1.71).
  const r2 = (n: number) => Math.round(n * 100) / 100
  const r3 = (n: number) => Math.round(n * 1000) / 1000

  return {
    model: p.model,
    reasoningEffort: p.reasoningEffort,
    runAt: p.runAt,
    confidence: p.confianca, // coluna física `confianca` → campo `confidence` (valor já é low/medium/high)
    home: { xg: r2(p.xgHome), xg1t: r2(p.xgHome1t), xg2t: r2(p.xgHome2t), bands: p.xgHomeBands, summary: p.resumoHome },
    away: { xg: r2(p.xgAway), xg1t: r2(p.xgAway1t), xg2t: r2(p.xgAway2t), bands: p.xgAwayBands, summary: p.resumoAway },
    general: {
      total: r2(p.total),
      total1t: r2(p.total1t),
      total2t: r2(p.total2t),
      over25Prob: r3(p.over25Prob),
      bttsProb: r3(p.bttsProb),
      oneXTwo: p.oneXTwo,
      oneXTwo1t: p.oneXTwo1t,
      oneXTwo2t: p.oneXTwo2t,
      summary: p.resumoGeral,
    },
    // Aposta recomendada (estruturada). null quando a run é antiga (pré-best_bet) ou o modelo passou.
    bestBet: p.bestBetMarket
      ? {
          market: p.bestBetMarket,
          selection: p.bestBetSelection,
          team: p.bestBetTeam,
          line: p.bestBetLine,
          confidence: p.bestBetConfidence,
          probability: p.bestBetProbability,
          analysis: p.bestBetAnalysis,
        }
      : null,
    drivers: p.drivers,
    tokens: { reasoning: p.reasoningTokens, total: p.totalTokens },
    latencyMs: p.latencyMs,
  }
}
