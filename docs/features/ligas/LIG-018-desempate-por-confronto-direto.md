---
id: LIG-018
titulo: Desempate por confronto direto (comparação pareada)
modulo: ligas
status: ideia # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P3 # P1 | P2 | P3
facetas:
  api: ideia # computeStandings ganha comparação pareada entre os times empatados
testada: nao # nao | parcial | sim
testes: []
depende_de: [LIG-017] # precisa da regra por temporada já ingerida e dirigindo o comparador
impacta: [LIG-006, MOD-004]
ancoras:
  settings: []
  tabelas: [season, match]
  tools: []
  funcoes: [computeStandings, tiebreakOf]
  rotas: ["GET /v1/leagues/:code/standings"]
docs: [docs/investigacoes/criterio-de-desempate-por-temporada.md]
verificado_em: null
atualizado: 2026-07-20
---

# Desempate por confronto direto (comparação pareada)

## Descrição

`TiebreakCriterion` (LIG-017) é **escalar por time**: cada critério vira um número que se compara direto. O
confronto direto não cabe nesse modelo — ele compara **pares** e exige uma mini-tabela só com os jogos entre os
times empatados, aplicada recursivamente.

A investigação do LIG-017 provou que isso **é implementável** (o texto de FIFA e UEFA descreve literalmente a
mini-tabela: *"criteria a) to c) above are applied to the matches between the remaining teams only"*), e que o
resíduo genuinamente não-computável é sempre só o **último** critério da cascata (coeficiente UEFA, ranking
FIFA, sorteio).

Fica fora do LIG-017 por **ausência de dado, não por impossibilidade**: nenhum dos 6 tipos de regra com H2H
aparece em nenhuma das 15 temporadas da assinatura SportMonks. La Liga, Serie A e Bundesliga põem confronto
direto **antes** do saldo — ingerir qualquer uma delas é o gatilho desta feature.

**Critério de entrada:** uma liga com regra H2H entra na assinatura (ou o dono decide ingerir uma).

## Tarefas

- [ ] api — estender `computeStandings` para comparação pareada entre o subconjunto de times empatados
- [ ] api — mapear no `TIEBREAK_BY_RULE_ID` os tipos H2H, declarando qual cauda não é computável
- [ ] ui — a linha de desempate precisa distinguir a regra **aplicada** da regra **completa** do regulamento

## Evidências

- [doc] `docs/investigacoes/criterio-de-desempate-por-temporada.md` §"As 6 regras de confronto direto" —
  prova que é implementável e por que fica fora do escopo do LIG-017.
- [código] `apps/api/src/modules/leagues/shared/shared.ts:2041` — `TiebreakCriterion` é escalar por time;
  prova que confronto direto não é representável no modelo atual.
- [web] regulamento da Copa 2026 (FIFA, Art. 13) — texto literal da mini-tabela entre os empatados.

## Verificação

_(preencher quando status=verificado)_
