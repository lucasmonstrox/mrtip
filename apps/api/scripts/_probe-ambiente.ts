import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }
const p = (label: string, rows: unknown) => console.log(`\n=== ${label} ===\n` + JSON.stringify(rows, null, 1))

// 1. Cobertura das colunas da família (torcida/mando/árbitro/ambiente)
p("cobertura match (FT only)", await q(`
  select m.league_code,
    count(*)::int as ft,
    count(m.attendance)::int as com_attendance,
    count(m.referee_id)::int as com_referee,
    count(m.venue_id)::int as com_venue,
    count(m.time)::int as com_horario
  from match m where m.status='FT' group by 1 order by 1`))

p("cobertura venue", await q(`
  select count(*)::int as venues,
    count(capacity)::int as com_capacity,
    count(surface)::int as com_surface,
    count(latitude)::int as com_latlong,
    count(distinct surface)::int as surfaces_distintos
  from venue`))

p("surface distintos", await q(`select surface, count(*)::int from venue group by 1 order by 2 desc`))

p("cobertura weather (FT)", await q(`
  select m.league_code, count(*)::int as ft, count(w.id)::int as com_weather
  from match m left join weather w on w.match_id=m.id where m.status='FT' group by 1 order by 1`))

// 2. Ocupação = attendance/capacity — existe de fato? distribuição?
p("ocupacao (attendance/capacity)", await q(`
  select m.league_code, count(*)::int as n,
    round(avg(m.attendance::numeric/nullif(v.capacity,0))::numeric,3) as ocup_media,
    round(min(m.attendance::numeric/nullif(v.capacity,0))::numeric,3) as ocup_min,
    round(max(m.attendance::numeric/nullif(v.capacity,0))::numeric,3) as ocup_max,
    count(*) filter (where m.attendance::numeric/nullif(v.capacity,0) < 0.5)::int as abaixo_50pct
  from match m join venue v on v.id=m.venue_id
  where m.status='FT' and m.attendance is not null and v.capacity>0 group by 1 order by 1`))

// 3. Gols/cartoes por faixa de ocupacao — o teste do mecanismo torcida->arbitro
p("cartoes+gols por faixa de ocupacao", await q(`
  with j as (
    select m.id, m.league_code, m.ft_home, m.ft_away,
      m.attendance::numeric/nullif(v.capacity,0) as ocup
    from match m join venue v on v.id=m.venue_id
    where m.status='FT' and m.attendance is not null and v.capacity>0
  ), c as (
    select j.id, j.league_code, j.ocup, (j.ft_home+j.ft_away) as gols,
      count(cd.id) filter (where cd.team_id = m.home_team_id)::int as cart_casa,
      count(cd.id) filter (where cd.team_id = m.away_team_id)::int as cart_fora
    from j join match m on m.id=j.id left join card cd on cd.match_id=j.id
    group by 1,2,3,4
  )
  select case when ocup<0.7 then 'a <70%' when ocup<0.9 then 'b 70-90%' when ocup<0.98 then 'c 90-98%' else 'd >=98%' end as faixa,
    count(*)::int as n,
    round(avg(gols),2) as gols_medio,
    round(avg(cart_casa),2) as cart_casa,
    round(avg(cart_fora),2) as cart_fora,
    round(avg(cart_fora)-avg(cart_casa),2) as delta_fora_menos_casa
  from c group by 1 order by 1`))

// 4. Arbitro: dispersao de cartoes por arbitro (o P1 do repo)
p("dispersao cartoes por arbitro (>=10 jogos)", await q(`
  with r as (
    select m.referee_id, m.league_code, m.id, count(cd.id)::int as cartoes
    from match m left join card cd on cd.match_id=m.id
    where m.status='FT' and m.referee_id is not null group by 1,2,3
  )
  select league_code, count(distinct referee_id)::int as arbitros,
    round(avg(cartoes),2) as media_geral
  from r group by 1 order by 1`))

p("top/bottom arbitros PL (>=10 jogos)", await q(`
  with r as (
    select m.referee_id, m.id, count(cd.id)::int as cartoes
    from match m left join card cd on cd.match_id=m.id
    where m.status='FT' and m.referee_id is not null group by 1,2
  ), a as (
    select rf.name, count(*)::int as jogos, round(avg(r.cartoes),2) as cart_jogo
    from r join referee rf on rf.id=r.referee_id group by 1 having count(*)>=10
  )
  select * from a order by cart_jogo desc`))

// 5. Horario do jogo — existe variacao util?
p("gols por horario", await q(`
  select m.league_code, substring(m.time from 1 for 2) as hora, count(*)::int as n,
    round(avg(m.ft_home+m.ft_away),2) as gols
  from match m where m.status='FT' and m.time is not null
  group by 1,2 having count(*)>=20 order by 1,2`))

// 6. Superficie
p("gols por surface", await q(`
  select v.surface, count(*)::int as n, round(avg(m.ft_home+m.ft_away),2) as gols
  from match m join venue v on v.id=m.venue_id where m.status='FT' group by 1 order by 2 desc`))

process.exit(0)
