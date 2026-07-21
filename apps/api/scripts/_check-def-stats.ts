import { db } from "../src/db/client"
import { sql } from "drizzle-orm"

// Verificação do backfill dos 6 stats defensivos: os números do banco batem com o que a API
// devolveu no probe (PL 25/26: 48 pênaltis cometidos e 83 erros que viraram gol em 200 jogos)?
const q = async (s: string) => (await db.execute(sql.raw(s))).rows

console.log("== PL 25/26 (deve bater com o probe da API) ==")
console.log(
  JSON.stringify(
    await q(`
    select count(distinct m.id)::int as jogos,
           sum(lp.error_lead_to_goal)::int as erro_virou_gol,
           sum(lp.penalties_committed)::int as penaltis_cometidos,
           sum(lp.penalties_won)::int as penaltis_ganhos,
           sum(lp.offsides_provoked)::int as impedimentos_provocados,
           sum(lp.turnovers)::int as turnovers,
           sum(lp.clearance_offline)::int as cortes_na_linha
    from lineup_player lp
    join lineup l on l.id = lp.lineup_id
    join match m on m.id = l.match_id
    join season s on s.id = m.season_id
    where s.league_code = 'PL' and s.start_year = 2025
  `),
    null,
    1,
  ),
)

console.log("\n== quem mais deu pênalti (todas as seasons) ==")
console.log(
  JSON.stringify(
    await q(`
    select p.name, count(*)::int as jogos_com, sum(lp.penalties_committed)::int as penaltis
    from lineup_player lp join player p on p.id = lp.player_id
    where lp.penalties_committed > 0
    group by p.name order by penaltis desc, jogos_com desc limit 8
  `),
    null,
    1,
  ),
)

console.log("\n== quem mais errou e virou gol ==")
console.log(
  JSON.stringify(
    await q(`
    select p.name, sum(lp.error_lead_to_goal)::int as erros_gol, sum(lp.errors_lead_to_shot)::int as erros_chute
    from lineup_player lp join player p on p.id = lp.player_id
    where lp.error_lead_to_goal > 0
    group by p.name order by erros_gol desc limit 8
  `),
    null,
    1,
  ),
)

console.log("\n== quem mais arma a linha de impedimento ==")
console.log(
  JSON.stringify(
    await q(`
    select p.name, sum(lp.offsides_provoked)::int as impedimentos_provocados, count(*)::int as jogos
    from lineup_player lp join player p on p.id = lp.player_id
    where lp.offsides_provoked > 0
    group by p.name order by impedimentos_provocados desc limit 8
  `),
    null,
    1,
  ),
)
process.exit(0)
