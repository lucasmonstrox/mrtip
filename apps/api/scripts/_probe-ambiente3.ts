import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }
const p = (label: string, rows: unknown) => console.log(`\n=== ${label} ===\n` + JSON.stringify(rows, null, 1))

// 1. TEMPERATURA controlada POR LIGA (o gradiente 3.38->2.56 e confundido com liga?)
p("temp x gols DENTRO da liga", await q(`
  select m.league_code,
    case when w.temp_day<5 then 'a <5C' when w.temp_day<12 then 'b 5-12' when w.temp_day<20 then 'c 12-20'
         when w.temp_day<27 then 'd 20-27' else 'e >=27' end as faixa,
    count(*)::int as n, round(avg(m.ft_home+m.ft_away),2) as gols
  from match m join weather w on w.match_id=m.id
  where m.status='FT' and w.temp_day is not null and m.league_code in ('PL','BRA')
  group by 1,2 having count(*)>=25 order by 1,2`))

// 2. CHUVA controlada por liga (SIN-006 refutado — reconferir)
p("chuva x gols DENTRO da liga", await q(`
  select m.league_code,
    case when w.description ilike '%rain%' or w.description ilike '%drizzle%' or w.description ilike '%shower%'
         then 'chuva' else 'sem chuva' end as cond,
    count(*)::int as n, round(avg(m.ft_home+m.ft_away),2) as gols,
    round(avg(case when m.ft_home+m.ft_away>2.5 then 1.0 else 0 end),3) as pct_over25
  from match m join weather w on w.match_id=m.id
  where m.status='FT' and w.description is not null and m.league_code in ('PL','BRA')
  group by 1,2 order by 1,2`))

p("descriptions distintas (top)", await q(`
  select w.description, count(*)::int as n, round(avg(m.ft_home+m.ft_away),2) as gols
  from match m join weather w on w.match_id=m.id where m.status='FT'
  group by 1 having count(*)>=15 order by 2 desc`))

// 3. VENTO controlado por liga (escanteios/cruzamentos — o mecanismo aereo)
p("vento x escanteios/cruzamentos DENTRO da liga", await q(`
  select m.league_code,
    case when w.wind_speed<3 then 'a <3' when w.wind_speed<6 then 'b 3-6' when w.wind_speed<9 then 'c 6-9' else 'd >=9' end as faixa,
    count(distinct m.id)::int as n, round(avg(m.ft_home+m.ft_away),2) as gols,
    round(avg(mts.corners),2) as escanteios, round(avg(mts.crosses_total),2) as cruzamentos,
    round(avg(mts.pass_accuracy)::numeric,1) as pass_acc
  from match m join weather w on w.match_id=m.id
  left join match_team_stats mts on mts.match_id=m.id
  where m.status='FT' and w.wind_speed is not null and m.league_code in ('PL','BRA')
  group by 1,2 having count(distinct m.id)>=25 order by 1,2`))

// 4. PORTOES FECHADOS / publico irrisorio — o ghost game DENTRO do nosso banco
p("jogos de publico quase zero", await q(`
  select m.league_code, m.date, t1.name as casa, t2.name as fora, m.attendance, v.capacity,
    round(m.attendance::numeric/nullif(v.capacity,0),3) as ocup, m.ft_home, m.ft_away
  from match m join venue v on v.id=m.venue_id
  join team t1 on t1.id=m.home_team_id join team t2 on t2.id=m.away_team_id
  where m.status='FT' and m.attendance is not null and v.capacity>0
    and m.attendance::numeric/v.capacity < 0.15
  order by ocup limit 25`))

p("contagem por faixa de ocupacao extrema", await q(`
  select m.league_code,
    count(*) filter (where m.attendance=0)::int as att_zero,
    count(*) filter (where m.attendance::numeric/v.capacity < 0.05)::int as sub5pct,
    count(*) filter (where m.attendance::numeric/v.capacity < 0.15)::int as sub15pct,
    count(*)::int as total
  from match m join venue v on v.id=m.venue_id
  where m.status='FT' and m.attendance is not null and v.capacity>0 group by 1 order by 1`))

// 5. ARBITRO: min/max completos por liga + estabilidade entre temporadas (PL 24/25 vs 25/26)
p("PL arbitro: range completo", await q(`
  with r as (select m.referee_id, m.id, count(cd.id)::int as cartoes
    from match m left join card cd on cd.match_id=m.id
    where m.status='FT' and m.referee_id is not null and m.league_code='PL' group by 1,2)
  select round(min(cj),2) as menor, round(max(cj),2) as maior, round(max(cj)/min(cj),2) as razao,
    round(avg(cj),2) as media, round(stddev(cj),2) as desvio, count(*)::int as arbitros
  from (select referee_id, avg(cartoes) as cj from r group by 1 having count(*)>=10) x`))

p("BRA arbitro: range completo", await q(`
  with r as (select m.referee_id, m.id, count(cd.id)::int as cartoes
    from match m left join card cd on cd.match_id=m.id
    where m.status='FT' and m.referee_id is not null and m.league_code='BRA' group by 1,2)
  select round(min(cj),2) as menor, round(max(cj),2) as maior, round(max(cj)/min(cj),2) as razao,
    round(avg(cj),2) as media, round(stddev(cj),2) as desvio, count(*)::int as arbitros
  from (select referee_id, avg(cartoes) as cj from r group by 1 having count(*)>=10) x`))

// 6. ARBITRO: vies pro-mandante (cartoes casa vs fora POR arbitro) — o mecanismo do dono
p("arbitro: vies casa/fora agregado por liga", await q(`
  select m.league_code, count(distinct m.id)::int as jogos,
    round(avg(cc.casa),2) as cart_casa, round(avg(cc.fora),2) as cart_fora,
    round(avg(cc.fora)-avg(cc.casa),3) as delta
  from match m join lateral (
    select count(*) filter (where c.team_id=m.home_team_id)::int as casa,
           count(*) filter (where c.team_id=m.away_team_id)::int as fora
    from card c where c.match_id=m.id) cc on true
  where m.status='FT' group by 1 order by 1`))

// 7. Penaltis
p("penaltis por liga", await q(`
  select m.league_code, count(distinct m.id)::int as jogos,
    count(g.id) filter (where g.type='penalty')::int as pen,
    round(count(g.id) filter (where g.type='penalty')::numeric/count(distinct m.id),3) as por_jogo
  from match m left join goal g on g.match_id=m.id where m.status='FT' group by 1 order by 1`))

// 8. Superficie: os 2 artificiais tem jogo?
p("jogos em piso artificial", await q(`
  select v.surface, v.name, count(m.id)::int as jogos
  from venue v left join match m on m.venue_id=v.id and m.status='FT'
  where v.surface is distinct from 'grass' group by 1,2 order by 3 desc`))

process.exit(0)
