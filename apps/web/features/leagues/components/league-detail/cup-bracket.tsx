"use client"

import Link from "next/link"

import { Skeleton } from "@workspace/ui/components/skeleton"

import { useBracketQuery } from "../../hooks/data/queries/use-bracket-query"

// Chaveamento de copa com FIOS DE CHAVE. Layout determinístico (posições calculadas, sem medir DOM): o
// bracket começa na 1ª fase potência-de-2 (Round 3 na FA Cup=32, Carabao=16 — onde vira árvore binária),
// cada confronto é centrado na MÉDIA vertical dos seus "pais" (o vencedor de um confronto vira o pai do
// da fase seguinte), e os fios são paths SVG (cotovelo) entre pai→filho. Fases ausentes na fonte (ex.:
// semifinal do Carabao) viram coluna-placeholder. @feature CUP-001

const COL_W = 236 // largura de coluna (card + espaço horizontal pros fios)
const CARD_W = 188
const CARD_H = 60
const SLOT = 74 // espaço vertical por confronto na coluna raiz (acomoda o card com "nos pênaltis" ~70px)
const HEADER_H = 26

type TeamRef = { id: string; name: string; slug: string; logoUrl: string | null }
type Tie = {
  id: string
  slug: string
  home: TeamRef
  away: TeamRef
  score: [number, number] | null
  winnerId: string | null
  resultInfo: string | null
  legs?: [number, number][] // ida/volta: placar de cada mão (mando do nó) — [ida, volta]
}
type Stage = { order: number; name: string; ties: Tie[] }
type Edge = { fromTieId: string; toTieId: string; teamId: string; slot: "home" | "away" }

const isPow2 = (n: number) => n > 0 && (n & (n - 1)) === 0
// Nome padrão de uma fase ausente, pela quantidade de times que ela teria (count confrontos → count*2 times).
const placeholderName = (count: number) =>
  count === 1 ? "Final" : count === 2 ? "Semifinais" : count === 4 ? "Quartas" : count === 8 ? "Oitavas" : `Últimos ${count * 2}`

