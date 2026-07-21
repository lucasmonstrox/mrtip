/**
 * Relatório HTML de ultrapassagem — um painel por time, com a CONTA exposta pra auditoria manual.
 *
 * Irmão do `_report-ultrapassagem.ts` (markdown). Existe separado porque o alvo é diferente: o .md serve
 * pra diff/grep, este serve pra sentar e conferir 20 times sem perder a linha. Ambos consomem o MESMO
 * `lib/ultrapassagem.ts` que o `prognosis-prompt.ts` usa — validar aqui é validar o prompt.
 *
 * O que a tela mostra além do texto: os números intermediários (`contas`) de cada cenário, pra conferir
 * o veredito sem refazer a aritmética de cabeça.
 *
 *   bun run scripts/_report-ultrapassagem-html.ts BRA 2025 2025-12-07
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { tiebreakOfSeason } from "../src/modules/leagues/shared/shared"
import { analisarCenarios, type Analise, type Jogo } from "./lib/cenarios"
import { cenarioUltrapassagem, ordenar, type Cenario, type TeamLine } from "./lib/ultrapassagem"

const [LEAGUE = "BRA", SEASON = "2025", CUTOFF = "2025-12-07"] = process.argv.slice(2)
type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const sg = (n: number) => (n >= 0 ? `+${n}` : `${n}`)
// O texto do módulo vem com **negrito** de markdown; converte pra <b> em vez de despejar asterisco na tela.
const md = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")

const [seasonRow] = rowsOf(await db.execute(sql`
  select s.id, s.name from season s where s.league_code = ${LEAGUE} and s.name = ${SEASON} limit 1`))
if (!seasonRow) throw new Error(`temporada ${LEAGUE} ${SEASON} não encontrada`)
const TIEBREAK = (await tiebreakOfSeason(LEAGUE, String(seasonRow.id))).criteria

const jogos = rowsOf(await db.execute(sql`
  select m.home_team_id h, m.away_team_id a, m.ft_home fh, m.ft_away fa, m.date, th.name hn, ta.name an
  from match m join team th on th.id = m.home_team_id join team ta on ta.id = m.away_team_id
  where m.season_id = ${seasonRow.id} and m.ft_home is not null order by m.date`))

type Acc = { teamId: string; name: string; points: number; won: number; drawn: number; lost: number; gd: number; gf: number; ga: number; jogados: number; restantes: number }
const acc = new Map<string, Acc>()
const pega = (id: string, nome: string) => {
  let v = acc.get(id)
  if (!v) acc.set(id, (v = { teamId: id, name: nome, points: 0, won: 0, drawn: 0, lost: 0, gd: 0, gf: 0, ga: 0, jogados: 0, restantes: 0 }))
  return v
}
for (const j of jogos) {
  const h = pega(String(j.h), String(j.hn))
  const a = pega(String(j.a), String(j.an))
  if (String(j.date) >= CUTOFF) {
    h.restantes++
    a.restantes++
    continue
  }
  const fh = Number(j.fh), fa = Number(j.fa)
  h.gf += fh; h.ga += fa; h.gd += fh - fa; h.jogados++
  a.gf += fa; a.ga += fh; a.gd += fa - fh; a.jogados++
  if (fh > fa) { h.points += 3; h.won++; a.lost++ } else if (fa > fh) { a.points += 3; a.won++; h.lost++ } else { h.points++; a.points++; h.drawn++; a.drawn++ }
}

// Jogos que ainda faltam no corte — insumo do motor de cenários. Sem eles não existe "e se".
const restantes: Jogo[] = jogos.filter((j) => String(j.date) >= CUTOFF).map((j) => ({ homeId: String(j.h), awayId: String(j.a) }))

const tabela = ordenar([...acc.values()], TIEBREAK)
const linhas: TeamLine[] = tabela.map((t, i) => ({ teamId: t.teamId, name: t.name, pos: i + 1, points: t.points, won: t.won, gd: t.gd, gf: t.gf, gamesRemaining: t.restantes }))

// Zonas: vêm da tabela `standing`, INGERIDA da SportMonks — não são corte chutado por nós. Como aquela
// tabela é a classificação FINAL, a zona está colada na POSIÇÃO (o Grêmio termina 9º lá, não 11º como no
// corte pré-38ª). Então o que se reaproveita é a FAIXA de posições, aplicada à tabela deste corte.
// Sem standings ingeridos, fica sem zona — melhor nada do que uma faixa inventada. @feature LIG-006
const zonaRows = rowsOf(await db.execute(sql`
  select st.position, st.zone from standing st
  where st.season_id = ${seasonRow.id} and st.zone is not null order by st.position`))
const zonaPorPos = new Map<number, string>(zonaRows.map((z) => [Number(z.position), String(z.zone)]))
const ZONA_META: Record<string, { rotulo: string; cor: string }> = {
  libertadores: { rotulo: "Libertadores (G4)", cor: "#22c55e" },
  "libertadores-qualifiers": { rotulo: "Pré-Libertadores", cor: "#38bdf8" },
  sudamericana: { rotulo: "Sul-Americana", cor: "#eab308" },
  relegation: { rotulo: "Rebaixamento (Z4)", cor: "#ef4444" },
}
const zonaDe = (pos: number) => zonaPorPos.get(pos) ?? null
// Faixas contíguas, pra legenda ("1-4 Libertadores") em vez de repetir por linha.
const faixas: { zona: string; de: number; ate: number }[] = []
for (const [pos, z] of [...zonaPorPos.entries()].sort((a, b) => a[0] - b[0])) {
  const ult = faixas[faixas.length - 1]
  if (ult && ult.zona === z && ult.ate === pos - 1) ult.ate = pos
  else faixas.push({ zona: z, de: pos, ate: pos })
}

const VIA_LABEL: Record<string, string> = {
  pontos: "PONTOS", vitorias: "VITÓRIAS", saldo: "SALDO", golsPro: "GOLS PRÓ", indefinido: "INDEFINIDO", impossivel: "IMPOSSÍVEL",
}

/** Cartão de um cenário: veredito + a conta que o sustenta, lado a lado. */
function card(c: Cenario, direcao: "baixo" | "cima"): string {
  const k = c.contas
  const cls = !c.possivel ? "no" : c.via === "pontos" ? "pts" : c.via === "vitorias" ? "vit" : c.via === "indefinido" ? "und" : "sal"
  // Os números são sempre PERSEGUIDOR vs ALVO. Sem os nomes, "V 20 vs 22" é ilegível no painel de quem
  // olha pra cima (o cartão mostra o alvo, mas o primeiro número é do perseguidor) — foi o bug que o dono
  // pegou no par Palmeiras/Cruzeiro. Nomear custa espaço e elimina a leitura errada.
  const par = (rot: string, a: number | null, b: number | null, hi = false) =>
    `<span class="n${hi ? " hi" : ""}"><i>${rot}</i> ${esc(c.chaser)} ${a} <em>vs</em> ${esc(c.alvo)} ${b}</span>`
  const contas = [
    par("pts", k.chaserMax, k.alvoMin),
    k.chaserVitorias != null ? par("V", k.chaserVitorias, k.alvoVitorias) : "",
    `<span class="n"><i>gap SG</i> ${sg(k.gapSaldo)} <em>(a favor de ${esc(k.gapSaldo >= 0 ? c.alvo : c.chaser)})</em></span>`,
    c.swingNecessario ? `<span class="n hi"><i>swing p/ ${esc(c.chaser)}</i> ${c.swingNecessario}</span>` : "",
    par("GP", k.chaserGf, k.alvoGf),
  ].filter(Boolean).join("")
  return `<div class="card ${cls}">
    <div class="top"><span class="badge">${VIA_LABEL[c.via] ?? c.via}</span>${c.possivel ? "" : `<span class="badge nope">NÃO PASSA</span>`}<span class="dir">${direcao === "baixo" ? "↑ ameaça" : "↓ alvo"}</span></div>
    <p>${md(c.texto)}</p>
    <div class="contas">${contas}</div>
  </div>`
}

