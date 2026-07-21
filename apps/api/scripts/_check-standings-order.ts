/**
 * Prova do desempate por liga (LIG-012 P5): a tabela computada da Série A tem de bater com a ordem
 * OFICIAL da SportMonks (que aplica o REC da CBF, vitórias antes do saldo), e a da Premier League
 * tem de continuar saindo exatamente como sai hoje (pontos → saldo → gols pró, SEM vitórias).
 *
 * O caso-alvo é o par de clubes com mesmos pontos E mesmo saldo: é ali, e só ali, que a regra da
 * Série A diverge da inglesa. Sem esse par no dado, o teste não prova nada — por isso ele é exigido.
 */
import { sql } from "drizzle-orm"
import { db } from "../src/db/client"
import { computeStandings, tiebreakOf, type Match, type TeamRef } from "../src/modules/leagues/shared/shared"
import { standings } from "../src/modules/leagues/standings/standings.service"

let ok = 0
let total = 0
function check(pass: boolean, label: string, detail: string): void {
  total++
  if (pass) ok++
  console.log(`${pass ? "OK  " : "FAIL"} ${label} — ${detail}`)
}

// --- Caso sintético: prova que a regra DISCRIMINA, sem depender do dado real ---------------------
// Dois clubes com MESMOS pontos (9) e MESMO saldo (+2), divergindo só em vitórias e gols pró:
//   A = 2V 3E 0D, 7 GP, 5 GC   ·   B = 3V 0E 2D, 4 GP, 2 GC
// Série A (vitórias antes do saldo) tem de pôr B na frente; a PL (sem vitórias, cai em gols pró),
// tem de pôr A. Se os dois saírem na mesma ordem, o desempate por liga não está sendo aplicado.
const ref = (id: string): TeamRef => ({ id, name: id, slug: id, logoUrl: null })
let seq = 0
const game = (home: string, away: string, hg: number, ag: number): Match => ({
  id: `m${++seq}`,
  slug: `m${seq}`,
  round: 1,
  name: "synthetic",
  date: "2025-01-01",
  time: null,
  home: ref(home),
  away: ref(away),
  score: { ft: [hg, ag], ht: null },
  venue: null,
  competition: { code: "SYN", name: "synthetic", type: "league", logoUrl: null },
})

const synthetic: Match[] = [
  // A: 2 vitórias (2-1, 2-1) + 3 empates (1-1 ×3) → 9 pts, GP 7, GC 5, saldo +2, 2 vitórias
  game("A", "F1", 2, 1),
  game("A", "F2", 2, 1),
  game("A", "F3", 1, 1),
  game("A", "F4", 1, 1),
  game("A", "F5", 1, 1),
  // B: 3 vitórias (2-0, 1-0, 1-0) + 2 derrotas (0-1, 0-1) → 9 pts, GP 4, GC 2, saldo +2, 3 vitórias
  game("B", "G1", 2, 0),
  game("B", "G2", 1, 0),
  game("B", "G3", 1, 0),
  game("B", "G4", 0, 1),
  game("B", "G5", 0, 1),
]

const posOf = (rows: { team: TeamRef }[], id: string): number => rows.findIndex((r) => r.team.id === id)
// A regra agora vem da TEMPORADA (LIG-017): 577 = Série A (vitórias antes do saldo), 1526 = PL.
const braTable = computeStandings(synthetic, tiebreakOf({ code: "BRA", sportmonksTieBreakerRuleId: 577 }).criteria)
const plTable = computeStandings(synthetic, tiebreakOf({ code: "PL", sportmonksTieBreakerRuleId: 1526 }).criteria)
const braA = posOf(braTable, "A")
const braB = posOf(braTable, "B")
const plA = posOf(plTable, "A")
const plB = posOf(plTable, "B")
const a = braTable.find((r) => r.team.id === "A")
const b = braTable.find((r) => r.team.id === "B")
check(
  a?.points === b?.points && a?.goalDifference === b?.goalDifference && a?.won !== b?.won,
  "sintético: A e B empatam em pontos e saldo, diferem em vitórias",
  `A=${a?.points}pts ${a?.won}V saldo ${a?.goalDifference} GP ${a?.goalsFor} · B=${b?.points}pts ${b?.won}V saldo ${b?.goalDifference} GP ${b?.goalsFor}`,
)
check(braB < braA, "sintético BRA: mais VITÓRIAS fica acima (B antes de A)", `B=${braB + 1}º A=${braA + 1}º`)
check(plA < plB, "sintético PL: vitórias NÃO contam, cai em gols pró (A antes de B)", `A=${plA + 1}º B=${plB + 1}º`)

