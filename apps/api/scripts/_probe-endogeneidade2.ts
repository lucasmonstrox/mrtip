/**
 * Selecao da amostra de goleiro reserva: o teste "save% titular vs reserva" que a matriz chama de
 * mais barato mede qualidade de goleiro ou CONTEXTO DE JOGO?
 *   bun run scripts/_probe-endogeneidade2.ts
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

// aparicoes por (time, temporada, goleiro) -> o de mais aparicoes e o titular; o resto e reserva.
const BASE = `
 with ap as (
   select l.team_id, m.season_id, lp.player_id, count(*)::int n
   from lineup_player lp
   join lineup l on l.id = lp.lineup_id
   join match m on m.id = l.match_id
   where lp.position='G' and coalesce(lp.minutes_played,0) > 0 and m.status='FT'
   group by 1,2,3),
 rk as (select *, row_number() over (partition by team_id, season_id order by n desc) rn from ap),
 jogos as (
   select l.match_id, l.team_id, lp.player_id, m.season_id, m.league_code,
     (case when l.team_id = m.home_team_id then m.away_team_id else m.home_team_id end) opp_id,
     (case when l.team_id = m.home_team_id then m.ft_away else m.ft_home end)::numeric gols_sofridos,
     lp.saves::numeric saves
   from lineup_player lp
   join lineup l on l.id = lp.lineup_id
   join match m on m.id = l.match_id
   where lp.position='G' and coalesce(lp.minutes_played,0) > 0 and m.status='FT'),
 j as (select jogos.*, rk.rn from jogos join rk
        on rk.team_id=jogos.team_id and rk.season_id=jogos.season_id and rk.player_id=jogos.player_id)`

p(
  "B. aparicoes: titular (modal) vs reserva, por liga",
  await q(`${BASE}
 select league_code,
   count(*) filter (where rn=1)::int titular,
   count(*) filter (where rn>1)::int reserva,
   (count(*) filter (where rn>1)::numeric / nullif(count(*),0) * 100)::numeric(5,1) pct_reserva
 from j group by 1 order by 1`),
)

p(
  "C. contexto do jogo: posicao do adversario e gols sofridos, titular vs reserva (PL+BRA)",
  await q(`${BASE}
 select case when j.rn=1 then 'titular' else 'reserva' end quem,
   count(*)::int n,
   avg(st.position)::numeric(5,2) pos_media_adversario,
   avg(j.gols_sofridos)::numeric(5,3) gols_sofridos_media,
   avg(j.saves)::numeric(5,3) saves_media
 from j left join standing st on st.team_id=j.opp_id and st.season_id=j.season_id
 where j.league_code in ('PL','BRA') group by 1 order by 1`),
)

process.exit(0)
