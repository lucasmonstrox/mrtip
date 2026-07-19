---
id: LIG-001
titulo: Página do jogador (perfil de performance)
modulo: ligas
status: em-andamento # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  dados: investigado # MVP é sem migração; o unlock de volume saiu pra LIG-003
  api: planejado # endpoint de perfil rico (appearances, agregados, per-90, splits) — P1..P6
  ia: ideia # norte: projeção λ do prop (quant) + explicação (LLM) no bloco de próxima-partida
  ui: planejado # apps/web — seções do MVP, charts, toggle per-90 — P1..P6
testada: parcial
testes:
  - "P1 (2026-06-28): assert no banco — getPlayerDetail(James Garner) = 38 appearances, gols dobrados por partida (2) == gols da season (2); E2E Chrome /players/:id renderiza 38 linhas com nota/min/G-A, 0 erro de console"
  - "P7 (2026-07-03): assert no banco — getPlayerDetail(artilheiro PL) devolve minuteEvents por tipo com 0 minutos nulos e avgMinutes preenchido; UI NÃO verificada no Chrome (chrome-devtools travado pelo profile)"
  - "P8 (2026-07-03): assert no banco — seasonTeamGames=38 (36 played + 2 missed), appearances=36 com KP em 17 e SoT em 29 (null SportMonks = 0); UI NÃO verificada no Chrome (chrome-devtools travado pelo profile)"
  - "P9 (2026-07-03): assert no banco — getPlayerDetail expandido pra campanha via concurrentSeasonIds: jogador com mais lineups de copa devolveu 47 appearances (35 PL + 6 Carabao + 6 FA Cup), seasonTeamGames=50 (12 de copa), switcher só com seasons PL (25583, 23614); UI NÃO verificada no Chrome (chrome-devtools travado pelo profile)"
depende_de: []
impacta: [LIG-003]
ancoras:
  settings: []
  tabelas: [player, lineup_player, goal, card, injury, match, league]
  tools: []
  funcoes: [getPlayerDetail]
  rotas: ["/players/:id"]
docs: [docs/investigacoes/pagina-do-jogador.md, docs/planos/LIG-001-pagina-do-jogador.md]
verificado_em: null
atualizado: 2026-07-03
---

# Página do jogador (perfil de performance)

## Descrição

Transformar a página do jogador (hoje stub: nome + gols/assists/jogos-fora + lista de gols, `player-detail.tsx`) num perfil de performance completo e útil pra aposta. Investigação (`/rs` + workflow) definiu o conjunto de seções/métricas/gráficos. Achado central: o granular por partida (`lineup_player.rating/minutesPlayed/manOfMatch`, `goal`, `card`, `injury`) **já está ingerido**, e os ~25 stats de volume por partida (chutes, SoT, passes, key passes, desarmes, faltas…) vêm da **mesma chamada** do sync, hoje filtrados de fora (`lineupDetailTypes:118,119,1490` em `sync-sportmonks.ts:265`). MVP = agregar/exibir o que há + alargar esse filtro; fase 2 = xG (add-on pago), carreira/transferências (multi-season), radar de percentil; norte = projeção λ do prop + explicação LLM.

## Tarefas

