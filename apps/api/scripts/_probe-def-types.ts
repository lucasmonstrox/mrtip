import { smAll } from "../src/lib/sportmonks"

// Dump do catálogo /core/types filtrando o vocabulário defensivo: responde se
// "error led to goal", "penalties conceded" e "own goals" EXISTEM como type na API
// (mesmo que não venham nos fixtures da PL) ou se simplesmente não existem.
const types = await smAll<any>(`/../core/types?per_page=100`)
console.log(`total de types: ${types.length}`)

const WANTED = [
  "error",
  "penalt",
  "own",
  "conceded",
  "concede",
  "clearance",
  "clear",
  "block",
  "tackle",
  "intercept",
  "dribbl",
  "recover",
  "duel",
  "aerial",
  "save",
  "foul",
  "red card",
  "redcard",
]

const hit = types.filter((t: any) => {
  const n = String(t.name ?? "").toLowerCase()
  return WANTED.some((w) => n.includes(w))
})

console.log(`\n== types com vocabulário defensivo (${hit.length}) ==`)
for (const t of hit.sort((a: any, b: any) => a.id - b.id)) {
  console.log(`${String(t.id).padStart(7)} | ${String(t.developer_name ?? "").padEnd(34)} | ${t.name} | model=${t.model_type ?? "?"} | stat_group=${t.stat_group ?? "-"}`)
}
process.exit(0)
