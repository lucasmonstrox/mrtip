/**
 * Roda o prompt de prognóstico no deepseek-v4-pro com THINKING ligado e reasoning effort XHIGH.
 * Usa OUTPUT TIPADO do AI SDK (generateText + output: Output.object com jsonSchema — NÃO generateObject),
 * então a resposta volta validada contra o schema (inclui xG por faixa de 15 min de cada time).
 * Captura TUDO (request, raciocínio, resposta, cada step/"hop", tokens) e gera um relatório .html.
 *
 * Chave: apps/api/.env → DEEPSEEP_API_KEY (typo no nome, por isso createDeepSeek explícito).
 * Pré-requisito: scripts/output/prognosis-<id>.md já gerado por prognosis-prompt.ts.
 *
 * Run:  bun run scripts/run-deepseek.ts <matchId>
 * Out:  scripts/output/<matchId>/<timestamp>/{report.html, dump.json, prompt.md} — 1 PASTA POR RUN.
 */
import { createDeepSeek } from "@ai-sdk/deepseek"
import { generateText, jsonSchema, Output } from "ai"
import { eq } from "drizzle-orm"

import { db } from "../src/db/client"
import { match, team } from "../src/db/schema"
import { persistPrognosis } from "./persist-prognosis"

const MATCH_ID = process.argv[2] ?? "77a4255a-3e44-4fd9-a133-b13ca0898a91"
const MODEL = "deepseek-v4-pro"
const EFFORT = "xhigh"
const BANDS = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90"] as const

const apiKey = process.env.DEEPSEEP_API_KEY ?? process.env.DEEPSEEK_API_KEY
if (!apiKey) throw new Error("DEEPSEEP_API_KEY ausente em apps/api/.env")

const promptUrl = new URL(`./output/prognosis-${MATCH_ID}.md`, import.meta.url)
const prompt = await Bun.file(promptUrl).text().catch(() => {
  throw new Error(`prompt não encontrado: rode antes 'bun run scripts/prognosis-prompt.ts ${MATCH_ID}'`)
})

// Resultado real (pra comparar o prognóstico com o que aconteceu, se o jogo já passou).
const m = await db.query.match.findFirst({ where: eq(match.id, MATCH_ID) })
const [home] = m ? await db.select().from(team).where(eq(team.id, m.homeTeamId)) : []
const [away] = m ? await db.select().from(team).where(eq(team.id, m.awayTeamId)) : []
const actual =
  m && m.ftHome != null && m.ftAway != null
    ? `${home?.name} ${m.ftHome}-${m.ftAway} ${away?.name} (HT ${m.htHome ?? "?"}-${m.htAway ?? "?"})`
    : "jogo ainda não disputado"

