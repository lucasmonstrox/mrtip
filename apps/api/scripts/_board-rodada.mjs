// Gera o quadro PNG dos jogos ainda não disputados da rodada 19 do Brasileirão: monta o SVG à mão
// (layout de lista com fios, estado de concordância entre runs por cor) e rasteriza via resvg.
import { Resvg } from "@resvg/resvg-js"
import { writeFileSync } from "node:fs"

const C = {
  paper: "#EDEFEC",
  ink: "#191D1A",
  ink2: "#4A524C",
  ink3: "#7C857E",
  rule: "#D3D8D3",
  ruleSoft: "#E1E5E0",
  estavel: "#2F6B4F",
  divergente: "#8A6420",
  contra: "#9C3B2E",
  unica: "#6B736D",
}
const SERIF = "Georgia, 'Times New Roman', serif"
const MONO = "Consolas, 'Courier New', monospace"
const SANS = "'Segoe UI', system-ui, sans-serif"

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const t = (x, y, s, { f = SANS, size = 16, fill = C.ink, w = 400, anchor = "start", ls = 0 } = {}) =>
  `<text x="${x}" y="${y}" font-family="${f}" font-size="${size}" fill="${fill}" font-weight="${w}" text-anchor="${anchor}"${ls ? ` letter-spacing="${ls}"` : ""}>${esc(s)}</text>`

const FLOOR = 0.55 // piso de probabilidade instituído no commit 840566f

const games = [
  { dow: "TER", date: "21/07", time: "19:30", home: "Atlético-MG", away: "Bahia", state: "divergente",
    runs: [{ bet: "over 2.5 gols", p: 0.60, c: "média" }, { bet: "ambas marcam — sim", p: 0.72, c: "média" }] },
  { dow: "QUA", date: "22/07", time: "19:30", home: "Coritiba", away: "Palmeiras", state: "divergente",
    runs: [{ bet: "empate ou Palmeiras", p: 0.80, c: "média" }, { bet: "over 2.5 gols", p: 0.58, c: "média" }] },
  { dow: "QUA", date: "22/07", time: "21:30", home: "Chapecoense", away: "Flamengo", state: "estavel",
    runs: [{ bet: "Flamengo over 1.5 gols", p: 0.70, c: "média" }, { bet: "Flamengo over 1.5 gols", p: 0.70, c: "ALTA" }] },
  { dow: "QUA", date: "22/07", time: "21:30", home: "Internacional", away: "Cruzeiro", state: "divergente",
    runs: [{ bet: "over 2.5 gols", p: 0.50, c: "média" }, { bet: "Internacional over 1.5 gols", p: 0.47, c: "média" }] },
  { dow: "QUA", date: "22/07", time: "21:30", home: "São Paulo", away: "Athletico-PR", state: "contra",
    runs: [{ bet: "UNDER 2.5 gols", p: 0.60, c: "média" }, { bet: "OVER 2.5 gols", p: 0.50, c: "média" }] },
  { dow: "QUI", date: "23/07", time: "19:30", home: "Corinthians", away: "Remo", state: "unica",
    runs: [{ bet: "empate ou Corinthians", p: 0.71, c: "média" }] },
]

const STATE = {
  estavel: { label: "AS 2 RUNS BATEM", color: C.estavel },
  divergente: { label: "RUNS DIVERGEM", color: C.divergente },
  contra: { label: "RUNS SE CONTRADIZEM", color: C.contra },
  unica: { label: "RUN ÚNICA", color: C.unica },
}

const W = 940
const M = 56
const R = W - M // borda direita do conteúdo
const COL_BET = 214 // onde começa o texto da aposta
const COL_PROB = R - 132 // fim da coluna de probabilidade (right-aligned)

let y = 0
const out = []

// ---- cabeçalho
y = 74
out.push(t(M, y, "SÉRIE A · BRASIL · TEMPORADA 2026", { f: MONO, size: 13, fill: C.ink3, ls: 2.2 }))
y += 46
out.push(t(M, y, "Rodada 19 — o que ainda não foi jogado", { f: SERIF, size: 38, fill: C.ink }))
y += 32
out.push(t(M, y, "6 jogos em aberto · 11 apostas · prognósticos gerados em 19/07/2026", { f: SANS, size: 16, fill: C.ink2 }))

