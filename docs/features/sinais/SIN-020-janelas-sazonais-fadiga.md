---
id: SIN-020
titulo: Sinal — janelas sazonais de fadiga (festas, pré-temporada, reta final, parões)
modulo: sinais
status: investigado
prioridade: P3
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: []
impacta: [DOS-001, MOD-001, SIN-011]
ancoras:
  settings: []
  tabelas: [match, lineup_player, injury]
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/janelas-sazonais-fadiga.md]
verificado_em: null
atualizado: 2026-06-28
---

# Sinal — janelas sazonais de fadiga (festas, pré-temporada, reta final, parões)

## Descrição

Eixo MACRO-sazonal da fadiga: quais janelas do ano acumulam fadiga (volta de férias/pré-temporada, período de festas/Boxing Day, reta final, pós-parão internacional) e como isso aparece. Veredito da investigação: o sinal robusto **não** é "time cansado faz menos gol" (nulo na evidência), e sim **lesão/disponibilidade** disparando em clusters de calendário, sobretudo no inverno inglês (festas + ausência de winter break). Direção apostável = mais desfalques (alimenta SIN-011), não over/under direto. Complementa SIN-008 (eixo MICRO por-jogo) sem re-litigá-lo.

## Tarefas

- [ ] dados — ingerir N temporadas da PL (bloqueador); materializar `days_rest` + `season_phase` (deriváveis de `match.date`/`round`); soma rolante de `minutesPlayed`.
- [ ] ia — risco de desfalque sazonal (→ SIN-011) + nota de contexto da fase no dossiê; peso baixo, nunca driver de placar.

## Evidências

- [doc] docs/investigacoes/janelas-sazonais-fadiga.md — investigação completa: matriz de usos, refutações e lacunas.
- [web] https://pubmed.ncbi.nlm.nih.gov/30442720/ — sem winter break = +303 player-days e +2,1 lesões graves/temporada, pior jan-mar (âncora do inverno inglês).
- [web] https://pmc.ncbi.nlm.nih.gov/articles/PMC7846542/ — meta-análise: congestionamento sem efeito em distância/técnica → mata o "under por fadiga".
- [web] https://pmc.ncbi.nlm.nih.gov/articles/PMC12244382/ — fadiga subjetiva não acumula monotonicamente na EPL → mata o "time cansado no fim".
- [web] https://pmc.ncbi.nlm.nih.gov/articles/PMC9758680/ — revisão: congestionamento eleva lesão em jogo (5/8), afastamento mais curto.
- [código] apps/api/src/db/schemas/leagues.ts:5 — só 1 temporada sincronizada (bloqueador de backtest sazonal).
