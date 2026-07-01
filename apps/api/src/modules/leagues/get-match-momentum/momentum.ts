// Reconstrói a curva de attack momentum (pressão da partida, à la Sofascore) a partir dos trends por
// minuto da SportMonks. `value` é cumulativo (no jogo), então o momentum é o DELTA por minuto (a taxa
// de ameaça), ponderado por perigo: SoT/big-chance/dangerous-attack pesam mais que chute/ataque. Posse
// e ações defensivas ficam fora (peso 0) em v1 — posse crua infla pressão falsa. @feature SIN-021

export type MomentumPoint = { minute: number; home: number; away: number }
export type TrendInput = { teamId: string; typeId: number; periodId: number; minute: number; value: number }

// Pesos de perigo (v1, calibráveis). Tipo ausente = peso 0 (ignorado): posse(45)/tackles(78)/interceptions(100)
// são ingeridos pra calibração futura mas não entram no momentum ofensivo de v1.
const WEIGHTS: Record<number, number> = {
  86: 5, // shots-on-target
  580: 6, // big-chances-created
  44: 3, // dangerous-attacks
  42: 2, // shots-total
  49: 2, // shots-insidebox
  43: 1, // attacks
  34: 1, // corners
}
const EMA_ALPHA = 0.3 // ~6 min de janela efetiva; suaviza a serra do delta cru sem matar viradas de fluxo

// Série temporal por time: para cada minuto, o momentum suavizado (EMA) da casa e do visitante. A curva
// é simétrica (os dois times têm valor) — diferente do Pressure Index pago, que zera o time dominado.
export function buildMomentum(rows: TrendInput[], homeTeamId: string, awayTeamId: string): MomentumPoint[] {
  // Ordem cronológica dos períodos (1ºT, 2ºT, prorrogação…) pelo MENOR minuto de cada — robusto a
  // period_ids fora de ordem. O acréscimo de um período (45+2 → minuto 47, período 1) sobrepõe o minuto
  // do período seguinte (47:00 do 2ºT), então NÃO dá pra ordenar/indexar só por minuto: usa-se a chave
  // composta (rank do período, minuto) pra manter a sequência correta e não colapsar minutos iguais.
  const periodMinMinute = new Map<number, number>()
  for (const r of rows) {
    const cur = periodMinMinute.get(r.periodId)
    if (cur === undefined || r.minute < cur) periodMinMinute.set(r.periodId, r.minute)
  }
  const rank = new Map(
    [...periodMinMinute.entries()].sort((a, b) => a[1] - b[1]).map(([periodId], i) => [periodId, i]),
  )
  const slotKey = (periodId: number, minute: number) => rank.get(periodId)! * 1000 + minute // único e ordenável

  // 1) Incremento ponderado por slot (período+minuto), por time. Agrupa por (time,tipo) — UMA série por
  //    tipo, pois o value é cumulativo no jogo; ordena cronologicamente e tira o delta carregando o
  //    `prev` entre períodos. Queda de valor (correção de dado / reset de período) → trata como acumulação nova.
  const rawByTeam = new Map<string, Map<number, number>>([
    [homeTeamId, new Map()],
    [awayTeamId, new Map()],
  ])
  const byKey = new Map<string, TrendInput[]>()
  for (const r of rows) {
    if (r.teamId !== homeTeamId && r.teamId !== awayTeamId) continue
    if (!WEIGHTS[r.typeId]) continue
    const key = `${r.teamId}:${r.typeId}`
    let series = byKey.get(key)
    if (!series) byKey.set(key, (series = []))
    series.push(r)
  }
  for (const series of byKey.values()) {
    series.sort((a, b) => slotKey(a.periodId, a.minute) - slotKey(b.periodId, b.minute))
    let prev = 0
    for (const p of series) {
      const delta = p.value < prev ? p.value : p.value - prev
      prev = p.value
      if (delta <= 0) continue
      const teamRaw = rawByTeam.get(p.teamId)!
      const sk = slotKey(p.periodId, p.minute)
      teamRaw.set(sk, (teamRaw.get(sk) ?? 0) + delta * WEIGHTS[p.typeId]!)
    }
  }

  // 2) EMA sobre a timeline cronológica (slots ordenados), independente por time. Minutos sobrepostos
  //    entre períodos são slots distintos → pontos distintos (a label exibe o minuto real).
  const slots = [...new Set(rows.map((r) => slotKey(r.periodId, r.minute)))].sort((a, b) => a - b)
  const minuteOf = new Map(rows.map((r) => [slotKey(r.periodId, r.minute), r.minute]))
  const homeRaw = rawByTeam.get(homeTeamId)!
  const awayRaw = rawByTeam.get(awayTeamId)!
  const out: MomentumPoint[] = []
  let emaH = 0
  let emaA = 0
  for (const sk of slots) {
    emaH = EMA_ALPHA * (homeRaw.get(sk) ?? 0) + (1 - EMA_ALPHA) * emaH
    emaA = EMA_ALPHA * (awayRaw.get(sk) ?? 0) + (1 - EMA_ALPHA) * emaA
    out.push({ minute: minuteOf.get(sk)!, home: Math.round(emaH * 100) / 100, away: Math.round(emaA * 100) / 100 })
  }
  return out
}
