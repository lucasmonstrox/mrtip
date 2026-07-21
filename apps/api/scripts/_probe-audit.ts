// Auditoria de DADO da matriz de mecanismos (read-only). Confere: valor real de goal.type vs a string
// comparada no evidence-crossings, fan-out do join de commentary, e cobertura PRE-JOGO (status='NS')
// das colunas que a matriz marca como "pronto". Rodar: bun run scripts/_probe-audit.ts
import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }
const p = (l: string, r: unknown) => console.log(`\n=== ${l} ===\n` + JSON.stringify(r))

p("goal.type real (evidence-crossings compara com 'own-goal' — nao existe)", await q(`select type, count(*)::int n from goal group by 1 order by 2 desc`))
p("fan-out: gols reais vs linhas do left join commentary", await q(`
  select (select count(*) from goal)::int gols_reais,
    (select count(*) from goal g left join commentary c on c.match_id=g.match_id and c.is_goal=true and c.minute=g.minute)::int linhas_join`))
p("COBERTURA PRE-JOGO (NS) vs pos-jogo (FT)", await q(`
  select status, count(*)::int n, count(referee_id)::int ref, count(attendance)::int att,
    count(*) filter (where lineup_confirmed is true)::int lc_true from match where status in ('NS','FT') group by 1`))
p("weather pre-jogo", await q(`select m.status, w.type, count(*)::int n from weather w join match m on m.id=w.match_id group by 1,2 order by 1`))
p("xg real preenchido?", await q(`select count(*)::int linhas, count(xg)::int com_xg from match_team_stats`))
p("ligas ingeridas", await q(`select league_code, count(*)::int n from match group by 1 order by 2 desc`))
p("venue.surface (schema diz 'artificial', dado diz outro)", await q(`select surface, count(*)::int n from venue group by 1`))
process.exit(0)