// ---- Schema TIPADO da saída (xG total + por tempo + por faixa de 15 min, por time) ----
type Bands = Record<(typeof BANDS)[number], number>
type TeamXg = { xg: number; xg_1t: number; xg_2t: number; xg_bands: Bands }
type OneXTwo = { home: number; draw: number; away: number }
// Prognóstico POR TIME (xG + leitura própria) + um bloco GERAL (agregados do jogo). Estrutura pensada
// pra virar abas na UI: card do mandante, card do visitante, card geral.
type TeamPrognosis = TeamXg & { summary: string } // summary = leitura curta do time (motivação, desfalque, etc.)
type GeneralPrognosis = {
  total: number; total_1t: number; total_2t: number
  over25_prob: number; btts_prob: number
  one_x_two: OneXTwo // resultado do JOGO (90 min)
  one_x_two_1t: OneXTwo // quem vence o 1º TEMPO (placar 0-45)
  one_x_two_2t: OneXTwo // quem vence o 2º TEMPO isolado (gols do intervalo ao fim)
  confidence: "low" | "medium" | "high"
  summary: string // parágrafo geral do jogo + maior incerteza
}
// Leitura de apostador (sharp): a DECISÃO estruturada, separada dos números. SEMPRE crava um mercado (sem "passar").
// Inclui handicap e team_total: em jogo assimétrico, "mandante -1" ou "time over 1.5" captura o cenário melhor que o O/U do jogo.
type BestBet = {
  market: "1x2" | "over_under" | "btts" | "handicap" | "team_total"
  selection: "home" | "draw" | "away" | "over" | "under" | "yes" | "no"
  team: "home" | "away" | null // de qual time é o total (team_total); null nos mercados de jogo inteiro
  line: number | null // over_under: linha do jogo (2.5) · handicap: hcap do time (-1, +1) · team_total: gols do time (1.5) · null em 1x2/btts
  confidence: "low" | "medium" | "high"
  probability: number
  analysis: string // análise completa e profissional da recomendação (PT — texto de UI)
}
type Prognosis = {
  home: TeamPrognosis
  away: TeamPrognosis
  general: GeneralPrognosis
  best_bet: BestBet
  drivers: string[]
}
const num = { type: "number" as const }
const str = { type: "string" as const }
const oxt = {
  type: "object" as const,
  properties: { home: num, draw: num, away: num },
  required: ["home", "draw", "away"],
  additionalProperties: false,
}
const bandsSchema = {
  type: "object" as const,
  properties: Object.fromEntries(BANDS.map((b) => [b, num])),
  required: [...BANDS] as string[],
  additionalProperties: false,
}
const conf = { type: "string" as const, enum: ["low", "medium", "high"] }
const teamSchema = {
  type: "object" as const,
  properties: { xg: num, xg_1t: num, xg_2t: num, xg_bands: bandsSchema, summary: str },
  required: ["xg", "xg_1t", "xg_2t", "xg_bands", "summary"],
  additionalProperties: false,
}
const generalSchema = {
  type: "object" as const,
  properties: {
    total: num, total_1t: num, total_2t: num,
    over25_prob: num, btts_prob: num,
    one_x_two: oxt, one_x_two_1t: oxt, one_x_two_2t: oxt,
    confidence: conf,
    summary: str,
  },
  required: ["total", "total_1t", "total_2t", "over25_prob", "btts_prob", "one_x_two", "one_x_two_1t", "one_x_two_2t", "confidence", "summary"],
  additionalProperties: false,
}
const bestBetSchema = {
  type: "object" as const,
  properties: {
    market: { type: "string" as const, enum: ["1x2", "over_under", "btts", "handicap", "team_total"] },
    selection: { type: "string" as const, enum: ["home", "draw", "away", "over", "under", "yes", "no"] },
    team: { type: ["string", "null"] as ("string" | "null")[], enum: ["home", "away", null] },
    line: { type: ["number", "null"] as ("number" | "null")[] },
    confidence: conf,
    probability: num,
    analysis: str,
  },
  required: ["market", "selection", "team", "line", "confidence", "probability", "analysis"],
  additionalProperties: false,
}
const prognosisSchema = jsonSchema<Prognosis>({
  type: "object",
  properties: {
    home: teamSchema,
    away: teamSchema,
    general: generalSchema,
    best_bet: bestBetSchema,
    drivers: { type: "array", items: str },
  },
  required: ["home", "away", "general", "best_bet", "drivers"],
  additionalProperties: false,
})

const deepseek = createDeepSeek({ apiKey })
const providerOptions = { deepseek: { thinking: { type: "enabled" }, reasoningEffort: EFFORT } }

console.error(`[deepseek] chamando ${MODEL} (thinking=on, effort=${EFFORT}, output tipado)… 1-3 min no xhigh`)
const started = Date.now()
let result: Awaited<ReturnType<typeof generateText>>
let output: Prognosis | null = null
try {
  result = await generateText({ model: deepseek(MODEL), prompt, providerOptions, output: Output.object({ schema: prognosisSchema }) })
  output = (result as { output?: Prognosis }).output ?? null
} catch (e) {
  // Fallback: se o provider recusar json_schema junto do thinking, roda sem schema e parseia o texto.
  console.error(`[deepseek] output tipado falhou (${(e as Error).message}); fallback sem schema`)
  result = await generateText({ model: deepseek(MODEL), prompt, providerOptions })
}
const elapsedMs = Date.now() - started

