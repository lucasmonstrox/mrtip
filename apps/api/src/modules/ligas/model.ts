import { t } from "elysia"

/**
 * Schemas TypeBox — validador nativo do Elysia. (Zod via Standard Schema NÃO popula
 * path params no Cloudflare Workers; TypeBox é o que funciona no workerd, mesma
 * escolha do menupiloto/apps/api.) Tipos saem via `typeof X.static`.
 */

const Tupla = t.Tuple([t.Integer(), t.Integer()])

/* ---------- Bruto: formato do openfootball/football.json ---------- */
// `score` vem em DOIS formatos no mesmo arquivo: objeto {ft,ht} ou tupla [h,a].
const ScoreBruto = t.Union([t.Object({ ft: Tupla, ht: t.Optional(Tupla) }), Tupla])

export const PartidaBruta = t.Object({
  round: t.String(),
  date: t.String(),
  time: t.Optional(t.String()),
  team1: t.String(),
  team2: t.String(),
  score: t.Optional(ScoreBruto),
})

export const TemporadaBruta = t.Object({
  name: t.String(),
  matches: t.Array(PartidaBruta),
})
export type TemporadaBruta = typeof TemporadaBruta.static

/* ---------- Domínio: o que a API expõe ---------- */
export const Placar = t.Object({
  ft: Tupla, // tempo normal [mandante, visitante]
  ht: t.Union([Tupla, t.Null()]), // intervalo (null quando o dado não traz)
})

export const Partida = t.Object({
  rodada: t.Integer(),
  nome: t.String(), // "Matchday 12"
  data: t.String(),
  hora: t.Union([t.String(), t.Null()]),
  mandante: t.String(),
  visitante: t.String(),
  placar: t.Union([Placar, t.Null()]), // null = jogo ainda sem resultado
})
export type Partida = typeof Partida.static

export const Round = t.Object({
  rodada: t.Integer(),
  nome: t.String(),
  partidas: t.Array(Partida),
})
export type Round = typeof Round.static

export const LinhaClassificacao = t.Object({
  posicao: t.Integer(),
  time: t.String(),
  jogos: t.Integer(),
  vitorias: t.Integer(),
  empates: t.Integer(),
  derrotas: t.Integer(),
  golsPro: t.Integer(),
  golsContra: t.Integer(),
  saldo: t.Integer(),
  pontos: t.Integer(),
})
export type LinhaClassificacao = typeof LinhaClassificacao.static

export const Liga = t.Object({
  code: t.String(),
  nome: t.String(),
  pais: t.String(),
  temporada: t.String(),
})
export type Liga = typeof Liga.static

export const LigaResumo = t.Composite([Liga, t.Object({ rounds: t.Integer(), partidas: t.Integer() })])

export const ErroNaoEncontrado = t.Object({ erro: t.String() })
