import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }

// Correlacao de cada observavel AGREGADO DO JOGO com o total de gols. Mede quem move over/under.
console.log("correl(observavel do jogo, gols totais):", JSON.stringify(await q(`
 with agg as (
   select s.match_id,
     sum(s.shots_on_target)::int sot, sum(s.shots_total)::int shots, sum(s.dangerous_attacks)::int da,
     sum(s.attacks)::int atk, sum(s.corners)::int corners, sum(s.big_chances_created)::int bcc,
     sum(s.shots_insidebox)::int sin, sum(s.shots_blocked)::int sblk, sum(s.goal_attempts)::int gatt,
     sum(s.crosses_total)::int cross, sum(s.passes)::int passes, abs(max(s.possession)-min(s.possession))::int poss_gap
   from match_team_stats s group by 1)
 select count(*)::int n,
  corr(a.sot, m.ft_home+m.ft_away)::numeric(5,3) sot,
  corr(a.shots, m.ft_home+m.ft_away)::numeric(5,3) shots,
  corr(a.da, m.ft_home+m.ft_away)::numeric(5,3) dang_atk,
  corr(a.atk, m.ft_home+m.ft_away)::numeric(5,3) attacks,
  corr(a.corners, m.ft_home+m.ft_away)::numeric(5,3) corners,
  corr(a.bcc, m.ft_home+m.ft_away)::numeric(5,3) big_chances,
  corr(a.sin, m.ft_home+m.ft_away)::numeric(5,3) shots_inbox,
  corr(a.sblk, m.ft_home+m.ft_away)::numeric(5,3) shots_blocked,
  corr(a.gatt, m.ft_home+m.ft_away)::numeric(5,3) goal_attempts,
  corr(a.cross, m.ft_home+m.ft_away)::numeric(5,3) crosses,
  corr(a.passes, m.ft_home+m.ft_away)::numeric(5,3) passes,
  corr(a.poss_gap, m.ft_home+m.ft_away)::numeric(5,3) gap_de_posse
 from agg a join match m on m.id=a.match_id where m.status='FT'`), null, 1))

// Colinearidade ENTRE os observaveis: quem e o mesmo fenomeno com outro nome (anti-dupla-contagem)
console.log("\ncolinearidade entre observaveis (corr par a par):", JSON.stringify(await q(`
 select count(*)::int n,
  corr(dangerous_attacks, attacks)::numeric(5,3) da_x_atk,
  corr(dangerous_attacks, shots_total)::numeric(5,3) da_x_shots,
  corr(shots_on_target, shots_total)::numeric(5,3) sot_x_shots,
  corr(shots_on_target, big_chances_created)::numeric(5,3) sot_x_bcc,
  corr(corners, shots_total)::numeric(5,3) corners_x_shots,
  corr(corners, crosses_total)::numeric(5,3) corners_x_crosses,
  corr(possession, passes)::numeric(5,3) posse_x_passes,
  corr(possession, attacks)::numeric(5,3) posse_x_atk,
  corr(possession, dangerous_attacks)::numeric(5,3) posse_x_da,
  corr(goal_attempts, shots_total)::numeric(5,3) gatt_x_shots,
  corr(tackles, interceptions)::numeric(5,3) tack_x_int,
  corr(possession, tackles)::numeric(5,3) posse_x_tackles
 from match_team_stats`), null, 1))

// posse x gols: correlacao direta (o teste do refutado)
console.log("\nposse do time x gols DELE (team_total):", JSON.stringify(await q(`
 select count(*)::int n,
   corr(s.possession, case when s.team_id=m.home_team_id then m.ft_home else m.ft_away end)::numeric(5,3) posse_x_gols_proprios,
   corr(s.shots_on_target, case when s.team_id=m.home_team_id then m.ft_home else m.ft_away end)::numeric(5,3) sot_x_gols_proprios,
   corr(s.dangerous_attacks, case when s.team_id=m.home_team_id then m.ft_home else m.ft_away end)::numeric(5,3) da_x_gols_proprios
 from match_team_stats s join match m on m.id=s.match_id where m.status='FT'`), null, 1))

// escanteios: quem move o mercado de escanteios
console.log("\nescanteios do time: correl com crosses/shots/posse:", JSON.stringify(await q(`
 select count(*)::int n, avg(corners)::numeric(5,2) media_corners,
   corr(corners, crosses_total)::numeric(5,3) x_crosses,
   corr(corners, shots_total)::numeric(5,3) x_shots,
   corr(corners, possession)::numeric(5,3) x_posse,
   corr(corners, shots_blocked)::numeric(5,3) x_blocked
 from match_team_stats`), null, 1))

// dinamica pos-gol: o placar muda o ritmo? gols por faixa condicionado a placar apertado vs aberto aos 60'
console.log("\ncartoes por faixa de minuto:", JSON.stringify(await q(`
 select case when minute<=15 then '0-15' when minute<=30 then '16-30' when minute<=45 then '31-45'
             when minute<=60 then '46-60' when minute<=75 then '61-75' else '76+' end faixa,
        count(*)::int cartoes, count(*) filter (where type<>'yellow')::int vermelhos
 from card where minute is not null group by 1 order by 1`), null, 1))

// substituicoes: minuto de entrada via commentary existe?
console.log("\namostra de commentary de substituicao:", JSON.stringify(await q(`
 select minute, left(comment,110) comment from commentary
 where comment ilike '%substitution%' and minute is not null order by random() limit 5`), null, 1))

process.exit(0)