// --- Equivalência byte-a-byte da PL com o comparador ANTIGO (hardcoded) --------------------------
// Reproduz literalmente o sort que existia antes do LIG-012 e exige ordem idêntica à atual.
const legacy = [...plTable].sort(
  (x, y) => y.points - x.points || y.goalDifference - x.goalDifference || y.goalsFor - x.goalsFor || x.team.name.localeCompare(y.team.name),
)
check(
  legacy.every((r, i) => r.team.id === plTable[i]?.team.id),
  "PL: ordem atual == comparador legado (pontos → saldo → gols pró → nome)",
  `${plTable.length} linhas`,
)

type Official = { team_id: string; position: number; name: string; points: number; won: number; gd: number }

// `seasonSm` explícito mantém a evidência reproduzível: sem ele o script segue a temporada corrente,
// que muda quando uma nova é ingerida — e a prova da anterior evapora silenciosamente.
async function official(code: string, seasonSm?: number): Promise<Official[]> {
  const r: unknown = await db.execute(
    seasonSm
      ? sql`select st.team_id::text as team_id, st.position, t.name, st.points, st.won, st.goal_difference as gd
            from standing st join team t on t.id = st.team_id join season s on s.id = st.season_id
            where s.sportmonks_season_id = ${seasonSm} order by st.position`
      : sql`select st.team_id::text as team_id, st.position, t.name, st.points, st.won, st.goal_difference as gd
            from standing st join team t on t.id = st.team_id join season s on s.id = st.season_id
            where s.league_code = ${code} and s.is_current = true order by st.position`,
  )
  return (Array.isArray(r) ? r : ((r as { rows: Official[] }).rows ?? [])) as Official[]
}

const TABELAS: { code: string; seasonSm?: number; rotulo: string }[] = [
  { code: "BRA", seasonSm: 25184, rotulo: "BRA 2025" },
  { code: "BRA", seasonSm: 26763, rotulo: "BRA 2026" },
  { code: "PL", rotulo: "PL" },
]

for (const { code, seasonSm, rotulo } of TABELAS) {
  const off = await official(code, seasonSm)
  const computed = await standings(code, seasonSm ? { season: seasonSm } : {})
  const offOrder = off.map((o) => o.team_id)
  const compOrder = computed.map((r) => r.team.id)
  const firstDiff = offOrder.findIndex((id, i) => id !== compOrder[i])
  check(
    off.length > 0 && firstDiff === -1,
    `${rotulo}: ordem computada == ordem oficial da SportMonks`,
    firstDiff === -1
      ? `${off.length} clubes, ordem idêntica`
      : `divergem na posição ${firstDiff + 1}: oficial=${off[firstDiff]?.name} vs computado=${computed[firstDiff]?.team.name}`,
  )
}

// O ramo `?upTo=N` é um caminho SEPARADO em standings.service.ts (recomputa sobre o subconjunto de
// rodadas) e o critério A5 o cita nominalmente — então ele é exercitado, não só inferido.
for (const upTo of [10, 1]) {
  const cut = await standings("PL", { upTo })
  const cutLegacy = [...cut].sort(
    (x, y) => y.points - x.points || y.goalDifference - x.goalDifference || y.goalsFor - x.goalsFor || x.team.name.localeCompare(y.team.name),
  )
  check(
    cut.length > 0 && cutLegacy.every((r, i) => r.team.id === cut[i]?.team.id),
    `PL ?upTo=${upTo}: ordem == comparador legado (ramo filtrado do service)`,
    `${cut.length} clubes · líder=${cut[0]?.team.name} ${cut[0]?.points}pts`,
  )
}
// E a Série A pelo mesmo ramo, para garantir que o desempate da liga chega no caminho filtrado também.
const braCut = await standings("BRA", { upTo: 10 })
check(braCut.length > 0, "BRA ?upTo=10 responde pelo ramo filtrado", `${braCut.length} clubes · líder=${braCut[0]?.team.name}`)

