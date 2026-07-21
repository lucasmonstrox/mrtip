import { db } from "../src/db/client"
import { sql } from "drizzle-orm"
const q = async (s: string) => { try { return (await db.execute(sql.raw(s))).rows ?? [] } catch (e:any) { return [{erro:e.message}] } }

// Cobertura das colunas do CONTRA-DOMÍNIO (observáveis dentro do jogo).
console.log("FT matches:", JSON.stringify(await q(`select count(*)::int n from match where status='FT'`)))

console.log("\nmatch_team_stats cobertura (linhas com valor não-nulo):", JSON.stringify(await q(`
 select count(*)::int linhas,
  count(possession)::int possession, count(dangerous_attacks)::int dang_atk, count(attacks)::int attacks,
  count(shots_on_target)::int sot, count(shots_blocked)::int sblock, count(shots_off_target)::int soff,
  count(shots_insidebox)::int sin, count(shots_outsidebox)::int sout,
  count(corners)::int corners, count(free_kicks)::int freekicks, count(big_chances_created)::int bcc,
  count(big_chances_missed)::int bcm, count(hit_woodwork)::int woodwork, count(goal_attempts)::int goalatt,
  count(tackles)::int tackles, count(interceptions)::int intercep, count(duels_won)::int duelswon,
  count(successful_headers)::int headers, count(passes)::int passes, count(pass_accuracy)::int passacc,
  count(long_passes)::int longp, count(crosses_total)::int crosses, count(dribble_attempts)::int dribbles,
  count(xg)::int xg
 from match_team_stats`), null, 1))

console.log("\nmatch cobertura:", JSON.stringify(await q(`
 select count(*)::int linhas, count(attendance)::int attendance, count(referee_id)::int referee,
        count(venue_id)::int venue, count(lineup_confirmed)::int lineup_conf, count(ht_home)::int halftime
 from match where status='FT'`), null, 1))

console.log("\nlineup_player cobertura (obs. do contra-domínio):", JSON.stringify(await q(`
 select count(*)::int linhas, count(minutes_played)::int minutos, count(offsides)::int offsides,
  count(offsides_provoked)::int offsides_prov, count(fouls)::int fouls, count(fouls_drawn)::int fouls_drawn,
  count(saves)::int saves, count(clearances)::int clearances, count(ball_recoveries)::int recoveries,
  count(possession_lost)::int poss_lost, count(turnovers)::int turnovers, count(dispossessed)::int disposs,
  count(aerials_won)::int aerials, count(duels_total)::int duels, count(tackles)::int tackles,
  count(interceptions)::int intercep, count(touches)::int touches, count(passes_final_third)::int p3,
  count(backward_passes)::int backward, count(long_balls)::int longballs,
  count(errors_lead_to_shot)::int err_shot, count(error_lead_to_goal)::int err_goal,
  count(penalties_committed)::int pen_com, count(penalties_won)::int pen_won,
  count(clearance_offline)::int clr_offline, count(last_man_tackle)::int lastman, count(rating)::int rating
 from lineup_player`), null, 1))

console.log("\nsubstituicoes? (starter=false com minutos>0):", JSON.stringify(await q(`
 select count(*)::int entrou_do_banco, avg(minutes_played)::numeric(6,2) media_min
 from lineup_player where starter=false and minutes_played>0`), null, 1))

console.log("\ntrend type_ids presentes:", JSON.stringify(await q(`
 select type_id, count(*)::int linhas, count(distinct match_id)::int jogos from match_trend group by 1 order by 1`), null, 1))

console.log("\ncards/goals/commentary:", JSON.stringify(await q(`
 select (select count(*) from card)::int cards, (select count(*) from card where minute is not null)::int cards_min,
        (select count(*) from goal)::int goals, (select count(*) from goal where minute is not null)::int goals_min,
        (select count(*) from commentary)::int comentarios,
        (select count(distinct match_id) from commentary)::int jogos_com_comentario,
        (select count(*) from weather)::int weather, (select count(*) from injury)::int injuries`), null, 1))

console.log("\ncommentary: linhas de substituicao?", JSON.stringify(await q(`
 select count(*)::int subs_mencionadas, count(distinct match_id)::int jogos
 from commentary where comment ilike '%substitution%' or comment ilike '%substitui%'`), null, 1))

console.log("\ncommentary: offside / falta / escanteio mencionados", JSON.stringify(await q(`
 select
  count(*) filter (where comment ilike '%offside%')::int offside,
  count(*) filter (where comment ilike '%foul%')::int foul,
  count(*) filter (where comment ilike '%corner%')::int corner,
  count(*) filter (where comment ilike '%free kick%')::int freekick,
  count(*) filter (where comment ilike '%header%')::int header,
  count(*) filter (where comment ilike '%counter%')::int counter
 from commentary`), null, 1))

console.log("\ngols por faixa de 15min (todas ligas FT):", JSON.stringify(await q(`
 select case when minute<=15 then '0-15' when minute<=30 then '16-30' when minute<=45 then '31-45'
             when minute<=60 then '46-60' when minute<=75 then '61-75' else '76+' end faixa,
        count(*)::int gols
 from goal where minute is not null group by 1 order by 1`), null, 1))

process.exit(0)
