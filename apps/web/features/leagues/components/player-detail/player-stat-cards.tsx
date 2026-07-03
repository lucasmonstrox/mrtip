"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

import type { PlayerDetail } from "../../types"

// Cards temáticos de stats da season do jogador (Finalização/Criação/Construção/Defesa/Duelos/…)
// com barras empilhadas de composição e donuts de taxa. Paleta validada (dataviz): emerald = certeiro,
// amber = errado/fora, blue = terceiro segmento, slate = resto neutro; steps 600 no dark.

const SEG = {
  good: "bg-emerald-500 dark:bg-emerald-600",
  warn: "bg-amber-500 dark:bg-amber-600",
  info: "bg-blue-500 dark:bg-blue-600",
  rest: "bg-slate-300 dark:bg-slate-600",
} as const
type SegColor = keyof typeof SEG
const DOT = {
  good: "bg-emerald-500 dark:bg-emerald-600",
  warn: "bg-amber-500 dark:bg-amber-600",
  info: "bg-blue-500 dark:bg-blue-600",
  rest: "bg-slate-300 dark:bg-slate-600",
} as const

type Segment = { value: number; label: string; color: SegColor }

// Barra horizontal empilhada de composição (partes de um todo) com gap de 2px entre segmentos e
// legenda com valor por segmento — o rótulo visível é o "relief" exigido pelo contraste da paleta.
function CompBar({ segments }: { segments: Segment[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  if (total <= 0) return null
  const visible = segments.filter((s) => s.value > 0)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full">
        {visible.map((s) => (
          <div
            key={s.label}
            title={`${s.label}: ${s.value}`}
            className={`${SEG[s.color]} h-full rounded-full`}
            style={{ width: `${(s.value / total) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
        {visible.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className={`size-2 rounded-full ${DOT[s.color]}`} aria-hidden />
            {s.value} {s.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// Donut SVG de taxa única (0–100%): anel fino, valor no centro, texto em tokens de texto.
function Donut({ pct, label }: { pct: number; label: string }) {
  const r = 26
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, pct))
  return (
    <div className="flex flex-col items-center gap-1" title={`${label}: ${Math.round(clamped)}%`}>
      <svg width="68" height="68" viewBox="0 0 68 68" role="img" aria-label={`${label}: ${Math.round(clamped)}%`}>
        <circle cx="34" cy="34" r={r} fill="none" strokeWidth="6" className="stroke-muted" />
        <circle
          cx="34"
          cy="34"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${(clamped / 100) * c} ${c}`}
          transform="rotate(-90 34 34)"
          className="stroke-emerald-500 dark:stroke-emerald-600"
        />
        <text
          x="34"
          y="34"
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-foreground text-sm font-bold tabular-nums"
        >
          {Math.round(clamped)}%
        </text>
      </svg>
      <span className="max-w-20 text-center text-xs leading-tight text-muted-foreground">{label}</span>
    </div>
  )
}

function Num({ value, label }: { value: number; label: string }) {
  if (value <= 0) return null
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold tabular-nums">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  )
}

// Grid dos cards de stats da season. Cada card só aparece quando o grupo tem volume (um zagueiro não
// mostra "Goleiro"; um goleiro não mostra "Finalização" vazia).
export function PlayerStatCards({ player }: { player: PlayerDetail }) {
  const s = player.stats
  const duels = s.duelsWon + s.duelsLost
  const passePct =
    s.passes > 0 && s.passesAccurate > 0
      ? (s.passesAccurate / s.passes) * 100
      : (s.passesAccuratePctAvg ?? null)

  return (
    <>
      {s.shotsTotal > 0 ? (
        <StatCard title="Finalização">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold tabular-nums">{s.shotsTotal}</span>
              <span className="text-xs text-muted-foreground">chutes na temporada</span>
            </div>
            <Donut pct={(s.shotsOnTarget / s.shotsTotal) * 100} label="no alvo" />
          </div>
          <CompBar
            segments={[
              { value: s.shotsOnTarget, label: "no gol", color: "good" },
              { value: s.shotsOffTarget, label: "pra fora", color: "warn" },
              { value: s.shotsBlocked, label: "bloqueados", color: "info" },
            ]}
          />
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Num value={s.bigChancesMissed} label="grandes chances perdidas" />
            <Num value={s.offsides} label="impedimentos" />
          </div>
        </StatCard>
      ) : null}

      {s.chancesCreated + s.keyPasses + s.crossesTotal > 0 ? (
        <StatCard title="Criação">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Num value={s.chancesCreated} label="chances criadas" />
            <Num value={s.bigChancesCreated} label="grandes chances" />
            <Num value={s.keyPasses} label="passes-chave" />
            <Num value={s.passesFinalThird} label="passes no terço final" />
          </div>
          {s.crossesTotal > 0 ? (
            <CompBar
              segments={[
                { value: s.crossesAccurate, label: "cruzamentos certos", color: "good" },
                { value: s.crossesTotal - s.crossesAccurate, label: "errados", color: "rest" },
              ]}
            />
          ) : null}
        </StatCard>
      ) : null}

      {s.passes > 0 || s.touches > 0 ? (
        <StatCard title="Construção e posse">
          <div className="flex items-start justify-between gap-4">
            <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-3">
              <Num value={s.touches} label="toques" />
              <Num value={s.passes} label="passes" />
              <Num value={s.ballRecoveries} label="bolas recuperadas" />
              <Num value={s.possessionLost} label="posses perdidas" />
            </div>
            {passePct != null ? <Donut pct={passePct} label="precisão de passe" /> : null}
          </div>
          {s.longBalls > 0 ? (
            <CompBar
              segments={[
                { value: s.longBallsWon, label: "bolas longas certas", color: "good" },
                { value: Math.max(s.longBalls - s.longBallsWon, 0), label: "erradas", color: "rest" },
              ]}
            />
          ) : null}
          {s.dribbleAttempts > 0 ? (
            <CompBar
              segments={[
                { value: s.dribblesSuccessful, label: "dribles certos", color: "good" },
                {
                  value: Math.max(s.dribbleAttempts - s.dribblesSuccessful, 0),
                  label: "perdidos",
                  color: "rest",
                },
              ]}
            />
          ) : null}
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Num value={s.dispossessed} label="desarmado c/ bola" />
            <Num value={s.backwardPasses} label="passes pra trás" />
          </div>
        </StatCard>
      ) : null}

      {s.tackles + s.interceptions + s.clearances > 0 ? (
        <StatCard title="Defesa">
          {s.tackles > 0 && s.tacklesWon > 0 ? (
            <CompBar
              segments={[
                { value: s.tacklesWon, label: "desarmes ganhos", color: "good" },
                { value: Math.max(s.tackles - s.tacklesWon, 0), label: "perdidos", color: "rest" },
              ]}
            />
          ) : null}
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            {s.tacklesWon === 0 ? <Num value={s.tackles} label="desarmes" /> : null}
            <Num value={s.interceptions} label="interceptações" />
            <Num value={s.clearances} label="cortes" />
            <Num value={s.blockedShots} label="chutes bloqueados" />
            <Num value={s.dribbledPast} label="driblado" />
            <Num value={s.lastManTackle} label="desarme último homem" />
            <Num value={s.errorsLeadToShot} label="erros que viraram chute" />
          </div>
        </StatCard>
      ) : null}

      {duels > 0 || s.aerialsTotal > 0 ? (
        <StatCard title="Duelos">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold tabular-nums">{s.duelsTotal || duels}</span>
              <span className="text-xs text-muted-foreground">duelos na temporada</span>
            </div>
            {duels > 0 ? <Donut pct={(s.duelsWon / duels) * 100} label="aproveitamento" /> : null}
          </div>
          {duels > 0 ? (
            <CompBar
              segments={[
                { value: s.duelsWon, label: "ganhos", color: "good" },
                { value: s.duelsLost, label: "perdidos", color: "rest" },
              ]}
            />
          ) : null}
          {s.aerialsTotal > 0 ? (
            <CompBar
              segments={[
                { value: s.aerialsWon, label: "aéreos ganhos", color: "info" },
                { value: Math.max(s.aerialsTotal - s.aerialsWon, 0), label: "aéreos perdidos", color: "rest" },
              ]}
            />
          ) : null}
        </StatCard>
      ) : null}

      {player.season.yellow + player.season.red + s.fouls + s.foulsDrawn > 0 ? (
        <StatCard title="Disciplina">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Num value={s.fouls} label="faltas cometidas" />
            <Num value={s.foulsDrawn} label="faltas sofridas" />
            <div className="flex flex-col">
              <span className="flex items-center gap-2 text-xl font-bold tabular-nums">
                <span className="inline-block h-4 w-3 rounded-[2px] bg-amber-400" aria-hidden />
                {player.season.yellow}
                <span className="ml-2 inline-block h-4 w-3 rounded-[2px] bg-red-500" aria-hidden />
                {player.season.red}
              </span>
              <span className="text-xs text-muted-foreground">cartões</span>
            </div>
          </div>
        </StatCard>
      ) : null}

      {s.saves > 0 || s.goodHighClaim > 0 ? (
        <StatCard title="Goleiro">
          <div className="grid grid-cols-3 gap-x-4 gap-y-3">
            <Num value={s.saves} label="defesas" />
            <Num value={s.savesInsidebox} label="defesas na área" />
            <Num value={s.goodHighClaim} label="saídas pelo alto" />
          </div>
        </StatCard>
      ) : null}
    </>
  )
}