export function CupBracket({ code }: { code: string }) {
  const { data, isPending } = useBracketQuery(code)

  if (isPending) return <BracketSkeleton />
  if (!data || data.stages.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">Chaveamento ainda não disponível.</p>
  }

  const stages = data.stages as Stage[]
  const edges = data.edges as Edge[]

  // Raiz do bracket "de verdade": 1ª fase com contagem potência de 2 (as anteriores são qualifying/entrada).
  const rootIdx = Math.max(0, stages.findIndex((s) => isPow2(s.ties.length)))
  const shown = stages.slice(rootIdx)
  const startCount = shown[0]?.ties.length ?? 1
  const totalCols = Math.max(1, Math.round(Math.log2(startCount)) + 1) // halving até 1
  const H = startCount * SLOT
  const W = totalCols * COL_W

  // Coluna de cada fase pelo tamanho (col = log2(startCount/count)); buracos = fases ausentes na fonte.
  const colOfOrder = new Map<number, number>()
  const stageByCol = new Map<number, Stage>()
  for (const s of shown) {
    const col = Math.round(Math.log2(startCount / Math.max(1, s.ties.length)))
    colOfOrder.set(s.order, col)
    stageByCol.set(col, s)
  }

  // Pais de cada confronto — SÓ entre as fases exibidas (senão a Round 3 herda pais da Round 2 fora do
  // bracket e a recursão desce pra fora, comprimindo os cards). Assim a fase-raiz exibida vira folha.
  const shownIds = new Set(shown.flatMap((s) => s.ties.map((t) => t.id)))
  const parentsOf = new Map<string, string[]>()
  for (const e of edges) {
    if (!shownIds.has(e.fromTieId) || !shownIds.has(e.toTieId)) continue
    parentsOf.set(e.toTieId, [...(parentsOf.get(e.toTieId) ?? []), e.fromTieId])
  }

  // Y (centro) de cada confronto por FAIXAS RECURSIVAS. O bracket é uma FLORESTA: cada "sink" (confronto
  // sem filho = a Final e, quando a fonte tem buraco tipo a semifinal ausente do Carabao, também os
  // órfãos) é raiz de uma árvore. Cada árvore ganha uma faixa vertical proporcional às suas folhas, e
  // dentro dela os pais dividem a faixa proporcionalmente → preenche a altura TODA sem sobrepor.
  const childOf = new Map<string, string>()
  for (const e of edges) childOf.set(e.fromTieId, e.toTieId)
  const allTies = shown.flatMap((s) => s.ties)
  const stageOrderOfTie = new Map<string, number>()
  for (const s of shown) for (const t of s.ties) stageOrderOfTie.set(t.id, s.order)
  const leafMemo = new Map<string, number>()
  const leafCount = (tieId: string): number => {
    const memo = leafMemo.get(tieId)
    if (memo != null) return memo
    const ps = parentsOf.get(tieId) ?? []
    const n = ps.length ? ps.reduce((a, p) => a + leafCount(p), 0) : 1
    leafMemo.set(tieId, n)
    return n
  }
  const cy = new Map<string, number>()
  const place = (tieId: string, top: number, bottom: number) => {
    if (cy.has(tieId)) return // guarda contra dup
    cy.set(tieId, (top + bottom) / 2)
    const ps = parentsOf.get(tieId) ?? []
    if (!ps.length) return
    const total = leafCount(tieId)
    let y = top
    for (const p of ps) {
      const h = (bottom - top) * (leafCount(p) / total)
      place(p, y, y + h)
      y += h
    }
  }
  // sinks (sem filho), Final (fase mais adiantada) primeiro; cada um leva uma faixa ∝ folhas.
  const sinks = allTies
    .filter((t) => !childOf.has(t.id))
    .sort((a, b) => (stageOrderOfTie.get(b.id) ?? 0) - (stageOrderOfTie.get(a.id) ?? 0))
  const totalLeaves = sinks.reduce((a, s) => a + leafCount(s.id), 0) || 1
  let bandTop = 0
  for (const s of sinks) {
    const h = (H * leafCount(s.id)) / totalLeaves
    place(s.id, bandTop, bandTop + h)
    bandTop += h
  }

  const xOf = (order: number) => (colOfOrder.get(order) ?? 0) * COL_W
  const tieCol = new Map<string, number>()
  for (const s of shown) for (const t of s.ties) tieCol.set(t.id, colOfOrder.get(s.order) ?? 0)
  const xRightOf = (tieId: string) => (tieCol.get(tieId) ?? 0) * COL_W + CARD_W
  const xLeftOf = (tieId: string) => (tieCol.get(tieId) ?? 0) * COL_W

  // Jogos das fases anteriores (qualifying/acesso, com byes) que não entram na chave — explica o total.
  const hiddenGames = stages.slice(0, rootIdx).reduce((a, s) => a + s.ties.length, 0)

  return (
    <div className="flex flex-col gap-2">
      {hiddenGames > 0 ? (
        <p className="text-xs text-muted-foreground">
          Chave a partir da <b className="text-foreground/80">{shown[0]?.name}</b> ({startCount} confrontos) — daqui até a final é mata-mata direto, sem bye.
          As fases anteriores (<b className="text-foreground/80">+{hiddenGames} jogos</b>) têm clubes de divisões inferiores entrando com byes e não formam chave.
        </p>
      ) : null}
      <div className="overflow-auto pb-4">
        <div className="relative" style={{ width: W, height: H + HEADER_H }}>
        {/* Cabeçalhos das fases */}
        {Array.from({ length: totalCols }).map((_, col) => {
          const s = stageByCol.get(col)
          return (
            <div
              key={col}
              className="absolute text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              style={{ left: col * COL_W, top: 0, width: CARD_W }}
            >
              {s ? s.name : placeholderName(Math.round(startCount / 2 ** col))}
              {s ? (
                <span className="ml-1 font-normal text-muted-foreground/60">· {s.ties.length}</span>
              ) : (
                <span className="ml-1 font-normal text-muted-foreground/40">· sem dados</span>
              )}
            </div>
          )
        })}

        {/* Fios de chave (pai → filho) */}
        <svg
          className="pointer-events-none absolute text-border"
          style={{ left: 0, top: HEADER_H }}
          width={W}
          height={H}
        >
          {edges.map((e, i) => {
            const py = cy.get(e.fromTieId)
            const cyy = cy.get(e.toTieId)
            if (py == null || cyy == null) return null
            const x1 = xRightOf(e.fromTieId)
            const x2 = xLeftOf(e.toTieId)
            const midX = (x1 + x2) / 2
            return (
              <path
                key={i}
                d={`M ${x1} ${py} H ${midX} V ${cyy} H ${x2}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
              />
            )
          })}
        </svg>

        {/* Confrontos */}
        <div className="absolute" style={{ left: 0, top: HEADER_H, width: W, height: H }}>
          {shown.flatMap((s) =>
            s.ties.map((t) => {
              const y = cy.get(t.id) ?? 0
              return (
                <div key={t.id} className="absolute" style={{ left: xOf(s.order), top: y - CARD_H / 2, width: CARD_W }}>
                  <TieCard tie={t} />
                </div>
              )
            }),
          )}
        </div>
      </div>
      </div>
    </div>
  )
}

function TieCard({ tie }: { tie: Tie }) {
  const penalties = /penalt/i.test(tie.resultInfo ?? "")
  // Ida/volta: cada time mostra DUAS colunas de placar à direita (mão 1, mão 2). Jogo único: uma coluna.
  const legs = tie.legs?.length === 2 ? tie.legs : null
  const homeGoals: (number | null)[] = legs ? [legs[0]![0], legs[1]![0]] : [tie.score?.[0] ?? null]
  const awayGoals: (number | null)[] = legs ? [legs[0]![1], legs[1]![1]] : [tie.score?.[1] ?? null]
  return (
    <Link
      href={`/matches/${tie.slug}`}
      className="block rounded-lg border border-border bg-card p-1.5 transition-colors hover:border-primary/50"
    >
      <TeamRow team={tie.home} goals={homeGoals} won={tie.winnerId === tie.home.id} />
      <TeamRow team={tie.away} goals={awayGoals} won={tie.winnerId === tie.away.id} />
      {penalties && !legs ? <div className="pl-6 text-[9px] leading-tight text-muted-foreground">nos pênaltis</div> : null}
    </Link>
  )
}

function TeamRow({ team, goals, won }: { team: TeamRef; goals: (number | null)[]; won: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 py-0.5 ${won ? "font-semibold" : "text-muted-foreground"}`}>
      {team.logoUrl ? (
        <img src={team.logoUrl} alt="" className="size-4 shrink-0 rounded-[3px] bg-white object-contain p-px" loading="lazy" />
      ) : (
        <div className="size-4 shrink-0" />
      )}
      <span className="flex-1 truncate text-[13px]">{team.name}</span>
      {goals.map((g, i) => (
        <span key={i} className="w-3 shrink-0 text-right text-[13px] tabular-nums">
          {g ?? "–"}
        </span>
      ))}
    </div>
  )
}

function BracketSkeleton() {
  return (
    <div className="flex gap-10 overflow-hidden pb-4">
      {Array.from({ length: 5 }).map((_, col) => (
        <div key={col} className="flex w-[188px] shrink-0 flex-col justify-around gap-3" style={{ height: 420 }}>
          {Array.from({ length: Math.max(1, 8 / 2 ** col) }).map((_, i) => (
            <Skeleton key={i} className="h-[56px] w-full rounded-lg bg-foreground/10" />
          ))}
        </div>
      ))}
    </div>
  )
}