- [x] P1 api+ui — espinha: `appearances` por partida (lineup_player⋈lineup⋈match + goals/cards) renderizada como match-log enriquecido
- [x] P1.1 api+ui (2026-07-03) — match-log v2: `competition {name, logoUrl}` por appearance (join `league` via `match.leagueCode`, coluna Cp com crest), placar colorido por resultado (V verde/D vermelho) na perspectiva do jogador, chip C/F de mando, rows h-12 (padrão marcadores) e paginação 10-em-10 com fillers anti-CLS
- [x] P2 api+ui — agregados da season (jogos, titular, minutos, avg rating, gols/pênaltis, assists, cartões, MOTM) → card "Temporada"
- [x] P3 api+ui — per-90 com gate de amostra (piso 540 min) — exibido no card Temporada
- [x] P4 api+ui — breakdowns de gol: casa/fora + 1º/2º tempo (cobre W-005/W-006) — card Temporada
- [ ] P5 ui — strip de forma + consistência **pendentes**; ✅ gráfico de notas (ECharts) + ✅ gráfico de minutos por partida (ECharts) (2026-06-28)
- [ ] P6 api+ui — disciplina (cartões) + disponibilidade (lesões) + bio do header (idade/altura/nacionalidade/posição) — **bio ✅ (2026-06-28); cartões/lesões pendentes**
- [x] P7 api+ui (2026-07-03) — relógio 0–90' "Em que minuto ele decide": `minuteEvents` (gol/assist/cartão com minuto exato, oponente via appearance da mesma partida) no `getPlayerDetail` + scatter ECharts (1 ponto por evento no minuto exato, lanes anti-sobreposição, markLine HT, chips de filtro por tipo) em `minute-clock.tsx`; e `season.avgMinutes` (média de minutos por jogo jogado) exibido no card Temporada + header do gráfico de minutos
- [x] P9 api (2026-07-03) — escopo de campanha: `getPlayerDetail` expande o `seasonId` da liga pra `concurrentSeasonIds` (mesmo startYear, todas as competições) em TODAS as queries (totais, goalRows, appearances, assists, cartões, agregado de stats), `getRecentTeamGames` passou de `{seasonId}` pra `{seasonIds}` (strip da temporada inclui copas) e `seasonsOfPlayer` filtra `league.type = "league"` (season de copa não duplica o ano no switcher nem 404a no resolveSeason)
- [x] P8 api+ui (2026-07-03) — pacote de widgets de temporada: `PlayerAppearance` ganhou keyPasses/shotsOnTarget/shotsTotal por jogo; `seasonTeamGames` (getRecentTeamGames generalizada com {seasonId, limit}) pro strip; UI: "Temporada em resumo" (tiles com sparkline últimos 10 + per-90, `season-summary.tsx`), "Rating jogo a jogo" (heat-strip com célula não-jogou → link pro jogo, `rating-strip.tsx`), "Curva de forma" (KP/SoT por jogo + média móvel 5 + média season, null SportMonks = 0, `form-curve.tsx`), "G+A acumulados" (step, `cumulative-ga.tsx`), "Casa × fora per-90" (`home-away-split.tsx`) e colunas PC/CG no match-log

## Plano

> MVP **sem migração** — só agrega/exibe o granular já ingerido. Dossiê: `docs/planos/LIG-001-pagina-do-jogador.md`. Volume stats (chutes/passes/desarmes) = feature **LIG-003** à parte. Constraints transversais (TypeBox sem response schema, Eden revive datas, `type` não `interface`, UI em PT) valem em todo passo — não repetidas aqui.

**Decisões adiadas pro `/i` / defaults escolhidos:** piso de per-90 = **540 min (6×90)**; `rating` exibido **carimbado como "score SportMonks" opaco** (não é o "porquê" — recomendação do `/rs`); seletor de competição/season fica como scaffold visual (1 season hoje), sem lógica multi-season.

### P1 — Espinha: appearances por partida (walking skeleton) · api+ui
Em `apps/api/.../shared/shared.ts`: adicionar `type PlayerAppearance` (perto de `PlayerGoal#shared.ts:157`) = `{matchId, date, round, opponent, home, score, rating, minutes, starter, motm, goals, assists, cards}` e estender `getPlayerDetail#shared.ts:264` com `appearances: PlayerAppearance[]` — query `lineup_player ⋈ lineup ⋈ match` do jogador, left-join contagem de `goal` (autor, `ne(type,"own")`) / `goal` (assist) / `card` por match, ordenado por `match.date`. Campos atuais ficam (aditivo). Espelhar o estilo de `scorers.service.ts:23-83`. Na UI, `player-detail.tsx`: renderizar uma tabela de match-log a partir de `player.appearances` (data·adversário·placar·nota·min·titular·G/A·cartão·MOTM), substituindo o Card "Gols".
- **Prova:** com a API no ar, `curl -s localhost:<port>/v1/players/<id-de-titular> | jq '.appearances | length, (.[0]|{rating,minutes,starter})'` → length>0 e `rating` não-nulo. Chrome em `/players/<id>`: snapshot mostra a tabela com colunas nota/min.