// ---- faixa-resumo dos estados
y += 40
const tally = [
  ["1 estável", C.estavel], ["3 divergentes", C.divergente],
  ["1 contraditório", C.contra], ["1 run única", C.unica],
]
let tx = M
for (const [label, color] of tally) {
  out.push(`<rect x="${tx}" y="${y - 9}" width="9" height="9" fill="${color}"/>`)
  out.push(t(tx + 17, y, label, { f: MONO, size: 13.5, fill: C.ink2 }))
  tx += 17 + label.length * 7.6 + 30
}

// ---- lista de confrontos
y += 26
out.push(`<rect x="${M}" y="${y}" width="${R - M}" height="1.5" fill="${C.ink}"/>`)
y += 34

for (const [gi, g] of games.entries()) {
  const st = STATE[g.state]
  const top = y - 22
  const h = g.runs.length === 2 ? 116 : 86

  // barra de estado à esquerda do bloco
  out.push(`<rect x="${M}" y="${top}" width="3" height="${h - 26}" fill="${st.color}"/>`)

  // data / hora
  out.push(t(M + 16, y, `${g.dow} ${g.date}`, { f: MONO, size: 13.5, fill: C.ink2, w: 600 }))
  out.push(t(M + 16, y + 20, g.time, { f: MONO, size: 13.5, fill: C.ink3 }))

  // confronto + estado
  out.push(t(COL_BET, y, `${g.home}  ×  ${g.away}`, { f: SERIF, size: 25, fill: C.ink }))
  out.push(t(R, y - 1, st.label, { f: MONO, size: 12, fill: st.color, anchor: "end", w: 700, ls: 1.2 }))

  // linhas das runs
  let ry = y + 30
  for (const [i, r] of g.runs.entries()) {
    const low = r.p < FLOOR
    out.push(t(COL_BET, ry, `run ${i + 1}`, { f: MONO, size: 12.5, fill: C.ink3 }))
    out.push(t(COL_BET + 58, ry, r.bet, { f: SANS, size: 16.5, fill: C.ink }))
    out.push(t(COL_PROB, ry, `${Math.round(r.p * 100)}%${low ? " †" : ""}`, {
      f: MONO, size: 16.5, fill: low ? C.contra : C.ink, anchor: "end", w: 600,
    }))
    out.push(t(R, ry, `conf. ${r.c.toLowerCase()}`, {
      f: MONO, size: 12.5, fill: r.c === "ALTA" ? C.estavel : C.ink3, anchor: "end", w: r.c === "ALTA" ? 700 : 400,
    }))
    ry += 26
  }

  // O último bloco não leva fio: quem fecha a lista é a régua do rodapé.
  if (gi === games.length - 1) { y += h - 34; break }
  y += h
  out.push(`<rect x="${M}" y="${y - 30}" width="${R - M}" height="1" fill="${C.ruleSoft}"/>`)
}

// ---- rodapé
y += 26
out.push(`<rect x="${M}" y="${y}" width="${R - M}" height="1.5" fill="${C.rule}"/>`)
y += 28
const notes = [
  "†  probabilidade abaixo do piso de 0,55 exigido pela best_bet — 3 das 11 apostas passaram por baixo dele.",
  "São Paulo × Athletico-PR inverteu o lado do MESMO mercado entre as duas execuções: isso é ruído, não sinal.",
  "Chapecoense × Flamengo é o único jogo em que as duas runs devolveram exatamente a mesma aposta.",
  "Estas 6 são as primeiras previsões pré-jogo do projeto — todo o histórico anterior (297) foi gerado após o apito.",
]
for (const n of notes) {
  out.push(t(M, y, n, { f: SANS, size: 13.5, fill: C.ink2 }))
  y += 21
}

const H = y + 30
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${C.paper}"/>
${out.join("\n")}
</svg>`

const png = new Resvg(svg, { font: { loadSystemFonts: true }, fitTo: { mode: "width", value: W * 2 } })
  .render().asPng()
const dest = process.argv[2] ?? "board.png"
writeFileSync(dest, png)
console.log(`ok ${dest} — ${W * 2}×${Math.round(H * 2)} px, ${(png.length / 1024).toFixed(0)} KB`)