const { text, reasoningText, usage, providerMetadata, finishReason, warnings, steps, request, response } = result
const u = usage as Record<string, unknown> & { outputTokenDetails?: { reasoningTokens?: number } }
const reasoningTokens =
  u?.outputTokenDetails?.reasoningTokens ?? u?.reasoningTokens ?? providerMetadata?.deepseek?.reasoningTokens ?? null

// Se não veio pelo schema, tenta extrair JSON do texto.
if (!output) {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/) ?? text.match(/\{[\s\S]*\}/)
  if (jsonMatch) { try { output = JSON.parse(jsonMatch[1] ?? jsonMatch[0]) as Prognosis } catch { /* cru */ } }
}

// Normaliza as xg_bands pra somar exatamente o xg — o prompt instrui o modelo a NÃO conferir a soma no
// raciocínio (libera o thinking pra estratégia); a consistência aritmética é garantida aqui.
const normBands = (t: { xg: number; xg_bands: Bands } | undefined) => {
  if (!t?.xg_bands) return
  const sum = BANDS.reduce((s, k) => s + (t.xg_bands[k] ?? 0), 0)
  if (sum > 0) for (const k of BANDS) t.xg_bands[k] = +((t.xg_bands[k] ?? 0) * (t.xg / sum)).toFixed(3)
}
if (output) {
  normBands(output.home)
  normBands(output.away)
}

// ---- Pasta por run ----
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19) // 2026-06-29T05-58-17
const runDir = new URL(`./output/${MATCH_ID}/${stamp}/`, import.meta.url)

const dump = {
  meta: { matchId: MATCH_ID, model: MODEL, thinking: true, reasoningEffort: EFFORT, elapsedMs, at: new Date().toISOString(), actual },
  output, usage, reasoningTokens, finishReason, warnings, providerMetadata,
  request: { body: (request as { body?: unknown })?.body ?? null },
  steps,
  response: { modelId: response?.modelId, id: response?.id, messages: response?.messages },
  reasoningText, text,
}
await Bun.write(new URL("dump.json", runDir), JSON.stringify(dump, null, 2))
await Bun.write(new URL("prompt.md", runDir), prompt)

// Arquivo enxuto SÓ pra análise local da cadeia de raciocínio (reasoning consolidado + cada hop/step),
// sem o resto do dump (schema, usage, request). Não vai pro banco — é pra inspecionar o "como" do modelo.
await Bun.write(
  new URL("reasoning.json", runDir),
  JSON.stringify(
    { match: `${home?.name} x ${away?.name}`, result: actual, best_bet: output?.best_bet ?? null, reasoningTokens, reasoning: reasoningText ?? null, hops: steps ?? [] },
    null,
    2,
  ),
)

// ---- HTML ----
const esc = (s: unknown) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
// Renderiza o reasoning (markdown leve do modelo: **negrito**, parágrafos) em HTML legível — muito melhor
// que <pre> cru pra LER a cadeia de pensamento.
const mdToHtml = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("")
const tokenRows = Object.entries((usage ?? {}) as Record<string, unknown>)
  .map(([k, v]) => `<tr><td>${esc(k)}</td><td>${esc(typeof v === "object" ? JSON.stringify(v) : v)}</td></tr>`)
  .join("")

// Tabela de xG por faixa de 15 min (home vs away + total por faixa).
function bandsTable(o: Prognosis | null): string {
  if (!o?.home?.xg_bands || !o?.away?.xg_bands) return "<p>(sem xg_bands na resposta)</p>"
  const rows = BANDS.map((b) => {
    const h = o.home.xg_bands[b] ?? 0
    const a = o.away.xg_bands[b] ?? 0
    return `<tr><td>${b}</td><td>${h.toFixed(2)}</td><td>${a.toFixed(2)}</td><td>${(h + a).toFixed(2)}</td></tr>`
  }).join("")
  return `<table><thead><tr><th>Faixa</th><th>${esc(home?.name)} xG</th><th>${esc(away?.name)} xG</th><th>total</th></tr></thead><tbody>${rows}</tbody>
  <tfoot><tr><td><b>xG jogo</b></td><td><b>${o.home.xg.toFixed(2)}</b></td><td><b>${o.away.xg.toFixed(2)}</b></td><td><b>${o.general.total.toFixed(2)}</b></td></tr></tfoot></table>`
}

