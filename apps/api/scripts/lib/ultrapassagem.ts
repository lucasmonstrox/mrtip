/**
 * Cenário de ultrapassagem entre dois times na cadeia de desempate da temporada.
 *
 * Extraído do `prognosis-prompt.ts` em 2026-07-21 para virar TESTÁVEL: lá dentro a lógica dependia do
 * escopo de uma partida (tabela, cutoff e helpers todos no topo do script, que termina em `process.exit`),
 * então não havia como validar os cenários contra o que de fato aconteceu. Aqui é função pura — recebe as
 * duas linhas e a regra, devolve veredito ESTRUTURADO (assertável) + o texto para o prompt.
 *
 * Regra do desempate: vem da temporada (LIG-017). A SportMonks entrega só o RÓTULO da regra (um nome, ex.
 * "Points Wins Balance Scored"), nunca a cascata completa — então a lista de critérios é curada e sempre
 * termina antes do fim do regulamento real. `via: "indefinido"` existe para esse caso: os dois times
 * empatam em TUDO que sabemos calcular, e mentir um vencedor seria pior que declarar o limite.
 */

export type TeamLine = {
  teamId: string
  name: string
  pos: number // 1-based
  points: number
  won: number
  gd: number
  gf: number
  gamesRemaining: number
}

export type Via = "pontos" | "vitorias" | "saldo" | "golsPro" | "impossivel" | "indefinido"

/** Números intermediários da decisão — expostos para AUDITORIA: sem eles, conferir o veredito na mão
 * exige refazer a conta de cabeça. É o que permite validar o relatório linha a linha. */
export type Contas = {
  chaserMax: number // pontos do perseguidor vencendo tudo
  alvoMin: number // pontos do alvo perdendo tudo
  chaserVitorias: number | null // vitórias do perseguidor vencendo tudo (null se a regra não usa)
  alvoVitorias: number | null
  gapSaldo: number // saldo do alvo − saldo do perseguidor (positivo = alvo à frente)
  chaserGf: number
  alvoGf: number
}

export type Cenario = {
  chaser: string
  alvo: string
  /** true se o perseguidor PODE terminar à frente em algum cenário matematicamente possível */
  possivel: boolean
  /** em qual critério a disputa se decide no cenário-limite */
  via: Via
  /** swing de gols necessário quando `via` é "saldo" (0 = já está à frente ou empatado) */
  swingNecessario: number | null
  contas: Contas
  texto: string
}

const sg = (n: number) => (n >= 0 ? `+${n}` : `${n}`)

/**
 * `chaser` tenta terminar à frente de `alvo`. Avalia o CENÁRIO-LIMITE: o perseguidor vence tudo que resta
 * e o alvo perde tudo. Se nem assim alcança, é impossível — e é o único caso em que devolve `possivel:false`.
 *
 * `fichaDe` escolhe quem ganha o cartão de números no texto: olhando pra baixo o desconhecido é o
 * perseguidor; olhando pra cima o perseguidor é sempre o próprio time e repetir a ficha dele vira ruído.
 */
