import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }
const p = (label: string, r: unknown) => console.log(`\n=== ${label} ===\n` + JSON.stringify(r, null, 1))

p("injury.type distribuicao", await q(`select type, count(*)::int n from injury group by 1 order by 2 desc limit 40`))
p("injury.reason distribuicao", await q(`select reason, count(*)::int n from injury group by 1 order by 2 desc limit 30`))
p("attendance cobertura", await q(`select m.league_code, count(*)::int total, count(m.attendance)::int com_att, min(m.attendance)::int min_att, max(m.attendance)::int max_att from match m where m.status='FT' group by 1 order by 1`))
p("lineup_confirmed cobertura", await q(`select league_code, status, lineup_confirmed, count(*)::int n from match group by 1,2,3 order by 1,2,3`))
p("venue capacity cobertura", await q(`select count(*)::int total, count(capacity)::int com_cap from venue`))
p("ocupacao percentis (FT com att e cap)", await q(`select m.league_code, count(*)::int n, round(avg(m.attendance::numeric/nullif(v.capacity,0))*100,1) media_pct, round(min(m.attendance::numeric/nullif(v.capacity,0))*100,1) min_pct, round(percentile_cont(0.05) within group (order by m.attendance::numeric/nullif(v.capacity,0))*100,1) p05_pct from match m join venue v on v.id=m.venue_id where m.status='FT' and m.attendance is not null and v.capacity is not null group by 1 order by 1`))
p("jogos com ocupacao < 60% (candidatos a portao fechado/punicao)", await q(`select m.league_code, m.date, m.name, m.attendance, v.capacity, round(m.attendance::numeric/v.capacity*100,1) pct from match m join venue v on v.id=m.venue_id where m.status='FT' and m.attendance is not null and v.capacity>0 and m.attendance::numeric/v.capacity < 0.60 order by pct asc limit 25`))
p("trocas de tecnico detectaveis (times com >1 coach na mesma season)", await q(`select t.name time, s.name season, count(distinct l.coach_name)::int n_coaches from lineup l join match m on m.id=l.match_id join team t on t.id=l.team_id join season s on s.id=m.season_id where l.coach_name is not null group by 1,2 having count(distinct l.coach_name)>1 order by 3 desc limit 30`))
p("cobertura coach_name", await q(`select m.league_code, count(*)::int lineups, count(l.coach_name)::int com_coach from lineup l join match m on m.id=l.match_id group by 1 order by 1`))
p("injury por partida (media)", await q(`select m.league_code, count(distinct m.id)::int jogos, count(i.id)::int desfalques, round(count(i.id)::numeric/nullif(count(distinct m.id),0),2) por_jogo from match m left join injury i on i.match_id=m.id group by 1 order by 1`))
p("cartoes amarelos por jogador/season (gancho por acumulo)", await q(`select count(*)::int n_cards, count(distinct player_id)::int jogadores from card where type='yellow'`))
p("colunas de match", await q(`select column_name, data_type from information_schema.columns where table_name='match' order by ordinal_position`))
p("tabelas existentes", await q(`select table_name from information_schema.tables where table_schema='public' order by 1`))
process.exit(0)