// Tabela de 1x2 (probabilidades home/empate/away) geral + por tempo.
function oxtTable(o: Prognosis | null): string {
  if (!o?.general?.one_x_two) return "<p>(sem 1x2 na resposta)</p>"
  const pct = (x: number) => `${(x * 100).toFixed(0)}%`
  const row = (label: string, t?: OneXTwo) =>
    t ? `<tr><td>${label}</td><td>${pct(t.home)}</td><td>${pct(t.draw)}</td><td>${pct(t.away)}</td></tr>` : ""
  return `<table><thead><tr><th>Período</th><th>${esc(home?.name)}</th><th>Empate</th><th>${esc(away?.name)}</th></tr></thead><tbody>
    ${row("Jogo (90min)", o.general.one_x_two)}${row("1º tempo", o.general.one_x_two_1t)}${row("2º tempo", o.general.one_x_two_2t)}</tbody></table>`
}

// Cards "por time" + "geral" — o coração da aba Prognóstico da UI.
function teamCard(side: "home" | "away", o: Prognosis | null): string {
  const t = o?.[side]
  const nm = side === "home" ? home?.name : away?.name
  if (!t) return ""
  return `<details open><summary>${esc(nm)} <span class="hint">xG ${t.xg.toFixed(2)} · 1ºT ${t.xg_1t.toFixed(2)} · 2ºT ${t.xg_2t.toFixed(2)}</span></summary>
  <div class="body"><p style="margin:6px 0 12px">${esc(t.summary)}</p>
  <table><thead><tr><th>Faixa</th>${BANDS.map((b) => `<th>${b}</th>`).join("")}</tr></thead>
  <tbody><tr><td>xG</td>${BANDS.map((b) => `<td>${(t.xg_bands[b] ?? 0).toFixed(2)}</td>`).join("")}</tr></tbody></table></div></details>`
}
function geralCard(o: Prognosis | null): string {
  const g = o?.general
  if (!g) return ""
  const pct = (x: number) => `${(x * 100).toFixed(0)}%`
  return `<div class="body">
  <div class="kpis">
    <div class="kpi"><b>${g.total.toFixed(2)}</b><span>total xG</span></div>
    <div class="kpi"><b>${pct(g.over25_prob)}</b><span>over 2.5</span></div>
    <div class="kpi"><b>${pct(g.btts_prob)}</b><span>BTTS</span></div>
    <div class="kpi"><b>${g.confidence}</b><span>confiança</span></div>
  </div>
  <p style="margin:12px 0 4px">${esc(g.summary)}</p></div>`
}
// Monta o rótulo legível da aposta a partir dos campos estruturados (o time sai de selection + match).
function bestBetLabel(m: BestBet): string {
  const nameOf = (s: "home" | "away" | null) => (s === "home" ? home?.name : s === "away" ? away?.name : null)
  const side = m.selection === "home" ? home?.name : m.selection === "away" ? away?.name : null
  const hcap = (n: number | null) => (n == null ? "" : n > 0 ? `+${n}` : `${n}`)
  if (m.market === "1x2") return m.selection === "draw" ? "Empate" : `Vitória${side ? " do " + side : ""}`
  if (m.market === "over_under") return `${m.selection === "over" ? "Over" : "Under"} ${m.line ?? ""} gols`.trim()
  if (m.market === "btts") return `Ambos marcam: ${m.selection === "yes" ? "Sim" : "Não"}`
  if (m.market === "handicap") return `${side ?? "?"} ${hcap(m.line)}`.trim()
  if (m.market === "team_total") return `${nameOf(m.team) ?? "?"} ${m.selection === "over" ? "Over" : "Under"} ${m.line ?? ""} gols`.trim()
  return "—"
}
function mercadoCard(o: Prognosis | null): string {
  const m = o?.best_bet
  if (!m) return ""
  const cor = m.confidence === "high" ? "#34d399" : m.confidence === "medium" ? "#fbbf24" : "#9ca3af"
  return `<div class="body">
  <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:4px 0 10px">
    <span style="font-size:20px;font-weight:700;color:${cor}">${esc(bestBetLabel(m))}</span>
    <span class="badge">confiança <b>${esc(m.confidence)}</b></span>
    <span class="badge">prob <b>${(m.probability * 100).toFixed(0)}%</b></span>
  </div>
  <p style="margin:0">${esc(m.analysis)}</p></div>`
}

