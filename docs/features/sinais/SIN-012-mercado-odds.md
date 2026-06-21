---
id: SIN-012
titulo: Camada de mercado e movimento de odds (validação de valor)
modulo: sinais
status: investigado
prioridade: P1
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: []
impacta: [SIN-006, SIN-007, SIN-008, SIN-009, SIN-010, SIN-011, DOS-001, MOD-001]
ancoras:
  settings: []
  tabelas: [match_odds]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/regras/mercado-odds.md]
verificado_em: null
atualizado: 2026-06-18
---

# Camada de mercado e movimento de odds (validação de valor)

## Descrição

Camada transversal: a closing line sharp (Pinnacle/Betfair) como âncora de probabilidade "verdadeira" e o CLV como KPI de valor. Define se/onde os outros sinais viram EV+ (regra anti-dupla-contagem). É o coração do motor de value bet. `impacta` todos os sinais porque mudar a forma de validar valor exige re-avaliar cada um.

## Tarefas

- [ ] dados — captura de odds abertura→fechamento (Pinnacle/The Odds API/football-data.co.uk); cálculo de fair odds vig-free.
- [ ] ia — value bet = odd ofertada > fair odds; medir CLV ex-post como métrica do histórico auditável.

## Evidências

- [doc] docs/regras/mercado-odds.md — regra completa (CLV, sharp vs soft, vieses, onde há valor).
