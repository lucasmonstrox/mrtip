import { and, asc, count, desc, eq, inArray, lt, lte, ne, or } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"

import { db } from "../../../db/client"
import {
  escalacao,
  escalacaoJogador,
  gol,
  jogador,
  lesao,
  liga,
  partida,
  tecnico,
  time,
  type Partida as PartidaRow,
} from "../../../db/schema"
import { notFound } from "../../../lib/errors"

/* ---------- Contrato de domínio (o que a API expõe; reusado pelo apps/web) ---------- */

export type Liga = {
  code: string
  nome: string
  pais: string
  temporada: string
}

// Referência a um time: id estável + nome + slug (este último pras URLs /times/:slug).
export type TimeRef = {
  id: string
  nome: string
  slug: string
}

export type Placar = {
  ft: [number, number] // tempo normal [mandante, visitante]
  ht: [number, number] | null // intervalo (null quando a fonte não traz)
}

export type Partida = {
  id: string
  rodada: number
  nome: string // "Matchday 12"
  data: string // yyyy-MM-dd
  hora: string | null
  mandante: TimeRef
  visitante: TimeRef
  placar: Placar | null // null = jogo ainda sem resultado
}

export type Round = {
  rodada: number
  nome: string
  partidas: Partida[]
}

export type LinhaClassificacao = {
  posicao: number
  time: TimeRef
  jogos: number
  vitorias: number
  empates: number
  derrotas: number
  golsPro: number
  golsContra: number
  saldo: number
  pontos: number
  forma: ResultadoForma[] // últimos 5 [maisRecente, ...] com contexto (placar/adversário/jogo)
}

export type Resultado = "V" | "E" | "D"

// Um resultado da forma com contexto: contra quem, quanto foi e qual partida — pro front
// mostrar tooltip (placar) e linkar pro jogo. `golsPro/golsContra` são na perspectiva do time.
export type ResultadoForma = {
  resultado: Resultado
  partidaId: string
  adversario: TimeRef
  golsPro: number
  golsContra: number
  mando: "casa" | "fora"
}

export type Forma = {
  time: TimeRef
  ultimos: ResultadoForma[] // [maisRecente, ...] até N
  resumo: { v: number; e: number; d: number }
}

// Um jogador dentro da escalação.
export type JogadorEscalado = {
  id: string
  nome: string
  numero: number | null
  posicao: string | null
  titular: boolean
  grid: string | null
}

// Escalação de um time num jogo: formação + técnico + titulares/banco.
export type EscalacaoTime = {
  time: TimeRef
  formacao: string | null
  tecnico: string | null
  tecnicoId: string | null
  titulares: JogadorEscalado[]
  banco: JogadorEscalado[]
}

// Um desfalque: jogador fora (ou dúvida) + motivo + o peso dele (gols/assists na liga ATÉ
// a data deste jogo). `naoJogou` = type "Missing Fixture". Os números saem do `gol` (derivado,
// ancorado na data), não de snapshot — então respondem "até este jogo, quanto ele vinha rendendo".
export type Desfalque = {
  jogador: { id: string; nome: string }
  naoJogou: boolean
  motivo: string | null
  gols: number
  assistencias: number
  jogosForaSeguidos: number // jogos consecutivos fora terminando neste (do lesao, completo)
  jogosForaTotal: number // total de jogos fora na liga até este (inclusive)
}

// Desfalques de um time num jogo.
export type DesfalquesTime = {
  time: TimeRef
  desfalques: Desfalque[]
}

// Um gol do jogo: minuto, tipo, time que marcou, autor e assistência.
export type GolItem = {
  minuto: number | null
  tipo: "normal" | "penalti" | "contra"
  time: TimeRef
  autor: { id: string; nome: string }
  assistente: { id: string; nome: string } | null
}

// Um gol na ótica do jogador (pra página dele): a partida + minuto + tipo.
export type JogadorGol = {
  partidaId: string
  data: string
  minuto: number | null
  tipo: "normal" | "penalti"
  mandante: string
  visitante: string
  placar: [number, number] | null
}

