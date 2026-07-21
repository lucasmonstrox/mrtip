import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }

console.log("cobertura por liga (jogos FT vs jogos com cada bloco):", JSON.stringify(await q(`
 select m.league_code, count(*)::int ft,
   count(distinct s.match_id)::int com_teamstats,
   count(distinct t.match_id)::int com_trend,
   count(distinct c.match_id)::int com_commentary,
   count(m.attendance)::int com_attendance,
   count(m.referee_id)::int com_referee
 from match m
 left join match_team_stats s on s.match_id=m.id
 left join match_trend t on t.match_id=m.id
 left join commentary c on c.match_id=m.id
 where m.status='FT' group by 1 order by 1`), null, 1))

// team fouls: existe no nível time? confronto SUM(lineup_player.fouls) vs free_kicks do adversario
console.log("\nfaltas: soma por jogador vs free_kicks do adversario (amostra 10 jogos):", JSON.stringify(await q(`
 with lp as (
   select l.match_id, l.team_id, sum(coalesce(p.fouls,0))::int faltas_cometidas
   from lineup l join lineup_player p on p.lineup_id=l.id group by 1,2)
 select lp.match_id, lp.team_id, lp.faltas_cometidas,
        (select s.free_kicks from match_team_stats s where s.match_id=lp.match_id and s.team_id<>lp.team_id) fk_adversario
 from lp where lp.faltas_cometidas>0 limit 10`), null, 1))

// correlacao grosseira faltas x cartoes
console.log("\nfaltas somadas x cartoes (por time-jogo, N e medias):", JSON.stringify(await q(`
 with lp as (
   select l.match_id, l.team_id, sum(coalesce(p.fouls,0))::int faltas
   from lineup l join lineup_player p on p.lineup_id=l.id group by 1,2),
 cd as (select match_id, team_id, count(*)::int cartoes from card group by 1,2)
 select count(*)::int n, avg(lp.faltas)::numeric(6,2) media_faltas,
        avg(coalesce(cd.cartoes,0))::numeric(6,2) media_cartoes,
        corr(lp.faltas, coalesce(cd.cartoes,0))::numeric(6,3) correl
 from lp left join cd on cd.match_id=lp.match_id and cd.team_id=lp.team_id
 where lp.faltas>0`), null, 1))

// posse x total de gols (o "ritmo" tem sinal?)
console.log("\nposse do mandante x gols totais:", JSON.stringify(await q(`
 select width_bucket(s.possession,35,65,6) faixa, count(*)::int n,
        avg(s.possession)::numeric(5,1) posse_media,
        avg(m.ft_home+m.ft_away)::numeric(5,2) gols_totais
 from match m join match_team_stats s on s.match_id=m.id and s.team_id=m.home_team_id
 where m.status='FT' and s.possession is not null group by 1 order by 1`), null, 1))

// dangerous attacks x gols
console.log("\nataques perigosos (soma dos 2 times) x gols totais:", JSON.stringify(await q(`
 with da as (select match_id, sum(dangerous_attacks)::int tot from match_team_stats where dangerous_attacks is not null group by 1)
 select width_bucket(da.tot,60,220,6) faixa, count(*)::int n, avg(da.tot)::numeric(6,1) da_media,
        avg(m.ft_home+m.ft_away)::numeric(5,2) gols
 from da join match m on m.id=da.match_id where m.status='FT' group by 1 order by 1`), null, 1))

// SoT x gols (o proxy de xG)
console.log("\nSoT total x gols totais:", JSON.stringify(await q(`
 with s2 as (select match_id, sum(shots_on_target)::int tot from match_team_stats where shots_on_target is not null group by 1)
 select s2.tot sot, count(*)::int n, avg(m.ft_home+m.ft_away)::numeric(5,2) gols
 from s2 join match m on m.id=s2.match_id where m.status='FT' and s2.tot between 2 and 16 group by 1 order by 1`), null, 1))

process.exit(0)