export function cenarioUltrapassagem(
  chaser: TeamLine,
  alvo: TeamLine,
  tiebreak: readonly string[],
  fichaDe: "chaser" | "alvo" = "chaser",
): Cenario | null {
  const usaVitorias = tiebreak.includes("wins")
  const cMax = chaser.points + 3 * chaser.gamesRemaining
  const tMin = alvo.points // alvo perde tudo
  const cCongelado = chaser.gamesRemaining === 0
  const tCongelado = alvo.gamesRemaining === 0

  const contas: Contas = {
    chaserMax: cMax,
    alvoMin: tMin,
    chaserVitorias: usaVitorias ? chaser.won + chaser.gamesRemaining : null,
    alvoVitorias: usaVitorias ? alvo.won : null,
    gapSaldo: alvo.gd - chaser.gd,
    chaserGf: chaser.gf,
    alvoGf: alvo.gf,
  }
  const base = { chaser: chaser.name, alvo: alvo.name, contas }
  if (cMax < tMin) return null // nem no cenário-limite alcança — não é ameaça nem alvo

  const ficha =
    fichaDe === "chaser"
      ? `**${chaser.name}** (${chaser.pos}º · ${chaser.points} pts${cCongelado ? " — **JÁ ENCERROU**, congelado" : `, máx ${cMax}`}${usaVitorias ? ` · ${chaser.won} V` : ""} · SG ${sg(chaser.gd)} · ${chaser.gf} GP)`
      : `**${alvo.name}** (${alvo.pos}º · ${alvo.points} pts${tCongelado ? " — **JÁ ENCERROU**, congelado" : `, mín ${tMin}`}${usaVitorias ? ` · ${alvo.won} V` : ""} · SG ${sg(alvo.gd)} · ${alvo.gf} GP)`

  if (cMax > tMin) {
    const folga = cMax - tMin
    return {
      ...base,
      possivel: true,
      via: "pontos",
      swingNecessario: null,
      texto: cCongelado
        ? `${ficha} → **${chaser.name} já está ${folga} ponto(s) à frente** de ${alvo.name} (${chaser.points} vs ${alvo.points}) e não joga mais: **${alvo.name} precisa somar ${folga === 1 ? "1 ponto (empate basta)" : `${folga} pontos (só a vitória)`}**. Alvo FIXO, sem cenário.`
        : `${ficha} → **${chaser.name} passa em PONTOS** (${chaser.name} ${cMax} vs ${alvo.name} ${tMin}), sem depender de desempate. Basta ${chaser.name} vencer ${chaser.gamesRemaining > 1 ? "o que resta" : "seu jogo"} e ${alvo.name} não somar ${folga} ponto(s).`,
    }
  }

  // cMax === tMin: empate em pontos no cenário-limite → percorre a cadeia.
  const passos = [`empata em ${tMin} pts (só se ${alvo.name} perder${alvo.gamesRemaining > 1 ? " tudo" : ""}${cCongelado ? "" : ` e ${chaser.name} vencer`})`]

  if (usaVitorias) {
    const tV = alvo.won // perdendo, não soma vitória
    const cV = chaser.won + chaser.gamesRemaining // vencendo tudo
    if (cV > tV)
      return { ...base, possivel: true, via: "vitorias", swingNecessario: null, texto: `${ficha} → ${passos[0]}; aí **${chaser.name} PASSA POR VITÓRIAS** (${chaser.name} ${cV} vs ${alvo.name} ${tV}) — resolvido antes do saldo, **não precisa de gol nenhum**.` }
    if (cV < tV)
      return { ...base, possivel: false, via: "vitorias", swingNecessario: null, texto: `${ficha} → ${passos[0]}, mas **${chaser.name} PERDE nas vitórias** (${chaser.name} ${cV} vs ${alvo.name} ${tV}), e vitórias vêm ANTES do saldo → **${chaser.name} não ultrapassa ${alvo.name}**, nem goleando.` }
    passos.push(`vitórias empatam (${chaser.name} ${cV} x ${alvo.name} ${tV}) → vai pro saldo`)
  }

  // Saldo: o alvo perde por x, o perseguidor vence por y → vira se (x + y) > gap.
  const gap = alvo.gd - chaser.gd
  if (gap < 0)
    return { ...base, possivel: true, via: "saldo", swingNecessario: 0, texto: `${ficha} → ${passos.join("; ")}; e **${chaser.name} já está ${sg(-gap)} de saldo À FRENTE** (${chaser.name} ${sg(chaser.gd)} vs ${alvo.name} ${sg(alvo.gd)}) → **${chaser.name} PASSA com qualquer 1-0**, sem goleada. Pra ${alvo.name} segurar, o jeito é pontuar — não adianta perder "por pouco".` }
  if (gap === 0) {
    // Saldo empatado: decide gols pró; se ESSES também empatarem, acabou o que sabemos calcular.
    const via: Via = chaser.gf === alvo.gf ? "indefinido" : "golsPro"
    return {
      ...base,
      possivel: chaser.gf > alvo.gf,
      via,
      swingNecessario: 0,
      texto: `${ficha} → ${passos.join("; ")}; saldo **EMPATADO** (${sg(chaser.gd)}) → decide gols pró (${chaser.name} ${chaser.gf} vs ${alvo.name} ${alvo.gf})${via === "indefinido" ? " — que também **EMPATAM**: desfecho **INDEFINIDO** pelo que sabemos calcular." : chaser.gf > alvo.gf ? `, e **${chaser.name} leva**.` : `, e **${alvo.name} se segura**.`}`,
    }
  }
  if (cCongelado || tCongelado) {
    const quem = cCongelado ? chaser.name : alvo.name
    return { ...base, possivel: true, via: "saldo", swingNecessario: gap + 1, texto: `${ficha} → ${passos.join("; ")}; **${quem} não joga mais** e ${alvo.name} tem **${gap} de saldo de vantagem** sobre ${chaser.name} (${alvo.name} ${sg(alvo.gd)} vs ${chaser.name} ${sg(chaser.gd)}) → dá pra ${alvo.name} **perder por até ${gap} de diferença** e ainda ficar à frente; por **${gap + 1}+** ${alvo.name} cai. Empatando o saldo, decide gols pró (${alvo.name} ${alvo.gf} vs ${chaser.name} ${chaser.gf}).` }
  }
  const perde = Math.max(1, Math.ceil((gap + 1) / 2))
  return {
    ...base,
    possivel: true,
    via: "saldo",
    swingNecessario: gap + 1,
    texto: `${ficha} → ${passos.join("; ")}; ${alvo.name} tem **${gap} de saldo de vantagem** sobre ${chaser.name} (${alvo.name} ${sg(alvo.gd)} vs ${chaser.name} ${sg(chaser.gd)}) → **${chaser.name} só ultrapassa** se a soma (gols que ${alvo.name} tomar de diferença + gols que ${chaser.name} vencer de diferença) passar de **${gap}** — ex.: ${alvo.name} perder por ${perde} e ${chaser.name} vencer por ${gap + 1 - perde}. ${gap >= 5 ? `**Swing de ${gap + 1} gols é praticamente inviável** — ameaça remota, não motivação real. ` : ""}Empatando o saldo, decide gols pró (${chaser.name} ${chaser.gf} vs ${alvo.name} ${alvo.gf}).`,
  }
}

