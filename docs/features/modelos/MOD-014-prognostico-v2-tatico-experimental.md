---
id: MOD-014
titulo: Prognóstico V2 tático experimental e isolado
modulo: modelos
status: em-andamento
prioridade: P1
facetas:
  ia: em-andamento
testada: parcial
testes:
  - "typecheck isolado dos scripts V2 verde (2026-07-20)"
  - "dry-run real Ceará x Palmeiras: prompt+dossiê+manifest próprios, sem persistência (2026-07-20)"
  - "contrato 2.1: 4 runs tipadas válidas; guardrails rejeitaram drift numérico e jogador fora do XI, com uma correção automática restrita quando necessária (2026-07-20)"
  - "piloto 2.1 pareado N=4: V2 log-loss 0,8644, Brier 0,1676, RPS 0,1519, MAE total 1,913 e acerto da previsão 25% (2026-07-20)"
  - "contrato 2.2: lint, typecheck isolado e dry-run real verdes após guardrails de evidência (2026-07-20)"
depende_de: [MOD-004, DOS-002, SIN-021]
impacta: [MOD-001, MOD-004]
ancoras:
  settings: []
  tabelas: [match, match_prognosis, lineup, lineup_player, match_team_stats, match_trend, goal, injury]
  tools: []
  funcoes: [buildTacticalDossier, buildPrognosisV2Prompt, validatePrognosisV2]
  rotas: []
docs:
  - docs/investigacoes/prognostico-v2-tatica-setores-janelas.md
verificado_em: null
atualizado: 2026-07-20
---

# Prognóstico V2 tático experimental e isolado

## Descrição

Experimento paralelo ao `super-prognosis`: mantém o pipeline atual intacto e testa uma análise
pré-jogo mais profunda de plano/antiplano dos treinadores, formações, setores, duelos de jogadores
e janelas de 15 minutos.

O CLI lê o último prompt já persistido, acrescenta um dossiê V2 determinístico e faz uma síntese
LLM tipada. Se a saída violar o contrato, permite uma única correção restrita pelos erros do
validador. A run grava apenas em `scripts/output/prognosis-v2/`; não escreve no banco, não altera
API/UI e não chama os scripts legados. Sem snapshot atual, ele para com erro explícito.

## Tarefas

- [x] ia — pesquisa web sobre formação dinâmica, overloads, PPDA, métricas por posição e hazard temporal
- [x] ia — cutoff anti-leak: excluir lineup, formação, stats, trends e placar do próprio jogo-alvo
- [x] ia — projetar XI por formação/starts/minutos anteriores, removendo lesionados do alvo
- [x] ia — compor percentis por posição como hipóteses de exposição, sem subtração ou ajuste direto
- [x] ia — cruzar seis janelas com hazard global e shrinkage forte; perfil do time é narrativo
- [x] ia — super prompt V2 único com planos, antiplanos, setores, jogadores, filme e cenários
- [x] ia — schema JSON tipado + validação de somas, probabilidades, bands e IDs de evidência
- [x] ia — prior budget de 0,45 xG, 10 pp em totals/BTTS e 12 pp por resultado 1x2
- [x] ia — uma correção automática restrita quando a primeira saída viola o contrato
- [x] ia — contrato 2.2 rejeita confiança alta em blocos táticos sem tracking/ablação
- [x] ia — artefatos isolados `prompt.md`, `tactical-dossier.md`, `result.json`, `dump.json`, `report.html`
- [x] ia — scorer pareado de runs gravadas: log-loss, Brier, RPS, MAE do total e acerto da previsão
- [~] ia — executar coorte pareada suficiente para decidir se o V2 supera o atual

## Decisões

- Formação declarada é fato; shape com/sem bola é hipótese sem tracking/360.
- Atividade defensiva agregada é proxy e nunca recebe o nome PPDA.
- Formação, treinador, setor, jogador e TIME não movem xG sem ganho incremental fora da amostra.
- Percentil descreve habilidade histórica; matchup exige também exposição e probabilidade do evento.
- Janela equipe×15 minutos é fortemente encolhida ao hazard global e permanece hipótese de roteiro.
- A mesma evidência no digest atual e no V2 não conta duas vezes.
- Sem odds, a saída é `recommended_prediction`, não value bet.
- Uma síntese LLM primária: a profundidade vem dos estágios determinísticos e do contrato, não de
  agentes que recontam a mesma narrativa. Uma segunda chamada só corrige violações explícitas.

## Evidências

- [código] `apps/api/scripts/prognosis-v2.ts` — CLI e isolamento.
- [código] `apps/api/scripts/prognosis-v2/tactical-dossier.ts` — cutoff, XI, setores e timing.
- [código] `apps/api/scripts/prognosis-v2/prompt.ts` — protocolo de análise e IDs.
- [código] `apps/api/scripts/prognosis-v2/validate.ts` — invariantes.
- [código] `apps/api/scripts/prognosis-v2-score.ts` — comparação pareada.
- [pesquisa] `docs/investigacoes/prognostico-v2-tatica-setores-janelas.md`.

## Verificação

O piloto pareado de quatro partidas ficou misto: o V2 melhorou as probabilidades 1x2 e o MAE do
total, mas acertou só 25% das previsões recomendadas contra 75% do atual. Três das quatro primeiras
recomendações V2 foram `under 2.5`, evidenciando viés de seleção apesar do prior budget.

Essa amostra foi usada durante o desenvolvimento e serve apenas como smoke test. Não há evidência de
que o GPT-Sol melhorou o motor para apostas; a decisão continua pendente até uma coorte congelada,
maior e fora da amostra.

As quatro runs pertencem ao contrato 2.1. A pesquisa complementar endureceu o contrato
`2.2-evidence-guardrails`; ele precisa ser avaliado em jogos novos, sem reutilizar a coorte que
motivou as correções.