// Página do jogador: dados + totais (derivados de gol/lesao) + a lista de gols.
export type JogadorDetalhe = {
  id: string
  nome: string
  gols: number
  assistencias: number
  jogosFora: number
  golsLista: JogadorGol[]
}

// Um jogo dirigido por um técnico (pra página dele).
export type TecnicoJogo = {
  partidaId: string
  data: string
  time: string // time que ele dirigiu nesse jogo
  mandante: string
  visitante: string
  placar: [number, number] | null
}

// Página do técnico: nome + jogos dirigidos.
export type TecnicoDetalhe = {
  id: string
  nome: string
  jogos: TecnicoJogo[]
}

/* ---------- Read-model: a ponte banco → contrato de domínio ---------- */

// `time` entra DUAS vezes no join (mandante e visitante) → precisa de alias pra cada.
const timeMandante = alias(time, "time_mandante")
const timeVisitante = alias(time, "time_visitante")

// Linha que o read-model produz: a partida crua + nome/slug denormalizados dos dois times.
type PartidaJoin = {
  p: PartidaRow
  mandanteNome: string
  mandanteSlug: string
  visitanteNome: string
  visitanteSlug: string
}

// Read-model BASE: partida + nome/slug dos dois times via join (inner — os ids são notNull com FK,
// então sempre casam). Fábrica (`() =>`) porque cada chamador encadeia o próprio where/orderBy.
const baseQuery = () =>
  db
    .select({
      p: partida,
      mandanteNome: timeMandante.nome,
      mandanteSlug: timeMandante.slug,
      visitanteNome: timeVisitante.nome,
      visitanteSlug: timeVisitante.slug,
    })
    .from(partida)
    .innerJoin(timeMandante, eq(timeMandante.id, partida.mandanteId))
    .innerJoin(timeVisitante, eq(timeVisitante.id, partida.visitanteId))

// Achata a linha do join (placar em 4 colunas + nomes do join) no contrato de saída (placar e
// times aninhados). ÚNICO ponto que define o shape de uma partida — list/rounds/detalhe passam
// todos por aqui, então o payload nunca diverge entre endpoints.
export function serializePartida(row: PartidaJoin): Partida {
  const { p } = row
  const { placarFtMandante: fm, placarFtVisitante: fv, placarHtMandante: hm, placarHtVisitante: hv } = p
  const placar: Placar | null =
    fm == null || fv == null ? null : { ft: [fm, fv], ht: hm != null && hv != null ? [hm, hv] : null }
  return {
    id: p.id,
    rodada: p.rodada,
    nome: p.nome,
    data: p.data,
    hora: p.hora,
    mandante: { id: p.mandanteId, nome: row.mandanteNome, slug: row.mandanteSlug },
    visitante: { id: p.visitanteId, nome: row.visitanteNome, slug: row.visitanteSlug },
    placar,
  }
}

// Todas as partidas de uma liga, ordenadas por rodada e data — base de rounds, classificação e
// forma. Devolve já serializado (contrato de domínio), nunca a linha crua.
export async function loadPartidas(code: string): Promise<Partida[]> {
  const rows = await baseQuery()
    .where(eq(partida.ligaCode, code))
    .orderBy(asc(partida.rodada), asc(partida.data))
  return rows.map(serializePartida)
}

// Linha (com join dos nomes) de uma partida por id — usada pelo detalhe e pela forma, que
// precisam ancorar na liga/data. null quando não existe. O formato uuid do id é garantido NA
// BORDA (partidas.routes.ts), então aqui só chega uuid válido — inexistente apenas não casa.
export async function getPartidaRow(id: string): Promise<PartidaJoin | null> {
  const [row] = await baseQuery().where(eq(partida.id, id)).limit(1)
  return row ?? null
}

// Liga por code ou 404 de domínio (mapeado pelo onError global).
export async function getLigaOrThrow(code: string): Promise<Liga> {
  const [row] = await db.select().from(liga).where(eq(liga.code, code)).limit(1)
  if (!row) throw notFound("liga_nao_encontrada")
  return row
}

