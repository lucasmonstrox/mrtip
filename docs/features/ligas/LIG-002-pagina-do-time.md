---
id: LIG-002
titulo: Página do time (perfil de performance)
modulo: ligas
status: verificado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  dados: verificado # P2 (migração 0002: 12 colunas home/away em standing, type_ids 135-146; populado, assert no banco); stat por partida = fase 2 (custo de tier INDETERMINADO)
  api: verificado # P1 (standing oficial + splits home/away) + P3 (trends Wilson 95%/gate n≥10) em getTeam — provado via curl/bun
  ia: ideia # fase 2: projeção λ de gols (Poisson interno = GRÁTIS) + explicação (LLM); xG VETADO pelo dono (2026-06-28); Predictions é add-on pago
  ui: verificado # P1 (header logo/shortCode/classificação+FormGuide) + P2 (splits casa/fora) + P3 (card "Gols" c/ banda+toggle) + P4 (match-log V/E/D) — golden path E2E no Chrome OK
testada: sim
testes:
  - "API curl /v1/teams/arsenal → standing {position:1,points:85,zone:champions} + shortCode ARS (2026-06-28)"
  - "API bun fetch trends → all n=38 over2.5 53% IC[37,68]; home over2.5 58%; away cleanSheet 42% (2026-06-28)"
  - "P2 splits oficiais: type_ids 135-146 confirmados na resposta viva; migração 0002 aplicada; assert no banco (arsenal home_won=15/away_won=11) + API standing.home/away (2026-06-28)"
  - "bun run typecheck + lint: 0 erros (2026-06-28)"
  - "Revisor em contexto fresco: nenhum gap A1/A2, Wilson validado numericamente (2026-06-28)"
  - "Golden path E2E Chrome (/teams/arsenal): header logo+ARS, Classificação 1º/85/Champions, splits casa 15V·2E·2D / fora 11V·5E·3D, card Gols toggle Tudo↔Casa (over2.5 53%→58%, n 38→19), match-log V/E/D — 0 erros de console (2026-06-28)"
depende_de: []
impacta: [DOS-001, LIG-001, MOD-001] # tocam a âncora compartilhada `match`; re-testar ao mexer
ancoras:
  settings: []
  tabelas: [team, standing, match, goal, card, lineup, coach, injury]
  tools: []
  funcoes: [getTeam, getTeamBySlug, loadTeamMatches, computeForm, computeStandings]
  rotas: ["/teams/:slug"]
docs: [docs/investigacoes/pagina-do-time.md, docs/planos/LIG-002-pagina-do-time.md]
verificado_em: 2026-06-28
atualizado: 2026-06-28
---

# Página do time (perfil de performance)

## Descrição

