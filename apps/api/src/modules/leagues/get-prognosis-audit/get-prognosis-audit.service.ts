import { and, desc, eq } from "drizzle-orm"

import { db } from "../../../db/client"
import { matchPrognosis } from "../../../db/schema"
import { notFound } from "../../../lib/errors"
import { getMatchRow } from "../shared/shared"

// GET /v1/matches/:id/prognosis/audit — a cadeia de raciocínio (reasoning) de uma run do motor de
// prognóstico, pra auditar "por que ele cravou essa aposta?". Mora numa rota separada da aba porque o
// reasoning pesa 20k-40k caracteres e não pode entrar no payload de toda visita. `null` quando a partida
// ainda não tem run; 404 se o match não existe. Leitura pura — nunca escreve em match_prognosis.
//
// NÃO expõe `prompt_text`: o prompt de evidências é o IP do motor (decisão do dono, 2026-07-19, D7) e por
// isso nem sai do banco — a proteção é a coluna ausente do select, não um filtro na UI. @feature MOD-011
export async function getPrognosisAudit(id: string, runId?: string) {
  const row = await getMatchRow(id)
  if (!row) throw notFound("match_not_found")

  // Sem runId → a mais recente (mesmo critério do getPrognosis, pra auditoria bater com o que a aba mostra).
  const where = runId
    ? and(eq(matchPrognosis.matchId, id), eq(matchPrognosis.id, runId))
    : eq(matchPrognosis.matchId, id)

  const [p] = await db
    .select({
      runId: matchPrognosis.id,
      model: matchPrognosis.model,
      reasoningEffort: matchPrognosis.reasoningEffort,
      runAt: matchPrognosis.runAt,
      reasoning: matchPrognosis.reasoning,
      reasoningTokens: matchPrognosis.reasoningTokens,
      totalTokens: matchPrognosis.totalTokens,
      latencyMs: matchPrognosis.latencyMs,
    })
    .from(matchPrognosis)
    .where(where)
    .orderBy(desc(matchPrognosis.runAt))
    .limit(1)

  // `null` cobre os dois vazios: partida sem nenhuma run, e runId que não pertence a esta partida.
  return p ?? null
}
