// Auditoria de DADO da matriz de mecanismos (read-only). Confere se as colunas citadas existem, se os
// bloqueios duros são reais, e — o ponto principal — se "dado=pronto" vale PRÉ-JOGO (status='NS') ou só
// retrospectivamente (status='FT'). Rodar: bun run scripts/_probe-audit.ts
import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }
const p = (l: string, r: unknown) => console.log(`\n=== ${l} ===\n` + JSON.stringify(r))

// 1. O FURO PRINCIPAL: "pronto" é cobertura de FT, não de NS (as linhas em que se aposta).
p("COBERTURA PRE-JOGO (NS) vs POS-JOGO (FT)", await q(`
  select status, count(*)::int n, count(referee_id)::int ref, count(attendance)::int att,
    count(*) filter (where lineup_confirmed is true)::int lc_true, count(venue_id)::int venue
  from match where status in ('NS','FT') group by 1`))
p("weather por status (2 linhas em 196 jogos NS)", await q(`
  select m.status, w.type, count(*)::int n from weather w join match m on m.id=w.match_id group by 1,2 order by 1`))
p("injury: feed prospectivo vs retrospectivo", await q(`
  select m.status, count(distinct m.id)::int jogos, count(i.id)::int desfalques
  from match m left join injury i on i.match_id=m.id where m.status in ('NS','FT') group by 1`))

// 2. Bug: evidence-crossings.ts:178/432/515 compara com "own-goal"; o valor gravado é "own".
p("goal.type real (a string 'own-goal' NAO existe)", await q(`select type, count(*)::int n from goal group by 1 order by 2 desc`))

// 3. Bug: o left join de commentary no carregamento de gols (evidence-crossings.ts:71-76) faz fan-out.
p("fan-out: gols reais vs linhas do join", await q(`
  select (select count(*) from goal)::int gols_reais,
    (select count(*) from goal g left join commentary c on c.match_id=g.match_id and c.is_goal=true and c.minute=g.minute)::int linhas_join`))

// 4. Bloqueios duros declarados — conferidos, não assumidos pelo comentário do schema.
p("xg real preenchido?", await q(`select count(*)::int linhas, count(xg)::int com_xg from match_team_stats`))
p("ligas ingeridas (nenhuma continental)", await q(`select league_code, count(*)::int n from match group by 1 order by 2 desc`))
p("venue.surface (schema diz 'artificial', dado diz 'artificial turf')", await q(`select surface, count(*)::int n from venue group by 1`))
process.exit(0)
