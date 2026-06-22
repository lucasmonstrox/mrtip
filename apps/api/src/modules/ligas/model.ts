import { z } from "zod"

/**
 * Schemas zod = source of truth (CLAUDE.md). Os tipos saem por `z.infer`, e os
 * próprios schemas validam as rotas do Elysia (Standard Schema) — é isso que
 * faz o Eden inferir os tipos ponta a ponta no apps/web.
 */

const Tupla = z.tuple([z.number().int(), z.number().int()])

/* ---------- Bruto: formato do openfootball/football.json ---------- */
// `score` vem em DOIS formatos no mesmo arquivo: objeto {ft,ht} ou tupla [h,a].
const ScoreBruto = z.union([z.object({ ft: Tupla, ht: Tupla.optional() }), Tupla])

export const PartidaBruta = z.object({
  round: z.string(),
  date: z.string(),
  time: z.string().optional(),
  team1: z.string(),
  team2: z.string(),
  score: ScoreBruto.optional(),
})

export const TemporadaBruta = z.object({
  name: z.string(),
  matches: z.array(PartidaBruta),
})
export type TemporadaBruta = z.infer<typeof TemporadaBruta>

/* ---------- Domínio: o que a API expõe ---------- */
export const Placar = z.object({
  ft: Tupla, // tempo normal [mandante, visitante]
  ht: z.union([Tupla, z.null()]), // intervalo (null quando o dado não traz)
})

export const Partida = z.object({
  rodada: z.number().int(),
  nome: z.string(), // "Matchday 12"
  data: z.string(),
  hora: z.union([z.string(), z.null()]),
  mandante: z.string(),
  visitante: z.string(),
  placar: z.union([Placar, z.null()]), // null = jogo ainda sem resultado
})
export type Partida = z.infer<typeof Partida>

export const Round = z.object({
  rodada: z.number().int(),
  nome: z.string(),
  partidas: z.array(Partida),
})
export type Round = z.infer<typeof Round>

export const LinhaClassificacao = z.object({
  posicao: z.number().int(),
  time: z.string(),
  jogos: z.number().int(),
  vitorias: z.number().int(),
  empates: z.number().int(),
  derrotas: z.number().int(),
  golsPro: z.number().int(),
  golsContra: z.number().int(),
  saldo: z.number().int(),
  pontos: z.number().int(),
})
export type LinhaClassificacao = z.infer<typeof LinhaClassificacao>

export const Liga = z.object({
  code: z.string(),
  nome: z.string(),
  pais: z.string(),
  temporada: z.string(),
})
export type Liga = z.infer<typeof Liga>

export const LigaResumo = Liga.extend({
  rounds: z.number().int(),
  partidas: z.number().int(),
})

export const ErroNaoEncontrado = z.object({ erro: z.string() })
