// Lista as ligas que o SEU plano SportMonks inclui — o endpoint /leagues já vem escopado pela assinatura
// (só retorna o que você tem acesso). Marca Inglaterra (🏴) e separa liga vs copa (FA Cup é type=cup).
// Run: bun run scripts/_my-leagues.ts
import { smAll } from "../src/lib/sportmonks"

type League = {
  id: number
  name: string
  type?: string // "league" | "cup"
  sub_type?: string // "domestic" | "domestic_cup" | "play-offs" | ...
  short_code?: string
  country_id?: number
  country?: { id: number; name: string }
  currentseason?: { id: number; name: string }
}

const leagues = await smAll<League>("/leagues?include=country;currentSeason")
leagues.sort((a, b) => (a.country?.name ?? "").localeCompare(b.country?.name ?? "") || a.name.localeCompare(b.name))

console.log(`\n✅ Seu plano inclui ${leagues.length} liga(s):\n`)
for (const l of leagues) {
  const flag = l.country?.name === "England" ? "🏴" : "  "
  const kind = l.type === "cup" ? "COPA" : "liga"
  const season = l.currentseason ? ` · season ${l.currentseason.id} (${l.currentseason.name})` : ""
  console.log(`${flag} [${String(l.id).padStart(4)}] ${l.name}  ·  ${l.country?.name ?? "?"}  ·  ${kind}${l.sub_type ? "/" + l.sub_type : ""}${season}`)
}

const eng = leagues.filter((l) => l.country?.name === "England")
const faCup = leagues.find((l) => /fa cup/i.test(l.name))
console.log(`\n🏴 Inglaterra: ${eng.length} competição(ões)`)
console.log(`   FA Cup no plano? ${faCup ? `SIM → id ${faCup.id} (season atual ${faCup.currentseason?.id ?? "?"})` : "NÃO"}`)
console.log(`   ${eng.map((l) => `${l.name} [${l.id}]`).join(" · ")}`)
process.exit(0)
