---
id: SIN-013
titulo: Sinal de escanteios (corners) como mercado/edge
modulo: sinais
status: investigado
prioridade: P2
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [DOS-001]
impacta: []
ancoras:
  tabelas: []
docs: [docs/investigacoes/sinal-escanteios.md, docs/regras/mercado-odds.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal de escanteios (corners) como mercado/edge

## Descrição

Candidato a sinal da camada **ESTIMAR** (mercado de escanteios — over/under e handicap de cantos). Apareceu repetidamente nas investigações como **nicho de EV subprecificado** (ver `docs/regras/mercado-odds.md`, `arbitragem.md`, `rivalidade.md`), mas nunca foi investigado como sinal/regra própria. Hipótese: escanteios são parcialmente previsíveis por estilo de jogo (posse, pressão, cruzamentos), força relativa, mando e árbitro, e o mercado de cantos é menos escrutinado que gols/1X2.

## Tarefas

- [x] dados — investigar previsibilidade de escanteios + fontes e onde o mercado erra → [investigação](../../investigacoes/sinal-escanteios.md)
- [ ] dados — backtest por-liga (HC/AC + odds do football-data.co.uk), validado contra CLV (SIN-012), antes de dar peso

## Recomendação (investigado, 2026-06-18)

**Candidato real da camada ESTIMAR, P2 — nicho menos eficiente que gols, mas com edge pequeno e frágil.** Escanteios são modeláveis (Poisson/negativa-binomial; compound Poisson p/ clustering) a partir de **chutes/volume ofensivo > posse**, força, mando e forma. Há ineficiência direcional (under de cantos subvalorizado na **PL**), MAS: edge ~0,8%/aposta, **não transfere entre ligas**, e parte já está na odd. **Só ganha peso após backtest por-liga validado contra CLV (SIN-012)** — proibido assumir que a ineficiência da PL vale no Brasileirão. Se confirmado, incluir na `docs/arquitetura/taxonomia-sinais.md`.

## Evidências

- [doc] [docs/investigacoes/sinal-escanteios.md](../../investigacoes/sinal-escanteios.md) — investigação completa (drivers, mercado, fragilidade, sourcing).
- [web] https://lup.lub.lu.se/student-papers/record/9127007 — tese de Lund: under de cantos na PL subvalorizado; lucro não transfere p/ Bundesliga.
- [web] https://arxiv.org/abs/2112.13001 — cantos via compound Poisson (clustering serial); usa odds de mercado como input.
