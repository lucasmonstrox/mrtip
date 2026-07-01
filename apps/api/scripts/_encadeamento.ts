// Investiga o ENCADEAMENTO do bracket: cada confronto de uma stage alimenta qual da stage seguinte?
// Mede a integridade da árvore — quantos confrontos-filho têm exatamente 2 "pais" (chaveamento limpo)
// vs 1 (um lado é entrante novo) vs 0 (os dois entram ali). E traça o caminho do CAMPEÃO de trás pra
// frente pra mostrar o encadeamento concreto. Run: bun run scripts/_encadeamento.ts FAC
import { getBracket } from "../src/modules/leagues/bracket/bracket.service"

const code = process.argv[2] ?? "FAC"
const b = await getBracket(code, {}) // proper (type 224) por default

// edges: fromTie (stage N) → toTie (stage N+1). Conta quantos "pais" cada confronto-filho recebe.
const parentsOf = new Map<string, string[]>() // childTieId → [parentTieId...]
for (const e of b.edges) parentsOf.set(e.toTieId, [...(parentsOf.get(e.toTieId) ?? []), e.fromTieId])

console.log(`\n🔗 ${b.league.name} ${b.season} — encadeamento (proper) · ${b.stages.length} stages, ${b.edges.length} edges\n`)
for (let i = 0; i < b.stages.length; i++) {
  const st = b.stages[i]!
  const decided = st.ties.filter((t) => t.winnerId).length
  if (i === 0) {
    console.log(`[${st.order}] ${st.name}: ${st.ties.length} confrontos · ${decided} decididos · (raiz — sem pais)`)
    continue
  }
  let two = 0, one = 0, zero = 0, more = 0
  for (const t of st.ties) {
    const n = (parentsOf.get(t.id) ?? []).length
    if (n === 2) two++
    else if (n === 1) one++
    else if (n === 0) zero++
    else more++
  }
  const clean = two === st.ties.length ? " ✅ ÁRVORE LIMPA" : ""
  console.log(`[${st.order}] ${st.name}: ${st.ties.length} confrontos · ${decided} decididos · pais: 2→${two} 1→${one} 0→${zero} 3+→${more}${clean}`)
}

// Caminho do campeão: da Final pra trás, seguindo o confronto (pai) que o campeão venceu em cada rodada.
const tieById = new Map(b.stages.flatMap((s) => s.ties).map((t) => [t.id, t]))
const final = b.stages.at(-1)?.ties[0]
if (final) {
  const champ = final.winnerId
  const champName = champ === final.home.id ? final.home.name : final.away.name
  console.log(`\n🏆 campeão: ${champName} — caminho (Final → trás):`)
  let cur: (typeof final) | undefined = final
  while (cur) {
    const sc = cur.score ? `${cur.score[0]}x${cur.score[1]}` : "-"
    console.log(`   ${cur.home.name} ${sc} ${cur.away.name}`)
    const parents = (parentsOf.get(cur.id) ?? []).map((pid) => tieById.get(pid))
    cur = parents.find((p) => p && p.winnerId === champ) ?? undefined
  }
}
process.exit(0)
