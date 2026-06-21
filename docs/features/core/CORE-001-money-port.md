---
id: CORE-001
titulo: Porta de dinheiro (@workspace/core/money)
modulo: core
status: investigado
prioridade: P2
facetas:
  dados: investigado
testada: nao
testes: []
depende_de: []
impacta: [DOS-001, MOD-001, AGT-001]
ancoras:
  funcoes: [formatBRL, reaisParaCents, centsParaReais, centsParaReaisStr]
docs: [docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md]
verificado_em: null
atualizado: 2026-06-18
---

# Porta de dinheiro (@workspace/core/money)

## Descrição

Porta única de dinheiro mandada pelo CLAUDE.md: `packages/core` expondo `@workspace/core/money` (`formatBRL`, `reaisParaCents`, `centsParaReais`, `centsParaReaisStr`) sobre `currency.js`. Valor canônico = centavos (int); conversão e arredondamento só na borda. Para **dinheiro** (stake, payout, assinatura, banca) — **não para odds nem probabilidade**.

**Investigado (2026-06-18):** três tipos distintos, três representações — dinheiro (centavos-int, esta porta), **odds (decimal como `NUMERIC(6,3)` — precedente SportMonks; módulo `@workspace/core/odds` separado, NÃO `odds_cents` nem int escalado)**, probabilidade/EV (float64, alta precisão, sem arredondar no meio). currency.js se sustenta (porta abstrai a lib; canônico não passa pelo bug de `fromCents`), com dinero.js v2 como candidato de reavaliação se precisar de `allocate`/rateio. Arredondamento de dinheiro: `floor` p/ stake/payout (conservador + breakage), half-even p/ totais, **nunca `Math.round`**. Detalhes: [investigação](../../investigacoes/porta-de-dinheiro-odds-e-arredondamento.md).

## Tarefas

- [ ] dados — criar packages/core com a porta **money** (currency.js, centavos-int) + testes (teste primeiro)
- [ ] dados — módulo **odds** separado: conversões decimal↔frac↔americana↔probabilidade + devig (Power/Shin) + testes

## Evidências

- [doc] [docs/investigacoes/porta-de-dinheiro-odds-e-arredondamento.md](../../investigacoes/porta-de-dinheiro-odds-e-arredondamento.md) — libs de dinheiro, representação de odds, arredondamento, fronteira dinheiro×odds×prob.
- [web] github.com/scurker/currency.js (issues) — pouco mantido (sem fix de lógica desde 2023), sem `allocate` → porta abstrai o risco.
- [web] sarahdayan.com/blog/dinerojs-v2-is-out — dinero.js v2 estável (mar/2026), inteiros nativos + allocate → candidato de reavaliação.
- [web] the-odds-api.com/sports-odds-data/odds-format.html — odd decimal é storage, probabilidade é cálculo → odds não usam a porta de dinheiro nem "cents".
- [web] en.wikipedia.org/wiki/IEEE_754 + MDN Math.round — half-even vs half-up; float64 basta p/ prob/EV; `Math.round` proibido p/ dinheiro.
