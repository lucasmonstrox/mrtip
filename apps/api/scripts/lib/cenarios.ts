/**
 * Motor de cenários de classificação: dado um estado de tabela e os jogos que faltam, responde
 * "se eu vencer/empatar/perder, que posição eu GARANTO e qual posso ALCANÇAR" — e quem exatamente
 * está em disputa com você.
 *
 * Por que enumerar em vez de deduzir: rivais NÃO são independentes. Dois perseguidores que jogam entre si
 * não podem os dois te passar; o seu próprio adversário da rodada tem o resultado amarrado ao seu. Qualquer
 * raciocínio par-a-par erra esses casos, e eles são exatamente os que decidem tabela em reta final.
 *
 * A FRONTEIRA QUE MUDA POR LIGA (o ponto não-óbvio): um cenário de V/E/D determina pontos e vitórias, mas
 * NÃO determina gols. Como a cadeia de desempate varia por liga, varia também até onde o cenário consegue
 * decidir sozinho:
 *   Brasileirão (pontos → vitórias → saldo → gols pró): decide até vitórias.
 *   Premier League (pontos → saldo → gols pró):         decide só pontos.
 * Ou seja, na PL um empate em pontos JÁ depende de gol; no Brasileirão ainda passa por vitórias. O motor
 * calcula essa fronteira a partir da regra da temporada em vez de assumir.
 *
 * E é por isso que GOL NUNCA ENTRA NA CONTAGEM DE POSIÇÃO. Se o piso resolvesse empates pelo saldo atual,
 * ele diria "garante 6º" num caso em que um rival empatado em pontos e vitórias passa marcando mais gol —
 * uma garantia falsa. Aqui: empatado conta CONTRA no piso e A FAVOR no teto, e o gol vira anotação por
 * rival ("ele te passa se vencer por 2 a mais que você").
 */

export type EstadoTime = { teamId: string; name: string; points: number; won: number; gd: number; gf: number }
export type Jogo = { homeId: string; awayId: string }

/** Critérios que um cenário de V/E/D consegue determinar sozinho. O resto exige placar. */
const ENUMERAVEIS = new Set(["points", "wins"])

export type Relacao = "abaixo" | "empatado" | "acima"

/** Ramo do confronto direto: o que ACONTECE com o rival em cada resultado do alvo. Não é cenário
 * provável, é consequência — quando o rival é o seu adversário, o resultado dele é o seu invertido.
 * É o acoplamento mais forte da tabela e o único em que "se eu vencer, ele está eliminado" é CERTEZA. */
export type RamoConfronto = {
  resultado: "vitoria" | "empate" | "derrota"
  alvoPts: number
  rivalPts: number
  /** posição do rival vs o alvo depois deste resultado, pelo prefixo enumerável */
  fica: "a frente" | "empatado (decide no gol)" | "atras"
}

export type Rival = {
  teamId: string
  name: string
  /** posição relativa HOJE, pelo prefixo enumerável do desempate */
  relacao: Relacao
  /** joga contra o time-alvo nesta rodada (acoplamento total) */
  confrontoDireto: boolean
  /** existe cenário em que termina à frente do alvo */
  podeFicarAFrente: boolean
  /** existe cenário em que termina atrás do alvo */
  podeFicarAtras: boolean
  /** existe cenário em que empata com o alvo em TUDO que o cenário decide → resolve no gol */
  dependeDeGol: boolean
  /** preenchido só quando `confrontoDireto`: o desfecho dele em cada resultado do alvo */
  ramos?: RamoConfronto[]
}

export type Desfecho = {
  resultado: "vitoria" | "empate" | "derrota"
  /** pior posição possível (empatados-por-gol contam CONTRA) */
  piso: number
  /** melhor posição possível (empatados-por-gol contam A FAVOR) */
  teto: number
  cenarios: number
}

