import { sm } from "../src/lib/sportmonks"

// O catálogo /core/types diz que 571 (Error Lead To Goal), 114 (Penalties Committed),
// 324 (Own Goals) e 582/2271 (Clearance Offline) EXISTEM. Este probe responde outra coisa:
// eles são de fato ENTREGUES nos fixtures/players da PL, ou só existem no vocabulário?
// Método: união dos type_ids em N fixtures encerrados (types esparsos aparecem no agregado)
// + dump dos types de season de um jogador.

const SEASON = 25583 // Premier League 25/26

const fixtures = await sm<any[]>(
  `/fixtures/between/2025-10-01/2025-12-20?filters=fixtureSeasons:${SEASON}&include=lineups.details;statistics&per_page=40`,
)
console.log(`fixtures analisados: ${fixtures.length}`)

const teamTypes = new Map<number, number>()
const playerTypes = new Map<number, number>()
let samplePlayerId: number | null = null

for (const f of fixtures) {
  for (const s of f.statistics ?? []) teamTypes.set(s.type_id, (teamTypes.get(s.type_id) ?? 0) + 1)
  for (const l of f.lineups ?? []) {
    if (!samplePlayerId && l.player_id) samplePlayerId = l.player_id
    for (const d of l.details ?? []) playerTypes.set(d.type_id, (playerTypes.get(d.type_id) ?? 0) + 1)
  }
}

const ALVOS = [571, 114, 324, 582, 2271, 102, 66, 27252, 27255, 88, 1535, 113, 115, 9683, 48997]
console.log(`\n== ALVOS (existem no catálogo — vieram no fixture? ) ==`)
for (const id of ALVOS) {
  console.log(
    `${String(id).padStart(6)} | time: ${String(teamTypes.get(id) ?? 0).padStart(4)} ocorrências | jogador: ${String(playerTypes.get(id) ?? 0).padStart(5)} ocorrências`,
  )
}

console.log(`\n== TODOS os types de TIME entregues (${teamTypes.size}) ==`)
console.log([...teamTypes.keys()].sort((a, b) => a - b).join(", "))
console.log(`\n== TODOS os types de JOGADOR entregues (${playerTypes.size}) ==`)
console.log([...playerTypes.keys()].sort((a, b) => a - b).join(", "))

if (samplePlayerId) {
  console.log(`\n== season stats do player ${samplePlayerId} (/players/{id}?include=statistics.details) ==`)
  try {
    const p = await sm<any>(`/players/${samplePlayerId}?include=statistics.details`)
    const seasonTypes = new Set<number>()
    for (const st of p.statistics ?? []) for (const d of st.details ?? []) seasonTypes.add(d.type_id)
    console.log(`name=${p.display_name} seasons=${p.statistics?.length ?? 0} types distintos=${seasonTypes.size}`)
    console.log([...seasonTypes].sort((a, b) => a - b).join(", "))
    console.log(`ALVOS presentes no season: ${ALVOS.filter((a) => seasonTypes.has(a)).join(", ") || "nenhum"}`)
  } catch (e) {
    console.log("  erro:", (e as Error).message)
  }
}
process.exit(0)
