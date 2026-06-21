<!-- GERADO por `bun run features build` — NÃO editar à mão -->

# INDEX de features

27 feature(s). Fonte: arquivos em `docs/features/`. Convenções: [README.md](README.md).

## Features

| ID | Título | Módulo | Status | Prio | Facetas | Testada | Depende de |
|---|---|---|---|---|---|---|---|
| AGT-001 | Leitura de jogo (núcleo agêntico de entendimento) | agente | investigado | P1 | ia:investigado | nao | DOS-001, MOD-001 |
| AGT-002 | Agente — raciocínio de seleção do melhor mercado | agente | ideia | P1 | ia:ideia api:ideia | nao | DOS-001, MOD-001, SIN-012 |
| COMP-001 | Conformidade e jogo responsável (Lei 14.790 / Portaria SPA 1.231) | conformidade | investigado | P1 | ui:investigado api:investigado ia:investigado | nao | — |
| CORE-001 | Porta de dinheiro (@workspace/core/money) | core | investigado | P2 | dados:investigado | nao | — |
| DOS-001 | Dossiê por partida | dossie | planejado | P1 | dados:planejado api:planejado ia:ideia | nao | — |
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
| SIN-011 | Sinal de lesões e desfalques | sinais | investigado | P2 | dados:investigado ia:investigado | nao | — |
| SIN-012 | Camada de mercado e movimento de odds (validação de valor) | sinais | investigado | P1 | dados:investigado ia:investigado | nao | — |
| SIN-013 | Sinal de escanteios (corners) como mercado/edge | sinais | investigado | P2 | dados:investigado ia:investigado | nao | DOS-001 |
| SIN-014 | Sinal — formação tática (matchup de formações) | sinais | investigado | P3 | dados:investigado ia:investigado | nao | DOS-001 |
| SIN-015 | Sinal — perfil tático (transições, contra-ataque, linhas e zonas) | sinais | investigado | P3 | dados:investigado ia:investigado | nao | DOS-001, MOD-001 |
| SIN-016 | Sinal — mando de campo (vantagem de jogar em casa) | sinais | investigado | P1 | dados:investigado ia:investigado | nao | MOD-001 |
| SIN-017 | Sinal — game-state e timing de gols | sinais | investigado | P2 | dados:investigado ia:investigado | nao | DOS-001, MOD-001 |
| SIN-018 | Sinal — viés favorito-azarão e dinheiro recreativo | sinais | investigado | P2 | dados:investigado ia:investigado | nao | SIN-012 |
| SIN-019 | Sinal — steam moves e origem da linha (sharp vs square) | sinais | investigado | P2 | dados:investigado ia:investigado | nao | SIN-012, DOS-001 |

## Índice de âncoras

_Pontos compartilhados; ⚠️ = tocado por 2+ features (mudar exige re-testar todas)._

### settings

- `jogo_responsavel` → COMP-001
- `limites_prudenciais` → COMP-001

### tabelas

- `arbitros` → SIN-009
- `backtest_clv` → MOD-001
- `dossier_snapshot` → DOS-001, MOD-002 ⚠️ compartilhada
- `entity_xref` → DOS-001
- `estadios` → SIN-006, SIN-007, SIN-008, SIN-016 ⚠️ compartilhada
- `match` → DOS-001, MOD-001 ⚠️ compartilhada
- `match_event` → SIN-017
- `match_features` → MOD-001, MOD-002, SIN-016 ⚠️ compartilhada
- `match_odds` → DOS-001, SIN-012, SIN-018, SIN-019 ⚠️ compartilhada
- `model_predictions` → MOD-001
- `observation` → DOS-001
- `odds_snapshots` → MOD-001
- `operadores_licenciados` → COMP-001
- `pick` → DOS-001
- `team_ratings` → MOD-001, MOD-003, SIN-016 ⚠️ compartilhada

### funcoes

- `buildDossierSnapshot` → DOS-001
- `centsParaReais` → CORE-001
- `centsParaReaisStr` → CORE-001
- `formatBRL` → CORE-001
- `reaisParaCents` → CORE-001