// Página do jogador: totais (gols reais, assists, jogos fora) + lista de gols. Tudo derivado de
// `gol`/`lesao` (não snapshot). 404 se o id não existe. Gols/assists dependem do backfill de gols.
export async function getJogadorDetalhe(id: string): Promise<JogadorDetalhe> {
  const [j] = await db.select({ id: jogador.id, nome: jogador.nome }).from(jogador).where(eq(jogador.id, id)).limit(1)
  if (!j) throw notFound("jogador_nao_encontrado")

  const [g] = await db.select({ n: count() }).from(gol).where(and(eq(gol.jogadorId, id), ne(gol.tipo, "contra")))
  const [a] = await db.select({ n: count() }).from(gol).where(eq(gol.assistenteId, id))
  const [f] = await db
    .select({ n: count() })
    .from(lesao)
    .where(and(eq(lesao.jogadorId, id), eq(lesao.tipo, "Missing Fixture")))

  const golsRows = await db
    .select({
      partidaId: partida.id,
      data: partida.data,
      minuto: gol.minuto,
      tipo: gol.tipo,
      mandante: timeMandante.nome,
      visitante: timeVisitante.nome,
      ftM: partida.placarFtMandante,
      ftV: partida.placarFtVisitante,
    })
    .from(gol)
    .innerJoin(partida, eq(partida.id, gol.partidaId))
    .innerJoin(timeMandante, eq(timeMandante.id, partida.mandanteId))
    .innerJoin(timeVisitante, eq(timeVisitante.id, partida.visitanteId))
    .where(and(eq(gol.jogadorId, id), ne(gol.tipo, "contra")))
    .orderBy(asc(partida.data))

  return {
    id: j.id,
    nome: j.nome,
    gols: Number(g!.n),
    assistencias: Number(a!.n),
    jogosFora: Number(f!.n),
    golsLista: golsRows.map((r) => ({
      partidaId: r.partidaId,
      data: r.data,
      minuto: r.minuto,
      tipo: r.tipo as JogadorGol["tipo"],
      mandante: r.mandante,
      visitante: r.visitante,
      placar: r.ftM != null && r.ftV != null ? [r.ftM, r.ftV] : null,
    })),
  }
}

// Time por SLUG (chave das URLs /times/:slug) ou 404 de domínio.
export async function getTimeBySlug(slug: string): Promise<TimeRef> {
  const [row] = await db
    .select({ id: time.id, nome: time.nome, slug: time.slug })
    .from(time)
    .where(eq(time.slug, slug))
    .limit(1)
  if (!row) throw notFound("time_nao_encontrado")
  return row
}

// Todas as partidas de um time (como mandante OU visitante), mais recentes primeiro — base da
// página do time. Serializado no contrato de domínio (com os nomes dos dois lados).
export async function loadPartidasDoTime(id: string): Promise<Partida[]> {
  const rows = await baseQuery()
    .where(or(eq(partida.mandanteId, id), eq(partida.visitanteId, id)))
    .orderBy(desc(partida.data))
  return rows.map(serializePartida)
}

// Escalações de uma partida (um item por time que tem lineup). Vazio quando ainda não há lineup
// (o backfill é incremental). Ordena titulares e banco por número da camisa.
export async function loadEscalacoesDaPartida(partidaId: string): Promise<EscalacaoTime[]> {
  const escs = await db
    .select({
      id: escalacao.id,
      formacao: escalacao.formacao,
      tecnico: escalacao.tecnico,
      tecnicoId: escalacao.tecnicoId,
      timeId: time.id,
      timeNome: time.nome,
      timeSlug: time.slug,
    })
    .from(escalacao)
    .innerJoin(time, eq(time.id, escalacao.timeId))
    .where(eq(escalacao.partidaId, partidaId))
  if (!escs.length) return []

  const jogadores = await db
    .select({
      escalacaoId: escalacaoJogador.escalacaoId,
      numero: escalacaoJogador.numero,
      posicao: escalacaoJogador.posicao,
      titular: escalacaoJogador.titular,
      grid: escalacaoJogador.grid,
      jogadorId: jogador.id,
      jogadorNome: jogador.nome,
    })
    .from(escalacaoJogador)
    .innerJoin(jogador, eq(jogador.id, escalacaoJogador.jogadorId))
    .where(inArray(escalacaoJogador.escalacaoId, escs.map((e) => e.id)))

  const porNumero = (a: JogadorEscalado, b: JogadorEscalado) => (a.numero ?? 99) - (b.numero ?? 99)
  return escs.map((e) => {
    const meus: JogadorEscalado[] = jogadores
      .filter((j) => j.escalacaoId === e.id)
      .map((j) => ({
        id: j.jogadorId,
        nome: j.jogadorNome,
        numero: j.numero,
        posicao: j.posicao,
        titular: j.titular,
        grid: j.grid,
      }))
    return {
      time: { id: e.timeId, nome: e.timeNome, slug: e.timeSlug },
      formacao: e.formacao,
      tecnico: e.tecnico,
      tecnicoId: e.tecnicoId,
      titulares: meus.filter((m) => m.titular).sort(porNumero),
      banco: meus.filter((m) => !m.titular).sort(porNumero),
    }
  })
}

