// Testa o service getBracket direto (sem HTTP). Run: bun run scripts/_test-bracket.ts CARA
import { getBracket } from "../src/modules/leagues/bracket/bracket.service"

const b = await getBracket(process.argv[2] ?? "CARA", {})
console.log("league:", JSON.stringify(b.league), "· season:", b.season)
console.log("stages:", b.stages.map((s) => `${s.name}(${s.ties.length})`).join(" · "))
console.log("edges:", b.edges.length)
const final = b.stages.at(-1)
console.log("\nsample tie (final):", JSON.stringify(final?.ties[0], null, 2))
console.log("sample edge:", JSON.stringify(b.edges.at(-1)))
process.exit(0)
