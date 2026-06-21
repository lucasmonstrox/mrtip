---
id: SIN-002
titulo: Sinal — interesses de patrocinadores do jogador
modulo: sinais
status: investigado
prioridade: P3
facetas:
  dados: ideia
  ia: ideia
testada: nao
testes: []
depende_de: [DOS-001]
impacta: []
ancoras:
  tabelas: []
docs: [docs/investigacoes/sinal-interesses-patrocinadores-jogador.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal — interesses de patrocinadores do jogador

## Descrição

Sinal intangível: interesses comerciais/patrocínio de um jogador (contratos, bônus por desempenho/aparição, vitrine para transferência, jogo contra ex-clube/mercado-alvo) que podem afetar motivação e desempenho. Investigar evidência, como isso é observável externamente, e viabilidade.

## Tarefas

- [x] dados — investigar fonte e viabilidade do sinal → ver [investigação](../../investigacoes/sinal-interesses-patrocinadores-jogador.md). Veredito: **adiar** (efeito fraco/nulo no agregado de futebol; parte preditiva não capturável).

## Evidências

- [web] https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0211058 — Gómez et al. (2019), 4 grandes ligas EU (inclui Premier League): **sem efeito claro** de contract-year no futebol de elite; efeitos só em jogadores periféricos.
- [web] https://sabr.org/journal/article/do-hitters-boost-their-performance-during-their-contract-years/ — O'Neill: MLB **+6,7% adjusted-OPS** no ano de contrato, **mas só via efeitos fixos** (OLS não acha) — efeito tênue mesmo onde existe.
- [web] https://ideas.repec.org/a/jsf/intjsf/v6y2011i2p87-118.html — Frick (2011), Bundesliga: desempenho **sobe** e variância cai no último ano de contrato (moral hazard) — suporte moderado no futebol alemão.
- [web] https://phys.org/news/2022-07-professional-athletes-clubs.html — Assanskiy et al. (2022), NBA/NHL/6 ligas EU: contra ex-clube **tenta mais (mais finalizações) mas não acerta mais** (precisão inalterada); efeito condicional a tempo de casa/circunstância de saída.
- [web] https://en.wikipedia.org/wiki/Contract_year_phenomenon — White & Sheldon (2013), NBA: PER sobe no ano do contrato e **cai abaixo do baseline no ano seguinte** (padrão de "undermining").
- [web] https://docs.sportmonks.com/football/endpoints-and-entities/endpoints/transfers — SportMonks (espinha de dados, DOS-001) tem `transfers`/`pendingTransfers`/`transfer-rumours` → "vs ex-clube" é **derivável de graça**; data de expiração de contrato **não confirmada** (depende de Transfermarkt).