Transformar a página do time (hoje stub: nome + `FormChips` dos últimos 5 + lista de jogos com placar, `team-detail.tsx:18-56`) num perfil de performance útil pra aposta. Investigação (workflow) definiu seções/métricas e revelou o **achado central, que inverte o precedente do jogador**: no nível de TIME **não há unlock barato de filtro** — as stats por partida (posse, chutes, SoT, escanteios, faltas) **nem são pedidas** ao SportMonks (o include do sync é `participants;scores;round;state;lineups...;formations;events.type`, **sem `;statistics`** — `sync-sportmonks.ts:265-266`), e não há tabela para guardá-las. Em compensação, **o agregado oficial de season já está ingerido e ocioso**: `standing` (posição/pontos/V-E-D/GF-GA/saldo/zona — `leagues.ts:68-92`) é lido só pelo endpoint de standings da liga (`standings.service.ts:21-26`) e nunca chega em `/teams/:slug` (`get-team.service.ts:5-9`). E `loadTeamMatches#shared.ts:437-442` já traz todos os jogos com placar → over/under, BTTS, clean sheets **deriváveis** reusando `computeStandings#shared.ts:739-793` e `computeForm(side)#shared.ts:818-845`. **Correção do counter-review:** os **splits casa/fora oficiais** já vêm no `details` da chamada de standings que o sync faz (`sync:204-205`), mas são descartados (`detVal` pega só os totais — `sync:236-243`) e `standing` não tem colunas home/away → capturar a fonte autoritativa é uma **micro-migração** (colunas), mais confiável que derivar de n≈19 (que vira cross-check). MVP = juntar `standing` + capturar splits oficiais (micro-migração) + agregar tendências **gateadas por amostra (n≥10, banda/IC)**; fase 2 = `;statistics` + `match_team_stat` + re-sync (**custo de tier INDETERMINADO até chamada real de verificação**); xG **e Predictions** são add-ons pagos (carimbados juntos); bloco próxima-partida grátis = Poisson interno; norte = projeção λ de gols (quant) + explicação LLM. **`injury`=0 no banco (confirmado)** → desfalques (#8/P6) seguem bloqueados; comentários `shared.ts:131/296/654` ("injury complete") são enganosos.

## Tarefas

- [x] P1 api+ui — esqueleto: juntar a linha **oficial** de `standing` (posição/pontos/V-E-D/GF-GA-GD/zona) + `shortCode` ao payload de `getTeam`; header com logo + standing; `FormChips` → `FormGuide`
- [x] P2 dados+api+ui — **micro-migração aditiva**: 12 colunas home/away em `standing` (migração `0002`) populadas do `details` oficial (type_ids 135-146 confirmados); UI dos splits casa/fora **oficiais** no card de Classificação
- [x] P3 api+ui — tendências de aposta (over 2.5/BTTS/clean sheet/gols-por-jogo) derivadas de `loadTeamMatches`, **com gate de amostra (n≥10) + banda Wilson 95%** e carimbo de `n`/fonte
- [x] P4 ui — match-log enriquecido (resultado V/E/D por jogo na lista) + indicadores de confiança por amostra
- [ ] _(fora de escopo, fase 2)_ stats de time **por partida** (custo de tier indeterminado) · técnico/desfalques (`injury`=0) · add-ons pagos (xG/Predictions) — ver `## Plano` › Fora de escopo

## Plano (2026-06-28)

Dossiê: [docs/planos/LIG-002-pagina-do-time.md](../../planos/LIG-002-pagina-do-time.md)

### Objetivo, aceite e non-goals

"Pronto" (MVP) = `/teams/:slug` mostra um perfil de aposta a partir do dado **já ingerido**: header com logo+shortCode+classificação oficial, splits casa/fora oficiais, e tendências (over/BTTS/clean-sheet) com gate de amostra e banda de incerteza.
Non-goals: stats de time por partida (posse/chutes/escanteios), técnico, desfalques, xG e Predictions — tudo fase 2 (ver Fora de escopo). Nada de % de certeza.
Aceite (cada critério aponta a Prova):
- A1 [api] `GET /v1/teams/:slug` devolve `standing` (oficial) + `trends` (com `n`/banda) no payload → coberto por P1+P3
- A2 [ui] na página do time vejo logo + posição/pontos + splits casa/fora + tendências com banda; recorte com n<10 aparece marcado, não como número seco → coberto por P2+P3+P4

### Premissas

- `getTeamBySlug` (`shared.ts:456-464`) tem caller único (`getTeam`) → ampliar retorno p/ `TeamRef & {shortCode}` é seguro.
- `standing` (`leagues.ts:68-92`) está populado (banco: 20 linhas) e o `details` da chamada de sync (`sync-sportmonks.ts:204-205`) traz os splits HOME/AWAY (descartados hoje).
- `computeForm` (`shared.ts:849-876`) já aceita `side:"home"|"away"`; `loadTeamMatches` (`shared.ts:468-473`) traz `Match[]` com `score.ft`.
- Eden infere o tipo do retorno no front → crescer o payload não exige editar tipo manual.
- _Se cair durante o /i_ (ex.: type_ids HOME/AWAY ≠ faixa esperada): PARAR, atualizar este Plano com a divergência datada.

### Decisões

- D1: splits casa/fora = **fonte oficial** (micro-migração), derivado via `computeForm(side)` vira **cross-check** — driver: n≈19 é ruidoso e o oficial vem na mesma resposta já fetchada; descartado: só-derivar (mais simples) porque menos confiável; pagamos: uma migração aditiva + re-sync.
- D2: proporções com **intervalo de Wilson 95%** + gate `n≥10` — driver: regulação (sem certeza) e instabilidade de % sobre amostra pequena; descartado: ponto seco / aproximação normal porque enganoso em n pequeno; pagamos: número "menos vendável", porém honesto.
- D3: bloco próxima-partida (projeção λ) **adiado** pra faceta IA/fase 2 (Poisson interno grátis); **xG vetado pelo dono (2026-06-28)**; Predictions é pago — não entram no MVP.
- Adiadas de propósito pro /i: nomes exatos das colunas/util, micro-layout dos cards, copy dos rótulos PT.

### Passos

**P1 [api+ui] esqueleto** — `apps/api/.../get-team/get-team.service.ts` + `shared.ts#getTeamBySlug` (ampliar select p/ `shortCode`, retorno `TeamRef & {shortCode}`): em `getTeam`, ler a linha oficial de `standing` por `teamId` reusando o padrão de `standings.service.ts:20-26` e somar ao payload como `standing | null`. UI `team-detail.tsx:18-56`: header renderiza `logoUrl` + `shortCode` + bloco de classificação (posição/pontos/V-E-D/GF-GA-GD/zona); troca `FormChips` por `FormGuide form={team.form}`. Prova: `curl -s localhost:<port>/v1/teams/<slug> | jq .standing.position` → número; `bun run typecheck` limpo.
**P2 [dados+api+ui] (depende: P1) micro-migração** — detalhe: dossiê §Schema. Adicionar colunas `home_*`/`away_*` (nullable, só-expand) em `standing` (`leagues.ts:68-92`) + migração Drizzle; estender `DET` e o upsert em `sync-sportmonks.ts:231-248` com os type_ids HOME/AWAY (confirmar imprimindo `row.details` antes de fixar); `bun run db:sync`. Expor splits no payload de `getTeam` e renderizar cards casa/fora. Falha provável: type_ids errados → colunas null; correção: validar contra `row.details` real no passo. Prova: `select home_won, away_won from standing limit 3` → não-nulo; Chrome mostra splits.
**P3 [api+ui] (depende: P1) tendências** — detalhe: dossiê §Trends. Novo util puro `computeTeamTrends(matches, teamId)` derivado de `m.score.ft` (over25/BTTS/cleanSheet/gols-por-jogo nos recortes all|home|away), cada proporção `{pct,n,lo,hi}` com Wilson 95% e `lowSample` quando `n<10`; somar ao payload de `getTeam`. UI: cards de tendência com banda + marca de amostra baixa + carimbo de `n`/fonte. Prova: `curl -s .../teams/<slug> | jq '.trends.over25'` → `{pct,n,lo,hi,lowSample}`; Chrome mostra % com banda e recorte n<10 marcado.
**P4 [ui] (depende: P1) match-log** — `team-detail.tsx`: na lista de jogos já existente, colorir o resultado V/E/D pela perspectiva do time + indicador de confiança por amostra nos cards de tendência. Prova: Chrome mostra resultados coloridos na lista.

### Verificação final

- `bun run typecheck` e `bun run lint` limpos
- script nominal: `curl /v1/teams/<slug>` devolve `standing` + `trends` com `n` e banda (assert via `jq`)
- assert no banco pós-P2: `select home_won, away_won, home_goals_for from standing limit 3` não-nulo após `db:sync`
- golden path no Chrome: 1. navegar `/teams/<slug>`; 2. ver header (logo+shortCode+posição+pontos); 3. ver splits casa/fora; 4. ver tendências com banda; 5. confirmar recorte n<10 marcado (não número seco)
- re-teste do `features impact`: página de **standings da liga** inalterada (P2 só adiciona colunas que `standings.service.ts:22` não lê); `match` não foi alterado (DOS-001/LIG-001/MOD-001/SIN-020 sem impacto real)
- último passo: subagent em contexto fresco revisa o diff contra A1–A2 — reporta só gap de requisito; diff fora dos paths deste plano = achado

### Pré-mortem e rollback

3 semanas depois, quebrou. Causas mais prováveis:
- C1: type_ids HOME/AWAY mudaram/estavam errados → splits null ou trocados; sintoma: cards casa/fora vazios ou absurdos; mitigação: validação contra `row.details` no P2 + assert no banco na Verificação.
- C2: tendência % sobre amostra que cresceu pouco lê como "certeza"; sintoma: dono vê over 2.5 "80%" sobre 12 jogos; mitigação: gate n≥10 + banda Wilson são requisito (P3), não polish.
- C3: SportMonks muda contrato do `details` de standings → re-sync grava null; sintoma: colunas zeram após `db:sync`; detecção: assert no banco pós-sync.
Rollback por classe: UI/API pura → `git revert`; schema (P2) → é só-expand, reverte com drop das colunas `home_*`/`away_*` (nada de contract a desfazer). O rollback NÃO desfaz: re-syncs já gravados (re-rodar `db:sync` recompõe).

### Fora de escopo

- Stats de time **por partida** (posse/chutes/SoT/escanteios/faltas) → exige `;statistics` no include do sync + tabela `match_team_stat` + re-sync; **custo de tier INDETERMINADO** até 1 chamada real `/fixtures/{id}?include=statistics` com o token. Promover a `docs/features/ligas/LIG-004-stats-de-time-por-partida.md` quando o dono confirmar o custo.
- Técnico (win%/PPG) e **desfalques/risco de suspensão** → `injury`=0 no banco e `coach` fantasma (`sync:386-393` grava só formation); exige corrigir ingestão. Fase 2.
- ~~xG (curva G-xG)~~ — **VETADO pelo dono (2026-06-28)**: não buscar, mesmo se virar grátis.
- Predictions (over/BTTS/team-to-score-first) — add-on **pago**, decisão de compra do dono; bloco próxima-partida tem caminho grátis (Poisson interno).

## Evidências

- [código] `apps/api/src/db/sync-sportmonks.ts:265-266` — include de fixtures **sem `;statistics`**: stats de time por partida nem são pedidas (contraste com o filtro barato do jogador).
- [código] `apps/api/src/modules/leagues/get-team/get-team.service.ts:5-9` — `getTeam` retorna só `{team, form, matches}`; não junta `standing` nem agregados (confirma o stub).
- [código] `apps/api/src/db/schemas/leagues.ts:68-92` — `standing` (position/points/played/won/drawn/lost/GF/GA/GD/zone) **já ingerido e ocioso** (20 linhas no banco), **sem colunas home/away**.
- [banco] `select count(*) from standing` = **20**; `select count(*) from injury` = **0** (verificado nesta sessão via docker exec no `mrtip_db`, porta 5434) — standing populado, injury vazio (blocker de desfalques é real).
- [código] `apps/api/src/db/sync-sportmonks.ts:204-205,236-243` — a chamada de standings já fetcha `include=...;details`, que traz os splits HOME/AWAY oficiais (type_ids 135-146), mas `detVal` extrai só os totais e descarta o resto → capturar = micro-migração.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:437-442,739-793,818-845` — `loadTeamMatches` + `computeStandings`(739-793) + `computeForm(side)`(818-845): tendências deriváveis; splits derivados são cross-check (n≈19), não a fonte primária.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:131,296,654` — comentários "from injury, which is complete" são **enganosos** (banco: injury=0).
- [código] `apps/web/features/leagues/components/team-detail/team-detail.tsx:18-56` — UI stub (header + `FormChips` + lista de jogos); logo (`shared.ts:427`) trafega e não é renderizado.
- [código] `apps/api/src/db/sync-sportmonks.ts:386-393` (coach fantasma — grava só `formation`) + sync não escreve `injury` (zero ocorrências de `injury`/`sidelined` no arquivo) — bloqueiam técnico/desfalques (fase 2).
- [web] `docs.sportmonks.com/.../fixture-statistics` + `.../team-statistics` + `.../standings` (as-of 2026-06-28) — include `statistics` de fixture EXISTE mas **conjunto de type_ids depende do tier (não verificado com token real)**; BTTS(192)/cleansheets(194)/failed-to-score(575) agregados de season; standings traz splits casa/fora descartados; **xG E Predictions são add-ons pagos**; coordenadas x,y não existem.
- [web] FotMob (tabela embutida + coach win%/PPG) · SoccerStats (over/under % + BTTS % casa/fora) · Sofascore (clean sheet, elenco) · Transfermarkt (desfalques + risco de suspensão) — referências do que diferencia uma página de time de aposta.

## Verificação

MVP (P1–P4) provado em 2026-06-28 contra a API rodando (porta 3001) + banco `mrtip_dev` + Chrome em `localhost:3000`:

- **A1 [api]** ✓ — `GET /v1/teams/arsenal` devolve `shortCode:"ARS"`, `standing:{position:1,points:85,...,zone:"champions", home:{played:19,won:15,...}, away:{played:19,won:11,...}}` e `trends` com `over25/btts/cleanSheet` (cada um `{pct,n,lo,hi,lowSample}`) nos recortes all/home/away. Wilson 95% conferido numericamente.
- **A2 [ui]** ✓ — golden path no Chrome: header (logo + "ARS"); card Classificação (1º, 85 pts, Champions League) + splits Em casa 15V·2E·2D / Fora 11V·5E·3D; card **Gols** com toggle Tudo↔Casa (over 2.5 53%→58%, n 38→19), banda IC95% em cada número; match-log com V/E/D colorido. **0 erros de console.**
- **P2 (dados)** ✓ — type_ids HOME/AWAY (135-146) confirmados na resposta viva da SportMonks; migração `0002` aplicada; colunas populadas via refresh isolado de standings; assert no banco (`arsenal home_won=15 / away_won=11`).
- **Revisor** em contexto fresco: nenhum gap de A1/A2; Wilson validado.

**Fase 2 (fora desta entrega):** stats de time por partida (custo de tier INDETERMINADO → LIG-004 quando o dono confirmar), técnico/desfalques (`injury`=0), add-ons pagos (xG vetado, Predictions). Ver `## Plano` › Fora de escopo.
