<!-- GERADO por `bun run features build` — NÃO editar à mão -->

# INDEX de features

41 feature(s). Fonte: arquivos em `docs/features/`. Convenções: [README.md](README.md).

## Features

| ID | Título | Módulo | Status | Prio | Facetas | Testada | Depende de |
|---|---|---|---|---|---|---|---|
| AGT-001 | Leitura de jogo (núcleo agêntico de entendimento) | agente | investigado | P1 | ia:investigado | nao | DOS-001, MOD-001 |
| AGT-002 | Agente — raciocínio de seleção do melhor mercado | agente | ideia | P1 | ia:ideia api:ideia | nao | DOS-001, MOD-001, SIN-012 |
| COMP-001 | Conformidade e jogo responsável (Lei 14.790 / Portaria SPA 1.231) | conformidade | investigado | P1 | ui:investigado api:investigado ia:investigado | nao | — |
| CORE-001 | Porta de dinheiro (@workspace/core/money) | core | investigado | P2 | dados:investigado | nao | — |
| CORE-002 | Busca global (command palette ⌘K) | core | verificado | P2 | ui:feito | sim | — |
| CORE-003 | Autenticação com Clerk (web + API) | core | em-andamento | P1 | ui:em-andamento api:em-andamento dados:ideia | parcial | — |
| DOS-001 | Dossiê por partida | dossie | planejado | P1 | dados:planejado api:planejado ia:ideia | nao | — |
| DOS-002 | Estatísticas de partida por time (fixture statistics) | dossie | investigado | P2 | dados:investigado ia:ideia | nao | DOS-001 |
| LIG-001 | Página do jogador (perfil de performance) | ligas | em-andamento | P2 | dados:investigado api:planejado ia:ideia ui:planejado | parcial | — |
| LIG-002 | Página do time (perfil de performance) | ligas | verificado | P2 | dados:verificado api:verificado ia:ideia ui:verificado | sim | — |
| LIG-003 | Stats de volume por partida (chutes, passes, desarmes, faltas) | ligas | ideia | P2 | dados:ideia api:ideia ui:ideia | nao | LIG-001 |
| LIG-004 | Estádio (venue) com geo na página da partida | ligas | verificado | P2 | dados:verificado api:verificado ui:verificado | sim | — |
| LIG-005 | Dias de descanso (rest days) na página da partida | ligas | verificado | P2 | api:verificado ui:verificado | sim | — |
| LIG-006 | Snapshot da classificação na página da partida | ligas | em-andamento | P2 | api:feito ui:em-andamento | parcial | — |
| LIG-007 | Impacto dos desfalques no prognóstico da partida | ligas | verificado | P2 | api:verificado ui:verificado | sim | — |
| LIG-008 | Histórico multi-temporada (modelo season-aware) | ligas | verificado | P1 | dados:feito api:feito ui:feito | sim | — |
| LIG-009 | Slug bonito da partida (URL legível por liga/temporada/confronto) | ligas | verificado | P3 | dados:verificado api:verificado ui:verificado | sim | LIG-008 |
| LIG-010 | Narração lance-a-lance (commentaries) da partida | ligas | feito | P2 | dados:feito api:feito ui:feito | parcial | — |
| MOD-001 | Motor de prognóstico (modelo quantitativo) | modelos | investigado | P1 | dados:investigado ia:investigado | nao | DOS-001 |
| MOD-002 | xG / qualidade de chute (feature central do quant) | modelos | investigado | P1 | dados:investigado ia:investigado | nao | DOS-001 |
| MOD-003 | Força relativa entre ligas e times promovidos | modelos | investigado | P2 | dados:investigado ia:investigado | nao | MOD-001 |
| SIN-001 | Sinal — conflitos entre jogadores | sinais | investigado | P3 | dados:investigado ia:investigado | nao | DOS-001 |
| SIN-002 | Sinal — interesses de patrocinadores do jogador | sinais | investigado | P3 | dados:ideia ia:ideia | nao | DOS-001 |
| SIN-003 | Sinal — mood / estado emocional do jogador | sinais | investigado | P3 | dados:ideia ia:ideia | nao | DOS-001 |
| SIN-004 | Sinal — relação jogador–treinador | sinais | investigado | P3 | dados:investigado ia:investigado | nao | DOS-001 |
| SIN-005 | Sinal — ocasiões especiais (aniversário, homenagem, luto) | sinais | investigado | P3 | dados:investigado ia:investigado | nao | DOS-001 |
| SIN-006 | Sinal de clima (condições de campo) | sinais | investigado | P3 | dados:investigado ia:investigado | nao | — |
| SIN-007 | Sinal de rivalidade (clássicos, torcida, ex-clube) | sinais | investigado | P2 | dados:investigado ia:investigado | nao | — |
| SIN-008 | Sinal de calendário e fadiga (ressaca de meio de semana + altitude) | sinais | investigado | P3 | dados:investigado ia:investigado | nao | — |
| SIN-009 | Sinal de arbitragem (árbitro escalado) | sinais | investigado | P1 | dados:investigado ia:investigado | nao | — |
| SIN-010 | Sinal de motivação e peso do jogo (stakes) | sinais | investigado | P2 | dados:investigado ia:investigado | nao | — |
| SIN-011 | Sinal de lesões e desfalques | sinais | em-andamento | P2 | dados:feito ia:investigado | parcial | — |
| SIN-012 | Camada de mercado e movimento de odds (validação de valor) | sinais | investigado | P1 | dados:investigado ia:investigado | nao | — |
| SIN-013 | Sinal de escanteios (corners) como mercado/edge | sinais | investigado | P2 | dados:investigado ia:investigado | nao | DOS-001 |
| SIN-014 | Sinal — formação tática (matchup de formações) | sinais | investigado | P3 | dados:investigado ia:investigado | nao | DOS-001 |
| SIN-015 | Sinal — perfil tático (transições, contra-ataque, linhas e zonas) | sinais | investigado | P3 | dados:investigado ia:investigado | nao | DOS-001, MOD-001 |
| SIN-016 | Sinal — mando de campo (vantagem de jogar em casa) | sinais | investigado | P1 | dados:investigado ia:investigado | nao | MOD-001 |
| SIN-017 | Sinal — game-state e timing de gols | sinais | investigado | P2 | dados:investigado ia:investigado | nao | DOS-001, MOD-001 |
| SIN-018 | Sinal — viés favorito-azarão e dinheiro recreativo | sinais | investigado | P2 | dados:investigado ia:investigado | nao | SIN-012 |
| SIN-019 | Sinal — steam moves e origem da linha (sharp vs square) | sinais | investigado | P2 | dados:investigado ia:investigado | nao | SIN-012, DOS-001 |
| SIN-020 | Sinal — janelas sazonais de fadiga (festas, pré-temporada, reta final, parões) | sinais | investigado | P3 | dados:investigado ia:investigado | nao | — |