const html = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DeepSeek ${esc(MODEL)} · ${esc(home?.name ?? "")} x ${esc(away?.name ?? "")}</title>
<style>
:root { color-scheme: dark; }
* { box-sizing: border-box; }
body { margin:0; font:15px/1.6 ui-sans-serif,system-ui,sans-serif; background:#0b0e14; color:#d7dce5; }
.wrap { max-width: 980px; margin: 0 auto; padding: 32px 20px 80px; }
h1 { font-size: 22px; margin: 0 0 4px; }
.sub { color:#8b93a7; margin-bottom: 24px; }
.badges { display:flex; gap:8px; flex-wrap:wrap; margin: 12px 0 24px; }
.badge { background:#161b27; border:1px solid #232a3a; border-radius:999px; padding:4px 12px; font-size:13px; color:#aeb6c8; }
.badge b { color:#7dd3fc; }
section, details { background:#11151f; border:1px solid #1e2533; border-radius:14px; margin:16px 0; overflow:hidden; }
summary { cursor:pointer; padding:14px 18px; font-weight:600; font-size:15px; list-style:none; display:flex; justify-content:space-between; align-items:center; }
summary::-webkit-details-marker { display:none; }
summary .hint { color:#677089; font-weight:400; font-size:12px; }
.body { padding: 0 18px 18px; }
pre { background:#0b0e14; border:1px solid #1e2533; border-radius:10px; padding:14px; overflow:auto; font:12.5px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace; color:#c4ccd8; white-space:pre-wrap; word-break:break-word; }
.reasoning pre { color:#b6a8d8; background:#100c1a; border-color:#2a2140; }
.reasoning-md { color:#cabce8; font-size:14.5px; background:#100c1a; border:1px solid #2a2140; border-radius:10px; padding:16px 18px; }
.reasoning-md p { margin:0 0 14px; }
.reasoning-md p:last-child { margin-bottom:0; }
.reasoning-md b { color:#ece2ff; }
.answer pre { color:#a7e0c0; background:#0a1410; border-color:#1d3a2a; }
.prompt pre { color:#cfe0ff; background:#0a0f1c; border-color:#1d2a44; }
table { width:100%; border-collapse:collapse; font-size:13px; }
th, td { padding:6px 10px; border-bottom:1px solid #1a2230; text-align:left; }
th { color:#8b93a7; font-weight:600; }
td:first-child { color:#8b93a7; }
tfoot td { color:#7dd3fc; border-top:2px solid #232a3a; }
.actual { background:#1a1206; border-color:#3a2a10; }
.actual b { color:#fbbf24; }
.kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:10px; margin:8px 0 4px; }
.kpi { background:#0b0e14; border:1px solid #1e2533; border-radius:10px; padding:12px; text-align:center; }
.kpi b { display:block; font-size:20px; color:#7dd3fc; text-transform:capitalize; }
.kpi span { font-size:12px; color:#8b93a7; }
</style></head><body><div class="wrap">
<h1>${esc(home?.name ?? "")} <span style="color:#677089">x</span> ${esc(away?.name ?? "")}</h1>
<div class="sub">Prognóstico de expected goals · <b>${esc(MODEL)}</b> · run ${esc(stamp)}</div>
<div class="badges">
  <span class="badge">modelo <b>${esc(MODEL)}</b></span>
  <span class="badge">thinking <b>on</b></span>
  <span class="badge">reasoning effort <b>${esc(EFFORT)}</b></span>
  <span class="badge">reasoning tokens <b>${esc(reasoningTokens ?? "?")}</b></span>
  <span class="badge">output <b>${output ? "tipado ✓" : "texto"}</b></span>
  <span class="badge">latência <b>${(elapsedMs / 1000).toFixed(1)}s</b></span>
</div>

<section class="actual"><div style="padding:14px 18px"><b style="color:#fbbf24">Resultado real:</b> ${esc(actual)}</div></section>

<h2 style="font-size:16px;margin:24px 0 8px;color:#aeb6c8">🎯 Melhor mercado (leitura de apostador)</h2>
<details open><summary>Aposta recomendada <span class="hint">a decisão — separada dos números</span></summary>${mercadoCard(output)}</details>

<h2 style="font-size:16px;margin:24px 0 8px;color:#aeb6c8">📊 Prognóstico geral</h2>
<details open><summary>Jogo <span class="hint">agregados + resumo</span></summary>${geralCard(output)}</details>
<details open><summary>Expectativa 1x2 <span class="hint">geral · 1º tempo · 2º tempo</span></summary><div class="body">${oxtTable(output)}</div></details>

<h2 style="font-size:16px;margin:24px 0 8px;color:#aeb6c8">👥 Prognóstico por time</h2>
${teamCard("home", output)}
${teamCard("away", output)}

<details open><summary>xG por faixa de 15 min <span class="hint">os dois times + total</span></summary><div class="body">${bandsTable(output)}</div></details>

${output ? `<details open><summary>Prognóstico (objeto tipado)</summary><div class="body"><pre>${esc(JSON.stringify(output, null, 2))}</pre></div></details>` : ""}

<details class="answer"><summary>Resposta final (texto cru) <span class="hint">content</span></summary><div class="body"><pre>${esc(text)}</pre></div></details>

<details class="reasoning" open><summary>🧠 Cadeia de raciocínio <span class="hint">reasoning_content · ${esc(reasoningTokens ?? "?")} tokens</span></summary><div class="body"><div class="reasoning-md">${reasoningText ? mdToHtml(reasoningText) : "<p>(provider não retornou reasoning text)</p>"}</div></div></details>

<details class="prompt" open><summary>📤 Prompt enviado <span class="hint">${esc(prompt.length)} chars</span></summary><div class="body"><pre>${esc(prompt)}</pre></div></details>

<details><summary>Tokens / usage</summary><div class="body"><table><tbody>${tokenRows}<tr><td>reasoningTokens</td><td>${esc(reasoningTokens ?? "?")}</td></tr></tbody></table></div></details>

<details><summary>Todos os hops <span class="hint">steps[] + request/response cru</span></summary><div class="body"><pre>${esc(JSON.stringify({ request: dump.request, steps, response: dump.response, providerMetadata, warnings }, null, 2))}</pre></div></details>

<div class="sub" style="margin-top:24px;font-size:12px">Dump cru: <code>dump.json</code> · Prompt: <code>prompt.md</code> · ${esc(new Date().toISOString())}</div>
</div></body></html>`

await Bun.write(new URL("report.html", runDir), html)

// ---- Terminal ----
console.log("\n================ PROGNÓSTICO (tipado) ================\n")
console.log(JSON.stringify(output, null, 2))
console.log("\n================ TOKENS ================")
console.log(JSON.stringify(usage), "reasoningTokens:", reasoningTokens)
console.log("\nResultado real:", actual)
const runRel = `scripts/output/${MATCH_ID}/${stamp}`
console.error(`\n[ok] run salvo em ${runRel}/ (report.html, dump.json, prompt.md)`)

// Persiste na tabela match_prognosis (métricas + textos + auditoria). Só quando veio output tipado.
if (output) {
  try {
    const id = await persistPrognosis(dump, prompt)
    console.error(`[ok] persistido em match_prognosis ${id}`)
  } catch (e) {
    console.error(`[aviso] não persistiu: ${(e as Error).message}`)
  }
}
process.exit(0)
