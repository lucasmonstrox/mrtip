/**
 * Auditoria de ENDOGENEIDADE / CAUSALIDADE REVERSA / VIÉS DE SELEÇÃO.
 * Duas perguntas que decidem o valor de evidências que a matriz de mecanismos trata como cravadas:
 *
 * 1) O "viés de total medido" (_audit-total-bias, N=56) é PROSPECTIVO? Se o prognóstico foi gerado
 *    DEPOIS do apito, ele não mede viés de previsão — mede o texto escrito com o placar na mão.
 * 2) O "SoT é o conduíte-rei" (corr 0,519 com gols) é causal ou TAUTOLÓGICO? Gol conta como chute
 *    no alvo na definição Opta/SportMonks — se conta, a correlação embute a identidade gol ⊂ SoT.
 *
 *   bun run scripts/_probe-endogeneidade.ts
 */
import { sql } from "drizzle-orm"

import { db } from "../src/db/client"

const q = async (s: string) => {
  try {
    return (await db.execute(sql.raw(s))).rows ?? []
  } catch (e: any) {
    return [{ erro: e.message }]
  }
}
const p = (label: string, r: unknown) => console.log(`\n### ${label}\n` + JSON.stringify(r, null, 1))

// ─── 1. LOOK-AHEAD: o prognóstico foi escrito antes ou depois do jogo? ───
p(
  "1a. match_prognosis: run_at vs data do jogo (run mais recente por partida, só jogos disputados)",
  await q(`
 with ult as (
   select distinct on (mp.match_id) mp.match_id, mp.run_at, m.date, m.round, m.league_code
   from match_prognosis mp join match m on m.id = mp.match_id
   where m.ft_home is not null and mp.total is not null
   order by mp.match_id, mp.run_at desc)
 select count(*)::int n,
   count(*) filter (where run_at::date >  date)::int depois_do_dia_do_jogo,
   count(*) filter (where run_at::date =  date)::int mesmo_dia,
   count(*) filter (where run_at::date <  date)::int antes_do_dia,
   min(run_at)::text primeiro_run, max(run_at)::text ultimo_run,
   min(date)::text primeiro_jogo, max(date)::text ultimo_jogo
 from ult`),
)

p(
  "1b. composição: por liga e rodada (a amostra é aleatória ou é uma rodada só?)",
  await q(`
 with ult as (
   select distinct on (mp.match_id) mp.match_id, mp.run_at, m.date, m.round, m.league_code
   from match_prognosis mp join match m on m.id = mp.match_id
   where m.ft_home is not null and mp.total is not null
   order by mp.match_id, mp.run_at desc)
 select league_code, round, count(*)::int n,
   count(*) filter (where run_at::date > date)::int pos_jogo
 from ult group by 1,2 order by 1,2`),
)

p(
  "1c. quantas partidas do banco TÊM prognóstico (denominador da seleção)",
  await q(`
 select m.league_code,
   count(*)::int jogos_ft,
   count(*) filter (where exists (select 1 from match_prognosis mp where mp.match_id=m.id))::int com_prognostico
 from match m where m.status='FT' group by 1 order by 1`),
)

// ─── 2. TAUTOLOGIA: gol está dentro de shots_on_target? ───
p(
  "2a. sanidade da identidade: existe algum time-jogo com gols > shots_on_target?",
  await q(`
 select count(*)::int n_time_jogo,
   count(*) filter (where gols > sot)::int gols_maior_que_sot,
   count(*) filter (where gols = sot)::int gols_igual_sot,
   avg(gols)::numeric(5,3) media_gols, avg(sot)::numeric(5,3) media_sot
 from (
   select s.shots_on_target sot,
     case when s.team_id=m.home_team_id then m.ft_home else m.ft_away end gols
   from match_team_stats s join match m on m.id=s.match_id
   where m.status='FT' and s.shots_on_target is not null) t`),
)

p(
  "2b. TESTE-CHAVE — correlação com gols ANTES e DEPOIS de remover o gol do numerador (nível JOGO)",
  await q(`
 with agg as (
   select s.match_id,
     sum(s.shots_on_target)::int sot,
     sum(s.big_chances_created)::int bcc,
     sum(s.shots_total)::int shots,
     sum(s.corners)::int corners
   from match_team_stats s group by 1)
 select count(*)::int n,
   corr(a.sot, m.ft_home+m.ft_away)::numeric(5,3)                      sot_bruto,
   corr(a.sot - (m.ft_home+m.ft_away), m.ft_home+m.ft_away)::numeric(5,3) sot_SEM_gol,
   corr(a.bcc, m.ft_home+m.ft_away)::numeric(5,3)                      bcc_bruto,
   corr(a.bcc - (m.ft_home+m.ft_away), m.ft_home+m.ft_away)::numeric(5,3) bcc_SEM_gol,
   corr(a.shots, m.ft_home+m.ft_away)::numeric(5,3)                    shots_bruto,
   corr(a.shots - (m.ft_home+m.ft_away), m.ft_home+m.ft_away)::numeric(5,3) shots_SEM_gol,
   corr(a.corners, m.ft_home+m.ft_away)::numeric(5,3)                  corners_controle
 from agg a join match m on m.id=a.match_id where m.status='FT'`),
)

p(
  "2c. mesmo teste no nível TIME (team_total)",
  await q(`
 select count(*)::int n,
   corr(s.shots_on_target, g.gols)::numeric(5,3) sot_bruto,
   corr(s.shots_on_target - g.gols, g.gols)::numeric(5,3) sot_SEM_gol,
   corr(s.big_chances_created, g.gols)::numeric(5,3) bcc_bruto,
   corr(s.big_chances_created - g.gols, g.gols)::numeric(5,3) bcc_SEM_gol
 from match_team_stats s join match m on m.id=s.match_id
 join lateral (select (case when s.team_id=m.home_team_id then m.ft_home else m.ft_away end)::numeric gols) g on true
 where m.status='FT'`),
)

p(
  "2d. o teste que importa pra APOSTA: SoT PASSADO do time prediz gol FUTURO? (correlação preditiva, não contemporânea)",
  await q(`
 with tj as (
   select s.match_id, s.team_id, m.date, m.league_code,
     s.shots_on_target::numeric sot,
     (case when s.team_id=m.home_team_id then m.ft_home else m.ft_away end)::numeric gols
   from match_team_stats s join match m on m.id=s.match_id where m.status='FT'),
 movel as (
   select t.*,
     avg(t.sot) over (partition by t.team_id order by t.date rows between 5 preceding and 1 preceding) sot_ant5,
     avg(t.gols) over (partition by t.team_id order by t.date rows between 5 preceding and 1 preceding) gols_ant5
   from tj t)
 select count(*)::int n,
   corr(sot_ant5, gols)::numeric(5,3)  sot_passado_x_gol_deste_jogo,
   corr(gols_ant5, gols)::numeric(5,3) gols_passados_x_gol_deste_jogo,
   corr(sot, gols)::numeric(5,3)       sot_contemporaneo_x_gol
 from movel where sot_ant5 is not null`),
)

// ─── 3. injury: a lista de desfalcados é derivada do lineup? (definição, não observação) ───
p(
  "3. injury prospectivo vs retrospectivo (se a lista é montada do lineup, ela só existe depois do jogo)",
  await q(`
 select m.status,
   count(distinct m.id)::int jogos,
   count(i.*)::int linhas_injury,
   (count(i.*)::numeric / nullif(count(distinct m.id),0))::numeric(6,2) por_jogo
 from match m left join injury i on i.match_id=m.id
 where m.league_code in ('BRA','PL') group by 1 order by 2 desc`),
)

process.exit(0)
