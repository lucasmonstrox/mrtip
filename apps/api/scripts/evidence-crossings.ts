/**
 * EXPERIMENTO MOD-004 — cruzamentos FORTES de evidência, computados em código (estágio 0, zero LLM):
 * (A) ARQUÉTIPO: desempenho do time contra o ESTILO do adversário de hoje (jogos-espelho por posse),
 * (B) MECANISMO: como o time GERA gol × como o adversário SOFRE gol (canal classificado via commentary),
 * (C) DINÂMICA: reação medida a gol sofrido/marcado (Δ de momentum nos 10min seguintes, evento a evento).
 * Valida cada cruzamento contra o placar real e gera um evidencias.html pra inspeção.
 *
 * Run:  bun run scripts/evidence-crossings.ts [matchId ...]   (default: os 3 da rodada 38)
 * Out:  scripts/output/evidence/<stamp>/evidencias.html
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { buildMomentum, type TrendInput } from "../src/modules/leagues/get-match-momentum/momentum"

const DEFAULT_MATCHES = [
  "77a4255a-3e44-4fd9-a133-b13ca0898a91", // West Ham x Leeds
  "60a3d183-588a-47b8-985c-322ce5436927", // Sunderland x Chelsea
  "f0c7743f-3eaf-42ed-805b-d745dc4c4fb9", // Tottenham x Everton
]
const MATCH_IDS = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_MATCHES

type Row = Record<string, unknown>
const rowsOf = (r: unknown): Row[] => ((r as { rows?: Row[] })?.rows ?? (r as Row[])) as Row[]

// ---------------------------------------------------------------------------
// A · ARQUÉTIPO — buckets por posse média do adversário na temporada
// ---------------------------------------------------------------------------
type Arquetipo = "bloco baixo" | "equilibrado" | "dominante"
const bucketOf = (poss: number): Arquetipo => (poss < 47 ? "bloco baixo" : poss > 53 ? "dominante" : "equilibrado")

// ---------------------------------------------------------------------------
// B · MECANISMO — canal do gol classificado pelo texto do commentary
// ---------------------------------------------------------------------------
const CANAIS = ["pênalti", "gol contra", "contra-ataque", "escanteio", "falta", "cruzamento", "de fora da área", "jogada construída"] as const
type Canal = (typeof CANAIS)[number]
function classifyGoal(text: string): Canal {
  const t = text.toLowerCase()
  if (/penalt/.test(t)) return "pênalti"
  if (/own goal/.test(t)) return "gol contra"
  if (/counter/.test(t)) return "contra-ataque"
  if (/corner/.test(t)) return "escanteio"
  if (/free[- ]?kick/.test(t)) return "falta"
  if (/cross|pull[- ]?back|cut[- ]?back/.test(t)) return "cruzamento"
  if (/outside the box|long[- ]range|from distance|from (2[5-9]|3[0-9]) yards/.test(t)) return "de fora da área"
  return "jogada construída"
}

// ---------------------------------------------------------------------------
// Carga da temporada (uma vez por jogo-alvo; jogos FT antes da data-alvo)
// ---------------------------------------------------------------------------
async function loadSeason(targetId: string) {
  const [target] = rowsOf(await db.execute(sql`
    select m.id, m.date, m.season_id, m.home_team_id, m.away_team_id, m.ft_home, m.ft_away, m.ht_home, m.ht_away,
           th.name as home_name, ta.name as away_name
    from match m join team th on th.id = m.home_team_id join team ta on ta.id = m.away_team_id
    where m.id = ${targetId}`))
  if (!target) throw new Error(`match ${targetId} não encontrado`)
  const cutoff = new Date(target.date as string).toISOString().slice(0, 10)
  const ms = rowsOf(await db.execute(sql`
    select id, date, home_team_id, away_team_id, ft_home, ft_away
    from match
    where season_id = ${target.season_id} and status = 'FT' and date < ${cutoff}
    order by date`))
  const ids = ms.map((m) => String(m.id))
  const stats = ids.length
    ? rowsOf(await db.execute(sql`
        select match_id, team_id, possession from match_team_stats
        where match_id in ${sql.raw(`('${ids.join("','")}')`)}`))
    : []
  const goals = ids.length
    ? rowsOf(await db.execute(sql`
        select g.match_id, g.team_id, g.player_id, g.minute, g.type, c.comment
        from goal g
        left join commentary c on c.match_id = g.match_id and c.is_goal = true and c.minute = g.minute
        where g.match_id in ${sql.raw(`('${ids.join("','")}')`)}`))
    : []
  const teams = new Map(rowsOf(await db.execute(sql`select id, name from team`)).map((t) => [String(t.id), String(t.name)]))
  return { target, ms, stats, goals, teams }
}

// ---------------------------------------------------------------------------
// A · Arquétipo: perfil de posse por time + desempenho contra cada arquétipo
// ---------------------------------------------------------------------------
function arquetipoPanel(season: Awaited<ReturnType<typeof loadSeason>>, teamId: string, oppId: string) {
  // posse média season de cada time
  const possSum = new Map<string, { s: number; n: number }>()
  for (const st of season.stats) {
    const p = Number(st.possession)
    if (!Number.isFinite(p) || p <= 0) continue
    const cur = possSum.get(String(st.team_id)) ?? { s: 0, n: 0 }
    cur.s += p
    cur.n += 1
    possSum.set(String(st.team_id), cur)
  }
  const possAvg = (id: string) => {
    const c = possSum.get(id)
    return c && c.n ? c.s / c.n : null
  }
  // desempenho do time contra cada arquétipo
  const acc = new Map<Arquetipo, { j: number; gf: number; ga: number; opps: string[] }>()
  let totJ = 0, totGf = 0, totGa = 0
  for (const m of season.ms) {
    const isHome = String(m.home_team_id) === teamId
    const isAway = String(m.away_team_id) === teamId
    if (!isHome && !isAway) continue
    const opp = String(isHome ? m.away_team_id : m.home_team_id)
    const oppPoss = possAvg(opp)
    if (oppPoss == null) continue
    const b = bucketOf(oppPoss)
    const gf = Number(isHome ? m.ft_home : m.ft_away)
    const ga = Number(isHome ? m.ft_away : m.ft_home)
    const cur = acc.get(b) ?? { j: 0, gf: 0, ga: 0, opps: [] }
    cur.j += 1
    cur.gf += gf
    cur.ga += ga
    const nm = season.teams.get(opp) ?? opp
    if (!cur.opps.includes(nm)) cur.opps.push(nm)
    acc.set(b, cur)
    totJ += 1
    totGf += gf
    totGa += ga
  }
  const oppPossToday = possAvg(oppId)
  const oppBucket = oppPossToday != null ? bucketOf(oppPossToday) : null
  return { acc, media: { j: totJ, gf: totGf, ga: totGa }, oppPossToday, oppBucket }
}

// ---------------------------------------------------------------------------
// B · Mecanismo: matriz gera × sofre por canal (com baseline da liga)
// ---------------------------------------------------------------------------
function mecanismoPanel(season: Awaited<ReturnType<typeof loadSeason>>, teamId: string) {
  const matchesOf = new Set(
    season.ms.filter((m) => String(m.home_team_id) === teamId || String(m.away_team_id) === teamId).map((m) => String(m.id)),
  )
  const gera = new Map<Canal, number>()
  const sofre = new Map<Canal, number>()
  let geraTot = 0, sofreTot = 0, semTexto = 0
  for (const g of season.goals) {
    if (!matchesOf.has(String(g.match_id))) continue
    const mine = String(g.team_id) === teamId
    if (!g.comment) { semTexto += 1; continue }
    const canal = classifyGoal(String(g.comment))
    if (mine) { gera.set(canal, (gera.get(canal) ?? 0) + 1); geraTot += 1 }
    else { sofre.set(canal, (sofre.get(canal) ?? 0) + 1); sofreTot += 1 }
  }
  return { gera, sofre, geraTot, sofreTot, semTexto }
}
function ligaShare(season: Awaited<ReturnType<typeof loadSeason>>) {
  const cnt = new Map<Canal, number>()
  let tot = 0
  for (const g of season.goals) {
    if (!g.comment) continue
    const c = classifyGoal(String(g.comment))
    cnt.set(c, (cnt.get(c) ?? 0) + 1)
    tot += 1
  }
  return { cnt, tot }
}

// ---------------------------------------------------------------------------
// C · Dinâmica: Δ de momentum nos 10' após cada gol (sofrido e marcado)
// ---------------------------------------------------------------------------
type Reacao = { opp: string; venue: "casa" | "fora"; minute: number; kind: "sofreu" | "marcou"; antes: number; depois: number; delta: number }
async function reacaoPanel(season: Awaited<ReturnType<typeof loadSeason>>, teamId: string): Promise<Reacao[]> {
  const my = season.ms.filter((m) => String(m.home_team_id) === teamId || String(m.away_team_id) === teamId).slice(-8)
  const ids = my.map((m) => String(m.id))
  if (!ids.length) return []
  const trends = rowsOf(await db.execute(sql`
    select match_id, team_id, type_id, period_id, minute, value from match_trend
    where match_id in ${sql.raw(`('${ids.join("','")}')`)}`))
  const byMatch = new Map<string, TrendInput[]>()
  for (const t of trends) {
    const arr = byMatch.get(String(t.match_id)) ?? []
    arr.push({ teamId: String(t.team_id), typeId: Number(t.type_id), periodId: Number(t.period_id), minute: Number(t.minute), value: Number(t.value) })
    byMatch.set(String(t.match_id), arr)
  }
  const out: Reacao[] = []
  for (const m of my) {
    const tr = byMatch.get(String(m.id))
    if (!tr?.length) continue
    const curve = buildMomentum(tr, String(m.home_team_id), String(m.away_team_id))
    if (!curve.length) continue
    const isHome = String(m.home_team_id) === teamId
    // net por minuto na ótica do time (carry-forward, mesmo approach do prognosis-prompt)
    const maxMin = Math.max(...curve.map((p) => p.minute))
    const netAt = new Map<number, number>()
    for (const p of curve) netAt.set(p.minute, isHome ? p.home - p.away : p.away - p.home)
    const net: number[] = []
    let last = 0
    for (let mm = 1; mm <= maxMin; mm++) {
      const v = netAt.get(mm)
      if (v !== undefined) last = v
      net.push(last)
    }
    const avg = (a: number, b: number) => {
      const lo = Math.max(1, a), hi = Math.min(maxMin, b)
      if (hi < lo) return 0
      let s = 0
      for (let mm = lo; mm <= hi; mm++) s += net[mm - 1]!
      return s / (hi - lo + 1)
    }
    const goalsIn = season.goals.filter((g) => String(g.match_id) === String(m.id))
    for (const g of goalsIn) {
      const minute = Number(g.minute)
      if (!Number.isFinite(minute) || minute >= maxMin - 1) continue // gol no apagar: sem janela "depois"
      const kind = String(g.team_id) === teamId ? "marcou" : "sofreu"
      const antes = avg(minute - 5, minute - 1)
      const depois = avg(minute + 1, minute + 10)
      const oppId = String(isHome ? m.away_team_id : m.home_team_id)
      out.push({
        opp: season.teams.get(oppId) ?? oppId, venue: isHome ? "casa" : "fora", minute, kind,
        antes: +antes.toFixed(1), depois: +depois.toFixed(1), delta: +(depois - antes).toFixed(1),
      })
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// D · Expectativa por jogador — bottom-up: taxa individual (SoT/90 e conversão
// encolhida pra média da liga) × minutos esperados do provável XI × fator
// defensivo do rival → xSoT e xGols POR JOGADOR, somados num λ de time que
// cruza com a rota top-down (gols/j). Desfalcados saem do XI: é a tese do
// desfalque virando número. λ do XI NÃO é corrigido pelo banco de propósito —
// o gap entre λ-XI e top-down é o sinal (dependência/desfalque), não um erro.
// ---------------------------------------------------------------------------
const CONV_PRIOR_SOT = 6 // encolhimento: peso (em SoT) da média da liga na conversão individual
const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x))
// Encolhe um ratio pra 1 conforme a amostra: com pouca evidência o fator quase não mexe.
const shrinkRatio = (ratio: number, weight: number, lo: number, hi: number) =>
  clamp(1 + Math.min(1, weight) * (ratio - 1), lo, hi)

type Factor = { k: string; v: number; ev: string }
type ExpPlayer = {
  nome: string; pos: string | null; j: number; min: number; expMin: number
  sot90: number; kp90: number; gols: number; pens: number; conv: number
  fatores: Factor[]; xSot: number; xG: number; xKp: number; pMarca: number; pSot1: number
}
type ExpPanel = {
  xi: ExpPlayer[]; lambdaXi: number; cobertura: number; oppFactor: number
  topDown: number; ligaConv: number; ligaSotAvg: number; injured: string[]
  oppBucket: Arquetipo | null; defInjEv: string | null
  banco: string[] // relevantes FORA do XI-por-minutagem-recente (rotação/banco) — auditoria 2026-07-03
  candidatos: string[] // lista COMPUTADA de candidatos a marcador (XI por P(marca) + estruturais + banco) — 2ª auditoria
}
async function expectativaPanel(
  season: Awaited<ReturnType<typeof loadSeason>>, teamId: string, oppId: string, targetId: string,
  oppSetor: SetorTeam | null = null, // setores do RIVAL (MOD-007) — blindado/em queda vira fator por jogador
): Promise<ExpPanel | null> {
  const myMs = season.ms.filter((m) => String(m.home_team_id) === teamId || String(m.away_team_id) === teamId)
  const ids = myMs.map((m) => String(m.id))
  if (ids.length < 5) return null
  const last5 = new Set(ids.slice(-5))
  const isHomeTarget = String(season.target.home_team_id) === teamId
  // meta por jogo do time: mando + arquétipo do adversário daquele jogo (pra fazer os splits)
  const possSum = new Map<string, { s: number; n: number }>()
  for (const st of season.stats) {
    const p = Number(st.possession)
    if (!Number.isFinite(p) || p <= 0) continue
    const cur = possSum.get(String(st.team_id)) ?? { s: 0, n: 0 }
    cur.s += p; cur.n += 1
    possSum.set(String(st.team_id), cur)
  }
  const possAvg = (id: string) => { const c = possSum.get(id); return c && c.n ? c.s / c.n : null }
  const oppPoss = possAvg(oppId)
  const oppBucket: Arquetipo | null = oppPoss != null ? bucketOf(oppPoss) : null
  const matchMeta = new Map<string, { isHome: boolean; sameBucket: boolean }>()
  for (const m of myMs) {
    const home = String(m.home_team_id) === teamId
    const thatOpp = String(home ? m.away_team_id : m.home_team_id)
    const p = possAvg(thatOpp)
    matchMeta.set(String(m.id), { isHome: home, sameBucket: oppBucket != null && p != null && bucketOf(p) === oppBucket })
  }

  // Baselines da liga: SoT médio por time/jogo + conversão média (gols sem gol-contra / SoT total)
  const allIds = season.ms.map((m) => String(m.id))
  const ts = allIds.length
    ? rowsOf(await db.execute(sql`
        select match_id, team_id, shots_on_target from match_team_stats
        where match_id in ${sql.raw(`('${allIds.join("','")}')`)} and shots_on_target is not null`))
    : []
  const ligaSotAvg = ts.length ? ts.reduce((s, r) => s + Number(r.shots_on_target), 0) / ts.length : 0
  const ligaGols = season.goals.filter((g) => String(g.type) !== "own-goal").length
  const ligaSotTot = ts.reduce((s, r) => s + Number(r.shots_on_target), 0)
  const ligaConv = ligaSotTot ? ligaGols / ligaSotTot : 0.3
  if (!ligaSotAvg || !ligaConv) return null

  // Fator 1 — volume que o rival CEDE: SoT concedido/jogo vs média da liga
  const oppIds = new Set(
    season.ms.filter((m) => String(m.home_team_id) === oppId || String(m.away_team_id) === oppId).map((m) => String(m.id)),
  )
  const conceded = ts.filter((r) => oppIds.has(String(r.match_id)) && String(r.team_id) !== oppId)
  const concededAvg = conceded.length ? conceded.reduce((s, r) => s + Number(r.shots_on_target), 0) / conceded.length : ligaSotAvg
  const oppFactor = clamp(concededAvg / ligaSotAvg, 0.75, 1.25)

  // Fator 2 (insumo) — canais onde o rival SANGRA vs baseline da liga (mecanismo já classificado)
  const oppMec = mecanismoPanel(season, oppId)
  const liga = ligaShare(season)
  const oppCanalRatio = (c: Canal) => {
    const lg = liga.tot ? (liga.cnt.get(c) ?? 0) / liga.tot : 0
    if (!lg || !oppMec.sofreTot) return 1
    return clamp(((oppMec.sofre.get(c) ?? 0) / oppMec.sofreTot) / lg, 0.5, 2)
  }

  // Fator 3 (insumo) — desfalque DEFENSIVO do rival: volume de desarme+interceptação que sai de campo
  const oppInj = rowsOf(await db.execute(sql`
    select i.player_id, p.name from injury i join player p on p.id = i.player_id
    where i.match_id = ${targetId} and i.team_id = ${oppId}`))
  let defInjFactor = 1, defInjEv: string | null = null
  if (oppInj.length && oppIds.size) {
    const oppDef = rowsOf(await db.execute(sql`
      select lp.player_id, sum(coalesce(lp.tackles,0) + coalesce(lp.interceptions,0)) as defacts
      from lineup l join lineup_player lp on lp.lineup_id = l.id
      where l.team_id = ${oppId} and l.match_id in ${sql.raw(`('${[...oppIds].join("','")}')`)}
      group by lp.player_id`))
    const totDef = oppDef.reduce((s, r) => s + Number(r.defacts), 0)
    const injIds = new Set(oppInj.map((r) => String(r.player_id)))
    const injDef = oppDef.filter((r) => injIds.has(String(r.player_id))).reduce((s, r) => s + Number(r.defacts), 0)
    if (totDef > 0 && injDef > 0) {
      const share = injDef / totDef
      defInjFactor = clamp(1 + share * 0.4, 1, 1.12)
      defInjEv = `rival perde ${(share * 100).toFixed(0)}% do volume defensivo (desarme+interceptação) com ${oppInj.map((r) => String(r.name)).join(", ")} fora`
    }
  }

  // Por jogador: agregados season + splits (vs arquétipo do rival de HOJE, mesmo mando, forma por rating)
  const lps = rowsOf(await db.execute(sql`
    select lp.player_id, p.name, lp.position, lp.role, lp.minutes_played, lp.shots_on_target, lp.key_passes, lp.rating, l.match_id
    from lineup l join lineup_player lp on lp.lineup_id = l.id join player p on p.id = lp.player_id
    where l.team_id = ${teamId} and l.match_id in ${sql.raw(`('${ids.join("','")}')`)}`))
  type Acc = {
    nome: string; pos: string | null; j: number; min: number; sot: number; kp: number
    l5min: number; l5j: number; bMin: number; bSot: number; vMin: number; vSot: number
    ratings: { matchId: string; r: number }[]
    roleMin: Map<string, number> // minutos por papel (lineup_player.role) — corredor dominante (MOD-007)
  }
  const acc = new Map<string, Acc>()
  const orderIdx = new Map(ids.map((id, i) => [id, i]))
  for (const r of lps) {
    const min = Number(r.minutes_played ?? 0)
    if (min <= 0) continue
    const cur = acc.get(String(r.player_id)) ?? {
      nome: String(r.name), pos: null, j: 0, min: 0, sot: 0, kp: 0, l5min: 0, l5j: 0,
      bMin: 0, bSot: 0, vMin: 0, vSot: 0, ratings: [], roleMin: new Map<string, number>(),
    }
    const meta = matchMeta.get(String(r.match_id))
    cur.pos = (r.position as string | null) ?? cur.pos
    if (r.role) cur.roleMin.set(String(r.role), (cur.roleMin.get(String(r.role)) ?? 0) + min)
    cur.j += 1
    cur.min += min
    cur.sot += Number(r.shots_on_target ?? 0)
    cur.kp += Number(r.key_passes ?? 0)
    if (last5.has(String(r.match_id))) { cur.l5min += min; cur.l5j += 1 }
    if (meta?.sameBucket) { cur.bMin += min; cur.bSot += Number(r.shots_on_target ?? 0) }
    if (meta && meta.isHome === isHomeTarget) { cur.vMin += min; cur.vSot += Number(r.shots_on_target ?? 0) }
    if (r.rating != null) cur.ratings.push({ matchId: String(r.match_id), r: Number(r.rating) })
    acc.set(String(r.player_id), cur)
  }

  // Gols por jogador: total, pênaltis e CANAL do gol (via commentary — cruza com onde o rival sangra)
  const golsBy = new Map<string, { g: number; p: number; canais: Map<Canal, number>; canaisTot: number }>()
  const idSet = new Set(ids)
  let teamGols = 0
  for (const g of season.goals) {
    if (!idSet.has(String(g.match_id)) || String(g.team_id) !== teamId) continue
    if (String(g.type) === "own-goal" || g.player_id == null) continue
    const cur = golsBy.get(String(g.player_id)) ?? { g: 0, p: 0, canais: new Map<Canal, number>(), canaisTot: 0 }
    cur.g += 1
    if (String(g.type) === "penalty") cur.p += 1
    if (g.comment) {
      const c = classifyGoal(String(g.comment))
      cur.canais.set(c, (cur.canais.get(c) ?? 0) + 1)
      cur.canaisTot += 1
    }
    golsBy.set(String(g.player_id), cur)
    teamGols += 1
  }

  // Desfalques do próprio time saem do XI (tese do desfalque)
  const injRows = rowsOf(await db.execute(sql`
    select i.player_id, p.name from injury i join player p on p.id = i.player_id
    where i.match_id = ${targetId} and i.team_id = ${teamId}`))
  const injuredIds = new Set(injRows.map((r) => String(r.player_id)))
  const injured = injRows.map((r) => String(r.name))

  // XI provável: disponíveis por minutagem recente (desempate: minutagem season)
  const xiIds = [...acc.entries()]
    .filter(([id]) => !injuredIds.has(id))
    .sort((a, b) => b[1].l5min - a[1].l5min || b[1].min - a[1].min)
    .slice(0, 11)

  let lambdaXi = 0, golsXi = 0
  const xi: ExpPlayer[] = xiIds.map(([id, a]) => {
    const g = golsBy.get(id) ?? { g: 0, p: 0, canais: new Map<Canal, number>(), canaisTot: 0 }
    const expMin = Math.min(90, a.l5j ? a.l5min / a.l5j : a.min / a.j)
    const sot90 = (a.sot / a.min) * 90
    const kp90 = (a.kp / a.min) * 90
    const conv = (g.g + CONV_PRIOR_SOT * ligaConv) / (a.sot + CONV_PRIOR_SOT)
    const fatores: Factor[] = []

    // f_arq — como ELE produz contra o arquétipo do rival de hoje (SoT/90 no split vs geral, encolhido por minutos)
    let fArq = 1
    if (oppBucket && a.bMin >= 90 && sot90 > 0) {
      const splitRate = (a.bSot / a.bMin) * 90
      fArq = shrinkRatio(splitRate / sot90, a.bMin / 450, 0.75, 1.25)
      if (Math.abs(fArq - 1) > 0.03)
        fatores.push({ k: "arquétipo", v: fArq, ev: `${f2(splitRate)} SoT/90 contra ${oppBucket} (${Math.round(a.bMin)}min) vs ${f2(sot90)} geral` })
    }
    // f_venue — produção no MESMO mando do jogo-alvo
    let fVen = 1
    if (a.vMin >= 90 && sot90 > 0) {
      const vRate = (a.vSot / a.vMin) * 90
      fVen = shrinkRatio(vRate / sot90, a.vMin / 450, 0.85, 1.15)
      if (Math.abs(fVen - 1) > 0.03)
        fatores.push({ k: isHomeTarget ? "casa" : "fora", v: fVen, ev: `${f2(vRate)} SoT/90 ${isHomeTarget ? "em casa" : "fora"} vs ${f2(sot90)} geral` })
    }
    // f_forma — curva de rating: últimos 3 notados vs média season
    let fForma = 1
    if (a.ratings.length >= 5) {
      const sorted = [...a.ratings].sort((x, y) => (orderIdx.get(x.matchId) ?? 0) - (orderIdx.get(y.matchId) ?? 0))
      const seasonAvg = sorted.reduce((s, x) => s + x.r, 0) / sorted.length
      const l3 = sorted.slice(-3)
      const l3Avg = l3.reduce((s, x) => s + x.r, 0) / l3.length
      fForma = clamp(1 + ((l3Avg / seasonAvg) - 1) * 1.5, 0.9, 1.1)
      if (Math.abs(fForma - 1) > 0.02)
        fatores.push({ k: "forma", v: fForma, ev: `rating últ.3 ${f1(l3Avg)} vs season ${f1(seasonAvg)}` })
    }
    // f_canal — canais dos gols DELE × canais onde o rival sangra (só mexe na conversão em xG)
    let fCanal = 1
    if (g.canaisTot >= 2 && oppMec.sofreTot >= 5) {
      let acc2 = 0
      const evParts: string[] = []
      for (const [c, n] of g.canais) {
        const share = n / g.canaisTot
        const ratio = oppCanalRatio(c)
        acc2 += share * ratio
        if (Math.abs(ratio - 1) > 0.25 && share >= 0.25)
          evParts.push(`${(share * 100).toFixed(0)}% dos gols dele: ${c} — rival sofre ${f1(ratio)}× a liga aí`)
      }
      fCanal = shrinkRatio(acc2, g.canaisTot / 5, 0.8, 1.3)
      if (Math.abs(fCanal - 1) > 0.03 && evParts.length)
        fatores.push({ k: "canal", v: fCanal, ev: evParts.join("; ") })
    }
    // f_setor (MOD-007) — corredor dominante do jogador (via role) × forma de quem defende o
    // corredor espelhado do rival: blindado desconta, em queda amplifica. Papel central fica fora.
    let fSetor = 1
    if (oppSetor) {
      const roleDom = [...a.roleMin.entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ?? ""
      const lado = roleDom.includes("esquerd") ? "esquerda" : roleDom.includes("direit") ? "direita" : null
      if (lado) {
        const oppLado = lado === "esquerda" ? "direita" : "esquerda"
        const forma = setorForma(oppSetor.defesa.get(oppLado) ?? [])
        if (forma.blindado) {
          fSetor = 0.9
          fatores.push({ k: "setor", v: fSetor, ev: `corredor ${oppLado} do rival BLINDADO — ${forma.ev}` })
        } else if (forma.emQueda) {
          fSetor = 1.08
          fatores.push({ k: "setor", v: fSetor, ev: `corredor ${oppLado} do rival em queda — ${forma.ev}` })
        }
      }
    }
    // f_volume rival + desfalque defensivo do rival (globais, mas exibidos por jogador quando relevantes)
    if (Math.abs(oppFactor - 1) > 0.03) fatores.push({ k: "volume cedido", v: oppFactor, ev: `rival cede ${f2(concededAvg)} SoT/j vs liga ${f2(ligaSotAvg)}` })
    if (defInjFactor > 1.01 && defInjEv) fatores.push({ k: "desfalque def. rival", v: defInjFactor, ev: defInjEv })

    const xSot = sot90 * (expMin / 90) * oppFactor * fArq * fVen * fForma * defInjFactor * fSetor
    const xG = xSot * conv * fCanal
    const xKp = kp90 * (expMin / 90) * oppFactor * fVen * defInjFactor * fSetor
    const pMarca = 1 - Math.exp(-xG)
    const pSot1 = 1 - Math.exp(-xSot)
    lambdaXi += xG
    golsXi += g.g
    return { nome: a.nome, pos: a.pos, j: a.j, min: a.min, expMin, sot90, kp90, gols: g.g, pens: g.p, conv, fatores, xSot, xG, xKp, pMarca, pSot1 }
  })
  xi.sort((a, b) => b.xG - a.xG)

  // BANCO QUENTE (fix da auditoria 2026-07-03): o XI-por-minutagem-recente derruba quem foi rodado no fim
  // da season (João Pedro ficou fora e era o artilheiro titular) e ignora o finalizador de banco (Callum
  // Wilson marcou sem existir no universo do modelo). Quem tem produção relevante na season (4+ gols OU
  // minutagem de top-11) e NÃO está lesionado continua VIVO — entra como linha de risco, não some.
  const xiSet = new Set(xiIds.map(([id]) => id))
  const minCut = [...acc.values()].map((a) => a.min).sort((x, y) => y - x)[10] ?? 0
  const bancoEntries = [...acc.entries()]
    .filter(([id, a]) => !xiSet.has(id) && !injuredIds.has(id) && ((golsBy.get(id)?.g ?? 0) >= 4 || (minCut > 0 && a.min >= minCut)))
    .sort((a, b) => (golsBy.get(b[0])?.g ?? 0) - (golsBy.get(a[0])?.g ?? 0) || b[1].min - a[1].min)
    .slice(0, 3)
  const banco = bancoEntries.map(([id, a]) => {
    const g = golsBy.get(id)?.g ?? 0
    return `**${a.nome}** (${g} gol${g === 1 ? "" : "s"} na season · ${Math.round(a.min)}min season vs ${Math.round(a.l5min)}min últ.5 — fora do XI por minutagem RECENTE, não por lesão)`
  })

  // CANDIDATOS A MARCADOR COMPUTADOS (2ª auditoria 2026-07-03): a lista que o Passo 4c do super CONSOME
  // em vez de montar do zero — o modelo resistia a promover banco (Callum Wilson marcou invisível 2x) e
  // estrutural (Palhinha lido e descartado pelo xG/chute) por instrução; agora o código entrega pronto.
  // Composição: top do XI por P(marca) + artilheiro ESTRUTURAL do XI (defesa/meio com 3+ gols — bola
  // parada/2ª bola que o per-shot esconde) + banco com 4+ gols (P(marca) estimada em ~30min de sub).
  const structuralSet = new Set(xi.filter((p) => (p.pos === "D" || p.pos === "M") && p.gols >= 3).map((p) => p.nome))
  const candidatos = xi
    .slice()
    .sort((a, b) => b.pMarca - a.pMarca)
    .filter((p, i) => i < 6 || structuralSet.has(p.nome)) // top-6 + estruturais mesmo fora do top
    .map((p) => `${p.nome} **${(p.pMarca * 100).toFixed(0)}%**${structuralSet.has(p.nome) ? " ⚑estrutural (defesa/meio com gols — bola parada/2ª bola; NÃO rebaixe pelo xG por chute)" : ""}`)
  for (const [id, a] of bancoEntries) {
    const g = golsBy.get(id)?.g ?? 0
    if (g >= 4 && a.min > 0) {
      const rate90 = g / (a.min / 90)
      const p30 = 1 - Math.exp(-rate90 / 3) // ~30min de sub
      candidatos.push(`${a.nome} **${(p30 * 100).toFixed(0)}%** 🔁banco (~30min de sub · ${g} gols na season — jogo aberto no fim é o cenário dele)`)
    }
  }

  const topDown = teamGols / ids.length // gols/j do time (mesma amostra season)
  const cobertura = teamGols ? golsXi / teamGols : 0
  return { xi, lambdaXi, cobertura, oppFactor, topDown, ligaConv, ligaSotAvg, injured, oppBucket, defInjEv, banco, candidatos }
}

// ---------------------------------------------------------------------------
// E · Setores — onde o jogo se ganha, em dois eixos computados do lineup real:
// (1) vertical: formação provável (moda dos últ.5) → contagem de homens por linha
//     e veredito do miolo (pivô × pivô — o matchup decisivo da matriz tática);
// (2) horizontal: grid (coluna = esquerda→direita) → produção de criação (KP +
//     cruzamentos certos) por corredor, cruzada com o LADO defensivo do rival
//     (nota média dos defensores daquele corredor + desfalque) → "corredor aberto".
// ---------------------------------------------------------------------------
type Corredor = "esquerda" | "centro" | "direita"
type DefCorredor = {
  nome: string; nota: number | null; min: number; inj: boolean
  motm: number // man_of_match na season — @feature MOD-007
  tendencia: number | null // média de nota últ.3 − média season (curva de forma) — @feature MOD-007
}
type SetorTeam = {
  form: string | null
  criacao: Map<Corredor, number>
  criadores: Map<Corredor, { nome: string; v: number }[]>
  defesa: Map<"esquerda" | "direita", DefCorredor[]>
}

// Forma de quem HABITA o corredor (MOD-007 · setor blindado): MOTM recorrente ou nota alta em
// alta BLINDA o setor (suprime "corredor aberto"); tendência negativa amplifica. Sinal novo é
// só MOTM + curva — a nota MÉDIA já entra no veredito base (anti-dupla-contagem).
function setorForma(defs: DefCorredor[]): { blindado: boolean; emQueda: boolean; ev: string | null } {
  // Desfalcado não blinda nem "cai": avalia o corredor como ele estará NO jogo-alvo.
  const d0 = defs.find((d) => !d.inj)
  if (!d0) return { blindado: false, emQueda: false, ev: null }
  const tend = d0.tendencia ?? 0
  const tendTxt = d0.tendencia == null ? "s/d" : `${tend >= 0 ? "+" : ""}${tend.toFixed(1)}`
  const blindado = d0.motm >= 2 || (d0.nota != null && d0.nota >= 7.2 && tend >= 0.2)
  const emQueda = !blindado && d0.tendencia != null && tend <= -0.4
  const ev = blindado
    ? `${d0.nome}: ${d0.motm} MOTM na season${d0.nota != null ? `, nota ${d0.nota.toFixed(1)} últ.5` : ""}, tendência ${tendTxt}`
    : emQueda
      ? `${d0.nome}: tendência ${tendTxt} (nota últ.3 vs season)`
      : null
  return { blindado, emQueda, ev }
}
async function setorTeam(
  season: Awaited<ReturnType<typeof loadSeason>>, teamId: string, targetId: string,
): Promise<SetorTeam | null> {
  const ids = season.ms
    .filter((m) => String(m.home_team_id) === teamId || String(m.away_team_id) === teamId)
    .map((m) => String(m.id))
  if (ids.length < 5) return null
  const last5 = new Set(ids.slice(-5))
  const rows = rowsOf(await db.execute(sql`
    select l.id as lid, l.match_id, l.formation, lp.player_id, p.name, lp.position, lp.grid, lp.starter,
           lp.minutes_played, lp.key_passes, lp.crosses_accurate, lp.rating, lp.man_of_match
    from lineup l join lineup_player lp on lp.lineup_id = l.id join player p on p.id = lp.player_id
    where l.team_id = ${teamId} and l.match_id in ${sql.raw(`('${ids.join("','")}')`)}`))
  const injured = new Set(rowsOf(await db.execute(sql`
    select player_id from injury where match_id = ${targetId} and team_id = ${teamId}`)).map((r) => String(r.player_id)))

  // Formação provável: moda nos últimos 5 (1 voto por lineup)
  const formByLineup = new Map<string, string>()
  for (const r of rows) if (r.formation && last5.has(String(r.match_id))) formByLineup.set(String(r.lid), String(r.formation))
  const formCount = new Map<string, number>()
  for (const f of formByLineup.values()) formCount.set(f, (formCount.get(f) ?? 0) + 1)
  const form = [...formCount.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

  // Tamanho de cada linha do grid por lineup (pra normalizar a coluna em corredor)
  const lineMax = new Map<string, number>() // `${lid}:${line}` -> max col
  for (const r of rows) {
    if (!r.starter || !r.grid) continue
    const [ln, col] = String(r.grid).split(":").map(Number)
    if (!ln || !col) continue
    const k = `${r.lid}:${ln}`
    lineMax.set(k, Math.max(lineMax.get(k) ?? 0, col))
  }
  // Orientação do grid espelha por mando (verificado no banco: Porro/RB = 2:1 em casa,
  // 2:4 fora): MANDANTE col 1 = direita; VISITANTE col 1 = esquerda.
  const homeByMatch = new Map(season.ms.map((m) => [String(m.id), String(m.home_team_id) === teamId]))
  const sideOf = (lid: string, matchId: string, grid: string | null): Corredor | null => {
    if (!grid) return null
    const [ln, col] = String(grid).split(":").map(Number)
    if (!ln || !col) return null
    const n = lineMax.get(`${lid}:${ln}`) ?? 0
    if (n <= 1) return "centro"
    const pos = (col - 0.5) / n
    const raw = pos <= 1 / 3 ? "esquerda" : pos >= 2 / 3 ? "direita" : "centro"
    if (raw === "centro") return raw
    return homeByMatch.get(matchId) ? (raw === "esquerda" ? "direita" : "esquerda") : raw
  }

  // Produção de criação por corredor + defensores por lado (nota últ.5)
  const criacao = new Map<Corredor, number>()
  const porJogador = new Map<string, { nome: string; side: Map<Corredor, number> }>()
  // sideMin: minutos por lado — o corredor do defensor é o lado DOMINANTE, não o último row lido.
  const defAgg = new Map<string, { nome: string; sideMin: Map<"esquerda" | "direita", number>; notas: number[]; min: number }>()
  // Forma SEASON por jogador (pro MOD-007): notas na ordem dos jogos + MOTM count.
  const orderIdx = new Map(ids.map((id, i) => [id, i]))
  const formaSeason = new Map<string, { notas: { i: number; r: number }[]; motm: number }>()
  for (const r of rows) {
    const min = Number(r.minutes_played ?? 0)
    if (min <= 0 || !r.starter) continue
    const fs = formaSeason.get(String(r.player_id)) ?? { notas: [], motm: 0 }
    if (r.rating != null) fs.notas.push({ i: orderIdx.get(String(r.match_id)) ?? 0, r: Number(r.rating) })
    if (r.man_of_match === true) fs.motm += 1
    formaSeason.set(String(r.player_id), fs)
    const side = sideOf(String(r.lid), String(r.match_id), r.grid as string | null)
    if (!side) continue
    const cri = Number(r.key_passes ?? 0) + Number(r.crosses_accurate ?? 0)
    criacao.set(side, (criacao.get(side) ?? 0) + cri)
    const pj = porJogador.get(String(r.player_id)) ?? { nome: String(r.name), side: new Map<Corredor, number>() }
    pj.side.set(side, (pj.side.get(side) ?? 0) + cri)
    porJogador.set(String(r.player_id), pj)
    if (String(r.position) === "D" && side !== "centro" && last5.has(String(r.match_id))) {
      const d = defAgg.get(String(r.player_id)) ?? { nome: String(r.name), sideMin: new Map<"esquerda" | "direita", number>(), notas: [], min: 0 }
      d.sideMin.set(side, (d.sideMin.get(side) ?? 0) + min)
      d.min += min
      if (r.rating != null) d.notas.push(Number(r.rating))
      defAgg.set(String(r.player_id), d)
    }
  }
  const criadores = new Map<Corredor, { nome: string; v: number }[]>()
  for (const c of ["esquerda", "centro", "direita"] as Corredor[]) {
    const list = [...porJogador.entries()]
      .map(([id, p]) => ({ id, nome: p.nome, v: p.side.get(c) ?? 0 }))
      .filter((p) => p.v > 0)
      .sort((a, b) => b.v - a.v)
      .slice(0, 2)
    criadores.set(c, list)
  }
  const defesa = new Map<"esquerda" | "direita", DefCorredor[]>()
  for (const s of ["esquerda", "direita"] as const) {
    defesa.set(s, [...defAgg.entries()]
      .filter(([, d]) => ([...d.sideMin.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]) === s)
      .map(([id, d]) => {
        const fs = formaSeason.get(id)
        const ordered = fs ? [...fs.notas].sort((a, b) => a.i - b.i) : []
        const avg = (xs: { r: number }[]) => (xs.length ? xs.reduce((a, x) => a + x.r, 0) / xs.length : null)
        const seasonAvg = avg(ordered)
        const l3Avg = avg(ordered.slice(-3))
        return {
          nome: d.nome,
          nota: d.notas.length ? d.notas.reduce((a, b) => a + b, 0) / d.notas.length : null,
          min: d.min,
          inj: injured.has(id),
          motm: fs?.motm ?? 0,
          tendencia: seasonAvg != null && l3Avg != null && ordered.length >= 5 ? l3Avg - seasonAvg : null,
        }
      })
      .sort((a, b) => b.min - a.min)
      .slice(0, 2))
  }
  return { form, criacao, criadores, defesa }
}

// Veredito do confronto de setores entre dois times (linhas de digest prontas)
function setoresDigest(home: SetorTeam | null, away: SetorTeam | null, homeName: string, awayName: string): string[] {
  if (!home || !away) return ["- amostra insuficiente pros setores."]
  const parse = (f: string | null) => (f ? f.split("-").map(Number).filter(Number.isFinite) : null)
  const ph = parse(home.form), pa = parse(away.form)
  const linhas: string[] = []
  if (ph && pa && ph.length >= 3 && pa.length >= 3) {
    const pivoH = ph[1]!, pivoA = pa[1]!
    const midH = ph.slice(1, -1).reduce((a, b) => a + b, 0), midA = pa.slice(1, -1).reduce((a, b) => a + b, 0)
    const vered = pivoH < pivoA && midH <= midA ? `pivô ${pivoH}v${pivoA} — **inferioridade central do ${homeName}** (o miolo é o setor decisivo)`
      : pivoA < pivoH && midA <= midH ? `pivô ${pivoA}v${pivoH} — **inferioridade central do ${awayName}**`
      : midH !== midA ? `meio ${midH}v${midA} — leve vantagem numérica de ${midH > midA ? homeName : awayName}`
      : `meios pareados (${midH}v${midA}) — decide-se nos corredores e nos duelos`
    linhas.push(`- **Formações prováveis (moda últ.5)**: ${homeName} ${home.form} × ${awayName} ${away.form} → ${vered}. (Formação declarada ≠ real: hipótese, não lei.)`)
  }
  const ataque = (atk: SetorTeam, def: SetorTeam, atkName: string, defName: string) => {
    const tot = ["esquerda", "centro", "direita"].reduce((s, c) => s + (atk.criacao.get(c as Corredor) ?? 0), 0)
    if (!tot) return `- **${atkName} atacando**: sem volume de criação registrado.`
    const flancos = (["esquerda", "direita"] as const).map((f) => ({ f, share: (atk.criacao.get(f) ?? 0) / tot }))
    const dom = flancos.sort((a, b) => b.share - a.share)[0]!
    const oppLado = dom.f === "esquerda" ? "direita" : "esquerda"
    const defs = def.defesa.get(oppLado) ?? []
    const defTxt = defs.length
      ? defs.map((d) => `${d.nome}${d.nota != null ? ` (nota ${d.nota.toFixed(1)} últ.5)` : ""}${d.inj ? " ⚠️ DESFALQUE" : ""}`).join(" + ")
      : "sem defensor mapeado"
    const fraco = defs.some((d) => d.inj) || defs.some((d) => d.nota != null && d.nota < 6.6)
    const forma = setorForma(defs) // MOD-007: MOTM/curva de quem habita o corredor
    const tag = forma.blindado
      ? ` → 🛡️ **SETOR BLINDADO** (${forma.ev})`
      : dom.share >= 0.42 && (fraco || forma.emQueda)
        ? ` → **CORREDOR ABERTO**${forma.emQueda ? ` (defensor em queda: ${forma.ev})` : ""}`
        : dom.share >= 0.5 ? " → corredor de força clara" : ""
    const tops = (atk.criadores.get(dom.f) ?? []).map((p) => `${p.nome} (${p.v})`).join(", ")
    return `- **${atkName} atacando**: ${(dom.share * 100).toFixed(0)}% da criação nasce pela **${dom.f}** (${tops}) × corredor ${oppLado} do ${defName} defendido por ${defTxt}${tag}. Centro: ${(((atk.criacao.get("centro") ?? 0) / tot) * 100).toFixed(0)}%.`
  }
  linhas.push(ataque(home, away, homeName, awayName))
  linhas.push(ataque(away, home, awayName, homeName))
  return linhas
}

// ---------------------------------------------------------------------------
// DIGEST (markdown) — o bloco "cruzamentos pré-computados" pra injetar em prompts.
// SEM resultado real (disciplina de cutoff): só o que era conhecível antes do jogo.
// ---------------------------------------------------------------------------
export async function evidenceDigestMd(targetId: string): Promise<string> {
  const season = await loadSeason(targetId)
  const t = season.target
  const homeId = String(t.home_team_id), awayId = String(t.away_team_id)
  const homeName = String(t.home_name), awayName = String(t.away_name)
  const liga = ligaShare(season)

  const arqLine = (teamId: string, teamName: string, oppId: string, oppName: string) => {
    const a = arquetipoPanel(season, teamId, oppId)
    if (!a.oppBucket || !a.media.j) return `- **${teamName}**: sem dado de posse suficiente pro arquétipo.`
    const c = a.acc.get(a.oppBucket)
    if (!c?.j) return `- **${teamName}**: nenhum jogo contra o arquétipo do ${oppName} nesta temporada.`
    const vsGf = c.gf / c.j, vsGa = c.ga / c.j, mGf = a.media.gf / a.media.j
    const d = vsGf - mGf
    const tag = Math.abs(d) < 0.15 ? `na média da temporada (${f2(mGf)})` : d > 0 ? `**${f2(d)} ACIMA** da média (${f2(mGf)})` : `**${f2(d)} ABAIXO** da média (${f2(mGf)})`
    return `- **${teamName}** contra **${a.oppBucket}** (o estilo do ${oppName}, posse média ${f1(a.oppPossToday!)}%): marca **${f2(vsGf)}/j** e sofre ${f2(vsGa)}/j em ${c.j} jogos — ${tag}.`
  }

  const matchupLines = (gera: ReturnType<typeof mecanismoPanel>, sofre: ReturnType<typeof mecanismoPanel>, atkName: string, defName: string) => {
    const ls: { canal: Canal; idx: number; g: number; s: number }[] = []
    for (const c of CANAIS) {
      const g = (gera.gera.get(c) ?? 0) / Math.max(1, gera.geraTot)
      const s = (sofre.sofre.get(c) ?? 0) / Math.max(1, sofre.sofreTot)
      const lg = liga.tot ? (liga.cnt.get(c) ?? 0) / liga.tot : 0
      if (!lg || (!g && !s)) continue
      ls.push({ canal: c, idx: (g * s) / (lg * lg), g, s })
    }
    ls.sort((a, b) => b.idx - a.idx)
    return ls.filter((l) => l.idx >= 1.4).slice(0, 2).map((l) =>
      `- **CANAL ABERTO — ${l.canal}**: ${atkName} gera ${(l.g * 100).toFixed(0)}% dos gols por aí × ${defName} sofre ${(l.s * 100).toFixed(0)}% por aí (liga: ${(((liga.cnt.get(l.canal) ?? 0) / Math.max(1, liga.tot)) * 100).toFixed(0)}%) → índice ${l.idx.toFixed(1)}×.`)
  }

  const reacLine = (rs: Reacao[], teamName: string) => {
    if (!rs.length) return `- **${teamName}**: sem trends suficientes.`
    const avgD = (xs: Reacao[]) => (xs.length ? xs.reduce((s, r) => s + r.delta, 0) / xs.length : null)
    const dS = avgD(rs.filter((r) => r.kind === "sofreu")), dM = avgD(rs.filter((r) => r.kind === "marcou"))
    const pS = dS == null ? "" : dS < -1 ? `**DESMORONA ao sofrer gol** (Δ momentum ${f1(dS)} nos 10min seguintes)` : dS > 1 ? `**REAGE ao sofrer gol** (Δ +${f1(dS)})` : `neutro ao sofrer (Δ ${f1(dS)})`
    const pM = dM == null ? "" : dM < -1 ? `**ADMINISTRA após marcar** (Δ ${f1(dM)} — recua)` : dM > 1 ? `**MATA O JOGO após marcar** (Δ +${f1(dM)} — segue pressionando)` : `neutro após marcar (Δ ${f1(dM)})`
    return `- **${teamName}** (${rs.length} gols medidos, últimos 8 jogos): ${[pS, pM].filter(Boolean).join(" · ")}.`
  }

  // Artilharia por jogador (gols season + últ.5 + pênaltis + SoT/j + flag de desfalque no jogo-alvo):
  // é o dado que ancora a previsão de MARCADORES — sem isso o modelo chuta nome por fama.
  const artilharia = async (teamId: string, teamName: string) => {
    const ids = season.ms
      .filter((m) => String(m.home_team_id) === teamId || String(m.away_team_id) === teamId)
      .map((m) => String(m.id))
    if (!ids.length) return `- **${teamName}**: sem jogos.`
    const last5 = new Set(ids.slice(-5))
    const gs = rowsOf(await db.execute(sql`
      select p.name, g.match_id, g.type from goal g join player p on p.id = g.player_id
      where g.team_id = ${teamId} and g.match_id in ${sql.raw(`('${ids.join("','")}')`)}`))
    const agg = new Map<string, { tot: number; pens: number; l5: number }>()
    for (const g of gs) {
      const cur = agg.get(String(g.name)) ?? { tot: 0, pens: 0, l5: 0 }
      cur.tot += 1
      if (String(g.type) === "penalty") cur.pens += 1
      if (last5.has(String(g.match_id))) cur.l5 += 1
      agg.set(String(g.name), cur)
    }
    const sot = new Map<string, { s: number; j: number }>()
    for (const r of rowsOf(await db.execute(sql`
      select p.name, lp.shots_on_target from lineup l
      join lineup_player lp on lp.lineup_id = l.id join player p on p.id = lp.player_id
      where l.team_id = ${teamId} and l.match_id in ${sql.raw(`('${ids.join("','")}')`)} and lp.minutes_played > 0`))) {
      const cur = sot.get(String(r.name)) ?? { s: 0, j: 0 }
      cur.s += Number(r.shots_on_target ?? 0)
      cur.j += 1
      sot.set(String(r.name), cur)
    }
    const out = rowsOf(await db.execute(sql`
      select p.name from injury i join player p on p.id = i.player_id
      where i.match_id = ${String(t.id)} and i.team_id = ${teamId}`))
    const injured = new Set(out.map((r) => String(r.name)))
    const top = [...agg.entries()].sort((a, b) => b[1].tot - a[1].tot).slice(0, 5)
    if (!top.length) return `- **${teamName}**: nenhum gol com autor registrado.`
    return `- **${teamName}**: ` + top.map(([nome, s]) => {
      const v = sot.get(nome)
      return `${nome} **${s.tot} gols**${s.pens ? ` (${s.pens} pên)` : ""} · últ.5: ${s.l5} · ${v && v.j ? (v.s / v.j).toFixed(1) : "?"} SoT/j${injured.has(nome) ? " ⚠️ DESFALQUE/dúvida neste jogo" : ""}`
    }).join(" | ")
  }

  // Duplas de gol (assistente → marcador; 71% dos gols têm assist_id): se o garçom está
  // desfalcado, a fonte do marcador seca — cruzamento que a média por jogador não vê.
  const duplas = async (teamId: string, teamName: string) => {
    const ids = season.ms
      .filter((m) => String(m.home_team_id) === teamId || String(m.away_team_id) === teamId)
      .map((m) => String(m.id))
    if (!ids.length) return `- **${teamName}**: sem jogos.`
    const rows = rowsOf(await db.execute(sql`
      select pa.name as de, pa.id as de_id, pm.name as para, pm.id as para_id, count(*)::int as gols
      from goal g join player pa on pa.id = g.assist_id join player pm on pm.id = g.player_id
      where g.team_id = ${teamId} and g.match_id in ${sql.raw(`('${ids.join("','")}')`)}
      group by pa.name, pa.id, pm.name, pm.id
      having count(*) >= 2
      order by gols desc limit 4`))
    if (!rows.length) return `- **${teamName}**: nenhuma dupla com 2+ gols.`
    const inj = new Set(rowsOf(await db.execute(sql`
      select player_id from injury where match_id = ${String(t.id)} and team_id = ${teamId}`)).map((r) => String(r.player_id)))
    return `- **${teamName}**: ` + rows.map((r) => {
      const flags = [inj.has(String(r.de_id)) ? `⚠️ ${r.de} DESFALQUE (a fonte seca)` : "", inj.has(String(r.para_id)) ? `⚠️ ${r.para} DESFALQUE` : ""].filter(Boolean).join(" · ")
      return `${r.de} → ${r.para} **${r.gols}x**${flags ? ` (${flags})` : ""}`
    }).join(" | ")
  }

  const mecHome = mecanismoPanel(season, homeId)
  const mecAway = mecanismoPanel(season, awayId)
  const reacH = await reacaoPanel(season, homeId)
  const reacA = await reacaoPanel(season, awayId)
  const setH = await setorTeam(season, homeId, String(t.id))
  const setA = await setorTeam(season, awayId, String(t.id))
  const expH = await expectativaPanel(season, homeId, awayId, String(t.id), setA)
  const expA = await expectativaPanel(season, awayId, homeId, String(t.id), setH)

  const expLine = (e: ExpPanel | null, teamName: string, oppName: string) => {
    if (!e) return `- **${teamName}**: amostra insuficiente pra expectativa por jogador.`
    const top = e.xi.map((p) => {
      const fat = p.fatores.filter((f) => Math.abs(f.v - 1) > 0.03).map((f) => `${f.k} ${f.v > 1 ? "+" : ""}${((f.v - 1) * 100).toFixed(0)}% [${f.ev}]`)
      return `  - **${p.nome}** (${p.pos ?? "?"}, ${p.expMin.toFixed(0)}min esp.): xG **${f2(p.xG)}** → **P(marca) ${(p.pMarca * 100).toFixed(0)}%** · xSoT ${f2(p.xSot)} → P(1+ SoT) ${(p.pSot1 * 100).toFixed(0)}% · conv ${(p.conv * 100).toFixed(0)}% (${p.gols} gols${p.pens ? `, ${p.pens} pên` : ""}/${p.j}j) · xKP ${f2(p.xKp)}${fat.length ? ` · fatores: ${fat.join("; ")}` : ""}`
    })
    const gap = e.topDown ? e.lambdaXi / e.topDown : 0
    const gapTxt = !e.topDown ? "" : gap < 0.75
      ? ` ⚠️ λ-XI bem ABAIXO do ritmo do time — desfalque/rotação tirou produção do XI ou o rival cede pouco.`
      : gap > 1.15 ? ` λ-XI ACIMA do ritmo do time — XI cheio + matchup favorável.` : ""
    return [
      `- **${teamName}** vs ${oppName} (arquétipo do rival: ${e.oppBucket ?? "?"} · rival cede ${f2(e.oppFactor)}× o SoT da liga${e.defInjEv ? ` · ${e.defInjEv}` : ""}): λ bottom-up do XI **${f2(e.lambdaXi)} xG** vs top-down ${f2(e.topDown)} gols/j (XI cobre ${(e.cobertura * 100).toFixed(0)}% dos gols da season — o resto é banco).${gapTxt}${e.injured.length ? ` Desfalques fora do XI: ${e.injured.join(", ")}.` : ""}`,
      ...top,
      ...(e.banco.length
        ? [`  - ⚠️ **VIVOS fora do XI provável** (rotação recente ou banco — risco real de titularidade/entrar e marcar; considere nos marcadores): ${e.banco.join(" · ")}`]
        : []),
      ...(e.candidatos.length
        ? [`  - 🎯 **Candidatos a marcador (COMPUTADO — os \`marcadores\` do Passo 4c PARTEM desta lista; mova só com evidência nomeada)**: ${e.candidatos.join(" · ")}`]
        : []),
    ].join("\n")
  }

  return [
    `### Arquétipo — desempenho contra o ESTILO do adversário de hoje (jogos-espelho por posse; NÃO é a média geral)`,
    arqLine(homeId, homeName, awayId, awayName),
    arqLine(awayId, awayName, homeId, homeName),
    ``,
    `### Mecanismo de gol — canal (classificado do lance): como um GERA × como o outro SOFRE (baseline = liga)`,
    ...(matchupLines(mecHome, mecAway, homeName, awayName).length || matchupLines(mecAway, mecHome, awayName, homeName).length
      ? [...matchupLines(mecHome, mecAway, homeName, awayName), ...matchupLines(mecAway, mecHome, awayName, homeName)]
      : ["- nenhum canal com índice ≥1.4× — sem assimetria de mecanismo relevante."]),
    ``,
    `### Dinâmica pós-gol — reação MEDIDA a cada gol (Δ do net de momentum nos 10min após o evento)`,
    reacLine(reacH, homeName),
    reacLine(reacA, awayName),
    ``,
    `### Artilharia — quem faz os gols de cada time (season · últimos 5 · volume · pênaltis · desfalque)`,
    await artilharia(homeId, homeName),
    await artilharia(awayId, awayName),
    ``,
    `### Setores — onde o jogo se ganha (formação provável + grid real: miolo × miolo e produção por corredor × lado fraco do rival)`,
    ...setoresDigest(setH, setA, homeName, awayName),
    ``,
    `### Duplas de gol — quem serve quem (assistente → marcador na temporada; desfalque numa ponta quebra a dupla)`,
    await duplas(homeId, homeName),
    await duplas(awayId, awayName),
    ``,
    `### Expectativa por jogador — xSoT e xG do XI provável (taxa/90 × minutos esperados × defesa do rival; conversão encolhida pra liga)`,
    expLine(expH, homeName, awayName),
    expLine(expA, awayName, homeName),
  ].join("\n")
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------
const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
const pct = (n: number, d: number) => (d > 0 ? `${((n / d) * 100).toFixed(0)}%` : "—")
const f1 = (x: number) => x.toFixed(1)
const f2 = (x: number) => x.toFixed(2)

type GameReport = { html: string; title: string }

async function analyze(targetId: string): Promise<GameReport> {
  const season = await loadSeason(targetId)
  const t = season.target
  const homeId = String(t.home_team_id), awayId = String(t.away_team_id)
  const homeName = String(t.home_name), awayName = String(t.away_name)
  const ftH = Number(t.ft_home), ftA = Number(t.ft_away)
  const actual = `${homeName} ${ftH}-${ftA} ${awayName} (HT ${t.ht_home}-${t.ht_away})`
  const liga = ligaShare(season)

  // ---- A · arquétipo (cada time contra o estilo do adversário de hoje)
  const arqSection = (teamId: string, teamName: string, oppId: string, oppName: string, realGf: number) => {
    const a = arquetipoPanel(season, teamId, oppId)
    const rows = (["bloco baixo", "equilibrado", "dominante"] as Arquetipo[]).map((b) => {
      const c = a.acc.get(b)
      const hit = b === a.oppBucket
      if (!c) return `<tr class="${hit ? "hit" : ""}"><td>${b}</td><td colspan="4" class="mut">sem jogos</td></tr>`
      return `<tr class="${hit ? "hit" : ""}"><td>${b}${hit ? " ← hoje" : ""}</td><td>${c.j}</td><td><b>${f2(c.gf / c.j)}</b></td><td>${f2(c.ga / c.j)}</td><td class="mut small">${esc(c.opps.slice(0, 6).join(", "))}${c.opps.length > 6 ? "…" : ""}</td></tr>`
    }).join("")
    const cToday = a.oppBucket ? a.acc.get(a.oppBucket) : null
    const mediaGf = a.media.j ? a.media.gf / a.media.j : 0
    const verdict = cToday && a.media.j
      ? (() => {
          const vsArq = cToday.gf / cToday.j
          const dir = vsArq - mediaGf
          const dirTxt = Math.abs(dir) < 0.15 ? "≈ igual à média" : dir > 0 ? `+${f2(dir)} ACIMA da média` : `${f2(dir)} ABAIXO da média`
          const ok = (vsArq >= mediaGf && realGf >= Math.round(mediaGf)) || (vsArq < mediaGf && realGf <= Math.round(mediaGf))
          return `${teamName} contra <b>${a.oppBucket}</b> (o estilo do ${oppName}, posse ${f1(a.oppPossToday!)}%): <b>${f2(vsArq)} gols/j</b> em ${cToday.j} jogos — ${dirTxt} (${f2(mediaGf)}). No jogo real fez <b>${realGf}</b>. <span class="${ok ? "ok" : "bad"}">${ok ? "✓ direção compatível" : "✗ direção contrariada"}</span>`
        })()
      : "sem dado de posse suficiente pro arquétipo"
    return `<div class="panel-team"><h4>${esc(teamName)} <span class="mut">· como ele joga contra cada arquétipo</span></h4>
      <table><thead><tr><th>arquétipo do adversário</th><th>j</th><th>marca/j</th><th>sofre/j</th><th>exemplos</th></tr></thead><tbody>${rows}</tbody>
      <tfoot><tr><td>média geral</td><td>${a.media.j}</td><td>${a.media.j ? f2(a.media.gf / a.media.j) : "—"}</td><td>${a.media.j ? f2(a.media.ga / a.media.j) : "—"}</td><td></td></tr></tfoot></table>
      <p class="verdict">${verdict}</p></div>`
  }

  // ---- B · mecanismo (matriz gera × sofre + matchup de canais)
  const mecHome = mecanismoPanel(season, homeId)
  const mecAway = mecanismoPanel(season, awayId)
  const mecTable = (m: ReturnType<typeof mecanismoPanel>, teamName: string) => {
    const rows = CANAIS.map((c) => {
      const g = m.gera.get(c) ?? 0, s = m.sofre.get(c) ?? 0
      const lg = liga.tot ? ((liga.cnt.get(c) ?? 0) / liga.tot) * 100 : 0
      if (!g && !s) return ""
      return `<tr><td>${c}</td><td>${g} <span class="mut">(${pct(g, m.geraTot)})</span></td><td>${s} <span class="mut">(${pct(s, m.sofreTot)})</span></td><td class="mut">${lg.toFixed(0)}%</td></tr>`
    }).join("")
    return `<div class="panel-team"><h4>${esc(teamName)} <span class="mut">· ${m.geraTot} gols feitos / ${m.sofreTot} sofridos classificados${m.semTexto ? ` · ${m.semTexto} sem texto` : ""}</span></h4>
      <table><thead><tr><th>canal</th><th>gera</th><th>sofre</th><th>liga</th></tr></thead><tbody>${rows}</tbody></table></div>`
  }
  const matchups = (gera: ReturnType<typeof mecanismoPanel>, sofre: ReturnType<typeof mecanismoPanel>, atkName: string, defName: string) => {
    const lines: { canal: Canal; idx: number; gShare: number; sShare: number }[] = []
    for (const c of CANAIS) {
      const g = (gera.gera.get(c) ?? 0) / Math.max(1, gera.geraTot)
      const s = (sofre.sofre.get(c) ?? 0) / Math.max(1, sofre.sofreTot)
      const lg = liga.tot ? (liga.cnt.get(c) ?? 0) / liga.tot : 0
      if (!lg || (!g && !s)) continue
      lines.push({ canal: c, idx: (g * s) / (lg * lg), gShare: g, sShare: s })
    }
    lines.sort((a, b) => b.idx - a.idx)
    return lines.slice(0, 3).map((l) =>
      `<li><b>${l.canal}</b> — ${atkName} gera ${(l.gShare * 100).toFixed(0)}% por aí × ${defName} sofre ${(l.sShare * 100).toFixed(0)}% por aí (liga: ${((liga.cnt.get(l.canal) ?? 0) / Math.max(1, liga.tot) * 100).toFixed(0)}%) → índice <b>${l.idx.toFixed(1)}×</b>${l.idx >= 1.5 ? ' <span class="hot">CANAL ABERTO</span>' : ""}</li>`,
    ).join("")
  }
  const golsReais = season && (await (async () => {
    const gs = rowsOf(await db.execute(sql`
      select g.team_id, g.minute, c.comment from goal g
      left join commentary c on c.match_id = g.match_id and c.is_goal = true and c.minute = g.minute
      where g.match_id = ${targetId} order by g.minute`))
    return gs.map((g) => {
      const canal = g.comment ? classifyGoal(String(g.comment)) : null
      const who = String(g.team_id) === homeId ? homeName : awayName
      return `${g.minute}' ${esc(who)}${canal ? ` — <b>${canal}</b>` : ""}`
    }).join(" · ")
  })())

  // ---- C · reação a gol
  const reacHome = await reacaoPanel(season, homeId)
  const reacAway = await reacaoPanel(season, awayId)
  const reacTable = (rs: Reacao[], teamName: string) => {
    if (!rs.length) return `<div class="panel-team"><h4>${esc(teamName)}</h4><p class="mut">sem trends nos últimos jogos</p></div>`
    const sofreu = rs.filter((r) => r.kind === "sofreu")
    const marcou = rs.filter((r) => r.kind === "marcou")
    const avgD = (xs: Reacao[]) => (xs.length ? xs.reduce((s, r) => s + r.delta, 0) / xs.length : null)
    const dS = avgD(sofreu), dM = avgD(marcou)
    const rows = rs.map((r) =>
      `<tr><td>${r.kind === "sofreu" ? "🔻 sofreu" : "⚽ marcou"}</td><td>${r.minute}'</td><td>${r.venue} vs ${esc(r.opp)}</td><td>${f1(r.antes)} → ${f1(r.depois)}</td><td class="${r.delta > 1 ? "ok" : r.delta < -1 ? "bad" : "mut"}">${r.delta > 0 ? "+" : ""}${f1(r.delta)}</td></tr>`,
    ).join("")
    const leS = dS == null ? "" : dS < -1 ? `<b class="bad">DESMORONA</b> ao sofrer (Δ médio ${f1(dS)})` : dS > 1 ? `<b class="ok">REAGE</b> ao sofrer (Δ médio +${f1(dS)})` : `neutro ao sofrer (Δ ${f1(dS)})`
    const leM = dM == null ? "" : dM < -1 ? `<b>ADMINISTRA</b> após marcar (Δ ${f1(dM)} — recua)` : dM > 1 ? `<b>MATA O JOGO</b> após marcar (Δ +${f1(dM)} — segue pressionando)` : `neutro após marcar (Δ ${f1(dM)})`
    return `<div class="panel-team"><h4>${esc(teamName)} <span class="mut">· ${rs.length} gols com curva (últimos 8 jogos)</span></h4>
      <p class="verdict">${leS}${leS && leM ? " · " : ""}${leM}</p>
      <table><thead><tr><th></th><th>min</th><th>jogo</th><th>net antes → depois (10')</th><th>Δ</th></tr></thead><tbody>${rows}</tbody></table></div>`
  }

  // ---- D · expectativa por jogador (bottom-up)
  const expTable = (e: ExpPanel | null, teamName: string, oppName: string, realGf: number) => {
    if (!e) return `<div class="panel-team"><h4>${esc(teamName)}</h4><p class="mut">amostra insuficiente</p></div>`
    const rows = e.xi.map((p) => {
      const fat = p.fatores.map((f) => `<span title="${esc(f.ev)}" class="${f.v > 1 ? "ok" : "bad"}">${esc(f.k)} ${f.v > 1 ? "+" : ""}${((f.v - 1) * 100).toFixed(0)}%</span>`).join(" · ")
      return `<tr><td>${esc(p.nome)}${p.pens ? ` <span class="mut small">(${p.pens} pên)</span>` : ""}</td><td class="mut">${esc(p.pos ?? "?")}</td><td>${p.expMin.toFixed(0)}'</td><td>${f2(p.sot90)}</td><td>${(p.conv * 100).toFixed(0)}%</td><td>${f2(p.xSot)}</td><td><b>${f2(p.xG)}</b></td><td><b>${(p.pMarca * 100).toFixed(0)}%</b></td><td>${f2(p.xKp)}</td><td class="small">${fat || '<span class="mut">—</span>'}</td></tr>`
    }).join("")
    const okDir = (e.lambdaXi >= e.topDown && realGf >= Math.round(e.topDown)) || (e.lambdaXi < e.topDown && realGf <= Math.round(e.topDown))
    const verdict = `λ bottom-up do XI: <b>${f2(e.lambdaXi)} xG</b> vs top-down ${f2(e.topDown)} gols/j · XI cobre ${(e.cobertura * 100).toFixed(0)}% dos gols · ${esc(oppName)} (${esc(e.oppBucket ?? "?")}) cede ${f2(e.oppFactor)}× o SoT da liga (${f2(e.ligaSotAvg)}/j, conv ${(e.ligaConv * 100).toFixed(0)}%)${e.defInjEv ? ` · ${esc(e.defInjEv)}` : ""}. Real: <b>${realGf}</b> <span class="${okDir ? "ok" : "bad"}">${okDir ? "✓ direção compatível" : "✗ direção contrariada"}</span>${e.injured.length ? ` · desfalques fora: ${esc(e.injured.join(", "))}` : ""}`
    return `<div class="panel-team"><h4>${esc(teamName)} <span class="mut">· XI provável por minutagem recente · fatores com evidência no hover</span></h4>
      <table><thead><tr><th>jogador</th><th>pos</th><th>min esp</th><th>SoT/90</th><th>conv</th><th>xSoT</th><th>xG</th><th>P(marca)</th><th>xKP</th><th>fatores</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="verdict">${verdict}</p></div>`
  }

  const setHome = await setorTeam(season, homeId, targetId)
  const setAway = await setorTeam(season, awayId, targetId)

  const html = `
  <h2>${esc(homeName)} x ${esc(awayName)} <span class="real">real: ${esc(actual)}</span></h2>
  ${golsReais ? `<p class="mut">gols do jogo real: ${golsReais}</p>` : ""}

  <details open><summary>🧬 A · Arquétipo — desempenho contra o ESTILO do adversário de hoje <span class="hint">jogos-espelho por posse média</span></summary><div class="body duo">
    ${arqSection(homeId, homeName, awayId, awayName, ftH)}
    ${arqSection(awayId, awayName, homeId, homeName, ftA)}
  </div></details>

  <details open><summary>🎯 B · Mecanismo — como gera gol × como o rival sofre gol <span class="hint">canal via commentary · baseline = liga</span></summary><div class="body">
    <div class="duo">${mecTable(mecHome, homeName)}${mecTable(mecAway, awayName)}</div>
    <div class="duo">
      <div class="panel-team"><h4>Canais do ${esc(homeName)} atacando o ${esc(awayName)}</h4><ul>${matchups(mecHome, mecAway, homeName, awayName)}</ul></div>
      <div class="panel-team"><h4>Canais do ${esc(awayName)} atacando o ${esc(homeName)}</h4><ul>${matchups(mecAway, mecHome, awayName, homeName)}</ul></div>
    </div>
  </div></details>

  <details open><summary>🌊 C · Dinâmica — reação medida a cada gol <span class="hint">Δ de momentum nos 10' seguintes · evento a evento</span></summary><div class="body duo">
    ${reacTable(reacHome, homeName)}
    ${reacTable(reacAway, awayName)}
  </div></details>

  <details open><summary>🗺️ E · Setores — onde o jogo se ganha <span class="hint">formação provável (moda últ.5) + grid: miolo × miolo · criação por corredor × lado fraco do rival · 🛡️ blindado por MOTM/curva</span></summary><div class="body">
    <ul>${setoresDigest(setHome, setAway, homeName, awayName).map((l) => `<li>${esc(l.replace(/^- /, "")).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")}</li>`).join("")}</ul>
  </div></details>

  <details open><summary>👥 D · Expectativa por jogador — previsão bottom-up do XI provável <span class="hint">taxa/90 × min esperados × [volume cedido · arquétipo · mando · forma · canal · setor · desfalque def. do rival] → xSoT, xG, P(marca)</span></summary><div class="body">
    ${expTable(await expectativaPanel(season, homeId, awayId, targetId, setAway), homeName, awayName, ftH)}
    ${expTable(await expectativaPanel(season, awayId, homeId, targetId, setHome), awayName, homeName, ftA)}
  </div></details>`
  return { html: `<section class="game">${html}</section>`, title: `${homeName} x ${awayName}` }
}

// ---------------------------------------------------------------------------
// Main (só quando executado direto; como módulo, exporta evidenceDigestMd)
// ---------------------------------------------------------------------------
if (!import.meta.main) {
  // importado como módulo — não roda o CLI
} else {
const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
const reports: GameReport[] = []
for (const id of MATCH_IDS) {
  console.error(`[evidence] analisando ${id}…`)
  reports.push(await analyze(id))
}

const page = `<!doctype html><html lang="pt-br"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cruzamentos de evidência · rodada 38</title>
<style>
:root { color-scheme: dark; }
* { box-sizing: border-box; }
body { margin:0; font:14.5px/1.55 ui-sans-serif,system-ui,sans-serif; background:#0b0e14; color:#d7dce5; }
.wrap { max-width:1180px; margin:0 auto; padding:32px 20px 80px; }
h1 { font-size:21px; margin:0 0 4px; }
h2 { font-size:18px; margin:0 0 8px; }
h4 { font-size:13.5px; margin:0 0 8px; color:#c9d1e0; }
.sub { color:#8b93a7; margin-bottom:24px; font-size:13px; }
.real { color:#fbbf24; font-size:13.5px; font-weight:400; margin-left:10px; }
section.game { background:#11151f; border:1px solid #1e2533; border-radius:14px; margin:22px 0; padding:20px; }
details { background:#0d1119; border:1px solid #1a2230; border-radius:12px; margin:12px 0; overflow:hidden; }
summary { cursor:pointer; padding:12px 16px; font-weight:600; font-size:14.5px; list-style:none; }
summary::-webkit-details-marker { display:none; }
summary .hint { color:#677089; font-weight:400; font-size:12px; margin-left:8px; }
.body { padding:0 16px 16px; }
.duo { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.panel-team { background:#0b0e14; border:1px solid #1a2230; border-radius:10px; padding:12px; }
table { width:100%; border-collapse:collapse; font-size:12.5px; }
th, td { padding:5px 8px; border-bottom:1px solid #1a2230; text-align:left; vertical-align:top; }
th { color:#8b93a7; font-weight:600; }
tfoot td { color:#7dd3fc; border-top:2px solid #232a3a; }
tr.hit td { background:#1b1430; }
tr.hit td:first-child { color:#c084fc; font-weight:700; }
.mut { color:#8b93a7; }
.small { font-size:11px; }
.ok { color:#34d399; font-weight:600; }
.bad { color:#f87171; font-weight:600; }
.hot { color:#fbbf24; font-weight:700; font-size:11px; letter-spacing:.5px; }
.verdict { background:#10192b; border-left:3px solid #3b82f6; padding:8px 12px; border-radius:6px; font-size:13px; margin:10px 0; }
ul { margin:6px 0; padding-left:18px; }
li { margin:6px 0; font-size:13px; }
@media (max-width:900px) { .duo { grid-template-columns:1fr; } }
</style></head><body><div class="wrap">
<h1>Cruzamentos de evidência — computados do banco <span class="real">rodada 38 · validado contra o placar real</span></h1>
<div class="sub">A · arquétipo (desempenho contra o ESTILO do adversário de hoje, não contra a média) · B · mecanismo (canal do gol via texto do commentary: como gera × como o rival sofre) · C · dinâmica (Δ de momentum medido nos 10' após cada gol — desmorona/reage/administra/mata) · gerado ${esc(stamp)} · zero LLM</div>
${reports.map((r) => r.html).join("\n")}
</div></body></html>`

const outUrl = new URL(`./output/evidence/${stamp}/evidencias.html`, import.meta.url)
await Bun.write(outUrl, page)
console.log(Bun.fileURLToPath(outUrl))
process.exit(0)
}
