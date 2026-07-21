import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }
const p = (label: string, r: unknown) => console.log(`\n=== ${label} ===\n` + JSON.stringify(r, null, 1))

p("coach tabela", await q(`select count(*)::int n from coach`))
p("lineup coach_id", await q(`select count(*)::int lineups, count(coach_id)::int com_coach_id from lineup`))
p("injury em jogos FUTUROS (NS)", await q(`select m.league_code, m.status, count(distinct m.id)::int jogos, count(i.id)::int desfalques from match m left join injury i on i.match_id=m.id where m.status in ('NS','POSTPONED') group by 1,2 order by 1,2`))
p("injury por partida por liga", await q(`select m.league_code, count(distinct m.id)::int jogos, count(i.id)::int desfalques, round(count(i.id)::numeric/nullif(count(distinct m.id),0),2) por_jogo from match m left join injury i on i.match_id=m.id where m.status='FT' group by 1 order by 1`))
p("suspensao (reason) por liga", await q(`select m.league_code, i.reason, count(*)::int n from injury i join match m on m.id=i.match_id where i.reason ilike '%suspen%' or i.reason ilike '%eligib%' or i.reason ilike '%ban%' group by 1,2 order by 1,3 desc`))
p("Called Up To National Team por liga", await q(`select m.league_code, count(*)::int n from injury i join match m on m.id=i.match_id where i.reason='Called Up To National Team' group by 1`))
p("match.time cobertura", await q(`select league_code, count(*)::int total, count(time)::int com_time from match group by 1`))
p("ocupacao media por liga", await q(`select m.league_code, count(*)::int n, round(avg(m.attendance::numeric/v.capacity)::numeric*100,1) media_pct from match m join venue v on v.id=m.venue_id where m.status='FT' and m.attendance is not null and v.capacity>0 group by 1 order by 1`))
p("desvio de ocupacao por time mandante (BRA) - detecta punicao/esvaziamento", await q(`select t.name time, count(*)::int jogos, round(avg(m.attendance::numeric/v.capacity)*100,1) media_pct, round(stddev(m.attendance::numeric/v.capacity)*100,1) dp_pct, round(min(m.attendance::numeric/v.capacity)*100,1) min_pct from match m join venue v on v.id=m.venue_id join team t on t.id=m.home_team_id where m.league_code='BRA' and m.status='FT' and m.attendance is not null and v.capacity>0 group by 1 having count(*)>=8 order by dp_pct desc limit 20`))
p("eliminacao de copa: jogos de copa seguidos de jogo de liga (existe cross-liga por time?)", await q(`select count(distinct t.id)::int times_em_copa_e_liga from team t where exists(select 1 from match m where (m.home_team_id=t.id or m.away_team_id=t.id) and m.league_code in ('FAC','CARA')) and exists(select 1 from match m where (m.home_team_id=t.id or m.away_team_id=t.id) and m.league_code='PL')`))
p("winner_team_id cobertura copa (detecta eliminacao)", await q(`select league_code, count(*)::int total, count(winner_team_id)::int com_winner from match where league_code in ('FAC','CARA') and status in ('FT','FT_PEN','AET') group by 1`))
process.exit(0)
