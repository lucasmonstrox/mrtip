// Tipos do Hub da Rodada. TODO MOCK por enquanto: o coração de valor (EV/odds/prob) depende de
// SIN-012 (odds) + MOD-001 (motor quant) + CORE-001 (porta de dinheiro), ainda não ingeridos.
// Quando o backend existir, estes tipos migram para o contrato @workspace/api (source of truth).

export type FormResult = "W" | "D" | "L"

/** Proporção com intervalo de confiança 95% (Wilson) e tamanho de amostra — nunca um % nu. */
export type Proportion = {
  pct: number
  lo: number
  hi: number
  n: number
  lowSample: boolean
}

/** Crest monograma: sigla + cor da marca do clube (sem escudo, por risco jurídico no BR). */
export type Crest = {
  code: string
  name: string
  slug: string
  color: string
}

/** Um desfalque com peso: produção na temporada (gols/assists) e motivo. */
export type Absentee = {
  player: string
  goals: number
  assists: number
  reason: string
  /** ainda incerto (provável desfalque, não confirmado) */
  doubt?: boolean
}

export type Confidence = "alta" | "média" | "baixa"

/**
 * Aposta de valor (value bet) de um jogo — o coração do card. MOCK: numa v2 isto vem do motor
 * cruzando a probabilidade calibrada do modelo com a odd no-vig do mercado. `ev` e `kelly` são
 * derivados de `modelProb` + `offeredOdd` no util (consistência > hardcode).
 */
export type ValueBet = {
  /** rótulo do mercado, ex.: "Mais de 2.5 gols" */
  market: string
  /** odd ofertada pela casa */
  offeredOdd: number
  /** probabilidade calibrada do modelo (0..1) */
  modelProb: number
  /** probabilidade implícita do mercado SEM vig (no-vig, 0..1) */
  marketProb: number
  confidence: Confidence
  /** tipo de borda detectada, ex.: "Linha defasada (desfalque)" */
  edgeType: string
  /** por que o modelo enxerga valor, em 1 frase */
  rationale: string
}

/** Um jogo da rodada com todo o contexto de decisão. */
export type HubMatch = {
  id: string
  date: string // yyyy-MM-dd
  time: string // HH:mm (fuso da loja)
  status: "scheduled" | "live" | "finished"
  home: Crest
  away: Crest
  homeRank: number
  awayRank: number
  homePts: number
  awayPts: number
  homeForm: FormResult[]
  awayForm: FormResult[]
  /** dias de descanso desde o último jogo (só PL ingerida — pode superestimar) */
  homeRest: number
  awayRest: number
  over25: Proportion
  btts: Proportion
  absences: { home: Absentee[]; away: Absentee[] }
  /** null = nenhuma borda encontrada → card "sem valor" (conteúdo de primeira classe) */
  value: ValueBet | null
}

export type Round = {
  league: string
  season: string
  round: number
  /** rótulo honesto de frescor do dado */
  updatedAt: string
  matches: HubMatch[]
}