## Índice de âncoras

_Pontos compartilhados; ⚠️ = tocado por 2+ features (mudar exige re-testar todas)._

### settings

- `clerk_authorized_parties` → CORE-003
- `clerk_jwt_key` → CORE-003
- `clerk_publishable_key` → CORE-003
- `clerk_secret_key` → CORE-003
- `jogo_responsavel` → COMP-001
- `limites_prudenciais` → COMP-001

### tabelas

- `arbitros` → SIN-009
- `backtest_clv` → MOD-001
- `card` → LIG-001, LIG-002 ⚠️ compartilhada
- `coach` → LIG-002
- `commentary` → LIG-010
- `dossier_snapshot` → DOS-001, MOD-002 ⚠️ compartilhada
- `entity_xref` → DOS-001
- `estadios` → SIN-006, SIN-007, SIN-008, SIN-016 ⚠️ compartilhada
- `goal` → LIG-001, LIG-002, LIG-007 ⚠️ compartilhada
- `injury` → LIG-001, LIG-002, LIG-007, SIN-011, SIN-020 ⚠️ compartilhada
- `league` → LIG-008
- `lineup` → LIG-002
- `lineup_player` → LIG-001, LIG-003, LIG-007, SIN-020 ⚠️ compartilhada
- `match` → DOS-001, DOS-002, LIG-001, LIG-002, LIG-004, LIG-005, LIG-008, LIG-009, LIG-010, MOD-001, SIN-007, SIN-020 ⚠️ compartilhada
- `match_event` → SIN-017
- `match_features` → MOD-001, MOD-002, SIN-016 ⚠️ compartilhada
- `match_odds` → DOS-001, SIN-012, SIN-018, SIN-019 ⚠️ compartilhada
- `match_team_stats` → DOS-002
- `model_predictions` → MOD-001
- `observation` → DOS-001
- `odds_snapshots` → MOD-001
- `operadores_licenciados` → COMP-001
- `pick` → DOS-001
- `player` → LIG-001, LIG-010 ⚠️ compartilhada
- `season` → LIG-008
- `standing` → LIG-002, LIG-006, LIG-008 ⚠️ compartilhada
- `team` → LIG-002
- `team_ratings` → MOD-001, MOD-003, SIN-016 ⚠️ compartilhada
- `venue` → LIG-004

