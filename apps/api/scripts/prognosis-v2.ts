/**
 * Pipeline experimental MOD-014 — prognóstico tático V2, isolado do motor atual.
 *
 * Lê o último dossiê já persistido do pipeline atual, acrescenta um dossiê tático
 * determinístico sem vazamento do jogo-alvo, faz uma síntese LLM tipada (com no
 * máximo uma correção de contrato) e grava somente em scripts/output/prognosis-v2/.
 *
 * Run:
 *   bun run scripts/prognosis-v2.ts <matchId> [matchId...] [--dry-run]
 *   bun run scripts/prognosis-v2.ts <matchId> --model=deepseek-v4-pro --effort=xhigh
 */
import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateText, Output } from "ai"
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { evidenceDigestMd } from "./evidence-crossings"
import {
  PROGNOSIS_V2_CONTRACT_VERSION,
  prognosisV2Schema,
  type PrognosisV2,
} from "./prognosis-v2/contract"
import { buildPrognosisV2Prompt } from "./prognosis-v2/prompt"
import { buildPrognosisV2Report } from "./prognosis-v2/report"
import { buildTacticalDossier } from "./prognosis-v2/tactical-dossier"
import { validatePrognosisV2 } from "./prognosis-v2/validate"

type Row = Record<string, unknown>
type CurrentRun = {
  promptText: string
  snapshot: {
    xgHome: number | null
    xgAway: number | null
    total: number | null
    over25: number | null
    btts: number | null
    bestBet: string
    probability: number | null
  }
}

const rowsOf = (result: unknown): Row[] =>
  ((result as { rows?: Row[] })?.rows ?? (result as Row[])) as Row[]
const args = process.argv.slice(2)
const dryRun = args.includes("--dry-run")
const model =
  args.find((arg) => arg.startsWith("--model="))?.slice("--model=".length) ||
  "deepseek-v4-pro"
const effort =
  args.find((arg) => arg.startsWith("--effort="))?.slice("--effort=".length) ||
  "xhigh"
const matchIds = args.filter((arg) => !arg.startsWith("--"))

if (!matchIds.length) {
  console.error(
    "uso: bun run scripts/prognosis-v2.ts <matchId> [matchId...] [--dry-run]"
  )
  process.exit(1)
}

// Mesmas variáveis do runner atual; o experimento não altera turbo.json.
// eslint-disable-next-line turbo/no-undeclared-env-vars
const apiKey = process.env.DEEPSEEP_API_KEY ?? process.env.DEEPSEEK_API_KEY
if (!dryRun && !apiKey)
  throw new Error("DEEPSEEP_API_KEY/DEEPSEEK_API_KEY ausente em apps/api/.env")

function extractDataSection(prompt: string): string {
  const part2 = prompt.search(/\*{0,2}PARTE 2\b/)
  const part3 = prompt.search(/\*{0,2}PARTE 3\b/)
  if (part2 >= 0 && part3 > part2) return prompt.slice(part2, part3)
  // Runs antigas podem não ter os marcadores; o V2 ainda indexa o prompt inteiro.
  return prompt
}

async function loadCurrentRun(matchId: string): Promise<CurrentRun> {
  const [row] = rowsOf(
    await db.execute(sql`
    select prompt_text, xg_home, xg_away, total, over25_prob, btts_prob,
           best_bet_market, best_bet_selection, best_bet_team, best_bet_line, best_bet_probability
    from match_prognosis
    where match_id = ${matchId} and prompt_text is not null
    order by run_at desc
    limit 1
  `)
  )
  if (!row?.prompt_text) {
    throw new Error(
      `partida ${matchId} não tem dossiê persistido. Rode o pipeline atual uma vez; o V2 não executa nem altera scripts legados.`
    )
  }
  const betParts = [
    row.best_bet_market,
    row.best_bet_team,
    row.best_bet_selection,
    row.best_bet_line,
  ]
    .filter((value) => value != null && value !== "")
    .map(String)
  return {
    promptText: String(row.prompt_text),
    snapshot: {
      xgHome: row.xg_home == null ? null : Number(row.xg_home),
      xgAway: row.xg_away == null ? null : Number(row.xg_away),
      total: row.total == null ? null : Number(row.total),
      over25: row.over25_prob == null ? null : Number(row.over25_prob),
      btts: row.btts_prob == null ? null : Number(row.btts_prob),
      bestBet: betParts.join(" ") || "sem recomendação",
      probability:
        row.best_bet_probability == null
          ? null
          : Number(row.best_bet_probability),
    },
  }
}

