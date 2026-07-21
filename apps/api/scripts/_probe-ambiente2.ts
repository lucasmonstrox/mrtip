import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }
const p = (label: string, rows: unknown) => console.log(`\n=== ${label} ===\n` + JSON.stringify(rows, null, 1))

// Base: jogos FT com ocupacao SANEADA (descarta ratio>1.05 = capacity errada/estadio trocado)
const BASE = `
  with j as (
    select m.id, m.league_code, m.home_team_id, m.away_team_id,
      (m.ft_home+m.ft_away) as gols,
      m.attendance::numeric/nullif(v.capacity,0) as ocup
    from match m join venue v on v.id=m.venue_id
    where m.status='FT' and m.attendance is not null and v.capacity>0
      and m.attendance::numeric/nullif(v.capacity,0) <= 1.05
  ), c as (
    select j.*,
      count(cd.id) filter (where cd.team_id=j.home_team_id)::int as cart_casa,
      count(cd.id) filter (where cd.team_id=j.away_team_id)::int as cart_fora
    from j left join card cd on cd.match_id=j.id
    group by j.id,j.league_code,j.home_team_id,j.away_team_id,j.gols,j.ocup
  )`

p("quantos jogos a sanidade descarta (ratio>1.05)", await q(`
  select m.league_code, count(*)::int as com_ocup,
    count(*) filter (where m.attendance::numeric/v.capacity > 1.05)::int as ratio_impossivel
  from match m join venue v on v.id=m.venue_id
  where m.status='FT' and m.attendance is not null and v.capacity>0
  group by 1 order by 1`))

// DOSE-RESPOSTA DENTRO DA LIGA (o teste real do mecanismo torcida->arbitro)
p("BRA: ocupacao x gols/cartoes (dentro da liga)", await q(`${BASE}
  select case when ocup<0.35 then 'a <35%' when ocup<0.55 then 'b 35-55%'
              when ocup<0.75 then 'c 55-75%' else 'd >=75%' end as faixa,
    count(*)::int as n, round(avg(gols),2) as gols,
    round(avg(cart_casa),2) as cart_casa, round(avg(cart_fora),2) as cart_fora,
    round(avg(cart_fora)-avg(cart_casa),2) as delta
  from c where league_code='BRA' group by 1 order by 1`))

p("PL: ocupacao x gols/cartoes (dentro da liga)", await q(`${BASE}
  select case when ocup<0.90 then 'a <90%' when ocup<0.97 then 'b 90-97%'
              when ocup<0.995 then 'c 97-99.5%' else 'd >=99.5%' end as faixa,
    count(*)::int as n, round(avg(gols),2) as gols,
    round(avg(cart_casa),2) as cart_casa, round(avg(cart_fora),2) as cart_fora,
    round(avg(cart_fora)-avg(cart_casa),2) as delta
  from c where league_code='PL' group by 1 order by 1`))

// Vantagem de mando por faixa de ocupacao (BRA — onde ha variancia)
p("BRA: mando (pts do mandante) x ocupacao", await q(`${BASE}
  select case when ocup<0.35 then 'a <35%' when ocup<0.55 then 'b 35-55%'
              when ocup<0.75 then 'c 55-75%' else 'd >=75%' end as faixa,
    count(*)::int as n,
    round(avg(case when m.ft_home>m.ft_away then 1.0 else 0 end),3) as pct_vit_casa,
    round(avg(case when m.ft_home<m.ft_away then 1.0 else 0 end),3) as pct_vit_fora,
    round(avg(m.ft_home::numeric - m.ft_away),3) as saldo_medio_casa
  from c join match m on m.id=c.id where c.league_code='BRA' group by 1 order by 1`))

// ARBITRO por liga — a dispersao real (o P1)
p("PL: arbitros >=10 jogos", await q(`
  with r as (select m.referee_id, m.id, count(cd.id)::int as cartoes
    from match m left join card cd on cd.match_id=m.id
    where m.status='FT' and m.referee_id is not null and m.league_code='PL' group by 1,2)
  select rf.name, count(*)::int as jogos, round(avg(r.cartoes),2) as cart_jogo
  from r join referee rf on rf.id=r.referee_id group by 1 having count(*)>=10 order by 3 desc`))

p("BRA: arbitros >=10 jogos", await q(`
  with r as (select m.referee_id, m.id, count(cd.id)::int as cartoes
    from match m left join card cd on cd.match_id=m.id
    where m.status='FT' and m.referee_id is not null and m.league_code='BRA' group by 1,2)
  select rf.name, count(*)::int as jogos, round(avg(r.cartoes),2) as cart_jogo
  from r join referee rf on rf.id=r.referee_id group by 1 having count(*)>=10 order by 3 desc`))

// Penaltis por arbitro (evento raro? quantos temos)
p("penaltis: volume total por liga", await q(`
  select m.league_code, count(*)::int as jogos,
    count(g.id) filter (where g.type='penalty')::int as gols_penalty,
    round(count(g.id) filter (where g.type='penalty')::numeric/count(distinct m.id),3) as pen_por_jogo
  from match m left join goal g on g.match_id=m.id
  where m.status='FT' group by 1 order by 1`))

// CLIMA: o "under de chuva" refutado — reconferir com a coluna real
p("clima x gols (description)", await q(`
  select w.description, count(*)::int as n, round(avg(m.ft_home+m.ft_away),2) as gols
  from match m join weather w on w.match_id=m.id where m.status='FT'
  group by 1 having count(*)>=15 order by 3 desc`))

p("vento x gols", await q(`
  select case when w.wind_speed<3 then 'a <3m/s' when w.wind_speed<6 then 'b 3-6' when w.wind_speed<9 then 'c 6-9' else 'd >=9' end as faixa,
    count(*)::int as n, round(avg(m.ft_home+m.ft_away),2) as gols,
    round(avg(mts.corners),2) as escanteios
  from match m join weather w on w.match_id=m.id
  left join match_team_stats mts on mts.match_id=m.id
  where m.status='FT' and w.wind_speed is not null group by 1 order by 1`))

p("temperatura x gols", await q(`
  select case when w.temp_day<5 then 'a <5C' when w.temp_day<12 then 'b 5-12' when w.temp_day<20 then 'c 12-20'
              when w.temp_day<27 then 'd 20-27' else 'e >=27' end as faixa,
    count(*)::int as n, round(avg(m.ft_home+m.ft_away),2) as gols
  from match m join weather w on w.match_id=m.id
  where m.status='FT' and w.temp_day is not null group by 1 order by 1`))

// HORARIO por liga
p("horario x gols por liga", await q(`
  select m.league_code, substring(m.time from 1 for 2) as hora, count(*)::int as n,
    round(avg(m.ft_home+m.ft_away),2) as gols
  from match m where m.status='FT' and m.time is not null and m.league_code in ('PL','BRA')
  group by 1,2 having count(*)>=25 order by 1,2`))

process.exit(0)