// `jogador` entra 2x no join de gols (autor e assistente) → alias pra cada.
const jogadorAutor = alias(jogador, "jogador_autor")
const jogadorAssist = alias(jogador, "jogador_assist")
// `time` dirigido pelo técnico no jogo (3º alias, além de mandante/visitante).
const timeDirigido = alias(time, "time_dirigido")

// Página do técnico: nome + jogos que dirigiu (com o time que comandou em cada um). 404 se não existe.
export async function getTecnicoDetalhe(id: string): Promise<TecnicoDetalhe> {
  const [t] = await db.select({ id: tecnico.id, nome: tecnico.nome }).from(tecnico).where(eq(tecnico.id, id)).limit(1)
  if (!t) throw notFound("tecnico_nao_encontrado")

  const jogos = await db
    .select({
      partidaId: partida.id,
      data: partida.data,
      time: timeDirigido.nome,
      mandante: timeMandante.nome,
      visitante: timeVisitante.nome,
      ftM: partida.placarFtMandante,
      ftV: partida.placarFtVisitante,
    })
    .from(escalacao)
    .innerJoin(partida, eq(partida.id, escalacao.partidaId))
    .innerJoin(timeDirigido, eq(timeDirigido.id, escalacao.timeId))
    .innerJoin(timeMandante, eq(timeMandante.id, partida.mandanteId))
    .innerJoin(timeVisitante, eq(timeVisitante.id, partida.visitanteId))
    .where(eq(escalacao.tecnicoId, id))
    .orderBy(asc(partida.data))

  return {
    id: t.id,
    nome: t.nome,
    jogos: jogos.map((j) => ({
      partidaId: j.partidaId,
      data: j.data,
      time: j.time,
      mandante: j.mandante,
      visitante: j.visitante,
      placar: j.ftM != null && j.ftV != null ? [j.ftM, j.ftV] : null,
    })),
  }
}

// Gols de uma partida, em ordem cronológica (minuto). Vazio quando os eventos ainda não foram
// importados (backfill incremental) ou o jogo terminou 0-0.
export async function loadGolsDaPartida(partidaId: string): Promise<GolItem[]> {
  const rows = await db
    .select({
      minuto: gol.minuto,
      tipo: gol.tipo,
      timeId: time.id,
      timeNome: time.nome,
      timeSlug: time.slug,
      autorId: jogadorAutor.id,
      autorNome: jogadorAutor.nome,
      assistId: jogadorAssist.id,
      assistNome: jogadorAssist.nome,
    })
    .from(gol)
    .innerJoin(time, eq(time.id, gol.timeId))
    .innerJoin(jogadorAutor, eq(jogadorAutor.id, gol.jogadorId))
    .leftJoin(jogadorAssist, eq(jogadorAssist.id, gol.assistenteId))
    .where(eq(gol.partidaId, partidaId))
    .orderBy(asc(gol.minuto))

  return rows.map((r) => ({
    minuto: r.minuto,
    tipo: r.tipo as GolItem["tipo"],
    time: { id: r.timeId, nome: r.timeNome, slug: r.timeSlug },
    autor: { id: r.autorId, nome: r.autorNome },
    assistente: r.assistId && r.assistNome ? { id: r.assistId, nome: r.assistNome } : null,
  }))
}