## Índice doc → features

- [docs/arquitetura/taxonomia-sinais.md](../../docs/arquitetura/taxonomia-sinais.md) → AGT-001, DOS-001, SIN-005, SIN-007
- [docs/investigacoes/agente-selecao-melhor-mercado.md](../../docs/investigacoes/agente-selecao-melhor-mercado.md) → AGT-001, MOD-001
- [docs/investigacoes/dossie-por-partida-fontes-de-dados.md](../../docs/investigacoes/dossie-por-partida-fontes-de-dados.md) → DOS-001
- [docs/investigacoes/forca-entre-ligas-promovidos.md](../../docs/investigacoes/forca-entre-ligas-promovidos.md) → MOD-003
- [docs/investigacoes/game-state-timing-de-gols.md](../../docs/investigacoes/game-state-timing-de-gols.md) → SIN-017
- [docs/investigacoes/leitura-de-jogo-profundidade-dominio.md](../../docs/investigacoes/leitura-de-jogo-profundidade-dominio.md) → AGT-001
- [docs/investigacoes/mando-de-campo.md](../../docs/investigacoes/mando-de-campo.md) → SIN-016
- [docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md](../../docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md) → CORE-001
- [docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md](../../docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md) → MOD-001
- [docs/investigacoes/regulacao-br-apostas-produto.md](../../docs/investigacoes/regulacao-br-apostas-produto.md) → COMP-001
- [docs/investigacoes/sinal-conflitos-entre-jogadores.md](../../docs/investigacoes/sinal-conflitos-entre-jogadores.md) → SIN-001
- [docs/investigacoes/sinal-escanteios.md](../../docs/investigacoes/sinal-escanteios.md) → SIN-013
- [docs/investigacoes/sinal-formacao-tatica.md](../../docs/investigacoes/sinal-formacao-tatica.md) → SIN-014
- [docs/investigacoes/sinal-interesses-patrocinadores-jogador.md](../../docs/investigacoes/sinal-interesses-patrocinadores-jogador.md) → SIN-002
- [docs/investigacoes/sinal-mood-jogador.md](../../docs/investigacoes/sinal-mood-jogador.md) → SIN-003
- [docs/investigacoes/sinal-ocasioes-especiais-jogador.md](../../docs/investigacoes/sinal-ocasioes-especiais-jogador.md) → SIN-005
- [docs/investigacoes/sinal-perfil-tatico-transicoes.md](../../docs/investigacoes/sinal-perfil-tatico-transicoes.md) → SIN-015
- [docs/investigacoes/sinal-relacao-jogador-treinador.md](../../docs/investigacoes/sinal-relacao-jogador-treinador.md) → SIN-004
- [docs/investigacoes/steam-moves-sharp-vs-square.md](../../docs/investigacoes/steam-moves-sharp-vs-square.md) → SIN-019
- [docs/investigacoes/vies-favorito-azarao.md](../../docs/investigacoes/vies-favorito-azarao.md) → SIN-018
- [docs/investigacoes/xg-qualidade-de-chute.md](../../docs/investigacoes/xg-qualidade-de-chute.md) → MOD-002
- [docs/planos/DOS-001-dossie-por-partida.md](../../docs/planos/DOS-001-dossie-por-partida.md) → DOS-001
- [docs/regras/arbitragem.md](../../docs/regras/arbitragem.md) → SIN-009
- [docs/regras/calendario-fadiga.md](../../docs/regras/calendario-fadiga.md) → SIN-008
- [docs/regras/clima.md](../../docs/regras/clima.md) → SIN-006
- [docs/regras/lesoes.md](../../docs/regras/lesoes.md) → SIN-011
- [docs/regras/mercado-odds.md](../../docs/regras/mercado-odds.md) → SIN-012, SIN-013
- [docs/regras/motivacao.md](../../docs/regras/motivacao.md) → SIN-010
- [docs/regras/rivalidade.md](../../docs/regras/rivalidade.md) → SIN-007
- [docs/research/fontes-rivalidade.md](../../docs/research/fontes-rivalidade.md) → SIN-007
