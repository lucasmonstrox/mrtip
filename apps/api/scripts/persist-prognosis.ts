/**
 * Persiste um prognóstico (objeto tipado da run) na tabela `match_prognosis` — métricas + textos +
 * auditoria (reasoning/prompt/saída crua). Reusado pelo run-deepseek (grava a cada run) e como CLI de
 * BACKFILL: lê o dump.json da última run de um match e insere, SEM chamar a API de novo.
 *
 * Backfill:  bun run scripts/persist-prognosis.ts <matchId>
 */
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { db } from "../src/db/client"
import { matchPrognosis } from "../src/db/schema"

// Forma mínima do dump que importa pra persistência (o run-deepseek monta isso em memória).
type Dump = {
  meta: { matchId: string; model: string; reasoningEffort?: string; elapsedMs?: number; at: string }
  output: {
    home: { xg: number; xg_1t: number; xg_2t: number; xg_bands: Record<string, number>; summary: string }
    away: { xg: number; xg_1t: number; xg_2t: number; xg_bands: Record<string, number>; summary: string }
    general: {
      total: number; total_1t: number; total_2t: number; over25_prob: number; btts_prob: number
      one_x_two: unknown; one_x_two_1t: unknown; one_x_two_2t: unknown; confidence: string; summary: string
    }
    best_bet?: {
      market: string; selection: string; team?: string | null; line: number | null; confidence: string; probability: number; analysis: string
    }
    drivers: string[]
  } | null
  usage?: { totalTokens?: number }
  reasoningTokens?: number | null
  reasoningText?: string
}

// Insere (ou atualiza, se a mesma run já existir) e devolve o id da linha.
export async function persistPrognosis(dump: Dump, promptText?: string): Promise<string | undefined> {
  const o = dump.output
  if (!o) throw new Error("dump sem output tipado — nada a persistir")
  const g = o.general
  const b = o.best_bet
  const row = {
    matchId: dump.meta.matchId,
    model: dump.meta.model,
    reasoningEffort: dump.meta.reasoningEffort ?? null,
    runAt: new Date(dump.meta.at),
    xgHome: o.home.xg, xgHome1t: o.home.xg_1t, xgHome2t: o.home.xg_2t,
    xgHomeBands: o.home.xg_bands as never, resumoHome: o.home.summary,
    xgAway: o.away.xg, xgAway1t: o.away.xg_1t, xgAway2t: o.away.xg_2t,
    xgAwayBands: o.away.xg_bands as never, resumoAway: o.away.summary,
    total: g.total, total1t: g.total_1t, total2t: g.total_2t,
    over25Prob: g.over25_prob, bttsProb: g.btts_prob,
    oneXTwo: g.one_x_two as never, oneXTwo1t: g.one_x_two_1t as never, oneXTwo2t: g.one_x_two_2t as never,
    confianca: g.confidence, resumoGeral: g.summary,
    bestBetMarket: b?.market ?? null, bestBetSelection: b?.selection ?? null, bestBetTeam: b?.team ?? null, bestBetLine: b?.line ?? null,
    bestBetConfidence: b?.confidence ?? null, bestBetProbability: b?.probability ?? null, bestBetAnalysis: b?.analysis ?? null,
    drivers: o.drivers,
    reasoning: dump.reasoningText ?? null,
    promptText: promptText ?? null,
    rawOutput: o as never,
    reasoningTokens: dump.reasoningTokens ?? null,
    totalTokens: dump.usage?.totalTokens ?? null,
    latencyMs: dump.meta.elapsedMs ?? null,
  }
  const [ins] = await db
    .insert(matchPrognosis)
    .values(row)
    .onConflictDoUpdate({ target: [matchPrognosis.matchId, matchPrognosis.model, matchPrognosis.runAt], set: row })
    .returning({ id: matchPrognosis.id })
  return ins?.id
}

// CLI: backfill a partir da última run salva em disco.
if (import.meta.main) {
  const MATCH_ID = process.argv[2] ?? "77a4255a-3e44-4fd9-a133-b13ca0898a91"
  const dir = fileURLToPath(new URL(`./output/${MATCH_ID}/`, import.meta.url))
  const runs = readdirSync(dir).filter((d) => /^\d{4}-/.test(d)).sort() // timestamps ordenam lexicograficamente
  const latest = runs.at(-1)
  if (!latest) throw new Error(`nenhuma run em ${dir}`)
  const runDir = `${dir}${latest}`
  const dump = JSON.parse(readFileSync(`${runDir}/dump.json`, "utf8")) as Dump
  let promptText: string | undefined
  try { promptText = readFileSync(`${runDir}/prompt.md`, "utf8") } catch { /* sem prompt salvo */ }
  const id = await persistPrognosis(dump, promptText)
  console.log(`[ok] prognóstico da run ${latest} persistido → match_prognosis ${id}`)
  process.exit(0)
}