/** Comparação direta critério a critério entre dois times, NA ORDEM do desempate da temporada.
 * Existe porque "quem está na frente" é uma pergunta de cascata, não de um número: dois times podem ter
 * o mesmo ponto e a disputa se resolver em vitórias, e mostrar só a diferença de pontos esconde isso.
 * `decisivo` marca o PRIMEIRO critério em que eles diferem — é ali que a posição se decide hoje. */
export type LinhaComparacao = { criterio: string; rotulo: string; a: number; b: number; gap: number; decisivo: boolean }

const CRIT_ROTULO: Record<string, string> = {
  points: "Pontos", wins: "Vitórias", goalDifference: "Saldo de gols", goalsFor: "Gols pró",
}

export function compararTimes(a: TeamLine, b: TeamLine, tiebreak: readonly string[]): LinhaComparacao[] {
  const val = (t: TeamLine, c: string) => (c === "points" ? t.points : c === "wins" ? t.won : c === "goalDifference" ? t.gd : c === "goalsFor" ? t.gf : 0)
  let jaDecidiu = false
  return tiebreak.map((c) => {
    const va = val(a, c), vb = val(b, c)
    const decisivo = !jaDecidiu && va !== vb
    if (decisivo) jaDecidiu = true
    return { criterio: c, rotulo: CRIT_ROTULO[c] ?? c, a: va, b: vb, gap: va - vb, decisivo }
  })
}

/** Ordena pela cadeia de desempate da temporada. Espelha o `tiebreakComparator` do módulo de ligas. */
export function ordenar<T extends { points: number; won: number; gd: number; gf: number }>(linhas: T[], tiebreak: readonly string[]): T[] {
  const val = (l: T, c: string) => (c === "points" ? l.points : c === "wins" ? l.won : c === "goalDifference" ? l.gd : c === "goalsFor" ? l.gf : 0)
  return [...linhas].sort((a, b) => {
    for (const c of tiebreak) {
      const d = val(b, c) - val(a, c)
      if (d !== 0) return d
    }
    return 0
  })
}