/** Dois rivais do alvo que se enfrentam entre si. A enumeração já respeita esse acoplamento no cálculo,
 * mas ele precisa ser DITO: é a diferença entre "dois times podem me passar" e "no máximo um deles pode".
 * Quando os dois estão abaixo, o jogo entre eles é uma trava natural — só um soma 3, e um empate deixa
 * ambos a 1 ponto. Quando os dois estão acima, alguém obrigatoriamente cede pontos, e isso joga a favor
 * do alvo sem ele fazer nada. */
export type ConfrontoEntreRivais = {
  aNome: string
  bNome: string
  aRelacao: Relacao
  bRelacao: Relacao
  efeito: string
}

/** Uma célula da matriz de dependência: MEU resultado × o resultado dos jogos que me afetam → onde eu
 * termino. É a resposta a "e se o jogo do Bahia empatar?" — a pergunta que ninguém consegue responder
 * olhando rival por rival, porque a resposta depende da combinação, não de cada um isolado.
 * `posMin === posMax` = posição determinada; diferente = ainda depende de gol. */
export type CelulaMatriz = {
  meuResultado: "vitoria" | "empate" | "derrota"
  /** rótulo legível de cada jogo relevante e o resultado assumido nesta célula */
  outros: { jogo: string; resultado: "casa vence" | "empate" | "fora vence" }[]
  posMin: number
  posMax: number
  dependeDeGol: boolean
}

export type Analise = {
  alvo: string
  /** true quando a enumeração cobriu todos os jogos que podem afetar o alvo */
  exata: boolean
  jogosEnumerados: number
  /** leitura de intenção derivada dos cenários — é a evidência de "pode jogar tranquilo" ou "tem que ir".
   * `travado` = a posição não muda faça o que fizer (ninguém alcança, ninguém é alcançado): o time
   * literalmente não tem o que ganhar nem perder na tabela. É o insumo que faltava pro prompt distinguir
   * "administra" de "não tem nada em jogo" — dois estados que produzem jogos MUITO diferentes. */
  situacao: "travado" | "so_defende" | "so_ataca" | "dois_lados"
  /** posições que o time pode ocupar considerando TODOS os resultados dele */
  faixaPossivel: { melhor: number; pior: number }
  desfechos: Desfecho[]
  rivais: Rival[]
  /** jogos ENTRE rivais do alvo — o acoplamento que impede dois perseguidores de somarem juntos */
  entreRivais: ConfrontoEntreRivais[]
  /** matriz completa MEU resultado × resultados dos jogos relevantes. Só é preenchida quando cabe na
   * tela (≤2 jogos relevantes = até 27 células); acima disso vira ruído e o piso/teto já resume. */
  matriz: CelulaMatriz[]
  /** rótulos dos jogos relevantes, na ordem usada nas células da matriz */
  jogosRelevantes: string[]
}

const chaveEnum = (t: { points: number; won: number }, criterios: string[]) =>
  criterios.map((c) => (c === "points" ? t.points : t.won)).join(":")

/** Compara dois times SÓ pelo prefixo enumerável. >0 = `a` à frente, 0 = empate (decide no gol). */
function cmpEnum(a: { points: number; won: number }, b: { points: number; won: number }, criterios: string[]): number {
  for (const c of criterios) {
    const d = (c === "points" ? a.points - b.points : a.won - b.won)
    if (d !== 0) return d
  }
  return 0
}

