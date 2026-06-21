---
id: MOD-001
titulo: Motor de prognóstico (modelo quantitativo)
modulo: modelos
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P1
facetas:
  dados: investigado # features/datasets que alimentam o modelo
  ia: investigado # motor quant de probabilidade (separado do LLM explicador)
testada: nao
testes: []
depende_de: [DOS-001] # o dossiê por partida é o insumo do motor
impacta: []
ancoras:
  funcoes: []
  tools: []
  tabelas: [match, team_ratings, match_features, odds_snapshots, model_predictions, backtest_clv] # propostas pela investigação (match alinhado ao DOS-001)
docs: [docs/investigacoes/predicao-futebol-ia-ml-estado-da-arte.md, docs/investigacoes/agente-selecao-melhor-mercado.md]
verificado_em: null
atualizado: 2026-06-18
---

# Motor de prognóstico (modelo quantitativo)

## Descrição

O motor que **estima probabilidade** de desfechos de uma partida (1X2 e over/under 2.5 no MVP), separado do LLM que **explica** (visao-geral §6). Consome o dossiê por partida ([[DOS-001]]) e produz probabilidades calibradas que alimentam picks e value bets (prob. do modelo × odd do mercado → EV+). Calibração importa mais que acurácia crua. Esta feature nasce de uma investigação do estado da arte (IA/ML/LLM/open-source) para decidir a abordagem.

## Tarefas

- [ ] dados — ingerir football-data.co.uk (EPL: odds+closing+O/U) + FBref xG via soccerdata; Elo/pi-ratings; snapshots de odds com de-vig. Brasileirão = fase 2.
- [ ] ia — baseline Dixon-Coles time-weighted (penaltyblog) → grid de placar → 1X2 + O/U 2.5; isotonic; avaliar RPS/Brier/ECE. GBT como desafiante depois. LLM nunca estima.

## Decisões da investigação

- **MVP = Premier League primeiro; Brasileirão fase 2** (cobertura de xG/closing-odds do BR é buraco estrutural, não "ponto a validar").
- **Baseline = Dixon-Coles + odds de-margined** antes de prometer GBM (o ganho do GBM exige feature set rico que o BR não tem).
- **CLV/"bater a closing line" = experimento de validação, NÃO barra de sucesso do MVP** (mercado eficiente + Pinnacle possivelmente desatualizada na fonte).
- **LLM só EXPLICAR** — confirmado por evidência forte (8 LLMs apostaram a PL e todos perderam; LLMs overconfident).

## Evidências

- [survey] https://arxiv.org/abs/2403.07669 — GBT+pi-ratings é SOTA em dados de gols; define o design space do ESTIMAR.
- [paper] https://arxiv.org/html/2309.14807 — RPS 0,2085 (validação) e um modelo de bookmakers venceu o desafio 2023 → closing line é a barra real.
- [paper] https://arxiv.org/html/2512.16030 — LLMs sistematicamente overconfident/mal calibrados → sustenta ESTIMAR≠EXPLICAR.
- [comercial] https://exame.com/inteligencia-artificial/... — 8 LLMs apostaram a PL inteira e todos perderam (melhor −11%).
- [paper] https://journals.sagepub.com/doi/10.1177/22150218261416681 — mercado melhor calibrado que o modelo; ROI ~10-15% só em mandante → rebaixa CLV a experimento.
- [lib] https://github.com/martineastwood/penaltyblog — MIT, mantida (v1.11.0 2026-06-02); Dixon-Coles + RPS + remoção de margem → peça central.
- [comercial] https://www.sportmonks.com/football-api/football-predictions-api/ — calibração-como-feature + gate "predictable=false" a copiar.

## Verificação

_(preencher quando status=verificado)_
