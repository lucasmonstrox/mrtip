import rawPL from "../../data/openfootball/en.1.2025-26.json"

import { CATALOGO, type LigaCode } from "./consts"
import type { Liga, LinhaClassificacao, Partida, Round, TemporadaBruta } from "./model"

/** JSON bruto por arquivo do catálogo (import estático → entra no bundle). */
const BRUTOS: Record<string, unknown> = {
  "en.1.2025-26.json": rawPL,
}

interface Temporada {
  liga: Liga
  partidas: Partida[]
}

const cache = new Map<string, Temporada>()

function rodadaDeNome(nome: string): number {
  const m = nome.match(/\d+/)
  return m ? Number(m[0]) : 0
}

function normalizarPlacar(score: TemporadaBruta["matches"][number]["score"]): Partida["placar"] {
  if (!score) return null
  if (Array.isArray(score)) return { ft: score, ht: null }
  return { ft: score.ft, ht: score.ht ?? null }
}

/** Lê + normaliza a temporada de uma liga. Cacheado por code. O JSON é estático e
 *  versionado (bundle), com shape garantido pelo schema TemporadaBruta. */
export function carregarTemporada(code: LigaCode): Temporada {
  const hit = cache.get(code)
  if (hit) return hit

  const meta = CATALOGO.find((l) => l.code === code)
  if (!meta) throw new Error(`Liga não catalogada: ${code}`)

  const dados = BRUTOS[meta.arquivo] as TemporadaBruta
  const partidas: Partida[] = dados.matches.map((m) => ({
    rodada: rodadaDeNome(m.round),
    nome: m.round,
    data: m.date,
    hora: m.time ?? null,
    mandante: m.team1,
    visitante: m.team2,
    placar: normalizarPlacar(m.score),
  }))

  const temporada: Temporada = {
    liga: { code: meta.code, nome: meta.nome, pais: meta.pais, temporada: meta.temporada },
    partidas,
  }
  cache.set(code, temporada)
  return temporada
}

/** Agrupa as partidas por rodada, em ordem crescente. */
export function agruparPorRound(partidas: Partida[]): Round[] {
  const porRodada = new Map<number, Round>()
  for (const p of partidas) {
    let round = porRodada.get(p.rodada)
    if (!round) {
      round = { rodada: p.rodada, nome: p.nome, partidas: [] }
      porRodada.set(p.rodada, round)
    }
    round.partidas.push(p)
  }
  return [...porRodada.values()].sort((a, b) => a.rodada - b.rodada)
}

/**
 * Classificação pela regra oficial da Premier League:
 * pontos (V=3, E=1, D=0) → saldo de gols → gols marcados → nome (A→Z).
 * Jogos sem placar são ignorados.
 */
export function calcularClassificacao(partidas: Partida[]): LinhaClassificacao[] {
  type Acc = Omit<LinhaClassificacao, "posicao" | "saldo">
  const tabela = new Map<string, Acc>()

  const linha = (time: string): Acc => {
    let l = tabela.get(time)
    if (!l) {
      l = { time, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0, pontos: 0 }
      tabela.set(time, l)
    }
    return l
  }

  for (const p of partidas) {
    if (!p.placar) continue
    const [golsMandante, golsVisitante] = p.placar.ft
    const mandante = linha(p.mandante)
    const visitante = linha(p.visitante)

    mandante.jogos++
    visitante.jogos++
    mandante.golsPro += golsMandante
    mandante.golsContra += golsVisitante
    visitante.golsPro += golsVisitante
    visitante.golsContra += golsMandante

    if (golsMandante > golsVisitante) {
      mandante.vitorias++
      mandante.pontos += 3
      visitante.derrotas++
    } else if (golsMandante < golsVisitante) {
      visitante.vitorias++
      visitante.pontos += 3
      mandante.derrotas++
    } else {
      mandante.empates++
      visitante.empates++
      mandante.pontos++
      visitante.pontos++
    }
  }

  return [...tabela.values()]
    .map((l) => ({ ...l, saldo: l.golsPro - l.golsContra }))
    .sort(
      (a, b) =>
        b.pontos - a.pontos ||
        b.saldo - a.saldo ||
        b.golsPro - a.golsPro ||
        a.time.localeCompare(b.time),
    )
    .map((l, i) => ({ posicao: i + 1, ...l }))
}
