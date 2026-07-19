---
id: LIG-014
titulo: Home (hub da rodada) fora do mock e multi-liga
modulo: ligas
status: ideia # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  ui: ideia # home lê liga/rodada do banco em vez de constantes
  api: ideia # rota que serve a rodada corrente por liga (se ainda não existir)
testada: nao # nao | parcial | sim
testes: []
depende_de: [LIG-012] # só faz sentido com 2+ ligas no ar
impacta: [LIG-009] # a home linka partidas pelo slug
ancoras:
  settings: []
  tabelas: [match, league, season]
  tools: []
  funcoes: []
  rotas: []
docs: []
verificado_em: null
atualizado: 2026-07-19
---

# Home (hub da rodada) fora do mock e multi-liga

## Descrição

A home (`apps/web/app/(app)/page.tsx`, feature `round-hub`) é **mock com liga fixa**: `consts.ts` declara
`LEAGUE_NAME = "Premier League"` e `SEASON = "2025/26"` em código. Enquanto a Premier League era a única liga do
produto isso passava despercebido; com a Série A no ar (LIG-012), a página inicial anuncia uma liga só e ignora a
outra — inconsistência visível na primeira tela que o usuário vê.

Ficou fora do LIG-012 de propósito: aquela feature não põe jogo ao vivo na tela (a temporada 2025 é encerrada), e
tirar a home do mock é trabalho de UI com dados reais, não uma consequência da ingestão.

## Tarefas

- [ ] api — servir a rodada corrente por liga (checar antes se as rotas existentes já cobrem)
- [ ] ui — `round-hub` lê liga/temporada/rodada do banco; sem constante de liga fixa
- [ ] ui — decidir o comportamento com N ligas: seletor, agregado por data, ou liga preferida do usuário

## Evidências

- [código] `apps/web/features/round-hub/consts.ts:3-4` — nome de liga e temporada hardcoded na home

## Verificação

_(preencher quando status=verificado)_
