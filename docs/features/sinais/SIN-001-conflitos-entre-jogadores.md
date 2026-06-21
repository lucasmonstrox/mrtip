---
id: SIN-001
titulo: Sinal — conflitos entre jogadores
modulo: sinais
status: investigado
prioridade: P3
facetas:
  dados: investigado
  ia: investigado
testada: nao
testes: []
depende_de: [DOS-001]
impacta: []
ancoras:
  tabelas: []
docs: [docs/investigacoes/sinal-conflitos-entre-jogadores.md]
verificado_em: null
atualizado: 2026-06-18
---

# Sinal — conflitos entre jogadores

## Descrição

Sinal intangível para o dossiê: conflitos/atritos entre jogadores do mesmo elenco (brigas, panelinhas, rachas de vestiário) e seu efeito potencial no desempenho do time. Investigar se há evidência preditiva, como o mercado/clubes tratam isso, e viabilidade/legalidade de capturar o sinal.

**Veredito da investigação (2026-06-18): ADIAR.** Sinal real na ciência do esporte, mas fraco em profissionais (r≈0,19), endógeno (vencer gera coesão tanto quanto o contrário) e sem fonte observável limpa pré-jogo. Se entrar, só como flag qualitativa na camada EXPLICAR (LLM) — nunca como input do motor ESTIMAR. Detalhes em `docs/investigacoes/sinal-conflitos-entre-jogadores.md`.

## Tarefas

- [x] dados — investigar fonte e viabilidade do sinal (concluído: ver investigação; recomendação = adiar)

## Evidências

- [meta-análise] Carron et al. 2002 — relação coesão↔desempenho geral ES≈0,655 (46 estudos/164 ES); prova que o elo existe. https://journals.humankinetics.com/view/journals/jsep/24/2/article-p168.xml
- [meta-análise] Retrospectiva de 10 anos (2000–2010) — coesão-tarefa r≈0,45 vs social r≈0,11; **profissionais r=0,19 vs recreativos r=0,43**; prova que o sinal é fraco em elite. https://link.springer.com/article/10.1007/s11332-014-0188-7
- [meta-análise] Team-building 2024 (PMC) — efeito em profissionais 0,40 IC[−0,02;0,83] NÃO-significativo (efeito teto); reforça fraqueza em elite. https://pmc.ncbi.nlm.nih.gov/articles/PMC10978621/
- [primário] Carron & Ball 1982 + retrospectiva — causalidade bidirecional, predomínio desempenho→coesão; prova que o sinal é endógeno (consequência, não causa). https://www.researchgate.net/publication/263733534
- [provedores] StatsBomb / Stats Perform-Opta — nenhum vende métrica de moral/coesão; prova que o intangível não é comercialmente capturável. https://statsbomb.com/ · https://www.statsperform.com/
- [aposta] Sentimento Twitter PL ≈50% acurácia vs baseline odds 65,57%; prova que o proxy de redes é fraco e ruidoso. https://www.sciencedirect.com/science/article/abs/pii/S0167923616300835
- [legal] ANPD — raspagem de dados é tema prioritário (Mapa dez/2023); dado público exige base legal/finalidade; prova o risco LGPD do sourcing. https://www.grantthornton.com.br/insights/artigos-e-publicacoes/raspagem-de-dados-entenda-a-nova-prioridade-da-anpd-e-seus-efeitos/
