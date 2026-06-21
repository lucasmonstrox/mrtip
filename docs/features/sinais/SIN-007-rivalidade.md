---
id: SIN-007
titulo: Sinal de rivalidade (clássicos, torcida, ex-clube)
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
  tabelas: [estadios]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/regras/rivalidade.md, docs/research/fontes-rivalidade.md, docs/arquitetura/taxonomia-sinais.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal de rivalidade (clássicos, torcida, ex-clube)

## Descrição

Índice de rivalidade por confronto (whitelist + distância de estádios + carga de H2H) e seus efeitos verificados: mais cartões, mando que encolhe, lei do ex. Sob mito: under em clássico e "favorito sempre tropeça".

## Tarefas

- [ ] dados — whitelist (Wikipedia/Wikidata/derby.ist/footballderbies), distância via coords de estádio, transferências (lei do ex).
- [ ] ia — over de cartões, desconto no mando do favorito, tilt em props do ex-jogador; explicação.

## Evidências

- [doc] docs/regras/rivalidade.md — regra completa.
- [doc] docs/research/fontes-rivalidade.md — catálogo de fontes de detecção.
