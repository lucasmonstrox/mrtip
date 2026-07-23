UPDATE match_team_stats AS mts
SET clearances = sub.sum_clr
FROM (
  SELECT li.match_id, li.team_id,
         SUM(lp.clearances)::int AS sum_clr
  FROM lineup_player lp
  JOIN lineup li ON li.id = lp.lineup_id
  WHERE lp.clearances IS NOT NULL
  GROUP BY li.match_id, li.team_id
) AS sub
WHERE mts.match_id = sub.match_id
  AND mts.team_id = sub.team_id;