### funcoes

- `authGuard` → CORE-003
- `buildDossierSnapshot` → DOS-001
- `centsParaReais` → CORE-001
- `centsParaReaisStr` → CORE-001
- `computeForm` → LIG-002
- `computeStandings` → LIG-002
- `currentSeasonId` → LIG-008
- `formatBRL` → CORE-001
- `getAbsenceImpact` → LIG-007
- `getCoachDetail` → LIG-009
- `getMatch` → LIG-005, LIG-006 ⚠️ compartilhada
- `getMatchRow` → LIG-009
- `getMatchRowBySlug` → LIG-009
- `getPlayerDetail` → LIG-001
- `getTeam` → LIG-002
- `getTeamBySlug` → LIG-002
- `lastMatchBefore` → LIG-005
- `loadAbsenceImpact` → LIG-007, LIG-008 ⚠️ compartilhada
- `loadGoalTiming` → LIG-008
- `loadMatchCommentaries` → LIG-010
- `loadMatches` → LIG-008
- `loadTeamMatches` → LIG-002, LIG-008, LIG-009 ⚠️ compartilhada
- `loadTeamStanding` → LIG-006, LIG-008 ⚠️ compartilhada
- `matchSlug` → LIG-009
- `reaisParaCents` → CORE-001
- `resolveSeason` → LIG-008
- `seasonsOf` → LIG-008
- `serializeMatch` → LIG-004, LIG-009 ⚠️ compartilhada
- `setApiAuthTokenGetter` → CORE-003
- `SidebarSearch` → CORE-002
- `slugify` → LIG-009
- `sync-sportmonks` → DOS-002
- `verifier` → CORE-003

### rotas

- `/conta` → CORE-003
- `/matches/:id` → LIG-004, LIG-005 ⚠️ compartilhada
- `/matches/:id/absence-impact` → LIG-007
- `/matches/:id/commentaries` → LIG-010
- `/players/:id` → LIG-001
- `/sign-in` → CORE-003
- `/sign-up` → CORE-003
- `/teams/:slug` → LIG-002
- `/v1/leagues/:code` → LIG-008
- `/v1/leagues/:code/rounds` → LIG-008
- `/v1/leagues/:code/scorers` → LIG-008
- `/v1/leagues/:code/seasons` → LIG-008
- `/v1/leagues/:code/standings` → LIG-008
- `/v1/matches/:id` → LIG-009
- `/v1/players/:id` → LIG-008
- `/v1/teams/:slug` → LIG-008
- `GET /v1/matches/:id` → LIG-006
- `proxy.ts` → CORE-003

## Índice doc → features