// Matriz "e se" + as três categorias de rival. Vem DIRETO do motor validado — nada é recalculado aqui.
// Recalcular no render foi o erro que já mordeu duas vezes hoje (lógica duplicada divergindo em silêncio).
function blocoCenarios(an: Analise, posAtual: number): string {
  const RES_ROT = { vitoria: "Se VENCER", empate: "Se EMPATAR", derrota: "Se PERDER" } as const
  const seta = (de: number, para: number) => (para < de ? "sobe" : para > de ? "cai" : "mantém")
  const desf = an.desfechos.map((d) => {
    const faixa = d.piso === d.teto ? `<b class="fix">${d.teto}º</b> <em>(definido)</em>` : `garante <b>${d.piso}º</b> · pode chegar a <b>${d.teto}º</b>`
    return `<tr><td class="res">${RES_ROT[d.resultado]}</td><td>${faixa}</td><td class="mv">${seta(posAtual, d.teto)}</td><td class="cn">${d.cenarios} cenário(s)</td></tr>`
  }).join("")

  const CAT = [
    { k: "abaixo", rot: "ABAIXO — podem te passar", cls: "cat-down", vazio: "Ninguém abaixo consegue te alcançar." },
    { k: "empatado", rot: "EMPATADOS — podem ir pros dois lados", cls: "cat-tie", vazio: "Ninguém empatado contigo no que o cenário decide." },
    { k: "acima", rot: "ACIMA — você pode passar", cls: "cat-up", vazio: "Você não alcança ninguém acima." },
  ] as const
  const cats = CAT.map((c) => {
    const lista = an.rivais.filter((r) => r.relacao === c.k)
    const itens = lista.length
      ? lista.map((r) => {
          const ramos = r.ramos
            ? `<div class="ramos">${r.ramos.map((b) => `<div class="ramo ${b.fica === "a frente" ? "mal" : b.fica === "atras" ? "bem" : "gol"}"><i>${b.resultado === "vitoria" ? "você vence" : b.resultado === "empate" ? "empata" : "perde"}</i> você ${b.alvoPts} · ele ${b.rivalPts} → <b>${b.fica}</b></div>`).join("")}</div>`
            : ""
          return `<div class="riv">
            <div class="rtop"><span class="rn">${esc(r.name)}</span>${r.confrontoDireto ? `<span class="cd">⚔️ CONFRONTO DIRETO</span>` : ""}${r.dependeDeGol ? `<span class="dg">decide no gol</span>` : ""}</div>
            ${r.confrontoDireto ? `<div class="expl">O resultado dele é o seu invertido — é o único rival cuja eliminação depende só de você.</div>` : ""}
            ${ramos}
          </div>`
        }).join("")
      : `<div class="vazio">${c.vazio}</div>`
    return `<div class="cat ${c.cls}"><h4>${c.rot} <span class="qt">${lista.length}</span></h4>${itens}</div>`
  }).join("")

  const entre = an.entreRivais.length
    ? `<div class="entre"><h4>⚡ Rivais que se enfrentam <span class="qt">${an.entreRivais.length}</span></h4>${an.entreRivais
        .map((c) => `<div class="er"><b>${esc(c.aNome)}</b> <em>×</em> <b>${esc(c.bNome)}</b> <span class="rel">(${c.aRelacao} × ${c.bRelacao})</span><div class="ef">${md(c.efeito)}</div></div>`)
        .join("")}</div>`
    : ""

  // Matriz de dependência: responde "e se AQUELE jogo empatar?", que piso/teto resumem mas não mostram.
  const RES_CURTO = { vitoria: "venço", empate: "empato", derrota: "perco" } as const
  const matriz = an.matriz.length && an.jogosRelevantes.length
    ? (() => {
        const combos = [...new Map(an.matriz.map((c) => [c.outros.map((o) => o.resultado).join("|"), c.outros])).values()]
        const cabecalho = combos.map((c) => `<th>${c.map((o) => esc(o.resultado)).join("<br>")}</th>`).join("")
        const linhasM = (["vitoria", "empate", "derrota"] as const)
          .filter((r) => an.matriz.some((c) => c.meuResultado === r))
          .map((r) => {
            const cels = combos.map((cb) => {
              const key = cb.map((o) => o.resultado).join("|")
              const c = an.matriz.find((x) => x.meuResultado === r && x.outros.map((o) => o.resultado).join("|") === key)
              if (!c) return `<td>—</td>`
              const txt = c.posMin === c.posMax ? `${c.posMin}º` : `${c.posMin}–${c.posMax}º`
              return `<td class="${c.dependeDeGol ? "gd" : "fx"}" title="${c.dependeDeGol ? "faixa: depende do saldo de gols" : "posição determinada"}">${txt}</td>`
            }).join("")
            return `<tr><th class="me">${RES_CURTO[r]}</th>${cels}</tr>`
          }).join("")
        return `<div class="mtz"><h4>🔀 E se os outros jogos… <span class="sub">linhas = meu resultado · colunas = ${an.jogosRelevantes.map(esc).join(" / ")}</span></h4>
          <table class="mt"><thead><tr><th></th>${cabecalho}</tr></thead><tbody>${linhasM}</tbody></table>
          <div class="lgm"><span class="k fx"></span>posição definida <span class="k gd"></span>faixa — depende do saldo</div></div>`
      })()
    : ""

  return `<div class="cen">
    <h3>E se… <span class="c">${an.exata ? `enumeração exata · ${an.jogosEnumerados} jogo(s) relevante(s)` : `⚠️ LIMITE — enumeração parcial (${an.jogosEnumerados} jogos), ameaça pode estar subestimada`}</span></h3>
    <table class="cenT"><tbody>${desf}</tbody></table>
    ${matriz}
    ${entre}
    <div class="cats">${cats}</div>
  </div>`
}

