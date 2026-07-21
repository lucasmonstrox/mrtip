import { sm } from "../src/lib/sportmonks"

// "A PL não entrega X" vs "o evento X não aconteceu na amostra" são coisas diferentes.
// Amostra maior (temporada inteira em janelas) + contagem por type, pra separar
// lacuna de cobertura (type nunca vem, mesmo com o evento acontecendo toda rodada)
// de evento raro (pênalti defendido acontece ~1 a cada 25 jogos).
const SEASON = 25583
const JANELAS = [
  ["2025-08-01", "2025-10-15"],
  ["2025-10-16", "2025-12-31"],
  ["2026-01-01", "2026-03-15"],
  ["2026-03-16", "2026-05-31"],
] as const

const playerTypes = new Map<number, number>()
const teamTypes = new Map<number, number>()
let nFix = 0

for (const [de, ate] of JANELAS) {
  try {
    const fx = await sm<any[]>(
      `/fixtures/between/${de}/${ate}?filters=fixtureSeasons:${SEASON}&include=lineups.details;statistics&per_page=50`,
    )
    nFix += fx.length
    for (const f of fx) {
      for (const s of f.statistics ?? []) teamTypes.set(s.type_id, (teamTypes.get(s.type_id) ?? 0) + 1)
      for (const l of f.lineups ?? []) for (const d of l.details ?? []) playerTypes.set(d.type_id, (playerTypes.get(d.type_id) ?? 0) + 1)
    }
    console.log(`janela ${de}..${ate}: ${fx.length} fixtures`)
  } catch (e) {
    console.log(`janela ${de}..${ate}: erro ${(e as Error).message}`)
  }
}

console.log(`\ntotal de fixtures: ${nFix}`)

const SUSPEITOS: Array<[number, string, string]> = [
  [113, "Penalties Saved", "evento RARO (~1 a cada 25 jogos) — ausência não prova nada"],
  [66, "Successful Interceptions", "irmão do 100, que vem todo jogo → se falta, é type duplicado"],
  [102, "Clearances Won", "irmão do 101, que vem todo jogo → idem"],
  [2271, "Clearances Offline", "irmão do 582, que vem → idem"],
  [27252, "Interception Stats", "?"],
  [27255, "Crosses Blocked", "?"],
  [9683, "Fouls Per Card", "é RAZÃO → provavelmente só agregado de season"],
  [571, "Error Lead To Goal", "controle: sabemos que vem"],
  [114, "Penalties Committed", "controle: sabemos que vem"],
  [121, "Turn Over", "controle: sabemos que vem"],
]
console.log(`\n== suspeitos ==`)
for (const [id, nome, nota] of SUSPEITOS) {
  const n = playerTypes.get(id) ?? 0
  console.log(`${String(id).padStart(6)} ${nome.padEnd(26)} jogador=${String(n).padStart(5)} time=${String(teamTypes.get(id) ?? 0).padStart(4)} | ${nota}`)
}
console.log(`\ntypes de jogador distintos: ${playerTypes.size} | de time: ${teamTypes.size}`)
console.log(`jogador: ${[...playerTypes.keys()].sort((a, b) => a - b).join(", ")}`)
process.exit(0)