// Caso-alvo: mesmos pontos E mesmo saldo → na Série A quem tem mais vitórias fica acima.
const bra = await official("BRA")
const pairs = bra.flatMap((a, i) =>
  bra.slice(i + 1).filter((b) => b.points === a.points && b.gd === a.gd && b.won !== a.won).map((b) => [a, b] as const),
)
// NOTA (medido 2026-07-19): a tabela final da Série A 2025 NÃO tem nenhum par empatado em pontos E
// saldo, então o dado real não consegue exercitar o critério "vitórias". Isso NÃO é falha da
// implementação — e também significa que "bate com a ordem oficial" acima, sozinho, não prova o
// desempate (a ordem coincidiria mesmo com a regra inglesa). Quem prova é o caso sintético no topo
// deste arquivo. Se um dia o dado tiver o par, os asserts abaixo passam a valer automaticamente.
if (pairs.length === 0) {
  console.log(`(BRA: 0 pares empatados em pontos+saldo na temporada real — critério "vitórias" não é exercitável pelo dado; a prova é o caso sintético acima)`)
} else {
  for (const [a, b] of pairs) {
    // `a` vem antes de `b` na ordem oficial; então `a` tem de ter MAIS vitórias.
    check(a.won > b.won, `BRA: ${a.name} (${a.won}V) acima de ${b.name} (${b.won}V) com ${a.points} pts e saldo ${a.gd}`, `posições ${a.position} vs ${b.position}`)
  }
}

// Contraprova: a PL NÃO usa vitórias — um par igual em pontos/saldo é ordenado por gols pró, e a
// ordem oficial inglesa tem de bater com isso mesmo quando as vitórias contradizem.
const pl = await official("PL")
const plPairs = pl.flatMap((a, i) =>
  pl.slice(i + 1).filter((b) => b.points === a.points && b.gd === a.gd && b.won !== a.won).map((b) => [a, b] as const),
)
console.log(`(PL: ${plPairs.length} par(es) com mesmos pontos+saldo e vitórias diferentes — se >0, a ordem acima já provou que vitórias NÃO foram usadas)`)

// --- LIG-017: resolução da regra (acréscimos a este arnês; os 11 checks acima são os do LIG-012) -----
// D5 — se o id vier null (ponte local `backfill-season.ts` não fala com a API), o Brasileirão TEM de
// cair no override e continuar ordenando por vitórias, COM procedência. Sem isso a regressão é muda.
const braNull = tiebreakOf({ code: "BRA", sportmonksTieBreakerRuleId: null })
check(
  braNull.criteria.includes("wins") && braNull.source === "league-override" && braNull.label === "Regulamento da CBF",
  "D5 — BRA com id null cai no override, com vitórias e procedência",
  `criteria=[${braNull.criteria.join(", ")}] source=${braNull.source} label=${braNull.label}`,
)

// D4 — regra desconhecida nunca degrada pra lista vazia (que ordenaria alfabeticamente ignorando pontos).
const desconhecida = tiebreakOf({ code: "XXX", sportmonksTieBreakerRuleId: 999999 })
check(
  desconhecida.criteria.length > 0 && desconhecida.source === "default" && desconhecida.label === null,
  "D4 — regra desconhecida cai no default explícito, nunca em lista vazia",
  `criteria=[${desconhecida.criteria.join(", ")}] source=${desconhecida.source} label=${desconhecida.label}`,
)

// E a invariante que protege o caso acima se alguém quebrar o mapa no futuro.
let estourou = false
try {
  computeStandings(synthetic, [])
} catch {
  estourou = true
}
check(estourou, "D4 — computeStandings rejeita lista de critérios vazia", `throw=${estourou}`)

console.log(`\n${ok}/${total}`)
process.exit(ok === total ? 0 : 1)