// Desfalques de uma partida, agrupados por time. "Não jogou" (Missing Fixture) primeiro,
// depois dúvidas; cada grupo por nome. Vazio quando não há registro de desfalque pro jogo.
export async function loadDesfalquesDaPartida(partidaId: string): Promise<DesfalquesTime[]> {
  const rows = await db
    .select({
      tipo: lesao.tipo,
      motivo: lesao.motivo,
      timeId: time.id,
      timeNome: time.nome,
      timeSlug: time.slug,
      jogadorId: jogador.id,
      jogadorNome: jogador.nome,
      data: partida.data,
      ligaCode: partida.ligaCode,
    })
    .from(lesao)
    .innerJoin(time, eq(time.id, lesao.timeId))
    .innerJoin(jogador, eq(jogador.id, lesao.jogadorId))
    .innerJoin(partida, eq(partida.id, lesao.partidaId))
    .where(eq(lesao.partidaId, partidaId))
  if (!rows.length) return []

  // Peso do ausente: gols (reais, sem autogolo) e assists na MESMA liga ATÉ a data do jogo.
  // Derivado do `gol` (não snapshot) — depende do backfill de gols pra ficar completo.
  const { data: antesDe, ligaCode } = rows[0]!
  const jids = [...new Set(rows.map((r) => r.jogadorId))]
  const golsAte = await db
    .select({ jid: gol.jogadorId, n: count() })
    .from(gol)
    .innerJoin(partida, eq(partida.id, gol.partidaId))
    .where(and(eq(partida.ligaCode, ligaCode), lt(partida.data, antesDe), ne(gol.tipo, "contra"), inArray(gol.jogadorId, jids)))
    .groupBy(gol.jogadorId)
  const assistsAte = await db
    .select({ jid: gol.assistenteId, n: count() })
    .from(gol)
    .innerJoin(partida, eq(partida.id, gol.partidaId))
    .where(and(eq(partida.ligaCode, ligaCode), lt(partida.data, antesDe), inArray(gol.assistenteId, jids)))
    .groupBy(gol.assistenteId)
  const golsDe = new Map(golsAte.map((r) => [r.jid, Number(r.n)]))
  const assistsDe = new Map(assistsAte.filter((r) => r.jid).map((r) => [r.jid!, Number(r.n)]))

  // Disponibilidade: sequência de jogos de cada time até esta data (desc) + ausências (Missing
  // Fixture) de cada jogador. Do `lesao`, que é completo → conta confiável de "jogos fora".
  const timeIds = [...new Set(rows.map((r) => r.timeId))]
  const seqDoTime = new Map<string, string[]>() // timeId → [partidaId] desc (mais recente primeiro)
  for (const tId of timeIds) {
    const fx = await db
      .select({ id: partida.id })
      .from(partida)
      .where(
        and(
          eq(partida.ligaCode, ligaCode),
          lte(partida.data, antesDe),
          or(eq(partida.mandanteId, tId), eq(partida.visitanteId, tId)),
        ),
      )
      .orderBy(desc(partida.data))
    seqDoTime.set(tId, fx.map((f) => f.id))
  }
  const ausencias = await db
    .select({ jid: lesao.jogadorId, pid: lesao.partidaId })
    .from(lesao)
    .where(and(eq(lesao.tipo, "Missing Fixture"), inArray(lesao.jogadorId, jids)))
  const foraDe = new Map<string, Set<string>>() // jogadorId → set de partidaIds que ficou fora
  for (const a of ausencias) {
    let s = foraDe.get(a.jid)
    if (!s) foraDe.set(a.jid, (s = new Set()))
    s.add(a.pid)
  }

  const porTime = new Map<string, DesfalquesTime>()
  for (const r of rows) {
    let g = porTime.get(r.timeId)
    if (!g) {
      g = { time: { id: r.timeId, nome: r.timeNome, slug: r.timeSlug }, desfalques: [] }
      porTime.set(r.timeId, g)
    }
    const seq = seqDoTime.get(r.timeId) ?? []
    const fora = foraDe.get(r.jogadorId) ?? new Set<string>()
    let seguidos = 0
    for (const pid of seq) {
      if (fora.has(pid)) seguidos++
      else break
    }
    g.desfalques.push({
      jogador: { id: r.jogadorId, nome: r.jogadorNome },
      naoJogou: r.tipo === "Missing Fixture",
      motivo: r.motivo,
      gols: golsDe.get(r.jogadorId) ?? 0,
      assistencias: assistsDe.get(r.jogadorId) ?? 0,
      jogosForaSeguidos: seguidos,
      jogosForaTotal: seq.filter((pid) => fora.has(pid)).length,
    })
  }
  // ordena: mais gols primeiro, depois quem não jogou, depois nome.
  for (const g of porTime.values()) {
    g.desfalques.sort(
      (a, b) =>
        b.gols - a.gols ||
        Number(b.naoJogou) - Number(a.naoJogou) ||
        a.jogador.nome.localeCompare(b.jogador.nome),
    )
  }
  return [...porTime.values()]
}