async function loadActual(matchId: string): Promise<string> {
  const [row] = rowsOf(
    await db.execute(sql`
    select home.name as home_name, away.name as away_name, m.ft_home, m.ft_away, m.ht_home, m.ht_away
    from match m
    join team home on home.id = m.home_team_id
    join team away on away.id = m.away_team_id
    where m.id = ${matchId}
  `)
  )
  if (!row) return "partida não encontrada"
  if (row.ft_home == null || row.ft_away == null)
    return "jogo ainda não disputado"
  return `${row.home_name} ${row.ft_home}-${row.ft_away} ${row.away_name} (HT ${row.ht_home ?? "?"}-${row.ht_away ?? "?"})`
}

function parseFallback(text: string): PrognosisV2 | null {
  const match =
    text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[1] ?? match[0]) as PrognosisV2
  } catch {
    return null
  }
}

const deepseek = apiKey ? createDeepSeek({ apiKey }) : null
const providerOptions = {
  deepseek: { thinking: { type: "enabled" }, reasoningEffort: effort },
}
let failed = false

for (const matchId of matchIds) {
  try {
    console.error(
      `[v2] ${matchId}: carregando snapshot atual e montando dossiê tático…`
    )
    const [current, tactical, crossings] = await Promise.all([
      loadCurrentRun(matchId),
      buildTacticalDossier(matchId),
      evidenceDigestMd(matchId),
    ])
    const built = buildPrognosisV2Prompt(
      tactical,
      extractDataSection(current.promptText),
      crossings
    )
    const stamp = new Date().toISOString().replace(/[:.]/g, "-")
    const outDir = new URL(
      `./output/prognosis-v2/${matchId}/${stamp}/`,
      import.meta.url
    )
    await Promise.all([
      Bun.write(new URL("prompt.md", outDir), built.prompt),
      Bun.write(new URL("tactical-dossier.md", outDir), tactical.markdown),
      Bun.write(
        new URL("manifest.json", outDir),
        JSON.stringify(
          {
            version: 2,
            contractVersion: PROGNOSIS_V2_CONTRACT_VERSION,
            matchId,
            cutoff: tactical.cutoff,
            generatedAt: new Date().toISOString(),
            model,
            effort,
            dryRun,
            evidenceIds: built.evidenceIds,
            isolation: "read-only database; no API/UI/persistence",
          },
          null,
          2
        )
      ),
    ])

    if (dryRun) {
      console.log(Bun.fileURLToPath(new URL("prompt.md", outDir)))
      continue
    }

    console.error(
      `[v2] ${matchId}: chamando ${model} (thinking=on, effort=${effort})…`
    )
    const started = Date.now()
    let result: Awaited<ReturnType<typeof generateText>>
    let output: PrognosisV2 | null = null
    try {
      result = await generateText({
        model: deepseek!(model),
        prompt: built.prompt,
        providerOptions,
        output: Output.object({ schema: prognosisV2Schema }),
      })
      output = (result as { output?: PrognosisV2 }).output ?? null
    } catch (error) {
      console.error(
        `[v2] schema tipado falhou: ${(error as Error).message}; tentando resposta JSON crua`
      )
      result = await generateText({
        model: deepseek!(model),
        prompt: built.prompt,
        providerOptions,
      })
      output = parseFallback(result.text)
    }
    let elapsedMs = Date.now() - started
    if (!output)
      throw new Error("modelo não devolveu objeto PrognosisV2 parseável")

    let validation = validatePrognosisV2(
      output,
      built.evidenceIds,
      tactical,
      built.prior
    )
    let attempts = 1
    if (!validation.valid) {
      console.error(
        `[v2] ${matchId}: saída inválida; fazendo uma correção restrita (${validation.errors.join("; ")})…`
      )
      const repairPrompt = `${built.prompt}

# CORREÇÃO OBRIGATÓRIA DA SAÍDA

A tentativa anterior violou o contrato:
${validation.errors.map((error) => `- ${error}`).join("\n")}

Corrija exclusivamente essas violações, preserve as análises que continuam sustentadas e devolva o objeto JSON completo.
Não relaxe os limites, não invente evidências e não cite jogadores fora dos XIs projetados.

## Tentativa anterior
\`\`\`json
${JSON.stringify(output)}
\`\`\``
      attempts += 1
      try {
        result = await generateText({
          model: deepseek!(model),
          prompt: repairPrompt,
          providerOptions,
          output: Output.object({ schema: prognosisV2Schema }),
        })
        output = (result as { output?: PrognosisV2 }).output ?? null
      } catch (error) {
        console.error(
          `[v2] correção tipada falhou: ${(error as Error).message}; tentando JSON cru`
        )
        result = await generateText({
          model: deepseek!(model),
          prompt: repairPrompt,
          providerOptions,
        })
        output = parseFallback(result.text)
      }
      if (!output)
        throw new Error("correção não devolveu objeto PrognosisV2 parseável")
      validation = validatePrognosisV2(
        output,
        built.evidenceIds,
        tactical,
        built.prior
      )
    }
    elapsedMs = Date.now() - started
    const usage = result.usage as Record<string, unknown> & {
      outputTokenDetails?: { reasoningTokens?: number }
    }
    const metadata = result.providerMetadata as
      | Record<string, Record<string, unknown> | undefined>
      | undefined
    const reasoningTokens =
      usage.outputTokenDetails?.reasoningTokens ??
      (typeof usage.reasoningTokens === "number"
        ? usage.reasoningTokens
        : null) ??
      (typeof metadata?.deepseek?.reasoningTokens === "number"
        ? metadata.deepseek.reasoningTokens
        : null)
    const actual = await loadActual(matchId)
    const report = buildPrognosisV2Report({
      dossier: tactical,
      output,
      validation,
      current: current.snapshot,
      actual,
      model,
      elapsedMs,
      reasoningTokens,
    })
    await Promise.all([
      Bun.write(
        new URL("result.json", outDir),
        JSON.stringify(output, null, 2)
      ),
      Bun.write(new URL("report.html", outDir), report),
      Bun.write(
        new URL("dump.json", outDir),
        JSON.stringify(
          {
            matchId,
            model,
            effort,
            attempts,
            elapsedMs,
            validation,
            deterministicPrior: built.prior,
            usage: result.usage,
            finishReason: result.finishReason,
            warnings: result.warnings,
            reasoningText: result.reasoningText,
            text: result.text,
            output,
          },
          null,
          2
        )
      ),
    ])
    console.log(Bun.fileURLToPath(new URL("report.html", outDir)))
    if (!validation.valid) {
      failed = true
      console.error(
        `[v2] ${matchId}: saída gravada, mas inválida: ${validation.errors.join("; ")}`
      )
    } else if (validation.warnings.length) {
      console.error(
        `[v2] ${matchId}: válido com ${validation.warnings.length} aviso(s)`
      )
    }
  } catch (error) {
    failed = true
    console.error(
      `[v2] ${matchId}: FALHA — ${(error as Error).stack ?? (error as Error).message}`
    )
  }
}

process.exit(failed ? 1 : 0)
