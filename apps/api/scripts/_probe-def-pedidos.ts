import { sm } from "../src/lib/sportmonks"

// Cobertura real dos types que o João pediu, medida na temporada inteira da PL:
// quantos jogos têm o type, quantos jogadores distintos, e a soma dos valores.
// Responde "entrega dado ou não" com número, não com impressão de amostra pequena.
const SEASON = 25583
const JANELAS = [
  ["2025-08-01", "2025-10-15"],
  ["2025-10-16", "2025-12-31"],
  ["2026-01-01", "2026-03-15"],
  ["2026-03-16", "2026-05-31"],
] as const

const PEDIDOS: Array<[number, string]> = [
  [571, "Error Lead To Goal"],
  [114, "Penalties Committed"],
  [115, "Penalties Won"],
  [95, "Offsides Provoked"],
  [121, "Turn Over"],
  [582, "Clearance Offline"],
  [103, "Punches (GK)"],
  [88, "Goals Conceded"],
  [1535, "GK Goals Conceded"],
  [112, "Penalties Missed"],
  [113, "Penalties Saved"],
  [48997, "Error Lead To Shot (controle, já temos)"],
  [101, "Clearances (controle, já temos)"],
]

const stats = new Map<number, { jogos: Set<number>; linhas: number; soma: number; players: Set<number> }>()
for (const [id] of PEDIDOS) stats.set(id, { jogos: new Set(), linhas: 0, soma: 0, players: new Set() })
let nFix = 0

for (const [de, ate] of JANELAS) {
  const fx = await sm<any[]>(
    `/fixtures/between/${de}/${ate}?filters=fixtureSeasons:${SEASON}&include=lineups.details&per_page=50`,
  )
  nFix += fx.length
  for (const f of fx) {
    for (const l of f.lineups ?? []) {
      for (const d of l.details ?? []) {
        const s = stats.get(d.type_id)
        if (!s) continue
        s.jogos.add(f.id)
        s.linhas += 1
        s.players.add(l.player_id)
        const v = d.data?.value
        if (typeof v === "number") s.soma += v
      }
    }
  }
}

console.log(`fixtures analisados: ${nFix}\n`)
console.log(`${"type".padStart(6)} | ${"nome".padEnd(38)} | jogos c/ dado | linhas | jogadores | soma`)
for (const [id, nome] of PEDIDOS) {
  const s = stats.get(id)!
  console.log(
    `${String(id).padStart(6)} | ${nome.padEnd(38)} | ${String(s.jogos.size).padStart(5)}/${nFix} | ${String(s.linhas).padStart(6)} | ${String(s.players.size).padStart(9)} | ${s.soma}`,
  )
}
process.exit(0)
