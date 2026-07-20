/**
 * Provas da SIN-009 (arbitragem — só a identidade do árbitro, D7). Assert no banco real; não há
 * runner de unidade no repo. Exit 1 se qualquer caso falhar.
 *
 *   bun run scripts/_check-referee.ts
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"
import { ingestReferees, type SmRefereeLink } from "../src/db/sync-ingest"
import { sm } from "../src/lib/sportmonks"
import { getMatch } from "../src/modules/leagues/get-match/get-match.service"

let ok = 0
let total = 0
function check(pass: boolean, label: string, detail: string): void {
  total++
  if (pass) ok++
  console.log(`${pass ? "OK  " : "FAIL"} ${label} — ${detail}`)
}
const q = async <T>(s: string): Promise<T[]> => ((await db.execute(sql.raw(s))).rows ?? []) as T[]

// T1 — jogo encerrado tem árbitro principal (type 6) com nome preenchido.
const [t1] = await q<{ n: number; name: string; match: string }>(`
  select count(*)::int as n, min(r.name) as name, min(m.name) as match
  from match m join referee r on r.id = m.referee_id
  where m.ft_home is not null
`)
check((t1?.n ?? 0) > 0 && !!t1?.name, "T1 árbitro principal em jogo encerrado", `${t1?.n} jogos com árbitro; ex.: ${t1?.name} em ${t1?.match}`)

// T2 — idempotência: re-ingerir o MESMO fixture não duplica vínculo nem árbitro.
const [anyMatch] = await q<{ id: string; fx: number }>(`
  select m.id, m.sportmonks_fixture_id as fx from match m where m.referee_id is not null limit 1
`)
const countsOf = async (matchId: string) => {
  const [r] = await q<{ links: number; people: number }>(
    `select (select count(*)::int from match where id = '${matchId}' and referee_id is not null) as links,
            (select count(*)::int from referee) as people`,
  )
  return r!
}
const before = await countsOf(anyMatch!.id)
const fx = await sm<{ id: number; referees?: SmRefereeLink[] }>(`/fixtures/${anyMatch!.fx}?include=referees.referee`)
await ingestReferees([fx], new Map([[fx.id, anyMatch!.id]]))
const after = await countsOf(anyMatch!.id)
check(
  before.links === after.links && before.people === after.people,
  "T2 idempotência da re-ingestão",
  `designado ${before.links}→${after.links}, catálogo ${before.people}→${after.people}`,
)

// T3 — o catálogo guarda só quem apitou de verdade: nenhum árbitro órfão (sem nenhum jogo).
const [t3] = await q<{ people: number; orphans: number }>(`
  select (select count(*)::int from referee) as people,
         (select count(*)::int from referee r where not exists (select 1 from match m where m.referee_id = r.id)) as orphans
`)
check((t3?.orphans ?? 1) === 0, "T3 catálogo sem árbitro órfão", `${t3?.people} árbitros, ${t3?.orphans} sem jogo`)

// T4 — cobertura por competição, medida contra os jogos que o pipeline REALMENTE enriquece.
// O denominador honesto é "tem escalação": a classificatória da FA Cup (stage_type_id 225) nunca
// recebe o include rico (desenho do CUP-001), então cobrar árbitro dela mediria o sync de copa,
// não esta feature. O que fica de fora é contado e impresso — cap silencioso vira "cobri tudo".
const cov = await q<{ league_code: string; enriched: number; withref: number; skipped: number }>(`
  with e as (
    select m.id, s.league_code, m.referee_id,
           exists (select 1 from lineup l where l.match_id = m.id) as enriched
    from match m join season s on s.id = m.season_id
    where m.ft_home is not null
  )
  select league_code,
         count(*) filter (where enriched)::int as enriched,
         count(*) filter (where enriched and referee_id is not null)::int as withref,
         count(*) filter (where not enriched)::int as skipped
  from e group by 1 order by 1
`)
const worst = cov.reduce((w, c) => Math.min(w, c.enriched ? c.withref / c.enriched : 1), 1)
const skipped = cov.reduce((n, c) => n + c.skipped, 0)
check(
  worst >= 0.95,
  "T4 cobertura ≥95% dos jogos enriquecidos",
  `${cov.map((c) => `${c.league_code} ${c.withref}/${c.enriched} (${Math.round((c.withref / c.enriched) * 100)}%)`).join(" · ")} | fora do pipeline rico (sem escalação, não é regressão desta feature): ${skipped} jogos`,
)

// T5 — getMatch de jogo encerrado devolve o árbitro E preserva os campos antigos do payload.
const [played] = await q<{ slug: string }>(`
  select m.slug from match m where m.referee_id is not null and m.ft_home is not null limit 1
`)
const detail = (await getMatch(played!.slug)) as Record<string, unknown> & { referee?: { name?: string; countryName?: string | null } | null }
const keptFields = ["rest", "standings", "tvStations", "goals", "cards", "league"].filter((k) => detail[k] !== undefined)
check(
  !!detail.referee?.name && keptFields.length === 6,
  "T5 getMatch devolve referee sem perder campo antigo",
  `referee=${detail.referee?.name} (${detail.referee?.countryName ?? "sem país"}); campos antigos ${keptFields.length}/6`,
)

// T6 — jogo FUTURO sem designação: referee null, sem lançar. É o caso PRIMÁRIO da página.
const [future] = await q<{ slug: string }>(`
  select m.slug from match m where m.ft_home is null and m.referee_id is null limit 1
`)
if (future) {
  const f = (await getMatch(future.slug)) as { referee?: unknown }
  check(f.referee === null, "T6 jogo sem designação → referee null", `slug ${future.slug} → referee=${JSON.stringify(f.referee)}`)
} else {
  check(true, "T6 jogo sem designação", "n/a — nenhum jogo futuro sem árbitro no banco agora")
}

console.log(`\n${ok}/${total} casos OK`)
process.exit(ok === total ? 0 : 1)
