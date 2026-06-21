---
id: SIN-009
titulo: Sinal de arbitragem (árbitro escalado)
modulo: sinais
status: investigado
prioridade: P1
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: []
impacta: [DOS-001, MOD-001]
ancoras:
  settings: []
  tabelas: [arbitros]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/regras/arbitragem.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal de arbitragem (árbitro escalado)

## Descrição

O árbitro escalado é o maior driver isolado do mercado de cartões (~2× entre rígido e brando), estável e subprecificado fora das grandes ligas. Melhor candidato a edge real do conjunto de sinais.

## Tarefas

- [ ] dados — ID/escala do árbitro por jogo + cartões/faltas (API-Football, football-data.co.uk, FootyStats/OddAlerts); baseline por liga-temporada (era VAR).
- [ ] ia — over/under de cartões e booking points sem dupla contagem (multiplicativo sobre baseline ou Poisson/CMP com efeitos fixos); explicação.

## Evidências

- [doc] docs/regras/arbitragem.md — regra completa (anti-dupla-contagem, fontes, limitações).