### P2 — Agregados da season → header · api+ui
Em `getPlayerDetail`: adicionar `season` = `{appearances, minutesTotal, avgRating, goals:{total,openPlay,penalty}, assists, ga, cards:{yellow,red}, motmCount}`, derivado das `appearances` do P1 (sem nova query). Na UI: substituir os 3 `<Stat>` crus (`player-detail.tsx:30-32`) pelo resumo da season (avg rating carimbado "SportMonks").
- **Prova:** `curl … | jq '.season'` → objeto com `avgRating` e `goals.openPlay`+`goals.penalty` == `goals.total`. Chrome: header mostra os agregados.

### P3 — Per-90 com gate de amostra · api+ui
Em `getPlayerDetail`: adicionar `per90 = {goals, goalsOpenPlay, assists, ga, cards}` (evento ÷ `minutesTotal` × 90) + `minutesTotal` + `sampleSufficient` (`minutesTotal >= 540`). Na UI: bloco per-90 com toggle totais↔per-90; abaixo do piso, esconder per-90 e marcar "amostra insuficiente (<540 min)".
- **Prova:** `curl … | jq '.per90, .sampleSufficient'` → números coerentes (goals/90 = goals÷min×90). Chrome: toggle alterna totais/per-90; jogador com poucos minutos mostra "amostra insuficiente".

### P4 — Breakdowns de gol (W-005/W-006) · api+ui
Em `getPlayerDetail`: `goalSplits = {home, away, firstHalf, secondHalf, byMinuteBucket}` derivado das `appearances`/gols (casa = `goal.teamId == match.homeTeamId`; 1º tempo = `minute<=45`). Na UI: render como contagem + dot/strip (não histograma suavizado — amostra pequena, ver dossiê).
- **Prova:** `curl … | jq '.goalSplits | {home,away,firstHalf,secondHalf}'` → `home+away == goals.total` (e `firstHalf+secondHalf == total`). Chrome: blocos casa/fora e 1º/2º tempo visíveis.

### P5 — Forma + sparkline + consistência · ui
Em `player-detail.tsx` (dado já vem das `appearances`): strip dos últimos 5/10 (nota·min·G/A·cartão·MOTM por célula), sparkline de rating no header (SVG manual + `d3-scale` — sem dep nova; ver dossiê §dataviz), e consistência (mediana + dot-plot das notas). Rating sempre rotulado "score SportMonks".
- **Prova:** Chrome em `/players/<id>`: snapshot mostra strip dos últimos jogos + sparkline no header; `list_console_messages` sem erro.

### P6 — Disciplina, disponibilidade e bio · api+ui
Em `getPlayerDetail`: adicionar `cardsTimeline` (de `card`), `injuries` (de `injury`: type/reason) e enriquecer bio (`dateOfBirth`→idade, `height`, `nationality.flagUrl/name`, `position` da `lineup_player` mais frequente). UI: timeline de cartões, faixa de disponibilidade (Missing/Questionable + "Suspended"), e header com bio completa.
- **Prova:** `curl … | jq '{age:.age, position:.position, cards:(.cardsTimeline|length), inj:(.injuries|length)}'` → campos preenchidos. Chrome: header com idade/altura/bandeira/posição; seção de disciplina/disponibilidade renderiza.

## Evidências

- [código] `apps/api/src/db/sync-sportmonks.ts:24,265,406-408` — sync filtra `lineupDetailTypes:118,119,1490` na mesma chamada que traria os stats de volume → unlock de baixo custo.
- [código] `apps/api/src/db/schemas/leagues.ts:171-173,207-245,183-202` — rating/minutos/MOTM/gols/cartões/lesões já no schema.
- [código] `apps/web/.../player-detail.tsx` + `apps/api/.../shared.ts:264` — estado stub atual.
- [web] docs.sportmonks.com fixture-statistics / player-statistics / expected/includes (as-of 2026-06-28) — stats per-match vs season; xG é add-on pago; **xA não existe**; heatmap/coordenadas indisponíveis.
- [web] docs.sportmonks.com transfers + Team Squad — histórico de carreira/clubes confirmado (responde wishlist W-002).
- [web] FBref Scouting Report (percentil) · WhoScored strengths/weaknesses · FotMob per-90 percentile · Sofascore Attribute Overview — "número vira julgamento" + ponte ESTIMAR→EXPLICAR.
- [interno] `docs/mercados/jogadores-props.md` — settlement Opta, pricing Poisson, volume>gol, hit-rate, batedor de pênalti, traps de SGP.

