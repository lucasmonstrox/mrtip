---
id: SIN-006
titulo: Sinal de clima (condições de campo)
modulo: sinais
status: investigado
prioridade: P3
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: []
impacta: [DOS-001, MOD-001]
ancoras:
  settings: []
  tabelas: [estadios]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/regras/clima.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal de clima (condições de campo)

## Descrição

Ajuste qualitativo na probabilidade de gols a partir do clima no local+horário do jogo (chuva forte → viés under; chuva leve é ambígua). Para o apostador (value bet) e para o assistente (explicação). Heurística calibrável, não dogma.

## Tarefas

- [ ] dados — ingestão Open-Meteo (forecast + archive ERA5) por lat/long do estádio; cadastro de estádios (coberto/retrátil/sintético).
- [ ] ia — deslocar over/under e alargar banda de incerteza; sempre mostrar o porquê.

## Evidências

- [doc] docs/regras/clima.md — regra completa (sinais, fontes, calibração, limitações).
