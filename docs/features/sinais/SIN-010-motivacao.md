---
id: SIN-010
titulo: Sinal de motivação e peso do jogo (stakes)
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
docs: [docs/regras/motivacao.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal de motivação e peso do jogo (stakes)

## Descrição

Importância matemática por time (título/vaga/rebaixamento ainda vivos) e o efeito da motivação assimétrica (necessitado vs indiferente) — o melhor edge, ampliado em ligas de alta corrupção/baixa liquidez. Mercado precifica reputação, não motivação.

## Tarefas

- [ ] dados — standings + rodada → consequência viva por time; flag de jogo sensível (drift de odds).
- [ ] ia — inclinar 1X2/AH pro necessitado; desconto no favorito em dead rubber; red flag defensivo de manipulação.

## Evidências

- [doc] docs/regras/motivacao.md — regra completa.