export function analisarCenarios(opts: {
  times: EstadoTime[]
  jogos: Jogo[]
  tiebreak: readonly string[]
  alvoId: string
  /** teto de jogos a enumerar; acima disso o resultado vira LIMITE declarado, não verdade */
  maxJogos?: number
}): Analise {
  const { times, jogos, tiebreak, alvoId, maxJogos = 14 } = opts
  const alvo = times.find((t) => t.teamId === alvoId)
  if (!alvo) throw new Error(`time ${alvoId} não está na tabela`)
  // Prefixo enumerável: para no primeiro critério que exige gols. É aqui que a regra da liga entra.
  const criterios: string[] = []
  for (const c of tiebreak) {
    if (!ENUMERAVEIS.has(c)) break
    criterios.push(c)
  }

  const jogosDoAlvo = jogos.filter((j) => j.homeId === alvoId || j.awayId === alvoId)
  const outros = jogos.filter((j) => j.homeId !== alvoId && j.awayId !== alvoId)

  // Só interessa enumerar jogos de times que PODEM cruzar com o alvo. Um time que termina acima (ou abaixo)
  // em qualquer cenário contribui com uma constante à posição — o resultado dele não muda nada pro alvo.
  // Sem esse corte, meio de temporada seria 3^100. Com ele, costuma cair pra menos de 3^8.
  const maxPts = (t: EstadoTime) => t.points + 3 * jogos.filter((j) => j.homeId === t.teamId || j.awayId === t.teamId).length
  const alvoMax = maxPts(alvo)
  const relevantes = new Set(
    times.filter((t) => t.teamId !== alvoId && maxPts(t) >= alvo.points && t.points <= alvoMax).map((t) => t.teamId),
  )
  const enumerar = outros.filter((j) => relevantes.has(j.homeId) || relevantes.has(j.awayId))
  const exata = enumerar.length <= maxJogos
  const usar = exata ? enumerar : enumerar.slice(0, maxJogos)
  // O excedente do teto NÃO some: cai no balde relaxado (pior caso), senão a ameaça é subestimada em
  // silêncio — que é pior que um limite largo declarado. @feature MOD-004
  const relaxados = [...outros.filter((j) => !enumerar.includes(j)), ...enumerar.slice(usar.length)]

  type Agg = { points: number; won: number }
  const base = new Map<string, Agg>(times.map((t) => [t.teamId, { points: t.points, won: t.won }]))
  // Jogos relaxados: no pior caso pro alvo, os dois lados somam o máximo que conseguem. É um limite
  // superior de ameaça — declarado como tal, nunca vendido como exato.
  const bonusRelaxado = new Map<string, number>()
  for (const j of relaxados) {
    bonusRelaxado.set(j.homeId, (bonusRelaxado.get(j.homeId) ?? 0) + 3)
    bonusRelaxado.set(j.awayId, (bonusRelaxado.get(j.awayId) ?? 0) + 3)
  }

  const rivalInfo = new Map<string, { aFrente: boolean; atras: boolean; gol: boolean }>()
  for (const t of times) if (t.teamId !== alvoId) rivalInfo.set(t.teamId, { aFrente: false, atras: false, gol: false })

  const RESULTADOS: Desfecho["resultado"][] = jogosDoAlvo.length ? ["vitoria", "empate", "derrota"] : ["empate"]
  const desfechos: Desfecho[] = []
  const nomePorId = new Map(times.map((t) => [t.teamId, t.name]))
  const rotuloJogo = (j: Jogo) => `${nomePorId.get(j.homeId) ?? "?"} × ${nomePorId.get(j.awayId) ?? "?"}`
  // Matriz só quando cabe na tela: 2 jogos = 3 × 9 = 27 células. Acima disso o grid vira ruído e a faixa
  // piso/teto já resume melhor.
  const guardarMatriz = usar.length <= 2
  const matriz: CelulaMatriz[] = []

  for (const res of RESULTADOS) {
    let piso = 1
    let teto = times.length
    let n = 0

    // Fixa o resultado do alvo — o que AMARRA o adversário direto dele automaticamente.
    const aplicarAlvo = (m: Map<string, Agg>) => {
      for (const j of jogosDoAlvo) {
        const rivalId = j.homeId === alvoId ? j.awayId : j.homeId
        const a = m.get(alvoId)!, r = m.get(rivalId)!
        if (res === "vitoria") { a.points += 3; a.won += 1 }
        else if (res === "empate") { a.points += 1; r.points += 1 }
        else { r.points += 3; r.won += 1 }
      }
    }

    const total = Math.pow(3, usar.length)
    for (let mask = 0; mask < total; mask++) {
      const m = new Map<string, Agg>([...base].map(([k, v]) => [k, { ...v }]))
      aplicarAlvo(m)
      let x = mask
      for (const j of usar) {
        const r = x % 3
        x = Math.floor(x / 3)
        const h = m.get(j.homeId)!, a = m.get(j.awayId)!
        if (r === 0) { h.points += 3; h.won += 1 }
        else if (r === 1) { h.points += 1; a.points += 1 }
        else { a.points += 3; a.won += 1 }
      }
      const eu = m.get(alvoId)!
      // `acima` começa em ZERO e o loop abaixo conta TODO mundo, relevante ou não. Uma versão anterior
      // semeava isto com os "fixos acima" e depois os recontava no loop (eles não são pulados) — o piso
      // de um time de meio de tabela inflava pelo número de times já garantidos acima dele. Contagem
      // única, num lugar só. @feature MOD-004
      let acima = 0
      let empatados = 0
      for (const t of times) {
        if (t.teamId === alvoId) continue
        const o = m.get(t.teamId)!
        // Time relaxado entra no pior caso (soma tudo) — limite superior de ameaça.
        const oAjustado = relevantes.has(t.teamId) ? o : { points: o.points + (bonusRelaxado.get(t.teamId) ?? 0), won: o.won }
        const d = cmpEnum(oAjustado, eu, criterios)
        const info = rivalInfo.get(t.teamId)!
        if (d > 0) { acima++; info.aFrente = true }
        else if (d === 0) { empatados++; info.gol = true; info.aFrente = true; info.atras = true }
        else info.atras = true
      }
      piso = Math.max(piso, 1 + acima + empatados) // empatado conta CONTRA
      teto = Math.min(teto, 1 + acima) // empatado conta A FAVOR
      // Guarda a célula: é o que permite responder "e se AQUELE jogo empatar?" em vez de só dar a faixa.
      // Piso/teto resumem; a matriz mostra QUAL combinação produz cada desfecho — que é a pergunta real
      // de quem vai assistir dois jogos ao mesmo tempo. @feature MOD-004
      if (guardarMatriz) {
        const outrosRot = usar.map((j, i) => {
          const r = Math.floor(mask / Math.pow(3, i)) % 3
          return { jogo: rotuloJogo(j), resultado: (r === 0 ? "casa vence" : r === 1 ? "empate" : "fora vence") as CelulaMatriz["outros"][number]["resultado"] }
        })
        matriz.push({ meuResultado: res, outros: outrosRot, posMin: 1 + acima, posMax: 1 + acima + empatados, dependeDeGol: empatados > 0 })
      }
      n++
    }
    desfechos.push({ resultado: res, piso, teto, cenarios: n })
  }

  const chaveAlvo = chaveEnum(alvo, criterios)
  const rivais: Rival[] = times
    .filter((t) => t.teamId !== alvoId)
    .map((t) => {
      const info = rivalInfo.get(t.teamId)!
      const d = cmpEnum(t, alvo, criterios)
      const confrontoDireto = jogosDoAlvo.some((j) => j.homeId === t.teamId || j.awayId === t.teamId)
      // Confronto direto: calcula os três ramos de verdade, sem enumerar — o resultado do rival É o do
      // alvo invertido, então cada ramo é uma conta fechada. É o que transforma "pode te passar" em
      // "só te passa se você perder pra ele".
      const ramos: RamoConfronto[] | undefined = confrontoDireto
        ? (["vitoria", "empate", "derrota"] as const).map((res) => {
            const eu = { points: alvo.points, won: alvo.won }
            const ele = { points: t.points, won: t.won }
            if (res === "vitoria") { eu.points += 3; eu.won += 1 }
            else if (res === "empate") { eu.points += 1; ele.points += 1 }
            else { ele.points += 3; ele.won += 1 }
            const c = cmpEnum(ele, eu, criterios)
            return {
              resultado: res,
              alvoPts: eu.points,
              rivalPts: ele.points,
              fica: (c > 0 ? "a frente" : c === 0 ? "empatado (decide no gol)" : "atras") as RamoConfronto["fica"],
            }
          })
        : undefined
      return {
        teamId: t.teamId,
        name: t.name,
        relacao: (d > 0 ? "acima" : d < 0 ? "abaixo" : "empatado") as Relacao,
        confrontoDireto,
        ramos,
        podeFicarAFrente: info.aFrente,
        podeFicarAtras: info.atras,
        dependeDeGol: info.gol || chaveEnum(t, criterios) === chaveAlvo,
      }
    })
    // Filtro por possibilidade REAL na direção que interessa, não por "aparece em algum cenário".
    // Sem isto, "abaixo" listava a tabela inteira (todo mundo pode terminar atrás de você) e "acima"
    // listava times que o alvo não alcança — 15 ameaças onde existem 2. Quem está abaixo só é ameaça
    // se PODE FICAR À FRENTE; quem está acima só é alvo se PODE FICAR ATRÁS; empatado é bidirecional
    // por definição e entra sempre. @feature MOD-004
    .filter((r) => (r.relacao === "abaixo" ? r.podeFicarAFrente : r.relacao === "acima" ? r.podeFicarAtras : true))
    .sort((a, b) => {
      const ord = { abaixo: 0, empatado: 1, acima: 2 } as const
      return ord[a.relacao] - ord[b.relacao] || a.name.localeCompare(b.name)
    })

  // Confrontos ENTRE rivais. Só interessam os que ficaram na lista final (ameaça/alvo real) — jogo entre
  // dois times irrelevantes não muda nada pro alvo e só faria ruído.
  const porId = new Map(rivais.map((r) => [r.teamId, r]))
  const entreRivais: ConfrontoEntreRivais[] = outros
    .filter((j) => porId.has(j.homeId) && porId.has(j.awayId))
    .map((j) => {
      const a = porId.get(j.homeId)!
      const b = porId.get(j.awayId)!
      const ambosAbaixo = a.relacao !== "acima" && b.relacao !== "acima"
      const ambosAcima = a.relacao === "acima" && b.relacao === "acima"
      const efeito = ambosAbaixo
        ? `os dois te perseguem e se enfrentam → **no máximo UM soma 3**; se empatarem, os dois somam só 1. É uma trava natural a seu favor: **não existe cenário em que os dois te passem vencendo**.`
        : ambosAcima
          ? `os dois estão à sua frente e se enfrentam → **alguém obrigatoriamente cede pontos** (ou os dois, se empatarem). Joga a seu favor sem você fazer nada.`
          : `um está à sua frente e o outro atrás, e eles se enfrentam → o resultado **move os dois na mesma jogada**, em direções opostas. Cenário que comprime a tabela em volta de você.`
      return { aNome: a.name, bNome: b.name, aRelacao: a.relacao, bRelacao: b.relacao, efeito }
    })

  // Situação: sai da faixa de posições possíveis somando TODOS os desfechos. Se melhor === pior, a posição
  // está travada e o time não tem o que ganhar nem perder — o que é diferente de "administra" (esse ainda
  // tem o que perder). Confundir os dois foi o que fez o prompt tratar time sem nada em jogo como time
  // cauteloso. @feature MOD-004
  const melhor = Math.min(...desfechos.map((d) => d.teto))
  const pior = Math.max(...desfechos.map((d) => d.piso))
  const podeSubir = rivais.some((r) => r.relacao === "acima" && r.podeFicarAtras) || melhor < pior
  const podeCair = rivais.some((r) => r.relacao !== "acima" && r.podeFicarAFrente)
  const situacao: Analise["situacao"] =
    melhor === pior ? "travado" : podeSubir && podeCair ? "dois_lados" : podeCair ? "so_defende" : "so_ataca"

  return {
    alvo: alvo.name, exata, jogosEnumerados: usar.length, situacao, faixaPossivel: { melhor, pior },
    desfechos, rivais, entreRivais, matriz, jogosRelevantes: usar.map(rotuloJogo),
  }
}