/* ---------- Cálculos puros (sobre o contrato de domínio, chaveando por time.id) ---------- */

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
 * Chaveia por time.id (estável); jogos sem placar são ignorados.
 */
export function calcularClassificacao(partidas: Partida[]): LinhaClassificacao[] {
  type Acc = Omit<LinhaClassificacao, "posicao" | "saldo" | "forma">
  const tabela = new Map<string, Acc>()

  const linha = (t: TimeRef): Acc => {
    let l = tabela.get(t.id)
    if (!l) {
      l = { time: t, jogos: 0, vitorias: 0, empates: 0, derrotas: 0, golsPro: 0, golsContra: 0, pontos: 0 }
      tabela.set(t.id, l)
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
        a.time.nome.localeCompare(b.time.nome),
    )
    // forma = últimos 5 do time DENTRO das partidas recebidas (respeita o recorte ?ate). Sem
    // `antesDe`: aqui é a forma "atual" da tabela, não ancorada numa partida específica.
    .map((l, i) => ({ posicao: i + 1, ...l, forma: calcularForma(partidas, l.time).ultimos }))
}

/** Resultado de UMA partida na perspectiva de `timeId`, com contexto (adversário/placar/jogo).
 *  Pressupõe placar != null. */
function resultadoForma(p: Partida, timeId: string): ResultadoForma {
  const [m, v] = p.placar!.ft
  const ehMandante = p.mandante.id === timeId
  const golsPro = ehMandante ? m : v
  const golsContra = ehMandante ? v : m
  return {
    resultado: golsPro > golsContra ? "V" : golsPro < golsContra ? "D" : "E",
    partidaId: p.id,
    adversario: ehMandante ? p.visitante : p.mandante,
    golsPro,
    golsContra,
    mando: ehMandante ? "casa" : "fora",
  }
}

/**
 * Forma de um time nos últimos N jogos COM placar. `antesDe` (yyyy-MM-dd) ancora a forma numa
 * partida (só conta jogos estritamente anteriores) — é o que a página de partida quer.
 * `local` recorta a perspectiva: "casa" só como mandante, "fora" só como visitante.
 * Comparação de datas é lexicográfica (yyyy-MM-dd é ordenável como string).
 */
export function calcularForma(
  partidas: Partida[],
  t: TimeRef,
  opts?: { antesDe?: string; n?: number; local?: "todos" | "casa" | "fora" },
): Forma {
  const n = opts?.n ?? 5
  const local = opts?.local ?? "todos"

  const jogos = partidas
    .filter((p) => p.placar != null)
    .filter((p) => p.mandante.id === t.id || p.visitante.id === t.id)
    .filter((p) => (opts?.antesDe ? p.data < opts.antesDe : true))
    .filter((p) => {
      if (local === "casa") return p.mandante.id === t.id
      if (local === "fora") return p.visitante.id === t.id
      return true
    })
    .sort((a, b) => b.data.localeCompare(a.data)) // mais recente primeiro
    .slice(0, n)

  const ultimos = jogos.map((p) => resultadoForma(p, t.id))
  const resumo = {
    v: ultimos.filter((r) => r.resultado === "V").length,
    e: ultimos.filter((r) => r.resultado === "E").length,
    d: ultimos.filter((r) => r.resultado === "D").length,
  }
  return { time: t, ultimos, resumo }
}
