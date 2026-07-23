/**
 * Provas da SIN-007 (rivalidade — persistência SportMonks + flag no getMatch). Assert no banco
 * real; não há runner de unidade no repo. Exit 1 se qualquer caso falhar.
 *
 *   bun run scripts/_check-rivals.ts
 */
import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { execSync } from "node:child_process"

import { and, eq, sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { standing, team, teamRival } from "../src/db/schema"
import { ingestTeamRivals } from "../src/db/sync-rivals"
import { getMatch } from "../src/modules/leagues/get-match/get-match.service"
import { search } from "../src/modules/leagues/search/search.service"

let ok = 0
let total = 0
function check(pass: boolean, label: string, detail: string): void {
  total++
  if (pass) ok++
  console.log(`${pass ? "OK  " : "FAIL"} ${label} — ${detail}`)
}
const q = async <T>(s: string): Promise<T[]> => ((await db.execute(sql.raw(s))).rows ?? []) as T[]

// T1 — schema: cols + unique + 2 CHECKs
const cols = await q<{ column_name: string }>(`
  select column_name from information_schema.columns
  where table_name = 'team_rival' order by ordinal_position
`)
const colNames = cols.map((c) => c.column_name)
const cons = await q<{ conname: string; def: string }>(`
  select conname, pg_get_constraintdef(oid) as def
  from pg_constraint where conrelid = 'team_rival'::regclass
`)
const hasUnique = cons.some((c) => /UNIQUE \(team_id, rival_team_id\)/i.test(c.def))
const hasNoSelf = cons.some((c) => c.conname === "team_rival_no_self")
const hasSource = cons.some((c) => c.conname === "team_rival_source_check")
check(
  ["id", "team_id", "rival_team_id", "source", "created_at"].every((c) => colNames.includes(c)) &&
    hasUnique &&
    hasNoSelf &&
    hasSource,
  "T1 schema team_rival",
  `cols=${colNames.join(",")} unique=${hasUnique} no_self=${hasNoSelf} source=${hasSource}`,
)

// T2 — cobertura ≥25 + golden set
const [cov] = await q<{ n: number }>(`select count(*)::int as n from team_rival where source='sportmonks'`)
const golden = await q<{ pair: string }>(`
  select th.name || '→' || tr.name as pair
  from team_rival r
  join team th on th.id = r.team_id
  join team tr on tr.id = r.rival_team_id
  where r.source = 'sportmonks'
    and (
      (th.name = 'Fluminense' and tr.name = 'Flamengo')
      or (th.name = 'Internacional' and tr.name = 'Grêmio')
      or (th.name = 'Arsenal' and tr.name = 'Tottenham Hotspur')
      or (th.name = 'Manchester City' and tr.name = 'Manchester United')
    )
`)
const pairs = new Set(golden.map((g) => g.pair))
const hasFluFla = pairs.has("Fluminense→Flamengo")
const hasGreNal = pairs.has("Internacional→Grêmio")
const hasPl = [...pairs].some((p) => p.startsWith("Arsenal→") || p.startsWith("Manchester City→"))
check(
  (cov?.n ?? 0) >= 25 && hasFluFla && hasGreNal && hasPl,
  "T2 cobertura + golden set",
  `n=${cov?.n} Flu→Fla=${hasFluFla} Inter→Grêmio=${hasGreNal} PL=${hasPl} pairs=${[...pairs].join(" · ")}`,
)

// T3 — stub fora da liga com slug-{smId}
const stubs = await q<{ name: string; slug: string; sm: number }>(`
  select t.name, t.slug, t.sportmonks_team_id as sm
  from team t
  where exists (select 1 from team_rival r where r.rival_team_id = t.id)
    and not exists (select 1 from standing s where s.team_id = t.id)
    and t.slug like '%-' || t.sportmonks_team_id::text
  limit 5
`)
check(stubs.length >= 1, "T3 stub slug-{smId}", stubs.map((s) => `${s.name} (${s.slug})`).join(" · ") || "nenhum")

// T3b — search não devolve stub
const stub = stubs[0]
if (stub) {
  const [stubRow] = await q<{ id: string }>(`select id from team where slug = '${stub.slug.replace(/'/g, "''")}'`)
  const needle = stub.name.split(/\s+/)[0] ?? stub.name
  const results = await search(needle, 10)
  const hitStub = results.teams.some((t) => t.id === stubRow?.id)
  const realHit = await search("Arsenal", 6)
  const hasArsenal = realHit.teams.some((t) => t.name === "Arsenal")
  const flamengo = await search("Flamengo", 6)
  const hasFlamengo = flamengo.teams.some((t) => t.name === "Flamengo")
  check(
    !hitStub && hasArsenal && hasFlamengo,
    "T3b search sem stubs",
    `needle=${needle} stubHits=${hitStub} Arsenal=${hasArsenal} Flamengo=${hasFlamengo}`,
  )
} else {
  check(false, "T3b search sem stubs", "sem stub pra testar (T3 falhou)")
}

// T4 — assimetria (≥1 A→B sem B→A)
const [asym] = await q<{ n: number }>(`
  select count(*)::int as n
  from team_rival a
  where not exists (
    select 1 from team_rival b
    where b.team_id = a.rival_team_id and b.rival_team_id = a.team_id
  )
`)
check((asym?.n ?? 0) >= 1, "T4 assimetria", `${asym?.n} arestas sem espelho`)

// T5 — manual não é clobrado nem podado
const [fluFla] = await q<{ team_id: string; rival_team_id: string; source: string }>(`
  select r.team_id, r.rival_team_id, r.source
  from team_rival r
  join team th on th.id = r.team_id
  join team tr on tr.id = r.rival_team_id
  where th.name = 'Fluminense' and tr.name = 'Flamengo'
  limit 1
`)
if (fluFla) {
  const prevSource = fluFla.source
  await db
    .update(teamRival)
    .set({ source: "manual" })
    .where(and(eq(teamRival.teamId, fluFla.team_id), eq(teamRival.rivalTeamId, fluFla.rival_team_id)))
  const [flu] = await q<{ id: string; sm: number }>(`
    select id, sportmonks_team_id as sm from team where name = 'Fluminense' limit 1
  `)
  try {
    await ingestTeamRivals(new Map([[flu!.sm, flu!.id]]))
    const [after] = await q<{ source: string }>(`
      select source from team_rival
      where team_id = '${fluFla.team_id}' and rival_team_id = '${fluFla.rival_team_id}'
    `)
    check(after?.source === "manual", "T5 manual não clobber/prune", `source=${after?.source}`)
  } finally {
    await db
      .update(teamRival)
      .set({ source: prevSource })
      .where(and(eq(teamRival.teamId, fluFla.team_id), eq(teamRival.rivalTeamId, fluFla.rival_team_id)))
  }
} else {
  check(false, "T5 manual não clobber/prune", "Flu→Fla ausente")
}

// T5b — fetch falho não pruneia arestas SM existentes
const [anyTeam] = await q<{ id: string; sm: number; n: number }>(`
  select t.id, t.sportmonks_team_id as sm, count(r.*)::int as n
  from team t
  join team_rival r on r.team_id = t.id and r.source = 'sportmonks'
  group by t.id, t.sportmonks_team_id
  having count(r.*) >= 1
  limit 1
`)
if (anyTeam) {
  const before = await q<{ rival_team_id: string }>(`
    select rival_team_id from team_rival where team_id = '${anyTeam.id}' and source = 'sportmonks'
  `)
  const res = await ingestTeamRivals(new Map([[anyTeam.sm, anyTeam.id]]), {
    fetchRivals: async () => {
      throw new Error("forced fetch failure for T5b")
    },
  })
  const after = await q<{ rival_team_id: string }>(`
    select rival_team_id from team_rival where team_id = '${anyTeam.id}' and source = 'sportmonks'
  `)
  const same =
    before.length === after.length &&
    before.every((b) => after.some((a) => a.rival_team_id === b.rival_team_id))
  check(same && res.errors >= 1, "T5b prune-on-error", `before=${before.length} after=${after.length} errors=${res.errors}`)
} else {
  check(false, "T5b prune-on-error", "nenhum time com aresta SM")
}

// T6 — getMatch derby
const [derby] = await q<{ slug: string }>(`
  select m.slug from match m
  join team th on th.id = m.home_team_id
  join team ta on ta.id = m.away_team_id
  where (th.name = 'Flamengo' and ta.name = 'Fluminense')
     or (th.name = 'Fluminense' and ta.name = 'Flamengo')
  limit 1
`)
if (derby) {
  const detail = (await getMatch(derby.slug)) as Record<string, unknown> & {
    rivalry?: { isRivalry?: boolean; edges?: unknown[]; home?: { name: string }[]; away?: { name: string }[] }
  }
  const kept = ["rest", "standings", "tvStations", "referee", "goals", "cards"].filter((k) => detail[k] !== undefined)
  check(
    detail.rivalry?.isRivalry === true &&
      (detail.rivalry.edges?.length ?? 0) >= 1 &&
      Array.isArray(detail.rivalry.home) &&
      Array.isArray(detail.rivalry.away) &&
      kept.length === 6,
    "T6 getMatch derby",
    `isRivalry=${detail.rivalry?.isRivalry} edges=${detail.rivalry?.edges?.length} homeRivals=${detail.rivalry?.home?.length} awayRivals=${detail.rivalry?.away?.length} legado=${kept.length}/6`,
  )
} else {
  check(false, "T6 getMatch derby", "sem Fla-Flu no banco")
}

// T7 — getMatch comum
const [common] = await q<{ slug: string }>(`
  select m.slug from match m
  where m.league_code = 'PL'
    and not exists (
      select 1 from team_rival r
      where (r.team_id = m.home_team_id and r.rival_team_id = m.away_team_id)
         or (r.team_id = m.away_team_id and r.rival_team_id = m.home_team_id)
    )
  limit 1
`)
if (common) {
  const detail = (await getMatch(common.slug)) as {
    rivalry?: { isRivalry?: boolean; edges?: unknown[]; home?: unknown[]; away?: unknown[] }
  }
  check(
    detail.rivalry?.isRivalry === false &&
      (detail.rivalry.edges?.length ?? -1) === 0 &&
      Array.isArray(detail.rivalry.home) &&
      Array.isArray(detail.rivalry.away),
    "T7 getMatch comum",
    `slug=${common.slug} isRivalry=${detail.rivalry?.isRivalry} edges=${detail.rivalry?.edges?.length} homeRivals=${detail.rivalry?.home?.length} awayRivals=${detail.rivalry?.away?.length}`,
  )
} else {
  check(false, "T7 getMatch comum", "sem jogo sem aresta")
}

// T8 — idempotência: 2× ingest → mesmo conjunto sportmonks
const standingTeams = await db
  .select({ id: team.id, sportmonksTeamId: team.sportmonksTeamId })
  .from(team)
  .innerJoin(standing, eq(standing.teamId, team.id))
const map = new Map<number, string>()
for (const r of standingTeams) {
  if (!map.has(r.sportmonksTeamId)) map.set(r.sportmonksTeamId, r.id)
}
const setOf = async () => {
  const rows = await q<{ k: string }>(`
    select team_id || '|' || rival_team_id as k from team_rival where source = 'sportmonks' order by 1
  `)
  return rows.map((r) => r.k).join(",")
}
await ingestTeamRivals(new Map(map))
const set1 = await setOf()
await ingestTeamRivals(new Map(map))
const set2 = await setOf()
check(set1 === set2 && set1.length > 0, "T8 idempotência conjunto", `keys=${set1.split(",").length} equal=${set1 === set2}`)

// T9 — prognosis-prompt.ts fora do diff desta feature
const promptPath = "apps/api/scripts/prognosis-prompt.ts"
let promptIntact = true
let promptDetail = "ok"
try {
  const diff = execSync(`git -C ../.. diff HEAD -- ${promptPath}`, { encoding: "utf8", cwd: import.meta.dir }).trim()
  promptIntact = diff === ""
  promptDetail = promptIntact ? "sem diff" : `diff=${diff.length}b`
} catch {
  try {
    const head = execSync(`git -C ../.. show HEAD:${promptPath}`, { encoding: "utf8", cwd: import.meta.dir })
    const cur = readFileSync(new URL(`../${promptPath.replace("apps/api/", "")}`, import.meta.url), "utf8")
    const h = (s: string) => createHash("sha256").update(s).digest("hex")
    promptIntact = h(head) === h(cur)
    promptDetail = promptIntact ? "hash=HEAD" : "hash≠HEAD"
  } catch (e) {
    promptIntact = false
    promptDetail = String(e)
  }
}
check(promptIntact, "T9 anti-prompt", promptDetail)

console.log(`\n${ok}/${total} casos OK`)
process.exit(ok === total ? 0 : 1)
