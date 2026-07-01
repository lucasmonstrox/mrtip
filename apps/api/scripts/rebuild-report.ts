/**
 * Re-gera o report.html de uma run JÁ EXISTENTE a partir do dump.json — SEM chamar a API. Serve pra ler a
 * cadeia de raciocínio (reasoning) renderizada (markdown → HTML legível) em vez do <pre> cru, e pra aplicar
 * melhorias de layout em runs antigas. Pega a última run do match (ou a passada por path).
 *
 * Run:  bun run scripts/rebuild-report.ts <matchId>     (usa a última run salva)
 */
import { readdirSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const MATCH_ID = process.argv[2] ?? "77a4255a-3e44-4fd9-a133-b13ca0898a91"
const baseDir = fileURLToPath(new URL(`./output/${MATCH_ID}/`, import.meta.url))
const runs = readdirSync(baseDir).filter((d) => /^\d{4}-/.test(d)).sort()
const latest = runs.at(-1)
if (!latest) throw new Error(`nenhuma run em ${baseDir}`)
const runDir = `${baseDir}${latest}`
const dump = JSON.parse(readFileSync(`${runDir}/dump.json`, "utf8"))
let promptText = ""
try { promptText = readFileSync(`${runDir}/prompt.md`, "utf8") } catch { /* sem prompt.md salvo nesta run */ }

const o = dump.output as Record<string, any> | null
const reasoning: string = dump.reasoningText ?? ""
const steps = dump.steps ?? []
const actual: string = dump.meta?.actual ?? ""
const model: string = dump.meta?.model ?? "?"
const effort: string = dump.meta?.reasoningEffort ?? "?"
const reasoningTokens = dump.reasoningTokens ?? "?"
const BANDS = ["0-15", "16-30", "31-45", "46-60", "61-75", "76-90"] as const
const [, homeName = "Mandante", awayName = "Visitante"] = /^(.+?) \d+-\d+ (.+?) \(/.exec(actual) ?? []

const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
// Reasoning do modelo vem em markdown leve (**negrito**, parágrafos, listas) — renderiza pra HTML legível.
const md = (s: string) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
    .split(/\n{2,}/)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("")
const pct = (x: number | null | undefined) => (x == null ? "?" : `${Math.round(x * 100)}%`)
const f2 = (x: number | null | undefined) => (x == null ? "?" : x.toFixed(2))

const bb = o?.best_bet
const g = o?.general
const sideName = (s: string) => (s === "home" ? homeName : awayName)
const hcap = (n: number | null) => (n == null ? "" : n > 0 ? `+${n}` : `${n}`)
const betLabel = !bb
  ? "—"
  : bb.market === "over_under"
    ? `${bb.selection === "over" ? "Over" : "Under"} ${bb.line ?? ""}`.trim()
    : bb.market === "btts"
      ? `Ambas marcam: ${bb.selection === "yes" ? "Sim" : "Não"}`
      : bb.market === "handicap"
        ? `${sideName(bb.selection)} ${hcap(bb.line)}`.trim()
        : bb.market === "team_total"
          ? `${sideName(bb.team)} ${bb.selection === "over" ? "Over" : "Under"} ${bb.line ?? ""} gols`.trim()
          : bb.selection === "draw"
            ? "Empate"
            : `Vitória ${sideName(bb.selection)}`

const bandsRow = (side: "home" | "away") =>
  BANDS.map((b) => `<td>${f2(o?.[side]?.xg_bands?.[b])}</td>`).join("")
const oxtRow = (label: string, t: any) =>
  t ? `<tr><td>${label}</td><td>${pct(t.home)}</td><td>${pct(t.draw)}</td><td>${pct(t.away)}</td></tr>` : ""

const hopsHtml = (steps as any[])
  .map((s, i) => {
    const rt = s.reasoningText ?? (s.content ?? []).filter((c: any) => c.type === "reasoning").map((c: any) => c.text).join("\n")
    return `<details><summary>Hop ${i} <span class="hint">${esc(s.finishReason ?? "")} · ${esc(JSON.stringify(s.usage ?? {}))}</span></summary>
    <div class="body"><div class="reasoning-md">${rt ? md(rt) : "<p>(sem reasoning neste hop)</p>"}</div></div></details>`
  })
  .join("")

const html = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Reasoning · ${esc(homeName)} x ${esc(awayName)}</title>
<style>
:root { color-scheme: dark; }
* { box-sizing: border-box; }
body { margin:0; font:15px/1.65 ui-sans-serif,system-ui,sans-serif; background:#0b0e14; color:#d7dce5; }
.wrap { max-width: 900px; margin:0 auto; padding:32px 20px 80px; }
h1 { font-size:22px; margin:0 0 4px; }
.sub { color:#8b93a7; margin-bottom:18px; font-size:13px; }
.badges { display:flex; gap:8px; flex-wrap:wrap; margin:10px 0 22px; }
.badge { background:#161b27; border:1px solid #232a3a; border-radius:999px; padding:4px 12px; font-size:13px; color:#aeb6c8; }
.badge b { color:#7dd3fc; }
.actual { background:#1a1206; border:1px solid #3a2a10; border-radius:12px; padding:12px 16px; margin:14px 0; }
.actual b { color:#fbbf24; }
.bet { background:#10151f; border:1px solid #1e2533; border-radius:12px; padding:14px 16px; margin:14px 0; }
.bet .lbl { font-size:20px; font-weight:700; color:#fbbf24; }
h2 { font-size:15px; margin:26px 0 8px; color:#aeb6c8; }
details { background:#11151f; border:1px solid #1e2533; border-radius:12px; margin:12px 0; overflow:hidden; }
summary { cursor:pointer; padding:13px 16px; font-weight:600; list-style:none; }
summary::-webkit-details-marker { display:none; }
.hint { color:#677089; font-weight:400; font-size:12px; }
.body { padding:0 16px 16px; }
table { width:100%; border-collapse:collapse; font-size:13px; }
th,td { padding:6px 10px; border-bottom:1px solid #1a2230; text-align:left; }
th { color:#8b93a7; }
.reasoning-md { color:#cabce8; font-size:14.5px; background:#100c1a; border:1px solid #2a2140; border-radius:10px; padding:16px 18px; }
.reasoning-md p { margin:0 0 14px; }
.reasoning-md p:last-child { margin-bottom:0; }
.reasoning-md b { color:#ece2ff; }
.summary-txt { color:#c4ccd8; margin:6px 0 0; }
.prompt-pre { white-space:pre-wrap; word-break:break-word; background:#0a0f1c; border:1px solid #1d2a44; border-radius:10px; padding:14px; color:#cfe0ff; font:12.5px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace; }
</style></head><body><div class="wrap">
<h1>${esc(homeName)} <span style="color:#677089">x</span> ${esc(awayName)}</h1>
<div class="sub">Reasoning da run <b>${esc(latest)}</b> · ${esc(model)} · effort ${esc(effort)}</div>
<div class="badges">
  <span class="badge">reasoning tokens <b>${esc(reasoningTokens)}</b></span>
  <span class="badge">hops <b>${(steps as any[]).length}</b></span>
</div>
<div class="actual"><b>Resultado real:</b> ${esc(actual)}</div>
${bb ? `<div class="bet"><div class="lbl">🎯 ${esc(betLabel)}</div><div class="hint">confiança ${esc(bb.confidence)} · prob ${pct(bb.probability)}</div><p class="summary-txt">${esc(bb.analysis)}</p></div>` : ""}

<h2>🧠 Cadeia de raciocínio (reasoning)</h2>
<div class="reasoning-md">${reasoning ? md(reasoning) : "<p>(sem reasoning no dump)</p>"}</div>

${g ? `<h2>📊 Geral</h2><details open><summary>xG ${f2(g.total)} · over2.5 ${pct(g.over25_prob)} · BTTS ${pct(g.btts_prob)} · ${esc(g.confidence)}</summary>
<div class="body"><p class="summary-txt">${esc(g.summary)}</p>
<table><thead><tr><th>Período</th><th>${esc(homeName)}</th><th>Empate</th><th>${esc(awayName)}</th></tr></thead><tbody>
${oxtRow("Jogo", g.one_x_two)}${oxtRow("1º tempo", g.one_x_two_1t)}${oxtRow("2º tempo", g.one_x_two_2t)}</tbody></table></div></details>` : ""}

${o ? `<h2>👥 Por time</h2>
<details open><summary>${esc(homeName)} <span class="hint">xG ${f2(o.home.xg)}</span></summary><div class="body"><p class="summary-txt">${esc(o.home.summary)}</p>
<table><thead><tr><th>Faixa</th>${BANDS.map((b) => `<th>${b}</th>`).join("")}</tr></thead><tbody><tr><td>xG</td>${bandsRow("home")}</tr></tbody></table></div></details>
<details open><summary>${esc(awayName)} <span class="hint">xG ${f2(o.away.xg)}</span></summary><div class="body"><p class="summary-txt">${esc(o.away.summary)}</p>
<table><thead><tr><th>Faixa</th>${BANDS.map((b) => `<th>${b}</th>`).join("")}</tr></thead><tbody><tr><td>xG</td>${bandsRow("away")}</tr></tbody></table></div></details>` : ""}

<h2>🔁 Hops</h2>${hopsHtml}
${promptText ? `<h2>📤 Prompt enviado</h2><details><summary>ver prompt <span class="hint">${esc(promptText.length)} chars</span></summary><div class="body"><pre class="prompt-pre">${esc(promptText)}</pre></div></details>` : ""}
</div></body></html>`

const { writeFileSync } = await import("node:fs")
writeFileSync(`${runDir}/report.html`, html)
console.log(`[ok] report.html re-gerado (reasoning legível) → output/${MATCH_ID}/${latest}/report.html`)
console.log(`     reasoning: ${reasoning.length} chars · hops: ${(steps as any[]).length}`)
process.exit(0)
