---
id: SIN-017
titulo: Sinal — game-state e timing de gols
modulo: sinais
status: investigado # ideia | investigado | planejado | em-andamento | feito | verificado
prioridade: P2
facetas:
  dados: investigado # schema match_event minuto-a-minuto (dimensão do DOS-001); gate de cobertura BR
  ia: investigado # EXPLICAR é o destino (narrativa game-state/timing); λ(t) quant é posse do MOD-001; ESTIMAR live = backlog fora do MVP
testada: nao
testes: []
depende_de: [DOS-001, MOD-001] # eventos por minuto = ingestão DOS-001; λ(t)/game-state = motor MOD-001
impacta: [MOD-001, SIN-012] # encomenda λ(t) não-homogêneo ao motor; qualquer edge live valida vs CLV
ancoras:
  settings: []
  tabelas: [match_event] # proposta: eventos minuto-a-minuto (gols/cartões/subs + placar/homens-em-campo por evento)
  tools: []
  funcoes: []
  rotas: []
docs: [docs/investigacoes/game-state-timing-de-gols.md]
verificado_em: null
atualizado: 2026-06-21
---

# Sinal — game-state e timing de gols

## Descrição

Existe o mercado de parciais por tempo, mas falta o **driver comportamental**: time forte que abre o placar cedo "fecha o jogo" (→ under), expulsão muda a taxa de gols, jogo decidido vira festa ou pelada morna. **Quando** e **por que** os gols acontecem (distribuição temporal, dependência de game-state) alimenta O/U, parciais, gols no 2º tempo e mercados ao vivo. Blind spot atual.

## Tarefas

- [ ] dados — gate de viabilidade + schema `match_event` minuto-a-minuto (gols/cartões/subs, placar e homens-em-campo por evento) como dimensão do DOS-001; agregados pré-jogo (distribuição por janela, perfil λ(t) por liga). PL primeiro, BR fase 2.
- [ ] ia — EXPLICAR (entregável): dicionário de regras narrativas game-state/timing ancoradas no λ do motor (tag EXPLICATIVO-NÃO-PREDITIVO). Encomenda ao MOD-001 a spec de λ(t) não-homogêneo (λ₁/λ₂). Modificador de game-state no λ **live** = backlog fora do MVP (já precificado em segundos; validar vs CLV).

## Classificação (investigação)

- **ESTIMAR:** λ(t) não-homogêneo (forma da curva, λ₁/λ₂) — **mas é posse do MOD-001**, SIN-017 só especifica. Modificador de game-state no λ **live** = ESTIMAR fora do MVP (backlog).
- **EXPLICAR (destino principal):** score effect pré-jogo, efeito de expulsão, bursty/momentum, "0-0 ao HT + xG alto" — narrativa ancorada no número, peso ZERO no quant.
- **DESCARTAR como ESTIMAR autônomo pré-jogo:** endógeno (forte lidera/fecha; time atrás leva mais cartão) + já precificado.

## Evidências

- [doc] [docs/investigacoes/game-state-timing-de-gols.md](../../investigacoes/game-state-timing-de-gols.md) — investigação completa (matriz ESTIMAR/EXPLICAR + counter-review + schema + plano por faceta).
- [paper] https://arxiv.org/html/2501.18606v1 — Temporal dynamics of goal scoring (3.433 jogos): taxa não-homogênea, dip no início de cada metade, bursty same-team scoring → calibração de λ(t), não edge.
- [paper] https://arxiv.org/pdf/2508.04008 — minuto-a-minuto: goal-differential como modificador de contexto da geração de chances (líder suprime, perdedor gera mais; Serie A mais íngreme).
- [paper] https://link.springer.com/article/10.1007/s00181-017-1287-5 — red card WC 1998-2014 (320 jogos): não-sancionado +124%, sancionado −47%; timing importa (virada ~intervalo); **endogeneidade**: time atrás leva ~75% mais vermelho por gol de desvantagem.
- [paper] https://www.degruyter.com/document/doi/10.2202/1559-0410.1146/html — Vecer: intensidade via odds live; ponto de virada ~intervalo; assimetria forte×fraco.
- [paper] https://pubmed.ncbi.nlm.nih.gov/22856388/ — Lago-Ballesteros & Lago-Peñas: prob. de score-box cai 43%/53% empatando/liderando vs perdendo (score effects).
- [paper] https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1197039/full — estilo de jogo quase não move gols reais (p=0,14) → reforça EXPLICAR, não ESTIMAR.