// Ameaça REAL e caso DESCARTADO não podem sair na mesma lista: o contador dizia "0 podem passar" e logo
// abaixo aparecia o card do Cruzeiro marcado NÃO PASSA, lido como ameaça. O "por que não passa" é
// informação boa (é o desempate mostrando serviço) — só não pode ficar misturado com quem ameaça.
function coluna(titulo: string, cs: Cenario[], dir: "baixo" | "cima", vazio: string): string {
  const reais = cs.filter((c) => c.possivel)
  const fora = cs.filter((c) => !c.possivel)
  return `<h3>${titulo} <span class="c">${reais.length} de ${cs.length} avaliados</span></h3>
    ${reais.length ? reais.map((c) => card(c, dir)).join("") : `<div class="vazio">${vazio}</div>`}
    ${fora.length ? `<details class="desc"><summary>${fora.length} descartado(s) pelo desempate — por quê</summary>${fora.map((c) => card(c, dir)).join("")}</details>` : ""}`
}

const SIT: Record<string, { rot: string; cor: string; expl: string }> = {
  travado: { rot: "POSIÇÃO TRAVADA", cor: "#8b98a5", expl: "Não sobe nem cai, faça o que fizer — nada em jogo na tabela." },
  so_defende: { rot: "SÓ TEM A PERDER", cor: "#f87171", expl: "Não alcança ninguém acima; só pode cair. Defende posição." },
  so_ataca: { rot: "SÓ TEM A GANHAR", cor: "#4ade80", expl: "Ninguém abaixo o alcança; só pode subir. Joga solto." },
  dois_lados: { rot: "DOIS LADOS", cor: "#fcd34d", expl: "Pode subir e pode cair — a rodada mexe nos dois sentidos." },
}