- [docs/arquitetura/modelagem.md](../../docs/arquitetura/modelagem.md) → LIG-004
- [docs/arquitetura/taxonomia-sinais.md](../../docs/arquitetura/taxonomia-sinais.md) → AGT-001, DOS-001, SIN-005, SIN-007
- [docs/investigacoes/agente-selecao-melhor-mercado.md](../../docs/investigacoes/agente-selecao-melhor-mercado.md) → AGT-001, MOD-001
- [docs/investigacoes/autenticacao-clerk.md](../../docs/investigacoes/autenticacao-clerk.md) → CORE-003
- [docs/investigacoes/derby-por-formato-de-competicao.md](../../docs/investigacoes/derby-por-formato-de-competicao.md) → SIN-007
- [docs/investigacoes/desfalques-sportmonks-estudo.md](../../docs/investigacoes/desfalques-sportmonks-estudo.md) → SIN-011
- [docs/investigacoes/dossie-por-partida-fontes-de-dados.md](../../docs/investigacoes/dossie-por-partida-fontes-de-dados.md) → DOS-001
- [docs/investigacoes/estatisticas-partida-posse-chutes-big-chances.md](../../docs/investigacoes/estatisticas-partida-posse-chutes-big-chances.md) → DOS-002
- [docs/investigacoes/forca-entre-ligas-promovidos.md](../../docs/investigacoes/forca-entre-ligas-promovidos.md) → MOD-003
- [docs/investigacoes/game-state-timing-de-gols.md](../../docs/investigacoes/game-state-timing-de-gols.md) → SIN-017
- [docs/investigacoes/janelas-sazonais-fadiga.md](../../docs/investigacoes/janelas-sazonais-fadiga.md) → SIN-020
- [docs/investigacoes/leitura-de-jogo-profundidade-dominio.md](../../docs/investigacoes/leitura-de-jogo-profundidade-dominio.md) → AGT-001
- [docs/investigacoes/mando-de-campo.md](../../docs/investigacoes/mando-de-campo.md) → SIN-016
- [docs/investigacoes/pagina-do-jogador.md](../../docs/investigacoes/pagina-do-jogador.md) → LIG-001, LIG-003
- [docs/investigacoes/pagina-do-time.md](../../docs/investigacoes/pagina-do-time.md) → LIG-002
- [docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md](../../docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md) → CORE-001
- [docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md](../../docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md) → MOD-001
- [docs/investigacoes/regulacao-br-apostas-produto.md](../../docs/investigacoes/regulacao-br-apostas-produto.md) → COMP-001
- [docs/investigacoes/rest-days-descanso-na-partida.md](../../docs/investigacoes/rest-days-descanso-na-partida.md) → LIG-005
- [docs/investigacoes/sinal-conflitos-entre-jogadores.md](../../docs/investigacoes/sinal-conflitos-entre-jogadores.md) → SIN-001
- [docs/investigacoes/sinal-escanteios.md](../../docs/investigacoes/sinal-escanteios.md) → SIN-013
- [docs/investigacoes/sinal-formacao-tatica.md](../../docs/investigacoes/sinal-formacao-tatica.md) → SIN-014
- [docs/investigacoes/sinal-interesses-patrocinadores-jogador.md](../../docs/investigacoes/sinal-interesses-patrocinadores-jogador.md) → SIN-002
- [docs/investigacoes/sinal-mood-jogador.md](../../docs/investigacoes/sinal-mood-jogador.md) → SIN-003
- [docs/investigacoes/sinal-ocasioes-especiais-jogador.md](../../docs/investigacoes/sinal-ocasioes-especiais-jogador.md) → SIN-005
- [docs/investigacoes/sinal-perfil-tatico-transicoes.md](../../docs/investigacoes/sinal-perfil-tatico-transicoes.md) → SIN-015
- [docs/investigacoes/sinal-relacao-jogador-treinador.md](../../docs/investigacoes/sinal-relacao-jogador-treinador.md) → SIN-004
- [docs/investigacoes/steam-moves-sharp-vs-square.md](../../docs/investigacoes/steam-moves-sharp-vs-square.md) → SIN-019
- [docs/investigacoes/venue-estadio-geo.md](../../docs/investigacoes/venue-estadio-geo.md) → LIG-004
- [docs/investigacoes/vies-favorito-azarao.md](../../docs/investigacoes/vies-favorito-azarao.md) → SIN-018
- [docs/investigacoes/xg-qualidade-de-chute.md](../../docs/investigacoes/xg-qualidade-de-chute.md) → MOD-002
- [docs/planos/DOS-001-dossie-por-partida.md](../../docs/planos/DOS-001-dossie-por-partida.md) → DOS-001
- [docs/planos/LIG-001-pagina-do-jogador.md](../../docs/planos/LIG-001-pagina-do-jogador.md) → LIG-001
- [docs/planos/LIG-002-pagina-do-time.md](../../docs/planos/LIG-002-pagina-do-time.md) → LIG-002
- [docs/planos/LIG-004-venue-estadio-geo.md](../../docs/planos/LIG-004-venue-estadio-geo.md) → LIG-004
- [docs/planos/LIG-005-rest-days-descanso.md](../../docs/planos/LIG-005-rest-days-descanso.md) → LIG-005
- [docs/planos/LIG-008-historico-multi-temporada.md](../../docs/planos/LIG-008-historico-multi-temporada.md) → LIG-008
- [docs/planos/LIG-009-slug-bonito-da-partida.md](../../docs/planos/LIG-009-slug-bonito-da-partida.md) → LIG-009
- [docs/planos/LIG-010-commentaries.md](../../docs/planos/LIG-010-commentaries.md) → LIG-010
- [docs/planos/SIN-011-lesoes.md](../../docs/planos/SIN-011-lesoes.md) → SIN-011
- [docs/regras/arbitragem.md](../../docs/regras/arbitragem.md) → SIN-009
- [docs/regras/calendario-fadiga.md](../../docs/regras/calendario-fadiga.md) → LIG-005, SIN-008
- [docs/regras/clima.md](../../docs/regras/clima.md) → SIN-006
- [docs/regras/lesoes.md](../../docs/regras/lesoes.md) → SIN-011
- [docs/regras/mercado-odds.md](../../docs/regras/mercado-odds.md) → SIN-012, SIN-013
- [docs/regras/motivacao.md](../../docs/regras/motivacao.md) → SIN-010
- [docs/regras/rivalidade.md](../../docs/regras/rivalidade.md) → SIN-007
- [docs/research/fontes-rivalidade.md](../../docs/research/fontes-rivalidade.md) → SIN-007
