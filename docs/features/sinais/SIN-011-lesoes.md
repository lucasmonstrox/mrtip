---
id: SIN-011
titulo: Sinal de lesões e desfalques
modulo: sinais
status: investigado
prioridade: P2
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: []
impacta: [DOS-001, MOD-001]
ancoras:
  settings: []
  tabelas: []
  tools: []
  funcoes: []
  rotas: []
docs: [docs/regras/lesoes.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal de lesões e desfalques

## Descrição

Impacto de desfalques, assimétrico por posição (atacante fora → under; zagueiro/goleiro fora → over). Goleiro reserva é o desfalque mais subprecificado; suspensão por cartão é o mais previsível. O edge é de timing (janela pós-escalação).

## Tarefas

- [ ] dados — lesões/suspensões (API-Football /injuries, Sportmonks sidelined, Transfermarkt) + escalação provável/confirmada; PSxG-GA do goleiro; cobertura BR via imprensa.
- [ ] ia — direção por posição + antecipação de suspensão; ponderar profundidade de elenco.

## Evidências

- [doc] docs/regras/lesoes.md — regra completa.
