import { sm } from "../src/lib/sportmonks"

// 121 Turn Over vs 94 Dispossessed vs 27273 Possession Lost: os três medem "perdeu a bola".
// Antes de criar coluna pro 121, descobrir a relação aritmética entre eles nos dados reais —
// se 27273 == 94 + 121 o 121 é a perda NÃO forçada (erro próprio) e vale coluna própria.
const SEASON = 25583
const fixtures = await sm<any[]>(
  `/fixtures/between/2025-10-01/2025-12-20?filters=fixtureSeasons:${SEASON}&include=lineups.details&per_page=40`,
)

type Row = { name: string; d94: number; t121: number; p27273: number }
const rows: Row[] = []
for (const f of fixtures) {
  for (const l of f.lineups ?? []) {
    const get = (id: number) => (l.details ?? []).find((d: any) => d.type_id === id)?.data?.value
    const d94 = get(94),
      t121 = get(121),
      p27273 = get(27273)
    if (d94 == null && t121 == null && p27273 == null) continue
    rows.push({ name: l.player_name ?? String(l.player_id), d94: d94 ?? 0, t121: t121 ?? 0, p27273: p27273 ?? 0 })
  }
}

console.log(`linhas com pelo menos um dos três: ${rows.length}`)
const soma = rows.reduce((a, r) => ({ d: a.d + r.d94, t: a.t + r.t121, p: a.p + r.p27273 }), { d: 0, t: 0, p: 0 })
console.log(`totais → 94 Dispossessed=${soma.d} | 121 TurnOver=${soma.t} | 27273 PossessionLost=${soma.p}`)
console.log(`94+121 = ${soma.d + soma.t}  vs  27273 = ${soma.p}`)

const exato = rows.filter((r) => r.d94 + r.t121 === r.p27273).length
const p_maior = rows.filter((r) => r.p27273 > r.d94 + r.t121).length
console.log(`\nlinhas onde 94+121 == 27273: ${exato}/${rows.length} (${((exato / rows.length) * 100).toFixed(1)}%)`)
console.log(`linhas onde 27273 > 94+121: ${p_maior}`)

console.log(`\n== 15 amostras (94 / 121 / 27273) ==`)
for (const r of rows.sort((a, b) => b.p27273 - a.p27273).slice(0, 15)) {
  console.log(`${r.name.padEnd(26)} disp=${String(r.d94).padStart(3)} turnover=${String(r.t121).padStart(3)} possLost=${String(r.p27273).padStart(3)}`)
}
process.exit(0)