## Verificação

- **P1 — espinha `appearances` (2026-06-28):**
  - **Banco/API:** `getPlayerDetail` no James Garner devolveu 38 appearances (season PL completa); invariante de integridade do join `gols dobrados por partida (2) == gols da season (2)` (caminhos independentes concordam → join não duplicou linhas).
  - **HTTP:** `GET /v1/players/:id` retorna `appearances` (Eden propaga o tipo pro client; web typecheck verde).
  - **E2E Chrome** (`/players/<garner>`): tabela com 38 partidas, mais recente primeiro, placar na perspectiva do jogador, vs/@, nota/min/G-A e marcadores de cartão corretos; 0 erro/warning de console. Screenshot na sessão.
- **P6 (parcial) — bio do header (2026-06-28):** `getPlayerDetail` ganhou `imageUrl/dateOfBirth/height/position/nationality` (leftJoin `nationality`, posição = `lineup_player.position` mais frequente). UI: foto + nacionalidade (bandeira) + posição + idade (date-fns `differenceInYears`) + nascimento + altura. **E2E Chrome:** James Garner → "England · Meio-campo · 25 anos · 13 de mar, 2001 · 182 cm" + foto; 0 erro de console. Restam cartões/lesões do P6.
- **Batch UI a pedido do dono (2026-06-28) — verificado no Chrome (Garner/Everton), console limpo:**
  - **Peso (kg)** com ícone (lucide `Weight`) — **exigiu `dados`:** coluna `player.weight` (migração `0001_nervous_strong_guy.sql`) + `weight` no sync (SmPlayer + upsert) + **re-sync** (probe confirmou que a SportMonks entrega weight no include `lineups.player`; Garner 78kg). Ícones tb pra altura (`Ruler`) e posição (`MapPin`).
  - **Notas coloridas** (W-014): `ratingColor()` promovido de `match-detail/lineup.tsx` → `utils/format.ts` (compartilhado), aplicado na coluna Nota.
  - **Clube atual**: `getPlayerDetail.currentTeam` = time da appearance mais recente (Everton); header com logo+nome → `/teams/:slug`.
  - **Gráfico de notas na temporada (ECharts)**: `rating-chart.tsx` (client, `echarts.init` em `useEffect`), linha colorida pela mesma escala (visualMap) + linha de média.
  - **Logo do adversário** na coluna Adversário (`opponentLogo` na appearance).
- **Desvios do Plano (registrados):** (1) o `/pl` dizia "MVP **sem migração**" — o peso adicionou 1 coluna aditiva + re-sync (decisão do dono); (2) o `/rs` recomendava SVG/Recharts e **desaconselhava libs pesadas** — o dono escolheu **ECharts** (decisão de tooling do dono prevalece). Ambos conscientes, não acidentais.
- **P2–P4 + charts (2026-06-28) — verificado no Chrome (Garner/Everton), console limpo:** `getPlayerDetail` ganhou `season` (jogos 38, titular 38, minutos 3414, avg 7.33, gols/pênaltis, assists, cartões, MOTM), `per90` (com `sufficient` gate em 540 min) e `goalSplits` (casa/fora + 1º/2º tempo) — tudo derivado da espinha, sem nova query. UI: card **Temporada**. Charts ECharts: **Evolução da nota** (visualMap por faixa, média no header top-right, tooltip com logo do adversário) e **Minutos por partida** (barras titular/suplente, tooltip com logo). 2 canvases inicializados, 0 erro de console.
- **Pendentes** (`em-andamento`): strip de forma + consistência de nota (P5); timeline de cartões + disponibilidade/lesões (P6).