const secoes = linhas.map((alvo) => {
  const t = acc.get(alvo.teamId)!
  const an = analisarCenarios({ times: linhas.map((l) => ({ teamId: l.teamId, name: l.name, points: l.points, won: l.won, gd: l.gd, gf: l.gf })), jogos: restantes, tiebreak: TIEBREAK, alvoId: alvo.teamId })
  const ameacas = linhas.filter((c) => c.pos > alvo.pos).map((c) => cenarioUltrapassagem(c, alvo, TIEBREAK, "chaser")).filter((x): x is Cenario => x != null)
  const alcances = linhas.filter((x) => x.pos < alvo.pos).map((x) => cenarioUltrapassagem(alvo, x, TIEBREAK, "alvo")).filter((x): x is Cenario => x != null)
  const reais = ameacas.filter((c) => c.possivel).length
  return `<section id="t${alvo.pos}">
  <header class="th">
    <div class="pos">${alvo.pos}º</div>
    <div class="nome">${esc(alvo.name)}${(() => { const z = zonaDe(alvo.pos); const m = z ? ZONA_META[z] : null
      return m ? ` <span class="zbadge" style="color:${m.cor};border-color:${m.cor}40;background:${m.cor}14">${esc(m.rotulo)}</span>` : "" })()}<div class="sub">${alvo.points} pts · ${alvo.won}V ${t.drawn}E ${t.lost}D · ${alvo.gf}:${t.ga} (SG ${sg(alvo.gd)}) · ${t.jogados} jogados${alvo.gamesRemaining === 0 ? ' · <b class="froz">JÁ ENCERROU</b>' : ` · restam ${alvo.gamesRemaining}`}</div></div>
    <div class="tally"><span class="sit" style="color:${SIT[an.situacao]!.cor};border-color:${SIT[an.situacao]!.cor}40;background:${SIT[an.situacao]!.cor}12" title="${esc(SIT[an.situacao]!.expl)}">${SIT[an.situacao]!.rot}<i>${an.faixaPossivel.melhor === an.faixaPossivel.pior ? `fixo em ${an.faixaPossivel.melhor}º` : `entre ${an.faixaPossivel.melhor}º e ${an.faixaPossivel.pior}º`}</i></span><span class="tl down">${reais}<i>podem passar</i></span><span class="tl up">${alcances.filter((c) => c.possivel).length}<i>pode passar</i></span></div>
  </header>
  ${blocoCenarios(an, alvo.pos)}
  <div class="cols">
    <div>${coluna("Pode ser ultrapassado", ameacas, "baixo", `Ninguém abaixo alcança ${alvo.points} pts — travado por baixo.`)}</div>
    <div>${coluna("Pode ultrapassar", alcances, "cima", "Não alcança ninguém acima — teto atingido.")}</div>
  </div>
</section>`
}).join("")

