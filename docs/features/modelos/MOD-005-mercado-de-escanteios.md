---
id: MOD-005
titulo: Mercado de escanteios no prognóstico
modulo: modelos
status: ideia
prioridade: P2
facetas:
  dados: ideia # ler match_team_stats.corners (ingerido, hoje morto)
  ia: ideia # λ de escanteios + mercado corners no prompt/motor
  api: ideia # enum best_bet + campos general.corners
  ui: ideia # label de corners
testada: nao
testes: []
depende_de: [MOD-004]
impacta: []
ancoras:
  settings: []
  tabelas: [match_team_stats]
  tools: []
  funcoes: [marketProbs]
  rotas: []
docs:
  - docs/investigacoes/mercados-e-motor-prompt-prognostico.md
verificado_em: null
atualizado: 2026-07-01
---

# Mercado de escanteios no prognóstico

## Descrição

Abrir o mercado de **escanteios** (total, handicap, team corners) no prognóstico. O dado já é ingerido (`match_team_stats.corners`, `apps/api/src/db/schemas/leagues.ts:304`) mas **nunca é lido** pelo prompt. Segundo as investigações internas (`agente-selecao-melhor-mercado.md`, `predicao-...-estado-da-arte.md`), o edge real vive em escanteios/cartões/ligas ilíquidas — não no 1x2 de liga grande —, o que torna escanteios o mercado novo de **maior ROI**. Precisa de um λ de escanteios próprio (Poisson por mando, cruzando estilo ofensivo × defensivo), separado do grid de gols. Depende da plumbing de mercado da MOD-004 (enum, campos, label).

## Tarefas

- [ ] dados — ler `match_team_stats.corners` (média feita/sofrida por mando)
- [ ] ia — λ de escanteios (Poisson por mando) + linha de over/handicap
- [ ] api — enum `best_bet.market` += `corners` + `general.corners`
- [ ] ui — label de corners em `betLabel`

## Plano

_(gerado pelo `/pl` quando for planejada)_

## Evidências

- [código] `apps/api/src/db/schemas/leagues.ts:304` — `match_team_stats.corners` existe (type 34), ingerido, nunca lido pelo prompt.
- [doc] `docs/investigacoes/mercados-e-motor-prompt-prognostico.md` — escanteios = maior ROI entre os mercados novos; edge fora do 1x2 de liga grande.

## Verificação

_(preencher quando verificado)_
