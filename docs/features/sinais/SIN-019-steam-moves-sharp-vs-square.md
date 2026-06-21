---
id: SIN-019
titulo: Sinal — steam moves e origem da linha (sharp vs square)
modulo: sinais
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [SIN-012, DOS-001]
impacta: [SIN-012, MOD-001]
ancoras:
  settings: []
  tabelas: [match_odds]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/steam-moves-sharp-vs-square.md]
verificado_em: null
atualizado: 2026-06-21
---

# Sinal — steam moves e origem da linha (sharp vs square)

## Descrição

Microestrutura do mercado por trás do SIN-012: **de onde nasce a linha** (originating books como Pinnacle/Circa), o que é um **steam move** (movimento sincronizado de dinheiro sharp), e a distinção **sharp books × square/recreational books**. Define *quando* a closing line e a CLV do SIN-012 são confiáveis como âncora — e quando um movimento de odds é informação real vs ruído de dinheiro recreativo.

## Tarefas

- [ ] dados — quais casas originam linha, detecção de steam, fontes de movimento de odds e timing.
- [ ] ia — como o motor pondera o movimento de odds segundo a origem (sharp vs square); anti-ruído.

## Evidências

- [doc] [docs/investigacoes/steam-moves-sharp-vs-square.md](../../investigacoes/steam-moves-sharp-vs-square.md) — investigação completa (originating books, steam, RLM, feeds BR, modelo de dados, classificação VALIDAR).
- [classificação] **VALIDAR** — não vira sinal próprio da camada ESTIMAR; é **regra de qualidade do movimento de odds dentro do SIN-012** (taxonomia de confiança: origem × sincronização × velocidade × contra-público). Reforça a âncora CLV.
- [originating books] Market makers que originam a linha: **Pinnacle** (global/futebol), **BetCRIS/Circa** (US hoje), **exchanges/Betfair** (lideram price discovery) — margem baixa, limites altos, aceitam sharps. As demais (e a maioria das casas BR) são **square/price-takers** [`verificado-fetch` Unabated; busca acadêmica de exchange].
- [steam] Movimento rápido + **sincronizado** em várias casas, origem no market maker. Buchdahl (4.069 jogos EPL): heavy steamers +6,74% pré-close (p=0,00002), **edge some no fechamento** → confirma a direção da closing, mas chasing tardio não paga [`verificado-fetch` Sports Trading Network].
- [RLM] Linha contra a maioria das apostas = sinal sharp, **mas estratégia isolada não é lucrativa** (Springer 2019; arXiv 2306.01740) e exige **handle split** que nenhum feed BR expõe [`verificado-fetch`]. O "~90% é ruído" de mercado-odds.md é heurística sem fonte rigorosa (REFUTADO como estatística).
- [risco BR nº1] O sinal sharp **não vive nas .bet.br** (entidades BR separadas desde 01/01/2025); **The Odds API não cobre .bet.br** (us/uk/eu/fr/se/au). Steam **nas casas BR** só via aggregador pago sales-gated (OpticOdds/Betstamp — Betano/Superbet confirmados), OddsPapi free-tier não-comprovado, ou scraping (ToS). Pinnacle direto fechou 23/07/2025 [`verificado-fetch`/`snippet`].
- [esquema] Herda CORE-001: `match_odds.odds_decimal NUMERIC(6,3)` (não `odds_cents`) + `implied_prob` vig-free; SIN-019 adiciona `bookmaker_class` (sharp/exchange/square) e `captured_at` (América/Sao_Paulo). Steam = série temporal de snapshots.
