---
id: MOD-010
titulo: Calibração do motor para a Série A (futebol brasileiro)
modulo: modelos
status: ideia # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2 # P1 | P2 | P3
facetas:
  ia: ideia # refit do rho de Dixon-Coles, baseline por liga, backtest multi-liga
testada: nao # nao | parcial | sim
testes: []
depende_de: [LIG-012] # sem a Série A ingerida não há amostra brasileira para calibrar
impacta: [MOD-001, MOD-004, MOD-003] # motor quant, prompt vivo e força entre ligas
ancoras:
  settings: []
  tabelas: [match, match_prognosis]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/serie-a-brasileirao-migracao-sportmonks.md]
verificado_em: null
atualizado: 2026-07-19
---

# Calibração do motor para a Série A (futebol brasileiro)

## Descrição

O motor de prognóstico foi calibrado em futebol inglês e carrega **constantes europeias escritas à mão**. Com a
Série A ingerida (LIG-012), o insumo brasileiro passa a existir — mas o motor continua estimando com parâmetros
da Premier League. As diferenças medidas são direcionais, não ruído: a Série A tem **menos gols** (2,52 vs 2,75),
**+24% de amarelos**, **+87% de vermelhos** e **mando de campo bem mais forte** (50% vs 43% de vitórias em casa).
Sem recalibrar, o motor subestima under, subestima cartões e subestima o mandante — sistematicamente.

Separada do LIG-012 de propósito: aquela feature entrega a **base** de calibração (backtest e histórico em Série
A), esta faz a calibração. Abrir só depois de fechar o marco de MOD-004 em curso — trocar o insumo no meio de uma
recalibração ativa destrói a atribuição de causa.

## Tarefas

- [ ] ia — refitar `DC_RHO` (hoje `-0.13`, ajustado em dataset europeu) para a Série A; ρ é parâmetro por dataset
- [ ] ia — trocar o baseline hardcoded "~44% no 1ºT / 56% no 2ºT" pela curva já computada do banco por liga
- [ ] ia — generalizar o backtest para além de `leagueCode = "PL"` e criar baseline BR
- [ ] ia — decidir se os parâmetros ficam por liga em código ou viram dado (settings/tabela)

## Evidências

- [doc] investigação `docs/investigacoes/serie-a-brasileirao-migracao-sportmonks.md` §3 — mapeia as constantes
  europeias no prompt e a incoerência interna (curva do banco computada ao lado de âncora europeia hardcoded,
  as duas chamadas de "baseline da liga" na mesma instrução)

## Verificação

_(preencher quando status=verificado)_
