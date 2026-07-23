---
id: SIN-008
titulo: Sinal de calendário e fadiga (ressaca de meio de semana + altitude)
modulo: sinais
status: investigado
prioridade: P3
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: []
impacta: [DOS-001, MOD-001, SIN-023] # SIN-023 (km geográfico) herda as travas anti-dupla-contagem desta regra
ancoras:
  settings: []
  tabelas: [estadios]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/regras/calendario-fadiga.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal de calendário e fadiga (ressaca de meio de semana + altitude)

## Descrição

Hipótese de domínio do João: jogo continental no meio de semana + jogo da liga fora → under. Investigado: versão crua é majoritariamente efeito casa/fora (mito); sobrevive a versão refinada (team-total ≤3 dias, elenco curto, adversário descansado). Altitude (Conmebol) é o sinal ambiental forte.

## Tarefas

- [ ] dados — calendário com tag de competição + dias de descanso; coords/altitude de estádios (Conmebol).
- [ ] ia — under do time ressacado (refinado) + viés pró-mandante em altitude; baixo peso até backtest.

## Evidências

- [doc] docs/regras/calendario-fadiga.md — regra completa + especificação de backtest.
