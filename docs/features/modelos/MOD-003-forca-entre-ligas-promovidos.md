---
id: MOD-003
titulo: Força relativa entre ligas e times promovidos
modulo: modelos
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [MOD-001] # reusa a infra de team_ratings cravada pelo MOD-001
impacta: [MOD-001] # alimenta o rating de força (feature) que o motor consome
ancoras:
  settings: []
  tabelas: [team_ratings] # estende a tabela de força do MOD-001; não cria outra
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/forca-entre-ligas-promovidos.md]
verificado_em: null
atualizado: 2026-06-21
---

# Força relativa entre ligas e times promovidos

## Descrição

Como **calibrar a força de um time que mudou de divisão** (recém-promovido/rebaixado, sem histórico na divisão atual) e como **comparar força entre ligas** (Série A/B, ligas estrangeiras) — necessário para qualquer modelo que cruze competições (Copa do Brasil, Libertadores, comparação internacional). Sem isso, o rating de força (MOD-001) erra em jogos cross-league e no início de temporada. Nada investigado ainda.

## Tarefas

- [ ] dados — ingerir resultados BR cross-divisão (Série A/B/C + Copa do Brasil/Libertadores/Sul-Americana) para treinar rating próprio; persistir em `team_ratings` (`scope=global`). Opta só como tabela de referência manual.
- [ ] ia — pi-ratings/Elo treinado conjuntamente (caminho Dolores do MOD-001); HFA na otimização; prior de promovido = piso-da-divisão + regressão ⅓ (modulado por rota); `confidence` por nº de jogos-ponte; backtest vs CLV.

## Decisões da investigação

- **Rating de força = feature do motor (MOD-001), não motor** — confirma o que o MOD-001 já cravou.
- **NÃO depender de Club Elo (europeu/UEFA-only, não cobre BR) nem de 538 SPI (morto desde jun/2023).**
- **Força cross-league = rating próprio (pi-ratings/Elo) treinado conjuntamente** nas ligas do escopo; a ponte entre divisões/ligas vem dos jogos cross-league (promovidos + copas).
- **Opta Power Rankings = benchmark externo** (cobre BR — Série A é 6ª liga, rating 80,81), mas feed completo é comercial → não alimenta produção.
- **Coeficientes UEFA/Conmebol = prior grosseiro de força-de-liga**, nunca rating de time.
- **Promovido:** prior = média da divisão de destino com viés negativo + regressão ~⅓, modulado pela rota de promoção. (~47% dos promovidos PL caem na temporada seguinte.)
- **Estende `team_ratings`** (colunas `scope`/`rating_prior`/`prior_source`/`confidence`); não cria tabela nova.

## Evidências

- [investigação] docs/investigacoes/forca-entre-ligas-promovidos.md — doc completo desta sessão (claims atômicos com URL+as-of).
- [fonte] https://elofootball.com/ — Club Elo/equivalente é europeu-only ("55 European countries", sem sul-americanos) → REFUTED cobertura BR [verificado-fetch 2026-06-21].
- [fonte] https://fromthebyline.substack.com/p/fivethirtyeight-is-dead-long-live — 538 SPI parou de atualizar em junho/2023 (saída de Nate Silver) [verificado-fetch 2026-06-21].
- [provedor] https://theanalyst.com/articles/power-rankings-your-club-ranked — Opta Power Rankings: 0–100, ~13.500 times, 413 ligas, 183 países, hierarquia time→liga→país→continente; cobre BR [verificado-fetch 2026-06-21].
- [provedor] https://kiqiq.com/blog/opta-power-rankings — feed completo Opta é assinatura paga; público só artigos [verificado-fetch 2026-06-21].
- [técnico] https://opisthokonta.net/?p=1412 — inicialização de rating (otimização) + jogos inter-league: só promovidos/rebaixados fazem a ponte entre ligas; incluir HFA na otimização [verificado-fetch 2026-06-21].
- [dados] https://theanalyst.com/articles/premier-league-survival-guide-how-can-promoted-teams-stay-up — 47,2% dos promovidos PL (42/89 em 30 temporadas) caem na temporada seguinte [verificado-fetch 2026-06-21].
- [proxy] https://en.wikipedia.org/wiki/UEFA_coefficient — coeficiente = média plurianual de desempenho continental p/ seeding, criticado por preservar status quo [snippet 2026-06-21].