const nav = linhas.map((l) => `<a href="#t${l.pos}"><b>${l.pos}</b> ${esc(l.name)}</a>`).join("")

const html = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ultrapassagem — ${esc(LEAGUE)} ${esc(SEASON)}</title>
<style>
:root{--bg:#0b0f14;--fg:#e6edf3;--mut:#8b98a5;--line:#1c2430;--card:#111823;
--pts:#3b82f6;--vit:#a855f7;--sal:#f59e0b;--und:#ef4444;--no:#4b5563}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.55 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.wrap{max-width:1400px;margin:0 auto;padding:24px}
h1{font-size:22px;margin:0 0 4px}
.meta{color:var(--mut);font-size:13px;margin-bottom:18px}
.meta code{background:#0d1420;padding:2px 6px;border-radius:4px;color:#9ecbff}
nav{position:sticky;top:0;z-index:9;background:rgba(11,15,20,.94);backdrop-filter:blur(8px);
border-bottom:1px solid var(--line);padding:10px 0;margin-bottom:20px;display:flex;flex-wrap:wrap;gap:5px}
nav a{color:var(--mut);text-decoration:none;font-size:12px;padding:3px 8px;border:1px solid var(--line);border-radius:20px;white-space:nowrap}
nav a:hover{color:var(--fg);border-color:#2b3746;background:#0f1720}
nav a b{color:#5b6b7d;margin-right:3px}
table.tab{width:100%;border-collapse:collapse;margin-bottom:28px;font-size:13px}
table.tab th{text-align:right;color:var(--mut);font-weight:500;padding:6px 8px;border-bottom:1px solid var(--line)}
table.tab th:nth-child(2){text-align:left}
table.tab td{padding:5px 8px;border-bottom:1px solid #131b26;text-align:right}
table.tab td:nth-child(2){text-align:left}
table.tab tr:hover{background:#0f1720}
table.tab td.zn{text-align:left;font-size:11px;letter-spacing:.2px}
.zdot{display:inline-block;width:3px;height:13px;border-radius:2px;margin-right:8px;vertical-align:-2px}
tr.z-libertadores td:first-child{background:linear-gradient(90deg,#22c55e10,transparent)}
tr.z-libertadores-qualifiers td:first-child{background:linear-gradient(90deg,#38bdf810,transparent)}
tr.z-sudamericana td:first-child{background:linear-gradient(90deg,#eab30810,transparent)}
tr.z-relegation td:first-child{background:linear-gradient(90deg,#ef444414,transparent)}
.legenda{display:flex;flex-wrap:wrap;gap:14px;align-items:center;margin-bottom:10px;font-size:11.5px;color:var(--mut)}
.lg{display:flex;align-items:center;gap:6px}
.lg i{width:9px;height:9px;border-radius:2px;display:inline-block}
.lg.src{color:#4b5563;font-style:italic}
.lg.src code{background:#0d1420;padding:1px 5px;border-radius:3px;font-style:normal}
.zbadge{font-size:10px;font-weight:600;letter-spacing:.3px;padding:2px 8px;border-radius:20px;border:1px solid;vertical-align:3px;margin-left:6px}
section{margin:0 0 34px;border:1px solid var(--line);border-radius:12px;overflow:hidden;background:#0d131c}
.th{display:flex;align-items:center;gap:14px;padding:14px 18px;background:#101823;border-bottom:1px solid var(--line)}
.pos{font-size:26px;font-weight:700;color:#5b6b7d;min-width:52px}
.nome{font-size:18px;font-weight:600;flex:1}
.sub{font-size:12px;color:var(--mut);font-weight:400;margin-top:3px}
.froz{color:#f59e0b}
.tally{display:flex;gap:8px}
.tl{display:flex;flex-direction:column;align-items:center;padding:6px 12px;border-radius:8px;font-size:19px;font-weight:700;line-height:1}
.tl i{font-size:9px;font-style:normal;font-weight:500;text-transform:uppercase;letter-spacing:.5px;margin-top:4px;opacity:.75}
.tl.down{background:#1a1218;color:#f87171}.tl.up{background:#101c17;color:#4ade80}
.sit{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:7px 14px;border-radius:8px;border:1px solid;font-size:10.5px;font-weight:700;letter-spacing:.5px;line-height:1;text-align:center}
.sit i{font-size:9.5px;font-style:normal;font-weight:500;letter-spacing:0;margin-top:5px;opacity:.8}
details.desc{margin-top:10px;border:1px dashed var(--line);border-radius:8px;padding:8px 10px}
details.desc summary{cursor:pointer;font-size:11px;color:#4b5563;letter-spacing:.2px}
details.desc summary:hover{color:var(--mut)}
details.desc[open] summary{margin-bottom:9px}
details.desc .card{opacity:.72}
.cols{display:grid;grid-template-columns:1fr 1fr;gap:0}
.cols>div{padding:14px 18px}
.cols>div:first-child{border-right:1px solid var(--line)}
h3{font-size:12px;text-transform:uppercase;letter-spacing:.6px;color:var(--mut);margin:0 0 10px;font-weight:600}
h3 .c{color:#4b5563;font-weight:400;text-transform:none;letter-spacing:0}
.card{border:1px solid var(--line);border-left-width:3px;border-radius:8px;padding:10px 12px;margin-bottom:9px;background:var(--card)}
.card.pts{border-left-color:var(--pts)}.card.vit{border-left-color:var(--vit)}
.card.sal{border-left-color:var(--sal)}.card.und{border-left-color:var(--und)}
.card.no{border-left-color:var(--no);opacity:.62}
.card p{margin:0 0 8px;font-size:13px}
.top{display:flex;align-items:center;gap:7px;margin-bottom:7px}
.badge{font-size:9.5px;font-weight:700;letter-spacing:.6px;padding:2px 7px;border-radius:4px;background:#1b2532;color:#9ecbff}
.card.vit .badge{color:#d8b4fe}.card.sal .badge{color:#fcd34d}.card.und .badge{color:#fca5a5}
.badge.nope{background:#2a1a1a;color:#f87171}
.dir{margin-left:auto;font-size:10px;color:#4b5563}
.contas{display:flex;flex-wrap:wrap;gap:5px}
.n{font:11px ui-monospace,SFMono-Regular,Menlo,monospace;background:#0a1017;border:1px solid #182231;
border-radius:5px;padding:2px 7px;color:#93a4b5}
.n i{font-style:normal;color:#5b6b7d;margin-right:4px}
.n em{font-style:normal;color:#3d4a59;margin:0 3px}
.n.hi{border-color:#5a4212;background:#1a1408;color:#fcd34d}
.vazio{color:var(--mut);font-size:13px;padding:10px 12px;border:1px dashed var(--line);border-radius:8px}
.cen{padding:14px 18px;background:#0a1017;border-bottom:1px solid var(--line)}
.cenT{border-collapse:collapse;margin-bottom:14px;width:100%;max-width:620px}
.cenT td{padding:7px 12px;border-bottom:1px solid #131b26;font-size:13.5px}
.cenT td.res{font-weight:700;color:#9ecbff;width:120px}
.cenT td.mv{color:var(--mut);font-size:11px;width:70px}
.cenT td.cn{color:#3d4a59;font-size:10.5px;text-align:right}
.cenT b{color:#e6edf3;font-size:15px}
.cenT b.fix{color:#4ade80}
.cenT em{color:#4ade80;font-style:normal;font-size:11px}
.cats{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.cat{border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:#0d131c}
.cat h4{margin:0 0 9px;font-size:10.5px;letter-spacing:.5px;text-transform:uppercase;font-weight:700;display:flex;align-items:center;gap:7px}
.cat h4 .qt{background:#1b2532;color:#93a4b5;border-radius:20px;padding:1px 8px;font-size:10px}
.cat-down h4{color:#f87171}.cat-tie h4{color:#fcd34d}.cat-up h4{color:#4ade80}
.riv{border-top:1px solid #131b26;padding:8px 0}
.riv:first-of-type{border-top:0;padding-top:0}
.rtop{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:4px}
.rn{font-weight:600;font-size:13px}
.cd{font-size:9px;font-weight:700;letter-spacing:.4px;background:#3a1d10;color:#fdba74;padding:2px 7px;border-radius:4px}
.dg{font-size:9px;font-weight:600;background:#2a2410;color:#fcd34d;padding:2px 7px;border-radius:4px}
.expl{font-size:11.5px;color:var(--mut);margin-bottom:6px;line-height:1.45}
.ramos{display:flex;flex-direction:column;gap:3px}
.ramo{font:11px ui-monospace,SFMono-Regular,Menlo,monospace;padding:3px 8px;border-radius:5px;border-left:2px solid}
.ramo i{font-style:normal;color:#8b98a5;margin-right:6px;display:inline-block;min-width:74px}
.ramo b{font-weight:700}
.ramo.bem{background:#0b1611;border-color:#22c55e;color:#86efac}
.ramo.mal{background:#180f10;border-color:#ef4444;color:#fca5a5}
.ramo.gol{background:#171307;border-color:#eab308;color:#fde047}
.mtz{border:1px solid #2b3746;background:#0c141d;border-radius:8px;padding:10px 12px;margin-bottom:12px}
.mtz h4{margin:0 0 9px;font-size:10.5px;letter-spacing:.5px;text-transform:uppercase;font-weight:700;color:#c4b5fd}
.mtz h4 .sub{text-transform:none;letter-spacing:0;font-weight:400;color:#4b5563;margin-left:8px;font-size:10.5px}
table.mt{border-collapse:collapse;font-size:12px}
table.mt th{font-weight:600;color:var(--mut);padding:5px 10px;font-size:10px;line-height:1.35;text-align:center;border-bottom:1px solid var(--line)}
table.mt th.me{text-align:right;color:#9ecbff;font-size:11.5px;border-bottom:0;border-right:1px solid var(--line);padding-right:12px;white-space:nowrap}
table.mt td{padding:6px 12px;text-align:center;font-weight:700;font-size:13px;border-bottom:1px solid #131b26}
table.mt td.fx{color:#86efac;background:#0b1611}
table.mt td.gd{color:#fde047;background:#171307}
.lgm{margin-top:8px;font-size:10.5px;color:#4b5563;display:flex;align-items:center;gap:6px}
.lgm .k{width:9px;height:9px;border-radius:2px;display:inline-block;margin-left:8px}
.lgm .k.fx{background:#0b1611;border:1px solid #22c55e}
.lgm .k.gd{background:#171307;border:1px solid #eab308}
.entre{border:1px solid #2b3746;background:#0c141d;border-radius:8px;padding:10px 12px;margin-bottom:12px}
.entre h4{margin:0 0 8px;font-size:10.5px;letter-spacing:.5px;text-transform:uppercase;font-weight:700;color:#7dd3fc;display:flex;align-items:center;gap:7px}
.entre h4 .qt{background:#1b2532;color:#93a4b5;border-radius:20px;padding:1px 8px;font-size:10px}
.er{border-top:1px solid #131b26;padding:7px 0}
.er:first-of-type{border-top:0;padding-top:0}
.er b{font-size:13px}
.er em{color:#4b5563;font-style:normal;margin:0 5px}
.er .rel{font-size:10.5px;color:#4b5563;margin-left:5px}
.er .ef{font-size:11.5px;color:var(--mut);line-height:1.5;margin-top:3px}
.er .ef b{color:#93a4b5;font-size:11.5px}
@media(max-width:1100px){.cats{grid-template-columns:1fr}}
@media(max-width:900px){.cols{grid-template-columns:1fr}.cols>div:first-child{border-right:0;border-bottom:1px solid var(--line)}}
</style></head><body><div class="wrap">
<h1>Ultrapassagem — ${esc(LEAGUE)} ${esc(SEASON)}</h1>
<div class="meta">Tabela com jogos <b>anteriores a ${esc(CUTOFF)}</b> · desempate da temporada:
<code>${TIEBREAK.join(" → ")}</code> · gerado de <code>lib/ultrapassagem.ts</code>, o mesmo módulo que monta o bloco no prompt.
<br>Cada cartão traz a <b>conta</b> que sustenta o veredito: <code>pts</code> = perseguidor vencendo tudo <em>vs</em> alvo perdendo tudo · <code>V</code> = vitórias no mesmo cenário · <code>gap SG</code> = saldo do alvo − saldo do perseguidor · <code>swing</code> = gols de virada necessários.</div>
<nav>${nav}</nav>
${faixas.length ? `<div class="legenda">${faixas.map((f) => { const m = ZONA_META[f.zona]; return `<span class="lg"><i style="background:${m?.cor ?? "#555"}"></i>${f.de}${f.ate > f.de ? `–${f.ate}` : ""} ${esc(m?.rotulo ?? f.zona)}</span>` }).join("")}<span class="lg src">zonas ingeridas da SportMonks (tabela <code>standing</code>), aplicadas por posição</span></div>` : `<div class="legenda"><span class="lg src">sem zonas ingeridas para esta temporada</span></div>`}
<table class="tab"><thead><tr><th>#</th><th>Time</th><th>P</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th><th>SG</th><th>Restam</th><th style="text-align:left">Zona</th></tr></thead><tbody>
${linhas.map((l) => { const t = acc.get(l.teamId)!; const z = zonaDe(l.pos); const m = z ? ZONA_META[z] : null
  return `<tr class="${z ? `z-${z}` : ""}"><td><span class="zdot" style="background:${m?.cor ?? "transparent"}"></span>${l.pos}</td><td>${esc(l.name)}</td><td><b>${l.points}</b></td><td>${t.jogados}</td><td>${l.won}</td><td>${t.drawn}</td><td>${t.lost}</td><td>${l.gf}</td><td>${t.ga}</td><td>${sg(l.gd)}</td><td>${l.gamesRemaining}</td><td class="zn" style="color:${m?.cor ?? "#3d4a59"}">${m?.rotulo ?? "—"}</td></tr>` }).join("")}
</tbody></table>
${secoes}
</div></body></html>`

const dest = new URL(`./output/ultrapassagem-${LEAGUE}-${SEASON}-${CUTOFF}.html`, import.meta.url)
await Bun.write(dest, html)
console.log(`[html] ${dest.pathname.replace(/^\//, "")}`)
console.log(`  ${linhas.length} times · desempate ${TIEBREAK.join(" → ")}`)
process.exit(0)
